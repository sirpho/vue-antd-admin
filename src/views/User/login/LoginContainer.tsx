import { useMemo } from '@gx-admin/hooks/core'
import { getPrefixCls, getSlotVNode } from '@gx-admin/utils'

import './login.less'

export type LoginFormProps = {
  message: VueNode | false
  title: VueNode | false
  subTitle: VueNode | false
  actions: VueNode
  logo?: VueNode | string
}

function LoginContainer(props: Partial<LoginFormProps>, { slots }) {
  const LogonRender = getSlotVNode(slots, props, 'logo')
  const MessageRender = getSlotVNode(slots, props, 'message')
  const TitleRender = getSlotVNode(slots, props, 'title')
  const SubTitleRender = getSlotVNode(slots, props, 'subTitle')
  const ActionsRender = getSlotVNode(slots, props, 'actions')

  const baseClassName = getPrefixCls({
    suffixCls: 'form-login',
    isPor: true
  })
  const getCls = (className: string) => `${baseClassName}-${className}`

  /** 生成logo 的dom，如果是string 设置为图片 如果是个 dom 就原样保留 */
  const logoDom = useMemo(() => {
    if (!LogonRender) return null
    if (typeof LogonRender === 'string') {
      return <img src={LogonRender} />
    }
    return LogonRender
  })

  return (
    <div class={getCls('container')}>
      <div class={getCls('top')}>
        {TitleRender || logoDom.value ? (
          <div class={getCls('header')}>
            {logoDom.value ? <span class={getCls('logo')}>{logoDom.value}</span> : null}
            {TitleRender ? <span class={getCls('title')}>{TitleRender}</span> : null}
          </div>
        ) : null}
        {SubTitleRender ? <div class={getCls('desc')}>{SubTitleRender}</div> : null}
      </div>
      <div class={getCls('main')}>
        {MessageRender}
        {slots.default?.()}
        {ActionsRender ? <div class={getCls('other')}>{ActionsRender}</div> : null}
      </div>
    </div>
  )
}

export default LoginContainer
