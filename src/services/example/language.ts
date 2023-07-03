import request from "@/utils/request";
import {download, upload} from "@/services/common";

interface QueryParam {
  [key: string]: any
}

// 列表
export function queryList(params: QueryParam) {
  return request({
    url: `/example/language/list`,
    method: 'get',
    isMock: true,
    params
  })
}

// 导出
export function exportList(params: QueryParam) {
  return download({
    url: `${import.meta.env.VITE_MOCK_PREFIX}/example/language/list`,
    params,
    name: '示例导出列表'
  })
}

// 导入
export function importEntity(formData: FormData) {
  return upload({
    url: '/example/language/import',
    method: 'post',
    isMock: true,
    data: formData
  })
}

// 列表
export function getInfo(params: QueryParam) {
  return request({
    url: `/example/language/info`,
    method: 'get',
    isMock: true,
    params
  })
}

// 新增
export function saveEntity(data: QueryParam) {
  return request({
    url: `/example/language/save`,
    method: 'post',
    isMock: true,
    data
  })
}

// 更新
export function updateEntity(data: QueryParam) {
  return request({
    url: `/example/language/update`,
    method: 'post',
    isMock: true,
    data
  })
}
// 更新
export function deleteEntity(ids: string[]) {
  return request({
    url: `/example/language/delete`,
    method: 'delete',
    isMock: true,
    data: {
      ids
    }
  })
}
