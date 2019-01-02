<template>
  <div class="regist-bg">

    <div class="regist-wrap">
      <div class="header-wrap">
        <div class="header clearfix">
          <h3><img src="../assets/img/logo.png" width="56"/></h3>
          <p>
            <a href="http://www.kefo-tech.com/" target="_blank">返回官网</a>
            <span>|</span>已有账号？
            <router-link to="/login">登录</router-link>
          </p>
        </div>
      </div>
      <div class="regist-box">
        <div class="regist">
          <p class="r-title">免费试用30天</p>
          <div class="regist-class" style="width: auto;">
            <span v-if="!nextFlag" @click="changeClass(0)" :class="registClass?'':'active'">个人注册</span>
            <!--<span v-if="!nextFlag" @click="changeClass(1)" :class="registClass?'active':''">企业注册</span>-->
            <span v-if="nextFlag" class="active w-100">企业联系人</span>
          </div>
          <ul class="user-regist">
            <li v-if="!registClass">
              <input type="text" value="user" id="user" v-model="user" @input="userChange(0)" maxlength="11" placeholder="请输入手机号">
              <!--<img class="remove-user" @click="removeInfo(0)" src="../assets/img/remove.png" alt="">-->
              <p class="tip">{{tip.personalUserTip}}</p>
            </li>
            <li v-if="nextFlag">
              <input type="text" value="phone" id="phone" v-model="phone" @input="userChange(5)" maxlength="11" placeholder="请输入企业联系人手机号">
              <!--<img class="remove-user" @click="removeInfo(1)" src="../assets/img/remove.png" alt="">-->
              <p class="tip">{{tip.enterprisePhoneTip}}</p>
            </li>
            <li v-if="registClass && !nextFlag">
              <input type="text" value="company" id="company" v-model="company" @input="userChange(3)" placeholder="请输入企业名称">
              <!--<img class="remove-user" @click="removeInfo(2)" src="../assets/img/remove.png" alt="">-->
              <p class="tip">{{tip.enterpriseNameTip}}</p>
            </li>
            <li v-if="!nextFlag">
              <input :type="pwdType" value="pwd" id="pwd" v-model="pwd" @input="userChange(1)" placeholder="请输入密码，8-16位数字、字母组合">
              <!--<img class="pwd-isShow" @click="pwdShow()" src="../assets/img/yanjing.png" v-show="!isShow" alt="">
              <img class="pwd-isShow" @click="pwdHide()" src="../assets/img/biyan.png" v-show="isShow" alt="">-->
              <p class="tip">{{tip.pwdTip}}</p>
            </li>
            <li v-if="registClass && !nextFlag">
              <input type="text" value="email" id="email" v-model="email" @input="userChange(4)" placeholder="请输入企业邮箱">
              <!-- <img class="remove-user" @click="removeAccount" src="../assets/img/remove.png" alt=""> -->
              	<p class="tip">{{tip.enterpriseEmailTip}}</p>
            </li>
            <li class="clearfix">
              <input type="text" value="phoneCode" class="phoneCode" maxlength="6" autocomplete="off"
              	id="phoneCode" @input="userChange(2)" v-model="phoneCode" placeholder="请输入验证码">
              <div class="getCode-wrap">
                <div @click="getCode()" class="getCode" v-if="getCodeFlag">获取验证码</div>
                <span v-if="!getCodeFlag">重新发送（{{time}}s）</span>
              </div>
              <p class="tip">{{tip.codeTip}}</p>
              <p class="tip">{{tip.registTip}}</p>
            </li>
          </ul>
          <p class="regist-tips">注册即表示您已阅读并同意
          	<router-link to="/privacy">《链签用户隐私权政策》</router-link>
          </p>
          <div class="regist-btn-wrap">
            <div v-if="!registClass || nextFlag" @click="regist()" class="regist-btn">{{registText}}
            </div><div v-if="registClass && !nextFlag" @click="next()" class="regist-btn">下一步</div>
            <div v-if="!registFlag" class="btn-hide"></div>
          </div>

        </div>

      </div>

    </div>
    
    <!--alert弹窗-->
  		<alert-dialog :is-show="isShowAlert && type!='confirm'"  :alertCont="alertContent" :type="type" 
  			@on-close="closeAlert"></alert-dialog>
  			
  		<alert-dialog :is-show="isShowAlert && type=='confirm'" :alertCont="alertContent" :type="type" 
  			@on-close="closeAlert" @confirm="goToLogin"></alert-dialog>
    
  </div>

</template>


