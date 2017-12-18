<template lang="html">
  <div style="position:relative;width:100%;">
  <div class="fc-content-col" v-if="typeof planDetail !== 'undefined'"  v-for="(item ,index ) in planDetail">
    <div class="fc-event-container fc-helper-container">
    </div>
    <div class="fc-event-container" style="width:100%">
       <el-popover placement="left" trigger="hover">
             <!-- 弹窗内容 -->
             <div class="speech-popover" >
                    <!--标题-->
                     <p class="speech-line title" style="padding-bottom: 10px">
                          <i class="icon iconfont icon-Videoconference f-s paddingr color fl" :title="$t('schedule.videoIcon')" v-if="item.confType==='VSC'||item.confType==='VGCP'"></i>
                          <!-- TODO 若是会议室则显示会议室的图标-->
                           <i class="icon iconfont icon-Generalmeeting f-s paddingr color fl  " :title="$t('schedule.meetIcon')"  v-if="item.confType==='NC'" ></i>
                          <span :title="item.title" class="txt-over">{{item.title}}</span>
                     </p>
                     <!--时间-->
                     <p class="content233" v-if="item.time">
                          <i class="icon iconfont icon-time1 f-s paddingr  colors fl":title="$t('schedule.timeIcon')" ></i>
                          <span :title="item.time" > {{item.time}}</span>
                     </p>
                     <!--地点-->
                     <p class="content233" v-if="item.position">
                          <i class="icon iconfont icon-bigaddress f-s  paddingr colors fl" :title="$t('schedule.locationIcon')"></i>
                          <span :title="item.position" class="txt-over">{{item.position}}</span>
                     </p>
                     <!--演讲者-->
                     <p class="content233" v-if="item.speaker">
                          <i class="icon iconfont icon-Name-small   paddingr colors fl"style="font-size: 22px" :title="$t('schedule.speakerIcon')"></i>
                          <span :title="item.speaker"> {{item.speaker}}</span>
                    </p>
                    <!--会议id-->
                    <p class="content233"  v-if="item.confType==='VSC'||item.confType==='VGCP'">
                          <i class="icon iconfont icon-id1 f-s  paddingr colors fl " :title="$t('schedule.idIcon')"></i>
                            {{item.recurrenceId}}
                    </p>
                    <!--会议密码-->
                    <p class="content233"  v-if="item.confType==='VSC'||item.confType==='VGCP'">
                           <i class="icon iconfont icon-detailslock f-s  paddingr colors fl" :title="$t('schedule.passwordIcon')"></i>
                           {{item.password}}
                    </p>
                    <!--进入会控按钮-->
                           <!--<el-button type="primary" @click="handleEvent(item)" v-if="(item.confType==='VSC'||item.confType==='VGCP')&&(item.state==='create'||item.state==='ongoing')" >{{$t("schedule.confControl")}}</el-button>-->
                           <!--<el-button type="primary" @click="showDetail">{{$t("schedule.gotoDetail")}}</el-button>-->
                      
							<div style="text-align:center;width:auto;min-width: 300px;" class="clearfix">
 								<div style="float:left"  class="card-button card-button--primary" @click="showDetail(item)"  >{{$t("schedule.gotoDetail")}}</div>
								<div style="float:right"  class="card-button card-button--danger" @click="deleteDetail(item)"  v-if="showButton(item)">{{$t("schedule.delete")}}</div>
								<div  class="card-button card-button--primary"  v-show="showControl(item)" @click="handleEvent(item)" >{{$t("schedule.confControl")}}</div>
							     <!--会议周期图标-->
								 </div>
								<p class="content233" v-if="item.round">
									<i  class="icon iconfont icon-refresh-samll f-s-round f-fr color-round" style="margin-top:8px;" v-show="item.round" :title="$t('schedule.cycle')"></i>
									</p>	
							
                
              </div>
              <!--日程表中占用的块-->
			  
              <a class="fc-time-grid-event fc-v-event fc-event fc-start fc-end fc-draggable fc-resizable fc-allow-mouse-resize"
                :style="{top:item.pTop+'px',bottom:item.pBottom+'px','width':item.width,'margin-left':item.margin}" @click="showDetail(item)"
                 :class="{ingcolor:item.status==='ongoing',finishedcolor:item.status==='end'}"
                slot="reference">
                <div class="fc-content" v-if="isUndefined">
                    <div class="fc-title" style="padding: 5px;">
                    <div class="title-limit"> {{item.title}}</div>
                </div>
                <!--<div class="tzo">-->
                  <!--{{item.time}}<br />-->
                   <!--{{item.position}}<br/>-->
                   <!--{{item.speaker}}<br/>-->
                   <!--{{item.status}}-->
                 <!--<br/>-->
                <!--</div>-->
              </div>
                <div class="fc-bg"></div>
              </a>
