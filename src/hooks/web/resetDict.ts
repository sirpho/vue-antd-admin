import { getDictOptions } from '@/services/system/dictData'
import { useStore } from '@/store'
import { isArray } from '@sirpho/utils/validate'

export function resetDict(val: string | string[]) {
  const store = useStore()
  function reset() {
    if (typeof val === 'string') {
      getDictOptions(val).then((dictOptions) => {
        store.dict.setDictData(val, dictOptions)
      })
      return
    }

    if (isArray(val)) {
      for (let i = 0; i < val.length; i += 1) {
        const dictType = val[i]
        getDictOptions(dictType).then((dictOptions) => {
          store.dict.setDictData(dictType, dictOptions)
        })
      }
      return
    }
  }
  return reset
}
