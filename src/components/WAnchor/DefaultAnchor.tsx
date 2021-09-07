import { computed, ExtractPropTypes, FunctionalComponent } from 'vue'
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { handelInkStyle } from './index'
import styles from './style.module.less'

const defaultAnchorProps = {
  isMobile: PropTypes.bool,
  isfixedMultiTab: PropTypes.bool,
  dataSource: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  prefixCls: PropTypes.string,
  onGoAnchor: {
    type: Function as PropType<(path: string) => void>
  }
}

export type DefaultAnchorProps = Partial<ExtractPropTypes<typeof defaultAnchorProps>>

export const DefaultAnchor: FunctionalComponent<DefaultAnchorProps> = (props) => {
  const {
    dataSource = [],
    prefixCls = '',
    onGoAnchor,
    isMobile,
    isfixedMultiTab
  } = props

  const baseClassName = computed(() => {
    return {
      [styles[prefixCls]]: true,
      [styles[`${prefixCls}-mobile`]]: isMobile
    }
  })

  const linksRender = () => (
    <div class={styles[`${prefixCls}-wrapper`]}>
      {
        dataSource.map((item: any, index) => (
          <div
            key={index}
            style={handelInkStyle(item.level, isMobile)}
            class={
              item.active ?
                [ styles[`${prefixCls}-ink`], styles.active ]
                :
                styles[`${prefixCls}-ink`]
            }
            onClick={() => onGoAnchor && onGoAnchor(item.link)}
          >
            {item.name}
          </div>
        ))
      }
    </div>
  )

  return (
    <div class={baseClassName.value}>
      {
        isMobile
          ? linksRender()
          : <w-affix offsetTop={isfixedMultiTab ? 68 + 42 : 68}>{linksRender()}</w-affix>
      }
    </div>
  )
}
DefaultAnchor.inheritAttrs = false
