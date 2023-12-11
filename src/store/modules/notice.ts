import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import {useStoreUser} from "@/store";
import {getNotices, readNotice, readNoticeAll} from "@/services/system/notices";
import dayjs from "dayjs";

const path = import.meta.env.VITE_WS_URL

export const useStoreNotice = defineStore('notice', () => {
  const state = reactive({
    websocket: null,
    noticeNum: 0,      // 消息数量
    connectCount: 0,   // 连接次数
    connectStatus: false,  // 连接状态
    notices: []
    })

  /**
   * 拉取消息
   */
  const queryNotices = async () => {
    const res = await getNotices()
    const data = res.data?.list || []
    state.notices = data.reverse().map(item => ({
      ...item,
      sendTime: item.sendTime? dayjs(item.sendTime as string).fromNow() : '',
      key: item.id,
    }))
    state.noticeNum = state.notices.length
  }

  // 消息已读
  const changeReadState = async (id: string) => {
    if(!id) {
      return
    }
    state.notices = state.notices.map((item) => {
      const notice = { ...item }
      if (notice.id === id) {
        notice.isRead = 'Y'
      }
      return notice
    })
    decrease()
    await readNotice(id)
  }

  /**
   * 全部已读
   */
  const clearReadState = async () => {
    state.notices = state.notices.map((item) => ({ ...item,isRead: 'Y' }))
    state.noticeNum = 0
    await readNoticeAll()
  }

  /**
   * 创建websocket
   */
  const createWebsocket = async () => {
      const user = useStoreUser()
      const token = user.accessToken
    if (!token) return
    if ('WebSocket' in window) {
      state.websocket = new WebSocket(`${path}/websocket/${token}`)
    }
  }

  /**
   * 连接websocket
   * 在用户退出时需要断开websocket
   * 0 (WebSocket.CONNECTING) 正在链接中
   * 1 (WebSocket.OPEN) 已经链接并且可以通讯
   * 2 (WebSocket.CLOSING) 连接正在关闭
   * 3 (WebSocket.CLOSED) 连接已关闭或者没有链接成功
   **/
  const connectWebSocket = async () => {
    await createWebsocket()
    state.connectCount++ // 第一次连接
    if (state.websocket && state.websocket.readyState == 1) {
      // console.log('已经链接并且可以通讯')
      state.connectCount = 0
    } else if (state.websocket && state.websocket.readyState == 2 ||
      state.websocket.readyState == 3) {
      // console.log('尝试服务器连接中')
      reconnectWebSocket()
    }

    // 连接成功钩子函数
    state.websocket.onopen = () => {
      state.connectStatus = true
      console.log('websocket连接成功')
    }

    // 接受消息钩子函数
    state.websocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log('websocket推送', data)
      if(data.message) {
        increase()
        state.notices.unshift({
          ...data,
          sendTime: data.sendTime? dayjs(data.sendTime as string).fromNow() : '',
          key: data.id
        })
      }
    }
    state.websocket.onerror = (event) => {
      console.log('websocket出错--' + JSON.stringify(event))
      state.connectStatus = false
    }
    state.websocket.onclose = () => {
      console.log('websocket连接关闭')
      //断开自动连接，连接失败6秒后再次连接，尝试连接10次
      if (state.connectStatus) {
        reconnectWebSocket()
      }
    }
  }

  /**
   * 断开连接
   */
  const websocketClose = () => {
    if (state.websocket) {
      state.connectStatus = false
      state.websocket.close()
    }
  }

  /**
   * 重新连接
   */
  const reconnectWebSocket = () => {
    if (state.connectCount < 10) {
      setTimeout(async () => {
        state.connectCount = state.connectCount + 1
        await connectWebSocket()
      }, 6000)
    } else {
      state.connectStatus = false
    }
  }

  const decrease = () => {
    state.noticeNum = state.noticeNum - 1 <= 0 ? 0 : state.noticeNum - 1
  }

  const increase = () => {
    state.noticeNum = state.noticeNum + 1
  }

  return {
    ...toRefs(state),
    connectWebSocket,
    decrease,
    increase,
    websocketClose,
    queryNotices,
    changeReadState,
    clearReadState
  }
})
