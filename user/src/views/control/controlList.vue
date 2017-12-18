<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-card>
                    <!-- ------------------表格-------------- -->
                    <el-table class="u-tb-width " ref="table" :data="firstPage.data" stripe>
                        <!--图标-->
                        <el-table-column width="100px">
                            <template scope="scope">
                                <div class="icon iconfont icon-Videoconference f-fr f-fs-22 g-paddingr-0 color-video " aria-hidden="true"></div>
                                <div class="icon iconfont icon-refresh  f-fr f-fs-22 g-paddingr-8 color-round" :title="$t('control.cycle')" v-show="scope.row.round===true"></div>
                            </template>
                        </el-table-column>
                        <!--主题列-->
                        <el-table-column :label="$t('control.subject')" show-overflow-tooltip>
                            <template scope="scope">
                                <span class="f-fs-14" v-if="scope.row.confType === 'VMN'">{{scope.row.organizerDisplayName+$t('controlDetail.meetnow.videoConf')}}</span>
                                <span class="z-cursor f-fs-14 color-subject" @click="detail(scope.row.recordId)" v-else>{{scope.row.subject}}</span>
                                <!--<span class="z-cursor f-fs-14 color-subject" @click="detail" >{{scope.row.subject}}</span>-->
                            </template>
                        </el-table-column>
                        <!--会议id-->
                        <el-table-column prop="confNum" :label="$t('control.id')" width="160"></el-table-column>
                        <!--会议密码-->
                        <el-table-column prop="presenterPin" :label="$t('control.password')" width="160">>
                            <template scope="scope">
                                <span>{{scope.row.presenterPin || '--'}}</span>
                            </template>
                        </el-table-column>
                        <!--开始时间-->
                        <el-table-column :label="$t('control.startTime')">
                            <template scope="scope">
                                <span>{{parseZone(scope.row.startTime)}}</span>
                            </template>
                        </el-table-column>
                        <!--持续时间-->
                        <el-table-column prop="duration" :label="$t('control.duration')" show-overflow-tooltip></el-table-column>
                        <!--操作-->
                        <el-table-column :label="$t('control.operation')">
                            <template scope="scope">
                                <!--  TODO 要根据类型去显示会议的详情-->
                                <div>
                                    <i class="icon iconfont icon-Conference_control1 f-fs-22 color-control z-cursor f-fl" :title="$t('control.confControl')" aria-hidden="true" @click="showControl(scope.row.confNum)"></i>
                                    <span v-if="currentUid === scope.row.organizerUid">
                                        <i class="icon iconfont icon-delete1 f-fs-22 color-delete z-cursor f-fl" :title="$t('control.deleteControl')" aria-hidden="true" @click="checkRecurrence('deleteControl', scope.row.recordId, scope.row.planId, scope.row.confNum)" v-if="scope.row.confType != 'VMN'"></i>
                                        <!--  即时会议删除-->
                                        <i class="icon iconfont icon-delete1 f-fs-22 color-delete z-cursor f-fl" :title="$t('control.deleteControl')" aria-hidden="true" @click="deleteVMN.show = true; deleteVMN.confNum = scope.row.confNum;" v-else></i>
                                    </span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页 TODO 需将数据与分页组件联系起来-->
                    <div class="page" v-show="tableData.length > 0">
                        <div class="u-pagination">
                            <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="firstPage.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="firstPage.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
                            </el-pagination>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <div>
            <!--单次会议删除弹窗-->
            <el-dialog class="dialog-delete" :title="$t('control.tip')" :visible.sync="deleteControl.showOnce">
                <p class="tip-font-style" style="text-align: center;padding-bottom: 26px;font-size: 18px;">{{$t('control.notice')}}</p>
                <div class="btn-padding" style="text-align: center">
                    <el-button style="padding: 0.8em 3em;" size="large" type="primary" @click="deleteControl.showOnce= false; deletOnce()">{{$t('control.confirm')}}</el-button>
                    <el-button style="padding: 0.8em 3em;" size="large" @click="deleteControl.showOnce = false">{{$t('control.cancel')}}</el-button>
                </div>
            </el-dialog>
            <!--周一会议删除弹窗-->
            <el-dialog class="dialog-delete" :title="$t('control.deleteTit')" :visible.sync="deleteControl.showPlan">
                <p class="tip-font-style" style="text-align: center;padding-bottom: 26px;font-size: 18px;">{{$t('control.deleteConf')}}</p>
                <div class="btn-padding" style="text-align: center">
                    <el-button style="padding: 0.8em 3em;" size="large" type="primary" @click="deleteControl.showPlan= false; deletOnce()">{{$t('control.deleteOnce')}}</el-button>
                    <el-button style="padding: 0.8em 3em;" size="large" type="primary" @click="deleteControl.showPlan = false; deletePlan()">{{$t('control.deletePlan')}}</el-button>
                </div>
            </el-dialog>
            <!--即时会议删除弹窗-->
            <el-dialog class="dialog-delete" :title="$t('control.tip')" :visible.sync="deleteVMN.show">
                <p class="tip-font-style" style="text-align: center;padding-bottom: 26px;font-size: 18px;">{{$t('control.notice')}}</p>
                <div class="btn-padding" style="text-align: center">
                    <el-button style="padding: 0.8em 3em;" size="large" type="primary" @click="deleteVMN.show= false; deletNowMeeting()">{{$t('control.confirm')}}</el-button>
                    <el-button style="padding: 0.8em 3em;" size="large" @click="deleteVMN.show = false">{{$t('control.cancel')}}</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script type="es6">
