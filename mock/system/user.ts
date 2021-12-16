import { MockMethod } from 'vite-plugin-mock'
import dayjs from 'dayjs'
import { resultError, resultSuccess, getRequestToken, requestParams } from '../_util'

interface RolesInfo {
  roleId: number;
  roleKey: string;
  roleName: string;
  status: string;
}

const accessTokens = {
  gx12358: 'gx-accessToken',
  admin: 'admin-accessToken',
  editor: 'editor-accessToken',
  test: 'test-accessToken'
}

export default [
  {
    url: '/mock-server/login',
    method: 'post',
    response: ({ body }) => {
      const { userName, password } = body
      const accessToken = accessTokens[userName]
      if (!accessToken || (userName === 'gx12358' && password !== 'aa123456')) {
        return {
          code: 500,
          msg: '帐户或密码不正确。'
        }
      }
      return {
        code: 200,
        msg: 'success',
        data: { accessToken }
      }
    }
  },
  {
    url: '/mock-server/socialLogin',
    method: 'post',
    response: ({ body }) => {
      const { code } = body
      if (!code) {
        return {
          code: 500,
          msg: '未成功获取Token。'
        }
      }
      return {
        code: 200,
        msg: 'success',
        data: { accessToken: accessTokens['admin'] }
      }
    }
  },
  {
    url: '/mock-server/register',
    method: 'post',
    response: () => {
      return {
        code: 200,
        msg: '模拟注册成功'
      }
    }
  },
  {
    url: '/mock-server/userInfo',
    method: 'post',
    response: ({ body }) => {
      const { accessToken } = body
      let userId: number | null = null
      let roles: string[] = []
      let rolesInfo: RolesInfo[] = []
      let roleIds: number[] = []
      let permissions: string[] = []
      let userName = ''
      let nickName = ''
      if ('gx-accessToken' === accessToken) {
        userId = 999
        rolesInfo = [
          {
            roleId: 1,
            roleKey: 'gx-admin',
            roleName: 'gx12358-超级管理员',
            status: '0'
          }
        ]
        roles = rolesInfo.map(item => item.roleKey)
        roleIds = rolesInfo.map(item => item.roleId)
        permissions = ['*:*:*']
        userName = '高翔'
        nickName = 'gx12358'
      }
      if ('admin-accessToken' === accessToken) {
        userId = 1
        rolesInfo = [
          {
            roleId: 1,
            roleKey: 'admin',
            roleName: '超级管理员',
            status: '0'
          }
        ]
        roles = rolesInfo.map(item => item.roleKey)
        roleIds = rolesInfo.map(item => item.roleId)
        permissions = [
          'proTable:button:add',
          'proTable:button:1',
          'proTable:button:2',
          'proTable:button:3'
        ]
        userName = 'admin'
        nickName = 'admin'
      }
      if ('editor-accessToken' === accessToken) {
        userId = 2
        rolesInfo = [
          {
            roleId: 2,
            roleKey: 'editor',
            roleName: '编辑人员',
            status: '0'
          }
        ]
        roles = rolesInfo.map(item => item.roleKey)
        roleIds = rolesInfo.map(item => item.roleId)
        permissions = []
        userName = '高翔-editor'
        nickName = 'gx12358-editor'
      }
      if ('test-accessToken' === accessToken) {
        userId = 3
        rolesInfo = [
          {
            roleId: 1,
            roleKey: 'admin',
            roleName: '超级管理员',
            status: '0'
          },
          {
            roleId: 2,
            roleKey: 'editor',
            roleName: '编辑人员',
            status: '0'
          }
        ]
        roles = rolesInfo.map(item => item.roleKey)
        roleIds = rolesInfo.map(item => item.roleId)
        permissions = [
          'proTable:button:add',
          'proTable:button:1',
          'proTable:button:2',
          'proTable:button:3'
        ]
        userName = '高翔-test'
        nickName = 'gx12358-test'
      }
      return {
        code: 200,
        msg: 'success',
        roles,
        permissions,
        user: {
          admin: userId === 1 || userId === 999,
          userId,
          roles: rolesInfo,
          roleIds,
          userName,
          nickName,
          'avatar|1': [
            'https://ahtv-obs.obs.cn-north-4.myhuaweicloud.com/15918_100.gif',
            'https://ahtv-obs.obs.cn-north-4.myhuaweicloud.com/15922_100.gif',
            'https://ahtv-obs.obs.cn-north-4.myhuaweicloud.com/20211111162748.jpg'
          ],
          loginDate: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
      }
    }
  },
  {
    url: '/mock-server/logout',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const { userName } = request.query
      const token = getRequestToken(request)
      if (!token) return resultError('Invalid token')
      const checkUser = accessTokens[userName]
      if (!checkUser) {
        return resultError('Invalid token!')
      }
      return resultSuccess(undefined, { msg: 'Token has been destroyed' })
    }
  }
] as MockMethod[]
