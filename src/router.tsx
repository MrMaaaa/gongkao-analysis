import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/home';
import Skhngw2024 from '@/pages/shengkao-gangwei-henan-2024';
import Skly from '@/pages/shengkao-luoyang';
import SHCityScoreAnalysisYear from '@/pages/shengkao-city-score-analysis-year';
import TestPage from '@/pages/test';
import NotFound from './pages/home/404';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/shengkao-luoyang" element={<Skly />}></Route>
        <Route
          path="/sk/score/analysis/:city/:year"
          element={<SHCityScoreAnalysisYear />}
        />
        <Route
          path="/shengkao-gangwei-henan-2024"
          element={<Skhngw2024 />}
        ></Route>
        <Route path="/test" element={<TestPage />}></Route>
        <Route path="/*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
