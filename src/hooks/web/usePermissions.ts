import { watchEffect, ref } from 'vue'
import { useStore } from 'vuex'
import { isString, isArray, isObject } from '/@/utils/validate'

export function usePermissions(value) {
  const store = useStore()
  const all_permission = ref('*:*:*')
  const permissions = store.getters['acl/ability']
  let permission = ref<object | boolean>({})
  watchEffect(() => {
    if (value && isObject(value) && Object.keys(value).length > 0) {
      Object.keys(value).map(item => {
        let isExist = true
        const permissionFlag = value[item]
        const hasPermissions = permissions.some(el => {
          return all_permission.value === el || permissionFlag.includes(el)
        })
        if (!hasPermissions) {
          isExist = false
        }
        permission.value[item] = isExist
        return item
      })
    } else if (isString(value) || isArray(value)) {
      permission = permissions.some(el => {
        return all_permission.value === el || value.includes(el)
      })
    }
  })
  return permission
}
