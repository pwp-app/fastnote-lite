import Vue from 'vue'
import Vuex from 'vuex'

// import modules
import client from './modules/client';

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        client,
    }
})