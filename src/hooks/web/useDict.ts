import { computed, reactive } from 'vue'
import { useStore } from 'vuex'
import { getDicts } from '/@/services/system/dictData'
import { onMountedOrActivated } from '@gx-design/pro-hooks/core'
import { isArray } from '/@/utils/validate'

export function useDict(val: string | string[]) {
  const dictData: any = reactive({})
  const store = useStore()

  const dict = store.getters['dict/data']

  const getDictData = computed(() => {
    return dictData
  })

  async function getDict() {
    let response
    if (typeof val === 'string') {
      dictData[val] = {}
      if (dict[val] && dict[val].length) {
        dictData[val].data = dict[val]
      } else {
        dictData[val].loading = true
        response = await getDicts(val)
        if (response) {
          const data = (response.data || [])
          store.dispatch('dict/setDictData', {
            type: val,
            data
          })
          dictData[val].data = data
        }
        dictData[val].loading = false
      }
      return
    }

    if (isArray(val)) {
      for (let i = 0; i < val.length; i += 1) {
        const dictType = val[i]
        dictData[dictType] = {}
        if (dict[dictType] && dict[dictType].length) {
          dictData[dictType].data = dict[dictType]
        } else {
          dictData[dictType].loading = true
          response = await getDicts(dictType)
          if (response) {
            const data = (response.data || [])
            store.dispatch('dict/setDictData', {
              type: dictType,
              data
            })
            dictData[dictType].data = data
          }
          dictData[dictType].loading = false
        }
      }
      return
    }
  }

  onMountedOrActivated(() => {
    getDict()
  })

  return {
    getDictData
  }
}
