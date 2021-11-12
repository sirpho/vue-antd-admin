import { ProFieldFC } from '../../index'
import { useMemo } from '/@/hooks/core/useMemo'

export type FieldMoneyProps = {
  text: number;
  moneySymbol?: boolean;
  placeholder?: any;
  customSymbol?: string;
};

const defaultMoneyIntl = {
  currency: 'CNY',
  style: 'currency'
}

const getTextByLocale = (paramsText: number, precision: number) => {
  let moneyText = paramsText
  if (typeof moneyText === 'string') {
    moneyText = Number(moneyText)
  }

  return new Intl.NumberFormat('zh-Hans-CN', {
    ...(defaultMoneyIntl),
    minimumFractionDigits: precision
  }).format(moneyText)
}

const DefaultPrecisionCont = 2

const FieldMoney: ProFieldFC<FieldMoneyProps> = (
  {
    text,
    mode: type,
    render,
    renderFormItem,
    fieldProps,
    proFieldKey,
    valueEnum,
    placeholder,
    customSymbol,
    ...rest
  }
) => {
  const precision = fieldProps?.precision ?? DefaultPrecisionCont
  const moneySymbol = useMemo(() => {
    if (customSymbol) {
      return customSymbol
    }
    const defaultText = '￥'
    if (rest.moneySymbol === false || fieldProps.moneySymbol === false) {
      return ''
    }
    return defaultText
  }, [ fieldProps.moneySymbol, rest.moneySymbol, customSymbol ])
  if (type === 'read') {
    const dom = (
      <span>{getTextByLocale(text, precision)}</span>
    )
    if (render) {
      return render(text, { mode: type, ...fieldProps }, dom)
    }
    return dom
  }

  if (type === 'edit' || type === 'update') {
    const dom = (
      <a-input-number
        precision={precision}
        // 删除默认min={0}，允许输入一个负数的金额，用户可自行配置min来限制是否允许小于0的金额
        formatter={(value) => {
          if (value) {
            const reg = new RegExp(`/B(?=(d{${3 + (precision - DefaultPrecisionCont)}})+(?!d))/g`)
            return `${moneySymbol.value} ${value}`.replace(reg, ',')
          }
          return ''
        }}
        parser={(value) =>
          value ? value.replace(new RegExp(`\\${moneySymbol.value}\\s?|(,*)`, 'g'), '') : ''
        }
        placeholder={placeholder}
        {...fieldProps}
      />
    )
    if (renderFormItem) {
      return renderFormItem(text, { mode: type, ...fieldProps }, dom)
    }
    return dom
  }
  return null
}

export default FieldMoney
