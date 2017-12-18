<template>
    <el-row class="f-fs-14px">
        <el-col :span="24">
            <el-card class="pd-both-1em">
                <el-row class=" border-b pd-b-halfem">
                    <el-col :span="24">
                        <el-row>
                            <h5 class="no-margin title">
                                <el-row>
                                    <el-col :span="20" class="title-name">
                                        <i class="f-fl u-icon-title icon iconfont icon-Videoconference"></i>
                                        <span class="f-fl u-title-subject">
                                            {{subject}}
                                        </span>
                                    </el-col>
                                </el-row>
                                
                            </h5>
                            <div class="">
                                <el-col class="item" :span="6">
                                    <span>{{$t('detail.organizer')}}</span>
                                    <span>{{organizer.name}}</span>
                                </el-col>
                                <!--<el-col class="item" :span="6">-->
                                    <!--<span>地点：</span>-->
                                    <!--<span>51号大楼会议室</span>-->
                                <!--</el-col>-->
                            </div>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row class="content border-b">
                    <el-row>
                        <el-col class="item" :span="6" v-if="communication.meetingId!==''">
                            {{$t('detail.meetingId')}}{{communication.meetingId}}
                        </el-col>
                        <el-col class="item" :span="6" v-if="communication.password!==''">
                            {{$t('detail.pw')}}{{communication.password}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col class="item" :span="6">
                           {{$t('detail.startTime')}}{{communication.startTime}}
                        </el-col>
                        <el-col class="item" :span="6">
                            {{$t('detail.endTime')}}{{communication.endTime}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col class="item" :span="24" v-if="hasCycle">
                            {{$t('detail.cycle')}} {{cycleStr}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col class="item" :span="24">
                           {{$t('detail.timezone')}}{{communication.timezone}}
                        </el-col>
                    </el-row>
                    
                </el-row>
                <el-row class="content border-b">
                    <el-col :span="2">
                        <div>
                            <span class="pd-r-1em">{{$t('detail.address')}}</span>
                        </div>
                    </el-col>
                    <el-col :span="22">
                        <span class="mg-r-4em" :key="item.id" v-for="item in location">{{item.name}}</span>
                    </el-col>
                </el-row>
                <el-row class="content border-b">
                    <el-col :span="2">
                        <div class="line-middle">
                            <span class="pd-r-1em">{{$t('detail.meetingPerson')}}</span>
                        </div>
                    </el-col>
                    <el-col :span="22">
                        <el-col :xs="6" :sm="6" :md="6"  :lg="5" class="person-item">
                            <div class="line-middle person-content">
                                <div class="f-fl">
                                    <i :style="confType==='NC'?'color:#26c7ec':'color: #fca40c'"  class="icon u-icon-person iconfont icon-compere"></i>
                                </div>
                                <div class="f-fl f-overhide" style="height: 30px;line-height: 32px;">
                                    {{organizer.name}}
                                </div>
                            </div>
                        </el-col>
                        <el-col :xs="6" :sm="6" :md="6"  :lg="5" class="person-item" :key="item.id" v-for="item in participants">
                            <div class="line-middle person-content">
                                <div class="f-fl">
                                    <i v-if="item.type=='external'" class="icon u-icon-person iconfont icon-wenhao-mid"></i>
                                    <i v-else-if="item.role==='presenter'" style="color: #fca40c" class="icon u-icon-person iconfont  icon-visitors "></i>
                                    <i v-else-if="item.role==='attendee'" class="icon u-icon-person iconfont icon-visitors"></i>
                                </div>
                                <div class="f-fl f-overhide" style="height: 30px;line-height: 32px;">
                                    {{item.displayText}}
                                </div>
                            </div>
                        </el-col>
                    </el-col>
                </el-row>
                <el-row class="content border-b" v-if="audience.length>0">
                    <el-col :span="2">
                        <div class="line-middle">
                            <span class="pd-r-1em">{{$t('detail.meetingAudience')}}</span>
                        </div>
                    </el-col>
                    <el-col :span="22">
                        <el-col :xs="6" :sm="6" :md="6"  :lg="5" :key="item.id" class="person-item" v-for="item in audience">
                            <div class="line-middle person-content">
                                <div class="f-fl">
                                    <i class="icon u-icon-person iconfont icon-visitors"></i>
                                </div>
                                <div class="f-fl f-overhide" style="height: 30px;line-height: 32px;">
                                    {{item.displayText}}
                                </div>
                            </div>
                        </el-col>
                    </el-col>
                </el-row>
                <el-row class="content">
                    <el-row>
                        <el-col class="pd-b-5px" :span="24">
                            {{$t('detail.meetingRemark')}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <div v-html="remark"></div>
                        </el-col>
                    </el-row>
                </el-row>
            </el-card>
           <div class="u-bottom-content">
               <el-button v-if="hasCtrlBtn&&confType!=='NC'"  type="primary" class="u-btn-w mg-both-2em" size="large" @click="goMeetingControl()">{{$t('detail.reservation.meetingControl')}}</el-button>
               <el-button v-if="hasEditBtn" type="primary" class="u-btn-w mg-both-2em" size="large" @click="startEdit()">{{$t('detail.reservation.edit')}}</el-button>
               <el-button v-if="hasRemoveBtn" type="danger" class="u-btn-w mg-both-2em" size="large" @click="deleteMeeting()">{{$t('detail.reservation.meetingDelete')}}</el-button>
           </div>
        </el-col>
        <el-dialog :title="$t('detail.modal.delete.title')" :visible.sync="deleteControl" size="tiny">
            <el-row>
                <el-col :span="24" class="f-tac">
                    <span>{{$t('detail.modal.delete.message')}}</span>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="deleteOnce">{{$t('detail.modal.deleteProject')}}</el-button>
                    <el-button type="primary" @click="deletePlan">{{$t('detail.modal.deletePlan')}}</el-button>
                </span>
        </el-dialog>
        
        <el-dialog :title="$t('detail.modal.edit.title')" :visible.sync="editControl" size="tiny">
            <el-row>
                <el-col :span="24" class="f-tac">
                    <span>{{$t('detail.modal.edit.message')}}</span>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="editOnce()">{{$t('detail.modal.editProject')}}</el-button>
                    <el-button type="primary" @click="editPlan()">{{$t('detail.modal.editPlan')}}</el-button>
                </span>
        </el-dialog>
    </el-row>
    
  

</template>

<style scoped="">
    .pd-b-2em{
        padding-bottom: 2em;
    }
    .f-tac {
        text-align: center;
    }
    .f-fs-14px{
        font-size: 14px;
    }
    .u-btn-w{
        width: 8em;
    }
    .title-name {
        height: 32px;
        line-height: 32px;
    }
    .u-icon-title {
        font-size: 30px;
        color: #26c7ec;
    }
    .u-title-subject{
        height: 30px;
        line-height: 32px;
        padding-left: 1em;
        display: inline-block;
        max-width: calc(100% - 50px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .u-icon-person{
        color: #26c7ec;
        font-size: 21px;
    }
    .u-bottom-content{
        text-align: center;
        width: 100%;
        padding: 2em 0;
    }
    .mg-both-2em{
        margin:0 2em;
    }
    .content{
        padding: 1.5em 0em;
    }
    .pd-b-3em{
        padding-bottom: 3em;
    }
    .pd-b-halfem{
        padding-bottom:1.5em;
    }
    .pd-both-1em{
        padding:0 1em;
    }
    .no-margin{
        margin:0;
    }
    .mg-r-4em{
        margin-right: 4em;
    }
    .title{
        font-size: 16px;
        padding: 0.5em 0;
    }
    .border-b{
        border-bottom:1px dotted #ccc;
    }
    .item{
        padding: 0.6em 0;
    }
    .line-middle {
        height: 32px;
        line-height: 32px;
    }
    .f-overhide {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 84%;
    }
    .person-content{
        width: 100%;
        border: 1px solid #b4b4b4;
        border-radius: 4px;
        text-indent: 0.5em;
     
    }
    .person-item{
        padding: 2px 6px 2px 0;
    }
    .pd-b-5px{
        padding-bottom:5px;
    }
</style>
<script>
    
    import {reqMeetingDetail,deletOnceMeeting,deletePlanMeeting} from "@/api/meetingDetail/"
    import moment from "moment"
    import timezone from "@/components/meeting/timezone"
    import edit from "@/components/meeting/edit"
    import selectDate from "@/components/meeting/selectDate"
    
    export default{
        components:{
        
        },
        props:[],
        computed:{
            language () {
                return this.$store.state.reservation.language;
            },
        	utcOffset () {
        	    return moment().utcOffset()
            },
            day () {
                return this.cycleMeeting.day.range === "userDefine"
                    ? this.$t('reservation.modal.setMeetingCycle.cycleMode.every') + (Number(this.cycleMeeting.day.userDefine) === 1 ? "" : this.cycleMeeting.day.userDefine) + this.$t('reservation.modal.setMeetingCycle.cycleMode.dayHappen') + "，"
                    : this.$t('reservation.modal.setMeetingCycle.cycleMode.everyWorkDayHappen') + "，"
            },
            week () {
                return Number(this.cycleMeeting.week.interval) === 1
                    ? this.$t('reservation.modal.setMeetingCycle.cycleMode.everyWeeks') + " " + this.cycleMeeting.week.dayList.join("、") + this.$t('reservation.modal.setMeetingCycle.cycleMode.happen') + "，"
                    : this.$t('reservation.modal.setMeetingCycle.cycleMode.RecurEvery') + " " + (this.cycleMeeting.week.interval) + " " + this.$t('reservation.modal.setMeetingCycle.cycleMode.Weeks') + " " + this.cycleMeeting.week.dayList.join("、") + this.$t('reservation.modal.setMeetingCycle.cycleMode.happen') + "，";
            },
            mounth () {
                if(this.language==='zh-CN'){
                    if (this.cycleMeeting.mounth.range === "1") {
                        return this.$t('reservation.modal.setMeetingCycle.cycleMode.every') + " " + this.cycleMeeting.mounth["1"].mounth + " " + this.$t('reservation.modal.setMeetingCycle.cycleMode.MounthNum') + this.cycleMeeting.mounth["1"].days + this.$t('reservation.modal.setMeetingCycle.cycleMode.dayHappen') + "，"
                    } else if (this.cycleMeeting.mounth.range === "2") {
                        return this.$t('reservation.modal.setMeetingCycle.cycleMode.every') + " " + this.cycleMeeting.mounth["2"].mounth + " " + this.$t('reservation.modal.setMeetingCycle.cycleMode.MounthNO') + " " +
                            this.dayNumsList.filter(item => item.value === Number(this.cycleMeeting.mounth["2"].numValue))[0].label + " " +
                            this.daysList.filter(item => item.value === this.cycleMeeting.mounth["2"].daysValue)[0].label
                    }
                }else if(this.language==='en-US') {
                    if (this.cycleMeeting.mounth.range === "1") {
                        return "Day "+this.cycleMeeting.mounth["1"].days+" of every " + this.cycleMeeting.mounth["1"].mounth+" mounth(s),"
                    } else if (this.cycleMeeting.mounth.range === "2") {
                        return "The " + this.dayNumsList.filter(item => item.value === Number(this.cycleMeeting.mounth["2"].numValue))[0].label + " " +
                            this.daysList.filter(item => item.value === this.cycleMeeting.mounth["2"].daysValue)[0].label +" of every "+this.cycleMeeting.mounth["2"].mounth+" mounth(s),"
                    }
                }
        
            },
            year () {
        
                if(this.language==='zh-CN'){
                    if (this.cycleMeeting.year.range === "1") {
                        return (this.cycleMeeting.year.yearsNum === 1
                                ? this.$t('reservation.modal.setMeetingCycle.cycleMode.everyYears')
                                : this.$t('reservation.modal.setMeetingCycle.cycleMode.every') + " " + this.cycleMeeting.year.yearsNum + " " + this.$t('reservation.modal.setMeetingCycle.cycleMode.Years')) + " " +
                            this.mounthList.filter(item => item.value === this.cycleMeeting.year["1"].mounth)[0].label + " " + this.$t('reservation.modal.setMeetingCycle.cycleMode.NO') + " " +
                            this.cycleMeeting.year["1"].dayNum + " " + this.$t('reservation.modal.setMeetingCycle.cycleMode.day');
                
                    } else if (this.cycleMeeting.year.range === "2") {
                        return (this.cycleMeeting.year.yearsNum === 1
                                ? this.$t('reservation.modal.setMeetingCycle.cycleMode.everyYears')
                                : this.$t('reservation.modal.setMeetingCycle.cycleMode.every') + " " + this.cycleMeeting.year.yearsNum + " " + this.$t('reservation.modal.setMeetingCycle.cycleMode.Years')) + " " +
                            this.mounthList.filter(item => item.value === this.cycleMeeting.year["2"].mounth)[0].label + " " +
                            this.dayNumsList.filter(item => item.value === this.cycleMeeting.year["2"].numValue)[0].label + " " +
                            this.daysList.filter(item => item.value === this.cycleMeeting.year["2"].daysValue)[0].label
                    }
                }else if(this.language==='en-US') {
                    if (this.cycleMeeting.year.range === "1") {
                        return (this.cycleMeeting.year.yearsNum === 1
                                ? "Recur every year(s) on : "
                                : "Recur every "+ this.cycleMeeting.year.yearsNum + " years(s) on: ") +
                            this.mounthList.filter(item => item.value === this.cycleMeeting.year["1"].mounth)[0].label + " " +
                            this.cycleMeeting.year["1"].dayNum + ", ";
                
                    } else if (this.cycleMeeting.year.range === "2") {
                        return (this.cycleMeeting.year.yearsNum === 1
                                ? "Recur every year(s) on : "
                                : "Recur every "+ this.cycleMeeting.year.yearsNum + " years(s) on: ") +
                            this.mounthList.filter(item => item.value === this.cycleMeeting.year["2"].mounth)[0].label + " of " +
                            this.dayNumsList.filter(item => item.value === this.cycleMeeting.year["2"].numValue)[0].label + " " +
                            this.daysList.filter(item => item.value === this.cycleMeeting.year["2"].daysValue)[0].label+","
                    }
                }
        
            },
            cycleStr () {
                let cycleMode = {
                    day: this.day,
                    week: this.week,
                    mounth: this.mounth,
                    year: this.year,
                };
        
                let rangeMap = {
                    "1": this.withoutEndDate,
                    "2": this.repeatEnd,
                    "3": this.rangeEnd,
                };
        
                return cycleMode[this.cycleMeeting.range] + " " + this.$t('reservation.modal.setMeetingCycle.effectTime') + "：" + rangeMap[this.repeatRange.range] + this.timeRange;
            },
            withoutEndDate () {
                return this.repeatRange.startDate = timezone.getTimezoneDate(this.repeatRange.startDate, this.utcOffset);
            },
            repeatEnd () {
                return timezone.format("yyyy-mm-dd")(this.repeatRange.startDate) + "，" + this.$t('reservation.modal.setMeetingCycle.repeatRange.endAfter') + this.repeatRange["2"].repeatNum + this.$t('reservation.modal.setMeetingCycle.repeatRange.timeAfterEnd');
            },
            rangeEnd () {
                return timezone.format("yyyy-mm-dd")(this.repeatRange.startDate) + " " + this.$t("reservation.modal.setMeetingCycle.-") + " " + timezone.format("yyyy-mm-dd")(this.repeatRange['3'].endDate)
            },
            timeRange () {
                let day = parseInt(this.duration / 24);
                return " " + this.$t('reservation.modal.setMeetingCycle.from') + " " + timezone.getTimezoneTime(this.meetingTime.startTimestamp, this.utcOffset)
                    + " " + this.$t('reservation.modal.setMeetingCycle.to') + " " + (day > 1 ? day + this.$t('reservation.modal.setMeetingCycle.cycleMode.dayAfters') : "")
                    + timezone.getTimezoneTime(this.meetingTime.endTimestamp, this.utcOffset);
            },
            meetingType () {
                return this.$route.path === "/meeting/index/reservationDetail";
            },
        },
        methods:{
            goMeetingControl () {
                this.$router.push({path:"/meeting/index/ControlList",query:{confNum:this.communication.meetingId}})
            },
        	startEdit () {
                this.isPlan===true?this.openModal("editControl"):this.editNormal();
            },
            editNormal () {  //type  对应前端 编辑的是周期会议还是单次会议；condition 对应编辑周期会议还是周期会议中的一个会议、后端认为预约的单次会议为一个plan
                const path = this.confType==="NC"
                    ?"/meeting/index/room"
                    :"/meeting/index/reservation";
                this.$router.push({path:path,query:{type:"once",recordId:this.recordId,planId:this.planId,condition:"plan"}})
            },
            editOnce () { //周期 选择单次
                const path = this.confType==="NC"
                    ?"/meeting/index/room"
                    :"/meeting/index/reservation";
        		this.$router.push({path:path,query:{type:"once",recordId:this.recordId,planId:this.planId,condition:"once"}})
            },
            editPlan () { //周期 选择计划
                const path = this.confType==="NC"
                    ?"/meeting/index/room"
                    :"/meeting/index/reservation";
                this.$router.push({path:path,query:{type:"plan",recordId:this.recordId,planId:this.planId,condition:"plan"}})
            },
            deleteMeeting () {
        		this.isPlan===true?this.openModal("deleteControl"):this.deletePlan();
            },
        	deleteOnce () {
        		this.closeModal("deleteControl");
                this.$confirm(this.$t('detail.deleteConfirmMessage'),this.$t('detail.prompt'),  {
                    confirmButtonText: this.$t('detail.btn.confirm'),
                    cancelButtonText: this.$t('detail.btn.cancel')
                }).then(()=>{
                   this.reqDeleteOnce(this.recordId);
                })
            },
            deletePlan () {
                this.closeModal("deleteControl");
                this.$confirm( this.$t('detail.deleteConfirmMessage'),this.$t('detail.prompt'), {
                    confirmButtonText: this.$t('detail.btn.confirm'),
                    cancelButtonText:this.$t('detail.btn.cancel')
                }).then(()=>{
                	this.reqDeletePlan(this.planId);
                })
            },
            reqDeleteOnce (id) {
                deletOnceMeeting({
                    id:id
                }).then(res=>{
                    this.deleteProcess(res);
                })
            },
            reqDeletePlan (id) {
                deletePlanMeeting({
                    id:id
                }).then(res=>{
                    this.deleteProcess(res);
                })
            },
            deleteProcess (res) {
                if(res.ret===0){
                    this.$alert('', this.$t('detail.deleteSuccess'), {
                        confirmButtonText: this.$t('detail.btn.confirm'),
                        topIcon: 'iconfont icon-chenggongleitishi success',
                        callback:()=>{
                            this.$router.push({path:"/meeting"})
                        }
                    });
                }else {
                    this.$alert('', this.$t('detail.sendFail'), {
                        confirmButtonText: this.$t('detail.btn.confirm'),
                        topIcon: 'iconfont icon-cuowuleitishi fail',
                        message:res.error.msg || res.error.fieldErrors[0].msg || '',
                    });
                }
            },
        	openModal (type) {
        		this[type] = true;
            },
            closeModal (type) {
        	    this[type] = false;
            },
           
            getMeetingDetail () {
            	//0324a6054c1b4b299a6cf1f3665b3968
                reqMeetingDetail(this.$route.query.id).then(res=>{
                	if(res===null){
                	    return this.$message(
                	    	{
                                message:"会议不存在!",
                                duration:1000,
                                onClose:()=>{this.$router.push("/meeting")}
                            }
                        )
                    }
                    this.distributeMeetingData(res);
                })
            },
            
            getLocalTimezone () {
                return timezone.isDST()
                    ?"UTC"+timezone.getUtcOffsetTime(timezone.getUtcOffset()-60) +" DST"
                    :"UTC"+timezone.getUtcOffsetTime(timezone.getUtcOffset())
            },
            getUserRole (userId,participants) {
                return participants.filter(item=>item.id===userId)[0];
            },
            distributeMeetingData (res) {
            
                this.organizer = res.organizer || "";
                this.communication = {
                    meetingId:res.communication===null?"":(res.communication.conferenceNumber || ""),
                    password:res.communication===null?"":(res.communication.password || ""),
                    startTime:timezone.format("yyyy/mm/dd hh:mm:ss")(res.conferenceTimePattern.conferenceTime.startDateTimeStamp)|| "",
                    endTime:timezone.format("yyyy/mm/dd hh:mm:ss")(res.conferenceTimePattern.conferenceTime.endDateTimeStamp)|| "",
                    timezone:this.getLocalTimezone(),
                };
                this.state = res.state;
                //主题
                this.subject = res.conferenceSubject.subject || "";
                //地点
                this.location = res.rooms;
                //参会人员
                this.participants = res.participants.filter(item=>item.role==="attendee"||item.role==="presenter").map(item=>{
                	if(item.displayText===null){
                		item.displayText = item.email;
                    }
                    return item;
                });
                //confType
                
                this.confType = res.confType;
                //organizer
                this.organizer = res.organizer;
                
                //设置编辑按钮
                const userId = JSON.parse(sessionStorage.user).personal.userId;
                
                const user = this.getUserRole(userId,res.participants);
                
                let stateMap = (role) => {
                	
                	let btnState = (edit=false,remove=false,ctrl=false) => {
                        this.hasEditBtn = edit;
                        this.hasRemoveBtn = remove;
                        this.hasCtrlBtn = ctrl;
                    };
    
                    return {
                        ready:()=>{
                            return role === "organizer" || role === "presenter"
                                ? btnState(true,true,false)
                                : btnState(false,false,false);
                        },
                        ongoing:()=>{
                            return role === "organizer"
                                ? btnState(false,true,true)
                                : role === "presenter"
                                    ?btnState(false,false,true)
                                    :btnState(false,false,false);
                        },
                        create:()=>{
                            return role === "organizer"
                                ? btnState(false,true,true)
                                : role === "presenter"
                                    ?btnState(false,false,true)
                                    :btnState(false,false,false);
            
                        },
                        end:()=>{
                            btnState(false,false,false)
                        }
                    };
                    
                };
                stateMap(user.role)[this.state]();
               
                
//                if(typeof user === "undefined"){
//                	userId===this.organizer.id
//                        ? this.hasEditBtn = true
//                        : this.hasEditBtn = false;
//                }else{
//                    user.role!=="presenter"&&user.id!==this.organizer.id
//                        ? this.hasEditBtn = false
//                        : this.hasEditBtn = true;
//                }
                
                
                
                //观众
                this.audience = res.participants.filter(item=>item.role==="castviewer");
                //备注
                this.remark = res.emailRemark|| "";
                
                this.planId = res.conferencePlanId|| "";
                this.recordId = res.id|| "";
                
                
                if(this.checkPlan(res.conferenceTimePattern.recurrencePattern)) return;
               
                this.hasCycle = true;
                
                let cycleDate = edit.formatToCycleDate(
                	res.conferenceTimePattern.recurrencePattern,
                    {
                        cycleTemp:this.extend(this.cycleMeeting),
                        rangeTemp:this.extend(this.repeatRange)
                    },
                );
                
                this.cycleMeeting = cycleDate.cycleMeeting;
                this.repeatRange = cycleDate.repeatRange;
                this.meetingTime = cycleDate.meetingTime;
            },
            checkPlan (val) {
        		if(val===null) {
        			this.isPlan = false;
        			return true
                }else {
        			this.isPlan = true;
        			return false
                }
            },
            extend (data) {
            	return JSON.parse(JSON.stringify(data));
            }
        },
        data () {
            return {
            	hasEditBtn:false,
                hasRemoveBtn:false,
                hasCtrlBtn:false,
            	recordId:"",
                planId:"",
                isPlan:true,
                deleteControl:false,
                editControl:false,
                organizer:{id:"",name:""},
                communication:{
                    meetingId:"",
                    password:"",
                    startTime:"",
                    endTime:"",
                    timezone:"",
                },
                confType:"",
                subject:"",
                location:[],
                participants:[],
                audience:[],
                remark:"",
                hasCycle:false,
                state:"end",
                cycleMeeting: {
                    range:'day',
                    day:{
                        range:'userDefine',
                        userDefine:1,
                    },
                    week:{
                        interval:1,
                        dayList:[]
                    },
                    mounth:{
                        range:"1",
                        "1": {
                            mounth: 1,
                            days: 1,
                        },
                        "2":{
                            mounth:1,
                            numValue:1,
                            daysValue:"Day",
                        }
                    },
                    year:{
                        range:"1",
                        yearsNum:1,
                        "1":{
                            mounth:0,
                            dayNum:1
                        },
                        "2":{
                            mounth:0,
                            numValue:1,
                            daysValue:"Day",
                        }
                    }
                },
                repeatRange:{
                    startDate:"",
                    range:"1",
                    "2":{
                        repeatNum:1,
                    },
                    "3":{
                        endDate:""
                    }
                },
                meetingTime:{
                    startDate:"",
                    startTime:"",
                    startTimestamp:"",
                    endTime:"",
                    endDate:"",
                    endTimestamp:"",
                },
                weekMap:selectDate.weekMap,
                weekList: selectDate.weekList,
                dayNumsList:selectDate.dayNumsList,
                daysList:selectDate.daysList,
                mounthList:selectDate.mounthList,
            }
        },
        mounted () {
            this.getMeetingDetail();
        },
        updated (){
        
        }
    }

</script>
