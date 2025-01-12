import { FloatButton, theme } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { ThemeConfig } from 'antd/lib';
import { useMemoizedFn, useMount, useSafeState } from 'ahooks';

type ThemeType = 'normal' | 'dark';

const ThemeConfigMapper = {
  normal: {
    token: {
      colorBgLayout: '#fff',
    },
    components: {
      Typography: {
        titleMarginTop: 0,
        titleMarginBottom: '0.5em',
      },
    },
    algorithm: theme.defaultAlgorithm,
  },
  dark: {
    token: {
      colorBgLayout: '#282c34',
    },
    components: {
      Typography: {
        titleMarginTop: 0,
        titleMarginBottom: '0.5em',
      },
    },
    algorithm: theme.darkAlgorithm,
  },
};

const rootElem = document.getElementById('root');

const GlobalSettings: React.FC<{
  setTheme: (data: ThemeConfig) => void;
}> = ({ setTheme }) => {
  const [activedTheme, setActivedTheme] = useSafeState<ThemeType>(() => {
    setTheme(ThemeConfigMapper.normal);
    rootElem?.setAttribute('class', `theme-normal`);
    return 'normal';
  });
  const switchTheme = useMemoizedFn(() => {
    setActivedTheme((v) => {
      setTheme(
        v === 'normal' ? ThemeConfigMapper.dark : ThemeConfigMapper.normal,
      );

      rootElem?.setAttribute(
        'class',
        `theme-${v === 'normal' ? 'dark' : 'normal'}`,
      );
      return v === 'normal' ? 'dark' : 'normal';
    });
  });
  return (
    <FloatButton
      icon={activedTheme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
      onClick={switchTheme}
      tooltip={<span>切换为{activedTheme === 'dark' ? '日间' : '夜间'}模式</span>}
    ></FloatButton>
  );
};

export default GlobalSettings;
