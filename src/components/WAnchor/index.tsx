import {
  defineComponent,
  nextTick,
  onActivated,
  onMounted,
  onUnmounted,
  reactive,
  watch
} from 'vue'
import { cloneDeep } from 'lodash-es'
import getScroll from '../_util/getScroll'
import scrollTo from '../_util/scrollTo'
import addEventListener from '../_util/Dom/addEventListener'
import throttleByAnimationFrame from '../_util/throttleByAnimationFrame'
import styles from './style.module.less'

export interface anchorState {
  dataSource: any[];
  scrollEvent: { remove: () => void } | null;
}

const anchorProps = {
  links: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  root: {
    type: String as PropType<string>,
    default: '#wd-pro-admin>.wd-pro-scrollbar>.wd-pro-scrollbar-wrap'
  }
}

const WAnchor = defineComponent({
  props: anchorProps,
  setup(props) {
    const prefixCls = 'wd-anchor'

    const state: anchorState = reactive({
      dataSource: [],
      scrollEvent: null
    })

    const bindScrollEvent = () => {
      const { root } = props
      const container = (document.querySelector(root) as HTMLInputElement)
      state.scrollEvent = addEventListener(container, 'scroll', (e: Event) => {
        handleScroll(e)
      })
      handleScroll({
        target: container
      })
    }

    const scrollRemove = () => {
      if (state.scrollEvent) {
        state.scrollEvent.remove()
      }
      (handleScroll as any).cancel()
    }

    watch(() => props.links, (data) => {
      state.dataSource = cloneDeep(data)
    }, {
      deep: true,
      immediate: true
    })

    watch(
      () => props.root,
      () => {
        scrollRemove()
        nextTick(() => {
          bindScrollEvent()
        })
      }
    )

    onMounted(() => {
      nextTick(() => {
        bindScrollEvent()
      })
    })
    onActivated(() => {
      nextTick(() => {
        bindScrollEvent()
      })
    })
    onUnmounted(() => {
      scrollRemove()
    })

    const handleScroll = throttleByAnimationFrame((e: Event | { target: any }) => {
      const scrollTop = getScroll(e.target, true)
      state.dataSource.map((item: any, index) => {
        const anchor = document.querySelector(item.link) || { offsetTop: 0 }
        const afterAnchor = index + 1 === state.dataSource.length ?
          { offsetTop: 100000 }
          :
          document.querySelector(state.dataSource[index + 1]['link']) || { offsetTop: 0 }
        item.active = scrollTop >= anchor.offsetTop &&
          scrollTop < afterAnchor.offsetTop
        return item
      })
    })

    const handelInkStyle = (level = 1) => {
      return {
        paddingLeft: `${level * 6}px`
      }
    }

    const goAnchor = (selector) => {
      const targetNode = document.querySelector(selector) || { offsetTop: 0 }
      const { root } = props
      scrollTo(targetNode.offsetTop + 64, {
        getContainer: () => (document.querySelector(root) as HTMLInputElement),
        duration: 450
      })
    }

    return () => (
      <div class={styles[prefixCls]}>
        <w-affix offsetTop={68}>
          <div class={styles[`${prefixCls}-wrapper`]}>
            {
              state.dataSource.map((item: any, index) => (
                <div
                  key={index}
                  style={handelInkStyle(item.level)}
                  class={
                    item.active ?
                      [ styles[`${prefixCls}-ink`], styles.active ]
                      :
                      styles[`${prefixCls}-ink`]
                  }
                  onClick={() => goAnchor(item.link)}
                >
                  {item.name}
                </div>
              ))
            }
          </div>
        </w-affix>
      </div>
    )
  }
})

export default WAnchor
