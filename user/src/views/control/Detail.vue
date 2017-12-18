<template>
    <el-row>
        <el-col :span="24">
            <el-card>
                <!--上半部分-->
                <control-up :dataListUp="confControlData" :audienceEnable="audienceEnable"></control-up>
                <!-- -------中部份------- -->
                <control-middle :dataListMiddle="confControlData" @filter="filterData"></control-middle>
                <!-- -------下半部份------- -->
                <control-down :dataListDown="confControlData" :audienceEnable="audienceEnable"></control-down>
            </el-card>
            <!--权限改变-->
            <el-dialog class="dialog-role" :title="$t('controlDetail.notice')" :visible.sync="roleChange.show" :close-on-press-escape="false" :show-close="false" :close-on-click-modal="false">
                <p>{{$t('controlDetail.notice.permissions')}}</p>
                <div>
                    <el-button class="dialog-button" size="large" type="primary" @click="roleChange.show = false; closeModal('roleChange')">{{$t('controlDetail.confirm')}}</el-button>
                </div>
            </el-dialog>
            <!--会议结束-->
            <el-dialog class="dialog-role" :title="$t('controlDetail.notice')" :visible.sync="endConf.show" :close-on-press-escape="false" :show-close="false" :close-on-click-modal="false">
                <p>{{$t('controlDetail.notice.notExist')}}</p>
                <div>
                    <el-button class="dialog-button" size="large" type="primary" @click="endConf.show = false; closeModal('endConf')">{{$t('controlDetail.confirm')}}</el-button>
                </div>
            </el-dialog>
            <!--连接失败弹窗-->
            <el-dialog class="dialog-failed" :title="$t('controlDetail.notice')" :visible.sync="failed.show" :close-on-press-escape="false" :show-close="false" :close-on-click-modal="false">
                <p>{{$t('control.failure')}}</p>
                <div>
                    <el-button class="dialog-button" size="large" type="primary" @click="failed.show = false; closeModal('failed')">{{$t('controlDetail.confirm')}}</el-button>
                </div>
            </el-dialog>
        </el-col>
    </el-row>
