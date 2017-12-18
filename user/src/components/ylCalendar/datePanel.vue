<template lang="html">
  <div class="calendar-input-container" v-show="show"
  :class="[isRed ? 'red-theme' : 'blue-theme']"
  :style="containerStyle">
  <transition name="fade">
     <!--日历控件-->
    <div id="calendar" v-show="changeShowCalendar" class="calendar-style"  >
     <!--年月-->
      <div id="calendar-header" class="y-m">
        <span class=" el-icon-caret-left arrow" style="font-size: 14px" @click="subMonth"></span>
        <span id="date-box">
          {{trueSelectYear}}{{$t("schedule.year")}} {{$t( 'schedule.'+trueSelectMonth)}}
        </span>
        <span class=" el-icon-caret-right arrow" style="font-size: 14px" @click="addMonth"></span>
      </div>
        <!-- --星期-- -->
      <div class="week">
        <span v-for="(item, index) in week" :class="{weekend: index % 7 === 0 || index % 7 === 6}">{{$t(item)}}
        </span>
      </div>
      <!--天数-->
      <div class="days">
        <span v-for="(item, index) in renderData"
        :class="{
          weekend: index % 7 === 0 || index % 7 === 6,
          unselect: unselectArr.includes(index),
          select: index === firstDayInWeek + trueSelectDay - 1
        }"
        @click="changeSelectDay(index)">
          <span :class="{today:today == item && selectYear == todayYear && selectMonth == todayMo && !unselectArr.includes(index)}">{{item}}</span>
        </span>
      </div>
      <div v-for="item in items">
            <div class="conf-item-t">
            <span class="conf-item-mon">
             {{showTime(item.startTime,item.endTime).m}}<span style="font-size: 18px;">/{{showTime(item.startTime,item.endTime).d}}</span>
            </span>
            <span class="conf-item-text"v-show="showTime(item.startTime,item.endTime).totomo==='today'">{{$t('schedule.today')}}</span>
            <span class="conf-item-text"v-show="showTime(item.startTime,item.endTime).totomo==='tomo'">{{$t('schedule.tomorrow')}}</span>
            <span class="conf-item-text"v-show="showTime(item.startTime,item.endTime).totomo==='week'">
            {{$t('schedule.'+showTime(item.startTime,item.endTime).week)}}</span>

            </div>
            <div class="conf-item"  >
                <!--时间-->
                <div class="f-w f-s-14-color g-paddingt-15 title-cut cut-width" :title="changeTime(item.startTime,item.endTime)">{{changeTime(item.startTime,item.endTime)}}</div>
                <!--主题-->
                <div class=" f-s-14-color g-paddingt-10 subject-content"  >
                    <i class="icon iconfont icon-Conference_control1  cursorp f-s-14-bcolor f-s-15" @click="showcontrol(item)" v-if="checkControl(item)" :title="$t('schedule.control')"></i>
                    <span class="cursorp title-cut f-s-14-bcolor cut-width "@click="showdetail(item)" :title="item.subject">{{item.subject}}</span>
                </div>
                <!--地点-->
                <div class=" f-s-14-color g-paddingt-10" v-if="item.room">
                    <span class=" title-cut cut-width " :title="item.room">{{item.room}}</span>
                 </div>
                 <!--组织者-->
                <!-- <div class=" f-s-14-color g-paddingt-10" >
                   <span class=" title-cut cut-width ":title="item.organizer">{{item.organizer}}</span>
               </div> -->
             </div>


        </div>
    </div>
<!--firstDayInWeek + trueSelectDay - 1-->
  </transition>
  </div>
