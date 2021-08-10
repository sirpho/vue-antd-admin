import { defineComponent, onMounted, reactive, watch, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Result403 from '/@/assets/error_images/403.png'
import Result404 from '/@/assets/error_images/404.png'
import ResultCloud from '/@/assets/error_images/cloud.png'
import styles from './style.module.less'

export interface subInfo {
  headline: string;
  info: string;
  exceptionImage: string;
}

interface resultSubInfo {
  404: subInfo;
  403: subInfo;
}

interface resultState {
  jumpTime: number;
  oops: string;
  headline: string;
  info: string;
  btn: string;
  timer: number | any;
  exceptionImage: any;
}

const resultSubInfo: resultSubInfo = {
  '404': {
    headline: '当前页面不存在...',
    info: '请检查您输入的网址是否正确，或点击下面的按钮返回首页。',
    exceptionImage: Result404
  },
  '403': {
    headline: '您没有操作角色...',
    info: '当前帐号没有操作角色,请联系管理员。',
    exceptionImage: Result403
  }
}

export default defineComponent({
  props: {
    status: {
      type: String,
      required: true,
      default: '404'
    }
  },
  setup(props) {
    const store = useStore()
    const router = useRouter()
    const state = reactive<resultState>({
      jumpTime: 5,
      oops: '抱歉!',
      headline: '您没有操作角色...',
      info: '当前帐号没有操作角色,请联系管理员。',
      btn: '返回首页',
      timer: 0,
      exceptionImage: Result404
    })
    onMounted(() => {
      timeChange()
    })
    onBeforeUnmount(() => {
      clearInterval(state.timer)
    })
    watch(() => props.status, (val: string) => {
      Object.keys(resultSubInfo).map((item: string) => {
        if (item === val) {
          Object.keys(resultSubInfo[item]).map((el: any) => {
            state[el] = resultSubInfo[item][el]
            return el
          })
        }
        return item
      })
    }, {
      deep: true,
      immediate: true
    })
    const timeChange = () => {
      state.timer = setInterval(() => {
        if (state.jumpTime) {
          state.jumpTime--
        } else {
          router.push({ path: '/' })
          store.dispatch('tagsBar/delOthersVisitedRoutes', { path: '/' })
          clearInterval(state.timer)
        }
      }, 1000)
    }
    return () => (
      <div class={styles['error-container']}>
        <div class={styles['error-content']}>
          <a-row gutter={20}>
            <a-col lg={12} md={12} sm={24} xl={12} xs={24}>
              <div class={styles['pic-error']}>
                <img class={styles['pic-error-parent']} src={state.exceptionImage} />
                <img
                  class={[ styles['pic-error-child'], styles['left'] ]}
                  src={ResultCloud}
                />
              </div>
            </a-col>
            <a-col lg={12} md={12} sm={24} xl={12} xs={24}>
              <div class={styles['bullshit']}>
                <div class={styles['bullshit-oops']}>{state.oops}</div>
                <div class={styles['bullshit-headline']}>{state.headline}</div>
                <div class={styles['bullshit-info']}>{state.info}</div>
                <a class={styles['bullshit-return-home']} href="#/">
                  {state.jumpTime}s&nbsp;{state.btn}
                </a>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    )
  }
})
