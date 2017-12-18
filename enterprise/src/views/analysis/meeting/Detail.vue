<template>
    <div class="g-bd g-pd-b" >
        <!--页面头部-->
        <!--会议详情-->
        <div class="g-hd">
            <h3>{{$t('analysisDetail.confDetail')}}</h3>
        </div>
        <!--返回上一级-->
        <div class="f-fr u-link">
            <!--<router-link to="/meeting" >-->
                <el-button type="text" @click="backPage()">
                    <i class="iconfont icon-fanhuishangyiji"></i>{{$t('analysisDetail.back')}}</el-button>
            <!--</router-link>-->
        </div>
        <!--会议信息显示-->
        <div class="g-wrap-content" style="padding-left:15px;">
            <table class="m-tb">
                <tr>
                    <!--根据类型显示图片-->
                    <td style="width:150px;">
                        <div class="u-img-wrap"
                             :class="{
                            'type-video':saveData.conferenceNumberType == 'VGCM',
                             'type-video-vmr':saveData.conferenceNumberType == 'VMN',
                             'type-video-vsca':saveData.conferenceNumberType == 'VSCA',
                             'type-pp':saveData.conferenceNumberType == 'VSC',
                             'type-pp2':saveData.conferenceNumberType == 'VGCP',
                             'type-toto':saveData.conferenceNumberType =='p2p'}">
                        </div>
                    </td>
                    <!--显示详情-->
                    <td>
                        <table class="m-tb">
                            <!--名称加ID-->
                            <tr>
                                <td class="u-id">
                                    <!--即时会议的详情显示-->
                                    <div v-if="saveData.conferenceNumberType==='VMN'||saveData.conferenceNumberType==='VSCA'" :title="`${saveData.organizerName}${$t('analysisDetail.vmrsubject')}`">{{saveData.organizerName}}{{$t('analysisDetail.vmrsubject')}}</div>
                                    <!--<span v-if="saveData.conferenceNumberType==='VGCM'">{{saveData.organizerName}}{{$t('analysisDetail.meetnowsubject')}}</span>-->
                                    <div v-if="saveData.conferenceNumberType==='VGCM'" :title="saveData.subject">{{saveData.subject}}</div>
                                    <!--点对点的显示-->
                                    <div v-if="saveData.conferenceNumberType==='p2p'" :title="$t('analysisDetail.p2psubject',{callerDisplayName:saveData.callerDisplayName,calleeDisplayName:saveData.calleeDisplayName})">{{$t('analysisDetail.p2psubject',{callerDisplayName:saveData.callerDisplayName,calleeDisplayName:saveData.calleeDisplayName})}}</div>
                                   <!--预约会议的显示-->
                                    <div v-if="saveData.conferenceNumberType==='VSC'||saveData.conferenceNumberType==='VGCP'" :title="`${saveData.subject}(${saveData.conferenceId})`">{{saveData.subject}} ({{saveData.conferenceId}})</div>
                                </td>
                            </tr>
                            <!--通话类型:-->
                            <tr>
                                <td>
                                    <span class="u-type">{{$t('analysisDetail.type')}}</span>
                                    <span class="u-ct">{{$t('analysisDetail.'+saveData.conferenceNumberType)}}</span>
                                </td>
                            </tr>

                            <tr>
                                <!--组织者：-->
                                <td v-if="saveData.callType!=='p2p'">
                                    <span class="u-type">{{$t('analysisDetail.organizerm')}}</span>
                                    <span class="u-ct">{{saveData.organizerName}}</span>
                                </td>
                                <!--主叫方-->
                                <td v-if="typeof saveData.callerDisplayName !=='undefined'">
                                    <span class="u-type">{{$t('analysisDetail.caller')}}</span>
                                    <span class="u-ct">{{saveData.callerDisplayName+'('+saveData.callerNumber+')'}}</span>
                                </td>
                                <!--被叫方-->
                                <td v-if="typeof saveData.calleeDisplayName!== 'undefined'">
                                    <span class="u-type">{{$t('analysisDetail.callee')}}</span>
                                    <span class="u-ct">{{saveData.calleeDisplayName+'('+saveData.calleeNumber+')'}}</span>
                                </td>
                                <!--参会人数：-->
                                <td v-if="saveData.conferenceNumberType!=='p2p'">
                                    <span class="u-type">{{$t('analysisDetail.numOfPartic')}}</span>
                                    <span class="u-ct">{{saveData.attendanceAmount}}</span>
                                </td>
                            </tr>
                            <tr>
                                <!--时间：-->
                                <td>
                                    <span class="u-type">{{$t('analysisDetail.time')}}</span>
                                    <span class="u-ct">{{saveData.changedtime}}</span>
                                </td>
                                <!--持续时间：-->
                                <td>
                                    <span class="u-type">{{$t('analysisDetail.duration')}}</span>
                                    <span class="u-ct">{{saveData.duration}}</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>

        <div class="m-wrap-info" v-if="saveData.conferenceNumberType!=='p2p'">
            <div class="u-border-bottom">
            </div>

            <!--会议成员信息-->
            <span class="u-tt">{{$t('analysisDetail.particMsg')}}</span>
            <el-table :data="particData"  ref="table">
                <div slot="empty">
                    <el-row class="u-empty">
                        <div class="f-tac">
                            <span class="iconfont icon-kongshuju" style="color:gray;font-size:58px;"></span>
                            <br />
                            <br/>
                            <!--暂无数据-->
                            <span>{{$t('analysisDetail.noData')}}</span>

                        </div>

                    </el-row>

                </div>
                <!--名称-->
                <el-table-column prop="name" :label="$t('analysisDetail.name')" width="180">
                </el-table-column>
                <!--帐号-->
                <el-table-column prop="number" :label="$t('analysisDetail.account')" width="180">
                </el-table-column>
                <!--入会时间-->
                <el-table-column prop="beginTime" :label="$t('analysisDetail.joinConfTime')">
                </el-table-column>
                <!--持续时间-->
                <el-table-column prop="duration" :label="$t('analysisDetail.durationw')" width="180">
                </el-table-column>
                <!--设备类型-->
                <el-table-column prop="userAgent" :label="$t('analysisDetail.deviceType')" >
                </el-table-column>
            </el-table>

            <div class="f-tar">
                <table-bar :total="total" table="table" @change=" getList" :checkbox="false">
                </table-bar>
            </div>

        </div>

    </div>
