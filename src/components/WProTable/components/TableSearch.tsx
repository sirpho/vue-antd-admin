import moment from 'moment'
import {
  computed,
  defineComponent,
  PropType,
  reactive,
  unref,
  watch
} from 'vue'
import { Grid } from 'ant-design-vue'
import { SearchOutlined, UpOutlined, DownOutlined } from '@ant-design/icons-vue'
import { cloneDeep } from 'lodash-es'
import PropTypes from '/@/hooks/vue-types'
import type { ProSearchConfig } from '../types/column'

import styles from '../style.module.less'

export type Breakpoint = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';

export type ColSpanType = number | string;

const { useBreakpoint } = Grid

const tableSearchProps = {
  type: String as PropType<'dataSouce' | 'columns' | 'slots'>,
  loading: PropTypes.bool,
  searchData: {
    type: [ Array ] as PropType<ProSearchConfig[]>,
    default: () => []
  },
  span: {
    type: [ Object, Number ] as PropType<ColSpanType | Partial<Record<Breakpoint, ColSpanType>>>,
    default: () => undefined
  },
  className: PropTypes.string,
  searchStyle: PropTypes.style,
  showReset: PropTypes.bool,
  showSearch: PropTypes.bool,
  resetText: {
    type: String as PropType<string>,
    default: '重置'
  },
  searchText: {
    type: String as PropType<string>,
    default: '查询'
  },
  defaultCollapsed: PropTypes.bool,
  collapseRender: {
    type: [ Function, Boolean ] as PropType<WithFalse<(collapsed?: boolean) => CustomRender>>,
    default: () => undefined
  }
}

