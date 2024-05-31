import { Link } from 'react-router-dom';
import './index.scss';

const NotFound:React.FC = () => {
  return (
    <div className="not-found">
      <div className="not-found__title">页面不存在</div>
      <Link to="/">返回首页</Link>
    </div>
  );
};

export default NotFound;
