<div align="center"> <a href="https://gitee.com/gx12358/vite-admin-pro"> <img alt="VbenAdmin Logo" width="200" height="200" src="https://zbbf9-hw.ahtv.cn/ahtv-obs/20210811/d5b6f8d7-b759-243d-b8f3-906a6b8570bf.png"> </a> <br> <br>

<h1>GX Pro Admin（Ant Design Vue）</h1>
</div>

## 简介

GX Pro Admin 是一个免费开源的中后台模版。使用了最新的`vue3.0+`,`vite2`,`TypeScript`, `Ant Design Vue3.0+`等主流技术开发，开箱即用的中后台前端解决方案，也可用于学习参考。

- 后续会陆续更新相关业务性组件和修复bug等；
- ProComponents组件比较庞大，代码不会很快更新，不过可以通过预览演示地址查看；
- 更新文档会在下方展示每次更新的说明；

## - [ProComponents](https://procomponents.ant.design/components)

Ant Design 定义了基础的设计规范，对应也提供了大量的基础组件。但是对于中后台类应用，我们希望提供更高程度的抽象，提供更上层的设计规范，并且对应提供相应的组件使得开发者可以快速搭建出高质量的页面。

在 ProComponents 中我们内置了一系列的设计规范，预设了常用的逻辑。在这个基础上我们同样提供了灵活的支持，比如对于 ProTable 来说你也可以把它完全当做 Ant Design 的 Table 来用，对于 ProForm 来说你也可以直接使用 Ant Design 的基础组件或者你的自定义组件。我们希望通过 Pro 系列组件提供快速高效大家高质量中后台应用的能力，进一步扩展 Ant Design 的能力，欢迎使用并提出宝贵的意见。

- ProLayout - 高级布局
- ProCard 高级卡片
- WaterMark 水印组件
- ProForm 高级表单（已完成60%，待开发中）
- ProTable - 高级表格
- ProSkeleton - 骨屏架
- ProField - 原子组件
- GUpload - 上传组件（自定义request、上传进度条回显等功能）
- GImage - 图片组件（lazy懒加载等功能）
- [更多组件待开发-参考React版本](https://procomponents.ant.design/components)

## 预览

- [🚀 pro 版演示地址](http://121.36.16.172:9000/gx.pro.admin)

## 更新文档

-refactor: 重构GDesign-组件，将组件放到GDesign文件夹中；别名重新定义；部分__util方法转移到GDesign组件内部
-refactor: vuex换成pinia，并相应修改store使用方法
-perf：去除vue、vue-router的cdn链接，并动态配置useCdn
-perf：去除ant-design部分全局引入组件，改为组件内部引入
-feat：添加useProxy属性，控制是否使用proxy代理设置
-fix: 修复菜单权限为空时，跳转到403页面
-fix：切花当前展示多少页时，没有正确展示total

## 特性

- **最新技术栈**：使用 Vue3/vite2 等前端前沿技术开发
- **TypeScript**: 应用程序级 JavaScript 的语言
- **主题**：可配置的主题
- **Mock 数据** 内置 Mock 数据方案
- **权限** 内置完善的动态路由权限生成方案
- **组件** 二次封装了多个常用的组件

测试账号: admin/123456

## 准备

- [node](http://nodejs.org/) 和 [git](https://git-scm.com/) -项目开发环境
- [Vite](https://vitejs.dev/) - 熟悉 vite 特性
- [Vue3](https://v3.vuejs.org/) - 熟悉 Vue 基础语法
- [TypeScript](https://www.typescriptlang.org/) - 熟悉`TypeScript`基本语法
- [Es6+](http://es6.ruanyifeng.com/) - 熟悉 es6 基本语法
- [Vue-Router-Next](https://next.router.vuejs.org/) - 熟悉 vue-router 基本使用
- [Ant-Design-Vue](https://next.antdv.com/components/overview-cn/) - ui 基本使用
- [Mock.js](https://github.com/nuysoft/Mock) - mockjs 基本语法

## 安装使用

- 获取项目代码

```bash
git clone https://gitee.com/gx12358/vite-admin-pro
```

- 安装依赖

```bash
cd gx-admin-pro

yarn install

```

- 运行

```bash
yarn serve
```

- 打包

```bash
yarn build
```

## Git 贡献提交规范

- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` 增加新功能
  - `fix` 修复问题/BUG
  - `style` 代码风格相关无影响运行结果的
  - `perf` 优化/性能提升
  - `refactor` 重构
  - `revert` 撤销修改
  - `test` 测试相关
  - `docs` 文档/注释
  - `chore` 依赖更新/脚手架配置修改等
  - `workflow` 工作流改进
  - `ci` 持续集成
  - `types` 类型定义文件更改
  - `wip` 开发中

## 浏览器支持

本地开发推荐使用`Chrome 80+` 浏览器

支持现代浏览器, 不支持 IE

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :-: | :-: | :-: | :-: | :-: |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 相关仓库

如果这些插件对你有帮助，可以给一个 star 支持下

- [vite-plugin-mock](https://github.com/anncwb/vite-plugin-mock) - 用于本地及开发环境数据 mock
- [vite-plugin-html](https://github.com/anncwb/vite-plugin-html) - 用于 html 模版转换及压缩
- [vite-plugin-style-import](https://github.com/anncwb/vite-plugin-style-import) - 用于组件库样式按需引入
- [vite-plugin-theme](https://github.com/anncwb/vite-plugin-theme) - 用于在线切换主题色等颜色相关配置
- [vite-plugin-imagemin](https://github.com/anncwb/vite-plugin-imagemin) - 用于打包压缩图片资源
- [vite-plugin-compression](https://github.com/anncwb/vite-plugin-compression) - 用于打包输出.gz|.brotil 文件
- [vite-plugin-svg-icons](https://github.com/anncwb/vite-plugin-svg-icons) - 用于快速生成 svg 雪碧图

## 维护者

[@gx12358](https://gitee.com/gx12358)

## 交流

`GX Pro Admin` 是完全开源免费的项目，在帮助开发者更方便地进行中大型管理系统开发，同时也提供 QQ 交流群使用问题欢迎在群内提问。

- QQ 群 `871430530`

## License

[MIT © gx12358-2021](./LICENSE)
