import { Button, notification } from 'ant-design-vue'
import { h, onMounted, onUnmounted, ref } from 'vue'
import { isDev } from '@/utils'
import { useRouter } from 'vue-router'
import { useThrottleFn } from "@vueuse/core"
const isDevEnvironment = isDev()
export default function notifyUpdate() {
  const currentHash = ref<string[]>([])
  const originHash = ref<string[]>([])

  const router = useRouter()
  onMounted(() => {
    init()
    document.addEventListener('visibilitychange', handleVisibilitychange)

    /**
     * 路由加载报错时检查更新
     */
    router.onError(async () => {
      await checkUpdate()
    })
  })
  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilitychange)
  })

  /**
   * 系统初次加载时获取hash
   */
  const init = async () => {
    const html: string = await getHtml()
    currentHash.value = parserScript(html)
  }

  /**
   * 标签激活时检查更新
   */
  const handleVisibilitychange = async () => {
    if (!document.hidden) {
      // 用户切换到当前标签页
      await handleCheckThrottle()
    }
  }

  /**
   * 检查更新
   */
  const checkUpdate = async () => {
    if (isDevEnvironment) {
      return
    }
    const newHtml = await getHtml()
    originHash.value = parserScript(newHtml)
    compare(currentHash.value, originHash.value)
  }

  /**
   * 节流
   */
  const handleCheckThrottle = useThrottleFn(checkUpdate, 5 * 60 * 1000)

  /**
   * 读取index html
   */
  const getHtml = async () => {
    const indexURL = window.location.href.split('#').shift()
    return await fetch(indexURL, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    }).then((res) => res.text())
  }

  /**
   * 匹配hash
   * @param html
   */
  const parserScript = (html: string) => {
    const reg = new RegExp(/<script(?:\s+[^>]*)?>(.*?)<\/script\s*>/gi) //script正则
    return (html.match(reg) as string[]) || [] //匹配script标签
  }

  /**
   * 对比hash值，判断是否需要更新
   * @param oldArr
   * @param newArr
   */
  const compare = (oldArr: string[], newArr: string[]) => {
    const base = oldArr.length
    const arr = Array.from(new Set(oldArr.concat(newArr)))
    //如果新旧length 不一样 通知更新
    if (arr.length !== base) {
      openNotification()
    }
  }

  /**
   * 提示更新消息
   */
  const openNotification = () => {
    // 如果是登录页面，则直接刷新
    if (window.location.href.includes('login')) {
      confirm()
      return
    }

    notification.open({
      message: '检测到发布了新版本，是否刷新页面',
      description: '新版本可能修复了bug或启用了新的功能，建议刷新网页后重新登录',
      btn: () =>
        h(
          Button,
          {
            type: 'primary',
            size: 'small',
            onClick: () => confirm()
          },
          { default: () => '确认' }
        ),
      onClose: confirm,
      key: 'updatePanel',
      duration: null
    })
  }

  /**
   * 确认更新
   */
  const confirm = () => {
    notification.close('updatePanel')
    setTimeout(() => {
      window.location.reload()
    }, 200)
  }
}
