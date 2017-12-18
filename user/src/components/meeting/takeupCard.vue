<template>
    <div @mouseenter="tip=true" @mouseout="tip=false" @mouseover.stop="" @click.stop="" @mousedown.stop="" >
        <el-tooltip  effect="light" :content="$t('reservation.modal.setMeetingCycle.cycleMode.takeUpCard')" placement="top" title="" class="card-meet">
            <el-button></el-button>
        </el-tooltip>
    </div>
</template>

<script>
    
    import timezone from './timezone'
    
    export default {
        props:['time','project','utcOffset','chooseDate'],
        data(){
            return {
                tip:false
            }
        },
        watch:{
        
        },
        computed:{
            takeUpTime () {
                let time = this.time;
                let project = this.project;
                let halfHourLength;
                console.log(this.chooseDate);
                project.forEach((item)=>{
                    if(time === item.startTimestamp){
                        halfHourLength = item.halfHourLength
                    }
                });
    
                return{
                    start:timezone.getTimezoneTime(time),
                    end:timezone.getTimezoneTime(time+halfHourLength*1800000),
                    use:true,
                    halfHourLength:halfHourLength
                };
                

            }
        },
        methods:{
        
        },
        mounted () {
        
        }
    }
</script>

<style scoped="">
    .text {
        font-size: 14px;
    }
    
    .item {
        padding: 0.5em 0;
    }
    
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    
    .box-card {
        width: 200px;
    }
    
    .card-meet {
        border: none;
        cursor: default;
        position: absolute;
        z-index: 9;
        height:32px;
        top: 0;
        left: 0;
        width: calc(100% + 1px);
        background: #F7BA2A;
        border-radius: 0;
    }
    .u-tip-title{
        border-bottom: 1px solid #ccc
    }
    .f-lh-36px{
        line-height:36px;
    }
</style>
