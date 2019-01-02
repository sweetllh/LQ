<template>
    <!-- 签章列表 -->
  <div class="signListWrap">
  	<!--签章列表-->
  	<div v-if="!signList.length && !listLoading" class="dataNOne">{{dataNOne}}</div>
  	<div class="listLoading" v-if="listLoading">
	  	<img src="../../../assets/img/tableLoading.gif" width="20"/>
	  	<div>拼命加载中</div>
	</div>
    <el-row tag="ul" class="qz_list" >
      <el-col tag="li" class="clearfix" :xs="24" :sm="12" :md="8" :lg="8" :xl="8"
      	v-for="(item,index) in signList" :key="item.ID" >
      	<div class="listWrap">
      		<img :src="item.Image" alt="">
	        <span class="qz_status" :class="[{'active':item.IsDefault}]" @click="setDefault(item.ID,index)">默认</span>
	        <span class="qz_delete" @click="deleteSignCont(item.ID,index)">删除</span>
      	</div>
      </el-col>
    </el-row>
    
     <!-- 删除签章弹窗-->
	  <my-dialog :is-show="isShowDeleteDialog" title="提示信息" @on-close="closeDialog('isShowDeleteDialog')">
	  	<div class="dialog">
	  		<div class="dialogCont">你确定删除此签章吗?</div>
	  		<div class="btn-ground">
	  			<button type="button" @click="deleteSign()">确定</button>
	  		</div>
	  	</div>
	  </my-dialog>
	  
	 
	     
	    <alert-dialog :is-show="isShowAlert && type=='confirm'" :alertCont="alertContent" 
	  		:type="type" @on-close="closeAlert" @confirm="ruqestOne"></alert-dialog>
	  		
	  	<alert-dialog :is-show="isShowAlert && type!='confirm'" :alertCont="alertContent" 
	  		:type="type" @on-close="closeAlert"></alert-dialog>
	     
    
  </div>

</template>


