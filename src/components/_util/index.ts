import { Slots } from 'vue'
import { camelize } from '@vue/shared'
import isServer from './isServer'

export type AnyFunction<T> = (...args: any[]) => T

export const getStyle = function (
  element: HTMLElement,
  styleName: string
): string {
  if (isServer) return ''
  if (!element || !styleName) return ''
  styleName = camelize(styleName)
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    const style = element.style[styleName]
    if (style) return style
    const computed = document?.defaultView?.getComputedStyle(element, '')
    return computed ? computed[styleName] : ''
  } catch (e) {
    return element.style[styleName]
  }
}

export const isScroll = (
  el: HTMLElement,
  isVertical?: Nullable<boolean>
) => {
  if (isServer) return
  const determinedDirection = isVertical === null || isVertical === undefined
  const overflow = determinedDirection
    ? getStyle(el, 'overflow')
    : isVertical
      ? getStyle(el, 'overflow-y')
      : getStyle(el, 'overflow-x')

  return overflow.match(/(scroll|auto|overlay)/)
}

export function rafThrottle<T extends AnyFunction<any>>(fn: T): AnyFunction<void> {
  let locked = false
  return function (...args: any[]) {
    if (locked) return
    locked = true
    window.requestAnimationFrame(() => {
      fn.apply(this, args)
      locked = false
    })
  }
}

export const isFirefox = function (): boolean {
  return !isServer && !!window.navigator.userAgent.match(/firefox/i)
}

export const getScrollContainer = (
  el: HTMLElement,
  isVertical?: Nullable<boolean>
) => {
  if (isServer) return

  let parent: HTMLElement = el
  while (parent) {
    if ([ window, document, document.documentElement ].includes(parent)) {
      return window
    }
    if (isScroll(parent, isVertical)) {
      return parent
    }
    parent = parent.parentNode as HTMLElement
  }
  return parent
}

export const isInContainer = (
  el: HTMLElement,
  container: HTMLElement
): boolean => {
  if (isServer || !el || !container) return false

  const elRect = el.getBoundingClientRect()
  let containerRect: any

  if (
    [ window, document, document.documentElement, null, undefined ].includes(
      container
    )
  ) {
    containerRect = {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0
    }
  } else {
    containerRect = container.getBoundingClientRect()
  }
  return (
    elRect.top < containerRect.bottom &&
    elRect.bottom > containerRect.top &&
    elRect.right > containerRect.left &&
    elRect.left < containerRect.right
  )
}

export interface prefixCls {
  suffixCls?: string;
  customizePrefixCls?: string;
  defaultPrefixCls?: string;
}

export const getPrefixCls = ({
  suffixCls,
  customizePrefixCls,
  defaultPrefixCls = 'wd-pro'
}: prefixCls) => {
  if (customizePrefixCls) return customizePrefixCls
  return suffixCls ? `${defaultPrefixCls}-${suffixCls}` : defaultPrefixCls
}

export function getPropsSlot(slots: Slots, props: Record<string, any>, prop = 'default') {
  return props[prop] || slots[prop]?.()
}

export function getPropsSlotfn(slots: Slots, props: Record<string, any>, prop = 'default') {
  return props[prop] || slots[prop]
}

export const omitUndefined = <T>(obj: T): T => {
  const newObj = {} as T
  Object.keys(obj || {}).forEach((key) => {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key]
    }
  })
  if (Object.keys(newObj).length < 1) {
    return {} as any
  }
  return newObj
}
