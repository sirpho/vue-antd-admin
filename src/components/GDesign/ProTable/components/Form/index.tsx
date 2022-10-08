import { computed, defineComponent, nextTick, ref, unref, watch } from 'vue'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import { Button, DatePicker, Form, Grid, Input, Select, Space, TreeSelect } from 'ant-design-vue'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { PropTypes } from '@/utils'
import { useForm } from './useForm'
import type { ColConfig } from '../../types/table'
import type { ProSearchMap } from '../../types/column'
import { defaultSearchProp, proTableProps } from '../../props'
import { isObject } from '@/utils/validate'

import './style.less'

const { useBreakpoint } = Grid

const { MonthPicker, RangePicker, TimePicker, YearPicker } = DatePicker

export default defineComponent({
  props: {
    search: proTableProps.search,
    modal: proTableProps.modalScroll,
    searchMap: Array as PropType<ProSearchMap[]>,
    loading: PropTypes.bool,
    prefixCls: PropTypes.string,
    defaultParams: Object as PropType<RecordType>
  },
  emits: ['search', 'collapse'],
  setup(props, { emit, slots }) {
    const screens = useBreakpoint()

    const { formState, resetFormState, changeFormState } = useForm(
      props.defaultParams,
      props.searchMap
    )

    const searchProp = computed(() => Object.assign({ ...defaultSearchProp }, props.search))
    const advanced = ref(false)

    const hasSearch = computed(() => !!searchProp.value.showSearch)
    const hasReset = computed(() =>
      searchProp.value.showReset === undefined ? hasSearch.value : searchProp.value.showReset
    )

    const responsiveArray: { value: Breakpoint; span: number }[] = [
      { value: 'xxl', span: 4 },
      { value: 'xl', span: 3 },
      { value: 'lg', span: 2 },
      { value: 'md', span: 2 },
      { value: 'sm', span: 2 },
      { value: 'xs', span: 1 }
    ]

    const rowLength = computed(() => getColSpanStyle(searchProp.value.span))

    watch(
      () => searchProp.value.defaultCollapsed,
      (value) => {
        advanced.value = advanced.value || value
      }
    )

    const getColSpanStyle = (colSpan: ColConfig) => {
      let span: number | string | undefined = 4

      // colSpan 响应式
      for (let i = 0; i < responsiveArray.length; i += 1) {
        const breakpoint: Breakpoint = responsiveArray[i].value
        if (screens.value[breakpoint]) {
          span = colSpan?.[breakpoint] || (props.modal ? 3 : responsiveArray[i].span)
          break
        }
      }

      return span as number
    }

    const changeAdvanced = (status: boolean) => {
      advanced.value = status
      emit('collapse', status)
    }

    const getStyleWidth = (index, rowLength, rowWidth) => {
      return (index + 1) % rowLength === 0
        ? {
            ...rowWidth,
            marginRight: 0
          }
        : {
            ...rowWidth,
            marginRight: '2%'
          }
    }

    const handleChange = (value, record) => {
      switch (record.valueType) {
        case 'select':
          changeFormState(
            record.dataIndex,
            value || value === 0 ? value : record.initialValue || undefined
          )
          break
        case 'treeSelect':
          changeFormState(
            record.dataIndex,
            value || value === 0
              ? value
              : record.initialValue ||
                  (record.fidle?.treeCheckable || record.field?.multiple ? [] : null)
          )
          break
        case 'date':
          changeFormState(
            record.dataIndex,
            value ? dayjs(value).format(record.format || 'YYYY-MM-DD') : record.initialValue || null
          )
          break
        case 'dateMonth':
          changeFormState(
            record.dataIndex,
            value ? dayjs(value).format('YYYY-MM') : record.initialValue || null
          )
          break
        case 'dateYear':
          changeFormState(
            record.dataIndex,
            value ? dayjs(value).format('YYYY') : record.initialValue || null
          )
          break
        case 'dateRange':
          changeFormState(
            record.dataIndex,
            value && value.length > 0
              ? [
                  dayjs(value[0]).format(record.format || 'YYYY-MM-DD'),
                  dayjs(value[1]).format(record.format || 'YYYY-MM-DD')
                ]
              : record.initialValue || null
          )
          break
        case 'time':
          changeFormState(
            record.dataIndex,
            value ? dayjs(value).format(record.format || 'HH:mm:ss') : record.initialValue || null
          )
          break
        case 'text':
        default:
          changeFormState(record.dataIndex, value || record.initialValue || '')
          break
      }
      if (searchProp.value.showSearch || record.valueType === 'text') {
        return
      } else if (record.valueType === 'treeSelect' || record.valueType === 'dateRange') {
        handleSubmit()
      } else {
        handleSubmit()
      }
    }

    const handleSubmit = (isManual?: boolean) => {
      nextTick(() => {
        const params: RecordType = cloneDeep(formState)
        if (!hasSearch.value || isManual) emit('search', params)
      })
    }

    const resetForm = () => {
      resetFormState()
      handleSubmit(true)
    }

    const optionRender = () =>
      (hasSearch.value || hasReset.value) && (
        <Space>
          {hasReset.value && (
            <Button onClick={() => resetForm()}>{searchProp.value.resetText || '重置'}</Button>
          )}
          {hasSearch.value && (
            <Button loading={props.loading} type="primary" onClick={() => handleSubmit(true)}>
              {searchProp.value.searchText || '查询'}
            </Button>
          )}
        </Space>
      )

    const AdvancedSlot = ({ formItemStyle, advanced, showAdvanced = true }) => (
      <div style={formItemStyle} class={`${unref(props.prefixCls)}-form-collapse-button`}>
        <Space size={16}>
          {optionRender()}
          {showAdvanced && (
            <a onClick={() => changeAdvanced(!advanced)}>
              {advanced ? '收起' : '展开'}
              {searchProp.value.collapseRender ? (
                searchProp.value.collapseRender()
              ) : advanced ? (
                <UpOutlined />
              ) : (
                <DownOutlined />
              )}
            </a>
          )}
        </Space>
      </div>
    )

    const FormItemContainer = (record) => {
      let show
      switch (record.valueType) {
        case 'select':
          show = (
            <Select
              style={{ width: '100%' }}
              value={record.loading ? undefined : formState[record.dataIndex]}
              optionFilterProp="label"
              placeholder={record.placeholder || '请选择'}
              showSearch={record.showSearch}
              allowClear={record.allowClear !== false}
              getPopupContainer={(trigger) => {
                if (trigger && trigger.parentNode) {
                  return trigger.parentNode
                }
                return trigger
              }}
              notFoundContent={
                record.loading === undefined ? undefined : record.loading ? (
                  <a-spin size="small" />
                ) : undefined
              }
              onChange={(e) => handleChange(e, record)}
            >
              {record.valueEnum.map((item) => {
                return isObject(item) ? (
                  <a-select-option key={item.value} value={item.value}>
                    {item.label}
                  </a-select-option>
                ) : (
                  <a-select-option key={item} value={item}>
                    {item}
                  </a-select-option>
                )
              })}
            </Select>
          )
          break
        case 'treeSelect':
          show = (
            <TreeSelect
              style={{ width: '100%' }}
              value={formState[record.dataIndex]}
              placeholder={record.placeholder || '请选择'}
              allowClear={record.allowClear !== false}
              treeData={record.valueEnum}
              getPopupContainer={(trigger) => {
                if (trigger && trigger.parentNode) {
                  return trigger.parentNode
                }
                return trigger
              }}
              notFoundContent={
                record.loading === undefined ? undefined : record.loading ? (
                  <a-spin size="small" />
                ) : undefined
              }
              onChange={(e) => handleChange(e, record)}
              {...(record.field || {})}
            />
          )
          break
        case 'date':
          show = (
            <DatePicker
              style={{ width: '100%' }}
              value={
                formState[record.dataIndex]
                  ? dayjs(formState[record.dataIndex], record.format || 'YYYY-MM-DD')
                  : null
              }
              getPopupContainer={(trigger) => {
                if (trigger && trigger.parentNode) {
                  return trigger.parentNode as HTMLElement
                }
                return trigger
              }}
              placeholder={record.placeholder || '请选择'}
              allowClear={record.allowClear !== false}
              format={record.format || 'YYYY-MM-DD'}
              showTime={record.showTime}
              showToday={record.showToday || true}
              renderExtraFooter={record.renderExtraFooter || null}
              onChange={(e) => handleChange(e, record)}
            />
          )
          break
        case 'dateMonth':
          show = (
            <MonthPicker
              style={{ width: '100%' }}
              value={
                formState[record.dataIndex]
                  ? dayjs(formState[record.dataIndex], record.format || 'YYYY-MM')
                  : null
              }
              getPopupContainer={(trigger) => {
                if (trigger && trigger.parentNode) {
                  return trigger.parentNode as HTMLElement
                }
                return trigger
              }}
              placeholder={record.placeholder || '请选择'}
              renderExtraFooter={record.renderExtraFooter || null}
              onChange={(e) => handleChange(e, record)}
            />
          )
          break
        case 'dateYear':
          show = (
            <YearPicker
              style={{ width: '100%' }}
              value={
                formState[record.dataIndex]
                  ? dayjs(formState[record.dataIndex], record.format || 'YYYY')
                  : null
              }
              getPopupContainer={(trigger) => {
                if (trigger && trigger.parentNode) {
                  return trigger.parentNode as HTMLElement
                }
                return trigger
              }}
              placeholder={record.placeholder || '请选择'}
              renderExtraFooter={record.renderExtraFooter || null}
              onChange={(e) => handleChange(e, record)}
            />
          )
          break
        case 'dateRange':
          show = (
            <RangePicker
              style={{ width: '100%' }}
              value={
                formState[record.dataIndex]?.length
                  ? [
                      dayjs(formState[record.dataIndex][0], record.format || 'YYYY-MM-DD'),
                      dayjs(formState[record.dataIndex][1], record.format || 'YYYY-MM-DD')
                    ]
                  : null
              }
              getPopupContainer={(trigger) => {
                if (trigger && trigger.parentNode) {
                  return trigger.parentNode as HTMLElement
                }
                return trigger
              }}
              placeholder={record.placeholder || ['开始日期', '结束日期']}
              format={record.format || 'YYYY-MM-DD'}
              renderExtraFooter={record.renderExtraFooter || null}
              showTime={record.showTime}
              onChange={(e) => handleChange(e, record)}
            />
          )
          break
        case 'time':
          show = (
            <TimePicker
              style={{ width: '100%' }}
              value={
                formState[record.dataIndex]
                  ? dayjs(formState[record.dataIndex], record.format || 'HH:mm:ss')
                  : null
              }
              getPopupContainer={(trigger) => {
                if (trigger && trigger.parentNode) {
                  return trigger.parentNode as HTMLElement
                }
                return trigger
              }}
              placeholder={record.placeholder || '请选择'}
              allowClear={record.allowClear !== false}
              use12Hours={record.use12Hours}
              format={record.format || 'HH:mm:ss'}
              renderExtraFooter={record.renderExtraFooter || null}
              onChange={(e) => handleChange(e, record)}
            />
          )
          break
        case 'text':
        default:
          show = (
            <Input.Search
              style={{ width: '100%' }}
              value={formState[record.dataIndex]}
              placeholder={record.placeholder || '请输入'}
              allowClear={record.allowClear !== false}
              onChange={(e) => handleChange(e.target.value, record)}
              onSearch={(_) => handleSubmit()}
            />
          )
          break
      }
      return show
    }

    const FormItemWrapper = ({ formItemStyle, item }) => (
      <Form.Item label={item.title} style={formItemStyle}>
        {item.__v_isVNode ? item : FormItemContainer(item)}
      </Form.Item>
    )

    const FormItemRender = () => {
      const formNode = [...props.searchMap, ...slots.default?.()]

      return formNode.map((item, index) => {
        const rowWidth = {
          width: `${(100 - (rowLength.value - 1) * 2) / rowLength.value}%`
        }
        const formItemStyle = getStyleWidth(index, rowLength.value, rowWidth)

        if (formNode.length < rowLength.value || advanced.value) {
          return (
            <>
              {FormItemWrapper({ formItemStyle, item })}
              {index === formNode.length - 1 &&
                AdvancedSlot({
                  formItemStyle: {
                    flex: 1,
                    justifyContent: 'flex-end'
                  },
                  advanced: advanced.value,
                  showAdvanced: advanced.value
                })}
            </>
          )
        } else {
          return (
            <>
              {index < rowLength.value - 1 &&
                FormItemWrapper({
                  formItemStyle,
                  item
                })}
              {index === rowLength.value - 1 &&
                rowLength.value - 1 === 0 &&
                FormItemWrapper({
                  formItemStyle,
                  item
                })}
              {index === rowLength.value - 1 &&
                AdvancedSlot({
                  formItemStyle: {
                    flex: 1,
                    justifyContent: 'flex-end'
                  },
                  advanced: false,
                  showAdvanced: formNode.length > rowLength.value
                })}
            </>
          )
        }
      })
    }

    return () => (
      <div
        class={{
          [`${unref(props.prefixCls)}-search`]: true,
          [`${searchProp.value.className}`]: searchProp.value.className
        }}
      >
        <Form class={`${unref(props.prefixCls)}-form`} layout="horizontal">
          <div class={`${unref(props.prefixCls)}-form-container`}>{FormItemRender()}</div>
        </Form>
      </div>
    )
  }
})
