import { Slots } from 'vue'
import { ProColumns } from './column'
import { OptionConfig } from './table'

export interface ProActionColums extends ProColumns {
  uuid?: string;
  fixType?: string;
  checked?: boolean;
}

export interface stateTypes {
  table: any;
  tableId: string;
  tableKey: string;
  fullScreen: boolean;
  options: OptionConfig;
  tableSlots: Slots;
  draggingState: any;
}
