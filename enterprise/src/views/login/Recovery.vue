<template>
    <div class="s-bg">
        <top-bar title="" :line="true"></top-bar>
        <div class="m-container">
            <div class="m-wrap">
                <div class="u-tt">{{$t('recovery.title')}}</div>
                <el-form :model="recoveryForm" :rules="rules" ref="recoveryForm">
                    <el-form-item prop="newPassword" :error="errors.backend">
                        <el-tooltip class="item" effect="dark" :content="$t('validate.pass.format')" placement="top-end" :disabled="passDisabled">
                            <el-input type="password" size="large" :placeholder="$t('recovery.newPass')" :maxlength="64" v-model="recoveryForm.newPassword" @focus="passDisabled = false" @blur = "passDisabled = true"></el-input>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item prop="checkPass">
                        <el-tooltip class="item" effect="dark" :content="$t('recovery.newPass.passAgain')" placement="top-end" :disabled ="newDisabled">
                            <el-input type="password" size="large" :placeholder="$t('recovery.newPass.confirm')" :maxlength="64" v-model="recoveryForm.checkPass" @focus="newDisabled = false" @blur = "newDisabled = true"></el-input>
                        </el-tooltip>
                    </el-form-item>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-button size="large" type="primary" @click="confirm" :disabled="isAble">{{$t('common.ok')}}</el-button>
                        </el-col>
                        <el-col :span="12">
                            <el-button size="large" @click="toLogin">{{$t('forget.back')}}</el-button>
                        </el-col>
                    </el-row>
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
import { GetRequest, GetErr } from '@/services/toolService'
import { validatePass } from '@/services/verificationService'
import {
    requestVldForgetPswCode, requestResettPsw
} from '../../api/login';
import md5 from 'md5'

export default {
    data() {
        const validatePassRep = (rule, value, callback) => {
            if (value != '' && value !== this.recoveryForm.newPassword) {
                callback(new Error(this.$t('validate.pass.confirm')));
            } else {
                callback();
            }
        }
        return {
            isAble: true,
            activeCode: null,
            passDisabled: true,
            newDisabled: true,
            errors: {
                backend: ''
            },
            recoveryForm: {
                newPassword: '',
                checkPass: ''
            },
            rules: {
                newPassword: [
                    { required: true, message: this.$t('validate.word.null'), trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { required: true, message: this.$t('validate.word.null'), trigger: 'blur' },
                    { validator: validatePassRep, trigger: 'blur' }
                ],
            }
        }
    },
    watch: {
        'recoveryForm': {
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
    created() {
        this.validateForgetPasswordActiveCode();
        this.enter()
    },
    methods: {
        confirm() {
            this.errors.backend = '';
            this.$refs.recoveryForm.validate((valid) => {
                if (valid) {
                    let params = {
                        newPassword: md5((this.recoveryForm.newPassword).trim()),
                        activeCode: this.activeCode
                    };
                    requestResettPsw(params, true, '')
                        .then(response => {
                            if (response.ret >= 0) {
                                this.$message({
                                    type: 'success',
                                    message: this.$t('recovery.success'),
                                    onClose: () => {
                                        this.$router.push('login')
                                    }
                                })
                            } else {
                                this.errors.backend = this.$t(GetErr(response))
                            }
                        })
                } else {
                    return false;
                }
            });
        },
        //激活码失效判断
        validateForgetPasswordActiveCode() {
            let Request = new GetRequest();
            let params = { activeCode: Request['activeCode'] };
            requestVldForgetPswCode(params, true, '')
                .then(response => {
                    if (response.ret < 0) {
                        this.$router.push({ path: '/enterprise/activate', query: { result: 'failure' } })
                    } else {
                        this.activeCode = Request['activeCode']
                    }
                })
        },
        toLogin() {
            this.$router.push('login')
        },
        //enter监听
        listener(e) {
            if (e) {
                var e = window.event ? window.event : e;
                if (e.keyCode == 13) {
                    this.confirm();
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