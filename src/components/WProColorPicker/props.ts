export const isValidComponentSize = (val: string) =>
  [ '', 'large', 'medium', 'small', 'mini' ].includes(val)

declare type ComponentSize = 'large' | 'medium' | 'small' | 'mini'

export const proColorProps = {
  value: {
    type: String as PropType<string>
  },
  showAlpha: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  colorFormat: {
    type: String as PropType<string>
  },
  disabled: {
    type: Boolean as PropType<boolean>
  },
  size: {
    type: String as PropType<ComponentSize>,
    validator: isValidComponentSize
  },
  popperClass: {
    type: String as PropType<string>
  },
  predefine: {
    type: Array as PropType<any[]>
  }
}
