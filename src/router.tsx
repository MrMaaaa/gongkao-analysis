import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/home';
import Skly2024 from '@/pages/shengkao-luoyang-2024';
import Skly2023 from '@/pages/shengkao-luoyang-2023';
import Skly2022 from '@/pages/shengkao-luoyang-2022';
import Skly from '@/pages/shengkao-luoyang-2022';
import TestPage from '@/pages/test';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/shengkao-luoyang-2024" element={<Skly2024 />}></Route>
        <Route path="/shengkao-luoyang-2023" element={<Skly2023 />}></Route>
        <Route path="/shengkao-luoyang-2022" element={<Skly2022 />}></Route>
        <Route path="/shengkao-luoyang" element={<Skly />}></Route>
        <Route path="/test" element={<TestPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
