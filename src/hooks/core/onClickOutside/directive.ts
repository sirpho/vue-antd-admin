import { FunctionDirective } from 'vue'
import { onClickOutside } from './index'

/**
 * TODO: Test that this actually works
 */
export const VOnClickOutside: FunctionDirective<any, (evt: PointerEvent) => void> = (el, binding) => {
  onClickOutside(el, binding.value)
}
