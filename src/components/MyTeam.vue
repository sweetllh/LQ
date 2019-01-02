<template>
	<div id="myTeam">
		<v-header></v-header>
		<div class="myTeam">
			<div class="header">
		    	  <div class="head-title" @click="backOne">
		    	  <i class="left_icon"></i>我的团队<span class="head-number">（{{count}}）</span></div>
		    </div>
			<div class="r_header">
		      	<!--<i class="left_icon"></i>-->
		        <span class="r_header_title">团队管理</span>
		        <div class="r_h_btn" @click="showAddMember()">添加成员</div>
		    </div>
		    <div class="r_content">
		      	<div class="tableWrap">
			        <table cellspacing="0" cellpadding="0">
			        	<thead>
			        		<tr class="table-title">
								<!--<th class="checkbox" @click="selectAll">
									<i :class="{'active':selAllStatus}"></i>
								</th>-->
								<th>姓名</th>
								<th>账号</th>
								<th>授权印章</th>
								<th class="th_operation">操作</th>
							</tr>
			        	</thead>
			        	<tbody>
			        		<tr>
				                <!--<td class="checkbox" @click="selOne(0)">
				                  <i :class="{'active':selOneStatus[0]}"></i>
				                </td>-->
				                <td>姓名</td>
				                <td>ddd</td>
				                <td>
				                	<label class="iSwitch">
									    <input type="checkbox" checked="checked">
									    <i></i>
									</label> 
				                </td>
				                <td class="team_edit">
				                	<img src="../assets/img/icon-edit.png" alt="编辑" title="编辑" @click="showEditTeam(0)">
	             					<img src="../assets/img/icon-del.png" alt="删除" title="删除" @click="showDeleteTeam(0)">
				                </td>
				              </tr>
				             
			        	   </tbody>
			            </table>
			            <!--<div class="data-none" v-if="!myTeamList.length">暂无数据 </div>-->
			        </div>
			       
			        <div class="endCont">
			        	<!--<div class="deletedAll">删除</div>-->
			        	<div class="page-wrap" v-if="pageshow">
				          <p>正在显示第{{(currentPage-1)*pageSize+1}}-{{showMaxPage}}个，</p>
				         <mo-paging :page-index="currentPage" :totla="count" :page-size="pageSize" @change="pageChange">
				          </mo-paging>
				        </div>
			        </div>
		      </div>
	      </div>
	      
	      <!--添加成员弹窗-->
	      <my-dialog :is-show="isShowDialog.isShowAddDialog" title="添加成员" @on-close="closeDialog('isShowAddDialog')">
	      	<div class="dialog">
	      		<div class="dialogCont addCont">
	      			<div>
	      				<input type="text" name="addName" id="addName" ref="addName" value="" v-model="addName" placeholder="请输入姓名" />
	      			</div>
	      			<div>
	      				<input type="text" name="addUser" id="addUser" ref="addUser" value="" v-model="addUser" placeholder="请输入邮箱／手机号"/>
	      			</div>
	      		</div>
	      		<div class="btn-ground">
	      			<button type="button" @click="addMember()" >确定</button>
	      			<div v-if="!sureFlag" class="btn-hide"></div>
	      		</div>
	      	</div>
	      </my-dialog>
	      
	       <!-- 删除联系人弹窗-->
	      <my-dialog :is-show="isShowDialog.isShowDeleteDialog" title="提示信息" @on-close="closeDialog('isShowDeleteDialog')">
	      	<div class="dialog">
	      		<div class="dialogCont">你确定删除 {{selectedlist.Name}} 这个联系人吗?</div>
	      		<div class="btn-ground">
	      			<button type="button" @click="deleteMember()">确定</button>
	      		</div>
	      	</div>
	      </my-dialog>
	      
	       <!--修改联系人弹窗addContact-->
	      <my-dialog :is-show="isShowDialog.isShowEditDialog" title="修改联系人"  @on-close="closeDialog('isShowEditDialog')">
	      	<div class="dialog">
	      		<div class="dialogCont addCont">
	      			<div>
	      				<input type="text" name="editedName" id="editedName" ref="editedName" value="" v-model="selectedlist.Name" placeholder="请输入姓名" @input="checkName"/>
	      			</div>
	      			<div>
	      				<input type="text" name="editedUser" id="editedUser" ref="editedUser" value=""  v-model="selectedlist.User" placeholder="请输入邮箱／手机号" @input="checkUser"/>
	      			</div>
	      		</div>
	      		<div class="btn-ground">
	      			<button type="button" @click="editMember()" >确定</button>
	      			<div v-if="!sureFlag" class="btn-hide"></div>
	      		</div>
	      	</div>
	      </my-dialog>
	      
	</div>
