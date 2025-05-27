import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import reportWebVitals from './reportWebVitals';
import 'typeface-press-start-2p';

function getLibrary(provider) {
  return new Web3Provider(provider);
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// Если вы хотите начать измерять производительность в своем приложении, передайте функцию
// для записи результатов (например: reportWebVitals(console.log))
// или отправки результатов на сервер для анализа (например: reportWebVitals(sendToAnalytics))
// в качестве аргумента. Это отключит его.
// reportWebVitals();