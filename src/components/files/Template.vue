<template>
  <div>
    <!--<v-header></v-header>-->
    <div class="files clearfix">
      <!-- 左侧栏 -->
      <div class="left">
        <ul class="clearfix">
        	<li class="active">
        		<router-link to="/filesParent/template/0">
              <span>全部合同</span>
              <i>{{totalTemplate}}</i>
            </router-link>
        	</li>
          <li v-for="(item,index) in contractNames">
            <router-link :to="{name:'template',params:{id:item.Id}}">
              <span>{{item.Type}}</span>
              <i>{{item.Count}}</i>
            </router-link>
          </li>
        </ul>
      </div>
      <!-- 文件列表 -->
      <div class="right">
      	<div class="header clearfix">
      		<div class="head-title">{{type ? type : "全部合同"}}<span class="head-number">（{{count}}）</span></div>
	        <div class="search">
	          <div class="search_input">
	            <img class="search-icon" src="../../assets/img/icon-search.png" alt="">
	            <input type="text" class="searchInput" placeholder="输入合同名称" v-model.trim="query"
	            	@keyup.enter="getTemplateList(currentPage,pageSize,type,true)">
	          </div>
	          <div class="search-btn" @click="getTemplateList(currentPage,pageSize,type,true)">搜索</div>
	        </div>
      	</div>
      	
        <div>
        	<div class="tableWrap">
	          <table cellpadding="0" cellspacing="0">
	            <thead>
	              <tr class="table-title">
	                <!--<th class="checkbox" @click="selectAll">
	                  <i :class="{'active':isCheckedAll}"></i>
	                </th>-->
	                <th class="file-name">模板名称</th>
	                <th>合同类型</th>
	                <th style="padding-left: 24px;">操作</th>
	              </tr>
	            </thead>
	            <tbody>
	            	<tr>
	            		<td colspan="3" class="tableLoading" v-if="tableLoading">
	            			<img src="../../assets/img/tableLoading.gif" width="20"/>
	          				<div>拼命加载中</div>
	            		</td>
	              </tr>
	              <tr v-for="(item,index) in templateList" :key="item.Id">
	                <!--<td class="checkbox"  @click="selOne(item.Id)">
	                  <i :class="{'active':templateIds.indexOf(item.Id)>=0}"></i>
	                </td>-->
	                <td class="file-name" :title="item.Name">{{item.Name | filterName}}</td>
	                <td>{{item.Type}}</td>
	                <td class="detail">
	                	<span @click="showDetail(item.Id)" style="margin-right: 5px;">详情</span>
	                	<span @click="downLoad(item.WordUrl,item.Name)">下载</span>
	                </td>
	              </tr>
	            </tbody>
	
	          </table>
	          <div class="data-none" v-if="!templateList.length && !tableLoading">{{dataNone}}</div>
          </div>
          
		      <div class="endCont">
		      	  <!--<div class="downloadAll">下载</div>-->
		          <div class="page-wrap" v-if="pageshow">
		            <p>正在显示第{{showMaxPage>0 ?(currentPage-1)*pageSize+1 : 0}}-{{showMaxPage}}个，</p>
		            <mo-paging :page-index="currentPage" :totla="count" :page-size="pageSize" :pages="pageCount" @change="pageChange">
		            </mo-paging>
		          </div>
		          
		      </div>
        </div>
      </div>
    </div>
    
    <!--alert弹窗-->
  		<alert-dialog :is-show="isShowAlert" :alertCont="alertContent" type="default" 
  			@on-close="closeAlert"></alert-dialog>
    
  </div>

</template>


