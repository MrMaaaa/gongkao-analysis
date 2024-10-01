import { useEffect, useRef } from 'react';
import { Button } from 'antd';
import cls from 'classnames';
import './index.scss';
import { useSafeState } from 'ahooks';

const TextOverflow: React.FC<{
  text: string;
}> = ({ text }) => {
  const textRef = useRef<HTMLDivElement | null>(null);
  const [withHiddenStyle, setWithHiddenStyle] = useSafeState(false);
  const [toggleHiddenStyle, setToggleHiddenStyle] = useSafeState(false);
  useEffect(() => {
    if (!!text && textRef.current) {
      if (textRef.current.getBoundingClientRect().height > 60) {
        setWithHiddenStyle(true);
        setToggleHiddenStyle(true);
      }
    }
  }, [text]);
  return (
    <div ref={textRef}>
      <span
        className={cls({
          'text-overflow': toggleHiddenStyle,
        })}
      >
        {text}
      </span>
      {withHiddenStyle && (
        <Button
          className="toggle-hidden-btn"
          onClick={() => {
            setToggleHiddenStyle((v) => !v);
          }}
          type="link"
        >
          {toggleHiddenStyle ? '展开' : '收起'}
        </Button>
      )}
    </div>
  );
};

export default TextOverflow;