</template>
<script>
    import * as api from '../../../api/analysis/confCountDetail'
    import moment from 'moment'
export default {
    name: 'meetingRoom',
    props: ['dataDetail'],
    created() {
        this.saveData.type = this.dataDetail.type;
        this.saveData.id = this.dataDetail.id;
    },
    data() {
        return {
            id:'',
            type:'',
            typeName:'',
            currentPage4: 1,
            saveData:{
                id	:'',
                type:'',
            },
            particData:[],//参加者数据
            orderbys:[],
            total: 100,//数据的总条数
            param:{
                skip: 0,
                limit: Number.parseInt(localStorage.getItem('currentSize') || 10),
                orderbys: null,
                orderByField: null,
                autoCount: true,
                confUuid:'',
            },//获取会议记录的参数

        }
    },
    mounted(){
        this.getDetail();
    },
    methods: {
        backPage(){
            this.$emit('ee', 'pageOne')
        },
        /**
         * 获取会议统计详情(  TODO 持续时间是否要进行判断是否正在进行时的并进行实时刷新？还是这边只统计历史会议)
         */
        getDetail(){
           let id= this.saveData.id;
           let type= this.saveData.type;
          let param={id,type};
            api.getConfCountDetail(param).then(json=>{
//                虚拟会议
                  this.saveData=json.data;
                  this.saveData.changedtime=this.changeTime(this.saveData.startTimeStamp,this.saveData.endTimeStamp);
                let item =this.changeSeconds(this.saveData.duration);
                this.saveData.duration=item.hour+":"+item.min+":"+item.seconds;
//               查询参会人的数据
                if(this.saveData.callType!=="null"&&this.saveData.callType==="p2p"){
                    this.saveData.organizerName=this.saveData.callerDisplayName;
                    this.saveData.attendanceAmount=0;
                    this.saveData.conferenceNumberType=this.saveData.callType;
                }
                if(this.saveData.conferenceNumberType!=="p2p"){
                    this.getParticDetail(this.saveData.uuid);
                }
//

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
         *秒数转换
         */
        changeSeconds(value){
            var Time = parseInt(value);//  转化为整数
            let timeObj=new Object;
//            timeObj.days=0;
            timeObj.hour=0;
            timeObj.min=0;
            timeObj.seconds=Time;
            if(Time>60){
                timeObj.seconds=Time%60;
                timeObj.min=parseInt(Time/60);
                if(timeObj.min>60){
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
         *获取参会人的数据
         * @param confUuid
         */
        getParticDetail(confUuid){
//            let confUuid="d8fd2080-897f-11e7-a9e9-2f129ab752f4";
//            let param={confUuid};
            this.param.confUuid=confUuid;
            api.getParticDetail(this.param,this.param.skip===0).then(json=>{
                this.particData=json.data.data;
                console.log("this.particData",this.particData)
                this.particData.forEach(temp=>{
                    if(!temp.startTimeStamp){
                        temp.beginTime="--";
                    }else{
                        temp.beginTime="123";
                        temp.beginTime= new Date(parseInt(temp.startTimeStamp)).toString();
                        temp.beginTime=moment(temp.beginTime).format("YYYY/MM/DD HH:mm")
                    }
                    console.log("temp.conferenceUserRole",temp.conferenceUserRole)
                    temp.conferenceUserRole=this.$t("analysisDetail."+temp.conferenceUserRole);
                    let item =this.changeSeconds(temp.duration);
                    temp.duration=item.hour+":"+item.min+":"+item.seconds;
                })
                this.total=json.data.total;
            })
        },
        /**
         * 换页
         */
        handleCurrentChange() {
        },
        getList(assign){
            if (assign instanceof Object) {
                Object.assign(this.param, assign)
            }
            this. getParticDetail(this.saveData.uuid);
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            console.log(`当前页: ${val}`);
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/meeting.scss';
.g-pd-b{
    padding-bottom: 20px;
}
.u-img-wrap {
    width: 130px;
    height: 130px;
    border-radius: 8px;
    margin-right: 36px;
}

.type-video {
    background: url('../../../assets/img/video.png');
}
.type-video-vmr{
    background: url('../../../assets/img/video.png');
}
.type-video-vsca{
    background: url('../../../assets/img/video.png');
}

.type-toto {
    background: url('../../../assets/img/toto.png');
}

.type-pp {
    background: url('../../../assets/img/pp.png');
}
.type-pp2 {
    background: url('../../../assets/img/pp.png');
}

.m-tb {
    width: 80%;
    min-width: 700px;
    td {
        line-height: 30px;
    }
}

.u-id {
    @include fontsize(18px, bold, #333333);
    div {
        width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.u-type {
    @include fontsize(14px,
    bold,
    #333333);
}

.u-ct {
    @include fontsize(14px,
    normal,
    #999999);
}

.u-tt {
    display: block;
    z-index: 100;
    background: white;
    margin: 0 auto;
    text-align: center;
    width: 110px;
    @include fontsize(14px,
    normal,
    #333333);
    height: 50px;
    margin-top: -10px;
}

.m-wrap-info {
    @include padding(60px,
    20px,
    null,
    20px);
}

a {
    color: #2699f4;
    font-size: 14px;
}

.u-link {
    margin-top: -50px;
    margin-right: 20px;
}

.u-bt {
    background: transparent;
    border: none;
    color: #2699f4;
    font-size: 14px;
    padding: 10px;
    .iconfont {
        margin-right: 10px;
    }
}

.u-bt:hover {
    background: #2699f4;
    color: white;
    border-radius: 4px;
    cursor: pointer;
}
</style>
