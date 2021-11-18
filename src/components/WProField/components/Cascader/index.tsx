import { computed, defineComponent, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { getPrefixCls } from '/@/components/_util'
import type { RadioGroupProps } from '../Radio'
import type { FieldSelectProps } from '../Select'
import { proFieldParsingText, fieldSelectProps } from '../Select'
import { ObjToMap, useFetchList } from '../Select/useFetchList'

import './index.less'

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
const FieldCascader = defineComponent({
  props: groupProps,
  setup(props) {
    const prefixCls = getPrefixCls({
      suffixCls: 'field-cascader'
    })

    const cascaderRef = ref<any>()

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
        const dom = (
          <a-spin spinning={loading.value}>
            <a-cascader
              ref={e => cascaderRef.value = e}
              {...rest.fieldProps}
              class={{
                [`${prefixCls}`]: true,
                [`${rest.fieldProps?.class}`]: rest.fieldProps?.class
              }}
              options={getResOptionsRef.value}
            />
          </a-spin>
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

export default FieldCascader
