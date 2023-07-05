<template>
  <div id="secondMenu">
    <el-card shadow="never" style="margin:20px 0;">
      数据列表
      <el-button type="mini" style="float:right;" @click="addName"
        >添加</el-button
      >
    </el-card>
    <el-table :data="secondMenu" border style="margin-top:10px;">
      <el-table-column prop="id" label="编号" align="center"></el-table-column>
      <el-table-column
        prop="name"
        label="商品名称"
        align="center"
      ></el-table-column>
      <el-table-column prop="action" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="deleteSecondMenu(scope.$index, scope.row)"
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
        :before-close="handleClose"
      >
        <el-form>
          <el-form-item>
            <el-select placeholder="请选择二级分类" v-model="category_id">
                <el-option  v-for="(item,index) in addNameArr" :value="item.id" :key="index" :label="item.name">{{item.name}}</el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOkHandle">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getSubMenu, deleteSubmenu, getStock } from "@/api/product";
import { getSecondList, addParent,selectParentNotNull } from "@/api/menu";
import { mapGetters } from "vuex";
import LogoVue from '../../../layout/components/Sidebar/Logo.vue';
export default {
  data() {
    return {
      dialogVisible: false,
      updateName: "",
      secondMenu: [],
      addNameArr: [],
      name: "",
      category_id:'',
      parent_name:''
    };
  },
  created() {
    this.getSecondList();
  },
  computed: {
    ...mapGetters(["storeInfo"])
  },
  methods: {
    addOkHandle() {
      addParent({
        store_id: this.storeInfo.id,
        category_id:this.category_id
      })
        .then(res => {
          console.log(this.category_id);
          if (res.data.code == 200) {
            console.log(res, "插入成功");
            this.dialogVisible = false;
            this.$message({
              type: "success",
              message: "插入成功"
            });
            this.getSecondList();
          }else{
            this.$message({
            type: "error",
            message: "插入失败"
          });
          }
          this.dialogVisible = false;
        })
        .catch(err => {
          console.log(err, "插入失败");
        });
    },
    addName() {
      this.dialogVisible = true;
      console.log(this.parent_name);
      selectParentNotNull({
        parent_name:this.$route.query.parent_name
      }).then(res=>{
        this.addNameArr = res.data.data;
        // for (var i = 0; i < this.addNameArr.length; i++) {
        //       for (var j = i + 1; j < this.addNameArr.length; j++) {
        //         if (
        //           this.addNameArr[i].name ===
        //           this.addNameArr[j].name
        //         ) {
        //           this.addNameArr.splice(j, 1);
        //           j = j - 1;
        //         }
        //       }
        //     }
            console.log(this.addNameArr);
            for (let i = 0; i < this.addNameArr.length; i++) {
              this.name = this.addNameArr[i].name;
              this.category_id = this.addNameArr[i].id;
            }
            console.log(this.name,this.category_id);
      }).catch(err=>{
        console.log(err,'获取失败');
      })
      // getSecondList({
      //   store_id:this.storeInfo.id,
      //   parent_name: this.$route.query.parent_name
      // })
      //   .then(res => {
      //     if (res.data.code == 200) {
      //       console.log(res, "获取成功");
      //       this.addNameArr = res.data.data;
      //       for (var i = 0; i < this.addNameArr.length; i++) {
      //         for (var j = i + 1; j < this.addNameArr.length; j++) {
      //           if (
      //             this.addNameArr[i].name ===
      //             this.addNameArr[j].name
      //           ) {
      //             this.addNameArr.splice(j, 1);
      //             j = j - 1;
      //           }
      //         }
      //       }
      //       console.log(this.addNameArr);
      //       for (let i = 0; i < this.addNameArr.length; i++) {
      //         this.name = this.addNameArr[i].name;
      //         this.category_id = this.addNameArr[i].id;
      //       }
      //       console.log(this.category_id);
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err, "获取失败");
      //   });
    },
    getSecondList() {
      getSecondList({
        store_id:this.storeInfo.id,
        parent_name:this.$route.query.parent_name
      }).then(res=>{
        this.secondMenu = res.data.data;
        console.log(res,'获取成功');
      }).catch(err=>{
        console.log(err,'获取失败');
      })
      // getSubMenu({
      //   parent_name: this.$route.query.parent_name
      // })
      //   .then(res => {
      //     this.secondMenu = res.data.data;
      //     console.log(this.secondMenu);
      //     console.log(res, "获取父级名称成功啦");
      //   })
      //   .catch(err => {
      //     console.log(err, "获取父级名称失败");
      //   });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    deleteSecondMenu(index, row) {
      console.log(row);
      deleteSubmenu({
        id: row.id,
        parent_name: this.parent_name
      })
        .then(res => {
          console.log(res, "删除成功了呦");
          location.reload();
        })
        .catch(err => {
          console.log(res, "删除失败了啊");
        });
    }
  }
};
</script>
