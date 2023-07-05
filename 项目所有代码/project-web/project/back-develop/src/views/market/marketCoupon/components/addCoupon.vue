<template>
  <!-- 添加 -->
  <el-card class="card" shadow="never">
    <el-form
      ref="form"
      :model="sizeForm"
      label-width="150px"
      size="mini"
      class="demo-ruleForm"
    >
      <div class="formItem">
        <el-form-item label="优惠券面额" required>
          <el-input v-model="sizeForm.deno"></el-input>
        </el-form-item>
        <el-form-item label="使用条件" required> 
          <el-input v-model="sizeForm.condition"></el-input>
        </el-form-item>
        <el-form-item label="产品id" required v-show="isShowSpu">
          <el-input v-model="sizeForm.spu_id"></el-input>
        </el-form-item>
        <el-form-item label="优惠券名称" required>
          <el-input v-model="sizeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" required>
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="sizeForm.start.date1"
              style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker
              placeholder="选择时间"
              v-model="sizeForm.start.date2"
              style="width: 100%;">
            </el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="结束时间" required>
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="sizeForm.end.date1"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker
              placeholder="选择时间"
              v-model="sizeForm.end.date2"
              style="width: 100%;"
            ></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="onSubmit" size="mini"
            >立即创建</el-button
          >
          <el-button size="mini" @click="cancel">取消</el-button>
        </el-form-item>
      </div>
    </el-form>
  </el-card>
</template>
<script>
import { addVoucher,getVoucher  } from "@/api/coupon";
import { formatDate } from "@/utils/date";
import { mapGetters } from 'vuex'
export default {
  // SELECT FROM_UNIXTIME(start_time) AS a FROM t_voucher  -----》时间戳转换为正常日期格式
  // 前端将时间格式进行转换-----》转换为时间戳的形式，存入数据库，然后在数据库中改变sql，将时间转换为正常的时间格式，然后返回给前端
  data() {
    return {
      sizeForm: {
        deno: "",
        start: {
          date1: "",
          date2: ""
        },
        end: {
          date1: "",
          date2: ""
        },
        condition: "",
        spu_id: this.$route.query.spu_id,
        name: ""
      },
      isShowSpu:false,
    };
  },
  computed: {
    ...mapGetters([
      'storeInfo'
    ])
  },
  created(){
    if(this.$route.query.spu_id){
      this.isShowSpu = true
    }
  },
  methods: {
    cancel() {
      this.$router.go(-1);
    },
    onSubmit() {
      this.isShowSpu = true
      this.sizeForm.start.date1 = new Date(this.sizeForm.start.date1).getTime();
      this.sizeForm.start.date2 = new Date(this.sizeForm.start.date2).getTime();
      console.log(this.sizeForm.start.date2);
      this.sizeForm.end.date1 = new Date(this.sizeForm.end.date1).getTime();
      this.sizeForm.end.date2 = new Date(this.sizeForm.end.date2).getTime();
      console.log(this.sizeForm.end.date2);
      addVoucher({
        store_id: this.storeInfo.id,
        spu_id: this.$route.query.spu_id,
        start_time: this.sizeForm.start.date2,
        end_time: this.sizeForm.end.date2,
        deno: this.sizeForm.deno,
        condition: this.sizeForm.condition,
        name: this.sizeForm.name
      })
        .then(res => {
          console.log(res);
          if (res.data.code == 401) {
            if(!this.$route.query.spu_id){
               this.isShowSpu = false
            }
              console.log("入参不符");
              this.$message({
                showClose: true,
                message: '入参不符',
                type: 'error'
            });
          }
          if (res.data.code == 200) {
            console.log(res, "添加优惠券成功啦");
            this.$router.push({
              path: "/market/marketCoupon",
              query: {
                start_time: this.sizeForm.start.date2,
                end_time: this.sizeForm.end.date2
              }
            });
            this.$message({
              showClose: true,
              message: '添加成功',
              type: 'success'
            })
            getVoucher({
              store_id: this.storeInfo.id
            })
              .then(res => {
                console.log(res, "获取优惠券列表成功aaaaaa");
              })
              .catch(err => {
                console.log(err, "获取优惠券列表失败");
              });
          } 
        })
        .catch(err => {
          console.log(err, "添加优惠券失败");
          this.$message({
            showClose: true,
            message: '添加优惠券失败',
            type: 'error'
        });
        });
    },
    formatDate(time) {
      if (time == null || time === "") {
        return "";
      }
      let data = new Date(time);
      return formatDate(data, "yyyy-MM-dd hh:mm:ss");
    }
  }
};
</script>
<style lang="less">
.card {
  margin: 10px 0;
  width: 760px;
  margin: 20px auto;
  .form {
    text-align: center;
    .formItem {
      padding-right: 89px;
    }
  }
}
</style>
