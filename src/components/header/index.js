import HeaderComponent from './Header.vue'
 
const Header = {
    install:function(Vue){
        Vue.component("v-header", HeaderComponent);
    }  
    //'Header'这就是后面可以使用的组件的名字，install是默认的一个方法
};

export default Header;

 
