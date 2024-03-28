<template>
  <g-pro-page-container>
    <a-button @click="generateQRCode" type="primary" :loading="state.loading">生成二维码</a-button>
    <br />
    <div class="canvas-wrapper">
      <canvas class="canvas-content pre" width="320" height="320" ref="canvasRef"></canvas>
      <canvas class="canvas-content" width="320" height="390" ref="resultRef"></canvas>
    </div>
  </g-pro-page-container>
</template>
<script>
import QRCode from 'qrcode'
import { testQrcodeList } from '@/views/dashboard/workplace/data'
export default {
  setup() {
    const state = reactive({
      sum: testQrcodeList.length,
      loading: false
    })

    const canvasRef = ref()
    const resultRef = ref()

    const generateQRCode = () => {
      const index = Math.floor(Math.random() * state.sum)
      handleQRCode(index)
    }
    const handleQRCode = (index) => {
      const content = testQrcodeList[index]
      const fullContent = `https://activity.kellyone.com/bindshop?sqr=${content}`
      QRCode.toCanvas(canvasRef.value, fullContent, { width: 320, margin: 0.5 }, async (error) => {
        if (error) {
          alert(`二维码生成失败, ${error}, 序号：${index}`)
          return console.error(`二维码生成失败, ${error}, 序号：${index}`)
        }
        await nextTick()
        const targetContext = resultRef.value.getContext('2d')
        // 设置背景颜色
        targetContext.fillStyle = '#FFFFFF'
        // 填充整个 Canvas
        targetContext.fillRect(0, 0, 320, 390)
        // 二维码填充
        targetContext.drawImage(canvasRef.value, 0, 0)
        // 设置字体样式
        targetContext.font = 'bold 20px 苹方'
        // 设置文字颜色
        targetContext.fillStyle = '#000000'
        // 设置文字居中对齐
        targetContext.textAlign = 'center'
        // 设置文字垂直居中对齐
        targetContext.textBaseline = 'middle'
        // 计算文字的居中位置
        const textX = 320 / 2
        const textY = (390 - 320) / 2 + 320
        // 绘制填充文字
        targetContext.fillText(`编号：${content}`, textX, textY)
      })
    }

    return {
      state,
      canvasRef,
      resultRef,
      handleQRCode,
      generateQRCode
    }
  }
}
</script>
<style lang="less" scoped>
@import './style';

.canvas-wrapper {
  display: flex;
  gap: 24px;
  //opacity: 0;
}

.pre {
  opacity: 0;
}

.tip-bar {
  width: 80%;
}

.canvas-content {
  width: 320px;
  height: 390px;
}
</style>
