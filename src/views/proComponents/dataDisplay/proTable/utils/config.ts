export default {
  requestCode: `<w-pro-table
  // params 是需要自带的参数
  // 这个参数优先级更高，会覆盖查询表单的参数
  :params={params}
  // getTableData为自定义函数
  :request={(params, sort, filter) => getTableData(params, sort, filter)}
/>`,
  searchDataCode: `[
  {
    name: 'name',
    valueType: 'text',
    placeholder: '请输入', // 表单项placeholder
    allowClear: true,
    defaultValue: ''
  },
  {
    name: 'age',
    valueType: 'select', // 映射不同的表单项（select）
    placeholder: '请选择',
    valueEnum: [
      {
        text: '全部', value: 'Default'
      },
      {
        text: '好', value: 'hao'
      }
    ],
    showSearch: true,
    allowClear: true,
    defaultValue: undefined
  },
  {
    name: 'date',
    valueType: 'date', // 映射不同的表单项（DatePicker）
    placeholder: '请选择',
    format: 'YYYY-MM-DD HH:mm:ss',
    defaultValue: '2021-07-19 18:21:21',
    allowClear: true,
    showTime: true,
    showToday: true
  },
  {
    name: 'dateMonth',
    valueType: 'dateMonth', // 映射不同的表单项（MonthPicker）
    placeholder: '请选择',
    allowClear: true,
    defaultValue: '2021-07'
  },
  {
    name: 'dateRange',
    rangeStartName: 'start',
    rangeEndName: 'end',
    valueType: 'dateRange', // 映射不同的表单项（RangePicker）
    placeholder: '请选择',
    allowClear: true,
    defaultValue: '2021-07',
    format: 'YYYY-MM-DD HH:mm:ss',
    showTime: true,
  },
  {
    name: 'time',
    valueType: 'time', // 映射不同的表单项（TimePicker）
    placeholder: '请选择',
    allowClear: true,
    defaultValue: '15:21:12',
    format: 'YYYY-MM-DD HH:mm:ss',
    use12Hours: true
  }
]`,
  searchSlotsCode: `<template #search>
  <w-input-search
    v-model:searchValue="tableParameters.title"
    :actionRef="info => inputSearchRef = info"
    allow-clear
    placeholder="请输入标题"
    style="width: 100%"
  >
    <template #enterButton>
      <a-button>
        <SearchOutlined />
      </a-button>
    </template>
  </w-input-search>
  <a-select
    v-model:value="tableParameters.source"
    placeholder="请选择来源"
    allow-clear
    style="width: 100%"
  >
    <a-select-option value="平台生产">
      平台生产
    </a-select-option>
    <a-select-option value="中央厨房">
      中央厨房
    </a-select-option>
    <a-select-option value="海豚云">
      海豚云
    </a-select-option>
    <a-select-option value="文稿爬取">
      文稿爬取
    </a-select-option>
  </a-select>
</template>`,
  searchColumnsCode: `[
  {
    dataIndex: 'name',
    ellipsis: true,
    key: 'name',
    width: 150,
    searchConfig: {
      name: 'name',
      valueType: 'text',
      placeholder: '请输入'
    },
    slots: { title: 'FullName', customRender: 'name' }
  },
  { title: 'Age', dataIndex: 'age', key: 'age', width: 150 },
  { title: 'Column 1', dataIndex: 'address', key: '1', width: 150 },
  { title: 'Column 2', dataIndex: 'address', key: '2' },
  { title: 'Column 3', dataIndex: 'address', key: '3' },
  { title: 'Column 4', dataIndex: 'address', key: '4' },
  { title: 'Column 5', dataIndex: 'address', key: '5' },
  { title: 'Column 6', dataIndex: 'address', key: '6', width: 150 },
  {
    title: 'Action',
    ellipsis: true,
    width: 150,
    copyable: true,
    key: 'operation',
    slots: { customRender: 'action' }
  }
]`,
  searchData: [
    {
      name: 'name',
      valueType: 'text',
      placeholder: '请输入'
    },
    {
      name: 'age',
      valueType: 'select',
      placeholder: '请选择',
      valueEnum: [
        {
          text: '全部', value: 'Default'
        },
        {
          text: '好', value: 'hao'
        }
      ]
    },
    {
      name: 'date',
      valueType: 'date',
      placeholder: '请选择',
      format: 'YYYY-MM-DD HH:mm:ss',
      defaultValue: '2021-07-19 18:21:21'
    },
    {
      name: 'dateMonth',
      valueType: 'dateMonth',
      placeholder: '请选择'
    },
    {
      name: 'dateRange',
      rangeStartName: 'start',
      rangeEndName: 'end',
      valueType: 'dateRange',
      placeholder: '请选择'
    },
    {
      name: 'time',
      valueType: 'time',
      placeholder: '请选择'
    }
  ],
  proTableData: [
    {
      attributes: 'request',
      description: '获取 dataSource 的方法',
      typesof: '(params?: {pageSize,current},sort,filter) => {data,success,total}',
      defaults: ''
    },
    {
      attributes: 'params',
      description: '用于 request 查询的额外参数，一旦变化会触发重新加载',
      typesof: 'object',
      defaults: ''
    },
    {
      attributes: 'search',
      description: '是否显示搜索表单，传入对象时为搜索表单的配置',
      typesof: 'false | SearchConfig',
      defaults: ''
    },
    {
      attributes: 'actionRef',
      description: 'Table action 的引用，便于自定义触发',
      typesof: '(reload, reloadAndRest) => {reload,reloadAndRest}',
      defaults: ''
    },
    {
      attributes: 'toolBarBtn',
      description: '渲染 Pro Table 操作按钮组（数组jsx形式）',
      typesof: '(reload, reloadAndRest) => {reload,reloadAndRest}',
      defaults: '[]'
    },
    {
      attributes: 'tableClassName',
      description: '封装的 Pro Table 的 className',
      typesof: 'string',
      defaults: ''
    },
    {
      attributes: 'tableStyle',
      description: '封装的 Pro Table 的 style',
      typesof: 'object',
      defaults: '{}'
    },
    {
      attributes: 'options',
      description: 'Pro Table 工具栏，设为 false 时不显示',
      typesof: '{{ fullScreen: boolean | function, reload: boolean | function,setting: true, density?: boolean }}',
      defaults: '{ fullScreen: false, reload:true, setting: true, density: true}'
    },
    {
      attributes: 'showIndex',
      description: '是否展示序号Index',
      typesof: 'boolean',
      defaults: 'true'
    },
    {
      attributes: 'headerTitle',
      description: 'Pro Table 的 Title',
      typesof: 'function | string',
      defaults: ''
    },
    {
      attributes: 'align',
      description: '设置Pro Table 的 align（以columns中align属性为主）',
      typesof: 'string',
      defaults: 'left'
    },
    {
      attributes: 'titleTip',
      description: 'Pro Table 的 tooltip',
      typesof: 'function | string',
      defaults: ''
    },
    {
      attributes: 'titleTipText',
      description: 'Pro Table 的 tooltip 提示文字',
      typesof: 'string',
      defaults: '这是一个标题提示'
    },
    {
      attributes: 'showPagination',
      description: '是否展示Pro Table 的分页',
      typesof: 'Boolean',
      defaults: 'true'
    },
    {
      attributes: 'pageConfig',
      description: 'Pro Table 的分页',
      typesof: 'Boolean',
      defaults: 'true'
    },
    {
      attributes: 'draggabled',
      description: 'Pro Table 是否可拖拽（对应colums：width必填）',
      typesof: 'Boolean',
      defaults: ''
    },
    {
      attributes: 'neverScroll',
      description: 'Pro Table 横向或者纵向都不滚动',
      typesof: 'Boolean',
      defaults: ''
    },
    {
      attributes: 'automaticScroll',
      description: 'Pro Table 不自适应横向滚动，自适应纵向滚动',
      typesof: 'Boolean',
      defaults: ''
    }
  ],
  searchTableData: [
    {
      attributes: 'type',
      description: 'Pro Table 搜索表单展现形式',
      typesof: 'string(dataSouce/slots/columns)',
      defaults: ''
    },
    {
      attributes: 'data',
      description: 'type为dataSouce或者columns是，必传',
      typesof: 'Array',
      defaults: ''
    },
    {
      attributes: 'showReset',
      description: '是否展示重置按钮',
      typesof: 'boolean',
      defaults: 'false'
    },
    {
      attributes: 'showSearch',
      description: '是否展示查询按钮',
      typesof: 'boolean',
      defaults: 'false'
    },
    {
      attributes: 'searchText',
      description: '查询按钮的文本',
      typesof: 'string',
      defaults: '查询'
    },
    {
      attributes: 'resetText',
      description: '重置按钮的文本',
      typesof: 'string',
      defaults: '重置'
    },
    {
      attributes: 'defaultCollapsed',
      description: '默认是否收起',
      typesof: 'boolean',
      defaults: 'true'
    },
    {
      attributes: 'collapseRender',
      description: '收起按钮的 render',
      typesof: 'function',
      defaults: ''
    }
  ],
  searchCommonData: [
    {
      attributes: 'name',
      description: '表格查询参数名',
      typesof: 'string',
      defaults: ''
    },
    {
      attributes: 'valueType',
      description: '映射不同的表单项',
      typesof: 'string（text|select|date|dateMonth|dateRange|time）',
      defaults: ''
    },
    {
      attributes: 'placeholder',
      description: '表单项placeholder',
      typesof: 'string',
      defaults: 'text-请输入|请选择'
    },
    {
      attributes: 'allowClear',
      description: '表单项是否展示清楚按钮',
      typesof: 'boolean',
      defaults: 'true'
    },
    {
      attributes: 'defaultValue',
      description: '表单项默认值',
      typesof: 'any',
      defaults: ''
    },
    {
      attributes: 'valueEnum-select',
      description: '值的枚举，会自动转化把值当成 key 来取出要显示的内容',
      typesof: 'Array',
      defaults: '[]'
    },
    {
      attributes: 'showSearch-select',
      description: '表单项是否可搜索',
      typesof: 'boolean',
      defaults: ''
    },
    {
      attributes: 'format-date|dateMonth|dateRange|time',
      description: '表单项值默认展示格式',
      typesof: 'string',
      defaults: ''
    },
    {
      attributes: 'renderExtraFooter-date|dateMonth|dateRange|time',
      description: '表单项是否在面板中添加额外的页脚',
      typesof: 'function',
      defaults: ''
    },
    {
      attributes: 'showTime-date|dateRange',
      description: '表单项是否增加时间选择功能',
      typesof: 'object|boolean',
      defaults: 'Ant TimePicker Options'
    },
    {
      attributes: 'showToday-date',
      description: '表单项是否展示“今天”按钮',
      typesof: 'boolean',
      defaults: ''
    },
    {
      attributes: 'rangeStartName-dateRange',
      description: '表格查询开始时间参数名',
      typesof: 'string',
      defaults: 'start'
    },
    {
      attributes: 'rangeEndName-dateRange',
      description: '表格查询结束时间参数名',
      typesof: 'string',
      defaults: 'end'
    },
    {
      attributes: 'use12Hours-time',
      description: '使用 12 小时制，为 true 时 format 默认为 h:mm:ss a',
      typesof: 'boolean',
      defaults: ''
    }
  ],
  columnsTableData: [
    {
      attributes: 'searchConfig',
      description: '是否展示表单项',
      typesof: 'object（表单data通用配置）',
      defaults: ''
    },
    {
      attributes: 'ellipsis',
      description: '是否自动缩略（为true时展示tooltip）',
      typesof: 'boolean',
      defaults: ''
    },
    {
      attributes: 'copyable',
      description: '是否支持复制',
      typesof: 'boolean',
      defaults: ''
    }
  ]
}
