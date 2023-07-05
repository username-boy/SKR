<template>
  <el-form :model="editForm" label-width="150px" size="small">
        <el-form-item label="活动名称">
          <el-input
            v-model="editForm.active_name"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="参加活动的商品id">
          <el-input v-model="editForm.spu_id" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="活动开始时间">
          <el-col :span="11">
            <el-time-picker
              type="date"
              placeholder="选择时间"
              v-model="editForm.star_time"
              style="width: 80%"
            ></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="活动结束时间">
          <el-col :span="11">
            <el-time-picker
              type="date"
              placeholder="选择日期"
              v-model="editForm.end_time"
              style="width: 80%"
            ></el-time-picker>
          </el-col>
        </el-form-item>
      </el-form>
</template>

<script>
export default {
    name:"List",
    props:['editForm']
}
</script>

<style>

</style>