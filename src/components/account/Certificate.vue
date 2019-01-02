<template>
  <div id="certificate">
   <!-- <v-header></v-header>-->
    <div class="container">
      <!-- 菜单栏栏 -->
      <div class="header">
      	<div class="header-wrap">
      			<p class="title" @click="backOne"><img src="../../assets/img/icon-left.png"/>企业认证</p>
			      <div class="menu hidden-xs-only">
			      	<span :class="{active: !nextFlag}">填写企业基本信息
			      	</span><span :class="{active: nextFlag}">
			      		身份信息
			      	</span>
			      </div>
      	</div>
      		
      </div>
      <!-- 内容 -->
      <div class="content">
      	<form action="">
	  		<ul :class="{hidden: nextFlag }" class="cInfo">
	  			<li>
	  				<label for="">企业名称</label>
	  				<input type="text" placeholder="输入企业全称" id="companyName" autocomplete="off"
	  				v-model="CInfo.companyName" @input="inputChange(0)"/>
	  				<p class="tip">{{tip.companyNameTip}}</p>
	  			</li>
	  			<li>
	  				<label for="">组织机构代码</label>
	  				<input type="text" placeholder="12345678-1" id="organizeNumber" autocomplete="off" v-model="CInfo.organizeNumber" 
	  					@input="inputChange(1)" maxlength="18"/>
	  				<p class="tip">{{tip.organizeNumberTip}}</p>
	  			</li>
	  			<li>
	  				<label for="">工商执照注册号</label>
	  				<input type="text" placeholder="123456789123456" id="registrationNumber" maxlength="18" autocomplete="off"
	  					v-model="CInfo.registrationNumber" @input="inputChange(2)"/>
	  				<p class="tip">{{tip.regiNumTip}}</p>
	  			</li>
	  			<li>
	  				<label for="">企业负责人姓名/法定代表</label>
	  				<input type="text" placeholder="张三" id="headerName" v-model="CInfo.headerName" autocomplete="off"
	  					@input="inputChange(3)" maxlength="18"/>
	  				<p class="tip">{{tip.headerNameTip}}</p>
	  			</li>
	  			<li>
	  				<label for="">企业负责人身份证号</label>
	  				<input type="text" placeholder="441010197001010000" id="headerIDNumber"  maxlength="18" autocomplete="off"
	  					v-model="CInfo.headerIDNumber" @input="inputChange(4)"/>
	  				<p class="tip">{{tip.headerIDNumberTip}}</p>
	  			</li>
	  			<li class="upLoad">
	  				<label for="">上传营业执照图片</label>
	  				<!--<div class="clearfix">-->
	  						<div class="left">
	  							<img :src="CInfo.licenseImg"  alt="" />
	  							<!--<span @click="prewImg(CInfo.licenseImg)">预览</span>-->
	  						</div>
	  						<div class="right">
	  							<div class="imgTip">
	  								<p>请上传原件或扫描件，或者复印件加盖企业公章后的扫描件在有效期内且年检章齐全（当年成立的可无年检章）,由中国大陆工商局或市场监督管理局颁发，</p>
	  								<p>支持jpg,jpeg,bmp,gif,png.格式照片，大小不超过2M。</p>
	  							</div>
	  							<div class="chooseImg">
	  								<p>选择图片</p>
	  								<input type="file" accept='image/*'  @change="uploadImg(1,$event)"/>
	  							</div>
	  							
	  						</div>
	  						
	  				<!--</div>-->
	  				<div class="tip">{{tip.licenseImgTip}}</div>
	  			</li>
	  			<li class="upLoad">
	  					<label for="">上传申请文件</label>
	  					<!--<div class="clearfix">-->
	  						<div class="left">
	  							<img :src="CInfo.applicationImg"  alt="" />
	  							<!--<span @click="prewImg(CInfo.applicationImg)">预览</span>-->
	  						</div>
	  						<div class="right">
	  							<div class="imgTip">
	  								<p>请下载<span style="cursor: pointer;" @click="downLoadDom">《企业账户认证及申请表》</span>并按要求填写。要求<span>法人代表/负责人 或代理人签字，并加盖企业公章</span>，</p>
	  								<p>支持jpg,jpeg,bmp,gif,png.格式照片，大小不超过2M。</p>
	  							</div>
	  							<div class="chooseImg">
	  								<p>选择图片</p>
	  								<input type="file" accept='image/*'  @change="uploadImg(2,$event)"/>
	  							</div>
	  							
	  						</div>
	  						
	  					<!--</div>-->
	  			</li>
	  			<li>
	  				<label for="">企业负责人手机号</label>
	  				<input type="text" placeholder="用于接收重要通知" id="headerMobil" v-model="CInfo.headerMobil" autocomplete="off"
	  					maxlength="11" @input="inputChange(5)"/>
	  				<p class="tip">{{tip.headerMobilTip}}</p>
	  			</li>
	  			<li class="codeWrap">
	  				<label for="">短信验证码</label>
	  				<input type="text"  v-model="CInfo.headerMobilAuthCode" id="code" autocomplete="off"
	  					maxlength="6" @input="inputChange(6)"/>
	  				<div class="getCode-wrap">
                <div @click="getCode()" class="getCode" v-if="getCodeFlag">获取验证码</div>
                <span v-if="!getCodeFlag">重新发送（{{time}}s）</span>
            </div>
            <p class="tip">{{tip.codeTip}}</p>
	  			</li>
	  			<li class="btn-wrap">
	  				<label for=""></label>
	  				<span class="btn next-btn" @click="nextFlag = true">下一步</span>
	  				<div v-if="!isNextFlag" class="btn-hide"></div>
	  			</li>
	  		</ul>
	  		
	  		
	  		<ul :class="{hidden: !nextFlag }" class="idInfo">
	  				<li class="upLoad">
		  				<label for="">上传身份证正面图片</label>
		  				<!--<div class="clearfix">-->
		  						<div class="left">
		  							<img :src="CInfo.frontIDCImg" alt=""/>
		  							<!--<span @click="prewImg(CInfo.frontIDCImg )">预览</span>-->
		  						</div>
		  						<div class="right">
		  							<div class="imgTip">
		  								<p>请上传身份证人像面，注意边缘不超出边框外，确保照片清晰可见，保持水平，注意反光，</p>
		  								<p>支持jpg,jpeg,bmp,gif,png.格式照片，大小不超过2M。</p>
		  							</div>
		  							<div class="chooseImg">
		  								<p>选择图片</p>
		  								<input type="file" accept='image/*'  @change="uploadImg(3,$event)"/>
		  							</div>
		  							
		  						</div>
		  						
		  				<!--</div>-->
		  			</li>
		  			<li class="upLoad">
		  				<label for="">上传身份证背面图片</label>
		  				<!--<div class="clearfix">-->
		  						<div class="left">
		  							<img :src="CInfo.backIDCImg" alt="" />
		  							<!--<span @click="prewImg(CInfo.backIDCImg)">预览</span>-->
		  						</div>
		  						<div class="right">
		  							<div class="imgTip">
		  								<p>请上传国徽面，注意边缘不超出边框外，确保照片清晰可见，保持水平，注意反光，</p>
		  								<p>支持jpg,jpeg,bmp,gif,png.格式照片，大小不超过2M。</p>
		  							</div>
		  							<div class="chooseImg">
		  								<p>选择图片</p>
		  								<input type="file" accept='image/*' @change="uploadImg(4,$event)"/>
		  							</div>
		  							
		  						</div>
		  						
		  				<!--</div>-->
		  			</li>
		  			<li class="btn-wrap">
		  				<label for=""></label>
		  				<span class="btn pre-btn" @click="nextFlag = false">上一步
		  				</span><span class="btn" @click="submitCont()">提交</span>
		  				<div v-if="!isSendFlag" class="btn-hide"></div>
		  			</li>
	  		</ul>
  			</form>
    	</div>
  </div>
  
  
 	 <!--预览图片-->
		<div class="preViewImg" v-if="isPrewImg">
			<div class="wrap" id="imgWrap">
					<img :src="prewImgUrl"/>
			</div>
			<div>
	        <span class="close" @click="closeImg"></span>
  		</div>
		</div>
		
			<!--加载中-->
    <div class="loading" v-if="isLoading">
  		<img src="../../assets/img/loading.gif"/>
  	</div>
  	
  	<!--alert弹窗-->
  	<alert-dialog :is-show="isShowAlert && type=='confirm'" :alertCont="alertContent" 
  		:type="type" @on-close="closeAlert" @confirm="backFather"></alert-dialog>
  		
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
    	userInfo: '',
    	CInfo: {
    		companyName: '',								 //公司名称
    		organizeNumber: "",              //组织机构代码
    		registrationNumber: "",          //工商注册号
    		headerName: "",									 //企业负责人姓名
    		headerIDNumber: "",              //企业负责人身份证号
    		headerMobil: "",								 //企业负责人手机号
    		headerMobilAuthCode: "",         //验证码
    		applicationImg: require('../../assets/img/application.png'),  //申请表
    		licenseImg: require('../../assets/img/license.png')		,       //营业执照
    		frontIDCImg: require('../../assets/img/frontID.png')    ,       //身份证正面
    		backIDCImg: require('../../assets/img/backID.png')    ,         //身份证反面
    	},
    	files: {
    		applicationFile: "",
    		licenseFile: "",
    		frontIDCFile: "",
    		backIDCFile: "",
    		
    		applicationFileType: "",
    		licenseFileType: "",
    		frontIDCFileType: "",
    		backIDCFileType: "",
    	},
    	nextFlag: false,  //是否显示下一步的内容
    	isNextFlag: false,//下一步是否可点击
    	isSendFlag: false,//发送是否可点击
    	getCodeFlag: true,
    	time: 60,
    	isPrewImg: false,
    	isLoading: false,
    	prewImgUrl: "",
    	status:{
    		companyNameStatus: false,								 //公司名称
    		organizeNumberStatus: false,              //组织机构代码
    		regiNumStatus: false,          						//工商注册号
    		headerNameStatus: false,									 //企业负责人姓名
    		headerIDNumberStatus: false,              //企业负责人身份证号
    		headerMobilStatus: false,								 //企业负责人手机号
    		codeStatus: false,         								//验证码
    		licenseImgStatus: false,
    		applyDomImgStatus: false,
    		frontIDCImgStatus: false,
    		backIDCImgStatus: false,
    	},
    	tip:{
    		companyNameTip: '',								 //公司名称
    		organizeNumberTip: "注：如三证合一，填统一社会信用代码",              //组织机构代码
    		regiNumTip: "注：如三证合一，填统一社会信用代码",          						//工商注册号
    		headerNameTip: "",									 //企业负责人姓名
    		headerIDNumberTip: "",              //企业负责人身份证号
    		headerMobilTip: "",								 //企业负责人手机号
    		codeTip: "",         							//验证码
    		licenseImgTip: "",
    		applyDomImgTip: "",
    		frontIDCImgTip: "",
    		backIDCImgTip: "",
    	},
    	
    	isShowAlert: false,
      alertContent: "",
      type: "",
    };
  },
  watch: {
  	status:{
  		handler(val,oldval){
  			//console.log(val,9999)
  			if (!this.nextFlag) {
	        if (this.status.companyNameStatus && this.status.organizeNumberStatus && this.status.regiNumStatus 
	        	&& this.status.headerNameStatus && this.status.headerIDNumberStatus && this.status.headerMobilStatus
	        	&& this.status.codeStatus && this.status.licenseImgStatus && this.status.applyDomImgStatus) {
	          this.isNextFlag = true;
	        } else {
	          this.isNextFlag = false;
	        }
	      } else {
	        if (this.status.frontIDCImgStatus && this.status.backIDCImgStatus) {
	          this.isSendFlag = true;
	        } else {
	          this.isSendFlag = false;
	        }
	      }
  		},
  		deep:true
  	}
  },
  created() {
   	this.userInfo = JSON.parse(sessionStorage.getItem("LQUserInfo")) || false;
   	
  },
  methods: {
  	backOne(){
			this.$router.go(-1);
		},
		closeAlert(){
	  		this.isShowAlert = false;
	  		this.alertContent = "";
	  },
  	//提交
  	submitCont(){
  			var _this = this;
	      var formData = new FormData();
	      formData.append("file", _this.files.licenseFile,"BusinessLicense."+_this.files.licenseFileType);
	      formData.append("file", _this.files.applicationFile,"ApplyDocument."+_this.files.applicationFileType);
	      formData.append("file", _this.files.frontIDCFile,"HeaderIDCard1."+_this.files.frontIDCFileType);
	      formData.append("file", _this.files.backIDCFile,"HeaderIDCard2."+_this.files.backIDCFileType);
	      
	      formData.append("CompanyName", _this.CInfo.companyName);
	      formData.append("OrganizeNumber",_this.CInfo.organizeNumber);
	      formData.append("RegistrationNumber", _this.CInfo.registrationNumber);
	      formData.append("HeaderName",_this.CInfo.headerName);
	      formData.append("HeaderIDNumber", _this.CInfo.headerIDNumber);
	      formData.append("HeaderMobil",_this.CInfo.headerMobil);
	      formData.append("HeaderMobilAuthCode", _this.CInfo.headerMobilAuthCode);
	      _this.isLoading = true;
	      this.$axios({
	        method: "post",
	        url: _this.$link + "api/CompanyAuth/Send",
	        headers: { "access-token": _this.userInfo.Token },
	        data: formData
	      })
	      .then(res => {
	          //console.log("发送",res.data);
	          _this.isLoading = false;
	          if(res.data.Code == "0"){
	          	_this.type = "confirm";
	          	_this.isShowAlert = true;
	        		_this.alertContent = "提交成功，请等待审核通过。审核通过后，可在账号菜单栏下的印章管理查到企业电子章。";
	        		
	        	}else if (res.data.Code == 400) {
			          sessionStorage.removeItem("LQUserInfo");
			          _this.$router.push({ path: "/login" });
			       }else{
	        		_this.type = "defalut";
	        		_this.isShowAlert = true;
	        		_this.alertContent = res.data.Message;
	        		//alert(res.data.Message);
	          }	
	          
	      })
	      .catch(err => {
	          _this.isLoading = false;
	          //console.log(err);
	          _this.type = "defalut";
	        	_this.isShowAlert = true;
	        	_this.alertContent = "网络出错，请稍后再试";
	      });
  	},
  	backFather(){
  		this.$router.push({ path: "/accountParent/account/basicInfo"});
  	},
  	// 获取验证码
    getCode() {
    	if (!this.status.headerMobilStatus) {
        document.getElementById("headerMobil").style.borderColor = "#FC4514";
        document.getElementById("headerMobil").focus();
        this.tip.headerMobilTip = "请输入企业负责人手机号";
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
          Data: { TelePhone: _this.CInfo.headerMobil }
        }
      })
        .then(res => {
         // console.log(res.data);
         if(res.data.Code == 0){
         		_this.getCodeFlag = false;
		        _this.timeOut(60);
		        _this.time = 60;
		        _this.tip.codeTip = "验证码已发送到手机"
         }else if (res.data.Code == 400) {
		          _this.$router.push({ path: "/login" });
		     }else{
         		_this.tip.codeTip = res.data.Message
         }
         
          // if(res.data)
        })
        .catch(err => {
          //console.log(err);
          /*_this.type = "defalut";
	        _this.isShowAlert = true;*/
	      	_this.tip.codeTip = "网络出错，请稍后再试";
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
  	
  	//下载申请表
  	downLoadDom(){
			 var _this = this;
  		 this.$axios({
	        method: "get",
	        url: _this.$link+ "api/Files/CompanyAuthApply",
	        responseType: "blob"
	      }).then(data => {
	        //console.log(data);
	        if (!data) {
	          return;
	        }
	        // debugger;
	        if (window.navigator.msSaveOrOpenBlob) {   // if browser is IE
	            navigator.msSaveBlob(PdfUrl, '企业认证申请表.pdf');//filename文件名包括扩展名，下载路径为浏览器默认路径
	        }else{
	        		let url = window.URL.createObjectURL(data.data);
			        let link = document.createElement("a");
			        link.style.display = "none";
			        link.href = url;
			        link.setAttribute("downLoad", '企业认证申请表.pdf'); //设置文件名称
			        document.body.appendChild(link);
			        link.click();
	        }
	        
	      });
  	},
  	
    //上传营业执照,文件，身份证
    uploadImg(type,ev){
    	let fileInfo = ev.target.files[0];
    	let fileType = ((fileInfo.type).split('/'))[1];
    	let fileSize = 0;
	    let isIE = /msie/i.test(navigator.userAgent) && !window.opera;
	    if (isIE && !ev.currentTarget.files) {
	        let filePath = ev.currentTarget.value;
	        let fileSystem = new ActiveXObject("Scripting.FileSystemObject");
	        if(!fileSystem.FileExists(filePath)){ 
						alert("附件不存在，请重新输入！"); 
						return false; 
					} 
	        let file = fileSystem.GetFile (filePath);
	        fileSize = file.Size;
	    }else {
	        fileSize = fileInfo.size;
	        
	    }
	    //fileSize = Math.round(fileSize/1024/1024*100)/100;   
	    /*if(fileSize>=2){
	       if(type == 1){
	       		this.tip.licenseImgTip = "您上传的图片大小超过2M，请重新上传!";
	       		this.status.licenseImgStatus = false;
	       }else if(type == 2){
	       		this.tip.applyDomImgTip = "您上传的图片大小超过2M，请重新上传!";
	       		this.status.applyDomImgStatus = false;
	       }else if(type == 3){
	       		this.tip.frontIDCImgTip = "您上传的图片大小超过2M，请重新上传!";
	       		this.status.frontIDCImgStatus = false;
	       }else if(type == 4){
	       		this.tip.backIDCImgTip = "您上传的图片大小超过2M，请重新上传!";
	       		this.status.backIDCImgStatus = false;
	       }
	        return ;
	    }else{*/
	    	if(type == 1){
	       		this.tip.licenseImgTip = "";
	       		this.status.licenseImgStatus = true;
	       }else if(type == 2){
	       		this.tip.applyDomImgTip = "";
	       		this.status.applyDomImgStatus = true;
	       }else if(type == 3){
	       		this.tip.frontIDCImgTip = "";
	       		this.status.frontIDCImgStatus = true;
	       }else if(type == 4){
	       		this.tip.backIDCImgTip = "";
	       		this.status.backIDCImgStatus = true;
	       }
	    /*}*/
	    
    	if(type == 1){  //营业执照
    		this.files.licenseFile = fileInfo;
    		this.files.licenseFileType = fileType;
    		this.CInfo.licenseImg = this.getObjectURL(fileInfo);
    	}else if(type == 2){  //申请文件
    		this.files.applicationFile = fileInfo;
    		this.files.applicationFileType = fileType;
    		this.CInfo.applicationImg = this.getObjectURL(fileInfo);
    	}else if(type == 3){  //身份证正面
    		this.files.frontIDCFile = fileInfo;
    		this.files.frontIDCFileType = fileType;
    		this.CInfo.frontIDCImg = this.getObjectURL(fileInfo);
    	}else if(type == 4){   //身份证反面
    		this.files.backIDCFile = fileInfo;
    		this.files.backIDCFileType = fileType;
    		this.CInfo.backIDCImg = this.getObjectURL(fileInfo);
    	}
    		
    },
    
    inputChange(e){
    	var phoneReg = /(^1[3-578]\d{9}$)/;
    	var codeReg = /^\d{6}$/;
    	var IdReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    	var organCodeReg = /^[A-Za-z0-9]{8}-[A-Za-z0-9]{1}/;
    	var regiNumReg = /^([0-9a-zA-Z]{18}$|\d{15}$)/;
    	/*/(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/;*/
    	if(e == 0){
	    		if (!this.CInfo.companyName) {
	          document.getElementById("companyName").style.borderColor = "#FC4514";
	          this.status.companyNameStatus = false;
	          this.tip.companyNameTip = "请输入企业名称";
	        } else {
	          document.getElementById("companyName").style.borderColor = "#BCBCBC";
	          this.status.companyNameStatus = true;
	          this.tip.companyNameTip = "";
	        }
    	}else if(e == 1){
	    		if (!organCodeReg.test(this.CInfo.organizeNumber) && !regiNumReg.test(this.CInfo.organizeNumber)) {
	          document.getElementById("organizeNumber").style.borderColor = "#FC4514";
	          this.status.organizeNumberStatus = false;
	          !this.CInfo.organizeNumber ? this.tip.organizeNumberTip = "请输入组织机构代码" : this.tip.organizeNumberTip = '输入的组织机构代码格式不正确 ';
	        } else {
	          document.getElementById("organizeNumber").style.borderColor = "#BCBCBC";
	          this.status.organizeNumberStatus = true;
	          this.tip.organizeNumberTip = "";
	        }
      }else if(e == 2){
        	if (!regiNumReg.test(this.CInfo.registrationNumber)) {
	          document.getElementById("registrationNumber").style.borderColor = "#FC4514";
	          this.status.regiNumStatus = false;
	          !this.CInfo.registrationNumber ? this.tip.regiNumTip = "请输入工商执照注册号" : this.tip.regiNumTip = '输入的工商执照注册号格式不正确 ';
	        } else {
	          document.getElementById("registrationNumber").style.borderColor = "#BCBCBC";
	          this.status.regiNumStatus = true;
	          this.tip.regiNumTip = "";
	        }
    	}else if(e == 3){
    			if (this.CInfo.headerName == "") {
	          document.getElementById("headerName").style.borderColor = "#FC4514";
	          this.status.headerNameStatus = false;
	          this.tip.headerNameTip = "请输入企业负责人姓名/法定代表";
	        } else {
	          document.getElementById("headerName").style.borderColor = "#BCBCBC";
	          this.status.headerNameStatus = true;
	          this.tip.headerNameTip = "";
	        }
    	}else if(e == 4){
    			if (!IdReg.test(this.CInfo.headerIDNumber)) {
	          document.getElementById("headerIDNumber").style.borderColor = "#FC4514";
	          this.status.headerIDNumberStatus = false;
	          !this.CInfo.headerIDNumber ? this.tip.headerIDNumberTip = "请输入企业负责人身份证号" : this.tip.headerIDNumberTip = '输入的企业负责人身份证号格式不正确 ';
	        } else {
	          document.getElementById("headerIDNumber").style.borderColor = "#BCBCBC";
	          this.status.headerIDNumberStatus = true;
	          this.tip.headerIDNumberTip = "";
	        }
    	}else if(e == 5){
    			if (!phoneReg.test(this.CInfo.headerMobil)) {
	          document.getElementById("headerMobil").style.borderColor = "#FC4514";
	          this.status.headerMobilStatus = false;
	          !this.CInfo.headerMobil ? this.tip.headerMobilTip = "请输入企业负责人手机号" : this.tip.headerMobilTip = '输入的手机号码格式不正确';
	        } else {
	          document.getElementById("headerMobil").style.borderColor = "#BCBCBC";
	          this.status.headerMobilStatus = true;
	          this.tip.headerMobilTip = "";
	        }
    	}else if(e == 6){
    			if (!codeReg.test(this.CInfo.headerMobilAuthCode)) {
	          document.getElementById("code").style.borderColor = "#FC4514";
	          this.status.codeStatus = false;
	          !this.CInfo.headerMobilAuthCode ? this.tip.codeTip = "请输入手机验证码" : this.tip.codeTip = '请输入6位数验证码 ';
	        } else {
	          document.getElementById("code").style.borderColor = "#BCBCBC";
	          this.status.codeStatus = true;
	          this.tip.codeTip = "";
	        }
    	}
    },
    //预览图片
    prewImg(imgUrl){
    	this.isPrewImg = true;
    	this.prewImgUrl = imgUrl;
    },
    //关闭预览
		closeImg(){
			this.isPrewImg = false;
		},
		
		//获取本地文件路径
    getObjectURL(file) {
      let url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      }else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      } 
      return url;
    },
		
  },
 
};
</script>

