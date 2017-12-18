<template>
    <div id="body">
        <div class="s-signup">
            <top-bar title="" :line="true"></top-bar>
            <div class="m-container">
                <div class="m-wrap">
                    <div class="u-tt">{{$t('login.registered')}}</div>
                    <el-steps :space="250" :active="active" :align-center="true" :center="true">
                        <el-step :title="$t('register.step.first')"></el-step>
                        <el-step :title="$t('register.step.second')"></el-step>
                        <el-step :title="$t('register.step.third')"></el-step>
                    </el-steps>
                    <div class="step1" ref="step1" v-if="active == 1">
                        <div class="m-form" ref="form" v-if="sendSuccess == 0">
                            <el-form :model="applyForm" :rules="rules" ref="applyForm">
                                <el-form-item prop="email" :error="errors.backend">
                                    <el-input size="large" :placeholder="$t('login.email')" v-model="applyForm.email" :maxlength="128"></el-input>
                                </el-form-item>
                                <el-form-item prop="captcha" :error="errors.checkcode">
                                    <el-input size="large" :placeholder="$t('login.captcha')" v-model="applyForm.captcha" :maxlength="4">
                                        <template slot="append">
                                            <div v-html="captchaImg" @click="getCaptcha" class="u-captcha"></div>
                                        </template>
                                    </el-input>
                                </el-form-item>
                                <el-button size="large" type="primary" @click="send" :disabled="isAble">{{$t('register.step.next')}}</el-button>
                                <div class="login">
                                    <span>{{$t('register.account')}}</span>
                                    <router-link :to="{name:'login'}" class="u-back">{{$t('register.login')}}>>
                                    </router-link>
                                </div>
                            </el-form>
                        </div>
                        <div class="m-emailSucess" ref="emailSucess" v-if="sendSuccess == 1">
                            <p class="info">
                                <span :class = "{mLeft:lang == 'zh-CN'}">{{$t('register.email.send')}}</span>
                                <el-popover ref="popover1" placement="top-start" trigger="hover" :content="applyForm.email"></el-popover>
                                <span class="email" v-popover:popover1>{{applyForm.email}}</span>

                            </p>
                            <p class="desc">{{$t('register.email.explain')}}</p>
                            <br>
                            <el-popover ref="popover" placement="bottom" trigger="hover">
                                <ul class="emailPop">
                                    <li>
                                        {{$t('register.email.check')}}
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)" @click="resendApplyMail">{{$t('register.email.resend')}}</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)" @click="changeEmail">{{$t('register.email.change')}}</a>
                                    </li>
                                </ul>
                            </el-popover>
                            <a v-popover:popover href="javascript:void(0)">{{$t('register.email.notReceived')}}</a>
                        </div>
                    </div>
                    <div class="step2" ref="step2" v-if="active == 2">
                        <div class="m-info" ref="info">
                            <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="15px">
                                <el-form-item prop="name" label=" ">
                                    <el-input size="large" :placeholder="$t('register.info.name')" :maxlength="128" v-model="infoForm.name"></el-input>
                                </el-form-item>
                                <el-form-item prop="password" label=" ">
                                    <el-tooltip class="item" effect="dark" :content="$t('validate.pass.format')" placement="top-end" :disabled="passDisabled">
                                        <el-input size="large" type="password" :placeholder="$t('register.info.pass')" :maxlength="64" v-model="infoForm.password" @focus="passDisabled = false" @blur = "passDisabled = true"></el-input>
                                    </el-tooltip>
                                </el-form-item>
                                <el-form-item prop="checkPass" label=" ">
                                    <el-tooltip class="item" effect="dark" :content="$t('register.info.passAgain')" placement="top-end" :disabled ="newDisabled">
                                        <el-input size="large" type="password" :placeholder="$t('register.info.confirmPass')" :maxlength="64" v-model="infoForm.checkPass" @focus="newDisabled = false" @blur = "newDisabled = true"></el-input>
                                    </el-tooltip>
                                </el-form-item>
                                <el-form-item prop="country" label=" ">
                                    <el-select v-model="infoForm.country" :placeholder="$t('register.info.country')" style="width:100%">
                                        <el-option v-for="(item,index) in country" :label="$t(item.twoLetter)" :key="index" :value="item.twoLetter"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item prop="size" label=" ">
                                    <el-select v-model="infoForm.size" :placeholder="$t('register.info.scale')" style="width:100%">
                                        <el-option v-for="(item,index) in size" :label="item.label" :key="index" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item prop="phoneNo" label=" ">
                                    <el-input size="large" :placeholder="$t('register.info.contact')"  :maxlength="64" v-model="infoForm.phoneNo"></el-input>
                                </el-form-item>
                            </el-form>
                            <el-button size="large" type="primary" @click="register">{{$t('register.info.submit')}}</el-button>
                        </div>
                    </div>
                    <div class="step3" ref="step3" v-if="active == 3">
                        <div class="m-sucess" ref="sucess">
                            <p class="info">{{$t('register.success.info')}}
                                <span>{{number}}</span>
                            </p>
                            <p class="desc">{{time}}s {{$t('register.success.desc')}}</p>
                            <el-button size="large" type="primary" @click="login">{{$t('register.success.login')}}</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="m-footer">
                <span class="u-copyright">
                    {{$t('login.copyright')}}
                </span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "index";
