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
    name: 'JAVA',
    value: 'JAVA',
    memo: 'Java是一种广泛应用于企业级应用程序和开发的高级编程语言。'
  },
  {
    id: 2,
    name: 'javascript',
    value: 'JAVASCRIPT',
    memo: 'JavaScript是一种广泛应用于Web开发的高级脚本语言。'
  },
  {
    id: 3,
    name: 'c++',
    value: 'c++',
    memo: 'C++是一种通用的高级编程语言，是C语言的扩展和增强版本。'
  },
  {
    id: 4,
    name: 'python',
    value: 'python',
    memo: "Python是一种通用编程语言，被广泛应用于Web开发、数据科学、人工智能、科学计算、网络编程等领域。"
  },
]

export const personTypeList: any = [
  "昭和", "平成"
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
  {
    name: '泰罗',
    value: 'TARO',
    type: '昭和'
  },
  {
    name: '雷欧',
    value: 'LEO',
    type: '昭和'
  },
  {
    name: '阿斯特拉',
    value: 'ASTRA',
    type: '昭和'
  },
  {
    name: '爱迪',
    value: 'EIGHTY',
    type: '昭和'
  },
  {
    name: '葛雷',
    value: 'GREAT',
    type: '昭和'
  },
  {
    name: '帕瓦德',
    value: 'POWERED',
    type: '平成'
  },
  {
    name: '哉阿斯',
    value: 'Z-earth',
    type: '平成'
  },
  {
    name: '迪迦',
    value: 'TIGA',
    type: '平成'
  },
  {
    name: '戴拿',
    value: 'DYNA',
    type: '平成'
  },
  {
    name: '盖亚',
    value: 'GAIA',
    type: '平成'
  },
  {
    name: '阿古茹',
    value: 'AGUL',
    type: '平成'
  },
  {
    name: '奈欧斯',
    value: 'NEOS',
    type: '平成'
  },
  {
    name: '纳伊斯',
    value: 'NICE',
    type: '平成'
  },
  {
    name: '高斯',
    value: 'COSMOS',
    type: '平成'
  },
  {
    name: '杰斯提斯',
    value: 'JUSTICE',
    type: '平成'
  },
  {
    name: '奈克斯特',
    value: 'NEXT',
    type: '平成'
  },
  {
    name: '奈克瑟斯',
    value: 'NEXUS',
    type: '平成'
  },
  {
    name: '诺亚',
    value: 'NOA',
    type: '平成'
  },
  {
    name: '麦克斯',
    value: 'MAX',
    type: '平成'
  },
  {
    name: '杰诺',
    value: 'XENON',
    type: '平成'
  },
  {
    name: '梦比优斯',
    value: 'Mebius',
    type: '平成'
  },
  {
    name: '希卡利',
    value: 'HIKARI',
    type: '平成'
  },
  {
    name: '雷杰多',
    value: 'LEGEND',
    type: '平成'
  },
  {
    name: '赛罗',
    value: 'ZERO',
    type: '平成'
  },
  {
    name: '博伊',
    value: 'BOY',
    type: '平成'
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
