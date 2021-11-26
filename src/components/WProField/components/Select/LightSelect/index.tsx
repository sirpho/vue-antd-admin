import { ref, CSSProperties, defineComponent, computed } from 'vue'
import { Select } from 'ant-design-vue'
import type { SelectPropsTypes } from 'ant-design-vue/lib/select'
import { SearchOutlined } from '@ant-design/icons-vue'
import { PropTypes } from '/@/utils'
import { getPrefixCls, FieldLabel } from '/@/components/_util'

import './index.less'

export type LightSelectProps = {
  actionRef?: any;
  label?: string;
  placeholder?: any;
  class?: string;
  style?: CSSProperties;
} & SelectPropsTypes<any>;

/**
 * 如果有 label 就优先使用 label
 *
 * @param valueMap
 * @param v
 */
const getValueOrLabel = (
  valueMap: Record<string, string>,
  v:
    | {
    label: string;
    value: string;
  }
    | string
) => {
  if (typeof v !== 'object') {
    return valueMap[v] || v
  }
  return valueMap[v?.value] || v.label
}

const lightSelectProps = {
  ...Select.props,
  actionRef: PropTypes.any,
  placeholder: PropTypes.any,
  class: PropTypes.string,
  style: PropTypes.style
}

const LightSelect = defineComponent({
  props: lightSelectProps,
  setup(props: LightSelectProps) {
    const prefixCls = getPrefixCls({
      suffixCls: 'field-select-light-select'
    })
    const open = ref<boolean>(false)
    const keyword = ref<string>('')

    const setOpen = (value: boolean) => {
      open.value = value
    }

    const setKeyword = (value: string) => {
      keyword.value = value
    }

    const valueMap = computed(() => {
      const values = {}
      if (props.options) props.options?.forEach(({ label: aLabel, value: aValue }) => {
        values[aValue] = aLabel || aValue
      })
      return values
    })

    const filterValue = computed(() => {
      return Array.isArray(props.value)
        ? props.value.map((v) => getValueOrLabel(valueMap.value, v))
        : getValueOrLabel(valueMap.value, props.value)
    })

    return () => {
      const {
        actionRef,
        label,
        prefixCls: customizePrefixCls,
        onChange,
        value,
        mode,
        children,
        defaultValue,
        size,
        showSearch,
        disabled,
        style,
        bordered,
        options,
        onSearch,
        allowClear,
        labelInValue,
        ...restProps
      } = props

      return (
        <div
          class={{
            [`${prefixCls}`]: true,
            [`${prefixCls}-searchable`]: props.showSearch,
            [`${props.class}`]: props.class
          }}
          style={props.style}
          onClick={() => {
            if (!props.disabled) {
              setOpen(true)
            }
          }}
        >
          <a-select
            {...restProps}
            allowClear={allowClear}
            value={value}
            mode={mode}
            labelInValue={labelInValue}
            size={size}
            disabled={disabled}
            onChange={(v, option) => {
              onChange?.(v, option)
              if (mode !== 'multiple') {
                setTimeout(() => {
                  setOpen(false)
                }, 0)
              }
            }}
            bordered={bordered}
            showSearch={showSearch}
            onSearch={onSearch}
            style={style}
            dropdownRender={({ menuNode }) => {
              return (
                <div ref={actionRef}>
                  {showSearch && (
                    <div style={{ margin: '4px 8px' }}>
                      <a-input
                        value={keyword}
                        allowClear={allowClear}
                        onChange={(e) => {
                          setKeyword(e.target.value.toLowerCase())
                          onSearch?.(e.target.value)
                        }}
                        onKeyDown={(e) => {
                          // 避免按下删除键把选项也删除了
                          e.stopPropagation()
                        }}
                        style={{ width: '100%' }}
                        prefix={<SearchOutlined />}
                      />
                    </div>
                  )}
                  {menuNode}
                </div>
              )
            }}
            open={open}
            onDropdownVisibleChange={setOpen}
            prefixCls={customizePrefixCls}
            options={
              keyword.value
                ? options?.filter((o) => {
                  return (
                    String(o.label).toLowerCase().includes(keyword.value) ||
                    o.value.toLowerCase().includes(keyword.value)
                  )
                })
                : options
            }
          />
          <FieldLabel
            ellipsis
            label={label}
            placeholder={props.placeholder}
            disabled={disabled}
            expanded={open.value}
            bordered={bordered}
            allowClear={allowClear}
            value={filterValue.value || value?.label || value}
            onClear={() => {
              onChange?.(undefined, undefined as any)
            }}
          />
        </div>
      )
    }
  }
})

export default LightSelect