</template>
<script>
    import moment from 'moment'
    import * as api from '@/api/schedule/'
    export default {
        name: 'calendar-input',
        props: {
            show: { //是否显示组件
                type: Boolean,
                default: true
            },
            isRed: { //红蓝两种主题可选
                type: Boolean,
                default: false
            },
            limit: { //日期可选范围
                type: Object,
                default () {
                    return {
                        minYear: 1900,
                        minMonth: 1,
                        minDay: 1,
                        maxYear: 2030,
                        maxMonth: 3,
                        maxDay: 20
                    }
                }
            },
            showCalendar: { //是否显示日历
                type: Boolean,
                default: true
            },
            containerStyle: { //组件容器样式
                type: Object
            }
        },
        data() {
            return {
                isfocus: true,
                changeShowCalendar: true,
                date: new Date(),
                today: new Date().getDate(),
                todayMo: new Date().getMonth() + 1,
                todayYear: new Date().getFullYear(),
                week: ['schedule.sun','schedule.mon','schedule.tue','schedule.wed','schedule.thu','schedule.fri','schedule.sat'],
                selectYear: new Date().getFullYear(),
                selectMonth: new Date().getMonth() + 1,
                selectDay: new Date().getDate(),
                params:{
                    "autoCount": true,
                    "confTypes": [
                        "NC",
                        "VSC",
                        "VGCP"
                    ],
                    "data": null,
                    "limit": 2,
                    "orderbys": [
                        {
                            "field": "conferenceTimePattern.conferenceTime.startDateTimeStamp",
                            "order": 1
                        }
                    ],
                    "skip": 0,
                    "states": [
                        "ready",
                        "create",
                        "ongoing"
                    ],
                    "total": 0
                },
                items:[],
            }
        },
        created() {
            this.$on('changeCalendar', (val, zone) => {
                this.selectMonth = parseInt(this.toTimeZone(val, zone, "M"));
                this.selectYear = parseInt(this.toTimeZone(val, zone, "YYYY"));
                this.selectDay = parseInt(this.toTimeZone(val, zone, "D"));
                let position = this.lastMonthDay.length > 0 ? this.lastMonthDay.length - 1 : 0;
                this.changeSelectDay(this.renderData.indexOf(parseInt(this.toTimeZone(val, zone, "D")), position))
            })
        },
        mounted() {
            this.$emit('getValue', this.selectValue);
            this.getTwoConference();
        },
        methods: {
            checkControl(item) {
                return (item.confType != 'NC') && (item.status === 'create' || item.status === 'ongoing') && (item.isOrganizer || item.isPresenter)
            },
            getTwoConference(){
                let temArray = [];
                api.twoConference(this.params).then(json=>{
                    if(json.ret > -1){
                        json.data.data.forEach((res)=>{
                            let rooms = '';
                            if (res.rooms && res.rooms.length > 0) {
                                rooms = res.rooms.map((item) => {
                                    return item.name;
                                }).join(",");

                            }
                            let data = {
                                subject: res.conferenceSubject.subject || '',
                                startTime: res.conferenceTimePattern.conferenceTime.startDateTimeStamp,
                                endTime: res.conferenceTimePattern.conferenceTime.endDateTimeStamp,
                                organizer: res.organizer.name || '',
                                confType: res.confType,//会议类型
                                status: res.state,
                                id:res.id,
                                room: rooms,
                                recurrenceId: res.communication && res.communication.conferenceNumber || '',
                                isOrganizer: res.isOrganizer,
                                isPresenter: res.isPresenter
                            }
                            temArray.push(data);
                        })
                        this.items = temArray;
                    }
                    })
            },
              toTimeZone(time, offset, format) {
                return moment.utc(time).utcOffset(offset).format(format);
            },
            /**
             * 时间戳的转换
             * @param start
             * @param end
             * @returns {string}
             * 规则：跨年就显示2017/08/23 15:00-2018/09/24 15:30
             *       跨月就显示08/23 15:00 - 09/23 15:30
             *       跨日就显示08/23 15:00 - 08/24 15:30
             *       同一天就显示08/23 15:00-15:30
             *       若是今天就显示 15:00-15：30
             */
            changeTime(start,end){
                if(!moment(start).isSame(end, 'year')){
                    return this.getFormatTime(start,end,'YYYY/MM/DD HH:mm');
                }
                if(!moment(start).isSame(end, 'month') || !moment(start).isSame(end, 'day')){
                    return this.getFormatTime(start,end,'MM/DD HH:mm');
                }
                if(moment(start).isSame(end, 'day') && !this.isToday(start)){
                    return moment(start).format('MM/DD HH:mm') + " - " + moment(end).format('HH:mm');
                }
                if(this.isToday(start) && this.isToday(end)){
                    return this.getFormatTime(start,end,'HH:mm');
                }
            },
            getFormatTime(start,end,format){
             return this.toTimeZone(start, moment().utcOffset(),format) + " - " + this.toTimeZone(end, moment().utcOffset(), format);
            },
            isToday(value){
                return  new Date().toDateString() == new Date(value).toDateString();
            },
            /**
             *是否显示头部块
             * @param start
             * @param end
             * @returns {*}
             */

            showTime(start,end,index){
                //转换数据
                var now=new Date().valueOf();
                let s =this.commontime(start);
                let e =this.commontime(end);
                let n = this.commontime(now);
//                    获取前天的23:59：59的时间
                let preTime=new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1-24*3600000 ).valueOf();
//                    获得今天23:59:59的时间
                let time =new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1).valueOf();
//                    获取明天23:59:59的时间
                let tomoTime=new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1+24*3600000).valueOf();
