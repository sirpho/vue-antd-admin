import type { VNode } from 'vue'

export type LayoutType = 'side' | 'mix';

export interface MetaRecord {
  /**
   * @name 菜单的icon
   */
  icon?: string | VNode;
  /**
   * @name 菜单的iconType
   */
  iconType?: number;
  /**
   * @name 自定义菜单的国际化 key，如果没有则返回自身
   */
  title?: string;
  /**
   * @name 是否是外链地址 '0' | '1'
   */
  target?: string;
  /**
   * @name 打开目标位置 0：系统内 | 1：系统外
   */
  targetStatus?: number;
  /**
   * @name 在菜单中隐藏自己和子节点
   */
  hideInMenu?: boolean;
  /**
   * @name 登录后是否跳转改地址 0 | 1
   */
  homePage?: number;
  /**
   * @name 标签栏是否隐藏
   */
  tagHidden?: boolean;
  /**
   * @name 是否固定在标签栏中
   */
  tagFixed?: boolean;

  [key: string]: any;
}

export interface MenuDataItem {
  /**
   * @name 用于标定选中的值，默认是 path
   */
  path: string;
  linkPath?: string;
  name?: string | symbol;
  meta?: MetaRecord;
  /**
   * @name 子菜单
   */
  children?: MenuDataItem[];
}

