import type { FunctionalComponent as FC } from 'vue'
import { cloneVNode, ref, watch } from 'vue'
import type { FormProps } from 'ant-design-vue'
import { omit } from 'lodash-es'
import { FilterOutlined } from '@ant-design/icons-vue'
import { FilterDropdown, FieldLabel, getPrefixCls } from '@gx-design/pro-utils'
import type { CommonFormProps } from '../../BaseForm'
import BaseForm from '../../BaseForm'
import type { LightFilterFooterRender, ProFormInstance } from '../../typings'

import './index.less'

export type LightFilterProps<T> = {
  collapse?: boolean;
  collapseLabel?: VueNode;
  bordered?: boolean;
  ignoreRules?: boolean;
  footerRender?: LightFilterFooterRender;
} & Omit<FormProps, 'onFinish'> &
  CommonFormProps<T>;

/**
 * 单行的查询表单，一般用于配合 table 或者 list使用 有时也会用于 card 的额外区域
 *
 * @param props
 */
const LightFilterContainer: FC<{
  items: VueNode[];
  prefixCls: string;
  values?: Record<string, any>;
  onValuesChange: (values: Record<string, any>) => void;
  collapse?: boolean;
  collapseLabel?: VueNode;
  bordered?: boolean;
  footerRender?: LightFilterFooterRender;
}> = (props) => {
  const {
    items,
    prefixCls,
    collapse,
    collapseLabel,
    onValuesChange,
    bordered,
    values = {},
    footerRender
  } = props

  const lightFilterClassName = `${prefixCls}-light-filter`

  const open = ref<boolean>(false)
  const moreValues = ref<Record<string, any>>({
    ...values
  })
  const setOpen = (val: boolean) => {
    open.value = val
  }
  const setMoreValues = (val: Record<string, any>) => {
    moreValues.value = val
  }

  watch(
    () => values,
    (val) => {
      setMoreValues({ ...val })
    },
    {
      deep: true,
      immediate: true
    }
  )

  const collapseItems = ref<any>([])
  const outsideItems = ref<any>([])

  watch(
    () => props.items.length,
    (_) => {
      items.forEach((item: any) => {
        const { secondary } = item.props || {}
        if (secondary || collapse) {
          collapseItems.value.push(item)
        } else {
          outsideItems.value.push(item)
        }
      })
    },
    {
      deep: true,
      immediate: true
    }
  )

  const collapseLabelRender = () => {
    if (collapseLabel) {
      return collapseLabel
    }
    if (collapse) {
      return <FilterOutlined class={`${lightFilterClassName}-collapse-icon`} />
    }
    return (
      <FieldLabel
        label="更多筛选"
        expanded={open.value}
      />
    )
  }

  return (
    <div
      class={{
        [`${lightFilterClassName}`]: true,
        [`${lightFilterClassName}-middle`]: true,
        [`${lightFilterClassName}-effective`]: Object.keys(values).some((key) => values[key])
      }}
    >
      <div class={`${lightFilterClassName}-container`}>
        {outsideItems.value.map((child: any, index) => {
          const { key } = child
          return (
            <div class={`${lightFilterClassName}-item`} key={key || index}>
              {cloneVNode(child, {
                // proFieldProps 会直接作为 ProField 的 props 传递过去
                proFieldProps: {
                  light: true,
                  label: child?.props.label,
                  bordered
                },
                bordered
              })}
            </div>
          )
        })}
        {collapseItems.value.length ? (
          <div class={`${lightFilterClassName}-item`} key="more">
            <FilterDropdown
              padding={24}
              onVisibleChange={setOpen}
              visible={open.value}
              label={collapseLabelRender()}
              footerRender={footerRender}
              footer={{
                onConfirm: () => {
                  onValuesChange({
                    ...moreValues
                  })
                  setOpen(false)
                },
                onClear: () => {
                  const clearValues = {}
                  collapseItems.value.forEach((child: any) => {
                    const { name } = child.props
                    clearValues[name] = undefined
                  })

                  onValuesChange(clearValues)
                }
              }}
            >
              {collapseItems.value.map((child: any) => {
                const { key } = child
                const { name, fieldProps } = child.props
                const newFieldProps = {
                  ...fieldProps,
                  onChange: (e: any) => {
                    setMoreValues({
                      ...moreValues,
                      [name]: e?.target ? e.target.value : e
                    })
                    return false
                  }
                }
                if (moreValues.value.hasOwnProperty(name)) {
                  newFieldProps['value'] = moreValues.value[name]
                }
                return (
                  <div class={`${lightFilterClassName}-line`} key={key}>
                    {cloneVNode(child, {
                      fieldProps: newFieldProps
                    })}
                  </div>
                )
              })}
            </FilterDropdown>
          </div>
        ) : null}
      </div>
    </div>
  )
}

const LightFilter: FC = (props: LightFilterProps<Record<string, any>>, { slots }) => {

  const {
    collapse,
    collapseLabel,
    model,
    onValuesChange,
    formRef: userFormRef,
    bordered,
    ignoreRules,
    footerRender,
    ...reset
  } = props

  const prefixCls = getPrefixCls({
    suffixCls: 'form'
  })

  const formRef = ref<ProFormInstance>()

  return (
    <BaseForm
      model={model}
      contentRender={(items, _, useFormContext) => {
        return (
          <LightFilterContainer
            prefixCls={prefixCls}
            items={items.flatMap((item: any) => {
              if (item?.type.displayName === 'ProForm-Group') {
                return item.children.default?.()
              }
              return item
            })}
            bordered={bordered}
            collapse={collapse}
            collapseLabel={collapseLabel}
            values={useFormContext.modelRef}
            footerRender={footerRender}
            onValuesChange={(_: any) => {
              console.log(useFormContext.modelRef)
            }}
          />
        )
      }}
      formRef={e => formRef.value = e}
      formItemProps={{
        colon: false,
        labelAlign: 'left'
      }}
      fieldProps={{
        style: {
          width: undefined
        }
      }}
      {...omit(reset, [ 'labelWidth' ] as any[])}
    >
      {slots.default?.()}
    </BaseForm>
  )
}

export default LightFilter
