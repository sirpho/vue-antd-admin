import type { FunctionalComponent } from 'vue'
import { cloneVNode, ref } from 'vue'
import { RightOutlined } from '@ant-design/icons-vue'
import { getPrefixCls, LabelIconTip } from '@gx-design/pro-utils'
import type { GroupProps } from '../../typings'
import { useFieldContext } from '../../FieldContext'

import './index.less'

const Group: FunctionalComponent<GroupProps> = (props, { slots }) => {
  const { groupProps } = useFieldContext()
  const {
    collapsible,
    defaultCollapsed,
    style,
    labelLayout,
    title = props.label,
    tooltip,
    align = 'start',
    direction,
    size = 32,
    titleStyle,
    titleRender,
    spaceProps,
    extra,
    autoFocus
  } = {
    ...groupProps,
    ...props
  }

  const collapsed = ref<boolean>(defaultCollapsed || false)
  const setCollapsed = (bool: boolean) => {
    collapsed.value = bool
  }
  const className = getPrefixCls({
    suffixCls: 'form-group'
  })

  const collapsibleButton = collapsible && (
    <RightOutlined
      style={{
        marginRight: 8
      }}
      rotate={!collapsed.value ? 90 : undefined}
    />
  )

  const label = (
    <LabelIconTip
      label={
        collapsibleButton ? (
          <div>
            {collapsibleButton}
            {title}
          </div>
        ) : (
          title
        )
      }
      tooltip={tooltip}
    />
  )
  const titleDom = titleRender ? titleRender(label, props) : label
  const hiddenChildren: VueNode[] = []
  const renderChild = slots.default?.().map((element, index) => {
    if (element?.props?.hidden) {
      hiddenChildren.push(element)
      return null
    }
    if (index === 0 && autoFocus) {
      return cloneVNode(element, {
        ...(element.props as any),
        autoFocus
      })
    }
    return element
  })

  return (
    <div
      class={{
        [`${className}`]: true,
        [`${className}-twoLine`]: labelLayout === 'twoLine'
      }}
      style={style}
      ref={ref}
    >
      {hiddenChildren.length > 0 && (
        <div
          style={{
            display: 'none'
          }}
        >
          {hiddenChildren}
        </div>
      )}
      {(title || tooltip || extra) && (
        <div
          class={`${className}-title`}
          style={titleStyle}
          onClick={() => {
            setCollapsed(!collapsed.value)
          }}
        >
          {extra ? (
            <div
              style={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              {titleDom}
              <span onClick={(e) => e.stopPropagation()}>{extra}</span>
            </div>
          ) : (
            titleDom
          )}
        </div>
      )}
      {collapsible && collapsed ? null : (
        <a-space
          {...spaceProps}
          className={`${className}-container`}
          size={size}
          align={align}
          direction={direction}
          style={{
            rowGap: 0,
            ...spaceProps?.['style']
          }}
        >
          {renderChild}
        </a-space>
      )}
    </div>
  )
}

Group.displayName = 'ProForm-Group'

export default Group
