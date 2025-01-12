import { useEffect, useRef } from 'react';
import { Button } from 'antd';
import cls from 'classnames';
import './index.scss';
import { useSafeState } from 'ahooks';

const TextOverflow: React.FC<{
  text: string | React.ReactNode;
}> = ({ text }) => {
  const textRef = useRef<HTMLDivElement | null>(null);
  const [withHiddenStyle, setWithHiddenStyle] = useSafeState(false);
  const [toggleHiddenStyle, setToggleHiddenStyle] = useSafeState(false);
  useEffect(() => {
    if (!!text && typeof text === 'string') {
      if (textRef.current && textRef.current.getBoundingClientRect().height > 60) {
        setWithHiddenStyle(true);
        setToggleHiddenStyle(true);
      }
    } else {
      setWithHiddenStyle(true);
      setToggleHiddenStyle(true);
    }
  }, [text]);
  return (
    <div className="text-overflow-wrapper">
      <div
        className={cls({
          'text-overflow': true,
          'text-overflow-cancel': !toggleHiddenStyle,
        })}
        ref={textRef}
      >
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
        {text}
      </div>
    </div>
  );
};

export default TextOverflow;
