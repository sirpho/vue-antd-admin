import { createApp } from 'vue'
import 'animate.css/source/animate.css'

import router from '/@/router'

import App from './App.vue'
import store from './store'
import components from './core'
import './global.less'

import '/@/design'

import('ant-design-vue/dist/antd.variable.min.css')

createApp(App).use(store).use(router).use(components).mount('#app')

