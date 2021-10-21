import { computed, FunctionalComponent } from 'vue'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
import { getPrefixCls } from '/@/components/_util'

import './style.less'

const LabelIconTip: FunctionalComponent<{
  label?: CustomRender,
  subTitle?: CustomRender,
  tooltipIcon?: CustomRender,
  tooltipText?: CustomRender,
}> = (props) => {
  const { label, subTitle, tooltipText, tooltipIcon } = props
  const tooltip = computed(() => !!(props.tooltipText || props.tooltipIcon))
  const baseClassName = getPrefixCls({
    suffixCls: 'core-label-tip'
  })

  if (!tooltip.value && !subTitle) {
    return <>{label}</>
  }

  const icon = tooltipIcon || <InfoCircleOutlined />

  return (
    <div
      class={baseClassName}
      onMousedown={(e) => e.stopPropagation()}
      onMouseleave={(e) => e.stopPropagation()}
      onMousemove={(e) => e.stopPropagation()}
    >
      {label}
      {subTitle && <div class={`${baseClassName}-subtitle`}>{subTitle}</div>}
      {tooltip.value && (
        <a-tooltip title={tooltipText}>
          <span class={`${baseClassName}-icon`}>{icon}</span>
        </a-tooltip>
      )}
    </div>
  )
}

export default LabelIconTip
