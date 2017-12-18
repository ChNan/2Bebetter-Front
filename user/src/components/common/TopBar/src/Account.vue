<template>
    <span>
        <el-submenu index="2" class="f-fr">
            <template slot="title">
                <i class="iconfont icon-morentouxiangtubiao i-user" aria-hidden="true"></i>
                <span class="u-user">{{name || 'admin'}}</span>
            </template>
            <el-menu-item @click="setting" index="setting">
                <span>
                    <i class="iconfont icon-yzhanghao"></i>
                    {{$t("nav.setting")}}
                </span>
            </el-menu-item>
            <el-menu-item @click="logout" index="logout">
                <span>
                    <i class="iconfont icon-daoru"></i>
                    {{$t("nav.exit")}}
                </span>
            </el-menu-item>
        </el-submenu>
        <el-dialog :title="$t('nav.account.title')" v-model="dialogFormVisible">
            <el-form ref="userValid" label-width="180px" :model="user" style="padding-right:60px;">
                <el-form-item prop="name" :label="$t('common.label.name')" class="input-width" required>
                    <el-input v-model="user.name" :placeholder="$t('common.placeholder.charMax',{max:128})" :autofocus="true" :maxlength="128"></el-input>
                </el-form-item>
                <el-form-item prop="password" :label="$t('common.label.password')" required>
                    <el-input type="password" :placeholder="$t('common.placeholder.charMax',{max:32})" v-model="user.password" :maxlength="32"></el-input>
                </el-form-item>
                <el-form-item :label="$t('common.label.phone')">
                    <el-input v-model="user.phone" :maxlength="32"></el-input>
                </el-form-item>
                <el-form-item prop="email" :label="$t('common.label.email')" required>
                    <el-input v-model="user.email" :placeholder="$t('common.placeholder.charMax',{max:128})" :maxlength="128"></el-input>
                </el-form-item>
                <el-form-item prop="company" :label="$t('common.label.company')" required>
                    <el-input v-model="user.company" :maxlength="128" :value="user.company"></el-input>
                </el-form-item>
                <el-form-item prop="office" :label="$t('common.label.office')">
                    <el-input v-model="user.address" :maxlength="128"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="submitAdmin">{{$t('common.btnSubmit')}}</el-button>
                <el-button @click="dialogFormVisible = false">{{$t('common.btnCancel')}}</el-button>
            </div>
        </el-dialog>
    </span>
</template>

<script type="es6">
import auth from '@/services/authService'
import { setLang, languages } from '@/i18n/index'
import {
    requestLogout
} from '../../../../api/login'

export default {
    data() {
        return {
            languages,
            user: {
                username: '',
                name: '',
                phone: '',
                email: '',
                password: '',
                company: '',
                address: ''
            },
            form: {},
            dialogFormVisible: false,
            name: ''
        }
    },
    created() {
        if (sessionStorage.getItem('user')) {
            let userObj = JSON.parse(sessionStorage.user);
            this.name = userObj.personal.name
        }
    },
    methods: {
        /*
         * 修改用户信息
         * */
        submitAdmin() {
            this.$refs['userValid'].validate((valid) => {
                if (valid) {
                    this.dialogFormVisible = false;
                    this.$http.post('api/v1/manager/update', this.user).then((response) => {
                        if (response.data.ret >= 0) {
                            this.$message({
                                type: 'success',
                                message: this.$t('common.saveSuccess'),
                                onClose: () => {
                                    this.name = this.user.name
                                    sessionStorage.setItem('USER', JSON.stringify(this.user))
                                }
                            })
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        /*
         * 退出登录
         * */
        logout() {
            auth.logout()
            requestLogout('', true, 'error')
                .then(response => {
                    if (response.ret >= 0) {
                        this.$router.push('/meeting/login')
                    }
                })
        },

        /*
         * 弹框显示
         * */
        setting() {
           // this.dialogFormVisible = true;
           this.$router.push('/meeting/account')
        }
    }
}
</script>

<style lang="scss" scoped>
.i-user {
    font-size: 32px;
    float: left;
}

.u-user {
    float: left;
    margin-left: 15px;
}
</style>
