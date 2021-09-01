import type { PropType, ExtractPropTypes } from 'vue';
import type { MenuTheme } from './typings';

export interface RenderSetting {
  headerRender?: false;
  footerRender?: false;
  menuRender?: false;
  headerLogoRender?: false;
}
export interface RenderSetting {
  headerRender?: false;
  footerRender?: false;
  menuRender?: false;
  headerLogoRender?: false;
}
export interface PureSettings {
  theme: MenuTheme | undefined;
  layout: 'side' | 'mix';
  fixedHeader: boolean;
  fixSiderbar: boolean;
  showProgressBar: boolean;
  showTabsBar: boolean;
  showFullScreen?: boolean;
  headerHeight?: number;
  autoHideHeader: boolean;
  title: string;
  iconfontUrl: string;
  animate?: object;
}

export type ProSettings = PureSettings & RenderSetting;

export const defaultSettings = {
  //布局种类 side/mix
  layout: 'mix',
  // 主题 light/dark
  theme: 'light',
  title: 'Wd Pro Admin',
  headerHeight: 48,
  // 头部菜单是否固定
  fixedHeader: false,
  // 侧边栏菜单是否固定
  fixSiderbar: false,
  //是否显示顶部进度条
  showProgressBar: true,
  //是否显示多标签页
  showTabsBar: true,
  //是否显示全屏组件
  showFullScreen: false,
  //是否自动隐藏头部
  autoHideHeader: false,
  //页面动画配置
  iconfontUrl: '',
  //页面动画配置
  animate: {
    name: 'fade',
    direction: 'default'
  }
};

export const defaultSettingProps = {
  theme: {
    type: String as PropType<PureSettings['theme']>,
    default: defaultSettings.theme,
  },
  layout: {
    type: String as PropType<PureSettings['layout']>,
    default: defaultSettings.layout,
  },
  fixedHeader: {
    type: Boolean as PropType<PureSettings['fixedHeader']>,
    default: defaultSettings.fixedHeader,
  },
  fixSiderbar: {
    type: Boolean as PropType<PureSettings['fixSiderbar']>,
    default: defaultSettings.fixSiderbar,
  },
  showTabsBar: {
    type: Boolean as PropType<PureSettings['showTabsBar']>,
    default: defaultSettings.showTabsBar,
  },
  showFullScreen: {
    type: Boolean as PropType<PureSettings['showFullScreen']>,
    default: defaultSettings.showFullScreen,
  },
  autoHideHeader: {
    type: Boolean as PropType<PureSettings['autoHideHeader']>,
    default: defaultSettings.autoHideHeader,
  },
  headerHeight: {
    type: Number as PropType<PureSettings['headerHeight']>,
    default: defaultSettings.headerHeight,
  },
  title: {
    type: String as PropType<PureSettings['title']>,
    default: () => defaultSettings.title,
  },
  iconfontUrl: {
    type: String as PropType<PureSettings['iconfontUrl']>,
    default: () => defaultSettings.iconfontUrl,
  },
  animate: {
    type: Boolean as PropType<PureSettings['animate']>,
    default: defaultSettings.animate,
  }
};

export type ProSettingsProps = ExtractPropTypes<typeof defaultSettingProps>;
