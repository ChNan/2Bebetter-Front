<template>
    <div  style="height:calc(100% - 20px);">
        <!--显示主页-->
    <div v-show="showOrNot==='pageOne'" style="min-width:1100px;">
        <!--页面头部-->
        <div class="g-wrap-content">
            <div style="float:left">
                <span class="meet-title">{{$t('analysis.overview')}}</span>
                <span class="u-time-line">({{this.startDate}} - {{this.endDate}})</span>
            </div>
            <div style="margin-left: 33% ">
                <el-button-group class="button-wrap">
                    <el-button v-for="(item,index) in timeMenu"
                               :class="{'btn-normal':isActive != index ,'btn-active'
                           :isActive == index}" :key="index" @click="changeTimeMenu(index,item.label)">{{$t('analysis.'+item.label)}}</el-button>
                </el-button-group>
            </div>
            <!--<el-button-group class="button-wrap position-center">-->
                <!--<el-button v-for="(item,index) in timeMenu"-->
                           <!--:class="{'btn-normal':isActive != index ,'btn-active'-->
                           <!--:isActive == index}" :key="index" @click="changeQuality(index,'timeMenu')">{{$t('analysis.'+item.label)}}</el-button>-->
            <!--</el-button-group>-->
        </div>
        <div class="g-wrap">
            <!--第二块-->
            <el-row>
                <el-col class="u-tb-phone" style="padding-right:20px;">
                    <div class="u-border-pie">
                        <!--通话概况-->
                        <div class="u-border-bottom">
                            <span>{{$t('analysis.callSummary')}}</span>
                        </div>
                        <el-row class="f-tac" style="padding:20px 20px;">
                            <!--总次数-->
                            <el-col :span="12">
                                <el-row>
                                    <span class="u-hint14">{{$t('analysis.totalConferences')}}</span>
                                </el-row>
                                <el-row>
                                    <span class="f-big-font">{{maxCount}}</span>
                                </el-row>
                            </el-col>
                            <!--总时长-->
                            <el-col :span="12">
                                <el-row>
                                    <span class="u-hint14">{{$t('analysis.totalDuration')}}</span>
                                </el-row>
                                <!--时、分-->
                                <el-row class="f-big-font">
                                    <!--10-->
                                    {{maxTime.hour}}:{{maxTime.min}}:{{maxTime.seconds}}
                                </el-row>
                            </el-col>
                        </el-row>
                        <div class="g-wrap-content">
                            <el-table :data="callData">
                                <!--通话类型-->
                                <el-table-column prop="type" :label="$t('analysis.callType')">
                                    <template scope="scope">
                                        <div>{{$t('analysis.'+scope.row.type)}}</div>
                                    </template>
                                </el-table-column>
                                <!--通话次数-->
                                <el-table-column prop="count" :label="$t('analysis.conferenceTimes')" min-width="180px">
                                    <template scope="scope">
                                    <div style="padding-top:10px;padding-bottom:10px;">
                                        {{scope.row.count}}
                                        <el-progress :percentage="scope.row.percent || 0" style="width:60%;" :class="{'u-orange':scope.row.type==='recurrence','u-red':scope.row.type === 'meetnow'}"></el-progress>
                                    </div>
                                </template>
                                </el-table-column>
                                <!--持续时间-->
                                <el-table-column prop="duration" :label="$t('analysis.duration')" min-width="100px">
                                </el-table-column>
                            </el-table>
                        </div>

                    </div>
                </el-col>
                <el-col class="u-tb-port">
                    <div class="u-border-pie ">
                        <!--端口概况-->
                        <div class="u-border-bottom">
                            <span>{{$t('analysis.portsDetails')}}</span>
                        </div>
                        <el-row class="f-tac" style="padding:20px 20px;">
                            <!--总数-->
                            <el-col :span="6">
                            <el-row>
                            <span class="u-hint14">&nbsp</span>
                            </el-row>
                            <el-row>
                            <span class="f-big-font"> </span>
                            </el-row>
                            </el-col>
                            <!--最大并发-->
                            <el-col :span="12">
                                <el-row>
                                    <span class="u-hint14">{{$t('analysis.maxConcurrentPrts')}}</span>
                                </el-row>
                                <el-row class="f-big-font">
                                    {{maxOccurs}}
                                </el-row>
                            </el-col>
                        </el-row>
                        <div class="g-wrap-content">
                            <el-table :data="portData">
                                <!--排序-->
                                <el-table-column :label="$t('analysis.rank')" align="center" width="75px">
                                    <template scope="scope">
                                        <span class="u-range" v-if="scope.row.index<4" :class="'color'+scope.row.index">
                                            {{scope.row.index}}
                                        </span>
                                        <span class="u-range color4" v-else>{{scope.row.index}}</span>
                                    </template>
                                </el-table-column>
                                <!--并发数-->
                                <el-table-column prop="occurs" :label="$t('analysis.concurrentPorts')" align="center"  min-width="158px">
                                </el-table-column>
                                <!--并发频率-->
                                <el-table-column prop="rate" :label="$t('analysis.frequency')" align="center"  min-width="110px">
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <!--第三块-->
            <el-row class="u-border-pie">
                <div class="u-border-bottom">
                    <el-row>
                        <!--会议数据明细-->
                        <el-col :span="3" style="min-width:140px;">
                            <h4>{{$t('analysis.confDetail')}}</h4>
                        </el-col>
                        <!--请输入会议ID/号码-->
                        <el-col :span="7" style="padding-top:13px;">
                            <div style="">
                                <el-input :placeholder="$t('analysis.search')" icon="search" v-model="input"  :on-icon-click="handleIconClick">
                                </el-input>
                            </div>
                        </el-col>
                        <!--导出记录-->
                        <div class="f-tar" style="margin-top:13px;margin-right:20px;" >
                            <el-button type="primary" class="small-i" @click="getCallRecordExport()">
                                <i class="iconfont icon-daochu"></i>{{$t('analysis.export')}}
                            </el-button>
                            <!--<a href="/front/callRecord/export?callType=p2p&beginTime=1475942400000&endTime=1507532933725">点击</a>-->
                        </div>
                    </el-row>
                </div>
                <div class="g-wrap-content">
                    <el-button-group  class="button-wrap" style="margin-bottom:20px;" >
                        <el-button v-for="(item,index) in buttonG"
                                   :class="{'btn-normal':beActive != index ,'btn-active':beActive == index}"
                                   :key="index" @click="changeQuality(index,'buttonG')">{{$t('analysis.'+item.label)}}
                        </el-button>
                    </el-button-group>
                    <el-table :data="tableData" ref="table">
                        <div slot="empty"><table-no-data v-model="param.key" @cb="returnSeach"></table-no-data></div>

                        <!--主题-->
                        <el-table-column prop="subject" :label="$t('analysis.subject')"  show-overflow-tooltip min-width="130px"></el-table-column>
                        <!--视频会议类型-->
                        <!--<el-table-column prop="conferenceNumberType" :label="$t('analysis.type')" v-show="false"></el-table-column>-->
                        <!--会议ID-->
                        <el-table-column prop="conferenceId" :label="$t('analysis.id')" min-width="100px"></el-table-column>
                        <!--组织者-->
                        <el-table-column prop="organizerName" :label="$t('analysis.organizer')" show-overflow-tooltip min-width="130px"></el-table-column>
                        <!--参会方数量-->
                        <el-table-column prop="attendanceAmount" :label="$t('analysis.numPartic')" min-width="100px"></el-table-column>
                        <!--会议时间-->
                        <el-table-column prop="startTime" :label="$t('analysis.time')" show-overflow-tooltip min-width="130px"></el-table-column>
                        <!--持续时间-->
                        <el-table-column prop="duration" :label="$t('analysis.duration')"></el-table-column>
                        <!--详情操作-->
                        <el-table-column :label="$t('analysis.detail')" width="150px">

                            <template scope="scope">
                                <!--&lt;!&ndash;查看&ndash;&gt;-->
                                <!--<router-link :to="{path:'meetingDetail',query:{type:scope.row.conferenceNumberType,_id:scope.row._id}}">-->
                                    <!--{{$t('analysis.view')}}</router-link>-->
                                <div @click="showDetail(scope.row.conferenceNumberType,scope.row._id)" style="cursor: pointer;color: #2699f4">{{$t('analysis.view')}}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="f-tar">
                        <table-bar :total="total" table="table" @change="getList" :checkbox="false">
                        </table-bar>
                    </div>
                </div>
            </el-row>
        </div>
    </div>
        <!--显示详情页-->
     <!--<div v-show="showOrNot==='pageTwo'">123</div>-->
        <conf-detail :dataDetail="paramData" v-if="showOrNot==='pageTwo'" @ee="parentLisen"></conf-detail>
    </div>
