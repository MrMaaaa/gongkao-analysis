import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/home';
import ShengkaoPostSelect from '@/pages/shengkao-city-post-select';
import GuokaoPostSelect from '@/pages/guokao-post-select';
import Skly from '@/pages/shengkao-luoyang';
import SHCityScoreAnalysisYear from '@/pages/shengkao-city-score-analysis';
import SHPostDetail from '@/pages/shengkao-post-detail';
import TestPage from '@/pages/test';
import NotFound from '@/pages/404';

const Router = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shengkao-luoyang" element={<Skly />} />
        <Route
          path="/sk/score/analysis/:city/:year"
          element={<SHCityScoreAnalysisYear />}
        />
        <Route
          path="/sk/post/select/:province/:year"
          element={<ShengkaoPostSelect />}
        />
        <Route path="gk/post/select/:year" element={<GuokaoPostSelect />} />
        <Route
          path="/sk/post/detail/:province/:year"
          element={<SHPostDetail />}
        />
        <Route path="/test" element={<TestPage />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
};

export default Router;
