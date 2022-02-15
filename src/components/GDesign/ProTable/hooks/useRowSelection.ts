import type { Ref } from 'vue'
import { ref } from 'vue'
import type { ProTableProps } from '../Table'

export function useRowSelection(
  rowKey: Ref<ProTableProps['rowKey']>,
  rowSelection: Ref<ProTableProps['rowSelection']>,
) {
  const selectedKey: Ref<(string | number)[]> = ref([])
  const selectedItem: Ref<RecordType[]> = ref([])

  const selectRowKey = (record, selected) => {
    if (selected) {
      selectedKey.value.push(record[rowKey.value])
      selectedItem.value.push(record)
    } else {
      selectedKey.value = selectedKey.value.filter(item => item !== record[rowKey.value])
      selectedItem.value = selectedItem.value.filter(item => item[rowKey.value] !== record[rowKey.value])
    }
  }

  const changeRowKey = () => {
    rowSelection.value?.onChange(selectedKey.value, selectedItem.value)
  }

  const selectAllRowKey = (selected, selectedRows, changeRows) => {
    if (selected) {
      selectedRows.map(item => {
        if (selectedKey.value.every(el => el !== item[rowKey.value])) {
          selectedKey.value.push(item[rowKey.value])
          selectedItem.value.push(item)
        }
        return item
      })
    } else {
      changeRows.map(item => {
        if (selectedKey.value.some(el => el === item[rowKey.value])) {
          selectedKey.value = selectedKey.value.filter(el => el !== item[rowKey.value])
          selectedItem.value = selectedItem.value.filter(el => el[rowKey.value] !== item[rowKey.value])
        }
        return item
      })
    }
  }

  return {
    selectedKey,
    selectRowKey,
    selectAllRowKey,
    changeRowKey
  }
}
