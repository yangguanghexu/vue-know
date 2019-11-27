import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        meta: {
            // 是否缓存
            keepAlive: true,
            // 底部导航
            keepCache: true,
            // 返回页面不刷新
            isBack: false
        },
        component: Home
    },
    {
        path: '/about',
        name: 'about',
        meta: {
            keepAlive: true,
            keepCache: true
        },
        component: () =>
            import ('../views/About.vue')
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            keepAlive: true,
            keepCache: true
        },
        component: () =>
            import ('../views/login.vue')
    },
    {
        path: '/article',
        name: 'article',
        meta: {
            // 是否缓存
            keepAlive: true,
            // 底部导航
            keepCache: false,
            // 返回页面不刷新
            isBack: false
        },
        component: () =>
            import ('../views/articleDetails.vue'),
    },
    {
        path: '/article/comment',
        name: 'comment',
        meta: {
            // 是否缓存
            keepAlive: false,
            // 底部导航
            keepCache: false
        },
        component: () =>
            import ('../views/comment.vue'),
    },
    {
        path: '/history',
        name: 'history',
        meta: {
            keepAlive: true,
            keepCache: true
        },
        component: () =>
            import ('../views/history.vue')
    },
    {
        path: '/column',
        name: 'column',
        meta: {
            keepAlive: true,
            keepCache: true,

        },
        component: () =>
            import ('../views/column.vue')
    },
    {
        path: '/column/list',
        name: 'columnList',
        meta: {
            // 是否缓存
            keepAlive: true,
            // 底部导航
            keepCache: false,
            // 返回页面不刷新
            isBack: false
        },
        component: () =>
            import ('../views/columnList.vue'),
    },
    {
        path: '/user',
        name: 'user',
        meta: {
            // 是否缓存
            keepAlive: true,
            // 底部导航
            keepCache: true
        },
        component: () =>
            import ('../views/user.vue'),
    }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    let userinfo = localStorage.getItem('token');
    if (userinfo || to.name === 'login') {
        next();
    } else {
        next({
            name: 'login',
            query: {
                redirect: to.path
            }
        })
    }
})
export default router