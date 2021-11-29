import type { FunctionalComponent } from 'vue'
import { computed, ref, watch } from 'vue'
import { Select } from 'ant-design-vue'
import type { SelectPropsTypes } from 'ant-design-vue/lib/select'
import type { LabeledValue } from 'ant-design-vue/es/select'
import type { RequestOptionsType } from '@wd-design/pro-utils'
import { getPrefixCls } from '@wd-design/pro-utils'

const { OptGroup } = Select

// 支持 key, value, label，兼容 UserSearch 中只填写了 key 的情况。
export type KeyLabel = Partial<LabeledValue> & RequestOptionsType;

/** 用户扩展数据后的值类型 */
export type DataValueType<T> = KeyLabel & T;

/** 可能单选，可能多选 */
export type DataValuesType<T> = DataValueType<T> | DataValueType<T>[];

export interface SearchSelectProps<T = Record<string, any>>
  extends Omit<SelectPropsTypes<KeyLabel | KeyLabel[]>, 'options'> {
  /** 自定义搜索方法, 返回搜索结果的 Promise */
  request?: (params: { query: string }) => Promise<DataValueType<T>[]>;
  /** 自定义选项渲染 */
  optionItemRender?: (item: DataValueType<T>) => VueNode;
  /** 指定组件中的值 */
  value?: KeyLabel | KeyLabel[];
  /** 指定默认选中的条目 */
  defaultValue?: KeyLabel | KeyLabel[];

  options?: RequestOptionsType[];

  /**
   * Placeholder 输入提示
   *
   * @default 请输入关键字搜索
   */
  placeholder?: any;
  /**
   * 是否在输入框聚焦时触发搜索
   *
   * @default false
   */
  searchOnFocus?: boolean;
  /**
   * 选择完一个之后是否清空搜索项重新搜索
   *
   * @default false
   */
  resetAfterSelect?: boolean;
  /**
   * 自定义前缀
   *
   * @ignore
   */
  prefixCls?: string;
}

const SearchSelect: FunctionalComponent = <T, >(props: SearchSelectProps<T[]>, { attrs }) => {
  const {
    optionItemRender,
    mode,
    onSearch,
    onFocus,
    onChange,
    autoClearSearchValue,
    searchOnFocus = false,
    resetAfterSelect = false,
    optionFilterProp = 'label',
    optionLabelProp = 'label',
    disabled,
    options,
    prefixCls: customizePrefixCls,
    onClear,
    searchValue: propsSearchValue,
    showSearch,
    ...restProps
  } = props
  const searchValue = ref<string>(propsSearchValue)
  const selectRef = ref<any>()

  const setSearchValue = (value: string) => {
    searchValue.value = value
  }

  watch(() => restProps.autofocus, (autofocus) => {
    if (autofocus) {
      selectRef?.value?.focus()
    }
  }, {
    deep: true,
    immediate: true
  })

  watch(() => propsSearchValue, (value) => {
    setSearchValue(value)
  }, {
    deep: true,
    immediate: true
  })

  const prefixCls = getPrefixCls({
    suffixCls: 'filed-search-select',
    customizePrefixCls
  })

  // 兼容 renderXXX API。

  const classString = computed(() => {
    return {
      [`${prefixCls}`]: true,
      [`${attrs.class}`]: attrs.attrs,
      [`${prefixCls}-disabled`]: disabled
    }
  })

  const getMergeValue: SelectPropsTypes<any>['onChange'] = (value, option) => {
    if (Array.isArray(value) && value.length > 0) {
      // 多选情况且用户有选择
      return value.map((item, index) => {
        const optionItem = option?.[index]
        const dataItem = optionItem?.['data-item'] || {}
        return {
          ...dataItem,
          ...item
        }
      })
    }
    return []
  }

  const renderOptions = (mapOptions: RequestOptionsType[]) => {
    return mapOptions.map((item) => {
      const {
        label,
        value,
        disabled: itemDisable,
        className: itemClassName,
        optionType
      } = item as RequestOptionsType

      if (optionType === 'optGroup') {
        return (
          <OptGroup key={item.key || item.value} label={item.label}>
            {renderOptions(item?.options || item?.children || [])}
          </OptGroup>
        )
      }
      return (
        <a-select-option
          {...item}
          value={value!}
          key={value || (label as string)?.toString()}
          disabled={itemDisable}
          data-item={item}
          class={`${prefixCls}-option ${itemClassName || ''}`}
          label={item.label}
        >
          {optionItemRender?.(item as any) || label}
        </a-select-option>
      )
    })
  }
  return (
    <a-select
      ref={e => selectRef.value = e}
      class={classString}
      allowClear
      disabled={disabled}
      mode={mode}
      showSearch={showSearch}
      optionFilterProp={optionFilterProp}
      optionLabelProp={optionLabelProp}
      onClear={() => {
        onClear?.()
        if (showSearch) {
          setSearchValue('')
        }
      }}
      {...restProps}
      onChange={(value, optionList) => {
        // 将搜索框置空 和 antd 行为保持一致
        if (!props.labelInValue) {
          onChange?.(value, optionList)
          return
        }

        if (mode !== 'multiple') {
          // 单选情况且用户选择了选项
          const dataItem = (optionList && optionList['data-item']) || {}
          onChange?.({ ...value, ...dataItem }, optionList)
          return
        }
        // 合并值
        const mergeValue = getMergeValue(value, optionList) as any
        onChange?.(mergeValue, optionList)
      }}
    >
      {renderOptions(options || [])}
    </a-select>
  )
}

export default SearchSelect
