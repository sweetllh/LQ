<template>
    <!-- 模板管理列表 -->
    <div id="myTemplate">
      <div class="header clearfix">
    	  <div class="head-title left">我的模板<span class="head-number">（{{count}}）</span></div>
    	  <div class="search right">
           <div class="search_input">
             <img class="search-icon" src="../../assets/img/icon-search.png" alt="">
             <input type="text" placeholder="输入模板名称" class="searchInput">
           </div>
           <div class="search-btn">搜索</div>
         </div>
      </div>
      <div class="r_header">
      	<!--<i class="left_icon"></i>-->
        <span class="r_header_title">模板列表</span>
        <div class="r_h_btn" @click="addTemplate()">添加模板</div>
      </div>
      <div class="r_content">
      	<div class="tableWrap">
	        <table cellspacing="0" cellpadding="0">
	        	<thead>
	        		<tr class="table-title">
						<!--<th class="checkbox" @click="selectAll">
			                  <i :class="{'active':isCheckedAll}"></i>
			                </th>-->
						<th class="file-name">模板名称</th>
						<th>类型</th>
						<th>更新时间</th>
						<th style="padding-left: 30px;">操作</th>
					</tr>
	        	</thead>
	        	<tbody>
	        		<tr>
		                <!--<td class="checkbox" @click="selOne(item.ContractID)">
		                  <i :class="{'active':contractIds.indexOf(item.ContractID)>=0}"></i>
		                </td>-->
		                <td class="file-name">模板名称</td>
		                <td>ddd</td>
		                <td>2018-01-02</td>
		                <td>
		                	<span class="use" @click="useTemplate()">使用</span>
		                	<span class="download" @click="downloadTemplate()">下载</span>
		                </td>
		              </tr>
		              
	        	   </tbody>
	            </table>
	         	<!--<div class="data-none" v-if="!TemplateList.length">暂无数据 </div>-->
	        </div>
       
        <div class="endCont">
        	<!--<div class="downloadAll">下载</div>-->
        	<div class="page-wrap" v-if="pageshow">
	          <p>正在显示第{{(currentPage-1)*pageSize+1}}-{{showMaxPage}}个，</p>
	          <mo-paging :page-index="currentPage" :totla="count" :page-size="pageSize" @change="pageChange">
	          </mo-paging>
	        </div>
        </div>
        
      </div>
    </div>
</template>


<script>
import MoPaging from "../base/paging.vue";
export default {
  components: {
    MoPaging,
  },
  data() {
    return {
      userInfo: "",
      pageSize: 10, //每页显示10条数据
      currentPage: 1, //当前页码
      showMaxPage: 10,
      count: 20, //总记录数
      TemplateList: [], //联系人列表
      pageshow: true,
      
      isCheckedAll:false,
      selectedIndex: 0,
      selectedlist: {},
    };
  },
  watch: {
	    
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem("LQUserInfo")) || false;
    //获取模板
  },
  methods: {
    //初始化分页页码
    initPage() {
      this.pageSize = 10;
      this.currentPage = 1;
    },
    
    //显示页
    pageChange(page) {
      this.currentPage = page;
    },
    
	//  全选
    selectAll(){
      this.isCheckedAll = !this.isCheckedAll;
	  
    },
    
	//  单选
    selOne(id){
      

    },
    
    //添加模板
    addTemplate(){
    	this.$router.push({path: "/filesParent/template/0"})
    },
    
    //使用模板
    useTemplate(){
    	
    },
    
    //下载模板
    downloadTemplate(){
    	
    }
  },
};
</script>

<style scoped>
	@import '../../assets/css/accountCommon.css';
	@import "../../assets/css/table.css";
	.r_header{
		padding-left: 34px;
	}
	.search {
	  height: 30px;
	  display: flex;
	  justify-content: flex-end;
	  align-items: center;
	  padding-right: 13px;
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
	  line-height: 28px;
	  border: 0;
	  outline: 0;
	  float: left;
	  padding-top:1px; 
	  font-size: 14px;
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
	  width: 20%;
	}
	.file-name {
	  width: 40%;
	  padding-left: 5%;
	}
	.tableWrap{
		height: 495px;
	}
	
	.r_content table td .use,
	.r_content table td .download{
		vertical-align: middle;
		display: inline-block;
		width: 40px;
		height: 20px;
		/*background: #FC4514;*/
		/*color: #fff;*/
		font-size: 14px;
		line-height: 20px;
		text-align: center;
	}
	
	/*响应式*/
	@media screen and (max-width: 991px){
		.tableWrap{
			height: auto;
		}
		.header .search{
			width: 100%;
			justify-content: flex-start;
			float: none;
		}
		
		.header .head-title{
			float: none;
			margin-bottom: 15px;
		}
	}	
</style>

