<template>
  <g-pro-page-container>
    <!--    <div class="workplace-content">-->
    <!--      <h1>欢迎使用模板系统</h1>-->
    <!--      <p>welcome to use template management system</p>-->
    <!--    </div>-->

    <a-button @click="generateQRCode" type="primary" :loading="state.loading">生成二维码</a-button>
    <br />
    <div class="tip-bar" v-if="state.current > 0">
      当前进度：已生成{{ state.current + 1 }}张图片
      <a-progress :percent="state.percent" />
    </div>
    <div class="canvas-wrapper">
      <canvas class="canvas-content" width="320" height="320" ref="canvasRef"></canvas>
      <canvas class="canvas-content" width="320" height="390" ref="resultRef"></canvas>
    </div>
  </g-pro-page-container>
</template>
<script>
import QRCode from 'qrcode'
import { dataURLtoBlob } from '@sirpho/utils/util'
import { delayAsync } from '@sirpho/utils/delayAsync'
import { qrcodeList } from '@/views/dashboard/workplace/data'
import JSZip from 'jszip'
const zip = new JSZip()
export default {
  setup() {
    const state = reactive({
      sum: qrcodeList.length,
      current: 0,
      loading: false,
      percent: 0
    })

    const canvasRef = ref()
    const resultRef = ref()

    const generateQRCode = () => {
      handleQRCode(0)
      state.loading = true
    }
    const handleQRCode = (index) => {
      if (index >= qrcodeList.length) {
        zip.generateAsync({ type: 'blob' }).then((blob) => {
          const url = window.URL.createObjectURL(blob)

          const link = document.createElement('a')
          link.href = url
          link.download = 'test.zip'
          link.click()
          window.URL.revokeObjectURL(url)
          state.loading = false
        })
        return
      }
      state.current = index
      state.percent = (index + 1) / qrcodeList.length
      const content = qrcodeList[index]
      QRCode.toCanvas(canvasRef.value, content, { width: 320, margin: 0.5 }, async (error) => {
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
        const [_pre, text] = content.split('=')
        // 绘制填充文字
        targetContext.fillText(`编号：${text}`, textX, textY)

        // 转为blob后下载
        const dataURL = resultRef.value.toDataURL('image/png')
        const blob = dataURLtoBlob(dataURL)

        zip.file(`${text}.png`, blob)
        await nextTick()
        if (index % 137 === 0) {
          await delayAsync(0.1)
        }
        handleQRCode(index + 1)
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
