<template>
        <!-- 我的套餐 -->
        <div id="package">
          <div class="header">
	    	  <div class="head-title">我的套餐 </div>
	      </div>
          <div class="r_header">
            <span>文件剩余</span>
            <span class="color_o">&nbsp;&nbsp;剩{{currentAmount}}份/共{{totalAmount}}份</span>
            <div class="r_h_btn" @click="buyPackage()">购买套餐</div>
          </div>
          <div class="r_content">
            <div class="tc_search_wrap">
              <span>订单记录</span>
              <div class="search-box-wrap hidden-xs-only">
                <span>订单时间</span>
                <span class="sel_time_box">
                  <div class="time-box" :class="[{'active':timeStartStatus}]">
                    <input type="text" readonly @click="startTime" value="startTimeVal" v-model="startTimeVal">
                    <img src="../../../assets/img/rili.png" alt="">
                    <div class="calendar" v-if="timeStartStatus">
                      <Calendar @setDate="setDate" @hide="calendarHide" :oldDate="startTimeVal"></Calendar>
                    </div>
                  </div>
                  	至
                  <div class="time-box" :class="[{'active':timeEndStatus}]">
                    <input type="text" readonly @click="endTime" value="endTimeVal" v-model="endTimeVal">
                    <img src="../../../assets/img/rili.png" alt="">
                    <div class="calendar" v-if="timeEndStatus">
                      <Calendar @setDate="setDate" @hide="calendarHide" :oldDate="endTimeVal"></Calendar>
                    </div>
                  </div>
                </span>
                <span class="seach_btn">查询</span>
              </div>
            </div>
	        <div class="tableWrap">
	          <table cellpadding="0" cellspacing="0">
	            <thead>
	              <tr class="table-title">
	                <th class="orderId">订单号</th>
	                <th>套餐类型</th>
	                <th>购买时间</th>
	                <th>是否付款</th>
	                <th>开票状态</th>
	                <th>金额</th>
	              </tr>
	            </thead>
	            <tbody>
            	  <tr>
	        		<td colspan="6" class="tableLoading" v-if="tableLoading">
	        			<img src="../../../assets/img/tableLoading.gif" width="20"/>
	      				<div>拼命加载中</div>
	        		</td>
            	  </tr>
	              <tr v-for="(item,index) in packageList" :key="index">
	                <td class="orderId">{{item.Package_ID}}</td>
	                <td>{{item.Package_Type}}</td>
	                <td>{{item.Package_Date}}</td>
	                <td></td>
	                <td></td>
	                <td>{{item.Package_Price}}</td>
	              </tr>
	            </tbody>
	
	          </table>
	          <div class="data-none" v-if="!packageList.length && !tableLoading">{{dataNone}}</div>
            </div>
            
            <div class="page-wrap" v-if="pageshow">
              <p>正在显示第{{showMaxPage>0 ? (currentPage-1)*pageSize+1 : 0}}-{{showMaxPage}}个，</p>
              <mo-paging :page-index="currentPage" :totla="count" :page-size="pageSize" 
              	:pages="pageCount" @change="pageChange">
              </mo-paging>
            </div>
          </div>
          
          <!--alert弹窗-->
  		  <alert-dialog :is-show="isShowAlert" :alertCont="alertContent" type="default" 
  			@on-close="closeAlert"></alert-dialog>
          
        </div>

</template>


<script>
import MoPaging from "../../base/paging.vue";
import Calendar from "../../base/Calendar.vue";

export default {
  components: {
    MoPaging,
    Calendar
  },
  data() {
    return {
      userInfo: "",
      pageSize: 10, //每页显示10条数据
      currentPage: 1, //当前页码
      /*showMaxPage: 10,*/
      count: 0, //总记录数
	  pageCount: 1, //总页数
      packageList: [], //套餐列表
      timeStartStatus: false,
      timeEndStatus: false,
      startTimeVal: "", //开始日期
      endTimeVal: "", //结束日期
      pageshow: false,
      currentAmount: 0,
      totalAmount: 0,
      
      isShowAlert: false,
      alertContent: "",
      dataNone: "暂无数据",
      tableLoading: false,
    };
  },
  computed:{
  	showMaxPage(){
            return	this.currentPage*this.pageSize >= this.count ? this.count : this.currentPage*this.pageSize;
  	},
  	
  },
  watch: {
    /*currentPage() {
      this.showMaxPage =
        this.currentPage * this.pageSize < this.count
          ? this.currentPage * this.pageSize
          : this.count;
    }*/
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem("LQUserInfo")) || false;
    //获取我的套餐
    this.getMyPackage(this.currentPage,this.pageSize);
  },
  methods: {
  	closeAlert(){
  		this.isShowAlert = false;
  		this.alertContent = "";
  	},
  	//获取我的套餐列表
  	getMyPackage(pageIndex,PageSize){
  		var _this = this;
  		_this.tableLoading = true;
        this.$axios({
	        method: "post",
	        url: _this.$link + "api/Package/My",
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
        	_this.tableLoading = false;
            //console.log('我的套餐',res.data.Data.Result);
            if(res.data.Code == "0"){
            	let Data = res.data.Data;
	            _this.packageList = Data.Result;
	            _this.currentAmount = Data.CurrentAmount;
	            _this.totalAmount = Data.TotalAmount
	            _this.count = Data.PackageCount;
	            Data.PageCount>0 ? _this.pageCount = Data.PageCount : _this.pageCount = 1;
	            _this.pageshow = true;
          	   
	        }else if(res.data.Code == "400"){
	        	_this.$router.push({ path: "/login" });
	        }else{
	        	_this.dataNone = res.data.Message;
	      	   //console.log(res.data.Message);
	       }
          
        })
        .catch(err => {
        	_this.tableLoading = false;
	        _this.dataNone = "网络出错，请稍后再试";
          //console.log(err);
        });
  	},
  	
  	//购买套餐
  	buyPackage(){
  		this.$router.push({ path:"/accountParent/account/package/upGradePackage" })
  	},
  	
    //选择开始时间、显示日历控件
    startTime() {
      this.timeStartStatus = true;
      this.timeEndStatus = false;
    },
    //选择结束时间、显示日历控件
    endTime() {
      this.timeStartStatus = false;
      this.timeEndStatus = true;
    },
    //隐藏日期控件
    calendarHide() {
      this.timeStartStatus = false;
      this.timeEndStatus = false;
    },
    //设置时间
    setDate(date) {
      //console.log(date);
      if (this.timeStartStatus) {
        this.startTimeVal = date;
      } else if (this.timeEndStatus) {
        this.endTimeVal = date;
      }
    },
    
    //初始化分页页码
    initPage() {
      this.pageSize = 10;
      this.currentPage = 1;
    },
    //分页
    pageChange(page) {
      this.currentPage = page;
      this.getMyPackage(this.currentPage,this.pageSize)
    },
 
  },
  mounted() {
    //监听点击事件隐藏日期控件
    var _this = this;
    if (!document.getElementsByClassName("time-box").length) return;
    document.getElementsByClassName("time-box")[0].onclick = function(ev) {
      var oEvent = ev || event;
      oEvent.cancelBubble = true;
      oEvent.stopPropagation();
    };
    document.getElementsByClassName("time-box")[1].onclick = function(ev) {
      var oEvent = ev || event;
      oEvent.cancelBubble = true;
      oEvent.stopPropagation();
    };
    document.getElementById("app").onclick = function() {
      _this.timeStartStatus = false;
      _this.timeEndStatus = false;
    };
  }
};
</script>

