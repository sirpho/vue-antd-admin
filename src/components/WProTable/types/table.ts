import { CSSProperties, VNodeChild } from 'vue'
import { TableProps } from 'ant-design-vue/lib/table/interface'
import { ProColumns, ProSearchConfig } from './column'
import { ActionType } from './tableAction'

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
  filter: Record<string, any[] | null>,
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

export type ProTableProps = {
  columns?: ProColumns[];
  params?: any;
  /** @name 一个获得 dataSource 的方法 */
  request?: requsetConfig;
  /** @name 重置表单时触发 */
  onReset?: () => void;
  /** @name 初始化的参数，可以操作 table */
  actionRef?: ActionType;
  /** @name 给封装的 table 的 style */
  tableStyle?: CSSProperties;
  toolBarBtn?: Array<() => VNodeChild | JSX.Element>;
  /** @name loading 被修改时触发，一般是网络请求导致的 */
  onLoadingChange?: (loading: boolean | undefined) => void;
  align?: 'left' | 'right' | 'center';
  style?: CSSProperties;
  search?: false | searchPorps;
  options?: false | OptionConfig;
  /** @name 左上角的 title */
  headerTitle?: VNodeChild | JSX.Element;
  /** @name 标题旁边的 tooltip */
  titleTip?: string | VNodeChild | JSX.Element;
  titleTipText?: string;
  tableClassName?: string;
  showPagination?: boolean;
  size?: String;
  showIndex?: boolean;
  bordered?: boolean;
  draggabled?: boolean;
  automaticScroll?: boolean;
  neverScroll?: boolean;
} & Omit<TableProps, 'columns' | 'rowSelection'>;
