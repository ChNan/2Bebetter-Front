<template>
    <div class="m-topbar">
        <el-menu :theme="theme||THEME" mode="horizontal" :router="false">
            
            <router-link to="/meeting" v-if="account"> <img class="u-logo" src="../../../../assets/img/logo.png"/></router-link>
            <a href="http://www.yealink.com" target="_blank" v-else><img class="u-logo" src="../../../../assets/img/logo.png"/></a>
            <span class="u-sep">{{isTitle ? '|' : ''}}</span>
            <label class="u-title" @click="goHome">{{title}}</label>
            <account v-if="account"></account>
            <el-submenu index="4" class="f-fr">
                <template slot="title">{{$t("common.currentLang")}}</template>
                <el-menu-item v-for="(language ,index) in languages" :key="index" @click="changeLang(language.lang)" index="index">
                    {{language.name}}
                </el-menu-item>
            </el-submenu>
        </el-menu>
        <span class="u-line" v-if="line"></span>
    </div>
</template>

<style lang="scss" scoped>
    .m-topbar {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;

        .u-logo {
            height: 22px;
            float: left;
            border: none;
            margin-top: 19px;
        }

        .u-sep {
            color: #fff;
            font-size: 18.5px;
            float: left;
            margin-top: 16px;
            margin-left: 10px;
        }

        .u-title {
            color: #fff;
            font-size: 18px;
            margin-left: 10px;
            float: left;
            margin-top: 19px;
            cursor: pointer;
        }

        .el-menu {
            padding: 0 20px;
        }

        .u-line {
            height: 1px;
            background-color: #fff;
            display: block;
            opacity: 0.1;
        }
    }

    @media screen and (max-width: 900px) {
        .u-sep, .u-title {
            display: none;
        }
    }
</style>

<script type="es6">

    /*
     * @theme，可选 主题的模式 glass:透明 (默认)，gradient:渐变
     * @title，可选 标题
     * @subtitle，可选 子标题
     * */
    import Account from './Account'
    import {setLang, languages} from '@/i18n/index'

    const THEME = "glass";
    export default {
        name: 'TopBar',
        components: {Account},
        props: ['theme', 'title', 'account', 'line'],
        data() {
            return {
                THEME,
                languages,
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
            goHome () {
                this.$router.push({path:'/meeting'})
            }
        }
    }
</script>
