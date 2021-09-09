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
