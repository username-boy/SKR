import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import persistedState from "vuex-persistedstate"

const context = require.context('./modules', true, /\.js$/);
let modules = context.keys().reduce((prev, filename, index) => {
  let key = filename.replace(/(\.js|\.\/)/g, "");
  prev[key] = context(filename).default;
  return prev
}, {})
Vue.use(Vuex)
const store = new Vuex.Store({
  modules,
  getters,
  plugins: [persistedState({
    paths: ['user']
  })]
})

export default store