<style scoped>
	@import "../../../assets/css/accountCommon.css";
	@import "../../../assets/css/table.css";
	.r_content{
		padding-top: 20px;
	}
	.search-box-wrap{
		padding-right: 13px;
	}
	.r_header{
		padding-left: 38px;
	}
	.tc_top {
	  display: flex;
	  justify-content: space-between;
	  height: 40px;
	  padding-top: 18px;
	  padding-bottom: 40px;
	}
	.tc_top .tc_top_box {
	  height: 40px;
	  width: 450px;
	  padding: 0 36px;
	  box-sizing: border-box;
	  font-size: 12px;
	  color: #a7a7a7;
	  border: 1px solid #d4d4d4;
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	}
	.color_o {
	  color: #FC4514;
	}
	
	.tc_top .tc_top_box .color_o2{
		cursor: pointer;
	}
	
	.tc_search_wrap {
	  height: 30px;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  font-size: 14px;
	  color: #3f3f3f;
	  padding-left: 38px;
	  padding-bottom: 10px;
	}
	.search-box-wrap {
	  display: flex;
	  align-items: center;
	}
	.sel_time_box {
	  display: inline-block;
	  padding-left: 20px;
	  width: 334px;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	}
	.sel_time_box .time-box {
	  height: 32px;
	  width: 150px;
	 /* border: 1px solid #dbdbdb;*/
	  box-sizing: border-box;
	  border-radius: 2px;
	  position: relative;
	  cursor: pointer;
	}
	.sel_time_box .time-box.active {
	 /* border-color: #FC4514;*/
	}
	.sel_time_box .time-box input {
	  width: 150px;
	  height: 100%;
	  border: 0;
	  padding-left: 10px;
	  box-sizing: border-box;
	  cursor: pointer;
	  position: absolute;
	  border: 1px solid #dbdbdb;
	  border-radius: 2px;
	  top: 0;
	  left: 0;
	  right: 0;
	  bottom: 0;
	  z-index: 1;
	  background: transparent;
	}
	.sel_time_box .time-box img {
	  width: 14px;
	  position: absolute;
	  /*padding: 7px;*/
	  top: 7px;
	  right: 7px;
	}
	.calendar {
	  position: absolute;
	  left: 0;
	  top: 31px;
	  z-index: 9;
	}
	.seach_btn {
	  background: #FC4514;
	  border-radius: 2px;
	  color: #fff;
	  font-size: 12px;
	  line-height: 30px;
	  display: inline-block;
	  width: 60px;
	  text-align: center;
	  margin-left: 5px;
	  cursor: pointer;
	}
	.tc_list_header {
	  height: 40px;
	  line-height: 40px;
	  border: 1px solid #d4d4d4;
	  font-size: 15px;
	  color: #4b4b4b;
	  display: flex;
	}
	.tc_list_header span {
	  flex: 1;
	  text-align: center;
	}
	.tc_list li {
	  line-height: 40px;
	  display: flex;
	  font-size: 14px;
	  color: #4b4b4b;
	}
	
	.tc_list span {
	  flex: 1;
	  text-align: center;
	  overflow: hidden;
	  white-space: nowrap;
	  text-overflow: ellipsis;
	}
	.list-item {
	  cursor: pointer;
	  border-bottom: 1px solid #d4d4d4;
	}
	.list-item:hover {
	  background: #ffece7;
	}
	.tableWrap{
		height: 495px;;
	}
	table{
		margin-top: 0;
	}
	th{
		width: 16%;
	}
	th:first-child,td:first-child{
		padding-left: 5%;
		width: 20%;
	}
	
	
	/*响应式*/
	@media screen and (max-width: 991px){
		.tableWrap{
			height: auto;
		}
		.tc_search_wrap{
			flex-wrap: wrap;
		}
		
	}	
	
</style>

