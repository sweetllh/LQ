<template>
  <div class="home">
    <v-header></v-header>
    <div>
	    <div class="banner">
	      <p style="z-index: 10; font-weight: 300;">创建新合同</p>
	      <div class="addBtn clearfix" ref="select_frame">
	      	<img src="../assets/img/icon-add.png" class="plus-icon"/>
	      	<div class="dragTag">
	      		<p style="font-size: 14px;">签发文件</p>
	        	<p>点击选择或拖拽至此</p>
	      	</div>
	        <input type="file" multiple="multiple" @change="establishSign" id="isFile" value="">
	      </div>
	    </div>
	    <!--未认证提示-->
	    <div v-if="!userInfo.IsAuthentication" class="IsAuthentication">
	    	依据《中华人民共和国电子签名法》您必须完成实名认证，确保签署身份真实有效，签署的文件才具备法律效力。
	    	<span><router-link to="/accountParent/getApp">前往认证</router-link></span>
	    </div>	
	   	<!-- 内容-->
	    <div class="content">
	      <el-row tag="div" class="content-top">
	      	<el-col tag="div" :xs="24" :sm="24" :md="16" :lg="16" :xl="16" 
	      		style="min-width: 350px;overflow: auto;margin-bottom: 20px;">
	      		<p class="head_title">状态</p>
		        <ul class="task-list wrapper clearfix">
		          <li>
		            <router-link to="/filesParent/files/2">
		              <img class="icon" src="../assets/img/icon-task1.png" alt="">
		              <p class="count" :style="{color: initData.WaitingForMe==0 ? '#9C9C9C' : '#000'}">{{initData.WaitingForMe || 0}}</p>
		              <span>待我签署</span>
		            </router-link>
		          </li>
		          <li>
		            <router-link to="/filesParent/files/3">
		              <img class="icon" src="../assets/img/icon-task2.png" alt="">
		              <p class="count" :style="{color: initData.WaitingForOther==0 ? '#9C9C9C' : '#000'}">{{initData.WaitingForOther || 0}}</p>
		              <span>待他人签</span>
		            </router-link>
		          </li>
		          <li>
		            <img class="icon" src="../assets/img/icon-task3.png" alt="">
		            <p class="count" style="color: #9C9C9C">0</p>
		            <span>即将到期</span>
		          </li>
		          <li>
		            <router-link to="/filesParent/files/4">
		              <img class="icon" src="../assets/img/icon-task4.png" alt="">
		              <p class="count" :style="{color: initData.Completed==0 ? '#9C9C9C' : '#000'}">{{initData.Completed || 0}}</p>
		              <span>已完成</span>
		            </router-link>
		          </li>
		        </ul>
		      </el-col>  
	        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="home-info">
	        	<p class="head_title head_title2">账号</p>
	        	<div class="wrapper">
		          <div class="user-info clearfix">
		          	<div class="account">
		          		 <router-link to="/accountParent/account/BasicInfo">
			              <img class="face" :src="baseInfo.HeadPortrait || require('../assets/img/touxiang.png')"  alt="">
			            </router-link>
		          	</div>
		            <div class="text-info">
		              <p class="name">
		                <span>{{baseInfo.IsAuthentication ? baseInfo.RealName : baseInfo.Telephone}}</span>
		                <img v-if="baseInfo.IsAuthentication" src="../assets/img/renzheng.png" alt="">
		              </p>
		              <p>账号：
		                <span>{{baseInfo.Telephone}}</span>
		              </p>
		            </div>
		          </div>
		          <div class="setMeal">
		            <p>套餐剩余份数：{{initData.PackagingServiceAmount}}份</p>
		            <!--<div class="btn" @click="upgrade">升级套餐</div>-->
		          </div>
	          </div>
	        </el-col>
	      </el-row>
	      
	      	<!--表格-->
	      <div class="lately">
	        <div class="lately-title">
	          <p>最近合同</p>
	          <router-link to="/filesParent/files/1">
	           	 查看更多
	            <i></i>
	          </router-link>
	        </div>
	        <div class="tableWrap">
	        	<table cellpadding="0" cellspacing="0">
		          <thead>
		            <tr class="table-title">
		              <th class="file-name">合同主题</th>
		              <th>发起人</th>
		              <th class="time">发起时间</th>
		              <th>状态</th>
		              <th style="padding-left: 24px;">操作</th>
		            </tr>
		          </thead>
		          <tbody>
		          	<tr>
	            		<td colspan="5" class="tableLoading" v-if="tableLoading">
	            			<img src="../assets/img/tableLoading.gif" width="20"/>
	          				<div>拼命加载中</div>
	            		</td>
	              </tr>
		            <tr v-for="(item ,index) in contractList">
		              <td class="file-name" :title="item.ContractName">{{item.ContractName | filterName}}</td>
			            <td>{{item.SenderName}}</td>
			            <td>{{item.CreateDate}}</td>
			            <td>{{item.ProcessType}}</td>
			            <td class="handel">
			            	<span @click="showDetail(item.ContractID)" style="margin-right: 5px;">详情</span>
			            	<span @click="downLoad(item.CurrentPdfURL,item.ContractName)">下载</span>
			            </td>
		            </tr>
		          </tbody>
		        </table>
	          <div class="data-none" v-if="!contractList.length && !tableLoading">{{dataNone}}</div>
	        </div>
	        
	      </div>
	      
	    </div>
	    
	    	<!--二维码-->
	      <el-row tag="div" class="qr_code">
		  			<el-col tag="div" :xs="24" :sm="24" :md="12" :lg="8" :xl="8" class="codeList">
			      		<div><img src="../assets/img/wei.png" alt="" width="79"/></div>
		  					<div class="codeCont">
		  							<p class="theme"><img src="../assets/img/icon-phone.png" alt="" width="8"/>下载链签APP</p>
		  							<p class="tip">扫一扫下载链签APP，随时随地签署合同</p>
		  					</div>
		  			</el-col>
		  			<el-col tag="div" :xs="24" :sm="24" :md="9" :lg="7" :xl="6" class="codeList">
			      		<div><img src="../assets/img/wei.png" alt="" width="79"/></div>
		  					<div class="codeCont">
		  							<p class="theme"><img src="../assets/img/icon-weixin.png" alt="" width="14"/>链签公众号</p>
		  							<p class="tip">扫一扫关注链签公众号，玩转电子合同</p>
		  					</div>
		  			</el-col>
	      </el-row>
    </div>
    	<!--加载中-->
    <div class="loading" v-if="isLoading">
  		<img src="../assets/img/loading.gif"/>
  	</div>
  	
  	<!--未认证提示-->
  	<div class="authentication" >
  		<div class="contCover" v-show="isShowCertCont"></div>
  		<transition  name="drop">
  			<div class="certCont" v-if="isShowCertCont">
					<img class="dialog-close" @click="isShowCertCont = false" src="../assets/img/icon-close.png"/>
					<p>您尚未进行实名认证，<router-link to="/accountParent/getApp">前往认证</router-link></p>
				</div>
  		</transition >
  	</div>
  	
  	<!--alert弹窗-->
  	<alert-dialog :is-show="isShowAlert" :alertCont="alertContent" @on-close="closeAlert"></alert-dialog>
  </div>

