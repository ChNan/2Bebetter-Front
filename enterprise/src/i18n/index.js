import VueI18n from 'vue-i18n'
import enLocale from './el/en'
import zhLocale from './el/zh-CN'
import config from '@/i18n/config'

let Vue;

const userLanguage = localStorage.getItem('LANGUAGE') || (window.navigator.language==='zh-CN' ? 'zh-CN': 'en-US');

const plugin = function(_Vue) {
    Vue = _Vue;
    Vue.use(VueI18n)
    if (plugin.installed) {
        return;
    }
    plugin.installed = true;
    config.forEach((item) => {
        let _locale = {};
        _locale[item.lang] = {};
        item.resource.forEach(res => {
            let _lang = require(`${res}`);
            _locale[item.lang] = Object.assign(_locale[item.lang], _lang)
        })
        switch (item.lang) {
            case 'zh-CN':
                _locale[item.lang] = Object.assign(zhLocale, _locale[item.lang]);
                break;
            default:
                _locale[item.lang] = Object.assign(enLocale, _locale[item.lang]);
                break;
        }
        Vue.locale(item.lang, _locale[item.lang])
    });
    Vue.config.lang = userLanguage
}

export const t = key => {
    return Vue.t(key)
}

export const language = () => {
    return Vue.config.lang || localStorage.getItem('LANGUAGE') || (window.navigator.language==='zh-CN' ? 'zh-CN': 'en-US');
}

export const setLang = lang => {
    if (Vue.config.lang === lang) {
        return
    }
    localStorage.setItem('LANGUAGE', lang);
    // Vue.config.lang = lang
    self.location.reload()
        /* Vue.prototype.$http.post('/api/v1/set-language?language=' + lang).then(() => {

             // document.title = Vue.t('title')
         })*/
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

export const languages = config

export default plugin
