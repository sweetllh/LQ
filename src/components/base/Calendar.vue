<template>
	  <div id="calendar">
	    <ul class="calendar-header">
	      <li class="triangle_border_left" @click="preMonth"></li>
	      <li>
		      <span @click="isShowMonth=true" style="padding-right: 10px;">{{month}}月</span>
		      <span @click="isShowYear=true">{{year}}</span>
	        <!--<select class="month" v-model="month" @change="timeChange">
	          <option value="1">1月</option>
	          <option value="2">2月</option>
	          <option value="3">3月</option>
	          <option value="4">4月</option>
	          <option value="5">5月</option>
	          <option value="6">6月</option>
	          <option value="7">7月</option>
	          <option value="8">8月</option>
	          <option value="9">9月</option>
	          <option value="10">10月</option>
	          <option value="11">11月</option>
	          <option value="12">12月</option>
	        </select>-->
	        <!--<select id="select_y" v-model="year" @change="timeChange">
	          <option v-for="(item,index) in 100" :key="index" :value="item+now_year-1">{{item+now_year-1}}</option>
	        </select>-->
	      </li>
	      <li class="triangle_border_right" @click="nextMonth"></li>
	    </ul>
	    <ul class="week_box">
	      <li>日</li>
	      <li>一</li>
	      <li>二</li>
	      <li>三</li>
	      <li>四</li>
	      <li>五</li>
	      <li>六</li>
	    </ul>
	    <ul class="date_box" id="date_box">
	      <li v-for="(item in empty" :key="item.id"></li>
	      <li v-for="item in dateCount" v-bind:key="item">
	        <i @click="getDate(item,$event)">{{item}}</i>
	      </li>
	    </ul>
	    <div class="btn-wrap">
	    	<button class="clear_btn" @click="sure()">确定</button>
	    	<button class="clear_btn" @click="today">今天</button>
	    	<button class="clear_btn clear" @click="clear()">清除</button>
	    </div>
	    	<!--月-->
	    <ul class="month_wrap clearfix" v-if="isShowMonth">
	  		<div class="arrow">
	  				<span class="triangle_border_left" @click="preYear"></span>
	  				<span style="color: #FC4514;" @click="isShowYear=true">{{year}}</span>
	  				<span class="triangle_border_right" @click="nextYear"></span>
	  		</div>
	  		<li v-for="(item,index) in months" :key="index" @click="setMonth(index+1)"
	  			:class="{active: now_year==year&&now_month==index+1 ? true : false}">{{item}}</li>
	  	</ul>
	  	
	  	<!--年-->
	  	<ul class="year_wrap month_wrap clearfix" v-if="isShowYear">
	  		<div class="arrow">
	  				<span class="triangle_border_left" @click="preYears"></span>
	  				<span style="color: #FC4514;">{{startNumber+1}}~{{startNumber+10}}</span>
	  				<span class="triangle_border_right" @click="nextYears"></span>
	  		</div>
	  		<!--<li v-for="(item,index) in years" :key="index" @click="setYear(item)">{{item}}</li>-->
	  		<li v-for="n in 10" :key="n" @click="setYear(n+startNumber)">{{n+startNumber}}</li>
	  	</ul>
	  	
	  </div>
	  
</template>