//                    //不是今天明天
                if(start>preTime&&start<=tomoTime){
                    if(start>preTime&&start<=time){
                        s.totomo='today';
                    }
                    if(start>time&&start<=tomoTime){
                        s.totomo='tomo';
                    }
                }
                else{
                    s.totomo='week';
                }
                    return s||''
            },
//            公用：获取今天，明天，后天的时间
            commontime(time){
                var times = new Date(parseInt(time));
                let content = new Object();
                //开始时间的获取
                content.y=times.getFullYear();
                content.m=times.getMonth()+1;
                content.d=times.getDate();
                content.h=times.getHours();
                content.min=times.getMinutes();
                content.week='';
                switch (times.getDay()) {
                    case 0:content.week="sunq";break
                    case 1:content.week="monq";break
                    case 2:content.week="tueq";break
                    case 3:content.week="wedq";break
                    case 4:content.week="thuq";break
                    case 5:content.week="friq";break
                    case 6:content.week="satq";break
                }
                content.m=this.checkTime(content.m);
                content.d=this.checkTime(content.d);
                content.h=this.checkTime(content.h);
                content.min=this.checkTime(content.min);
                return content;
            },
            checkTime(time){
                if(time<10){
                    time= "0"+time;
                }
                return time;
            },
            showdetail(item){
              let path = item.confType === "NC"
                    ? '/meeting/index/meetingDetail' //预约会议室详情
                    : '/meeting/index/reservationDetail';//预约视频会议详情
                //console.log(item)
                this.$router.push({ path: path, query: { id: item.id } })
            },
            showcontrol(item){
                this.$router.push({ path: '/meeting/index/ControlList', query: { confNum: item.recurrenceId } })
                //this.$router.push({path:'/meeting/index/control'})
            },
            focus() {
                this.isfocus = !this.isfocus;
                this.changeShowCalendar = !this.changeShowCalendar;
            },
            toTimeZone(time, offset, format) {
                return moment.utc(time).utcOffset(offset).format(format);
              // return moment(time).format(format);
            },
            subMonth() {
                if (this.selectMonth === 1) {
                    this.selectMonth = 12;
                    this.selectYear -= 1;
                } else {
                    this.selectMonth -= 1
                }
                if (this.selectYear < this.limit.minYear) this.selectYear = this.limit.minYear;
                if (this.selectYear === this.limit.minYear) {
                    if (this.selectMonth <= this.limit.minMonth) {
                        this.selectMonth = this.limit.minMonth;
                    }
                }
                this.$emit('changeSelectDay', moment(new Date(this.selectYear, this.selectMonth - 1, this.selectDay, moment().format('HH'), moment().format('mm'))).valueOf());

            },
            addMonth() {
                if (this.selectMonth === 12) {
                    this.selectMonth = 1;
                    this.selectYear += 1;
                } else {
                    this.selectMonth += 1
                }
                if (this.selectYear > this.limit.maxYear) this.selectYear = this.limit.maxYear;
                if (this.selectYear === this.limit.maxYear) {
                    if (this.selectMonth >= this.limit.maxMonth) {
                        this.selectMonth = this.limit.maxMonth;
                    }
                }
                this.$emit('changeSelectDay', moment(new Date(this.selectYear, this.selectMonth - 1, this.selectDay, moment().format('HH'), moment().format('mm'))).valueOf());
            },
            changeSelectDay(index) {
                if (this.unselectArr.includes(index)) return false;
                this.selectDay = index - this.firstDayInWeek + 1;
                this.$emit('changeSelectDay', new Date(this.selectYear, this.selectMonth - 1, this.selectDay, moment().format('HH'), moment().format('mm'), moment().format('ss')).valueOf());
            }
        },
        computed: {
            trueSelectYear: function() {
                if (this.selectYear < this.limit.minYear) return this.limit.minYear;
                if (this.selectYear > this.limit.maxYear) return this.limit.maxYear;
                return this.selectYear;
            },
            trueSelectMonth: function() {
                if (this.selectYear === this.limit.minYear && this.selectMonth < this.limit.minMonth) return this.limit.minMonth;
                if (this.selectYear === this.limit.maxYear && this.selectMonth > this.limit.maxMonth) return this.limit.maxMonth;

                return this.selectMonth;
            },
            trueSelectDay: function() {

                if (this.selectYear === this.limit.minYear && this.selectMonth === this.limit.minMonth && this.selectDay < this.limit.minDay) return this.limit.minDay;
                if (this.selectYear === this.limit.maxYear && this.selectMonth === this.limit.maxMonth && this.selectDay > this.limit.maxDay) return this.limit.maxDay;
                if (this.selectDay > this.dayCount) return this.dayCount;
                return this.selectDay;
            },
            selectValue: function() {
                return `${this.trueSelectYear}-${this.trueSelectMonth}-${this.trueSelectDay}`;
            },
            firstDayInWeek: function() {
                return new Date(this.trueSelectYear, this.trueSelectMonth - 1, 1).getDay();
            },
            dayCount: function() {
                return new Date(this.trueSelectYear, this.trueSelectMonth, 0).getDate();
            },
            lastMonthDay: function() {
                let lastNum = this.firstDayInWeek;
                let lastDays = [];
                if (lastNum === 0) return lastDays;
                let i = 0;
                let lastDayNum = new Date(this.trueSelectYear, this.trueSelectMonth - 1, 0).getDate();
                for (; i < lastNum; i++) {
                    lastDays.unshift(lastDayNum);
                    lastDayNum--;
                }
                return lastDays;
            },
            nextMonthDay: function() {
                let num = 42 - this.firstDayInWeek - this.dayCount;
                let nextDays = [];
                if (num === 0) return nextDays;
                let i = 1;
                for (; i <= num; i++) {
                    nextDays.push(i);
                }
                return nextDays;
            },
            renderData: function() {
                let nowDays = [];
                let i = 1;
                for (; i <= this.dayCount; i++) {
                    nowDays.push(i);
                }
                return [...this.lastMonthDay, ...nowDays, ...this.nextMonthDay];

            },
            unselectArr: function() {
                let index = 0;
                let arr = [];
                if (this.trueSelectYear === this.limit.minYear && this.trueSelectMonth === this.limit.minMonth) {
                    for (; index < this.firstDayInWeek + this.limit.minDay - 1; index++) {
                        arr.push(index);
                    }
                } else {
                    for (; index < this.firstDayInWeek; index++) {
                        arr.push(index)
                    }
                }
                if (this.trueSelectYear === this.limit.maxYear && this.trueSelectMonth === this.limit.maxMonth) {
                    index = this.firstDayInWeek + this.limit.maxDay;
                    for (; index < 42; index++) {
                        arr.push(index);
                    }
                } else {
                    index = this.firstDayInWeek + this.dayCount;
                    for (; index < 42; index++) {
                        arr.push(index);
                    }
                }
                return arr;
            }
        },
        watch: {
            selectValue: function(newVal) {
                this.$emit('getValue', newVal);
            }
        },

    }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import 'datePanel.scss';
</style>
