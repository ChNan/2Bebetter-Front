
<!--后期重构用-->
<template>
    <el-row v-show="openMeeting"  style="padding-top: 9px">
        <el-col :id="idList.meetingTable" :xs="tableSize" :sm="tableSize" :md="tableSize" :lg="tableSize" :offset="tableOffset">
            <div class="card" :style="{'width':contentWidth+'px'}" @mouseleave="resetHighLight()">
                <loading :show="loading" :height="timeListHeight" :width="contentWidth"></loading>
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
                                                                <div :class="{'icon-Videoconference':mode==='video','icon-Generalmeeting':mode==='room'}"
                                                                     class="icon iconfont f-fl u-normal-project-icon">
                                                                </div>
                                                                <div class="f-fl u-normal-project-name">{{item.projectName}}</div>
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
                                    </tbody>
                                </table>
                            </div>
                            <div class="scroll-contrl-area-right"
                                 @mouseover="chooseScroll($event,3)"
                                 @mouseout="clearTimer()"
                                 @mouseup.stop="highLightTimeEnd()">
                            </div>
                            <div class="scroll-contrl-area-left"
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
</template>
<script>


import dropdownTree from './dropdownTree'
import trLine from './line'
import loading from './loading'
import F from './tools'
import timezone from './timezone'
import {
    reqMeetingRoomList,
    reqTimezoneList,
    reqCheckTimezone,
    reqVmr,
    reqOrgTree,
} from "@/api/reservation/"

