import { defineComponent, reactive } from 'vue'
import { Chart } from '@antv/g2'
import { formatPercentageTime, formatPower, formatTime } from '@/views/example/visualization/utils'
import { divide, percentage } from '@sirpho/utils/math'

let chartInstance: any
export default defineComponent({
  emits: ['handleOk'],
  setup(_props, { expose, emit }) {
    const state = reactive({
      modalTitle: '',
      visible: false,
      isFail: false,
      spinning: false,
      skeletonLoading: false,
      disabled: false,
      pickerVisible: false,
      historyList: undefined,
      expireTime: 0,
      startTime: 0,
      endTime: 0
    })
    /**
     * 恢复数据到初始化状态
     */
    const resetModalState = () => {
      state.isFail = false
      state.spinning = false
      state.visible = false
      state.skeletonLoading = false
    }

    /**
     * 查看
     */
    const watch = async (record: any, list: any[], startTime: number, endTime: number) => {
      state.modalTitle = `查看${record.identifer}`
      state.skeletonLoading = true
      state.visible = true
      state.startTime = startTime
      state.endTime = endTime
      const container = renderChart(list)
      setTimeout(async () => {
        state.skeletonLoading = false
        await nextTick()
        document.getElementById('chart-container').appendChild(container)
        chartInstance?.render()
      }, 100)
    }

    /**
     * 渲染图表 两个区域图合在一起
     * @param data
     */
    const renderChart = (data) => {
      chartInstance = new Chart({
        width: 1152,
        height: 700
      })
      chartInstance
        .data(data)
        .axis('x', {
          labelFormatter: (value) => {
            return formatTime(value)
          },
          line: true,
          title: '时间'
        })
        .axis('y', {
          labelFormatter: (value) => {
            return formatPower(value)
          },
          line: true,
          title: false
        })

      chartInstance
        .area()
        .encode('x', (d) => new Date(d.ts))
        .encode('y', 'hs')
        .style('fill', 'linear-gradient(-90deg, #2b2d30 0%, #202124 100%)')
        .tooltip({
          items: [
            {
              channel: 'y',
              color: '#e2d3ae',
              name: '实际',
              valueFormatter: (value) => formatPower(value)
            },
            (item) => {
              return {
                color: '#ffffff',
                name: '倍率',
                value: percentage(divide(item.hs2, item.hs))
              }
            }
          ]
        })

      chartInstance
        .area()
        .encode('x', (d) => new Date(d.ts))
        .encode('y', 'hs2')
        .slider({
          x: {
            formatter: (value) => {
              return formatPercentageTime(value, state.startTime, state.endTime)
            }
          }
        })
        .style('fill', 'linear-gradient(-90deg, #fcebbd 0%, #d6f17f 100%)')
        .tooltip({
          items: [{ channel: 'y', name: '结算', valueFormatter: (value) => formatPower(value) }]
        })

      return chartInstance.getContainer()
    }

    onUnmounted(() => {
      chartInstance?.destroy()
    })

    /**
     * 关闭弹窗
     */
    const handleCancel = () => {
      resetModalState()
      emit('handleOk')
    }

    /**
     * 暴露组件内部的方法
     */
    expose({
      watch
    })

    return () => {
      return (
        <div>
          <g-pro-modal
            title={state.modalTitle}
            visible={state.visible}
            isFail={state.isFail}
            spinning={state.spinning}
            skeletonLoading={state.skeletonLoading}
            onCancel={() => handleCancel()}
            type="normal"
            width="1200px"
            v-slots={{
              footer: () => {
                return (
                  <div class="gx-pro-modal-footer">
                    <a-button key="cancel" disabled={state.spinning} onClick={handleCancel}>
                      关闭
                    </a-button>
                  </div>
                )
              }
            }}
          >
            <div id="chart-container"></div>
          </g-pro-modal>
        </div>
      )
    }
  }
})
