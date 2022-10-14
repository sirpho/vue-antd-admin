import config from '/config/config'
import {
  setStorage,
  getStorage,
  removeStorage,
  getCookie,
  setCookie,
  delCookie
} from '@/utils/storage'

const { storage, tokenTableName } = config.defaultSettings

/**
 * @description 获取accessToken
 */
export function getAccessToken() {
  return getStorageItem(tokenTableName)
}

/**
 * @description 存储accessToken
 * @param accessToken
 * @param expired
 * @returns {void|*}
 */
export function setAccessToken(accessToken: string, expired?: number) {
  setStorageItem(tokenTableName, accessToken, expired)
}

/**
 * @description 移除accessToken
 * @returns {void|Promise<void>}
 */
export function removeAccessToken() {
  removeStorageItem(tokenTableName)
}

/**
 * 获取存储的权限
 */
export function getPermission() {
  return getStorageItem(`${tokenTableName}_permission`)
}
export function setPermission(permission: string, expired?: number) {
  setStorageItem(`${tokenTableName}_permission`, permission, expired)
}

export function removePermission() {
  removeStorageItem(`${tokenTableName}_permission`)
}

/**
 * 获取存储的用户信息
 */
export function getUserInfo() {
  return getStorageItem(`${tokenTableName}_user`)
}
export function setUserInfo(user: any, expired?: number) {
  setStorageItem(`${tokenTableName}_user`, user, expired)
}

export function removeUserInfo() {
  removeStorageItem(`${tokenTableName}_user`)
}

/**
 * 获取存储的对象
 * @param key
 */
function getStorageItem(key: string) {
  if (storage) {
    if ('localStorage' === storage) {
      return getStorage({ key: key })
    } else if ('sessionStorage' === storage) {
      return getStorage({ key: key, type: 'session' })
    } else if ('cookie' === storage) {
      return getCookie(key)
    } else {
      return getStorage({ key: key })
    }
  } else {
    return getStorage({ key: key })
  }
}

/**
 * 设置存储的对象
 * @param key
 * @param value
 * @param expired
 */
function setStorageItem(key: string, value: string, expired?: number) {
  if (storage) {
    if ('localStorage' === storage) {
      return setStorage({
        key: key,
        value: value,
        expired
      })
    } else if ('sessionStorage' === storage) {
      return setStorage({
        key: key,
        value: value,
        expired,
        type: 'session'
      })
    } else if ('cookie' === storage) {
      return setCookie(key, value, expired)
    } else {
      return setStorage({
        key: key,
        value: value,
        expired
      })
    }
  } else {
    return setStorage({
      key: key,
      value: value,
      expired
    })
  }
}

/**
 * 删除存储的对象
 * @param key
 */
function removeStorageItem(key: string) {
  if (storage) {
    if ('localStorage' === storage) {
      return removeStorage(key)
    } else if ('sessionStorage' === storage) {
      return removeStorage(key, 'session')
    } else if ('cookie' === storage) {
      return delCookie(key)
    } else {
      return removeStorage(key)
    }
  } else {
    return removeStorage(key)
  }
}
