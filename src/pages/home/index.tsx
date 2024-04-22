import { Link } from 'react-router-dom';
import SubjectPicker from '@/components/major-picker';
import './index.scss';

function App() {
  return (
    <div className="App">
      <Link to={'/shengkao-henan-2024'}>省考-洛阳-2024</Link>
      <Link to={'/shengkao-henan-2023'}>省考-洛阳-2023</Link>
      <SubjectPicker />
    </div>
  );
}

export default App;
