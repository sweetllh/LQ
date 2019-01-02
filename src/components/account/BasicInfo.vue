<template>
    <!-- 用户信息 -->
    <div id="basicInfo">
      <div class="header">
    	  <div class="head-title">我的账号 </div>
      </div>
      <div class="r_header">
      	<!--<i class="left_icon"></i>-->
        <span class="r_header_title">基本信息</span>
      </div>
      <div class="r_content">
        <ul class="uesr_list">
          <li style="height: 52px;">
            <p class="title">头像</p>
            <div class="item_con face_box">
            	 <!--预览裁剪上传的图片-->
	    		<Avatar :userInfo="userInfo" :avatar="baseInfo.HeadPortrait ? baseInfo.HeadPortrait : avatar" 
	    			@getMessage="getAvatar"></Avatar>
              <!--<img id="preImg" class="face" :src="baseInfo.HeadPortrait ? baseInfo.HeadPortrait : avatar" alt="">
              <span class="face_tips" @click.stop="uploadHeadImg">修改</span>
              <input type="file" accept="image/*" @change="handleFile" class="hiddenInput"/>-->
            </div>
            <!--<img src="../../assets/img/photo.png" class="photo"/>-->
          </li>
        
          <li>
            <p class="title">真实姓名</p>
            <div class="item_con">
              <span>{{baseInfo.RealName}}</span>
              <span v-if="!baseInfo.IsAuthentication" class="red">
              	<router-link to="/accountParent/getApp">前往认证</router-link>
              </span>
            </div>
          </li>
          <li>
            <p class="title">账号</p>
            <div class="item_con">
              <span>{{baseInfo.User}}</span>
      		  <img v-if="userInfo.IsAuthentication" class="renzheng" @click="toMyCertificate"
      			src="../../assets/img/renzheng.png" alt="">
              
            </div>
          </li>
          <li>
            <p class="title">密码</p>
            <div class="item_con">
              <span style="width: 100px;">********</span>
              <img class="edit" src="../../assets/img/icon-edit.png" alt="" @click="openDialog('isShowPswDialog')">
            </div>
          </li>
          <li>
            <p class="title">手机号</p>
            <div class="item_con">
              <span style="width: 100px;">{{baseInfo.Telephone}}</span>
              <img class="edit" src="../../assets/img/icon-edit.png" alt="" @click="openDialog('isShowPhoneDialog')">
            </div>
          </li>
          <!--<li>
            <p class="title">邮箱</p>
            <div class="item_con">
              <span>{{baseInfo.Email}}</span>
              <span v-if="!baseInfo.Email" class="red">前往绑定</span>
              <img v-if="baseInfo.Email" class="edit" src="../../assets/img/icon-edit.png" alt="" @click="openDialog('isShowEmailDialog')"> 
            </div>
          </li>-->
          <li>
            <p class="title">身份证号</p>
            <div class="item_con">
              <span>{{baseInfo.IDCardNO}}</span>
              <!--<img class="edit" src="../../assets/img/icon-edit.png" alt="" @click="openDialog('isShowCardDialog')"> -->
            </div>
          </li>
          <li>
            <p class="title">企业名称</p>
            <div class="item_con">
              <span>{{baseInfo.CompanyName}}</span>
              <span class="red" v-if="!baseInfo.IsCompanyAuthentication">
              	<router-link to="/accountParent/certificate">前往认证</router-link>
              </span>
              <!--<img class="edit" src="../../assets/img/icon-edit.png" alt="" @click="openDialog('isShowCardDialog')"> -->
            </div>
          </li>
        </ul>
      </div>
      
       <!--修改密码-->
      <my-dialog :is-show="isShowDialog.isShowPswDialog" title="修改密码"  @on-close="closeDialog('isShowPswDialog')">
      	<div class="dialog clearfix">
      		<ul class="dialogCont">
      			<li>
      				<input :type="pwdType.oldPsw" name="oldPassword" id="oldPassword" value="oldPassword" @input="userChange(1)" 
      				v-model="oldPassword" placeholder="请输入旧密码" autocomplete="off"/>
              		<!--<img src="../../assets/img/biyan.png" alt="" width="25" height="13" v-show="!isShowPsw.oldPsw"  @click="pwdShow(0)">
              		<img src="../../assets/img/yanjing.png" alt="" width="23" height="14" v-show="isShowPsw.oldPsw" @click="pwdHide(0)">-->
      				<p class="tip">{{tip.oldPwdTip}}</p>
      			</li>
      			<li>
      				<input :type="pwdType.newPsw" name="newPassword" id="newPassword" value="newPassword" @input="userChange(2)" 
      				v-model="newPassword" placeholder="请输入新密码，8-16位数字、字母组合" autocomplete="off"/>
      				<!--<img src="../../assets/img/biyan.png" alt="" width="25" height="13" v-show="!isShowPsw.newPsw"  @click="pwdShow(1)">
              		<img src="../../assets/img/yanjing.png" alt="" width="23" height="14" v-show="isShowPsw.newPsw" @click="pwdHide(1)">-->
      				<p class="tip">{{tip.newPwdTip}}</p>
      			</li>
      			<li class="clearfix">
      				<input type="text" value="phoneCode" class="phoneCode" maxlength="6" autocomplete="off"
      					id="phoneCode" @input="userChange(0)" v-model="phoneCode" placeholder="请输入手机验证码">
	                <div class="getCode-wrap">
	                  <div @click="getCode(0)" class="getCode" v-if="getCodeFlag" >获取验证码</div>
	                  <span v-if="!getCodeFlag">重新发送（{{time}}s）</span>
	                </div>
	                <p class="tip">{{tip.phoneCodeTip}}</p>
	                <p class="tip">{{tip.editPwdTip}}</p>
      			</li>
      		</ul>
      		<div class="btn-ground">
      			<!--<span class="btn-sure" @click="">确定</span>-->
      			<button type="button"  @click="modifyPsw()">{{sureText}}</button>
      			<div v-if="!sureFlag" class="btn-hide"></div>
      		</div>
      	</div>
      </my-dialog>
      
       <!--绑定邮箱-->
      <my-dialog :is-show="isShowDialog.isShowEmailDialog" title="绑定邮箱"  @on-close="closeDialog('isShowEmailDialog')">
      	<div class="dialog clearfix">
      		<ul class="dialogCont">
      			<li>
      				<input type="text" name="email" id="email" v-model="email" value="email" @input="userChange(3)" placeholder="请输入邮箱"/>
      				<p class="tip">{{tip.emailTip}}</p>
      			</li>
      			<li class="clearfix">
      				<input type="text" value="phoneCode" class="phoneCode" id="phoneCode" maxlength="6 "
      					@input="userChange(0)" v-model="phoneCode" autocomplete="off" placeholder="请输入手机验证">
	                <div class="getCode-wrap">
	                  <div @click="getCode(0)" class="getCode" v-if="getCodeFlag">获取验证码</div>
	                  <span v-if="!getCodeFlag">重新发送（{{time}}s）</span>
	                </div>
	                <p class="tip">{{tip.emailCodeTip}}</p>
      			</li>
      		</ul>
      		<div class="btn-ground">
      			<!--<span class="btn-sure" @click="">确定</span>-->
      			<button type="button" @click="bindEmail()" >确定</button>
      			<div v-if="!sureFlag" class="btn-hide"></div>
      		</div>
      	</div>
      </my-dialog>
      
      <!--修改手机号码-->
      <my-dialog :is-show="isShowDialog.isShowPhoneDialog" :title="phoneTitle"  @on-close="closeDialog('isShowPhoneDialog')">
      	<div class="dialog clearfix">
      		<ul class="dialogCont">
      			<li v-if="!nextFlag">
      				请输入旧号码{{phoneNumber}}收到的验证码
      			</li>
      			<li v-if="nextFlag">
      				<input type="text" name="newPhoneNum" id="newPhoneNum" value="newPhoneNum" @input="userChange(4)" 
      				v-model="newPhoneNum" placeholder="请输入手机号"/>
      				<p class="tip">{{tip.phoneTip}}</p>
      			</li>
      			<li class="clearfix">
      				<input type="text" value="phoneCode" class="phoneCode" id="phoneCode" maxlength="6" autocomplete="off"
      					@input="userChange(0)" v-model="phoneCode" placeholder="请输入手机验证">
	                <div class="getCode-wrap">
	                  <div @click="getCode(0)" class="getCode" v-if="getCodeFlag && !nextFlag">获取验证码</div>
	                  <div @click="getCode(1)" class="getCode" v-if="getCodeFlag && nextFlag">获取验证码</div>
	                  <span v-if="!getCodeFlag">重新发送（{{time}}s）</span>
	                </div>
	                <p class="tip">{{tip.phoneCodeTip}}</p>
	                <p class="tip">{{tip.changePhoneTip}}</p>
      			</li>
      		</ul>
      		<div class="btn-ground">
      			<button type="button" v-if="!nextFlag" @click="modifyPhoneNum()">下一步</button>
      			<button type="button" v-if="nextFlag"  @click="bindPhoneNum()">{{sureText}}</button>
      			<div v-if="!sureFlag" class="btn-hide"></div>
      		</div>
      	</div>
      </my-dialog>
      
	    <!--alert弹窗-->
  		<alert-dialog :is-show="isShowAlert" :alertCont="alertContent" type="default"
  			@on-close="closeAlert()"></alert-dialog> 
	   
      
    </div>
        
