export function getFirstLastChild(data: any[]) {
  let newPath
  // 获取第一个children的path
  const getRoutePath = function (newData) {
    let firstPath = ''
    if (newData.children && newData.children.length > 0) {
      firstPath = getRoutePath(newData.children[0])
    } else {
      firstPath = `${newData.path}`
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
