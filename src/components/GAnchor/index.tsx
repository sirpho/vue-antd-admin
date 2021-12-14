import {
  computed,
  defineComponent,
  nextTick,
  onActivated,
  onMounted,
  onUnmounted,
  reactive,
  watch
} from 'vue'
import { useStore } from 'vuex'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { cloneDeep } from 'lodash-es'
import config from '/config/config'
import { useMediaQuery } from '@gx-design/pro-hooks/event'
import {
  addEventListener,
  getPrefixCls,
  getScroll,
  scrollTo,
  throttleByAnimationFrame
} from '@gx-design/pro-utils'
import { handleOffsetTop } from '/@/utils/util'
import { DefaultAnchor } from './DefaultAnchor'

import './style.less'

const { viewScrollRoot } = config.defaultSettings

export const handelInkStyle = (level = 1, isMobile?) => {
  return {
    paddingLeft: `${level * (isMobile ? 24 : 12)}px`
  }
}

export interface anchorState {
  visible: boolean;
  dataSource: any[];
  scrollEvent: { remove: () => void } | null;
}

export const anchorProps = {
  links: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  root: {
    type: String as PropType<string>,
    default: viewScrollRoot || '#gx-pro-admin>.gx-scrollbar>.gx-scrollbar-wrap'
  }
}

const GAnchor = defineComponent({
  props: anchorProps,
  setup(props) {
    const store = useStore()

    const prefixCls = getPrefixCls({
      suffixCls: 'anchor'
    })

    const colSize = useMediaQuery()

    const fixedMultiTab = computed(() => store.getters['settings/fixedMultiTab'])

    const defaultOffsetTop = computed(() => fixedMultiTab.value ? 48 + 62 : 48)

    const isMobile = computed(
      () => (colSize.value === 'sm' || colSize.value === 'xs')
    )

    const state: anchorState = reactive({
      visible: false,
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
      setTimeout(() => {
        state.dataSource.map((item: any, index) => {
          const anchor = document.querySelector(item.link)
          const afterAnchor = index + 1 === state.dataSource.length ?
            null : document.querySelector(state.dataSource[index + 1]['link'])
          item.active = scrollTop >= handleOffsetTop(anchor).top - defaultOffsetTop.value &&
            scrollTop < (afterAnchor ? handleOffsetTop(afterAnchor).top - defaultOffsetTop.value : 10000)
          return item
        })
      }, 50)
    })

    const goAnchor = (selector) => {
      const targetNode = document.querySelector(selector) || { offsetTop: 0 }
      const { root } = props
      scrollTo(handleOffsetTop(targetNode).top - defaultOffsetTop.value, {
        getContainer: () => (document.querySelector(root) as HTMLInputElement),
        duration: 450
      })
    }

    return () => (
      <>
        {
          isMobile.value ?
            <a-drawer
              width={300}
              visible={state.visible}
              closable={false}
              placement={'right'}
              bodyStyle={{ padding: 0 }}
              onClose={() => state.visible = false}
              handle={
                <div
                  onClick={() => state.visible = !state.visible}
                  class={`${prefixCls}-drawer-handle`}
                >
                  {
                    state.visible
                      ? <CloseOutlined style={{ fontSize: '20px' }} />
                      : <MenuOutlined style={{ fontSize: '20px' }} />
                  }
                </div>
              }
            >
              <DefaultAnchor
                prefixCls={prefixCls}
                isfixedMultiTab={fixedMultiTab.value}
                isMobile={isMobile.value}
                dataSource={state.dataSource}
                onGoAnchor={(path) => goAnchor(path)}
              />
            </a-drawer>
            :
            <DefaultAnchor
              prefixCls={prefixCls}
              isfixedMultiTab={fixedMultiTab.value}
              dataSource={state.dataSource}
              onGoAnchor={(path) => goAnchor(path)}
            />
        }
      </>
    )
  }
})

export default GAnchor