import type { RouteRecordRaw } from 'vue-router';

interface AppRouteRecordRaw {
  hidden?: boolean;
  homePage?: boolean;
  sideMenuHidden?: boolean;
}

export type AppRouteModule = AppRouteRecordRaw & RouteRecordRaw;
