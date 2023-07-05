<template>
  <div class="deliver-order-list">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>发货列表</span>
    </el-card>
    <div class="table-container">
      <el-table :border="true" :data="deliverList" style="width: 100%">
        <el-table-column label="订单编号" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="收货人" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="手机号码" align="center">
          <template slot-scope="scope">{{ scope.row.tel }}</template>
        </el-table-column>
        <el-table-column label="收货地址" align="center">
          <template slot-scope="scope">{{ scope.row.address }}</template>
        </el-table-column>

        <el-table-column label="配送方式" align="center">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.ecp"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="物流单号" align="center">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.postid"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="margin-top: 15px; text-align: center">
      <el-button @click="cancel">取消</el-button>
      <el-button @click="confirm" type="primary">确定</el-button>
    </div>
  </div>
</template>

<script>
import { getOrderDetail, updateOrder } from "@/api/order";
// import {mapGetters} from "vuex"
export default {
  props: {
    order_id: {
      required: true,
    },
  },
  data() {
    return {
      deliverList: [],
    };
  },
  methods: {
    cancel() {
      for (let item of this.deliverList) {
        this.$set(item, "ecp", "");
        this.$set(item, "postid", "");
      }
    },
    confirm() {
      let data = Object.assign(this.deliverList[0], { status: 2 });
      this.$confirm("是否确认发货", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          updateOrder(data).then((res) => {
            console.log(res);
            if (res.data.code == 200) {
              this.$router.back();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发货",
          });
        });
    },
  },
  created() {
    getOrderDetail({ order_id: this.order_id }).then((res) => {
      let message = [];
      message.push(res.data.data);
      message = message.map((item) => {
        return Object.assign(item, { ecp: "", postid: "" });
      });
      this.deliverList = message;
      console.log(message);
    });
  },
};
</script>

<style scoped>
.deliver-order-list {
  margin-top: 50px;
}
.operate-container {
  margin-bottom: 20px;
}
</style>