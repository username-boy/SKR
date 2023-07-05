<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i> <span>筛选搜索</span>
        <el-button style="float: right" type="primary" size="small" @click="selctActive"> 查询搜索</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form size="small" label-width="140px">
          <el-form-item label="活动名称:">
            <el-input class="input-width" placeholder="活动名称" v-model="inputText" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="filter-container" shadow="never">
      <i class="el-icon-tickets"></i> <span>数据列表</span>
      <el-button class="btn-add" size="mini" style="margin-left: 20px" @click="handleAdd">添加活动</el-button>
    </el-card>
    <div>
      <el-table style="width: 100%" border :data="tableData" >
        <el-table-column label="id" width="100" align="center" prop="id"></el-table-column>
        <el-table-column label="秒杀商品编号" width="120" align="center" prop="spu_id"></el-table-column>
        <el-table-column label="活动标题" align="center" prop="active_name"></el-table-column>
        <el-table-column label="活动状态" width="140" align="center">
          <template slot-scope="scope">{{scope.row|formatActiveStatus}}</template>
        </el-table-column>
        <el-table-column label="开始时间" width="200" align="center" prop="star_time"></el-table-column>
        <el-table-column label="结束时间" width="200" align="center" prop="end_time" ></el-table-column>
        <el-table-column prop="id" label="操作" width="180" align="center">
          <template :data="tableData" slot-scope="scope">
            <el-button size="mini" type="text" @click.native="getspu(scope.row)">修改商品</el-button>
            <el-button size="mini" type="text" @click.native="handleUpdate(scope.row)">编辑活动</el-button>
            <el-button size="mini" type="text" @click.native="handleDelete(scope.$index, scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加活动" width="%40" :visible.sync="dialogVisible">
      <list :editForm='editForm' />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑信息" width="%40" :visible.sync="editVisible">
      <list :editForm='editData' />
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleEdit(editData)" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑秒杀商品信息" width="%40" :visible.sync="spuVisible">
      <el-form :data="spuData" label-width="150px" size="small">
        <el-form-item label="商品名称">{{spuData.title}}</el-form-item>
        <el-form-item label="产品原价格">{{spuData.price}}元</el-form-item>
        <el-form-item label="秒杀优惠价格"><el-input  v-model="spuData.special_price"></el-input></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="spuVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handlespu(spuData)" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查看信息" width="75%" :visible.sync="selectVisible">
      <el-table :data="selectData">
        <el-table-column prop="spu_id" label="秒杀商品"></el-table-column>
        <el-table-column prop="active_name" label="活动标题"></el-table-column>
       <el-table-column label="活动状态" width="140" align="center">
          <template slot-scope="scope">{{scope.row|formatActiveStatus}}</template>
        </el-table-column>
        <el-table-column prop="star_time" width="180" label="开始时间"></el-table-column>
        <el-table-column prop="end_time"  width="180" label="结束时间"></el-table-column>
        <el-table-column prop="id" label="操作" width="180" align="center">
          <template :data="selectData" slot-scope="scope">
            <el-button size="mini" type="text" @click.native="getspu(scope.row)">修改商品</el-button>
            <el-button size="mini" type="text" @click.native="handleUpdate(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click.native="handleDelete(scope.$index, scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleEdit(selectData)" size="small">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import List from "@/components/list/index";
import { addSpike, getSpike, delSpike,slectSpike,updateSpike,getSpu,updataSup} from "@/api/spike";
import { formatDate } from "@/utils/date";
export default {
  components:{
    List,
  },
  data() {
    return {
      inputText:'',
      tableData: [],
      spuVisible:false,
      editVisible:false,
      dialogVisible: false,
      selectVisible:false,
      editForm:{}, //添加活动
      editData:{}, //编辑活动
      selectData:[],
      active_status:'活动未开始', // 活动状态
      spuData:[], // 存放秒杀的商品信息
    };
  },
  created() {
    this.getSpike({ id: 1 });
  },
  filters: {
      formatActiveStatus(row) {
        let start = Number (new Date(row.star_time).getTime());
        let end = Number (new Date(row.end_time).getTime());
        let nowTime = new Date().getTime();
        if (nowTime >= start && nowTime <= end) {
          return '活动进行中';
        } else if (nowTime > end) {
          return '活动已结束';
        } else {
          return '活动未开始';
        }
      },
      formatDate(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd')
      }
    },
  methods: {
    handleAdd() {
      this.dialogVisible = true;
    },
    // 获取秒杀的商品价格信息 
    getspu(row){
      // console.log(row.spu_id)
      getSpu({id:row.spu_id}).then(res=>{
        // console.log(res.data.code,'点击修改产品')
        this.spuData = res.data.data[0]
        // console.log(this.spuData)
        this.spuVisible = true
      }).catch(err=>{console.log(err)})
    },
    handlespu(data){
      this.spuVisible = false
      data.is_special = 2
      // console.log(data.is_special,'修改spu的参数')
      // console.log(data,'修改spu的参数11111111111111111')
      updataSup(data).then(res=>{
        // console.log(res,'qqqqqqqqqqqqqqqq')
      }).catch(err=>{console.log(err,'信息修改失败')})
    },
    // 展示商品链接
    getSpike(param) {
      getSpike(param).then((res) => {
          this.tableData = res.data.res
        }).catch((err) => {});
    },
    // 添加活动模块
    handleDialogConfirm() {
      this.editForm.star_time = new Date(this.editForm.star_time).getTime();
      this.editForm.end_time = new Date(this.editForm.end_time).getTime();
      addSpike(this.editForm).then((res) => {
          // console.log(res.data.code,'添加活动模块0000000');
          if(res.data.code == 401){
            this.$message({
              message:'添加失败，未添加活动信息',
              type:'warning'
            })
          }
          if(res.data.code == 501){
          this.$message({
            message:'被添加的商品不存在，请重新添加',
            type:'warning'
          })
          }
          this.getSpike({ id: 1 });
        }).catch((err) => {
          console.log("添加活动模块失败");
        });
      this.dialogVisible = false;
      
    },
    // 删除活动
    handleDelete(index, id) {
        delSpike({ id: id }).then((res) => {
            this.getSpike({ id: 1 });
          }) .catch((err) => {
          });
      delSpike({ id: id }).then((res) => {
          // console.log(res);
          this.getSpike({ id: 1 });
        }) .catch((err) => {
          console.log(err);
        });
    },
    // 更新商品模块
    handleUpdate(row) {
      // console.log(row);
      this.editData = row;
      this.editVisible = true;
    },
    // 点击确认后编辑 
    handleEdit(data){
      data.star_time =  new Date(data.star_time).getTime();
      data.end_time =  new Date(data.end_time).getTime();
      updateSpike(data).then(res=>{
        if(res.data.code == 200){
             this.$message({
              message:'秒杀信息修改成功',
              type:'success'
            })
        }
      }).catch(err=>{
        // console,log(err)
      })
      this.editVisible = false
      this.selectVisible = false
      this.getSpike({id:1});
    },
    // 查找模块
    selctActive(){
      slectSpike({active_name:this.inputText}).then((res)=>{
        this.selectData = res.data.res
        // console.log(this.selectData)
        this.selectVisible = true
      }).catch(err=>{
        console.log(err)
      })
    }
  },
};
</script>

<style>
.input-width {
  width: 200px;
}
.filter-container {
  margin: 20px;
}
.btn-add {
  float: right;
}
</style>