import React, { useEffect, useState } from 'react'
import { FaMagnet, FaLink, FaArrowLeft } from 'react-icons/fa';
import { useLocation } from 'react-router';

import './style.css'
import api from '../../services/api';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import { Link } from 'react-router-dom';
//import placeholder from '../../assets/detail.json';

interface LinkData {
  url: string;
  text: string;
  type: string;
}

export interface DetailData {
  links: LinkData[];
  name: string;
  thumb: string;
  engine_url: string;
  desc_link: string;
}

export default function Post() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<DetailData>({} as DetailData);

  useEffect(() => {
    //setDetail(placeholder);
    //setLoading(false);

    const queryParams = new URLSearchParams(location.search);
    const url = queryParams.get('url');

    const encoded = process.env.REACT_APP_ENCODED;
    const urlEncoded = encoded === 'true' ? btoa(String(url)) : url;
    const requestConfig = { params: { url: urlEncoded, encoded } };

    const requestDetail = async () => {
      try {
        const { data } = await api.get('/magnet-source/detail', requestConfig);
        setDetail(data);
      } catch (error) {
        toast.error(`Erro ao buscar dados da postagem: ${url}`);
      } finally {
        setLoading(false);
      }
    };

    requestDetail();
  }, [location.search]);

  return (
    <main id="post">
      {(!loading && detail.links) ? (
        <article>
          <aside>
            <img src={detail.thumb} alt={'Thumb'} />
          </aside>

          <section>
            <h2>{detail.name}</h2>

            <div>
              {detail.links.map(({ url, text, type }, key) => (
                <a href={url} key={key}>
                  {type === 'magnet' && <div style={{ background: '#0d6efd' }}><FaMagnet /></div>}
                  {type !== 'magnet' && <div style={{ background: '#6c757d' }}><FaLink /></div>}
                  <p>{text}</p>
                </a>
              ))}
            </div>
          </section>
        </article>
      ) : <Loading />}

      <Link to="/" className="circle-button">
        <FaArrowLeft />
      </Link>

    </main>
  )
}