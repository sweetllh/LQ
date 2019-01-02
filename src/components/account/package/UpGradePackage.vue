<template>
        <!-- 升级套餐 -->
        <div id="upGradePackage">
          <div class="header">
	    	  <div class="head-title">升级您的套餐 </div>
	      </div>
          <div class="r_header" @click="myPackage">
            <i class="left_icon"></i>
	        <span class="r_header_title">我的套餐</span>
          </div>
          <div class="r_content">
          	<div v-if="!allPackage.Result && !listLoading" class="dataNOne">{{dataNOne}}</div>
		  	<div class="listLoading" v-if="listLoading">
			  	<img src="../../../assets/img/tableLoading.gif" width="20"/>
			  	<div>拼命加载中</div>
			</div>
            <el-row tag="ul" class="package">
            	<el-col tag="li" class="package_list_wrap" :xs="24" :sm="12" :md="8" :lg="8" :xl="8"
            	v-for="(item,index) in allPackage.Result" :key="item.Package_ID">
            		<div class="package_list">
            			<p class="name">{{item.Package_Name}}</p>
	            		<p class="price"><sup>￥</sup>{{item.Package_Price}}</p>
	            		<p class="time">{{item.Package_Month}}个月</p>
	            		<p class="toBuy" @click="buyPackage(item.Package_ID)">立即购买</p>
	            		<ul class="package_details" v-for="(detail,index) in item.Details" :key="detail.Package_Detail_ID">
	            			<li>{{detail.Product_Name}}</li>
	            			<li>数量：{{detail.Product_Amount}}</li>
	            			<li>备注：{{detail.Product_Remark}}</li>
	            		</ul>
            		</div>
            		
            	</el-col>
            	
            </el-row>
          </div>
          <!--alert弹窗-->
  		  <alert-dialog :is-show="isShowAlert" :alertCont="alertContent" type="default" 
  			@on-close="closeAlert"></alert-dialog>
        </div>

</template>


<script>

export default {
  components: {
  	
  },
  data() {
    return {
      userInfo: "",
      allPackage:  [], //套餐列表
      isShowAlert: false,
      alertContent: "",
      dataNOne: "暂无数据",
      listLoading: false,
    };
  },
  watch: {
    
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem("LQUserInfo")) || false;
    //获取所有可购买套餐
    this.getPackageList();
  },
  methods: {
  	closeAlert(){
  		this.isShowAlert = false;
  		this.alertContent = "";
  	},
  	//获取可购买的套餐信息
  	getPackageList(){
  		var _this = this;
  		_this.listLoading = true;
        this.$axios({
	        method: "post",
	        url: _this.$link + "api/Package/Get",
	        headers: { "access-token": _this.userInfo.Token },
	        data: {
	          timestamp: "1",
	          SecretId: "3",
	          Signature: "4",
	        }
        })
        .then(res => {
            //console.log('可购买套餐',res.data);
            _this.listLoading = false;
            if(res.data.Code == "0"){
          	   _this.allPackage = res.data.Data;
	        }else if(res.data.Code == "400"){
	        	_this.$router.push({ path: "/login" });
	        }else{
	        	_this.dataNOne = res.data.Message;
	      	   //console.log(res.data.Message);
	       }
          
        })
        .catch(err => {
        	_this.listLoading = false;
        	_this.dataNOne = "网络出错，请稍后再试";
          //console.log(err);
        });
  	},
  	//购买套餐
  	buyPackage(packageId){
       	this.$router.push({ name:"shoppingList",params:{id: packageId} });
  	},
  	//返回我的套餐
    myPackage(){
    	this.$router.push({ path:"/accountParent/account/package/packageList" });
    },
 
  },
  mounted() {
    
  }
};
</script>

<style scoped>
.header{
	margin-bottom: 27px;
}
.header .head-title{
	font-size: 18px;
	color: #303030;
}
.header .head-number{
	font-size: 16px;
}
.r_header {
  width: 100%;
  line-height: 40px;
  background: #f3f3f3;
  color: #3f3f3f;
  font-size: 14px;
  padding-left: 15px;
  box-sizing: border-box;
  font-family: MicrosoftYaHei;
  cursor: pointer;
}
.r_header .left_icon{
	background: url(../../../assets/img/icon-right.png) no-repeat;
	transform: rotate(-180deg);
	-webkit-transform: rotate(-180deg);
	width: 8px;
	height: 13px;
	display: inline-block;
	margin-right: 10px; 
}
.r_header .r_header_title{
	color: #FC4514;
	cursor: pointer;
}

.r_content{
	width: 100%;
	padding: 20px 30px 15px;
	border: 1px solid #E2E2E2;
	border-top: none;
	box-sizing: border-box;
	position: relative;
}
.r_content .package{
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}
.package_list_wrap{
	/*width: 207px;*/
	text-align: center;
	padding: 15px 10px;
	box-sizing: border-box;
}
.package_list{
	border: 1px solid #E2E2E2;
	border-top: 4px solid #FC4514;
}
.package_list .name{
	font-size: 16px;
	color: #242C40;
	line-height: 30px;
}

.package_list .price{
	font-size: 26px;
	color: #FC4514;
	font-weight: bold;
}

.package_list .price sup{
	font-size: 14px;
	font-weight: normal;
}

.package_list .time{
	font-size: 12px;
	color: #363636;
	width: 145px;
	border-top: 1px solid #E2E2E2;
	margin: 0 auto;
	line-height: 23px;
}

.package_list .toBuy{
	width: 180px;
	height: 24px;
	background: #FC4514;
	margin: 10px auto 25px;
	font-size: 12px;
	color: #fff;
	line-height: 24px;
	cursor: pointer;
}
.package_details{
	padding-bottom: 10px;
}
.package_details li{
	width: 100%;
	height: 49px;
	line-height: 49px;
	font-size: 12px;
	color: #363636;
	border-top: 1px solid #E2E2E2;
}

.package_details li:hover{
	background: #FFECE7;
}

.listLoading{
	margin-top: 20px;
}
</style>

