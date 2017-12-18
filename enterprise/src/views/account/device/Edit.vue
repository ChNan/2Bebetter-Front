<style lang="scss">
.g-form {
    width: 80%;
    max-width: 820px;
    padding: 38px 0 20px 0;
    .layer {
        font-size: 12px;
        line-height: 1.33;
        color: #999999;
    }
    .el-form-item__label {
        padding-right: 15px;
    }
    .inline-item {
        .el-input {
            max-width: calc(100% - 92px);
        }
        .el-button {
            width: 80px;
            float: right;
        }
    }
}

.success {
    color: #40bd6f;
}
.message-alert i{
    display: inline-block;
    text-overflow: ellipsis;
    width: 65%;
    white-space: nowrap;
    word-break: break-all;
    max-width: 65%;
    overflow: hidden;
    text-align: right;
}
.message-alert {
    width: 100%;
    p {
        width: 90%;
        margin: 0 auto;
        text-align: left;
        span {
            color: #999999;
        }
        i {
            float: right;
            font-style: unset;
            color: #525252;
        }
    }
}
.item-pin{
    background-color: #eef1f6;
    cursor: text;
    border-radius: 4px;
    border: 1px solid #d1dae5;
    box-sizing: border-box;
    color: #bbb;
    font-size: 13px;
    height: 36px;
    line-height: 36px;
    outline: 0;
    padding: 0px 10px;
    width: 100%;
    display: block;
}
</style>
<style lang="scss" scoped="">
    .u-btn-group {
        min-width: 820px;
    }
    .form-group {
        min-width:820px;
    }
</style>
<template>
    <div class="g-bd">
        <!--页面头部-->
        <div class="g-hd">
            <h3 v-show="edit">{{$t('device.edit.editTitle')}}</h3>
            <h3 v-show="!edit">{{$t('device.edit.addTitle')}}</h3>
            <div class="btn-right" v-if="false">
                <el-button type="text" @click="goBack">
                    <i class="iconfont icon-fanhuishangyiji"></i>
                    {{$t('device.edit.back')}}
                </el-button>
            </div>
        </div>
        <div class="g-form  form-group">
            <el-form ref="form" :rules="rules" :model="device" label-width="180px">
                <el-form-item :label="$t('device.edit.name')" prop="name" required>
                    <el-input v-model="device.name" :maxlength="128"></el-input>
                </el-form-item>
                <el-form-item :label="$t('device.edit.extension')" prop="extension" required>
                     <el-input v-show="!edit" v-model="device.extension" :disabled="edit" :maxlength="4"></el-input>
                    <span class="item-pin" v-show="edit">{{device.extension}}</span>
                </el-form-item>
                <el-form-item :label="$t('device.edit.password')" v-show="edit">
                    <!-- <el-input :disabled="true" :maxlength="32" v-model="defaultPassWord.password"></el-input> -->
                    <span class="item-pin">{{defaultPassWord.password}}</span>
                </el-form-item>
                <el-form-item :label="$t('device.edit.pin')" v-show="edit">
                    <!-- <el-input :disabled="true" :maxlength="32" v-model="defaultPassWord.pin"></el-input> -->
                    <span class="item-pin">{{defaultPassWord.pin}}</span>
                </el-form-item>
                <el-form-item :label="$t('device.edit.email')" prop="email">
                    <el-input v-model="device.email" :maxlength="128"></el-input>
                    <label class="layer">{{$t('device.edit.email.info')}}</label>
                </el-form-item>
                <el-form-item label-width="180px" class="form-save-button u-btn-group">
                    <el-button type="warning" v-if="edit" @click="resetTextWord('password')">{{$t( 'device.edit.restPassword')}}</el-button>
                    <el-button type="warning" v-if="edit" @click="resetTextWord('pin')">{{$t( 'device.edit.restPin')}}</el-button>
                    <el-button type="primary" @click="sendInfo" v-if="edit" :disabled="!device.email">{{$t( 'device.edit.send')}}</el-button>
                    <el-button type="primary" @click="save(false)" :disabled="isAble">{{$t( 'device.edit.save')}}</el-button>
                    <el-button @click="goBack">{{$t( 'device.edit.cancel')}}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import * as api from '../../../api/account/device'
