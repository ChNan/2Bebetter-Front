<template>
    <div>
        <template v-if="businessModel==='cloudPort'&&mode==='video'">
            <el-row v-show="mode!=='popups'">
                <el-col :xs="2" :sm="2" :md="2" :lg="2">
                    <div class="f-tar f-line-middle">
                        <span class="f-pdr-1em" :class="{'label-size-en':language==='en-US','label-size':language==='zh-CN'}">
                            {{$t('reservation.meetingRoom')}}
                        </span>
                    </div>
                </el-col>
                <el-col :xs="4" :sm="4" :md="4" :lg="4">
                    <div class="f-fl" >
                        <div class="u-btn u-btn-pull-up-area" :plain="true" type="info" @click.stop="triggerMeetingTable()">{{btnName}}</div>
                    </div>
                    <div class="f-fl u-btn-pull-up-area f-pdl-1em" v-if="showRsourceBtn">|</div>
                    <div v-if="mode!=='room'&&showRsourceBtn" class="f-fl u-btn-pull-up-area f-pdl-16px">
                        <a href="javascript:" :title="$t('reservation.modal.vmrResource.title')" class="u-c17bbf1"  @click="showVideoResource()">
                            <i style="font-size: 18px;" class="icon iconfont icon-chakan u-btn"></i>
                        </a>
                    </div>
        
                </el-col>
            </el-row>
            <transition name="fade">
                <el-row v-show="mode!=='popups'&&openMeeting">
                    <el-col :offset="2" :xs="4" :sm="4" :md="4" :lg="4">
                        <dropdown-tree
                            ref="dropdownTree"
                            :tree-data="areaList"
                            @selected-item="setProjectList">
                        </dropdown-tree>
        
                    </el-col>
                    <el-col :xs="17" :sm="17" :md="17" :lg="17">
                        <div class="f-fl f-pdl-1em" style="width: calc(100% - 14px)">
                            <el-select
                                class="f-w-100"
                                v-model="selectedProject"
                                @change="changeSelectProject"
                                multiple
                                filterable
                                remote
                                :placeholder="$t('reservation.placeholder.searchMeetingRoom')"
                            ><!-- :remote-method="matchQuery"--><!-- :dropDownControl="false"-->
                                <el-option
                                    v-for="item in projectList"
                                    @click="test(item)"
                                    :key="item.id"
                                    :label="item.projectName.length>60?item.projectName.substring(0,60):item.projectName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </el-col>
                </el-row>
            </transition>
            
        </template>
        <template v-else>
            <el-row v-show="mode!=='popups'">
                <el-col :xs="2" :sm="2" :md="2" :lg="2">
                    <div class="f-tar f-line-middle">
                        <span class="f-pdr-1em"  :class="{'label-size-en':language==='en-US','label-size':language==='zh-CN'}">
                            {{$t('reservation.meetingRoom')}}
                        </span>
                    </div>
                </el-col>
                <el-col :xs="4" :sm="4" :md="4" :lg="4">
                    <dropdown-tree
                        ref="dropdownTree"
                        :tree-data="areaList"
                        @selected-item="setProjectList">
                    </dropdown-tree>
        
                </el-col>
                <el-col :xs="17" :sm="17" :md="17" :lg="17">
                    <div class="f-fl f-pdl-1em f-w-83">
                        <el-select
                            class="f-w-100"
                            v-model="selectedProject"
                            @change="changeSelectProject"
                            multiple
                            filterable
                            remote
                            :placeholder="$t('reservation.placeholder.searchMeetingRoom')"
                        ><!-- :remote-method="matchQuery"--><!-- :dropDownControl="false"-->
                            <el-option
                                v-for="item in projectList"
                                @click="test(item)"
                                :key="item.id"
                                :label="item.projectName.length>60?item.projectName.substring(0,60)+'...':item.projectName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div v-if="mode!=='room'&&showRsourceBtn" class="f-fr u-btn-pull-up-area f-pdl-16px">
                        <a href="javascript:" :title="$t('reservation.modal.vmrResource.title')" class="u-c17bbf1" v-if="mode==='video'" @click="showVideoResource()">
                            <i style="font-size: 18px;" class="icon iconfont icon-chakan u-btn"></i>
                        </a>
                    </div>
                    <div class="f-fr u-btn-pull-up-area f-pdl-1em" v-if="mode!=='room'&&showRsourceBtn">|</div>
                    <div class="f-fr">
                        <div class="u-btn u-btn-pull-up-area" :plain="true" type="info" @click.stop="triggerMeetingTable()">{{btnName}}</div>
                    </div>
                </el-col>
            </el-row>
        </template>
        <transition name="fade">
            <el-row v-show="openMeeting"  style="padding-top: 9px">
                <el-col :id="idList.meetingTable" :xs="tableSize" :sm="tableSize" :md="tableSize" :lg="tableSize" :offset="tableOffset">
                    <div class="card" :style="{'width':contentWidth+'px'}" @mouseleave="resetHighLight()">
                            <loading :show="loading" :height="timeListHeight" :width="contentWidth"></loading>
                            <div v-if="projectList.length===0&&loading===false" :style="{'height':timeListHeight+85+'px','width':contentWidth+'px'}" style="text-align: center;font-size: 16px; z-index:8;position: absolute;background: rgba(255,255,255,0.5);">
                                <div class="icon-wushuju icon iconfont" style="margin-top: 130px;font-size: 50px; color: #a8a8a8"></div>
                                <div style="margin-top: 15px;">{{$t('reservation.tip.null')}}</div>
                            </div>
                            <table>
                            <thead class="theader">
                            <tr>
                                <th :style="{'width':projectWidth+'px'}" class="f-pdt-15px">
                                    <el-date-picker :editable="false" class="f-w-90" v-model="startDate" type="date" placeholder="选择日期" :picker-options="datePickerOptions"></el-date-picker>
                                </th>
                                <th class="no-padding"></th>
                                <!--时间列表-->
                                <th>
                                    <div class="f-oh" style="height: 65px;">
                                        <div :id="idList.timeTitle" :style="{'width':timeTitleWidth+'px'}"
                                             class="u-timelist-arrow">
                                            <table :style="{'width':timeListTableWidth+'px'}">
                                                <tbody>
                                                    <tr></tr>
                                                    <tr>
                                                        <td class="scales" v-for="(item,index) in timeList">
                                                            <div v-if="index%48===0" class="u-timelist-date">
                                                                <span class="pull-left"  style="font-size: 14px;">
                                                                  {{getTimeZoneDate(item.timeStamp).replace(/\//g, '-')}}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <div class="scale-height scale-width"
                                                                     :class="{'high-light-time-line': item.highLight}">
                                                                    <div class="scale-lines"></div>
                                                                    <div class="scale-hours"
                                                                         :class="{'highLight-arrow':item.highLightTimeLine&&mousefollowY&&timeChecked===false}"
                                                                         v-if="index%2==0"></div>
                                                                    <div class="scale-half-hours"
                                                                         :class="{'highLight-arrow':item.highLightTimeLine&&mousefollowY&&timeChecked===false,'scale-half-hours-active':item.highLight===true}"
                                                                         v-else=""></div>
                                                                </div>
                                                                <span class="scale-value"
                                                                      style="font-size: 14px;"
                                                                      v-if="index%2==0"
                                                                      :class="{'high-light-time-value':item.highLightTimeLine&&mousefollowY&&timeChecked===false}">
                                                                    {{getTimeZoneTime(item.timeStamp)}}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="f-h-halfem"></tr>
                            <tr>
                                <td>
                                    <!--项目列表-->
                                    <div :style="{'width':projectWidth-17+'px'}"
                                         style="padding-bottom: 14px;" class="f-oh">
                                        <div :id="idList.projectList"
                                             :style="{
                                               'width':projectWidth+'px',
                                               'height':projectHeight+'px'
                                             }"
                                             class="f-ofxh f-ofys"
                                             @scroll="scrollControl($event,idList.timeTable)"
                                             @mouseenter="setId(idList.projectList)">
                                            <table>
                                                <tbody>
                                                    <tr class="border no-border-left"
                                                        v-for="(item,index) in projectList"
                                                        v-show="!item.hide"
                                                        @mouseenter="highLightLine(index)"
                                                        :class="{
                                                        'highLight-bac':item.highLight,
                                                        'checked-bac':item.checked
                                                    }">
                                                        <td class="f-h-30px" :title="item.projectName">
                                                            <div>
                                                                <div class="pull-left f-fs-14px f-pdl-1em">
                                                                    <div v-if="mode==='popups'" style="margin-left: -1em;">
                                                                        <div>
                                                                            <div class="f-fl icon iconfont icon-cloud u-popups-project-icon"></div>
                                                                            <div class="f-fl u-popups-project-name">{{item.projectName}}</div>
                                                                        </div>
                                                                    </div>
                                                                    <el-checkbox v-else @change="checkProject(index,item.checked)" v-model="item.checked">
                                                                        <div class="u-project-content">
                                                                            <div :class="{'icon-Videoconference':item.type==='vc_room','icon-Generalmeeting':item.type==='normal_room'}"
                                                                                 class="icon iconfont f-fl u-normal-project-icon">
                                                                            </div>
                                                                            <div class="f-fl u-normal-project-name"
                                                                                 style="overflow: hidden;text-overflow: ellipsis;white-space:nowrap"
                                                                                 :style="{'width':projectWidth-100+'px'}"
                                                                                >{{item.projectName}}</div>
                                                                        </div>
                                                                    </el-checkbox>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
            
                                </td>
                                <td style="cursor: col-resize" @mousedown="scaleStart($event)" class="drag-t no-padding"></td>
                                <td class="f-pr">
                                    <div :id="idList.timeTable"
                                         :style="{
                                             'width':timeListWidth+'px',
                                             'height':timeListHeight+'px'
                                         }"
                                         class="f-border-box f-ofys"
                                         @scroll="scrollControl($event,idList.projectList)"
                                         @mouseenter="setId(idList.timeTable)">
                                        <table :title="tipMsg" :style="{'width':timeListTableWidth+'px','cursor':mouseStyle}" class="f-border-box">
                                            <tbody>
                                            <tr class="f-h-1px"></tr>
                                            <!--拆分组件-->
                                            <tr v-for="(item,index) in projectList" is="tr-line" class="dotted" :key="index" :mode="mode"
                                                :project="item"
                                                :index="index"
                                                :utc-offset="utcOffset"
                                                @choose-time="chooseTime($event)"
                                                @highlight-start="highLightTimeStart($event)"
                                                @highlight-end="highLightTimeEnd($event)"
                                                :mousefollow-y="mousefollowY"
                                                :time-list="timeList"
                                                :time-checked="timeChecked"
                                                :choose-date="chooseDateForTakeup"
                                                style="border-left: 1px solid #ccc"
                                            >
                                            </tr>
                        
                                            <!--未拆分-->
                                            <!--<tr class="dotted"-->
                                                <!--v-for="(project,index) in projectList"-->
                                                <!--:key="index"-->
                                                <!--v-show="!project.hide"-->

                                                <!--:class="{-->
                                            <!--'highLight-bac':project.highLight,-->
                                            <!--'checked-bac':project.checked-->
                                            <!--}">-->
                                                <!--<td class="dotted"-->
                                                    <!--style="height: 30px; position: relative"-->
                                                    <!--v-for="(item,i) in timeList"-->
                                                    <!--:key="i"-->
                                                    <!--@mousedown.stop="highLightTimeStart({i:i,j:index})"-->
                                                    <!--@mouseup.stop="highLightTimeEnd({i:i,j:index})"-->
                                                    <!--@mouseenter="chooseTime({i:i,j:index})"-->
                                                            <!--:class="{-->
                                                    <!--'highLight-time':item.highLight,-->
                                                    <!--'highLight-border-left':item.highLightTimeLine&&mousefollowY&&timeChecked===false,-->
                                                    <!--'high-light-range-left':item.rangeLeft,-->
                                                    <!--'high-light-range-right':item.rangeRight,-->
                                                    <!--'high-light-check-time-project':item.highLight&&project.checked,-->
                                                    <!--'zero-time-border':i%48===0&&!item.highLight-->
                                                    <!--}">-->
                                                <!--</td>-->
                                            <!--</tr>-->
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="scroll-contrl-area-right"
                                         :style="{'height':(timeListHeight-17)+'px'}"
                                         @mouseover="chooseScroll($event,3)"
                                         @mouseout="clearTimer()"
                                         @mouseup.stop="highLightTimeEnd()">
                                    </div>
                                    <div class="scroll-contrl-area-left"
                                         :style="{'height':(timeListHeight-17)+'px'}"
                                         @mouseover="chooseScroll($event,-3)"
                                         @mouseout="clearTimer()"
                                         @mouseup.stop="highLightTimeEnd()">
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                            <tfoot>
                            <tr>
                                <td class="u-resize-area" @mousedown="scaleYStart($event)"></td>
                                <td class="u-resize-area" @mousedown="scaleYStart($event)"></td>
                                <td class="u-resize-area" @mousedown="scaleYStart($event)"></td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </el-col>
            </el-row>
        </transition>
        
        <el-form :rules="rules" :model="chooseDate">
            <el-row v-show="mode!=='popups'" style="padding-top: 1.5em;">
                <el-col :xs="2" :sm="2" :md="2" :lg="2">
                    <div class="f-tar u-label-middle">
                        <span v-show="cycleShow===false" class="f-pdr-1em"  :class="{'label-size-en':language==='en-US','label-size':language==='zh-CN'}">
                            {{$t('reservation.startTime')}}
                        </span>
                        <span v-show="cycleShow===true" class="f-pdr-1em"  :class="{'label-size-en':language==='en-US','label-size':language==='zh-CN'}">
                            {{$t('reservation.time')}}
                        </span>
                    </div>
                </el-col>
                <el-col v-show="cycleShow===false" :xs="7" :sm="7" :md="7" :lg="7">
                    <el-row class="f-tal u-picker">
                        <el-col :span="11">
                            <el-form-item prop="startDate" class="no-margin">
                                <el-date-picker :editable="false" @blur="setActivePicker('startDate')" @change="autoRender($event,'startDate')" class="f-w-100" v-model="chooseDate.startDate" type="date"
                                                :placeholder="$t('reservation.placeholder.chooseDate')" :picker-options="datePickerOptions">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" class="f-mgl-1em">
                            <el-form-item prop="startTime" class="no-margin">
                                <el-time-select @blur="setActivePicker('startTime')" :editable="false" @change="autoRender($event,'startTime')" class="f-w-100" v-model="chooseDate.startTime" :picker-options="timePickerOption"
                                                :placeholder="$t('reservation.placeholder.chooseTime')">
                                </el-time-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col v-show="cycleShow===false" :xs="2" :sm="2" :md="2" :lg="2">
                    <div class="f-tar u-label-middle">
                        <span class="f-pdr-1em" :class="{'label-size-en':language==='en-US','label-size':language==='zh-CN'}">
                            {{$t('reservation.endTime')}}
                        </span>
                    </div>
                </el-col>
                <el-col v-show="cycleShow===false" :xs="7" :sm="7" :md="7" :lg="7">
                    <el-row class="f-tal u-picker">
                        <el-col :span="11">
                            <el-form-item prop="endDate" class="no-margin">
                                <el-date-picker @blur="setActivePicker('endDate')" :editable="false" @change="autoRender($event,'endDate')" class="f-w-100" v-model="chooseDate.endDate" type="date"
                                                :placeholder="$t('reservation.placeholder.chooseDate')" :picker-options="datePickerOptions">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" class="f-mgl-1em">
                            <el-form-item prop="endTime" class="no-margin">
                                <el-time-select @blur="setActivePicker('endTime')" :editable="false" @change="autoRender($event,'endTime')" class="f-w-100" v-model="chooseDate.endTime" :picker-options="timePickerOption"
                                                :placeholder="$t('reservation.placeholder.chooseTime')">
                                </el-time-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :xs="5" :sm="5" :md="5" :lg="5">
                    <div class="f-tar f-pdb-1em f-minw-150px" v-if="!cycleShow">
                        <div class="f-fr u-btn u-btn-opentimezone" :plain="true" type="info" @click.stop="triggerTimeArea()">{{timeBtnName}}</div>
                        <div v-if="$route.query.condition!=='once'" class="f-fr u-btn u-btn-setcycle" :plain="true" type="info" @click.stop="setCycle()">{{$t('reservation.setCycle')}}</div>
                    </div>
                    <div class="f-tar f-pdb-1em f-minw-150px" v-if="cycleShow">
                        <div v-if="$route.query.condition!=='once'" class="f-fl u-btn u-btn-setcycle" :plain="true" type="info" @click.stop="setCycle()">{{$t('reservation.setCycle')}}</div>
                        <div class="f-fl u-btn u-btn-opentimezone" :plain="true" type="info" @click.stop="triggerTimeArea()">{{timeBtnName}}</div>
                    </div>
                </el-col>
            </el-row>
            <el-row v-show="mode!=='popups'" class="f-pdb-halfem" >
                <el-col :offset="2" :span="timezoneSelectWidth" :class="{'f-pdb-1em':!cycleShow}" v-show="openTimeArea">
                    <el-select  v-model="timeZone"  @change="changeTimeZone($event)" filterable :placeholder="$t('reservation.placeholder.selectTimezone')" class="f-w-100">
                        <el-option v-for="item in timeZoneList"
                                   :key="item.zoneId"
                                   :label="language==='zh-CN'?item.cnZoneName:item.usZoneName"
                                   :value="item.zoneId">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2" v-if="summerTime.show&&openTimeArea" class="f-tar u-summer-time">
                    <el-checkbox v-model="summerTime.checked" @change="changeSummertime(summerTime.checked)">{{$t('reservation.summerTimer')}}</el-checkbox>
                </el-col>
            </el-row>
        </el-form>
        <el-form v-show="cycleShow===true" :class="{'f-mgt--2em':openTimeArea}">
            <el-row v-show="mode!=='popups'" class="f-pdt-15px">
                <el-col :xs="2" :sm="2" :md="2" :lg="2">
                    <div class="f-tar u-label-middle">
                        <span class="f-pdr-1em"  :class="{'label-size-en':language==='en-US','label-size':language==='zh-CN'}">
                            {{$t('reservation.meetingCycle')}}
                        </span>
                    </div>
                </el-col>
                <el-col :xs="20" :sm="20" :md="20" :lg="20">
                    <el-row class="f-tal u-picker">
                        <el-col :span="20">
                            <el-form-item class="no-margin">
                                <div class="f-w-100">
                                    <span>
                                        {{cycleStr}}
                                    </span>
                                    <span class="f-mgl-3em">
                                        <i @click="cancelCycle()" class="icon-delete icon iconfont"></i>
                                    </span>
                                </div>
                               
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </el-form>
       
    </div>
