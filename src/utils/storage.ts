import dayjs from 'dayjs'
import config from '/config/config'
import { isPro } from '@/utils'
import { Decrypt, Encrypt } from '@/utils/crypto'
import { isJSONStr, isObject } from '@/utils/validate'

const { shortName } = config.defaultSettings

function isEncryption(status: boolean) {
  return isPro() ? status : false
}

function handleStorageValue(value: string) {
  if (isJSONStr(value)) return JSON.parse(value)
  return value
}

/**
 * @description 设置Local-key的规则
 */
export function getStorageKey(key: string) {
  const { pkg } = __APP_INFO__
  return `${shortName}_${pkg.version}_${isPro() ? 'pro' : 'dev'}_${key}`
}

/**
 * @description 存储SessionStorage
 */
export function getStorage({ key, encryption = true, type = 'local' }: { key: string, encryption?: boolean, type?: string }) {
  const storageValue = type === 'local' ?
    localStorage.getItem(getStorageKey(key))
    : sessionStorage.getItem(getStorageKey(key))
  const result: string | LocalResult = storageValue ?
    isEncryption(encryption) ? Decrypt(storageValue) : handleStorageValue(storageValue)
    : ''
  if (result && isObject(result)) {
    if (result.expired) {
      const expiredStatus = dayjs().diff(dayjs(result.time)) >= result.expired
      if (expiredStatus) {
        removeStorage(key, type)
        return ''
      }
    }
  }
  return result?.['value'] || result || ''
}

/**
 * @description 设置LocalStorage
 */
export function setStorage({
  key,
  value,
  expired,
  encryption = true,
  type = 'local'
}: {
  key: string;
  value: any;
  expired?: number;
  encryption?: boolean;
  type?: string;
}) {
  const result: LocalResult = {
    value,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    expired: expired || 0
  }
  const storageValue = isEncryption(encryption) ? Encrypt(JSON.stringify(result)) : JSON.stringify(result)
  if (type === 'local') localStorage.setItem(getStorageKey(key), storageValue)
  sessionStorage.setItem(getStorageKey(key), storageValue)
}

/**
 * @description 删除LocalStorage
 */
export function removeStorage(key: string, type = 'local') {
  if (type === 'local') localStorage.removeItem(getStorageKey(key))
  sessionStorage.removeItem(getStorageKey(key))
}

/**
 * @description 获取Cookie-name
 */
function getCookies(cname: string) {
  const name = `${cname}=`
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return decodeURIComponent(c.substring(name.length, c.length))
    }
  }
  return ''
}

/**
 * @description 获取Cookiedomin
 */
function GetCookieDomain() {
  let host = location.hostname
  const ip = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  if (ip.test(host) === true || host === 'localhost') return host
  const regex = /([^]*).*/
  const match = host.match(regex)
  if (typeof match !== 'undefined' && match !== null) {
    const someIndex = 1
    host = match[someIndex]
  }
  if (typeof host !== 'undefined' && host !== null) {
    const strAry = host.split('.')
    if (strAry.length > 1) {
      host = `${strAry[strAry.length - 2]}.${strAry[strAry.length - 1]}`
    }
  }
  return `.${host}`
}

/**
 * @description 设置Cookie
 */
export function setCookie(cname: string, cvalue: string, exdays?: number) {
  const d = new Date()
  d.setTime(d.getTime() + (exdays || 365) * 24 * 60 * 60 * 1000)
  const expires = `=${d.toUTCString()}`
  document.cookie = `${cname}=${encodeURIComponent(
    cvalue
  )}; expires=${expires}; domain=${GetCookieDomain()}; path=/`
}

/**
 * @description 获取Cookie
 */
export function getCookie(cname: string) {
  const result = getCookies(cname)
  if (result === '') {
    return ''
  }
  return decodeURIComponent(result)
}

/**
 * @description 删除Cookie
 */
export function delCookie(name: string) {
  const exp = new Date()
  exp.setTime(exp.getTime() - 1)
  const cval = getCookies(name)
  if (cval !== null) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${GetCookieDomain()}; path=/`
  }
}
