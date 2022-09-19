//导入所有图标库
import * as Icons from "@ant-design/icons-vue";

const antDesignIcons = (app) => {
  // 全局使用图标
  const icons = Icons;
  for (const i in icons) {
    app.component(i, icons[i]);
  }
}
export default  antDesignIcons
