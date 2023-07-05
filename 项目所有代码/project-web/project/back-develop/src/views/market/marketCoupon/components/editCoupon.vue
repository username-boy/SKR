<template>
  <div id="editCoupon" shadow="never">
    <!-- 编辑优惠券 -->
    <el-card shadow="never" class="card">
      <el-form ref="form" :model="sizeForm" label-width="150px" class="form">
        <div class="formItem">
          <el-form-item label="编号" required>
            <el-input v-model="sizeForm.id"></el-input>
          </el-form-item>
          <el-form-item label="优惠券面额" required>
            <el-input v-model="sizeForm.deno" placeholder="请输入优惠券面额">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="使用条件" required>
            <el-input v-model="sizeForm.condition" placeholder="请输入使用优惠券的满足条件" >
              <template slot="append">元</template>
            </el-input>
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
                style="width: 100%;"
              ></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-time-picker
                placeholder="选择时间"
                v-model="sizeForm.start.date2"
                style="width: 100%;"
              ></el-time-picker>
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
            <el-button type="primary" size="mini" @click="submitHandle"
              >提交</el-button
            >
            <el-button size="mini" @click="cancel">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { editVoucheer,seeVoucher } from "@/api/coupon";
export default {
  data() {
    return {
      sizeForm: {
        id: "",
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
        name: ""
      }
    };
  },
  created() {
    console.log(this.$route.query.id);
    seeVoucher({
      id:this.$route.query.id
    }).then(res=>{
      console.log(res.data.res);
      this.sizeForm.id = this.$route.query.id
      this.sizeForm.deno = res.data.res[0].deno
      this.sizeForm.condition = res.data.res[0].condition
      this.sizeForm.name = res.data.res[0].name
      this.sizeForm.start.date1 = res.data.res[0].start_time
      this.sizeForm.start.date2 = res.data.res[0].start_time
      this.sizeForm.end.date1 = res.data.res[0].end_time
      this.sizeForm.end.date2 = res.data.res[0].end_time
    }).catch(err=>{
      console.log(err);
    })
  },
  methods: {
    cancel() {
      this.$router.go(-1);
    },
    submitHandle() {
      this.sizeForm.start.date1 = new Date(this.sizeForm.start.date1).getTime();
          this.sizeForm.start.date2 = new Date(this.sizeForm.start.date2).getTime();
          this.sizeForm.end.date1 = new Date(this.sizeForm.end.date1).getTime();
          this.sizeForm.end.date2 = new Date(this.sizeForm.end.date2).getTime();
          console.log(this.sizeForm.start.date2,this.sizeForm.end.date2);
      editVoucheer({
        id: this.sizeForm.id,
        deno: this.sizeForm.deno,
        start_time: this.sizeForm.start.date2 ,
        end_time: this.sizeForm.end.date2,
        name: this.sizeForm.name,
        condition:this.sizeForm.condition
      })
        .then(res => {
          if (res.data.code == 200) {
            this.$router.push({ path: "/market/marketCoupon" });
            console.log(res, "编辑优惠券成功");
            this.$message({
              showClose: true,
              message: '编辑成功',
              type: 'success'
          });
          }
        })
        .catch(err => {
          console.log(err, "编辑优惠券失败");
          this.$message({
            showClose: true,
            message: '编辑失败',
            type: 'error'
        });
        });
    },
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
      padding: 43px 89px 43px 0;
    }
  }
}
</style>
