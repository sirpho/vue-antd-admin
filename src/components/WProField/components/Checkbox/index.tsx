import { computed, defineComponent, ExtractPropTypes } from 'vue'
import { cloneDeep } from 'lodash-es'
import { CheckboxGroup } from 'ant-design-vue'
import { getPrefixCls } from '/@/components/_util'
import type { FieldSelectProps } from '../Select'
import { proFieldParsingText, fieldSelectProps } from '../Select'
import { ObjToMap, useFetchList } from '../Select/useFetchList'

import './index.less'

export type CheckboxGroupProps = Partial<ExtractPropTypes<typeof CheckboxGroup.props>>;

const groupProps = {
  ...fieldSelectProps,
  layout: String as PropType<'horizontal' | 'vertical'>,
  options: Array as PropType<CheckboxGroupProps['options']>
}

export type GroupProps = {
  layout?: 'horizontal' | 'vertical';
  options?: CheckboxGroupProps['options'];
} & FieldSelectProps;

/**
 * 多选组件
 *
 * @param param0
 * @param ref
 */
const FieldCheckbox = defineComponent({
  props: groupProps,
  setup(props) {
    const prefixCls = getPrefixCls({
      suffixCls: 'field-checkbox'
    })

    const getProps = computed(() => cloneDeep(props))

    const {
      loading,
      getResOptionsRef
    } = useFetchList(getProps)

    const renderDefault = () => {
      const { layout = 'horizontal', renderFormItem, mode, render, ...rest } = getProps.value
      let dom

      if (mode === 'read') {
        const optionsValueEnum = getResOptionsRef.value?.length
          ? getResOptionsRef.value?.reduce((pre: any, cur) => {
            return { ...pre, [cur.value]: cur.label }
          }, {})
          : undefined

        dom = proFieldParsingText(rest.text, ObjToMap(rest.valueEnum || optionsValueEnum))

        if (render) {
          return render(rest.text, { mode, ...rest.fieldProps }, <>{dom}</>) || null
        }
        return <a-space>{dom}</a-space>
      }

      if (mode === 'edit') {
        const dom = (
          <a-checkbox-group
            {...rest.fieldProps}
            class={{
              [`${prefixCls}-${layout}`]: true,
              [`${rest.fieldProps?.class}`]: rest.fieldProps?.class
            }}
            options={getResOptionsRef.value}
          />
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

export default FieldCheckbox
