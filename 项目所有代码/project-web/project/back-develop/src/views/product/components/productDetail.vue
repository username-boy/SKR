<template>
  <el-card class="form-container" shadow="never">
    <product-info-detail
      v-if="showStatus[0]"
      @nextStep="nextStep"
    ></product-info-detail>
    <productAttrDetail
    v-if="showStatus[1]"
    @prevStep="prevStep"
    @finishCommit="finishCommit"
    @finishCommitUpdate="finishCommitUpdate"
    ></productAttrDetail>
  </el-card>
</template>

<script>
import productInfoDetail from './productInfoDetail';
import productAttrDetail from './productAttrDetail';
import {addSku,updateSku} from '@/api/product'
export default {
  components: {productInfoDetail,productAttrDetail},
  data(){
    return {
      active:0,
      showStatus: [true,false]
    }
  },
  created(){

  },
  methods:{
    hideAll(){
      for (let i = 0; i < this.showStatus.length; i++){
        this.showStatus[i] = false;
      }
    },
    nextStep(){
      if(this.active < this.showStatus.length - 1){
        console.log('开始进入下一页')
        this.active++;
        this.hideAll();
        this.showStatus[this.active] = true
        // let arr = this.showStatus
        this.showStatus = [...this.showStatus];
      }
    },
    prevStep(){
      console.log('进入了父组件的上一页函数')
      if(this.active>0&&this.active<this.showStatus.length){
        this.active--;
        this.hideAll();
        this.showStatus[this.active] = true;
        this.showStatus = [...this.showStatus];
      }
    },
    finishCommit(obj){
      this.$confirm('是否要提交该产品','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        console.log(obj)
        addSku(obj).then(res=>{
          console.log(res.data)
        })
      })
    },
    finishCommitUpdate(data){
      this.$confirm('是否要提交该产品','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(async ()=>{
        console.log(data)
        for(let i = 0; i < data.length; i++){
          console.log(data[i])
          await updateSku(data[i]).then(res=>{
            console.log(i + '修改成功',res)
          })
        }
      })
    }
  }
}
</script>

<style>
.form-container {
  width: 800px;
}
</style>