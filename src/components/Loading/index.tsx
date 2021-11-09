import React from 'react';
import loadImg from '../../assets/load.gif'
import './styles.scss'

export default function Loading() {
  return (
    <div className="loading">
      <img
        src={loadImg}
        alt="Load indicator"
        className="loadingImg"
      />
    </div>
  );

  /*
  return (
    <svg className="spinner" viewBox="0 0 50 50">
      <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
    </svg>
  );
  */
}