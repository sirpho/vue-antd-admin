import { Slot, VNode, VNodeChild } from 'vue'

export type CustomRender =
  | Slot
  | VNodeChild
  | VNode
  | ((...props: any[]) => Slot)
  | ((...props: any[]) => VNode)
  | ((...args: any[]) => VNode)
  | VNode[]
  | JSX.Element
  | string
  | boolean
  | null
  | undefined;
