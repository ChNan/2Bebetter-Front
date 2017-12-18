<template>
    <div class="s-hr">
        <!--第一行-->
        <div>
            <!--主题-->
            <div class="f-fl f-fs-18 tal font-fam  g-title color-title" :title="dataListUp.Desc.subject">{{ dataListUp.Desc.confType == 'VMN'? dataListUp.Desc.org_displayName+$t('controlDetail.meetnow.videoConf') : dataListUp.Desc.subject}}</div>
            <!--锁-->
            <div class="f-fr g-height-24">
                <div class="icon iconfont icon-biglock f-fr  f-fs-24 s-bgc-red " v-if="dataListUp.State.policy == '1'"></div>
            </div>
        </div>
        <!--第二行-->
        <div class="f-cb g-col-two g-paddingt-20 g-paddingb-20 font-fam color-col-two f-fs-14 f-tal">
            <!--左侧-->
            <div class="f-fl s-left">
                <!--会议号码-->
                <div class="f-fl  g-paddingr-37">{{$t("controlDetail.id")}}{{dataListUp.Desc.confNumber}}</div>
                <!--会议密码-->
                <div class="f-fl  g-paddingr-37">{{$t("controlDetail.password")}}{{dataListUp.Desc.attendeePin || $t("controlDetail.none")}}</div>
                <!--会议时间-->
                <div class="f-fl  g-paddingr-37" >{{$t("controlDetail.time")}}
                  <span >{{confTime || parseZone(dataListUp.Desc._startTime)}}<span style="padding-left: 6px" v-if="confTime !=null">{{utc}}</span></span>

                </div>
                <!--会议模式-->
                <div class="f-fl  g-paddingr-37">{{$t("controlDetail.mode")}}{{$t('controlDetail.'+dataListUp.Desc.profile)}}</div>
            </div>
            <!--右侧-->
            <div class="f s-right">
                <!--持续时间-->
                <div class="f-fr g-ing g-paddingl-24">{{$t("controlDetail.duration")}}
                    <span class="f-fc" v-if="dataListUp.Desc.startTime">
                        <span v-if="date.text==='ongoing'">
                            <span v-if="date.day!==0">{{date.day}}{{$t("controlDetail.day")}}</span>
                            <span>{{date.hour}}:{{date.minute}}:{{date.second}}</span>
                        </span>
                        <span v-else-if="date.text==='ready'">
                            <span>{{$t("controlDetail."+date.text)}}</span>
                            <span v-if="date.day!==0">{{date.day}}{{$t("controlDetail.day")}}</span>
                            <span v-if="date.hour!=='00'">{{date.hour}}{{$t("controlDetail.hour")}}</span>
                            <span v-if="date.hour==='00'&&date.minute!=='00'">{{date.minute}}{{$t("controlDetail.minute")}}</span>
                            <span v-if="date.hour==='00'&&date.minute==='00'">{{date.second}}{{$t("controlDetail.second")}}</span>
                        </span>
                        <span v-else>00:00:00</span>

                    </span>
                    <span class="f-fc" v-if="!dataListUp.Desc.startTime">00:00:00</span>
                </div>
                <!--观众数量-->
                <div class="f-fr f-viewer g-paddingl-24" v-if="audienceEnable">{{$t( 'controlDetail.audiencec')}}
                    <span class="f-fc">{{viewerLength}}</span>
                </div>
                <!--当前人数-->
                <div class="f-fr ">{{$t("controlDetail.participants")}}
                    <span class="f-fc">{{dataListUp.Users.participant}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import moment from "moment";
    export default {
        data(){
            return{
                viewerLength:0,//观众的数量
                showTime:'',//显示开始时间和结束时间
                utc:'',//时区
                confTime:"",//将0时的时间根据时区转换后的时间
                timer:'',//计时器
                startTimeComputed:0,//会议的开始时间转换后
                date:{
                    text:'',
                    day:'',
                    hour:'',
                    minute:'',
                    second:'',
                },//放置计时器的数据
                serverTime: null
            }
        },
        props: ['dataListUp','audienceEnable'],
        watch: {
            'dataListUp': {
                deep: true,
                handler: function(value) {
                    this.countTime;
                    this.changTime();//转换开始时间结束时间
                    this.getTimeAndZone();//获取时区
                    if(this.dataListUp.nowTime)
                        this.serverTime = new Date( this.dataListUp.nowTime.replace(/-/g , '/') ).getTime()
                    this.getViewerLength();
                }
            }
        },
        created(){
            if(this.dataListUp.nowTime)
                this.serverTime = new Date( this.dataListUp.nowTime.replace(/-/g , '/') ).getTime()
        },
        mounted(){
            this.changTime();//转换开始时间结束时间
            this.getTimeAndZone();//获取时区
            this.timer=setInterval(()=>{
                this.countTime();//计算持续时间
                this.serverTime += 1000
            },1000);//启动计时器
        },
        methods:{
            /**
             *获取当前人数
             */
            getViewerLength(){
                this.viewerLength = 0;
                for (let i = 0; i < this.dataListUp.Users.user.length; i++) {
                    if (this.dataListUp.Users.user[i].rolesPri === 'castviewer') {
                        this.viewerLength++;
                    }
                }
                return this.viewerLength;
            },
            /**
             * 获取时区
             */
            getTimeAndZone(){
                //获取当前时区
                var utcOffset=moment().utcOffset();//获取偏移量
                //根据偏移量获取时区
                this.utc="UTC"+this. getTimezoneNum(utcOffset);
            },
            getTimezoneNum(utcOffset){
                let val = Math.abs(parseInt(utcOffset/60))<10 ? "0":"";
                if(utcOffset<0){
                    return this.formatHour(utcOffset,"-"+val)+":"+this.formatMin(utcOffset)
                }else if (utcOffset>0){
                    return  this.formatHour(utcOffset,"+"+val)+":"+this.formatMin(utcOffset)
                }else if(this.utcOffset===0){
                    return "Z"
                }
            },
            formatMin(utcOffset) {
                return this.formatToDouble(Math.abs(utcOffset)%60);
            },
            formatToDouble (num){
                return Number(num) < 10 ? "0" + num : String(num);
            },
            formatHour(utcOffset,dir) {
                return utcOffset/60>-10
                    ?dir+Math.abs(parseInt(utcOffset/60))
                    :dir+Math.abs(parseInt(utcOffset/60))
            },
            /**
             * 转换开始时间，结束时间
             */
            changTime(){
                //-----TODO  还需考虑即时会议的情况
                if(!this.dataListUp.Desc.startTime|| !this.dataListUp.Desc.expiryTime){
                    this.confTime="";
                    return;
                }
                var stime=new Date(moment.utc(this.dataListUp.Desc.startTime).format()).valueOf();
                var etime=new Date(moment.utc(this.dataListUp.Desc.expiryTime).format()).valueOf();
                this.confTime=this.showChangeTime(stime, etime);
            },
            showChangeTime(start,end){
                if(!moment(start).isSame(end, 'year')){
                    return this.getFormatTime(start,end,'YYYY/MM/DD HH:mm');
                }
                if(!moment(start).isSame(end, 'month') || !moment(start).isSame(end, 'day')){
                    return this.getFormatTime(start,end,'MM/DD HH:mm');
                }
                if(moment(start).isSame(end, 'day') && !this.isToday(start)){
                    return moment(start).format('YYYY/MM/DD HH:mm') + " - " + moment(end).format('HH:mm');
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
            toTimeZone(time, offset, format) {
                return moment.utc(time).utcOffset(offset).format(format);
            },
            /**
             * 启动计时器
             */
            countTime(){
                if(this.dataListUp.Desc.confType == 'VMN'){
                    if( this.dataListUp.Desc._startTime ){
                        this.dataListUp.Desc.startTime = this.dataListUp.Desc._startTime;
                    } else{
                        this.dataListUp.Desc.startTime = '';
                        return;
                    }
                }
                // 云会场有人才开始计时
                if(this.dataListUp.Desc.confType == 'VGCM'){
                    if( this.dataListUp.Desc._startTime && this.dataListUp.Users.participant > 0){
                        this.dataListUp.Desc.startTime = this.dataListUp.Desc._startTime;
                    } else{
                        this.dataListUp.Desc.startTime = '';
                        return;
                    }
                }
                this.startTimeComputed=new Date(this.dataListUp.Desc.startTime.replace(/-/g,'/')).getTime();

                var now = this.serverTime;

                if(now>=this.startTimeComputed){
                    //已进行
                    this.date=this.changeCut(now-this.startTimeComputed);
                    this.date.text='ongoing';
                }else{
                    this.date=this.changeCut(this.startTimeComputed-now);
                    this.date.text='ready';
                }

            },
            /**
             *把毫秒转换成天时分秒
             */
            changeCut(total){
                var date= new Object();
                date.day=Math.floor(total/(24*3600*1000))
                //计算出小时数
                var leave1=total%(24*3600*1000)    //计算天数后剩余的毫秒数
                date.hour=Math.floor(leave1/(3600*1000))
                //计算相差分钟数
                var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
                date.minute=Math.floor(leave2/(60*1000))
                //计算相差秒数
                var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
                date.second=Math.round(leave3/1000)
                if(date.hour<10){
                    date.hour="0"+date.hour;
                }
                if(date.minute<10){
                    date.minute="0"+date.minute;
                }
                if(date.second<10){
                    date.second="0"+date.second;
                }
                return date;
            },
            // 时区转化
            parseZone(time) {
                time = new Date(moment.utc(time).format()).valueOf()
                return moment.utc(time).utcOffset(moment().utcOffset()).format('YYYY/MM/DD HH:mm')
            }

        },
        destroyed: function() {
            clearInterval(this.timer);
        }
    }
</script>
<style lang="scss" scoped="">
    @import 'controlUp.scss';
    @import 'common.scss';
</style>
