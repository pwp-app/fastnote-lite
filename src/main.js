import Vue from 'vue'
import App from './App.vue'
import router from './router'
import animated from 'animate.css';
import VueAxios from 'vue-axios';
import axios from 'axios';
import store from './store/index';
import './styles/main.less'
import './plugins/element.js'

Vue.config.productionTip = false

axios.defaults.baseURL = ''
axios.defaults.timeout = 5000

Vue.use(VueAxios, axios);
Vue.use(animated);

Vue.prototype.API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:7001' : 'https://api.note.pwp.app';

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
