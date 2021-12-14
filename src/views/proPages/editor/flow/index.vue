<template>
  <g-pro-page-wrapper>
    <a-card :bordered="false">
      <div style="height: 729px; min-height: 729px;">
        <div style="height: 100%">
          <FlowChartToolbar :prefixCls="prefixCls" @view-data="handlePreview" />
          <div ref="lfElRef" style="height: 100%" ></div>
        </div>
      </div>
    </a-card>
  </g-pro-page-wrapper>
</template>

<script lang="ts">
import type { Ref } from 'vue'
import { defineComponent, ref, unref, computed, watch, nextTick, onMounted } from 'vue'
import type { Definition } from '@logicflow/core'
import LogicFlow from '@logicflow/core'
import { Snapshot, BpmnElement, Menu, DndPanel, SelectionSelect } from '@logicflow/extension'
import demoData from './dataTurbo.json'
import FlowChartToolbar from './components/FlowChartToolbar.vue'
import { createFlowChartContext } from './utils/useFlowContext'
import { configDefaultDndPanel } from './utils/config'
import { toLogicFlowData } from './utils/adpterForTurbo'

import '@logicflow/core/dist/style/index.css'
import '@logicflow/extension/lib/style/index.css'

export default defineComponent({
  components: {
    FlowChartToolbar
  },
  setup() {
    const prefixCls = 'flow-chart'
    
    const lfElRef = ref(null)
    const graphData = ref({})
    const lfInstance = ref(null) as Ref<LogicFlow | null>
    createFlowChartContext({
      logicFlow: lfInstance as unknown as LogicFlow
    })
    
    const getFlowOptions = computed(() => {
      const flowOptions: Definition | Object = {}
      
      const defaultOptions: Partial<Definition> = {
        grid: true,
        background: {
          color: '#f7f9ff'
        },
        keyboard: {
          enabled: true
        },
        ...flowOptions
      }
      return defaultOptions as Definition
    })
    
    watch(
      () => unref(getFlowOptions),
      (options) => {
        unref(lfInstance)?.updateEditConfig(options)
      }
    )
    
    onMounted(() => {
      init()
    })
    
    const init = async () => {
      await nextTick()
      
      const lfEl = unref(lfElRef)
      if (!lfEl) {
        return
      }
      LogicFlow.use(DndPanel)
      
      LogicFlow.use(Snapshot)
      LogicFlow.use(BpmnElement)
      LogicFlow.use(Menu)
      LogicFlow.use(SelectionSelect)
      
      lfInstance.value = new LogicFlow({
        ...unref(getFlowOptions),
        container: lfEl
      })
      const lf = unref(lfInstance)!
      lf?.setDefaultEdgeType('line')
      onRender()
      lf?.setPatternItems(configDefaultDndPanel(lf))
    }
    
    const onRender = async () => {
      await nextTick()
      const lf = unref(lfInstance)
      if (!lf) {
        return
      }
      const lFData = toLogicFlowData(demoData)
      lf.render(lFData)
    }
    
    const handlePreview = () => {
      const lf = unref(lfInstance)
      if (!lf) {
        return
      }
      graphData.value = unref(lf).getGraphData()
    }
    
    return {
      lfElRef,
      prefixCls,
      handlePreview
    }
  }
})
</script>