</template>

<script>
	import MoPaging from "./base/paging.vue";
	export default{
		name: 'MyTeam',
		components:{
			MoPaging,
		},
		data(){
			return{
				userInfo: "",
			    pageSize: 10, //每页显示10条数据
			    currentPage: 1, //当前页码
			    showMaxPage: 10,
			    count: 20, //总记录数
			    myTeamList: [], //联系人列表
			    pageshow: true,
			    selAllStatus:false, //全选
			    selOneStatus:[true,false],  //多先框状态
			    isShowDialog: {
			    	isShowAddDialog: false,
			    	isShowDeleteDialog: false,
			    	isShowEditDialog: false,
			    },
			    sureFlag: false,
			    clickFlag: false, //是否点击
			    addName: "",
			    addUser: "",
			    addStatus:{
			    	addName: false,
			    	addUser: false
			    },
			    editStatus: {
			      	editName: true,
			      	editUser: true
			    },
			    selectedIndex: 0,
      			selectedlist: {},
			}
		},
		watch: {
	    	addUser: function(cueval, oldval) {
				var phoneReg = /(^1[3-578]\d{9}$)/;
				var mailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
				this.addUser = this.addUser.replace(/\s/, "");
				if (!phoneReg.test(this.addUser) && !mailReg.test(this.addUser)) {
				    this.$refs.addUser.style.borderColor = "#FC4514";
				    this.addStatus.addUser = false;
				} else {
				   this.$refs.addUser.style.borderColor = "#BCBCBC";
				   this.addStatus.addUser = true;
				}
		    },
		    addName:function(cueval, oldval) {
		    	if(this.addName){
		    		this.$refs.addName.style.borderColor = "#BCBCBC";
		    		this.addStatus.addName = true;
		    	}else{
		    		this.$refs.addName.style.borderColor = "#FC4514";
		    		this.addStatus.addName = false;
		    	}
		    },
		    addStatus:{
		    	handler(){
		    		if(this.addStatus.addName && this.addStatus.addUser){
		    			this.sureFlag = true;
		    		}else{
		    			this.sureFlag = false;
		    		}
		    	},
		    	deep: true
		    },
		},
		created() {
		    this.userInfo = JSON.parse(sessionStorage.getItem("LQUserInfo")) || false;
		    //获取模板
		},
		methods: {
			backOne(){
				this.$router.go(-1);
			},
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
		      this.selAllStatus = !this.selAllStatus;
		      for(var i=0;i<this.selOneStatus.length;i++){
		         this.$set(this.selOneStatus,i, this.selAllStatus)
		      }
		    },
		    
			//  单选
		    selOne(e){
		      this.$set(this.selOneStatus,e, !this.selOneStatus[e])
		      this.selAllStatus = false;
		    },
		    
		    //显示添加弹窗
		    showAddMember(){
		    	this.addName = "";
			    this.addUser = "";
		    	this.$set(this.isShowDialog,'isShowAddDialog',true);
		    },
		    //显示修改弹窗
		    showEditTeam(index){
		    	this.selectedIndex = index;
		    	this.selectedlist = this.copyObj(this.contactList[index]);
		    	if(this.editStatus.editName && this.editStatus.editUser){
					this.sureFlag = true;
				}else{
					this.sureFlag = false;
				}
    			//this.selectedlist = this.contactList[index];
		    	this.$set(this.isShowDialog,'isShowEditDialog',true);
		    },
		    //显示删除弹窗
		    showDeleteTeam(index){
		    	this.selectedIndex = index;
    			this.selectedlist = this.contactList[index];
		    	this.$set(this.isShowDialog,'isShowDeleteDialog',true);
		    },
		    
		    //关闭弹窗
		    closeDialog(attr){
		    	this.$set(this.isShowDialog,attr,false);
		    },
		    
		    //添加成员
		    addMember(){
		    	
		    },
		    
		    //修改成员
		    editMember(){
		    	
		    },
		    
		    //删除成员
		    deleteMember(){
		    	
		    },
		    
		    checkName() {
		    	if(this.selectedlist.Name){
					this.$refs.editedName.style.borderColor = "#BCBCBC";
					this.editStatus.Name = true;
		    	}else if(!this.selectedlist.Name){
		    		this.$refs.editedName.style.borderColor = "#FC4514";
		    		this.editStatus.Name = false;
		    	}
		    },
		    
		    checkUser() {
		    	var phoneReg = /(^1[3-578]\d{9}$)/;
			    var mailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
			    this.selectedlist.User = this.selectedlist.User.replace(/\s/, "");
			    if (!phoneReg.test(this.selectedlist.User) && !mailReg.test(this.selectedlist.User)) {
			    	 this.$refs.editedUser.style.borderColor = "#FC4514";
			         this.editStatus.User = false;
			    } else if(phoneReg.test(this.selectedlist.User) || mailReg.test(this.selectedlist.User)){
			    	this.$refs.editedUser.style.borderColor = "#BCBCBC";
			        this.editStatus.User = true;
			    }
			    console.log(this.editStatus.User,88)
		    },
		},
	}
