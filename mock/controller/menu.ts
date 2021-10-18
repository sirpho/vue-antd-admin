import { MockMethod } from 'vite-plugin-mock'

const data = [
  // 一级菜单
  {
    checked: false,
    component: 'PageView',
    children: [],
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    icon: 'wd-zujian',
    iconType: 'custom',
    menuId: 1,
    menuKey: 'proComponents',
    menuName: 'Pro组件',
    menuType: 'M',
    orderNum: '1',
    params: {},
    parentId: 0,
    perms: '',
    systemCategory: 'proComponents',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    component: 'PageView',
    children: [],
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    icon: 'wd-iconset0335',
    iconType: 'custom',
    menuId: 15,
    menuKey: 'proPage',
    menuName: 'Pro页面',
    menuType: 'M',
    orderNum: '1',
    params: {},
    parentId: 0,
    perms: '',
    systemCategory: 'proComponents',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    component: 'PageView',
    children: [],
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    icon: 'wd-gerenziliao',
    iconType: 'custom',
    menuId: 2,
    menuKey: 'account',
    menuName: '个人页',
    menuType: 'M',
    orderNum: '2',
    params: {},
    parentId: 0,
    perms: '',
    systemCategory: 'account',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    component: 'PageView',
    children: [],
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    icon: 'wd-xitongpeizhi',
    iconType: 'custom',
    menuId: 10,
    menuKey: 'boss',
    menuName: '系统配置',
    menuType: 'M',
    orderNum: '3',
    params: {},
    parentId: 0,
    perms: '',
    systemCategory: 'boss',
    target: '',
    visible: '0'
  },
  // 二级菜单
  {
    checked: false,
    component: 'PageView',
    children: [],
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    icon: 'wd-layout',
    iconType: 'custom',
    menuId: 13,
    menuKey: 'layout',
    menuName: '布局',
    menuType: 'M',
    orderNum: '1',
    params: {},
    parentId: 1,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    component: 'PageView',
    children: [],
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    icon: 'wd-shuju',
    iconType: 'custom',
    menuId: 3,
    menuKey: 'dataDisplay',
    menuName: '数据展示',
    menuType: 'M',
    orderNum: '2',
    params: {},
    parentId: 1,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    component: 'PageView',
    children: [],
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    icon: 'wd-tongyonggongneng',
    iconType: 'custom',
    menuId: 4,
    menuKey: 'universal',
    menuName: '通用',
    menuType: 'M',
    orderNum: '3',
    params: {},
    parentId: 1,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    component: 'PageView',
    children: [],
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    icon: 'wd-biaodan',
    iconType: 'custom',
    menuId: 16,
    menuKey: 'form',
    menuName: '表单页',
    menuType: 'M',
    orderNum: '1',
    params: {},
    parentId: 15,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    component: 'PageView',
    children: [],
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    icon: 'wd-biaoge',
    iconType: 'custom',
    menuId: 20,
    menuKey: 'list',
    menuName: '列表页',
    menuType: 'M',
    orderNum: '2',
    params: {},
    parentId: 15,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    component: 'PageView',
    children: [],
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    icon: 'wd-xiangqing',
    iconType: 'custom',
    menuId: 25,
    menuKey: 'profile',
    menuName: '详情页',
    menuType: 'M',
    orderNum: '3',
    params: {},
    parentId: 15,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    component: 'PageView',
    children: [],
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    icon: 'wd-jieguoye',
    iconType: 'custom',
    menuId: 28,
    menuKey: 'result',
    menuName: '结果页',
    menuType: 'M',
    orderNum: '4',
    params: {},
    parentId: 15,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    component: 'PageView',
    children: [],
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    icon: 'wd-yichangguanli',
    iconType: 'custom',
    menuId: 31,
    menuKey: 'exception',
    menuName: '异常页',
    menuType: 'M',
    orderNum: '5',
    params: {},
    parentId: 15,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    component: 'PageView',
    children: [],
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    icon: 'wd-tuxingbianji',
    iconType: 'custom',
    menuId: 35,
    menuKey: 'editor',
    menuName: '图形编辑器',
    menuType: 'M',
    orderNum: '6',
    params: {},
    parentId: 15,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'account/center/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 5,
    menuKey: 'center',
    menuName: '个人中心',
    menuType: 'C',
    orderNum: '1',
    params: {},
    parentId: 2,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'account/settings/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 37,
    menuKey: 'settings',
    menuName: '个人设置',
    menuType: 'C',
    orderNum: '2',
    params: {},
    parentId: 2,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    component: 'PageView',
    children: [],
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    icon: 'wd-caidanguanli',
    iconType: 'custom',
    menuId: 11,
    menuKey: 'systemManage',
    menuName: '菜单管理',
    menuType: 'M',
    orderNum: '1',
    params: {},
    parentId: 10,
    perms: '',
    target: '',
    visible: '0'
  },
  // 三级菜单
  {
    checked: false,
    children: [],
    component: 'proComponents/dataDisplay/proTable/index',
    createTime: '2020-06-30 22:48:57',
    fixed: true,
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 6,
    menuKey: 'proTable',
    menuName: '高级表格',
    menuType: 'C',
    orderNum: '1',
    params: {},
    parentId: 3,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'proComponents/universal/iconSelector/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 7,
    menuKey: 'iconSelector',
    menuName: '图标选择',
    menuType: 'C',
    orderNum: '1',
    params: {},
    parentId: 4,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'proComponents/universal/proSkeleton/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 8,
    menuKey: 'proSkeleton',
    menuName: '骨架屏',
    menuType: 'C',
    orderNum: '2',
    params: {},
    parentId: 4,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'boss/systemManage/menuManage/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 12,
    menuKey: 'menuManage',
    menuName: '菜单管理',
    menuType: 'C',
    orderNum: '7',
    params: {},
    parentId: 11,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'proComponents/layout/waterMark/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 14,
    menuKey: 'waterMark',
    menuName: '水印组件',
    menuType: 'C',
    orderNum: '1',
    params: {},
    parentId: 13,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'proComponents/layout/card/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 38,
    menuKey: 'card',
    menuName: '高级卡片',
    menuType: 'C',
    orderNum: '2',
    params: {},
    parentId: 13,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'proPages/form/basicForm/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 17,
    menuKey: 'basicForm',
    menuName: '基础表单',
    menuType: 'C',
    orderNum: '1',
    params: {},
    parentId: 16,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'proPages/form/stepForm/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 18,
    menuKey: 'stepForm',
    menuName: '分布表单',
    menuType: 'C',
    orderNum: '2',
    params: {},
    parentId: 16,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'proPages/form/advancedForm/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 19,
    menuKey: 'advancedForm',
    menuName: '高级表单',
    menuType: 'C',
    orderNum: '2',
    params: {},
    parentId: 16,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'proPages/list/search/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 21,
    menuKey: 'searchList',
    menuName: '搜索列表',
    menuType: 'C',
    orderNum: '1',
    params: {},
    parentId: 20,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'proPages/list/tableList/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 22,
    menuKey: 'tableList',
    menuName: '查询表格',
    menuType: 'C',
    orderNum: '2',
    params: {},
    parentId: 20,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'proPages/list/basicList/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 23,
    menuKey: 'basicList',
    menuName: '标准列表',
    menuType: 'C',
    orderNum: '3',
    params: {},
    parentId: 20,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'proPages/list/cardList/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 24,
    menuKey: 'cardList',
    menuName: '卡片列表',
    menuType: 'C',
    orderNum: '4',
    params: {},
    parentId: 20,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'proPages/profile/basic/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 26,
    menuKey: 'profileBasic',
    menuName: '基础详情页',
    menuType: 'C',
    orderNum: '1',
    params: {},
    parentId: 25,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'proPages/profile/advanced/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 27,
    menuKey: 'advanced',
    menuName: '高级详情页',
    menuType: 'C',
    orderNum: '2',
    params: {},
    parentId: 25,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'proPages/result/success/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 29,
    menuKey: 'success',
    menuName: '成功页',
    menuType: 'C',
    orderNum: '1',
    params: {},
    parentId: 28,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'proPages/result/fail/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 30,
    menuKey: 'fail',
    menuName: '失败页',
    menuType: 'C',
    orderNum: '2',
    params: {},
    parentId: 28,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'proPages/exception/403/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 32,
    menuKey: '403',
    menuName: '403',
    menuType: 'C',
    orderNum: '1',
    params: {},
    parentId: 31,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'proPages/exception/404/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 33,
    menuKey: '404',
    menuName: '404',
    menuType: 'C',
    orderNum: '2',
    params: {},
    parentId: 31,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'proPages/exception/500/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 34,
    menuKey: '500',
    menuName: '500',
    menuType: 'C',
    orderNum: '3',
    params: {},
    parentId: 31,
    perms: '',
    target: '',
    visible: '0'
  },
  {
    checked: false,
    children: [],
    component: 'proPages/editor/flow/index',
    createTime: '2020-06-30 22:48:57',
    hiddenChildren: false,
    hiddenHeader: false,
    menuId: 36,
    menuKey: 'flow',
    menuName: '流程编辑器',
    menuType: 'C',
    orderNum: '3',
    params: {},
    parentId: 35,
    perms: '',
    target: '',
    visible: '0'
  }
]

export default [
  {
    url: '/mock-server/menu/navigate',
    method: 'post',
    response: () => {
      return {
        code: 200,
        msg: 'success',
        data
      }
    }
  }
] as MockMethod[]
