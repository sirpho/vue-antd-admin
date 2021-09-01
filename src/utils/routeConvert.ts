import { deepCopy } from '/@/utils/util'

export function convertRoutes(nodes: any) {
  if (!nodes) return null
  nodes = deepCopy(nodes)
  let queue = Array.isArray(nodes) ? nodes.concat() : [ nodes ]
  while (queue.length) {
    const levelSize = queue.length
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()
      if (!node.children || !node.children.length) continue
      node.children.forEach(child => {
        // 转化相对路径
        if (child.path[0] !== '/' && !child.path.startsWith('http')) {
          child.path = node.path.replace(/(\w*)[/]*$/, `$1/${child.path}`)
        }
      })
      queue = queue.concat(node.children)
    }
  }
  return nodes
}

export function getFirstLastChild(data: any[]) {
  let newPath
  // 获取第一个children的path
  const getRoutePath = function (newdata) {
    let firstPath = ''
    if (newdata.children && newdata.children.length > 0) {
      firstPath = getRoutePath(newdata.children[0])
    } else {
      firstPath = `${newdata.path}`
    }
    return firstPath
  }
  if (data[0].children && data[0].children.length > 0) {
    newPath = getRoutePath(data[0].children[0])
  } else {
    newPath = data[0].path
  }
  return newPath
}

export function getLastFirstChild(data: any[], path: string | undefined) {
  let newPath = ''
  let checkPath = false
  // 获取第一个children的path
  const getRoutePath = function (newdata: any[], acttivePath: string) {
    let childrenPath = ''
    newdata.map((item: any) => {
      if (!checkPath) {
        if (item.path === path) {
          childrenPath = acttivePath
        } else if (item.children && item.children.length > 0) {
          childrenPath = getRoutePath(item.children, acttivePath)
        }
        if (childrenPath) {
          checkPath = true
        }
      }
      return item
    })
    return childrenPath
  }
  data.map((item: any) => {
    if (!checkPath) {
      if (item.path === path) {
        newPath = item.path
      } else if (item.children && item.children.length > 0) {
        newPath = getRoutePath(item.children, item.path)
      }
    }
    return item
  })
  return newPath
}
