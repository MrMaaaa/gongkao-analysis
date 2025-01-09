import React from 'react';
import ReactDOM from 'react-dom/client';
import { useSafeState } from 'ahooks';
import { ConfigProvider, Layout } from 'antd';
import zhcn from 'antd/locale/zh_CN';
import { ThemeConfig } from 'antd/lib';
import reportWebVitals from './reportWebVitals';
import Router from './router';
import GlobalSettings from './components/global-settings';
import './index.scss';

const App: React.FC = () => {
  const [themeData, setTheme] = useSafeState({
  } as ThemeConfig);
  return (
    <ConfigProvider locale={zhcn} theme={themeData}>
      <Layout>
        <Router />
        <GlobalSettings setTheme={setTheme} />
      </Layout>
    </ConfigProvider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
