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
  useCdn: boolean;
  devPort: number;
  copyright: string;
  keepAliveMaxNum: number;
  routerMode: string;
  routesWhiteList: Array<string>;
  loadingText: string;
  tokenName: string;
  tokenTableName: string;
  storage: string;
  recordRoute: boolean;
  logo: string;
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
  successCode: Array<number>;
}

export interface themeConfig {
  layout: string;
  theme: string;
  animate: themeAnimateSeting;
  fixedHeader: boolean;
  fixSiderbar: boolean;
  showProgressBar: boolean;
  showTabsBar: boolean;
  showFullScreen: boolean;
  autoHideHeader: boolean;
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