const TableSearch = defineComponent({
  props: tableSearchProps,
  setup(props, { emit, slots }) {
    const tableClassName = 'wd-pro-table'
    const screens = useBreakpoint()
    const responsiveArray: { value: Breakpoint; span: number; }[] = [
      { value: 'xxl', span: 5 },
      { value: 'xl', span: 3 },
      { value: 'lg', span: 2 },
      { value: 'md', span: 2 },
      { value: 'sm', span: 2 },
      { value: 'xs', span: 1 }
    ]
    const modelRef = reactive({})
    const state = reactive({
      searchType: 'dataSouce',
      advanced: false
    })
    const getSearchType = computed(() => props.type || 'dataSouce')
    const getDataRef = computed(() => {
      const datasource: ProSearchConfig[] = []
      if (props.type === 'dataSouce' || props.type === 'columns') {
        props.searchData.map(item => {
          if (item.valueType && item.name) {
            let initialValue = item.initialValue
            const valueUndefined: string[] = [ 'select' ]
            const valueNull: string[] = [ 'date', 'time', 'dateRange' ]
            const valueEmptyArray: string[] = []
            if (!initialValue && valueUndefined.includes(item.valueType)) {
              initialValue = undefined
            } else if (!initialValue && valueNull.includes(item.valueType)) {
              initialValue = null
            } else if (!initialValue && valueEmptyArray.includes(item.valueType)) {
              initialValue = []
            } else if (!initialValue) {
              initialValue = ''
            }
            modelRef[item.name] = initialValue
          }
          datasource.push(cloneDeep(item))
          return item
        })
      }
      return datasource
    })
    const rowLength = computed(() => {
      return getColSpanStyle(props.span)
    })
    watch(() => props.defaultCollapsed, (value) => {
      state.advanced = state.advanced || value
    })
    const getColSpanStyle = (colSpan: ColSpanType | Partial<Record<Breakpoint, ColSpanType>> | undefined) => {
      let span: number | string | undefined = 5

      // colSpan 响应式
      if (typeof colSpan === 'object') {
        for (let i = 0; i < responsiveArray.length; i += 1) {
          const breakpoint: Breakpoint = responsiveArray[i].value
          if (screens.value[breakpoint] && colSpan[breakpoint] !== undefined) {
            span = colSpan[breakpoint]
            break
          }
        }
      }

      if (
        typeof span === 'string' && /\d%|\dpx/i.test(span) ||
        typeof span === 'number' ||
        !span
      ) {
        for (let i = 0; i < responsiveArray.length; i += 1) {
          const breakpoint: Breakpoint = responsiveArray[i].value
          if (screens.value[breakpoint]) {
            span = responsiveArray[i].span
            break
          }
        }
      }

      return span as number
    }
    const changeAdvanced = (status) => { state.advanced = status }
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
    const handleChange = (val, record) => {
      switch (record.valueType) {
        case 'text':
          modelRef[record.name] = val.target.value || record.initialValue
          break
        case 'select':
          modelRef[record.name] = val || record.initialValue || undefined
          if (!props.showSearch) changeTableParams()
          break
        case 'date':
          modelRef[record.name] = val
            ? moment(val).format(record.format || 'YYYY-MM-DD')
            : record.initialValue || null
          if (!props.showSearch) changeTableParams()
          break
        case 'dateMonth':
          modelRef[record.name] = val
            ? moment(val).format('YYYY-MM')
            : record.initialValue || null
          if (!props.showSearch) changeTableParams()
          break
        case 'dateRange':
          modelRef[record.name] = val && val.length > 0
            ? [
              moment(val[0]).format(record.format || 'YYYY-MM-DD'),
              moment(val[1]).format(record.format || 'YYYY-MM-DD')
            ]
            : record.initialValue || null
          if (!props.showSearch) changeTableParams(val, record)
          break
        case 'time':
          modelRef[record.name] = val
            ? moment(val).format(record.format || 'HH:mm:ss')
            : record.initialValue || null
          if (!props.showSearch) changeTableParams()
          break
      }
    }
    const changeTableParams = (val?, record?) => {
      if (record && record.valueType === 'text') modelRef[record.name] = val || record.initialValue
      const params = cloneDeep(modelRef)
      if (record && record.valueType === 'dateRange') {
        params[record.rangeStartName || 'start'] = params[record.name]
          ? params[record.name][0]
          : ''
        params[record.rangeEndName || 'end'] = params[record.name]
          ? params[record.name][1]
          : ''
        delete params[record.name]
      }
      if (!props.showSearch) emit('tableSearch', params)
    }
    const resetTableParams = () => {
      if (props.type === 'dataSouce' || props.type === 'columns') {
        props.searchData.map((item: any) => {
          let initialValue: any = item.initialValue
          const valueUndefined = [ 'select' ]
          const valueNull = [ 'date', 'time', 'dateRange' ]
          const valueEmptyArray: any = []
          if (!initialValue && valueUndefined.includes(item.valueType)) {
            initialValue = undefined
          } else if (!initialValue && valueNull.includes(item.valueType)) {
            initialValue = null
          } else if (!initialValue && valueEmptyArray.includes(item.valueType)) {
            initialValue = []
          } else if (!initialValue) {
            initialValue = ''
          }
          modelRef[item.name] = initialValue
          return item
        })
      }
      searchTableParams(true)
    }
    const searchTableParams = (reset) => {
      let params: any = cloneDeep(modelRef)
      if (props.type === 'dataSouce' || props.type === 'columns') {
        const record = (props.searchData || []).find((item) => item.valueType === 'dateRange')
        if (record) {
          params[record.rangeStartName || 'start'] = params.dateRange ? [ 0 ] : null
          params[record.rangeEndName || 'end'] = params.dateRange ? [ 1 ] : null
        }
        delete params.dateRange
      } else {
        params = {}
      }
      emit('tableSearch', params, reset)
    }
    const dataEntrySlot = (record) => {
      let show
      switch (record.valueType) {
        case 'text':
          show = (
            <a-input-search
              style={{ width: '100%' }}
              value={modelRef[record.name]}
              placeholder={record.placeholder || '请输入'}
              allowClear={record.allowClear || record.allowClear === false ? record.allowClear : true}
              enterButton={<a-button><SearchOutlined /></a-button>}
              onChange={(e) => handleChange(e, record)}
              onSearch={(e) => changeTableParams(e, record)}
            />
          )
          break
        case 'select':
          show = (
            <a-select
              style={{ width: '100%' }}
              value={modelRef[record.name]}
              optionFilterProp="label"
              placeholder={record.placeholder || '请选择'}
              showSearch={record.showSearch}
              allowClear={record.allowClear || record.allowClear === false ? record.allowClear : true}
              notFoundContent={
                record.loading === undefined
                  ? undefined
                  : record.loading
                    ? <a-spin size="small" />
                    : undefined
              }
              onChange={(e) => handleChange(e, record)}
            >
              {
                record.valueEnum.map(item => <a-select-option key={item.value} value={item.value}>
                  {item.text}
                </a-select-option>)
              }
            </a-select>
          )
          break
        case 'date':
          show = (
            <a-date-picker
              style={{ width: '100%' }}
              value={modelRef[record.name] ? moment(modelRef[record.name]) : null}
              placeholder={record.placeholder || '请选择'}
              allowClear={record.allowClear || record.allowClear === false ? record.allowClear : true}
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
            <a-month-picker
              style={{ width: '100%' }}
              value={modelRef[record.name] ? moment(modelRef[record.name]) : null}
              placeholder={record.placeholder || '请选择'}
              renderExtraFooter={record.renderExtraFooter || null}
              onChange={(e) => handleChange(e, record)}
            />
          )
          break
        case 'dateRange':
          show = (
            <a-range-picker
              style={{ width: '100%' }}
              value={modelRef[record.name] ? [
                moment(modelRef[record.name][0]),
                moment(modelRef[record.name][1])
              ] : null}
              placeholder={record.placeholder || '请选择'}
              format={record.format || 'YYYY-MM-DD HH:mm:ss'}
              renderExtraFooter={record.renderExtraFooter || null}
              showTime={record.showTime}
              onChange={(e) => handleChange(e, record)}
            />
          )
          break
        case 'time':
          show = (
            <a-time-picker
              style={{ width: '100%' }}
              value={modelRef[record.name] ? moment(modelRef[record.name], 'HH:mm:ss') : null}
              placeholder={record.placeholder || '请选择'}
              allowClear={record.allowClear || record.allowClear === false ? record.allowClear : true}
              use12Hours={record.use12Hours}
              format={record.format || 'HH:mm:ss'}
              renderExtraFooter={record.renderExtraFooter || null}
              onChange={(e) => handleChange(e, record)}
            />
          )
          break
      }
      return show
    }
    const formItemSlot = ({ formItemStyle, items }) => (
      <a-form-item style={formItemStyle}>
        {
          getSearchType.value === 'dataSouce' || getSearchType.value === 'columns'
            ? dataEntrySlot(items)
            : items
        }
      </a-form-item>
    )
    const optionRender = () => (props.showSearch || props.showReset) && (
      <a-space>
        {props.showReset && (
          <a-button onClick={resetTableParams}>{props.resetText}</a-button>
        )}
        {props.showSearch && (
          <a-button
            loading={props.loading}
            type="primary"
            onClick={() => searchTableParams(false)}
          >
            {props.searchText}
          </a-button>
        )}
      </a-space>
    )
    const advancedSlot = ({ formItemStyle, advanced, showAdvanced = true }) =>
      <div style={formItemStyle} class={styles.list_unfold}>
        <a-space size={16}>
          {optionRender()}
          {showAdvanced && (
            <a onClick={() => changeAdvanced(!advanced)}>
              {advanced ? '收起' : '展开'}
              {
                props.collapseRender ?
                  props.collapseRender()
                  : advanced
                    ? <UpOutlined />
                    : <DownOutlined />
              }
            </a>
          )}
        </a-space>
      </div>
    const formRowSlot = () => {
      const { advanced } = state
      const formRender = getSearchType.value === 'slots'
        ? slots.default?.() || []
        : unref(getDataRef)
      const show: any = []
      const rowWidth = {
        width: `${(100 - (rowLength.value - 1) * 2) / rowLength.value}%`
      }
      for (let i = 0; i < formRender.length; i += 1) {
        const formItemStyle = getStyleWidth(i, rowLength.value, rowWidth)
        if ((formRender.length < rowLength.value) || advanced) {
          show.push(
            formItemSlot({
              formItemStyle,
              items: formRender[i]
            })
          )
          if ((i === formRender.length - 1)) show.push(
            advancedSlot({
              formItemStyle: {
                flex: 1,
                justifyContent: 'flex-end'
              },
              advanced,
              showAdvanced: advanced
            })
          )
        } else {
          if (i < rowLength.value - 1) {
            show.push(
              formItemSlot({
                formItemStyle,
                items: formRender[i]
              })
            )
          }
          if (i === rowLength.value - 1 && rowLength.value - 1 === 0) {
            show.push(
              formItemSlot({
                formItemStyle,
                items: formRender[i]
              })
            )
          }
          if (i === rowLength.value - 1) {
            show.push(
              advancedSlot({
                formItemStyle: {
                  flex: 1,
                  justifyContent: 'flex-end'
                },
                advanced: false,
                showAdvanced: formRender.length >= rowLength.value
              })
            )
          }
          if (i > rowLength.value - 1) {
            show.push(null)
          }
        }
      }
      return show
    }
    return () => (
      <div class={[ styles[`${tableClassName}-search`], props.className ]}>
        <a-form class={styles.table_search} layout="horizontal">
          <div class={styles.table_search_block}>
            {formRowSlot()}
          </div>
        </a-form>
      </div>
    )
  }
})
export default TableSearch