import tableBar from "@/components/control/TableBar/"
import control from '@/services/meetingControl'
import auth from '@/services/authService'
import moment from "moment";
import {
    deletOnceMeeting, deletePlanMeeting, reqCheckRecurrence
} from '../../api/control';
export default {
    components: {
        tableBar
    },
    data() {
        return {
            firstPage: {
                currentPage: 1,
                pageSize: Number.parseInt(localStorage.getItem('currentSize') || 10),
                data: null
            },
            deleteControl: {
                showOnce: false,
                showPlan: false,
                recordId: null,
                planId: null
            },//删除会控弹窗参数
            deleteVMN: {
                show: false,
                confNum: null
            },
            tableData: [],
            tiemer: null, //请求列表定时器
            timeDuration: null, //持续时间定时器
            nowTime: null,
            currentUid: null
        }
    },
    created() {
        this.currentUid = auth.getUser().userId
        this.getList()
        this.tiemer = setInterval(() => {
            this.getList()
        }, 30000)
    },
    methods: {
        getList() {
            if (this.currentUid) {
                control.getGlobalConferences(this.currentUid)
                    .then((val) => {
                        if (val) {
                            this.tableData = val.arr;
                            this.nowTime = new Date(val.nowTime.replace(/-/g,'/')).getTime();
                            this.pageData1();
                        } else {
                            this.tableData = []
                            console.log("Controllable meetings failed or null");
                        }
                    }).catch((error) => {
                        this.tableData = []
                        console.log(error)
                    });
            }
        },
        /**
         *链接到会控
         */
        showControl(num) {
            this.$router.push({ path: '/meeting/index/ControlList', query: { confNum: num } })
            this.$emit('intoControl', num)
        },
        /**'
         *链接到详情
         */
        detail(id) {
            this.$router.push({ path: '/meeting/index/reservationDetail', query: { id: id } })
        },
        // 分页
        handleSizeChange1(val) {
            this.firstPage.pageSize = val;
            this.firstPage.currentPage = 1;
            this.pageData1();
        },
        handleCurrentChange1(val) {
            this.firstPage.currentPage = val;
            this.pageData1();
        },
        pageData1() {
            this.firstPage.data = this.tableData.slice((this.firstPage.currentPage - 1) * this.firstPage.pageSize, this.firstPage.currentPage * this.firstPage.pageSize)
            this.firstPage.data.forEach((val, i) => {
                // this.firstPage.data[i].duration = this.duration(this.nowTime, val.startTime)
                if(this.firstPage.data[i].confType == 'VGCM' && this.firstPage.data[i].state == 'end') {
                    this.$set(this.firstPage.data[i], 'duration', '00:00:00')
                } else {
                    this.$set(this.firstPage.data[i], 'duration', this.duration(this.nowTime, val.startTime))
                }
            })
        },
        duration(nowTime, startTime) {
            let ts = 0
            if (nowTime && startTime){
                ts = nowTime - new Date(startTime.replace(/-/g,'/')).getTime()
            }  
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
        // 判断会议是否是周期会议
        checkRecurrence(name, recordId, planId, confNum) {
            this[name]['recordId'] = recordId;
            this[name]['planId'] = planId;
            this[name]['confNum'] = confNum;
            reqCheckRecurrence(recordId, false, '')
                .then(response => {
                    if (response) {
                        this[name]['showPlan'] = true;
                    } else {
                        this[name]['showOnce'] = true;
                    }
                })
        },
        //删除单次会议
        deletOnce() {
            const params = { "id": this.deleteControl.recordId }
            control.delRecord(this.deleteControl.confNum, this.deleteControl.recordId)
                .then(res=> {
                    if(res){
                        this.getList()
                    }
                })
            deletOnceMeeting(params, false, 'error')
                .then(response => {
                    if (response.ret === 0) {
                        // setTimeout(() => {
                        //     this.getList()
                        // }, 1000)
                    }
                })
        },
        //删除系列会议
        deletePlan() {
            const params = { "id": this.deleteControl.planId }
            control.delRecord(this.deleteControl.confNum, this.deleteControl.recordId)
                .then(res=> {
                    if(res){
                        this.getList()
                    }
                })
            deletePlanMeeting(params, false, 'error')
                .then(response => {
                    if (response.ret === 0) {
                        // setTimeout(() => {
                        //     this.getList()
                        // }, 1000)
                    }
                })
        },
        deletNowMeeting() {
            control.delVMN(this.deleteVMN.confNum).then(res => {
                if (!res) {
                    this.$message.error(this.$t('control.deleteFailure'));
                } else {
                    setTimeout(() => {
                        this.getList()
                    }, 1000)
                }
            })
        },
        // 时区转化
        parseZone(time) {
            time = new Date(moment.utc(time).format()).valueOf()
            return moment.utc(time).utcOffset(moment().utcOffset()).format('YYYY/MM/DD HH:mm')
        }
    },
    mounted() {
        this.timeDuration = setInterval(() => {
            this.nowTime = this.nowTime + 1000
            if(this.firstPage.data){
                this.firstPage.data.forEach((val, i) => {
                     if(this.firstPage.data[i].confType == 'VGCM' && this.firstPage.data[i].state == 'end') {
                    this.$set(this.firstPage.data[i], 'duration', '00:00:00')
                } else {
                    this.$set(this.firstPage.data[i], 'duration', this.duration(this.nowTime, val.startTime))
                }
                })
            }
        }, 1000)
    },
    destroyed: function() {
        clearInterval(this.tiemer);
        clearInterval(this.timeDuration);
    }
}
</script>
<style lang="scss">
.el-tooltip__popper.is-dark {
    background: rgba(0, 0, 0, 0.6);
}


/*修改表格的左边距*/

.el-table .cell,
.el-table th>div {
    padding-left: 0px!important;
}

.el-table_1_column_1 {
    .cell {
        width: 80px!important;
    }
}
</style>
<style lang="scss" scoped>
.u-tb-width {
    width: 100%;
}

.g-style {
    padding: 0 1em 0 1em;
    position: absolute;
    width: 100%;
    top: 50px;
    bottom: 0px;
    background-color: #f3f3f3;
}


/*公用*/

.f-fs-22 {
    font-size: 22px;
}

.z-cursor {
    cursor: pointer;
}


/*图标*/

.g-paddingr-0 {
    padding-right: 0;
}

.g-paddingr-8 {
    padding-right: 8px;
}

.color-round {
    color: #8492a6;
}

.color-video {
    color: #20a0ff;
}


/*主题*/

.f-fs-14 {
    font-size: 14px;
}

.color-subject {
    color: #2196f3;
}

.color-subject:hover {
    color: #20cbf3;
}

.color-subject:active {
    color: #2196f3;
}


/*会控*/

.color-control {
    color: #2196f3;
    padding-top: 2px;
}

.color-control:hover {
    color: #20cbf3;
}

.color-control:active {
    color: #2196f3;
}


/*删除*/

.color-delete {
    color: #2196f3;
    padding-left: 15px;
    padding-top: 2px;
}

.color-delete:hover {
    color: #20cbf3;
}

.color-delete:active {
    color: #2196f3;
}


/*弹窗*/

.dialog-delete {
    width: 1000px;
    margin: auto auto;
    text-align: center;
}

.btn-padding {
    margin: 1.5em 1em;
}


/*分页*/

.page {
    text-align: right;
    border: 1px solid #e6e6e6;
    border-top: 0;
    margin-left: 0!important;
    margin-right: 0!important;
    height: 53px;
    .u-pagination {
        padding-right: 10px;
        padding-top: 10px;
    }
}
</style>
