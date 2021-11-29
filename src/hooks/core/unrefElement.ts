import type { ComponentPublicInstance } from 'vue'
import { unref } from 'vue'
import type { MaybeRef } from '../typings'

export type VueInstance = ComponentPublicInstance
export type MaybeElementRef = MaybeRef<HTMLElement | SVGElement | VueInstance | undefined | null>

/**
 * Get the dom element of a ref of element or Vue component instance
 *
 * @param elRef
 */
export function unrefElement(elRef: MaybeElementRef): HTMLElement | SVGElement | undefined {
  const plain = unref(elRef)
  return (plain as VueInstance)?.$el ?? plain
}
