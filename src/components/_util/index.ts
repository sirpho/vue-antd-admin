import { Slots } from 'vue'

import isServer from './isServer'

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

export function getSlotVNode<T>(slots: Slots, props: Record<string, unknown>, prop = 'default'): T | false {
  if (props[prop] === false) {
    return false
  }
  return (props[prop] || slots[prop]?.()) as T
}

export function getSlot<T>(slots: Slots, props: Record<string, unknown>, prop = 'default'): T | false {
  if (props[prop] === false) {
    // force not render
    return false
  }
  return (props[prop] || slots[prop]) as T
}

/** Type */
export * from './typings'

export { noteOnce } from 'ant-design-vue/es/vc-util/warning'

export {
  isServer
}
