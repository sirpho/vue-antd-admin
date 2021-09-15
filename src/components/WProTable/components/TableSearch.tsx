import moment from 'moment'
import { computed, defineComponent, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { SearchOutlined, UpOutlined, DownOutlined } from '@ant-design/icons-vue'
import { cloneDeep } from 'lodash-es'
import styles from '../style.module.less'

const TableSearch = defineComponent({
  props: {
    type: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      required: false
    },
    data: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    },
    className: {
      type: String,
      required: false
    },
    showReset: {
      type: Boolean,
      required: false,
      default: false
    },
    showSearch: {
      type: Boolean,
      required: false,
      default: false
    },
    resetText: {
      type: String,
      required: false,
      default: '重置'
    },
    searchText: {
      type: String,
      required: false,
      default: '查询'
    },
    defaultCollapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    collapseRender: {
      type: Function,
      required: false
    }
  },
  setup(props, { emit }) {
    const tableClassName = 'wd-pro-table'
    const innerWidth = ref(window.innerWidth)
    const modelRef = reactive({})
    const state = reactive({
      searchType: 'dataSouce',
      advanced: false,
      formList: []
    })
    onMounted(() => {
      window.addEventListener('resize', getWidth)
    })
    onUnmounted(() => {
      window.removeEventListener('resize', getWidth)
    })
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 监听屏幕宽度
     */
    const getWidth = () => {
      innerWidth.value = window.innerWidth
    }
    const hanldeFormList = (data) => {
      const formList: any = []
      if (props.type === 'dataSouce' || props.type === 'columns') {
        data.map(item => {
          let defaultValue = item.defaultValue
          const valueUndefined = [ 'select' ]
          const valueNull = [ 'date', 'time', 'dateRange' ]
          const valueEmptyArray: any = []
          if (!defaultValue && valueUndefined.includes(item.valueType)) {
            defaultValue = undefined
          } else if (!defaultValue && valueNull.includes(item.valueType)) {
            defaultValue = null
          } else if (!defaultValue && valueEmptyArray.includes(item.valueType)) {
            defaultValue = []
          } else if (!defaultValue) {
            defaultValue = ''
          }
          modelRef[item.name] = defaultValue
          formList.push(cloneDeep(item))
          return item
        })
      } else if (props.type === 'slots') {
        data.map(item => {
          formList.push(item)
          return item
        })
      }
      state.formList = formList
    }
    watch(innerWidth, (value) => { innerWidth.value = value})
    watch(() => props.data, (dataSource) => {
      hanldeFormList(dataSource)
    }, {
      deep: true,
      immediate: true
    })
    watch(() => props.defaultCollapsed, (value) => {
      state.advanced = state.advanced || value
    }, {
      deep: true,
      immediate: true
    })
    watch(() => props.type, (value) => {
      state.searchType = value
    }, {
      deep: true,
      immediate: true
    })
    const rowLength = computed(() => {
      return innerWidth.value > 1540
        ? 5
        : innerWidth.value >= 1341 && innerWidth.value <= 1540
          ? 3
          : innerWidth.value >= 992 && innerWidth.value < 1540
            ? 2
            : 1
    })
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
          modelRef[record.name] = val.target.value || record.defaultValue
          break
        case 'select':
          modelRef[record.name] = val || record.defaultValue || undefined
          if (!props.showSearch) changeTableParams()
          break
        case 'date':
          modelRef[record.name] = val
            ? moment(val).format(record.format || 'YYYY-MM-DD')
            : record.defaultValue || null
          if (!props.showSearch) changeTableParams()
          break
        case 'dateMonth':
          modelRef[record.name] = val
            ? moment(val).format('YYYY-MM')
            : record.defaultValue || null
          if (!props.showSearch) changeTableParams()
          break
        case 'dateRange':
          modelRef[record.name] = val && val.length > 0
            ? [
              moment(val[0]).format(record.format || 'YYYY-MM-DD'),
              moment(val[1]).format(record.format || 'YYYY-MM-DD')
            ]
            : record.defaultValue || null
          if (!props.showSearch) changeTableParams(val, record)
          break
        case 'time':
          modelRef[record.name] = val
            ? moment(val).format(record.format || 'HH:mm:ss')
            : record.defaultValue || null
          if (!props.showSearch) changeTableParams()
          break
      }
    }
    const changeTableParams = (val?, record?) => {
      if (record && record.valueType === 'text') modelRef[record.name] = val || record.defaultValue
      const params = cloneDeep(modelRef)
      if (record && record.valueType === 'dateRange') {
        params[record.rangeStartName || 'start'] = params[record.valueType][0]
        params[record.rangeEndName || 'end'] = params[record.valueType][1]
        delete params[record.valueType]
      }
      if (!props.showSearch) emit('tableSearch', params)
    }
    const resetTableParams = () => {
      if (props.type === 'dataSouce' || props.type === 'columns') {
        props.data.map((item: any) => {
          let defaultValue: any = item.defaultValue
          const valueUndefined = [ 'select' ]
          const valueNull = [ 'date', 'time', 'dateRange' ]
          const valueEmptyArray: any = []
          if (!defaultValue && valueUndefined.includes(item.valueType)) {
            defaultValue = undefined
          } else if (!defaultValue && valueNull.includes(item.valueType)) {
            defaultValue = null
          } else if (!defaultValue && valueEmptyArray.includes(item.valueType)) {
            defaultValue = []
          } else if (!defaultValue) {
            defaultValue = ''
          }
          modelRef[item.name] = defaultValue
          return item
        })
      }
      searchTableParams(props.type === 'slots')
    }
    const searchTableParams = (reset) => {
      let params: any = cloneDeep(modelRef)
      if (props.type === 'dataSouce' || props.type === 'columns') {
        const record: any = props.data.find((item: any) => item.valueType === 'dateRange')
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
    const formItemSlot = ({ formItemStyle, items }) => <a-form-item style={formItemStyle}>
      {
        state.searchType === 'dataSouce' || state.searchType === 'columns' ?
          dataEntrySlot(items)
          :
          items
      }
    </a-form-item>
    const optionRender = () => props.showSearch || props.showReset ? <a-space>
      {
        props.showReset ?
          <a-button onClick={resetTableParams}>{props.resetText}</a-button>
          :
          null
      }
      {
        props.showSearch ?
          <a-button
            loading={props.loading}
            type="primary"
            onClick={() => searchTableParams(false)}
          >
            {props.searchText}
          </a-button>
          :
          null
      }
    </a-space> : null
    const advancedSlot = ({ formItemStyle, advanced, showAdvanced = true }) =>
      <div style={formItemStyle} class={styles.list_unfold}>
        <a-space size={16}>
          {optionRender()}
          {showAdvanced && (
            <a onClick={() => changeAdvanced(!advanced)}>
              {advanced ? '收起' : '展开'}
              {props.collapseRender ? props.collapseRender() : advanced ? <UpOutlined /> :
                <DownOutlined />}
            </a>
          )}
        </a-space>
      </div>
    const formRowSlot = () => {
      const { advanced, formList } = state
      const show: any = []
      const rowWidth = {
        width: `${(100 - (rowLength.value - 1) * 2) / rowLength.value}%`
      }
      for (let i = 0; i < formList.length; i += 1) {
        const formItemStyle = getStyleWidth(i, rowLength.value, rowWidth)
        if ((formList.length < rowLength.value) || advanced) {
          show.push(
            formItemSlot({
              formItemStyle,
              items: formList[i]
            })
          )
          if ((i === formList.length - 1) && advanced) show.push(
            advancedSlot({
              formItemStyle: {
                flex: 1,
                justifyContent: 'flex-end'
              },
              advanced
            })
          )
        } else {
          if (i < rowLength.value - 1) {
            show.push(
              formItemSlot({
                formItemStyle,
                items: formList[i]
              })
            )
          }
          if (i === rowLength.value - 1 && rowLength.value - 1 === 0) {
            show.push(
              formItemSlot({
                formItemStyle,
                items: formList[i]
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
                advanced: false
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
          {/*{*/}
          {/*  state.advanced && ((state.formList.length) % rowLength.value === 0) ?*/}
          {/*    <div class={styles.list_shrink}>*/}
          {/*      <span>{rowLength.value}</span>*/}
          {/*      <span>{state.formList.length}</span>*/}
          {/*      <a-space size={16}>*/}
          {/*        {optionRender()}*/}
          {/*        <a onClick={() => changeAdvanced(false)}>*/}
          {/*          收起 {props.collapseRender ? props.collapseRender() : <UpOutlined />}*/}
          {/*        </a>*/}
          {/*      </a-space>*/}
          {/*    </div>*/}
          {/*    :*/}
          {/*    null*/}
          {/*}*/}
        </a-form>
      </div>
    )
  }
})
export default TableSearch
