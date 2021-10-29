import { VNodeChild } from 'vue'
import { ProSearchConfig } from './column'

export type ProFieldEmptyText = string | false;

export type ParamsType = Record<string, any>;

export declare type SortOrder = 'descend' | 'ascend' | null;

export type RequestData = {
  data: any[] | undefined;
  success?: boolean;
  total?: number;
} & Record<string, any>;

export type requsetConfig = (
  params: {
    pageSize?: number;
    current?: number;
    keyword?: string;
  },
  sort: Record<string, SortOrder>,
  filter: Record<string, any[] | null>
) => Promise<Partial<RequestData>>

export interface searchPorps {
  type: string;
  showSearch?: boolean;
  data: ProSearchConfig[]
}

export interface OptionConfig {
  reload?: (() => VNodeChild | JSX.Element) | boolean;
  density?: boolean;
  setting?: boolean;
  fullScreen?: (() => VNodeChild | JSX.Element) | boolean;
}

/** 操作类型 */
export type ProCoreActionType = {
  /** @name 刷新 */
  reload: () => void;
  /** @name 改变loading状态 */
  loadingOperation: (loading: boolean) => void;
  /** @name 刷新并清空表单，重置为第一页 */
  reloadAndRest?: () => void;
}
