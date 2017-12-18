<template>
    <div id="invitation-wrapper">
        <el-tabs v-model="activeName">
            <!-- contacts invite start -->
            <el-tab-pane class="contacts" :label="$t( 'controlDetail.contact')" name="invitePerson">
                <el-row class="pd-b-2em">
                    <el-col :span="24">
                        <transfer ref="memberTransfer" v-model="selectedInvitedArr" :data="memberList" type="STAFF" iconSkinField="type" ></transfer>
                    </el-col>
                </el-row>
                <el-col>
                    <div class="f-tac btns">
                        <el-button class="dialog-button" :disabled="(this.$refs.memberTransfer && this.$refs.memberTransfer.getChecked().length <= 0)" size="large" type="primary" @click="sendInvitation">{{$t( 'controlDetail.invite')}}</el-button>
                        <el-button class="dialog-button-two" size="large" @click="invitationData.isShowInvitationDataDialog = false">{{$t( 'controlDetail.cancel')}}</el-button>
                    </div>
                </el-col>
            </el-tab-pane>
            <!-- contacts invite end -->

            <!-- invite Room System  start -->
            <el-tab-pane class="room-system" custom-class="invite-pd20" :label="$t( 'controlDetail.h323Sip')" name="inviteRoom">
                <div class="dialog-invited-room">
                    <p v-if="isCalling" class="calling">{{$t( 'controlDetail.calling')}}</p>
                    <p v-if="isFailure" class="call-fail">{{$t( 'controlDetail.callFailure')}}</p>
                    <p>{{$t( 'controlDetail.callH323Sip')}}</p>
                    <div class="f-fl select-options">
                        <el-select v-model="typeSelected" @change="typeSelectedChange">
                            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div class="f-fl input-value">
                        <el-input v-model="typeValue" :placeholder="inputPlaceholder" :maxlength="128"></el-input>
                    </div>
                    <el-col class="bottom">
                        <div class="btns">
                            <el-button class="dialog-button" size="large" type="primary" :disabled="isCalling || typeValue==''" @click="callRoom">{{$t( 'controlDetail.call')}}</el-button>
                            <el-button class="dialog-button-two" size="large" @click="invitationData.isShowInvitationDataDialog = false">{{$t( 'controlDetail.cancel')}}</el-button>
                        </div>
                    </el-col>
                </div>
            </el-tab-pane>
            <!-- invite Room System  end -->

            <!-- email invite start -->
            <el-tab-pane class="email-invite" custom-class="invite-pd20" :label="$t( 'controlDetail.email')" name="inviteEmail">
                <div class="invite-email-tip" v-show="true">
                    <div id="invite_a_remind" class="email-tip">
                        {{$t( 'controlDetail.uninstallTip')}}
                    </div>
                </div>
                <!-- outer border start -->
                <div class="dialog-invited-email">
                    <div class="dialog-invited-content">
                        <a class="invite_a" target="_top" @mouseenter=" hoverEvent" @mouseout="hoverEventOut" @click="openLocalEmail">{{$t( 'controlDetail.local')}}</a>
                        <a class="invite_b" @click="linkToEmail">{{$t( 'controlDetail.system')}}</a>
                    </div>
                </div>
                <!-- outer border end -->
                <div class="btn-padding-email f-tac">
                    <el-button id="btn_clipboard"  class="dialog-button-two btn_clipboard  " size="large" @click="copyMsg" >{{$t( 'controlDetail.copymsg')}}</el-button>
                    <el-button class="dialog-button-two" style="padding-left: 3em;padding-right: 3em" size="large" @click="invitationData.isShowInvitationDataDialog = false">{{$t( 'controlDetail.cancel')}}</el-button>
                </div>
            </el-tab-pane>
            <!-- email invite end -->
        </el-tabs>
    </div>
