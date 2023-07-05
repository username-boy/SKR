<template>
  <div class="productType">
    <el-card shadow="never" style="margin:20px 0;">
      数据列表
      <el-button type="mini" style="float:right;" @click="addParentName">添加</el-button>
    </el-card>
    <el-table :data="tableData" style="width: 100%" border stripe>
      <el-table-column label="编号" prop="id" align="center"></el-table-column>
      <el-table-column label="分类名称" prop="name" align="center">
      </el-table-column>
      <el-table-column label="设置" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="getMenu(scope.$index, scope.row)"
            >查看下级</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="action" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            @click="deleteProductType(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="add">
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
         <el-form>
           <el-form-item>
             <el-select placeholder="请选择一级分类" v-model="category_id">
                <el-option  v-for="(item,index) in addParentNameArr" :value="item.id" :key="index" :label="item.name">{{item.name}}</el-option>
             </el-select>
           </el-form-item>
         </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOk">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getProduct,
  deleteProduct,
  getSubMenu,
  getStock
} from "@/api/product";
import {getMenu,addParent,selectParentNameNUll} from "@/api/menu"
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      tableData: [
        {
          id: "",
          name: "",
          action: ""
        }
      ],
      store_id: "",
      updateName: "",
      dialogVisible: false,
      form: {
        name: ""
      },
      productId: "",
      addParentNameArr:[],
      newaddParentNameArr:[],
      dialogVisible: false,
      category_id:'',
    };
  },
  created() {
    this.selectProduceList();
    console.log(this.id);
  },
  computed: {
    ...mapGetters([
      'storeInfo'
    ])
  },
  mounted() {
    this.isRouterActive = true;
  },
  methods: {
    addOk(){
      addParent({
        store_id:this.storeInfo.id,
        category_id:this.category_id
      }).then(res=>{
        console.log(this.category_id);
        if(res.data.code == 200){
          console.log(res,'插入成功');
          this.dialogVisible = false
          this.$message({
            type:'success',
            message:'插入成功'
          })
        }
        this.dialogVisible = false
        location.reload()
        // this.selectProduceList();
      }).catch(err=>{
        this.$message({
            type:'error',
            message:'插入失败'
          })
        console.log(err,'插入失败');
      })
    },
    addParentName(){
      this.dialogVisible = true
      selectParentNameNUll({
        parent_name:''
      }).then(res=>{
        if(res.data.code == 200){
          console.log(res.data.data);
          this.addParentNameArr = res.data.data
          // for (var i = 0; i <  this.addParentNameArr.length; i++) {
          //   for (var j = i + 1; j < this.addParentNameArr.length; j++) {
          //     if (this.addParentNameArr[i].parent_name ===this.addParentNameArr[j].parent_name) {
          //       this.addParentNameArr.splice(j, 1);
          //       j = j - 1;
          //     }
          //   }
          // }
          console.log(res,'获取一级分类成功');
          for(let i = 0;i<this.addParentNameArr.length;i++){
            this.category_id = this.addParentNameArr[i].id
          }
        }
      }).catch(err=>{
        console.log(err,'获取失败');
      })
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
    selectProduceList() {
      getProduct({
        store_id:this.storeInfo.id
      })
        .then(res => {
          console.log(res, "商品分类获取成功");
          this.tableData = res.data.data;
          console.log(this.tableData);
        })
        .catch(err => {
          console.log(err, "商品分类获取失败");
        });
    },
    // 去重
    // unique(arr) {
    //   const res = new Map();
    //   return arr.filter(
    //     arr =>
    //       !res.has(arr.parent_name) && res.set(arr.parent_name, arr.parent_name)
    //   );
    // },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    deleteProductType(index, row) {
      this.$confirm("是否要删除该品牌", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteProduct({ id: row.id }).then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          console.log(row.id, res);
          location.reload();
        });
      });
    },
    // 获取二级菜单
    getMenu(index, row) {
      console.log(row.name, index);
      this.$router.push({
        path: "/product/productSecondMenu",
        query: {
          parent_name: row.name,
          id: row.id
        }
      });
    }
  }
};
</script>

<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }</style>
