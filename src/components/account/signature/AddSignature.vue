<template>
	<!--添加新签章-->
	<div class="addSign">
		<div class="inner draw">
			<canvas id="canvas" width="740" height="380"></canvas>
		</div>
		<div class="group_btn">
			<span class="clear"  v-on:click="clear">清除</span>
			<span class="use"  v-on:click="save">使用</span>
		</div>
		<!--<img v-bind:src="Url" alt="">-->
			
		<!--alert弹窗-->
  		<alert-dialog :is-show="isShowAlert" :alertCont="alertContent" :type="type" 
  			@on-close="closeAlert" @confirm="backFather"></alert-dialog>
	</div>
            

</template>


<script>
var draw;
class Draw {
    constructor(el) {
        this.canvas = document.getElementById(el);
		this.ctx = this.canvas.getContext("2d");
		this.ctx.fillStyle = "rgba(0,0,0,1)";
		var _this = this;
		/*this.canvas.onmousedown = function(e) {
			_this.downEvent(e)
		};
		this.canvas.onmousemove = function(e) {
			_this.moveEvent(e)
		};
		this.canvas.onmouseup = function(e) {
			_this.upEvent(e)
		};
		this.canvas.onmouseout = function(e) {
			_this.upEvent(e)
		};*/
		
		this.canvas.addEventListener("mousedown", function(e) {
			_this.downEvent(e)
		});
        this.canvas.addEventListener("mousemove", function(e) {
			_this.moveEvent(e)
		});
        this.canvas.addEventListener("mouseup", function(e) {
			_this.upEvent(e)
		})
        this.canvas.addEventListener("mouseout", function(e) {
			_this.upEvent(e)
		})
        
        //平板端
		this.canvas.addEventListener("touchstart", function(e) {
			_this.downEvent(e)
		});
        this.canvas.addEventListener("touchmove", function(e) {
			_this.moveEvent(e)
		});
        this.canvas.addEventListener("touchend", function(e) {
			_this.upEvent(e)
		})
		
		this.moveFlag = false;
		this.upof = {};
		this.radius = 0;
		this.has = [];
		this.lineMax = 7; //笔画最宽
		this.lineMin = 5; //笔画最细
		this.linePressure = 1;
		this.smoothness = 80;
    }
    //鼠标按下开始
	downEvent(e) {
		this.moveFlag = true;
		this.has = [];
		this.upof = this.getXY(e);
	}
	
	//鼠标移动开始绘制图片
	moveEvent(e) {
		if(!this.moveFlag)
			return;
		var of = this.getXY(e);
		var up = this.upof;
		var ur = this.radius;
		this.has.unshift({
			time: new Date().getTime(),
			dis: this.distance(up, of )
		});
		var dis = 0;
		var time = 0;
		for(var n = 0; n < this.has.length - 1; n++) {
			dis += this.has[n].dis;
			time += this.has[n].time - this.has[n + 1].time;
			if(dis > this.smoothness)
				break;
		}
		var or = Math.min(time / dis * this.linePressure + this.lineMin, this.lineMax) / 2;  
		this.radius = or;
		this.upof = of ;
		if(this.has.length <= 4)
			return;
		var len = Math.round(this.has[0].dis / 2) + 1;
		for(var i = 0; i < len; i++) {
			var x = up.x + ( of .x - up.x) / len * i;
			var y = up.y + ( of .y - up.y) / len * i;
			var r = ur + (or - ur) / len * i;
			this.ctx.beginPath();
			this.ctx.arc(x, y, r, 0, 2 * Math.PI, true);
			this.ctx.fill();
		}
	}
	
	//停止绘制
	upEvent(e) {
		this.moveFlag = false;
	}

	getXY(e) {
		e.preventDefault();
		var touch ;
        if(e.touches){
            touch = e.touches[0];
        }else {
            touch = e;
        }
		return {
			x: touch.clientX - this.canvas.offsetLeft + (document.body.scrollLeft || document.documentElement.scrollLeft),
			y: touch.clientY - this.canvas.offsetTop + (document.body.scrollTop || document.documentElement.scrollTop)
		}
		
		/*return {
			x: e.clientX - this.canvas.offsetLeft + (document.body.scrollLeft || document.documentElement.scrollLeft),
			y: e.clientY - this.canvas.offsetTop + (document.body.scrollTop || document.documentElement.scrollTop)
		}*/
	}

