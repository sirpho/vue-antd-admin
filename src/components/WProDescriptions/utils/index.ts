import { Fragment } from 'vue'
import type { VNodeTypes } from 'vue'

export function isFragment(c) {
  return c.length === 1 && c[0].type === Fragment
}

export interface Option {
  keepEmpty?: boolean;
}

export default function toArray(children: any[], option: Option = {}): any[] {
  let ret: VNodeTypes[] = []

  children.forEach((child: any) => {
    if ((child === undefined || child === null) && !option.keepEmpty) {
      return
    }
    if (Array.isArray(child)) {
      ret = ret.concat(toArray(child))
    } else if (isFragment(child) && child.props) {
      ret = ret.concat(toArray(child.props.children, option))
    } else {
      ret.push(child)
    }
  })

  return ret
}
