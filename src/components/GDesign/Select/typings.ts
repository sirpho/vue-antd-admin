import type { CSSProperties, VNode } from 'vue'
import type { SelectValue, LabeledValue } from 'ant-design-vue/lib/select'
import type { SelectProps } from 'ant-design-vue/lib/vc-select'
import type {
  FieldNames,
  Mode,
  OptionsType as SelectOptionsType,
  RenderDOMFunc
} from 'ant-design-vue/lib/vc-select/interface'
import type {
  CustomTagProps,
  FilterFunc,
  OnClear,
  RawValueType,
  SelectSource,
  SingleType
} from 'ant-design-vue/lib/vc-select/interface/generator'
import { Placement } from 'ant-design-vue/lib/vc-select/generate'
import { PropTypes } from '/@/utils'
import { RequestOptionsType } from '/@/components/_util'

// 支持 key, value, label，兼容 UserSearch 中只填写了 key 的情况。
export type KeyLabel = Partial<LabeledValue> & RequestOptionsType;

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
    inputIcon: PropTypes.VueNode,
    removeIcon: PropTypes.VueNode,
    menuItemSelectedIcon: PropTypes.VueNode,

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

export {
  SelectProps,
  SelectValue,
  LabeledValue
}
