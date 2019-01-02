<template>
  <div class="login_bg">
    <div class="login_wrap">
      <div class="login">
        <h3 class="logo">
        	<img src="../assets/img/logo.png"/>
        </h3>
        <p class="login-title">登录您的账户</p>
        <ul class="user-login">
          <li class="clearfix">
            <input type="text" id="user" value="user" v-model="user"  @input="inputChange(0)" 
            	maxlength="11" placeholder="请输入手机号码" @keyup.enter="login">
            <!--<img class="remove-user" @click="removeAccount" src="../assets/img/remove.png" alt="">-->
            <p class="tip">{{tip.userTip}}</p>
          </li>
          <li>
            <input :type="pwdType" value="pwd" id="pwd" v-model="pwd" @input="inputChange(1)" maxlength="16"
            	ref="pwd"  placeholder="请输入密码(区分大小写)" @keyup.enter="login">
           <!-- <img class="pwd-isShow" @click="pwdShow()" src="../assets/img/yanjing.png" v-show="!isShow" alt="">
            <img class="pwd-isShow" @click="pwdHide()" src="../assets/img/biyan.png" v-show="isShow" alt="">-->
            <p class="tip">
            	<span v-if="tip.loginTip">{{tip.loginTip}}</span>
            	<span v-else>{{tip.pwdTip}}</span>
            </p>
            <!--<p class="tip">{{tip.pwdTip}}</p>
            <p class="tip">{{tip.loginTip}}</p>-->
          </li>
        </ul>
        
        <div class="btn-ground">
        	<button @click="login()" class="login_btn">{{loginText}}</button>
        	<div v-if="!loginFlag" class="btn-hide"></div>
        </div>
        <!--<button @click="login()" class="login_btn">登录</button>-->
        <div class="login_tips">
          <router-link class="regist" to="/regist">注册</router-link>
          <router-link class="forget" to="/forget">忘记密码?</router-link>
        </div>
        <a href="http://www.miitbeian.gov.cn" target="_blank"  style="display:block; font-size: 13px; padding: 20px 0 15px;color: #333; text-align: center;">
        		深圳市科佛科技有限公司&nbsp;&nbsp;粤ICP备18036125号-3</a> 
      </div>
    </div>
		
		<!--alert弹窗-->
  		<alert-dialog :is-show="isShowAlert" :alertCont="alertContent" :type="type" 
  			@on-close="closeAlert"></alert-dialog>
	
	
  </div>

</template>


<script>
export default {
  name: 'Login',
  data() {
    return {
      user: "",
      pwd: "",
      isShow: false,
      pwdType: "password",
      loginFlag: true, //可否点击
      loginStatus:true,
      loginText: "登录",
      status:{
      	user: false,
      	pwd: false
      },
      tip: {
      	loginTip: "",
      	userTip: "",
      	pwdTip: "",
      },
      
      isShowAlert: false,
      alertContent: "",
      type: "",
      
    };
  },
   watch: {
		/*status: {
			handler(val,oldval){
				if(this.status.user && this.status.pwd){
					this.loginStatus = true;
				}else{
					this.loginStatus = false;
				}
			},
			deep: true
		}*/
  },
  created: function() {
    this.checkCookie();
    var _this = this;
  },
 
   mounted() {
   
  	//	如果进来界面就已经填了账号或密码，需要验证
  	if(this.user){
  		this.inputChange(0);
  	}
  	if(this.user&&this.pwd){
  		this.inputChange(0);
  		this.inputChange(1);
  	}
  },
  updated(){
  
  	//console.log('9999')
  },
  methods: {
  	closeAlert(){
  		this.isShowAlert = false;
  		this.alertContent = "";
  	},
    inputChange(e) {
    	this.tip.loginTip = "";
      if (e == 0) {
        var phoneReg = /(^1[3-578]\d{9}$)/;
        var mailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        this.user = this.user.replace(/\s/, "");
        /*if (!phoneReg.test(this.user) && !mailReg.test(this.user)) {
          document.getElementById("user").style.borderColor = "#FC4514";
          this.status.user = false;
          this.tip.userTip = '输入的手机号码或邮箱格式不正确';
        } else {
          document.getElementById("user").style.borderColor = "#BCBCBC";
          this.status.user = true;
          this.tip.userTip = "";
        }*/
        if (!phoneReg.test(this.user)) {
          document.getElementById("user").style.borderColor = "#FC4514";
          this.status.user = false;
          !this.user ? this.tip.userTip = '请输入手机号码' : this.tip.userTip = '输入的手机号码格式不正确';
        } else {
          document.getElementById("user").style.borderColor = "#BCBCBC";
          this.status.user = true;
          this.tip.userTip = "";
        }
      } else if (e == 1) {
      	var pwdReg = /^(?![^a-zA-Z]+$)(?!\D+$)[0-9A-Za-z]{8,16}$/;
        if (!pwdReg.test(this.pwd)){
          document.getElementById("pwd").style.borderColor = "#FC4514";
          this.status.pwd = false;
          !this.pwd ? this.tip.pwdTip = "请输入密码，8-16位数字、字母组合" : this.tip.pwdTip = "密码为8-16位数字、字母组合";
          
        } else {
          document.getElementById("pwd").style.borderColor = "#BCBCBC";
          this.status.pwd = true;
          this.tip.pwdTip = ""
        }
      }
    },
    removeAccount() {
      //移除输入框账号
      this.user = "";
      document.getElementById("user").style.borderColor = "#FC4514";
      this.status.user = false;
      this.tip.userTip = '请输入手机号码';
    },
    pwdShow() {
      this.isShow = true;
      this.pwdType = "email";
    },
    pwdHide() {
      this.isShow = false;
      this.pwdType = "password";
    },
    //登录
    login() {
        var _this = this;
		    _this.loginFlag = false;  //可否点击
	      _this.loginText = "登录中...";
        this.$axios({
	        method: "post",
	        url: _this.$link + "api/User/Login",
	        data: {
	          timestamp: "1",
	          SecretId: "3",
	          Signature: "4",
	          Data: {
	            User: _this.user,
	            Pwd: _this.pwd
	          }
	        }
        })
        .then(res => {
        	_this.loginFlag = true;
        	_this.loginText = "登录";
          //console.log(res.data);
          if (res.data.Code == "0") {
            var data = JSON.stringify(res.data.Data);
            sessionStorage.setItem("LQUserInfo", data);
            _this.$router.push({ path: "/home" });
            var accountData = {
              user: _this.user,
              /*pwd: _this.pwd*/
            };
            accountData = JSON.stringify(accountData);
            _this.setCookie("accountInfo", accountData, 7); //保存到cookie
          } else {
            //alert(res.data.Message);
            _this.$set(_this.tip,'loginTip',res.data.Message)
          }
        })
        .catch(err => {
        	_this.loginFlag = true;
        	_this.loginText = "登录";
        	_this.type = "defalut";
          _this.isShowAlert = true;
	      	_this.alertContent = "网络出错，请稍后再试";
          //console.log(err);
        });
    },
    //设置cookie
    setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + "; " + expires;
     // console.info(document.cookie);
    },
    //获取cookie
    getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
      }
      return "";
    },
    //清除cookie
    clearCookie() {
      this.setCookie("accountInfo", "", -1);
    },
    checkCookie() {
      var accountInfo = this.getCookie("accountInfo");
      if (accountInfo != "") {
        accountInfo = JSON.parse(accountInfo);
        this.user = accountInfo.user;
        /*this.pwd = accountInfo.pwd;*/
      }
    },
    addEventListenerKey() {
      document.addEventListener("keydown", function(e) {
        console.log(e);
      });
    }
  },
};
</script>

