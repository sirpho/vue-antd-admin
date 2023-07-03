import request from "@/utils/request";

interface QueryParam {
  [key: string]: any
}

// 状态列表
export function getStatusDict(params: QueryParam) {
  return request({
    url: `/dict/status/list`,
    method: 'get',
    isMock: true,
    params
  })
}

// 类型列表
export function getTypeDict(params: QueryParam) {
  return request({
    url: `/dict/type/list`,
    method: 'get',
    isMock: true,
    params
  })
}


// 人物类型
export function getPersonTypeDict(params: QueryParam) {
  return request({
    url: `/dict/person/type/list`,
    method: 'get',
    isMock: true,
    params
  })
}


// 人物列表
export function getPersonDict(params: QueryParam) {
  return request({
    url: `/dict/person/list`,
    method: 'get',
    isMock: true,
    params
  })
}
