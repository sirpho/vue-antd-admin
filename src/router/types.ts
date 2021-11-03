import type { RouteRecordRaw } from 'vue-router';

interface AppRouteRecordRaw {
  hidden?: boolean;
  homePage?: number;
}

export type AppRouteModule = AppRouteRecordRaw & RouteRecordRaw;
