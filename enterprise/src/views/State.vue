<template>
    <div class="g-bd">
        <!--页面头部-->
        <div class="g-hd">
            <h3>{{$t('state.tit')}}</h3>
        </div>
        <div class="s-state">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :label="$t('state.onlineStaff')" name="first">
                    <el-input :placeholder="$t('state.onlineStaff.search')" class="u-search" icon="search" v-model="searchParamskey1" :on-icon-click="handleUserOnclick" :maxlength="64">
                    </el-input>
                    <el-table class="m-onlineUser" ref="usertable" :data="userData.data" stripe>
                        <div slot="empty">
                            <table-no-data v-model="searchParams1.key" @cb="cb(1)"></table-no-data>
                        </div>
                        <el-table-column prop="name" :label="$t('common.name')" min-width="300" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column :label="$t('common.ext')" min-width="180">
                            <template scope="scope">
                                <span>{{scope.row.number.substring(5)}}</span>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column :label="$t('common.status')" min-width="180" show-overflow-tooltip>
                            <template scope="scope">
                                <span v-if="scope.row.userStatus === 'IDLE'">{{$t('state.onlineStaff.idle')}}</span>
                                <span v-else-if="scope.row.userStatus === 'BUSY'" class="f-cg">{{$t('state.onlineStaff.busy')}}</span>
                            </template>
                        </el-table-column> -->
                        <el-table-column :label="$t('common.equipmentDetails')" min-width="120" align="center">
                            <template scope="scope">
                                <yl-popover :title="$t('common.toView')">
                                    <el-table slot="table" :data="scope.row.equips" stripe max-height="240">
                                        <el-table-column prop="model" :label="$t('common.model')" min-width="140">
                                        </el-table-column>
                                        <el-table-column prop="fw_version" :label="$t('common.version')" min-width="180">
                                        </el-table-column>
                                        <el-table-column prop="network_ip" :label="$t('common.IP')" min-width="160">
                                        </el-table-column>
                                        <!-- <el-table-column :label="$t('common.status')" min-width="100">
                                            <template scope="scope">
                                                <span v-if="scope.row.phoneStatus === 'IDLE'">{{$t('state.onlineStaff.idle')}}</span>
                                                <span v-else-if="scope.row.phoneStatus === 'BUSY'" class="f-cg">{{$t('state.onlineStaff.busy')}}</span>
                                            </template>
                                        </el-table-column> -->
                                    </el-table>
                                </yl-popover>
                            </template>
                        </el-table-column>
                    </el-table>
                    <table-bar :table="usertable" :total="userData.total" @change="getUserList" :checkbox="false"></table-bar>
                </el-tab-pane>
                <el-tab-pane :label="$t('state.meetnow')" name="second">
                    <el-input :placeholder="$t('state.meetnow.search')" class="u-search" icon="search" v-model="searchParamskey2" :on-icon-click="handleConfOnclick" :maxlength="64">
                    </el-input>
                    <el-table class="m-onlineUser" ref="conftable" :data="confData.data" stripe>
                        <div slot="empty">
                            <table-no-data v-model="searchParams2.key" @cb="cb(2)"></table-no-data>
                        </div>
                        <el-table-column :label="$t('state.meetnow.subject')" min-width="220" show-overflow-tooltip>
                            <template scope="scope">
                                <span>{{ scope.row.confType == 'VMN'||scope.row.confType == 'VSCA' ? scope.row.subject + $t('state.meetnow.videoConf') : scope.row.subject}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('state.meetnow.startTime')" min-width="160">
                            <template scope="scope">
                                <span>{{parseZone(scope.row.startTime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="organizerName" :label="$t('state.meetnow.organizers')" min-width="110" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="confType" :label="$t('state.meetnow.type')" min-width="120">
                            <template scope="scope">
                                <span>{{confType[scope.row.confType]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="conferenceId" :label="$t('state.meetnow.number')" min-width="120">
                        </el-table-column>
                        <el-table-column prop="duration" :label="$t('state.meetnow.duration')" min-width="140">
                            <!-- <template scope="scope">
                                <span>{{time(scope.row.startTimeStamp)}}</span>
                            </template> -->
                        </el-table-column>
                    </el-table>
                    <table-bar :table="conftable" :total="confData.total" @change="getConfList" :checkbox="false"></table-bar>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import YlPopover from '@/components/popover'
import TableNoData from '@/components/common/TableNoData'
import moment from "moment"
import {
    getUserPagedList, getConferencePagedList, getServerTime
} from '../api/state'

export default {
    data() {
        return {
            activeName: 'first',
            searchParams1: {
                key: null,
                skip: 0,
                limit: Number.parseInt(localStorage.getItem('currentSize') || 10),
                autoCount: true,
            },
            userData: {
                data: null,
                total:0,
            },
            usertable: 'usertable',
            searchParams2: {
                key: null,
                skip: 0,
                limit: Number.parseInt(localStorage.getItem('currentSize') || 10),
                autoCount: true,
            },
            confData: {
                data: null,
                total:0,
            },
            conftable: 'conftable',
            confType: {
                VMN: this.$t('dashboard.meeting.meetnow'),
                VGCM: this.$t('dashboard.meeting.meetnow'),
                VSCA: this.$t('dashboard.meeting.meetnow'),
                VGCP: this.$t('dashboard.meeting.recurrence'),
                VSC: this.$t('dashboard.meeting.recurrence')
            },
            serverTime: null,
            timer: null,
            timerGet: null,
            searchParamskey1: '',
            searchParamskey2: ''
        };
    },
    components: {
        YlPopover, TableNoData
    },
    created() {
        if (this.$route.query.target === 'confList') {
            this.activeName = 'second';
            this.handleClick({ name: 'second' });
        } else {
            this.activeName = 'first';
            this.handleClick({ name: 'first' });
        }
        this.enter()
        getServerTime('', false, '')
            .then(response => {
                this.serverTime = response.data
            })
    },
    methods: {
        cb(type){
            this.searchParamskey1 ='';
            this.searchParamskey2 ='';
            if(type===1){
                this.getUserList();
            }else {
                this.getConfList();
            }
        },
        handleUserOnclick(){
            this.userData.total = 0;
            this.getUserList({ skip: 0 })
        },
        handleConfOnclick(){
            this.confData.total = 0;
            this.getConfList({ skip: 0 })
        },
        // 在线用户列表
        getUserList(val) {
            this.searchParams1.key=  this.searchParamskey1;
            if (!!val) Object.assign(this.searchParams1, val)
            getUserPagedList(this.searchParams1, true, '')
                .then(response => {
                    if(response.ret > -1) {
                        this.userData = response.data
                    }
                    this.searchkey = this.searchParams1.key

                })
        },
        // 实时会议列表
        getConfList(val) {
            this.searchParams2.key=  this.searchParamskey2;
            if (!!val) Object.assign(this.searchParams2, val)
            getConferencePagedList(this.searchParams2, true, '')
                .then(response => {
                    if(response.ret > -1) {
                        this.confData = response.data
                        if(this.confData && this.confData.data){
                            this.confData.data.forEach((val, i) => {
                                this.$set(this.confData.data[i], 'duration', this.time(val.startTimeStamp))
                            })
                        }
                    }
                    this.searchkey = this.searchParams2.key
                })
        },
        // tab切换
        handleClick(tab, event) {
            this.searchParamskey1 ='';
            this.searchParamskey2 ='';
            if (tab.name == "second") {
                this.$router.push({ path: '/enterprise/state', query: { target: 'confList' } })
                this.getConfList()
            } else if (tab.name == "first") {
                this.$router.push({ path: '/enterprise/state' })
                this.getUserList()
            }
        },
        //enter监听Enter
        listener(e) {
            if (e) {
                var e = window.event ? window.event : e;
                if (e.keyCode == 13) {
                    if (this.activeName == 'first'){
                        this.handleUserOnclick();
                    }else if (this.activeName == 'second'){
                        this.handleConfOnclick();
                    }
                }
            }
        },
        enter() {
            document.addEventListener('keydown', this.listener);
        },
        time(startTime) {
            let ts = this.serverTime - startTime
            if (ts > 0) {
                let hh = parseInt(ts / 1000 / 60 / 60, 10);
                let mm = parseInt(ts / 1000 / 60 % 60, 10);
                let ss = parseInt(ts / 1000 % 60, 10);
                hh = hh < 10 ? ("0" + hh) : hh;   //时
                mm = mm < 10 ? ("0" + mm) : mm;   //分
                ss = ss < 10 ? ("0" + ss) : ss;   //秒
                return `${hh}:${mm}:${ss}`
            } else {
                return `00:00:00`
            }
        },
        // 时区转换
        parseZone(time) {
            time = new Date(moment.utc(time).format()).valueOf()
            return moment.utc(time).utcOffset(moment().utcOffset()).format('YYYY/MM/DD HH:mm')
        }
    },
    mounted() {
        this.timer = setInterval(() => {
            this.serverTime = this.serverTime + 1000
            if(this.confData && this.confData.data){
                this.confData.data.forEach((val, i) => {
                    this.$set(this.confData.data[i], 'duration', this.time(val.startTimeStamp))
                })
            }
        }, 1000)
        this.timerGet = setInterval(() => {
             this.getConfList()
        }, 30000)

    },
    destroyed: function() {
        document.removeEventListener('keydown', this.listener)
        clearInterval(this.timer)
        clearInterval(this.timerGet)
    }
};
</script>


<style lang="scss" scoped>
@mixin left {
    float: left;
}

@mixin right {
    float: right;
}

p,
ul,
li {
    margin: 0;
    padding: 0;
}

ul,
li {
    list-style: none;
}

.s-state {
    padding: 10px 20px 20px;
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 20px;
    a {
        color: #2699f4;
        &:hover {
            color: #51adf6;
        }
    }
    .u-search {
        width: 30%;
    }
    .m-onlineUser {
        margin-top: 21px;
        .f-tac {
            .icon-kongshuju {
                color: #c9c9c9;
                font-size: 58px;
            }
        }
        .noSearch {
            ul {
                margin-bottom: 16px;
            }
        }
        .detail {
            color: #2699f4;
            .caret {
                font-size: 12px;
                transform: scale(0.5);
            }
        }
    }
    .page {
        text-align: right;
    }
}

.f-cg {
    color: #2da881;
}
</style>

<style lang="scss">
.s-state {
    .el-tabs__header {
        border-bottom: 1px solid #e6e6e6;
        margin: 0 0 20px;
    }
}
</style>

