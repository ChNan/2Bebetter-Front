import 'babel-polyfill' //兼容  ie9
//import './services/placeholders' //兼容 输入框placeholder （已修改源码请勿替换）

import Vue from 'vue'
import ElementUI from 'yl-element'
import App from './App'
import router from './router'
import store from './vuex/'
import Axios from './api/config'
import i18n from './i18n'
import TableBar from './components/common/TableBar'
Vue.use(ElementUI)
Vue.use(i18n)
Vue.use(Axios)
Vue.use(TableBar)

//设置vue的参数
Vue.config.productionTip = false
import './services/placeholder'//兼容 动态输入框placeholder
new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app');

document.title = Vue.t('title');
