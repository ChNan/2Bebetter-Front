<template>
    <div class="s-bg">
        <!--导航条-->
        <top-bar :title="$t('homepage.platform')" :line="true" :account="true"></top-bar>
        <!--主页-->
        <div class="g-homepage-page">
            <div class="g-homepage-pannel top nomal">
                <div class="homepage-panel--body">
                    <!-- --左模块-- -->
                    <div class="g-left-homepage" style="position: relative" >
                        <!--预约视频会议-->
                        <div class="img-video g-bottom-shadow g-positionr" v-on:click="gotoConfVideo"   >
                            <div class="img-location" >
                                    <img src="../assets/img/homepage/video.png"/>
                                    <div>{{$t("homepage.video")}}</div>
                            </div>
                        </div>
                        <!--加入会议-->
                        <div class="img-join g-bottom-shadow g-positionr" v-on:click="joinConf">
                            <div class="img-location">
                                <img  src="../assets/img/homepage/joinMeet.png" />
                                <div>{{$t("homepage.join")}}</div>
                            </div>
                        </div>
                        <!--视频会议控制-->
                        <div class="img-control g-bottom-shadow g-positionr g-position-control" v-on:click="confControl"  >
                            <span class="g-control">{{controlConf}}</span>
                            <div class="img-location" >
                                <img   src="../assets/img/homepage/control.png"/>
                                <div>{{$t("homepage.control")}}</div>
                            </div>
                        </div>
                    </div>
                    <!-- --右模块-- -->
                    <div class="g-right-homepage">
                        <!-- --预约会议室-- -->
                            <!--可使用-->
                            <div class="img-meetRoom g-bottom-shadow g-positonr "v-show="!forbidMeetRoom" v-on:click="meetRoom" >
                                <div class="img-location-two">
                                    <img  src="../assets/img/homepage/meetRoom.png" />
                                    <div>{{$t("homepage.meet")}}</div>
                                </div>
                            </div>
                            <!--不可使用-->
                            <div class="img-meetRoom-forbid g-bottom-shadow g-positonr "  v-show="forbidMeetRoom" :title="$t('homepage.tip')">
                                <div class="img-location-two">
                                    <img  src="../assets/img/homepage/meetRoom.png" />
                                    <div>{{$t("homepage.meet")}}</div>
                                </div>
                            </div>
                        <!-- --近期会议-- -->
                            <div class="g-recentMeet g-bottom-shadow">
                                <!--最近会议头部-->
                                <div class="g-recent-hd">
                                    <span class="f-fl" >{{$t("homepage.recent")}}</span>
                                    <div class="f-fr z-cursor more-color  " v-on:click="conferences">{{$t("homepage.more")}}&gt;&gt;</div>
                                </div>
                               <!--会议模块显示-->
                                <div class="g-recent-bd">
                                    <!--有会议时-->
                                        <div class="g-item" v-for="item in items">
                                           <div class="g-item-height" >
                                               <!--左-->
                                               <div class="g-item-left">
                                                   <div class="f-fw"> {{showTime(item.startTime,item.endTime).m}}/<span class="f-fs-20">{{showTime(item.startTime,item.endTime).d}}</span></div>
                                                   <div v-show="showTime(item.startTime,item.endTime).totomo==='tomo'"  class="f-fw">{{$t("homepage.tomorrow")}}</div>
                                                   <div v-show="showTime(item.startTime,item.endTime).totomo==='today'"  class="f-fw">{{$t("homepage.today")}}</div>
                                               </div>
                                               <!--右-->
                                               <div class="g-item-right" v-on:click="confItem(item)" :class="{ing:item.processing}">
                                                   <!--行1-->
                                                   <div  class="g-col-one" >
                                                       <div class="f-fl">{{changeTime(item.startTime,item.endTime)}} </div>
                                                       <div class="f-fr g-marginl-80" v-show="item.state==='ongoing'" >{{$t("homepage.process")}}</div>
                                                   </div>
                                                   <!--行2-->
                                                   <div class="f-fl g-col-two"  >{{item.subject}}</div>
                                                   <!--行3-->
                                                   <div class="f-fr g-col-three" v-if="item.room">
                                                       <div class="icon iconfont icon-address f-fs-20 f-fl"></div>
                                                       <div class="f-fl meet-location" :title="item.room">{{item.room}}</div>
                                                   </div>
                                               </div>
                                           </div>
                                        </div>
                                    <!--无会议时-->
                                        <div class="g-paddingt-12" v-show="items.length===0" >
                                            <img src="../assets/img/homepage/noConf.png">
                                           <div class="f-fs-14" >{{$t("homepage.noconf")}}</div>
                                        </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .g-bottom-shadow{
        box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.6);
    }
    .meet-location{
        width: 140px;
        line-height: 24px;
        padding-left: 2px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .s-bg {
        height: 100%;
        width: 100%;
        background: url("../assets/img/bg.jpg");
        background-size: cover;
        background-position: 50%;
    }
    .nomal {
        transform: translateY(-80%);
        width: 450px;
    }
    .small {
        width: 400px;
        height: 30PX
    }
    .large {
        transform: translateY(-70%);
        width: 600px;
    }
    .f-fs-14{font-size: 14px}
    .f-fs-20{font-size: 20px;}
    .g-paddingt-12{padding-top: 12%;}
    /*登陆后主页面的显示*/
    .g-homepage-page {
        position: absolute;
        width: 100%;
        top: 60px;
        bottom: 0px;
        /*显示块的位置*/
        .g-homepage-pannel {
            text-align: center;
            border-radius: 6px;
            width: 60%;
            height: 64%;
            margin: 0 auto;
            position: relative;
            transform: translateY(24%);
            /*登陆面板*/
            .homepage-panel--body {
                height:100%;
                min-width: 818px;
                min-height: 445px;
                max-height: 658px;
                color: #fff;
                font-size: 16px;
                /*左面板*/
                .g-left-homepage{
                    width: calc(33.3% - 8px);
                    margin-right: 8px;
                    height:100%;
                    float:left;
                    .g-positionr{
                        position: relative;
                    }
                    .img-location{
                        position:absolute;
                        left:50%;
                        top:50%;
                        -ms-transform:translate(-50%,-50%);
                        transform:translate(-50%,-50%);
                        width: 80%;

                        div {
                            line-height: 24px;
                        }
                    }
                    /*预约视频会议*/
                    .img-video{
                        width:100%;
                        height: calc(33.3% - 8px);
                        margin-bottom: 8px;
                        cursor: pointer;
                        background-color: rgba(55,164,60,0.66);
                        &:hover{
                            background-color: rgba(35,201,43,0.66);
                        }
                        &:active{
                            background-color: rgba(0,189,9,0.66);
                        }
                    }
                    /*加入会议*/
                    .img-join{
                        width:100%;
                        height: calc(33.3% - 8px);
                        margin-bottom: 8px;
                        cursor: pointer;
                        background-color: rgba(5,150,238,0.66);
                        &:hover{
                            background-color: rgba(0,186,255,0.66);
                        }
                        &:active{
                            background-color: rgba(0,146,236,0.66);
                        }

                    }
                    /*会议控制*/
                    .img-control{
                        width:100%;
                        height: calc(33.3% - 8px);
                        margin-bottom: 8px;
                        cursor: pointer;
                        background-color: rgba(214,116,29,0.66);
                        &:hover{
                            background-color: rgba(255,135,28,0.66);
                        }
                        &:active{
                            background-color: rgba(221,104,2,0.66);
                        }
                        .g-control{
                            position: absolute;
                            right: 0;top: 0;
                            font-size: 16px;
                            padding-top: 9px;
                            padding-right:9px;
                        }
                    }
                    .g-position-control{
                       position: absolute;
                        bottom: 0px;
                    }


                }
                /*右面板*/
                .g-right-homepage{
                    width:66%;
                    height:100%;
                    float:left;
                    .g-positonr{
                        position: relative;
                    }
                    .img-location-two{
                        position:absolute;
                        left:50%;
                        top:50%;
                        -ms-transform:translate(-50%,-50%);
                        transform:translate(-50%,-50%);

                        div {
                            line-height: 24px;
                        }
                    }
                    /*预约会议室*/
                    .img-meetRoom{
                        width:100%;
                        height: calc(33.3% - 8px);
                        cursor: pointer;
                        margin-bottom: 8px;
                        background-color: rgba(124,75,236,0.66);
                        &:hover{
                            background-color: rgba(155,90,254,0.66);
                        }
                        &:active{
                            background-color: rgba(127,59,229,0.66);
                        }
                    }
                    .img-meetRoom-forbid{
                        width:100%;
                        height: calc(33.3% - 8px);
                        cursor: pointer;
                        margin-bottom: 8px;
                        background-color: #53595e;
                        opacity: 0.66;
                    }
                    .cantuse{
                        background-color: red;
                        opacity: 0.5;
                    }
                    /*最近会议块*/
                    .g-recentMeet{
                        width:100%;
                        height: calc(66.6% - 8px);
                        background-color: rgba(9,144,178,0.66);
                        cursor: default;
                        /*最近会议头部*/
                        .g-recent-hd{
                              padding: 10px 10px 0px 10px;
                                height:calc( 8% - 10px);
                                .z-cursor{
                                    cursor: pointer;
                                }
                                .more-color{
                                    color: #ffffff;
                                }
                                .more-color:hover{
                                    color:#2ce4ff ;
                                }
                                .more-color:active{
                                    color:#004b6a;
                                }
                            }
                        /*最近会议体部*/
                        .g-recent-bd{
                           clear: both;
                            padding: 10px 10px 10px 10px;
                            height: calc(92% - 20px);
                            .g-item{
                               height: calc(33% - 8px);
                               padding-bottom: 8px;
                                .g-item-height{
                                  height: 97%;
                                    .g-item-left{
                                        float: left;
                                        cursor: default;
                                        width:16%;
                                        height:100%;
                                        text-align: left;
                                    }
                                    .g-item-right{
                                        position: relative;
                                        float: left;
                                        padding:10px 10px;
                                        width:calc(84% - 24px);
                                        margin-left:4px;
                                        cursor:pointer;
                                        background-color: rgba(0,0,0,0.1);
                                        height: calc(100% - 20px);
                                        font-size: 14px;
                                        .g-col-one{
                                            height: 30%;
                                            .g-marginl-80{
                                                position: absolute;
                                                width: 11.5em;
                                                right: 0;
                                                text-align: left;

                                                /*margin-right: 80px;*/
                                            }
                                        }
                                        .g-col-two{
                                            text-align:left;
                                            clear: both;
                                            height: 40%;
                                            width:60%;
                                            white-space: nowrap;
                                            overflow: hidden;
                                            text-overflow: ellipsis;
                                        }
                                        .g-col-three{
                                            clear: both;
                                            height: 2em;
                                            width:12em;
                                            position: absolute;
                                            right: 0px;
                                            bottom: 0px;
                                            white-space: nowrap;
                                            overflow: hidden;
                                            text-overflow: ellipsis;
                                            text-align: left;
                                            padding-right:1em;
                                        }
                                    }
                                    .g-item-right:hover{
                                        background-color: rgba(46,243,255,0.2);
                                    }
                                    .g-item-right:active{
                                        background-color: rgba(0,0,0,0.1);
                                    }
                                    .ing{
                                        background-color: rgba(0,0,0,0.2) !important;
                                    }
                                    .ing:hover{
                                        background-color: rgba(46,243,255,0.2)!important;
                                    }
                                    .ing:active{
                                        background-color: rgba(0,0,0,0.1)!important;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

    }
</style>
<script>
    import topBar from '@/components/common/TopBar'
    import * as api from '../api/homepage/'
    export default {
        components: {
            topBar
        },
        data() {
            return {
                loading: false,
                eventFlag: false,
                forbidMeetRoom:false,//是否禁止预约会议室；truewe
                controlConf: 0,//当前可控会议数目
                shown:false,//显示今天
                showt:false,//显示明天
                //向后台请求数据
                params:{
                    "autoCount": true,
                    "confTypes": [
                        "NC",
                        "VSC",
                        "VGCP"
                    ],
                    "data": null,
                    "limit": 3,
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
            };
        },
        mounted(){
            this.getThreeConference();
            this.getCountByStaff();
        },
        methods:{
            /**
             * 从后台获取3个会议数据
             */
            getThreeConference(){
                api.threeConference(this.params).then(json=>{
                    this.items =json.data.data;
                    if(this.items.length!==0){
                        this.items.forEach(res =>{
                            let subject =res.conferenceSubject.subject;
                            let startTime =res.conferenceTimePattern.conferenceTime.startDateTimeStamp;
                            let endTime =res.conferenceTimePattern.conferenceTime.endDateTimeStamp;
                            res.subject=subject;
                            res.startTime=startTime;
                            res.endTime=endTime;
                            var room='';
                            res.rooms.forEach(resRoom=>{
                                room+=resRoom.name;
                                res.room=room;
                            })
                        })
                    }
                })
            },
            /**
             * 时间戳的转换
             * @param start
             * @param end
             * @returns {string}
             */
            changeTime(start,end){
                var now=new Date().valueOf();
//                对时间进行转换
                let stime=this.commontime(start);
                let etime=this.commontime(end);
                let ntime=this.commontime(now);
                // 同一年
                if(stime.y===etime.y&&stime.y===ntime.y){
                    // 同月同日
                    if(stime.m===etime.m&&stime.d===etime.d){
                        if(stime.m===ntime.m&&stime.d===ntime.d){
                            return stime.h+':' +stime.min+'-'+etime.h+ ':' +etime.min;
                        }
                        return stime.m+'/'+stime.d+' '+stime.h+':' +stime.min+'-'+etime.h+ ':' +etime.min;
                    }
                    return stime.m+'/'+stime.d+' '+stime.h+':' +stime.min+'-'+etime.m+'/'+etime.d+' '+etime.h+ ':' +etime.min;
                }
                // 不同年
                return stime.y+'-'+stime.m+'-'+stime.d+' '+stime.h+':'+stime.min+' - '+etime.y+'-'+etime.m+'-'+etime.d+' '+etime.h+':'+etime.min;
            },
            /**
             * 公用：时间转换
             */
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
            /**
             * 显示今天或明天，
             */
            showTime(start,end,index){
                //转换数据
                var now=new Date().valueOf();
                let s =this.commontime(start);
                let e =this.commontime(end);
                let n = this.commontime(now);
                //今天
                if(s.y===n.y&&s.m===n.m&&s.d===n.d){
                    s.totomo='today';
                }
                //明天
                //获得今天23:59:59的时间戳
                let time =new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1).valueOf();
                //获得明天23:59:59的时间戳
                let tomoTime=new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1+24*3600000).valueOf();
                if(start>time&&start<=tomoTime){
                    s.totomo='tomo';
                }
                return s||''
            },
            /**
             * 链接到预约视频会议
             */
            gotoConfVideo:function(){
                this.$router.push({path:'/meeting/index/reservation'})
            },
//            --------TODO 直接链接到web rtc中------------
            /**
             * 链接到加入会议
             */
            joinConf:function(){
                location.href = "/meeting/join";
            	//this.$router.push({path:'/meeting/join'})
            },
            /**
             * 链接到会议控制
             */
            confControl:function(){
                this.$router.push({path:'/meeting/index/ControlList'})
            },
            /**
             * 链接到预约会议室
             */
            meetRoom:function(){
                this.$router.push({path:'/meeting/index/room'})
            },
            /**
             * 链接到我的日程表
             */
            conferences:function(){
                this.$router.push({path:'/meeting/index/schedule'})
            },
//            --------TODO 要对会议种类和状态进行区分显示
            /**
             * 链接到会议详情
             */
            confItem:function(item){

                let path = item.confType==="NC"
                    ?'/meeting/index/meetingDetail' //预约会议室详情
                    :'/meeting/index/reservationDetail';//预约视频会议详情

                this.$router.push({path:path, query:{id:item.id}})
            },
              /**
             *
             */
            getCountByStaff(){
                api.countByStaff('', false, '').then(res=>{
                    if(res.ret > 0){
                        this.controlConf = res.data;
                    }
                })
            },
        }
    }
</script>




