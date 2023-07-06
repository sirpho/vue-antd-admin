import {ref, onMounted, onUnmounted, nextTick, ComputedRef} from 'vue'
// import { onMountedOrActivated } from '@gx-admin/hooks/core'

const getStyle = (dom: Element, attr: string) => {
  return getComputedStyle(dom)[attr]
}

export function useTableHeight(gapH = 0, tableComputed?: ComputedRef) {
  const tableHeight = ref(undefined)

  onMounted(() => {
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
    const viewDom = document.querySelector('main')
    if (viewDom) {
      const tableDom = tableComputed ? unref(tableComputed.value)?.$el : null
      const subTabGroupDom = viewDom.querySelector('.sub-tab-group')
      const gxProGridContentDom = viewDom.querySelector('.gx-pro-grid-content')
      const searchDom = viewDom.querySelector('.gx-pro-table-search')
      const toolbarDom = viewDom.querySelector('.gx-pro-table-list-toolbar')
      const tableTitleDom = viewDom.querySelector('.ant-table-title')
      const tableHeaderDom = (tableDom || viewDom).querySelector('.ant-table-header')
      const tableSummaryDom = (tableDom || viewDom).querySelector('.ant-table-summary')
      const paginationDom = viewDom.querySelector('.ant-table-pagination')
      const cardBodyDom = viewDom.querySelector('.ant-card-body')

      const viewDomH = viewDom.getBoundingClientRect().height || 0
      const subTabGroupDomH = subTabGroupDom?.getBoundingClientRect().height || 0
      const searchDomH = searchDom?.getBoundingClientRect().height || 0
      const toolbarDomH = toolbarDom?.getBoundingClientRect().height || 0
      const tableTitleDomH = tableTitleDom?.getBoundingClientRect().height || 0
      const tableHeaderDomH = tableHeaderDom?.getBoundingClientRect().height || 0
      const tableSummaryDomH = tableSummaryDom?.getBoundingClientRect().height || 0
      const paginationDomH = paginationDom?.getBoundingClientRect().height || 0

      let cssHeight = 0
      cssHeight += (subTabGroupDom && parseInt(getStyle(subTabGroupDom, 'margin-top'))) || 0
      cssHeight +=
        (gxProGridContentDom && parseInt(getStyle(gxProGridContentDom, 'padding-top'))) || 0
      cssHeight += (paginationDom && parseInt(getStyle(paginationDom, 'margin-top'))) || 0
      cssHeight += (paginationDom && parseInt(getStyle(paginationDom, 'margin-bottom'))) || 0
      cssHeight += (cardBodyDom && parseInt(getStyle(cardBodyDom, 'padding-top'))) || 0
      cssHeight += (cardBodyDom && parseInt(getStyle(cardBodyDom, 'padding-bottom'))) || 0

      // console.log('=========start==========')
      // console.log('viewDomH:', viewDomH)
      // console.log('subTabGroupDomH:', subTabGroupDomH)
      // console.log('searchDomH:', searchDomH)
      // console.log('toolbarDomH:', toolbarDomH)
      // console.log('tableTitleDomH:', tableTitleDomH)
      // console.log('tableHeaderDomH:', tableHeaderDomH)
      // console.log('tableSummaryDomH:', tableSummaryDomH)
      // console.log('paginationDomH:', paginationDomH)
      // console.log('cssHeight:', cssHeight)
      // console.log('gapH:', gapH)
      // console.log('=========end==========')

      return (
        viewDomH -
        subTabGroupDomH -
        searchDomH -
        toolbarDomH -
        tableTitleDomH -
        tableHeaderDomH -
        tableSummaryDomH -
        paginationDomH -
        cssHeight -
        gapH
      )
    }
    return undefined
  }

  return [tableHeight, updateTableHeight]
}
