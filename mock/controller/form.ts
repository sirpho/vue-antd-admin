import { MockMethod } from 'vite-plugin-mock'
import { cloneDeep } from 'lodash-es'
import { getRequestToken, requestParams, builder } from '../_util'

const advancedTableData = [
  {
    key: '1',
    workId: '00001',
    name: 'John Brown',
    department: 'New York No. 1 Lake Park'
  },
  {
    key: '2',
    workId: '00002',
    name: 'Jim Green',
    department: 'London No. 1 Lake Park'
  },
  {
    key: '3',
    workId: '00003',
    name: 'Joe Black',
    department: 'Sidney No. 1 Lake Park'
  }
]

export default [
  {
    url: '/mock-server/basicForm',
    method: 'post',
    response: (request: requestParams) => {
      let data = {}
      const token = getRequestToken(request)
      if (token) data = {
        title: 'gx12358',
        startTime: '2021-09-26 00:00:00',
        endTime: '2021-09-26 00:00:00',
        goal: '赚钱',
        standard: '厉害',
        client: 'sf12358',
        invites: 'gf12358',
        weight: '150',
        publicType: '2',
        publicUsers: '1'
      }
      return {
        code: 200,
        msg: 'success',
        data
      }
    }
  },
  {
    url: '/mock-server/stepForm',
    method: 'post',
    response: (request: requestParams) => {
      let stepData = {}
      const token = getRequestToken(request)
      if (token) stepData = {
        payAccount: 'ant-design@alipay.com',
        receiverAccount: 'test@example.com',
        receiverName: 'Alex',
        amount: '500000000',
        receiverMode: 'alipay'
      }
      return {
        code: 200,
        msg: 'success',
        data: stepData
      }
    }
  },
  {
    url: '/mock-server/advancedForm',
    method: 'post',
    response: (request: requestParams) => {
      let advancedData = {}
      const token = getRequestToken(request)
      if (token) {
        advancedData = [
          {
            key: '1',
            workId: '00001',
            name: 'John Brown',
            department: 'New York No. 1 Lake Park'
          },
          {
            key: '2',
            workId: '00002',
            name: 'Jim Green',
            department: 'London No. 1 Lake Park'
          },
          {
            key: '3',
            workId: '00003',
            name: 'Joe Black',
            department: 'Sidney No. 1 Lake Park'
          }
        ]
      }
      return {
        code: 200,
        msg: 'success',
        data: advancedData
      }
    }
  },
  {
    url: '/mock-server/advancedFormTable',
    method: 'post',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      return builder(token, {
        data: cloneDeep(advancedTableData)
      })
    }
  },
  {
    url: '/mock-server/advancedFormTable/delete',
    method: 'post',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      const { id } = request.body
      return builder(token, {
        data: cloneDeep(advancedTableData).filter(item => item.key !== id),
        code: id ? 200 : 500
      })
    }
  }
] as MockMethod[]
