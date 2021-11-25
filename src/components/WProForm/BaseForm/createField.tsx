import { FunctionalComponent, reactive, RendererElement, RendererNode, VNode } from 'vue'
import { pickProFormItemProps, omitUndefined } from '@wd-design/pro-utils'
import { noteOnce } from 'ant-design-vue/es/vc-util/warning'
import { useFieldContext } from '../FieldContext'
import type { ExtendsProps, ProFormFieldItemProps, ProFormItemCreateConfig } from '../typings'
import ProFormItem from '../components/FormItem'

export const TYPE = Symbol('ProFormComponent')

const WIDTH_SIZE_ENUM = {
  // 适用于短数字，短文本或者选项
  xs: 104,
  s: 216,
  // 适用于较短字段录入、如姓名、电话、ID 等。
  sm: 216,
  m: 328,
  // 标准宽度，适用于大部分字段长度。
  md: 328,
  l: 440,
  // 适用于较长字段录入，如长网址、标签组、文件路径等。
  lg: 440,
  // 适用于长文本录入，如长链接、描述、备注等，通常搭配自适应多行输入框或定高文本域使用。
  xl: 552
}

type ProFormComponent<Extends> = FunctionalComponent<Extends>;

/**
 * 这个方法的主要作用的帮助 Field 增加 FormItem 同时也会处理 lightFilter
 *
 * @param Field
 * @param config
 */
function createField<P extends ProFormFieldItemProps = any>(
  Field: FunctionalComponent<P>,
  config?: ProFormItemCreateConfig
): ProFormComponent<ExtendsProps> {
  // 标记是否是 proform 的组件
  // @ts-ignore
  // eslint-disable-next-line no-param-reassign
  Field.displayName = 'ProFormComponent'

  const FieldWithContext: (props: (P & ExtendsProps)) => VNode<RendererNode, RendererElement, { [p: string]: any }> = (props: P & ExtendsProps) => {
    const {
      valueType,
      customLightMode,
      lightFilterLabelFormatter,
      valuePropName = 'value',
      ignoreWidth,
      defaultProps,
      ...defaultFormItemProps
    } = { ...props?.filedConfig, ...config } || {}

    const {
      label,
      placeholder,
      width,
      proFieldProps,
      bordered,
      messageVariables,
      ignoreFormItem,
      transform,
      readonly,
      allowClear,
      colSize,
      formItemProps: propsFormItemProps,
      filedConfig,
      ...rest
    } = { ...defaultProps, ...props } as P & ExtendsProps

    const fieldVal = reactive({})



    /** 从 context 中拿到的值 */
    const { fieldProps, formItemProps, formRef, handleChangeModel } = useFieldContext()

    if (!props.hasOwnProperty('value')) {
      fieldVal[props.name as string] = ''
      handleChangeModel(fieldVal)
    }

    // restFormItemProps is user props pass to Form.Item
    const restFormItemProps = pickProFormItemProps(rest)

    const formNeedProps = {
      value: (rest as any).value
    }
    const realFieldProps = {
      ...(ignoreFormItem ? formNeedProps : {}),
      disabled: props.disabled,
      placeholder,
      ...(fieldProps || {}),
      ...(rest.fieldProps || {}),
      style: {
        // 有些组件是不需要自带的 width
        ...rest.fieldProps?.style,
        ...fieldProps?.style
      }
    } as any

    const otherProps = {
      messageVariables,
      ...defaultFormItemProps,
      ...formItemProps,
      ...restFormItemProps,
      ...propsFormItemProps
    }

    noteOnce(
      // eslint-disable-next-line @typescript-eslint/dot-notation
      !rest['defaultValue'],
      '请不要在 Form 中使用 defaultXXX。如果需要默认值请使用 initialValues 和 initialValue。'
    )
    const ignoreWidthValueType = [ 'switch', 'radioButton', 'radio', 'rate' ]

    const realFieldPropsStyle = {
      ...realFieldProps?.style
    }
    if (realFieldPropsStyle.width !== undefined && (rest as any).valueType === 'switch') {
      delete realFieldPropsStyle.width
    }

    const handleChange = (val: any) => {
      if (props.hasOwnProperty('value')) return
      fieldVal[props.name as string] = val
      handleChangeModel(fieldVal)
    }

    const field = (
      <Field
        value={formRef?.modelRef[props.name as string]}
        // ProXxx 上面的 props 透传给 FieldProps，可能包含 Field 自定义的 props，
        // 比如 ProFormSelect 的 request
        {...(rest as P)}
        fieldProps={omitUndefined({
          allowClear,
          ...realFieldProps,
          style: omitUndefined({
            width: width && !WIDTH_SIZE_ENUM[width] ? width : undefined,
            ...realFieldPropsStyle
          }),
          class: omitUndefined({
            [`pro-field`]: width && WIDTH_SIZE_ENUM[width],
            [`${realFieldProps?.class}`]: realFieldProps?.class,
            [`pro-field-${width}`]: width &&
            // 有些 valueType 不需要宽度
            !ignoreWidthValueType.includes((props as any)?.valueType as 'text') &&
            !ignoreWidth &&
            WIDTH_SIZE_ENUM[width]
          })
        })}
        proFieldProps={omitUndefined({
          // @ts-ignore
          mode: readonly ? 'read' : rest?.mode,
          params: rest.params,
          proFieldKey: otherProps?.name && `form-field-${otherProps.name}`,
          ...proFieldProps
        })}
        onChange={handleChange}
      />
    )

    return (
      <ProFormItem
        // 全局的提供一个 tip 功能，可以减少代码量
        // 轻量模式下不通过 FormItem 显示 label
        label={label && proFieldProps?.light !== true ? label : undefined}
        valuePropName={valuePropName}
        key={otherProps.name?.toString()}
        {...otherProps}
        ignoreFormItem={ignoreFormItem}
        transform={transform}
        dataFormat={rest.fieldProps?.format}
        valueType={valueType || (rest as any).valueType}
        messageVariables={{
          label: (label as string) || '',
          ...otherProps?.messageVariables
        }}
        lightProps={omitUndefined({
          ...realFieldProps,
          valueType: valueType || (rest as any).valueType,
          bordered,
          allowClear: field?.props?.allowClear ?? allowClear,
          light: proFieldProps?.light,
          label,
          customLightMode,
          labelFormatter: lightFilterLabelFormatter,
          valuePropName,
          footerRender: field?.props?.footerRender,
          // 使用用户的配置覆盖默认的配置
          ...rest.lightProps
        })}
      >
        {field}
      </ProFormItem>
    )
  }
  // 标记是否是 proform 的组件
  // @ts-ignore
  // eslint-disable-next-line no-param-reassign
  FieldWithContext.displayName = 'ProFormComponent'
  return FieldWithContext as ProFormComponent<ExtendsProps>
}

export default createField
