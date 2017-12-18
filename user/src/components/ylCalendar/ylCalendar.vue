<template>
    <div class="">
        <!--选项隐藏-->
        <!-- ---日历---- -->
        <datepanel @changeSelectDay="getDays" ref="datepanel">
        </datepanel>
        <!-- ---日程表----- -->
        <div class="yl-container">
            <div class="fc fc-unthemed fc-ltr">
                <!--上方-->
                <div class="fc-toolbar fc-header-toolbar" style="padding-bottom: 30px; ">
                    <!--左侧时间-->
                    <div style="text-align:left">
                        <i class="el-icon-caret-left" style="padding-top: 12px;" @click="lastWeek()"></i>
                        <i class="el-icon-caret-right" style="padding-top: 12px;" @click="nextWeek()"></i>
                        <span style="padding-top: 10px;">{{selectYears}} - {{selectYeard}}</span>
                    </div>
                    <!--右侧按钮-->
                    <div style="float: right; ">
                        <el-button type="primary" @click="gotoConfVideo">
                            <div>
                                <div style="font-size: 14px">{{$t("schedule.video")}}</div>
                            </div>
                        </el-button>
                        <el-button type="primary" @click="meetRoom">
                            <div>
                                <div style="font-size: 14px">{{$t("schedule.meet")}}</div>
                            </div>
                        </el-button>
                    </div>
                </div>
                <!--下方-->
                <div class="fc-view-container">
                    <div class="fc-view fc-agendaWeek-view fc-agenda-view">
                        <table>
                            <thead class="fc-head">
                                <tr>
                                    <td class="fc-head-container fc-widget-header">
                                        <div class="fc-row fc-widget-header" style="border-right-width: 1px; margin-right: 16px;">
                                            <table>
                                                <thead>
                                                    <!--星期-->
                                                    <tr>
                                                        <th class="fc-axis fc-widget-header" style="width: 43px;"></th>
                                                        <th class="fc-day-header fc-widget-header fc-past fc-day-header-other" :class="{'fc-highlight':index === chooseDay}" v-for="(itm,index) in week">
                                                            <div class="yl-padding20">{{$t(itm)}}</div>
                                                        </th>
                                                    </tr>
                                                    <!--日 TODO 还需再加个月-->
                                                    <tr>
                                                        <th class="fc-axis fc-widget-header" style="width: 43px;"></th>
                                                        <th class="fc-day-header fc-widget-header fc-past" v-for="(itm,index) in dayList">
                                                            <div class="yl-padding20">{{itm}}</div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            </thead>
                            <!--控件的表格部分-->
                            <tbody class="fc-body">
                                <tr>
                                    <td class="fc-widget-content">
                                        <div class="fc-scroller fc-time-grid-container" id ="fcscroller" style="overflow-x: hidden; overflow-y: scroll; height: 602px;">
                                            <div class="fc-time-grid fc-unselectable">
                                                <!--第一行-->
                                                <div class="fc-bg">
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <td class="fc-axis fc-widget-content" style="width: 43px;"></td>
                                                                <td v-for="(item,index) in week" class="fc-day fc-widget-content fc-past" :key="index"></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <!--第一列-->
                                                <div class="fc-slats">
                                                    <table>
                                                        <tbody>
                                                            <tr v-for="it in 48" :class="{'fc-minor':it%2 == 0,'calendar-highlight':computeTime == it}" :key="it">
                                                                <td style="width: 43px;" class="fc-axis fc-time fc-widget-content" :id="it">
                                                                    <span v-if="(it-1)%2 == 0">
                                                                        <span v-if="it<=19">0{{(it-1)/2}}</span>
                                                                        <span v-else>{{(it-1)/2}}</span>:00</span>
                                                                </td>
                                                                <td class="fc-widget-content"></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <!--弹出卡片-->
                                                <div class="fc-content-skeleton">
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <td class="fc-axis" style="width: 43px;"></td>
                                                                <td v-for="(it,index) in weekPlan" :colspan="it" v-if="it!=null" :key="index">
                                                                    <eventcard v-if="typeof planList[index] !== 'undefined'" :planDetail="planList[index]"></eventcard>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import moment from 'moment'
