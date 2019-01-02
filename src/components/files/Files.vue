<template>
  <div>
    <div class="files clearfix">
      <!-- 左侧栏 -->
      <div class="left">
        <ul class="clearfix">
          <li class="active">
            <router-link to="/filesParent/files/1">
              <span>全部合同</span>
              <i>{{nums.total}}</i>
            </router-link>
          </li>
          <li>
            <router-link to="/filesParent/files/2">
              <span>待我签署</span>
              <i>{{nums.WaitingForMe}}</i>
            </router-link>
          </li>
          <li>
            <router-link to="/filesParent/files/3">
              <span>待他人签署</span>
              <i>{{nums.WaitingForOther}}</i>
            </router-link>
          </li>
          <li>
            <router-link to="/filesParent/files/4">
              <span>已完成</span>
              <i>{{nums.Completed}}</i>
            </router-link>
          </li>
          <!--<li>
            <router-link to="/filesParent/files/5">
              <span>已撤回</span>
              <i>0</i>
            </router-link>
          </li>
          <li>
            <router-link to="/filesParent/files/6">
              <span>已过期</span>
              <i>0</i>
            </router-link>
          </li>-->
          <li>
            <router-link to="/filesParent/files/7">
              <span>草稿箱</span>
              <i>{{nums.Draft}}</i>
            </router-link>
          </li>
        </ul>
      </div>
      <!-- 文件列表 -->
      <div class="right">
      	<div class="header clearfix">
      			<div class="head-title">合同列表<span class="head-number">（{{count}}）</span></div>
		        <div class="search">
		          <div class="search_input">
		            <img class="search-icon" src="../../assets/img/icon-search.png" alt="">
		            <input type="text" class="searchInput" placeholder="输入合同名称" v-model.trim="query"
		            	@keyup.enter="getContactList(currentPage,pageSize,type,true)">
		          </div>
		          <div class="search-btn" @click="getContactList(currentPage,pageSize,type,true)">搜索</div>
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
	            			<img src="../../assets/img/tableLoading.gif" width="20"/>
	          				<div>拼命加载中</div>
	            		</td>
	            	</tr>
	              <tr v-for="(item,index) in contractList" :key="item.ContractID">
	                <!--<td class="checkbox" @click="selOne(item.ContractID)">
	                  <i :class="{'active':contractIds.indexOf(item.ContractID)>=0}"></i>
	                </td>-->
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
          
		      <div class="endCont">
		      	  <!--<div class="deletedAll">删除</div>-->
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
import MoPaging from "../base/paging.vue";
export default {
  components: {
    MoPaging
  },
  data() {
    return {
      userInfo: "",
      contractList: [], //请求数据
      query: "",
      
      pageSize: 10, //每页显示10条数据
      currentPage: 1, //当前页码
      count: 0, //总记录数
      pageCount: 1, //总页数
      pageshow: false,
      
      isCheckedAll:false, //全选
			contractIds:[], //需要删除的合同,选中的
			type: "全部合同",    //合同类型
			searchFlag: false, //搜索
			tableLoading: false,
			dataNone: "暂无数据",
			
			nums:{
				total: 0,             //总数
				WaitingForMe: 0,			//待我签署
				WaitingForOther: 0,   //待他人签署
				Completed: 0,					//已完成
				Draft: 0,							//草稿箱
				recall: 0,						//已撤回
				overdue: 0						//已过期		
			},
			
			isShowAlert: false,
      alertContent: "",
			
			
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
  computed:{
		  	showMaxPage(){
		            return	this.currentPage*this.pageSize >= this.count ? this.count : this.currentPage*this.pageSize;
		  	},
	},
  watch: {
  	isCheckedAll(){
				if(this.contractList.length===this.contractIds.length && this.contractIds.length){
					this.isCheckedAll = true
				}else{
					this.isCheckedAll = false
				}
				
		},
		
    $route(to, from) {
      // 对路由变化作出响应...
      const id = to.params.id;
      if(id == 1){
     		 	this.type = "全部合同";
      }else if(id == 2){
     		  this.type = "待我签署";
      }else if(id == 3){
      		this.type = "待他人签署";
      }else if(id == 4){
      		this.type = "已完成";
      }else if(id == 5){
      		this.type = "已撤回";
      }else if(id == 6){
      		this.type = "已过期";
      }else if(id == 7){
      		this.type = "草稿箱";
      }
      this.searchFlag = false;
      this.currentPage = 1 ;  //初始默认为第一页
      //console.log(this.type)
      this.getContactList(this.currentPage,this.pageSize,this.type,this.searchFlag);
      
    },
    
  },
  created() {
    // console.log(this.$route);
    this.userInfo = JSON.parse(sessionStorage.getItem("LQUserInfo")) || false;
    //获取合同列表
    let id = this.$route.params.id;
    if(id == 1){
     		 	this.type = "全部合同";
      }else if(id == 2){
     		  this.type = "待我签署";
      }else if(id == 3){
      		this.type = "待他人签署";
      }else if(id == 4){
      		this.type = "已完成";
      }else if(id == 5){
      		this.type = "已撤回";
      }else if(id == 6){
      		this.type = "已过期";
      }else if(id == 7){
      		this.type = "草稿箱";
      }
      this.getContactList(this.currentPage,this.pageSize,this.type,this.searchFlag);
    
  },
  methods: {
  	closeAlert(){
  		this.isShowAlert = false;
  		this.alertContent = "";
  	},
  	//获取合同列表
  	getContactList(pageIndex,PageSize,type,searchFlag){
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
	      url: _this.$link + "api/Contract/GetContractOverview",
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
      	_this.tableLoading = false;
        if (res.data.Code == 0) {
        	//console.log('合同列表',res.data.Data)
        	let Data = res.data.Data;
	            _this.count = Data.MessageCount;
	            Data.PageCount>0 ? _this.pageCount = Data.PageCount : _this.pageCount = 1;
	           /* _this.pageCount = Data.PageCount;*/
	            _this.pageshow = true;
	            _this.contractList = Data.Contracts;
	            
	            //各种合同的数量
	            if(pageIndex == 1){
	            			_this.$set(_this.nums,'total',Data.Total);
	            			_this.$set(_this.nums,'WaitingForMe',Data.WaitingForMe);
	            			_this.$set(_this.nums,'WaitingForOther',Data.WaitingForOther);
	            			_this.$set(_this.nums,'Completed',Data.Completed);
	            			_this.$set(_this.nums,'Draft',Data.Draft);
	            }
        } else if (res.data.Code == 400) {
          sessionStorage.removeItem("LQUserInfo");
          _this.$router.push({ path: "/login" });
          return;
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
        if (window.navigator.msSaveOrOpenBlob) {   // if browser is IE
            navigator.msSaveBlob(PdfUrl, name+'.pdf');//filename文件名包括扩展名，下载路径为浏览器默认路径
        }else{
        		let url = window.URL.createObjectURL(data.data);
		        let link = document.createElement("a");
		        link.style.display = "none";
		        link.href = url;
		        link.setAttribute("downLoad", name+'.pdf'); //设置文件名称
		        document.body.appendChild(link);
		        link.click();
        }
        
      });
      
  	},
  	
  	
  	//详情页
    showDetail(contractId){
    	this.$router.push({ name: "fileDetail" ,params:{id:contractId} });
    },
    
    //初始化分页页码
    initPage() {
      this.pageSize = 10;
      this.currentPage = 1;
    },
    
    //显示页
    pageChange(page) {
      this.currentPage = page;
      //请求数据
      this.getContactList(this.currentPage,this.pageSize,this.type,this.searchFlag);
    },
    
	//  全选
    selectAll(){
      this.isCheckedAll = !this.isCheckedAll;
	  if (this.isCheckedAll) {//全选时
          this.contractIds = [];
          this.contractList.forEach(item => {
          	this.contractIds.push(item.ContractID)
          })
      } else {
        this.contractIds = []
      }
    },
    
	//  单选
    selOne(id){
      let idIndex = this.contractIds.indexOf(id)
      if (idIndex >= 0) {//如果已经包含就去除
        this.contractIds.splice(idIndex, 1)
      } else {//如果没有包含就添加
        this.contractIds.push(id)
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
  max-width: 1120px;
  margin: 0 auto;
  box-sizing: border-box;
}
.left {
  float: left;
  width: 150px;
  /*height: 280px;*/
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
  /*width: 890px;*/
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
  border: 0;
  outline: 0;
  float: left;
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
  width: 15%;
}

.file-name {
  width: 40%;
  padding-left: 5% !important;
}

.tableWrap{
	height: 470px;
}
.handel span:hover{
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

