import raf from './raf'
import getScroll, { isWindow } from './getScroll'
import { easeInOutCubic } from './easings'

interface ScrollToOptions {
  /** Scroll container, default as window */
  getContainer?: () => HTMLElement | Window | Document;
  /** Scroll end callback */
  callback?: () => any;
  /** Animation duration, default as 450 */
  duration?: number;
}

export function scrollTo(y: number, options: ScrollToOptions = {}) {
  const { getContainer = () => window, callback, duration = 450 } = options
  const container = getContainer()
  const scrollTop = getScroll(container, true)
  const startTime = Date.now()

  const frameFunc = () => {
    const timestamp = Date.now()
    const time = timestamp - startTime
    const nextScrollTop = easeInOutCubic(time > duration ? duration : time, scrollTop, y, duration)
    if (isWindow(container)) {
      (container as Window).scrollTo(window.pageXOffset, nextScrollTop)
    } else if (container instanceof HTMLDocument || container.constructor.name === 'HTMLDocument') {
      (container as HTMLDocument).documentElement.scrollTop = nextScrollTop
    } else {
      (container as HTMLElement).scrollTop = nextScrollTop
    }
    if (time < duration) {
      raf(frameFunc)
    } else if (typeof callback === 'function') {
      callback()
    }
  }
  raf(frameFunc)
}


export function handleOffsetTop(targetNode: HTMLInputElement) {
  let totalLeft = 0
  let totalTop = 0
  if (!targetNode) return { left: totalLeft, top: totalTop }
  let parentNode = <HTMLElement>targetNode.offsetParent
  //首先把自己本身的相加
  totalLeft += targetNode.offsetLeft
  totalTop += targetNode.offsetTop
  //现在开始一级一级往上查找，只要没有遇到body，我们就把父级参照物的边框和偏移相加
  while (parentNode) {
    if (navigator.userAgent.indexOf('MSIE 8.0') === -1) {
      //不是IE8我们才进行累加父级参照物的边框
      totalTop += parentNode.clientTop
      totalLeft += parentNode.clientLeft
    }
    //把父级参照物的偏移相加
    totalTop += parentNode.offsetTop
    totalLeft += parentNode.offsetLeft
    parentNode = <HTMLElement>parentNode.offsetParent
  }
  return { left: totalLeft, top: totalTop }
}
