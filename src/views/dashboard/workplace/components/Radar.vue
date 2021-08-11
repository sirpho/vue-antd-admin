<template>
  <div style="min-height: 400px;" id="radar-container"></div>
</template>

<script lang="ts">
import DataSet from '@antv/data-set'
import { Chart } from '@antv/g2'
import { defineComponent, onBeforeUnmount, onMounted, reactive, toRefs } from 'vue'

interface stateTypes {
  chart: Chart | null;
}

export default defineComponent({
  name: 'Radar',
  props: {
    data: {
      type: Array,
      default: null
    },
    max: {
      type: Number,
      default: 10
    }
  },
  setup(props) {
    const state: stateTypes = reactive({
      chart: null
    })
    onMounted(() => {
      initRadar()
    })
    onBeforeUnmount(() => {
      state.chart && state.chart.destroy()
    })
    const initRadar = () => {
      const dv = new DataSet.View().source(props.data)
      dv.transform({
        type: 'fold',
        fields: [ '个人', '团队', '部门' ],
        key: 'user',
        value: 'score'
      })
      setTimeout(() => {
        renderRadar(dv)
      }, 200)
    }
    const renderRadar = (dv) => {
      state.chart = new Chart({
        container: 'container',
        autoFit: true,
        padding: [ 35, 30, 16, 30 ] as [ number, number, number, number ],
        height: 343
      })
      state.chart.data(dv.rows)
      state.chart.scale('score', {
        min: 0,
        max: props.max
      })
      state.chart.coordinate('polar', {
        radius: 0.8
      })
      state.chart.axis('item', {
        line: null,
        tickLine: null,
        grid: {
          line: {
            style: {
              lineDash: null
            }
          }
        }
      })
      state.chart.axis('score', {
        line: null,
        tickLine: null,
        grid: {
          line: {
            style: {
              lineDash: null
            }
          }
        }
      })

      state.chart
        .point()
        .position('item*score')
        .color('user')
        .shape('circle')
        .size(4)
        .style({
          stroke: '#fff',
          lineWidth: 1,
          fillOpacity: 1
        })
      state.chart
        .line()
        .position('item*score')
        .color('user')
        .size(2)
      state.chart.render()
    }
    return {
      ...toRefs(state)
    }
  }
})
</script>
