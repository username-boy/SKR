<template>
  <div>
    <div class="table-layout">
      <el-table :data="list" border>
        <template slot-scope="scope">
          <el-table-column
            label="优惠券名称"
            align="center"
            prop="name"
          ></el-table-column>
          <el-table-column
            label="优惠券类型"
            align="center"
            prop="type"
          ></el-table-column>
          <el-table-column
            label="可使用商品"
            align="center"
            prop="useType"
          ></el-table-column>
          <el-table-column
            label="使用条件"
            align="center"
            prop="condition"
          ></el-table-column>
          <el-table-column
            label="面值"
            align="center"
            prop="deno"
          ></el-table-column>
          <el-table-column
            label="状态"
            align="center"
            prop="status"
          ></el-table-column>
          <el-table-column
            label="开始时间"
            align="center"
            prop="start_time"
          ></el-table-column>
          <el-table-column
            label="结束时间"
            align="center"
            prop="end_time"
          ></el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script>
import { seeVoucher } from "@/api/coupon";
export default {
  data() {
    return {
      list: [
        {
          name: "",
          type: "",
          useType: "",
          condition: "",
          deno: "",
          status: "",
          start_time: "",
          end_time: ""
        }
      ],
      startTime: "",
      endTime: ""
    };
  },
  created() {
    this.selectDetail();
    console.log(this.list[0].type, this.list[0].useType);
    console.log(this.$route.query.id);
  },
  methods: {
    selectDetail() {
      seeVoucher({
        id: this.$route.query.id
      })
        .then(res => {
          if (res.data.code == 200) {
            this.list = res.data.res;
            for (let i = 0; i < this.list.length; i++) {
              this.startTime = this.list[i].start_time;
              this.endTime = this.list[i].end_time;
              this.startTime = new Date(this.startTime).getTime();
              this.endTime = new Date(this.endTime).getTime();
              this.list[i].type = "全场赠券";
              this.list[i].useType = "全场使用";
            }
            if (this.endTime - this.startTime > 0) {
              for (let j = 0; j < this.list.length; j++) {
                this.list[j].status = "未过期";
              }
            } else {
              for (let k = 0; k < this.list.length; k++) {
                this.list[k].status = "已过期";
              }
            }
            console.log(res, "查看优惠券详情成功");
          }
        })
        .catch(err => {
          console.log(err, "查看优惠券详情失败");
        });
    }
    // selectDetail() {
    //   selectVoucher({
    //     name:this.$route.query.name
    //   })
    //     .then(res => {
    //       console.log(res, "查看优惠券信息成功");
    //       this.list = res.data.res
    //       for(let i = 0;i<this.list.length;i++){
    //         //   this.sizeForm.start.date1 = new Date(this.sizeForm.start.date1).getTime();
    //           this.startTime = this.list[i].start_time
    //           this.endTime = this.list[i].end_time
    //           this.startTime = new Date(this.startTime).getTime()
    //           this.endTime = new Date(this.endTime).getTime()
    //           this.list[i].type = '全场赠券'
    //           this.list[i].useType = '全场使用'
    //       }
    //       if(this.endTime - this.startTime > 0){
    //           for(let j = 0;j<this.list.length;j++){
    //               this.list[j].status = '未过期'
    //           }
    //       }else{
    //           for(let k = 0;k<this.list.length;k++){
    //               this.list[k].status = '已过期'
    //           }
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err, "查看优惠券信息失败");
    //     });
    // },
  }
};
</script>
<style scoped>
.table-layout {
  margin-top: 20px;
}
</style>