</template>
<script type="es6">
import * as api from '../../../../api/control/'
import control from '@/services/meetingControl'
import { reqPersonList } from "@/api/reservation/"
import transfer from "@/components/transferControl/transfer"
import auth from '@/services/authService'
import '@/services/clipboard'
import { language } from '@/i18n/index'
import moment from 'moment'
export default {
    name: 'invitation',
    props: {
        invitationData: {
            type: Object,
            default: function() {
                return {};
            }
        },
    },
    components: {
        transfer
    },
    data() {
        return {
            activeName: 'invitePerson', // default Room System
            isCalling: false, // is calling now
            isFailure: false, // is calling failure
            typeSelected: 'sip', // selected type
            typeOptions: [
                // {
                //     value: 'h323',
                //     label: 'H.323'
                // },
                {
                    value: 'sip',
                    label: 'SIP'
                },
            ], // select type options
            typeValue: '', // selected type value
            inputPlaceholder: this.$t('controlDetail.input.sip'),
            memberList: [],
            selectedInvitedArr: [],
            timeoutJob: "",
            params: {
                conferenceRecordId: '',
                isDST: false,
                utcOffset: 0,
                language: '',
                conferenceNumber:'',
                startDateTimeStamp:"",
                subject:'',
            },//获取邮箱模板的参数
            result: "",

        }
    },
    mounted() {
        api.getTreeDeviceList().then(result=>{
            reqPersonList().then(res => {
                let data = res.data;
                if (data.ret >= 0) {
                    if(result.ret>0){
                        result.data[0].name =this.$t(result.data[0].name);
                        this.memberList =[...data.data,...result.data];
                    }else{
                        this.memberList = data.data;
                    }
                }
            }).catch(e => {
                console.log('>>> error:', e);
            });
        });


        this.getEmailSort();
    },
    methods: {
        // vue event start
        typeSelectedChange(val) {
            if (val == 'h323') {
                this.inputPlaceholder = this.$t('controlDetail.address');
            } else {
                this.inputPlaceholder = this.$t('controlDetail.input.sip');
            }
        },
        // vue event end

        // event click start
        sendInvitation() {
            let checks = this.$refs.memberTransfer.getChecked();
            let users = [];
            const realm = auth.getUser().enterprise.realm
            if (checks.length > 0) {
                this.invitationData.isShowInvitationDataDialog = false;
                checks.forEach((item) => {
                    if (this.invitationData.dataListMiddle.Users.user.length > 0) {
                        let isHave = false;
                        this.invitationData.dataListMiddle.Users.user.forEach((user) => {
                            if (item.account == user.phone) {
                                isHave = true;
                            }
                        })
                        if (!isHave){
                            users.push(`sip:${item.account}@${realm}`)
                        }
                    } else {
                        users.push(`sip:${item.account}@${realm}`)
                    }

                });
            }
            control.addMultiUser(users)
        },
        callRoom() {
            if (!this.typeValue) {
                return;
            }
            this.isCalling = true;
            this.isFailure = false;
            const realm = auth.getUser().enterprise.realm;
            control.addUserByDialOut(`sip:${this.typeValue.trim()}`).then((arg) => {
                if (arg) {
                    console.log('>>> true success')
                    this.isCalling = false;
                    this.invitationData.isShowInvitationDataDialog = false;
                } else {
                    console.log('>>> false')
                    this.isCalling = false;
                    this.isFailure = true;
                }
            })
        },
        linkToEmail() {
            var meetNowTime=this.getDateStr(this.invitationData.dataListMiddle.Desc._startTime);
            let desc = this.invitationData.dataListMiddle.Desc;
            let subject = 's video conference';
            desc.confType == 'VMN'? subject = desc.org_displayName + this.$t('controlDetail.meetnow.videoConf') : subject = desc.subject
            this.$router.push({
                path: '/meeting/index/control/email',
                query: { Id: this.invitationData.dataListMiddle.Desc.scheduleId,
                    Subject: subject,
                    ConferenceNumber:this.invitationData.dataListMiddle.Desc.confNumber,
                    StartDateTimeStamp:new Date(meetNowTime).valueOf()
                }
            })
        },
        // event click end

        hoverEvent() {

            this.timeoutJob = setTimeout(function() {
                $("#invite_a_remind").slideDown(300);
            }, 500);

        },
        hoverEventOut() {

            if (this.timeoutJob) {
                clearTimeout(this.timeoutJob);
                this.timeoutJob = null;
            }
            $("#invite_a_remind").slideUp(300);

        },
        /**
         * 打来本地邮箱
         */
        openLocalEmail() {
            let desc = this.invitationData.dataListMiddle.Desc;
            let subject = 's video conference';
            desc.confType == 'VMN'? subject = desc.org_displayName + this.$t('controlDetail.meetnow.videoConf') : subject = desc.subject;
            var mailTo = 'mailto:?subject=' + encodeURIComponent(subject) +
                '&body=' + encodeURIComponent(this.result);
            window.open(mailTo);
            this.invitationData.isShowInvitationDataDialog = false
        },
        /**
         * 复制信息
         */
        copyMsg() {
            let EmailMsg = this.result;
            if (EmailMsg) {
                var clipboard = new Clipboard('.btn_clipboard', {
                    text: function() {
                        return EmailMsg;
                    }
                });
                clipboard.on('success', this.open2());
            } else {
                this.$message({
                    message: this.$t('controlDetail.noneEmail'),
                    type: 'warning'
                });
            }
        },
        /**
         *时间的转换
         * */
        getDateStr(date) {
            //使用new Date的方法，得出的是时间是一样的只是时区变了
            var date = new Date(date);
            var years = date.getFullYear();
            var month = this.checkNum(date.getMonth()+1);
            var day = this.checkNum(date.getDate());
            var hour=this.checkNum(date.getHours());
            var minute=this.checkNum(date.getMinutes());
            var second=this.checkNum(date.getSeconds());
            return `${years}-${month}-${day}`+'T'+hour+":"+minute+":"+second+"+00:00"

        },
        checkNum(str) {
            var num = Math.abs(Number(str));
            return num<10?"0"+num:num
        },
        /**
         * 获取邮箱模板        TODO 请求的参数为写死的，需获取
         */
        getEmailSort(){
            if(!this.invitationData.dataListMiddle.Desc.scheduleId){
                this.getMeetNowEmail();
            }else{
                this.getEmailMsg();
            }
        },
        getMeetNowEmail(){
            let lan = "CN"
            if (language() === 'zh-CN') {
                lan = "CN"
            } else if (language() === 'en-US') {
                lan = "EN"
            }
            var meetNowTime=this.getDateStr(this.invitationData.dataListMiddle.Desc._startTime);
            let desc = this.invitationData.dataListMiddle.Desc;
            let subject = 's video conference';
            desc.confType == 'VMN'? subject = desc.org_displayName + this.$t('controlDetail.meetnow.videoConf') : subject = desc.subject;
            var mailTo = 'mailto:?subject=' + encodeURIComponent(subject) +
                '&body=' + encodeURIComponent(this.result);
            this.params = {
                conferenceNumber: this.invitationData.dataListMiddle.Desc.confNumber,
                startDateTimeStamp: new Date(meetNowTime).valueOf(),
                subject: subject,
                isDST: moment().isDST(),//当前浏览器的时区是否是夏令时
                utcOffset: moment().utcOffset()*60,//当前浏览器的时区的偏移量，是夏令时则加3600
                language: lan,//当前语言
            }
            api.getMeetNowEmailTemplate(this.params, false, '').then(json => {
                this.result = json.data;
            })

        },
        getEmailMsg() {
            let lan = "CN"
            if (language() === 'zh-CN') {
                lan = "CN"
            } else if (language() === 'en-US') {
                lan = "EN"
            }
            this.params = {
                conferenceRecordId: this.invitationData.dataListMiddle.Desc.scheduleId,//会议ID
                isDST: moment().isDST(),//当前浏览器的时区是否是夏令时
                utcOffset: moment().utcOffset()*60,//当前浏览器的时区的偏移量，是夏令时则加3600
                language: lan,//当前语言
            }
            api.getEmail(this.params, false, '').then(json => {
                this.result = json.data;
            })
        },
        /**
         * 执行弹窗
         */
        open2() {
            this.invitationData.isShowInvitationDataDialog = false;
            this.$message({
                message:  this.$t('controlDetail.already'),
                type: 'success'
            });
        },
    },
    computed: {
    },

}
</script>

