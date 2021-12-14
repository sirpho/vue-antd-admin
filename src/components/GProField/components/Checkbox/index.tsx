﻿import { computed, defineComponent, ExtractPropTypes } from 'vue'
import { CheckboxValueType, CheckboxOptionType } from 'ant-design-vue/lib/checkbox/Group'
import { cloneDeep } from 'lodash-es'
import { PropTypes } from '/@/utils'
import { getPrefixCls } from '@gx-design/pro-utils'
import type { FieldSelectProps } from '../Select'
import { proFieldParsingText, fieldSelectProps } from '../Select'
import { ObjToMap, useFetchList } from '../Select/useFetchList'

import './index.less'

const checkboxGroupProps = {
  name: PropTypes.string,
  prefixCls: PropTypes.string,
  defaultValue: { type: Array as PropType<Array<CheckboxValueType>> },
  value: { type: Array as PropType<Array<CheckboxValueType>> },
  options: { type: Array as PropType<Array<CheckboxOptionType | string>> },
  disabled: PropTypes.looseBool,
  onChange: PropTypes.func,
  id: PropTypes.string
}

export type CheckboxGroupProps = Partial<ExtractPropTypes<typeof checkboxGroupProps>>;

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
      suffixCls: 'field-checkbox',
      isPor: true
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

        dom = proFieldParsingText(rest.text as string, ObjToMap(rest.valueEnum || optionsValueEnum))

        if (render) {
          return render(rest.text, { mode, ...rest.fieldProps }, <>{dom}</>) || null
        }
        return <a-space>{dom}</a-space>
      }

      if (mode === 'edit') {
        const dom = (
          <a-checkbox-group
            {...rest.fieldProps}
            value={rest.fieldProps.value || []}
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