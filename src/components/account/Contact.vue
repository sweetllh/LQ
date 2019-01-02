<template>
    <!-- 联系人列表 -->
    <div id="contact">
      <div class="header">
    	  <div class="head-title">我的联系人<span class="head-number">（{{count}}）</span></div>
    	 <!-- <span class="head-number">{{count}}</span>-->
      </div>
      <div class="r_header">
      	<!--<i class="left_icon"></i>-->
        <span class="r_header_title">联系人列表</span>
        <div class="r_h_btn" @click="showAddContact">添加联系人</div>
      </div>
      <div class="r_content">
	      <div class="tableWrap">
	          <table cellpadding="0" cellspacing="0">
	            <thead>
	              <tr class="table-title">
	                <!--<th class="checkbox" @click="selectAll">
	                  <i :class="{'active':isCheckedAll}"></i>
	                </th>-->
	                <th class="index">#</th>
	                <th>姓名</th>
	                <th>账号</th>
	                <th>实名认证</th>
	                <th style="padding-left: 26px;">操作</th>
	              </tr>
	            </thead>
	            <tbody>
	              <tr>
            		<td colspan="5" class="tableLoading" v-if="tableLoading">
            			<img src="../../assets/img/tableLoading.gif" width="20"/>
          				<div>拼命加载中</div>
            		</td>
	              </tr>
	              <tr v-for="(item,index) in contactList" :key="index" 
	              	v-show="index+1>=(currentPage-1)*pageSize+1 && index+1<=currentPage*pageSize">
	                <!--<td class="checkbox" @click="selOne(item.ContractID)">
	                  <i :class="{'active':contractIds.indexOf(item.ContractID)>=0}"></i>
	                </td>-->
	            	<td class="index">{{index+1}}</td>
	                <td>{{item.Name}}</td>
	                <td>{{item.User}}</td>
	                <td>{{item.IsAuth ? '已认证' : '未认证'}}</td>
	                <td class="handel">
	                	<img src="../../assets/img/icon-edit.png" alt="编辑" title="编辑" @click="showEditContact(index)">
              			<img src="../../assets/img/icon-del.png" alt="删除" title="删除" @click="showDeleteContact(index)">
	                </td>
	              </tr>
	            </tbody>
	          </table>
	          <div class="data-none" v-if="!contactList.length && !tableLoading">暂无数据</div>
	      </div>
	      <div class="endCont">
	      	  <!--<div class="deletedAll">删除</div>-->
	      	  <div class="page-wrap" v-if="pageshow">
	              <p>正在显示第{{showMaxPage>0 ? (currentPage-1)*pageSize+1 : 0}}-{{showMaxPage}}个，</p>
		          <mo-paging :page-index="currentPage" :totla="count" :page-size="pageSize" :pages="pageCount" @change="pageChange">
		          </mo-paging>
	          </div>
	      </div>
	    </div>  
	      
  	   <!-- 删除联系人弹窗-->
      <my-dialog :is-show="isShowDeleteDialog" title="提示信息" @on-close="closeDialog('isShowDeleteDialog')">
      	<div class="dialog">
      		<div class="dialogCont">你确定删除 {{selectedlist.Name}} 这个联系人吗?</div>
      		<div class="btn-ground">
      			<button type="button" @click="deleteContacts()">{{sureText}}</button>
      			<div v-if="!sureFlag" class="btn-hide"></div>
      		</div>
      	</div>
      </my-dialog>
      
      <!--添加联系人弹窗addContact-->
      <my-dialog :is-show="isShowAddDialog" title="添加联系人" @on-close="closeDialog('isShowAddDialog')">
      	<div class="dialog">
      		<div class="dialogCont addCont">
      			<div>
      				<input type="text" name="addName" id="addName" ref="addName" value="addName" 
      				v-model="addName" placeholder="请输入姓名" @input="checkAddName"/>
      				<p class="tip">{{tip.nameTip}}</p>
      			</div>
      			<div>
      				<input type="text" name="addUser" id="addUser" ref="addUser" value="addUser" v-model="addUser" 
      				maxlength="11" placeholder="请输入手机号码" @input="checkAddUser"/>
      				<p class="tip">{{tip.userTip}}</p>
      				<p class="tip">{{tip.addTip}}</p>
      			</div>
      		</div>
      		<div class="btn-ground">
      			<button type="button" @click="addContacts()" >{{sureText}}</button>
      			<div v-if="!sureFlag" class="btn-hide"></div>
      		</div>
      	</div>
      </my-dialog>
      
       <!--修改联系人弹窗addContact-->
      <my-dialog :is-show="isShowEditDialog" title="修改联系人"  @on-close="closeDialog('isShowEditDialog')">
      	<div class="dialog">
      		<div class="dialogCont addCont">
      			<div>
      				<input type="text" name="editedName" id="editedName" ref="editedName" value="selectedlist.Name" 
      				v-model="selectedlist.Name" placeholder="请输入姓名" @input="checkName"/>
      				<p class="tip">{{tip.nameTip}}</p>
      			</div>
      			<div>
      				<input type="text" name="editedUser" id="editedUser" ref="editedUser" value="selectedlist.User"  
      				v-model="selectedlist.User" maxlength="11" placeholder="请输入手机号码" @input="checkUser"/>
      				<p class="tip">{{tip.userTip}}</p>
      				<p class="tip">{{tip.editTip}}</p>
      			</div>
      		</div>
      		<div class="btn-ground">
      			<button type="button" @click="editContacts()" >{{sureText}}</button>
      			<div v-if="!sureFlag" class="btn-hide"></div>
      		</div>
      	</div>
      </my-dialog>
      
	    <!--alert弹窗-->
  		<alert-dialog :is-show="isShowAlert" :alertCont="alertContent" type="default"
  			@on-close="closeAlert"></alert-dialog>
    </div>
