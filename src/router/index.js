/*import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';								  //登录
import Regist from '@/components/Regist';							  //注册
import Forget from '@/components/Forget';						      //忘记密码

import Home from '@/components/Home';								  //首页

import MyTeam from '@/components/MyTeam';						      //团队模块

import MyNews from '@/components/news/MyNews';						   //消息

import AccountParent from '@/components/account/AccountParent';		    //账号模块
import Account from '@/components/account/Account';						//账号模块
import Contact from '@/components/account/Contact';                     //联系人
import MyTemplate from '@/components/account/MyTemplate';               //模板管理

import BasicInfo from '@/components/account/BasicInfo';					//基础信息
import Certificate from '@/components/account/Certificate';				//企业验证
import GetApp from '@/components/account/GetApp';					    //下载app
import MyCertificate from '@/components/account/MyCertificate';		    //我的证书
import MyWallet from '@/components/account/MyWallet';		    		//我的钱包


import Package from '@/components/account/Package';                      		//套餐
import PackageList from '@/components/account/package/PackageList';        		//套餐
import UpGradePackage from '@/components/account/package/UpGradePackage';       //升级套餐
import ShoppingList from '@/components/account/package/ShoppingList';       //购物清单


import SignatureMGT from '@/components/account/SignatureMGT';            //签章管理
import AddSignature from '@/components/account/signature/AddSignature'; 
import SignatureList from '@/components/account/signature/SignatureList';

import Files from '@/components/files/Files';								 //文件模块
import FilesParent from '@/components/files/FilesParent';					 //文件模块
import Template from '@/components/files/Template';              			//合同模板
import TemplateDetail from '@/components/files/TemplateDetail';              //模板详情
import AddFileOne from '@/components/files/AddFileOne';                  //添加文件1 上传文件
import AddFileTwo from '@/components/files/AddFileTwo';                  //添加文件2 建立签署
import SignedFile from '@/components/files/SignedFile';					 //签署文件
import FileDetail from '@/components/files/FileDetail';					 //合同详情

import Privacy from '@/components/Privacy';								//隐私政策
import CommonPrivacy from '@/components/CommonPrivacy';								//隐私政策
//import demo from '@/components/demo';								//隐私政策*/


import Vue from 'vue';
import Router from 'vue-router';


const Login = resolve => require(['@/components/Login.vue'], resolve);
const Regist = resolve => require(['@/components/Regist.vue'], resolve);
const Forget = resolve => require(['@/components/Forget.vue'], resolve);

const Home = resolve => require(['@/components/Home.vue'], resolve);
const MyTeam = resolve => require(['@/components/MyTeam.vue'], resolve);
const MyNews = resolve => require(['@/components/news/MyNews.vue'], resolve);

const AccountParent = resolve => require(['@/components/account/AccountParent.vue'], resolve);
const Account = resolve => require(['@/components/account/Account.vue'], resolve);
const Contact = resolve => require(['@/components/account/Contact.vue'], resolve);
const MyTemplate = resolve => require(['@/components/account/MyTemplate.vue'], resolve);

const BasicInfo = resolve => require(['@/components/account/BasicInfo.vue'], resolve);
const Certificate = resolve => require(['@/components/account/Certificate.vue'], resolve);
const GetApp = resolve => require(['@/components/account/GetApp.vue'], resolve);
const MyCertificate = resolve => require(['@/components/account/MyCertificate.vue'], resolve);
const MyWallet = resolve => require(['@/components/account/MyWallet.vue'], resolve);

const Package = resolve => require(['@/components/account/Package.vue'], resolve);
const PackageList = resolve => require(['@/components/account/package/PackageList.vue'], resolve);
const UpGradePackage = resolve => require(['@/components/account/package/UpGradePackage.vue'], resolve);
const ShoppingList = resolve => require(['@/components/account/package/ShoppingList.vue'], resolve);

const SignatureMGT = resolve => require(['@/components/account/SignatureMGT.vue'], resolve);
const AddSignature = resolve => require(['@/components/account/signature/AddSignature.vue'], resolve);
const SignatureList = resolve => require(['@/components/account/signature/SignatureList.vue'], resolve);

const Files = resolve => require(['@/components/files/Files.vue'], resolve);
const FilesParent = resolve => require(['@/components/files/FilesParent.vue'], resolve);
const Template = resolve => require(['@/components/files/Template.vue'], resolve);
const TemplateDetail = resolve => require(['@/components/files/TemplateDetail.vue'], resolve);
const AddFileOne = resolve => require(['@/components/files/AddFileOne.vue'], resolve);
const AddFileTwo = resolve => require(['@/components/files/AddFileTwo.vue'], resolve);
const SignedFile = resolve => require(['@/components/files/SignedFile.vue'], resolve);
const FileDetail = resolve => require(['@/components/files/FileDetail.vue'], resolve);

