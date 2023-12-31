import { MockMethod } from 'vite-plugin-mock'

const accessTokens = {
  admin: 'example-token',
  sirpho: 'example-token',
}

const account = {
  admin: 'admin',
  sirpho: 'sirpho',
}

export default [
  {
    url: '/mock-server/sys/login',
    method: 'post',
    response: ({ body }) => {
      const { userName, password } = body
      const accessToken = accessTokens[userName]
      if (account[userName] !== password || !accessToken) {
        return {
          code: 500,
          msg: '帐户或密码不正确。'
        }
      }
      const permissions = [
        'example',
        'example:language',
        'example:compiler',
        'example:compiler:java',
        'example:compiler:python',
      ]
      if(userName === 'sirpho') {
        permissions.push('example:visualization')
      }
      return {
        code: 0,
        data: {
          token: accessToken,
          permissions,
          user: {
            id: 1,
            uid: 'admin',
            uname: 'admin'
          }
        },
        msg: 'success'
      }
    }
  }
] as MockMethod[]