</el-popover>
    </div>

  </div>
  		<el-dialog :title="$t('control.deleteTit')" :visible.sync="deleteControl" ref="deleteControl"   size="tiny" >
					<el-row>
						<el-col :span="24" class="f-tac">
							<span>{{$t('control.deleteConf')}}</span>
						</el-col>
					</el-row>
					<span slot="footer" class="dialog-footer">
							<el-button type="primary" @click="deleteOnce">{{$t('control.deleteOnce')}}</el-button>
							<el-button type="primary" @click="deletePlan">{{$t('control.deletePlan')}}</el-button>
						</span>
				</el-dialog>
    </div>
	
</template>

<script>
function percentNum(num, num2, cul) {
	return (Math.round(num / num2 * 10000) / 100.00 - cul + "%"); //小数点后两位百分比
}
import { deletOnceMeeting, deletePlanMeeting, reqMeetingDetail } from "@/api/meetingDetail/"
import { createWidth } from './util'
export default {
	props: {
		planDetail: {
			type: Array
		}

	},
	watch: {
		planDetail: {
			deep: true,
			handler: function(val) {
				this.computeWidth();
			}
		}
	},
	data() {
		return {
			isShow: false,
			isBubble: -1,
			details: '',
			deleteControl: false,
			planId: '',
			recordId: ''
		}
	},
	computed: {
		isUndefined() {
			return typeof this.planDetail !== 'undefined';
		}
	},
	created() {
		if (this.isUndefined) {
			createWidth(this.planDetail);
		}

	},
	mounted(){
		
	},
	methods: {
		//计算日程平均百分比宽
		showButton(item){
			if(item.status == 'end'){
				return false;
			}
			if(item.status === 'create' || item.status === 'ongoing'){
				return item.isOrganizer;
			}else{
				return (item.isOrganizer || item.isPresenter);
			}
			
		},
		showControl(item){
			return (item.confType != 'NC') && (item.status === 'create' || item.status === 'ongoing') && (item.isOrganizer || item.isPresenter)
		},
		computeWidth() {
			if (this.isUndefined) {
				createWidth(this.planDetail);
			}
		},
		handleEvent(item) {
			this.$router.push({ path: '/meeting/index/ControlList', query: { confNum: item.recurrenceId } })
			//this.$router.push({ path: '/index/control' })
		},
		showDetail(item) {
			let path = item.confType === "NC"
				? '/meeting/index/meetingDetail' //预约会议室详情
				: '/meeting/index/reservationDetail';//预约视频会议详情

			this.$router.push({ path: path, query: { id: item.id } })
			//this.$router.push({ path: '/index/reservationDetail', query: { id: item.id } })
		},
		deleteOnce() {
			//this.closeModal("deleteControl");
			this.deleteControl = false;
			this.$confirm(this.$t('control.notice'), this.$t('control.tip'), {
				confirmButtonText: this.$t('control.confirm'),
				cancelButtonText: this.$t('control.cancel')
			}).then(() => {
				this.reqDeleteOnce(this.recordId);
			})
		},
		deletePlan() {
			this.deleteControl = false;
			this.$confirm(this.$t('control.notice'), this.$t('control.tip'), {
				confirmButtonText: this.$t('control.confirm'),
				cancelButtonText: this.$t('control.cancel')
			}).then(() => {
				this.reqDeletePlan(this.planId);
			})
		},
		reqDeleteOnce(id) {
			deletOnceMeeting({
				id: id
			}).then(res => {
				this.deleteProcess(res);
			})
		},
		reqDeletePlan(id) {
			deletePlanMeeting({
				id: id
			}).then(res => {
				this.deleteProcess(res);
			})
		},
		deleteProcess(res) {
			if (res.ret === 0) {
				this.$alert('', this.$t('schedule.del'), {
					confirmButtonText: this.$t('control.confirm'),
					topIcon: 'iconfont icon-chenggongleitishi success',
					callback: () => {
						window.location.reload();
					}
				});
			} else {
				this.$alert('', this.$t('schedule.fail'), {
					confirmButtonText: this.$t('control.confirm'),
					topIcon: 'iconfont icon-remove fail',
				});
			}
		},
		deleteDetail(item) {
			this.planId = item.planId;
			this.deleteControl = item.patern;
			if (!this.deleteControl) {
				this.deletePlan();
			}else{
				//调整dialog的层级，避免popover层级高于背景蒙层
				let child = this.$refs.deleteControl.$el;
				$(this.$refs.deleteControl.$el).remove();
				$('body').append(child);   
			}
			// console.log(this.deleteControl)
			this.recordId = item.id;

		}
	}

}

