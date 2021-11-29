import type { FunctionalComponent } from 'vue'
import { getPrefixCls } from '@wd-design/pro-utils'
import type { ProCardTabPaneProps, CardProps } from '../../typings'
import Card from '../Card'

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
    ...rest
  } = props

  const cardProps = props.cardProps as CardProps

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
