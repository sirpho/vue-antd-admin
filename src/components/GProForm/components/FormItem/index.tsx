import { computed, defineComponent } from 'vue'
import type { FormItemProps, ColProps } from 'ant-design-vue'
import { Form } from 'ant-design-vue'
import { PropTypes } from '/@/utils'
import { useMemo, useEffect } from '@gx-design/pro-hooks/core'
import type { SearchTransformKeyFn, ProSchemaValueType } from '@gx-design/pro-utils'
import { isDropdownValueType, tuple } from '@gx-design/pro-utils'
import { provideFormItemContext } from './FormItemContext'
import { useFieldContext } from '../../FieldContext'
import type { LightWrapperProps } from '../../BaseForm/LightWrapper'
import LightWrapper from '../../BaseForm/LightWrapper'

export const formItemProps = {
  htmlFor: PropTypes.string,
  prefixCls: PropTypes.string,
  label: PropTypes.VNodeChild,
  help: PropTypes.VNodeChild,
  extra: PropTypes.VNodeChild,
  labelCol: { type: Object as PropType<ColProps> },
  wrapperCol: { type: Object as PropType<ColProps> },
  hasFeedback: PropTypes.looseBool.def(false),
  colon: PropTypes.looseBool,
  labelAlign: PropTypes.oneOf(tuple('left', 'right')),
  prop: { type: [ String, Number, Array ] as PropType<string | number | string[] | number[]> },
  name: { type: [ String, Number, Array ] as PropType<string | number | string[] | number[]> },
  rules: PropTypes.oneOfType([ Array, Object ]),
  autoLink: PropTypes.looseBool.def(true),
  required: PropTypes.looseBool,
  validateFirst: PropTypes.looseBool,
  validateStatus: PropTypes.oneOf(tuple('', 'success', 'warning', 'error', 'validating')),
  validateTrigger: { type: [ String, Array ] as PropType<string | string[]> },
  messageVariables: { type: Object as PropType<Record<string, string>> },
  hidden: Boolean
}

type WarpFormItemProps = {
  /** @name 前置的dom * */
  addonBefore?: VueNode;
  /** @name 后置的dom * */
  addonAfter?: VueNode;
};

const proFormItemProps = {
  ...formItemProps,
  addonBefore: Object as PropType<VueNode>,
  addonAfter: Object as PropType<VueNode>,
  valueType: String as PropType<ProSchemaValueType<'text'>>,
  transform: Function as PropType<SearchTransformKeyFn>,
  dataFormat: PropTypes.string,
  lightProps: Object as PropType<LightWrapperProps>
}

export type ProFormItemProps = FormItemProps & {
  ignoreFormItem?: boolean;
  valueType?: ProSchemaValueType<'text'>;
  /** @name 提交时转化值，一般用于数组类型 */
  transform?: SearchTransformKeyFn;
  dataFormat?: string;
  lightProps?: LightWrapperProps;
} & WarpFormItemProps;

const ProFormItem = defineComponent({
  props: proFormItemProps,
  setup(props, { slots }) {
    const { setFieldValueType, formRef } = useFieldContext()

    const name = useMemo(() => {
      return props.name as string[]
    }, [ () => props.name ])

    useEffect(() => {
      // 如果 setFieldValueType 和 props.name 不存在不存入
      if (!setFieldValueType || !props.name) {
        return
      }
      // Field.type === 'ProField' 时 props 里面是有 valueType 的，所以要设置一下
      // 写一个 ts 比较麻烦，用 any 顶一下
      setFieldValueType(
        [ name.value ].flat(1).filter((itemName) => itemName !== undefined),
        {
          valueType: props.valueType || 'text',
          dateFormat: props.dataFormat,
          transform: props.transform
        }
      )
    }, [
      () => name,
      () => props.dataFormat,
      () => props.name,
      () => setFieldValueType,
      () => props.transform,
      () => props.valueType
    ])

    const isDropdown = computed(() => isDropdownValueType(props.valueType as string))

    const noLightFormItem = computed(() => {
      if (!props.lightProps?.['light'] || props.lightProps?.['customLightMode'] || isDropdown.value) {
        return true
      }
      return false
    })

    const lightDom = (formDom) => {
      return (
        <>
          {
            noLightFormItem.value
              ? formDom
              : (
                <LightWrapper
                  value={formRef?.modelRef[props.name as string]}
                  {...props.lightProps}
                  key={props.name?.toString()}
                >
                  {slots.default?.()}
                </LightWrapper>
              )
          }
        </>
      )
    }

    const formDom = () => {
      const { valueType, transform, dataFormat, lightProps = {}, ...rest } = props
      if (!rest.addonAfter && !rest.addonBefore) return (
        <Form.Item {...rest} {...formRef?.validateInfos[props.name as string]}>
          {slots.default?.()}
        </Form.Item>
      )
      return (
        <Form.Item {...rest} rules={undefined} name={undefined}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {rest.addonBefore ? <div style={{ marginRight: 8 }}>{rest.addonBefore}</div> : null}
            <div style={{ flex: 1 }}>
              <Form.Item {...rest} {...formRef?.validateInfos[props.name as string]}>
                {slots.default?.()}
              </Form.Item>
            </div>
            {rest.addonAfter ? <div style={{ marginLeft: 8 }}>{rest.addonAfter}</div> : null}
          </div>
        </Form.Item>
      )
    }

    provideFormItemContext({
      name: props.name,
      label: props.label
    })

    return () => {
      return (
        <>
          {lightDom(formDom())}
        </>
      )
    }
  }
})

export default ProFormItem
