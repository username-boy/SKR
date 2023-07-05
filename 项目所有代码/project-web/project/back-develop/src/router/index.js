import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },


  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/views/home/index"),
        meta: { title: "首页",icon:'home' }
      }
    ]
  },

  {
    path: '/product',
    component: Layout,
    name: '商品',
    // component: () => import('@/views/product/index'),
    meta: { title: '商品', icon: 'product' },
    children:
      [
        {
          path: 'addProduct',
          name: 'addProduct',
          component: () => import('@/views/product/add.vue'),
          meta: {
            title: '添加商品',
            icon: 'product-add'
          }
        },
        {
          path: "productList",
          name: "productList",
          component: () => import("../views/product/index.vue"),
          meta: { title: "商品列表", icon: 'product-list' }
        },
        {
          path: "productCate",
          name: "productCate",
          component: () => import("../views/project/productCate/index.vue"),
          meta: { title: "商品分类", icon: 'product' }
        },
        {
          path: 'productSecondMenu',
          name: 'productSecondMenu',
          component: () => import('../views/project/productCate/secondMenu.vue')
        },
        {
          path: 'brand',
          name: 'brand',
          component: () => import('@/views/pms/brand/index'),
          meta: { title: '品牌管理', icon: 'product-brand' }
        },
        {
          path: 'updateBrand',
          name: 'updateBrand',
          component: () => import('@/views/pms/brand/updata'),
          meta: { title: '编辑品牌' },
          hidden: true
        },
        {
          path: 'addBrand',
          name: 'addBrand',
          component: () => import('@/views/pms/brand/add'),
          meta: { title: '添加品牌' },
          hidden: true
        },
        {path:'/product',redirect:'/product/productList'}
      ]
  },
  {
    path: "/market",
    component: Layout,
    name: "营销",
    redirect: '/market/marketCoupon',
    meta: { title: "营销", icon: 'sms' },
    children: [
      {
        path: "marketCoupon",
        name: "marketCoupon",
        component: () => import("../../src/views/market/marketCoupon/index"),
        meta: { title: "优惠券列表", icon: 'sms-coupon' }
      },
      {
        path: 'couponDetail',
        name: 'couponDetail',
        component: () => import("../../src/views/market/marketCoupon/detail.vue"),
      },
      {
        path: "editCoupon",
        name: "editCoupon",
        component: () => import('../../src/views/market/marketCoupon/edit.vue')
      },
      {
        path: 'addCoupon',
        name: 'addCoupon',
        component: () => import('../../src/views/market/marketCoupon/add.vue')
      },
      {
        path: "market",
        name: '秒杀活动列表',
        component: () => import('@/views/market/active/index.vue'),
        meta: { title: "秒杀活动列表", icon: 'sms-flash' }
      },
    ]
  },


 
  {
    path: '/oms',
    component: Layout,
    redirect: '/oms/order',
    name: 'oms',
    meta: { title: '订单', icon: 'order' },
    children: [
      {
        path: 'order',
        name: 'order',
        component: () => import('@/views/oms/order/index'),
        meta: { title: '订单列表', icon: 'product-list' }
      },
      {
        path: 'orderDetail/:order_id/:status',
        name: 'orderDetail',
        component: () => import('@/views/oms/order/orderDetail'),
        meta: { title: '订单详情' },
        props: true,
        hidden: true
      },
      {
        path: 'deliverOrderList/:order_id',
        name: 'deliverOrderList',
        component: () => import('@/views/oms/order/deliverOrderList'),
        meta: { title: '发货列表' },
        hidden: true,
        props: true
      },
      {
        path: 'returnApply',
        name: 'returnApply',
        component: () => import('@/views/oms/apply/index'),
        meta: { title: '退货申请处理', icon: 'order-return' }
      },
      {
        path: 'returnApplyDetail/:id/:order_id',
        name: 'returnApplyDetail',
        component: () => import('@/views/oms/apply/applyDetail'),
        meta: { title: '退货原因详情' },
        hidden: true,
        props: true
      }
    ]
  },
  {
    path:"/customary",
    name:"customary",
    redirect:"/customary/default",
    component:()=>import("@/views/customary/index.vue"),
    meta:{title:"客服",icon:"customary"},
    children:[
      {
        path:"default",
        name:"chatDefault",
        component:()=>import("@/views/customary/default.vue"),
        hidden:true
      },
      {
        path:"chatRoom/:id",
        name:"chatRoom",
        component:()=>import("@/views/customary/chatRoom.vue"),
        hidden:true,
        props:true
      }
    ]
  },
  {
    path: '/infoModify',
    component: Layout,
    redirect: '/infoModify',
    children: [{
      path: 'infoModify',
      name: 'infoModify',
      component: () => import('@/views/infoModify/index'),
      meta: { title: '店铺信息',icon:"store-msg" }
    }]
  },
  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