</template>

<script>
    
    import dropdownTree from './dropdownTree'
    import trLine from './line'
    import moment from 'moment'
    import loading from './loading'
    import F from './tools'
    import timezone from './timezone'
    import {
        reqMeetingRoomList,
        reqTimezoneList,
        reqCheckTimezone,
        reqVmr,
        reqOrgTree,
        reqConflictCheck,
    } from "@/api/reservation/"
    
    let timeChooseTip = true;
    
    export default {
        components:{
            dropdownTree,
            trLine,
            loading
        },
        props:['mode','vmrTimezone','businessModel','cycleShow','cycleStr','cycleData','cycleTime','vmrUtcOffset'],
        data () {
        	
        	let check = (rule, value, callback, message)=>{
        		if(typeof value==="undefined" || value==="" || value===null){
        			if(timeChooseTip){
                        callback (new Error(message));
                    }else {
                        timeChooseTip = true;
                        callback();
                    }
                }else {
                
        			callback();
                }
            };
            
        	let setCheck = (message)=>{
        		return  { validator: (rule, value, callback) =>{check(rule, value, callback, message)}, trigger: 'change' }
            };
        	
            return {
            	summerTime:{
            		offset:0,
            		show:false,
                    checked:false,
                },
            	version:2,
                timeZoneList:[],
                rules:{
                    startDate: [
                    	setCheck(this.$t('reservation.message.inputCheck.startDate'))
                    ],
                    endDate: [
                        setCheck(this.$t('reservation.message.inputCheck.endDate'))
                    ],
                    startTime: [
                        setCheck(this.$t('reservation.message.inputCheck.startTime'))
                    ],
                    endTime: [
                        setCheck(this.$t('reservation.message.inputCheck.endTime'))
                    ]
                },
                timeZone:'',
            	openTimeArea:false,
                openMeeting:true,
            	sliderData:[],
                areaList:[],
                chooseDate: {
                    startDate: '',
                    startTime: '',
                    startTimestamp:'',
                    endTimestamp:'',
                    endDate: '',
                    endTime: ''
                },
                timePickerOption: {
                    start: '00:00',
                    step: '00:30',
                    end: '23:30'
                },
               
                labelPosition: 'left',
                query: null,
                timeMap: [
                    {timePoint: "00:00"},
                    {timePoint: "00:30"},
                    {timePoint: "01:00"},
                    {timePoint: "01:30"},
                    {timePoint: "02:00"},
                    {timePoint: "02:30"},
                    {timePoint: "03:00"},
                    {timePoint: "03:30"},
                    {timePoint: "04:00"},
                    {timePoint: "04:30"},
                    {timePoint: "05:00"},
                    {timePoint: "05:30"},
                    {timePoint: "06:00"},
                    {timePoint: "06:30"},
                    {timePoint: "07:00"},
                    {timePoint: "07:30"},
                    {timePoint: "08:00"},
                    {timePoint: "08:30"},
                    {timePoint: "09:00"},
                    {timePoint: "09:30"},
                    {timePoint: "10:00"},
                    {timePoint: "10:30"},
                    {timePoint: "11:00"},
                    {timePoint: "11:30"},
                    {timePoint: "12:00"},
                    {timePoint: "12:30"},
                    {timePoint: "13:00"},
                    {timePoint: "13:30"},
                    {timePoint: "14:00"},
                    {timePoint: "14:30"},
                    {timePoint: "15:00"},
                    {timePoint: "15:30"},
                    {timePoint: "16:00"},
                    {timePoint: "16:30"},
                    {timePoint: "17:00"},
                    {timePoint: "17:30"},
                    {timePoint: "18:00"},
                    {timePoint: "18:30"},
                    {timePoint: "19:00"},
                    {timePoint: "19:30"},
                    {timePoint: "20:00"},
                    {timePoint: "20:30"},
                    {timePoint: "21:00"},
                    {timePoint: "21:30"},
                    {timePoint: "22:00"},
                    {timePoint: "22:30"},
                    {timePoint: "23:00"},
                    {timePoint: "23:30"}
                ],
                timeList: [],
                projectList: [],
                scrollId: '',
                scrollTop: 0,
                scrollLeft: 0,
                chooseable: 0,
                startChoose: null,
                scaleXAble: false,
                scaleYAble: false,
                screenX: null,
                screenY: null,
                contentWidth:1615,
                timeTitleWidth: 1278,
                timeListWidth: 1295,
                timeListHeight: 217,
                projectWidth: 330,
                projectHeight: 200,
                widthSave: {
                    timeTitleWidth: 1333,
                    timeListWidth: 1347,
                    projectWidth: 330,
                },
                count: 0,
                heightSave: {
                    timeListHeight: 217,
                    projectHeight: 200
                },
                renderArrow:true,
                scrollTimer: 0,
                lastDaysPoint: null,
                dayNum: 2,
                timeChecked: false,
                selectedProject: [],
                selectedProjectObj:{},
                selectedProjectObjAll:[],
                mousefollowY: true,
                scrollcount:1,
                scaleLimit:1400,
                utcOffset:0,
              
                testcount:18,
                changeStartDate:true,
                chooseDateForTakeup:{
                    startDate: '',
                    startTime: '',
                    startTimestamp:'',
                    endTimestamp:'',
                    endDate: '',
                    endTime: ''
                },
                loading:true,
                timezoneChangeCtrl:true,
                activePicker:'',
//                editTime:{
//                    startDate:"",
//                    startTimestamp:"",
//                    startTime:"",
//                    endDate:"",
//                    endTime:"",
//                    endTimestamp:"",
//                },
                isEditChange:false,
                startDate:"",
                
            }
        },
        
        computed: {
        	language () {
        	    return this.$store.state.reservation.language;
            },
            bussinessMode () {
                return this.$store.state.reservation.bussinessMode;
            },
            showRsourceBtn () {
                return this.bussinessMode.isTrial === true
                    ?false
                    :this.bussinessMode.hasTerminalVmr || this.bussinessMode.hasCloudVmr || this.bussinessMode.hascloudPortOrder;
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
            isEditMode () {
            	return (this.$route.query.type === 'once' || this.$route.query.type === "plan")
            },
            editTimezone (){
        		return this.$store.state.reservation.timezone;
            },
            cycleModal () {
                return this.$store.state.reservation.cycleModal;
            },
            datePickerOptions() {
            
                return {
                    disabledDate: (time) => {
                        
                        let now = new Date().valueOf();
                        let nowZoneDate = timezone.getTimezoneDate(now,this.utcOffset);
                        let nowZoneStamp =  this.initStamp(nowZoneDate,"00:00");
                        
                        let pickerDate = this.getDate(time);
                        let pickerStamp = this.initStamp(pickerDate,"00:00");
                        
                        return nowZoneStamp>pickerStamp
                    },
                }
            },
            timezoneSelectWidth (){
                return this.summerTime.show?19:21;
            },
        	tableSize () {
        	    return this.mode==="popups"?24:21;
            },
        	tableOffset () {
        		return this.mode==="popups"?0:2
            },
            btnName () {
                return this.openMeeting ? this.$t('reservation.pullUp') : this.$t('reservation.pullDown')
            },
            timeBtnName () {
                return this.openTimeArea ? this.$t('reservation.closeTimezone') : this.$t('reservation.openTimezone')
            },
            tipMsg () {
                return this.mode==='popups' ? "" : this.$t('reservation.dragTip')
            },
            timeListTableWidth () {
                return 1584 * this.dayNum; //1968
            },
            mouseStyle () {
        		return this.mode==="popups"?"normal":"cell"
            },
            idList () {
        		return  {
                    timeTitle:"time-title"+this.getRandomString(),
                    timeTable:"timeTable"+this.getRandomString(),
                    projectList:"projectList"+this.getRandomString(),
                    meetingTable:"meeting-table"+this.getRandomString()
                }
            },
        },
        watch: {
        	
            startDate (newVal,oldVal) {   // 检测到起始日期变更，重新渲染时间轴。
                
                if(typeof newVal === "object" && newVal!==null){  //elment-UI 会返回一个时间对象，此处要处理为 字符串。
                    timeChooseTip = false;
                    this.activePicker = null;
               // 	this.startDate = this.getDate(newVal);
                	this.chooseDate.startDate = this.getDate(newVal);
                	this.chooseDate.endDate = this.getDate(newVal);
                	this.chooseDate.endTimestamp = '';  //清空结束时间，不会触发autoRender方法，autoRender方法内有排除空的情况
                	this.chooseDate.endTime = '';
                	
                }
                
                let timezoneDate = this.getDate(this.startDate);
                
                this.loading = true;
                if(this.mode==="popups"){

                    this.getVmrProject().then(res=>{
                        this.setProject(res.data.resourceSchedules).then(()=>{
                            this.initTimeLine(this.startDate,2)
                                .autoScrollX(16)
                        })
                    });
                }else {
                    this.initTimeLine(timezoneDate,2,()=>{
                        this.autoScrollX(16);
                        let areaId = localStorage.reservation;
                        let area = typeof areaId!=="undefined" && areaId!==null && areaId !==""
                            &&this.areaList.map(item=>item.id).indexOf(localStorage.reservation)>-1
                            ?areaId:"";
                        this.getProject(area).then(res=>{
                            const stamp1 = new Date().valueOf();
                            this.setProject(res.data.resourceSchedules)
                                .then(res=>{
                                    res.forEach((item) => {
                                        this.selectedProject.forEach((id) => {
                                            if (item.id === id) {
                                                item.checked = true;
                                            }
                                        });
                                    });
                    
                                    this.$nextTick(()=>{
                                        const stamp2 = new Date().valueOf();
                                        console.log(stamp2-stamp1);
                                        this.loading = false;
                                    })
                    
                                })
                        });
                    })
                }
                
                
//                if(typeof this.chooseDate.startDate !=="undefined" && this.chooseDate.startDate !==''){
//
//                    this.initTimeLine(timezoneDate,3, () => {
//
//                        let startStamp = this.getStamp(this.chooseDate.startDate,'startTime');
//                        let endStamp = this.getStamp(this.chooseDate.endDate,'endTime');
//
//                        this.setHighLightArea(startStamp,endStamp);
//
//                    });
//                }else {
//                    this.initTimeLine(timezoneDate);
//                }
        
        
            }
        },
        methods: {
            setActivePicker (type) {
            	this.activePicker = type;
            },
            cancelCycle () {
                this.$emit("cancel-cycle")
            },
            changeSelectProject (data) {
                this.projectList.forEach((item,index) => {
                	if(data.indexOf(item.id) > -1){
                		if(item.checked===false){
                			item.checked = true;
                            if( this.isTakeUp(index) === true) {
                                this.$message(this.$t('reservation.message.takeUp'));
                                // 取消勾选
                                this.projectList[index].checked = false;
                                this.cancelCheck(index,false);
                                return console.log("会议室冲突，取消勾选");
                            }
                        }
                    }else {
                        item.checked = false;
                        this.cancelCheck(index,false);
                    }
                });
            },
            matchQuery (e) {
            	console.log(e) ;
            	return;
            	let query = e;
                if (query === '' || query === null || typeof query === "undefined") { //如果未检测到输入，展开列表后返回
                    this.projectList.forEach((item) => {
                        item.hide = false;
                    });
                    return;
                }
                this.projectList.forEach((item) => {   //如果检测到输入，则展开匹配项
                    item.hide = false;
                    if (item.projectName.indexOf(query) === -1) {
                        item.hide = true;
                    }
                });
            },
            getRandomString () {
                return String(Math.random()).replace(/\./,"-")
            },
            defineChooseDate (date) {
                this.activePicker = null;
                this.chooseDate = {
                    startDate: timezone.getTimezoneDateToInteger(date,this.utcOffset),
                    startTime: timezone.getTimezoneTimeToInteger(date,this.utcOffset),
                    startTimestamp:"",/*timezone.getIntergeTimeStamp(date,this.utcOffset)*/
                    endTimestamp:'',
                    endDate: timezone.getTimezoneDateToInteger(date,this.utcOffset),
                    endTime: '',
                };

                return this;
            },
            getTimeZoneDate (date) {
            	return timezone.getTimezoneDate(date,this.utcOffset);
            },
            getTimeZoneTime (date) {
            	return timezone.getTimezoneTime(date,this.utcOffset);
            },
            getDate (date) {
        
                if (typeof date === "undefined" || date === '' || date === null) date = new Date();
        
                let year = new Date(date).getFullYear();
                let month = new Date(date).getMonth() + 1;
                let day = new Date(date).getDate();
        
                month = month<10?"0"+month:month;
                day = day<10?"0"+day:day;
        
                return year + "/" + month + "/" + day;
            },
            showVideoResource () {
                if(this.mode!=="video") return;
                this.$emit("show-resource")
            },
            triggerMeetingTable () {
                this.openMeeting = !this.openMeeting;
                if(this.openMeeting===true){
                	this.$nextTick(()=>{
                        this.resize()
                    });
                }
            },
            openMeetingTable () {
                this.openMeeting = true;
                this.$nextTick(()=>{
                    this.resize()
                });
            },
            closeMeetingTable () {
                this.openMeeting = false;
            },
            triggerTimeArea () {
                this.openTimeArea = !this.openTimeArea;
            },
        	setUseTime (time,project) {
        	
        		return {
        			time,
                    project,
                }
            },
            setProjectList (newVal,oldVal) {
                // 翻页的时候保存已选择的会议室数据
                this.loading = true;
                localStorage.reservation = newVal;
                this.selectedProjectObj[oldVal] =
                    F.unique(
                        this.projectList.filter((item) => {
                            return item.checked === true;
                        })
                    );
                
                this.selectedProjectObjAll = Object.keys( this.selectedProjectObj)
                    .reduce((acc,cur)=>{
                        return acc.concat(this.selectedProjectObj[cur])
                    },[]);
    
                this.getProject(newVal).then(res=>{
                    this.setProject(res.data.resourceSchedules)
                        .then(res=>{
                            res.forEach((item) => {
                                this.selectedProject.forEach((id) => {
                                    if (item.id === id) {
                                        item.checked = true;
                                    }
                                });
                            });
    
                            this.$nextTick(()=>{
                                this.loading = false;
                            })
                            
                        })
                });
            },
            initStamp (date,timePoint){
            	date = this.getDate(date);
                return new Date (date.replace(/\//g,"-") +"T"+timePoint+timezone.getTimezoneNum(this.utcOffset)).valueOf()
            },
            isUnEmptyChooseDate () {
            	
                return Object.keys(this.chooseDate).filter((item)=>{
                    return item!=="startTimestamp"&&item!=="endTimestamp"
                }).every((item)=>{
                    return this.chooseDate[item] !== '' && typeof this.chooseDate[item] !== "undefined";
                });
                
            },
            correctTimeStamp (timeType) { //此方法作废
            	
                let Handle = {
                    "startTime":()=>{
                    	this.chooseDate.startTimestamp = this.initStamp(this.chooseDate.startDate,this.chooseDate.startTime);
                    },
                    "startDate":()=>{
                    	this.chooseDate.startDate = this.getDate(this.chooseDate.startDate);
                        if(!this.isUnEmptyChooseDate()) return console.log("有空的"); //检查是否有空值
                    	this.chooseDate.startTimestamp = this.initStamp(this.chooseDate.startDate,this.chooseDate.startTime);
                    },
                    "endTime":()=>{
                    	this.chooseDate.endTimestamp = this.initStamp(this.chooseDate.endDate,this.chooseDate.endTime);
                    },
                    "endDate":()=>{
                    	this.chooseDate.endDate = this.getDate(this.chooseDate.endDate);
                        if(!this.isUnEmptyChooseDate()) return console.log("有空的"); //检查是否有空值
                        this.chooseDate.endTimestamp = this.initStamp(this.chooseDate.endDate,this.chooseDate.endTime);
                    }
                };
                
                Handle[timeType]();
            },
            isSameRange () {
//            	let startIndex = this.getHighLightIndex(-1);
//            	let endIndex = this.getHighLightIndex(1)+1;
//            	console.log(startIndex,endIndex)
//            	return typeof startIndex!=="undefined" && typeof endIndex !=="undefined" &&
//                    this.chooseDate.endTimestamp === this.timeList[endIndex].timeStamp &&
//                    this.chooseDate.startTimestamp === this.timeList[startIndex].timeStamp;
            
            },
            isMistakeTimeRange (startStamp,endStamp) {
            	
                //return endStamp - startStamp <= 0 || endStamp - startStamp > 1000 * 60 * 60 * 24 * 2
                return endStamp - startStamp <= 0 //先不验证两天
              
            },
            setHighLightArea (startStamp,endStamp) {
            	
                let startIndex, endIndex;
    
                this.timeList.forEach((item, index) => {
        
                    if (item.timeStamp === startStamp) {
                        startIndex = index;
                    }
                    if (item.timeStamp === endStamp) {
                        endIndex = index;
                    }
                });
    
                if(typeof endIndex === "undefined"){
                    let lastTimestamp = this.timeList[this.timeList.length-1].timeStamp;
                    if((lastTimestamp+1000 * 60 * 30)=== endStamp){
                        endIndex = this.timeList.length;
                    }
                }
                
                if(typeof startIndex !=="undefined" && typeof endIndex !=="undefined"){
                    this.timeList.forEach((item, index) => {
                        if (startIndex <= index && endIndex > index) {
                            item.highLight = true;
                        }
                    });
        
                    this.highLightRange(startIndex,endIndex-1,false);
        
                    this.autoScrollX(startIndex);
                }
            },
            highLightRange (leftIndex,rightIndex,i) {
                if(typeof leftIndex !=="undefined"&& typeof rightIndex!=="undefined"){ //选取的时间大于半个小时
                    if ((rightIndex - leftIndex) >= 0) {
                        this.timeList.forEach((item, index) => {
                    
                            if (index === rightIndex) {
                                item.rangeRight = true;
                            }
                            if (index === leftIndex) {
                                item.rangeLeft = true;
                        
                            }
                        })
                    }
                }else if(i){ //选取的时间只有半个小时的时候
                    this.timeList.forEach((item, index) => {
                
                        if (index === i) {
                            item.rangeLeft = true;
                            item.rangeRight = true;
                            item.highLight = true;
                         //   this.getChooseTime();
                        }
                
                    })
                }
            },
            linkageDate (e,type) {
            
//                if(this.activePicker===null) return;
//
//                console.log("通过检查，现在是手动触发");
//                let handle = {
//                	startDate:()=>{
//                        this.startDate = e.replace(/'-'/g,'/');
//                		this.chooseDate.startDate = e.replace(/'-'/g,'/');
//                		this.chooseDate.startTime = "08:00";
//                		this.chooseDate.endDate = e.replace(/'-'/g,'/');
//                		this.chooseDate.endTime = '';
//                		this.chooseDate.endTimestamp = '';
//
//                    },
//                    endDate:()=>{
//
//                    }
//                };
//                handle[type]();
//                console.log(e,type);
            },
            correctPickerRange (type) {
                let {startDate, endDate, startTime, endTime,} = this.chooseDate;
               
                startDate = this.getDate(startDate);
                endDate = this.getDate(endDate);
                
                let startStamp = timezone.getTimestamp(startDate,startTime);
                let endStamp = timezone.getTimestamp(endDate,endTime);
                
                this.chooseDate.startTimestamp = startStamp;
                this.chooseDate.endTimestamp = endStamp;
                
                const correctTimestamp = () => {
                    this.chooseDate.startTimestamp = this.initStamp(this.chooseDate.startDate,this.chooseDate.startTime,this.utcOffset);
                    this.chooseDate.endTimestamp = this.initStamp(this.chooseDate.endDate,this.chooseDate.endTime,this.utcOffset);
                };
                
               if(endStamp-startStamp>0) return correctTimestamp();
    
                let correctMap = {
                    startDate: () => {
                        if(this.activePicker!=="startDate") return;
                        if(startTime==="23:30"){
                            this.chooseDate.endDate = timezone.format("yyyy/mm/dd")(new Date(startDate).valueOf() + 24*60*60*1000);
                        }else {
                            this.chooseDate.endDate = startDate;
                        }
                        this.chooseDate.endTime = timezone.getTime(timezone.getTimestamp(startDate,startTime)+30*60*1000);
                        this.chooseDate.startDate = this.getDate(this.chooseDate.startDate);
                        this.activePicker = null;
                        correctTimestamp();
                    },
                    startTime: () =>{
                        if(this.activePicker!=="startTime") return;
            
                        if((new Date(endDate).valueOf()-new Date(startDate).valueOf()) <= 0){
                            if(startTime==="23:30"){
                                this.chooseDate.endDate = timezone.format("yyyy/mm/dd")(new Date(startDate).valueOf() + 24*60*60*1000);
                            }else {
                                this.chooseDate.endDate = startDate;
                            }
                
                            this.chooseDate.endTime = timezone.getTime(timezone.getTimestamp(startDate,startTime)+30*60*1000)
                        }else {
                            this.chooseDate.endTime = timezone.getTime(timezone.getTimestamp(startDate,startTime)+30*60*1000)
                        }
                        this.activePicker = null;
                        correctTimestamp();
                    },
                    endDate: () =>{
                        if(this.activePicker!=="endDate") return;
                        if(endTime==="00:00"){
                            this.chooseDate.startDate = timezone.format("yyyy/mm/dd")(new Date(startDate).valueOf() - 24*60*60*1000);
                        }else {
                            this.chooseDate.startDate = endDate;
                        }
                        this.chooseDate.endTime = timezone.getTime(timezone.getTimestamp(startDate,startTime)+30*60*1000)
                        this.chooseDate.startDate = this.getDate(this.chooseDate.startDate);
                        this.activePicker = null;
                        correctTimestamp();
                    },
                    endTime: () =>{
                        if(this.activePicker!=="endTime") return;
                        
                        if((new Date(endDate).valueOf()-new Date(startDate).valueOf()) < 0){
                            this.chooseDate.endDate = startDate;
                            this.chooseDate.startTime = timezone.getTime(timezone.getTimestamp(startDate,endTime)-30*60*1000)
                        }else {
                            if(endTime === "00:00"){
                                this.chooseDate.startDate = timezone.format("yyyy/mm/dd")(new Date(startDate).valueOf() - 24*60*60*1000);
                                this.chooseDate.startTime = "23:30"
                            }else {
                                this.chooseDate.startTime = timezone.getTime(timezone.getTimestamp(startDate,endTime)-30*60*1000)
                            }
                        }
                        this.activePicker = null;
                        correctTimestamp();
                    },
                };
    
                correctMap[type]();
            },
            autoRender (e,timeType) {
             
            	if(this.activePicker===null) return console.log("null非手动选择picker");
                if(this.activePicker!==timeType) return console.log("非"+timeType+"触发");
                
            //    this.correctTimeStamp(timeType);  //纠正时间戳
               
                if(!this.isUnEmptyChooseDate()) return console.log("有空的"); //检查是否有空值
    
                this.correctPickerRange(timeType); //纠正时间范围
                
              //  this.$alert(this.chooseDate);
                //if(this.isSameRange()) return console.log("时间相同，不渲染啦！"); // 检查当前 视图已经高亮的部分 是否 和选择的时间点相同，如果相同 则取消渲染
                
                let startStamp = this.initStamp(this.chooseDate.startDate,this.chooseDate.startTime);
                let endStamp = this.initStamp(this.chooseDate.endDate,this.chooseDate.endTime);
                
                if(this.isMistakeTimeRange(startStamp,endStamp)){//检查时间范围是否正确，是否大于2天，是否结束时间早于开始时间
                    this.resetTableView();
                    return this.$message(this.$t('reservation.message.wrongRange'));
                }
//
//                if(!this.isEditChange){// 这个参数干嘛用的  我也不知道了啊
////                    this.renderTimeLine(this.chooseDate, () => {  /*这里为啥要重新渲染视图，忘了。。有可能是之前有什么需求。先注释掉，只执行回调方法*/
////                        this.setHighLightArea(startStamp,endStamp);
////                        if(this.version===2){
////                            if(this.selectedProject.length>0){
////                                this.checkAllTakeUp();
////                            }
////                        }
////                    });
//
//                    this.resetTableView();
//                    this.setHighLightArea(startStamp,endStamp);
//                    if(this.version===2){
//                        if(this.selectedProject.length>0){
//                            this.checkAllTakeUp();
//                        }
//                    }
//
//                }else {
//                    this.isEditChange = false;
//                }
                this.resetTableView();
                this.setHighLightArea(startStamp,endStamp);
                if(this.version===2){
                    if(this.selectedProject.length>0){
                        this.checkAllTakeUp();
                    }
                }
                
            },
            setCycle () {
                //检查日期输入
//                let checkMap = {
//                    endDate: "结束日期不能为空！",
//                    endTime: "结束时间不能为空！",
//                    startDate: "开始日期不能为空！",
//                    startTime: "开始时间不能为空！"
//                };
//                let keys = Object.keys(this.chooseDate).filter((item)=>{
//                	return item!=="startTimestamp"&&item!=="endTimestamp"
//                });
//
//                for (let i = 0; i < keys.length; i++) {
//                    if (this.chooseDate[keys[i]] === '' || typeof this.chooseDate[keys[i]] === "undefined") {
//                        this.$message(checkMap[keys[i]]);
//                        return;
//                    }
//                }
//
//                if(typeof this.chooseDate.endDate === "object"){
//
//                	this.chooseDate.startDate = this.getDate(this.chooseDate.startDate);
//                	this.chooseDate.endDate = this.getDate(this.chooseDate.endDate);
//                	this.chooseDate.startTimestamp = this.getStamp(this.chooseDate.startDate);
//                	this.chooseDate.endTimestamp = this.getStamp(this.chooseDate.endDate);
//                }
//
//                let startStamp =new Date (this.chooseDate.startDate.replace(/\//g,"-") +"T"+this.chooseDate.startTime+this.toZoneNum()).valueOf();
//
//                let endStamp = new Date(this.chooseDate.endDate.replace(/\//g,"-")+"T"+this.chooseDate.endTime+this.toZoneNum()).valueOf();
//
//                if (endStamp - startStamp <= 0) {
//                    this.$message("结束时间应在开始时间之后");
//                    this.resetChooseTime();
//                    return
//                }
//
//                if (endStamp - startStamp > 1000 * 60 * 60 * 24 * 3) {
//                    this.$message("时间范围应在三天内！");
//                    this.resetChooseTime();
//                    return
//                }
                
                // 通过检查, 执行渲染
                this.$emit("set-cycle",this.chooseDate);
              
//                this.renderTimeLine(this.chooseDate, () => {
//
//                    let startIndex, endIndex;
//
//                    this.timeList.forEach((item, index) => {
//
//                        if (item.timeStamp === startStamp) {
//                            startIndex = index;
//                        }
//                        if (item.timeStamp === endStamp) {
//                            endIndex = index;
//                        }
//                    });
//
//                    this.timeList.forEach((item, index) => {
//                        if (startIndex <= index && endIndex > index) {
//                            item.highLight = true;
//                        }
//                    });
//
//                    this.autoScrollX(startIndex);
//                });
    
            
            },
            renderTimeLine (dateRange, callback){ // 渲染方法 是对 初始化方法进行了一次封装
                this.initTimeLine(
                    dateRange.startDate,
                    this.getDateDiff(dateRange.startDate, dateRange.endDate),
                    callback
                )
            },
            getDateDiff (startDate, endDate) {   //根据两日期计算出相差天数
                let startTime = new Date(startDate).valueOf();
                let endTime = new Date(endDate).valueOf();
                return Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24) + 1
            },
            initTimeLine (d, dayNum, callback) {  //d:日期对象; dayNum:天数; callback:回调函数
                
                if (typeof d === "undefined" || d === '' || d === null) d = new Date();
                
                this.dayNum = dayNum > 2 && typeof dayNum !== "undefined" ? dayNum : 2;  //参数验证 天数最小为两天
                let dateList = [];
                for (let i = 0; i < this.dayNum; i++) {
                    dateList.push(this.getDate(new Date(new Date(d).valueOf() + 1000 * 60 * 60 * 24 * i)));  //计算出 日期 Array
                }
                this.lastDaysPoint = this.getDate(new Date(new Date(d).valueOf() + 1000 * 60 * 60 * 24 * this.dayNum));  //计算临界点日期
                
                this.timeList = dateList.map((date) => {     // map-reduce 计算出 日期 Array  此 Array 用于渲染;
                    return this.timeMap.map((item) => {
                 //   	console.log(this.initStamp(date,item.timePoint), date.replace(/\//g,"-") +"T"+item.timePoint+timezone.getTimezoneNum(this.utcOffset));
                        return {
                            timePoint: item.timePoint,
                            date: date,
                            timeStamp: this.initStamp(date,item.timePoint),
                            highLight: false,
                            highLightTimeLine: false,
                            rangeLeft: false,
                            rangeRight: false,
                        };
                    });
                }).reduce((pre, cur) => {
                    return pre.concat(cur)
                });
                
                if(this.mode==="popups"){
                    this.timeList = Object.freeze(this.timeList);
                }
                
                if (callback) callback();
                
                return this;
            },
            getHighLightIndex (dir) {
            	
                let pos;
                
                this.timeList.forEach((item, index) => {
                    if (dir > 0) {
                        if (item.highLight === true) {
                            pos = index;
                        }
                    } else if (dir < 0) {
                        if (item.highLight === true) {
                            if (index < pos || typeof pos === "undefined") {
                                pos = index;
                            }
                        }
                    }
                });
                return pos;
            },
            clearTimer () {
                clearInterval(this.scrollTimer);
                this.count = 0;
            },
            chooseScroll (e, dir) {
                // 此方法为自动滚动以及自动选中时间。 dir 正负数表示方向，值表示 步进 单位为px 控制滚动条;
                // num 为 选中时间的步进 由 dir控制;
                this.clearTimer();
                let num = dir > 0 ? 1 : -1;
                if (this.chooseable === 1) {
                    this.scrollTimer = setInterval(() => {
                        //开启定时器 滚动条开始滚动
                        
                        F.select("#"+this.idList.timeTitle).scrollLeft += dir;
                        F.select("#"+this.idList.timeTable).scrollLeft += dir;
                        
                        this.count += 1;
                        if (this.count === 14) {
                            
                            //this.getHighLightIndex(dir) 获得高亮边界的 索引  检测类型 "undefined" 来判断是否到数组边界;
                            
                            if (typeof (this.timeList[this.getHighLightIndex(dir) + num]) !== "undefined") {
                                this.timeList[this.getHighLightIndex(dir) + num].highLight = true;
                                this.count = 0
                            }
                        }
                    }, 10);
                }
                
            },
            setId (id) {
                this.scrollId = id;
            },
            scrollControl (e, id) {
                
                if (this.scrollId === id) return;

                if (this.scrollTop !== e.currentTarget.scrollTop) {

                    this.scrollTop = e.currentTarget.scrollTop;
                    F.select("#"+id).scrollTop = e.currentTarget.scrollTop;

                } else if (this.scrollLeft !== e.currentTarget.scrollLeft) {

                    this.scrollLeft = e.currentTarget.scrollLeft;
                    F.select("#"+this.idList.timeTitle).scrollLeft = e.currentTarget.scrollLeft;

                }
                
//                if(e.currentTarget.scrollTop>(33*12-200)){
//                    let data = [  {name: '51号楼会议洽谈室'+this.testcount++, id: 14310, meet: []},
//                        {name: '51号楼会议洽谈室'+this.testcount++, id: 17311,meet:[]},
//                        {name: '51号楼会议洽谈室'+this.testcount++, id: 17312,meet:[]},
//                        {name: '51号楼会议洽谈室'+this.testcount++, id: 17313,meet:[]},
//                        {name: '51号楼会议洽谈室'+this.testcount++, id: 17317,meet: []},
//                        {name: '51号楼会议洽谈室'+this.testcount++, id: 17315,meet:[]}];
//
//                    data = data.map((item)=>{
//                        item.meet.forEach((timeItem)=>{
//                            timeItem.halfHourLength = (timeItem.endTimestamp-timeItem.startTimestamp)/1800000
//                        });
//                        return item;
//                    }).map((item) => {
//                        return {
//                            meet:item.meet,
//                            projectName: "厦门" + "-" + item.name,
//                            highLight: false,
//                            checked: false,
//                            hide: false,
//                            id: "厦门".charCodeAt() + String(item.id)
//                        }
//                    });
//                    for (let i = 0; i<6; i++){
//                        this.projectList.shift();
//                    }
//
//                	this.projectList.push(...data);
//
//                  let backTop = (e.currentTarget.scrollHeight-e.currentTarget.clientHeight)/3;
//                    e.currentTarget.scrollTop =backTop ;
//                    document.getElementById(id).scrollTop = backTop;
//                }
            
            },
            scaleStart (e) {
                e.preventDefault();
                this.scaleXAble = true;
                this.screenX = e.screenX;
            },
            scaleYStart (e) {
                e.preventDefault();
                this.scaleYAble = true;
                this.screenY = e.screenY;
            },
            move (e) {
            	//e.preventDefault();
    
                let mouseMoveX = e.screenX - this.screenX;
                let mouseMoveY = e.screenY - this.screenY;
    
                if (this.scaleXAble) {
                    if (this.widthSave.timeTitleWidth - mouseMoveX <= this.scaleLimit && this.widthSave.timeTitleWidth - mouseMoveX >= 100) {
                        this.timeTitleWidth = this.widthSave.timeTitleWidth - mouseMoveX;
                        this.timeListWidth = this.widthSave.timeListWidth - mouseMoveX;
                        this.projectWidth = this.widthSave.projectWidth + mouseMoveX;
                    }
                }
    
                if (this.scaleYAble) {
                    this.timeListHeight = this.heightSave.timeListHeight + mouseMoveY;
                    this.projectHeight = this.heightSave.projectHeight + mouseMoveY;
                }
    
            },
            end () {
            	
                if (this.scaleXAble === true || this.scaleYAble === true) {
        
                    this.scaleXAble = false;
                    this.scaleYAble = false;
        
                    this.widthSave.timeTitleWidth = this.timeTitleWidth;
                    this.widthSave.timeListWidth = this.timeListWidth;
                    this.widthSave.projectWidth = this.projectWidth;
        
                    this.heightSave.timeListHeight = this.timeListHeight;
                    this.heightSave.projectHeight = this.projectHeight;
        
                }
    
                if (this.chooseable === -1) return;
                //结束高亮
                this.highLightTimeEnd();
            },
            scaleMove () {
            	F.registerEvent(document,'mousemove',this.move);
                return this;
            },
            scaleEnd: function () {
                F.registerEvent(document,'mouseup',this.end);
                return this;
            },
            highLightLine (i, j) {
            
                this.projectList.forEach((item, index) => {

                    item.highLight = i === index;

                });
            },
            checkTakeUp (project) {
             
                if( this.chooseDate.startTime ==="" ||
                    typeof this.chooseDate.startTime ==="undefined"||
                    this.chooseDate.endTime === ""||
                    typeof this.chooseDate.endTime === "undefined"
                ){
                	
                    return false; //未选择时间直接返回
                }
    
                //返回检查结果
                return project.meet.some((item) => {   //检查边界值
                    return ((this.chooseDate.startTimestamp - item.startTimestamp) >= 0 &&
                        (this.chooseDate.startTimestamp - item.endTimestamp < 0) ||
                        (this.chooseDate.endTimestamp - item.startTimestamp > 0) &&
                        (this.chooseDate.endTimestamp - item.endTimestamp <= 0) ||
                        (item.startTimestamp >= this.chooseDate.startTimestamp) &&
                        (item.endTimestamp <= this.chooseDate.endTimestamp))
                        && (this.editType === 'plan' ? item.conferencePlanId !== this.planId : item.id !== this.recordId);
                });
            },
            isTakeUp (i) {
             
            	return this.checkTakeUp(
            		this.projectList[i]
                )
            },
            checkAllTakeUp () {
            
                let takeUpList = [];
                
                if(typeof this.chooseDate.startDate==="undefined" || typeof this.chooseDate.endDate === "undefined" ||this.chooseDate.startDate==='') return;
    
                takeUpList = this.projectList
                    .filter(item=>item.checked === true) //去除当前区域已选择的
                    .concat(this.selectedProjectObjAll) //合并其他区域已选择的
                    .filter((item)=>{   //获取勾选项目中 时间已经被占用的
                        return this.checkTakeUp(item);
                    });
                if(takeUpList.length>0){   //处理占用
        
                    let takeUpProject = takeUpList.map((item)=>{
                        return item.projectName;
                    });
                    
//                    this.$alert( this.creatRenderList(takeUpProject), '以下会议室在该时间段内被占用', {
//                        confirmButtonText: '确定',
//                        callback: action => {
//                            this.resetChooseTime();
//                            timeChooseTip = false;
//                            this.defineChooseDate(new Date(this.startDate));
//                        }
//                    });
//                    this.$message({
//                        message: this.creatRenderList(takeUpProject),
//                        customClass: "u-takeup-alert",
//                    });
//                    this.resetChooseTime();
//                    timeChooseTip = false;
//                    this.defineChooseDate(new Date(this.startDate));
                  
                    this.$message(this.$t('reservation.message.takeUpAll'));
                    this.resetChooseTime();
                    timeChooseTip = false;
                    this.defineChooseDate(new Date());
                
                }else {
                	
                	this.checkConflict().then(res=>{
                		if(res.ret===-1){
                            this.$message(res.error.msg===null
                                ? this.$t(String(res.error.fieldErrors[0].msg))
                                : this.$t(String(res.error.msg)));
                            this.resetChooseTime();
                            timeChooseTip = false;
                            this.defineChooseDate(new Date());
                        }else {
                			this.$emit("close-cycle");
                        }
                    })
                }
               
            },
            creatRenderList (arr) {
                const h = this.$createElement;
                
                let renderArr =  arr.map((item)=>{
                    return h('div', {style:'height:20px,line-height:20px'}, item)}
                );
                renderArr.unshift(h('div',{style:"padding-bottom:6px;padding-right:6px;color:teal"},'以下会议室在已选择的时间段内已被占用'));
               
                return  h('div', {class:"u-takup-alert-content"},renderArr
                
                )
            },
            checkProject (projectListIndex,checked) { //备忘：自动滚动区域高度没有绑定,（后期可能会改为滚动分页，自动滚动区域高度不需要绑定了）。
                
                if(this.version===1){
                	
                	// 版本一
                    this.projectList.forEach((item, i) => {
                        if (projectListIndex === i) {
                            if(checked===true){
                
                                this.selectedProject.push(item.id);
                
                                this.selectedProject = F.unique(this.selectedProject).sort();
                
                            }else {
                                this.selectedProject.forEach((id, index) => {
                                    if (id === item.id) {
                                        this.selectedProject.splice(index, 1);
                                        this.selectedProject = F.unique(this.selectedProject).sort();
                                    }
                                })
                            }
                        }
                    });
                }else if(this.version === 2){
                    //版本二
                    if(checked===true){
                    	
                        if( this.isTakeUp(projectListIndex) === true && this.cycleShow===false) {
                            this.$message(this.$t('reservation.message.takeUp'));
                            // 取消勾选
                            this.projectList.forEach((item,i)=>{
                                if(projectListIndex === i){
                                    item.checked = false;
                                }
                            });
                            return console.log("会议室冲突，取消勾选");
                        }
                        //改
                        
                        let chooseDate = this.getChooseDate();
                        
                        if(!( chooseDate.startTime ==="" ||
                            typeof chooseDate.startTime ==="undefined"||
                            chooseDate.endTime === ""||
                            typeof chooseDate.endTime === "undefined"
                        )){
    
                            this.checkConflict(
                                this.projectList.filter((item,index)=>{
                                    return index === projectListIndex
                                }).map(item=>item.id)
                            ).then(res=>{
                                if(res.ret===-1){
                                    this.$message(this.$t(String(res.error.msg)));
                                    this.projectList.forEach((item,i)=>{
                                        if(projectListIndex === i){
                                            item.checked = false;
                                        }
                                    });
                                    return console.log("会议室冲突，取消勾选");
                                }else{
            
                                    this.confirmCheck(projectListIndex)
                                }
        
                            });
                        }else {
                            this.projectList.forEach((item, i) => {
                                if (projectListIndex === i) {
    
                                    this.selectedProject.push(item.id);
    
                                    this.selectedProject = F.unique(this.selectedProject).sort();
                                }
                            });
                        }
                        
                       
                       
                    }else {
                        this.cancelCheck(projectListIndex)
                    }
                }
            },
            getCheckedLength () {
            	return this.selectedProject.length;
             //   return this.projectList.filter(item=>item.checked===true).length+this.selectedProjectObjAll.length;
            },
            confirmCheck (projectListIndex) {
                this.projectList.forEach((item, i) => {
                	if(projectListIndex===i){
                        this.selectedProject.push(item.id);
                        this.selectedProject = F.unique(this.selectedProject).sort();
                    }
                })
            },
            cancelCheck (projectListIndex) {
                this.projectList.forEach((item, i) => {
                    if (projectListIndex === i) {
                        this.selectedProject.forEach((id, index) => {
                            if (id === item.id) {
                                this.selectedProject.splice(index, 1);
                                this.selectedProject = F.unique(this.selectedProject).sort();
                            }
                        })
                    }
                })
            },
            compareLine (left,right,mouse) {
             
            	let l = parseInt(left);
            	let r = parseInt(right);
            	let m = parseInt(mouse);
            	
            	if( l===r && l===m && r===m){ // 只选择了半个小时
                    return m;
                }else if(l===m){ //鼠标位于起始点
            		return r;
                }else if (r===m){ //鼠标位于结束点
                	return l
                }else { //不在选中区域点选
                	return false
                }
                
            },
            extendSide (line) {
                this.startChoose = line;
                this.timeList.forEach((item)=>{
                    item.rangeLeft = false;
                    item.rangeRight = false;
                });
            },
            extendAny (i) {
                this.resetTableView();
                this.startChoose = i;
                this.timeList.forEach((item,index)=>{
                    if(index===i){
                        item.highLight = true;
                    }
                });
            },
            highLightTimeStart (data) {
           
                let {i:i,j:j} = data||{};
                this.timeList.forEach((item) => {
                    item.highLightTimeLine = false
                });
                
// 边缘拓展功能取消
//                let leftIndex = this.getHighLightIndex(-1);
//                let rightIndex = this.getHighLightIndex(1);
//                let line = this.compareLine(leftIndex,rightIndex,i);
//                line ? this.extendSide(line) : this.extendAny(i);
                this.extendAny(i);
                if(this.version===1){
                 
                	this.selectedProject = [];
                
                }else if(this.version === 2){
                	if(this.getCheckedLength()<=1){
                        this.selectedProject = [];
                    }
                }
                if(i){
                   this.autoCheckProject(i)
                }
                
                this.chooseable = 1;

            },
            highLightTimeEnd (data) {
            	
                let {i:i,j:j} = data||{};
                if (this.chooseable === 1) {
                    //手动选中高亮不触发视图重新渲染
                    
                    this.activePicker = null;
                    //获取选中的时间
                    this.getChooseTime();
                    //获取 起始点 和 终点的索引
                    let leftIndex = this.getHighLightIndex(-1);
                    let rightIndex = this.getHighLightIndex(1);
                    //高亮起始和结束两条边
                    this.highLightRange(leftIndex,rightIndex,i);
                    //检查占用情况
                    if(this.version===2){
                        this.checkAllTakeUp();
                    }
                 
                }
                //清除定时器
                this.clearTimer();
                this.chooseable = 0;
                this.timeChecked = this.timeList.filter((item) => {
                    return item.highLight === true;
                }).length > 0;
                
            },
            autoCheckProject (i) {
                this.projectList.forEach((item) => {
                    if (item.highLight === true) {
                        item.checked = true;
                        this.selectedProject.push(item.id);
                        this.selectedProject = F.unique(this.selectedProject).sort();
                    }
                });
            },
            chooseTime (data) {
            	
            	let {i:i,j:j} = data||{};
            	
            	this.highLightLine(j);
                if (this.chooseable === 1) {
                    
                    this.timeList.forEach((item, index) => {
                        
                        if (this.startChoose > i) {
                            
                            item.highLight = index >= i && index <= this.startChoose;
                            
                        } else if (this.startChoose < i) {
                            
                            item.highLight = index <= i && index >= this.startChoose;
                            
                        } else if (this.startChoose === i) {
                            
                            item.highLight = i === index;
                            
                        }
                    })
                    
                } else if (this.timeChecked===false) {  //鼠标移入高亮时间轴
                     this.timeList.forEach((item, index) => {
                        item.highLightTimeLine = index === i
                     });
                }
            },
            resetTable () {
                this.initTimeLine(this.startDate);
                this.projectList.forEach((item) => {
                    item.checked = false;
                });
                this.selectedProject = [];
                this.timeChecked = false;
                this.chooseable = 0;
                this.query = null;
                this.resetChooseTime();
                return this;
            },
            setChooseTimeRange () {
                let {startTimestamp,endTimestamp, endTime,} = this.chooseDate;
                console.log(this.chooseDate);
                debugger
                if(endTime===''||endTime===null||typeof endTime==="undefined"){
                	this.defineChooseDate(new Date());
                }else {
                    this.chooseDate = {
                        startDate: timezone.getTimezoneDate(startTimestamp,this.utcOffset),
                        startTime: timezone.getTimezoneTime(startTimestamp,this.utcOffset),
                        startTimestamp:startTimestamp,
                        endDate:timezone.getTimezoneDate(endTimestamp,this.utcOffset),
                        endTime:timezone.getTimezoneTime(endTimestamp,this.utcOffset),
                        endTimestamp:endTimestamp,
                    };
                }
                
                this.chooseDateForTakeup = Object.assign({},this.chooseDate);
            },
            getChooseTime () {
                let index;
                let chooseTime = this.timeList.filter((item, i) => {
                    if (item.highLight === true) {
                        index = i + 1
                    }
                    return item.highLight === true;
                });
                
                if (chooseTime.length === 0) return;
                
                if (typeof this.timeList[index] === "undefined") {
                    chooseTime.push({
                        date: this.lastDaysPoint,
                        timePoint: "00:00",
                        timeStamp: this.initStamp(this.lastDaysPoint,"00:00")
                    })
                } else {
                    chooseTime.push(Object.assign({}, this.timeList[index]));
                }
                
                let startTime = chooseTime[0].timeStamp;
                let endTime = chooseTime[chooseTime.length - 1].timeStamp;
               
                this.chooseDate = {
                    startDate: timezone.getTimezoneDate(startTime,this.utcOffset),
                    startTime: timezone.getTimezoneTime(startTime,this.utcOffset),
                    startTimestamp:startTime,
                    endDate:timezone.getTimezoneDate(endTime,this.utcOffset),
                    endTime: timezone.getTimezoneTime(endTime,this.utcOffset),
                    endTimestamp:endTime
                };
              
                this.chooseDateForTakeup = Object.assign({},this.chooseDate);
               
            },
            resetHighLight () {
                this.timeList.forEach((item) => {
                    item.highLightTimeLine = false;
                });
                this.projectList.forEach((item)=>{
                	item.highLight = false;
                })
            },
            resetChooseTime () {
                this.activePicker = null;
            	this.resetPicker();
                this.resetTableView();
                this.timeChecked = false;
                this.chooseable = 0;
                this.query = null;
            },
            resetTableView () {
                this.timeList.forEach((item) => {
                    item.highLight = false;
                    item.rangeLeft = false;
                    item.rangeRight = false;
                });
            },
            resetPicker () {
                this.chooseDate = {
                    startDate: '',
                    endDate: '',
                    startTime: '',
                    endTime: '',
                    startTimestamp:'',
                    endTimestamp:'',
                };
            },
            autoScrollX (num) {
            	
            	F.select("#"+this.idList.timeTitle).scrollLeft = 33 * Number(num); //41
            	F.select("#"+this.idList.timeTable).scrollLeft = 33 * Number(num);
                
                return this;
            },
            resize () {
               
                if(F.select("#"+this.idList.meetingTable) === null) return;
               
                let  screenWidth = F.select("#"+this.idList.meetingTable).clientWidth;
                
                this.contentWidth = parseInt(screenWidth);
                this.timeTitleWidth =  this.contentWidth-350;
                this.timeListWidth = this.timeTitleWidth+34;
                this.scaleLimit = parseInt(screenWidth*0.8);
    
                this.widthSave.timeTitleWidth = this.timeTitleWidth;
                this.widthSave.timeListWidth =  this.timeListWidth;
                
                this.projectWidth = this.contentWidth - this.timeListWidth +10;
                this.widthSave.projectWidth = this.contentWidth - this.timeListWidth +10;
            },
            resizeStart () {
            	this.resize();
            	F.registerEvent(window,"resize",this.resize);
                return this;
            },
//            initUtcOffset () {
//                this.utcOffset = moment().utcOffset();
//                return this;
//            },
            getUTCoffest() {
            	
            	let utcOffset = this.timeZoneList.filter((item)=>{
                    return item.zoneId === this.timeZone
                })[0].utcOffset/60+(this.summerTime.show===true&&this.summerTime.checked===true?this.summerTime.offset:0);
            	
            	this.$store.commit("setUtcOffset",utcOffset);
                return utcOffset;
            },
            setTimezoneList (data) {
            	this.timeZoneList = data;
            	return new Promise(resolve=>resolve("success"))
            },
            getTimezoneList: async function() {
                const res = await reqTimezoneList();
                const timezone = await this.setTimezoneList(res.data.data);
                const defaultTimezone = await this.getDefaultTimezone();
                console.log(defaultTimezone)
                this.utcOffset = this.getUTCoffest();
                return new Promise(resolve=>resolve("success"))
            },
            changeTimeZone (zoneId,) {
            	if(this.timezoneChangeCtrl===false) {
                    this.timezoneChangeCtrl = true;
            		return;
                }
                localStorage.zoneId = zoneId;
                this.checksummerTime(zoneId);
            },
            changeSummertime () {
                this.utcOffset = this.getUTCoffest();
                this.setChooseTimeRange();
            },
            checksummerTime (zoneId){
                reqCheckTimezone({
                    zoneId,
                    checkedTime:timezone.format("yyyy-mm-dd 00:00:00")(this.startDate),
                }).then(res=>{
                    if(res.data.dayLightDelta!==3600000){
                        this.summerTime.offset = 0;  //设置夏令时偏移量
                        this.summerTime.show=false;
                        this.summerTime.checked = false;
                    }else {
                        this.summerTime.offset = res.data.dayLightDelta/(1000*60); //设置夏令时偏移量
                        this.summerTime.show = true;
                
                        if(res.data.defaultDSTEnable===1){
                            this.summerTime.checked = true;
                        }
                    }
                    this.utcOffset = this.getUTCoffest();
                    this.setChooseTimeRange();
                })
            },
            getVmrProject () {
            	return reqVmr({
                    queryDate: this.getDate(this.startDate).replace(/\//g,"-"),
                    zoneId:this.vmrTimezone,
                    dayCount:2
                })
            },
            getProject (area="") {
               return reqMeetingRoomList({
                    categoryId:area,
                    queryDate: this.getDate(this.startDate).replace(/\//g,"-"),
                    zoneId:this.timeZone,
                    dayCount:2
                })
            },
            getChooseDate () {
                let chooseDate;
                if(this.cycleShow===false&&this.cycleModal === false){
                    chooseDate = this.chooseDate;
                }else{
                    chooseDate =  {
                        startDate : timezone.format("yyyy/mm/dd")(this.cycleTime.startDate),
                        endDate :timezone.format("yyyy/mm/dd")(this.cycleTime.endDate),
                        startTime : this.cycleTime.startTime,
                        endTime : this.cycleTime.endTime
                    }
                }
                return chooseDate;
            },
            checkConflict (checkItem=false) {
//            	console.log(JSON.stringify({
//                    conferenceTimePattern:{
//                        conferenceTime:{
//                            startDate:timezone.format("yyyy-mm-dd")(this.chooseDate.startDate),
//                            startTime:this.chooseDate.startTime,
//                            endDate:timezone.format("yyyy-mm-dd")(this.chooseDate.endDate),
//                            endTime:this.chooseDate.endTime,
//                        },
//                        zoneId:this.timeZone,
//                        recurrencePattern:null,
//                        dstConfig:{ //会议的夏令时设置
//                            dstEnable:Number(this.summerTime.checked),
//                            dayLightDelta:this.summerTime.offset*1000*60,
//                        }
//                    },
//                    roomIds:this.selectedProject,
//                }));
                if(checkItem === false && this.selectedProject.length === 0){
                 
                	return new Promise((resolve, reject) =>{
                        console.log('未选中任何会议室，通过检测！');
                		resolve({ret:1});
                    });
                }
                
                let chooseDate = this.getChooseDate();
                
            	return reqConflictCheck({
                    conferencePlanId:this.editType==="plan"?this.planId:null,
                    conferenceRecordId:this.editType==="once"?this.recordId:null,
                    conferenceTimePattern:{
                        conferenceTime:{
                            startDate:timezone.format("yyyy-mm-dd")(chooseDate.startDate),
                            startTime:chooseDate.startTime,
                            endDate:timezone.format("yyyy-mm-dd")(chooseDate.endDate),
                            endTime:chooseDate.endTime,
                        },
                        zoneId:this.timeZone,
                        recurrencePattern: (this.cycleShow===true && (this.chooseable !== 1)) || this.cycleModal?this.cycleData:null,
                        dstConfig:{ //会议的夏令时设置
                            dstEnable:Number(this.summerTime.checked),
                            dayLightDelta:this.summerTime.offset*1000*60,
                        }
                    },
                    roomIds:checkItem===false?this.selectedProject:checkItem,
                })
            },
            setProject (data=[] ) {
            	 if(data===null) data = [];
            	 
                 data = data.map((item)=>{
                	if(item.scheduleRecords === null || typeof item.scheduleRecords === "undefined"){
                        item.scheduleRecords = [];
                    }
                    item.scheduleRecords.forEach((meeting)=>{
                        meeting.halfHourLength = (meeting.conferenceTimePattern.conferenceTime.endDateTimeStamp- meeting.conferenceTimePattern.conferenceTime.startDateTimeStamp)/1800000;
                		meeting.startTimestamp = meeting.conferenceTimePattern.conferenceTime.startDateTimeStamp;
                		meeting.endTimestamp = meeting.conferenceTimePattern.conferenceTime.endDateTimeStamp;
                        meeting.title = meeting.conferenceSubject.subject;
                        meeting.Initiated = meeting.organizer.name;
                    });
                    return item;
                }).map((item) => {
                    return {
                        meet:item.scheduleRecords,
                        projectName:item.name,
                        type:item.type||"",
                        highLight: false,
                        checked:this.selectedProject.indexOf(item.id)>-1,
                        hide: false,
                        id: item.id
                    }
                });
       
                if(this.mode==="popups"){
                	data = Object.freeze(data);
                }
                
                this.$nextTick(()=>{
                    this.loading = false;
                });
                return new Promise((resolve, reject)=>{
                	resolve(this.projectList = data);
                })
            },
            getOrgTree () {
                return reqOrgTree().then(res=>{
                    this.areaList = res.data.data;
                    this.$nextTick(()=>{
                        this.$refs.dropdownTree.initText();
                    });
        
                });
                
            },
            initLocalStroage () {
                localStorage.reservation = typeof localStorage.reservation==="undefined" || localStorage.reservation === null
                    ? ""
                    : localStorage.reservation;
                return this;
            },
            async reqDefaultTimezone () {
            	let storeZoneId = localStorage.zoneId;
            	
                const res = await reqCheckTimezone({zoneId:storeZoneId,checkedTime:timezone.format("yyyy-mm-dd 00:00:00")(this.startDate),});
                let {defaultTimeZone:zoneId,dayLightDelta,defaultDSTEnable:dstEnable} = res.data;

                return new Promise(resolve=>resolve({zoneId:(typeof storeZoneId==="undefined"?zoneId:storeZoneId),dayLightDelta,dstEnable}));
            },
            getDefaultTimezoneByEdit () {
            	let timer;
                return new Promise(resolve=>{
                    timer = setInterval(()=>{
                        if(Object.keys(this.editTimezone).length>0){
                        	resolve(this.editTimezone);
                            clearInterval(timer);
                        }
                    },10)
                });
            },
            getDefaultTimezone: async function () {
              
                const res = this.isEditMode
                    ? await this.getDefaultTimezoneByEdit () //等待父组件返回编辑时的时区
                    : await this.reqDefaultTimezone();
                console.log(res);
                this.timeZone = res.zoneId;// 设置默认时区
                this.timezoneChangeCtrl = false;  //此处设置默认，需要关闭change事件触发方法
                
                if(res.dayLightDelta===0){
                    this.summerTime.offset = 0;  //清空夏令时偏移量
                    this.summerTime.show=false;  //不显示夏令时勾选框
                    this.summerTime.checked = false; //取消勾选
                }else {  // 有夏令时偏移量
                    this.summerTime.offset = res.dayLightDelta/(1000*60); //设置夏令时偏移量
                    this.summerTime.show = true; //显示夏令时勾选框
        
                    if(res.dstEnable===1){  //如果为1 默认勾选夏令时
                        this.summerTime.checked = true;
                    }
                }
    
                return new Promise(resolve=>{
                    resolve("success")
                })
                
               
                
                //获取完成 默认时区后 获取会议室
//                const response = await this.getProject(localStorage.reservation);
//
//                this.setProject(response.data.resourceSchedules).then(()=>{
//
//                    this.initTimeLine()
//                        .autoScrollX(16)
//                });
            
            
            
            },
            setDefaultStartDate () {
            	//this.startDate = this.getDate(new Date());
            	this.startDate = timezone.getTimezoneDate(new Date(),this.utcOffset);
            	return this;
            },
            fresh () {
            	this.loading=true;
                this.initTimeLine(this.startDate,2,()=>{
                    this.autoScrollX(16);
                    this.getProject().then(res=>{
                        this.setProject(res.data.resourceSchedules)
                            .then(res=>{
                                timeChooseTip = false;
                            	this.resetTable()
                            	    .defineChooseDate(new Date())
                                    .$nextTick(()=>{
                                    this.loading = false;
                                })
                    
                            })
                    });
                })
            },
            setVmrUtcOffset() {
                this.utcOffset = this.vmrUtcOffset;
                return this
            },
            setEditDefaultStartDate () {
    
                let timer = setInterval(()=>{
                    if(this.chooseDate.startDate!==""){
                        clearTimeout(timer);
                        this.startDate = this.chooseDate.startDate;
                    }
                });
                
              
                return this;
            },
            initOpenTimezone () {
                if(this.utcOffset!==timezone.getUtcOffset()){
                    this.openTimeArea = true;
                }
                return this;
            },
            initPopusMode () {
                this.setVmrUtcOffset()
                    .setDefaultStartDate()
                    .scaleMove()
                    .scaleEnd()
                    .resizeStart();
            },
            async initNormalMode () {
                this.scaleMove()
                    .scaleEnd()
                    .resizeStart();
                await this.getTimezoneList();
                await this.getOrgTree();
                if(this.businessModel === "cloudPort"&& this.mode==='video'){
                    this.closeMeetingTable();
                }
    
                this.setDefaultStartDate()
                    .initLocalStroage()
                    .defineChooseDate(new Date())
                    .initOpenTimezone();
            },
            async initEditMode () {
                this.scaleMove()
                    .scaleEnd()
                    .resizeStart();
                localStorage.reservation = "";
                await this.getTimezoneList();
                await this.getOrgTree();
                if(this.businessModel === "cloudPort"&& this.mode==='video'){
                    this.closeMeetingTable();
                }
                this.setEditDefaultStartDate()
                    .initOpenTimezone();
                
                
            }
            
        },
        mounted () {
            this.loading = true;
            this.mode==="popups"
                ? this.initPopusMode()//弹窗模式
                : this.isEditMode
                    ? this.initEditMode()  //编辑模式
                    : this.initNormalMode();//正常模式
            
           
        },
        updated () {
        
        },
        destroyed () {
            
            F.removeEvents([
                {o:document, e:"mousemove", callback:this.move,},
                {o:document, e:"mouseup", callback:this.end,},
                {o:window, e:"resize", callback:this.resize,},
            ])
            
        }
        
    }
    
    
   
    
//    function getProjectList(area,date) {
//    	this.loading = true;
//
//        let getDate = function  (date) {
//
//            if (typeof date === "undefined" || date === '' || date === null) date = new Date();
//
//            let year = new Date(date).getFullYear();
//            let month = new Date(date).getMonth() + 1;
//            let day = new Date(date).getDate();
//
//            month = month<10?"0"+month:month;
//            day = day<10?"0"+day:day;
//
//            return year + "/" + month + "/" + day;
//        };
//
//    	let data = [
//            {
//            	name: '51号楼会议洽谈室1',
//                id: 14310,
//                meet:
//                    [
//                    	{
//                    		startTimestamp:new Date(getDate(date)+" "+"09:00:00").valueOf(),
//                            endTimestamp:new Date(getDate(date)+" "+"10:00:00").valueOf(),
//                            title:"xxx部门周例会",
//                            Initiated:"xxx部门-xxx"
//
//                    	},
//                        {
//                            startTimestamp:new Date(getDate(date)+" "+"11:00:00").valueOf(),
//                            endTimestamp:new Date(getDate(date)+" "+"23:00:00").valueOf(),
//                            title:"xxx部门周例会",
//                            Initiated:"xxx部门-xxx"
//                        },
//
//
//                    ]
//            },
//            {name: '51号楼会议洽谈室2', id: 17311,meet:[{
//            	startTimestamp:new Date(getDate(date)+" "+"09:00:00").valueOf(),
//                endTimestamp:new Date(getDate(date)+" "+"12:00:00").valueOf(),
//                title:"xxx部门周例会",
//                Initiated:"xxx部门-xxx"
//            }]},
//            {name: '51号楼会议洽谈室3', id: 17312,meet:[{
//            	startTimestamp:new Date(new Date(getDate(date)+" "+"13:00:00").valueOf()).valueOf(),
//                endTimestamp:new Date(new Date(getDate(date)+" "+"16:00:00").valueOf()).valueOf(),
//                title:"xxx部门周例会",
//                Initiated:"xxx部门-xxx"
//            }]},
//            {name: '51号楼会议洽谈室4', id: 17313,meet:[]},
//            {name: '51号楼会议洽谈室5', id: 17317,meet: [
//                {
//                    startTimestamp:new Date(new Date(getDate(date)+" "+"14:00:00").valueOf()).valueOf(),
//                    endTimestamp:new Date(new Date(getDate(date)+" "+"16:00:00").valueOf(),).valueOf(),
//                    title:"xxx部门周例会",
//                    Initiated:"xxx部门-xxx"
//                },
//                {
//                    startTimestamp:new Date(new Date(getDate(date)+" "+"17:00:00").valueOf(),).valueOf(),
//                    endTimestamp:new Date(new Date(getDate(date)+" "+"18:00:00").valueOf(),).valueOf(),
//                    title:"xxx部门周例会",
//                    Initiated:"xxx部门-xxx"
//                },
//                {
//                    startTimestamp:new Date(new Date(getDate(date)+" "+"22:00:00").valueOf()).valueOf(),
//                    endTimestamp:new Date(new Date(getDate(date)+" "+"23:00:00").valueOf(),).valueOf(),
//                    title:"xxx部门周例会",
//                    Initiated:"xxx部门-xxx"
//                }
//
//            ]},
//            {name: '51号楼会议洽谈室6', id: 17315,meet:[{
//                startTimestamp:new Date(new Date(getDate(date)+" "+"09:00:00").valueOf(),).valueOf(),
//                endTimestamp:new Date(new Date(getDate(date)+" "+"10:00:00").valueOf(),).valueOf(),
//                title:"xxx部门周例会",
//                Initiated:"xxx部门-xxx"
//            }]},
//
//        ];
//
//    	for (let i = 0;i<10;i++){
//    		data.push({name: '51号楼会议洽谈室'+(i+7), id: Math.random(),meet:[]})
//        }
//
//    	data = data.map((item)=>{
//    		item.meet.forEach((timeItem)=>{
//    		  timeItem.halfHourLength = (timeItem.endTimestamp-timeItem.startTimestamp)/1800000
//            });
//            return item;
//        }).map((item) => {
//            return {
//                meet:item.meet,
//                projectName:  item.name + "-" + area,
//                highLight: false,
//                checked: false,
//                hide: false,
//                id: area.charCodeAt() + String(item.id)
//            }
//        });
//
//        return new Promise(function (resolve, reject) {
//            setTimeout(() => {
//                resolve(data)
//            },1)
//        });
//    }


</script>


<style scoped>
    
    /*common*/
    
    .f-mh-36px{
        max-height: 36px;
    }
    .pd-b-half{
        padding-bottom: 0.5em;
    }
    .pd-b-1em{
        padding-bottom: 1em;
    }
    .u-red{
        color: red;
    }
    .u-picker{
        padding: 0 1em 1em 0;
    }
    .u-btn-setcycle{
        font-size: 14px;
        cursor: pointer;
        height: 36px;
        line-height:36px;
        border: 1px solid #fff !important;
        padding-right: 2em;
        padding-left:0;
        color: #17bbf1;
    }
    .u-btn-opentimezone{
        font-size: 14px;
        cursor: pointer;
        height: 36px;
        line-height:36px;
        border: 1px solid #fff !important;
        padding-right: 0;
        color: #17bbf1;
    }
    .u-summer-time{
        height:30px;
        line-height:30px;
    }
    .u-btn-pull-up-area{
        float: right;
        font-size: 14px;
        height: 36px;
        line-height:36px;
        cursor: pointer;
        color: #17bbf1;
        border: 1px solid #fff !important;
        padding-right: 0
    }
    .u-resize-area{
        height: 5px;
        cursor:row-resize;
    }
    .u-timelist-arrow{
        position: relative;
        overflow-x: scroll;
        overflow-y:hidden;
        padding-right: 14px;
        height: 100px;
    }
    .u-label-free{
        font-size: 12px;
        height: 21px;
        line-height: 21px;
        float:left;
        padding-right:1em;
    }
    .u-block-free{
        height:1.2em;
        line-height:1.2em;
        width: 50px;
        border: 1px solid #ccc;
        float: left;
    }
    .u-label-takeup{
        font-size: 12px;
        height: 21px;
        line-height: 21px;
        padding-right: 1em;
        float: left;
    }
    .u-block-tackup{
        height:1.2em;
        line-height:1.2em;
        width: 50px;
        border: 1px solid #7dd1fa;
        background: #7dd1fa;
        float: left;
    }
    .u-timelist-date{
        position: absolute;
        top: 10px;
        width: 100px;
    }
    .u-popups-project-icon{
        height: 30px;
        line-height: 30px;
        font-size:21px;
        color: #20A0FF;
        padding:0 0.3em 0 0.5em;
    }
    .u-normal-project-icon{
        font-size:21px;
        color: #20A0FF;
        padding:0 5px 0 6px;
    }
    .u-normal-project-name{
        /*font-weight: bold;*/
        line-height: 24px;
    }
    .u-popups-project-name{
       
        color: #48566a;
        height: 30px;
        line-height: 30px;
    }
    .u-project-content{
        display: inline-block;
        height: 16px;
        min-width: 1000px;
    }
    .u-c17bbf1{
        color:#17bbf1 ;
    }
    .f-h-80px{
        height:80px;
    }
    .f-h-1px{
        height:1px;
    }
    .f-h-halfem{
        height:0.5em;
    }
    .f-minw-150px{
        min-width: 150px;
    }
    .no-margin{
        margin: 0;
    }
    .f-h-30px{
        height:30px;
    }
    .f-w-100{
        width: 100%;
    }
    .f-mgt--2em{
        margin-top:-1em;
    }
    .f-w-80{
        width: 80%;
    }
    .f-w-85{
        width: 85%;
    }
    .f-w-90{
        width: 90%;
    }
    .f-w-88{
        width: 88%;
    }
    .f-w-83{
        width: 83%;
    }
    .f-pdt-15px{
        padding-top: 15px;
    }
    .f-fs-14px{
        font-size: 14px;
    }
    .f-border-box{
        box-sizing: border-box;
    }
    .f-ofys{
        overflow-y: scroll;
    }
    .f-oh{
        overflow: hidden;
    }
    .f-ofxh{
        overflow-x: hidden;
    }
  
    .f-pdl-1em{
        padding-left:1em;
    }
 
    .f-pdb-1em{
        padding-bottom: 1em
    }
    .f-pdt-1em {
        padding-top:1em;
    }
    .f-pdr-1em {
        padding-right: 1em;
    }
    .f-pdr-2em {
        padding-right: 2em;
    }
  
    .f-pdb-halfem{
        padding-bottom: 0.5em;
    }
    .f-pdl-16px{
        padding-left: 16px;
    }
    .f-pdb-hal3em{
        padding-bottom: 1.5em;
    }
    
    .f-fs-20px{
        font-size: 20px;
    }
    .f-mgl-1em{
        margin-left: 1em;
    }
    .f-mgl-3em{
        margin-left:3em;
    }
    .u-picker .icon-delete{
       cursor: pointer;
    }
    .icon-delete:hover{
        color: #FA4D4D;
    }
    .f-tar{
        text-align: right;
    }
    .f-tac{
        text-align: center;
    }
    .f-tal{
        text-align: left;
    }
    .f-pr{
        position: relative;
    }
    .f-line-middle {
        height: 36px;
        line-height: 36px;
    }
    .no-padding {
        padding: 0 !important;
    }
    
    .label-size{
        font-size: 14px;
    }
    .label-size-en{
        font-size: 13px;
    }
    .u-label-middle{
        height:34px;
        line-height: 34px;
    }
    .u-tips-content{
        padding-bottom:13px;
        margin-top: -0.5em;
    }
    .no-border-left {
        border-left: none !important;
    }
    
    .no-border-right {
        border-right: none !important;
    }
    
    .no-border {
        border: none !important;
    }
    
    .border-right {
        border-right: 1px solid #ccc;
    }
    
    .gray-bac {
        background: #ccc;
    }
    
    .pull-left {
        float: left;
    }
    
    /*time-table*/
    
    .scales {
        height: 60px;
        position: relative;
    }
    
    .scale-height {
        height: 8px;
        top: 2px;
        position: relative;
    }
    .scale-width {
        width:calc(100% + 2px);
    }
    .scale-lines {
        height: 1px;
        width: 110%;
        background: #ccc;
    }
    
    .scroll-contrl-area-right {
        width: 10px;
        position: absolute;
        top: 0;
        right: 20px;
    }
    
    .scroll-contrl-area-left {
        width: 10px;
        position: absolute;
        top: 0;
        left: 0;
    }
    
    .scale-hours {
        height: 10px;
        width: 1px;
        background: #000;
    }
    
    .scale-half-hours {
        height: 5px;
        width: 1px;
        background: #ccc;
    }
    .scale-half-hours-active {
        height: 7px;
        background: #FFF;
    }
    
    .scale-value {
        font-weight: normal;
        position: absolute;
        left: 0;
        top: 45px;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        padding: 0;
        
    }
    
    .card {
        border-radius: 2px;
        background-color: #fff;
        background-clip: padding-box;
        /*box-shadow: 0 2px 6px #ccc;*/
        border: 1px solid #d1dbe5;
        border-radius: 2px;
    }
    
    .theader {
        background-color: #fff;
        background-clip: padding-box;
        /*box-shadow: 0 2px 6px #ccc;*/
        border-radius: 2px;
    }
    
    .drag-t {
        width: 3px;
        min-width: 3px;
        max-width: 3px;
    }
    
    .border {
        border: 1px solid #ccc;
    }
    
    .dotted {
        border: 1px dotted #ccc
    }
    
    .highLight-bac {
        background: rgba(26, 188, 156, 0.15);
        color: #fff;
    }
    
    .checked-bac {
        background: rgba(132, 201, 234, 0.2);
        color: #fff;
    }
    
    .highLight-time {
        background: rgba(132, 201, 234, 0.2);
        border: 1px dotted #fff;
        color: #fff;
    }
    
    .highLight-border-left {
        border-left: 1px dashed rgba(26, 188, 156, 1) !important;
    }
    
    .highLight-arrow {
        background: rgba(26, 188, 156, 1);
    }
    
    .high-light-time-value {
        color: rgba(26, 188, 156, 1);
    }
    
    .high-light-range-left {
        border-left: 1px solid #2196f3 !important;
    }
    
    .high-light-range-right {
        border-right: 1px solid #2196f3 !important;
    }
    
    .high-light-time-line {
        background: #7dd1fa;
    }
    
    .high-light-check-time-project {
        background: rgb(33, 150, 243) !important;
        border-left: 1px solid rgb(33, 150, 243);
        border-right: 1px solid rgb(33, 150, 243);
        border-top: 1px solid rgb(33, 150, 243);
        border-bottom: 1px solid rgb(33, 150, 243);
    }
    
    
    .zero-time-border {
        border-left: 1px solid rgb(33, 150, 243);
    }
    .u-btn:hover {
        color:#2196f3 !important;
    }
    .u-btn:active {
        color: #20cbf3 !important;
    }
    
    .zero-time-high-light {
        color: #2196F3
    }
    
</style>
