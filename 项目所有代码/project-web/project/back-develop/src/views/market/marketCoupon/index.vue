<template>
  <div id="marketCoupon">
    <el-card shadow="never" style="margin:20px 0;" class="card">
      <i class="el-icon-search"></i>
      <span style="margin: 0 10px;">筛选搜索</span>
      <div class="input">
        <el-input
          placeholder="优惠券名称"
          style="width:200px; margin-right:10px;"
          v-model="selectName"
        ></el-input>
        <el-button
          size="small"
          style="float:right;margin-left:10px;"
          type="primary"
          @click="handleSearchList()"
          >查询搜索</el-button
        >
      </div>
    </el-card>
    <el-card shadow="never">
      <i class="el-icon-document" style="margin:0 10px 0 0;"></i>
      <span style="margin:0 10px 0 0;">数据列表</span>
      <el-button size="mini" @click="addHandle" style="float:right;"
        >添加</el-button
      >
    </el-card>
    <div>
      <el-table :data="tableData" border stripe style="margin:10px 0;">
        <template slot-scope="scope">
          <el-table-column
            label="编号"
            prop="id"
            align="center"
          ></el-table-column>
          <el-table-column
            label="名称"
            prop="name"
            align="center"
          ></el-table-column>
          <el-table-column
            label="优惠券面额"
            prop="deno"
            align="center"
          ></el-table-column>
          <el-table-column
            label="优惠券满足条件"
            prop="condition"
            align="center"
          ></el-table-column>
          <el-table-column
            label="开始使用时间"
            prop="start_time"
            align="center"
          ></el-table-column>
          <el-table-column
            label="结束使用时间"
            prop="end_time"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" prop="action" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="searchHandle(scope.$index, scope.row)"
                >查看</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="editHandle(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="deleteHandle(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/utils/date";
import { getVoucher, selectVoucher, deleteVoucher } from "@/api/coupon";
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      tableData: [
        {
          id: "",
          name: "",
          deno: "",
          condition: "",
          start_time: "",
          end_time: "",
          action: ""
        }
      ],
      selectName: ""
    };
  },
  created() {
    this.searchVoucher();
  },
  computed: {
    ...mapGetters([
      'storeInfo'
    ])
  },
  methods: {
    searchVoucher() {
      getVoucher({
        store_id: this.storeInfo.id
      })
        .then(res => {
          console.log(res, "获取优惠券列表成功");
          for (let i = 0; i < this.tableData.length; i++) {
            console.log(this.tableData[i]);
            console.log(this.tableData[i].start_time);
          }
          this.tableData = res.data.data;

          console.log(this.tableData);
        })
        .catch(err => {
          console.log(err, "获取优惠券列表失败");
        });
    },
    handleSearchList() {
      selectVoucher({
        name: this.selectName
      }).then(res => {
          if (res.data.code === 401) {
            console.log("参数不正确");
            this.tableData = [];
          }
          if (res.data.code === 402) {
            console.log("未查询到数据");
            this.tableData = [];
          }
          if (res.data.code === 200) {
            console.log(res, "查询成功");
            this.searchVoucher();
          }
        })
        .catch(err => {
          console.log(err, "查询优惠券列表失败");
        });
    },
    // 删除
    deleteHandle(index, row) {
      deleteVoucher({
        id: row.id
      })
        .then(res => {
          if(res.code ==200){
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
          });
          console.log(res, "删除成功");
          location.reload();
          }
          this.$message({
            showClose: true,
            message: '删除失败',
            type: 'error'
        });
        })
        .catch(err => {
          console.log(err, "删除失败");
        });
    },
    searchHandle(index, row) {
      this.$router.push({
        path: "/market/couponDetail",
        query: { id: row.id }
      });
    },
    addHandle() {
      this.$router.push("/market/addCoupon");
    },
    editHandle(index, row) {
      this.$router.push({
        path: "/market/editCoupon",
        query: {
          id: row.id
        }
      });
    },
    formatTime(time) {
      if (time == null || time === "") {
        return "";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  }
};
</script>
<style scoped>
.input {
  display: flex;
  margin: 10px 0;
}
</style>
