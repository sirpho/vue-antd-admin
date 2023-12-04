import dayjs from "dayjs";
const units = ['H', 'K', 'M']
export const formatPower = (value) => {
  let unit = ''
  for(const item of units) {
    unit = item
    if(value >= 1024) {
      value = value / 1024
    } else {
      break
    }
  }
  return `${value.toFixed?.(2)}${unit}`
}

export const formatTime = (value) => {
  return dayjs(new Date(value)).format('MM-DD HH:mm')
}

export const formatPercentageTime = (percentage, startTime, endTime) => {
  const diff = endTime - startTime
  const targetTime = percentage * diff + startTime
  return formatTime(targetTime)
}
