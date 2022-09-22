import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event: any = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

/**
 * @description 去除空格
 */
export function trim(str: string, isGlobal?: boolean) {
  if (typeof str === 'undefined' || str.length === 0) return ''
  let result
  result = str.replace(/(^\s+)|(\s+$)/g, '')
  if (isGlobal) {
    result = result.replace(/\s/g, '')
  }
  return result
}

/**
 * @description 参数处理
 */
export function tansParams(params) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    const part = encodeURIComponent(propName) + '='
    if (value !== null && typeof (value) !== 'undefined' && value !== '') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && typeof (value[key]) !== 'undefined') {
            const params = propName + '[' + key + ']'
            const subPart = encodeURIComponent(params) + '='
            result += subPart + encodeURIComponent(value[key]) + '&'
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&'
      }
    }
  }
  return result
}

/**
 * @description 如果是个方法执行一下它
 */
export function runFunction<T extends any[]>(valueEnum: any, ...rest: T) {
  if (typeof valueEnum === 'function') {
    return valueEnum(...rest)
  }
  return valueEnum
}

/**
 * @description 处理表格字段为空
 */
export function handleField(str: any, customize: any) {
  const stringNull = [ 'null', 'undefined' ]
  let success = true
  if (str === 0) {
    success = true
  } else if (stringNull.includes(str)) {
    success = false
  } else if (!str) {
    success = false
  }
  if (success) {
    return {
      value: str,
      success
    }
  }
  return {
    value: customize === '' ? customize : customize || '-',
    success
  }
}

/**
 * @description 数组去重
 */
export function arrayRepeat(data: any[]) {
  const set = new Set(data)
  return Array.from(set)
}

/**
 * @description 添加序号
 */
export function getSortIndex(
  data: any[] = [],
  pageConfig = {} as {
    current?: number;
    pageSize?: number | boolean;
  } | boolean,
  childrenKey = 'children'
) {
  function getChildSortIndex(parentSort, data) {
    return data.map((item, index) => {
      const sortIndex = `${parentSort}-${index + 1}`
      if (item[childrenKey]) item[childrenKey] = getChildSortIndex(sortIndex, item[childrenKey])
      item.sortIndex = sortIndex
      return item
    })
  }

  return cloneDeep(data).map((item: any, index: number) => {
    let sortIndex = index
    if (pageConfig) {
      const current = pageConfig?.['current'] || 1
      const pageSize = pageConfig?.['pageSize'] || 10
      sortIndex = current ? (current - 1) * pageSize + (index + 1) : index + 1
    }
    if (item[childrenKey]) item[childrenKey] = getChildSortIndex(sortIndex, item[childrenKey])
    item.sortIndex = sortIndex
    return item
  })
}

/**
 * @description 判断删除是否到当前页最后一条
 */
export function handleCurrentPage(pageConfig = {} as {
  current: number;
  pageSize: number | undefined;
  total: number | undefined;
}, number) {
  const { pageSize = 10, total = 0 } = pageConfig
  let { current = 1 } = pageConfig
  if (
    total - number <= pageSize * (current - 1)
  ) {
    current = current - 1
  }
  return current === 0 ? 1 : current
}

/**
 * @description 处理table多选回显补全选中Item信息
 */
export function completionTableItem(config: {
  key: string;
  data: any[];
  selectItems: any[];
}) {
  let { selectItems } = config
  const { data, key } = config
  selectItems = selectItems.map((item: any) => {
    const findItem = data.find(el => Number(el[key]) === Number(item[key]))
    if (findItem) {
      return {
        ...item,
        ...findItem
      }
    }
    return item
  })
  return cloneDeep(selectItems)
}

/**
 * @description 处理table多选翻页 selectItems 丢失问题
 */
