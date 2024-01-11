import { computed, defineComponent, nextTick, ref, unref } from 'vue'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import { Button, DatePicker, Form, Grid, Input, Select, Space, TreeSelect } from 'ant-design-vue'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { PropTypes } from '@/utils'
import { useForm } from './useForm'
import type { ColConfig } from '../../types/table'
import type { ProSearchMap } from '../../types/column'
import { defaultSearchProp, proTableProps } from '../../props'
import { isObject, isFunction } from '@sirpho/utils/validate'
import { filterEmpty } from 'ant-design-vue/es/_util/props-util'

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
    const collapse = ref(searchProp.value.collapse)

    const hasSearch = computed(() => !!searchProp.value.showSearch)
    const hasReset = computed(() =>
      searchProp.value.showReset === undefined ? hasSearch.value : searchProp.value.showReset
    )

    const responsiveArray: { value: Breakpoint; span: number }[] = [
      // 屏幕 ≥ 2000px
      { value: 'xxxl', span: 6 },
      // 屏幕 ≥ 1600px
      { value: 'xxl', span: 5 },
      // 屏幕 ≥ 1200px
      { value: 'xl', span: 4 },
      // 屏幕 ≥ 992px
      { value: 'lg', span: 3 },
      // 屏幕 ≥ 768px
      { value: 'md', span: 2 },
      // 屏幕 ≥ 576px
      { value: 'sm', span: 2 },
      // 屏幕 < 576px
      { value: 'xs', span: 1 }
    ]

    const rowLength = computed(() => getColSpanStyle(searchProp.value.span))

    const getColSpanStyle = (colSpan: ColConfig) => {
      let span: number | string | undefined = 4
      // colSpan 响应式
      for (let i = 0; i < responsiveArray.length; i++) {
        const breakpoint: Breakpoint = responsiveArray[i].value
        if (screens.value[breakpoint]) {
          span = colSpan?.[breakpoint] || (props.modal ? 3 : responsiveArray[i].span)
          break
        }
      }

      return span as number
    }

    const changeCollapse = (status: boolean) => {
      collapse.value = status
      emit('collapse', status)
    }

    const getStyleWidth = (index, rowLength, rowWidth) => {
      return (index + 1) % rowLength === 0
        ? {
            ...rowWidth,
            paddingRight: 0
          }
        : {
            ...rowWidth,
            paddingRight: '10px'
          }
    }

    /**
     * 选择后查询的表单项
     */
    const changeSearchType = [
      'treeSelect',
      'date',
      'dateMonth',
      'dateYear',
      'dateRange',
      'time',
      'select'
    ]

    const handleChange = (value, record) => {
      switch (record.valueType) {
        case 'select':
          changeFormState(record.dataIndex, value || value === 0 ? value : undefined)
          break
        case 'treeSelect':
          changeFormState(
            record.dataIndex,
            value || value === 0
              ? value
              : record.fidle?.treeCheckable || record.field?.multiple
              ? []
              : null
          )
          break
        case 'date':
          changeFormState(
            record.dataIndex,
            value ? dayjs(value).format(record.format || 'YYYY-MM-DD') : null
          )
          break
        case 'dateMonth':
          changeFormState(record.dataIndex, value ? dayjs(value).format('YYYY-MM') : null)
          break
        case 'dateYear':
          changeFormState(record.dataIndex, value ? dayjs(value).format('YYYY') : null)
          break
        case 'dateRange':
          const values =
            value && value.length > 0
              ? [
                  dayjs(value[0]).format(record.format || 'YYYY-MM-DD'),
                  dayjs(value[1]).format(record.format || 'YYYY-MM-DD')
                ]
              : null
          changeFormState(record.dataIndex, values)
          record.rangeStartName &&
            changeFormState(record.rangeStartName, values && values.length > 0 ? values[0] : null)
          record.rangeEndName &&
            changeFormState(record.rangeEndName, values && values.length > 1 ? values[1] : null)
          break
        case 'time':
          changeFormState(
            record.dataIndex,
            value ? dayjs(value).format(record.format || 'HH:mm:ss') : null
          )
          break
        case 'text':
        default:
          changeFormState(record.dataIndex, value || '')
          break
      }
      record.onChange?.(formState[record.dataIndex])
      // 如果不显示搜索按钮，修改查询表单后自动查询
      if (!searchProp.value.showSearch) {
        handleSubmit(true, false)
        return
      }
      // 选择完毕后自动查询
      if (changeSearchType.includes(record.valueType) && record.changeSearch !== false) {
        handleSubmit(true, false)
      }
    }

    /**
     * 提交查询
     * @param isManual  是否是手动触发，用于判断是否重置页码
     * @param isReset   是否是重置查询
     */
    const handleSubmit = (isManual?: boolean, isReset?: boolean) => {
      nextTick(() => {
        const params: RecordType = cloneDeep(formState)
        const formNode = [...props.searchMap].filter(
          (item) => item.valueType === 'dateRange' && (item.rangeEndName || item.rangeStartName)
        )
        formNode.forEach((item) => {
          delete params[item.dataIndex as string]
        })
        if (!hasSearch.value || isManual) emit('search', params, isReset)
      })
    }

    /**
     * 重置查询
     */
    const resetForm = () => {
      resetFormState()
      handleSubmit(true, true)
    }

    /**
     * 查询表格重置、搜索按钮渲染
     */
    const optionRender = () =>
      (hasSearch.value || hasReset.value) && (
        <Space>
          {hasReset.value && (
            <Button onClick={() => resetForm()}>{searchProp.value.resetText || '重置'}</Button>
          )}
          {hasSearch.value && (
            <Button
              loading={props.loading}
              type="primary"
              onClick={() => handleSubmit(true, false)}
            >
              {searchProp.value.searchText || '查询'}
            </Button>
          )}
        </Space>
      )

    /**
     * 表格查询操作按钮与伸缩操作渲染
     * @param formItemStyle          样式
     * @param collapse               是否已折叠
     * @param showTelescopicButtons  是否展示伸缩操作栏
     * @constructor
     */
    const OperationSlot = ({ formItemStyle, collapse, showTelescopicButtons = true }) => (
      <div style={formItemStyle} class={`${unref(props.prefixCls)}-form-collapse-button`}>
        <Space size={16}>
          {optionRender()}
          {showTelescopicButtons && (
            <a onClick={() => changeCollapse(!collapse)}>
              {collapse ? '展开' : '收起'}
              {searchProp.value.collapseRender ? (
                searchProp.value.collapseRender(collapse)
              ) : collapse ? (
                <DownOutlined />
              ) : (
                <UpOutlined />
              )}
            </a>
          )}
        </Space>
      </div>
    )

    const FormItemContainer = (record) => {
      let show, valueEnum

      if (isFunction(record.valueEnum)) {
        valueEnum = record.valueEnum()
      } else {
        valueEnum = record.valueEnum || []
      }

      // 按下回车的事件
      const keyupEnter = (e: KeyboardEvent) => {
        const code = e.charCode || e.keyCode
        if (code === 13) {
          e.stopPropagation() //阻止冒泡或捕获促使enter键下拉框展开
          handleSubmit(true, false)
        }
      }

      switch (record.valueType) {
        case 'select':
          show = (
            <Select
              style={{ width: '100%' }}
              value={record.loading ? undefined : formState[record.dataIndex]}
              optionFilterProp="label"
              placeholder={record.placeholder || '请选择'}
              mode={record.mode || undefined}
              showSearch={record.showSearch}
              allowClear={record.allowClear !== false}
              getPopupContainer={(trigger) => {
                if (trigger && trigger.parentNode) {
                  return trigger.parentNode
                }
                return trigger
              }}
              notFoundContent={
                isFunction(record.notFoundContent) ? (
                  record.notFoundContent()
                ) : record.loading === undefined ? undefined : record.loading ? (
                  <a-spin size="small" />
                ) : undefined
              }
              onChange={(e) => handleChange(e, record)}
              {...(record.field || {})}
            >
              {valueEnum.map((item) => {
                return isObject(item) ? (
                  <a-select-option key={item.value} value={item.value} label={item.label}>
                    {item.label}
                  </a-select-option>
                ) : (
                  <a-select-option key={item} value={item} label={item}>
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
              treeData={valueEnum}
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
              inputReadOnly
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
              {...(record.field || {})}
            />
          )
          break
        case 'dateMonth':
          show = (
            <MonthPicker
              style={{ width: '100%' }}
              inputReadOnly
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
              allowClear={record.allowClear !== false}
              renderExtraFooter={record.renderExtraFooter || null}
              onChange={(e) => handleChange(e, record)}
              {...(record.field || {})}
            />
          )
          break
        case 'dateYear':
          show = (
            <YearPicker
              style={{ width: '100%' }}
              inputReadOnly
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
              allowClear={record.allowClear !== false}
              placeholder={record.placeholder || '请选择'}
              renderExtraFooter={record.renderExtraFooter || null}
              onChange={(e) => handleChange(e, record)}
              {...(record.field || {})}
            />
          )
          break
        case 'dateRange':
          show = (
            <RangePicker
              style={{ width: '100%' }}
              inputReadOnly
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
              allowClear={record.allowClear !== false}
              renderExtraFooter={record.renderExtraFooter || null}
              showTime={record.showTime}
              onChange={(e) => handleChange(e, record)}
              {...(record.field || {})}
            />
          )
          break
        case 'time':
          show = (
            <TimePicker
              inputReadOnly
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
              {...(record.field || {})}
            />
          )
          break
        case 'text':
        default:
          show = (
            <Input
              style={{ width: '100%' }}
              value={formState[record.dataIndex]}
              placeholder={record.placeholder || '请输入'}
              allowClear={record.allowClear !== false}
              onKeyup={
                record.enterSearch !== false
                  ? (e) => {
                      keyupEnter(e)
                    }
                  : undefined
              }
              onChange={(e) => handleChange(e.target.value, record)}
              {...(record.field || {})}
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
      const defaultSlots = filterEmpty([...slots.default?.()]) || []
      const formNodeList = [...props.searchMap, ...defaultSlots]

      return formNodeList.map((item, index) => {
        const rowWidth = {
          width: `${100 / rowLength.value}%`
        }
        const formItemStyle = getStyleWidth(index, rowLength.value, rowWidth)

        // 当前是收起状态
        if (collapse.value) {
          return (
            <>
              {(index < rowLength.value - 1 || (rowLength.value === 1 && index === 0)) &&
                FormItemWrapper({
                  formItemStyle,
                  item
                })}
              {(index === rowLength.value - 1 ||
                (index === formNodeList.length - 1 && formNodeList.length < rowLength.value)) &&
                OperationSlot({
                  formItemStyle: {
                    flex: 1,
                    justifyContent: 'flex-end'
                  },
                  collapse: collapse.value,
                  showTelescopicButtons: formNodeList.length >= rowLength.value
                })}
            </>
          )
        } else {
          // 当前是展开状态
          return (
            <>
              {FormItemWrapper({ formItemStyle, item })}
              {/* 渲染最后一个时带出操作栏 */}
              {index === formNodeList.length - 1 &&
                OperationSlot({
                  formItemStyle: {
                    flex: 1,
                    justifyContent: 'flex-end'
                  },
                  collapse: collapse.value,
                  showTelescopicButtons: formNodeList.length >= rowLength.value
                })}
            </>
          )
        }
      })
    }

    return {
      handleSubmit,
      changeFormState,
      FormItemRender,
      props,
      searchProp
    }
  },
  render() {
    const { props, searchProp, FormItemRender } = this
    return (
      <div
        class={{
          [`${unref(props.prefixCls)}-search`]: true,
          [`${searchProp.className}`]: searchProp.className
        }}
      >
        <Form class={`${unref(props.prefixCls)}-form`} layout="horizontal">
          <div class={`${unref(props.prefixCls)}-form-container`}>{FormItemRender()}</div>
        </Form>
      </div>
    )
  }
})
