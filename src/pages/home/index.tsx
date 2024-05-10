import { Link } from 'react-router-dom';
import './index.scss';

function Home() {
  return (
    <div className="home">
      <Link to={'/sk/score/analysis/luoyang/2024'}>省考-洛阳-2024</Link>
      <Link to={'/sk/score/analysis/luoyang/2023'}>省考-洛阳-2023</Link>
      <Link to={'/sk/score/analysis/luoyang/2022'}>省考-洛阳-2022</Link>
      <Link to={'/sk/score/analysis/zhengzhou/2024'}>省考-郑州-2024</Link>
      <Link to={'/shengkao-luoyang'}>省考-洛阳-历年数据分析</Link>
      <Link to={'/shengkao-gangwei-henan-2024'}>省考-河南-报考岗位选择</Link>
    </div>
  );
}

export default Home;