</template>


<script>

export default {
  components: {
  	
  },
  data() {
    return {
      userInfo: "",
      baseInfo: "",
      initData: {},    //首页任务列表数据
      contractList: [],  //合同列表
      isLoading: false,
      isShowCertCont: false,
      isShowAlert: false,
      alertContent: "",
      tableLoading: false,
      dataNone: "暂无数据",
    };
  },
  filters:{
  	filterName(str){
  		let num = str.lastIndexOf(".");
  		if(num==-1){
  			return str;
  		}else{
  			return str.substring(0,num);
  		}
    	
  	},
  },
  beforeCreate() {
    this.userInfo = JSON.parse(sessionStorage.getItem("LQUserInfo")) || false;
    var _this = this;
    //获取首页任务列表数据
    this.$axios({
      method: "post",
      url: _this.$link + "api/HomePage/Data",
      headers: { "access-token": _this.userInfo.Token }
    })
      .then(res => {
        //console.log("首页任务",res.data);
        if (res.data.Code == 0) {
          _this.initData = res.data.Data;
        } else if (res.data.Code == 400) {
          sessionStorage.removeItem("LQUserInfo");
          _this.$router.push({ path: "/login" });
        }else{
        	console.log(res.data.Message);
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem("LQUserInfo")) || false;
    this.getBaseInfo();
    if(this.baseInfo){
    	this.baseInfo.Telephone = 
    		this.baseInfo.TelePhone.substr(0, 3) +
        "****" +
        this.baseInfo.TelePhone.substr(7);
    }
    //获取我的合同列表
    this.getContactList();
  },
  
  //拖拽上传
  mounted() {
    this.$refs.select_frame.ondragleave = (e) => {
      e.preventDefault();  //阻止离开时的浏览器默认行为
    };
    this.$refs.select_frame.ondrop = (e) => {
      e.preventDefault();    //阻止拖放后的浏览器默认行为
			// 未认证
      if(!this.userInfo.IsAuthentication){
    		this.isShowCertCont =  true;
    		document.getElementById('isFile').value = "";
    		return;
    	}
      const data = e.dataTransfer.files;  // 获取文件对象
      const fileInfo= e.dataTransfer.files[0];
      if (data.length < 1) {
        return;  // 检测是否有文件拖拽到页面     
      }
      //console.log("拖拽",e.dataTransfer.files);
      /*sessionStorage.setItem('fileName',fileInfo.name);
      sessionStorage.setItem('fileType',fileInfo.type);*/
      
	    if(fileInfo.type.indexOf('image') == 0){
	    	//图片转换成pdf
	    	this.ImgToPdf(e.dataTransfer.files);
	    }else{
	    	//文件转换成pdf
  			this.WordToPdf(fileInfo);
	    }
      
    };
    this.$refs.select_frame.ondragenter = (e) => {
      e.preventDefault();  //阻止拖入时的浏览器默认行为
      //this.$refs.select_frame.border = '10px dashed red';
    };
    this.$refs.select_frame.ondragover = (e) => {
      e.preventDefault();    //阻止拖来拖去的浏览器默认行为
    };
  },

  methods: {
  	closeAlert(){
  		this.isShowAlert = false;
  		this.alertContent = "";
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
          console.log(err);
        });
  	},
  	
  	//获取我的合同列表
  	getContactList(){
  		var _this = this;
  		_this.tableLoading = true;
	    //获取我的合同列表
	    this.$axios({
	      method: "post",
	      url: _this.$link + "api/Contract/GetContractOverview",
	      headers: { "access-token": _this.userInfo.Token },
	      data: {
	       timestamp: "1",
	        SecretId: "3",
	        Signature: "4",
	        Data: { 
	        	"Type": "全部合同" ,
	        	"PageSize": 3,
	        	"Page": 1,
	        }
	      }
	    })
      .then(res => {
      	_this.tableLoading = false;
        if (res.data.Code == 0) {
        	//console.log('合同列表',res.data.Data)
	          _this.contractList = res.data.Data.Contracts;
	            
        } else if (res.data.Code == 400) {
          sessionStorage.removeItem("LQUserInfo");
          _this.$router.push({ path: "/login" });
          return;
        }else{
        	_this.dataNone = res.data.Message;
        	//console.log(res.data.Message);
        }
      })
      .catch(err => {
      	_this.tableLoading = false;
      	_this.dataNone = "网络出错，请稍后再试";
        //console.log(err);
      });
  	},
  	
  	//下载合同
  	downLoad(PdfUrl,name){
    	name = name.substring(0,name.lastIndexOf("."));
  		this.$axios({
        method: "get",
        url: PdfUrl,
        responseType: "blob"
      }).then(data => {
        //console.log(data);
        if (!data) {
          return;
        }
        // debugger;
        let url = window.URL.createObjectURL(data.data);
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("downLoad", name+'.pdf'); //设置文件名称
        document.body.appendChild(link);
        link.click();
      });
      
  	},
  	
  	//详情页
    showDetail(contractId){
    	this.$router.push({ name: "fileDetail" ,params:{id:contractId} });
    },
    
  	//升级套餐
  	upgrade(){
  		this.$router.push({ path: "/accountParent/account/package/upGradePackage"});
  	},
  	
    //创建合同
    establishSign(e) {
    	if(!this.userInfo.IsAuthentication){
    		this.isShowCertCont =  true;
    		document.getElementById('isFile').value = "";
    		return;
    	}
      //console.log(e.target.files[0]); 
      var fileInfo= e.target.files[0];
      
	    if(fileInfo.type.indexOf('image') == 0){
	    	//图片转换成pdf
	    	this.ImgToPdf(e.target.files);
	    }else{
	    	//文件转换成pdf
  			this.WordToPdf(fileInfo);
	    }
	   
    },
    
    //文件转换成pdf
    WordToPdf(fileInfo){
    		var _this = this;
    		/*sessionStorage.setItem('fileSize',fileInfo.size);*/ 
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
	        		_this.isShowAlert = true;
	        		_this.alertContent = res.data.Message;
	        		//alert(res.data.Message);
	          }	
	          
	      })
	      .catch(err => {
	          _this.isLoading = false;
	          console.log(err);
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
	      /*sessionStorage.setItem('fileSize',size);*/ 
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
	        		_this.isShowAlert = true;
	        		_this.alertContent = res.data.Message;
	        		//alert(res.data.Message);
	          }	
	          
	      })
	      .catch(err => {
	          _this.isLoading = false;
	          console.log(err);
	      });
    },
    
    
    
  },
};
</script>

<style scoped>
	@import '../assets/css/table.css';
	@import '../assets/css/home.css';
</style>

