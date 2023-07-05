<template>
  <div class="apply-detail">
    <el-card shadow="never">
      <div style="margin-top: 20px">
        <span class="font-small">退货商品</span>
      </div>
      <div class="table-layout" style="margin-top: 20px">
        <el-row>
          <el-col :span="3" class="table-cell-title">商品编号</el-col>
          <el-col :span="4" class="table-cell-title">商品图片</el-col>
          <el-col :span="4" class="table-cell-title">商品名称</el-col>
          <el-col :span="3" class="table-cell-title">商品单价</el-col>
          <el-col :span="3" class="table-cell-title">商品参数</el-col>
          <el-col :span="3" class="table-cell-title">数量</el-col>
          <el-col :span="4" class="table-cell-title">总价</el-col>
        </el-row>
        <div v-for="(item, index) of backStock.skus" :key="index">
          <el-row>
            <el-col :span="3" class="table-cell">{{ item.id }}</el-col>
            <el-col :span="4" class="table-cell">{{ item.imgs }}</el-col>
            <el-col :span="4" class="table-cell">{{ item.title }}</el-col>
            <el-col :span="3" class="table-cell">￥{{ item.price|formatPrice }}</el-col>
            <el-col :span="3" class="table-cell">{{ item.param|foramtParam }}</el-col>
            <el-col :span="3" class="table-cell">{{ item.num }}</el-col>
            <el-col :span="4" class="table-cell"
              >￥{{ item.actual_price|formatPrice }}</el-col
            >
          </el-row>
        </div>
      </div>
      <div style="float: right; margin: 20px">
        合计：<span class="color-danger">￥{{ backStock.money|formatPrice }}</span>
      </div>
    </el-card>

    <el-card shadow="never" class="standard-margin">
      <span class="font-title-medium">服务单信息</span>
      <div class="form-container-border">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small"
            >服务单号</el-col
          >
          <el-col class="form-border font-small" :span="18">{{ id }}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6"
            >申请状态</el-col
          >
          <el-col class="form-border font-small" :span="18">{{
            backStock.status | formatStatus
          }}</el-col>
        </el-row>
        <el-row>
          <el-col
            :span="6"
            class="form-border form-left-bg font-small"
            style="height: 50px; line-height: 30px"
            >订单编号
          </el-col>
          <el-col
            class="form-border font-small"
            :span="18"
            style="height: 50px"
          >
            {{ order_id }}
          </el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6"
            >申请时间</el-col
          >
          <el-col class="form-border font-small" :span="18">{{
            backStock.create_time | formatTime
          }}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6"
            >联系人</el-col
          >
          <el-col class="form-border font-small" :span="18">{{
            backStock.user
          }}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6"
            >联系电话</el-col
          >
          <el-col class="form-border font-small" :span="18">{{
            backStock.userTel
          }}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6"
            >退货原因</el-col
          >
          <el-col class="form-border font-small" :span="18">{{
            backStock.reason
          }}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6"
            >订单金额</el-col
          >
          <el-col class="form-border font-small" :span="18"
            >￥{{ backStock.money | formatPrice }}</el-col
          >
        </el-row>
        <el-row>
          <el-col
            class="form-border form-left-bg font-small"
            :span="6"
            style="height: 100px; line-height: 80px"
            >凭证图片
          </el-col>
          <el-col
            class="form-border font-small"
            :span="18"
            style="height: 100px"
          >
            <div
              v-for="(item, index) in fromatImgs(backStock.imgs)"
              :key="index"
            >
              <img
                style="
                  width: 80px;
                  height: 80px;
                  float: left;
                  margin-right: 20px;
                "
                :src="item"
              />
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="form-container-border" v-if="backStock.status!=1">
        <el-row>
          <el-col
            class="form-border form-left-bg font-small"
            :span="6"
            style="height: 52px; line-height: 32px"
            >确认退款金额
          </el-col>
          <el-col
            class="form-border font-small"
            :span="18"
            style="height: 52px; line-height: 32px"
            >￥{{ backStock.money | formatPrice }}</el-col
          >
        </el-row>
        <div >
          <el-row>
            <el-col class="form-border form-left-bg font-small" :span="6"
              >收货人姓名</el-col
            >
            <el-col class="form-border font-small" :span="18">{{
              backStock.store
            }}</el-col>
          </el-row>
          <el-row>
            <el-col class="form-border form-left-bg font-small" :span="6"
              >所在区域</el-col
            >
            <el-col class="form-border font-small" :span="18">{{
              backStock.region
            }}</el-col>
          </el-row>
          <el-row>
            <el-col class="form-border form-left-bg font-small" :span="6"
              >详细地址</el-col
            >
            <el-col class="form-border font-small" :span="18">{{
              backStock.storeAdd
            }}</el-col>
          </el-row>
          <el-row>
            <el-col class="form-border form-left-bg font-small" :span="6"
              >联系电话</el-col
            >
            <el-col class="form-border font-small" :span="18">{{
              backStock.storeTel
            }}</el-col>
          </el-row>
          <el-row>
            <el-col class="form-border form-left-bg font-small" :span="6"
              >收货时间</el-col
            >
            <el-col class="form-border font-small" :span="18">{{
              backStock.update_time | formatTime
            }}</el-col>
          </el-row>
        </div>
      </div>
    </el-card>
    <div class="handle">
      <el-button
        type="primary"
        @click="handelBackStock(2)"
        v-if="backStock.status == 1"
        >接受退款</el-button
      >
      <el-button
        type="primary"
        @click="handelBackStock(3)"
        v-if="backStock.status == 2"
        >完成退款</el-button
      >
      <el-button
        type="primary"
        @click="handelDeleteBackStock"
        v-if="backStock.status == 3"
        >删除信息</el-button
      >
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { formatDate } from "@/utils/data.js";
import { updateBackStock, deleteOrder } from "@/api/order";
export default {
  props: ["order_id", "id"],
  methods: {
    ...mapActions("order", ["getBackStock"]),
    handelDeleteBackStock() {
      this.$confirm("此操作将永久删除该条退款信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteOrder({ order_id: this.order_id }).then((res) => {
            if (res.code == 200) {
              this.$router.back;
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
    handelBackStock(status) {
      if (this.backStock.orderStatus == 1) {
        status = 3;
      }
      this.$confirm("确认操作此退款", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          updateBackStock({ id: this.id, status }).then((res) => {
            if (res.data.code == 200) {
              this.$router.back();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消操作",
          });
        });
    },
    fromatImgs(imgs) {
      return JSON.parse(imgs);
    },
  },
  computed: {
    ...mapGetters(["backStock"]),
  },
  created() {
    this.getBackStock({ order_id: this.order_id }).then(() => {

    });
  },
  filters: {
    foramtParam(value){
      let arr=[];
      value=JSON.parse(value)
      for(let item of value){
        arr.push(item['key']+":"+item['value'])
      }
      return arr.join('+')
    },
    formatPrice(value) {
      return value.toFixed(2);
    },
    formatTime(time) {
      if (time == null || time === "") {
        return "";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    formatStatus(value) {
      if (value == 1) {
        return "待处理";
      } else if (value == 2) {
        return "处理中";
      } else if (value == 3) {
        return "已完成";
      }
    },
  },
};
</script>

<style scoped>
.apply-detail {
  margin-top: 50px;
}
.table-layout {
  margin-top: 20px;
  border-left: 1px solid #dcdfe6;
  border-top: 1px solid #dcdfe6;
}

.table-cell {
  height: 60px;
  line-height: 40px;
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  padding: 10px;
  font-size: 14px;
  color: #606266;
  text-align: center;
  overflow: hidden;
}

.table-cell-title {
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  padding: 10px;
  background: #f2f6fc;
  text-align: center;
  font-size: 14px;
  color: #303133;
}

.standard-margin {
  margin-top: 50px;
}
.form-border {
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  padding: 10px;
}

.form-container-border {
  border-left: 1px solid #dcdfe6;
  border-top: 1px solid #dcdfe6;
  margin-top: 15px;
}

.form-left-bg {
  background: #f2f6fc;
}
.handle {
  display: flex;
  justify-content: center;
}
/* ["https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.qqtn.com%2Farticle%2Farticle_284105_1.html&psig=AOvVaw19XKW7SfSdS5xpU-CTtl3p&ust=1601306802121000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCIjQ5vDSiewCFQAAAAAdAAAAABAD","https://www.google.com/imgres?imgurl=http%3A%2F%2Fpic.sc.chinaz.com%2Ffiles%2Fpic%2Fpic9%2F201912%2Fhpic1818.jpg&imgrefurl=http%3A%2F%2Fsc.chinaz.com%2Ftupian%2F191210382545.htm&tbnid=fYxL76wxGXOCIM&vet=12ahUKEwj2nprq0onsAhUHY5QKHSayD6cQMygKegUIARC-AQ..i&docid=LO-i4ekgvzrZFM&w=650&h=866&q=%E5%9B%BE%E7%89%87&ved=2ahUKEwj2nprq0onsAhUHY5QKHSayD6cQMygKegUIARC-AQ"] */
</style>