<script>
export default {
  components: {
  	
  },
  data() {
    return {
      userInfo: "",
      signList: [], //签章列表
      Url:"",		//画板
      isShowDeleteDialog: false,
      isShowAlertDialog: false,
      alertCont: "",
      deleteId: "",
      deleteIndex: 0,
      isShowAlert: false,
      alertContent: "",
      type: "default",
      listLoading: false,
      dataNOne: "您还没有自己的签章，赶紧添加一个吧。"
    };
  },
  computed: {
      
    },
  watch: {
  	
  },
  created() {
  	this.userInfo = JSON.parse(sessionStorage.getItem("LQUserInfo")) || false;
    this.getSign();
  },
  methods: {
     //我的签章列表
    getSign() {
      var _this = this;
      _this.listLoading = true;
      this.$axios({
        method: "post",
        url: _this.$link + "api/Signature/Data",
        headers: { "access-token": _this.userInfo.Token }
      })
        .then(res => {
         // console.log(res.data,'000');
         _this.listLoading = false;
          if (res.data.Code == 0) {
             _this.signList = res.data.Data
          } else if (res.data.Code == 400) {
            _this.$router.push({ path: "/login" });
            return;
          }else{
          	_this.dataNOne = res.data.Message;
          	//console.log(res.data.Message);
          }
        })
        .catch(err => {
          //console.log(err);
          _this.listLoading = false;
          _this.dataNOne = "网络出错，请稍后再试";
        });
    },
    ruqestOne(){
    	this.getSign();//重新请求
    },
    //设置默认签章
    setDefault(id, index) {
      if (this.signList[index].IsDefault) {
      	this.isShowAlertDialog = true;
        this.alertCont = "该签章已经为用户默认签章";
      	return;
      }
      var _this = this;
      this.$axios({
        method: "post",
        url: _this.$link + "api/Signature/Default",
        headers: { "access-token": _this.userInfo.Token },
        data: {
          timestamp: "1",
          SecretId: "3",
          Signature: "4",
          Data: { ID: id }
        }
      })
        .then(res => {
         // console.log(res.data);
          if (res.data.Code == 0) {
          	_this.type = "confirm";
	        _this.isShowAlert = true;
	        _this.alertContent = "设置默认签章成功";
          	//_this.getSign();//重新请求
            
          }else if (res.data.Code == 400) {
	          _this.$router.push({ path: "/login" });
	      }else{
          	_this.isShowAlertDialog = true;
          	_this.alertCont = res.data.Message;
          	//alert(res.data.Message)
          }
        })
        .catch(err => {
          //console.log(err);
          _this.type = "defalut";
	      _this.isShowAlert = true;
	      _this.alertContent = "网络出错，请稍后再试";
        });
    },
    
    //删除签章
    deleteSignCont(id,index){
    	this.isShowDeleteDialog = true;
    	this.deleteId = id;
    	this.deleteIndex = index;
    },
    deleteSign(){
      this.isShowDeleteDialog = false;
      var _this = this;
      this.$axios({
        method: "post",
        url: _this.$link + "api/Signature/Delete",
        headers: { "access-token": _this.userInfo.Token },
        data: {
          timestamp: "1",
          SecretId: "3",
          Signature: "4",
          Data: { ID: _this.deleteId }
        }
       })
        .then(res => {
         //console.log(res.data);
          if (res.data.Code == 0) {
          	//_this.reload();
          	_this.type = "defalut";
	      	_this.isShowAlert = true;
	     	_this.alertContent = "删除签章成功";
          	_this.signList.splice(_this.deleteIndex,1);
          	
          }else if (res.data.Code == 400) {
	          _this.$router.push({ path: "/login" });
	      }else{
          	_this.type = "defalut";
	      	_this.isShowAlert = true;
	     	_this.alertContent = res.data.Message;
          	//alert(res.data.Message)
          }
        })
        .catch(err => {
          //console.log(err);
          _this.type = "defalut";
	      _this.isShowAlert = true;
	      _this.alertContent = "网络出错，请稍后再试";
        });
    },
    
    closeDialog(attr){
    	this[attr] = false;
    },
    
    //添加新的签章
    addSignature(){
    	this.$router.push({path: "/account/signatureMGT/addSignature"})
    },
    
    closeAlert(){
  		this.isShowAlert = false;
  		this.alertContent = "";
    },
  },
  
  
  
};
</script>

<style scoped>
	@import '../../../assets/css/accountCommon.css';
	@import '../../../assets/css/dialogCont.css';
	.signListWrap{
		position: relative;
	}
	.dataNOne{
		width: 100%;
		line-height: 30px;
		font-size: 14px;
		text-align: center;
	}
	.qz_list {
	  width: 100%;
	}
	.qz_list li {
	  height: 140px;
	  box-sizing: border-box;
	  margin-bottom: 20px;
	  padding: 0 20px;
	}
	
	.qz_list li .listWrap{
		height: 140px;
		border: 1px solid #d4d4d4;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.qz_list li img {
	  max-height: 80px;
	  max-width: 240px;
	  width: auto;
	}
	.qz_status {
	  display: block;
	  width: 38px;
	  height: 20px;
	  border: 1px solid #b3b3b3;
	  color: #b3b3b3;
	  line-height: 20px;
	  text-align: center;
	  font-size: 14px;
	  border-radius: 2px;
	  position: absolute;
	  left: 7px;
	  bottom: 7px;
	  cursor: pointer;
	}
	.qz_status.active {
	  color: #FC4514;
	  border-color: #FC4514;
	}
	
	.qz_delete{
		width: 38px;
	 	height: 20px;
	    border: 1px solid #FC4514;
		color: #FC4514;
		line-height: 20px;
		text-align: center;
		font-size: 14px;
		border-radius: 2px;
		position: absolute;
	    right: 7px;
	    bottom: 7px;
	    cursor: pointer;
	}
</style>

