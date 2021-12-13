<template>
  <div :class="$style[`${prefixCls}-toolbar`]">
    <template v-for="item in toolbarItemList" :key="item.type">
      <a-tooltip placement="bottom" v-bind="item.disabled ? { visible: false } : {}">
        <template #title>{{ item.tooltip }}</template>
        <span
          :class="$style[`${prefixCls}-toolbar__icon`]"
          v-if="item.icon"
          @click="onControl(item)"
        >
          <g-icon
            :icon="item.icon"
            :class="item.disabled ? `disabeld ${$style[`${prefixCls}_icon`]}` : `${$style[`${prefixCls}_icon`]}`"
          />
        </span>
      </a-tooltip>
      <a-divider v-if="item.separate" type="vertical" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, unref, watchEffect, nextTick, onUnmounted } from 'vue'
import type { ToolbarConfig } from '../typings'
import { ToolbarTypeEnum } from '../enum'
import { useFlowChartContext } from '../utils/useFlowContext'

export default defineComponent({
  name: 'FlowChartToolbar',
  props: {
    prefixCls: String
  },
  emits: [ 'view-data' ],
  setup(_, { emit }) {
    const toolbarItemList = ref<ToolbarConfig[]>([
      {
        type: ToolbarTypeEnum.ZOOM_IN,
        icon: 'zoom-out-line',
        tooltip: '缩小'
      },
      {
        type: ToolbarTypeEnum.ZOOM_OUT,
        icon: 'zoom-in-line',
        tooltip: '放大'
      },
      {
        type: ToolbarTypeEnum.RESET_ZOOM,
        icon: 'fullscreen-exit-line',
        tooltip: '重置比例'
      },
      { separate: true },
      {
        type: ToolbarTypeEnum.UNDO,
        icon: 'arrow-go-back-line',
        tooltip: '后退',
        disabled: true
      },
      {
        type: ToolbarTypeEnum.REDO,
        icon: 'arrow-go-forward-line',
        tooltip: '前进',
        disabled: true
      },
      { separate: true },
      {
        type: ToolbarTypeEnum.SNAPSHOT,
        icon: 'download-2-line',
        tooltip: '下载'
      }
    ])

    const { logicFlow } = useFlowChartContext()

    function onHistoryChange({ data: { undoAble, redoAble } }) {
      const itemsList = unref(toolbarItemList)
      const undoIndex = itemsList.findIndex((item) => item.type === ToolbarTypeEnum.UNDO)
      const redoIndex = itemsList.findIndex((item) => item.type === ToolbarTypeEnum.REDO)
      if (undoIndex !== -1) {
        unref(toolbarItemList)[undoIndex].disabled = !undoAble
      }
      if (redoIndex !== -1) {
        unref(toolbarItemList)[redoIndex].disabled = !redoAble
      }
    }

    const onControl = (item) => {
      const lf = unref(logicFlow)
      if (!lf) {
        return
      }
      switch (item.type) {
        case ToolbarTypeEnum.ZOOM_IN:
          lf.zoom()
          break
        case ToolbarTypeEnum.ZOOM_OUT:
          lf.zoom(true)
          break
        case ToolbarTypeEnum.RESET_ZOOM:
          lf.resetZoom()
          break
        case ToolbarTypeEnum.UNDO:
          lf.undo()
          break
        case ToolbarTypeEnum.REDO:
          lf.redo()
          break
        case ToolbarTypeEnum.SNAPSHOT:
          lf.getSnapshot()
          break
        case ToolbarTypeEnum.VIEW_DATA:
          emit('view-data')
          break
      }
    }

    watchEffect(async () => {
      if (unref(logicFlow)) {
        await nextTick()
        unref(logicFlow)?.on('history:change', onHistoryChange)
      }
    })

    onUnmounted(() => {
      unref(logicFlow)?.off('history:change', onHistoryChange)
    })

    return {
      toolbarItemList,
      onControl
    }
  }
})
</script>

<style lang="less" module>
@import "../style";
</style>
