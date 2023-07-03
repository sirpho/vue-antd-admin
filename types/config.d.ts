import { MenuTheme } from '@gx-pro/pro-layout'

export interface configSetting {
  theme: themeConfig;
  proxy: any;
  network: networkConfig;
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
  keepAlive: boolean;
  keepAliveMaxNum: number;
  routerMode: string;
  routerLoadTime: number;
  routesWhiteList: Array<string>;
  tokenName: string;
  tokenTableName: string;
  storage: string;
  recordRoute: boolean;
  authentication: string;
  cacheDataOnRefresh: boolean;
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
  primaryColor: string
  layout: 'side' | 'mix' | 'simple';
  splitMenus: boolean;
  fixedHeader: boolean;
  fixSiderbar: boolean;
  showProgressBar: boolean;
  showTabsBar: boolean;
  showFullScreen?: boolean;
  headerHeight?: number;
  autoHideHeader: boolean;
  title: string;
  iconfontUrl?: string;
}