const Privacy = resolve => require(['@/components/Privacy.vue'], resolve);
const CommonPrivacy = resolve => require(['@/components/CommonPrivacy.vue'], resolve);




Vue.use(Router)
let accountPaths = [
    	{
    		path: 'basicInfo',
   			name: 'basicInfo',
   			component: BasicInfo
    	},
    	{
    		path: 'signatureMGT',
   			name: 'signatureMGT',
   			component: SignatureMGT,
   			redirect: '/accountParent/account/signatureMGT/signatureList',
   			children:[
   				{
   					path: 'signatureList',
   					name: 'signatureList',
   					component: SignatureList
   				},{
   					path: 'addSignature',
   					name: 'addSignature',
   					component: AddSignature 
   				}
   			]
    	},
    	{
    		path: 'package',
   			name: 'package',
   			component: Package,
   			redirect: '/accountParent/account/package/packageList',
   			children:[{
   					path: 'upGradePackage',
		   			name: 'upGradePackage',
		   			component: UpGradePackage,
   			},{
   					path: 'packageList',
		   			name: 'packageList',
		   			component: PackageList,
   			},
   					
   			]
    	},
    	{
    		path: 'contact',
   			name: 'contact',
   			component: Contact
    	},
    	{
    		path: 'myTemplate',
   			name: 'myTemplate',
   			component: MyTemplate 
    	},
    	{
    		path: 'myWallet',
   			name: 'myWallet',
   			component: MyWallet 
    	},
    	
    	
    ];
    
    let files = [
    		{
	    		path: 'files/:id',
	   			name: 'files',
	   			component: Files,
	   			meta: {keepAlive: true} // 这个是需要keepalive的
	    	},
	    	{
				path: 'addFileOne/:id',
				name: 'addFileOne',
				component: AddFileOne,
				meta: {keepAlive: false} // 这个是不需要keepalive的
			},
			{
				path: 'addFileTwo/:id',
				name: 'addFileTwo',
				component: AddFileTwo,
				meta: {keepAlive: false} // 这个是需要keepalive的
			},
			{
				path: 'signedFile/:id',
				name: 'signedFile',
				component: SignedFile,
				meta: {keepAlive: false} // 这个是需要keepalive的
			},
			{
				path: 'fileDetail/:id',
				name: 'fileDetail',
				component: FileDetail,
				meta: {keepAlive: false} // 这个是需要keepalive的
			},
    		{
				path: 'template/:id',
				name: 'template',
				component: Template,
				meta: {keepAlive: true} // 这个是需要keepalive的
			},{
				path: 'templateDetail/:id',
				name: 'templateDetail',
				component: TemplateDetail,
				meta: {keepAlive: false} // 这个是需要keepalive的
			}
    ]

export default new Router(
	
{
  routes: [{
    path: '/filesParent',
    name: 'filesParent',
    component: FilesParent,
    redirect: '/filesParent/files/1',
    children:files
  }, {
  	path: '/accountParent',
    name: 'accountParent',
    redirect: '/accountParent/account/basicInfo',
    component: AccountParent,
    children:[
	    {
	    	path: 'account',
		    name: 'account',
		    component: Account,
		    redirect: '/accountParent/account/basicInfo',
		    children: accountPaths
	    },{
	    	path: 'certificate',
		    name: 'certificate',
		    component: Certificate,
	    },{
			path: 'getApp',
			name: 'getApp',
			component: GetApp
		},{
			path: "shoppingList/:id",
			name: 'shoppingList',
   			component: ShoppingList,
		},{
			path: "myCertificate",
			name: 'myCertificate',
   			component: MyCertificate,
		}
		
    ]
  },{
    path: '/home',
    name: 'home',
    component: Home
  }, {
    path: '/forget',
    name: 'forget',
    component: Forget
  }, {
    path: '/regist',
    name: 'regist',
    component: Regist
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/myTeam',
    name: 'myTeam',
    component: MyTeam
  },
  {
    path: '/myNews',
    name: 'myNews',
    component: MyNews
  },
  /*{
    path: '/',
    component: Privacy,
    name: 'privacy',
  },*/
  {
    path: '/privacy',
    name: 'privacy',
    component: Privacy 
  },
  {
    path: '/commonPrivacy',
    name: 'commonPrivacy',
    component: CommonPrivacy 
  },/*{
    path: '/demo',
    name: 'demo',
    component: demo
  },*/
  {
    path: '*',
    name: 'home',
    redirect: '/home'
  },
  /*{
    path: '/',
    name: 'privacy',
    redirect: '/'
  }*/
  ]
})
