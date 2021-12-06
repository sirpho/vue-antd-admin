import type { FunctionalComponent, ExtractPropTypes, CSSProperties, VNode } from 'vue'
import { computed, ref, watch } from 'vue'
import { Select } from 'ant-design-vue'
import { omit } from 'lodash-es'
import type { SelectValue, LabeledValue } from 'ant-design-vue/lib/select'
import type { Placement } from 'ant-design-vue/lib/vc-select/generate'
import type {
  Mode,
  FieldNames,
  RenderDOMFunc,
  OptionsType as SelectOptionsType
} from 'ant-design-vue/lib/vc-select/interface'
import type {
  FilterFunc,
  OnClear,
  CustomTagProps,
  SingleType,
  RawValueType,
  SelectSource
} from 'ant-design-vue/lib/vc-select/interface/generator'
import { PropTypes } from '/@/utils'
import type { RequestOptionsType } from '@gx-design/pro-utils'
import { getPrefixCls, tuple } from '@gx-design/pro-utils'

export function selectBaseProps<OptionType, ValueType>() {
  return {
    prefixCls: String,
    id: String,

    // Options
    options: { type: Array as PropType<OptionType[]> },
    mode: { type: String as PropType<Mode> },

    // Value
    value: {
      type: [ String, Number, Object, Array ] as PropType<ValueType>,
      default: undefined as ValueType
    },
    defaultValue: {
      type: [ String, Number, Object, Array ] as PropType<ValueType>,
      default: undefined as ValueType
    },
    labelInValue: { type: Boolean, default: undefined },

    fieldNames: { type: Object as PropType<FieldNames> },
    // Search
    inputValue: String,
    searchValue: String,
    optionFilterProp: String,
    /**
     * In Select, `false` means do nothing.
     * In TreeSelect, `false` will highlight match item.
     * It's by design.
     */
    filterOption: {
      type: [ Boolean, Function ] as PropType<boolean | FilterFunc<OptionType>>,
      default: undefined
    },
    filterSort: {
      type: Function as PropType<(optionA: OptionType, optionB: OptionType) => number>
    },
    showSearch: { type: Boolean, default: undefined },
    autoClearSearchValue: { type: Boolean, default: undefined },
    onSearch: { type: Function as PropType<(value: string) => void> },
    onClear: { type: Function as PropType<OnClear> },

    // Icons
    allowClear: { type: Boolean, default: undefined },
    clearIcon: PropTypes.any,
    showArrow: { type: Boolean, default: undefined },
    inputIcon: PropTypes.VNodeChild,
    removeIcon: PropTypes.VNodeChild,
    menuItemSelectedIcon: PropTypes.VNodeChild,

    // Dropdown
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: undefined },
    listHeight: Number,
    listItemHeight: Number,
    dropdownStyle: { type: Object as PropType<CSSProperties> },
    dropdownClassName: String,
    dropdownMatchSelectWidth: {
      type: [ Boolean, Number ] as PropType<boolean | number>,
      default: undefined
    },
    placement: {
      type: String as PropType<Placement>
    },
    virtual: { type: Boolean, default: undefined },
    dropdownRender: { type: Function as PropType<(menu: VNode) => any> },
    dropdownAlign: PropTypes.any,
    animation: String,
    transitionName: String,
    getPopupContainer: { type: Function as PropType<RenderDOMFunc> },
    direction: { type: String as PropType<'ltr' | 'rtl'> },

    // Others
    disabled: { type: Boolean, default: undefined },
    loading: { type: Boolean, default: undefined },
    autofocus: { type: Boolean, default: undefined },
    defaultActiveFirstOption: { type: Boolean, default: undefined },
    notFoundContent: PropTypes.any,
    placeholder: PropTypes.any,
    backfill: { type: Boolean, default: undefined },
    /** @private Internal usage. Do not use in your production. */
    getInputElement: { type: Function as PropType<() => any> },
    optionLabelProp: String,
    maxTagTextLength: Number,
    maxTagCount: { type: [ String, Number ] as PropType<number | 'responsive'> },
    maxTagPlaceholder: PropTypes.any,
    tokenSeparators: { type: Array as PropType<string[]> },
    tagRender: { type: Function as PropType<(props: CustomTagProps) => any> },
    showAction: { type: Array as PropType<('focus' | 'click')[]> },
    tabindex: { type: [ Number, String ] },

    // Events
    onKeyup: { type: Function as PropType<(e: KeyboardEvent) => void> },
    onKeydown: { type: Function as PropType<(e: KeyboardEvent) => void> },
    onPopupScroll: { type: Function as PropType<(e: UIEvent) => void> },
    onDropdownVisibleChange: { type: Function as PropType<(open: boolean) => void> },
    onSelect: {
      type: Function as PropType<(value: SingleType<ValueType>, option: OptionType) => void>
    },
    onDeselect: {
      type: Function as PropType<(value: SingleType<ValueType>, option: OptionType) => void>
    },
    onInputKeyDown: { type: Function as PropType<(e: KeyboardEvent) => void> },
    onClick: { type: Function as PropType<(e: MouseEvent) => void> },
    onChange: {
      type: Function as PropType<(value: ValueType, option: OptionType | OptionType[]) => void>
    },
    onBlur: { type: Function as PropType<(e: FocusEvent) => void> },
    onFocus: { type: Function as PropType<(e: FocusEvent) => void> },
    onMousedown: { type: Function as PropType<(e: MouseEvent) => void> },
    onMouseenter: { type: Function as PropType<(e: MouseEvent) => void> },
    onMouseleave: { type: Function as PropType<(e: MouseEvent) => void> },

    // Motion
    choiceTransitionName: String,

    // Internal props
    /**
     * Only used in current version for internal event process.
     * Do not use in production environment.
     */
    internalProps: {
      type: Object as PropType<{
        mark?: string;
        onClear?: OnClear;
        skipTriggerChange?: boolean;
        skipTriggerSelect?: boolean;
        onRawSelect?: (value: RawValueType, option: OptionType, source: SelectSource) => void;
        onRawDeselect?: (value: RawValueType, option: OptionType, source: SelectSource) => void;
      }>,
      default: undefined as {
        mark?: string;
        onClear?: OnClear;
        skipTriggerChange?: boolean;
        skipTriggerSelect?: boolean;
        onRawSelect?: (value: RawValueType, option: OptionType, source: SelectSource) => void;
        onRawDeselect?: (value: RawValueType, option: OptionType, source: SelectSource) => void;
      }
    },
    children: { type: Array as PropType<any[]> }
  }
}

