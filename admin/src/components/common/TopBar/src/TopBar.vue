<template>
    <div class="m-topbar">
        <el-menu :theme="theme||THEME" mode="horizontal" :router="false" @select="handleSelect">
            <router-link to="/admin/enterprise" v-if="account">
            <img class="u-logo" src="../../../../assets/img/logo.png" />
            <span class="u-sep">{{isTitle ? '|' : ''}}</span>
            <label class="sys-title">{{title}}</label>
            </router-link>
             <a href="http://www.yealink.com" target="_blank" v-else><img class="u-logo" src="../../../../assets/img/logo.png"/></a>
           
            <!-- <account v-if="account"></account> -->
            <!-- 采用路由方式而非弹窗 -->
            <el-submenu index="2" class="f-fr account" v-if="account">
                <template slot="title">
                    <i class="iconfont icon-morentouxiangtubiao i-user" aria-hidden="true"></i>
                    <span class="name">{{username}}</span>
                </template>
                <el-menu-item index="account">
                    <i class="iconfont icon-yzhanghao"></i>
                    {{$t('nav.setting')}}
                </el-menu-item>
                <el-menu-item @click="logout" index="logout">
                    <i class="iconfont icon-web-quit"></i>
                    {{$t('nav.exit')}}
                </el-menu-item>
            </el-submenu>
             <el-submenu index="4" class="f-fr">
                <template slot="title">{{$t(language)}}</template>
                <el-menu-item v-for="(language ,index) in languages" :key="index" @click="changeLang(language.lang)" index="index">
                    {{language.name}}
                </el-menu-item>
            </el-submenu> 
        </el-menu>
        <span class="u-line" v-if="line"></span>
    </div>
</template>

<style lang="scss" scoped>

</style>

<script>
/*
* @theme，可选 主题的模式 glass:透明 (默认)，gradient:渐变
* @title，可选 标题
* @subtitle，可选 子标题
* */
import auth from '@/services/authService'
import { setLang, languages, language } from '@/i18n/index'
import {
    requestLogout
} from '../../../../api/login'

const THEME = "dark";

export default {
    name: 'TopBar',
    props: ['theme', 'title', 'account', 'line'],
    data() {
        return {
            THEME,
            languages,
            language: language(),
            username: 'yealink'
        }
    },
    computed: {
        isTitle() {
            return this.title;
        }
    },
    methods: {
        changeLang(lang) {
            setLang(lang);
        },
        handleSelect(index) {
            if (index == 'account') {
                this.$router.push('/admin/account')
            }
        },
        /*
        * 退出登录
        * */
        logout() {
            auth.logout();
            this.$router.push('/admin/login')
            requestLogout('', true, 'error')
                .then(response => {
                    if (response.ret >= 0) {
                       // this.$router.push('/admin/login')
                    }
                })
        },

    }
}
</script>
