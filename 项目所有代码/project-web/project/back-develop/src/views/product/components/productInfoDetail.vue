<template>
  <div style="margin-top: 50px">
    <el-form
      :model="value"
      :rules="rules"
      ref="productInfoForm"
      label-width="120px"
      style="width: 600px"
      size="small"
    >
      <el-form-item label="产品分类：" prop="productCategoryId">
        <el-cascader
          :disabled="isActive"
          :options="productCateOptions"
          v-model="selectProductCateValue"
          @change="handleCateChange"
          ref="calssOption"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="产品名称：" prop="name">
        <el-input :disabled="isActive" v-model="value.name"></el-input>
      </el-form-item>
      <el-form-item label="产品品牌：" prop="brandName">
        <el-select
          :disabled="isActive"
          v-model="value.brandName"
          placeholder="请选择品牌"
        >
          <el-option label="添加新品牌" :value="newBrand" @click.native="addNewBrand"></el-option>
          <el-option
            v-for="(item, index) in brandOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品图片：">
        <el-upload
          :disabled="isActive"
          action="http://www.dreamqd.cn:5100/upload"
          list-type="picture-card"
          :limit="1"
          :on-exceed="handleExceed"
          :on-preview="handlePictureCardPreview"
          :file-list="fileList"
          :on-remove="handleRemove"
          :on-success="handle_success"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="产品介绍：">
        <el-input
          :disabled="isActive"
          :autosize="true"
          v-model="value.description"
          type="textarea"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="产品售价：">
        <el-input :disabled="isActive" v-model="value.price"></el-input>
      </el-form-item>

      <el-form-item style="text-align: center">
        <el-button
          type="primary"
          size="medium"
          @click="handleNext('productInfoForm')"
          >下一步，填写商品属性</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getCateGory,
  getBrand,
  getSpgId,
  addSpu,
  getSpu,
  getCatName,
  getBrandName,
  getStorBrands,
} from "@/api/product";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "productInfoDetail",
  data() {
    return {
      value: {
        name: "", // 商品名
        description: "",
        price: "",
        brandName: "",
      },
      newBrand:'',
      isActive: true,
      fileList: [],
      spg_id: "",
      dialogImageUrl: "",
      dialogVisible: false,
      topTitle: ["数码", "服饰"],
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
      brandOptions: [],
      rules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        brandName: [
          { required: true, message: "请输入商品品牌", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    // 编辑的时候进行路由传值获取页面的初始参数
    if (this.$route.query.id) {
      this.isActive = true;
      getCatName({ id: this.$route.query.id })
        .then((res) => {
          console.log(res.data.data);
          let id = res.data.data[0].id;
          let catParentName = res.data.data[0].parent_name
          console.log(catParentName)
          console.log(id)
          for(let i = 0; i < this.productCateOptions.length; i++){
            if(this.productCateOptions[i].label == catParentName){
              this.selectProductCateValue[0] = this.productCateOptions[i].value
              break
            }
          }
          
          this.getProductCateList();
          this.selectProductCateValue.push(`${id}`);
          // console.log(this.productCateOptions,this.selectProductCateValue)
          this.updateCategoryId(this.selectProductCateValue[1]);
          // 获取品牌名
          getStorBrands({ store_id: this.storeInfo.id, category_id: 1 }).then(
            (res) => {
              console.log(res);
              let brandArr = res.data.data;
              this.brandOptions = [];
              for (let i = 0; i < brandArr.length; i++) {
                this.brandOptions.push({
                  label: `${brandArr[i].name}`,
                  value: `${brandArr[i].name}`,
                });
              }
            }
          );
        })
        .catch((err) => {
          console.log(err);
        });
      getSpu({ id: this.$route.query.id }).then((res) => {
        console.log(res.data.data[0]);
        let message = res.data.data[0];
        this.value.name = message.title;
        this.dialogImageUrl = message.img;
        this.fileList.push({
          url: message.img,
        });
        this.value.description = message.sub_title;
        this.value.price = message.price;
      });
      getBrandName({ id: this.$route.query.id })
        .then((res) => {
          console.log(res.data.data);
          this.value.brandName = res.data.data[0].name;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.isActive = false;
      this.getProductCateList();
      this.selectProductCateValue.push("27");
      this.updateCategoryId(1);
      console.log(this.storeInfo.id)
      getStorBrands({ store_id: this.storeInfo.id, category_id: 27 }).then(
        (res) => {
          console.log(res);
          let brandArr = res.data.data;
          for (let i = 0; i < brandArr.length; i++) {
            this.brandOptions.push({
              label: `${brandArr[i].name}`,
              value: `${brandArr[i].name}`,
            });
          }
        }
      );
    }
  },
  methods: {
    ...mapActions("product", [
      "updateProductMessage",
      "updateCategoryId",
      "updateSpuTitle",
    ]),
    handleNext(formName) {
      // 向vuex中添加数据
      this.updateSpuTitle(this.value.name);
      // console.log("点击了下一步");
      this.$refs[formName].validate(async (valid) => {
        // 获取spg_id
        const nameIndex = this.$refs["calssOption"].inputValue.indexOf("/");
        const name = this.$refs["calssOption"].inputValue.substring(
          nameIndex + 2
        );
        console.log(this.storeInfo.id);
        const data = {
          title: this.value.name,
          store_id: this.storeInfo.id,
          spec: name,
          img: this.dialogImageUrl,
          price: this.value.price,
          brand: this.value.brandName,
          sub_title: this.value.description,
        };

        if (valid) {
          console.log("进入下一栏");
          if (this.$route.query.id) {
            this.$emit("nextStep");
          } else {
            // 添加spu
            addSpu(data)
              .then((res) => {
                console.log("添加成功", res);
              })
              .catch((err) => {
                console.log(err);
              });
            this.$emit("nextStep");
          }
        } else {
          this.$message({
            message: "验证失败",
            type: "error",
            duration: 1000,
          });
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
      console.log("改变了分类");
      // console.log(this.selectProductCateValue);
      let brandArr = this.selectProductCateValue;
      this.updateCategoryId(brandArr[1]);
      // 获取品牌名
      console.log(brandArr[1])
      getStorBrands({ store_id: this.storeInfo.id, category_id: brandArr[1] }).then(
        (res) => {
          console.log(res);
          let brandArr = res.data.data;
          this.brandOptions = [];
          for (let i = 0; i < brandArr.length; i++) {
            this.brandOptions.push({
              label: `${brandArr[i].name}`,
              value: `${brandArr[i].name}`,
            });
          }
        }
      );
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.dialogImageUrl = [];
    },
    handle_success(res) {
      console.log(res.files);
      this.dialogImageUrl = res.files;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    addNewBrand(){
      console.log('添加新品牌')
      this.$confirm('添加新的商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
          this.$router.push({
            path:'/product/addBrand',
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },

  computed: {
    ...mapGetters({
      storeInfo: "storeInfo",
    }),
  },
};
</script>

<style>
</style>