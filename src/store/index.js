// 导入vue
import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

// 使用vue
Vue.use(Vuex)
 
const state = {
  cartList:[]
}
//创建 store对象 
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
})
