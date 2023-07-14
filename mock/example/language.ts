import { MockMethod } from 'vite-plugin-mock'
import dayjs from 'dayjs'
import { builder, getRequestToken, requestParams } from '../_util'
import {personList, personTypeList, statusList, typeList} from "../system";

const momentFiled = [ 'updatedAt', 'createdAt' ]

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
      area: index % 10 < 5 ? '光之国' : 'M78星云',
      location: Math.floor(Math.random() * 200) > 100 ? '光之国' : 'M78星云',
      name: personList[Math.floor(Math.random() * 200) % personList.length].name,
      englishName: personList[Math.floor(Math.random() * 200) % personList.length].value,
      personType: personTypeList[Math.floor(Math.random() * 200) % personTypeList.length],
      desc: typeList[i % typeList.length].name,
      callNo: Math.floor(Math.random() * 1000),
      status: statusList[Math.floor(Math.random() * 10) % statusList.length].name,
      updatedAt: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      createdAt: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      progress: Math.random(),
      money: Math.ceil(Math.random() * 6000)
    })
  }
  tableListDataSource.reverse()
  return tableListDataSource
}

let tableListDataSource: TableListItem[] = genList(1, 100)

function getList(params: TableListParams) {

  const { pageNum = 1, pageSize = 10, sortOrder = '', sortField = '' } = params

  let dataSource = [ ...tableListDataSource ]
  if (sortOrder) {
    dataSource = dataSource.sort((prev, next) => {
      let sortNumber = 0
      const prevValue = momentFiled.includes(sortField) ? dayjs(prev[sortField]) : prev[sortField]
      const nextValue = momentFiled.includes(sortField) ? dayjs(next[sortField]) : next[sortField]
      if (sortOrder === 'descend') {
        if (prevValue - nextValue > 0) {
          sortNumber += -1
        } else {
          sortNumber += 1
        }
      } else {
        if (prevValue - nextValue > 0) {
          sortNumber += 1
        } else {
          sortNumber += -1
        }
      }
      return sortNumber
    })
  }

  if (params.name) {
    dataSource = dataSource.filter((data) => data.name.includes(params.name || ''))
  }
  if (params.englishName) {
    dataSource = dataSource.filter((data) => data.englishName.includes(params.englishName || ''))
  }
  if (params.personType) {
    dataSource = dataSource.filter((data) => data.personType.includes(params.personType || ''))
  }

  if (params.status) {
    dataSource = dataSource.filter((data) => data.status === params.status)
  }

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

function handleOperation(body, type) {
  const { id, ids } = body
  switch (type) {
    case 'delete':
      tableListDataSource = tableListDataSource.filter((item) => !ids.includes(item.id))
      break
    case 'add':
      const i = Math.ceil(Math.random() * 10000)
      const record = {
        id: Math.floor(Math.random() * 200) + 101,
        area: '狮子座',
        location: '狮子座',
        name: personList[Math.floor(Math.random() * 200) % personList.length].name,
        englishName: personList[Math.floor(Math.random() * 200) % personList.length].value,
        personType: personTypeList[Math.floor(Math.random() * 200) % personTypeList.length].value,
        desc: typeList[i % typeList.length].name,
        callNo: Math.floor(Math.random() * 1000),
        status: statusList[Math.floor(Math.random() * 10) % statusList.length].name,
        updatedAt: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        createdAt: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        progress: Math.ceil(Math.random() * 100),
        money: Math.ceil(Math.random() * 6000)
      }
      tableListDataSource.unshift(record)
      break
    case 'update':
      tableListDataSource = tableListDataSource.map((item) => {
        if (item.id === id) {
          return { ...body }
        }
        return item
      })
      break
    case 'audit':
      const item = tableListDataSource.find(item => item.id === id)
      const index = statusList.map(item => item.name).indexOf(item.status)
      item.status = statusList[(index + 1) % statusList.length].name
      tableListDataSource = tableListDataSource.map((listItem) => {
        if (listItem.id === id) {
          return { ...item }
        }
        return listItem
      })
      break
    default:
      break
  }
}

export default [
  {
    url: '/mock-server/example/language/list',
    timeout: 500,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      return builder(token, { ...getList(request.query) })
    }
  },
  {
    url: '/mock-server/example/language/import',
    timeout: 2500,
    method: 'post',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      return builder(token, {})
    }
  },
  {
    url: '/mock-server/example/language/info',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      const { id } =request.query
      return builder(token, {
        data: tableListDataSource.find(item => item.id === id),
        code: tableListDataSource.some(item => item.id === id) ? 0 : 500,
        msg: 'success'
      })
    }
  },
  {
    url: '/mock-server/example/language/save',
    timeout: 200,
    method: 'post',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      handleOperation(request.body, 'add')
      return builder(token)
    }
  },
  {
    url: '/mock-server/example/language/update',
    timeout: 200,
    method: 'put',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      handleOperation(request.body, 'update')
      return builder(token)
    }
  },
  {
    url: '/mock-server/example/language/delete',
    timeout: 200,
    method: 'delete',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      handleOperation(request.body, 'delete')
      return builder(token)
    }
  },
  {
    url: '/mock-server/example/language/audit',
    timeout: 200,
    method: 'post',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      handleOperation(request.body, 'audit')
      return builder(token)
    }
  },
] as MockMethod[]
