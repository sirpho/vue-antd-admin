import {MockMethod} from 'vite-plugin-mock'
import {builder, getRequestToken, requestParams} from '../_util'

type TableListItem = {
  id: number | string;
  [key: string]: any
};

type TableListParams = {
  pageSize?: number;
  pageNum?: number;
  [key: string]: any
};

// mock tableListDataSource
const genList = (pageNum: number, pageSize: number) => {
  const tableListDataSource: TableListItem[] = []

  for (let i = 0; i < pageSize; i += 1) {
    const index = (pageNum - 1) * 10 + i
    tableListDataSource.push({
      id: String(index),
      title: '技能研究',
      message: '你好，为了解你对「工作生活balance」概念的理解，诚邀你填写本次问卷调研',
    })
  }
  tableListDataSource.reverse()
  return tableListDataSource
}

let tableListDataSource: TableListItem[] = genList(1, 20)

function getList(params: TableListParams) {

  const {pageNum = 1, pageSize = 10} = params

  let dataSource = [...tableListDataSource]

  const totalCount = dataSource.length
  dataSource = dataSource.slice(
    ((pageNum as number) - 1) * (pageSize as number),
    (pageNum as number) * (pageSize as number)
  )

  const result = {
    list: dataSource,
    totalCount: totalCount,
    currPage: parseInt(`${params.pageNum}`, 10) || 1,
    pageSize: pageSize,
    totalPage: Math.ceil(totalCount / pageSize)
  }

  return {
    data: result
  }
}

export default [
  {
    url: '/mock-server/notice/list',
    timeout: 500,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      return builder(token, {...getList(request.query)})
    }
  },
  {
    url: '/mock-server/notice/read',
    timeout: 2500,
    method: 'post',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      const {id} = request.body
      tableListDataSource = tableListDataSource.map((item) => {
        if (item.id === id) {
          return {...item, isRead: 'Y'}
        }
        return item
      })
      return builder(token, {})
    }
  },
  {
    url: '/mock-server/notice/read-all',
    timeout: 2500,
    method: 'post',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      tableListDataSource = tableListDataSource.map((item) => ({
        ...item, isRead: 'Y'
      }))
      return builder(token, {})
    }
  },
] as MockMethod[]
