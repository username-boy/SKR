<template>
  <div class="chat-sidebar">
    <div style="height: 50px; line-height: 50px; padding: 0 20px">
      <el-input
        size="small"
        prefix-icon="el-icon-search"
        placeholder="搜索"
      ></el-input>
    </div>
    <div class="msgList">
      <div
        class="msg"
        v-for="(item, index) of lastMsg"
        :key="index"
        @click="handelEnterChat(item.id)"
      >
        <img :src="item.avatar" class="avatar" />
        <div class="text">
          <div>{{ item.nickname }}</div>
          <div style="color: #a8a8a8">{{ item.message }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lastMsg: {
      type: Array,
      required: true,
    },
  },
  methods: {
    handelEnterChat(id) {
      this.$router.push({
        name:"chatRoom",
        params:{
          id,
        }
      })
    },
  },
};
</script>

<style scoped>
.chat-sidebar {
  width: 25%;
  background: #dbd9d8;
  display: flex;
  flex-direction: column;
}
.chat-sidebar .msgList {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}
.msgList .msg {
  margin: 10px 0;
  display: flex;
  align-items: center;
}
.msgList .msg:hover{
  cursor: pointer;
}
.chat-sidebar .text {
  line-height: 25px;
  font-size: 14px;
}
.text > div {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.msgList::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px; /*定义纵向滚动条宽度*/
  height: 8px; /*定义横向滚动条高度*/
}

.msgList::-webkit-scrollbar-thumb {
  /*滚动条内部滑块*/
  border-radius: 8px;
  background-color: #bdbdbd;
}

.msgList::-webkit-scrollbar-track {
  /*滚动条内部轨道*/
  background: #dbd9d8;
}

.avatar {
  margin-right: 20px;
  width: 50px !important;
  height: 50px !important;
}
</style>