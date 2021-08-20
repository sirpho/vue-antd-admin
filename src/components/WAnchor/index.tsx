import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue'
import styles from './style.module.less'

export default defineComponent({
  props: {
    root: {
      type: String,
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

    const root = computed(() => {
      return props.root
    })

    const dataSource = computed(() => {
      return props.links || []
    })

    onMounted(() => {
      (document.querySelector(props.root) as HTMLInputElement).addEventListener(
        'scroll',
        handleScroll
      )
    })
    onUnmounted(() => {
      (document.querySelector(props.root) as HTMLInputElement).removeEventListener(
        'scroll',
        handleScroll
      )
    })

    const handleScroll = (e) => {
      if (e.target) {
        dataSource.value.map(item => {
          const anchor = document.querySelector(item.link) || { offsetTop: 0 }
          item.active = e.target.scrollTop >= (anchor?.offsetTop || 0)
          return item
        })
      }
    }

    const goAnchor = (selector) => {
      const anchor = document.querySelector(selector) || { offsetTop: 0 }
      document.querySelector(root.value)
        .scrollTo({ top: anchor.offsetTop + 64, behavior: 'smooth' })
    }

    return () => (
      <div class={styles[prefixCls]}>
        <w-affix>
          <div class={styles[`${prefixCls}-wrapper`]}>
            {
              dataSource.value.map((item, index) => (
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