<style lang="scss">
.el-tabs__header {
    border-bottom: 0px;
    .el-tabs__nav-scroll {
        text-align: center;
        .el-tabs__nav {
            float: none;
            display: inline-block;
            .el-tabs__item {
                padding: 0 65px!important;
                font-size: 18px!important;
                color: black;
            }
            .el-tabs__item.is-active {
                color: #167acc;
            }
        }
    }
}
.STAFF_ico_docu {
    background-image: url('../../../../components/tree/src/icon/user.png') !important;
}
</style>

<style lang="scss" scoped>
@import "../common";

.btn_clipboard {
    border: 0px;
    color: #2699f4;
    position: absolute;
    left: 0px
}

.contacts {
    .pd-b-2em {
        padding-bottom: 2em
    }
}

.room-system {
    .select-options {
        width: 20%;
    }
    .input-value {
        padding-left: 20px;
        width: 76%;
    }
    .bottom {
        margin-top: 70px
    }
    .dialog-invited-room {
        border: 1px solid rgb(204, 204, 204);
        height: 200px;
        padding: 20px;
        position: relative;
        .calling {
            text-align: center;
            position: absolute;
            top: 0px;
            left: 50%;
            -ms-transform: translateX(-50%);
            transform: translateX(-50%);
        }
        .call-fail {
            text-align: center;
            position: absolute;
            top: 0px;
            left: 50%;
            -ms-transform: translateX(-50%);
            transform: translateX(-50%);
            font-size: 14px;
            color: red;
        }
    }
}