	distance (a, b) {
		var x = b.x - a.x,
			y = b.y - a.y;
		return Math.sqrt(x * x + y * y);
	}
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    save(){
         return this.canvas.toDataURL("image/png")
    }
}

export default {
  data() {
    return {
      userInfo: "",
      signList: [1], //签章列表
      Url:"",		//画板
      isShowAlert: false,
      alertContent: "",
      type: "",
    };
  },
  computed: {
      
    },
  watch: {
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem("LQUserInfo")) || false;
  },
  mounted() {
    draw = new Draw('canvas');
    document.querySelectorAll('html')[0].style="overflow: hidden";
  },
  destroyed() {
  	document.querySelectorAll('html')[0].style="overflow: auto";
  },
  methods: {
    closeAlert(){
  		this.isShowAlert = false;
  		this.alertContent = "";
  	},
    //清除画板
    clear(){
        draw.clear();
    },
    //保存画板
    save(){
        var data=draw.save();
        this.Url = data;
        var file1 = this.convertBase64UrlToBlob(data,'png');
        if(file1.size == 5736) return;    //没有画返回
        file1.name = "我的签章.png";
        var formData = new FormData();
        formData.append("file", file1, file1.name);
        //console.log(file1);
        this.addSign(formData);
    },
    //添加签章
    addSign(formData) {
      var _this = this;
      this.$axios({
        method: "post",
        url: _this.$link + "api/Signature/Upload ",
        headers: { 
        	"access-token": _this.userInfo.Token, 
//      	"Content-Type": "multipart/form-data",
        },
        data:formData
      })
        .then(res => {
        	//console.log(res.data)
          if (res.data.Code == 0) {
          	_this.type = "confirm";
          	_this.isShowAlert = true;
	        _this.alertContent = "添加签章成功";
            
          }else if (res.data.Code == 400) {
	          _this.$router.push({ path: "/login" });
	      }else{
          	_this.type = "defalut";
          	_this.isShowAlert = true;
	        _this.alertContent = res.data.Message;
          	//alert(res.data.Message)
          }
        })
        .catch(err => {
          //console.log(err);
          _this.type = "defalut";
          _this.isShowAlert = true;
	      _this.alertContent = "网络出错，请稍后再试";
        });
    },
    backFather(){
    	this.$router.push({path: "/accountParent/account/signatureMGT/signatureList"});
    },
   convertBase64UrlToBlob(urlData,type){
   		//console.log('urlData',urlData)
	    var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte
	    //处理异常,将ascii码小于0的转换为大于0
	    var ab = new ArrayBuffer(bytes.length);
	    var ia = new Uint8Array(ab);
	    for (var i = 0; i < bytes.length; i++) {
	        ia[i] = bytes.charCodeAt(i);
	    }
	    return new Blob( [ab] , {type : 'image/'+type});
	},
  },
  
  
  
};
</script>

<style scoped>
	@import '../../../assets/css/accountCommon.css';
	.draw{
		max-width: 740px;
		height: 380px;
		border: 1px solid #C5C5C5;
		padding: 10px 30px;
		overflow: hidden;
		margin: 0 auto;
	}
	.addSign img{
		display: block;
		height: 140px;
		width: auto;
		border: 1px solid #f00;
	}
	.group_btn{
		padding-top: 20px;
		text-align: center;
		cursor: pointer;
	}
	.group_btn span{
		display: inline-block;
		width: 60px;
		height: 30px;
		border: 1px solid #FC4514;
		line-height: 30px;
		font-size: 14px;
	}
	.group_btn .clear{
		color: #FC4514;
		margin-right: 27px;
	}
	.group_btn .use{
		color: #fff;
		background: #FC4514;
	}

	#canvas {  
		cursor: default; 
	}
	.hidden{
		visibility: hidden;
	}
	@media only screen and (max-width: 767px){
		.draw{
			height: 220px;
		}
	}
	
</style>

