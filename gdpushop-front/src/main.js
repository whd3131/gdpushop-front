// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from "axios";
Vue.prototype.$axios = Axios;

// 按需引入ElementUI
// import { Button, carousel ,carouselItem,Table,TableColumn} from "element-ui";

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//生产提示
Vue.config.productionTip = false

Vue.use(ElementUI);

// 按需引入ElementUI
// Vue.use(Button);
// Vue.use(carousel);
// Vue.use(carouselItem);
// Vue.use(Table);
// Vue.use(TableColumn);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  beforeCreate() {
    Vue.prototype.$bus = this //全局事件总线
  }
})



