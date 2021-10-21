import { ComponentInternalInstance, Slots } from 'vue'
import { PaginationProps } from 'ant-design-vue/lib/pagination'
import { ProColumns } from './column'
import { OptionConfig } from './table'

export interface ProActionColums extends ProColumns {
  uuid?: string;
  fixType?: string;
  checked?: boolean;
}

export interface stateTypes {
  table: any;
  searchData: Recordable[];
  pagination: PaginationProps;
  dataSource: Recordable[];
  tableId: string;
  tableKey: string;
  fullScreen: boolean;
  columns: ProColumns[];
  actionColums: ProActionColums[];
  scrollFixed: boolean;
  tableLoading: boolean;
  size: string;
  options: OptionConfig;
  tableSlots: Slots;
  draggingState: any;
}
