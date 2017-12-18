<template>
    <div class="s-bg">
        <top-bar title="" :line="true"></top-bar>
        <div class="m-container">
            <div class="m-wrap">
                <div class="u-tt">{{$t("forget.pass")}}</div>
                <span class="u-tip">{{$t("forget.tip")}}</span>
                <el-form :model="forgetForm" :rules="rules" ref="forgetForm">
                    <el-form-item prop="email" :error="errors.backend">
                        <el-input size="large" :placeholder="$t('validate.email.null')" :maxlength="128" v-model="forgetForm.email"></el-input>
                    </el-form-item>
                    <el-form-item prop="captcha" :error="errors.checkcode">
                        <el-input size="large" :placeholder="$t('login.captcha')" v-model="forgetForm.captcha" :maxlength="4">
                            <template slot="append">
                                <div v-html="captchaImg" @click="getCaptcha" class="u-captcha"></div>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-button size="large" type="primary" @click="forgetPassword" :disabled="isAble">{{$t("common.ok")}}</el-button>
                    <router-link :to="{name:'login'}" class="u-back"><< {{$t("forget.back")}}</router-link>
                </el-form>
            </div>
        </div>
        <div class="m-footer">
            <span class="u-copyright">
                {{$t('login.copyright')}}
            </span>
        </div>
        <el-dialog title="" :visible.sync="dialogVisible" size="tiny" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" custom-class="wd400 forget">
            <i class="iconfont icon-chenggongleitishi"></i>
            <p class="tip">{{$t('forget.dialog.tip')}}</p>
            <p>{{$t('forget.dialog.explain',{email:forgetForm.email})}}</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="toLogin" type="primary">{{$t("forget.back")}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
@import "index";
</style>
<style lang="scss">
.s-bg {
    .forget {
        text-align: center;
        .iconfont {
            color: #40bd6f;
            font-size: 80px;
        }
        .tip {
            font-size: 20px;
            font-weight: bold;
            color: #000;
        }
        .desc {
            font-size: 14px;
        }
        .el-dialog__title {
            height: 0;
        }
    }
}
</style>

<script>
import topBar from '@/components/common/TopBar'
import { GetErr } from '@/services/toolService'
import {
    requestCaptcha, requestForgetPsw
} from '../../api/login';

export default {
    data() {
        return {
            captchaImg: null,
            isAble: true,
            dialogVisible: false,
            errors: {
                backend: '',
                checkcode: ''
            },
            forgetForm: {
                email: '',
                captcha: ''
            },
            rules: {
                email: [
                    { required: true, message: this.$t('validate.email.null'), trigger: 'blur' },
                    { type: 'email', message: this.$t('validate.email.format'), trigger: 'blur' }
                ],
                captcha: [
                    { required: true, message: this.$t('validate.captcha.null'), trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getCaptcha()
        this.enter()
    },
    watch: {
        'forgetForm': {
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
        }
    },
    methods: {
        forgetPassword() {
            this.errors.backend = '';
            this.$refs.forgetForm.validate((valid) => {
                if (valid) {
                    requestForgetPsw(this.forgetForm, true, '')
                        .then(response => {
                            if (response.ret >= 0) {
                                this.dialogVisible = true;
                            } else {
                                this.forgetForm.captcha = ''
                                this.getCaptcha()
                                if(response.error && response.error.errorCode == 444) {
                                    this.errors.checkcode = this.$t(GetErr(response))
                                } else {
                                    this.errors.backend = this.$t(GetErr(response))
                                }
                                
                            }
                        })
                } else {
                    return false;
                }
            });
        },
        toLogin() {
            this.$router.push('/enterprise/login')
        },
        // 验证码获取
        getCaptcha() {
            requestCaptcha({t : new Date().getTime()}, false)
                .then(response => {
                    if (response.ret >= 0) {
                        this.captchaImg = response.data
                    }
                })
        },
        //enter监听
        listener(e) {
            if (e) {
                var e = window.event ? window.event : e;
                if (e.keyCode == 13) {
                    this.forgetPassword();
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