.email-invite {
    .invite-email-tip {
        position: absolute;
        top: 0px;
        left: 50%;
        margin-left: -320px;
        width: 670px;
        .email-tip {
            display: none;
            color: white;
            font-size: 18px;
            border-radius: 9px;
            background-color: gray;
            border: 0;
            margin: 0 auto;
            padding: 10px 30px 10px 30px;
            text-align: center;
        }
    }
    .dialog-invited-email {
        border: 1px solid #CCCCCC;
        height: 460px;
        position: relative;
        .dialog-invited-content {
            position: absolute;
            left: 50%;
            top: 60%;
            -ms-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            a {
                display: block;
                float: left;
                width: 100px;
                height: 150px;
                padding-top: 130px;
                cursor: pointer;
                text-decoration: none;
                text-align: center;
                color: black;
            }
            .invite_a {
                background: url(./img/local_mail.png) no-repeat 0px 0px;
                &:hover {
                    background: url(./img/local_mail_hover.png) no-repeat 0px 0px;
                }
                &:active {
                    background: url(./img/local_mail_active.png) no-repeat 0px 0px;
                }
            }

            .invite_b {
                margin-left: 180px;
                vertical-align: bottom;
                background: url(./img/server_mail.png) no-repeat 0px 0px;
                &:hover {
                    background: url(./img/server_mail_hover.png) no-repeat 0px 0px;
                }
                &:active {
                    background: url(./img/server_mail_active.png) no-repeat 0px 0px;
                }
            }
        }
        .copy-msg {
            font-size: 18px;
            color: #2ea9e9;
            &:hover {
                color: #20cbf3;
            }
            &:active {
                color: #2ea9e9;
            }
        }
    }
    .btn-padding-email {
        margin: 1.5em 0em 0em 0em;
    }
}

.btns {
    text-align: center;
    .dialog-button {
        padding: 0.8em 3em;
    }

    .dialog-button-two {
        padding: 0.8em 3em;
        margin-left: 5em;
    }
}
</style>
