<template>
  <div class="customary">
    <chat-sidebar style="width:25%;" :last-msg="lastMsg"></chat-sidebar>
    <router-view style="width:75%;"></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import chatSidebar from "@/components/chatSidebar"
export default {
  components:{
    chatSidebar,
  },
  data(){
    return{
      lastMsg:[]
    }
  },  
    created() {
    this.$socket.emit("get_last_message", { uid: "store_" + this.storeInfo.id });
  },
  computed: {
    ...mapGetters(["storeInfo"]),
  },
  sockets: {
    last_message(data) {
      this.lastMsg = data;
    },
  },
};
</script>

<style scoped>
.customary {
  height: 100%;
  display: flex;
  box-sizing: border-box;
}
</style>