<script>
export default {
  data() {
    return {
      pwdType: "password",
      company: "",
      user: "",
      email: "",
      pwd: "",
      phoneCode: "",
      phone: "",
      registClass: 0,  //0：个人注册，1：企业注册
      isShow: false,   //密码密文
      time: 60,
      getCodeFlag: true,  //获取验证码，true需要获取，false已经获取
      registFlag: false,
      registStatus: false, //可否点击
      registText: "注册",
      nextFlag: false,    //企业注册下一步
      status: {
        account: false, //个人账户
        pwd: false, // 密码
        phoneCode: false, //验证码
        company: false, //企业名称
        email: false, //邮箱
        phone: false //手机
      },
      tip: {
      	personalUserTip: "",
      	enterpriseEmailTip: "",
      	enterprisePhoneTip: "",
      	enterpriseNameTip: "",
      	pwdTip: "",
      	codeTip: "",
      	registTip:"",
      },
      
      isShowAlert: false,
      alertContent: "",
      type: "default",
    };
  },
  watch:{
  	status:{
  		handler(val,oldval){
  			if (this.registClass == 0) {  //个人注册
	        if (this.status.phoneCode && this.status.pwd && this.status.account) {
	          this.registFlag = true;
	        } else {
	          this.registFlag = false;
	        }
	      } else if (this.registClass == 1) {  //企业注册
	        if (!this.nextFlag) {
	          if (this.status.phoneCode && this.status.pwd && this.status.company && this.status.email) {
	            this.registFlag = true;
	          } else {
	            this.registFlag = false;
	          }
	        } else {
	          if (this.status.phone && this.status.phoneCode) {
	            this.registFlag = true;
	          } else {
	            this.registFlag = false;
	          }
	        }
	      }
  		},
  		deep: true
  	}
  },
  mounted() {

  },
  methods: {
  	closeAlert(){
  		this.isShowAlert = false;
  		this.alertContent = "";
  		this.type = "";
  	},
    //移除输入框信息
    removeInfo(e) {
      if (e == 0) {
        this.user = "";
        this.status.account = false;
        this.registFlag = false;
        this.tip.personalUserTip = "请输入手机号码"
      } else if (e == 1) {
        this.phone = "";
        this.registFlag = false;
        this.status.phone = false;
      } else if (e == 2) {
        this.company = "";
        this.registFlag = false;
        this.status.company = false;
      }
    },
    //显示密码
    pwdShow() {
      this.isShow = true;
      this.pwdType = "email";
    },
    //隐藏密码
    pwdHide() {
      this.isShow = false;
      this.pwdType = "password";
    },
    //切换注册类型，input重置 
    changeClass(e) {
      this.registClass = e;
      this.isShow = false;
      this.registFlag = false;
      this.nextFlag = false;   
      this.status = {
        account: false, //个人账户
        pwd: false, // 密码
        phoneCode: false, //验证码
        company: false, //企业名称
        email: false, //邮箱
        phone: false //手机
      };
      this.tip = {
      	personalUserTip: "",
      	enterpriseEmailTip: "",
      	enterprisePhoneTip: "",
      	enterpriseNameTip: "",
      	pwdTip: "",
      	codeTip: "",
      	registTip:"",
      }
      this.pwdType = "password";
      this.company = "";
      this.user = "";
      this.email = "";
      this.pwd = "";
      this.phoneCode = "";
    },
    //对input输入的内容验证以及下一步和注册按钮的控制
    userChange(e) {
    	this.tip.registTip = "";
      var phoneReg = /(^1[3-578]\d{9}$)/;
      var mailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      var pwdReg = /^(?![^a-zA-Z]+$)(?!\D+$)[0-9A-Za-z]{8,16}$/;
      if (e == 0) {
        this.user = this.user.replace(/\s/, "");
        /*if (!phoneReg.test(this.user) && !mailReg.test(this.user)) {
          document.getElementById("user").style.borderColor = "#FC4514";
          this.status.account = false;
          this.tip.personalUserTip = "输入的手机号码或邮箱格式不正确";
        } else {
          document.getElementById("user").style.borderColor = "#BCBCBC";
          this.status.account = true;
          this.tip.personalUserTip = "";
        }*/
	       if (!phoneReg.test(this.user)) {
	          document.getElementById("user").style.borderColor = "#FC4514";
	          this.status.account = false;
	          !this.user ? this.tip.personalUserTip = "请输入手机号码" : this.tip.personalUserTip = "输入的手机号码格式不正确";
	          
	        } else {
	          document.getElementById("user").style.borderColor = "#BCBCBC";
	          this.status.account = true;
	          this.tip.personalUserTip = "";
	        }
      } else if (e == 1) {
        if (!pwdReg.test(this.pwd)) {
          document.getElementById("pwd").style.borderColor = "#FC4514";
          this.status.pwd = false;
          !this.pwd ? this.tip.pwdTip = "请输入密码，8-16位数字、字母组合，区分大小写" : this.tip.pwdTip = "密码为8-16位数字、字母组合，区分大小写";
          
        } else {
          document.getElementById("pwd").style.borderColor = "#BCBCBC";
          this.status.pwd = true;
          this.tip.pwdTip = "";
        }
      } else if (e == 2) {
        var codeReg = /^\d{6}$/;
        if (!codeReg.test(this.phoneCode)) {
          document.getElementById("phoneCode").style.borderColor = "#FC4514";
          this.status.phoneCode = false;
          !this.phoneCode ? this.tip.codeTip = "请输入手机验证码" : this.tip.codeTip = "请输入6位数验证码";
          
        } else {
          document.getElementById("phoneCode").style.borderColor = "#BCBCBC";
          this.status.phoneCode = true;
          this.tip.codeTip = "";
        }
      } else if (e == 3) {
        //this.company = this.company.replace(/\s/, "");
        if (this.company == "") {
          document.getElementById("company").style.borderColor = "#FC4514";
          this.status.company = false;
          this.tip.enterpriseNameTip = "请输入企业名称";
          
        } else {
          document.getElementById("company").style.borderColor = "#BCBCBC";
          this.status.company = true;
          this.tip.enterpriseNameTip = "";
        }
      } else if (e == 4) {
        if (!mailReg.test(this.email)) {
          document.getElementById("email").style.borderColor = "#FC4514";
          this.status.email = false;
          !this.email ? this.tip.enterpriseEmailTip = "请输入企业邮箱" : this.tip.enterpriseEmailTip = "输入的企业邮箱格式不正确";
          
        } else {
          document.getElementById("email").style.borderColor = "#BCBCBC";
          this.status.email = true;
          this.tip.enterpriseEmailTip = "";
        }
      } else if (e == 5) {
        if (!phoneReg.test(this.phone)) {
          document.getElementById("phone").style.borderColor = "#FC4514";
          this.status.phone = false;
          !this.phone ? this.tip.enterprisePhoneTip = "请输入手机号码" : this.tip.enterprisePhoneTip = "输入的手机号码格式不正确";
          
        } else {
          document.getElementById("phone").style.borderColor = "#BCBCBC";
          this.status.phone = true;
          this.tip.enterprisePhoneTip = "";
        }
      }
      
    },
    getSign() {
      var token = sessionStorage.getItem("token");
      this.$axios({
        method: "post",
        url: "http://140.143.94.179:8686/api/Signature/Data",
        headers: { "access-token": token }
      })
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取验证码
    getCode() {
      if (!this.status.account) {
        document.getElementById("user").style.borderColor = "#FC4514";
        document.getElementById("user").focus();
        this.tip.personalUserTip = "请输入手机号码"
        return;
      }
      var _this = this;
      this.$axios({
        method: "post",
        url: _this.$link + "api/SMS/Send",
        data: {
          timestamp: "1",
          SecretId: "3",
          Signature: "4",
          Data: { TelePhone: _this.user }
        }
      })
        .then(res => {
        	if(res.data.Code == 0){
         		_this.getCodeFlag = false;
						_this.timeOut(60);
						_this.time = 60;
						_this.tip.codeTip = "验证码已发送到手机。";
	        }else{
	         	_this.tip.codeTip = res.data.Message;
	        }
        	
        })
        .catch(err => {
        	/*_this.type = "defalut";
          _this.isShowAlert = true;
	      	_this.alertContent = err;*/
          console.log(err);
          _this.tip.codeTip = "网络出错，请稍后再试"
        });
    },
    timeOut(time) {
      var _this = this;
      setInterval(function() {
        _this.time = time--;
        if (_this.time <= 0) {
          _this.getCodeFlag = true;
        }
      }, 1000);
    },
    //个人注册
    regist() {
      if (this.registClass) return; //非个人注册
      /*if (this.registStatus) return; //已经点击注册
      this.registStatus = true;*/
      this.registFlag = false;
      this.registText = "注册中...";
      var phoneReg = /(^1[3-578]\d{9}$)/;
      var oType = phoneReg.test(this.user) ? "0" : "1";
      var _this = this;
      /*setTimeout(function(){
        _this.registStatus = false;
      },5000)*/
      this.$axios({
        method: "post",
        url: _this.$link + "api/User/Create",
        data: {
          timestamp: "1",
          SecretId: "3",
          Signature: "4",
          Data: {
            User: _this.user,
            Pwd: _this.pwd,
            TelePhoneAuthCode: _this.phoneCode,
            EmailAuthCode: _this.phoneCode,
            Type: oType
          }
        }
      })
        .then(res => {
        	_this.registFlag = true;
      		_this.registText = "注册";
          //console.log(res.data);
          if (res.data.Code == "0") {
          	let accountData = {
              user: _this.user,
            };
            accountData = JSON.stringify(accountData);
            _this.setCookie("accountInfo", accountData, 7); //保存到cookie
            _this.type = "confirm";
            _this.isShowAlert = true;
	      		_this.alertContent = "注册成功";
           // _this.$router.push({ path: "/login" });
          } else {
            //alert(res.data.Message);
            _this.tip.registTip = res.data.Message;
          }
        })
        .catch(err => {
        	_this.registFlag = true;
      		_this.registText = "注册";
        	_this.type = "defalut";
          _this.isShowAlert = true;
	        _this.alertContent = "网络出错，请稍后再试";
          //console.log(err);
        });
    },
    
    goToLogin(){
    	this.$router.push({ path: "/login" });
    },
    
    //设置cookie
    setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + "; " + expires;
     // console.info(document.cookie);
    },
    //企业注册下一步
    next() {
      this.registFlag = false;
      this.phoneCode = "";
      this.nextFlag = true;
      this.status.phoneCode = false;
    },
    getContr() {
      this.$axios({
        method: "post",
        url: "http://140.143.94.179:8686/api/Contract/GetContractOverview",
        headers: { "access-token": "IAV+sOMGAwwx83BhVuRxuCrxgG8=" },
        data: {
          timestamp: "1",
          SecretId: "3",
          Signature: "4"
        }
      })
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
.regist-bg {
  width: 100%;
  height: 100%;
  background: url("../assets/img/bg.png") no-repeat center;
  background-size: cover;
  position: relative;
  overflow: hidden;
}
.regist-bg:before{
	content: '';
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
	background-color: rgba(0,0,0,0.35);
}

.header-wrap {
	position: absolute;
	left: 0;
	top: 0;
  height: 80px;
  line-height: 80px;
  width: 100%;
}
.header {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 40px;
}
.header h3 {
  float: left;
}
.header h3 img{
	width: 66px;
	margin-top: 20px;
}
.header p {
  color: #FC4514;
  float: right;
  padding-right: 20px;
  font-size: 16px;
}
.header p span {
  color: #fff;
  margin: 0 3px;
}
.header a {
  color: #fff;
}
.regist-box {
  width: 400px;
  overflow: hidden;
  /* margin: 8% auto 36px; */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  box-shadow: 0px 0px 45px -6px rgba(0, 0, 0, 0.2);
  line-height: 1;
  background: #f5f5f5;
}
.regist {
  width: 340px;
  margin: 0 auto;
}
.r-title {
  padding-top: 45px;
  text-align: center;
  color: #FC4514;
  font-size: 22px;
}
.regist-class {
  font-size: 18px;
  width: 200px;
  margin: 45px auto 0;
  color: #3b4356;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}
.regist-class .active {
  color: #FC4514;
}
.regist-class .w-100 {
  display: block;
  width: 100%;
  text-align: center;
}
.user-regist {
  margin-top: 30px;
}
.user-regist li {
  position: relative;
  margin-bottom: 26px;
}
.tip{
	position: absolute;
	bottom: -18px;
	color: #FC4514;
	font-size: 14px;
}
.user-regist li input {
  height: 42px;
  line-height: 16px;
  border-radius: 4px;
  -ms-border-radius: 4px;
  -moz-border-radius: 4px;
  -o-border-radius: 4px;
  -webkit-border-radius: 4px;
  background: #f5f5f5 !important;
  /*padding-left: 15px;
  padding-right: 18px;*/
 	padding: 12px 18px 12px 15px;
  width: 100%;
  border: 1px solid #bcbcbc;
  box-sizing: border-box;
  font-size: 16px;
}
::-webkit-input-placeholder {
  color: #d6d6d6;
}
input:focus {
  outline-style: auto;
  outline-width: 2px;
}
.remove-user {
  position: absolute;
  width: 14px;
  height: 14px;
  top: 0;
  bottom: 0;
  margin: auto;
  right: 18px;
  cursor: pointer;
}
.pwd-isShow {
  width: 18px;
  height: 12px;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  right: 18px;
  cursor: pointer;
}
.user-regist li .phoneCode {
  width: 220px;
  float: left;
}
.getCode-wrap {
  width: 110px;
  height: 42px;
  float: right;
  text-align: center;
  font-size: 16px;
  position: relative;
}
.getCode {
  width: 100%;
  height: 42px;
  background: #3b4356;
  border-radius: 4px;
  outline: 0;
  line-height: 42px;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
}
.getCode-wrap span {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #efefef;
  border-radius: 4px;
  color: #ccc;
  line-height: 42px;
  font-size: 12px;
}
.regist-tips {
  text-align: center;
  font-size: 14px;
  color: #c7c7c7;
  padding-bottom: 32px;
}
.regist-tips a {
  color: #FC4514;
  cursor: pointer;
}
.regist-btn-wrap {
  border-radius: 4px;
  height: 42px;
  background: #FC4514;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
}
.regist-btn {
  line-height: 42px;
  text-align: center;
  color: #fff;
  cursor: pointer;
}
.regist-btn-wrap .btn-hide {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.5);
}
</style>

