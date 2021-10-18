import { FunctionalComponent } from 'vue'
import { getPrefixCls } from '/@/components/_util'
import Card from '../Card'
import type { ProCardTabPaneProps } from '../../props'

import './style.less'

const TabPane: FunctionalComponent<ProCardTabPaneProps> = (props, { slots }) => {
  const {
    key,
    tab,
    tabKey,
    disabled,
    destroyInactiveTabPane,
    className,
    style,
    cardProps,
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
        [`${className}`]: className,
        [`${baseClassName}-tabpane`]: true
      }}
      style={style}
      disabled={disabled}
      destroyInactiveTabPane={destroyInactiveTabPane}
      {...rest}
    >
      <Card {...cardProps}>{slots.default?.()}</Card>
    </a-tab-pane>
  )
}

export default TabPane
