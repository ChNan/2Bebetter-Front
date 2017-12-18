<template>
    <div class="s-bg">
        <top-bar title="" :line="true"></top-bar>
        <div class="m-container">
            <div class="m-wrap">
                <div class="u-tabs">
                    <div class="bar"></div>
                    <div class="item">
                        <a href="javascript:void(0)" class="active">{{$t('login.enterpriseLogin')}}</a>
                    </div>
                    <div class="item">
                        <a href="/meeting/login">{{$t('login.userLogin')}}</a>
                    </div>
                </div>
                <el-form :model="loginForm" :rules="rules" ref="loginForm">
                    <el-form-item prop="email" :error="errors.backend">
                        <el-input size="large" :placeholder="$t('login.email')" v-model="loginForm.email" :maxlength="128"></el-input>
                    </el-form-item>
                    <el-form-item prop="pass">
                        <el-input size="large" :placeholder="$t('login.pass')" type="password" :maxlength="64" v-model="loginForm.pass"></el-input>
                    </el-form-item>
                    <el-form-item prop="captcha" v-if="!!captchaImg" :error="errors.checkcode">
                        <el-input size="large" :placeholder="$t('login.captcha')" v-model="loginForm.captcha" :maxlength="4">
                            <template slot="append">
                                <div v-html="captchaImg" @click="getCaptcha" class="u-captcha"></div>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-button size="large" type="primary" @click="login">{{$t("login.login")}}</el-button>
                    <div class="m-menu"><!--隐藏注册按钮-->
                        <router-link style="display: none;" :to="{path:'/enterprise/register', query: {step: 'email'}}">{{$t("login.registered")}}</router-link>
                        <router-link :to="{name:'forget'}">{{$t("login.forget")}}</router-link>
                    </div>
                </el-form>
            </div>
        </div>
        <div class="m-footer">
            <span class="u-copyright">
                {{$t('login.copyright')}}
            </span>
        </div>
        <el-dialog class="dialog-error" :title="$t('login.dialog.tit')" :visible.sync="errors.show" top="30%">
            <p>{{$t('login.dialog.explain1')}}</p>
            <p>{{$t('login.dialog.explain2')}}</p>
            <div>
                <el-button class="dialog-button" size="large" type="primary" @click="errors.show = false;">{{$t('login.dialog.konw')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
@import "index";
</style>

<script>
import topBar from '@/components/common/TopBar'
import { GetErr } from '@/services/toolService'
import auth from '@/services/authService'
import md5 from 'md5'

import {
    requestCaptcha, requestLogin
} from '../../api/login'

export default {
    data() {
        return {
            captchaImg: null,
            errors: {
                backend: '',
                checkcode: '',
                show: false
            },
            loginForm: {
                email: '',
                pass: '',
                captcha: ''
            },
            rules: {
                email: [
                    { required: true, message: this.$t('validate.email.null'), trigger: 'blur' },
                    { type: 'email', message: this.$t('validate.email.format'), trigger: 'blur' }
                ],
                pass: [
                    { required: true, message: this.$t('validate.pass.null'), trigger: 'blur' }
                ],
                captcha: [
                    { required: true, message: this.$t('validate.captcha.null'), trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        if(auth.check()) {
            this.$router.push({ path: '/enterprise/dashboard'})
        }
        this.getCaptcha()
        this.enter()
        this.loginForm.email = localStorage.getItem('ENTERPRISE_USR')||'';
    },
    methods: {
        // 登录
        login() {
            this.errors.backend = '';
            this.errors.checkcode = '';
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    let params = {
                        username: (this.loginForm.email).trim(),
                        password: md5((this.loginForm.pass).trim()),
                        checkcode: (this.loginForm.captcha)
                    }
                    requestLogin(params, true, '')
                        .then(response => {
                            if (response.ret > 0) {
                                auth.login(response.data)
                                this.$router.push('/enterprise/dashboard')
                                localStorage.setItem('ENTERPRISE_USR',params.username);
                            } else {
                                this.loginForm.captcha = ''
                                this.getCaptcha()
                                if(response.data === 4){
                                    this.errors.show = true;
                                }
                                if(response.error && response.error.errorCode == 444) {
                                    this.errors.checkcode = this.$t(GetErr(response))
                                } else {
                                    this.loginForm.pass = ''
                                    this.errors.backend = this.$t(GetErr(response))
                                }
                            }


                        })
                } else {
                    return false;
                }
            });
        },
        // 验证码获取
        getCaptcha() {
            requestCaptcha({t : new Date().getTime()}, false)
                .then(response => {
                    if (response.ret > 0) {
                        this.captchaImg = response.data
                    } else if (response.ret === 0) {
                        this.captchaImg = null
                    }
                })
        },
        //enter监听
        listener(e) {
            if (e) {
                var e = window.event ? window.event : e;
                if (e.keyCode == 13) {
                    this.login();
                }
            }
        },
        enter() {
            document.addEventListener('keydown', this.listener);
        }
    },
    components: {
        topBar
    },
    destroyed: function() {
        document.removeEventListener('keydown', this.listener)
    }
}
</script>