</template>
<script>
import moment from 'moment'
import confDetail from './Detail.vue'
import TableNoData from "@/components/common/TableNoData";
import * as api from '../../../api/analysis/confCount';
import {language} from '@/i18n'

export default {
    components: {
        confDetail,
        TableNoData
    },
    filters: {
        formateTimes(value) {
            let seconds, minutes, hours, days;
            seconds = (value / 1000) % 1000;
            minutes = (value / (60 * 1000)) % 60;
            hours = value / (60 * 60 * 1000);
            return seconds + "dd" + minutes + "dd" + hours + "dd";
        }
    },
    computed: {
        lang () {
            const languageMap = {
                'zh-CN':'CN',
                'en-US':'EN',
            };
            return languageMap[language()];
        }
    },
    data () {
        return {
            paramData:{},//传递给详情的参数
            showOrNot:'pageOne',
            total: 0,//数据的总条数
            isActive: 0,
            beActive: 0,
            startDate:new Date(),//开始日期
            endDate:new Date(),//结束日期
            input:'',//搜索框输入的值
            currentPage: 1,//当前的页数
            activeIndex: 0,
            downLoadParam:{},
            param:{
                    //skip: 0,
                    limit:Number.parseInt(localStorage.getItem('currentSize') || 10),
                    orderbys: null,
                    orderByField: null,
                    order: null,
                    key: '',
                    autoCount: true,
                    callType:'',
                    beginTime:'',
                    endTime:'',
            },//获取会议记录的参数
            searchKey: {
                searchKey: ''
            },
            maxCount:0,//总次数
            maxTime:0,//总时长
            beginTime:'',//开始时间
            endTime:'',//结束时间
            callData:[],// 通话概况的表格值
            maxOccurs:'',//最大并发数
            portData:[],//端口的表格值
            tableData:[],//会议数据明细列表
            timeMenu: [
            {
                label: 'oneMonth',
            },
            {
                label: 'threeMonth',
            },
            {
                label: 'halfAYear',
            },
            {
                label: 'oneYear',
            }
            ],//会议记录的日期范围
            buttonG: [
            {
                label: 'p2p'
            },
            {
                label: 'meetnow'
            }, {
                label: 'recurrence'
            }
            ]//会议明细的类型

        }
    },
    created() {
        this.endDate = moment().format('YYYY/MM/DD');
        this.endTime=new Date().valueOf();
        //默认近一个月的时间
        this.beginTime=this.getLastMonthDay().valueOf();
        this.startDate=this.getDate(this.beginTime);

        this.enter();
    },
    mounted() {
        this.getPort();
        this.getCallRecord();
        this.getCallRecordList('p2p')
    },
    methods: {
        checkDate (date) {
           return date = typeof date === "undefined"
               ?new Date()
               :new Date(date);
        },
        getYearMonthDay (date) {
            return {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day:date.getDate(),
            }
        },
        getDouble (num) {
            return num<10?`0${num}`:num;
        },
        getDate(date){
            date = this.checkDate(date);
            let {year,month,day} = this.getYearMonthDay(date);
            return `${year}/${this.getDouble(month)}/${this.getDouble(day)}`;
        },
        getDateByOffset (date,offset) {
            date = this.checkDate(date);
            return moment().subtract(offset, 'months').valueOf()
        },
        getLastMonthDay (date) {
            return this.getDateByOffset(this.checkDate(date),1);
        },
        getLastThreeMonthDay (date) {
            return this.getDateByOffset(this.checkDate(date),3);
        },
        getLastSixMonthDay (date) {
            return this.getDateByOffset(this.checkDate(date),6);
        },
        getLastYearDay (date) {
            return this.getDateByOffset(this.checkDate(date),12);
        },

        returnSeach(){
            this.input = '';
            this.getCallRecordList();

        },
        parentLisen(evtValue){
            this.showOrNot=evtValue;
        },
        showDetail(type,id){
            this.showOrNot='pageTwo';
            this.paramData.id=id;
            this.paramData.type=type;
        },
        /**
         *秒数转化
         */
        changeSeconds(value){
            var Time = parseInt(value);//  转化为整数
            let timeObj=new Object;
//            timeObj.days=0;
            timeObj.hour=0;
            timeObj.min=0;
            timeObj.seconds=Time;
            if(Time>=60){
                timeObj.seconds=Time%60;
                timeObj.min=parseInt(Time/60);
                if(timeObj.min>=60){
                    timeObj.min= timeObj.min%60;
                    timeObj.hour=parseInt(Time/3600)
//                    if(  timeObj.hour>24){
//                        timeObj.hour=  timeObj.hour%24;
//                        timeObj.days= parseInt(Time/(3600*24));
//                    }
                }
            }
            timeObj.hour=this.check(timeObj.hour);
            timeObj.min=this.check(timeObj.min);
            timeObj.seconds=this.check(timeObj.seconds);
            return  timeObj;
        },
        check(value){
          if(value<10){
              value='0'+value;
          }
          return value;
        },
        /**
         * 获取通话概况（需要转换持续时间，总是长，单位是秒，通话类型进行中英文国际化）
         */
        getCallRecord(){
//            let beginTime='1483200000000';
//            let endTime='1514736000000';
            let beginTime=this.beginTime;
            let endTime=this.endTime;
            let param ={beginTime,endTime};
            api.getCallRecordMsg(param).then(json=>{
                this.callData=json.data;
                let temp=new Object;
                this.maxCount=0;
                this.maxTime=0;
                for(var i=0;i<this.callData.length;i++){
                    this.maxCount+=parseInt(this.callData[i].count);
                    this.maxTime+=parseInt(this.callData[i].duration);
                    temp=this.changeSeconds(this.callData[i].duration);
                    this.callData[i].duration=temp.hour+":"+temp.min+":"+temp.seconds;
                }
                for(var i=0;i<this.callData.length;i++){
//                    this.callData[i].type="this.$t("+"'"+'analysis.'+this.callData[i].type+"'"+")";
                    this.callData[i].percent=parseInt(this.callData[i].count)/this.maxCount;
                    this.callData[i].percent=this.callData[i].percent*100;
                    //TODO 要进行四舍五入更精确
                    this.callData[i].percent= parseInt(this.callData[i].percent.toFixed(0));
                }
                this.maxTime=this.changeSeconds(this.maxTime);
            })
        },
        /**
         *  获取端口（需传入开始时间和借宿时间，此地方数据为暂时）
         */
        getPort(){
            let startTimeStamp=this.beginTime;
            let endTimeStamp=this.endTime;
            let param={startTimeStamp,endTimeStamp}
            api.getPortMsg(param).then(json=>{
                this.maxOccurs=json.data.data.maxOccurs;
                this.portData=json.data.data.occursRateList;
//                this.portData.sort(function(a,b){return a.occurs-b.occurs});
                for(var i=0;i<this.portData.length;i++){
                    this.portData[i].rate=(this.portData[i].rate*100).toFixed(2)+"%";
                    this.portData[i].index=i+1;
                }
            })
        },

        /**
         * 转换开始时间和结束时间
         */
        changeTime(start,end){
            //不同年
            if(!moment(start).isSame(end, 'year')){
                return this.getFormatTime(start,end,'YYYY/MM/DD HH:mm');
            }
            //同年不同月或不同日
            if(!moment(start).isSame(end, 'month') || !moment(start).isSame(end, 'day')){
                return this.getFormatTime(start,end,'YYYY/MM/DD HH:mm');
            }
            //同年同月同日
            if(moment(start).isSame(end, 'day')){
                return moment(start).format('YYYY/MM/DD HH:mm') + " - " + moment(end).format('HH:mm');
            }
        },
        getFormatTime(start,end,format){
            return this.toTimeZone(start, moment().utcOffset(),format) + " - " + this.toTimeZone(end, moment().utcOffset(), format);
        },
        toTimeZone(time, offset, format) {
            return moment.utc(time).utcOffset(offset).format(format);
        },
        /**
         *获取通话记录（p2p主题的中英文国际化，会议类型，会议时间的转换，持续时间的转换，详情的连接数据的传递，换页）
         */
        getCallRecordList(assign){
            if (assign instanceof Object) {
                Object.assign(this.param, assign);
            }
            this.param.callType=this.buttonG[this.beActive].label;
            this.param.beginTime=this.beginTime;
            this.param.endTime=this.endTime;
            if(this.input===""){
                this.input=null;
            }
            this.param.key=this.input;
            api.getCallRecordListMsg(this.param,this.param.skip===0).then(json=>{
               this.tableData= json.data.data;
               let temp= new Object;
               if( this.param.callType==='p2p'){
                   for(let i=0;i<this.tableData.length;i++){
                       this.tableData[i].subject=this.$t('analysis.p2psubject',{callerDisplayName:this.tableData[i].callerDisplayName,calleeDisplayName:this.tableData[i].calleeDisplayName});
//                       this.tableData[i].subject="call from "+this.tableData[i].callerDisplayName+' to '+this.tableData[i].calleeDisplayName;
                       this.tableData[i].conferenceNumberType=this.tableData[i].callType;
                       this.tableData[i].conferenceId='--';
                       this.tableData[i].organizerName=this.tableData[i].callerDisplayName;
                       this.tableData[i].attendanceAmount='--';
                       this.tableData[i].startTime=this.changeTime(this.tableData[i].startTimeStamp,this.tableData[i].endTimeStamp);
                       temp=this.changeSeconds( this.tableData[i].duration);
                       this.tableData[i].duration=temp.hour+":"+temp.min+":"+temp.seconds;
                   }
               }
               else{
                   for(let i=0;i<this.tableData.length;i++){
                       if( this.tableData[i].conferenceNumberType==='VSCA'||this.tableData[i].conferenceNumberType==='VMN'){
                           this.tableData[i].subject=this.tableData[i].subject+this.$t('analysisDetail.vmrsubject');
                       }
                      if( this.tableData[i].attendanceAmount===null){
                          this.tableData[i].attendanceAmount='--';
                       }
                       this.tableData[i].startTime=this.changeTime(this.tableData[i].startTimeStamp,this.tableData[i].endTimeStamp);
                       temp=this.changeSeconds( this.tableData[i].duration);
                       this.tableData[i].duration=temp.hour+":"+temp.min+ ":"+temp.seconds;

                   }
               }
               this.total=json.data.total;
            })

        },
        /**
         *获取导出通话记录信息
         */
        getCallRecordExport(){

            let offset=moment().utcOffset()/60;
            window.location.href="/enterprise/front/callRecord/export?callType="+this.buttonG[this.beActive].label+
                "&beginTime="+this.beginTime+"&endTime="+this.endTime+"&offset="+offset+'&language='+this.lang;
        },

        changeTimeMenu (index,type) {

            this.isActive  = index;
                        this.endDate = moment().format('YYYY/MM/DD');
            this.endTime=new Date().valueOf();

            let Handle = {
                'oneMonth':()=>{
                    this.beginTime=this.getLastMonthDay().valueOf();
                },
                'threeMonth':()=>{
                    this.beginTime=this.getLastThreeMonthDay().valueOf();
                },
                'halfAYear':()=>{
                    this.beginTime=this.getLastSixMonthDay().valueOf();
                },
                'oneYear':()=>{
                    this.beginTime=this.getLastYearDay().valueOf();
                },
            };

            Handle[type]();

            this.startDate=this.getDate(this.beginTime);
            this.getCallRecord();
            this.getPort();
            this.getCallRecordList();

        },
        changeQuality(index, target) {

            this.getCallRecord();
//            搜索端口
            this.getPort();
            //点对点，即时，预约
            if (target === 'buttonG') this.beActive = index;
            this.getCallRecordList();
        },
        /**
         * 模糊搜索时间
         */
        handleIconClick() {
            this.total = 0;
            this.getCallRecordList({skip:0})
        },
        /**
         *换页
         */
        handleCurrentChange() {
        },
        //enter监听Enter
        listener(e) {
            if (e) {
                var e = window.event ? window.event : e;
                if (e.keyCode == 13) {
                    this.handleIconClick()
                }
            }
        },
        enter() {
            document.addEventListener('keydown', this.listener);
        },

        getList(assign){
            if (assign instanceof Object) {
                Object.assign(this.param, assign)
            }
            this.getCallRecordList();
        },
    },
    destroyed: function() {
        document.removeEventListener('keydown', this.listener)
    }
}
</script>
<style lang="scss" scoped="">
    .position-center{
        width: 560px!important;
    }
    .button-wrap .el-button{
        width: 140px!important;
    }

