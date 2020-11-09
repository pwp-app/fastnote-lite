import Vue from 'vue'
import App from './App.vue'
import router from './router'
import animated from 'animate.css';
import VueAxios from 'vue-axios';
import axios from 'axios';
import moment from 'moment';
import InfiniteLoading from 'vue-infinite-loading';
import store from './store/index';
import './styles/main.less'
import './plugins/element.js'

Vue.config.productionTip = false

axios.defaults.baseURL = ''
axios.defaults.timeout = 5000

Vue.use(VueAxios, axios);
Vue.use(animated);

Vue.use(InfiniteLoading, {
  slots: {
    noResults: '没有便签',
    noMore: '没有更多便签了',
  },
});

// 设置API_BASE
const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:7001' : 'https://api.note.pwp.app';
Vue.prototype.API_BASE = API_BASE;

// 获取鉴权信息
const authStr = window.localStorage.getItem('cloud-auth');
const authData = {
  authToken: null,
  refreshToken: null,
};
if (authStr) {
  const stored = JSON.parse(authStr);
  const { authToken, refreshToken, fetchTime } = stored;
  if (moment(fetchTime, 'YYYYMMDDHHmmss').add(30, 'minute').valueOf() > moment().valueOf()) {
    authData.authToken = authToken;
  }
  if (moment(fetchTime, 'YYYYMMDDHHmmss').add(14, 'days').valueOf() > moment().valueOf()) {
    authData.refreshToken = refreshToken;
  }
}

const refreshToken = async () => {
  if (!authData.refreshToken) {
    return false;
  }
  // 刷新token
  let res;
  try {
    res = await axios.get(`${API_BASE}/user/refreshToken`, {
      params: {
        token: authData.refreshToken,
      },
    });
  } catch (err) {
    console.error('Refresh token request error: ', err);
    return false;
  }
  if (!res || !res.data) {
    return false;
  }
  const { success, data } = res.data;
  if (!success || !data) {
    return false;
  }
  const { authToken, refreshToken } = data;
  authData.fetchTime = moment().format('YYYYMMDDHHmmss');
  authData.authToken = authToken;
  authData.refreshToken = refreshToken;
  window.localStorage.setItem('cloud-auth', JSON.stringify(authData));
  // 定时刷新token任务
  if (!window.tokenCron) {
    window.tokenCron = setInterval(() => {
      refreshToken();
    }, 1 * 3600 * 1000);
    window.addEventListener('unload', () => {
      clearInterval(window.tokenCron);
    });
  }
  return true;
};

Vue.prototype.$auth = authData;
Vue.prototype.$refreshToken = refreshToken;

Vue.prototype.$pingCloud = async () => {
  let ret = true;
  try {
    const res = await axios.get(`${API_BASE}/common/ping`);
    if (res.status !== 200 || !res.data || !res.data.success) {
      ret = false;
    }
  } catch (err) {
    ret = false;
  }
  return ret;
};

Vue.prototype.$pingCloudAuth = async () => {
  let ret = true;
  try {
    const res = await axios.get(`${API_BASE}/common/ping/auth`, {
      headers: {
        'Authorization': `Bearer ${authData.authToken}`,
      },
    });
    if (res.status !== 200 || !res.data || !res.data.success) {
      ret = false;
    }
  } catch (err) {
    ret = false;
  }
  return ret;
};

// event bus
Vue.prototype.$bus = new Vue();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
