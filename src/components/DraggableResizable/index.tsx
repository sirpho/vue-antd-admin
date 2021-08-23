import { defineComponent, reactive, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import {
  eventsTypes,
  userSelectTypes,
  mouseOrTouchTypes,
  stateTypes,
  boundsTypes,
  positionTypes
} from './types'
import {
  matchesSelectorToParentElements,
  getComputedSize,
  addEvent,
  removeEvent
} from './utils/dom'
import { computeWidth, computeHeight, restrictToBounds, snapToGrid } from './utils/fns'

const events: eventsTypes = {
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup'
  },
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend'
  }
}

const userSelectNone: userSelectTypes = {
  userSelect: 'none',
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
  MsUserSelect: 'none'
}

const userSelectAuto: userSelectTypes = {
  userSelect: 'auto',
  MozUserSelect: 'auto',
  WebkitUserSelect: 'auto',
  MsUserSelect: 'auto'
}

let eventsFor: mouseOrTouchTypes = events.mouse

export default defineComponent({
  replace: true,
  props: {
    className: {
      type: String,
      default: 'vdr'
    },
    classNameDraggable: {
      type: String,
      default: 'draggable'
    },
    classNameResizable: {
      type: String,
      default: 'resizable'
    },
    classNameDragging: {
      type: String,
      default: 'dragging'
    },
    classNameResizing: {
      type: String,
      default: 'resizing'
    },
    classNameActive: {
      type: String,
      default: 'active'
    },
    classNameHandle: {
      type: String,
      default: 'handle'
    },
    disableUserSelect: {
      type: Boolean,
      default: true
    },
    enableNativeDrag: {
      type: Boolean,
      default: false
    },
    preventDeactivation: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: true
    },
    resizable: {
      type: Boolean,
      default: true
    },
    lockAspectRatio: {
      type: Boolean,
      default: false
    },
    w: {
      type: [ Number, String ],
      default: 200,
      validator: (val) => {
        if (typeof val === 'number') {
          return val > 0
        }
        return val === 'auto'
      }
    },
    h: {
      type: [ Number, String ],
      default: 200,
      validator: (val) => {
        if (typeof val === 'number') {
          return val > 0
        }
        return val === 'auto'
      }
    },
    minWidth: {
      type: Number,
      default: 0,
      validator: (val: number) => val >= 0
    },
    minHeight: {
      type: Number,
      default: 0,
      validator: (val: number) => val >= 0
    },
    maxWidth: {
      type: Number,
      default: null,
      validator: (val: number) => val >= 0
    },
    maxHeight: {
      type: Number,
      default: null,
      validator: (val: number) => val >= 0
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    z: {
      type: [ String, Number ],
      default: 'auto',
      validator: (val: any) => (typeof val === 'string' ? val === 'auto' : val >= 0)
    },
    handles: {
      type: Array,
      default: () => [ 'tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml' ],
      validator: (val: string[]) => {
        const s = new Set([ 'tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml' ])
        return new Set(val.filter(h => s.has(h))).size === val.length
      }
    },
    dragHandle: {
      type: String,
      default: null
    },
    dragCancel: {
      type: String,
      default: null
    },
    axis: {
      type: String,
      default: 'both',
      validator: (val: string) => [ 'x', 'y', 'both' ].includes(val)
    },
    grid: {
      type: Array,
      default: () => [ 1, 1 ]
    },
    parent: {
      type: Boolean,
      default: false
    },
    scale: {
      type: Number,
      default: 1,
      validator: (val: number) => val > 0
    },
    onDragStart: {
      type: Function,
      default: () => true
    },
    onDrag: {
      type: Function,
      default: () => true
    },
    onResizeStart: {
      type: Function,
      default: () => true
    },
    onResize: {
      type: Function,
      default: () => true
    }
  },
  setup(props: any, { emit }) {
    const state: stateTypes = reactive({
      root: null,
      left: props.x,
      top: props.y,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      widthTouched: false,
      heightTouched: false,
      aspectFactor: 0,
      parentWidth: 0,
      parentHeight: 0,
      minW: props.minWidth,
      minH: props.minHeight,
      maxW: props.maxWidth,
      maxH: props.maxHeight,
      handle: '',
      enabled: props.active,
      resizing: false,
      dragging: false,
      zIndex: props.z,
      bounds: {
        minLeft: null,
        maxLeft: null,
        minRight: null,
        maxRight: null,
        minTop: null,
        maxTop: null,
        minBottom: null,
        maxBottom: null
      },
      mouseClickPosition: {
        mouseX: 0,
        mouseY: 0,
        x: 0,
        y: 0,
        w: 0,
        h: 0
      }
    })

    onMounted(() => {
      if (props.maxWidth && props.minWidth > props.maxWidth) console.warn(
        '[Vdr warn]: Invalid prop: minWidth cannot be greater than maxWidth')
      if (props.maxWidth && props.minHeight > props.maxHeight) console.warn(
        '[Vdr warn]: Invalid prop: minHeight cannot be greater than maxHeight')
      resetBoundsAndMouseState()
      if (!props.enableNativeDrag) {
        state.root.ondragstart = () => false
      }
      const [ parentWidth, parentHeight ] = getParentSize()
      state.parentWidth = parentWidth
      state.parentHeight = parentHeight
      if (state.root) {
        const [ width, height ] = getComputedSize(state.root)
        state.aspectFactor = (props.w !== 'auto' ? props.w : width) / (props.h !== 'auto' ? props.h : height)
        state.width = props.w !== 'auto' ? props.w : width
        state.height = props.h !== 'auto' ? props.h : height
        state.right = (state.parentWidth || 0) - (state.width || 0) - state.left
        state.bottom = (state.parentHeight || 0) - (state.height || 0) - state.top
        addEvent(document.documentElement, 'mousedown', deselect)
        addEvent(document.documentElement, 'touchend touchcancel', deselect)
        addEvent(window, 'resize', checkParentSize)
      }
    })

    onBeforeUnmount(() => {
      removeEvent(document.documentElement, 'mousedown', deselect)
      removeEvent(document.documentElement, 'touchstart', handleUp)
      removeEvent(document.documentElement, 'mousemove', move)
      removeEvent(document.documentElement, 'touchmove', move)
      removeEvent(document.documentElement, 'mouseup', handleUp)
      removeEvent(document.documentElement, 'touchend touchcancel', deselect)
      removeEvent(window, 'resize', checkParentSize)
    })

    const style = computed(() => {
      return {
        position: 'absolute',
        width: computedWidth.value,
        height: computedHeight.value,
        zIndex: state.zIndex,
        ...(state.dragging && props.disableUserSelect ? userSelectNone : userSelectAuto)
      }
    })

    const actualHandles = computed(() => {
      if (!props.resizable) return []
      return props.handles
    })

    const computedWidth = computed(() => {
      if (props.w === 'auto') {
        if (!state.widthTouched) {
          return 'auto'
        }
      }
      return state.width + 'px'
    })

    const computedHeight = computed(() => {
      if (props.h === 'auto') {
        if (!state.heightTouched) {
          return 'auto'
        }
      }
      return state.height + 'px'
    })

    const calcDragLimits = () => {
      return {
        minLeft: state.left % props.grid[0],
        maxLeft: Math.floor((state.parentWidth - state.width - state.left) / props.grid[0]) * props.grid[0] + state.left,
        minRight: state.right % props.grid[0],
        maxRight: Math.floor((state.parentWidth - state.width - state.right) / props.grid[0]) * props.grid[0] + state.right,
        minTop: state.top % props.grid[1],
        maxTop: Math.floor((state.parentHeight - state.height - state.top) / props.grid[1]) * props.grid[1] + state.top,
        minBottom: state.bottom % props.grid[1],
        maxBottom: Math.floor((state.parentHeight - state.height - state.bottom) / props.grid[1]) * props.grid[1] + state.bottom
      } as boundsTypes
    }

    const calcResizeLimits = () => {
      let minW: number = state.minW
      let minH: number = state.minH
      let maxW: number = state.maxW
      let maxH: number = state.maxH
      const aspectFactor: number | null = state.aspectFactor || 0
      const [ gridX, gridY ]: number[] = props.grid
      const width: number | null = state.width || 0
      const height: number | null = state.height || 0
      const left: number = state.left
      const top: number = state.top
      const right: number | null = state.right || 0
      const bottom: number | null = state.bottom || 0
      if (props.lockAspectRatio) {
        if (minW / minH > aspectFactor) {
          minH = minW / aspectFactor
        } else {
          minW = aspectFactor * minH
        }
        if (maxW && maxH) {
          maxW = Math.min(maxW, aspectFactor * maxH)
          maxH = Math.min(maxH, maxW / aspectFactor)
        } else if (maxW) {
          maxH = maxW / aspectFactor
        } else if (maxH) {
          maxW = aspectFactor * maxH
        }
      }
      maxW = maxW - (maxW % gridX)
      maxH = maxH - (maxH % gridY)
      const limits: boundsTypes = {
        minLeft: null,
        maxLeft: null,
        minTop: null,
        maxTop: null,
        minRight: null,
        maxRight: null,
        minBottom: null,
        maxBottom: null
      }
      if (props.parent) {
        limits.minLeft = left % gridX
        limits.maxLeft = left + Math.floor((width - minW) / gridX) * gridX
        limits.minTop = top % gridY
        limits.maxTop = top + Math.floor((height - minH) / gridY) * gridY
        limits.minRight = right % gridX
        limits.maxRight = right + Math.floor((width - minW) / gridX) * gridX
        limits.minBottom = bottom % gridY
        limits.maxBottom = bottom + Math.floor((height - minH) / gridY) * gridY
        if (maxW) {
          limits.minLeft = Math.max(limits.minLeft, (state.parentWidth || 0) - right - maxW)
          limits.minRight = Math.max(limits.minRight, (state.parentWidth || 0) - left - maxW)
        }
        if (maxH) {
          limits.minTop = Math.max(limits.minTop, (state.parentHeight || 0) - bottom - maxH)
          limits.minBottom = Math.max(limits.minBottom, (state.parentHeight || 0) - top - maxH)
        }
        if (props.lockAspectRatio) {
          limits.minLeft = Math.max(limits.minLeft, left - top * aspectFactor)
          limits.minTop = Math.max(limits.minTop, top - left / aspectFactor)
          limits.minRight = Math.max(limits.minRight, right - bottom * aspectFactor)
          limits.minBottom = Math.max(limits.minBottom, bottom - right / aspectFactor)
        }
      } else {
        limits.minLeft = null
        limits.maxLeft = left + Math.floor((width - minW) / gridX) * gridX
        limits.minTop = null
        limits.maxTop = top + Math.floor((height - minH) / gridY) * gridY
        limits.minRight = null
        limits.maxRight = right + Math.floor((width - minW) / gridX) * gridX
        limits.minBottom = null
        limits.maxBottom = bottom + Math.floor((height - minH) / gridY) * gridY
        if (maxW) {
          limits.minLeft = -(right + maxW)
          limits.minRight = -(left + maxW)
        }
        if (maxH) {
          limits.minTop = -(bottom + maxH)
          limits.minBottom = -(top + maxH)
        }
        if (props.lockAspectRatio && (maxW && maxH)) {
          limits.minLeft = Math.min((limits.minLeft || 0), -(right + maxW))
          limits.minTop = Math.min((limits.minTop || 0), -(maxH + bottom))
          limits.minRight = Math.min((limits.minRight || 0), -left - maxW)
          limits.minBottom = Math.min((limits.minBottom || 0), -top - maxH)
        }
      }
      return limits as boundsTypes
    }

    const moveHorizontally = (val) => {
      const [ deltaX ]: number[] = snapToGrid(props.grid, val, state.top, props.scale)
      const left: number = restrictToBounds(deltaX, state.bounds.minLeft, state.bounds.maxLeft)
      state.left = left
      state.right = state.parentWidth - state.width - left
    }

    const changeWidth = (val) => {
      const [ newWidth, _ ]: number[] = snapToGrid(props.grid, val, 0, props.scale)
      const right: number | null = restrictToBounds(
        (state.parentWidth - newWidth - state.left),
        state.bounds.minRight,
        state.bounds.maxRight
      )
      let bottom: number | null = state.bottom
      if (props.lockAspectRatio) {
        bottom = state.bottom - (state.right - right) / (state.aspectFactor || 0)
      }
      const width: number = computeWidth(state.parentWidth, state.left, right)
      const height: number = computeHeight(state.parentHeight, state.top, bottom)
      state.right = right
      state.bottom = bottom
      state.width = width
      state.height = height
    }

    const changeHeight = (val) => {
      const [ _, newHeight ]: number[] = snapToGrid(props.grid, 0, val, props.scale)
      const bottom: number | null = restrictToBounds(
        (state.parentHeight - newHeight - state.top),
        state.bounds.minBottom,
        state.bounds.maxBottom
      )
      let right: number | null = state.right
      if (props.lockAspectRatio) {
        right = state.right - (state.bottom - bottom) * (state.aspectFactor || 0)
      }
      const width: number = computeWidth(state.parentWidth, state.left, right)
      const height: number = computeHeight(state.parentHeight, state.top, bottom)
      state.right = right
      state.bottom = bottom
      state.width = width
      state.height = height
    }

    const moveVertically = (val) => {
      const [ _, deltaY ]: number[] = snapToGrid(props.grid, state.left, val, props.scale)
      const top: number | null = restrictToBounds(deltaY, state.bounds.minTop, state.bounds.maxTop)
      state.top = top
      state.bottom = state.parentHeight - state.height - top
    }

    watch(() => props.active, (val) => {
      state.enabled = val
      if (val) {
        emit('activated')
      } else {
        emit('deactivated')
      }
    }, {
      deep: true,
      immediate: true
    })

    watch(() => props.z, (val) => {
      if (val >= 0 || val === 'auto') {
        state.zIndex = val
      }
    }, {
      deep: true,
      immediate: true
    })

    watch(() => props.x, (val) => {
      if (state.resizing || state.dragging) {
        return
      }
      if (props.parent) {
        state.bounds = calcDragLimits()
      }
      moveHorizontally(val)
    }, {
      deep: true,
      immediate: true
    })

    watch(() => props.y, (val) => {
      if (state.resizing || state.dragging) {
        return
      }
      if (props.parent) {
        state.bounds = calcDragLimits()
      }
      moveVertically(val)
    }, {
      deep: true,
      immediate: true
    })

    watch(() => props.lockAspectRatio, (val) => {
      if (val) {
        state.aspectFactor = state.width / state.height
      } else {
        state.aspectFactor = undefined
      }
    }, {
      deep: true,
      immediate: true
    })

    watch(() => props.minWidth, (val) => {
      if (val > 0 && val <= state.width) {
        state.minW = val
      }
    }, {
      deep: true,
      immediate: true
    })

    watch(() => props.minHeight, (val) => {
      if (val > 0 && val <= state.height) {
        state.minH = val
      }
    }, {
      deep: true,
      immediate: true
    })

    watch(() => props.maxWidth, (val) => {
      state.maxW = val
    }, {
      deep: true,
      immediate: true
    })

    watch(() => props.maxHeight, (val) => {
      state.maxH = val
    }, {
      deep: true,
      immediate: true
    })

    watch(() => props.w, (val) => {
      if (state.resizing || state.dragging) {
        return
      }
      if (props.parent) {
        state.bounds = calcResizeLimits()
      }
      changeWidth(val)
    }, {
      deep: true,
      immediate: true
    })

    watch(() => props.h, (val) => {
      if (state.resizing || state.dragging) {
        return
      }
      if (props.parent) {
        state.bounds = calcResizeLimits()
      }
      changeHeight(val)
    }, {
      deep: true,
      immediate: true
    })

    const resetBoundsAndMouseState = () => {
      state.mouseClickPosition = { mouseX: 0, mouseY: 0, x: 0, y: 0, w: 0, h: 0 }
      state.bounds = {
        minLeft: null,
        maxLeft: null,
        minRight: null,
        maxRight: null,
        minTop: null,
        maxTop: null,
        minBottom: null,
        maxBottom: null
      }
    }

    const checkParentSize = () => {
      if (props.parent) {
        const [ newParentWidth, newParentHeight ]: any[] = getParentSize()
        state.parentWidth = newParentWidth
        state.parentHeight = newParentHeight
      }
    }

    const getParentSize = () => {
      if (props.parent) {
        const style = window.getComputedStyle(state.root.parentNode, null)
        return [
          parseInt(style.getPropertyValue('width'), 10),
          parseInt(style.getPropertyValue('height'), 10)
        ] as number[]
      }
      return [ null, null ] as any[]
    }

    const elementTouchDown = (e) => {
      eventsFor = events.touch
      elementDown(e)
    }

    const elementMouseDown = (e) => {
      eventsFor = events.mouse
      elementDown(e)
    }

    const elementDown = (e) => {
      if (e instanceof MouseEvent && e.which !== 1) {
        return
      }
      const target: Element = e.target || e.srcElement
      if (state.root.contains(target)) {
        if (props.onDragStart(e) === false) {
          return
        }
        if (
          (props.dragHandle && !matchesSelectorToParentElements(
            target,
            props.dragHandle,
            state.root
          )) ||
          (props.dragCancel && matchesSelectorToParentElements(
            target,
            props.dragCancel,
            state.root
          ))
        ) {
          state.dragging = false
          return
        }
        if (!state.enabled) {
          state.enabled = true
          emit('activated')
          emit('update:active', true)
        }
        if (props.draggable) {
          state.dragging = true
        }
        state.mouseClickPosition.mouseX = e.touches ? e.touches[0].pageX : e.pageX
        state.mouseClickPosition.mouseY = e.touches ? e.touches[0].pageY : e.pageY
        state.mouseClickPosition.left = state.left
        state.mouseClickPosition.right = state.right
        state.mouseClickPosition.top = state.top
        state.mouseClickPosition.bottom = state.bottom
        if (props.parent) {
          state.bounds = calcDragLimits()
        }
        addEvent(document.documentElement, eventsFor.move, move)
        addEvent(document.documentElement, eventsFor.stop, handleUp)
      }
    }

    const deselect = (e?) => {
      const target: Element = e.target || e.srcElement
      const regex = new RegExp(props.className + '-([trmbl]{2})', '')
      if (!state.root.contains(target) && !regex.test(target.className)) {
        if (state.enabled && !props.preventDeactivation) {
          state.enabled = false
          emit('deactivated')
          emit('update:active', false)
        }
        removeEvent(document.documentElement, eventsFor.move, handleResize)
      }
      resetBoundsAndMouseState()
    }

    const handleTouchDown = (handle, e) => {
      eventsFor = events.touch
      handleDown(handle, e)
    }

    const handleDown = (handle, e) => {
      if (e instanceof MouseEvent && e.which !== 1) {
        return
      }
      if (props.onResizeStart(handle, e) === false) {
        return
      }
      if (e.stopPropagation) e.stopPropagation()
      // Here we avoid a dangerous recursion by faking
      // corner handles as middle handles
      if (props.lockAspectRatio && !handle.includes('m')) {
        state.handle = 'm' + handle.substring(1)
      } else {
        state.handle = handle
      }
      state.resizing = true
      state.mouseClickPosition.mouseX = e.touches ? e.touches[0].pageX : e.pageX
      state.mouseClickPosition.mouseY = e.touches ? e.touches[0].pageY : e.pageY
      state.mouseClickPosition.left = state.left
      state.mouseClickPosition.right = state.right
      state.mouseClickPosition.top = state.top
      state.mouseClickPosition.bottom = state.bottom
      state.bounds = calcResizeLimits()
      addEvent(document.documentElement, eventsFor.move, handleResize)
      addEvent(document.documentElement, eventsFor.stop, handleUp)
    }

    const move = (e?) => {
      if (state.resizing) {
        handleResize(e)
      } else if (state.dragging) {
        handleDrag(e)
      }
    }

    const handleDrag = (e) => {
      const axis: string = props.axis
      const grid: number[] = props.grid
      const bounds: boundsTypes = state.bounds
      const mouseClickPosition: positionTypes = state.mouseClickPosition
      const tmpDeltaX: number = axis && axis !== 'y' ? mouseClickPosition.mouseX - (e.touches ? e.touches[0].pageX : e.pageX) : 0
      const tmpDeltaY: number = axis && axis !== 'x' ? mouseClickPosition.mouseY - (e.touches ? e.touches[0].pageY : e.pageY) : 0
      const [ deltaX, deltaY ]: number[] = snapToGrid(grid, tmpDeltaX, tmpDeltaY, props.scale)
      const left: number | null = restrictToBounds(
        (mouseClickPosition.left || 0) - deltaX,
        bounds.minLeft,
        bounds.maxLeft
      )
      const top: number | null = restrictToBounds(
        (mouseClickPosition.top || 0) - deltaY,
        bounds.minTop,
        bounds.maxTop
      )
      if (props.onDrag(left, top) === false) {
        return
      }
      const right: number | null = restrictToBounds(
        (mouseClickPosition.right || 0) + deltaX,
        bounds.minRight,
        bounds.maxRight
      )
      const bottom: number | null = restrictToBounds(
        (mouseClickPosition.bottom || 0) + deltaY,
        bounds.minBottom,
        bounds.maxBottom
      )
      state.left = left
      state.top = top
      state.right = right
      state.bottom = bottom
      emit('dragging', state.left, state.top)
    }

    const handleResize = (e?) => {
      let left: number = state.left
      let top: number = state.top
      let right: number | null = state.right
      let bottom: number | null = state.bottom
      const mouseClickPosition: positionTypes = state.mouseClickPosition
      const aspectFactor: number | undefined = state.aspectFactor
      const tmpDeltaX: number = mouseClickPosition.mouseX - (e.touches ? e.touches[0].pageX : e.pageX)
      const tmpDeltaY: number = mouseClickPosition.mouseY - (e.touches ? e.touches[0].pageY : e.pageY)
      if (!state.widthTouched && tmpDeltaX) {
        state.widthTouched = true
      }
      if (!state.heightTouched && tmpDeltaY) {
        state.heightTouched = true
      }
      const [ deltaX, deltaY ]: number[] = snapToGrid(props.grid, tmpDeltaX, tmpDeltaY, props.scale)
      if ((state.handle || '').includes('b')) {
        bottom = restrictToBounds(
          (mouseClickPosition.bottom || 0) + deltaY,
          state.bounds.minBottom,
          state.bounds.maxBottom
        )
        if (props.lockAspectRatio && props.resizingOnY) {
          right = state.right - (state.bottom - bottom) * (aspectFactor || 0)
        }
      } else if ((state.handle || '').includes('t')) {
        top = restrictToBounds(
          (mouseClickPosition.top || 0) - deltaY,
          state.bounds.minTop,
          state.bounds.maxTop
        )
        if (props.lockAspectRatio && props.resizingOnY) {
          left = state.left - (state.top - top) * (aspectFactor || 0)
        }
      }
      if ((state.handle || '').includes('r')) {
        right = restrictToBounds(
          (mouseClickPosition.right || 0) + deltaX,
          state.bounds.minRight,
          state.bounds.maxRight
        )
        if (props.lockAspectRatio && props.resizingOnX) {
          bottom = state.bottom - (state.right - right) / (aspectFactor || 0)
        }
      } else if ((state.handle || '').includes('l')) {
        left = restrictToBounds(
          (mouseClickPosition.left || 0) - deltaX,
          state.bounds.minLeft,
          state.bounds.maxLeft
        )
        if (props.lockAspectRatio && props.resizingOnX) {
          top = state.top - (state.left - left) / (aspectFactor || 0)
        }
      }
      const width: number = computeWidth(state.parentWidth, left, right)
      const height: number = computeHeight(state.parentHeight, top, bottom)
      if (props.onResize(state.handle, left, top, width, height) === false) {
        return
      }
      state.left = left
      state.top = top
      state.right = right
      state.bottom = bottom
      state.width = width
      state.height = height
      emit('resizing', state.left, state.top, state.width, state.height)
    }

    const handleUp = () => {
      state.handle = null
      resetBoundsAndMouseState()
      if (state.resizing) {
        state.resizing = false
        emit('resizestop', state.left, state.top, state.width, state.height)
      }
      if (state.dragging) {
        state.dragging = false
        emit('dragstop', state.left, state.top)
      }
      removeEvent(document.documentElement, eventsFor.move, handleResize)
    }

    return () => (
      <div
        ref={e => state.root = e}
        style={style.value}
        class={
          [
            {
              [props.classNameActive]: state.enabled,
              [props.classNameDragging]: state.dragging,
              [props.classNameResizing]: state.resizing,
              [props.classNameDraggable]: props.draggable,
              [props.classNameResizable]: props.resizable
            },
            props.className
          ]
        }
        onMousedown={elementMouseDown}
        onTouchstart={elementTouchDown}
      >
        {
          actualHandles.value.map(item => (
            <div
              key={item}
              class={[ props.classNameHandle, props.classNameHandle + '-' + state.handle ]}
              style={{ display: state.enabled ? 'block' : 'none' }}
              onMousedown={e => handleDown(state.handle, e)}
              onTouchstart={e => handleTouchDown(state.handle, e)}
            >
              {
                item()
              }
            </div>
          ))
        }
      </div>

    )
  }
})
