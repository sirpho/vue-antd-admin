<template>
  <g-pro-page-container>
    <!--    <div class="workplace-content">-->
    <!--      <h1>欢迎使用模板系统</h1>-->
    <!--      <p>welcome to use template management system</p>-->
    <!--    </div>-->

    <input type="text" v-model="state.content" />

    <button @click="generateQRCode">生成二维码</button>

    <div class="canvas-wrapper">
      <canvas class="canvas-content" width="320" height="320" ref="canvasRef"></canvas>
      <canvas class="canvas-content" width="320" height="390" ref="resultRef"></canvas>
    </div>
  </g-pro-page-container>
</template>
<script>
import QRCode from 'qrcode'
import { dataURLtoBlob, dataURLtoFile } from '@sirpho/utils/util'

export default {
  setup() {
    const state = reactive({
      content: ''
    })
    const canvasRef = ref()
    const resultRef = ref()

    const generateQRCode = () => {
      handleQRCode(state.content)
    }
    const handleQRCode = (content) => {
      QRCode.toCanvas(
        canvasRef.value,
        content,
        { width: 320, margin: 0.5 },
        async function (error) {
          if (error) return console.error('二维码生成失败', error)
          nextTick(() => {
            const targetContext = resultRef.value.getContext('2d')
            // 设置背景颜色
            targetContext.fillStyle = '#FFFFFF'
            // 填充整个 Canvas
            targetContext.fillRect(0, 0, 320, 390)
            // 二维码填充
            targetContext.drawImage(canvasRef.value, 0, 0)
            // 设置字体样式
            targetContext.font = '18px 苹方'
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
            targetContext.fillText(content, textX, textY)

            // 转为blob后下载
            const dataURL = resultRef.value.toDataURL('image/png')
            const blob = dataURLtoBlob(dataURL)

            const url = window.URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = 'test.png'

            link.click()

            window.URL.revokeObjectURL(url)
          })
        }
      )
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
}
.canvas-content {
  width: 320px;
  height: 390px;
}
</style>