<script>
export default {
  components: {},
  props: {
    oldDate: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      startWeek: 0,
      dateCount: "",
      empty: "",
      year:  2018,
      month: 1,
      dates: "",
      isShowMonth: false,
      months:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
      isShowYear: false,
      startNumber: 2009,
      /*years: [],*/
    };
  },
  computed: {
  	now_year(){
  		return new Date().getFullYear();
  	},
  	now_month(){
  		return new Date().getMonth() + 1;
  	},
  },
  
  created: function() {
    //设置展示年月为当前年月或选中的年月
    if(this.oldDate){
    	this.year = parseInt(this.oldDate.split('-')[0]);
    	this.month = parseInt(this.oldDate.split('-')[1]);
    }else{
   		var time = new Date();
	    this.year = time.getFullYear();
	    this.month = time.getMonth() + 1;
    }
    this.startNumber = this.now_year-this.now_year%10 - 1;
    this.init(this.year, this.month,this.oldDate);
  },
  methods: {
    //初始化
    init(year, month,oldDate) {
      this.dateCount = new Date(year, month, 0).getDate();   //当前月的天数
      var firstDay = new Date(Date.UTC(year, month - 1, 1)).getDay();  //1号是星期几
      //var firstDay = new Date(year, month - 1, 1).getDay();  // 当前月第一天是星期几
      this.empty = firstDay - this.startWeek;             //有几个空格
      var _this = this;
      setTimeout(function() {
        var li = document.getElementById("date_box").childNodes;
        for (var i = 0; i < li.length; i++) {
          li[i].className = "timeText";
          //选中的日期高亮
          if(oldDate){
          		var nowYear = parseInt(oldDate.split('-')[0]);
		          var nowMonth = parseInt(oldDate.split('-')[1]);
		          var nowDate = parseInt(oldDate.split('-')[2]);
		          if(year==nowYear && month==nowMonth && Number(li[i].innerText)==nowDate){
		          	li[i].className = "active";
		          }
          }
          //今天日期加border
          if(year==_this.now_year && month==_this.now_month && Number(li[i].innerText)==new Date().getDate()){
          	var classVal = li[i].className;
          	classVal = classVal.concat(" nowDate")
          	li[i].setAttribute("class",classVal);
          }
          
        }
      }, 10);
      
      
    },
    //上个月
    preMonth() {
      this.month = this.month - 1;
      if (this.month <= 0) {
        this.month = 12;
        if (this.year > this.now_year) {
          this.year = this.year - 1;
        } else {
          this.month = 1;
        }
      }
      this.init(this.year,this.month, this.oldDate);
    },
    //下个月
    nextMonth() {
      this.month = this.month + 1;
      if (this.month > 12) {
        this.month = 1;
        if (this.year < this.now_year - 1) {
          this.year = this.year + 1;
        } else {
          this.month = 12;
        }
      }
     this.init(this.year, this.month, this.oldDate);
    },
    //选择年、月
    timeChange() {
      this.init(this.year, this.month, this.oldDate);
    },
    //获取日期传给父组件
    getDate(item, e) {
      var li = document.getElementById("date_box").childNodes;
      for (var i = 0; i < li.length; i++) {
       	li[i].className = "";
       	
       	//今天日期加border
          if(this.year==this.now_year && this.month==this.now_month && Number(li[i].innerText)==new Date().getDate()){
          	var classVal = li[i].className;
          	classVal = classVal.concat(" nowDate")
          	li[i].setAttribute("class",classVal);
          }
      }
      /*e.path[1].className = "active";*/
      
      e.target.parentNode.className = "active";
      this.dates = this.year + "-" + this.formatNum(this.month) + "-" + this.formatNum(item);
      
    },
    
    //月份和date补0
    formatNum(s) {
        return s < 10 ? '0' + s: s;
    },
    //移除日期控件
    hide() {
      this.$emit("hide");
    },
    //确定
    sure(){
    	this.$emit("setDate", this.dates);
      this.$emit("hide");
    },
    //清除日期
    clear(){
    	this.dates = "";
    	this.$emit("setDate",this.dates);
    	this.$emit("hide");
    },
   	/*设置为今天*/
   	today(){
   		var today = new Date();
   		var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
      this.$emit("setDate", date);
      this.$emit("hide");
   	},
   //设置月份
   setMonth(index){
   		this.isShowMonth = false;
   		this.month = index;
   		this.init(this.year, this.month, this.oldDate);
   },
   //上一年
   preYear(){
   		this.year = this.year - 1;
      /*if (this.year < this.now_year) {
          this.year = this.now_year;
       } */
      this.init(this.year, this.month, this.oldDate);
   },
   //下一年
   nextYear(){
   		this.year = this.year + 1;
   		this.init(this.year, this.month, this.oldDate);
   },
   
   //设置年份
   setYear(index){
   		this.year = index;
   		this.isShowYear = false;
   		this.init(this.year, this.month, this.oldDate);
   },
   preYears(){
   	  this.startNumber = this.startNumber - 10;
   	  //this.init(this.year, this.month, this.oldDate);
   },
   nextYears(){
   		this.startNumber = this.startNumber + 10;
   		//this.init(this.year, this.month, this.oldDate);
   }
   
  }
};
</script>


<style lang="scss" scoped>
#calendar {
  background: #fff;
  width: 224px;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.11);
  position: relative;
}
.calendar-header {
  height: 41px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.triangle_border_left {
  width: 0;
  height: 0;
  border-width: 8px 8px 8px 0;
  border-style: solid;
  border-color: transparent #7f7f7f transparent transparent;
  margin-left: 10px;
  cursor: pointer;
}
.triangle_border_right {
  width: 0;
  height: 0;
  border-width: 8px 0 8px 8px;
  border-style: solid;
  border-color: transparent transparent transparent #7f7f7f;
  margin-right: 10px;
  cursor: pointer;
}
#calendar select {
  border: 0;
  appearance: none;
  background: transparent;
  -moz-appearance: none;
  -webkit-appearance: none;
  -o-appearance: none;
  outline: 0;
  font-size: 20px;
  cursor: pointer;
  color: #333;
  font-size: 14px;
}
.year {
  position: relative;
  font-size: 20px;
}
.year select {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
.week_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  line-height: 20px;
}
.week_box li {
  text-align: center;
  flex: 1;
}
.date_box {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  font-size: 12px;
  padding-top: 5px;
  color: #7f7f7f;
  height: 185px;
  box-sizing: border-box;
}
.date_box li {
  width: 14.2%;
  height: 30px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.date_box li i {
  display: inline-block;
  text-align: center;
  width: 20px;
  line-height: 20px;
}
.date_box .active i {
  background: #FC4514;
  color: #fff;
  border-radius: 50%;
}
.btn-wrap{
	display: flex;
	justify-content: space-around;
}
.clear_btn {
  width: 50px;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  background-color: #FC4514;
  color: #fff;
  border: 0;
  outline: 0;
  margin: 5px 0 10px;
  border-radius: 4px;
  cursor: pointer;
}
.clear_btn.clear{
	background-color: #D8D8D8;
}
.nowDate i{
	border: 1px solid #FC4514;
	border-radius: 50%;
}
.month_wrap{
	width: 100%;
	height: 100%;
	background: #fff;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 9;
	padding: 70px 15px 0;
	box-sizing: border-box;
}
.year_wrap{
	z-index: 99;
}
.month_wrap li{
	float: left;
	width: 25%;
	line-height: 50px;
	margin-bottom: 20px;
	text-align: center;
	font-size: 14px;
}
.month_wrap li.active{
	background: #FC4514;
	color: #fff;
	border-radius: 4px;
}
.month_wrap li:hover{
	background: #e8e8e8;
	border-radius: 4px;
	color: #3F3F3F;
}
.month_wrap .arrow{
	width: 100%;
	margin-top: 22px;
	height: 30px;
	position: absolute;
	left: 0;
	top: 0;
	display: flex;
	justify-content: space-between;
	font-size: 16px;
}
.month_wrap .triangle_border_left{
	margin-left: 20px;
}
.month_wrap .triangle_border_right{
	margin-right: 20px;
}
</style>