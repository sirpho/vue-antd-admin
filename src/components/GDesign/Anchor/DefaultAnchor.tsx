import type { ExtractPropTypes, FunctionalComponent } from 'vue'
import { computed } from 'vue'
import { Tooltip } from 'ant-design-vue'
import { PropTypes } from '@/utils'
import { handelInkStyle } from './index'

const defaultAnchorProps = {
  isMobile: PropTypes.looseBool,
  dataSource: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  prefixCls: PropTypes.string,
  onGoAnchor: {
    type: Function as PropType<(path: string) => void>
  }
}

export type DefaultAnchorProps = Partial<ExtractPropTypes<typeof defaultAnchorProps>>

export const DefaultAnchor: FunctionalComponent<DefaultAnchorProps> = (props) => {
  const { dataSource = [], prefixCls = '', onGoAnchor, isMobile } = props

  const baseClassName = computed(() => {
    return {
      [`${prefixCls}`]: true,
      [`${prefixCls}-mobile`]: isMobile
    }
  })

  const linksRender = () => (
    <div class={`${prefixCls}-wrapper`}>
      {dataSource.map((item: any, index) => (
        <div
          key={index}
          style={handelInkStyle(item.level, isMobile)}
          class={{
            [`${prefixCls}-ink`]: true,
            [`${prefixCls}-ink-active`]: item.active
          }}
          onClick={() => onGoAnchor && onGoAnchor(item.link)}
        >
          <Tooltip title={item.name}>{item.name}</Tooltip>
        </div>
      ))}
    </div>
  )

  return (
    <div class={baseClassName.value}>
      {isMobile ? linksRender() : <g-affix offset={68}>{linksRender()}</g-affix>}
    </div>
  )
}
DefaultAnchor.inheritAttrs = false
