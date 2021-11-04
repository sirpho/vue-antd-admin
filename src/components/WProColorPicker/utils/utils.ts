import {
  camelize,
  capitalize,
  extend,
  hasOwn,
  isArray,
  isObject,
  isString,
  looseEqual
} from '@vue/shared'
import { warn } from './error'

export const SCOPE = 'Util'

export const isNumber = (val: unknown) => typeof val === 'number'

export function addUnit(value: string | number) {
  if (isString(value)) {
    return value
  } else if (isNumber(value)) {
    return value + 'px'
  }
  if (import.meta.env.MODE === 'development') {
    warn(SCOPE, 'binding value must be a string or number')
  }
  return ''
}

export function toObject<T>(arr: Array<T>): Record<string, T> {
  const res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

export {
  hasOwn,
  isObject,
  isArray,
  isString,
  capitalize,
  camelize,
  looseEqual,
  extend
}