<script>
/*import Header from "./Header.vue";*/
import MoPaging from "../base/paging.vue";
export default {
  components: {
    /*"v-header": Header,*/
    MoPaging
  },
  data() {
    return {
      contractNames: [],
      
      userInfo: "",
      templateList: [], //请求数据
      totalTemplate: 0, //总模板数
      query: "",
      
      pageSize: 13, //每页显示10条数据
      currentPage: 1, //当前页码
      count: 0,  //当前合同总数
      pageCount: 1, //总页数
      pageshow: false,
      
      isCheckedAll:false, //全选
			templateIds:[], //需要删除的合同,选中的
			type: "",    //合同类型 空代表全部合同
			searchFlag: false, //搜索
			
			isShowAlert: false,
      alertContent: "",
      
      tableLoading: false,
      dataNone: "暂无数据",
    };
  },
  
  computed:{
	  	showMaxPage(){
	            return	this.currentPage*this.pageSize >= this.count ? this.count : this.currentPage*this.pageSize;
	  	},
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
  
  watch: {
	  isCheckedAll(){
				if(this.templateList.length===this.templateIds.length && this.templateIds.length){
					this.isCheckedAll = true
				}else{
					this.isCheckedAll = false
				}
					
		},
    $route(to, from) {
      // 对路由变化作出响应...
      const id = to.params.id;
      if(id == 0){
     		 	this.type = "";
      }else if(id == 1){
     		  this.type = "劳动人事合同";
      }else if(id == 2){
      		this.type = "买卖合同";
      }else if(id == 3){
      		this.type = "保管合同";
      }else if(id == 4){
      		this.type = "承揽合同";
      }else if(id == 5){
      		this.type = "抵押担保合同";
      }else if(id == 6){
      		this.type = "公司治理合同";
      }else if(id == 7){
      		this.type = "技术合同";
      }else if(id == 8){
      		this.type = "建设工程合同";
      }else if(id == 9){
      		this.type = "借贷合同";
      }else if(id == 10){
      		this.type = "居间行纪合同";
      }else if(id == 11){
      		this.type = "融资租赁合同";
      }else if(id == 12){
      		this.type = "委托服务合同";
      }else if(id == 13){
      		this.type = "运输合同";
      }else if(id == 14){
      		this.type = "赠与合同";
      }else if(id == 15){
      		this.type = "租赁合同";
      }
     
      this.searchFlag = false;
      this.currentPage = 1 ;  //初始默认为第一页
      //console.log(this.type)
      this.getTemplateList(this.currentPage,this.pageSize,this.type,this.searchFlag);
    }
  },
  created() {
    // console.log(this.$route);
    this.userInfo = JSON.parse(sessionStorage.getItem("LQUserInfo")) || false;
    //获取合同列表
    let id = this.$route.params.id;
    if(id == 0){
     		 	this.type = "";
      }else if(id == 1){
     		  this.type = "劳动人事合同";
      }else if(id == 2){
      		this.type = "买卖合同";
      }else if(id == 3){
      		this.type = "保管合同";
      }else if(id == 4){
      		this.type = "承揽合同";
      }else if(id == 5){
      		this.type = "抵押担保合同";
      }else if(id == 6){
      		this.type = "公司治理合同";
      }else if(id == 7){
      		this.type = "技术合同";
      }else if(id == 8){
      		this.type = "建设工程合同";
      }else if(id == 9){
      		this.type = "借贷合同";
      }else if(id == 10){
      		this.type = "居间行纪合同";
      }else if(id == 11){
      		this.type = "融资租赁合同";
      }else if(id == 12){
      		this.type = "委托服务合同";
      }else if(id == 13){
      		this.type = "运输合同";
      }else if(id == 14){
      		this.type = "赠与合同";
      }else if(id == 15){
      		this.type = "租赁合同";
      }
      this.getTemplateList(this.currentPage,this.pageSize,this.type,this.searchFlag);
  },
  methods: {
    closeAlert(){
  		this.isShowAlert = false;
  		this.alertContent = "";
  	},
  	
  	//获取合同列表
  	getTemplateList(pageIndex,PageSize,type,searchFlag){
  		//console.log('searchFlag',searchFlag)
  		//是否搜索
  		if(searchFlag){
  			var queryCont = this.query;
  			this.searchFlag = true;
  		}else{
  			var queryCont = "";
  		}
  		var _this = this;
  		_this.tableLoading = true;
	    //获取我的合同列表
	    this.$axios({
	      method: "post",
	      url: _this.$link + "api/ContractDemo/GetPublicContractDemoOverview",
	      headers: { "access-token": _this.userInfo.Token },
	      data: {
	       timestamp: "1",
	        SecretId: "3",
	        Signature: "4",
	        Data: { 
	        	"Type": type ,
	        	"PageSize": PageSize,
	        	"Page": pageIndex,
	        	"Query":queryCont
	        }
	      }
	    })
      .then(res => {
        if (res.data.Code == 0) {
        		_this.tableLoading = false;
        	  //console.log('合同列表',res.data.Data)
        		let Data = res.data.Data;
            _this.count = Data.CurrentCount;  
            Data.PageCount>0 ? _this.pageCount = Data.PageCount : _this.pageCount = 1;
            _this.pageshow = true;
            _this.templateList = Data.Contracts;
            
            //各种合同的数量
            if(pageIndex == 1){
            			_this.totalTemplate = Data.Total;
            			_this.contractNames = Data.Types;
            			/*_this.$set(_this.nums,'WaitingForMe',Data.WaitingForMe);
            			_this.$set(_this.nums,'WaitingForOther',Data.WaitingForOther);
            			_this.$set(_this.nums,'Completed',Data.Completed);
            			_this.$set(_this.nums,'Draft',Data.Draft);*/
            }
        } else if (res.data.Code == 400) {
          sessionStorage.removeItem("LQUserInfo");
          _this.$router.push({ path: "/login" });
        }else{
        	_this.dataNone = res.data.Message;
        	//console.log(res.data.Message)
        }
      })
      .catch(err => {
	      	_this.dataNone = "网络出错，请稍后再试";
          //console.log(err);
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
    
    
    //详情页
    showDetail(templateId){
    	this.$router.push({ name: "templateDetail" ,params:{id:templateId} });
    },
    
    //初始化分页页码
    initPage() {
      this.pageSize = 13;
      this.currentPage = 1;
    },
    
    //显示页
    pageChange(page) {
      this.currentPage = page;
      //请求数据
      this.getTemplateList(this.currentPage,this.pageSize,this.type,this.searchFlag);
    },
    
	  //  全选
    selectAll(){
      this.isCheckedAll = !this.isCheckedAll;
	  	if (this.isCheckedAll) {//全选时
          this.templateIds = [];
          this.templateList.forEach(item => {
          	this.templateIds.push(item.ContractID)
          })
      } else {
        this.templateIds = []
      }
    },
    
	//  单选
    selOne(id){
      let idIndex = this.templateIds.indexOf(id)
      if (idIndex >= 0) {//如果已经包含就去除
        this.templateIds.splice(idIndex, 1)
      } else {//如果没有包含就添加
        this.templateIds.push(id)
      }

    },
    
    
    
  },
  
  mounted() {
  	
  }
  
};
</script>

<style scoped>
	@import url("../../assets/css/table.css");
.files {
  padding: 90px 40px 0;
  max-width: 1160px;
  margin: 0 auto;
  box-sizing: border-box;
}
.left {
  float: left;
  width: 150px;
  margin-right: 40px;
  background: #f3f3f3;
}
.left li {
  height: 40px;
  cursor: pointer;
}
.left li a {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #606060;
  padding: 0 22px 0 14px;
}
.left li i {
  text-align: right;
}
.left .router-link-exact-active {
  background: #fff;
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.14);
  color: #FC4514;
}
.right {
  float: left;
  width:  calc(100% - 190px);
  padding-bottom: 50px;
}

.header .head-title{
	font-size: 18px;
	color: #303030;
	float: left;
}
.header .head-number{
	font-size: 16px;
}
.search {
	float: right;
  height: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
 /* padding-bottom: 14px;*/
}
.search .search_input {
  width: 190px;
  height: 28px;
  border: 1px solid #dbdbdb;
  border-radius: 2px;
  overflow: hidden;
}
.search-icon {
  width: 15px;
  margin: 7px;
  float: left;
}
.search input {
  height: 100%;
  width: 150px;
  padding: 6px 0;
  line-height: 14px;
  box-sizing: border-box;
  border: none;
  outline: none;
  float: left;
}
.search input:focus{
	border: 0 !important;
}
.search-btn {
  width: 60px;
  line-height: 30px;
  text-align: center;
  color: #fff;
  font-size: 12px;
  background: #FC4514;
  border-radius: 2px;
  margin-left: 10px;
  cursor: pointer;
}
th {
  width: 25%;
}

.file-name {
  width: 50%;
  padding-left: 8% !important;
}

.tableWrap{
	height: 588px;
}
.detail span:hover{
	color: #FC4514;
}

/*响应式*/
@media screen and (max-width: 991px){
	.tableWrap{
		height: auto;
	}
	
	.right .header .search{
		width: 100%;
		justify-content: flex-start;
	}
	
	.right .header .head-title{
		margin-bottom: 15px;
	}
	
	.right {
	  float: none;
	  width: 100%;
	  /*width: 890px;*/
	  padding-bottom: 50px;
	}
	
	.left {
	  float: none;
	  width: 100%;
	  height: auto;
	  margin-bottom: 20px;
	}
	.left li {
		float: left;
		width: 25%;
	  height: 40px;
	  cursor: pointer;
	}
	.left li a {
	  justify-content: flex-start;
	}
	.left li i{
		padding-left: 10px;
	}
	
}

@media only screen and (max-width: 767px){
	.left li {
		float: left;
		width: 33.3%;
	  height: 40px;
	  cursor: pointer;
	}
}
@media only screen and (max-width: 560px){
	.left li {
		float: left;
		width: 50%;
	  height: 40px;
	  cursor: pointer;
	}
}
</style>

