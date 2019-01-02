// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'
import "babel-polyfill";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
import '@/assets/css/basic.css';   
// require('!style-loader!css-loader!less-loader!./assets/css/basic.css');
import Header from './components/header/index.js';
import Dialog from './components/dialog/index.js';
import AlertDialog from './components/alertDialog/index.js';
Vue.use(ElementUI);
Vue.use(Header);
Vue.use(Dialog);
Vue.use(AlertDialog);

Vue.config.productionTip = false
router.afterEach((to,from,next) => {
  window.scrollTo(0,0);
})
Vue.prototype.$axios = Axios;
/*Vue.prototype.$link = 'http://140.143.94.179:80/';*/
Vue.prototype.$link = 'https://www.linkedsign.cn/server/';
//window.router=router;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to, from, next) => {
	//NProgress.start();
	let user = JSON.parse(sessionStorage.getItem("LQUserInfo"));
	//console.log(user,to.path)
	if (!user && to.path != '/login' && to.path != '/regist' && to.path != '/forget' && to.path != '/privacy') {
	    next({ path: '/login' })
	} else {
	    next()
	}
})
