import dayjs from 'dayjs'
import { getRandomNumber } from './util'

/**
 * @description 修改文件名
 */
export const fileName = (file: File, name = 'video', fullName?: boolean) => {
  const names = file.name.split('.')
  const time1 = dayjs().format('YYYYMMDD')
  const uuid = name + '/' + time1 + '/' + getRandomNumber().uuid(10)
  if (fullName) return name
  if (names.length > 1) {
    return uuid + '.' + names[names.length - 1]
  } else {
    return uuid
  }
}
