import { Button } from 'antd';
import cls from 'classnames';
import './index.scss';
import { useSafeState } from 'ahooks';

const ContentOverflow: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [toggleHiddenStyle, setToggleHiddenStyle] = useSafeState(true);
  return (
    <div>
      <span
        className={cls({
          'text-overflow': toggleHiddenStyle,
        })}
      >
        {children}
      </span>
      {
        <Button
          className="toggle-hidden-btn"
          onClick={() => {
            setToggleHiddenStyle((v) => !v);
          }}
          type="link"
        >
          {toggleHiddenStyle ? '展开' : '收起'}
        </Button>
      }
    </div>
  );
};

export default ContentOverflow;
