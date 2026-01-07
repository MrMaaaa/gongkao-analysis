import { Link } from 'react-router-dom';
import cls from 'classnames';
import './index.scss';

const linkList = [
  {
    name: '省考-河南-2026-报考岗位选择',
    to: '/sk/post/select/henan/2026',
    actived: true,
  },
  {
    name: '国考-2025-报考岗位选择',
    to: '/gk/post/select/2025',
  },
  {
    name: '省考-洛阳-历年数据分析',
    to: '/shengkao-luoyang',
  },
  {
    name: '省考-洛阳-2024-成绩分析',
    to: '/sk/score/analysis/luoyang/2024',
  },
  {
    name: '省考-洛阳-2023-成绩分析',
    to: '/sk/score/analysis/luoyang/2023',
  },
  {
    name: '省考-洛阳-2022-成绩分析',
    to: '/sk/score/analysis/luoyang/2022',
  },
  {
    name: '省考-郑州-2024-成绩分析',
    to: '/sk/score/analysis/zhengzhou/2024',
  },
];

function Home() {
  return (
    <div className="home-wrapper">
      <div className="home">
        {linkList.map((link) => (
          <Link
            key={link.name}
            className={cls({
              link: true,
              'link-actived': link.actived,
            })}
            to={link.to}
          >
            {link.name}
          </Link>
        ))}
      </div>
      <div className="contact-me">
        &copy; develop by 马腾飞(秋筠)
        {/* <a href="mailto:tenfyma@foxmail.com">有问题要反馈？点此给我发邮件</a> */}
      </div>
    </div>
  );
}

export default Home;
