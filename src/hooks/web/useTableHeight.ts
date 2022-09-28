import { ref, onUnmounted, nextTick } from 'vue'
import { onMountedOrActivated } from '@gx-admin/hooks/core'
import config from '/config/config'

const { viewScrollRoot } = config.defaultSettings

const getStyle = (dom: Element, attr: string) => {
  return getComputedStyle(dom)[attr]
}

export function useTableHeight(gapH = 0) {
  const tableHeight = ref(undefined)

  onMountedOrActivated(() => {
    window.addEventListener('resize', updateTableHeight)
    updateTableHeight()
  })
  onUnmounted(() => {
    window.removeEventListener('resize', updateTableHeight)
  })

  function updateTableHeight() {
    nextTick().then(() => {
      tableHeight.value = calculateHeight()
    })
  }

  function calculateHeight() {
    const viewDom = document.querySelector(viewScrollRoot)
    if (viewDom) {
      const searchDom = viewDom.querySelector('.gx-pro-table-search')
      const toolbarDom = viewDom.querySelector('.gx-pro-table-list-toolbar')
      const tableHeaderDom = viewDom.querySelector('.ant-table-header')
      const paginationDom = viewDom.querySelector('.ant-table-pagination')
      const cardBodyDom = viewDom.querySelector('.ant-card-body')
      const viewDomH = viewDom.getBoundingClientRect().height
      const searchDomH = searchDom?.getBoundingClientRect().height || 0
      const toolbarDomH = toolbarDom?.getBoundingClientRect().height || 0
      const tableHeaderDomH = tableHeaderDom?.getBoundingClientRect().height || 0
      const paginationDomH = paginationDom?.getBoundingClientRect().height || 0
      let cssHeight = 0
      cssHeight += (paginationDom && parseInt(getStyle(paginationDom, 'margin-top'))) || 0
      cssHeight += (paginationDom && parseInt(getStyle(paginationDom, 'margin-bottom'))) || 0
      cssHeight += (cardBodyDom && parseInt(getStyle(cardBodyDom, 'padding-top'))) || 0
      cssHeight += (cardBodyDom && parseInt(getStyle(cardBodyDom, 'padding-bottom'))) || 0

      return (
        viewDomH - searchDomH - toolbarDomH - tableHeaderDomH - paginationDomH - cssHeight - gapH
      )
    }
    return undefined
  }
  return [tableHeight, updateTableHeight]
}
