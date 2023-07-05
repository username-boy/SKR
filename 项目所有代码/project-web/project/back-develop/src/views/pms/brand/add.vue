<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="brand" :rules="rules" label-width="150px" ref="brandFrom">
      <el-form-item label="产品分类">
        <el-cascader
          :options="productCateOptions"
          v-model="selectProductCateValue"
          @change="handleCateChange"
          ref="calssOption"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="品牌名称：" prop="name">
        <el-input v-model="brand.name"></el-input>
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
import {
  addBrand,
  getBrand,
  updateBrand,
  searchBrand,
  addStoreBrand,
  addCategoryBrand,
} from "@/api/brand";
import { getCateGory, getStorBrands } from "@/api/product";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      store: "",
      brand: {
        name: "",
        image: "",
        letter: "",
      },
      imageUrl: "",
      rules: {
        name: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 140,
            message: "长度在 2 到 140 个字符",
            trigger: "blur",
          },
        ],
        image: [{ required: true, message: "请输入品牌logo", trigger: "blur" }],
        letter: [{ required: true, message: "请输入品牌首字母" }],
      },
      selectProductCateValue: ["shumajiadian"], // 选择了二级分类，并提供了id
      productCateOptions: [
        //
        {
          value: "shumajiadian",
          label: "数码家电",
          children: [],
        },
        {
          value: "jujiashenghuo",
          label: "居家生活",
          children: [],
        },
        {
          value: "fushi",
          label: "服饰",
          children: [],
        },
        {
          value: "meishi",
          label: "美食",
          children: [],
        },
        {
          value: "gehuqignjie",
          label: "个护清洁",
          children: [],
        },
        {
          value: "shoushizhubao",
          label: "首饰珠宝",
          children: [],
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["storeInfo"]),
  },
  created() {
    this.getProductCateList();
    this.selectProductCateValue.push("1");
  },
  methods: {
    handleUploadSuccess(res, file) {
      console.log(file);
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
    async getProductCateList() {
      for (let i = 0; i < this.productCateOptions.length; i++) {
        let message = { parent_name: "" };
        message.parent_name = this.productCateOptions[i].label;
        await getCateGory(message)
          .then((res) => {
            // console.log(res.data.data, i);
            let titleName = res.data.data;
            for (let k = 0; k < titleName.length; k++) {
              // console.log(titleName[i])
              this.productCateOptions[i].children.push({
                value: `${titleName[k].id}`,
                label: `${titleName[k].name}`,
              });
            }

            // console.log(this.productCateOptions)
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    handleCateChange() {
      console.log(this.selectProductCateValue);
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
              searchBrand({ name: this.brand.name }).then((res) => {
                console.log(res, this.storeInfo.id);
                if (res.data.code == 200) {
                  addStoreBrand({
                    brand_id: res.data.data[0].id,
                    store_id: this.storeInfo.id,
                  });
                  addCategoryBrand({
                    brand_id: res.data.data[0].id,
                    category_id: this.selectProductCateValue[1],
                    store_id: this.storeInfo.id,
                  }).then((res) => {
                    console.log(res);
                    if (res.data.code == 501) {
                      this.$message({
                        message: "该品牌已经存在",
                        type: "warning",
                      });
                    } else {
                      this.$message({
                        message: "添加成功",
                        type: "success",
                      });
                    }
                  });
                  this.$router.go(-1);
                } else {
                  addBrand({
                    name: this.brand.name,
                    image: this.brand.image,
                    letter: this.brand.letter,
                  }).then((res) => {
                    console.log(res);
                    console.log(res.data.data.insertId);
                    if (res.data.code == 200) {
                      addStoreBrand({
                        brand_id: res.data.data.insertId,
                        store_id: this.storeInfo.id,
                      });
                      addCategoryBrand({
                        brand_id: res.data.data.insertId,
                        category_id: this.selectProductCateValue[1],
                        store_id: this.storeInfo.id,
                      }).then((res) => {
                        console.log(res);
                      });
                      this.$message({
                        message: "提交成功",
                        type: "success",
                        duration: 1000,
                      });
                      this.$router.go(-1);
                    } else {
                      this.$message({
                        message: "添加失败",
                        type: "warning",
                        duration: 3000,
                      });
                    }
                  });
                }
              });
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