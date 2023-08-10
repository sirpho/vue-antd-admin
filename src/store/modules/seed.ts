import {defineStore} from "pinia";
import {reactive, toRefs} from "vue";

export interface SeedType {
  templateSeed: number
}
export const useSeed = defineStore('seed', () => {
  const state = reactive({
    templateSeed: 1,
  } as SeedType)

  /**
   * 页面变化时通知列表刷新
   */
  const updateTemplateSeed = () => {
    state.templateSeed = state.templateSeed + 1
  }

  return {
    ...toRefs(state),
    updateTemplateSeed,
  }
})
