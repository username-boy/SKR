<template>
  <div class="chat-room">
    <div class="chat-content">
      <div class="chat-header" style="border-bottom: 1px solid #ccc">
        <span style="font-size: 22px">{{ userInfo.nickname }}</span>
        <svg-icon
          icon-class="more"
          style="width: 25px; height: 25px"
        ></svg-icon>
      </div>
      <div
        class="chat-body"
        style="height: 100%; padding-top: 20px"
      >
        <div
          class="chat-main"
          :class="{ 'chat-mine': item.isSender }"
          v-for="(item, index) of msgLists"
          :key="index"
        >
          <div class="chat-user">
            <img :src="item.avatar" v-if="item.avatar" />
            <span class="text-photo" v-else>{{ item.nickname }}</span>
            <cite
              ><i>{{ item.create_time | formatTime }}</i>
            </cite>
          </div>
          <div class="chat-text">{{ item.message }}</div>
        </div>
      </div>
      <div class="chat-bottom">
        <el-input
          v-model="message"
          placeholder="请输入要发送的内容"
          style="margin-right: 20px"
          @keyup.native.enter="sendMsg"
        ></el-input>
        <el-button type="primary" @click="sendMsg">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getCustomerMsg } from "@/api/customary.js";
import { formatDate } from "@/utils/data.js";
import { mapGetters } from "vuex";
export default {
  props: ["id"],
  data() {
    return {
      userInfo: {
        avatar: "",
        nickname: "",
      },
      message: "",
      msgLists: [],
    };
  },
  filters: {
    formatTime(time) {
      if (time == null || time === "") {
        return "";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
  },
  created() {
    this.$socket.emit("show_messages", {
      sender: "store_" + this.storeInfo.id,
      receiver: "user_" + this.id,
    });
    getCustomerMsg({ id: this.id }).then((res) => {
      this.userInfo = res.data.data[0];
      console.log(res.data.data[0]);
      console.log(this.storeInfo);
    });
  },
  computed: {
    ...mapGetters(["storeInfo"]),
  },
  methods: {
    sendMsg() {
      let msg = this.message.trim();
      console.log(msg);
      if (msg) {
        this.msgLists.push({
          nickname: this.storeInfo.nickname,
          avatar: this.storeInfo.avatar,
          isSender: true,
          create_time: Date.now(),
          message: this.message,
        });
        this.message = "";
        this.$socket.emit("send_message", {
          sender: "store_" + this.storeInfo.id,
          receiver: "user_" + this.id,
          msg,
        });
      }
    },
  },
  sockets: {
    return_messages(data) {
      let arr = [];
      data.forEach((item) => {
        if (item.client == "1") {
          item.isSender = false;
          item = Object.assign(item, this.userInfo);
        } else {
          item = Object.assign(item, {
            nickname: this.storeInfo.nickname,
            avatar: this.storeInfo.avatar,
            isSender: true,
          });
        }
        arr.push(item);
      });
      console.log(arr);
      this.msgLists = arr;
    },
    receive_message(data) {
      this.msgLists.push(
        Object.assign(
          { message: data },
          {
            nickname: this.userInfo.nickname,
            avatar: this.userInfo.avatar,
            isSender: false,
          }
        )
      );
    },
  },
  beforeDestroy() {
    this.$socket.emit("change", {
      sender: "store_" + this.storeInfo.id,
      receiver: "user_" + this.id,
    });
  },
  beforeRouteUpdate(to,from,next){
    this.$socket.emit("change",{
      sender:"store_"+this.storeInfo.id,
      receiver:"user_"+this.$route.params.id
    })
  }
};
</script>

<style scoped>
.chat-content {
  display: flex;
  flex-direction: column;
  background: #f7f6fb;
  height: 100%;

}
.chat-main {
  position: relative;
  font-size: 0;
  margin-bottom: 10px;
  padding-left: 60px;
  min-height: 68px;
}
.chat-header,
.chat-bottom {
  height: 50px;
  line-height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.chat-user {
  position: absolute;
  left: 3px;
}

.chat-user cite {
  position: absolute;
  left: 60px;
  top: -2px;
  width: 500px;
  line-height: 24px;
  font-size: 12px;
  white-space: nowrap;
  color: #999;
  text-align: left;
  font-style: normal;
}

.chat-user .text-photo,
.chat-user img {
  width: 40px;
  height: 40px;
  border-radius: 100%;
}

.chat-user .text-photo {
  display: block;
  background-color: #328af4;
  color: #fff;
  text-align: center;
  line-height: 40px;
}

.chat-user cite i {
  padding-left: 15px;
  font-style: normal;
}

.chat-text {
  position: relative;
  line-height: 22px;
  margin-top: 25px;
  padding: 8px 15px;
  background-color: #e2e2e2;
  border-radius: 3px;
  color: #333;
  word-break: break-all;
  max-width: 250px;
}

.chat-text::after {
  content: "";
  position: absolute;
  left: -10px;
  top: 13px;
  width: 0;
  height: 0;
  border-style: solid dashed dashed;
  border-color: #e2e2e2 transparent transparent;
  overflow: hidden;
  border-width: 10px;
}

.chat-text,
.chat-user {
  display: inline-block;
  *display: inline;
  *zoom: 1;
  vertical-align: top;
  font-size: 14px;
}

/** 消息右侧展示 */
.chat-mine {
  text-align: right;
  padding-left: 0;
  padding-right: 60px;
}

.chat-mine .chat-user {
  left: auto;
  right: 3px;
}

.chat-mine .chat-user cite {
  left: auto;
  right: 60px;
  text-align: right;
}

.chat-mine .chat-user cite i {
  padding-left: 0;
  padding-right: 5px;
}

.chat-mine .chat-text {
  margin-left: 0;
  text-align: left;
  /* background-color: #328af4;
  color: #fff; */
}

.chat-mine .chat-text:after {
  left: auto;
  right: -10px;
  /* border-top-color: #328af4; */
}
.chat-body{
  overflow-y:scroll;
}

.chat-body::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px; /*定义纵向滚动条宽度*/
  height: 8px; /*定义横向滚动条高度*/
}

.chat-body::-webkit-scrollbar-thumb {
  /*滚动条内部滑块*/
  border-radius: 8px;
  background-color: #bdbdbd;
}

.chat-body::-webkit-scrollbar-track {
  /*滚动条内部轨道*/
  background: #f7f6fb;
}
</style>