<template>
  <div class="apply">
    <div class="table-container">
      <el-table
        :data="backStockList"
        style="width: 100%"
        border
      >
        <el-table-column label="服务单号" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="申请时间" align="center">
          <template slot-scope="scope">{{
            scope.row.create_time | formatTime
          }}</template>
        </el-table-column>
        <el-table-column label="退款金额" align="center">
          <template slot-scope="scope"
            >￥{{ scope.row.money }}</template
          >
        </el-table-column>
        <el-table-column label="申请状态" align="center">
          <template slot-scope="scope">{{
            scope.row.status | formatStatus
          }}</template>
        </el-table-column>
        <el-table-column label="处理时间" align="center">
          <template slot-scope="scope">{{
            scope.row.update_time | formatTime
          }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleViewDetail(scope.row)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/utils/data.js";
import { mapActions,mapGetters} from "vuex";
export default {
  methods: {
    ...mapActions("order", ["getBackStockList"]),
    handleViewDetail(row) {
      this.$router.push({name:'returnApplyDetail',params:{id:row.id,order_id:row.order_id}})
    },
  },
  computed: {
    ...mapGetters(['backStockList','storeInfo'])
  },
  created(){
    this.getBackStockList({store_id:this.storeInfo.id})
  },
  filters:{
    formatTime(time) {
      if (time == null || time === "") {
        return "";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    formatStatus(value){
      if(value==1){
        return "待处理"
      }else if(value==2){
        return "处理中"
      }else if(value==3){
        return "已完成"
      }
    }
  }
};
</script>

<style scoped>
.table-container {
  margin-top: 20px;
}
</style>
