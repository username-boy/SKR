<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="infoModify" :rules="rules" ref="infoModify">
      <el-form-item label="头像上传:" :label-width="formLabelWidth">
        <el-upload
          class="avatar-uploader"
          action="/uploadimg/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <i class="span">点击头像上传</i>
      </el-form-item>
      <el-form-item label="店铺名称:" :label-width="formLabelWidth" prop="name">
        <el-input autocomplete="off" v-model="infoModify.name" placeholder="请输入名称" class="shopName"></el-input>
      </el-form-item>
      <el-form-item label="店铺地址:" :label-width="formLabelWidth" prop="address">
        <el-input
          autocomplete="off"
          v-model="infoModify.address"
          placeholder="请输入地址"
          class="shopName"
        ></el-input>
      </el-form-item>
      <el-form-item label="店铺介绍:" :label-width="formLabelWidth">
        <el-input
          autocomplete="off"
          class="shopName"
          type="textarea"
          v-model="infoModify.desc"
          placeholder="请输入店铺介绍内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系方式:" :label-width="formLabelWidth" prop="tel">
        <el-input
          autocomplete="off"
          v-model="infoModify.tel"
          placeholder="请输入联系方式"
          class="shopName"
        ></el-input>
      </el-form-item>
      <el-form-item label="店铺所在区:" :label-width="formLabelWidth" prop="region">
        <el-input
          autocomplete="off"
          v-model="infoModify.region"
          placeholder="请输入店铺所在区"
          class="shopName"
        ></el-input>
      </el-form-item>
      <el-form-item label="店主姓名" :label-width="formLabelWidth" prop="real_name">
        <el-input
          autocomplete="off"
          v-model="infoModify.real_name"
          placeholder="请输入店主姓名"
          class="shopName"
        ></el-input>
      </el-form-item>
      <el-form-item class="sub">
        <el-button @click=" handleResetSearch()">重 置</el-button>
        <el-button type="primary" @click="submitForm('infoModify')">确认修改</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { addInfoModify, getStoreInfo } from "@/api/infoModify";
 import { mapGetters } from "vuex";
import user from '@/store/modules/user';
export default {
  data() {
    const rulesloginId = (rule, value, callback) => {
      if (!/^1[34578]\d{9}$/.test(value)) {
        callback("手机号信息有误");
      } else {
        callback();
      }
    };
    return {
      imageUrl: [],
      formLabelWidth: "120px",
      infoModify: {
        avatarSrc: "",
        name: "",
        address: "",
        desc: "",
        tel: "",
        region: "",
        real_name: "",
      },

      rules: {
        imageUrl: [
          { required: true, message: "请上传头像", trigger: "change" },
        ],
        name: [
          {
            required: true,
            message: "商品名不能为空！",
            max: 15,
            trigger: "blur",
          },
        ],
        address: [
          { required: true, message: "地址不能为空！", trigger: "blur" },
        ],
        tel: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { validator: rulesloginId, trigger: "blur" },
        ],
        region: [
          { required: true, message: "店铺所在区不能为空！", trigger: "blur" },
        ],
        real_name: [
          { required: true, message: "店主名不能为空！", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    getStoreInfo({
      id: this.store_id.id,
    })
      .then((res) => {
        this.infoModify = res.data.data[0];
        this.imageUrl = res.data.data[0].avatar;
      })
      .catch((err) => {
        console.log(err);
      });
  },
   computed: {
    ...mapGetters({
     store_id:"storeInfo"
    }),
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.infoModify.avatarSrc = file.response.files;
      // this.$refs.elUpload.clearValidate("imageUrl");
      // console.log(141111);
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },

    submitForm(infoModify) {
      this.$refs[infoModify].validate((valid) => {
        if (valid) {
          let data = this.infoModify;
          if (!data.avatarSrc) {
            this.$message({
              message: "请上传图片",
              type: "warning",
            });
            return;
          }
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });

          addInfoModify({
            id: this.store_id.id,
            name: data.name,
            avatar: data.avatarSrc,
            address: data.address,
            desc: data.desc,
            tel: data.tel,
            region: data.region,
            real_name: data.real_name,
          })
            .then((res) => {
              if (res.data.code == 200) {
                loading.close();
                sessionStorage.setItem('user_avatar',this.infoModify.avatarSrc)
                this.$message({
                  message: "修改成功！",
                  type: "success",
                });
                 location.reload();
              } else {
                loading.close();
                this.$message({
                  message: "修改失败！",
                  type: "error",
                });
              }
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
    handleResetSearch() {
      this.infoModify = {};
      this.imageUrl = [];
    },
  },
};
</script>
<style>
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
  width: 100px !important;
  height: 100px !important;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px !important;
  height: 100px !important;
  display: block;
}
.text {
  font-size: 12px;
}
.form-container {
  margin-bottom: 100px;
}
.span {
  position: absolute;
  top: 75px;
  left: 110px;
  font-size: 12px;
  color: #999;
}
.sub{
  margin-left:120px ;
}
</style>