</template>


<script>
import Avatar from "../base/Avatar.vue";
export default {
  components: {
  	Avatar
  },
  data() {
    return {
      userInfo: "", //登录信息
      baseInfo: "", //用户基本信息
      user: "",
      isShowPsw: {
      	oldPsw: false,
      	newPsw: false
      },
      pwdType: {
      	oldPsw: "password",
      	newPsw: "password"
      },
      isShowDialog: {
      	isShowPswDialog: false,
      	isShowPhoneDialog: false,
      	isShowEmailDialog: false,
      	isShowCardDialog: false,
      	isShowPreImgDialog: false,
      },
      
      isShowAlert: false,
      alertContent: "",
      
      phoneNumber: "",  //号码中间的数字用**表示
      phoneTitle: "修改手机号",
      phoneCode: "",
      time: 60,
      getCodeFlag: true,
      sureFlag: false,     //是否验证都通过
      nextFlag: false,    //下一步
      clickFlag: false,   //
      sureText: "确定",
      status: {
      	modifyPhone: false,
      	phoneCode: false,
      	newPhoneNum: false,
      	newPassword: false,
      	oldPassword: false,
      	email: false,
      },
      tip:{
      	phoneCodeTip: "",
      	emailCodeTip: "",
      	oldPwdTip: "",
      	newPwdTip: "",
      	emailTip: "",
      	phoneTip: "",
      	editPwdTip:"",
      	changePhoneTip: "",
      },
      newPhoneNum: "",
      oldPassword: "",
      newPassword: "",
      email: "",   //新绑定的邮箱
      
      //图片裁剪
      avatar: require("../../assets/img/touxiang.png"),
    };
  },
  computed: {
  	
  },
  watch: {
 	 userInfo:{
 	 	handler(val,oldval){
 	 		if(this.userInfo){
	 	 		if(this.userInfo.Type == "0"){
	 	 			this.user = this.userInfo.TelePhone;
	 	 		}else if(this.userInfo.Type == "1"){
	 	 			this.user = this.userInfo.Email;
	 	 		}
	 	 		
	 	 		if(!this.userInfo.TelePhone){
	 	 			this.phoneTitle = "绑定手机号";
	 	 			this.nextFlag = true;
	 	 		}
	 	 	}
 	 	},
 	 	deep:true
 	 },
 	 status:{
 	 	handler(val,oldval){
 	 		if(this.isShowDialog.isShowPswDialog){ //修改密码
   	 			if(this.status.phoneCode && this.status.newPassword && this.status.oldPassword){
   	 				this.sureFlag = true;
   	 			}else{
   	 				this.sureFlag = false;
   	 			}
 	 		}else if(this.isShowDialog.isShowPhoneDialog){  
 	 			if(!this.nextFlag){   //修改手机
 	 				if(this.status.phoneCode){
   	 					this.sureFlag = true;
	   	 			}else{
	   	 				this.sureFlag = false;
	   	 			}
 	 			}else{  //绑定手机
 	 				if(this.status.phoneCode && this.status.newPhoneNum){
   	 					this.sureFlag = true;
	   	 			}else{
	   	 				this.sureFlag = false;
	   	 			}
 	 			}
 	 			
 	 		}else if(this.isShowDialog.isShowEmailDialog){
 	 			if(this.status.phoneCode && this.status.email){
   	 				this.sureFlag = true;
   	 			}else{
   	 				this.sureFlag = false;
   	 			}
 	 		}
 	 	},
 	 	deep:true
 	 }
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem("LQUserInfo")) || false;
    //获取用户基本信息
    this.getBaseInfo();
  },
  methods: {
  	toMyCertificate(){
  		this.$router.push({path: "/accountParent/myCertificate"})
  	},
  	getAvatar(msg){
  		this.baseInfo.HeadPortrait = msg
  	},
  	closeAlert(){
  		this.isShowAlert = false;
  		this.alertContent = "";
    },
  	pwdShow(e) {
  		if(e == 0) {
  			this.$set(this.isShowPsw,'oldPsw',true);
  			this.$set(this.pwdType,'oldPsw',"email");
  		}else if(e == 1){
  			this.$set(this.isShowPsw,'newPsw',true);
  			this.$set(this.pwdType,'newPsw',"email");
  		}
    },
    pwdHide(e) {
    	if(e == 0) {
  			this.$set(this.isShowPsw,'oldPsw',false);
  			this.$set(this.pwdType,'oldPsw',"password");
  		}else if(e == 1){
  			this.$set(this.isShowPsw,'newPsw',false);
  			this.$set(this.pwdType,'newPsw',"password");
  		}
    },
  	//获取用户基本信息
  	getBaseInfo(){
  		var _this = this;
        this.$axios({
	        method: "post",
	        url: _this.$link + "api/User/Account",
	        headers: { "access-token": _this.userInfo.Token },
	        data: {
	          timestamp: "1",
	          SecretId: "3",
	          Signature: "4",
	        }
        })
        .then(res => {
            //console.log('用户基本信息',res.data);
            if(res.data.Code == "0"){
          	   _this.baseInfo = res.data.Data;
	        }else if(res.data.Code == "400"){
	      	   _this.$router.push({ path: "/login" });
	        }else{
	       		console.log(res.data.Message);
	        }
          
        })
        .catch(err => {
          //console.log(err);
          _this.isShowAlert = true;
	      _this.alertContent = "网络出错，请稍后再试";
        });
  	},
  	// 打开图片上传
    uploadHeadImg () {
      this.$el.querySelector('.hiddenInput').click();
    },
    
    // 获取上传信息，将头像显示
    handleFile (e) {
      let $target = e.target || e.srcElement;
      let file = $target.files[0];
      //上传到后台
      this.imageSubmit(file);
    },
  	
  	//头像上传
  	imageSubmit(file){
       let formData = new FormData() ; //创建一个form对象
       formData.append('file',file);  //append 向form表单添加数据
       //添加请求头  通过form添加的图片和文件的格式必须是multipart/form-data
       formData.append("name", '');
	   formData.append("filename", file.name);
       var _this = this;
       this.$axios({
	      	method: "post",
	        url: _this.$link + "api/User/UploadHeadPortrait",
	        headers: { 
	        	"access-token": _this.userInfo.Token ,
	        	/*'Content-Type':'multipart/form-data'*/
	        },
	        data: formData
     	 })
        .then(function(res){
        	//console.log('上传头像',res.data);
        	if(res.data.Code == "0"){
        		_this.$set(_this.baseInfo,'HeadPortrait',res.data.Data.Image);
        		_this.isShowAlert = true;
	        	_this.alertContent = "修改头像成功";
        	}else if(res.data.Code == "400"){
	        	_this.$router.push({ path: "/login" });
	        }else{
        		_this.isShowAlert = true;
	        	_this.alertContent = res.data.Message;
        	}
          
        })
        .catch(function (error) {
          //console.log(error);
          _this.isShowAlert = true;
	      _this.alertContent = "网络出错，请稍后再试";
        })
    },
 
  	//关闭弹窗
    closeDialog(attr) {
    	this.$set(this.isShowDialog,attr,false);
    	this.tip = {
      		phoneCodeTip: "",
	      	emailCodeTip: "",
	      	oldPwdTip: "",
	      	newPwdTip: "",
	      	emailTip: "",
	      	phoneTip: "",
	      	editPwdTip:"",
      		changePhoneTip: ""
	    };
	    this.sureFlag = false;
		this.sureText = "确定";
		this.time = 60;
      	this.getCodeFlag = true;
    },
  	//打开弹窗
    openDialog(attr) {
    	if(attr=='isShowPhoneDialog'){
    		//如果手机号未绑定，显示绑定手机号，如果已经绑定，先验证绑定的手机号
    		if(this.userInfo.TelePhone){
		    	this.phoneNumber = this.baseInfo.Telephone.substring(0,3) + "****" + this.baseInfo.Telephone.substring(7);
		    	this.nextFlag = false;
		    	this.newPhoneNum = "";
		    	this.phoneTitle = "修改手机号";
		    }else{
		    	this.nextFlag = true;
		    	this.newPhoneNum = "";
		    	this.phoneTitle = "绑定手机号";
		    }
	    	
    	}else if(attr=='isShowPswDialog'){
		    this.oldPassword = "";
		    this.newPassword = "";
		    this.isShowPsw = {
		      	oldPsw: false,
		      	newPsw: false
		    };
	       	this.pwdType = {
	      	   oldPsw: "password",
	      	   newPsw: "password"
	       };
    	}else if(attr == 'isShowEmailDialog'){
    		this.email = "";
    	}
    	this.phoneCode = "";
    	this.status.phoneCode = false;
	    this.sureFlag = false;
    	this.$set(this.isShowDialog,attr,true)
    },
  	
  	//获取验证码
  	getCode(e) {
  		var _this = this;
  		_this.tip.phoneCodeTip = "";
  		var TelePhoneNumber = "";
		if(e == 0) {
			TelePhoneNumber = _this.userInfo.TelePhone;
		}else if(e == 1){
			TelePhoneNumber = _this.newPhoneNum;
			if(!this.status.newPhoneNum){
				document.getElementById("newPhoneNum").focus();
				this.tip.phoneTip = "请输入手机号码";
				return ;
			}
		}
		
		this.$axios({
			method: "post",
			url: _this.$link + "api/SMS/Send",
			data: {
				timestamp: "1",
				SecretId: "3",
				Signature: "4",
				Data: {
					TelePhone: TelePhoneNumber
				}
			}
		})
		.then(res => {
			//console.log(res.data);
			if(res.data.Code == 0){
         		_this.getCodeFlag = false;
				_this.timeOut(60);
				_this.time = 60;
				_this.tip.phoneCodeTip = "验证码已发送到手机。";
	         }else if (res.data.Code == 400) {
		        _this.$router.push({ path: "/login" });
		     }else{
	         	_this.tip.phoneCodeTip = res.data.Message;
	         }
			
		})
		.catch(err => {
			//console.log(err);
	        _this.tip.phoneCodeTip = "网络出错，请稍后再试";
		});
	
	},
	
	//验证码倒计时
	timeOut(time) {
      var _this = this;
      setInterval(function() {
        _this.time = time--;
        if (_this.time <= 0) {
          _this.getCodeFlag = true;
        }
      }, 1000);
    },
    
    //校验输入的内容
	userChange(e) {
		this.tip.editPwdTip = "";
		this.tip.changePhoneTip = "";
		var phoneReg = /(^1[3-578]\d{9}$)/;
        var mailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        var pwdReg = /^(?![^a-zA-Z]+$)(?!\D+$)[0-9A-Za-z]{8,16}$/;
        var codeReg = /^\d{6}$/;
        if(e == 0){
        	if (!codeReg.test(this.phoneCode)) {
	          document.getElementById("phoneCode").style.borderColor = "#FC4514";
	          this.status.phoneCode = false;
	          !this.phoneCode ? this.tip.phoneCodeTip = "请输入手机验证码" : this.tip.phoneCodeTip = "请输入6位数验证码";
	          
	        } else {
	          document.getElementById("phoneCode").style.borderColor = "#BCBCBC";
	          this.status.phoneCode = true;
	          this.tip.phoneCodeTip = "";
	        }
        }else if(e=="1"){
        	if (!pwdReg.test(this.oldPassword)) {
	          document.getElementById("oldPassword").style.borderColor = "#FC4514";
	          this.status.oldPassword = false;
	          !this.oldPassword ? this.tip.oldPwdTip = "请输入旧密码，8-16位数字、字母组合" : this.tip.oldPwdTip = "密码为8-16位数字、字母组合";
	         
	        } else {
	          document.getElementById("oldPassword").style.borderColor = "#BCBCBC";
	          this.status.oldPassword = true;
	          this.tip.oldPwdTip = "";
	        }
        }else if(e=="2"){
        	if (!pwdReg.test(this.newPassword)) {
	          document.getElementById("newPassword").style.borderColor = "#FC4514";
	          this.status.newPassword = false;
	          !this.newPassword ? this.tip.newPwdTip = "请输入新密码，8-16位数字、字母组合" : this.tip.newPwdTip = "密码为8-16位数字、字母组合";
	          
	        } else{
	          document.getElementById("newPassword").style.borderColor = "#BCBCBC";
	          this.status.newPassword = true;
	          this.tip.newPwdTip = "";
	        }
        }else if(e == "3"){
        	if (!mailReg.test(this.email)) {
	          document.getElementById("email").style.borderColor = "#FC4514";
	          this.status.email = false;
	          !this.email ? this.tip.emailTip = "请输入邮箱" : this.tip.emailTip = "输入的邮箱格式不正确";
	          
	        } else {
	          document.getElementById("email").style.borderColor = "#BCBCBC";
	          this.status.email = true;
	          this.tip.emailTip = "";
	        }
        } else if(e == "4"){
        	if (!phoneReg.test(this.newPhoneNum)) {
	          document.getElementById("newPhoneNum").style.borderColor = "#FC4514";
	          this.status.newPhoneNum = false;
	          !this.newPhoneNum ? this.tip.phoneTip = "请输入电话号码" : this.tip.phoneTip = "输入的电话号码格式不正确";
	          
	        } else {
	          document.getElementById("newPhoneNum").style.borderColor = "#BCBCBC";
	          this.status.newPhoneNum = true;
	          this.tip.phoneTip = "";
	        }
        }
        
	
	},
	//修改手机号
	modifyPhoneNum(){
		if(!this.status.phoneCode){
			document.getElementById("phoneCode").focus();
		}else{
			var _this = this;
			/*if(_this.clickFlag) return;
			_this.clickFlag = true;
		    setTimeout(function(){
		        _this.clickFlag = false;
		    },5000);*/
		    _this.sureFlag = false;
		    _this.sureText = "加载中...";
			var token = _this.userInfo.Token;
			this.$axios({
				method: "post",
				url: _this.$link + "api/User/CheckAuth",
				headers: { "access-token": token},
				data: {
					timestamp: "1",
					SecretId: "3",
					Signature: "4",
					Data: {
						TelePhone: _this.baseInfo.Telephone,
						TelePhoneAuthCode: _this.phoneCode,
					}
				}
			})
			.then(res => {
				//console.log(res.data)
				_this.sureFlag = true;
		    	_this.sureText = "确定";
		    	_this.getCodeFlag = true;
				if(res.data.Code == "0") {
					_this.nextFlag = true;
					//this.sureFlag = false;
					_this.phoneCode = "";
					_this.status.phoneCode = false;
					_this.phoneTitle = "绑定手机号";
					
				}else if (res.data.Code == 400) {
		           _this.$router.push({ path: "/login" });
		        } else {
					this.tip.changePhoneTip = res.data.Message;
					//alert(res.data.Message);
				}
			})
			.catch(err => {
				console.log(err);
				_this.sureFlag = true;
		    	_this.sureText = "确定";
		    	_this.$set(_this.isShowDialog,'isShowPhoneDialog',false);
				_this.isShowAlert = true;
	        	_this.alertContent = "网络出错，请稍后再试";
			});
		}
	},
	
	//绑定手机号码
	bindPhoneNum(){
		if(!this.status.newPhoneNum){
			document.getElementById("newPhoneNum").focus();
		}else if(!this.status.phoneCode){
			document.getElementById("phoneCode").focus();
		}else if(this.status.phoneCode && this.status.newPhoneNum){
			var _this = this;
			/*if(_this.clickFlag) return;
			_this.clickFlag = true;
		    setTimeout(function(){
		        _this.clickFlag = false;
		    },5000);*/
		    _this.sureFlag = false;
		    _this.sureText = "加载中";
			var token = _this.userInfo.Token;
			this.$axios({
				method: "post",
				url: _this.$link + "api/User/ChangeTelephone",
				headers: { "access-token": token},
				data: {
					timestamp: "1",
					SecretId: "3",
					Signature: "4",
					Data: {
						TelePhone: _this.newPhoneNum,
						TelePhoneAuthCode: _this.phoneCode,
					}
				}
			})
			.then(res => {
				//console.log(res.data)
				_this.sureFlag = true;
		    	_this.sureText = "确定";
				if(res.data.Code == "0") {
					_this.$set(_this.isShowDialog,'isShowPhoneDialog',false);
					_this.$set(_this.baseInfo,'Telephone',_this.newPhoneNum);
					_this.$set(_this.baseInfo,'User',_this.newPhoneNum);
					_this.isShowAlert = true;
	        		_this.alertContent = "绑定手机号码成功";
				}else if (res.data.Code == 400) {
			        _this.$router.push({ path: "/login" });
			    } else {
					this.tip.changePhoneTip = res.data.Message;
					//alert(res.data.Message);
				}
			})
			.catch(err => {
				//console.log(err);
				_this.sureFlag = true;
		    	_this.sureText = "确定";
		    	_this.$set(_this.isShowDialog,'isShowPhoneDialog',false);
				_this.isShowAlert = true;
	        	_this.alertContent = "网络出错，请稍后再试";
			});
		}
	},
	
	//修改密码 
	modifyPsw() {
		if(!this.status.oldPassword){
			document.getElementById("oldPassword").focus();
		}else if(!this.status.newPassword){
			document.getElementById("newPassword").focus();
		}else if(!this.status.phoneCode){
			document.getElementById("phoneCode").focus();
		}else if(this.status.phoneCode && this.status.oldPassword && this.status.newPassword){
			var _this = this;
			/*if(_this.clickFlag) return;
			_this.clickFlag = true;
		    setTimeout(function(){
		        _this.clickFlag = false;
		    },5000);*/
		   _this.sureFlag = false;
		   _this.sureText = "加载中";
			var token = _this.userInfo.Token;
			this.$axios({
				method: "post",
				url: _this.$link + "api/User/ChangePassword",
				headers: { "access-token": token},
				data: {
					timestamp: "1",
					SecretId: "3",
					Signature: "4",
					Data: {
						OldPwd: _this.oldPassword,
						NewPwd: _this.newPassword,
						TelePhoneAuthCode: _this.phoneCode,
					}
				}
			})
			.then(res => {
				//console.log(res.data,"修改密码")
				_this.sureFlag = true;
		    	_this.sureText = "确定";
				if(res.data.Code == "0") {
					_this.$set(_this.isShowDialog,'isShowPswDialog',false);
					_this.isShowAlert = true;
	        		_this.alertContent = "修改密码成功";
				}else if (res.data.Code == 400) {
			        _this.$router.push({ path: "/login" });
			    } else {
					_this.tip.editPwdTip = res.data.Message;
					//alert(res.data.Message);
				}
			})
			.catch(err => {
				_this.sureFlag = true;
		    	_this.sureText = "确定";
				_this.$set(_this.isShowDialog,'isShowPswDialog',false);
				_this.isShowAlert = true;
	        	_this.alertContent = "网络出错，请稍后再试";
			});
		}
	},
	
	//绑定邮箱
	bindEmail(){
		if(!this.status.email){
			document.getElementById("email").focus();
		}else if(!this.status.phoneCode){
			document.getElementById("phoneCode").focus();
		}else if(this.status.phoneCode && this.status.email){
			var _this = this;
			if(_this.clickFlag) return;
			_this.clickFlag = true;
		    setTimeout(function(){
		        _this.clickFlag = false;
		    },5000);
			var token = _this.userInfo.Token;
			this.$axios({
				method: "post",
				url: _this.$link + "api/User/",
				headers: { "access-token": token},
				data: {
					timestamp: "1",
					SecretId: "3",
					Signature: "4",
					Data: {
						OldPsw: _this.oldPassword,
						
					}
				}
			})
			.then(res => {
				console.log(res.data,"绑定邮箱")
				if(res.data.Code == "0") {
					_this.$set(_this.isShowDialog,'isShowPswDialog',false);
					
				}else if (res.data.Code == 400) {
			        _this.$router.push({ path: "/login" });
			    } else {
					_this.isShowAlert = true;
	        		_this.alertContent = res.data.Message;
					//alert(res.data.Message);
				}
			})
			.catch(err => {
				//console.log(err);
				_this.isShowAlert = true;
	        	_this.alertContent = "网络出错，请稍后再试";
			});
		}
	},
  	
  	//验证
  	checkDta(data,index){
      	var cardReg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx])|([1−9]\d5\d2((0[1−9])|(10|11|12))(([0−2][1−9])|10|20|30|31)\d2[0−9Xx])/;
  		
  	},
  	
  	
  	
  }
  
};
</script>