import { defaultsDeep } from 'lodash'
export default {
    data() {

        const showText = "******";

        const defaultDevice = {
            id: null,
            name: '',
            extension: '',
            email: ''
        }

        const defaultPassWord = {
            password: showText,
            pin: showText
        }

        //表单验证
        const rules = {
            name: [
                { required: true, message: this.$t('room.placeholder.name'), trigger: 'blur' },
                { min: 2, max: 128, message: this.$t('common.placeholder.length', { min: 2, max: 128 }), trigger: 'blur' }
            ],
            extension: [
                {
                    validator: (rule, value, callback) => {
                        if (!/^\d{4}$/.test(value)) {
                            callback(new Error(this.$t('room.placeholder.number')));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur'
                }
            ],
            email: [
                { type: 'email', message: this.$t('user.placeholder.email'), trigger: 'blur' }
            ],
        }

        return {
            rules,
            showText,
            defaultPassWord,
            device: Object.assign({}, defaultDevice),
            copyDevice: Object.assign({}, defaultDevice),
            //再做个页面
            messageAlert: (res) => {
                const h = this.$createElement;
                const createRow = rows => {
                    return rows.map(row => {
                        return h('p', null, [
                            h('span', null, `${row.label}：`),
                            h('i', null, res[row.value])
                        ])
                    })
                }

                this.$msgbox({
                    title: this.$t('user.message.ok'),
                    message: h('div', { class: 'message-alert' }, [
                        ...createRow([
                            { label: this.$t('user.table.account'), value: 'account' },
                            { label: this.$t('device.name'), value: 'name' },
                            { label: this.$t('user.table.password'), value: 'password' },
                            { label: this.$t('user.table.pin'), value: 'pin' },
                        ])
                    ]),
                    showConfirmButton: !!this.device.email,
                    showCancelButton: true,
                    confirmButtonText: this.$t('user.form.send'),
                    cancelButtonText: this.$t('user.form.ok'),
                    topIcon: 'iconfont icon-chenggongleitishi success mt20',
                    callback: action => {
                        if ("confirm" === action) { //else   cancel
                            this.sendAccountInfoMail();
                            this.$router.push('/enterprise/device')
                        } else {
                            this.$router.push('/enterprise/device')
                        }
                    }
                });
            }
        }
    },
    computed: {
        edit() {
            return !!this.$route.query.id
        },
        isAble() {
            return JSON.stringify(this.getWhiteSpace(this.copyDevice)) === JSON.stringify(this.getWhiteSpace(this.device));
        }
    },
    mounted() {
        if (this.edit) {
            api.getDevice({ id: this.$route.query.id }).then(json => {
                this.device = json.data
                this.copyDevice = defaultsDeep({}, this.device);
                if (!json.data.pin) {
                    this.defaultPassWord.pin = "";
                }
            })
        }
    },
    beforeRouteLeave(to, from, next) {
        if (!this.isAble&&this.edit) {
            this.$confirm(this.$t('popUpWindow.tipContent'), this.$t('popUpWindow.tip'), {
                confirmButtonText: this.$t('popUpWindow.confirm'),
                cancelButtonText: this.$t('popUpWindow.cancel')
            }).then(() => {
                this.save().then(_ => {
                    next();
                })
            }).catch(() => {
                next();
            });
        } else {
            next();
        }
    },
    methods: {
        getWhiteSpace(source) {
            let _source = defaultsDeep({}, source);
            for (let [key, value] of Object.entries(_source)) {
                if (source[key] && (Object.prototype.toString.call(source[key]) === "[object Object]" || Object.prototype.toString.call(source[key]) === "[object Array]")) {
                    this.getWhiteSpace(source[key]);
                } else {
                    if (value === undefined || value === null) {
                        _source[key] = '';
                    }
                }
            }
            return _source;
        },
        sendInfo() {
            this.$refs.form.validate( (valid) => {
                if (valid) {
                    if (!this.isAble) {
                        this.$confirm(this.$t('popUpWindow.tipContentSend'), this.$t('popUpWindow.tip'), {
                            confirmButtonText: this.$t('popUpWindow.confirm'),
                            cancelButtonText: this.$t('popUpWindow.cancel')
                        }).then(() => {
                            //确定执行
                            this.save(true);
                        }).catch(() => {
                            this.sendAccountInfoMail();

                        });
                    } else {
                        this.sendAccountInfoMail();
                    }
                } else {
                    return false
                }
            })
        },
        sendAccountInfoMail(_id) {
            api.sendMail({ id: _id || this.device.id }).then(sendJson => {
                if (sendJson.ret < 0) {
                    this.$message({
                        message: this.$t('user.message.send.fail'),
                        type: 'error'
                    })
                } else {
                    this.$message({
                        message: this.$t('user.message.send.ok'),
                        type: 'success'
                    })
                }
            })
        },
        resetTextWord(type) {
            let result = type === 'password' ? api.resetPassword({
                id: this.$route.query.id,
                account: this.device.account
            }) : api.resetPin({ id: this.$route.query.id });
            result.then(json => {
                if (json.ret >= 0) {
                    this.defaultPassWord[type] = json.data
                }
            })
        },
        message(m, t) {
            this.$message({
                message: this.$t(m) || this.$t('user.message.save.ok'),
                type: t || 'success',
                onClose: () => {

                }
            })
            this.$router.push('/enterprise/device')
        },
        goBack() {
            this.$router.push('/enterprise/device')
        },
        save(send) {
            return new Promise((resolve, reject) => {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        let { name, extension, email, id } = this.device
                        if (!email) email = null
                        let result = this.edit ? await api.editDevice({ id, name, email })
                            : await api.addDevice({ name, email, extension });
                        if (result.ret >= 0) {
                            if (!this.device.id) {
                                this.messageAlert(result.data);
                                this.device.id = result.data.id;//为了发送邮件
                            } else {
                                if (send) this.sendAccountInfoMail(this.device.id);
                                else   {
                                    this.$message({
                                        message: this.$t('user.message.save.ok'),
                                        type:  'success',
                                        onClose: () => {

                                        }
                                    })
                                }
                                resolve(result);
                            }
                            this.copyDevice = Object.assign({}, this.device);
                        } else {
                            resolve(result)
                        }
                    } else {
                        reject(false)
                        return false
                    }
                })
            })

        }
    }
}
</script>