</style>
<style lang="scss" scoped>
@import '../../../assets/scss/meeting.scss';
$my_phone: percentage(1020/1633);
$my_port:percentage(610/1633);
$u-range-color: #f85353;
$u-range-second: #ff6f20;
$u-range-third: #ffa820;
$u-range-other: #82c1f3;
.u-time-line {
    @include fontsize(14px, normal, #333333);
    margin-left: 10px;
}

.u-tb-phone {
    width: $my_phone;
}
.u-empty{

     img {
         float: left;
         margin-top: 5px;
     }

   .u-tt {
       font-size: 18px;
       color: #333;
       margin-left: 140px;
   }

 li:last-child {
     list-style: none;
 }



}
.u-tb-port {
    width: $my_port;
}

.u-border-pie {
    border-radius: 6px;
    background-color: #ffffff;
    margin-top: 20px;
    min-height: 430px;
}

.f-big-font {
    @include fontsize(36px, bold, #333333);
    span {
        font-size: 16px;
    }
}

.u-range {
    width: 18px;
    height: 18px;
    color: white;
    display: block;
    line-height: 18px;
    text-align: center;
    margin-left: 42%;
}

.color1 {
    background: $u-range-color;
}

.color2 {
    background: $u-range-second;
}

.color3 {
    background: $u-range-third;
}

.color4 {
    background: $u-range-other;
}

a {
    color: #2699f4;
}

h4 {
    font-size: 16px;
    line-height: 18px;
}

.g-wrap-content {
    padding-bottom: 20px;
}

.searchkey {
    white-space: nowrap;
    max-width: 85px;
    display: inline-block;
    margin: 0;
    font-size: 18px;
    line-height:18px;
    font-weight:normal;
    overflow: hidden;
    text-overflow: ellipsis;
    }

/*.el-button-group{*/
    /*display: inline-block !important;*/
/*}*/

</style>
