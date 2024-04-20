import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/home';
import Skhn2024 from '@/pages/shengkao-henan-2024';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/shengkao-henan-2024" element={<Skhn2024 />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
