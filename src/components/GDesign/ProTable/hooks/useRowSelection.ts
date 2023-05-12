import type { Ref } from 'vue'
import { ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { arrayRepeat } from '@sirpho/utils'
import type { ProTableProps } from '../Table'

export function useRowSelection(
  rowKey: Ref<ProTableProps['rowKey']>,
  rowSelection: Ref<ProTableProps['rowSelection']>
) {
  const selectedKey: Ref<(string | number)[]> = ref([])
  const selectedItem: Ref<RecordType[]> = ref([])

  watch(
    () => rowSelection.value?.defaultSelectKeys,
    (keys) => {
      selectedKey.value = arrayRepeat([...selectedKey.value, ...(keys || [])])
    },
    {
      deep: true,
      immediate: true
    }
  )

  watch(
    () => rowSelection.value?.defaultSelectRows,
    (rows) => {
      if (rows) {
        rows.forEach((item) => {
          if (selectedItem.value.every((el) => el[rowKey.value] !== item?.[rowKey.value]))
            selectedItem.value.push(cloneDeep(item))
        })
      }
    },
    {
      deep: true,
      immediate: true
    }
  )

  // proTable组件的rowSelection.selectedRowKeys修改时,同步修改到a-table组件中
  watch(()=> rowSelection.value?.selectedRowKeys, (keys) => {
    if(keys) {
      selectedKey.value = keys || []
    }
  }, {
    deep: true,
  })

  const selectRowKey = (record, selected) => {
    if (selected) {
      if (record?.[rowKey.value]) {
        if (rowSelection.value?.type === 'radio') {
          selectedKey.value = [record[rowKey.value]]
          selectedItem.value = [record]
        } else {
          selectedKey.value.push(record[rowKey.value])
          selectedItem.value.push(record)
        }
      }
    } else {
      selectedKey.value = selectedKey.value.filter((item) => item !== record[rowKey.value])
      selectedItem.value = selectedItem.value.filter(
        (item) => item[rowKey.value] !== record[rowKey.value]
      )
    }
  }

  const changeRowKey = () => {
    rowSelection.value?.onChange(selectedKey.value, selectedItem.value)
  }

  const selectAllRowKey = (selected, selectedRows, changeRows) => {
    if (selected) {
      selectedRows.map((item) => {
        if (selectedKey.value.every((el) => el !== item?.[rowKey.value])) {
          if (item?.[rowKey.value]) {
            selectedKey.value.push(item[rowKey.value])
            selectedItem.value.push(item)
          }
        }
        return item
      })
    } else {
      changeRows.map((item) => {
        if (selectedKey.value.some((el) => el === item?.[rowKey.value])) {
          selectedKey.value = selectedKey.value.filter((el) => el !== item[rowKey.value])
          selectedItem.value = selectedItem.value.filter(
            (el) => el[rowKey.value] !== item[rowKey.value]
          )
        }
        return item
      })
    }
  }

  const clearRowKey = () => {
    selectedKey.value = []
    selectedItem.value = []
    changeRowKey()
  }

  const removeRowKeys = (keyList: (string | number)[]) => {
    selectedKey.value = selectedKey.value.filter((el) => !keyList.includes(el))
    selectedItem.value = selectedItem.value.filter((el) => !keyList.includes(el?.[rowKey.value]))
    changeRowKey()
  }

  return {
    selectedKey,
    selectRowKey,
    selectAllRowKey,
    removeRowKeys,
    changeRowKey,
    clearRowKey
  }
}