</script>
<style lang="scss">
.el-popover {
	padding: 0px 10px 10px 10px!important;
}
.z-indexs{
	.el-dialog__wrapper{
	z-index:3000!important;
	}
	
}
.ingcolor {
	background-color: #6EDBFA;
}

.finishedcolor {
	background-color: #dddddd;
}

.finishedcolor:hover {
	background-color: #858282;
}

.finishedcolor:active {
	background-color: rgba(133, 130, 130, 0.8);
}
</style>
<style lang="scss" scoped>
$bg-color: #fff;
$font-color: gray;
$title: 16px;
$content: 14px;
.card-button{	
display: inline-block;
line-height: 1;
white-space: nowrap;
cursor: pointer;
background: #fff;
border: 1px solid #bfcbd9;
border-color: #c4c4c4;
color: #1f2d3d;
-webkit-appearance: none;
text-align: center;
box-sizing: border-box;
outline: none;
margin: 0;
-moz-user-select: none;
-webkit-user-select: none;
-ms-user-select: none;
padding: 10px 15px;
font-size: 14px;
border-radius: 4px;
}
.card-button--primary{
color: #fff;
background-color: #2699f4;
border-color: #2699f4;
}

.card-button--danger{
    color: #fff;
    background-color: #ff4949;
    border-color: #ff4949;

}

.speech-line {
	border-bottom: 1px solid #d5d5d5;
	height: 20px;
	/*line-height: 24px;*/
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.speech-popover {
	color: #464646;
	padding: 6px;
	width: 300px;
	font-family: MicrosoftYaHei;
	p {
		text-align: left;
		border:none;
		border-radius: 0;
	}
	.title {
		font-size: 16px;
		margin: 0;
		padding: 10px 0 15px !important;
		span {
			line-height: 24px;
		}
	}
	.content233 {
		font-size: 14px;
		height: 29px;
		line-height: 24px;
		// max-width: 280px;
		// width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0;
		
	}
}

.txt-over {
	max-width: 265px;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	vertical-align: bottom;
	display: inline-block;
}



/*弹窗*/

.f-s {
	font-size: 22px
}

.color {
	color: #20a0ff;
}

.paddingr {
	padding-right: 16px;
}

.colors {
	color: #7d7d7d;
}

.fl {
	float: left;
}

.f-s-round {
	font-size: 22px;
}

.color-round {
	color: #8492a6;
}

.title-cut {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}


/*会议块的样式*/

.title-limit {
	width: 100%;
	height: 16px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
