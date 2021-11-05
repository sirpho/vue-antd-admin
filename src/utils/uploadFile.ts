import moment from 'moment'

const guid = () => {
  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}
export const fileName = (file: File, bucketName?: string) => {
  const arr = file.name.split('.')
  const time1 = moment().format('YYYYMMDD')
  const uuid = bucketName ?
    bucketName + '/' + time1 + '/' + guid()
    :
    'wd' + '/' + time1 + '/' + guid()
  if (arr.length > 1) {
    return uuid + '.' + arr[arr.length - 1]
  } else {
    return uuid
  }
}
