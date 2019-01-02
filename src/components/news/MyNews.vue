<template>
	<div id="myTeam">
		<v-header></v-header>
		<div class="myTeam">
			<div class="header">
		    	  <div class="head-title" @click="backOne">
		    	  <i class="left_icon"></i>我的消息<span class="head-number">（{{count}}）</span></div>
		    </div>
			<div class="r_header">
		      	<!--<i class="left_icon"></i>-->
		        <span class="r_header_title">消息列表</span>
		    </div>
		    <div class="r_content">
		      	<div class="tableWrap">
			        <table cellspacing="0" cellpadding="0">
			        	<thead>
			        		<tr class="table-title">
								<!--<th class="checkbox" @click="selectAll">
									<i :class="{'active':isCheckedAll}"></i>
								</th>-->
								<th class="theme">合同主题</th>
								<th class="newsCont">内容</th>
								<th class="time">时间</th>
								<th>状态</th>
								<th class="th_operation">操作</th>
							</tr>
			        	</thead>
			        	<tbody>
			        		<tr>
			            		<td colspan="5" class="tableLoading" v-if="tableLoading">
			            			<img src="../../assets/img/tableLoading.gif" width="20"/>
			          				<div>拼命加载中</div>
			            		</td>
				            </tr>
			        		<tr v-for="(item,index) in myNewsList" :key="item.MessageID" :style="{color: item.IsRead == 0 ? '#797979' : '#b7b7b7'}">
				                <!--<td class="checkbox" @click="selOne(item.MessageID)">
				                  <i :class="{'active':messageIds.indexOf(item.MessageID)>=0}"></i>
				                </td>-->
				                <td>{{item.Type}}</td>
				                <td  :title="item.Message">{{item.Message}}</td>
				                <td>{{item.Date}}</td>
				                <td>{{item.IsRead == 0 ? "未读" : "已读"}}</td>
				                <td class="detail">
				                	<span @click="getNewDetail(item.MessageID,item.ContractID)">详细</span>
				                	<span @click="isDeleteNews(item.MessageID)">删除</span>
				                </td>
				              </tr>
			        	   </tbody>
			            </table>
			            <div class="data-none" v-if="!myNewsList.length && !tableLoading">暂无数据 </div>
			        </div>
			        
			        <div class="endCont">
			        	<!--<div class="deletedAll" @click="deleteNews">删除</div>-->
			        	<div class="page-wrap" v-if="pageshow">
				          <p>正在显示第{{showMaxPage>0 ? (currentPage-1)*pageSize+1 : 0}}-{{showMaxPage}}个，</p>
				         <mo-paging :page-index="currentPage" :totla="count" :page-size="pageSize" :pages="pageCount" @change="pageChange" >
				          </mo-paging>
				        </div>
			        </div>
		      </div>
	      	</div>
	      	
	      	<!-- 删除信息弹窗-->
		  <my-dialog :is-show="isShowDeleteDialog" title="提示信息" @on-close="closeDialog('isShowDeleteDialog')">
		  	<div class="dialog">
		  		<div class="dialogCont">你确定删除此消息吗?</div>
		  		<div class="btn-ground">
		  			<button type="button" @click="deleteNews()">确定</button>
		  		</div>
		  	</div>
		  </my-dialog>
	      	
	      	
	      	<!--alert弹窗-->
  			<alert-dialog :is-show="isShowAlert" :alertCont="alertContent" 
  				:type="type" @on-close="closeAlert" ></alert-dialog>
	      	
	</div>
</template>