<style scoped>
	@import '../../assets/css/dialogCont.css';
#certificate{
	padding-top: 85px;
	font-family:MicrosoftYaHeiLight;
}
.header{
	width: 100%;
	border-bottom: 1px solid #CACACA;
}
.header-wrap .title{
	max-width: 970px;
	margin: 0 auto 15px;
	padding: 0 40px;
	color: #303030;
	line-height: 24px;
	font-size: 18px;
	cursor: pointer;
}
.header-wrap .title img{
	margin-right: 10px;
}
.header-wrap .menu{
	/*max-width: 970px;*/
	width: 560px;
	min-width: 560px;
	padding: 0 40px;
	margin: 0 auto 15px;
}
.menu span{
	display: inline-block;
	width: 238px;
	height: 34px;
	line-height: 34px;
	text-align: center;
	padding-left: 30px;
	border: 1px solid #CACACA;
	border-right: none;
	position: relative;
	color: #aaa;
	font-size: 14px;
	cursor: pointer;
	background: #fff url('../../assets/img/file-wrong.png') no-repeat 25% center;
}
.menu span.active{
	border: 1px solid #ECECEC;
	background: #ECECEC url('../../assets/img/file-sure.png') no-repeat 25% center;
}

.menu span:before{
	content: "";
	position: absolute;
	top: 4px;
	right: -12px;
	width: 25px;
	height: 24px;
	transform: rotate(45deg);
	background: #fff;
	z-index: 2;
	border-top: 1px solid #CACACA;
	border-right: 1px solid #CACACA;
}
.menu span.active:before{
	background: #ECECEC;
	border-color: #ECECEC;
}
.menu span:first-child:before{
	border-color: #ECECEC;
	right: -14px;
}
.menu span:last-child{
	background: #fff url('../../assets/img/file-wrong.png') no-repeat 35% center;
}
.menu span.active:last-child{
	border: 1px solid #ECECEC;
	/*right: -14px;*/
	background:#ECECEC url('../../assets/img/file-sure.png') no-repeat 35% center;
}
.menu span.active:last-child:before{
	right: -14px;
}
.content{
	max-width: 970px;
	padding: 0 40px;
	margin: 15px auto 50px;
	font-size: 14px;
}
.content li{
		margin-bottom: 20px;
		position: relative;
}
.content li .tip{
	position: absolute;
	left: 215px;
	bottom: -18px;
	color: #FC4514;
	font-size: 12px;
}
li label{
	width: 176px;
	display: inline-block;
	padding-right: 25px;
	text-align: right;
	color: #0C0C0C;
	white-space: nowrap;
}
li input{
	max-width: 580px;
	height: 34px;
	line-height: 34px;
	padding-left: 10px;
	box-sizing: border-box;
	border-radius: 4px;
	border: 1px solid #CACACA;
	font-size: 14px;
}
.codeWrap{
	display: flex;
	/*justify-content: ;*/
}
.codeWrap input{
	width: 25%;
	min-width: 80px;
}


