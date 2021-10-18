<template>
  <a-typography style="margin-top: 16px" id="stepsCard">
    <a-typography-title :level="4" :style="{color: '#454d64'}">
      竖向步骤示例
    </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0">
    <span class="wd-markdown-code">Steps</span>
    组件结合
    <span class="wd-markdown-code">ProCard</span>
    组件完成竖向步骤示例。
  </div>
  <div class="wd-markdown-demo">
    <ResizeObserver key="resize-observer" :onResize="({ width }) => { setResponsive(width < 596) }">
      <w-pro-card
        :split="responsive ? 'horizontal' : 'vertical'"
        bordered
        :style="isMobile ? undefined : { height: '320px'}"
      >
        <w-pro-card :colSpan="responsive ? 24 : 6">
          <a-steps
            style="height: 100%"
            :direction="responsive ? 'horizontal' : 'vertical'"
            size="small"
            :current="current"
          >
            <a-step title="填写基本信息" />
            <a-step title="配置模板" />
            <a-step title="配置访问" />
            <a-step title="配置部署和调度" />
            <a-step title="预览" />
          </a-steps>
        </w-pro-card>
        <w-pro-card title="流量占用情况" :colSpan="responsive ? 24 : 18">
          <a-space>
            <a-button
              key="primary"
              type="primary"
              @click="() => { current += 1 }"
              :disabled="current === 5"
            >
              下一步
            </a-button>
            <a-button key="pre" @click="() => { current -= 1 }" :disabled="current === 0">
              上一步
            </a-button>
          </a-space>
        </w-pro-card>
      </w-pro-card>
    </ResizeObserver>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from 'vue'
import { default as ResizeObserver } from 'ant-design-vue/es/vc-resize-observer'
import useMediaQuery from '/@/components/_util/useMediaQuery'

export default defineComponent({
  components: {
    ResizeObserver
  },
  setup() {
    const colSize = useMediaQuery()
    const isMobile = computed(
      () => (colSize.value === 'sm' || colSize.value === 'xs')
    )
    const current: Ref<number> = ref(0)
    const responsive: Ref<boolean> = ref(false)
    const setResponsive = (value: boolean) => {
      responsive.value = value
    }
    return {
      current,
      isMobile,
      responsive,
      setResponsive
    }
  }
})
</script>
