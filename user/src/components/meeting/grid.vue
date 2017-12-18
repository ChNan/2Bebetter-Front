<template>
    <!--'highLight-time':time.highLight,-->
    <td class="dotted cell"
        @mousedown.stop="highLightTimeStart($event,i,index)"
        @mouseup.stop="highLightTimeEnd($event,i,index)"
        @mouseenter="chooseTime($event,i,index)"
        :class="{
          
            'highLight-border-left':time.highLightTimeLine&&mousefollowY&&timeChecked===false,
            'high-light-range-left':time.rangeLeft,
            'high-light-range-right':time.rangeRight,
            'high-light-check-time-project':time.highLight&&project.checked,
            'zero-time-border': time.isZeroLine&&!time.highLight,
            }"
    >
  <!--'f-resize-cell':time.rangeLeft || time.rangeRight-->
        <meeting-card  v-if="isMeeting"
                       :utc-offset="utcOffset"
                       :time="time.timeStamp"
                       :project="project.meet">
        </meeting-card>
        <takeup-card
            v-if="isTakeUp"
            :choose-date="chooseDate"
            :time="time.timeStamp"
            :project="project.meet"
        ></takeup-card>
    </td>
</template>

<script>
    import meetingCard from './meetCard'
    import takeupCard from './takeupCard'
    import timezone from './timezone'
    export default {
        components:{
            meetingCard,
            takeupCard
        },
        props:['i','index','project','time','mousefollowY','timeChecked','mode','utcOffset','chooseDate'],
        computed:{
            hasStartTime () {
                return this.project.meet.map((item)=>{   //计算会议室是否有预约会议
                    return item.startTimestamp;
                }).indexOf(this.time.timeStamp)>-1;
            },
            isMeeting () {
            	let isCorrctTime = item => this.time.timeStamp>=item.startTimestamp && this.time.timeStamp<item.endTimestamp;
            	
            	return this.some(isCorrctTime)(this.project.meet);
            },
            some :exp => exp => data => data.some(exp), //这里编译有问题。  正确写法是 exp => data => data.some(exp)
            
            isTakeUp () { //计算是否被占用
                
                let isTakeup = item => this.time.timeStamp>=item.startTimestamp
                    && this.time.timeStamp<item.endTimestamp
                    && (this.editType==='plan' ? item.conferencePlanId !==this.planId : item.id !== this.recordId);
                return this.time.highLight
                    &&this.project.checked === true
                    &&this.some(isTakeup)(this.project.meet)
                   
            },
            recordId () {
                return this.$store.state.reservation.recordId;
            },
            planId () {
                return this.$store.state.reservation.planId;
            },
            editType () {
            	return this.$store.state.reservation.editType;
            },
        },
        methods:{
            
            chooseTime (e,i,j) {  //后续这三个事件要放入vuex
                e.preventDefault();
                if(this.mode==='popups') return;
                this.$emit('choose-time',{i:i,j:j})
            },
            highLightTimeStart (e,i,j) {
                e.preventDefault();
            	if(this.mode==='popups') return;
                this.$emit('highlight-start',{i:i,j:j})
            },
            highLightTimeEnd (e,i,j) {
                e.preventDefault();
            	if(this.mode==='popups') return;
                this.$emit('highlight-end',{i:i,j:j})
            },
        
        },
        mounted () {
        
        },
        updated (){
           // console.log("grid更新");
        }
    }
</script>

<style scoped>
    .cell {
        height: 30px;
        position: relative;
        
    }
    .dotted {
        border: 1px dotted #ccc
    }
    .highLight-time {
        background: rgba(132, 201, 234, 0.2);
        border: 1px dotted #fff;
        color: #fff;
    }

    .highLight-border-left {
        border-left: 1px dashed rgba(26, 188, 156, 1) !important;
    }

    .high-light-range-left {
        border-left: 1px solid #2196f3 !important;
    }

    .high-light-range-right {
        border-right: 1px solid #2196f3 !important;
    }

    .high-light-check-time-project {
        background: rgb(33, 150, 243) !important;
        border-left: 1px solid rgb(33, 150, 243);
        border-right: 1px solid rgb(33, 150, 243);
        border-top: 1px solid rgb(33, 150, 243);
        border-bottom: 1px solid rgb(33, 150, 243);
    }


    .zero-time-border {
        /*border-left: 1px solid rgb(33, 150, 243);*/
        border-left:1px solid #333333;
    }

    .f-resize-cell{
        cursor: e-resize;
    }
</style>