.getCode-wrap{
	margin-left: 20px;
	min-width: 100px;
	width: 100px;
	height: 34px;
	line-height: 34px;
	text-align: center;
	position: relative;
}
.getCode {
  width: 100%;
  height: 34px;
  background: #3b4356;
  border-radius: 4px;
  outline: 0;
  line-height: 34px;
  color: #fff;
  cursor: pointer;
}
.getCode-wrap span {
  position: absolute;
  left: -1px;
  top: 0;
  bottom: 0;
  right: -1px;
  background: #efefef;
  border-radius: 4px;
  color: #ccc;
  line-height: 34px;
  font-size: 12px;
}

li .btn{
	display: inline-block;
	width: 110px;
	height: 34px;
	line-height: 34px;
	border-radius: 4px;
	background: #FC4514;
	color: #fff;
	cursor: pointer;
	padding-top: 2px;
	text-align: center;
}
li .btn a{
	color: #fff;
}
li .pre-btn{
	background: #B1B1B1;
	margin-right: 20px;
}
.clearfix{
	display: inline-block;
	max-width: 600px;
}
.upLoad {
	margin-top: 40px;
	display: flex;
}
.upLoad label{
	position: relative;
	/*top: -100px;*/
}
.cInfo .upLoad .left{
	margin-right: 25px;
	/*float: left;*/
	width: 106px;
	height: 144px;
	border: 1px solid #D9D9D9;
	overflow: hidden;
	position: relative;
}
.cInfo .upLoad .left img{
	max-width: 108px;
	max-height: 146px;
}