export function handleSelectPage(config: {
  rowKey?: string;
  tableData: any[];
  selectItems: any[];
  oldSelectItems: any[];
}) {
  const {
    tableData,
    oldSelectItems,
    selectItems,
    rowKey = 'id'
  } = config
  const currentSelectItems = oldSelectItems.filter((item: any) => tableData.some(el =>
    el[rowKey] === item[rowKey])
  )
  let newSelectItems = cloneDeep(oldSelectItems)
  if (currentSelectItems.length < selectItems.length) {
    const pushItems = selectItems.filter((item: any) => !currentSelectItems.find(el =>
      el[rowKey] === item[rowKey])
    )
    pushItems.map((item: any) => {
      newSelectItems.push(item)
      return item
    })
  } else {
    const filterItems = currentSelectItems.filter((item: any) =>
      !selectItems.find((el: any) => el[rowKey] === item[rowKey])
    )
    newSelectItems = newSelectItems.filter((item: any) =>
      !filterItems.find((el: any) => el[rowKey] === item[rowKey])
    )
  }
  return newSelectItems
}

/**
 * @description 排序（从小到大）
 */
export function compareToMax(obj1, obj2, key) {
  const val1 = obj1[key]
  const val2 = obj2[key]
  let result = 0
  if (val1 < val2) {
    result = -1
  } else if (val1 > val2) {
    result = 0
  }
  return result
}

/**
 * @description 时长格式转换
 */
export function formatDuraton(time: number) {
  let newTime = ''
  if (time > -1) {
    const hour = Math.floor(time / 3600)
    const min = Math.floor(time / 60) % 60
    const sec = parseInt((time % 60))
    if (hour < 10) {
      newTime = '0' + hour + ':'
    } else {
      newTime = hour + ':'
    }
    if (min < 10) {
      newTime += '0'
    }
    newTime += min + ':'
    if (sec < 10) {
      newTime += '0'
    }
    newTime += sec
  }

  return newTime.split(':')[0] === '00' ? `${newTime.split(':')[1]}:${newTime.split(':')[2]}` : newTime
}

/**
 * @description 随机uuid
 */
export function getRandomNumber() {
  const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  return {
    uuid(len?: number, rad?: number) {
      const chars = CHARS
      const uuid: any = []
      const radix = rad || chars.length
      let i
      let r
      if (len) {
        for (i = 0; i < len; i += 1) {
          uuid[i] = chars[0 || parseInt(Math.random() * radix)]
        }
      } else {
        uuid[8] = '-'
        uuid[13] = '-'
        uuid[18] = '-'
        uuid[23] = '-'
        uuid[14] = '4'
        for (i = 0; i < 36; i += 1) {
          if (!uuid[i]) {
            r = 0 || Math.random() * 16
            uuid[i] = chars[i === 19 ? (r && 0x3) || 0x8 : r]
          }
        }
      }
      return uuid.join('')
    },
    uuidFast() {
      const chars = CHARS
      const uuid = new Array(36)
      let rnd: any = 0
      let r
      let i
      for (i = 0; i < 36; i += 1) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
          uuid[i] = '-'
        } else if (i === 14) {
          uuid[i] = '4'
        } else {
          if (rnd <= 0x02) {
            rnd = 0x2000000 + Math.random() * 0x1000000 || 0
          }
          r = rnd && 0xf
          rnd = rnd > 4
          uuid[i] = chars[i === 19 ? (r && 0x3) || 0x8 : r]
        }
      }
      return uuid.join('')
    },
    uuidString() {
      const str = this.uuidFast().replace(new RegExp('-', 'g'), '')
      return str
    },
    uuidCompact() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 || 0
        const v = c === 'x' ? r : (r && 0x3) || 0x8
        return v.toString(16)
      })
    }
  }
}

export function getMaxFloor(treeData: any[] = []) {
  let max = 0

  function each(data: any[] = [], floor) {
    data.forEach((e: any) => {
      e.floor = floor
      if (floor > max) {
        max = floor
      }
      if (e.children && e.children.length > 0) {
        each(e.children, floor + 1)
      }
    })
  }

  each(treeData, 1)
  return max
}

/**
 * @description 树形转平级
 */
export function getLevelData(data, filed = 'children') {
  let newData: any[] = []
  data.forEach((item) => {
    newData.push(item)
    if (item[filed] && item[filed].length > 0) {
      newData = newData.concat(getLevelData(item[filed]))
    }
  })
  return newData
}

