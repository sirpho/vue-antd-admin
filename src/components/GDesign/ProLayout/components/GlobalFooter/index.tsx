import { defineComponent, VNodeChild } from 'vue'
import { LayoutFooter } from 'ant-design-vue'
import { getPrefixCls } from '@gx-admin/utils'
import type { CopyrightRender } from '../../RenderTypings'

export interface GlobalFooterProps {
  copyright?: VNodeChild | JSX.Element
  prefixCls?: string
}

export default defineComponent({
  name: 'GlobalFooter',
  props: {
    copyright: {
      type: [Object, Function, Boolean, String] as PropType<CopyrightRender>,
      default: 'Copyright © 2022 XX信息科技有限公司所有'
    }
  },
  setup(props) {
    const baseClassName = getPrefixCls({
      suffixCls: 'global-footer',
      isPor: true
    })
    const { pkg } = __APP_INFO__

    return () => (
      <LayoutFooter style={{ padding: 0 }}>
        <div class={baseClassName}>
          {props.copyright && <div class={`${baseClassName}-copyright`}>{props.copyright}</div>}
          <span class={`${baseClassName}-version`}>version {pkg.version}</span>
        </div>
      </LayoutFooter>
    )
  }
})
