
<template>
    <div class="g-mainc">
        <el-row class="m-cards">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :label="$t('account.changePwd')" name="first">
                    <el-form :model="pwdForm" ref="pwdForm" :rules="rules" :label-width="getWidth()" class="form-width" @keyup.native="getReal($event,'pwdForm')">

                        <el-form-item :label="$t('account.curpwd')" prop="oldPassword" required class="u-fm-label">

                            <el-input type="password" v-model="pwdForm.oldPassword" name="oldPassword" auto-complete="off" :minlength="8" :maxlength="64"></el-input>

                        </el-form-item>

                        <el-form-item :label="$t('account.newpwd')" prop="newPassword" required class="u-fm-label">
                            <el-tooltip :disabled="disabledNewPassword&&!pwdForm.newPassword" effect="dark" :content="$t('account.pass.format')" placement="top">
                                <el-input type="password" @focus="disabledNewPassword=false" @blur="disabledNewPassword=true" v-model="pwdForm.newPassword" name="newPassword" auto-complete="off" :minlength="8" :maxlength="64"></el-input>
                            </el-tooltip>
                        </el-form-item>

                        <el-form-item :label="$t('account.cormpwd')" prop="checkPass" required class="u-fm-label">

                            <el-input type="password" v-model="pwdForm.checkPass" name="checkPass" auto-complete="off" :minlength="8" :maxlength="64"></el-input>

                        </el-form-item>
                        <el-form-item label=" ">
                            <el-button type="primary" @click="changePwd">{{$t('common.ok')}}</el-button>

                            <el-button @click="cancel">{{$t('account.cancel')}}</el-button>

                        </el-form-item>

                    </el-form>

                </el-tab-pane>
                <el-tab-pane :label="$t('account.changeemal')" name="second">

                    <el-form label-width="130px" class="form-width" :rules="emailRules" :model="emailForm" ref="emailForm" @keyup.native="getReal($event,'emailForm')">

                        <el-form-item :label="$t('account.email')" required class="u-fm-label">
                            <el-input v-model="emailForm.curmail" :disabled="true" auto-complete="off" :maxlength="128"></el-input>

                        </el-form-item>

                        <el-form-item :label="$t('account.newMail')" required class="u-fm-label" prop="newmail">

                            <el-input v-model="emailForm.newmail" name="newmail" auto-complete="off" :maxlength="128"></el-input>

                        </el-form-item>

                        <el-form-item label=" ">

                            <el-button type="primary" @click="changeEmail">{{$t('common.ok')}}</el-button>

                            <el-button @click="cancel">{{$t('account.cancel')}}</el-button>

                        </el-form-item>

                    </el-form>
                </el-tab-pane>
            </el-tabs>

        </el-row>

    </div>
</template>
<style lang="scss">
.u-fm-label {
    .el-form-item__label {
        padding-right: 40px;
    }
}
</style>
<style lang="scss" scoped>
.form-width {
    width: 50%;
    min-width: 360px;
    margin-top: 20px;
}

.m-cards {
    border: 1px solid #d1dae5;
    border-radius: 4px;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}

.g-mainc {
    padding: 0 24px 0 24px;
    background: #f3f3f3;
    height: calc(100% - 60px);
}
</style>

