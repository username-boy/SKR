<template>
  <div class="order-detail">
    <div class="steps">
      <el-steps align-center :active="parseInt(order.status) + 1">
        <el-step
          title="提交订单"
          :description="formatTime(order.createTime)"
        ></el-step>
        <el-step
          title="支付订单"
          :description="formatTime(order.paymentTime)"
        ></el-step>
        <el-step
          title="平台发货"
          :description="formatTime(order.deliveryTime)"
        ></el-step>
        <el-step
          title="确认收货"
          :description="formatTime(order.receiveTime)"
        ></el-step>
      </el-steps>
    </div>
    <el-card shadow="never" style="“margin-top: 15px">
      <div class="operate-container">
        <div class="text">
          <i class="el-icon-warning" style="margin-left: 20px"></i>
          <span class="color-danger">当前订单状态：{{ order.status | formatStatus }}</span>
        </div>
        <div class="operate-button-container" v-if="order.status==1">
          <el-button size="mini">订单发货</el-button>
        </div>
        <div class="operate-button-container" v-if="order.status==2">
          <el-button size="mini">订单跟踪</el-button>
        </div>
        <div class="operate-button-container" v-if="order.status==3">
          <el-button size="mini" @click="handleDeleteOrder">删除订单</el-button>
        </div>
      </div>
      
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">基本信息</span>
      </div>


      <div class="table-layout" style="margin-top:20px">
        <el-row>
          <el-col :span="8" class="table-cell-title">订单编号</el-col>
          <el-col :span="8" class="table-cell-title">订单流水号</el-col>
          <el-col :span="8" class="table-cell-title">支付方式</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell">{{order.id}}</el-col>
          <el-col :span="8" class="table-cell">{{order.code}}</el-col>
          <el-col :span="8" class="table-cell">{{order.payment_type|formatPayment|formatNudefined}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell-title">配送方式</el-col>
          <el-col :span="8" class="table-cell-title">物流单号</el-col>
          <el-col :span="8" class="table-cell-title">自动确认收货时间</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell">{{order.ecp|formatNudefined}}</el-col>
          <el-col :span="8" class="table-cell">{{order.postid|formatNudefined}}</el-col>
          <el-col :span="8" class="table-cell">15天</el-col>
        </el-row>
      </div>

      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">收货人信息</span>
      </div>

      <div class="table-layout" style="margin-top:20px">
        <el-row>
          <el-col :span="8" class="table-cell-title">收货人</el-col>
          <el-col :span="8" class="table-cell-title">手机号</el-col>
          <el-col :span="8" class="table-cell-title">收货地址</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell">{{order.name}}</el-col>
          <el-col :span="8" class="table-cell">{{order.tel}}</el-col>
          <el-col :span="8" class="table-cell">{{order.address}}</el-col>
        </el-row>
      </div>

      <div style="margin-top: 20px"  >
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">商品信息</span>
      </div>
      <div class="table-layout" style="margin-top:20px">
        <el-row>
          <el-col :span="3" class="table-cell-title">商品编号</el-col>
          <el-col :span="4" class="table-cell-title">商品图片</el-col>
          <el-col :span="4" class="table-cell-title">商品名称</el-col>
          <el-col :span="3" class="table-cell-title">商品单价</el-col>
          <el-col :span="3" class="table-cell-title">商品参数</el-col>
          <el-col :span="3" class="table-cell-title">数量</el-col>
          <el-col :span="4" class="table-cell-title">总价</el-col>
        </el-row>
        <div v-for="(item,index) of order.skus" :key="index">
          <el-row>
          <el-col :span="3" class="table-cell">{{item.id}}</el-col>
          <el-col :span="4" class="table-cell"><img :src="formatImg(item.imgs)" style="height:40px;"></el-col>
          <el-col :span="4" class="table-cell">{{item.title}}</el-col>
          <el-col :span="3" class="table-cell">￥{{item.price}}</el-col>
          <el-col :span="3" class="table-cell">{{item.param|foramtParam}}</el-col>
          <el-col :span="3" class="table-cell">{{item.num}}</el-col>
          <el-col :span="4" class="table-cell">￥{{item.actual_price|formatPrice}}</el-col>
        </el-row>
        </div>
      </div>
      <div style="float: right;margin: 20px">
        合计：<span class="color-danger">￥{{order.money}}</span>
      </div>
      
    </el-card>
  </div>
</template>

<script>
import { formatDate } from "@/utils/data.js";
import { mapActions, mapGetters } from 'vuex';
import { deleteOrder } from "@/api/order";
export default {
  props: [ "order_id","status"],
  methods: {
    ...mapActions('order',['getDetail']),
    handleDeleteOrder() {
      this.$confirm("此操作将永久删除该订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteOrder({ id: row.id }).then((res) => {
            if (res.data.code == 200) {
              this.$router.back();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    formatTime(time) {
      if (time == null || time === "") {
        return "";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    formatImg(value){
      console.log();
      return value&&JSON.parse(value)[0]
    }
  },
  created() {
    this.getDetail({order_id:this.order_id,status:this.status}).then(res=>{console.log(res)})
  },
  filters: {
    formatStatus(value) {
      if (value == 0) {
        return "待支付";
      } else if (value == 1) {
        return "待发货";
      } else if (value == 2) {
        return "已发货";
      } else if (value == 3) {
        return "已完成";
      }
    },
    formatPayment(value){
      if(value==1){
        return "微信"
      }else if(value==2){
        return "支付宝"
      }else{
        return 
      }
    },
    formatPrice(value){
      return value.toFixed(2)
    },
    formatNudefined(value){
      if(value){
        return value;
      }
      return "暂无"
    },
    foramtParam(value){
      let arr=[];
      value=JSON.parse(value)
      for(let item of value){
        arr.push(item['key']+":"+item['value'])
      }
      return arr.join('+')
    }
  },
  computed:{
    ...mapGetters(['order'])
  }
};
</script>

<style scoped>
.order-detail{
  margin:0 150px;
}
.steps {
  margin: 50px 0;
}
.operate-container{
  display:flex;
  justify-content: space-between;
  background:#f2f6fc;
  height:80px;
  align-items:center;
  margin: -20px  -20px 0 -20px;
}
.operate-container>.text{
  color:red
}
.operate-container>.operate-button-container{
  margin-right:20px;
}
 .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>