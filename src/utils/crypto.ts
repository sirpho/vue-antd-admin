import 'crypto-js/enc-utf8'
import 'crypto-js/tripledes'
import 'crypto-js/sha1'
import * as CryptoJS from 'crypto-js/core'
import { isObject, isArray, isJSONStr } from '@sirpho/utils/validate'

const key = '1234123412ABCDEF'  //十六位十六进制数作为密钥

//加密方法
export function Encrypt(word) {
  let str: string | object = word
  if (isObject(word) || isArray(word)) {
    str = JSON.stringify(word)
  }
  const keyHex = CryptoJS.enc.Utf8.parse(key)
  const ivHex = CryptoJS.enc.Utf8.parse(key)
  const encrypted = CryptoJS.DES.encrypt(str, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
}

//解密方法
export function Decrypt(word) {
  const keyHex = CryptoJS.enc.Utf8.parse(key)
  const ivHex = CryptoJS.enc.Utf8.parse(key)
  const decrypted = CryptoJS.DES.decrypt({
    ciphertext: CryptoJS.enc.Base64.parse(word)
  }, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8)
  return isJSONStr(decryptedStr.toString()) ? JSON.parse(decryptedStr.toString()) : decryptedStr.toString()
}