.cInfo .upLoad .right{
	max-width: 460px;
	height: 144px;
	float: right;
	position: relative;
	/*text-align: center;*/
}
.idInfo .upLoad .left{
	margin-right: 25px;
	/*float: left;*/
	width: 298px;
	height: 197px;
	box-shadow: 2px 3px 7px 4px #dbdbdb;
	overflow: hidden;
	position: relative;
	text-align: center;
}
.idInfo .upLoad .left img{
	max-width: 298px;
	max-height: 197px;
}
.idInfo .upLoad .right{
	width: 275px;
	height: 197px;
	float: right;
	position: relative;
}
.idInfo .upLoad .right .imgTip{
	padding-top: 25px;
}
.upLoad .right .imgTip{
	color: #999;
	line-height: 24px;
}
.upLoad .right .imgTip span{
	color: #FC4514;
}
.upLoad .right .chooseImg{
	position: absolute;
	bottom: 0;
}
.upLoad .right .chooseImg p{
	width: 120px;
	height: 32px;
	line-height: 32px;
	border-radius: 4px;
	background: #EDEDED;
	text-align: center;
}
.upLoad .right .chooseImg input{
	position: absolute;
	right: 0;
	top: 0;
	width: 120%;
	height: 100%;
	opacity: 0;
	cursor: pointer;
}
.hidden{
	display: none;
}