</script>

<style scoped>
	@import '../assets/css/dialogCont.css';
	@import "../assets/css/table.css";
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
		background: url(../assets/img/icon-left.png) no-repeat center;
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
	  padding-left: 15px;
	  box-sizing: border-box;
	  font-family: MicrosoftYaHei;
	}
	
	.r_header .left_icon{
		background: url(../assets/img/icon-right.png) no-repeat;
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
	
	.th_operation{
		padding-left: 26px;
	 }
	 
	.team_edit img {
	  width: 20px;
	  height: 20px;
	  vertical-align: middle;
	  padding: 0 5px;
	  cursor: pointer;
	}
	th {
	  width: 25%;
	}
	th:first-child,td:first-child{
		padding-left: 5%;
	}
	/*switch开关*/
	/*椭圆未选择状态*/
	.iSwitch{
	  position: relative;
	  display: inline-block;
	  margin-left: 10px;
	  width: 36px;
	  height: 18px;
	  border-radius: 9px;
	  background: #D4D4D4;
	  border:1px solid #D4D4D4;
	  overflow: hidden;
	  vertical-align: middle;
	}
	.iSwitch input{
	  visibility: hidden;
	}
	/*圆*/
	.iSwitch i{
	  position: absolute;
	  top: 0;
	  left: 0px;
	  display: inline-block;
	  width: 50%;
	  height: 100%;
	  border-radius: 100%;
	  background: #fff;
	  transition: all 0.4s;
	}
	/*椭圆选择状态*/
	.iSwitch i::before{
	  position: absolute;
	  left: 0;
	  top: 0;
	  content: "";
	  display: none;
	  width: 36px;
	  height: 18px;
	  border-radius: 9px;
	  background: #FC4514;
	  /*border:1px solid #FC4514;*/
	}
	
	 /*圆*/
	.iSwitch i::after{
	  content: "";
	  position: absolute;
	  left: 0px;
	  top: 0;
	  z-index: 2;
	  display: inline-block;
	  width: 100%;
	  height: 100%;
	  border-radius: 100%;
	  background: #fff;
	}
	/*选中时*/
	.iSwitch input:checked + i{
	  transform:translateX(100%);
	  -webkit-transform:translateX(100%);
	  transition: all 0.4s;
	}
	.iSwitch input:checked + i:before{
	  display: inline-block;
	  transform:translateX(-50%);
	  -webkit-transform:translateX(-50%);
	  transition: all 0.4s;
	}
	/*响应式*/
	@media screen and (max-width: 991px){
		.tableWrap{
			height: auto;
		}
	}
</style>