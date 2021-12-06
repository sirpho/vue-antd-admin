import { computed, defineComponent, ExtractPropTypes, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { Radio } from 'ant-design-vue'
import type { RadioGroupChildOption } from 'ant-design-vue/lib/radio/Group'
import { PropTypes } from '/@/utils'
import { getPrefixCls, tuple } from '@gx-design/pro-utils'
import type { FieldSelectProps } from '../Select'
import { proFieldParsingText, fieldSelectProps } from '../Select'
import { ObjToMap, useFetchList } from '../Select/useFetchList'

import './index.less'

const RadioGroupSizeTypes = tuple('large', 'default', 'small')

const RadioGroupOptionTypes = tuple('default', 'button')

export const radioGroupProps = {
  prefixCls: PropTypes.string,
  value: PropTypes.any,
  size: PropTypes.oneOf(RadioGroupSizeTypes).def('default'),
  options: {
    type: Array as PropType<Array<String | RadioGroupChildOption>>
  },
  disabled: PropTypes.looseBool,
  name: PropTypes.string,
  buttonStyle: PropTypes.string.def('outline'),
  id: PropTypes.string,
  optionType: PropTypes.oneOf(RadioGroupOptionTypes).def('default')
}

export type RadioGroupProps = Partial<ExtractPropTypes<typeof radioGroupProps>>;

export type GroupProps = {
  radioType?: 'button' | 'radio';
  options?: RadioGroupProps['options'];
} & FieldSelectProps;

const groupProps = {
  ...fieldSelectProps,
  radioType: String as PropType<GroupProps['radioType']>,
  options: Array as PropType<GroupProps['options']>
}

/**
 * 多选组件
 *
 * @param param0
 * @param ref
 */
const FieldRadio = defineComponent({
  props: groupProps,
  setup(props) {
    const prefixCls = getPrefixCls({
      suffixCls: 'field-radio'
    })

    const radioRef = ref<any>()

    const getProps = computed(() => cloneDeep(props))

    const {
      loading,
      getResOptionsRef
    } = useFetchList(getProps)

    const renderDefault = () => {
      const { radioType, renderFormItem, mode, render, ...rest } = getProps.value
      let dom

      if (mode === 'read') {
        const optionsValueEnum = getResOptionsRef.value?.length
          ? getResOptionsRef.value?.reduce((pre: any, cur) => {
            return { ...pre, [cur.value]: cur.label }
          }, {})
          : undefined

        dom = <>{proFieldParsingText(rest.text, ObjToMap(rest.valueEnum || optionsValueEnum))}</>

        if (render) {
          return render(rest.text, { mode, ...rest.fieldProps }, dom) || null
        }
        return <a-space>{dom}</a-space>
      }

      if (mode === 'edit') {
        const RadioComponents = radioType === 'button' ? Radio.Button : Radio
        const dom = (
          <Radio.Group
            ref={e => radioRef.value = e}
            {...rest.fieldProps}
            class={{
              [`${prefixCls}-${rest.fieldProps.layout || 'horizontal'}`]: true,
              [`${rest.fieldProps?.class}`]: rest.fieldProps?.class
            }}
            options={undefined}
          >
            {getResOptionsRef.value?.map((item) => (
              <RadioComponents key={item.value} {...item}>
                {item.label}
              </RadioComponents>
            ))}
          </Radio.Group>
        )
        if (renderFormItem) {
          return renderFormItem(rest.text, { mode, ...rest.fieldProps }, dom) || null
        }
        return dom
      }

      return null
    }

    return () => {
      return (
        <>
          {
            loading.value ?
              <a-spin size="small" />
              :
              renderDefault()
          }
        </>
      )
    }
  }
})

export default FieldRadio
