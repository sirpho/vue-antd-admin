import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

/**
 * @description store-dict 数字字典
 */
export interface DictState {
  data: RecordType;
}

export const useStoreDict = defineStore('dict', () => {
  const state = reactive({
    data: {}
  } as DictState)

  const setDictData = (type, value) => {
    state.data[type] = value
  }
  const clearDictData = () => {
    state.data = {}
  }

  return {
    ...toRefs(state),
    setDictData,
    clearDictData
  }
})
