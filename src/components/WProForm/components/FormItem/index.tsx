import { computed, defineComponent } from 'vue'
import type { FormItemProps } from 'ant-design-vue'
import { Form } from 'ant-design-vue'
import { PropTypes } from '/@/utils'
import useMemo from '/@/hooks/core/useMemo'
import type { SearchTransformKeyFn, ProSchemaValueType } from '/@/components/_util/typings'
import isDropdownValueType from '/@/components/_util/isDropdownValueType'
import useEffect from './useEffect'
import { provideFormItemContext } from './FormItemContext'
import { useFieldContext } from '../../FieldContext'
import type { LightWrapperProps } from '../../BaseForm/LightWrapper'
import LightWrapper from '../../BaseForm/LightWrapper'

const FormItem = Form.Item

type WarpFormItemProps = {
  /** @name 前置的dom * */
  addonBefore?: VueNode;
  /** @name 后置的dom * */
  addonAfter?: VueNode;
};

const proFormItemProps = {
  ...FormItem.props,
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