<style scoped>
	@import '../../assets/css/accountCommon.css';
	@import '../../assets/css/dialogCont.css';
	/*@import '../../assets/css/cropper.css';*/
	.r_header{
		padding-left: 35px;
	}
	.hiddenInpu{
		display: none;
	}
	
	.uesr_list li {
	  height: 46px;
	  line-height: 46px;
	  position: relative;
	}
	.uesr_list .title {
	  padding-left: 38px;
	  color: #606060;
	  font-size: 14px;
	  width: 108px;
	  float: left;
	}
	.uesr_list .item_con {
	  float: left;
	  height: 46px;
	  color: #3b4356;
	  font-size: 14px;
	  display: flex;
	  justify-content: flex-start;
	  align-items: center;
	}
	.uesr_list .face_box {
	  width: 50px;
	  height: 50px;
	  border-radius: 50%;
	  /*overflow: hidden;*/
	  /*border: 1px solid #ccc;*/
	  position: relative;
	  cursor: pointer;
	}
	.uesr_list .face_box span {
	  position: absolute;
	  display: none;
	  width: 100%;
	  text-align: center;
	  height: 100%;
	  color: #fff;
	  background: rgba(0, 0, 0, 0.5);
	  z-index: 3;
	}
	.uesr_list .face_box:hover span {
	  display: block;
	}
	.uesr_list .face {
	  height: 100%;
	  display: block;
	  position: relative;
	}
	.renzheng {
	  height: 15px;
	  margin-left: 38px;
	  cursor: pointer;
	}
	.photo{
		width: 18px;
		height: 18px;
		position: absolute;
		top: 27px;
		left: 170px;
		/*z-index: 1;*/
	}
	.edit {
	  height: 16px;
	  padding: 5px;
	  margin-left: 20px;
	  cursor: pointer;
	}
	.dialogCont li{
		position: relative;
		margin-bottom: 20px;
	}
	
	.dialogCont li img{
		position: absolute;
	    top: 0;
	    bottom: 0;
	    margin: auto;
	    right: 18px;
	    cursor: pointer;
	}
	
	.dialogCont li .phoneCode {
	    width: 160px;
	    float: left;
	}
	
	.getCode-wrap {
	    width: 117px;
	    float: right;
	    height: 34px;
	    text-align: center;
	    font-size: 14px;
	    position: relative;
	}
	
	.getCode{
		width: 100%;
	    height: 34px;
	    background: #3b4356;
	    border-radius: 4px;
	    outline: 0;
	    line-height: 34px;
	    color: #fff;
	    cursor: pointer;
	}
	
	.getCode-wrap span{
	    position: absolute;
	    left: 0;
	    top: 0;
	    width: 100%;
	    height: 100%;
	    background: #efefef;
	    border-radius: 4px;
	    color: #ccc;
	    line-height: 36px;
	    font-size: 12px;
	}
	
	.tip{
		font-size: 12px;
		color: #FC4514;
		position: absolute;
		left: 0;
		bottom: -19px;
	}
	.red a,.red{
		color: #FC4514;
		cursor: pointer;
	}
	.r_content{
		padding-top: 20px;
	}
	/*预览图片*/
	.selectedBtn{
		position: relative;
	}
	.selectedBtn span{
		display: inline-block;
		width: 100px;
		text-align: center;
		height: 32px;
		line-height: 32px;
		font-size: 14px;
		border: 1px solid #FC4514;
		border-radius: 4px;
	}
	.selectedBtn .hiddenInput{
		opacity: 0;
		position: absolute;
		left: -100px;
		top: 0;
		width: 200px;
		height: 32px;
		cursor: pointer;
	}
	.preImgWrap{
		width: 380px;
		height: 260px;
		margin: 15px auto 0;
		border: 1px solid #ccc;
		/*display: flex;
		justify-content: center;
		align-items: center;*/
		overflow: hidden;
	}
	.preImgWrap .picture {
	    width: 100%;
	    height: 100%;
	    overflow: hidden;
	    background-position: center center;
	    background-repeat: no-repeat;
	    background-size: cover;
	}
	@media only screen and (max-width: 560px){
		.uesr_list .title{
			width: 60px;
		}
	}
	
</style>

