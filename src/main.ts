import { createApp } from 'vue'
import App from './App.vue'
import router from '/@/router'
import store from './store'
import components from './core'
import '/@/design'
import 'animate.css/source/animate.css'
import './global.less'


if (import.meta.env.DEV) {
  import('ant-design-vue/dist/antd.less')
}

createApp(App).use(store).use(router).use(components).mount('#app')

