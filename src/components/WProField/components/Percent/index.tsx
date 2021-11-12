import { toNumber } from 'lodash-es'
import { useMemo } from '/@/hooks/core/useMemo'
import { getColorByRealValue, getSymbolByRealValue, getRealTextWithPrecision } from './util'
import type { ProFieldFC } from '../../index'

export type PercentPropInt = {
  prefix?: VueNode;
  suffix?: VueNode;
  text?: number | string;
  precision?: number;
  showColor?: boolean;
  showSymbol?: boolean | ((value: any) => boolean);
  placeholder?: any;
};

/**
 * 百分比组件
 *
 * @param PercentPropInt
 */
const FieldPercent: ProFieldFC<PercentPropInt> = (
  {
    text,
    prefix,
    precision,
    suffix = '%',
    mode,
    showColor = false,
    render,
    renderFormItem,
    fieldProps,
    placeholder,
    showSymbol: propsShowSymbol
  }
) => {
  const realValue = useMemo(
    () =>
      typeof text === 'string' && (text as string).includes('%')
        ? toNumber((text as string).replace('%', ''))
        : toNumber(text),
    [ text ]
  )
  const showSymbol = useMemo(() => {
    if (typeof propsShowSymbol === 'function') {
      return propsShowSymbol?.(text)
    }
    return propsShowSymbol
  }, [ propsShowSymbol, text ])

  if (mode === 'read') {
    /** 颜色有待确定, 根据提供 colors: ['正', '负'] | boolean */
    const style = showColor ? { color: getColorByRealValue(realValue.value) } : {}

    const dom = (
      <span style={style}>
        {prefix && <span>{prefix}</span>}
        {showSymbol.value && <>{getSymbolByRealValue(realValue.value)} </>}
        {getRealTextWithPrecision(Math.abs(realValue.value), precision)}
        {suffix && suffix}
      </span>
    )
    if (render) {
      return render(text, { mode, ...fieldProps, prefix, precision, showSymbol: showSymbol.value, suffix }, dom)
    }
    return dom
  }
  if (mode === 'edit' || mode === 'update') {
    const dom = (
      <a-input-number
        formatter={(value) => {
          if (value && prefix) {
            return `${prefix} ${value}`.replace(/\B(?=(\d{3})+(?!\d)$)/g, ',')
          }
          return value
        }}
        parser={(value) => (value ? value.replace(/.*\s|,/g, '') : '')}
        placeholder={placeholder}
        {...fieldProps}
      />
    )
    if (renderFormItem) {
      return renderFormItem(text, { mode, ...fieldProps }, dom)
    }
    return dom
  }
  return null
}

export default FieldPercent
