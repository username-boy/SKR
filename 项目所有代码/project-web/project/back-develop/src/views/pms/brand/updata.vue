<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="brand" :rules="rules" label-width="150px" ref="brandFrom">
      <el-form-item label="品牌名称：">
        <el-input :value="name" readonly></el-input>
      </el-form-item>
      <el-form-item label="品牌首字母：" prop="letter">
        <el-input v-model="brand.letter"></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO：" prop="image">
        <el-upload
          action="http://www.dreamqd.cn:5100/upload"
          list-type="picture"
          v-model="brand.image"
          :on-success="handleUploadSuccess"
          :before-upload="handleUBeforeUpload"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过5MB
          </div>
        </el-upload>
        <el-dialog>
          <img width="100%" :src="this.brand.image" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('brandFrom')"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { addBrand, getBrands, updataBrand } from "@/api/brand";
export default {
  data() {
    return {
      name: "",
      brand: {
        letter: "",
        image: "",
      },
      imageUrl: "",
      rules: {
        image: [{ required: true, message: "请输入品牌logo", trigger: "blur" }],
        letter: [{ required: true, message: "请输入品牌首字母" }],
      },
    };
  },
  
  created() {
    this.name = this.$route.query.name;
    console.log(this.$route.query.name);
  },
  methods: {
    handleUploadSuccess(res, file) {
      console.log(file.response.files);
      this.brand.image = file.response.files;
    },
    handleUBeforeUpload(file) {
      console.log(file);
      return new Promise((resolve, reject) => {
        if (file.size > 5242880) {
          this.$message({
            message: "只能上传jpg/png文件，且不超过5MB",
            type: "error",
            duration: 1000,
          });
          reject();
        } else {
          resolve();
        }
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("是否提交数据", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              updataBrand({
                name: this.name,
                image: this.brand.image,
                letter: this.brand.letter,
              }).then((res) => {
                this.$message({
                  message: "提交成功",
                  type: "success",
                  duration: 1000,
                });
              });
              this.$router.push({ path: "/product/Brand" });
              this.$refs[formName].resetFields();
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$message({
            message: "验证失败",
            type: "error",
            duration: 1000,
          });
          return false;
        }
      });
    },
  },
};
</script>

<style>
.form-container {
  position: absolute;
  left: 0;
  right: 0;
  width: 720px;
  padding: 35px 35px 15px 35px;
  margin: 20px auto;
}
</style>