/**
 * 构造树型结构数据
 * @param {*} source 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function treeData(
  source: any[],
  id: string,
  parentId?: string,
  children?: string,
  rootId?: number
) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || 0
  const cloneData = cloneDeep(source) // 对源数据深度克隆
  return cloneData.filter((father: any) => {
    const branchArr = cloneData.filter((child: any) => father[id] === child[parentId || 'parentId'])// 返回每一项的子级数组
    branchArr.length > 0 ? father[children || 'children'] = branchArr : delete father[children || 'children']// 如果存在子级，则给父级添加一个children属性，并赋值
    return father[parentId || 'parentId'] === rootId // 返回第一层
  })
}

export function mGetDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const d = new Date(year, month, 0)
  return d.getDate()
}

/**
 * @description 处理时间展示（dayjs）
 */
export function momentFromNow(time) {
  return dayjs(time).fromNow()
}

/**
 * @description 处理时间展示，若干分钟前
 */
export function handleTimeShow(date: string) {
  const date3 = new Date().getTime() - new Date(date.replace(/\-/g, '/')).getTime() // 时间差的毫秒数
  const days = Math.floor(date3 / (24 * 3600 * 1000))
  // 计算出小时数
  const leave1 = date3 % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  const hours = Math.floor(leave1 / (3600 * 1000))
  // 计算相差分钟数
  const leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  const minutes = Math.floor(leave2 / (60 * 1000))
  // 计算相差秒数
  const leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
  const seconds = Math.round(leave3 / 1000)
  if (
    days === 0 &&
    hours === 0 &&
    minutes === 0 &&
    seconds < 60
  ) {
    return '刚刚'
  } else if (
    days === 0 &&
    hours === 0 &&
    minutes < 60
  ) {
    return `${minutes}分钟前`
  } else if (
    days === 0 &&
    hours < 24
  ) {
    return `${hours}小时前`
  } else if (
    days < mGetDate()
  ) {
    return dayjs(date.replace(/\-/g, '/')).format('MM-dd hh:mm')
  } else {
    return dayjs(date.replace(/\-/g, '/')).format('yyyy-MM-dd')
  }
}

/**
 * @description blob对象转blob字符串
 */
export function getBlobUrl(blob: Blob) {
  return URL.createObjectURL(blob)
}

/**
 * @description 获取图片base64码
 */
export function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

/**
 * @description base转blob对象
 */
export function dataURLtoBlob(dataurl: any): Blob {
  const arr: any[] = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([ u8arr ], { type: mime })
}

/**
 * @description base64码转file文件
 */
export function dataURLtoFile(dataurl: string, filename: string) {
  const arr: any[] = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([ u8arr ], filename, { type: mime })
}

/**
 * @description 截取视频时间戳
 */
export function getVideoFileUrl(url = '') {
  const index = url.indexOf('?')
  return index > 0 ? `${url.substring(0, index)}` : url
}

/**
 * @description 获取文件后缀名
 */
export function getFileSuffix(url = '') {
  url = getVideoFileUrl(url)
  const index = url.lastIndexOf('.')
  return index > 0 ?
    `${url.substring(index).split('?')[0]}`.split('.')[1]
    :
    ''
}

/**
 * @description 判断是否是base64码
 */
export function isBase64(str = '') {
  const fileDataBase = ['data:image/', 'data:video/', 'data:audio/']
  return str && fileDataBase.find((item) => str.includes(item))
}


export function handleOffsetTop(targetNode: HTMLInputElement) {
  let totalLeft = 0
  let totalTop = 0
  if (!targetNode) return { left: totalLeft, top: totalTop }
  let parentNode = <HTMLElement>targetNode.offsetParent
  //首先把自己本身的相加
  totalLeft += targetNode.offsetLeft
  totalTop += targetNode.offsetTop
  //现在开始一级一级往上查找，只要没有遇到body，我们就把父级参照物的边框和偏移相加
  while (parentNode) {
    if (navigator.userAgent.indexOf('MSIE 8.0') === -1) {
      //不是IE8我们才进行累加父级参照物的边框
      totalTop += parentNode.clientTop
      totalLeft += parentNode.clientLeft
    }
    //把父级参照物的偏移相加
    totalTop += parentNode.offsetTop
    totalLeft += parentNode.offsetLeft
    parentNode = <HTMLElement>parentNode.offsetParent
  }
  return { left: totalLeft, top: totalTop }
}
