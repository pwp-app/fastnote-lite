import Vue from 'vue'
import App from './App.vue'
import router from './router'
import aniamted from 'animate.css';
import './styles/main.less'
import './plugins/element.js'

Vue.config.productionTip = false

Vue.use(animated);

  router,
new Vue({
  render: h => h(App)
}).$mount('#app')