<script>
import * as api from '../api/account/'
import md5 from 'md5'
import { capsLock } from '@/services/toolService'
import auth from '@/services/authService'
import {
    requestLogout
} from '../api/login'
let userLocal = null;
export default {
    name: 'account',
    data() {
        const validatePassRep = (rule, value, callback) => {

            if (value != '' && value !== this.pwdForm.newPassword) {

                callback(new Error(this.$t('account.difpwd')));

            } else {

                callback();

            }

        }
        const validateKong = (rule, value, callback) => {

            let rg = /\s+/g;

            if (rg.test(value)) {

                callback(new Error(this.$t('account.error.kong')));

            } else {

                callback();

            }

        }
        const validatePass = (rule, value, callback) => {

            let REG = /^(?![a-zA-Z]+$)(?!\d+$)(?![@*_\-.]+$)[a-zA-Z\d@*_\-.]+$/;
            let ieg = /[^a-zA-Z\d@*_\-.]/;
            if (ieg.test(value)) {

                callback(new Error(this.$t('account.pass.invalid')))

            } else if (!REG.test(value)) {

                callback(new Error(this.$t('account.twoword')));

            } else {

                callback();

            }
        }
        const validateEmail = (rule, value, callback) => {
            let REG_EMAIL = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            if (!this.isSetting) {
                if (!value) {
                    callback(new Error(this.$t('account.emailempty')));
                } else if (!REG_EMAIL.test(value)) {
                    callback(new Error(this.$t('account.enter.rightemail')));
                } else {
                    callback();
                }
            }
        }
        const defaultForm = {

            oldPassword: '',

            newPassword: '',

            checkPass: ''

        };
        const rules = {
            oldPassword: [
                {

                    required: true,

                    message: this.$t('account.enter.pwd'),

                    trigger: 'blur'

                }
            ],

            newPassword: [

                {

                    required: true,

                    message: this.$t('account.enter.pwd'),

                    trigger: 'blur'

                },

                {

                    min: 8,

                    message: this.$t('account.error.pwdlen8'),

                    trigger: 'blur'

                },
                {
                    validator: validateKong,
                    trigger: 'blur,change'

                },

                {

                    validator: validatePass,

                    trigger: 'blur'

                }

            ],

            checkPass: [

                { required: true, message: this.$t('account.error.emptypwd'), trigger: 'blur' },
                {
                    validator: validateKong,
                    trigger: 'blur,change'

                },

                { validator: validatePassRep, trigger: 'blur' }

            ]

        }
        return {
            rules,
            isSetting: true,
            activeName: 'first',
            pwdForm: Object.assign({}, defaultForm),
            emailForm: {
                curmail: '',
                newmail: ''
            },
            disabledNewPassword: true,
            emailRules: {
                newmail: [{ required: true, message: this.$t('account.enter.email'), trigger: 'blur' },
                { type: 'email', message: this.$t('account.enter.rightemail'), trigger: 'blur,change' }
                ]
            }
        }
    },
    created() {
        this.isEmail();

    },
    methods: {
        getWidth() {
            let lang = localStorage.getItem('LANGUAGE') || window.navigator.language || 'zh-CN';
            let obj = {
                'zh-CN': '130px',
                'en-US': '190px',
            }
            return obj[lang];
        },
        getReal(e, name) {
            this[name] = capsLock(e, this[name]);
        },
        isEmail() {
            userLocal = JSON.parse(sessionStorage.getItem('user'));
            this.emailForm.curmail = userLocal.personal.email;
            if (!this.emailForm.curmail) {
                this.emailForm.curmail = this.$t('account.noemail');
            } else {
                this.isSetting = false;
            }
        },
        handleClick() {
            if (this.activeName == 'first') {
                this.$refs.pwdForm.resetFields();
            }
            if (this.activeName == 'second') {

                this.$refs.emailForm.resetFields();
                this.isEmail();
            }
        },
        cancel() {
            this.$router.go(-1)
        },
        messagePop(message, type, cb) {

            this.$message({

                message: this.$t(message),

                type: type,

                onClose: () => {

                    typeof cb === 'function' && cb();

                }

            });

        },
        changePwd() {
            this.$refs.pwdForm.validate((valid) => {

                if (valid) {
                    let { oldPassword, newPassword } = this.pwdForm;
                    api.changePassword({ oldPassword: oldPassword, newPassword: newPassword }).then((res) => {
                        if (res.ret > -1) {
                            this.pwdForm = Object.assign({}, this.defaultForm);
                            this.messagePop(this.$t('account.hint.savesuccess'), 'success')
                            this.logout()
                        }

                    })

                } else {

                    return false;

                }

            });
        },
        changeEmail() {
            this.$refs.emailForm.validate((valid) => {
                if (valid) {
                    api.changeEmail({ email: this.emailForm.newmail })
                        .then((res) => {
                            //console.log(res)
                            if (res) {
                                userLocal.personal.email = this.emailForm.newmail;
                                sessionStorage.setItem('user', JSON.stringify(userLocal));
                                this.emailForm.curmail = this.emailForm.newmail;
                                this.emailForm.newmail = '';
                                this.messagePop(this.$t('account.hint.savesuccess'), 'success')
                            }
                        })

                } else {

                    return false;

                }

            });
        },
        logout() {
            auth.logout()
            requestLogout('', true, 'error')
                .then(response => {
                    if (response.ret >= 0) {
                        this.$router.push('/meeting/login')
                    }
                })
        },
    },
    destroyed() {
        userLocal = null;
    }
}
</script>

