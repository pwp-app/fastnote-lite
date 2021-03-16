import Vue from 'vue';
import VueRouter from 'vue-router';
import Landing from '../views/landing/Landing.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Landing,
    children: [
      {
        path: '',
        name: 'landing.home',
        component: () => import(/* webpackChunkName: "landing" */ '../views/landing/Home.vue'),
      },
      {
        path: 'download',
        name: 'landing.download',
        component: () => import(/* webpackChunkName: "landing" */ '../views/landing/Download.vue'),
      },
      {
        path: 'portal',
        name: 'landing.portal',
        component: () => import(/* webpackChunkName: "portal" */ '../views/landing/Portal.vue'),
      },
      {
        path: 'unavailable',
        name: 'landing.unavailable',
        component: () => import(/* webpackChunkName: "landing.error" */ '../views/landing/Unavailable.vue'),
      },
      {
        path: '404',
        name: '404',
        component: () => import(/* webpackChunkName: "landing.error" */ '../views/common/404.vue'),
      },
    ],
  },
  {
    path: '/app',
    name: 'app',
    component: () => import(/* webpackChunkName: "lite" */ '../views/app/App.vue'),
  },
  {
    path: '/mobile/landing',
    name: 'mobile.landing',
    component: () => import(/* webpackChunkName: "mobile.landing" */ '../views/mobile/Landing.vue'),
  },
  {
    path: '/mobile/portal',
    name: 'mobile.portal',
    component: () => import(/* webpackChunkName: "mobile.portal" */ '../views/mobile/Portal.vue'),
  },
  {
    path: '*',
    redirect: '/404',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