.loading{
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: rgba(0,0,0,0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 99;
}
.loading img{
	width: 100px;
}


.btn-wrap {
	position: relative;
}
.btn-wrap .btn-hide{
	width: 110px;
  height: 45px;
  position: absolute;
  top: -6px;
  left: 205px;
  background: rgba(255, 255, 255, 0.5);
}
.idInfo .btn-wrap{
	margin-top: 40px;
}
.idInfo .btn-wrap .btn-hide{
	left: 335px;
}
/*预览*/
/*.left span{
		position: absolute;
    display: none;
    width: 100%;
		height: 100%;
		left: 0;
		top: 0;
    text-align: center;
    font-size: 15px;
    color: #fff;
    line-height: 140px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 3;
    cursor: pointer;
}
.idInfo .left span{
	line-height: 200px;
}
.left:hover span{
	display: block;
}*/

.preViewImg{
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: rgba(0,0,0,0.5);
	z-index: 98;
}
.preViewImg .wrap{
		text-align: center;
    position: absolute;
    top: 90px;
    bottom: 10px;
    left: 50%;
    margin-left: -500px;
    width: 1000px;
    background: transparent;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
}
.preViewImg img{
		max-width: 970px;
}
.preViewImg .close {
    position: fixed;
		right: 5px;
		top: 85px;
    background: url(../../assets/img/big-close.png) no-repeat center;
    cursor: pointer;
    text-align: center;
    height: 30px;
    width: 30px;
    border-radius: 50%;
}




@media only screen and (max-width: 991px) and (min-width: 767px){
	 li input{
		width: 60%;
	}
}

@media only screen and (max-width: 767px){
	 li label{
		text-align: left;
		width: 100%;
		margin-bottom: 5px;
	}
	li input{
		width: 100%;
	}
	.content li .tip{
		left: 0;
	}
	.codeWrap{
		flex-wrap: wrap;
	}
	.upLoad{
		flex-wrap: wrap;
	}
	.upLoad label{
		top: 0;
	}
	.upLoad .left,.upLoad .right{
		float: none !important;
		height: auto !important;
	}
	.upLoad .right .chooseImg{
		position: inherit;
	}
	.btn-wrap .btn-hide{
			top: 19px;
			left: 0;
	}
	.idInfo .btn-wrap .btn-hide{
			left: 130px;
	}
}


   /*自定义滚动条 */
.wrap::-webkit-scrollbar{/*滚动条整体部分，其中的属性有width,height,background,border等（就和一个块级元素一样）（位置1）*/
	width:10px;
	height:10px;
	border-radius:6px;
}
.wrap::-webkit-scrollbar-button{/*滚动条两端的按钮，可以用display:none让其不显示，也可以添加背景图片，颜色改变显示效果（位置2）*/
	display: none;
}
.wrap::-webkit-scrollbar-track{/*外层轨道，可以用display:none让其不显示，也可以添加背景图片，颜色改变显示效果（位置3）*/
		background:#7F7F7F;
		border-radius:6px;
}
.wrap::-webkit-scrollbar-track-piece{/*内层轨道，滚动条中间部分（位置4）*/
		background:#7F7F7F;
		border-radius:6px;
}
.wrap::-webkit-scrollbar-thumb{/*滚动条里面可以拖动的那部分（位置5）*/
	background: #fff;
	border-radius:6px;
}
.wrap::-webkit-scrollbar-corner {/*边角（位置6）*/
	background: #7F7F7F; 
}
.wrap::-webkit-scrollbar-resizer  {/*定义右下角拖动块的样式（位置7）*/
	background: #7F7F7F ;
}
.wrap::-webkit-scrollbar-hightlight-color  {/*定义右下角拖动块的样式（位置7）*/
	background: #7F7F7F ;
}

.wrap{
	scrollbar-arrow-color: #8F8F8F; /**//*三角箭头的颜色*/ 
	scrollbar-face-color: #fff; /**//*立体滚动条的颜色*/ 
	scrollbar-3dlight-color: #fff; /**//*立体滚动条亮边的颜色*/ 
	scrollbar-highlight-color: #8F8F8F; /**//*滚动条空白部分的颜色*/ 
	scrollbar-shadow-color: #8F8F8F; /**//*立体滚动条阴影的颜色*/ 
	scrollbar-darkshadow-color: #8F8F8F; /**//*立体滚动条强阴影的颜色*/ 
	scrollbar-track-color: #8F8F8F; /**//*立体滚动条背景颜色*/ 
	scrollbar-base-color:#8F8F8F; /**//*滚动条的基本颜色*/ 
}
</style>

