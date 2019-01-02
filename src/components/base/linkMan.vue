<template>
	<div>
		<div class="dialog-wrap">
			<div class="dialog-cover" v-show="isShow"></div>
			<transition name="drop">
				<div class="dialog-content clearfix" v-show="isShow">
					<img class="dialog-close" @click="closeMyself" src="../../assets/img/icon-close.png"/>
					<p class="title">请选择要添加的联系人（已添加{{count}}人）</p>
					<div class="linkList">
						<input type="text" name="" id="" value="" v-model.trim="search" placeholder="请输入姓名或账号"/>
						<img src="../../assets/img/icon-search.png" class="search-icon"/>
						<div class="tableWrap">
				          <table cellpadding="0" cellspacing="0">
				            <thead>
				              <tr class="table-title">
				                <th class="checkbox" @click="selectAll">
				                  <i :class="{'active':isCheckedAll}"></i>
				                </th>
				                <th class="name">姓名</th>
				                <th>账号</th>
				              </tr>
				            </thead>
				            <tbody>
				              <tr>
				            	<td colspan="3" class="tableLoading" v-if="tableLoading">
			            			<img src="../../assets/img/tableLoading.gif" width="20"/>
			          				<div>拼命加载中</div>
				            	</td>
				              </tr>
				              <tr  v-for="(item,index) in searchData " :key="item.ID">
				                <td class="checkbox" @click="selOne(item.ID)">
									<i :class="{'active':Ids.indexOf(item.ID)>=0}"></i>
								</td>
				               <td class="name">{{item.Name}}</td>
								<td>{{item.User}}</td>
				              </tr>
				            </tbody>
				
				          </table>
				          <div class="data-none" v-if="!searchData.length && !tableLoading">{{dataNone}}</div>
			          	</div>
					</div>
					
					
					
					
					
					<div class="sure_btn" @click="addSigner">确定</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      userInfo: "",
      search: '',         //搜索内容
      isCheckedAll: false,   //全选
      contactList: [],      //联系人列表
      Ids: [],
      selectList: [],      //选择的内容
      tableLoading: false,
      dataNone: "暂无数据",
    }
  },
  computed: {
  	count(){
		return this.Ids.length ;
	 },
	 //搜索数据
	 searchData:function(){
		var search =this.search;
		if(search){
			return this.contactList.filter(function(pro){
				return Object.keys(pro).some(function(key){
					return String(pro[key]).toLowerCase().indexOf(search)>-1
					
				})
			})
		}
		 return this.contactList;
	}

  },
  watch: {
  	isShow(){
  		if(this.isShow){
  			//获取联系人
  			this.getContacts();
  		}
  	}
  },
  created() {
  	this.userInfo = JSON.parse(sessionStorage.getItem("LQUserInfo")) || false;
  },
  methods: {
  	//关闭弹窗
    closeMyself () {
      this.$emit('on-close')
    },
    //添加到签署人
    addSigner(){
    	this.selectList.length = 0;  //先清空
    	this.contactList.forEach(item => {
    		if(this.Ids.indexOf(item.ID) != -1){
    			this.selectList.push(item);
    		}
        })
    	//console.log('this.selectList',this.selectList)
    	this.$emit('add-signer',this.selectList);
    },
    //  全选
    selectAll(){
      this.isCheckedAll = !this.isCheckedAll;
	  if (this.isCheckedAll) {//全选时
          this.Ids = [];
          this.contactList.forEach(item => {
          	this.Ids.push(item.ID)
          })
      } else {
        this.Ids = []
      }
    },
    
	//  单选
    selOne(id){
      let idIndex = this.Ids.indexOf(id)
      if (idIndex >= 0) {//如果已经包含就去除
        this.Ids.splice(idIndex, 1)
      } else {//如果没有包含就添加
        this.Ids.push(id)
      }

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
          _this.tableLoading = false;
          //console.log('联系人列表',res.data);
          if (res.data.Code == "0") {
          	_this.contactList.length = 0;
            var data = res.data.Data;
            for (var i = 0; i < data.length; i++) {
              _this.contactList = _this.contactList.concat(data[i].content);
            }
           // _this.count = _this.contactList.length;
            _this.pageshow = true;
          }else if (res.data.Code == 400) {
	         /* sessionStorage.removeItem("LQUserInfo");
	          _this.$router.push({ path: "/login" });
	          return;*/
	       }else{
	       		_this.dataNone = res.data.Message;
	       }
        })
        .catch(err => {
          _this.tableLoading = false;
          _this.dataNone = "网络出错，请稍后再试";
          //console.log(err);
        });
    },
    
  }
}
</script>

<style scoped>
@import "../../assets/css/table.css";
.drop-enter-active {
  transition: all .5s ease;
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

.dialog-wrap {
  /*position: fixed;
  width: 100%;
  height: 100%;*/
}
.dialog-cover {
  background: rgba(0,0 ,0 ,0.3);
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.dialog-content {
  width: 500px;
  position: fixed;
  min-height: 350px;
  max-height: 550px;
  overflow: auto;
  background: #fff;
  /*top: 15%;*/
  top: 50%;
  left: 50%;
  transform: translate(-50%,-42%);
  /*margin-left: -300px;*/
  z-index: 10;
  border: 1px solid #CCCCCC;
  padding: 25px 50px 28px;
  line-height: 1.6;
  box-sizing: border-box;
  border-radius: 10px;
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
.dialog-close:hover {
  color: #4fc08d;
}
.title{
	font-size:22px;
	font-family:MicrosoftYaHei;
	color: #4B4B4B;
	font-size: 16px;
	margin-bottom: 20px;
	/*margin-left: -14px;*/
}
.linkList{
	position: relative;
}
.linkList input{
	width: 50%;
	border-radius: 2px;
	height: 32px;
	line-height: 14px;
	font-size: 14px;
	border: 1px solid #bdbdbd;
	box-sizing: border-box;
	padding: 9px 0 9px 25px;
}
.linkList .search-icon{
	position: absolute;
	left: 6px;
	top: 8px;
}
input:focus {
  outline-style: auto;
  outline-width: 2px;
}
input::-ms-clear {
  display: none;
}
input::-ms-reveal {
  display: none;
}
.sure_btn{
	width: 80px;
	height: 30px;
	line-height: 30px;
	background: #FC4514;
	color: #fff;
	text-align: center;
	float: right;
	font-size: 14px;
	border-radius: 4px;
	margin-top: 20px;
	cursor: pointer;
}
</style>