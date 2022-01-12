<template>
  <div ref="scrollbar" :class="`${baseClassName}`">
    <div
      ref="wrap"
      :class="[
        wrapClass,
        `${baseClassName}-wrap`,
        native ? '' : `${baseClassName}-wrap-hidden-default`,
      ]"
      :style="style"
      @scroll="handleScroll"
    >
      <component
        :is="tag"
        ref="resize"
        :class="[`${baseClassName}-view`, viewClass]"
        :style="viewStyle"
      >
        <slot></slot>
      </component>
    </div>
    <template v-if="!native">
      <bar :className="baseClassName" :move="moveX" :size="sizeWidth" :always="always" />
      <bar
        :className="baseClassName"
        :move="moveY"
        :size="sizeHeight"
        vertical
        :always="always"
      />
    </template>
  </div>
</template>
<script lang="ts">
import type { CSSProperties, PropType } from 'vue'
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  Ref,
  ref
} from 'vue'
import { getPrefixCls } from '@gx-admin/utils'
import { isArray, isString, isNumber } from '/@/utils/validate'
import Bar from './bar.vue'
import { warn } from './utils/error'
import { addResizeListener, removeResizeListener } from './utils/resize-event'
import { addUnit, toObject } from './utils/utils'

export default defineComponent({
  name: 'GScrollbar',
  components: { Bar },
  props: {
    height: {
      type: [ String, Number ],
      default: ''
    },
    maxHeight: {
      type: [ String, Number ],
      default: ''
    },
    native: {
      type: Boolean,
      default: false
    },
    wrapStyle: {
      type: [ String, Array ] as PropType<string | CSSProperties[]>,
      default: ''
    },
    wrapClass: {
      type: [ String, Array ],
      default: ''
    },
    viewClass: {
      type: [ String, Array ],
      default: ''
    },
    viewStyle: {
      type: [ String, Array ],
      default: ''
    },
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: 'div'
    },
    always: {
      type: Boolean,
      default: false
    }
  },
  emits: [ 'scroll' ],
  setup(props, { emit }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'scrollbar'
    })
    
    const sizeWidth = ref('0')
    const sizeHeight = ref('0')
    const moveX = ref(0)
    const moveY = ref(0)
    const scrollbar = ref(null)
    const wrap: Ref<Element | null> = ref(null)
    const resize = ref(null)
    
    const SCOPE = 'ElScrollbar'
    
    provide('scrollbar', scrollbar)
    provide('scrollbar-wrap', wrap)
    
    const handleScroll = () => {
      if (wrap.value) {
        moveY.value = (wrap.value.scrollTop * 100) / wrap.value.clientHeight
        moveX.value = (wrap.value.scrollLeft * 100) / wrap.value.clientWidth
        emit('scroll', {
          scrollLeft: moveX.value,
          scrollTop: moveY.value
        })
      }
    }
    
    const setScrollTop = (value: number) => {
      if (!isNumber(value)) {
        if (process.env.NODE_ENV !== 'production') {
          warn(SCOPE, 'value must be a number')
        }
        return
      }
      if (wrap.value) wrap.value.scrollTop = value
    }
    
    const setScrollLeft = (value: number) => {
      if (!isNumber(value)) {
        if (process.env.NODE_ENV !== 'production') {
          warn(SCOPE, 'value must be a number')
        }
        return
      }
      if (wrap.value) wrap.value.scrollLeft = value
    }
    
    const update = () => {
      if (!wrap.value) return
      
      const heightPercentage = (wrap.value.clientHeight * 100) / wrap.value.scrollHeight
      const widthPercentage = (wrap.value.clientWidth * 100) / wrap.value.scrollWidth
      
      sizeHeight.value = heightPercentage < 100 ? heightPercentage + '%' : ''
      sizeWidth.value = widthPercentage < 100 ? widthPercentage + '%' : ''
    }
    
    const style = computed(() => {
      let style: any = props.wrapStyle
      if (isArray(style)) {
        style = toObject(style)
        style.height = addUnit(props.height)
        style.maxHeight = addUnit(props.maxHeight)
      } else if (isString(style)) {
        style += addUnit(props.height) ? `height: ${addUnit(props.height)};` : ''
        style += addUnit(props.maxHeight) ? `max-height: ${addUnit(props.maxHeight)};` : ''
      }
      return style
    })
    
    onMounted(() => {
      if (!props.native) {
        nextTick(update)
      }
      if (!props.noresize) {
        addResizeListener(resize.value, update)
        addEventListener('resize', update)
      }
    })
    
    onBeforeUnmount(() => {
      if (!props.noresize) {
        removeResizeListener(resize.value, update)
        removeEventListener('resize', update)
      }
    })
    
    return {
      moveX,
      moveY,
      sizeWidth,
      sizeHeight,
      style,
      scrollbar,
      wrap,
      resize,
      update,
      baseClassName,
      handleScroll,
      setScrollTop,
      setScrollLeft
    }
  }
})
</script>

<style lang="less">
@import "./style";
</style>
