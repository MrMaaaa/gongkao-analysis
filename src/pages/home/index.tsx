import { Link } from 'react-router-dom';
import './index.scss';

function Home() {
  return (
    <div className="home-wrapper">
      <div className="home">
        <Link
          className="link link-actived"
          to={'/sk/post/select/henan/2025'}
        >
          省考-河南-2025-报考岗位选择
        </Link>
        <Link className="link" to={'/gk/post/select/2025'}>
          国考-2025-报考岗位选择
        </Link>
        <Link className="link" to={'/shengkao-luoyang'}>
          省考-洛阳-历年数据分析
        </Link>
        <Link className="link" to={'/sk/score/analysis/luoyang/2024'}>
          省考-洛阳-2024-成绩分析
        </Link>
        <Link className="link" to={'/sk/score/analysis/luoyang/2023'}>
          省考-洛阳-2023-成绩分析
        </Link>
        <Link className="link" to={'/sk/score/analysis/luoyang/2022'}>
          省考-洛阳-2022-成绩分析
        </Link>
        <Link className="link" to={'/sk/score/analysis/zhengzhou/2024'}>
          省考-郑州-2024-成绩分析
        </Link>
      </div>
      <div className="contact-me">
        &copy; develop by 马腾飞(秋筠)
        {/* <a href="mailto:tenfyma@foxmail.com">有问题要反馈？点此给我发邮件</a> */}
      </div>
    </div>
  );
}

export default Home;
