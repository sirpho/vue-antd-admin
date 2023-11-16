import {builder, getRequestToken, requestParams} from "../_util";
import {MockMethod} from "vite-plugin-mock";

export const statusList: any = [
  {
    id: 1,
    name: '待提交',
    value: 'save'
  },
  {
    id: 2,
    name: '审核中',
    value: 'review'
  },
  {
    id: 3,
    name: '已生效',
    value: 'success'
  },
  {
    id: 4,
    name: '驳回',
    value: 'reject'
  },
]
export const typeList: any = [
  {
    id: 1,
    name: 'java',
    value: 'JAVA',
    memo: '一种跨平台的高级编程语言，常用于开发企业级应用、Android应用、大型系统等。'
  },
  {
    id: 2,
    name: 'javascript',
    value: 'JAVASCRIPT',
    memo: '一种用于前端开发的脚本语言，常用于网页交互和动态内容的实现。'
  },
  {
    id: 3,
    name: 'c++',
    value: 'C++',
    memo: '一种面向对象的编程语言，是C语言的扩展，用于系统开发、游戏开发、图形界面等。'
  },
  {
    id: 4,
    name: 'python',
    value: 'PYTHON',
    memo: "Python是一种通用编程语言，被广泛应用于Web开发、数据科学、人工智能、科学计算、网络编程等领域。"
  },
  {
    id: 5,
    name: 'ruby',
    value: 'RUBY',
    memo: "一种简洁灵活的编程语言，主要用于Web开发和脚本编程。"
  },
  {
    id: 6,
    name: 'go',
    value: 'GO',
    memo: "一种由Google开发的静态类型编程语言，注重简洁、高效和并发编程。"
  },
]

export const personTypeList: any = [
  "脚本语言", "高级语言"
]
export const personList: any = [
  {
    name: '佐菲',
    value: 'ZOFFY',
    type: '昭和'
  },
  {
    name: '初代',
    value: 'Ultraman',
    type: '昭和'
  },
  {
    name: '赛文',
    value: 'SEVEN',
    type: '昭和'
  },
  {
    name: '杰克',
    value: 'JACK',
    type: '昭和'
  },
  {
    name: '艾斯',
    value: 'ACE',
    type: '昭和'
  },
]

export default [
  {
    url: '/mock-server/dict/status/list',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      return builder(token, {
        data: statusList
      })
    }
  },
  {
    url: '/mock-server/dict/type/list',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      return builder(token, {
        data: typeList
      })
    }
  },
  {
    url: '/mock-server/dict/person/type/list',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      return builder(token, {
        data: personTypeList
      })
    }
  },
  {
    url: '/mock-server/dict/person/list',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      return builder(token, {
        data: personList
      })
    }
  },
] as MockMethod[]
