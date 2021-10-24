import { Slots } from 'vue'

export type ReturnValue<T extends any[]> = {
  run: (...args: T) => void;
  cancel: () => void;
};

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
