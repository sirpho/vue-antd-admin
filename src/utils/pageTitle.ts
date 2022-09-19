import config from '/config/config'

const { title, titleReverse, titleSeparator } = config.defaultSettings

/**
 * @description 设置标题
 * @param pageTitle
 * @returns {string}
 */
export default function getPageTitle(pageTitle: string) {
  let newTitles: any = []
  if (pageTitle) newTitles.push(pageTitle)
  if (title) newTitles.push(title)
  if (titleReverse) newTitles = newTitles.reverse()
  return newTitles.join(titleSeparator)
}
