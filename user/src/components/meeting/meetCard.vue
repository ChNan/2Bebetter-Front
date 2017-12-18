<template>
    <div @mouseenter="tip=true" @mouseout="tip=false" @mouseover.stop="" @click.stop="" @mousedown.stop="">
        <el-tooltip transition="tooltip"  effect="light" content="Top center" placement="top" title="" class="card-meet" :open-delay="500">
            <div slot="content">
                <div class="box-card">
                    <div slot="header" class="clearfix u-tip-title">
                        <div class="text" style="line-height: 32px;">
                            <div :class="{'icon-Videoconference':meeting.type==='vc_room','icon-Generalmeeting':meeting.type==='normal_room'}"
                                class="icon iconfont c-20A0FF f-fs-20px f-fl" style="margin-right: 1px; margin-top: 2px;"></div>
                            <div class="f-fl f-lh-36px f-pdl-10px" :title="meeting.title" >
                                <div style="width: 165px;overflow: hidden;text-overflow: ellipsis;white-space:nowrap; ">{{meeting.title}}</div>
                            </div>
                        </div>
                    </div>
                    
                    <!--这里先写行间样式表，后期图标会尺寸会改动，这里还要改-->
                    <div  class="text item f-mgt-8px f-lh-32px"  style="height: 20px;">
                        
                        <div class="icon-time1 icon iconfont f-fs-23px c-7d7d7d f-fl" style="margin-left: -2px; "></div>
                        <div class="f-fl u-icon-time">
                            {{meeting.start}}-{{meeting.end}}
                        </div>
                        
                    </div>
                    <div  class="text item f-lh-32px" style="height: 20px;">
                        <div class="icon-visitors icon iconfont f-fs-18px c-7d7d7d f-fl u-icon-person"></div>
                        <div :title="meeting.Initiated" class="f-fl" style="width: 169px;overflow: hidden;text-overflow: ellipsis;white-space:nowrap; height: 22px;line-height: 26px;padding-left: 10px;">
                            {{meeting.Initiated}}
                        </div>
                    </div>
                </div>
            </div>
            <el-button></el-button>
        </el-tooltip>
    </div>
</template>

<script>
    
    import timezone from './timezone'
    
    export default {
        props:['time','project','utcOffset'],
        data(){
        	return {
                tip:false
            }
        },
        computed:{
            meeting () {
            	let meeting = this.project.filter((item)=>{
            		return this.isInRange(item.startTimestamp,item.endTimestamp,this.time)
                })[0];
            	
                return {
                    start:timezone.getTimezoneTime(meeting.startTimestamp,this.utcOffset),
                    end:timezone.getTimezoneTime(meeting.endTimestamp,this.utcOffset),
                    Initiated:meeting.Initiated,
                    title:meeting.title,
                    id:meeting.id,
                    planId:meeting.conferencePlanId,
                    type:meeting.rooms[0]
                        ?meeting.rooms[0].type||""
                        :""
                };
            }
        },
    	methods:{
            isInRange (start,end,pos) {
            	return pos>=start&&pos<end;
            },
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
    .c-20A0FF{
        color:#20A0FF;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    .u-icon-person {
        margin-right: 2px;height: 22px;line-height: 26px;
    }
    .u-icon-time {
        height: 22px;
        line-height: 27px;
        padding-left: 10px;
        margin-left: -1px
    }
    .box-card {
        width: 200px;
    }
    .f-pdl-10px{
        padding-left: 10px;
    }
    .f-fs-18px{
        font-size: 18px;
    }
    .f-fs-22px{
        font-size: 22px;
    }
    .f-fs-23px{
        font-size: 23px;
    }
    .f-fs-21px{
        font-size: 21px;
    }
    .f-fs-20px{
        font-size:20px;
    }
    .c-7d7d7d {
        color: #7d7d7d;
    }
    .f-mgt-8px{
        margin-top: 8px;
    }
    .card-meet {
        border: none;
        cursor: default;
        position: absolute;
        z-index: 8;
        height:31px;
        top: 0;
        left: 0;
        background: #d2dce4;
        border-radius: 0;
        width:calc(100% + 1px)
    }
    .u-tip-title{
        border-bottom: 1px solid #ccc
    }
    .f-lh-36px{
        line-height:36px;
    }
</style>
