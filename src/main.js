import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import axios from 'axios'
import 'vant/lib/index.css';
Vue.use(Vant);
Vue.prototype.$axios = axios;
// Vue.prototype.baseURL = 'http://39.106.218.219'
// Vue.prototype.userURL = 'http://39.106.218.219:8888'
Vue.prototype.baseURL = 'http://127.0.0.1:8888'
Vue.prototype.userURL = 'http://127.0.0.1:3000'
axios.defaults.withCredentials = true;

axios.interceptors.request.use((request) => {
    //给所有请求添加自定义header
    let token = localStorage.getItem('token')
    request.headers.common["authorization"] = 'Bearer ' + token;
    return request
})

axios.interceptors.response.use(
    response => {
        // 在接收响应做些什么，例如跳转到登录页
        window.console.log(response)
        return response;
    },
    error => {
        if (error.response.status == '401') {
            localStorage.removeItem("token");
            router.replace({
                path: 'login'
            })
        }
        return error;
    }
);
Vue.config.productionTip = false
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')