<style scoped>
.login_bg {
  width: 100%;
  height: 100%;
  background: url("../assets/img/bg.png") no-repeat center;
  background-size: cover;
  overflow: hidden;
  position: relative;
}
.login_bg:before{
	content: '';
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
	background-color: rgba(0,0,0,0.35);
}
h3.logo {
  height: 38px;
  text-align: center;
  padding-top: 40px;
  font-size: 40px;
  line-height: 38px;
  font-weight: 100;
}
.login_wrap {
  width: 380px;
  overflow: hidden;
  /* margin: 8% auto 40px; */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  box-shadow: 0px 0px 45px -6px rgba(0, 0, 0, 0.2);
  background: #f5f5f5;
}
.login {
  width: 320px;
  margin: 0 auto;
}
.login-title {
  font-size: 20px;
  text-align: center;
  color: #3d3d3d;
  font-weight: bold;
  line-height: 1;
  padding-top: 42px;
}
.user-login {
  margin-top: 27px;
  position: relative;
}
.tip{
	position: absolute;
	bottom: -20px;
	color: #FC4514;
	font-size: 14px;
}
.user-login li {
  position: relative;
  margin-bottom: 26px;
}
.user-login li input {
  height: 42px;
  line-height: 16px;
  border-radius: 4px;
  -ms-border-radius: 4px;
  -moz-border-radius: 4px;
  -o-border-radius: 4px;
  -webkit-border-radius: 4px;
  background: #f5f5f5 !important;
  padding: 12px 18px 12px 15px;
  /*padding-left: 15px;
  padding-right: 18px;*/
  width: 100%;
  outline: none !important; 
  -moz-outline: none !important;
  border: 1px solid #bcbcbc;
  box-sizing: border-box;
  font-size: 16px;
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
.login_tips {
  font-size: 16px;
  line-height: 1;
  /*padding-bottom: 32px;*/
}
.login_tips a {
  color: #FC4514;
}
.login_tips span {
  margin: 0 5px;
}
.login_btn {
  border-radius: 4px;
  -ms-border-radius: 4px;
  -moz-border-radius: 4px;
  -o-border-radius: 4px;
  -webkit-border-radius: 4px;
  height: 42px;
  line-height: 42px;
  font-size: 16px;
  text-align: center;
  width: 100%;
  background: #FC4514;
  cursor: pointer;
  color: #fff;
  border: 0;
  display: block;
  margin-bottom: 26px;
  outline: none;
}

.btn-ground{
	position: relative;
	overflow: hidden;
}

.btn-ground .btn-hide {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(255, 255, 255, 0.5);
}

.forget {
  float: right;
}
input::-ms-clear {
  display: none;
}
input::-ms-reveal {
  display: none;
}
</style>
