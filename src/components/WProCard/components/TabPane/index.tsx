import type { FunctionalComponent } from 'vue'
import { getPrefixCls } from '@wd-design/pro-utils'
import type { ProCardTabPaneProps } from '../../typings'
import Card from '../Card'

import './style.less'

const TabPane: FunctionalComponent<ProCardTabPaneProps> = (props, { slots, attrs }) => {
  const {
    key,
    tab,
    tabKey,
    disabled,
    destroyInactiveTabPane,
    cardProps = {},
    ...rest
  } = props

  const baseClassName = getPrefixCls({
    suffixCls: 'card'
  })

  return (
    <a-tab-pane
      key={key}
      tabKey={tabKey}
      tab={tab}
      class={{
        [`${attrs.class}`]: attrs.class,
        [`${baseClassName}-tabpane`]: true
      }}
      style={attrs.style}
      disabled={disabled}
      destroyInactiveTabPane={destroyInactiveTabPane}
      {...rest}
    >
      <Card {...cardProps}>{slots.default?.()}</Card>
    </a-tab-pane>
  )
}

export default TabPane
