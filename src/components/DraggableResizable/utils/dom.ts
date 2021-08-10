import { isFunction } from './fns'

export function matchesSelectorToParentElements(el: Element, selector: string, baseNode: Element) {
  let node: any = el
  const matchesSelectorFunc: any = [
    'matches',
    'webkitMatchesSelector',
    'mozMatchesSelector',
    'msMatchesSelector',
    'oMatchesSelector'
  ].find((func: string) => isFunction(node[func]))
  if (!isFunction(node[matchesSelectorFunc])) return false
  do {
    if (node[matchesSelectorFunc](selector)) return true
    if (node === baseNode) return false
    node = node.parentNode
  } while (node)
  return false
}

export function getComputedSize($el: Element) {
  const style = window.getComputedStyle($el)
  return [
    parseFloat(style.getPropertyValue('width')),
    parseFloat(style.getPropertyValue('height'))
  ]
}

export function addEvent(el: Element | Window, event: string, handler: () => void) {
  if (!el) {
    return
  }
  if (el.addEventListener) {
    el.addEventListener(event, handler, true)
  } else {
    el['on' + event] = handler
  }
}

export function removeEvent(el: Element | Window, event: string, handler: () => void) {
  if (!el) {
    return
  }
  if (el.removeEventListener) {
    el.removeEventListener(event, handler, true)
  } else {
    el['on' + event] = null
  }
}
