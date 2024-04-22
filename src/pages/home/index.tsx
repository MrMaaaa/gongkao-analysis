import { Link } from 'react-router-dom';
import SubjectPicker from '@/components/major-picker';
import './index.scss';

function Home() {
  return (
    <div className="home">
      <Link to={'/shengkao-henan-2024'}>省考-洛阳-2024</Link>
      <Link to={'/shengkao-henan-2023'}>省考-洛阳-2023</Link>
      <Link to={'/shengkao-henan-2022'}>省考-洛阳-2022</Link>
      <SubjectPicker />
    </div>
  );
}

export default Home;
