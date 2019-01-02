<template>
  <div class="bg">
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
          <p class="r-title">密码找回</p>
          <ul class="user-regist">
            <li v-if="!nextFlag">
              <input type="text" value="user" id="user" v-model="user" @input="userChange(0)" maxlength="11" placeholder="请输入手机号码">
              <!--<img class="remove-user" @click="removeInfo(0)" src="../assets/img/remove.png" alt="">-->
              <p class="tip">{{tip.userTip}}</p>
            </li>
            <li v-if="nextFlag">
              <input :type="pwdType" value="pwd" id="pwd" v-model="pwd" @input="userChange(1)" placeholder="请输入密码，8-16位数字、字母组合">
              <!--<img class="pwd-isShow" @click="pwdShow()" src="../assets/img/yanjing.png" v-show="!isShow" alt="">
              <img class="pwd-isShow" @click="pwdHide()" src="../assets/img/biyan.png" v-show="isShow" alt="">-->
              <p class="tip">{{tip.pwdTip1}}</p>
            </li>
            <li v-if="nextFlag">
              <input type="password" value="pwd2" id="pwd2" v-model="pwd2" @input="userChange(3)" placeholder="再次输入密码">
              <!-- <img class="pwd-isShow" @click="pwdShow()" src="../assets/img/yanjing.png" v-show="!isShow" alt="">
            <img class="pwd-isShow" @click="pwdHide()" src="../assets/img/biyan.png" v-show="isShow" alt=""> -->
            	<p class="tip">{{tip.pwdTip2}}</p>
            	<p class="tip">{{tip.forgetTip}}</p>
            </li>
            <li v-if="!nextFlag" class="clearfix">
              <input type="text" value="phoneCode" class="phoneCode" id="phoneCode" maxlength="6"
              	@input="userChange(2)" v-model="phoneCode" autocomplete="off" placeholder="请输入验证码">
              <div class="getCode-wrap">
                <div @click="getCode()" class="getCode" v-if="getCodeFlag">获取验证码</div>
                <span v-if="!getCodeFlag">重新发送（{{time}}s）</span>
              </div>
              <p class="tip">{{tip.codeTip}}</p>
            </li>
          </ul>
          <div class="btn-box">
            <div v-if="nextFlag" @click="prev()" class="prev-btn">上一步</div>
            <div class="regist-btn-wrap">
              <div v-if="nextFlag" @click="setPwd()" class="regist-btn"> {{sureText}}
              </div><div v-if="!nextFlag" @click="next()" class="regist-btn">下一步</div>
              <div v-if="!registFlag" class="btn-hide"></div>
            </div>
          </div>

        </div>

      </div>

    </div>
    
    <!--alert弹窗-->
  		<alert-dialog :is-show="isShowAlert && type!='confirm'" :alertCont="alertContent" :type="type" 
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
      user: "",
      pwd: "",
      pwd2: "",
      phoneCode: "",
      registClass: 0,
      isShow: false,
      time: 60,
      getCodeFlag: true,
      registFlag: false,
      registFlag2: false,
      clickFlag: false, //是否已经点击
      nextFlag: false,
      sureText: "确定",
      status: {
        account: false, //账户
        pwd: false, // 密码
        phoneCode: false, //验证码
        pwd2: false
      },
      tip:{
      	userTip: "",
      	pwdTip1: "",
      	pwdTip2: "",
      	codeTip: "",
      	forgetTip: ""
      },
      
      isShowAlert: false,
      alertContent: "",
      type: "",
    };
  },
  watch:{
  	status:{
  		handler(val,oldval){
  			//console.log(val,9999)
  			if (!this.nextFlag) {
	        if (this.status.phoneCode && this.status.account) {
	          this.registFlag = true;
	        } else {
	          this.registFlag = false;
	        }
	      } else {
	        if (this.status.pwd && this.status.pwd2) {
	          this.registFlag = true;
	        } else {
	          this.registFlag = false;
	        }
	      }
  		},
  		deep:true
  	}
  },
  methods: {
  	closeAlert(){
  		this.isShowAlert = false;
  		this.alertContent = "";
  	},
  	
    prev() {
      this.nextFlag = false;
      this.registFlag2 = this.registFlag;
      this.registFlag = true;
    },
    //移除输入框信息
    removeInfo(e) {
      if (e == 0) {
        this.user = "";
        this.status.account = false;
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
    userChange(e) {
    	this.tip.forgetTip = "";
      var phoneReg = /(^1[3-578]\d{9}$)/;
      var mailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      if (e == 0) {
        this.user = this.user.replace(/\s/, "");
        /*if (!phoneReg.test(this.user) && !mailReg.test(this.user)) {
          document.getElementById("user").style.borderColor = "#FC4514";
          this.status.account = false;
          this.tip.userTip = "输入的手机号码或邮箱格式不正确";
        } else {
          document.getElementById("user").style.borderColor = "#BCBCBC";
          this.status.account = true;
          this.tip.userTip = "";
        }*/
        if (!phoneReg.test(this.user)) {
          document.getElementById("user").style.borderColor = "#FC4514";
          this.status.account = false;
          !this.user ? this.tip.userTip = "请输入手机号码" : this.tip.userTip = "输入的手机号码格式不正确";
          
        } else {
          document.getElementById("user").style.borderColor = "#BCBCBC";
          this.status.account = true;
          this.tip.userTip = "";
        }
      } else if (e == 1) {
        var pwdReg = /^(?![^a-zA-Z]+$)(?!\D+$)[0-9A-Za-z]{8,16}$/;
        //console.log(pwdReg.test(this.pwd));
        if (!pwdReg.test(this.pwd)) {
          document.getElementById("pwd").style.borderColor = "#FC4514";
          this.status.pwd = false;
          this.tip.pwdTip1 = "密码为8-16位数字、字母组合";
          !this.pwd ? this.tip.pwdTip1 = "请输入密码，8-16位数字、字母组合" : this.tip.pwdTip1 = "密码为8-16位数字、字母组合";
          
        } else {
          document.getElementById("pwd").style.borderColor = "#BCBCBC";
          this.status.pwd = true;
          this.tip.pwdTip1 = "";
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
        if (this.pwd2 == this.pwd) {
          document.getElementById("pwd2").style.borderColor = "#BCBCBC";
          this.status.pwd2 = true;
          this.tip.pwdTip2 = "";
        } else {
          document.getElementById("pwd2").style.borderColor = "#FC4514";
          this.status.pwd2 = false;
          !this.pwd2 ? this.tip.pwdTip2 = "请再次输入密码" : this.tip.pwdTip2 = "输入的两次密码不一样";
        }
      }

    },
    getCode() {
      if (!this.status.account) {
        document.getElementById("user").style.borderColor = "#FC4514";
        document.getElementById("user").focus();
        this.tip.userTip = "请输入手机号码";
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
         // console.log(res.data);
         if(res.data.Code == 0){
         		_this.getCodeFlag = false;
						_this.timeOut(60);
						_this.time = 60;
						_this.tip.codeTip = "验证码已发送到手机";
	        }else{
	         	_this.tip.codeTip = res.data.Message;
	        }
         
        })
        .catch(err => {
          //console.log(err);
          _this.type = "defalut";
          _this.isShowAlert = true;
	      	_this.alertContent = err;
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
    //设置新密码
    setPwd() {
      var _this = this;
			_this.registFlag = false;
			_this.sureText = "加载中";
      this.$axios({
        method: "post",
        url: _this.$link + "api/User/ForgetPassword",
        data: {
          timestamp: "1",
          SecretId: "3",
          Signature: "4",
          Data: {
            User: _this.user,
            Pwd: _this.pwd,
            TelePhoneAuthCode: _this.phoneCode,
            Type: "0"
          }
        }
      })
        .then(res => {
        	_this.registFlag = true;
					_this.sureText = "确定";
          //console.log(res.data);
          if (res.data.Code == "0") {
          	_this.type = "confirm";
            _this.isShowAlert = true;
	      		_this.alertContent = "修改密码成功";
            //_this.$router.push({ path: "/login" });
          } else {
            //alert(res.data.Message);
            _this.tip.forgetTip = res.data.Message;
          }
        })
        .catch(err => {
        	_this.registFlag = true;
					_this.sureText = "确定";
					_this.type = "defalut";
          _this.isShowAlert = true;
	        _this.alertContent = err;
          //console.log(err);
        });
    },
    
    goToLogin(){
    	this.$router.push({ path: "/login" });
    },
    //密码找回下一步
    next() {
      this.registFlag = false;
      this.nextFlag = true;
      this.registFlag = this.registFlag2;
    }
  }
};
</script>

<style scoped>
.bg {
  width: 100%;
  height: 100%;
  background: url("../assets/img/bg.png") no-repeat center;
  background-size: cover;
  overflow: hidden;
  position: relative;
}
.bg:before{
	content: '';
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
	background-color: rgba(0,0,0,0.35);
}
.header-wrap {
  height: 80px;
  width: 100%;
  position: absolute;
	left: 0;
	top: 0;
	line-height: 80px;
}
.header {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 40px;
}
.header h3 {
  float: left;
}
.header p{
  color: #FC4514;
  float: right;
  padding-right: 20px;
  font-size: 16px;

}
.header h3 img{
	width: 66px;
	margin-top: 20px;
}
.header p span{
  color: #fff;
  margin: 0 3px;
}
.header a {
  color: #fff;
}
.regist-box {
  width: 380px;
  overflow: hidden;
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
  width: 320px;
  margin: 0 auto;
}
.r-title {
  padding-top: 45px;
  text-align: left;
  color: #FC4514;
  font-size: 20px;
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
  margin-top: 35px;
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
  /*outline-color: #FC4514;*/
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
.user-regist li .phoneCode {
  width: 210px;
  float: left;
}
.getCode-wrap {
  width: 100px;
  height: 42px;
  float: right;
  text-align: center;
  font-size: 16px;
  position: relative;
}
.getCode {
  width: 100px;
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
}
.btn-box {
  display: flex;
  justify-content: space-between;
}
.prev-btn {
  line-height: 42px;
  border-radius: 4px;
  height: 42px;
  background: #FC4514;
  text-align: center;
  margin-right: 10px;
  width: 100px;
  color: #fff;
  cursor: pointer;
}
.regist-btn-wrap {
  flex: 1;
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

