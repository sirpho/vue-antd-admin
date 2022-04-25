import type { VNodeChild } from 'vue'

export type ProFieldEmptyText = string | false;

export type ParamsType = RecordType;

export declare type SortOrder = 'descend' | 'ascend' | null;

export type RequestData = {
  data: any[] | undefined;
  success?: boolean;
  total?: number;
} & RecordType;

export type requsetConfig = (
  params: {
    pageSize?: number;
    current?: number;
    keyword?: string;
  },
  sort: Record<string, SortOrder>,
  filter: Record<string, any[] | null>
) => Promise<Partial<RequestData>>

export type ColConfig = Partial<Record<Breakpoint, number>>

export type SearchConfig = {
  searchText?: string;
  resetText?: string;
  className?: string;
  defaultCollapsed?: boolean;
  showSearch?: boolean;
  showReset?: boolean;
  collapseRender?: WithFalse<(collapsed?: boolean) => CustomRender>;
  span?: ColConfig;
}

export interface OptionConfig {
  reload?: (() => VNodeChild | JSX.Element) | boolean;
  density?: boolean;
  setting?: boolean | {
    draggable?: boolean;
    checkable?: boolean;
    checkedReset?: boolean;
    extra?: VueNode;
  };
  fullScreen?: (() => VNodeChild | JSX.Element) | boolean | (() => Promise<void>);
}

/** 操作类型 */
export type ProCoreActionType = ({ reload, reloadAndRest, changeDataValue, loadingOperation }: {
  formParams: RecordType;
  pageParams: RecordType | boolean;
  /** @name 刷新 */
  reload: (info?: any) => void;
  /** @name 刷新并清空表单，重置为第一页 */
  reloadAndRest: () => void;
  /** @name 更新TableData属性值 */
  reSetDataList?: (data: RecordType[]) => void;
  /** @name 更新TableData属性值 */
  changeDataValue?: ({ key, value }: { key?: string; value: RecordType }) => void;
  /** @name 改变loading状态 */
  loadingOperation?: (loading: boolean) => void;
}) => void;
