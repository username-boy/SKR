import { getOrder, getOrderDetail ,getBackStock,getBackStockDetail} from "@/api/order"

const state = {
  orderList: null,
  total: null,
  order: null,
  backStockList:null,
  backStock:null
}
const mutations = {
  ORDER_LIST(state, data) {
    state.orderList = data
  },
  TOTAL(state, data) {
    state.total = data
  },
  ORDER(state, data) {
    state.order = data;
  },
  BACK_STOCK_LIST(state,data){
    state.backStockList=data;
  },
  BACK_STOCK(state,data){
    state.backStock=data;
  }
}
const actions = {
  getOrder({ commit }, data) {
    return new Promise((resolve, reject) => {
      getOrder(data).then(res => {
        commit("ORDER_LIST", res.data.data[0]);
        commit("TOTAL", res.data.data[1]);
        resolve(res.data.data);
      }).catch(err => {
        reject(err)
      })
    })
  },
  getDetail({ commit }, data) {
    return new Promise((resolve, reject) => {
      getOrderDetail(data).then(res => {
        let order = res.data.data;
        order.createTime = order.create_time;
        let times = ["createTime", 'paymentTime', 'deliveryTime', 'receiveTime'];
        let updateTime = [];
        if (order.update_time) {
          updateTime = order.update_time.split(',');
        }
        for (let key in times) {
          if (updateTime[key]) {
            order[times[key]] = Number(updateTime[key])
          }
        }
        commit("ORDER", order);
        resolve(order);
      }).catch(err => {
        reject(err)
      })
    })
  },
  getBackStockList({commit},data){
    return new Promise((resolve, reject) => {
      getBackStock(data).then(res => {
        commit("BACK_STOCK_LIST", res.data.data);
        resolve(res.data.data);
      }).catch(err => {
        reject(err)
      })
    })
  },

  getBackStock({commit},data){
    return new Promise((resolve, reject) => {
      getBackStockDetail(data).then(res => {
        commit("BACK_STOCK", res.data.data);
        resolve(res.data.data);
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}