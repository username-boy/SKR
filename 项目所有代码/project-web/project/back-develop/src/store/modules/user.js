import { login } from "@/api/login"
const state = {
    storeInfo: {
        id: 9,
        avatar: "",
        nickname: "小店",
    },
    token:""
}
const mutations = {
    UPDATE_STORE_INFO(state, data) {
        state.storeInfo = data
    },
    GET_TOKEN(state,data){
        state.token=data;
    }
}
const actions = {
    login({ commit }, data) {
        return new Promise((resolve, reject) => {
            login(data).then(res => {
                console.log(res)
                if (res.data.code == 200) {
                    commit("UPDATE_STORE_INFO", res.data.data.storeInfo);
                    commit("GET_TOKEN",res.data.data.token)
                    resolve(res.data.data)
                    return
                }
                reject()
            }).catch(err => {
                reject(err);
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