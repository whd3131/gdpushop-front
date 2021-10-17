import Layout from '../layout'

/**
 * hidden: true                  如果设置为 true，该项菜单将不会显示在菜单栏中(默认为 false)
 * meta : {
    title: 'title'               菜单名
    icon: 'icon-name'            图标名
    fixed: true                  如果设置为 true，该项 tag 将一直存在 tag 栏中(默认为 false)
  }
 * */

export const asyncRoutes = [
  {
    path: '/user',
    name: 'User',
    component: Layout,
    redirect: '/user/list',
    meta: {
      title: '用户列表',
      icon: 'vue-dsn-icon-biaoge'
    },
    children: [
      {
        path: 'list',
        name: 'User',
        component: () => import('../views/user/User'),
        meta: {
          title: '用户列表'
        }
      },

    ]
  },

  {
    path: '/goods',
    name: 'Goods',
    component: Layout,
    redirect: '/goods/list',
    meta: {
      title: '商品',
      icon: 'vue-dsn-icon-biaoge'
    },
    children: [
      {
        path: 'list',
        name: 'Goods',
        component: () => import('../views/goods/Goods'),
        meta: {
          title: '商品列表'
        }
      },

    ]
  },

  {
    path: '/category',
    name: 'Category',
    component: Layout,
    redirect: '/category/index',
    meta: {
      title: '分类',
      icon: 'vue-dsn-icon-biaoge'
    },
    children: [
      {
        path: 'index',
        name: 'Category',
        component: () => import('../views/category/Category'),
        meta: {
          title: '商品分类管理'
        }
      },

    ]
  },

  {
    path: '/order',
    name: 'Order',
    component: Layout,
    redirect: '/order/index',
    meta: {
      title: '订单',
      icon: 'vue-dsn-icon-biaoge'
    },
    children: [
      {
        path: 'index',
        name: 'Order',
        component: () => import('../views/order/Order'),
        meta: {
          title: '订单列表'
        }
      },

    ]
  },

  {
    path: '/comment',
    name: 'Comment',
    component: Layout,
    redirect: '/order/index',
    meta: {
      title: '评论',
      icon: 'vue-dsn-icon-biaoge'
    },
    children: [
      {
        path: 'index',
        name: 'Comment',
        component: () => import('../views/comment/Comment'),
        meta: {
          title: '评论列表'
        }
      },

    ]
  },

  //商家管理
  {
    path: '/business',
    name: 'Business',
    component: Layout,
    redirect: '/business/list',
    meta: {
      title: '商家',
      icon: 'vue-dsn-icon-biaoge'
    },
    children: [
      {
        path: 'list',
        name: 'Business',
        component: () => import('../views/business/Business'),
        meta: {
          title: '商家列表'
        }
      },
      {
        path: 'businessGoods',
        name: 'BusinessGoods',
        component: () => import('../views/business/BusinessGoods'),
        meta: {
          title: '商家与商品'
        }
      },

    ]
  }

]
