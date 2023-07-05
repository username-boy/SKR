<template>
  <div>
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right;margin-top: 35px"
          type="primary"
          size="small"
          @click="handleSearchList()"
        >查询结果</el-button>
        <el-button
          style="float: right;margin-top: 35px;margin-right:15px"
          @click="handleResetSearch()"
          size="small"
        >重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 200px" v-model="keyword" placeholder="商品名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div>
      <el-card class="filter-container" shadow="never">
        <i class="el-icon-tickets"></i>
        <span>数据列表</span>
        <el-button
          style="float: right; width:80px"
          type="primary"
          size="small"
          @click="addShopCerent"
        >添加</el-button>
      </el-card>
    </div>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="90" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="180" align="center">
          <template slot-scope="scope">
            <img style="height: 80px" :src="scope.row.img" />
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.title}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="120" align="center">
          <template slot-scope="scope">
            <p>￥{{scope.row.price}}</p>
          </template>
        </el-table-column>
        <el-table-column label="SKU库存" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleShowSkuEditDialog(scope.$index, scope.row)"
              circle
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="120" align="center">
          <template>1200</template>
        </el-table-column>
        <el-table-column label="操作" width="260" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleShowSkuEditDialog1(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" @click="handleAddCoupon(scope.$index,scope.row)">添加优惠券</el-button>
            <el-button
              size="mini"
              type="danger"
              @click.native.prevent="handleDelete(scope.$index,scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="产品信息" :visible.sync="dialogVisible" width="40%">
      <el-table style="width: 100%;margin-top: 10px" :data="stockList" border>
        <el-table-column
          v-for="(item,index) in productAttr"
          :label="item.name"
          :key="item.id"
          align="center"
        >
          <template slot-scope="scope">{{getProductSkuSp(scope.row,index)}}</template>
        </el-table-column>
        <el-table-column label="销售价格" width="150" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price" disabled></el-input>
          </template>
        </el-table-column>
        <el-table-column label="商品库存" width="150" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stock" disabled></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSpu,
  deleteSpu,
  getSpecParam,
  getShopData,
  updataShopData,
  getSearchList,
  deleteSkuShop,
} from "@/api/shopList";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      readonly: true,
      list: [],
      dialogVisible: false,
      productAttr: [],
      stockList: [],
      // spg_id: "",
      // spu_id: "",
      query: "",
      ruleForm: {
        name: "",
        price: "",
      },
      url: "",
      shopId: "",
      formLabelWidth: "120px",
      fileList: [],
      keyword: "",

      rules: {
        //表单
        name: [
          {
            required: true,
            message: "商品名不能为空！",
            max: 15,
            trigger: "blur",
          },
        ],
        price: [
          {
            required: true,
            message: "价格不能为空且为数字！",
            trigger: "blur",
            pattern: /^\d*$/,
          },
        ],
      },
    };
  },
  created() {
    this.getShopList();
  },
  computed: {
    ...mapGetters({
      store_id: "storeInfo",
    }),
  },
  methods: {
    handleShowSkuEditDialog(index, row) {
      console.log(row, "------");
      this.dialogVisible = true;
      this.getSpec(row.spg_id);
      this.getData(row.id);
    },

    handleShowSkuEditDialog1(index, row) {
      this.shopId = row.id;
      this.$router.push({
        path: "/product/addProduct",
        query: {
          id: row.id,
        },
      });
    },
    getShopList() {
      getSpu({
        store_id: this.store_id.id,
      })
        .then((res) => {
          let { data } = res;
          let data1 = data.data;
          this.list = data1;
          this.spg_id = data1[0].spg_id;

          console.log(this.spg_id);
          console.log(this.spu_id);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleDelete(index, row) {
      this.$confirm("是否要进行删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let ids = row.id;
        this.list.splice(index, 1);
        deleteSpu({
          id: ids,
        })
          .then((res) => {
            console.log(res);

            deleteSkuShop({
              spu_id: row.id,
            })
              .then(() => {
                console.log("sku表中删除成功");
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    getSpec(spg_id) {
      getSpecParam({
        spg_id: spg_id,
      })
        .then((res) => {
          let { data } = res;
          let data1 = data.data;
          this.productAttr = data1;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getData(spu_id) {
      getShopData({
        spu_id: spu_id,
      })
        .then((res) => {
          let { data } = res;
          let data2 = data.data;
          this.stockList = JSON.parse(JSON.stringify(data2));
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getProductSkuSp(row, index) {
      let spData = JSON.parse(row.param);
      if (spData != null && index < spData.length) {
        return spData[index].value;
      } else {
        return null;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = this.ruleForm;
          updataShopData({
            id: this.shopId,
            title: data.name,
            img: this.url,
            price: data.price,
          })
            .then(() => {
              console.log("更新成功");
              this.dialogVisible1 = false;
              location.reload();
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    handleSearchList() {
      // this.listQuery.pageNum = 1;
      getSearchList({
        keyword: this.keyword,
      })
        .then((res) => {
          let { data } = res;
          let data1 = data.data;
          this.list = data1;
          this.spg_id = data1[0].spg_id;
          this.spu_id = data1[0].id;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleResetSearch() {
      this.keyword = "";
    },
    addShopCerent() {
      this.$router.push({
        path: "/product/addProduct",
      });
    },
    handleAddCoupon(index, row) {
      this.$router.push({
        path: "/market/addCoupon",
        query: { spu_id: row.id },
      });
      console.log(row.id);
    },
  },
};
</script>
<style>
.filter-container {
  border: 1px solid #eee;
  margin-top: 20px;
}
.table-container {
  margin-top: 20px;
}
.pagintion {
  margin-top: 20px;
  float: right;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.shopName,
.shopPrice {
  width: 60%;
}
.sub {
  margin-left: 120px;
}
.pagination {
  margin-top: 20px;
  float: right;
}
.base-pagination {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}
</style>