export function vcSelectProps<T>() {
  return selectBaseProps<SelectOptionsType[number], T>()
}

export const selectProps = {
  ...omit(vcSelectProps<SelectValue>(), [ 'inputIcon', 'mode', 'getInputElement', 'backfill' ]),
  value: {
    type: [ Array, Object, String, Number ] as PropType<SelectValue | KeyLabel | KeyLabel[]>
  },
  defaultValue: {
    type: [ Array, Object, String, Number ] as PropType<SelectValue | KeyLabel | KeyLabel[]>
  },
  notFoundContent: PropTypes.any,
  suffixIcon: PropTypes.any,
  itemIcon: PropTypes.any,
  size: PropTypes.oneOf(tuple('small', 'middle', 'large', 'default')),
  mode: PropTypes.oneOf(tuple('multiple', 'tags', 'SECRET_COMBOBOX_MODE_DO_NOT_USE')),
  bordered: PropTypes.looseBool.def(true),
  transitionName: PropTypes.string.def('slide-up'),
  choiceTransitionName: PropTypes.string.def('')
}

export type SelectProps = Partial<ExtractPropTypes<typeof selectProps>>;

const { OptGroup } = Select

// 支持 key, value, label，兼容 UserSearch 中只填写了 key 的情况。
export type KeyLabel = Partial<LabeledValue> & RequestOptionsType;

/** 用户扩展数据后的值类型 */
export type DataValueType<T> = KeyLabel & T;

/** 可能单选，可能多选 */
export type DataValuesType<T> = DataValueType<T> | DataValueType<T>[];

export interface SearchSelectProps extends Omit<SelectProps, 'options'> {
  /** 自定义搜索方法, 返回搜索结果的 Promise */
  request?: (params: { query: string }) => Promise<DataValueType<Record<string, any>>[]>;
  /** 自定义选项渲染 */
  optionItemRender?: (item: DataValueType<Record<string, any>>) => VueNode;
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

const SearchSelect: FunctionalComponent = (props: SearchSelectProps, { attrs }) => {
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

  const getMergeValue: SelectProps['onChange'] = (value, option) => {
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
