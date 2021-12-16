import { Fragment, Slots } from 'vue'
import { camelize } from '@vue/shared'

import LabelIconTip from './components/LabelIconTip'
import FieldLabel from './components/FieldLabel'
import FilterDropdown from './components/FilterDropdown'
import DropdownFooter from './components/DropdownFooter'

import isServer from './isServer'

import isNil from './isNil'
import { call, MaybeArray } from './call'
import pickProProps from './pickProProps'
import omitUndefined from './omitUndefined'
import isDropdownValueType from './isDropdownValueType'
import pickProFormItemProps from './pickProFormItemProps'
import scrollTo from './scroll/scrollTo'
import getScroll from './scroll/getScroll'
import throttleByAnimationFrame from './scroll/throttleByAnimationFrame'
import addEventListener from './dom/addEventListener'

/** Hooks */
import useFetchData from './hooks/useFetchData'
import type { ProRequestData } from './hooks/useFetchData'
import dateArrayFormatter from './dateArrayFormatter'
import parseValueToMoment from './parseValueToMoment'
import conversionMomentValue, { dateFormatterMap } from './conversionMomentValue'
import transformKeySubmitValue from './transformKeySubmitValue'
import isDeepEqualReact from './isDeepEqualReact'

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

export interface prefixCls {
  suffixCls?: string;
  customizePrefixCls?: string;
  isPor?: boolean;
  className?: string;
}

export const getPrefixCls = ({
  suffixCls,
  customizePrefixCls,
  isPor,
  className
}: prefixCls) => {
  const prefixCls = className || (isPor ? `gx-pro`: 'gx')
  if (customizePrefixCls) return customizePrefixCls
  return suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls
}

export function getPropsSlot(slots: Slots, props: RecordType, prop = 'default') {
  return props[prop] || slots[prop]?.()
}

export function getPropsSlotfn(slots: Slots, props: RecordType, prop = 'default') {
  return props[prop] || slots[prop]
}

export function get(entity: any, path: (string | number)[]) {
  let current = entity

  for (let i = 0; i < path.length; i += 1) {
    if (current === null || current === undefined) {
      return undefined
    }

    current = current[path[i]]
  }

  return current
}

function internalSet<Entity = any, Output = Entity, Value = any>(
  entity: Entity,
  paths: (string | number)[],
  value: Value,
  removeIfUndefined: boolean
): Output {
  if (!paths.length) {
    return (value as unknown) as Output
  }

  const [ path, ...restPath ] = paths

  let clone: Output
  if (!entity && typeof path === 'number') {
    clone = ([] as unknown) as Output
  } else if (Array.isArray(entity)) {
    clone = ([ ...entity ] as unknown) as Output
  } else {
    clone = ({ ...entity } as unknown) as Output
  }

  // Delete prop if `removeIfUndefined` and value is undefined
  if (removeIfUndefined && value === undefined && restPath.length === 1) {
    delete clone[path][restPath[0]]
  } else {
    clone[path] = internalSet(clone[path], restPath, value, removeIfUndefined)
  }

  return clone
}

export function set<Entity = any, Output = Entity, Value = any>(
  entity: Entity,
  paths: (string | number)[],
  value: Value,
  removeIfUndefined = false
): Output {
  // Do nothing if `removeIfUndefined` and parent object not exist
  if (
    paths.length &&
    removeIfUndefined &&
    value === undefined &&
    !get(entity, paths.slice(0, -1))
  ) {
    return (entity as unknown) as Output
  }

  return internalSet(entity, paths, value, removeIfUndefined)
}

export const getSlotChildren = (slots, name = 'default') => slots[name]?.().length === 1 && (
  slots[name]?.()[0].type === Fragment ||
  String(slots[name]?.()[0].type) === String(Symbol())
)
  ? slots[name]?.()[0].children || []
  : slots[name]?.() || []

/** Type */
export * from './typings'

export type {
  MaybeArray,
  ProRequestData
}

export { noteOnce } from 'ant-design-vue/es/vc-util/warning'

export {
  isServer,
  isNil,
  call,
  scrollTo,
  getScroll,
  pickProProps,
  omitUndefined,
  FieldLabel,
  LabelIconTip,
  FilterDropdown,
  DropdownFooter,
  useFetchData,
  dateFormatterMap,
  isDeepEqualReact,
  dateArrayFormatter,
  isDropdownValueType,
  pickProFormItemProps,
  addEventListener,
  conversionMomentValue,
  parseValueToMoment,
  transformKeySubmitValue,
  throttleByAnimationFrame
}
