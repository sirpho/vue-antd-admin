import { computed, defineComponent, onMounted, onUnmounted, reactive, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import styles from './style.module.less'

export default defineComponent({
  props: {
    root: {
      type: String as PropType<string>,
      required: false,
      default: '#wd-pro-admin>.wd-pro-scrollbar>.wd-pro-scrollbar-wrap'
    },
    links: {
      type: Array as PropType<any[]>,
      required: false,
      default: () => []
    }
  },
  setup(props) {
    const prefixCls = 'wd-anchor'

    const state = reactive({
      dataSource: [],
      offsetTopRange: []
    }) as {
      dataSource: any[];
      offsetTopRange: any[];
    }

    const root = computed(() => {
      return props.root
    })

    watch(() => props.links, (data) => {
      state.dataSource = cloneDeep(data)
    }, {
      deep: true,
      immediate: true
    })

    const handleChangeLinks = (data) => {
      state.offsetTopRange = cloneDeep(data).map((item, index) => {
        const anchor = document.querySelector(item.link) || { offsetTop: 0 }
        const afterAnchor = index + 1 === state.dataSource.length ?
          { offsetTop: 100000 }
          :
          document.querySelector(state.dataSource[index + 1]['link']) || { offsetTop: 0 }
        return {
          valueRange: [ anchor?.offsetTop || 0, afterAnchor?.offsetTop || 0 ]
        }
      })
    }

    onMounted(() => {
      (document.querySelector(props.root) as HTMLInputElement).addEventListener(
        'scroll',
        handleScroll
      )
      handleChangeLinks(state.dataSource)
      handleScroll({
        target: document.querySelector(props.root)
      })
    })

    onUnmounted(() => {
      (document.querySelector(props.root) as HTMLInputElement).removeEventListener(
        'scroll',
        handleScroll
      )
    })

    const handleScroll = (e) => {
      if (e.target) {
        state.dataSource.map((item: any, index) => {
          item.active = e.target.scrollTop >= state.offsetTopRange[index]['valueRange'][0] &&
            e.target.scrollTop < state.offsetTopRange[index]['valueRange'][1]
          return item
        })
      }
    }

    const goAnchor = (selector) => {
      const anchor = document.querySelector(selector) || { offsetTop: 0 }
      const targetNode: any = document.querySelector(root.value)
      targetNode.scrollTo({ top: anchor.offsetTop + 64, behavior: 'smooth' })
    }

    return () => (
      <div class={styles[prefixCls]}>
        <w-affix offsetTop={68}>
          <div class={styles[`${prefixCls}-wrapper`]}>
            {
              state.dataSource.map((item: any, index) => (
                <div
                  key={index}
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
