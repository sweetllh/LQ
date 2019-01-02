<template>
	<div class="templateDetail">
		<p class="title" @click="backOne"><img src="../../assets/img/icon-left.png"/>模板预览</p>
		<div class="head-bg">
			<div class="name">
				<span>模板名称：{{detailCont.Name}}</span>
				<span style="padding-left: 10px;">模板类型：{{detailCont.Type}}</span>
			</div>
			<div class="btn" @click="downLoad(detailCont.WordUrl,detailCont.Name,)">下载模板</div>
		</div>
		<div class="content" id="viewDiv">
			<div class="listLoading" v-if="listLoading">
			  	<img src="../../assets/img/tableLoading.gif" width="20"/>
			  	<div>拼命加载中</div>
			</div>
			<iframe :src="detailCont.HtmlUrl" name="ifd" ref="ifd" id="iframeId"
				width="100%" scrolling="auto" frameborder="0"></iframe>
		</div>
		
		<!-- 退出弹窗-->
  	 	<alert-dialog :is-show="isShowAlert" :alertCont="alertContent" type="default" 
  	 		@on-close="closeAlert"></alert-dialog>
		
		
	</div>
</template>

<script>
export default{
	data(){
		return{
			userInfo: "",
			isShowAlert: false,
			alertContent: "",
			detailCont: {},
			listLoading: false,
		}
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
	created() {
	  	this.userInfo = JSON.parse(sessionStorage.getItem("LQUserInfo")) || false;
	  	this.templateDetail();   //获取详情
	  	
	},
	mounted(){
		//iframe高度自适应
	},
	methods:{
		backOne(){
			this.$router.go(-1);
		},
		closeAlert(){
	    	this.isShowAlert = false;
	    	this.alertContent = "";
	    },
	    
	    //获取详情
	    templateDetail(){
	    	var _this = this;
	    	_this.listLoading = true;
			this.$axios({
		        method: "post",
		        url: _this.$link + "api/ContractDemo/Detail",
		        headers: { "access-token": _this.userInfo.Token },
		        data: {
		        timestamp: "1",
			        SecretId: "3",
			        Signature: "4",
			        Data: { 
			        	"id": _this.$route.params.id
			        }
			    }
		    })
		    .then(res => {
		    	_this.listLoading = false;
		        if (res.data.Code == 0) {
		        	/*console.log('详情内容',res.data.Data)*/
		        	_this.detailCont = res.data.Data;

		        } else if (res.data.Code == 400) {
		          sessionStorage.removeItem("LQUserInfo");
		          _this.$router.push({ path: "/login" });
		          return;
		        }else{
			      	_this.isShowAlert = true;
			     	_this.alertContent = res.data.Message;
		        	//console.log(res.data.Message)
		        }
		    })
		    .catch(err => {
		    	_this.listLoading = false;
		        //console.log(err);
		        _this.isShowAlert = true;
	     		_this.alertContent = "网络出错，请稍后再试";
		    });
	    },
	    
	    //下载模板
	  	downLoad(WordUrl,name){
	    	//name = name.substring(0,name.lastIndexOf("."));
	  		this.$axios({
		        method: "get",
		        url: WordUrl,
		        responseType: "blob"
		      }).then(data => {
		        //console.log(data);
		        if (!data) {
		          return;
		        }
		        // debugger;
		        if (window.navigator.msSaveOrOpenBlob) {   // if browser is IE
		            navigator.msSaveBlob(WordUrl, name);//filename文件名包括扩展名，下载路径为浏览器默认路径
		        }else{
		        		let url = window.URL.createObjectURL(data.data);
				        let link = document.createElement("a");
				        link.style.display = "none";
				        link.href = url;
				        link.setAttribute("downLoad", name); //设置文件名称
				        document.body.appendChild(link);
				        link.click();
		        }
		        
		     });
      
  		},
  		
		
		
		

	}
}
</script>

<style scoped>
.templateDetail{
	max-width: 970px;
	margin: 0 auto;
	padding: 85px 40px 0;
}
.title{
	line-height: 24px;
	color: #303030;
	font-size: 18px;
	/*padding-left: 20px;*/
	cursor: pointer;
	margin-bottom: 17px;
}
.title img{
	margin-right: 15px;
}
.head-bg{
	width: 100%;
	/*height: 40px;*/
	line-height: 40px;
	background: #F3F3F3;
	font-size: 14px;
	margin-bottom: 20px;
	display: flex;
	justify-content: space-between;
}
.head-bg .name{
	padding-left: 34px;
	color: #949494;
}
.head-bg .btn{
	margin: 5px 13px;
	width: 100px;
	height: 30px;
	line-height: 30px;
	background: #FC4514;
	text-align: center;
	color: #fff;
	cursor: pointer;
}
.content{
	width: 100%;
	height: 100%;
	/*font-size: 0;*/
	/*width: 900px;*/
	margin: 0 auto 30px;
	overflow: hidden;
	position: relative;
}
iframe{
	width: 100%;
	height: 100%;
	min-height: 3200px;
}

@media only screen and (max-width: 640px) {
	.head-bg .name span{
		display: block;
		padding-left: 0 !important;
	}
}

</style>