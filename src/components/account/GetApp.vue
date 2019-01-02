<template>
	<div class="getApp">
		<p class="title" @click="backOne"><img src="../../assets/img/icon-left.png"/>下载APP</p>
		<div class="head-bg"></div>
		<div class="content">
			<ul class="clearfix">
				<li>
					<div class="imgWrap">
						<img src="../../assets/img/Android.png"/>
					</div>
					<div class="detail">
						<p class="type">Android 客户端</p>
						<p class="version">支持Android4-8.1</p>
						<p class="downLoad" @click="isShowAndroid = true">点击下载</p>
					</div>
				</li>
				<li>
					<div class="imgWrap">
						<img src="../../assets/img/IOS.png"/>
					</div>
					<div class="detail">
						<p class="type">IOS 客户端</p>
						<p class="version">兼容iphone/ipad</p>
						<p class="downLoad" @click="isShowIOS = true">点击下载</p>
					</div>
				</li>
			</ul>
			<p class="tip"><span>《中华人民共和国电子签名法》</span>要求签署方身份真实， 完成实名认证，签署的文件才具备法律效力!</p>
		</div>
		
		<!--下载安卓二维码-->
		<div class="downloadTip">
			<div class="contCover" v-show="isShowAndroid"></div>
	  		<transition  name="drop">
	  			<div class="AndroidCont" v-if="isShowAndroid">
					<img class="dialog-close" @click="isShowAndroid = false" src="../../assets/img/icon-close.png"/>
					<p>扫描二维码下载</p>
					<div class="img-wrap">
						<img src="../../assets/img/wei.png" alt=""/>
					</div>
					
				</div>
	  		</transition >
	  	</div>
		
		<!--ios提示-->
		<div class="downloadTip" >
			<div class="contCover" v-show="isShowIOS"></div>
	  		<transition  name="drop">
	  			<div class="IOScont" v-if="isShowIOS">
					<img class="dialog-close" @click="isShowIOS = false" src="../../assets/img/icon-close.png"/>
					<p>前往AppStore搜索并下载<span>链签App</span></p>
				</div>
	  		</transition >
	  	</div>
	  	
	  	<!--<p contenteditable="true" style="outline: none;">这是一段可编辑的段落。请试着编辑该文本。</p>-->
	</div>
</template>

<script>
export default{
	data(){
		return{
			userInfo: "",
			isShowIOS: false,
			isShowAndroid: false,
		}
	},
	created() {
	  	this.userInfo = JSON.parse(sessionStorage.getItem("LQUserInfo")) || false;
	},
	
	methods:{
		backOne(){
			this.$router.go(-1);
		}
	}
}
</script>

<style scoped>
.getApp{
	max-width: 970px;
	margin: 0 auto;
	padding: 85px 40px 0;
	box-sizing: border-box;
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
	height: 40px;
	background: #F3F3F3;
	margin-bottom: 65px;
}
.content{
	max-width: 739px;
	margin: 0 auto ;
	overflow: hidden;
}
.content ul li{
	float: left;
	width: 330px;
	height: 160px;
	border: 1px solid #C2C2C2;
	display: flex;
	justify-content: center;
	align-items: center;
}
.content ul li:first-child{
	margin-right: 75px;
}
.content p.tip{
	font-size: 16px;
	color: #3B4356;
	line-height: 30px;
	margin-top: 65px;
	text-align: center;
}
.content p.tip span{
	color: #FC4514;
}
.imgWrap{
	width: 106px;
	height: 106px;
	border-radius: 50%;
	background: #E5E5E5;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 30px;
}
.detail{
	line-height: 40px;
	text-align: center;
}
.detail .type{
	color: #3B4356;
	font-size: 18px;
}
.detail .version{
	color: #999;
	font-size: 14px;
}
.detail .downLoad{
	font-size: 16px;
	color: #FC4514;
	cursor: pointer;
}
.contCover{
  	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: rgba(0,0,0,0.5);
	z-index: 5;
}

.IOScont,.AndroidCont{
	width: 360px;
	height: 150px;
	border-radius: 10px;
	background: #fff;
	position: fixed;
	top: 50%;
  	left: 50%;
  	margin-left: -180px;
  	margin-top: -75px;
	overflow: hidden;
	z-index: 10;
}
.AndroidCont{
	height: auto;
	margin-top: -180px;
	padding-bottom: 20px;
}
.IOScont p{
	line-height: 150px;
	text-align: center;
	font-size: 18px;
	color: #424242;
}
.IOScont p span{
	color: #FC4514;
}

.AndroidCont p{
	color: #FC4514;
	font-size: 16px;
	line-height: 40px;
	margin-top: 20px;
	text-align: center;
}
.AndroidCont .img-wrap{
	width: 100%;
	/*height: 378px;*/
	display: flex;
	justify-content: center;
}
.AndroidCont .img-wrap img{
	width: 330px;
	height: auto;
}
.dialog-close {
  position: absolute;
  right: 5px;
  top: 5px;
  width: 40px;
  height: 40px;
  text-align: center;
  cursor: pointer;
  font-weight: 900;
}

.drop-enter-active {
  transition: all .4s ease;
}
.drop-leave-active {
  transition: all .3s ease;
}
.drop-enter {
  transform: translateY(-500px);
}
.drop-leave-active {
  transform: translateY(-500px);
}

@media screen and (max-width: 991px){
	.content ul{
		width: 330px;
		margin: 0 auto;
	}
	.content ul li{
		float: none;
		margin-bottom: 20px;
	}
	
	.content ul li:first-child{
		margin-right: 0;
	}
}
</style>