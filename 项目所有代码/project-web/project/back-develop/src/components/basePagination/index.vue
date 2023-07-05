<template>
  <el-pagination
      class="pagination"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="updateSize($event)"
      @current-change="updatePage($event)"
      hide-on-single-page
      >
    </el-pagination>
</template>

<script>
export default {
    props:{
        total:{
            type:Number,
            required:true,
        },
        pageSize:{
            type:Number,
            default:20
        },
        currentPage:{
            type:Number,
            required:true,
        }
    },
    methods:{
        updatePage(page){
            this.$emit("update:current-page",page)
        },
        updateSize(size){
            this.$emit("update:page-size",size)
        }
    }

}
</script>

<style>

</style>