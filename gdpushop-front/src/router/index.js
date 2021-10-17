import Vue from 'vue'
import Router from 'vue-router'
import Index from "../views/index.vue";
import Home from "../views/home/index.vue";
import Allgoods from "../views/allgoods/index.vue";
import hello from "../views/hello.vue";
import Login from "../views/Login.vue";
import goods from "../views/goods/goods.vue";
import Register from '../views/Register.vue';
import Cart from '../views/goods/Cart.vue';
import Pay from '../views/goods/Pay.vue';
import PaySuccess from '../views/goods/PaySuccess.vue';
import UserBuy from '../views/user/UserBuy.vue';
import Types from '../views/goods/Types.vue';
import UserCenter from '../views/user/UserCenter.vue';
import goodsIndex from '../views/goodsFind/goodsIndex.vue';

Vue.use(Router)

export default new Router({
  routes: [
    //首页
    {
      path: "/",
      name: "Index",
      component: Index,
      children: [
        {
          path: "/",
          name: "Home",
          component: Home
        },
        {
          path: "/Allgoods",
          name: "Allgoods",
          component: Allgoods
        }
      ]
    },

    //商品详情
    {
      path: "/goods/:goodsId",
      name: "goods",
      component: goods
    },

    //全部商品
    {
      path: "/goodsIndex",
      name: "goodsIndex",
      component: goodsIndex
    },

    //测试页面
    {
      path: "/hello",
      name: "hello",
      component: hello
    },

    //登录页面
    {
      path: "/login",
      name: "Login",
      component: Login
    },

    //注册页面
    {
      path: "/register",
      name: "Register",
      component: Register
    },

    //购物车页面
    {
      path: "/cart/:userId",
      name: "Cart",
      component: Cart
    },

    //支付页面
    {
      path: "/pay",
      name: "Pay",
      component: Pay
    },

    //支付页面
    {
      path: "/paysuccess",
      name: "PaySuccess",
      component: PaySuccess
    },

    //用户已完成订单页面
    {
      path: "/userbuy",
      name: "UserBuy",
      component: UserBuy
    },

    //商品分类页面
    {
      path: "/types/:typeValue",
      name: "Types",
      component: Types
    },

    //用户个人中心
    {
      path: "/usercenter",
      name: "UserCenter",
      component: UserCenter
    },


  ]
});
