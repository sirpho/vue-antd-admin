import PropTypes from '/@/hooks/vue-types'

export interface actionsTextItem {
  expandText?: string | VueNode;
  collapseText?: string | VueNode;
  selectAllText?: string | VueNode;
}

export const tagSelectProps = {
  style: PropTypes.style,
  className: PropTypes.string,
  hideCheckAll: PropTypes.looseBool,
  expandable: PropTypes.looseBool,
  actionsText: Object as PropType<actionsTextItem>,
  value: Array as PropType<(string | number)[]>,
  defaultValue: Array as PropType<(string | number)[]>,
  onChange: Function as PropType<(value: string | number, state: boolean) => void>
}

export const tagSelectOptionProps = {
  value: [ String, Number ] as PropType<string | number>,
  style: PropTypes.style,
  checked: PropTypes.looseBool,
  onChange: tagSelectProps.onChange,
}
