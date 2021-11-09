import React, { useEffect, useState } from 'react';
import { FaHome, FaTh, FaAlignJustify } from 'react-icons/fa';

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

import './style.scss'
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export interface ResultData {
  link: string;
  name: string;
  size: string;
  seeds: number;
  leech: number;
  engine_url: string;
  desc_link: string;

  thumb: string;
}

export interface DetailData {
  links: string[];
  name: string;
  thumb: string;
  engine_url: string;
  desc_link: string;
}

interface Result {
  [key: string]: ResultData[];
}

export default function Trend() {
  const enginesAlias = ["comandotorrent", "megatorrentshd", "ondebaixa"];
  const [enginesPending, setEnginesPending] = useState<string[]>([]);
  const [result, setResult] = useState<Result>({} as Result);

  const [renderMode, setRenderMode] = useState('grid');

  useEffect(() => {
    enginesAlias.forEach(alias => {

      const load = async (alias: string) => {
        if (result[alias]) {
          return;
        }

        const cache = localStorage.getItem(`@trend/${alias}`);
        const cacheDate = localStorage.getItem(`@trend_date/${alias}`);

        if (cache && cacheDate) {
          const diff = Number(new Date()) - Number(new Date(cacheDate));
          if (diff < 60 * 1000) {
            const data = JSON.parse(cache);

            console.log(`cache ${alias}`);
            setResult({ ...result, [alias]: data.top });
            setEnginesPending(enginesPending.filter(item => item !== alias));

            return;
          }
        }

        console.log(`fetch ${alias}`);
        const { data } = await api.get<Result>(`/magnet-source/trend`, { params: { url: alias } });

        localStorage.setItem(`@trend/${alias}`, JSON.stringify(data));
        localStorage.setItem(`@trend_date/${alias}`, new Date().toJSON());

        setResult({ ...result, [alias]: data.top });
        setEnginesPending(enginesPending.filter(item => item !== alias));
      };

      try {
        console.log(`loading ${alias}`);
        load(alias);
      } catch (error) {
        toast.error(`Erro ao listar trend: ${alias}`)
        console.log(error);
      }
    })
  }, [result, enginesAlias, enginesPending])

  return (
    <main id={renderMode === "horizontal" ? "horizontal" : "grid"} className="page-trend">

      <Link to="/" className="circle-button"><FaHome /></Link>

      <div className="actions">
        <FaTh onClick={() => setRenderMode('grid')} />
        <FaAlignJustify onClick={() => setRenderMode('horizontal')} />
      </div>

      {Object.keys(result).length && Object.keys(result).map((resultAlias, key) => (
        <div key={key} className="results-wrapper">
          <h3>{renderMode} | {resultAlias}</h3>
          {renderMode === "horizontal"
            ? (
              <Swiper
                spaceBetween={10}
                slidesPerView={10}
                slidesPerGroup={2}
                scrollbar={{ draggable: true }}
              >
                {result[resultAlias].map((item, key) => (
                  <SwiperSlide key={key}>
                    <a
                      href={`/post?url=${item.desc_link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        /*src='https://img.ibxk.com.br/2015/07/23/23170425700729.jpg?w=704'*/
                        src={item.thumb}
                        alt={`Cover ${item.name}`}
                      />
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <ul>
                {result[resultAlias].map((item, key) => (
                  <li key={key}>
                    <a
                      href={`/post?url=${item.desc_link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        /*src='https://img.ibxk.com.br/2015/07/23/23170425700729.jpg?w=704'*/
                        src={item.thumb}
                        alt={`Cover ${item.name}`}
                      />
                      <p>{item.name}</p>
                    </a>
                  </li>
                ))}
              </ul>
            )
          }

        </div>
      ))}

      {/*<pre>{JSON.stringify(result, null, 2)}</pre>*/}

    </main >
  )

}