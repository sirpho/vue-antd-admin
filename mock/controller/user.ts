import { MockMethod } from 'vite-plugin-mock'

const accessTokens = {
  admin: 'example-token'
}

const account = {
  admin: 'admin'
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
      return {
        code: 0,
        data: {
          token: accessToken,
          permissions: [
            'example',
            'example:language',
            'example:compiler',
            'example:compiler:java',
            'example:compiler:python'
          ],
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
