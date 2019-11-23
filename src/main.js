import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import axios from 'axios'
import 'vant/lib/index.css';
Vue.use(Vant);
Vue.prototype.$axios = axios;
axios.defaults.withCredentials = true;

axios.interceptors.request.use((request) => {
    //给所有请求添加自定义header
    let token = localStorage.getItem('token')
    request.headers.common["authorization"] = 'Bearer ' + token;
    return request
})
Vue.config.productionTip = false
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')