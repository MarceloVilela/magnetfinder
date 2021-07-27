import React, { useEffect, useMemo, useState, FormEvent, useCallback } from 'react'
import { FaMagnet, FaLink } from 'react-icons/fa';

import './style.css'
import api from '../../services/api';
//import data from '../../assets/results.json';
import alias from '../../assets/egineAlias.json';

export interface ResultData {
  link: string;
  name: string;
  size: string;
  seeds: number;
  leech: number;
  engine_url: string;
  desc_link: string;
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

export default function Main() {
  //const enginesAlias = ['pirateproxy', 'torlock', 'limetor'];
  const enginesAlias = alias;
  const [enginesPending, setEnginesPending] = useState<string[]>([]);

  // request
  const [search_query, setSearchQuery] = useState('');
  const [result, setResult] = useState<Result>({} as Result);

  // local filtering
  const [filter, setFilter] = useState('');
  const [order, setOrder] = useState('seeds');
  const [orderDirection, setOrderDirection] = useState('desc');

  useEffect(() => {
    //setDocs(data as ResultData[]);
    const wakeUp = () => {
      try {
        api.get('/tech-source/channels/br')
      } catch (error) {
        console.log('error on wake up');
      }
    };
    wakeUp();
  }, [])

  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();
    setResult({} as Result);
    setEnginesPending(enginesAlias);

    enginesAlias.forEach(alias => {
      const aliasEncoded = btoa(alias);
      const searchQueryEncoded = btoa(search_query);
      const requestConfig = { params: { url: aliasEncoded, search_query: searchQueryEncoded, encoded: 'true' } };
      api.get('magnet-source/search', requestConfig)
        .then(({ data }) => {
          setResult(Object.assign(result, { [alias]: data }));
          setEnginesPending(enginesPending.filter(item => item !== alias));
        })
        .catch(error => console.log(`Erro ao buscar na engine: ${alias}`, error));
    })
  }, [enginesAlias, enginesPending, search_query, result]);

  const [docs] = useMemo(() => {
    const arr = [] as ResultData[];
    Object.keys(result).forEach(key => arr.push(...result[key]));
    return [arr, enginesPending.length > 0];
  }, [result, enginesPending])

  const filteredItens = useMemo(() => {
    return docs.filter(item => item.name.toLocaleLowerCase().includes(filter));
  }, [docs, filter]);

  const orderedItens = useMemo(() => {
    const itens = filteredItens.sort(function (a, b) {
      return a.seeds - b.seeds;
    });
    return orderDirection === 'desc' ? itens.reverse() : itens;
  }, [filteredItens, orderDirection]);

  const handleOrder = (prop: string) => {
    if (order === prop) {
      setOrderDirection(orderDirection === 'desc' ? 'asc' : 'desc');
      return;
    }
    setOrder(prop);
  }

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={search_query}
          onChange={e => setSearchQuery(e.target.value.toLocaleLowerCase())}
          placeholder="Digite a busca"
        />
        <input type="submit" value="Buscar" />
      </form>

      <form id="filter-results">
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value.toLocaleLowerCase())}
          placeholder="Filtrar resultados da busca"
        />
        <p>Resultados (exibindo {filteredItens.length} de {docs.length})</p>
      </form>

      {enginesPending.length > 0 && (
        <p>{enginesPending.join(', ')}</p>
      )}

      <table>
        <thead>
          <tr>
            <td onClick={() => handleOrder('name')}>Nome</td>
            <td onClick={() => handleOrder('size')}>Tamanho</td>
            <td onClick={() => handleOrder('seeds')}>Seeds</td>
            <td onClick={() => handleOrder('leech')}>Leech</td>
            <td onClick={() => handleOrder('engine_url')}>Mecanismo de busca</td>
          </tr>
        </thead>
        <tbody>
          {orderedItens.map((item, key) => (
            <tr key={key}>
              <td>
                {item.link ? (
                  <>
                    <a href={item.link}>{item.name} <FaMagnet /></a>
                    <a href={`/post?url=${item.desc_link}`} target="_blank" rel="noopener noreferrer"><FaLink /></a>
                  </>
                ) : (
                  <a href={`/post?url=${item.desc_link}`} target="_blank" rel="noopener noreferrer">{item.name} <FaLink /></a>
                )}
              </td>
              <td>{item.size || '---'}</td>
              <td>{item.seeds || '---'}</td>
              <td>{item.leech || '---'}</td>
              <td>{item.engine_url || '---'}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </main>
  )
}