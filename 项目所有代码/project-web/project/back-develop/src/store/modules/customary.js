const state={
    lastMsg:""
}
const mutations={
    LAST_MESSAGE(state,data){
        state.lastMsg=data;
    }
}
const actions={
    // socket_last_message({commit},data){
    //     console.log(data);
    //     commit("LAST_MESSAGE",data)
    // }
}

export default {
    namespaced:true,
    state,
    mutations,
    actions,
}
