export function snapToGrid(grid: number[], pendingX: number, pendingY: number, scale: number = 1) {
  const x = Math.round((pendingX / scale) / grid[0]) * grid[0]
  const y = Math.round((pendingY / scale) / grid[1]) * grid[1]
  return [ x, y ] as number[]
}

export function getSize(el: Element) {
  const rect = el.getBoundingClientRect()
  return [
    parseInt(rect.width),
    parseInt(rect.height)
  ] as number[]
}

export function computeWidth(parentWidth: number, left: number, right: number) {
  return parentWidth - left - right
}

export function computeHeight(parentHeight: number, top: number, bottom: number) {
  return parentHeight - top - bottom
}

export function restrictToBounds(value: number, min: number | null, max: number | null) {
  if (min !== null && value < min) {
    return min
  }
  if (max !== null && max < value) {
    return max
  }
  return value
}
