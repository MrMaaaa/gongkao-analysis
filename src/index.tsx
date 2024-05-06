import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, theme } from 'antd';
import zhcn from 'antd/locale/zh_CN';
import reportWebVitals from './reportWebVitals';
import Router from './router';
import './index.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhcn}
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Router />
    </ConfigProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
