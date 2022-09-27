import { computed, reactive } from 'vue'
import { useStore } from '@gx-vuex'
import { getDictOptions } from '@/services/system/dictData'
import { onMountedOrActivated } from '@gx-admin/hooks/core'
import { isArray } from '@/utils/validate'

export function useDict(val: string | string[]) {
  const dictData: any = reactive({})
  const store = useStore()

  const dict = store.dict.data

  async function getDict() {
    let dictOptions
    if (typeof val === 'string') {
      dictData[val] = {}
      if (dict[val] && dict[val].length) {
        dictData[val].data = dict[val]
      } else {
        dictData[val].loading = true
        dictData[val].data = []
        dictOptions = await getDictOptions(val)
        store.dict.setDictData(val, dictOptions)
        dictData[val].data = dictOptions
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
          dictOptions = await getDictOptions(dictType)
          store.dict.setDictData(dictType, dictOptions)
          dictData[dictType].data = dictOptions
          dictData[dictType].loading = false
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
    return dictData[key]
  }))
}
