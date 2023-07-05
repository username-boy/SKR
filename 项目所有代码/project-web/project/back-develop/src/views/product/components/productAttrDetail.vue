<template>
  <div style="margin-top: 50px">
    <el-form
      :model="value"
      ref="productAttrForm"
      label-width="120px"
      style="width: 720px"
      size="small"
    >
      <el-form-item label="商品规格：">
        <el-card shadow="never" class="cardBg">
          <div
            v-for="(item, index) in selectProductParam"
            :key="index"
            class="littleMarginTop"
          >
            <div>
              {{ item.name }}：
              <div>
                <el-checkbox-group v-model="checkProductAttr[index]">
                  <div
                    v-for="(item, idx) in selectProductAttr[index]"
                    style="display: inline-block"
                    class="littleMarginLeft"
                    :key="idx"
                  >
                    <el-checkbox :label="item"></el-checkbox>
                    <el-button
                      :disabled="isActive"
                      type="text"
                      class="littleMarginLeft"
                      @click="handleRemoveProductAttrValue(index, idx)"
                      >删除</el-button
                    >
                  </div>
                </el-checkbox-group>
              </div>
            </div>
            <el-input
              style="width: 160px; margin-left: 10px"
              v-model="param[index]"
            ></el-input>
            <el-button
              :disabled="isActive"
              class="littleMarginLeft"
              @click="handleAddProductAttrValue(index)"
              >增加</el-button
            >
          </div>
        </el-card>

        <!-- table -->
        <el-table
          style="width: 100%; margin-top: 20px"
          border
          :data="skuParamList"
        >
          <el-table-column
            v-for="(item, index) in selectProductParam"
            :key="index"
            :label="item.name"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.param[index] }}
            </template>
          </el-table-column>
          <el-table-column label="销售价格" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.price"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="商品库存" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stock"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleRemoveProductSku(scope.$index, scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          :disabled="isActive"
          type="primary"
          style="margin-top: 20px"
          @click="handleRefreshProductSkuList"
          >刷新列表</el-button
        >
      </el-form-item>

      <el-form-item label="商品相册：">
        <el-upload
          action="http://www.dreamqd.cn:5100/upload"
          list-type="picture-card"
          :limit="4"
          :on-exceed="handleExceed"
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

      <el-form-item label="规格参数">
        <el-tabs v-model="activeHtmlName" type="card">
          <el-tab-pane label="电脑端详情" name="pc">
            <tinymce :width="595" :height="300" v-model="detailHtml"></tinymce>
          </el-tab-pane>
          <el-tab-pane label="移动端详情" name="mobile">
            <tinymce
              :width="595"
              :height="300"
              v-model="detailMobileHtml"
            ></tinymce>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>

      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev"
          >上一步，填写商品信息</el-button
        >
        <el-button type="primary" size="medium" @click="handleFinishCommit"
          >完成，提交商品</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getSpecParam,
  getCateGory,
  getSpgId,
  getSpu,
  getSku,
  deleteSku,
  updateSku,
  deletSpu,
} from "@/api/product";
let result = [];
let results = [];
import { mapGetters } from "vuex";
import Tinymce from "@/components/Tinymce";
import { parse } from "path-to-regexp";
export default {
  name: "productAttrDetail",
  components: {
    Tinymce,
  },
  data() {
    return {
      isActive: true,
      stock: "",
      value: {},
      selectProductParam: [],
      dialogImageUrl: [],
      fileList: [],
      dialogVisible: false,
      param: [],
      skuPrice: "",
      spg_id: "",
      selectProductAttr: [],
      checkProductAttr: [],
      skuParamList: [],
      //商品富文本详情激活类型
      activeHtmlName: "pc",
      detailHtml: "", // 电脑端商品详情的html
      detailMobileHtml: "", // 移动端商详情品的html
    };
  },
  created() {
    this.isActive = false;
    getCateGory({ category_id: this.category_id })
      .then((res) => {
        // console.log(res.data.data[0].name)
        let name = res.data.data[0].name;
        getSpgId({ name: name }).then((res) => {
          // console.log(res.data.data[0].id)
          this.spg_id = res.data.data[0].id;
          getSpecParam({ spg_id: this.spg_id })
            .then((res) => {
              console.log(res.data.data);
              this.selectProductParam = res.data.data;
              for (let i = 0; i < this.selectProductParam.length; i++) {
                if (!this.$route.query.id) {
                  this.selectProductAttr.push([]);
                }
                this.checkProductAttr.push([]);
              }
            })
            .catch((err) => {});
        });
      })
      .catch((err) => {
        console.log(err);
      });
    if (this.$route.query.id) {
      this.isActive = true;
      // 替代的空数组
      let newSelectProductAttr = [];

      getSku({ spu_id: this.$route.query.id })
        .then((res) => {
          // console.log(res.data.data);
          let skuMessageArr = res.data.data;
          // 增加空数组
          let arr = JSON.parse(skuMessageArr[0].param);
          for (let i = 0; i < arr.length; i++) {
            newSelectProductAttr.push([]);
          }
          for (let i = 0; i < skuMessageArr.length; i++) {
            // console.log(skuMessageArr[i])
            let param = JSON.parse(skuMessageArr[i].param);
            // console.log(param);
            let getParam = [];
            for (let k = 0; k < param.length; k++) {
              newSelectProductAttr[k].push(param[k].value);
              getParam.push(param[k].value);
            }
            // 将获取到的表格数据渲染后，将其他数据进行插入
            this.skuParamList.push({
              param: getParam,
              price: skuMessageArr[i].price,
              stock: skuMessageArr[i].stock,
              id: skuMessageArr[i].id,
            });
            console.log(this.skuParamList);
          }
          // 图片渲染
          let imgArr = JSON.parse(skuMessageArr[0].imgs);
          console.log(imgArr);
          this.dialogImageUrl = imgArr;
          for (let i = 0; i < imgArr.length; i++) {
            this.fileList.push({
              url: imgArr[i],
            });
          }
          // 商品详情渲染
          this.detailHtml = skuMessageArr[0].desc_pc;
          this.detailMobileHtml = skuMessageArr[0].desc_app;

          for (let i = 0; i < newSelectProductAttr.length; i++) {
            newSelectProductAttr[i] = Array.from(
              new Set(newSelectProductAttr[i])
            );
          }

          this.selectProductAttr = JSON.parse(
            JSON.stringify(newSelectProductAttr)
          );
          // console.log(this.selectProductAttr);
          this.checkProductAttr = JSON.parse(
            JSON.stringify(this.selectProductAttr)
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  computed: {
    ...mapGetters({
      category_id: "category_id",
      spuTitle: "spuTitle",
    }),
  },

  methods: {
    // 刷新列表
    // handleRefreshProductSkuList() {
    //   this.skuParamList = [];
    //   console.log(this.checkProductAttr);
    //   let arr_list = [];
    //   for (let i = 0; i < this.checkProductAttr.length - 1; i++) {
    //     for (let k = 0; k < this.checkProductAttr[i].length; k++) {
    //       for (let j = 0; j < this.checkProductAttr[i + 1].length; j++) {
    //         arr_list = [this.checkProductAttr[i][k]];
    //         // arr_list.push(this.checkProductAttr[i][k])
    //         arr_list.push(this.checkProductAttr[i + 1][j]);
    //         console.log(arr_list);
    //         this.skuParamList.push({
    //           param: arr_list,
    //           price: "",
    //           stock: "",
    //         });
    //       }
    //     }
    //   }
    // },

    // 刷新列表
    handleRefreshProductSkuList() {
      results = [];
      result = [];
      this.combin(this.checkProductAttr, 0);
      results = results.map((item) => {
        item=JSON.parse(item);
        return Object.assign({},{param:item,price:"",stock:""})
      });
      this.skuParamList=results
    },
    // 组合参数
    combin(arr, depth) {
      for (let i = 0; i < arr[depth].length; i++) {
        result[depth] = arr[depth][i];
        if (depth != arr.length - 1) {
          this.combin(arr, depth + 1);
        } else {
          results.push(JSON.stringify(result));
        }
      }
    },
    // 增加参数
    handleAddProductAttrValue(index) {
      console.log(index);
      this.selectProductAttr[index].push(this.param[index]);
      console.log(this.param[index], this.selectProductAttr);
    },
    // 删除参数
    handleRemoveProductAttrValue(index, idx) {
      for (let i = 0; i < this.checkProductAttr.length; i++) {
        for (let k = 0; k < this.checkProductAttr[i].length; k++) {
          if (
            this.selectProductAttr[index][idx] == this.checkProductAttr[i][k]
          ) {
            this.checkProductAttr[i].splice(k, 1);
          }
        }
      }
      this.selectProductAttr[index].splice(idx, 1);
    },
    // 删除table渲染的列表
    handleRemoveProductSku(index, row) {
      this.skuParamList.splice(index, 1);
      if (this.$route.query.id) {
        deleteSku({ id: row.id })
          .then((res) => {
            // if(res.data.code == 200){
            //   console.log('删除成功');
            // }
            console.log(res);
            if (this.skuParamList.length == 0) {
              // 当sku为0时，删除对应的spu
              this.$confirm(
                "您以删除该产品下的所有商品，是否删除此产品",
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                }
              ).then(() => {
                deletSpu({ id: this.$route.query.id }).then((res) => {
                  console.log(res);
                });
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    handleRemove(file, fileList) {
      if (this.$route.query.id) {
        this.dialogImageUrl = this.dialogImageUrl.filter((item) => {
          return item != file.url;
          // console.log(item)
        });
      } else {
        this.dialogImageUrl = this.dialogImageUrl.filter((item) => {
          return item != file.response.files;
        });
      }

      console.log(this.dialogImageUrl);
    },
    handle_success(res) {
      this.dialogImageUrl.push(res.files);
    },
    handlePrev() {
      this.$emit("prevStep");
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    // 点击提交商品
    handleFinishCommit() {
      getSpu({ title: this.spuTitle })
        .then((res) => {
          let spu_id = res.data.data[0].id;
          let newSkuParamList = [];
          newSkuParamList = JSON.parse(JSON.stringify(this.skuParamList));
          for (let i = 0; i < newSkuParamList.length; i++) {
            let param = newSkuParamList[i].param;
            let newParam = [];
            for (let k = 0; k < param.length; k++) {
              console.log(param[k]);
              newParam.push({
                key: `${this.selectProductParam[k].name}`,
                value: `${param[k]}`,
              });
            }
            newSkuParamList[i].param = JSON.stringify(newParam);
            newSkuParamList[i].title = this.spuTitle;
            newSkuParamList[i].spu_id = spu_id;
            newSkuParamList[i].imgs = JSON.stringify(this.dialogImageUrl);
            newSkuParamList[i].detailHtml = this.detailHtml;
            newSkuParamList[i].detailMobileHtml = this.detailMobileHtml;
          }
          let goBackSkuParamList = [];
          for (let i = 0; i < newSkuParamList.length; i++) {
            // console.log(Object.values(newSkuParamList[i]))
            goBackSkuParamList = goBackSkuParamList.concat([
              ...Object.values(newSkuParamList[i]),
            ]);
          }
          let obj = {
            params: goBackSkuParamList,
          };
          if (this.$route.query.id) {
            this.$emit("finishCommitUpdate", newSkuParamList);
          } else {
            this.$emit("finishCommit", obj);
          }

        //   if(res.code==200){
        //     this.$$message({
        //       message:'添加成功',
        //       type:'success'
        //     })
        //   }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.cardBg {
  background: #f8f9fc;
}
.paramInput {
  width: 250px;
}
.paramInputLabel {
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 10px;
}
.littleMarginTop {
  margin-top: 10px;
}
.littleMarginLeft {
  margin-left: 10px;
}
</style>