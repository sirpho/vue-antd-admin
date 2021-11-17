import { computed, defineComponent, ExtractPropTypes, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { Radio } from 'ant-design-vue'
import radioGroupProps from 'ant-design-vue/lib/radio/Group'
import { getPrefixCls } from '/@/components/_util'
import type { FieldSelectProps } from '../Select'
import { proFieldParsingText, fieldSelectProps } from '../Select'
import { ObjToMap, useFetchList } from '../Select/useFetchList'

import './index.less'

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
