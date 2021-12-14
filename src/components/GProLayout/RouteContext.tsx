import { InjectionKey, provide, reactive, Ref } from 'vue'
import { themeConfig } from '/types/config'
import type { MenuDataItem } from './typings'
import { createContext, useContext } from './hooks/context'
import { getPrefixCls } from '../_util'

export interface Route {
  path: string;
  breadcrumbName: string;
  children?: Omit<Route, 'children'>[];
}

export interface BreadcrumbProps {
  prefixCls?: string;
  routes?: Route[];
  params?: any;
  separator?: CustomRender;
  itemRender?: (opts: {
    route: Route;
    params: any;
    routes: Array<Route>;
    paths: Array<string>;
  }) => CustomRender;
}

export type BreadcrumbListReturn = Pick<BreadcrumbProps,
  Extract<keyof BreadcrumbProps, 'routes' | 'itemRender'>>;

export interface MenuState {
  selectedKeys: string[];
  openKeys: string[];
  setSelectedKeys?: (key: string[]) => void;
  setOpenKeys?: (key: string[]) => void;
}

export interface RouteContextProps extends Partial<themeConfig>, MenuState {
  breadcrumb?: BreadcrumbListReturn;
  menuData: MenuDataItem[];
  isMobile?: boolean;
  collapsed?: boolean;
  hasSideMenu?: boolean;
  hasHeader?: boolean;
  sideWidth?: number;
  headerHeight?: number;
  hasFooterToolbar?: boolean;
  hasFooter?: boolean;
  setHasFooterToolbar?: (bool: boolean) => void;

  /* 附加属性 */
  [key: string]: any;
}

// set default context
export const defaultRouteContext = reactive({
  getPrefixCls
})

const routeContextInjectKey: InjectionKey<RouteContextProps> = Symbol('route-context')

export const createRouteContext = () =>
  createContext<RouteContextProps>(routeContextInjectKey, 'RouteContext.Provider')

export const provideRouteContext = (value: RouteContextProps | Ref<RouteContextProps> | any) => {
  provide(routeContextInjectKey, value)
}

export const useRouteContext = () =>
  useContext<Required<RouteContextProps>>(routeContextInjectKey, defaultRouteContext)

const Provider = createRouteContext()

export default {
  Provider
}