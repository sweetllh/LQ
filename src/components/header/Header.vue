<template>
  <div id="header">
    <div class="header-wrap clearfix">
      <div class="logo">
      	<a href="http://www.kefo-tech.com/" target="_blank"><img src="../../assets/img/logo.png" width="56"/></a>
      </div>
      
      <div class="menuWrap">
      		<ul class="mdShow hidden-md-and-up">
      			<li v-if="addShow">
		          <span class="build-news">
		            <img src="../../assets/img/icon-add.png" alt="">
		            <p>建立签署</p>
		            <input type="file" multiple="multiple" @change="establishSign" value="" id="isFile">
		          </span>
		        </li><li class="hidden-xs-only">
		          <span class="build-news" @click="toTemeplate()">
		            <img src="../../assets/img/icon-add.png" alt="">
		            <p>选择模板</p>
		          </span>
		        </li><li @click="toMyNews()" class="unreadNews">
		          <img src="../../assets/img/icon-news.png" title="消息" alt="消息" width="20">
		           <!--{{unreadCount}}-->
		          <p v-if="unreadCount > 0" class="unread"></p>
		        </li>
      			
      		</ul>
      		
					<div class="mobileMenuBtn hidden-md-and-up" :class="{active: isShowMemu ? true : false}" @click="isShowMemu = !isShowMemu">
						<span class="span1"></span>
						<span class="span2"></span>
						<span class="span3"></span>
					</div>
					<div class="mobileMenuBtn_shad hidden-md-and-up" @click="isShowMemu = !isShowMemu"
						:class="{active: isShowMemu ? true : false}"></div>
					<div class="headerMenu" :class="{active: isShowMemu ? true : false}">
							<ul class="menu" @click="isShowMemu = !isShowMemu">
				        <li>
				          <router-link to="/home">
				          	 <span class="img">
				          	 		<img src="../../assets/img/home.png" alt="" width="21"/>
				          	 </span>
				        		 <span class="title">首页</span>
				          </router-link>
				        </li><li>
				          <router-link to="/filesParent">
				          	<span class="img">
				          	 		<img src="../../assets/img/file.png" alt="" width="21"/>
				          	 </span>
				        		<span class="title">文件</span>
				          </router-link>
				        </li><!--<li>
				          <router-link to="/myTeam">
				          	<span class="img">
				          	 		<img src="../../assets/img/team.png" alt="" width="21"/>
				          	</span>
				        		<span class="title">团队</span>
				          </router-link>
				        </li>--><li>
				          <router-link to="/accountParent">
				          	<span class="img">
				          	 		<img src="../../assets/img/account.png" alt="" width="22"/>
				          	 </span>
				        		<span class="title">账号</span>
				          </router-link>
				        </li><li class="nav-last-li">
				        	<router-link to="/filesParent/template/0">
				        		<span class="img" style="padding-bottom: 22px;padding-left: 3px;">
				        			<img src="../../assets/img/icon-add.png" alt="" width="16">
				        		</span>
				        		<span class="title">选择模板</span>
				        	</router-link>
				        </li><li @click="isSignOut" class="nav-last-li">
				        	<a href="javascript:void(0)">
				        		<span class="img" style="padding-bottom: 25px;padding-left: 6px;">
				        			<img src="../../assets/img/icon-out.png" title="退出" alt="退出" width="13" >
				        		</span>
				        		<span class="title">退出</span>
				        	</a>
				        </li>
				      </ul>
					</div>
      </div>
      
      
      <ul class="help hidden-sm-and-down">
        <li v-if="addShow">
          <span class="build-news">
            <img src="../../assets/img/icon-add.png" alt="">
            <p>建立签署</p>
            <input type="file" multiple="multiple" @change="establishSign" value="" id="isFile">
          </span>
        </li><li>
          <span class="build-news" @click="toTemeplate()">
            <img src="../../assets/img/icon-add.png" alt="">
            <p>选择模板</p>
          </span>
        </li><li @click="toMyNews()" class="unreadNews" >
          <img src="../../assets/img/icon-news.png" :title="unreadCount?`您有${unreadCount}条未读消息`:`消息中心`" alt="消息" width="20">
           <!--{{unreadCount}}-->
          <p v-if="unreadCount > 0" class="unread" ></p>
        </li><li @click="isSignOut">
          <img src="../../assets/img/icon-out.png" title="退出" alt="退出" width="16" style="position: relative;top: -1px;">
        </li>
      </ul>
      
    </div>
    
    
    
			<!--加载中-->
    <div class="loading" v-if="isLoading">
  		<img src="../../assets/img/loading.gif"/>
  	</div>
  	
  	<!--未认证提示-->
  	<div class="authentication">
  		<div class="contCover" v-if="isShowCertCont"></div>
  		<transition  name="drop">
  			<div class="certCont" v-if="isShowCertCont">
					<img class="dialog-close" @click="isShowCertCont = false" src="../../assets/img/icon-close.png"/>
					<!--<p>您尚未进行实名认证，<router-link to="/accountParent/getApp">前往认证</router-link></p>-->
					<p>您尚未进行实名认证，<span @click="toCertificate(callback)" style="color: #FC4514;cursor: pointer;">前往认证</span></p>
				</div>
  		</transition >
				
  	</div>
  	
  	 <!-- 退出弹窗-->
  	 <alert-dialog :is-show="isShowAlert" :alertCont="alertContent" :type="type" 
  	 	@on-close="closeAlert" @confirm="signOut"></alert-dialog>
  	 
  </div>

