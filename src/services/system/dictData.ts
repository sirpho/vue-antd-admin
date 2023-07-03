import {getPersonDict, getPersonTypeDict, getStatusDict, getTypeDict} from '@/services/system/index'
import { arrayFieldRepeat } from '@sirpho/utils'
import { isObject } from '@sirpho/utils/validate'
//
// // 查询字典数据详细
export function getDictOptions(dictCode) {
  return new Promise((resolve, reject) => {
    let operation
    let valueKey = ''
    let nameKey = ''
    let mixLabel = true
    // 排除重复项
    let excludeDuplicates = false
    const params: {
      [key: string]: any
    } = {
      limit: undefined
    }
    switch (dictCode) {
      case 'STATUS': // 状态枚举
        operation = getStatusDict
        nameKey = 'name'
        valueKey = 'value'
        excludeDuplicates = true
        mixLabel = false
        break
      case 'TYPE': // 类型枚举
        operation = getTypeDict
        nameKey = 'name'
        valueKey = 'value'
        excludeDuplicates = true
        mixLabel = false
        params.extra = '额外的补充参数'
        break
      case 'PERSON': // 人物枚举
        operation = getPersonDict
        nameKey = 'name'
        valueKey = 'value'
        excludeDuplicates = true
        mixLabel = true
        params.extra = '额外的补充参数'
        break
      case 'PERSON_TYPE': // 人物类型枚举
        operation = getPersonTypeDict
        nameKey = 'name'
        valueKey = 'value'
        excludeDuplicates = true
        mixLabel = false
        break
    }
    if(!operation) {
      resolve([])
    }
    operation(params)
      .then((res) => {
        let result = res.data || res.page || []
        result = result?.list || result
        const isObj = result.find((item) => isObject(item))
        if (isObj) {
          result = result.map((item) => ({
            ...item,
            label: mixLabel ? `${item[valueKey]}-${item[nameKey]}` : item[nameKey],
            value: item[valueKey] || undefined,
            name: item[nameKey] || undefined
          }))
          if (excludeDuplicates) {
            result = arrayFieldRepeat(result)
          }
        }
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
