import Vue from "vue";
import VueRouter from "vue-router";
import Landing from "../views/landing/Landing.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "landing",
        component: Landing,
        children: [
            {
                path: '',
                name: 'landing.home',
                component: () => import( /* webpackChunkName: "landing/home" */ '../views/landing/Home.vue'),
            },
            {
                path: 'download',
                name: 'landing.download',
                component: () => import( /* webpackChunkName: "landing/download" */ '../views/landing/Download.vue'),
                meta: {
                    title: '仪表盘',
                    require: 'user'
                }
            }
        ],
    },
    {
        path: "/404",
        name: "404",
        component: () => import(/* webpackChunkName: "404" */ "../views/common/404.vue"),
    },
    {
        path: "/*",
        redirect: "/404",
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