</template>
<script>
import control from '@/services/meetingControl'
import controlUp from './controlDetail/controlUp'
import controlMiddle from './controlDetail/Middle/controlMiddle'
import controlDown from './controlDetail/controlDown'
import auth from '@/services/authService'
import conferenceChannel from 'conference-channel'
import { Loading } from 'yl-element'
import {
    talkConfig
} from '../../api/control'
export default {
    components: {
        controlUp,
        controlMiddle,
        controlDown
    },
    props: ['confNum'],
    created: function() {
        this.loadingInstance = Loading.service({ fullscreen: false, text: this.$t('common.loading') });
        /**
         *创建通道
         */
        conferenceChannel.on('confUpdate', this._conferenceUpdateListener)
        const realm = auth.getUser().enterprise.realm
        control.connectConference({
            number: this.confNum,
            domain: realm,
            id: this.confNum
        }).then((val) => {
            if (val) {
                // control.conf.on('confUpdate', this._conferenceUpdateListener)
                
            } else {
                this.failed.show = true
                this.loadingInstance.close();
                console.log("connect conference failed");
            }
        }).catch(function(error) {
            this.failed.show = true
            this.loadingInstance.close();
            console.log("connect conference failed");
        });
        // 获取直播功能
        talkConfig('', false, '')
            .then(res=>{
                if (res.ret >= 0) {
                    this.audienceEnable = res.data.audienceEnable
                }
            })
    },
    data() {
        return {
            roleChange: {
                show: false
            },
            endConf: {
                show: false
            },
            failed: {
                show: false
            },
            //获取数据
            confControlData: {
                "receiverScreenSharingStateChanged": false,
                "factoryURI": "",
                "entity": "",
                "notifyVersion": 0,
                "addmemberMode": 0,
                "state": "partial",
                "hasAV": false,
                "hasAS": false,
                "hasCtrl": false,
                "hasChat": false,
                "uaRolesPri": "attendee", //UA权限  演示者presenter，与会者attendee，观众为castviewer
                "Desc": {
                    "avURI": "",
                    "focusURI": "",
                    "asURI": "",
                    "org_uri": "",
                    "org_uid": "",
                    "org_name": "",
                    "org_realm": "", //域
                    "confId": "",
                    "confNumber": 0, //会议号码
                    "startTime": "", //开始时间   时区根据用户电脑显示
                    "expiryTime": "", //结束时间
                    "remindEarly": 0,
                    "subject": "", //会议主题
                    "profile": "default" //会议模式 普通模式为default，主席模式为demonstrator
                },
                "State": {
                    "active": true, //会议状态，true为激活状态；
                    "locked": false, // 会议锁住，不再添加成员；
                    "policy": "3" //(0)会锁住; （大于0）表示哪些人在会议没有locked锁住时，可以直接加入会议(1) closedAuthenticated：表示演示者邀请的用户;(2) openAuthenticated：表示与组织者同一个域或者联盟内的用户(3) anonymous：表示任何人都可以加入会议；
                },
                "View": {
                    "focusLocked": false, //表示Lobby大厅是否开启
                    "videoLayout": "" //平等模式Equality，主席模式Presentation，语音激励模式SpeechExcitation；
                },
                "Users": {
                    "participant": 0, //当前人数
                    "user": []
                }
            },
            UserFilter: null, //过滤搜索使用
            audienceEnable: false, //是否开启直播
            searchkey: '',
            loadingInstance: null
        }
    },
    methods: {
        closeModal(name) {
            if (name === 'roleChange') {
                this.$router.push({ path: '/meeting' })
            }
            if (name === 'endConf') {
                this.$router.push({ path: '/meeting' })
            }
            if (name === 'failed') {
                this.$router.push({ path: '/meeting' })
            }
        },
        openModal(name) {
            this[name]['show'] = true;
        },
        /**
         *获取数据的方法
         */
        _conferenceUpdateListener(value) {
            this.loadingInstance.close();
            if (value) {
                let o = Object.assign({}, value)
                this.confControlData = JSON.parse(JSON.stringify(o));
                this.confControlData.Users.user = this.confControlData.Users.user.filter((item)=>{
                    return item.userAgent.indexOf('Yealink Conference-Channel') == -1;
                });
                this.confControlData.Users.user.forEach(function(v,i,a) {
                    let level = '0';
                    if(v.uid == this.confControlData.Desc.org_uid){
                        level += '1';
                    } else {
                        level += '0';
                    }
                    if(v.applicationsharing){
                        level += '1';
                    }else {
                        level += '0';
                    }
                    if(v.rolesDemoState == 'demonstrator'){
                        level += '1';
                    }else {
                        level += '0';
                    }
                     if(v.mute == 'unblocking'){
                        level += '1';
                    }else {
                        level += '0';
                    }
                    if(v.mute == 'unblock'){
                        level += '1';
                    }else {
                        level += '0';
                    }
                    if(v.mute == 'block'){
                        level += '1';
                    }else {
                        level += '0';
                    }
                    if(v.uid){
                        level += '1';
                    }else {
                        level += '0';
                    }
                    if(!v.uid){
                        level += '1';
                    }else {
                        level += '0';
                    }
                    a[i]['level'] = parseInt(level,2);
                }, this)
                this.confControlData.Users.user.sort(function(a,b){return a.level<b.level?1:-1})
                let arr = [];
                for(let i = 242; i >= -1; i--) {
                    let _arr = [];
                    this.confControlData.Users.user.forEach((val)=> {
                        if(val.level == i) {
                            _arr.push(val)
                        }
                    })
                    _arr.sort(function(a, b){ 
                        if (/^\d/.test(a.displayText) ^ /^\D/.test(b.displayText)) {
                            return a.displayText>b.displayText?1:(a.displayText==b.displayText?0:-1);
                        } else {
                            return a.displayText>b.displayText?-1:(a.displayText==b.displayText?0:1);
                        }
                    })
                    arr = arr.concat(_arr)
                }
                this.confControlData.Users.user = arr;
                this.UserFilter = this.confControlData.Users.user;
                this.filterData(this.searchkey);

            }
            if (this.confControlData.uaRolesPri != 'presenter') {
                this.openModal('roleChange');
                setTimeout(() => {
                    this.closeModal('roleChange')
                }, 3000)
            }
            if (this.confControlData.state === 'deleted') {
                this.openModal('endConf');
                setTimeout(() => {
                    this.closeModal('endConf')
                }, 3000)
            }
            console.log("获取数据是：", this.confControlData)
        },
        // 过滤搜索条件
        filterData(item) {
            if (item == '') {
                this.searchkey = '';
                this.confControlData.Users.user = this.UserFilter
            } else if (typeof (item) == 'object'){
                this.confControlData.Users.user = this.UserFilter.filter(this.createFilter(item.value))
            }else if (typeof (item) == 'string'){
                this.confControlData.Users.user = this.UserFilter.filter(this.createFilter(item))
            }      
        },
        createFilter(queryString) {
            this.searchkey = queryString;
            return (user) => {
                return (user.displayText.indexOf(queryString.toLowerCase()) != -1 || user.phone.indexOf(queryString.toLowerCase()) != -1);
            };
        },
    },
    destroyed: function() {
        control.destroyConferences()
        conferenceChannel.removeListener('confUpdate', this._conferenceUpdateListener)
    }

}
</script>
<style lang="scss">
.dialog-role {
    width: 1000px;
    margin: auto auto;
    text-align: center;
}
.dialog-failed {
    width: 1000px;
    margin: auto auto;
    text-align: center;
}
</style>