<script>
	import MoPaging from "../base/paging.vue";
	export default{
		name: 'MyTeam',
		inject:['reload'],
		components:{
			MoPaging,
		},
		data(){
			return{
				userInfo: "",
			    pageSize: 10, //每页显示10条数据
			    currentPage: 1, //当前页码
			   //showMaxPage: 10,
			    count: 0, //总记录数
			    pageCount: 1, //总页数
			    myNewsList: [], //信息列表
			    pageshow: false,
			    
			    isCheckedAll:false, //全选
			    messageIds:[], //需要删除的信息
			    
			    isShowAlert: false,
      			alertContent: "",
      			type: "",
      			
      			deleteId: null,
      			isShowDeleteDialog: false,
      			tableLoading: false,
			}
		},
		computed:{
		  	showMaxPage(){
		            return	this.currentPage*this.pageSize >= this.count ? this.count : this.currentPage*this.pageSize;
		  	},
		},
		watch: {
			isCheckedAll(){
				if(this.myNewsList.length===this.messageIds.length && this.messageIds.length){
					this.isCheckedAll = true
				}else{
					this.isCheckedAll = false
				}
				
			}
		},
		created() {
		    this.userInfo = JSON.parse(sessionStorage.getItem("LQUserInfo")) || false;
		    //获取消息列表
		    this.getNewsList(this.currentPage,this.pageSize);
		},
		methods: {
			backOne(){
				this.$router.go(-1);
			},
			closeAlert(){
		  		this.isShowAlert = false;
		  		this.alertContent = "";
		  	},
		  	closeDialog(attr){
		    	this[attr] = false;
		    },
			//获取信息列表
			getNewsList(pageIndex,PageSize){
				var _this = this;
				_this.tableLoading = true;
		        this.$axios({
			        method: "post",
			        url: _this.$link + "api/Message/Data",
			        headers: { "access-token": _this.userInfo.Token },
			        data: {
			          timestamp: "1",
			          SecretId: "3",
			          Signature: "4",
			          Data:{
			            "PageSize":PageSize,
			            "Page":pageIndex
			           }
			        }
			     })
		        .then(res => {
		          //console.log('消息列表',res.data);
		          _this.tableLoading = false;
		          if (res.data.Code == "0") {
		          	let Data = res.data.Data;
		            _this.myNewsList = Data.Messages;
		            _this.count = Data.MessageCount;
		            Data.PageCount>0 ? _this.pageCount = Data.PageCount : _this.pageCount = 1;
		            /*_this.pageCount = Data.PageCount;*/
		            _this.pageshow = true;
		          }else if (res.data.Code == 400) {
			          sessionStorage.removeItem("LQUserInfo");
			          _this.$router.push({ path: "/login" });
			          return;
			       }else{
			       		console.log(res.data.Message);
			       }
		        })
		        .catch(err => {
		        	_this.tableLoading = false;
		        	_this.type = "defalut";
          			_this.isShowAlert = true;
	      			_this.alertContent = "网络出错，请稍后再试";
		          //console.log(err);
		        });
			},
			
			//点击详情
		    getNewDetail(messageId,contractID){
		    	//变成已读
		    	this.readNews(messageId,contractID);
		    	//this.$router.push({ name: "fileDetail" ,params:{id:contractID} });
		    },
		    
			//信息已读
			readNews(messageId,contractID){
				var _this = this;
		        this.$axios({
			        method: "post",
			        url: _this.$link + "api/Message/Read",
			        headers: { "access-token": _this.userInfo.Token },
			        data: {
			          timestamp: "1",
			          SecretId: "3",
			          Signature: "4",
			          Data:{
			            Id:messageId
			           }
			        }
			     })
		        .then(res => {
		          //console.log('是否已读',res.data);
		          if (res.data.Code == "0") {
		          		//_this.getNewsList(_this.currentPage,_this.pageSize)
		          		this.$router.push({ name: "fileDetail" ,params:{id:contractID} });
		          }else if (res.data.Code == 400) {
			          _this.$router.push({ path: "/login" });
			      }else{
		          	console.log(res.data.Message)
		          }
		        })
		        .catch(err => {
		          //console.log(err);
		          _this.type = "defalut";
          		  _this.isShowAlert = true;
	      		  _this.alertContent = "网络出错，请稍后再试";
	      		  
		        });
			},
			isDeleteNews(messageId){
				this.isShowDeleteDialog = true;
    			this.deleteId = messageId;
			},
			//删除信息
			deleteNews(){
//				this.myNewsList = this.myNewsList.filter(item => this.messageIds.indexOf(item.MessageID) === -1)
//    			this.messageIds = []
				this.isShowDeleteDialog = false;
				var _this = this;
		        this.$axios({
			        method: "post",
			        url: _this.$link + "api/Message/Delete",
			        headers: { "access-token": _this.userInfo.Token },
			        data: {
			          timestamp: "1",
			          SecretId: "3",
			          Signature: "4",
			          Data:{
			            Id: _this.deleteId
			           }
			        }
			     })
		        .then(res => {
		          //console.log('是否删除',res.data);
		          if (res.data.Code == "0") {
			          	_this.type = "defalut";
			          	_this.isShowAlert = true;
		        		_this.alertContent = "删除成功";
		          		_this.getNewsList(_this.currentPage,_this.pageSize);
		          		_this.messageIds = [];
		          		//this.reload();
		          }else if (res.data.Code == 400) {
			          _this.$router.push({ path: "/login" });
			      }else{
			          	_this.type = "defalut";
			          	_this.isShowAlert = true;
		        		_this.alertContent = res.data.Message;
			          	//alert(res.data.Message);
		          }
		        })
		        .catch(err => {
		        	_this.type = "defalut";
          			_this.isShowAlert = true;
	      			_this.alertContent = "网络出错，请稍后再试";
		          //console.log(err);
		        });
			},
			
		    //初始化分页页码
		    initPage() {
		      this.pageSize = 10;
		      this.currentPage = 1;
		    },
		    
		    //显示页
		    pageChange(page) {
		      this.currentPage = page;
		      //重新获取消息列表
		     this.getNewsList(this.currentPage,this.pageSize)
		    },
		    
			//  全选
		    selectAll(){
		      this.isCheckedAll = !this.isCheckedAll;
			  if (this.isCheckedAll) {//全选时
		          this.messageIds = [];
		          this.myNewsList.forEach(item => {
		          	this.messageIds.push(item.MessageID)
		          })
		      } else {
		        this.messageIds = []
		      }
		    },
		    
			//  单选
		    selOne(id){
		      let idIndex = this.messageIds.indexOf(id)
		      if (idIndex >= 0) {//如果已经包含就去除
		        this.messageIds.splice(idIndex, 1)
		      } else {//如果没有包含就添加
		        this.messageIds.push(id)
		      }

		    },
		    
		},
	}
