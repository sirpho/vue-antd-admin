/** 操作类型 */
export type ProCoreActionType = {
  /** @name 刷新 */
  reload: () => void;
  /** @name 刷新并清空表单，重置为第一页 */
  reloadAndRest?: () => void;
}

export type ActionType = ProCoreActionType
