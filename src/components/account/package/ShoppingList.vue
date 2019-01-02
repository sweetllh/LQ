<template>
	<div class="wrapper">
		<div class="list">
			<h4 class="title" @click="backOne"><img src="../../../assets/img/icon-left.png"/>购物清单</h4>
			<div class="tableWrap">
	          <table cellpadding="0" cellspacing="0">
	            <thead>
	              <tr>
	                <th>套餐类型</th>
	                <th>订单号</th>
	                <th>金额</th>
	              </tr>
	            </thead>
	            <tbody>
	              <tr>
	        		<td colspan="3" class="tableLoading" v-if="tableLoading">
	        			<img src="../../../assets/img/tableLoading.gif" width="20"/>
	      				<div>拼命加载中</div>
	        		</td>
            	  </tr>
	              <tr>
	                <td>{{setmeal}}</td>
	                <td>{{orderId}}</td>
	                <td>实付款：<i>￥{{amount}}</i></td>
	              </tr>
	            </tbody>
	
	          </table>
	          <!--<div class="data-none" v-if="!packageList.length && !tableLoading">{{dataNone}}</div>-->
            </div>
			
			<div class="pay">
				<p class="payStyle"><img src="../../../assets/img/wxlogo.png"/>微信支付</p>
				<div class="code">
					<img src="../../../assets/img/wei.png" />
				</div>
				<p>打开手机微信，扫码即可完成支付</p>
			</div>
		</div>
		
		 <!--alert弹窗-->
  		 <alert-dialog :is-show="isShowAlert" :alertCont="alertContent" type="default" 
  			@on-close="closeAlert"></alert-dialog>
		
	</div>
</template>

<script>
	export default{
		name:'shoppingList',
		components:{
			
		},
		data(){
			return{
				setmeal:'A套餐',
				orderId:'646375635348',
				amount:'0.00',
				isShowAlert: false,
      			alertContent: "",
      			dataNone: "暂无数据",
			}
		},
		methods:{
			backOne(){
				//this.$router.go(-1);
				this.$router.push({ path: "/accountParent/account/package/upGradePackage" });
			},
			closeAlert(){
		  		this.isShowAlert = false;
		  		this.alertContent = "";
		  	},
		},
	}
</script>

<style scoped>
	@import "../../../assets/css/table.css";
	.list{
		max-width: 970px;
		margin: 0 auto;
		padding: 90px 40px 0;
	}
	
	.title{
		font-weight: normal;
		font-size: 18px;
		color: #303030;
		cursor: pointer;
	}
	.title img{
		margin-right: 15px;
	}
	
	th{
		width: 30%;
	}
	th:first-child,td:first-child{
		width: 40%;
		padding-left: 10%;
	}
	td i{
		color: #FC4514;
		font-size: 20px;
	}
	.pay{
		text-align: center;
		margin-top: 24px;
	}
	.payStyle img{
		width: 35px;
		vertical-align: middle;
		margin-right: 9px;
	}
	.code{
		width: 160px;
		height: 160px;
		border: 1px solid #9D9D9D;
		border-radius:10px;
		padding: 10px;
		margin: 19px auto 23px;
	}
	.code img{
		width: 150px;
	}
	
</style>