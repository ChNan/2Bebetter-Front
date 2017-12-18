import 'babel-polyfill' //兼容  ie9
import  './services/ie9Service'
import 'placekeeper'

import Vue from 'vue'
import ElementUI from 'yl-element'
import 'yl-element/lib/theme-default/index.css'
import App from './App'
import router from './router'
import store from './vuex/'
import Axios from './api/config'
import i18n from './i18n'
import $ from 'jQuery'
window.jQuery = $
window.$ = $
Vue.use(ElementUI)
Vue.use(i18n)
Vue.use(Axios)

//设置vue的参数
Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app');

document.title = Vue.t('title');
