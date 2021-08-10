import { message } from 'ant-design-vue'
import Clipboard from 'clipboard'

function clipboardSuccess(text: string) {
  message.success(`复制${text}成功`)
}

function clipboardError(text: string) {
  message.error(`复制${text}失败`)
}

/**
 * @description 复制数据
 * @param text
 * @param event
 */
export default function handleClipboard(text: string, event: any) {
  const clipboard: any = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess(text)
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError(text)
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
