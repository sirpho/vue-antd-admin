// Interface data format used to return a unified format

import config from '/config/config'

const { tokenName } = config.defaultSettings

export function resultSuccess<T = Recordable>(result: T, { msg = 'ok' } = {}) {
  return {
    code: 0,
    result,
    msg,
    type: 'success'
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
    msg,
    type: 'error'
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

/**
 * @description 本函数用于从request数据中获取token，请根据项目的实际情况修改
 *
 */
export function getRequestToken({ headers }: requestParams): string | undefined {
  return headers?.[tokenName.toLowerCase()]
}

const responseBody = {
  msg: '',
  data: null,
  code: 0
}

export const builder = (data, msg?, code?) => {
  code = code || 0
  msg = msg || 'success'
  responseBody.data = data
  if (msg !== undefined && msg !== null) {
    responseBody.msg = msg
  }
  if (code !== undefined && code !== 0) {
    responseBody.code = code
  }
  return {
    code,
    msg,
    data
  }
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
