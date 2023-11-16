import { CSSProperties, defineComponent } from 'vue'
import { Tooltip } from 'ant-design-vue'
import { tooltipProps } from 'ant-design-vue/lib/tooltip'
import { getPadding } from '@gx-design/ProTable/utils'

export default defineComponent({
  props: {
    overflowLine: {
      type: Number,
      default: 1
    },
    ...tooltipProps()
  },
  setup(props, { slots }) {
    const visible = ref(false)
    /**
     * 鼠标移入单元格
     * @param event
     */
    const handleMouseEnter = (event: MouseEvent) => {
      // 判断是否text-overflow, 如果是就显示tooltip
      const cellChild = (event.target as HTMLElement).querySelector(
        '.overflow-tooltip__cell'
      ) as HTMLElement
      if (!cellChild.childNodes.length) {
        visible.value = false
        return
      }
      const range = document.createRange()
      range.setStart(cellChild, 0)
      range.setEnd(cellChild, cellChild.childNodes.length)
      const rangeWidth = Math.round(range.getBoundingClientRect().width)
      const rangeHeight = Math.round(range.getBoundingClientRect().height)
      const { top, left, right, bottom } = getPadding(cellChild)
      const horizontalPadding = left + right
      const verticalPadding = top + bottom
      visible.value =
        rangeWidth + horizontalPadding > cellChild.offsetWidth ||
        rangeHeight + verticalPadding > cellChild.offsetHeight ||
        cellChild.scrollWidth > cellChild.offsetWidth
          ? undefined
          : false
    }

    // /**
    //  * 鼠标移出
    //  * @param _event
    //  */
    // const handleMouseLeave = (_event: MouseEvent) => {
    //   // visible.value = false
    // }

    const cssStyle: CSSProperties = {
      width: '100%'
    }

    const ellipsisStyle: CSSProperties = {
      wordBreak: 'break-all',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': props.overflowLine /* 这里是超出几行省略 */,
      overflow: 'hidden',
      width: '100%'
    }

    return () => {
      return (
        <div
          class="overflow-tooltip"
          style={cssStyle}
          onMouseenter={(e) => handleMouseEnter(e)}
          // onMouseleave={(e) => handleMouseLeave(e)}
        >
          <Tooltip {...props} visible={unref(visible)}>
            <div class="overflow-tooltip__cell" style={ellipsisStyle}>
              {slots.default?.()}
            </div>
          </Tooltip>
        </div>
      )
    }
  }
})
