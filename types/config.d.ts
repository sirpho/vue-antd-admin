import { MenuTheme } from '@gx-pro/pro-layout'

export interface configSeting {
  theme: themeConfig;
  proxy: any;
  network: networkConfig;
  animate: animateConfig;
  defaultSettings: settingConfig;
}

export interface settingConfig {
  publicPath: string;
  outputDir: string;
  assetsDir: string;
  title: string;
  shortName: string;
  titleSeparator: string;
  titleReverse: boolean;
  waterMark: boolean;
  waterMarkTitle: string;
  viewScrollRoot: string;
  useProxy: boolean;
  proxyTarget: string;
  requestPrefix?: string | object;
  devPort: number;
  copyright: string;
  keepAlive: boolean;
  keepAliveMaxNum: number;
  routerMode: string;
  routerLoadTime: number;
  routesWhiteList: Array<string>;
  tokenName: string;
  tokenTableName: string;
  storage: string;
  recordRoute: boolean;
  loginInterception: boolean;
  loginRSA: boolean;
  authentication: string;
  rolesControl: boolean;
  uniqueOpened: boolean;
  defaultOpeneds: Array<string>;
  debounce: Array<string>;
}

export interface networkConfig {
  contentType: string;
  messageDuration: number;
  requestTimeout: number;
  successCode: (string | number)[];
}

export type Theme = 'dark' | 'light';

export type MenuTheme = Theme;

export interface themeConfig {
  theme: MenuTheme | undefined;
  primaryColor: stringshowProgressBar
  layout: 'side' | 'mix' | 'simple';
  splitMenus: boolean;
  fixedMultiTab: boolean;
  fixedHeader: boolean;
  fixSiderbar: boolean;
  showProgressBar: boolean;
  showTabsBar: boolean;
  showFullScreen?: boolean;
  headerHeight?: number;
  autoHideHeader: boolean;
  title: string;
  iconfontUrl?: string;
  animate?: {
    disabled?: boolean;
    name: string;
    direction: string;
  };
}

export interface customizeConfig {
  donation: boolean;
  templateFolder: string;
}

export interface animateConfig {
  preset: Array<animatePreset>;
}

export interface animatePreset {
  name: string;
  alias: string;
  directions: Array<any>;
}

export interface themeAnimateSeting {
  name: string;
  direction: string;
  disabled?: boolean;
}