</script>

<style scoped>
	@import '../../assets/css/dialogCont.css';
	@import "../../assets/css/table.css";
	.myTeam{
		padding: 85px 40px 0;
		max-width: 970px;
		margin: 0 auto;
		box-sizing: border-box;
	}
	.header{
		margin-bottom: 17px;
	}
	.left_icon{
		cursor: pointer;
		background: url(../../assets/img/icon-left.png) no-repeat center;
		width: 9px;
		height: 13px;
		display: inline-block;
		margin-right: 10px; 
	}
	.header .head-title{
		font-size: 18px;
		color: #303030;
		cursor: pointer;
	}
	.header .head-number{
		font-size: 16px;
	}
	.r_header {
	  max-width: 970px;
	  line-height: 40px;
	  background: #f3f3f3;
	  color: #3f3f3f;
	  font-size: 14px;
	  padding-left: 34px;
	  box-sizing: border-box;
	  font-family: MicrosoftYaHei;
	}
	
	.r_header .left_icon{
		background: url(../../assets/img/icon-right.png) no-repeat;
		transform: rotate(-180deg);
		-webkit-transform: rotate(-180deg);
		width: 8px;
		height: 13px;
		display: inline-block;
		margin-right: 10px; 
	}
	
	.r_header .r_header_title{
		color: #FC4514;
	}
	
	.r_h_btn {
	  float: right;
	  width: 100px;
	  line-height: 30px;
	  text-align: center;
	  background: #FC4514;
	  color: #fff;
	  font-size: 14px;
	  margin: 5px 13px;
	  cursor: pointer;
	}
	.r_content {
	  padding-bottom: 50px;
	}
	
	.tableWrap{
		height: 495px;
	}
	th{
		width: 15%;
	}
	th:first-child,td:first-child{
		padding-left: 5%;
	}
	.newsCont{
		width: 35%;
	}
	.time{
		width: 20%;
	}
	.th_operation{
		padding-left: 26px;
	}
	.detail span{
		padding-right: 5px;
	}
	.detail span:hover{
		color: #FC4514;
	}
	/*响应式*/
	@media screen and (max-width: 991px){
		.tableWrap{
			height: auto;
		}
	}
</style>