</style>

<style lang="scss" scoped>
.emailPop {
    margin: 0;
    height: 78px;
    font-size: 14px;
    line-height: 26px;
    a {
        color: #2699f4;
        &:hover {
            color: #51adf6;
        }
    }
}
</style>

<script>
import topBar from '@/components/common/TopBar'
import { GetRequest, GetErr } from '@/services/toolService'
import { validatePass } from '@/services/verificationService'
import {
    requestCaptcha, requestApply, requestCountry, requestVldApplyPswCode, requestActive, requestResend
} from '../../api/login';
import md5 from 'md5'
import { language } from '@/i18n/index'

export default {
    data() {
        const validatePassRep = (rule, value, callback) => {
            if (value != '' && value !== this.infoForm.password) {
                callback(new Error(this.$t('validate.pass.confirm')));
            } else {
                callback();
            }
        }
        return {
            active: 1, //步骤
            captchaImg: null,
            sendSuccess: 0, //邮箱发送成功为1
            isAble: true,
            isAbleRg: true,
            country: null, //国家列表
            time: 10, //倒计时
            number: null,
            passDisabled: true,
            newDisabled: true,
            errors: {
                backend: '',
                checkcode: ''
            },
            applyForm: {
                email: '',
                captcha: ''
            },
            infoForm: {
                name: '',
                password: '',
                checkPass: '',
                country: '',
                size: null,
                phoneNo: '' || null,
                id: null, //企业id
                activeCode: null//邮箱激活码
            },
            size: [
                {
                    label: '1~50' + this.$t('enterprise.person'),
                    value: '50'
                },
                {
                    label: '50~100' + this.$t('enterprise.person'),
                    value: '100'
                },
                {
                    label: '100~200' + this.$t('enterprise.person'),
                    value: '200'
                },
                {
                    label: '200~500' + this.$t('enterprise.person'),
                    value: '500'
                },
                {
                    label: '500~1000' + this.$t('enterprise.person'),
                    value: '1000'
                },
                {
                    label: '1000~2000' + this.$t('enterprise.person'),
                    value: '2000'
                },
                {
                    label: this.$t('enterprise.person.up', {number: '2000'}),
                    value: '0'
                }
            ],
            rules: {
                email: [
                    { required: true, message: this.$t('validate.email.null'), trigger: 'blur' },
                    { type: 'email', message: this.$t('validate.email.format'), trigger: 'blur' }
                ],
                captcha: [
                    { required: true, message: this.$t('validate.captcha.null'), trigger: 'blur' }
                ],
                name: [
                    { required: true, message: this.$t('validate.word.null'), trigger: 'blur' }
                ],
                password: [
                    { required: true, message: this.$t('validate.word.null'), trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { required: true, message: this.$t('validate.word.null'), trigger: 'blur' },
                    { validator: validatePassRep, trigger: 'blur' }
                ]
            },
            language: 'en-US'
        }
    },
    watch: {
        'applyForm': {
            deep: true,
            handler: function(value) {
                for (let name of Object.keys(value)) {
                    if (value[name] == '') {
                        this.isAble = true;
                        return;
                    }
                }
                this.isAble = false;
            }
        },
        'infoForm': {
            deep: true,
            handler: function(value) {
                for (let name of Object.keys(value).slice(0, 3)) {
                    if (value[name] == '') {
                        this.isAbleRg = true;
                        return;
                    }
                }
                this.isAbleRg = false;
            }
        }
    },
    created() {
        let step = this.$route.query.step;
        if (step === "email") {
            this.active = 1;
            this.getCaptcha()
        } else if (step === "info") {
            let Request = new GetRequest();
            this.infoForm.activeCode = Request['activeCode'];
            this.infoForm.id = Request['id'];
            this.active = 2;
            this.validateApplyActiveCode();
            this.getCountry()
        } else if (step === "success") {
            this.active = 3;
            this.number = this.$route.query.number;
            let timer = setInterval(() => {
                this.time -= 1;
                if (this.time === 0) {
                    clearInterval(timer)
                    this.login()
                }
            }, 1000)
        }
        this.lang = language();
    },
    methods: {
        //发送邮件到企业邮箱
        send() {
            this.errors.backend = '';
            this.errors.checkcode = '';
            this.$refs.applyForm.validate((valid) => {
                if (valid) {
                    requestApply(this.applyForm, false, '')
                        .then(response => {
                            if (response.ret >= 0) {
                                this.sendSuccess = 1;
                            } else {
                                if (response.error.errorCode == 409) {
                                    this.resendApplyMail();
                                    this.sendSuccess = 1;
                                } else {
                                    this.applyForm.captcha = ''
                                    this.getCaptcha()
                                    if(response.error && response.error.errorCode == 444) {
                                        this.errors.checkcode = this.$t(GetErr(response))
                                    } else {
                                        this.errors.backend = this.$t(GetErr(response))
                                    }
                                }
                            }
                        })
                } else {
                    return false;
                }
            });
        },
        register() {
            this.$refs.infoForm.validate((valid) => {
                if (valid) {
                    let params = Object.assign({}, this.infoForm);
                    params.password = md5(this.infoForm.password);
                    params.checkPass = md5(this.infoForm.checkPass);
                    requestActive(params, true, 'error')
                        .then(response => {
                            if (response.ret >= 0) {
                                location.href=`/enterprise/register?step=success&number=${response.data.number}`
                            }
                        })
                } else {
                    return false;
                }
            });
        },
        login() {
            this.$router.push('login')
        },
        // 更换邮箱
        changeEmail() {
            this.applyForm.email = '';
            this.applyForm.captcha = '';
            this.sendSuccess = 0;
            this.getCaptcha();
        },
        // 重新发送邮件
        resendApplyMail() {
            requestResend(this.applyForm, true, 'error')
                .then(response => {
                    if (response.ret >= 0) {
                        this.$message({
                            type: 'success',
                            message: this.$t('register.email.success')
                        })
                    }
                })
        },
        // 验证码获取
        getCaptcha() {
            requestCaptcha({t : new Date().getTime()}, false, '')
                .then(response => {
                    if (response.ret >= 0) {
                        this.captchaImg = response.data
                    }
                })
        },
        // 获取定位国家列表
        getCountry() {
            requestCountry('', false, '')
                .then(response => {
                    if (response.ret >= 0) {
                        this.country = response.data.list;
                        if (response.data.default) {
                            this.infoForm.country = response.data.default;
                        } else {
                            this.infoForm.country = 'CN';
                        }
                    }
                })
        },
        //激活码失效判断
        validateApplyActiveCode() {
            let Request = new GetRequest()
            let params = {
                id: this.infoForm.id,
                activeCode: this.infoForm.activeCode
            }
            requestVldApplyPswCode(params, false, '')
                .then(response => {
                    if (response.ret < 0) {
                        this.$router.push({ path: '/enterprise/activate', query: { result: 'failure' } })
                    }
                })
        },
    },
    components: {
        topBar
    }
}
</script>