export default {
    components:{
        dropdownTree,
        trLine,
        loading
    },
    methods: {
        defineChooseDate (date) {
            this.renderArrow = false;
            this.chooseDate = {
                startDate: timezone.getTimezoneDate(date,this.utcOffset),
                startTime: timezone.getTimezoneTimeToInteger(date,this.utcOffset),
                startTimestamp:timezone.getTimestampByTimezone(date,this.utcOffset),
                endTimestamp:'',
                endDate: this.getTimeZoneDate(date),
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
        getStamp (date,type) {
            let dateStr = date.replace(/\//g,"-") +" "+ this.chooseDate[type];
            return new Date(timezone.format("yyyy-mm-ddThh:mm:ss-zone")(this.utcOffset,dateStr)).valueOf();
        },
        initStamp (date,timePoint){
            return new Date (date.replace(/\//g,"-") +"T"+timePoint+timezone.getTimezoneNum(this.utcOffset)).valueOf()
        },
        isUnEmptyChooseDate () {
            
            return Object.keys(this.chooseDate).filter((item)=>{
                return item!=="startTimestamp"&&item!=="endTimestamp"
            }).every((item)=>{
                return this.chooseDate[item] !== '' && typeof this.chooseDate[item] !== "undefined";
            });
            
        },
        correctTimeStamp (timeType) {
            
            let Handle = {
                "startTime":()=>{this.chooseDate.startTimestamp = this.getStamp(this.chooseDate.startDate,'startTime');},
                "startDate":()=>{this.chooseDate.startDate = this.getDate(this.chooseDate.startDate);},
                "endTime":()=>{this.chooseDate.endTimestamp = this.getStamp(this.chooseDate.endDate,'endTime');},
                "endDate":()=>{this.chooseDate.endDate = this.getDate(this.chooseDate.endDate);}
            };
            
            Handle[timeType]();
        },
        isSameRange () {
            let startIndex = this.getHighLightIndex(-1);
            let endIndex = this.getHighLightIndex(1)+1;
            
            return startIndex && endIndex &&
                this.chooseDate.endTimestamp === this.timeList[endIndex].timeStamp &&
                this.chooseDate.startTimestamp === this.timeList[startIndex].timeStamp;
            
        },
        isMistakeTimeRange (startStamp,endStamp) {
            
            return endStamp - startStamp <= 0 || endStamp - startStamp > 1000 * 60 * 60 * 24 * 3
            
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
            
            if(startIndex&&endIndex){
                this.timeList.forEach((item, index) => {
                    if (startIndex <= index && endIndex > index) {
                        item.highLight = true;
                    }
                });
                
                this.highLightRange(startIndex,endIndex-1,false);
                
                this.autoScrollX(startIndex);
            }
        },
        dateChangeByUser (e,type) {
            
            if( this.renderArrow ===false){
                this.renderArrow = true;
                return console.log('开始时间非手动触发，取消赋值');
            }
            if(this.changeStartDate === false){
                this.changeStartDate = true;
                return console.log('开始时间非手动触发，取消赋值');
            }
            
            console.log("通过检查，现在是手动触发");
            let handle = {
                startDate:()=>{
                    this.startDate = e.replace(/'-'/g,'/');
                    this.chooseDate.startDate = e.replace(/'-'/g,'/');
                    this.chooseDate.startTime = "08:00";
                    this.chooseDate.endDate = e.replace(/'-'/g,'/');
                    this.chooseDate.endTime = '';
                    this.chooseDate.endTimestamp = '';
                    
                },
                endDate:()=>{
                
                }
            };
            handle[type]();
            console.log(e,type);
        },
        autoRender (e,timeType) {
            
            if(this.renderArrow===false){
                this.renderArrow = true;
                return console.log("这次是手动触发的，所以不会渲染！");
            }
            if(this.changeStartDate === false){
                this.changeStartDate = true;
                return console.log('开始时间非手动触发，取消赋值');
            }
            if(!this.isUnEmptyChooseDate()) return console.log("有空的"); //检查是否有空值
            
            this.correctTimeStamp(timeType);  //纠正时间戳
            
            if(this.isSameRange()) return console.log("时间相同，不渲染啦！"); // 检查当前 视图已经高亮的部分 是否 和选择的时间点相同，如果相同 则取消渲染
            
            let startStamp = this.getStamp(this.chooseDate.startDate,'startTime');
            let endStamp = this.getStamp(this.chooseDate.endDate,'endTime');
            
            if(this.isMistakeTimeRange(startStamp,endStamp)) return console.log('时间范围不正确！'); //检查时间范围是否正确，是否大于三天，是否结束时间早于开始时间
            
            this.renderTimeLine(this.chooseDate, () => {
                this.setHighLightArea(startStamp,endStamp);
                if(this.version===2){
                    this.checkAllTakeUp();
                }
            });
            
        },
        confirmDate () {
            this.$emit("set-cycle",this.chooseDate);
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
            debugger
            if( this.chooseDate.startTime ==="" ||
                typeof this.chooseDate.startTime ==="undefined"||
                this.chooseDate.endTime === ""||
                typeof this.chooseDate.endTime === "undefined"
            ){
                return false; //未选择时间直接返回
            }
            
            //返回检查结果
            return project.meet.some((item)=>{   //检查边界值
                
                return	(this.chooseDate.startTimestamp-item.startTimestamp)>=0&&
                    (this.chooseDate.startTimestamp-item.endTimestamp<0)||
                    (this.chooseDate.endTimestamp-item.startTimestamp>0)&&
                    (this.chooseDate.endTimestamp-item.endTimestamp<=0)||
                    (item.startTimestamp>=this.chooseDate.startTimestamp)&&
                    (item.endTimestamp<=this.chooseDate.endTimestamp);
                
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
                this.$message("会议室在该时间段内被占用");
                this.resetChooseTime();
                timeChooseTip = false;
                this.defineChooseDate(new Date(this.startDate));
                
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
        checkProject (projectListIndex,checked) { //备忘：自动滚动区域高度没有绑定,（后期会改为滚动分页，自动滚动区域高度不需要绑定了）。
            
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
                    if( this.isTakeUp(projectListIndex) === true) {
                        this.$message('该会议室在已选择的时间段内已被占用！');
                        // 取消勾选
                        this.projectList.forEach((item,i)=>{
                            if(projectListIndex === i){
                                item.checked = false;
                            }
                        });
                        return console.log("会议室冲突，取消勾选");
                    }
                    this.confirmCheck(projectListIndex);
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
        highLightRange (leftIndex,rightIndex,i) {
            
            if(leftIndex&&rightIndex){ //选取的时间大于半个小时
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
                        this.getChooseTime();
                    }
                    
                })
            }
        },
        highLightTimeEnd (data) {
            
            let {i:i,j:j} = data||{};
            if (this.chooseable === 1) {
                //手动选中高亮不触发视图重新渲染
                this.renderArrow = false;
                this.changeStartDate = false;
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
        getChooseTime () {  //此处应该有bug 在零界点
            
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
                    timeStamp: new Date(this.lastDaysPoint + " " + "00:00").valueOf()
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
            
            this.renderArrow = false;
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
        getUTCoffest() {
            return this.timeZoneList.filter((item)=>{
                    return item.zoneId === this.timeZone
                })[0].utcOffset/60+(this.summerTime.show===true&&this.summerTime.checked===true?this.summerTime.offset:0);
        },
        setTimezoneList (data) {
            this.timeZoneList = data;
        },
        getTimezoneList () {
            reqTimezoneList().then((res)=>{
                this.setTimezoneList(res.data.data);
                this.getDefaultTimezone();
            });
            return this;
        },
        changeTimeZone (zoneId,) {
            
            if(this.timezoneChangeCtrl===false) {
                this.timezoneChangeCtrl = true;
                return;
            }
            
            if(this.chooseDate.endTime!==""&&typeof this.chooseDate.endTime !=="undefined"){
                this.renderArrow = false;
            }
            this.checksummerTime(zoneId);
        },
        changeSummertime () {
            
            if(this.chooseDate.endTime!==""&&typeof this.chooseDate.endTime !=="undefined"){
                this.renderArrow = false;
            }
            this.utcOffset = this.getUTCoffest();
            this.getChooseTime();
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
                this.getChooseTime();
            })
        },
        getVmrProject () {
            reqVmr({
                queryDate: this.getDate(this.startDate).replace(/\//g,"-"),
                zoneId:this.timeZone,
                dayCount:2
            }).then(res=>{
            
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
                    projectName:  item.name,
                    highLight: false,
                    checked: false,
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
            reqOrgTree().then(res=>{
                this.areaList = res.data.data;
                this.$nextTick(()=>{
                    this.$refs.dropdownTree.initText();
                });
                
            });
            return this;
        },
        initLocalStroage () {
            localStorage.reservation = typeof localStorage.reservation==="undefined" || localStorage.reservation === null
                ? ""
                : localStorage.reservation;
            return this;
        },
        getDefaultTimezone () {
            reqCheckTimezone({checkedTime:timezone.format("yyyy-mm-dd 00:00:00")(this.startDate),})
                .then(res=>{
                    this.timeZone = res.data.defaultTimeZone;// 设置默认时区
                    this.timezoneChangeCtrl = false;
                    if(res.data.dayLightDelta===0){
                        this.summerTime.offset = 0;  //清空夏令时偏移量
                        this.summerTime.show=false;  //不显示夏令时勾选框
                        this.summerTime.checked = false; //取消勾选
                    }else {  // 有夏令时偏移量
                        this.summerTime.offset = res.data.dayLightDelta/(1000*60); //设置夏令时偏移量
                        this.summerTime.show = true; //显示夏令时勾选框
                        
                        if(res.data.defaultDSTEnable===1){  //如果为1 默认勾选夏令时
                            this.summerTime.checked = true;
                        }
                    }
                    this.utcOffset = this.getUTCoffest();
                    
                    //获取完成 默认时区后 获取会议室  后续改为await
                    this.getProject(localStorage.reservation).then(res=>{
                        this.setProject(res.data.resourceSchedules).then(()=>{
                            this.initTimeLine()
                                .autoScrollX(16)
                        });
                        
                    });
                })
        },
    },
    
}
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
        float: right;
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
        float: right;
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
        font-size:20px;
        color: #20A0FF;
        padding:0 0.3em 0 0.5em;
    }
    .u-normal-project-icon{
        font-size:20px;
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
        height: 300px;
    }
    
    .scroll-contrl-area-left {
        width: 10px;
        position: absolute;
        top: 0;
        left: 0;
        height: 300px;
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
