import { computed } from 'vue'
import { useStore } from '@gx-vuex'
import { getDictOptions } from '@/services/system/dictData'
import { onMountedOrActivated } from '@gx-admin/hooks/core'
import { isArray } from '@sirpho/utils/validate'

export function useDict(val: string | string[]) {
  const store = useStore()

  const dict = store.dict.data

  async function getDict() {
    let dictOptions
    if (typeof val === 'string') {
      if (!dict[val] || dict[val].length <= 0) {
        dictOptions = await getDictOptions(val)
        store.dict.setDictData(val, dictOptions)
      }
      return
    }

    if (isArray(val)) {
      for (let i = 0; i < val.length; i += 1) {
        const dictType = val[i]
        if (!dict[dictType] || dict[dictType].length <= 0) {
          dictOptions = await getDictOptions(dictType)
          store.dict.setDictData(dictType, dictOptions)
        }
      }
      return
    }
  }

  onMountedOrActivated(() => {
    getDict()
  })

  const keys = [].concat(val)
  return keys.map(key => computed(() => {
    return store.dict.data[key]
  }))
}
