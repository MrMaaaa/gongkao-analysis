import { useEffect, useRef } from 'react';
import { Button } from 'antd';
import cls from 'classnames';
import './index.scss';
import { useSafeState } from 'ahooks';

const TextOverflow: React.FC<{
  text: string | React.ReactNode;
  lines?: number,
}> = ({ text, lines = 2 }) => {
  const textRef = useRef<HTMLDivElement | null>(null);
  const [withHiddenStyle, setWithHiddenStyle] = useSafeState(false);
  const [toggleHiddenStyle, setToggleHiddenStyle] = useSafeState(false);
  useEffect(() => {
    if (!!text && textRef.current && textRef.current?.getBoundingClientRect().height > lines * 22) {
      setWithHiddenStyle(true);
      setToggleHiddenStyle(true);
    }
  }, [text, lines]);
  return (
    <div className="text-overflow-wrapper">
      <div
        className="text-overflow"
        style={{
          WebkitLineClamp: !toggleHiddenStyle ? 999 : lines,
        }}
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
