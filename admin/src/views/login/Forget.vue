<template>
    <div class="g-main">
        <top-bar :line="true" theme="glass"> </top-bar>
        <div class="m-container">
            <div class="m-wrap">
                <div class="u-tt">{{$t("forget.pass")}}</div>
                <span class="u-tip">{{$t("forget.tip")}}</span>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                    <el-form-item prop="account" :error="errors.backend">
                        <el-input size="large" :placeholder="$t('login.account')" v-model="ruleForm.account"></el-input>
                    </el-form-item>
                    <el-form-item prop="email">
                        <el-input size="large" :placeholder="$t('forget.email')" v-model="ruleForm.email"></el-input>
                    </el-form-item>
                    <el-form-item prop="captcha">
                        <el-input size="large" :placeholder="$t('login.captcha')" v-model="ruleForm.captcha">
                            <template slot="append">
                                <div v-html="captchaImg" @click="getCaptcha" class="u-captcha"></div>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-button size="large" type="primary" @click="login">{{$t("common.ok")}}</el-button>
                    <router-link :to="{name:'login'}" class="u-back">{{$t("forget.back")}}</router-link>
                </el-form>
            </div>
        </div>
        <div class="m-footer">
            <span class="u-copyright">
                {{$t('login.copyright')}}
            </span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "index";
</style>

<script>
    import topBar from '@/components/common/TopBar'
    import {setLang, languages} from '@/i18n/index'
    import {
        requestCaptcha
    } from '../../api/login';

    export default {
        data() {
            var validateEmail = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入邮箱'));
                } else {
                    //正则密码
                    callback();
                }
            };
            var validateCaptcha = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入验证码'));
                } else {
                    //正则验证码
                    callback();
                }
            };
            return {
                captchaImg: null,
                errors: {
                    backend: ''
                },
                ruleForm: {
                    account: '',
                    email: '',
                    captcha: ''
                },
                rules: {
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'}
                    ],
                    email: [
                        {validator: validateEmail, trigger: 'blur'}
                    ],
                    captcha: [
                        {validator: validateCaptcha, trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.getCaptcha()
        },
        mounted() {
            $('input, textarea').placeholder();
        },
        methods: {
            login() {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
//                        sessionStorage.setItem('token', 'test')
//                        this.$router.push('index')
                        this.errors = {backend: '后台异常信息'}
                    } else {
                        return false;
                    }
                });
            },
            getCaptcha(){
                requestCaptcha({t : new Date().getTime()}, false)
                    .then(response => {
                        this.captchaImg = response
                    })
            }
        },
        components: {
            topBar
        }
    }
</script>
