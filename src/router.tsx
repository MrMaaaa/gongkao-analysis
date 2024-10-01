import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/home';
import ShengkaoPostSelect from '@/pages/shengkao-city-post-select';
import Skly from '@/pages/shengkao-luoyang';
import SHCityScoreAnalysisYear from '@/pages/shengkao-city-score-analysis-year';
import SHPostDetail from '@/pages/shengkao-post-detail';
import TestPage from '@/pages/test';
import NotFound from '@/pages/404';

const Router = () => {
  return (
    <BrowserRouter basename="/gongkao-analysis">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/shengkao-luoyang" element={<Skly />}></Route>
        <Route
          path="/sk/score/analysis/:city/:year"
          element={<SHCityScoreAnalysisYear />}
        />
        <Route
          path="/sk/post/select/:province/:year"
          element={<ShengkaoPostSelect />}
        ></Route>
        <Route
          path="/sk/post/detail/:province/:year"
          element={<SHPostDetail />}
        ></Route>
        <Route path="/test" element={<TestPage />}></Route>
        <Route path="/*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