</template>


<script>
import MoPaging from "../base/paging.vue";
export default {
  inject:['reload'],
  components: {
    MoPaging,
  },
  data() {
    return {
      userInfo: "",
      pageSize: 10, //每页显示10条数据
      currentPage: 1, //当前页码
     // showMaxPage: 10,
     //count: 0, //总记录数
      contactList: [], //联系人列表
      pageshow: false,
      isShowDeleteDialog: false, //取消联系人弹窗
      isShowAddDialog: false,  //添加联系人弹窗
      isShowEditDialog: false,  //修改联系人弹窗
      
      isShowAlert: false,
      alertContent: "",
      
      addName:"",
      addUser:"",
      addStatus: {
      	addName: false,
      	addUser: false
      },
      editStatus: {
      	Name: true,
      	User: true
      },
      clickFlag: false, //是否点击
      sureFlag: false, //是否通过验证
      sureText: "确定",
      
      tableLoading: false,
      selectedIndex: 0,
      selectedlist: {},
      tip: {
      	nameTip : "",
      	userTip : "",
      	editTip: "",
      	addTip:""
      }
    };
  },
  computed:{
  	showMaxPage(){
            return	this.currentPage*this.pageSize >= this.count ? this.count : this.currentPage*this.pageSize;
  	},
  	count(){
  		return this.contactList.length;
  	},
  	pageCount() {
  		if(this.count > 0){
  			return Math.ceil(this.count / this.pageSize);
  		}
      
  	}
  },
  watch: {
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
    editStatus:{
    	handler(){
    		if(this.editStatus.Name && this.editStatus.User){
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
    //获取联系人
    this.getContacts();
  },
  methods: {
  	closeAlert(){
  		this.isShowAlert = false;
  		this.alertContent = "";
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
    
    //获取联系人
    getContacts() {
      var _this = this;
      _this.tableLoading = true;
      this.$axios({
        method: "post",
        url: _this.$link + "api/Contact/Get",
        headers: { "access-token": _this.userInfo.Token },
        data: {
          timestamp: "1",
          SecretId: "3",
          Signature: "4"
        }
      })
        .then(res => {
          //console.log('联系人列表',res.data);
          _this.tableLoading = false;
          if (res.data.Code == "0") {
            var data = res.data.Data;
            for (var i = 0; i < data.length; i++) {
              _this.contactList = _this.contactList.concat(data[i].content);
            }
           // _this.count = _this.contactList.length;
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
            _this.isShowAlert = true;
	      	_this.alertContent = "网络出错，请稍后再试";
          //console.log(err);
        });
    },
    
    checkName() {
    	this.tip.editTip = "";
    	if(this.selectedlist.Name){
			this.$refs.editedName.style.borderColor = "#BCBCBC";
			this.editStatus.Name = true;
			this.tip.nameTip = "";
    	}else if(!this.selectedlist.Name){
    		this.$refs.editedName.style.borderColor = "#FC4514";
    		this.editStatus.Name = false;
    		this.tip.nameTip = "请输入联系人名字";
    	}
    },
    
    checkUser() {
    	this.tip.editTip = "";
    	var phoneReg = /(^1[3-578]\d{9}$)/;
	    var mailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
	    this.selectedlist.User = this.selectedlist.User.replace(/\s/, "");
	    /*if (!phoneReg.test(this.selectedlist.User) && !mailReg.test(this.selectedlist.User)) {
	    	 this.$refs.editedUser.style.borderColor = "#FC4514";
	         this.editStatus.User = false;
	         this.tip.userTip = ""
	    } else if(phoneReg.test(this.selectedlist.User) || mailReg.test(this.selectedlist.User)){
	    	this.$refs.editedUser.style.borderColor = "#BCBCBC";
	        this.editStatus.User = true;
	    }*/
	    if (!phoneReg.test(this.selectedlist.User) ) {
	    	 this.$refs.editedUser.style.borderColor = "#FC4514";
	         this.editStatus.User = false;
	         !this.selectedlist.User ? this.tip.userTip = "请输入联系人手机号" : this.tip.userTip = "输入的手机号码格式不正确";
	         
	    } else if(phoneReg.test(this.selectedlist.User) || mailReg.test(this.selectedlist.User)){
	    	this.$refs.editedUser.style.borderColor = "#BCBCBC";
	        this.editStatus.User = true;
	        this.tip.userTip = "";
	    }
	    //console.log(this.editStatus.User,88)
    },
    
    checkAddUser() {
	  this.tip.addTip = "";
      var phoneReg = /(^1[3-578]\d{9}$)/;
      var mailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      /*this.addUser = this.addUser.replace(/\s/, "");*/
      /*if (!phoneReg.test(this.addUser) && !mailReg.test(this.addUser)) {
         this.$refs.addUser.style.borderColor = "#FC4514";
         this.addStatus.addUser = false;
         this.tip.userTip = "输入的手机号码格式不正确";
      } else {
        this.$refs.addUser.style.borderColor = "#BCBCBC";
        this.addStatus.addUser = true;
        this.tip.userTip = "";
      }*/
     if (!phoneReg.test(this.addUser)) {
         this.$refs.addUser.style.borderColor = "#FC4514";
         this.addStatus.addUser = false;
         !this.addUser ? this.tip.userTip = "请输入联系人手机号" : this.tip.userTip = "输入的手机号码格式不正确";
         
      } else {
        this.$refs.addUser.style.borderColor = "#BCBCBC";
        this.addStatus.addUser = true;
        this.tip.userTip = "";
      }
    },
    checkAddName() {
    	this.tip.addTip = "";
    	if(this.addName){
    		this.$refs.addName.style.borderColor = "#BCBCBC";
    		this.addStatus.addName = true;
    		this.tip.nameTip = "";
    	}else{
    		this.$refs.addName.style.borderColor = "#FC4514";
    		this.addStatus.addName = false;
    		this.tip.nameTip = "请输入联系人名字";
    		
    	}
    },
    
    //关闭弹窗
    closeDialog(attr) {
    	this[attr] = false;
    	/*恢复原状*/
    	this.tip = {
	      	nameTip : "",
	      	userTip : "",
	      	editTip: "",
	      	addTip:""
	    };
	    this.editStatus = {
	      	Name: true,
	      	User: true
	     };
    },
    
    //显示删除联系人弹窗
    showDeleteContact(index){
    	this.selectedIndex = index;
    	this.selectedlist = this.contactList[index];
    	this.isShowDeleteDialog = true;
    	this.sureFlag = true;
    },
    
    //显示添加联系人弹窗
    showAddContact(){
    	this.addName = "",
      	this.addUser = "",
    	this.isShowAddDialog = true;
    	this.sureFlag = false;
    },
    
    //显示修改联系人弹窗
    showEditContact(index){
    	this.selectedIndex = index;
    	this.selectedlist = this.copyObj(this.contactList[index]);
    	if(this.editStatus.Name && this.editStatus.User){
			this.sureFlag = true;
		}else{
			this.sureFlag = false;
		}
    	//this.selectedlist = this.contactList[index];
    	this.isShowEditDialog = true;
    },
    
    copyObj(obj) {
	  return JSON.parse(JSON.stringify(obj));      
	},
    //添加联系人
    addContacts() {
      var _this = this;
      /*if(!_this.addStatus.addName){
      	 this.$refs.addName.focus();
         return false;
      };
      if(!_this.addStatus.addUser){
      	 this.$refs.addUser.focus();
         return false;
      };*/
	  _this.sureFlag = false;
      _this.sureText = "加载中...";
      this.$axios({
        method: "post",
        url: _this.$link + "api/Contact/Create",
        headers: { "access-token": _this.userInfo.Token },
        data: {
          timestamp: "1",
          SecretId: "3",
          Signature: "4",
          Data: {
            Name: _this.addName,
            User: _this.addUser
          }
        }
      })
        .then(res => {
          //console.log(res.data);
          _this.sureFlag = true;
      	  _this.sureText = "确定";
          if(res.data.Code == "0"){
          	  _this.isShowAddDialog = false;
          	  _this.isShowAlert = true;
	          _this.alertContent = '添加成功';
	          //联系人添加
	          _this.contactList.length = 0
	          _this.getContacts();//重新加载联系人
	          //_this.reload();
	      }else if (res.data.Code == 400) {
	          _this.$router.push({ path: "/login" });
	      }else{
	      	_this.tip.addTip = res.data.Message;
	      	//alert(res.data.Message);
	      }
          
        })
        .catch(err => {
        	_this.sureFlag = true;
      	  	_this.sureText = "确定";
        	_this.isShowAddDialog = false;
          	_this.isShowAlert = true;
	      	_this.alertContent = "网络出错，请稍后再试";
          //console.log(err);
        });
    },
    
    //删除联系人
    deleteContacts() {
    	var _this = this;
    	/*if(_this.clickFlag) return; //已经点击
		_this.clickFlag = true;
	    setTimeout(function(){
	        _this.clickFlag = false;
	    },5000);*/
	    _this.sureFlag = false;
      	_this.sureText = "加载中";
        this.$axios({
	        method: "post",
	        url: _this.$link + "api/Contact/Delete",
	        headers: { "access-token": _this.userInfo.Token },
	        data: {
	          timestamp: "1",
	          SecretId: "3",
	          Signature: "4",
	          Data: _this.selectedlist
	        }
	    })
        .then(res => {
          _this.sureFlag = true;
      	  _this.sureText = "确定";
          if (res.data.Code == "0"){
          	_this.isShowDeleteDialog = false;
          	_this.isShowAlert = true;
	        _this.alertContent = '删除成功';
          	
          	_this.contactList.length = 0;
          	_this.getContacts();//重新加载联系人
          	/*_this.reload();*/
          	
          	//this.contactList.splice(this.selectedIndex, 1);
          }else if (res.data.Code == 400) {
	          _this.$router.push({ path: "/login" });
	      }else{
          	_this.isShowAlert = true;
	        _this.alertContent = res.data.Message;
          	//alert(res.data.Message);
          }
          //console.log(res.data);
        })
        .catch(err => {
        	_this.sureFlag = true;
      	    _this.sureText = "确定";
      	    _this.isShowDeleteDialog = false;
        	_this.isShowAlert = true;
	        _this.alertContent = "网络出错，请稍后再试";
          //console.log(err);
        });
    },
    
    //修改联系人
    editContacts () {
    	var _this = this;
	    /*if(!_this.editStatus.Name){
	    	 _this.$refs.editedName.focus();
	         return false;
	     };
      	if (!_this.editStatus.User) {
      		_this.$refs.editedUser.focus();
        	return false;
	     } 
	     if(_this.clickFlag) return; //已经点击
		 _this.clickFlag = true;
	     setTimeout(function(){
	        _this.clickFlag = false;
	     },5000);*/
	    _this.sureFlag = false;
      	_this.sureText = "加载中";
        this.$axios({
	        method: "post",
	        url: _this.$link + "api/Contact/Update",
	        headers: { "access-token": _this.userInfo.Token },
	        data: {
	          timestamp: "1",
	          SecretId: "3",
	          Signature: "4",
	          Data: _this.selectedlist
	        }
	    })
        .then(res => {
          _this.sureFlag = true;
      	  _this.sureText = "确定";
          if (res.data.Code == "0"){
          	_this.isShowEditDialog = false;
          	_this.isShowAlert = true;
	        _this.alertContent = "修改成功";
          	//alert("修改成功");
          	//改变数组的值
          	_this.$set(_this.contactList, _this.selectedIndex, _this.selectedlist);
          }else if (res.data.Code == 400) {
	          _this.$router.push({ path: "/login" });
	      }else{
          	_this.tip.editTip = res.data.Message;
          	//alert(res.data.reason);
          }
          //console.log(res.data);
        })
        .catch(err => {
        	_this.sureFlag = true;
      	    _this.sureText = "确定";
        	_this.isShowEditDialog = false;
        	_this.isShowAlert = true;
	        _this.alertContent = "网络出错，请稍后再试";
          //console.log(err);
        });
    }
    
  },
};
</script>

<style scoped>
	@import '../../assets/css/accountCommon.css';
	@import '../../assets/css/dialogCont.css';
	@import url("../../assets/css/table.css");
	th {
	  width: 22%;
	}
	th.index,td.index{
		width: 12%;
		padding-left: 30px;
	}
	.addCont div{
		position: relative;
	}
	.addCont div p{
		color: #FC4514;
		position: absolute;
		bottom: -19px;
		font-size: 12px;
	}
	.r_header{
		padding-left: 38px;
	}
	
	.lxr_header {
	  line-height: 40px;
	  /*border: 1px solid #d4d4d4;*/
	  background: #F3F3F3;
	  box-sizing: border-box;
	  padding-left: 38px;
	}
	.handel img{
		vertical-align: middle;
		padding: 0 5px;
	}
	.tableWrap{
		height: 465px;
	}
	
	/*响应式*/
	@media screen and (max-width: 991px){
		.tableWrap{
			height: auto;
		}
	}		
</style>

