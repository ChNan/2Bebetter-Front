<template>
    <div>
        <conteol-list v-if="showMsg == 1" @intoControl="confControl"></conteol-list>
        <conf-detail v-if="showMsg == 2" :confNum="confNum"></conf-detail>
        <!--连接失败弹窗-->
        <el-dialog class="dialog-failed" :title="$t('controlDetail.notice')" :visible.sync="failed.show" :close-on-press-escape="false" :show-close="false" :close-on-click-modal="false">
            <p>{{$t('control.failure')}}</p>
            <div>
                <el-button class="dialog-button" size="large" type="primary" @click="failed.show = false; closeModal()">{{$t('controlDetail.confirm')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script type="es6">
import control from '@/services/meetingControl'
import conteolList from './controlList'
import confDetail from './Detail'
import auth from '@/services/authService'
import { Base64 } from 'js-base64'
import {
    getPsw, touch
} from '../../api/control';
export default {
    components: {
        conteolList,
        confDetail,
    },
    data() {
        return {
            showMsg: null,
            confNum: null,
            timeInt: null, //保活定时器
            failed: {
                show: false
            }
        }

    },
    watch: {
        '$route'(to, from) {
            if (this.$route.query.confNum) {
                this.showMsg = 2;
                this.confNum = this.$route.query.confNum;
            } else {
                this.showMsg = 1;
            }

        }
    },
    created: function() {
        this.connect();
        touch('', false, '');
        this.timeInt = setInterval(() => {
            touch('', false, '')
        }, 1000 * 60 * 10)
    },
    methods: {
        connect() {
            const username = auth.getUser().personal.username;
            const realm = auth.getUser().enterprise.realm;
            let ws_url;
            if (location.hostname == 'localhost') {
                ws_url = `ws://127.0.0.1:3000`
            } else if (location.protocol == 'http:') {
                ws_url = `ws://${location.host}/`
            } else if (location.protocol == 'https:') {
                ws_url = `wss://${location.host}/`
            }
            getPsw('', false, '')
                .then(response => {
                    if (response.ret >= 0) {
                        const psw = Base64.decode(response.data.psw);
                        const fs_url = response.data.fs_url;
                        control.connect({
                            username: username, //账号
                            password: psw, //密S码
                            domain: realm, //域名
                            wsServers: ws_url, //ws服务或者wss服务
                            outbound: fs_url //制定fs服务器ip，用于开发
                        }).then((val) => {
                            if (val) {
                                if (this.$route.query.confNum) {
                                    this.showMsg = 2;
                                    this.confNum = this.$route.query.confNum;
                                } else {
                                    this.showMsg = 1;
                                }
                            } else {
                                this.failed.show = true
                                console.log("connect fs failed");
                            }
                        }).catch((error) => {
                            this.failed.show = true
                            console.log("connect fs failed");
                        });
                    }
                })
        },
        confControl(num) {
            this.confNum = num;
            this.showMsg = 2;
        },
        closeModal() {
            this.$router.push({ path: '/meeting' })
        },
    },
    destroyed: function() {
        control.disconnect();
        clearInterval(this.timeInt);
    }
}
</script>

<style lang="scss" scoped>
.dialog-failed {
    width: 1000px;
    margin: auto auto;
    text-align: center;
}
</style>
