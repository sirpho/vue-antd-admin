import { watchEffect, ref } from 'vue'
import { useStore } from 'vuex'
import { isObject } from '/@/utils/util'

export function usePermissions(value) {
  const store = useStore()
  const permission = ref({})
  const all_permission = ref('*:*:*')
  const permissions = store.getters['acl/ability']
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
    }
  })
  return permission
}
