import { Link } from 'react-router-dom';
import './index.scss';

function Home() {
  return (
    <div className="home">
      <Link to={'/shengkao-luoyang-2024'}>省考-洛阳-2024</Link>
      <Link to={'/shengkao-luoyang-2023'}>省考-洛阳-2023</Link>
      <Link to={'/shengkao-luoyang-2022'}>省考-洛阳-2022</Link>
      <Link to={'/shengkao-luoyang'}>省考-洛阳-数据分析</Link>
      <Link to={'/shengkao-gangwei-henan-2024'}>省考-河南-岗位分析</Link>
    </div>
  );
}

export default Home;