import datepanel from '@/components/ylCalendar/datePanel'
import eventcard from '@/components/ylCalendar/eventCard'

export default {
    name: 'ylcalendar',
    props: {
        dataList: {
            type: Array
        }
    },
    components: {
        datepanel,
        eventcard
    },
    data() {
        return {
            week: ['schedule.sunq', 'schedule.monq', 'schedule.tueq', 'schedule.wedq', 'schedule.thuq', 'schedule.friq', 'schedule.satq'],
            timeList: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sun'],
            dayList: [],
            weektest: [],
            timestep: [],
            changeFlag: 0,
            chooseDay: 2,
            isToday: true,
            weekPlan: [1, 1, 1, 1, 1, 1, 1],
            testData: [],
            planList: [],
            selectYears: '',
            selectYeard: '',
            limitEndTime: -1,
            limitStartTime: -1,
            zoneValue: '',
            timeZone: moment().utcOffset()
        }
    },
    mounted(){
        $('#fcscroller').scrollTop(438)
    },
    created() {
        //    this.testData = typeof this.dataList === "undefined" ? [] : this.dataList;
        let lang = localStorage.getItem('LANGUAGE') || window.navigator.language || 'zh-CN';
        moment.locale(lang);
        this.getDays();
       // this.iniPlanList();
    },
    watch: {
        dataList: {
            deep: true,
            handler: function(val) {
                this.testData = !val ? [] : val;
                //console.log(this.testData);
                this.iniPlanList();
            }
        }
    },
    computed: {
        computeTime: {
            cache: false,
            get: function() {
                let h = parseInt(this.toTimeZone(new Date().valueOf(), this.timeZone, "HH")) * 2;
                let s = parseInt(this.toTimeZone(new Date().valueOf(), this.timeZone, "mm"));
                if (s == 0) {
                    return h;
                } else {
                    return s > 30 ? h + 2 : h + 1;
                }

            }
        }
    },
    methods: {
        //      链接到预约视频会议
        gotoConfVideo: function() {
            this.$router.push({
                path: '/meeting/index/reservation'
            })
        },
        //      链接到预约会议室
        meetRoom: function() {
            this.$router.push({
                path: '/meeting/index/room'
            })
        },
        //      下一周
        nextWeek() {
            this.changeFlag = 0;
            let ds = moment(this.limitEndTime).add(7, 'days').valueOf();
            this.$refs.datepanel.$emit('changeCalendar', ds, this.timeZone);
            this.getDays(ds);
            // this.iniPlanList();
            this.shuttlePlanList();
        },
        //      上一周
        lastWeek() {
            this.changeFlag = 0 ;
            let ds = moment(this.limitStartTime).subtract(7, 'days').valueOf();
            this.$refs.datepanel.$emit('changeCalendar', ds, this.timeZone);
            this.getDays(ds);
            this.shuttlePlanList();
        },
        //      点击上一周，下一周时调用（获得开始时间和结束时间）
        shuttlePlanList() {
            //              console.log(this.limitStartTime + "dddss" + this.limitEndTime)
            this.changeFlag = 0;
            this.$emit("getPlans", this.limitStartTime, this.limitEndTime);
        },
        toTimeZone(time, offset, format) {
            return moment.utc(time).utcOffset(offset).format(format);
          // return moment(time).format(format);
        },
        getHours(value){
         return parseInt(value) == 0 ? 1 : parseInt(value);
        },
        isZero(start){
        return parseInt(this.toTimeZone(start, this.timeZone, "HH")) == 0 && parseInt(this.toTimeZone(start, this.timeZone, "mm")) == 0 ;
        },
        getPlanList() {
            this.planList = [];
            this.testData.forEach((item) => {
                let index = parseInt(this.weektest.indexOf(this.toTimeZone(item.startTime, this.timeZone, "DD")));
                let col = parseInt(this.weektest.indexOf(this.toTimeZone(item.endTime, this.timeZone, "DD"))) - index + 1;
                let start = parseInt(this.toTimeZone(item.startTime, this.timeZone, "HH")) == 0 ? 0 : null;
                let end = null;
          
                    if (this.isZero(item.endTime)) {
                        end = 48;
                    } else {
                        end = parseInt(this.toTimeZone(item.endTime, this.timeZone, "mm")) == 0 ? this.getHours(this.toTimeZone(item.endTime, this.timeZone, "HH")) * 2 - 1 : null;
                    }
                    if (start == null) {
                        start = parseInt(this.toTimeZone(item.startTime, this.timeZone, "mm")) >= 30 ?
                            parseInt(this.toTimeZone(item.startTime, this.timeZone, "HH")) * 2 + 1 :
                            parseInt(this.toTimeZone(item.startTime, this.timeZone, "HH")) * 2;
                    }
                    if (end == null) {
                        end = parseInt(this.toTimeZone(item.endTime, this.timeZone, "mm")) > 30 ?
                            parseInt(this.toTimeZone(item.endTime, this.timeZone, "HH")) * 2 + 1 :
                            parseInt(this.toTimeZone(item.endTime, this.timeZone, "HH")) * 2;
                    }
                    let cross = moment(new Date(item.endTime).setHours(0, 0, 0, 0)).diff(new Date(item.startTime).setHours(0, 0, 0, 0), 'days');
                    // if (cross == 1 && this.isZero(item.endTime)) {
                    //     cross = 0;
                    // }
                    if (cross > 0) {
                        this.checkFlag(index, this.getDetailData(start, 48 - start, item.detail));
                        while (cross-- > 1) {
                            this.checkFlag(index + cross, this.getDetailData(0, 48, item.detail))
                        }
                        this.checkFlag(index + col - 1, this.getDetailData(0, end + 1, item.detail));
                    } else {
                        this.checkFlag(index, this.getDetailData(start, end - start + 1, item.detail));
                    }
              

            });

        },
        getDetailData(start, end, detail) {
            let sTop = 0, sb = 0;
            let id =start + end;
            if(document.getElementById(start)){
                if (start == 0) {
                    start = 1;
                    sTop = document.getElementById(start).offsetTop;
                } else {
                    sTop = document.getElementById(start).offsetTop + document.getElementById(start).offsetHeight
                }
            }
            if(document.getElementById(id)){
                sb = document.getElementById(id).offsetTop + document.getElementById(id).offsetHeight;
            }
            return {
                col: 1,
                startZone: start,
                zone: end,
                title: detail.title,
                time: detail.time,
                position: detail.position,
                speaker: detail.speaker,
                status: detail.status,
                confType: detail.confType,
                id: detail.id,
                password: detail.password,
                round: detail.round,
                planId: detail.planId,
                recurrenceId:detail.recurrenceId,
                patern:detail.patern,
                isOrganizer:detail.isOrganizer,
                isPresenter:detail.isPresenter,
                pTop: sTop,
                pBottom: -sb,
                margin: '0',
                width: '100%'
            }
        },
        checkFlag(index, tempData) {
            if (index != -1) {
                let t = this.changeFlag & (1 << index);
                if (t == 0) {
                    this.changeFlag = (1 << index);
                    if (!this.planList[index]) {
                        this.planList[index] = [];
                        this.planList[index].push(tempData)
                    } else {
                        this.planList[index].push(tempData)
                    }
                } else {
                    if(this.planList[index]){
                        this.planList[index].push(tempData);
                    }else{
                        this.planList[index]=[];
                        this.planList[index].push(tempData)
                    }
                    //this.planList[index] && this.planList[index].push(tempData);
                }
            }
        },
        //日历中选择的天
        getDays(ctime) {
          
            let tempDaylist = [],
                n, ndate;
            let test = [];
            this.isToday = moment(ctime).format("DD") == moment().format("DD") ? true : false;
         
            if (typeof ctime === "undefined") {
                n = moment().format("d");
                ndate = new Date().valueOf();
                this.isToday = true;
            } else {
                n = moment(ctime).format("d");
                ndate = ctime;
            }
            n = parseInt(n);
            n = n % 7;
            //this.timestep = [];
            for (let i = 0; i < 7; i++) {

                let tmp = ndate + (i - n) * 86400000;
                this.timestep[i] = tmp;
                tempDaylist[i] = this.toTimeZone(tmp, this.timeZone, "MM/DD");
                // this.toTimeZone(tmp, this.timeZone, "DD");
                test[i] = this.toTimeZone(tmp, this.timeZone, "DD");
                //this.toTimeZone(tmp, this.timeZone, "DD");
            }
            //获得日
            this.dayList = tempDaylist;
            this.chooseDay = this.dayList.indexOf(this.toTimeZone(ndate, this.timeZone, "MM/DD"));
            //      左上角年的显示
            this.selectYears = this.toTimeZone(this.timestep[0], this.timeZone, "LL");
            this.selectYeard = this.toTimeZone(this.timestep[6], this.timeZone, "LL");
            this.limitEndTime = moment({
                y: new Date(this.timestep[6]).getFullYear(),
                M: new Date(this.timestep[6]).getMonth(),
                d: new Date(this.timestep[6]).getDate(),
                h: 23,
                m: 59,
                s: 59,
                ms: 59
            }).valueOf();
            this.limitStartTime = moment({
                y: new Date(this.timestep[0]).getFullYear(),
                M: new Date(this.timestep[0]).getMonth(),
                d: new Date(this.timestep[0]).getDate()
            }).valueOf();
            this.weektest = test;
            //this.changeFlag = 0;
            this.shuttlePlanList();
        },
        checkAllowDate(item) {
            if (item.endTime < this.limitStartTime) {
                return false;
            }
            if (item.startTime > this.limitEndTime) {
                return false;
            }
            return true;
        },

        iniPlanList() {
            for (let i = 0; i < 7; i++) {
                this.weekPlan[i] = 1;
            }
            let allowData = this.testData.filter((item) => {
                if (this.checkAllowDate(item)) {
                    if (item.endTime > this.limitEndTime) {
                        //console.log(moment(item.endTime).format('YYYY/MM/DD'),moment(this.limitEndTime).format('YYYY/MM/DD HH:mm'))
                        item.endTime = this.limitEndTime;
                        //  item.endTime - Math.ceil((item.endTime - this.limitEndTime) / 86400000) * 86400000;
                    }
                    if (item.startTime < this.limitStartTime) {
                        item.startTime = this.limitStartTime;
                        //item.startTime + Math.ceil((this.limitStartTime - item.startTime) / 86400000) * 86400000;
                    }
                    return true;
                } else {
                    return false;
                }
            });
            this.testData = allowData;
            this.getPlanList();
        },
        //      改变时区
        changeTimeZone() {
            for (let item of this.zoneJson) {
                if (item._id === this.zoneValue) {
                    this.timeZone = item.utcOffset / 60;
                    this.$refs.datepanel.$emit('changeCalendar', new Date().valueOf(), this.timeZone);
                    this.chooseDay = this.dayList.indexOf(this.toTimeZone(new Date().valueOf(), this.timeZone, "DD"));
                    this.iniPlanList();
                    return;
                }

            }
        },
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import 'fullcalendar.css';
.yl-container {
    margin-left: 230px;
    margin-top: -20px;
}

.yl-padding20 {
    padding: 10px;
}

::-webkit-scrollbar {
    width: 17px;
}

::-webkit-scrollbar-track {
    // -webkit-border-radius: 5px;
    // border-radius: 5px;
    background: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb {
    // -webkit-border-radius: 5px;
    // border-radius: 5px;
    background: rgba(0, 0, 0, 0.2);
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.4);
}

::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(0, 0, 0, 0.05);
}

</style>