</template>


<script>
export default {
	components: {
  },
  data() {
    return {
      //fileId: 1,   //文件组件动态路由id
      addShow:true,
      userInfo: '',
      isLoading: false,
      unreadCount: 0,  //未读消息
      isShowCertCont: false,
      isShowMemu: false,
      
      isShowAlert: false,
      alertContent: "",
      type: "",
    };
  },
  
  watch: {
    $route(to, from) {
      // 对路由变化作出响应...
      if (to.name == "home" || to.name == "addFileOne" || to.name == "addFileTwo" || to.name == "signedFile") {
        //this.fileId = to.params.id;
        this.addShow = false;
      }else{
      	this.addShow = true;
      }
    }
  },
  created() {
  	this.userInfo = JSON.parse(sessionStorage.getItem("LQUserInfo")) || false;
  	this.getUnreadCount();  //未读信息
  	//console.log(this.$route.name)
  	let name = this.$route.name
    if(name == "home" || name == "addFileOne" || name == "addFileTwo" || name == "signedFile"){
      this.addShow = false;
    }else{
    	this.addShow = true;
    }
  },
  
  methods: {
  	isSignOut(){
  		this.type = "confirm";
  		this.isShowAlert = true;
	    this.alertContent = "你确定退出当前账号吗？";
  	},
    signOut() {
      sessionStorage.removeItem("LQUserInfo");
      this.$router.push({ path: "/login" });
    },
    closeAlert(){
    	this.isShowAlert = false;
    },
    toMyNews(){
    	this.$router.push({ path: "/myNews" });
    },
    toTemeplate(){
    	this.$router.push({ path: "/filesParent/template/0" });
    },
    toCertificate(callback){
    	this.isShowCertCont = false;
    	this.callback();
    },
    callback(){
    	this.$router.push({ path: "/accountParent/getApp" });
    },
    //建立签署
    establishSign(e) {
    	if(!this.userInfo.IsAuthentication){
    		this.isShowCertCont =  true;
    		document.getElementById('isFile').value = "";
    		return;
    	}else{
    		//console.log(e.target.files[0]); 
	      var fileInfo= e.target.files[0];
	      
		    if(fileInfo.type.indexOf('image') == 0){
		    	//图片转换成pdf
		    	this.ImgToPdf(e.target.files);
		    }else{
		    	//文件转换成pdf
	  			this.WordToPdf(fileInfo);
		    }
    	}
      
	   
    },
    
    //文件转换成pdf
    WordToPdf(fileInfo){
    		var _this = this;
    		/*sessionStorage.setItem('fileSize',fileInfo.size); */
	      var formData = new FormData();
	      formData.append("file", fileInfo);
	      formData.append("Remark", '文件转换成pdf');
	      formData.append("ContractName", fileInfo.name);
	      _this.isLoading = true;
	      this.$axios({
	        method: "post",
	        url: _this.$link + "api/Contract/WordToPdf",
	        headers: { "access-token": _this.userInfo.Token },
	        data: formData
	      })
	      .then(res => {
	          //console.log("上传的文件1",res.data);
	          _this.isLoading = false;
	          if(res.data.Code == "0"){
	        			let contractId = res.data.Data.ID;
	        			_this.$router.push({ name: "addFileOne" ,params:{id:contractId} });
	        	}else if(res.data.Code == "400"){
	        		sessionStorage.removeItem("LQUserInfo");
		        	_this.$router.push({ path: "/login" });
		        }else{
	        		document.getElementById('isFile').value = "";
	        		_this.type = "default";
	          	_this.isShowAlert = true;
		       		_this.alertContent = res.data.Message;
	        		//alert(res.data.Message);
	          }	
	          
	      })
	      .catch(err => {
	          _this.isLoading = false;
	          _this.type = "default";
	          _this.isShowAlert = true;
		       	_this.alertContent = "网络出错，请稍后再试";
	          //console.log(err);
	      });
    },
    
    //图片转换成pdf
    ImgToPdf(fileData){
    		var formData = new FormData();
    		//可以多张图
    		let size = 0;
    		for(let i in fileData) {
					
					if(!isNaN(i)){
						formData.append("file", fileData[i],fileData[i].name);
						size += fileData[i].size;
					}
				
				}
    		formData.append("ContractName", fileData[0].name);
	      formData.append("Remark", '图片转换成pdf');
	     /* sessionStorage.setItem('fileSize',size); */
    		var _this = this;
	      _this.isLoading = true;
	      this.$axios({
	        method: "post",
	        url: _this.$link + "api/Contract/ImagesToPdf",
	        headers: { "access-token": _this.userInfo.Token },
	        data: formData
	      })
	      .then(res => {
	          //console.log("上传的图片",res.data);
	          _this.isLoading = false;
	          if(res.data.Code == "0"){
	        			let contractId = res.data.Data.ID;
	        			_this.$router.push({ name: "addFileOne" ,params:{id:contractId} });
	        	}else if(res.data.Code == "400"){
	        		sessionStorage.removeItem("LQUserInfo");
		        	_this.$router.push({ path: "/login" });
		        }else{
	        		document.getElementById('isFile').value = "";
	        		_this.type = "default";
	          	_this.isShowAlert = true;
		       		_this.alertContent = res.data.Message;
	        		//alert(res.data.Message);
	          }	
	          
	      })
	      .catch(err => {
	          _this.isLoading = false;
	          _this.type = "default";
	          _this.isShowAlert = true;
		       	_this.alertContent = "网络出错，请稍后再试";
	          //console.log(err);
	      });
    },
    
    //文件转换成dataUrl
	  readBlobAsDataURL(blob, callback) {
		    var a = new FileReader();
		    a.onload = function(e) {callback(e.target.result);};
		    a.readAsDataURL(blob);
		},
		
		//获取未读信息条数
		getUnreadCount(){
					var _this = this;
	        this.$axios({
		        method: "post",
		        url: _this.$link + "api/Message/Data",
		        headers: { "access-token": _this.userInfo.Token },
		        data: {
		          timestamp: "1",
		          SecretId: "3",
		          Signature: "4",
		          Data:{
		            "PageSize":10,
		            "Page":1
		           }
		        }
		     })
        .then(res => {
          //console.log('消息列表',res.data);
          if (res.data.Code == "0") {
            _this.unreadCount = res.data.Data.MessageUnreadCount;
          }else if (res.data.Code == 400) {
	          sessionStorage.removeItem("LQUserInfo");
	          _this.$router.push({ path: "/login" });
	          return;
	       }
        })
        .catch(err => {
          console.log(err);
        });
		},
		
		
    
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/css/dialogCont.css';
@import '../../assets/css/header.css';

</style>