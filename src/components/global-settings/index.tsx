import { FloatButton, theme } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { ThemeConfig } from 'antd/lib';
import { useMemoizedFn, useMount, useSafeState } from 'ahooks';

type ThemeType = 'normal' | 'dark';

const ColorMapper = {
  bg: {
    normal: '#fff',
    dark: '#282c34',
  },
  boxShadowColor: {
    normal: '#ddd',
    dark: '#161616',
  }
};

const ThemeConfigMapper = {
  normal: {
    token: {
      colorBgLayout: ColorMapper.bg.normal,
    },
    components: {
      Typography: {
        titleMarginTop: 0,
        titleMarginBottom: '0.5em',
      },
    },
    algorithm: theme.defaultAlgorithm,
    setCssVars: ($root: HTMLElement) => {
      $root.style.setProperty('--bgColor', ColorMapper.bg.normal);
      $root.style.setProperty('--boxShadowColor', ColorMapper.boxShadowColor.normal);
      $root.setAttribute('class', `theme-normal`);
    },
  },
  dark: {
    token: {
      colorBgLayout: ColorMapper.bg.dark,
    },
    components: {
      Typography: {
        titleMarginTop: 0,
        titleMarginBottom: '0.5em',
      },
    },
    algorithm: theme.darkAlgorithm,
    setCssVars: ($root: HTMLElement) => {
      $root.style.setProperty('--bgColor', ColorMapper.bg.dark);
      $root.style.setProperty('--boxShadowColor', ColorMapper.boxShadowColor.dark);
      $root.setAttribute('class', `theme-dark`);
    },
  },
};

const rootElem:HTMLElement | null = document.querySelector(':root');

const GlobalSettings: React.FC<{
  setTheme: (data: ThemeConfig) => void;
}> = ({ setTheme }) => {
  const [activedTheme, setActivedTheme] = useSafeState<ThemeType>(() => {
    setTheme(ThemeConfigMapper.normal);
    ThemeConfigMapper.normal.setCssVars(
      document.querySelector(':root')!,
    );
    return 'normal';
  });
  const switchTheme = useMemoizedFn(() => {
    setActivedTheme((v) => {
      const currentThemeKey = v === 'normal' ? 'dark' : 'normal';
      setTheme(ThemeConfigMapper[currentThemeKey]);
      ThemeConfigMapper[currentThemeKey].setCssVars(
        rootElem!,
      );
      return currentThemeKey;
    });
  });
  return (
    <FloatButton
      icon={activedTheme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
      onClick={switchTheme}
    ></FloatButton>
  );
};

export default GlobalSettings;
