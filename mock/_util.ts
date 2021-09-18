// Interface data format used to return a unified format

import config from '/config/config'

const { tokenName } = config.defaultSettings

export function resultSuccess<T = Recordable>(result: T, { msg = 'success' } = {}) {
  return {
    code: 200,
    result,
    msg
  }
}

export function resultPageSuccess<T = any>(
  page: number,
  pageSize: number,
  list: T[],
  { msg = 'ok' } = {}
) {
  const pageData = pagination(page, pageSize, list)

  return {
    ...resultSuccess({
      items: pageData,
      total: list.length
    }),
    msg
  }
}

export function resultError(msg = 'Request failed', { code = -1, result = null } = {}) {
  return {
    code,
    result,
    msg
  }
}

export function pagination<T = any>(pageNo: number, pageSize: number, array: T[]): T[] {
  const offset = (pageNo - 1) * Number(pageSize)
  const ret =
    offset + Number(pageSize) >= array.length
      ? array.slice(offset, array.length)
      : array.slice(offset, offset + Number(pageSize))
  return ret
}

export interface requestParams {
  method: string;
  body: any;
  headers?: any;
  query: any;
}

export interface resultParams {
  data?: any;
  code?: number;
  msg?: string;
}

/**
 * @description 本函数用于从request数据中获取token，请根据项目的实际情况修改
 *
 */
export function getRequestToken({ headers }: requestParams): string | undefined {
  return headers?.[tokenName.toLowerCase()]
}

export const builder = (token, { data = null, code, msg }: resultParams = {}) => {
  code = token ? code || 200 : 401
  msg = token ? msg || code === 200 ? 'success' : 'Request failed' : 'Request failed'
  const result: Result = {
    code,
    msg,
    data
  }
  if (!data) delete result.data
  return result
}

export const getQueryParameters = (options: any) => {
  const url = options.url || ''
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"') + '"}')
}
