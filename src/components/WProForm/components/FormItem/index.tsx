import { computed, defineComponent } from 'vue'
import { Form, FormItem } from 'ant-design-vue'
import { PropTypes } from '/@/utils'
import useMemo from '/@/hooks/core/useMemo'
import type { SearchTransformKeyFn, ProSchemaValueType } from '/@/components/_util/typings'
import isDropdownValueType from '/@/components/_util/isDropdownValueType'
import useEffect from './useEffect'
import { provideFormItemContext } from './FormItemContext'
import { useFieldContext } from '../../FieldContext'
import type { LightWrapperProps } from '../../BaseForm/LightWrapper'
import LightWrapper from '../../BaseForm/LightWrapper'

const proFormItemProps = {
  ...FormItem.props,
  addonBefore: Object as PropType<VueNode>,
  addonAfter: Object as PropType<VueNode>,
  valueType: String as PropType<ProSchemaValueType<'text'>>,
  transform: Function as PropType<SearchTransformKeyFn>,
  dataFormat: PropTypes.string,
  lightProps: Object as PropType<LightWrapperProps>
}

const ProFormItem = defineComponent({
  props: proFormItemProps,
  setup(props, { slots }) {
    const { setFieldValueType } = useFieldContext()

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

    const isDropdown = computed(() => isDropdownValueType(props.valueType))

    const noLightFormItem = useMemo(
      () => {
        if (!props.lightProps?.light || props.lightProps?.customLightMode || isDropdown.value) {
          return true
        }
        return false
      },
      [
        () => props.lightProps?.customLightMode,
        () => isDropdown.value,
        () => props.lightProps?.light
      ]
    )

    const lightDom = (formDom) => {
      const { valueType, transform, dataFormat, ignoreFormItem, lightProps = {}, ...rest } = props
      return (
        <>
          {
            noLightFormItem.value
              ? formDom
              : (
                <LightWrapper {...lightProps} key={rest.name?.toString()} v-slots={slots} />
              )
          }
        </>
      )
    }

    const formDom = () => {
      const { valueType, transform, dataFormat, ignoreFormItem, lightProps = {}, ...rest } = props
      if (!rest.addonAfter && !rest.addonBefore) return <Form.Item {...rest}>{slots.default?.()}</Form.Item>
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
              <Form.Item {...rest}>
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
