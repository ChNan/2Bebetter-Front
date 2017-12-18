<template>
    <div class="g-main">
        <top-bar :line="true" theme="glass"> </top-bar>
        <div class="m-container">

            <div class="m-wrap">
                 <div class="u-tt">欢迎登录</div>
                <el-form :model="loginForm" :rules="rules" ref="loginForm" @keyup.native="getReal($event)">
                    <el-form-item prop="account" :error="errors.backend">
                        <el-input size="large" :placeholder="$t('login.account')" name="account" v-model="loginForm.account" :maxlength="128"></el-input>
                    </el-form-item>
                    <el-form-item prop="pass">
                        <el-input size="large" :placeholder="$t('login.pass')" name="pass" type="password"  :maxlength="64" v-model="loginForm.pass"></el-input>
                    </el-form-item>
                    <el-form-item prop="captcha" v-if="captchaImg" :error="errors.checkcode">
                        <el-input size="large" :placeholder="$t('login.captcha')" v-model="loginForm.captcha" :maxlength="4">
                            <template slot="append">
                                <div v-html="captchaImg" @click="getCaptcha" class="u-captcha"></div>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-button size="large" type="primary" @click="login">{{$t("login.login")}}</el-button>
                    <!-- <div class="m-menu">
                        <el-checkbox>{{$t("login.remember")}}</el-checkbox>
                        <router-link :to="{name:'forget'}">{{$t("login.forget")}}</router-link>
                    </div> -->
                </el-form>
            </div>
        </div>
        <div class="m-footer">
            <span class="u-copyright">
                {{$t('login.copyright')}}
            </span>
        </div>
        <el-dialog class="dialog-error" :title="'提示'" :visible.sync="errors.show" top="30%">
            <p>您已输入4次错误密码，</p>
            <p>超过10次后该帐号将被锁定5分钟。</p>
            <div>
                <el-button class="dialog-button" size="large" type="primary" @click="errors.show = false;">知道了</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
@import "index";
</style>

<script>
import topBar from '@/components/common/TopBar'
import { GetErr, capsLock } from '@/services/toolService'
import auth from '@/services/authService'
import md5 from 'md5'
import { setLang, languages } from '@/i18n/index'
import {
    requestCaptcha, requestLogin
} from '../../api/login';

export default {
    data() {
        	const validateKong = (rule, value, callback) => {
            let rg = /\s+/g;
            if (rg.test(value)) {
                callback(new Error(this.$t('account.error.kong')));
            } else {
                callback();
            }
        }
        return {
            captchaImg: null,
            errors: {
                backend: '',
                checkcode: '',
                show: false
            },
            loginForm: {
                account: '',
                pass: '',
                captcha: ''
            },
            rules: {
                account: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                ],
                pass: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],
                captcha: [
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        if(auth.check()) {
            this.$router.push({ path: '/admin/enterprise'})
        }
        this.getCaptcha()
        this.enter()
        this.loginForm.email = localStorage.getItem('ADMIN_USR')||'';
    },
    mounted(){
        $('input, textarea').placeholder();
    },
    methods: {
        getReal(e){
         this.loginForm = capsLock(e,this.loginForm)
        },
        // 登录
        login() {
            this.errors.backend = '';
            this.errors.checkcode = '';
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    let params = {
                        username: (this.loginForm.account).trim(),
                        password: md5((this.loginForm.pass).trim()),
                        checkcode: this.loginForm.captcha
                    }
                    requestLogin(params, true, '')
                        .then(response => {
                            if (response.ret > 0) {
                                auth.login(response.data)
                                this.$router.push('enterprise')
                                localStorage.setItem('ADMIN_USR',params.username);
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
