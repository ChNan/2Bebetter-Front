<template>
    <div class="video">
        <el-row>
            <el-col :span="24">
                <div class="m-cards">
                    <el-row class="f-pdb-1em" v-if="mode==='video'">
                        <el-col :span="2">
                            <div class="f-line-middle f-tar">
                                <span class="f-pdr-1em" :class="{'f-label-size-en':language==='en-US','f-label-size':language==='zh-CN'}">
                                    {{$t('reservation.meetingMode')}}
                                </span>
                            </div>
                        </el-col>
                        <el-col :span="21" class="f-line-middle">
                            <el-radio class="radio u-radio" v-model="meetingMode" label="default">
                                {{$t('reservation.meetingMode.discuss')}}
                            </el-radio>
                            <el-radio :disabled="checkedResource==='private'&& this.businessModel === 'cloudPort'"
                                      class="radio f-margin-0" v-model="meetingMode" label="demonstrator">
                                {{$t('reservation.meetingMode.chairman')}}
                            </el-radio>
                            <!--<span v-if="meetingMode==='demonstrator'&&checkedResource==='private'"-->
                            <!--style="color: red; font-size: 14px;padding-left: 2em;">{{$t('reservation.meetingMode.chairmanTip')}}</span>-->
                            
                            <!--<el-select style="width: 100%" v-model="value" placeholder="请选择模式">-->
                            <!--<el-option-->
                            <!--v-for="item in [{label:'讨论模式',value:'讨论模式'},{label:'主席模式',value:'主席模式'}]"-->
                            <!--:key="item.value"-->
                            <!--:label="item.label"-->
                            <!--:value="item.value">-->
                            <!--</el-option>-->
                            <!--</el-select>-->
                        </el-col>
                    </el-row>
                    <meeting-table ref="reservationMeeting"
                                   :class="{'f-pdt-room':mode==='room'}"
                                   :mode="mode"
                                   :business-model="businessModel"
                                   :cycle-str="cycleStr"
                                   :cycle-show="cycleShow"
                                   :cycle-data="getRecurrencePattern"
                                   :cycle-time="meetingTime"
                                   @cancel-cycle="cancelCycle()"
                                   @close-cycle="closeCycle()"
                                   @show-resource="showResource()"
                                   @set-cycle="setCycle($event)">
                    </meeting-table>
                    <el-row class="f-pdb-1em">
                        
                        <el-col :span="2">
                            <div class="f-line-middle f-tar">
                                <span class="f-pdr-1em" :class="{'f-label-size-en':language==='en-US','f-label-size':language==='zh-CN'}">
                                    {{$t('reservation.subject')}}
                                </span>
                            </div>
                        
                        </el-col>
                        <el-col :span="21">
                            <el-form :rules="rules" :model="meetingThemeForm">
                                <el-form-item prop="theme" class="f-mg-0">
                                    <el-input :maxlength="128" v-model="meetingThemeForm.theme"></el-input>
                                    <el-input style="display: none;"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                    <el-row class="f-pdb-22px">
                        <el-col :span="2" :class="{'f-pdt-4px':mode==='room'}">
                            <div class="f-line-middle f-tar">
                                <span class="f-pdr-1em" :class="{'f-label-size-en':language==='en-US','f-label-size':language==='zh-CN'}">
                                    {{$t('reservation.meetingPerson')}}
                                </span>
                            </div>
                        </el-col>
                        <el-col :span="21">
                            <el-col class="u-person-item" :span="24">
                                <div class="f-line-middle person-inf" v-if="mode==='video'">
                                    <div class="f-fl f-pdr-1em">
                                        {{$t('reservation.meetingPersonIntroduce')}}
                                    </div>
                                    <div class="f-fl">
                                        <div
                                            class="f-fl icon u-icon-person iconfont icon-visitors icon-person-content icon-yellow"></div>
                                        <div class="f-fl">{{$t('reservation.compere')}}</div>
                                    </div>
                                    <div class="f-fl f-pdl-2em">
                                        <div
                                            class="f-fl icon u-icon-person iconfont icon-visitors icon-person-content"></div>
                                        <div class="f-fl">{{$t('reservation.visitor')}}</div>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :xs="6" :sm="6" :md="6" :lg="4" class="u-person-item u-mouse-pointer">
                                <div class="f-pos-rel f-line-middle person-content">
                                    <div class="f-fl">
                                        <i :style="mode==='video'?'color: #fca40c':''" :class="{'icon-compere':mode==='video','icon-visitors':mode==='room'}" class="icon u-icon-person iconfont icon-compere"></i>
                                    </div>
                                    <div class="f-fl person-name"
                                         @click="mode==='video'?$message($t('reservation.message.mustBeCompere')):''">
                                        {{isEdit ? organizer.name : userName}}
                                    </div>
                                </div>
                            </el-col>
                            <transition-group name="fade" tag="div">
                                <el-col :xs="6" :sm="6" :md="6" :lg="4" class="u-person-item u-mouse-pointer"
                                        v-for="(item,index) in meetingPersonList" :key="item.id">
                                    <div :title="item.name" class="f-pos-rel f-line-middle person-content"
                                         @click="changePersonType(index,item)">
                                        <div class="f-fl">
                                            <i v-if="item.type=='external'"
                                               class="icon u-icon-person iconfont icon-wenhao-mid"></i>
                                            <i v-else-if="(item.sign===1||item.type===3)" style="color: #fca40c"
                                               class="icon u-icon-person iconfont icon-visitors"></i>
                                            <i v-else-if="item.sign===0"
                                               class="icon u-icon-person iconfont icon-visitors"></i>
                                        </div>
                                        <div class="f-fl person-name">
                                            {{item.name}}
                                        </div>
                                        <div v-if="item.sign!==3" class="f-pos-abs f-right-0"
                                             @click.stop="deletePerson(index,'meetingPersonList')">
                                            <i class="icon-delete icon iconfont"></i>
                                        </div>
                                    </div>
                                </el-col>
                            </transition-group>
                            
                            <el-col :xs="6" :sm="6" :md="6" :lg="4" class="u-person-item">
                                <div class="f-line-middle person-content u-mouse-pointer"
                                     @click="openAddModal('addMemberShow','meetingPersonList')">
                                    <div class="f-fl">
                                        <i class="icon u-icon-person iconfont icon-addname"></i>
                                    </div>
                                    <div class="f-fl" style="text-indent: 0.5em;">
                                        <span style="color: #26c7ec">{{$t('reservation.add')}}</span>
                                    </div>
                                
                                </div>
                            </el-col>
                        </el-col>
                    </el-row>
                    <el-row class="f-pdb-22px" v-if="hasViewer">
                        <el-col :span="2">
                            <div class="f-line-middle f-tar">
                                <span class="f-pdr-1em" :class="{'f-label-size-en':language==='en-US','f-label-size':language==='zh-CN'}">
                                    {{$t('reservation.audience')}}
                                </span>
                            </div>
                        </el-col>
                        <el-col :span="21">
                            <transition-group name="fade" tag="div">
                                <el-col :xs="6" :sm="6" :md="6" :lg="4" class="u-person-item u-mouse-pointer"
                                        v-for="(item,index) in meetingAudience" :key="item.id">
                                    <div :title="item.name" class="f-pos-rel f-line-middle person-content">
                                        <div class="f-fl">
                                            <i v-if="item.type=='external'"
                                               class="icon u-icon-person iconfont icon-wenhao-mid"></i>
                                            <i v-else-if="item.sign===1||item.type===3" style="color: #fca40c"
                                               class="icon u-icon-person iconfont icon-visitors"></i>
                                            <i v-else-if="item.sign===0"
                                               class="icon u-icon-person iconfont icon-visitors"></i>
                                        </div>
                                        <div class="f-fl person-name">
                                            {{item.name}}
                                        </div>
                                        <div v-if="item.sign!==3" class="f-pos-abs f-right-0"
                                             @click.stop="deletePerson(index,'meetingAudience')">
                                            <i class="icon-delete icon iconfont"></i>
                                        </div>
                                    
                                    </div>
                                </el-col>
                            </transition-group>
                            
                            <el-col :xs="6" :sm="6" :md="6" :lg="4" class="u-person-item">
                                <div class="f-line-middle person-content u-mouse-pointer"
                                     @click="openAddModal('addMemberShow','meetingAudience')">
                                    <div class="f-fl">
                                        <i class="icon u-icon-person iconfont icon-addname"></i>
                                    </div>
                                    <div class="f-fl" style="text-indent: 0.5em;">
                                        <span style="color: #26c7ec">{{$t('reservation.add')}}</span>
                                    </div>
                                
                                </div>
                            </el-col>
                        </el-col>
                    </el-row>
                    <el-row class="f-pdb-2em">
                        <el-col :span="2">
                            <div class="f-line-middle f-tar">
                                <span class="f-pdr-1em" :class="{'f-label-size-en':language==='en-US','f-label-size':language==='zh-CN'}">
                                    {{$t('detail.Remark')}}
                                </span>
                            </div>
                        
                        </el-col>
                        <el-col :span="21">
                            <editor ref="editor" :content="content" :path="path"></editor>
                        </el-col>
                    </el-row>
                </div>
                <div class="f-tac f-pd-1em">
                    <el-button type="primary" size="large" class="u-btn-w f-mg-both-2em" @click="sendMail()">
                        {{$t('reservation.btn.send')}}
                    </el-button>
                    <el-button type="primary" size="large" class="u-btn-w f-mg-both-2em"
                               @click="openMailPrew()">{{$t('reservation.btn.see')}}
                    </el-button>
                    <el-button size="large" class="u-btn-w f-mg-both-2em" @click="cancelReservation()">
                        {{$t('reservation.btn.cancel')}}
                    </el-button>
                </div>
            </el-col>
            
            <el-dialog custom-class="u-dialog-preview" :title="$t('reservation.modal.mailPrev.title')" :visible.sync="mailPreviewShow" size="small"
                       :before-close="closeModal()">
                <el-row class="f-pdb-2em">
                    <el-col :span="2" class="f-mw-50px">
                        <div class="f-line-middle f-mw-85px">
                            <span class="f-pdr-1em">{{$t('reservation.modal.mailPrev.reciever')}}</span>
                        </div>
                    </el-col>
                    <el-col :span="22">
                        <el-col :span="24">
                            <el-col :span="8" class="u-person-item">
                                <div class="f-line-middle person-content-finish">
                                    <div style="color: #fca40c"
                                         class="f-fl icon u-icon-person iconfont icon-compere"></div>
                                    <div class="f-fl person-content-finish-name" style="width:  calc(90% - 30px)">
                                        {{userName}}
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="8" class="u-person-item" v-for="item in previewRecipients" :key="item.id">
                                <div class="f-line-middle person-content-finish">
                                    <div v-if="item.type=='external'"
                                         class="f-fl icon u-icon-person iconfont icon-wenhao-mid"></div>
                                    <div v-else-if="item.role==='presenter'" style="color: #fca40c"
                                         class="f-fl icon u-icon-person iconfont icon-visitors"></div>
                                    <div v-else-if="item.role==='attendee'"
                                         class="f-fl icon u-icon-person iconfont icon-visitors"></div>
                                    <div v-else-if="item.role==='castviewer'"
                                         class="f-fl icon u-icon-person iconfont icon-visitors"></div>
                                    <div class="f-fl person-content-finish-name" style="width:  calc(90% - 30px)" :title="item.name">
                                        {{item.name}}
                                    </div>
                                </div>
                            </el-col>
                        </el-col>
                    
                    </el-col>
                
                </el-row>
                <el-row class="">
                    <el-col class="m-mail-min-width" :span="2">
                        <div class="u-line-dialog m-mail-min-width">
                            <span class="f-pdr-1em">{{$t('reservation.modal.mailPrev.mailSubject')}}</span>
                        </div>
                    </el-col>
                    <el-col :span="18" class="u-line-dialog ">
                        <div class="text-over-hide">{{meetingThemeForm.theme}}</div>
                    </el-col>
                
                </el-row>
                <el-row class="">
                    <el-col class="m-mail-min-width" :span="2">
                        <div class="u-line-dialog">
                            <span class="f-pdr-1em">{{$t('reservation.modal.mailPrev.meetingTime')}}</span>
                        </div>
                    </el-col>
                    <el-col :span="18" class="u-line-dialog ">
                        <span>
                            {{previewChooseTime}}
                        </span>
                    </el-col>
                </el-row>
                <el-row class="f-mgb-half3em">
                    <el-col class="m-mail-min-width" :span="2">
                        <div class="u-line-dialog">
                            <span class="f-pdr-1em">{{$t('reservation.modal.mailPrev.meetingAddress')}}</span>
                        </div>
                    </el-col>
                    <el-col :span="18" class="u-line-area">
                        <span v-for="item in selectedProjectList" style="padding-right: 5px;">
                               {{item.projectName}}
                        </span>
                    
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2" class="m-mail-min-width">
                        <div class="u-line-dialog">
                            <span class="f-pdr-1em">{{$t('reservation.modal.mailPrev.mailContent')}}</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="edit-content" v-html="result">
                        
                        </div>
                    </el-col>
                </el-row>
                <div slot="footer" class="dialog-footer f-tac">
                    <el-button :style="language==='zh-CN'?'':'padding-left: 10px;padding-right: 10px'" class="u-btn-confirm" size="large" type="primary" @click="sendMail()">
                        {{$t('reservation.btn.confirmSend')}}
                    </el-button>
                    <el-button class="u-btn-back" size="large" @click="mailPreviewShow = false">
                        {{$t('reservation.btn.back')}}
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog :title="$t('reservation.modal.addMember.title')" :visible.sync="addMemberShow" size="small"
                       :custom-class="'transfer'">
                <el-row>
                    <el-col :span="24">
                        <transfer :data="memberList" :filterNodeKey="['name', 'namePinyin','email','namePinyinAlia']"
                                  v-model="selectedMember" ref="memberTransfer" iconSkinField="type"></transfer>
                    </el-col>
                </el-row>
                <div slot="footer" class="dialog-footer f-tac">
                    <el-button class="u-btn-confirm" size="large" type="primary" @click="addMember()">{{$t('reservation.btn.confirm')}}</el-button>
                    <el-button class="u-btn-back" size="large" @click="closeModal('addMemberShow')">{{$t('reservation.btn.cancel')}}</el-button>
                </div>
            </el-dialog>
            <el-dialog :title="$t('reservation.modal.setMeetingCycle.title')" :custom-class="'u-dialog-size'"
                       :visible.sync="setCycleShow" :top="'6%'" size="small" @close="closeCycleModal()">
                <el-row style="margin-top: -18px">
                    <el-col :span="24">
                        <el-row class="f-pdb-1em">
                            <el-col :span="24" class="f-pdb-4px">
                                {{$t('reservation.modal.setMeetingCycle.date.title')}}
                            </el-col>
                            <el-col :span="24" class="m-date-time">
                                <el-col :span="20">
                                    <el-form label-width="80px" :label-position="'left'">
                                        <el-form-item :label="$t('reservation.modal.setMeetingCycle.date.start')"
                                                      style="margin-bottom: 16px;">
                                            <el-row>
                                                <el-col :span="11">
                                                    <el-date-picker
                                                        @blur="activePicker='startDate'"
                                                        @change="correctCycleTime($event,'startDate')"
                                                        :clearable="false"
                                                        :editable="false"
                                                        class="f-w-100"
                                                        v-model="meetingTime.startDate"
                                                        type="date"
                                                        :placeholder="$t('reservation.placeholder.chooseDate')">
                                                    </el-date-picker>
                                                </el-col>
                                                <el-col :offset="1" :span="11">
                                                    <el-time-select
                                                        @blur="activePicker='startTime'"
                                                        @change="correctCycleTime($event,'startTime')"
                                                        :clearable="false"
                                                        class="f-w-100"
                                                        v-model="meetingTime.startTime"
                                                        :editable="false"
                                                        :picker-options="{
                                                            start: '00:00',
                                                            step: '00:30',
                                                            end: '23:30'
                                                        }"
                                                        :placeholder="$t('reservation.placeholder.chooseTime')">
                                                    </el-time-select>
                                                </el-col>
                                            </el-row>
                                        
                                        </el-form-item>
                                        <el-form-item :label="$t('reservation.modal.setMeetingCycle.date.end')">
                                            <el-row>
                                                <el-col :span="11">
                                                    <el-date-picker
                                                        :editable="false"
                                                        @blur="activePicker='endDate'"
                                                        @change="correctCycleTime($event,'endDate')"
                                                        :clearable="false"
                                                        class="f-w-100"
                                                        v-model="meetingTime.endDate"
                                                        type="date"
                                                        :placeholder="$t('reservation.placeholder.chooseDate')">
                                                    </el-date-picker>
                                                </el-col>
                                                <el-col :offset="1" :span="11">
                                                    <el-time-select
                                                        :editable="false"
                                                        @blur="activePicker='endTime'"
                                                        @change="correctCycleTime($event,'endTime')"
                                                        :clearable="false"
                                                        class="f-w-100"
                                                        v-model="meetingTime.endTime"
                                                        :picker-options="{
                                                            start: '00:00',
                                                            step: '00:30',
                                                            end: '23:30'
                                                        }"
                                                        :placeholder="$t('reservation.placeholder.chooseTime')">
                                                    </el-time-select>
                                                </el-col>
                                            </el-row>
                                        
                                        
                                        </el-form-item>
                                        <el-form-item :label="$t('reservation.modal.setMeetingCycle.date.duration')">
                                            <el-row>{{duration}}<span v-if="duration!==''">{{$t('reservation.modal.setMeetingCycle.date.hour')}}</span>
                                            </el-row>
                                        </el-form-item>
                                    </el-form>
                                </el-col>
                            </el-col>
                        </el-row>
                        <el-row class="f-pdb-1em">
                            <el-col :span="24" class="f-pdb-4px">
                                {{$t('reservation.modal.setMeetingCycle.cycleMode.title')}}
                            </el-col>
                            <el-col :span="24" class="m-date-content">
                                <el-col :span="4" class="m-date-radio-content">
                                    <el-row class="f-line-middle-radio">
                                        <el-radio class="radio" v-model="cycleMeeting.range" label="day">
                                            {{$t('reservation.modal.setMeetingCycle.cycleMode.byDay')}}
                                        </el-radio>
                                    </el-row>
                                    <el-row class="f-line-middle-radio">
                                        <el-radio class="radio" v-model="cycleMeeting.range" label="week">
                                            {{$t('reservation.modal.setMeetingCycle.cycleMode.byWeek')}}
                                        </el-radio>
                                    </el-row>
                                    <el-row class="f-line-middle-radio">
                                        <el-radio class="radio" v-model="cycleMeeting.range" label="mounth">
                                            {{$t('reservation.modal.setMeetingCycle.cycleMode.byMounth')}}
                                        </el-radio>
                                    </el-row>
                                    <el-row class="f-line-middle-radio">
                                        <el-radio class="radio" v-model="cycleMeeting.range" label="year">
                                            {{$t('reservation.modal.setMeetingCycle.cycleMode.byYear')}}
                                        </el-radio>
                                    </el-row>
                                
                                </el-col>
                                <el-col :span="20" class="f-pd-2em f-pr-0"
                                        :class="{'f-pdb-0':cycleMeeting.range==='year','f-pdt-0':cycleMeeting.range==='year'}">
                                    <el-col :span="24" v-show="cycleMeeting.range==='day'">
                                        <el-row class="f-line-middle-radio2">
                                            <el-radio class="radio" v-model="cycleMeeting.day.range" label="userDefine">
                                                <span
                                                    class="f-pdr-1em">{{$t('reservation.modal.setMeetingCycle.cycleMode.every')}}</span>
                                                <el-input min="1" @blur="toAbs($event,`cycleMeeting.day.userDefine`)"
                                                          size="small" class="f-w-5em" type="number"
                                                          v-model="cycleMeeting.day.userDefine"></el-input>
                                                <span
                                                    class="f-pdl-1em">{{$t('reservation.modal.setMeetingCycle.cycleMode.day')}}</span>
                                            </el-radio>
                                        </el-row>
                                        <el-row class="f-line-middle-radio2">
                                            <el-radio class="radio" v-model="cycleMeeting.day.range" label="everyday">
                                                {{$t('reservation.modal.setMeetingCycle.cycleMode.everyWorkDay')}}
                                            </el-radio>
                                        </el-row>
                                    </el-col>
                                    <el-col :span="24" v-show="cycleMeeting.range==='week'">
                                        <el-row class="f-line-middle-radio2" style="margin-top: -1.5em;">
                                            {{$t('reservation.modal.setMeetingCycle.cycleMode.repeatRange')}}
                                            <el-input min="1" @blur="toAbs($event,`cycleMeeting.week.interval`)"
                                                      size="small" class="f-w-5em" type="number"
                                                      v-model="cycleMeeting.week.interval"></el-input>
                                            {{$t('reservation.modal.setMeetingCycle.cycleMode.afterWeek')}}
                                        </el-row>
                                        <el-row class="f-line-middle-radio2">
                                            <el-checkbox-group v-model="cycleMeeting.week.dayList">
                                                <el-checkbox v-for="(item,index) in weekList" :key="index"
                                                             class="f-mgl-0 f-mgr-10px"
                                                             :label="item.label"></el-checkbox>
                                            </el-checkbox-group>
                                        </el-row>
                                    </el-col>
                                    <el-col :span="24" v-show="cycleMeeting.range==='mounth'">
                                        <el-row class="f-line-middle-radio2">
                                            <el-radio v-if="language==='zh-CN'" class="radio" v-model="cycleMeeting.mounth.range" label="1">
                                                <template>
                                                    <span
                                                        class="f-pdr-1em f-w-2em f-d-inline-block">{{$t('reservation.modal.setMeetingCycle.cycleMode.every')}}</span>
                                                    <el-input @blur="toAbs($event,`cycleMeeting.mounth['1'].mounth`)"
                                                              min="1" v-model="cycleMeeting.mounth['1'].mounth"
                                                              size="small" class="f-w-5em" type="number"></el-input>
                                                    <span
                                                        class="f-w-4em f-d-inline-block f-pd-both-1em">{{$t('reservation.modal.setMeetingCycle.cycleMode.MounthNum')}}</span>
                                                    <el-input @blur="toAbs($event,`cycleMeeting.mounth['1'].days`)"
                                                              min="1" max="31" v-model="cycleMeeting.mounth['1'].days"
                                                              size="small" class="f-w-5em" type="number"></el-input>
                                                    <span
                                                        class="f-pdl-1em">{{$t('reservation.modal.setMeetingCycle.cycleMode.day')}}</span>
                                                </template>
                                            </el-radio>
                                            <el-radio v-if="language==='en-US'" class="radio" v-model="cycleMeeting.mounth.range" label="1">
                                                <template>
                                                    <span class="f-pdr-1em f-w-2em f-d-inline-block">
                                                        Day
                                                    </span>
                                                    <el-input @blur="toAbs($event,`cycleMeeting.mounth['1'].days`)"
                                                              min="1" max="31" v-model="cycleMeeting.mounth['1'].days"
                                                              size="small" class="f-w-5em" type="number"></el-input>
                                                    <span class="f-w-4em f-d-inline-block f-pd-both-1em">
                                                       of every
                                                    </span>
                                                    <el-input @blur="toAbs($event,`cycleMeeting.mounth['1'].mounth`)"
                                                              min="1" v-model="cycleMeeting.mounth['1'].mounth"
                                                              size="small" class="f-w-5em" type="number"></el-input>
                                                    <span class="f-pdl-1em">
                                                        month(s)
                                                    </span>
                                                </template>
                                            </el-radio>
                                        </el-row>
                                        <el-row class="f-line-middle-radio2">
                                            <el-radio v-if="language==='zh-CN'" class="radio" v-model="cycleMeeting.mounth.range" label="2">
                                                <template>
                                                    <span
                                                        class="f-d-inline-block f-w-2em f-pdr-1em">{{$t('reservation.modal.setMeetingCycle.cycleMode.every')}}</span>
                                                    <el-input @blur="toAbs($event,`cycleMeeting.mounth['2'].mounth`)"
                                                              min="1" v-model="cycleMeeting.mounth['2'].mounth"
                                                              size="small" class="f-w-5em" type="number"></el-input>
                                                    <span
                                                        class="f-d-inline-block f-w-4em f-pd-both-1em">{{$t('reservation.modal.setMeetingCycle.cycleMode.MounthNO')}}</span>
                                                    <el-select size="small" :popper-class="'u-cycle-select-option'"
                                                               class="f-w-8em" placeholder=""
                                                               v-model="cycleMeeting.mounth['2'].numValue">
                                                        <el-option
                                                            v-for="item in dayNumsList"
                                                            :key="item.value"
                                                            :label="item.label"
                                                            :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                    <el-select size="small" :popper-class="'u-cycle-select-option'"
                                                               class="f-w-8em" placeholder=""
                                                               v-model="cycleMeeting.mounth['2'].daysValue">
                                                        <el-option
                                                            v-for="item in daysList"
                                                            :key="item.value"
                                                            :label="item.label"
                                                            :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                </template>
                                            </el-radio>
                                            <el-radio v-if="language==='en-US'" class="radio" v-model="cycleMeeting.mounth.range" label="2">
                                                <template>
                                                    <span class="f-d-inline-block f-w-2em f-pdr-1em">
                                                        The
                                                    </span>
                                                    <el-select size="small" :popper-class="'u-cycle-select-option'"
                                                               class="f-w-8em" placeholder=""
                                                               v-model="cycleMeeting.mounth['2'].numValue">
                                                        <el-option
                                                            v-for="item in dayNumsList"
                                                            :key="item.value"
                                                            :label="item.label"
                                                            :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                    <el-select size="small" :popper-class="'u-cycle-select-option'"
                                                               class="f-w-8em" placeholder=""
                                                               v-model="cycleMeeting.mounth['2'].daysValue">
                                                        <el-option
                                                            v-for="item in daysList"
                                                            :key="item.value"
                                                            :label="item.label"
                                                            :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                    
                                                    <span class="f-d-inline-block f-w-4em f-pd-both-1em">
                                                       of every
                                                    </span>
                                                    <el-input @blur="toAbs($event,`cycleMeeting.mounth['2'].mounth`)"
                                                              min="1" v-model="cycleMeeting.mounth['2'].mounth"
                                                              size="small" class="f-w-5em" type="number">
                                                    </el-input>
                                                    <span class="f-d-inline-block f-w-4em f-pd-both-1em">
                                                       month(s)
                                                    </span>
                                                </template>
                                            </el-radio>
                                        </el-row>
                                    </el-col>
                                    <el-col :span="24" v-show="cycleMeeting.range==='year'" style="padding-top: 1em;">
                                        <el-row class="">
                                            {{$t('reservation.modal.setMeetingCycle.cycleMode.repeatRange')}}
                                            <el-input min="1" @blur="toAbs($event,'cycleMeeting.year.yearsNum')"
                                                      disabled size="small" class="f-w-8em" type="number"
                                                      v-model="cycleMeeting.year.yearsNum"></el-input>
                                            {{$t('reservation.modal.setMeetingCycle.cycleMode.afterYears')}}
                                        </el-row>
                                        <el-row class="">
                                            <el-radio v-if="language==='zh-CN'" class="radio" v-model="cycleMeeting.year.range" label="1"
                                                      style="padding-top: 1em;">
                                                <template>
                                                    <span class="f-pdr-1em f-w-2em f-d-inline-block">{{$t('reservation.modal.setMeetingCycle.date.times')}}</span>
                                                    <el-select @change="correctMounthNum" size="small" class="f-w-8em"
                                                               placeholder="" v-model="cycleMeeting.year['1'].mounth">
                                                        <el-option
                                                            v-for="item in mounthList"
                                                            :key="item.value"
                                                            :label="item.label"
                                                            :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                    <span
                                                        class="f-w-4em f-d-inline-block f-pd-both-1em">{{$t('reservation.modal.setMeetingCycle.cycleMode.NO')}}</span>
                                                    <el-input min="1" :max="maxMounthDay"
                                                              @blur="toAbs($event,`cycleMeeting.year['1'].dayNum`)"
                                                              size="small" type="number" class="f-w-8em" placeholder=""
                                                              v-model="cycleMeeting.year['1'].dayNum"></el-input>
                                                    <span
                                                        class="f-pdl-1em">{{$t('reservation.modal.setMeetingCycle.cycleMode.day')}}</span>
                                                </template>
                                            </el-radio>
                                            <el-radio v-if="language==='en-US'" class="radio" v-model="cycleMeeting.year.range" label="1"
                                                      style="padding-top: 1em;">
                                                <template>
                                                    <span class="f-pdr-1em f-d-inline-block" style="width:3.5em">
                                                       On:
                                                    </span>
                                                    <el-select @change="correctMounthNum" size="small" class="f-w-8em"
                                                               placeholder="" v-model="cycleMeeting.year['1'].mounth">
                                                        <el-option
                                                            v-for="item in mounthList"
                                                            :key="item.value"
                                                            :label="item.label"
                                                            :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                    <el-input min="1" :max="maxMounthDay"
                                                          @blur="toAbs($event,`cycleMeeting.year['1'].dayNum`)"
                                                          size="small" type="number" class="f-w-8em" placeholder=""
                                                          v-model="cycleMeeting.year['1'].dayNum"></el-input>
                                                </template>
                                            </el-radio>
                                        </el-row>
                                        <el-row class="">
                                            <el-radio  v-if="language==='zh-CN'"  class="radio" v-model="cycleMeeting.year.range" label="2"
                                                      style="padding-top:1em;">
                                                <template>
                                                    <span
                                                        class="f-pdr-1em f-w-2em f-d-inline-block">{{$t('reservation.modal.setMeetingCycle.date.times')}}</span>
                                                    <el-select size="small" class="f-w-8em" placeholder=""
                                                               v-model="cycleMeeting.year['2'].mounth">
                                                        <el-option
                                                            v-for="item in mounthList"
                                                            :key="item.value"
                                                            :label="item.label"
                                                            :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                    <span
                                                        class="f-w-4em f-d-inline-block f-pd-both-1em">{{$t('reservation.modal.setMeetingCycle.cycleMode.The')}}</span>
                                                    <el-select size="small" class="f-w-8em" placeholder=""
                                                               v-model="cycleMeeting.year['2'].numValue">
                                                        <el-option
                                                            v-for="item in dayNumsList"
                                                            :key="item.value"
                                                            :label="item.label"
                                                            :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                    <el-select size="small" class="f-w-8em" placeholder=""
                                                               v-model="cycleMeeting.year['2'].daysValue">
                                                        <el-option
                                                            v-for="item in daysList"
                                                            :key="item.value"
                                                            :label="item.label"
                                                            :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                </template>
                                            </el-radio>
                                            <el-radio  v-if="language==='en-US'"  class="radio" v-model="cycleMeeting.year.range" label="2" style="padding-top:1em;">
                                                <template>
                                                    <span class="f-pdr-1em f-w-3em f-d-inline-block">
                                                        On the:
                                                    </span>
                                                    <el-select size="small" class="f-w-8em" placeholder=""
                                                               v-model="cycleMeeting.year['2'].mounth">
                                                        <el-option
                                                            v-for="item in mounthList"
                                                            :key="item.value"
                                                            :label="item.label"
                                                            :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                    <span class="f-w-1em f-d-inline-block f-pd-both-1em">
                                                        of
                                                    </span>
                                                    <el-select size="small" class="f-w-8em" placeholder=""
                                                               v-model="cycleMeeting.year['2'].numValue">
                                                        <el-option
                                                            v-for="item in dayNumsList"
                                                            :key="item.value"
                                                            :label="item.label"
                                                            :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                    <el-select size="small" class="f-w-8em" placeholder=""
                                                               v-model="cycleMeeting.year['2'].daysValue">
                                                        <el-option
                                                            v-for="item in daysList"
                                                            :key="item.value"
                                                            :label="item.label"
                                                            :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                </template>
                                            </el-radio>
                                        </el-row>
                                    </el-col>
                                </el-col>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class="f-pdb-4px">
                                {{$t('reservation.modal.setMeetingCycle.repeatRange.title')}}
                            </el-col>
                            <el-col :span="24" class="m-date-range-content">
                                <el-col :span="6">
                                    <el-form label-width="70px" :label-position="'right'" class="f-pdt-halfem">
                                        <el-form-item :label="$t('reservation.modal.setMeetingCycle.date.start')">
                                            <el-date-picker
                                                :editable="false"
                                                :clearable="false"
                                                style="width: 150px"
                                                v-model="repeatRange.startDate"
                                                type="date"
                                                :placeholder="$t('reservation.placeholder.chooseDate')">
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-form>
                                </el-col>
                                <el-col :span="18" class="m-date-range-option">
                                    <el-row class="f-line-middle-radio2">
                                        <el-radio class="radio" v-model="repeatRange.range" label="1">
                                            <span style="display: inline-block" class="f-d-inline-block f-pdr-1em">
                                                 {{$t('reservation.modal.setMeetingCycle.repeatRange.withoutEndDate')}}
                                            </span>
                                           
                                        </el-radio>
                                    </el-row>
                                    <el-row class="f-line-middle-radio2">
                                        <el-radio class="radio" v-model="repeatRange.range" label="2">
                                            <span style="display: inline-block" class="f-w-4em f-d-inline-block f-pdr-1em">{{$t('reservation.modal.setMeetingCycle.repeatRange.repeat')}}</span>
                                            <el-input min="1" @blur="toAbs($event,`repeatRange['2'].repeatNum`)"
                                                      size="small" class="f-w-5em" type="number"
                                                      v-model="repeatRange['2'].repeatNum"></el-input>
                                            <span
                                                class="f-pd-both-halfem f-d-inline-block">{{$t('reservation.modal.setMeetingCycle.repeatRange.timeAfterEnd')}}</span>
                                        </el-radio>
                                    </el-row>
                                    <el-row class="f-line-middle-radio2">
                                        <el-radio class="radio" v-model="repeatRange.range" label="3">
                                            <span style="display: inline-block" class="f-w-4em f-pdr-1em f-d-inline-block">{{$t('reservation.modal.setMeetingCycle.repeatRange.endDate')}}</span>
                                            <el-date-picker
                                                :editable="false"
                                                :clearable="false"
                                                size="small"
                                                v-model="repeatRange['3'].endDate"
                                                type="date"
                                                :popper-class="'u-cycle-select-option'"
                                            >
                                            </el-date-picker>
                                        </el-radio>
                                    </el-row>
                                </el-col>
                            
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <div slot="footer" class="dialog-footer f-tac">
                    <el-button class="u-btn-confirm" size="large" type="primary" @click="confirmCycle()">
                        {{$t('reservation.btn.confirm')}}
                    </el-button>
                    <el-button class="u-btn-back" size="large" @click="quitCycle('setCycleShow')">
                        {{$t('reservation.btn.cancel')}}
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog :title="$t('reservation.modal.vmrResource.title')" v-if="businessModel!=='cloudPort'"
                       :visible.sync="videoResourceShow" size="large" :before-close="closeModal()">
                <el-row>
                    <el-col :span="24">
                        <el-row>
                            <transition name="fade">
                                <el-col :span="24">
                                    <meeting-table v-if="videoResourceShowTable"
                                                   ref="vmrResource"
                                                   :mode="'popups'"
                                                   :vmr-utc-offset="vmrUtcOffset"
                                                   :vmr-timezone="vmrTimezone">
                                    </meeting-table>
                                </el-col>
                            </transition>
                            <transition name="fade">
                                <el-col :span="24"
                                        v-if="videoResourceShow&&businessModel==='vmr'&&mode==='video'&&resourceList.length>0"
                                        class="f-pdt-room">
                                    <el-form :label-width="language==='zh-CN'?'120px':'150px'" :label-position="'left'">
                                        <el-form-item :label="$t('reservation.modal.vmrResource.resourceType')"
                                                      class="f-fl">
                                            <el-select placeholder="" v-model="checkedResource">
                                                <el-option
                                                    v-for="item in resourceList"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item :label="$t('reservation.modal.vmrResource.meetingCapacity')"
                                                      class="f-fl f-pdl-4em" v-if="checkedResource==='public'">
                                            <el-select @change="changePublic" placeholder="" v-model="checkedPublic">
                                                <el-option
                                                    v-for="item in publicResource"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-form>
                                </el-col>
                            </transition>
                            <transition name="fade" v-if="resourceList.length>0">
                                <el-col :span="24" style="color: rgba(70, 70, 70, 0.8)" v-if="videoResourceShow&&businessModel==='vmr'&&mode==='video'">
                                    <span v-if="checkedResource==='private'">{{$t('reservation.modal.setVmrResource.privateIntroduce')}}</span>
                                    <span v-if="checkedResource==='public'">{{$t('reservation.modal.setVmrResource.publicIntroduce')}}</span>
                                </el-col>
                            </transition>
                        
                        </el-row>
                    </el-col>
                </el-row>
                <div slot="footer" class="dialog-footer f-tac">
                    <el-button class="u-btn-confirm" size="large" type="primary"
                               @click="closeModal('videoResourceShow')">{{$t('reservation.btn.confirm')}}
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog :title="$t('reservation.prompt')" :visible.sync="takeupTip" size="tiny" @close="closeTakeupTip">
                <el-row>
                    <span>{{tipMsg}}</span>
                </el-row>
                <el-row class="f-pdt-1em">
                    <el-col :span="24">
                        <transition-group name="fade" tag="div">
                            <el-col :span="12" class="u-person-item" v-for="item in takeupNodes" :key="item.id">
                                <div class="f-line-middle person-content-finish">
                                    <div v-if="item.type=='external'"
                                         class="f-fl icon u-icon-person iconfont icon-wenhao-mid"></div>
                                    <div v-else-if="item.sign===1||item.type===3" style="color: #fca40c"
                                         class="f-fl icon u-icon-person iconfont icon-compere"></div>
                                    <div v-else-if="item.sign===0"
                                         class="f-fl icon u-icon-person iconfont icon-visitors"></div>
                                    <div class="f-fl person-content-finish-name" :title="item.name">
                                        {{item.name}}
                                    </div>
                                </div>
                            </el-col>
                        </transition-group>
                    
                    </el-col>
                </el-row>
                
                <span slot="footer" class="dialog-footer">
                    <el-button @click="closeTakeupTip()">{{$t('reservation.btn.cancel')}}</el-button>
                    <el-button type="primary" @click="changeNodesType">{{$t('reservation.btn.confirm')}}</el-button>
                </span>
            </el-dialog>
            <el-dialog custom-class="u-dialog-tip" :title="$t('reservation.modal.setVmrResource.title')" :visible.sync="cloudPortShow" size="tiny">
                <el-row class="f-pdt-1em">
                    <el-col :span="24" class="f-tac">
                        <el-form>
                            <el-form-item :label="$t('reservation.modal.vmrResource.resourceType')" >
                                <el-select @change="changeResource" placeholder="" v-model="checkedResource">
                                    <el-option
                                        v-for="item in resourceList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    
                    <el-col :span="24">
                        <span v-if="checkedResource==='private'">{{$t('reservation.modal.setVmrResource.privateIntroduce')}}</span>
                        <span v-if="checkedResource==='public'">{{$t('reservation.modal.setVmrResource.publicIntroduce')}}</span>
                    </el-col>
                </el-row>
                
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="closeModal('cloudPortShow')">{{$t('reservation.btn.close')}}</el-button>
                </span>
            </el-dialog>
        </el-row>
    </div>

</template>
<style scoped lang="scss">
    .video {
        .u-radio {
            padding-right: 106px;
        }
        .u-title {
            color: red
        }
        .f-d-inline-block {
            display: inline-block;
        }
        .f-label-size {
            font-size: 14px;
        }
        .f-label-size-en {
            font-size: 13px;
        }
        .u-icon-person {
            color: #26c7ec;
            font-size: 21px;
        }
        .u-btn-w {
            width: 8em;
        }
        .f-w-100 {
            width: 100%;
        }
        .f-w-2em {
            width: 2em;
        }
        .f-w-4em {
            width: 4em;
        }
        .f-w-5em {
            width: 5em;
        }
        .f-w-6em {
            width: 6em;
        }
        .f-w-8em {
            width: 8em;
        }
        .f-pdt-4px {
            padding-top: 4px;
        }
        .f-pd-1em {
            padding: 1em;
        }
        .f-pd-2em {
            padding: 2em;
        }
        .f-pdl-1em {
            padding-left: 1em;
        }
        .f-pdl-2em {
            padding-left: 2em;
        }
        .f-pdl-4em {
            padding-left: 4em;
        }
        .f-pdb-1em {
            padding-bottom: 1em
        }
        .f-pd-both-1em {
            padding: 0 1em;
        }
        .f-pd-both-halfem {
            padding: 0 0.5em;
        }
        .f-pdt-1em {
            padding-top: 1em;
        }
        .f-pdb-2em {
            padding-bottom: 2em
        }
        .f-pdr-1em {
            padding-right: 1em;
        }
        .f-pdb-22px {
            padding-bottom: 22px;
        }
        
        .f-pdb-10px {
            padding-bottom: 10px;
        }
        .f-pdb-4px {
            padding-bottom: 4px;
        }
        .f-pdt-room {
            padding-top: 1em;
        }
        .f-pdt-halfem {
            padding-top: 0.5em;
        }
        .f-mgb-half3em {
            margin-bottom: 1.5em;
        }
        .f-pos-rel {
            position: relative;
        }
        .f-pos-abs {
            position: absolute;
        }
        .f-right-0 {
            right: 0;
        }
        .u-mouse-pointer {
            cursor: pointer;
        }
        .f-margin-0 {
            margin: 0;
        }
        .f-mg-both-2em {
            margin: 0 2em;
        }
        .f-line-middle {
            height: 33px;
            line-height: 33px;
        }
        .f-line-middle-radio {
            line-height: 33px;
            height: 33px;
        }
        .f-line-middle-radio2 {
            line-height: 48px;
            height: 42px;
        }
        
        .u-line-dialog {
            height: 30px;
            line-height: 30px;
        }
        .u-line-area {
            min-height: 30px;
            line-height:30px;
        }
        .f-fw-bold {
            font-weight: bold;
        }
        .f-mw-50px {
            min-width: 50px;
        }
        .f-mw-85px {
            min-width: 85px;
        }
        .f-tar {
            text-align: right;
        }
        .f-tac {
            text-align: center;
        }
        .f-tal {
            text-align: left;
        }
        .f-mg-0 {
            margin: 0;
        }
        .f-mgl-0 {
            margin-left: 0;
        }
        .f-mgr-10px {
            margin-right: 10px;
        }
        .f-pr-0 {
            padding-right: 0;
        }
        .f-pdb-0 {
            padding-bottom: 0;
        }
        .f-pdt-0 {
            padding-top: 0;
        }
        .person-content {
            width: 100%;
            border: 1px solid #bfd0d9;
            border-radius: 4px;
            text-indent: 10px;
            font-size: 14px;
            color: #5e6d82;
        }
        .person-content-finish {
            width: 100%;
            border: 1px solid #bfd0d9;
            border-radius: 4px;
            text-indent: 1em;
            font-size: 14px;
            color: #5e6d82;
            
        }
        .person-content-finish-name {
            line-height: 34px;
            text-indent: 6px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: calc(90% - 20px);
        }
        .text-over-hide {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .person-inf {
            color: #464646;
            font-size: 14px;
        }
        .person-name {
            text-indent: 0.5em;
            width: 70%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .person-content:hover {
            border: 1px solid rgb(46, 175, 240);
            color: rgb(46, 175, 240);
        }
        
        .person-content:hover .icon-delete {
            display: block;
        }
        .icon-delete {
            color: #909090;
            padding-right: 5px;
            font-size: 20px;
            display: none;
        }
        .edit-content {
            min-height: 200px;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 0 20px;
            overflow-x: scroll;
        }
        .icon-delete:hover {
            color: #FA4D4D !important;
        }
        .icon-delete :active {
            color: #ef1010 !important;
        }
        .icon-person-content {
            font-size: 21px;
            padding-right: 5px;
        }
        .icon-yellow {
            color: #fca40c;
        }
        .m-mail-min-width {
            min-width: 85px;
        }
        .u-btn-confirm {
            padding: 0.8em 0;
            min-width: 8em;
            margin-right: 2em;
        }
        .u-btn-back {
            padding: 0.8em 0;
            min-width: 8em;
            margin-left: 2em;
        }
        .m-cards {
            border: 1px solid #d1dae5;
            border-radius: 4px;
            background-color: #fff;
            padding: 20px;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
        }
        .m-date-content {
            border: 1px solid #ccc;
            padding: 10px 1em;
        }
        .m-date-radio-content {
            border-right: 1px solid #ccc;
            padding: 5px 2em;
        }
        .m-date-range-content {
            border: 1px solid #ccc;
            padding: 1em
        }
        .m-date-range-option {
            padding-left: 6em;
            padding-top: 2px;
            padding-bottom: 7px;
        }
        .m-date-time {
            border: 1px solid #ccc;
            padding: 1.6em 0 0 3em
        }
        .u-person-item {
            padding: 2px 6px 2px 0;
        }
    }

</style>
<style>
    .video .yl-tree .tree-down {
        height: calc(100% - 70px) !important;
    }

</style>
<script>
    import meetingTable from "@/components/meeting"
    import editor from "@/components/editor"
    import transfer from "@/components/transfer/src/"
    import timezone from "@/components/meeting/timezone"
    import F from "@/components/meeting/tools"
    import selectDate from "@/components/meeting/selectDate"
    import edit from "@/components/meeting/edit"
    import {
        reqPersonList,
        reqReservationMeeting,
        reqhasViewer,
        reqPublicResource,
        checkVmrConflict,
        reqMeetingDetail,
        reqMeetingPlanDetail,
        reqEditPlanMeeting,
        reqEditOnceMeeting,
        reqBussinessMode,
    } from "@/api/reservation/"

    import {language} from '@/i18n'
    
    const getStamp = (date, timePoint, utcOffset) => new Date(date.replace(/\//g, "-") + "T" + timePoint + timezone.getTimezoneNum(utcOffset)).valueOf();
    
    export default {
        components: {
            meetingTable,
            editor,
            transfer,
        },
        data() {
            let check = (rule, value, callback, message) => {
                if (typeof value === "undefined" || value === "" || value === null) {
                    callback(new Error(message))
                } else {
                    callback();
                }
            };
            
            let setCheck = (message) => {
                return {
                    validator: (rule, value, callback) => {
                        check(rule, value, callback, message)
                    }, trigger: 'change'
                }
            };
            
            return {
                //富文本编辑器参数
                content: '',
                result: '',
                path: '',
                //输入框验证
                rules: {
                    theme: [
                        setCheck(this.$t('reservation.rules.subject'))
                    ],
                },
                selectedMember: [],
                mailPreviewShow: false,
                addMemberShow: false,
                setCycleShow: false,
                videoResourceShow: false,
                dayNumsList: selectDate.dayNumsList,
                daysList: selectDate.daysList,
                weekList: selectDate.weekList,
                weekMap: selectDate.weekMap,
                mounthList: selectDate.mounthList,
                range: 'mounth',
                value: '',
                meetingMode: "default",
                meetingPersonList: [],
                meetingAudience: [],
                activePersonList: null,
                meetingThemeForm: {
                    theme: ""
                },
                videoResourceShowTable: false,
                memberList: [],
                takeupNodes: [],
                takeupTip: false,
                hasViewer: false,
                previewChooseTime: "",
                previewRecipients: [],
                selectedProjectList: [],
                businessModel: "",
                checkedResource: "private",//"public"
                publicResource: [],
                checkedPublic: null,
                cloudPortShow: false,
                cycleShow: false,
                meetingTime: {
                    startDate: "",
                    startTime: "",
                    startTimestamp: "",
                    endTime: "",
                    endDate: "",
                    endTimestamp: "",
                },
                duration: "",
                cycleMeeting: {
                    range: 'day',
                    day: {
                        range: 'userDefine',
                        userDefine: 1,
                    },
                    week: {
                        interval: 1,
                        dayList: []
                    },
                    mounth: {
                        range: "1",
                        "1": {
                            mounth: 1,
                            days: 1,
                        },
                        "2": {
                            mounth: 1,
                            numValue: 1,
                            daysValue: "Day",
                        }
                    },
                    year: {
                        range: "1",
                        yearsNum: 1,
                        "1": {
                            mounth: 0,
                            dayNum: 1
                        },
                        "2": {
                            mounth: 0,
                            numValue: 1,
                            daysValue: "Day",
                        }
                    }
                },
                repeatRange: {
                    startDate: '',
                    range: "1",
                    "2": {
                        repeatNum: 1,
                    },
                    "3": {
                        endDate: ""
                    }
                },
                cycleSave: {
                    meetingTime: {},
                    cycleMeeting: {},
                    repeatRange: {},
                },
                activePicker: "",
                editInf: {
                    planId: "",
                    recordId: "",
                    type: ""
                },
            }
        },
        watch: {
            mailPreviewShow (val) {
                if (!val) return;
                this.setPreviewChooseTime();
                this.setSelecedProject();
                
            }
        },
        computed: {
        	language () {
        
                const lang = language();
                if(typeof language === 'function'){
                    this.$store.commit("setLanguage",lang)
                }
                return lang;
        		
            },
            bussinessMode () {
                return this.$store.state.reservation.bussinessMode;
            },
            resourceList () {
                
                let resource = [];
                if(this.bussinessMode.businessMode==="cloudPort"){
                    resource = [
                        {label: this.$t('reservation.modal.vmrResource.publicCloud'), value: "public"},
                        {label: this.$t('reservation.modal.vmrResource.privateCloud'), value: "private"}
                    ]
                }else {
                    if (this.bussinessMode.hasCloudVmr) {
                        resource.push({label: this.$t('reservation.modal.vmrResource.publicCloud'), value: "public"})
                    }
                    if (this.bussinessMode.hasTerminalVmr) {
                        resource.push({label: this.$t('reservation.modal.vmrResource.privateCloud'), value: "private"})
                    }
                }
              
                
                return resource
            },
            organizer () {
                return this.$store.state.reservation.organizer;
            },
            utcOffset () {
                return this.$store.state.reservation.utcOffset;
            },
            userName () {
                return JSON.parse(sessionStorage.user).personal.name;
            },
            isEdit () {
                let query = this.$route.query;
                let isEdit = !(typeof query.type === "undefined" || query.type === null || query.type === "");
                this.$store.commit("setEditMode", isEdit);
                return isEdit
            },
            maxMounthDay () {
                let year = new Date(this.repeatRange.startDate).getFullYear();
                let mounth = this.cycleMeeting.year['1'].mounth + 1;
                //  console.log(year,mounth,new Date(year,mounth,0).getDate())
                return new Date(year, mounth, 0).getDate();
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
                return timezone.format("yyyy-mm-dd")(this.repeatRange.startDate);
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
            vmrTimezone (){
                return this.$refs.reservationMeeting.timeZone;
            },
            vmrUtcOffset () {
                return this.$refs.reservationMeeting.utcOffset;
            },
            mode () {
                //根据url判断预约视频会议还是预约会议室页面。
                return this.$route.path === "/meeting/index/reservation" ? "video" : "room"
            },
            tipMsg () {
                return this.activePersonList === "meetingPersonList"
                    ? this.$t('reservation.message.changeVistorType')
                    : this.$t('reservation.message.changeMeetingPersonType');
            },
            getRecurrencePattern () {
                if (this.cycleShow === false && this.setCycleShow === false) return null;
                
                let rangeMap = {
                    "1": {
                        recurrenceRange: "1",
                        hasNoEndDate: true,
                        rangeStartDate: timezone.format("yyyy-mm-dd")(this.repeatRange.startDate),
                    },
                    "2": {
                        recurrenceRange: "2",
                        rangeStartDate: timezone.format("yyyy-mm-dd")(this.repeatRange.startDate),
                        hasNoEndDate: false,
                        occurrences: this.repeatRange["2"].repeatNum
                    },
                    "3": {
                        recurrenceRange: "3",
                        rangeEndDate: timezone.format("yyyy-mm-dd")(this.repeatRange["3"].endDate),
                        hasNoEndDate: false,
                        rangeStartDate: timezone.format("yyyy-mm-dd")(this.repeatRange.startDate),
                    }
                };
                
                let patternMap = {
                    day: {
                        pattern: {
                            recurrenceType: "RECURS_DAILY",
                            dailyType: this.cycleMeeting.day.range === "userDefine" ? 1 : 2,
                            interval: this.cycleMeeting.day.range === "userDefine" ? this.cycleMeeting.day.userDefine : null,
                        },
                        range: rangeMap[this.repeatRange.range]
                    },
                    week: {
                        pattern: {
                            recurrenceType: "RECURS_WEEKLY",
                            interval: this.cycleMeeting.week.interval,
                            daysOfWeeks: this.cycleMeeting.week.dayList.map(item => {
                                return this.weekMap[item];
                            })
                        },
                        range: rangeMap[this.repeatRange.range]
                    },
                    mounth: {
                        pattern: this.cycleMeeting.mounth.range === "1"
                            ? {
                                recurrenceType: "RECURS_MONTHLY",
                                interval: this.cycleMeeting.mounth["1"].mounth,
                                dayOfMonth: this.cycleMeeting.mounth["1"].days,
                            } : {
                                recurrenceType: "RECURS_MONTH_NTH",
                                interval: this.cycleMeeting.mounth["2"].mounth,
                                dayOfWeek: this.cycleMeeting.mounth["2"].daysValue,  //星期
                                dayOfWeekIndex: this.cycleMeeting.mounth["2"].numValue,
                            },
                        range: rangeMap[this.repeatRange.range]
                    },
                    year: {
                        pattern: this.cycleMeeting.year.range === "1"
                            ? {
                                interval: this.cycleMeeting.year.yearsNum,
                                recurrenceType: "RECURS_YEARLY",
                                dayOfMonth: this.cycleMeeting.year["1"].dayNum,
                                monthOfYear: this.cycleMeeting.year["1"].mounth,
                            } : {
                                interval: this.cycleMeeting.year.yearsNum,
                                recurrenceType: "RECURS_YEAR_NTH",
                                dayOfWeekIndex: this.cycleMeeting.year["2"].numValue,
                                dayOfWeek: this.cycleMeeting.year["2"].daysValue,
                                monthOfYear: this.cycleMeeting.year["2"].mounth,
                                
                            },
                        range: rangeMap[this.repeatRange.range]
                    },
                };
                return patternMap[this.cycleMeeting.range]
            },
            
        },
        methods: {
            changeResource () {
                if (this.checkedResource === 'private' && this.meetingMode === "demonstrator") {
                    
                    this.$message(this.$t('reservation.meetingMode.chairmanTip'));
                    this.checkedResource = 'public';
                }
                
            },
            toAbs (e, str){
                let val = Math.abs(e.currentTarget.value);
                val = val === 0 ? 1 : val;
                if (str === `cycleMeeting.mounth['1'].days`) {
                    val = val > 31 ? 31 : val;
                }
                if (str === `cycleMeeting.year['1'].dayNum`) {
                    val = val > this.maxMounthDay ? this.maxMounthDay : val;
                }
                this.setInputValue(str, val);
            },
            correctMounthNum () {
                if (this.cycleMeeting.year['1'].dayNum > this.maxMounthDay) {
                    this.cycleMeeting.year['1'].dayNum = this.maxMounthDay;
                }
            },
            setInputValue (str, val) {
                return eval(`this.${str}=${val}`);
            },
            setDefaultSubject (name) {
                this.meetingThemeForm.theme = name + (this.$route.path === "/meeting/index/reservation"
                        ? this.$t('reservation.placeholder.vmrSubject')
                        : this.$t('reservation.placeholder.roomSubject'));
                return this;
            },
            setSelecedProject () {
                let agency = this.$refs.reservationMeeting.selectedProjectObjAll;
                let selectedIds = this.$refs.reservationMeeting.selectedProject;
                let selected;
                if (agency.length === 0) {
                    let project = this.$refs.reservationMeeting.projectList;
                    selected = project.filter(item => selectedIds.indexOf(item.id) > -1);
                } else {
                    selected = agency.filter(item => selectedIds.indexOf(item.id) > -1);
                }
                this.selectedProjectList = selected;
                
            },
            setPreviewChooseTime () {
                let chooseDate = this.$refs.reservationMeeting.chooseDate;
                this.previewChooseTime = chooseDate.startDate + " " + chooseDate.startTime + " - " + chooseDate.endDate + " " + chooseDate.endTime
                this.previewRecipients = [
                    ...this.meetingAudience.map(item => {
                        return {
                            name: item.name,
                            id: item.id,
                            type: item.type,
                            role: "castviewer",
                        }
                    }),
                    ...this.meetingPersonList.map(item => {
                        return {
                            name: item.name,
                            id: item.id,
                            type: item.type,
                            role: item.sign === 1 ? "presenter" : "attendee"
                        }
                    })
                ]
                
            },
            unique (arr) {
                return Array.from(new Set(arr)).sort()
            },
            closeCycleModal () {
                this.$store.commit("setCycleModal", false);
            },
            quitCycle () {
                this.meetingTime = F.extend(this.cycleSave.meetingTime);
                this.cycleMeeting = F.extend(this.cycleSave.cycleMeeting);
                this.repeatRange = F.extend(this.cycleSave.repeatRange);
    
                this.closeModal("setCycleShow");
            },
            closeModal (name) {
                this[name] = false;
                if (name === "videoResourceShow") {
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.videoResourceShowTable = false;
                        }, 500);
                    })
                }
               
            },
            resetMemberList (data) {
                
                let userId = JSON.parse(sessionStorage.user).personal.staffId;
                this.memberList = data.map(item => {
                    item = F.extend(item);
                    item.checked = false;
                    item.chkDisabled = false;
                    if (this.isEdit) {
                        if (item.id === this.organizer.id) { // 编辑模式 载入组织者id
                            item.checked = true;
                            item.chkDisabled = true;
                        }
                    } else {
                        if (item.id === userId) { //预约模式载入 用户id
                            item.checked = true;
                            item.chkDisabled = true;
                        }
                    }
                    return item
                });
            },
            setTransferMode (type) {
                let Map = {
                    meetingAudience: "audience",
                    meetingPersonList: "attendance",
                };
                this.$store.commit("setTransferMode", Map[type]);
            },
            setCheckedMember (data, type) {
                let checkedList = this[type]
                    .filter(item=>item.type!=="external")
                    .map(item => item.id);
//                this.memberList = data.map(item => {
//                    item = F.extend(item);
//                    if(checkedList.indexOf(item.id)>-1){
//                    	item.checked = true;
//                    }
//                    return item
//                });
    
    
                this.$nextTick(()=>{
                    this.$refs.memberTransfer.addOuterPerson(
                        this[type].filter(item=>item.type==="external")
                            .map(item=>{return {name:item.name}})
                    )
                });
              
               
                this.selectedMember = checkedList;
                // this.$refs.memberTransfer.
            },
            openAddModal (name, type) {
                this.selectedMember = [];
                this.resetMemberList(this.memberList);
                this.setCheckedMember(this.memberList, type);
                this.setTransferMode(type);
                this.openModal(name, type);
            },
            openMailPrew () {
                this.result = this.$refs.editor.getVal();
            	this.openModal('mailPreviewShow')
            },
            openModal (name, type) {
                
                this[name] = true;
                if (type) {
                    this.activePersonList = type;
                }
                if (name === "videoResourceShow") {
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.videoResourceShowTable = true;
                        }, 200);
                    })
                }
                if (name === "setCycleShow") {
                    this.$store.commit("setCycleModal", true);
                }
            },
            correctCycleTime (e, type) {
                this.correctTime(e, type);
                this.setDuration(e, type);
            },
            correctTime (e, type){
                let {startDate, endDate, startTime, endTime,} = this.getDuration(e, type);
                let startStamp = getStamp(startDate, startTime, this.utcOffset);
                let endStamp = getStamp(endDate, endTime, this.utcOffset);
                this.meetingTime.startTimestamp = startStamp;
                this.meetingTime.endTimestamp = endStamp;
                
                const correctTimestamp = () => {
                    this.meetingTime.startTimestamp = getStamp(this.meetingTime.startDate, this.meetingTime.startTime, this.utcOffset);
                    this.meetingTime.endTimestamp = getStamp(this.meetingTime.endDate, this.meetingTime.endTime, this.utcOffset);
                };
                
                if (endStamp - startStamp > 0) return;
                
                let correctMap = {
                    startDate: () => {
                        if (this.activePicker !== "startDate") return;
                        if (startTime === "23:30") {
                            this.meetingTime.endDate = timezone.format("yyyy/mm/dd")(new Date(startDate).valueOf() + 24 * 60 * 60 * 1000);
                        } else {
                            this.meetingTime.endDate = startDate;
                        }
                        this.meetingTime.endTime = timezone.getTime(timezone.getTimestamp(startDate, startTime) + 30 * 60 * 1000);
                        correctTimestamp()
                        
                    },
                    startTime: () => {
                        if (this.activePicker !== "startTime") return;
                        
                        if ((new Date(endDate).valueOf() - new Date(startDate).valueOf()) <= 0) {
                            if (startTime === "23:30") {
                                this.meetingTime.endDate = timezone.format("yyyy/mm/dd")(new Date(startDate).valueOf() + 24 * 60 * 60 * 1000);
                            } else {
                                this.meetingTime.endDate = startDate;
                            }
                            
                            this.meetingTime.endTime = timezone.getTime(timezone.getTimestamp(startDate, startTime) + 30 * 60 * 1000)
                        } else {
                            this.meetingTime.endTime = timezone.getTime(timezone.getTimestamp(startDate, startTime) + 30 * 60 * 1000)
                        }
                        correctTimestamp();
                        //  console.log(this.meetingTime.startDate,this.meetingTime.startTime,this.meetingTime.startTimestamp,this.utcOffset)
                    },
                    endDate: () => {
                        if (this.activePicker !== "endDate") return;
                        if (endTime === "00:00") {
                            this.meetingTime.startDate = timezone.format("yyyy/mm/dd")(new Date(startDate).valueOf() - 24 * 60 * 60 * 1000);
                        } else {
                            this.meetingTime.startDate = endDate;
                        }
                        this.meetingTime.endTime = timezone.getTime(timezone.getTimestamp(startDate, startTime) + 30 * 60 * 1000);
                        
                        correctTimestamp();
                    },
                    endTime: () => {
                        if (this.activePicker !== "endTime") return;
                        
                        if ((new Date(endDate).valueOf() - new Date(startDate).valueOf()) < 0) {
                            this.meetingTime.endDate = startDate;
                            this.meetingTime.startTime = timezone.getTime(timezone.getTimestamp(startDate, endTime) - 30 * 60 * 1000)
                        } else {
                            if (endTime === "00:00") {
                                this.meetingTime.startDate = timezone.format("yyyy/mm/dd")(new Date(startDate).valueOf() - 24 * 60 * 60 * 1000);
                                this.meetingTime.startTime = "23:30"
                            } else {
                                this.meetingTime.startTime = timezone.getTime(timezone.getTimestamp(startDate, endTime) - 30 * 60 * 1000)
                            }
                        }
                        correctTimestamp();
                    },
                };
                
                correctMap[type]();
            },
            getDuration (e, type) {
                let {
                    startDate,
                    endDate,
                    startTime,
                    endTime,
                } = this.meetingTime;
                
                let dateTypeMap = {
                    startDate: () => {
                        startDate = e;
                    },
                    endDate: () => {
                        endDate = e;
                    },
                    startTime: () => {
                        startTime = e;
                    },
                    endTime: () => {
                        endTime = e;
                    },
                };
                
                dateTypeMap[type]();
                return {
                    startDate: timezone.format("yyyy/mm/dd")(startDate),
                    endDate: timezone.format("yyyy/mm/dd")(endDate),
                    startTime,
                    endTime,
                }
            },
            setDuration (e, type) {
                
                let {startDate, endDate, startTime, endTime,} = this.getDuration(e, type);
                
                let duration = this.getRangeToDecimal()(
                    new Date(timezone.format("yyyy/mm/dd")(startDate) + " " + startTime).valueOf(),
                    new Date(timezone.format("yyyy/mm/dd")(endDate) + " " + endTime).valueOf(),
                );
                
                this.duration = isNaN(duration) ? '' : duration;
            },
            cancelCycle () {
                if (this.cycleShow === true) {
                    this.cycleShow = false;
                    this.$refs.reservationMeeting.activePicker = null;
                    
                    this.$refs.reservationMeeting.chooseDate = {
                        startDate: timezone.getTimezoneDate(this.meetingTime.startTimestamp, this.utcOffset),
                        startTime: timezone.getTimezoneTime(this.meetingTime.startTimestamp, this.utcOffset),
                        startTimestamp: this.meetingTime.startTimestamp,
                        endTime: timezone.getTimezoneTime(this.meetingTime.endTimestamp, this.utcOffset),
                        endDate: timezone.getTimezoneDate(this.meetingTime.endTimestamp, this.utcOffset),
                        endTimestamp: this.meetingTime.endTimestamp,
                    };
                }
            },
            closeCycle() {
                this.cycleShow = false;
            },
            isCorrect (value) {
            	return !(value === "" || typeof value === "undefined" || value === null)
            },
            initDuration () {
                let {
                    startDate,
                    endDate,
                    startTime,
                    endTime,
                } = this.meetingTime;
           
                const isCorrectTime = F.every(item=>this.isCorrect(item))([ startDate, endDate, startTime, endTime,]);
        
                if(!isCorrectTime) return this.duration = "";
    
                let duration = this.getRangeToDecimal()(
                    new Date(timezone.format("yyyy/mm/dd")(startDate) + " " + startTime).valueOf(),
                    new Date(timezone.format("yyyy/mm/dd")(endDate) + " " + endTime).valueOf(),
                );
                
                this.duration = isNaN(duration) ? '' : duration;
                
            },
            setCycle(dateRange){
              
                if (this.cycleShow === true) {
                    this.saveCycleData();
                    this.initDuration();
                    this.openModal('setCycleShow');
                    return
                }
                this.activePicker = null;
                this.meetingTime = {
                    startDate: dateRange.startDate,
                    startTime: dateRange.startTime,
                    startTimestamp: dateRange.startTimestamp,
                    endTime: dateRange.endTime,
                    endDate: dateRange.endDate,
                    endTimestamp: dateRange.endTimestamp,
                };
                this.repeatRange.startDate = dateRange.startDate;
                this.initDuration();
                this.saveCycleData();
                this.openModal('setCycleShow');
            },
            saveCycleData () {
                this.cycleSave = {
                    meetingTime: F.extend(this.meetingTime),
                    cycleMeeting: F.extend(this.cycleMeeting),
                    repeatRange: F.extend(this.repeatRange),
                };
            },
            async confirmCycle () {
                if (this.meetingTime.endTime === '' || typeof this.meetingTime.endTime === "undefined" || this.meetingTime.endTime === null) {
                    this.$message(this.$t('reservation.message.withoutMeetingTime'));
                    return;
                }
                
                if (!this.checkCycleMode()) return;
                
                const res = await this.$refs.reservationMeeting.checkConflict(false, true);
                if (res.ret === -1) {
                    this.$message(this.$t(String(res.error.msg)));
                    return;
                }
                
                this.closeModal('setCycleShow');
                this.cycleShow = true;
                this.$refs.reservationMeeting.resetTableView();
            },
            checkCycleMode () {
                
                let checkMap = {
                    day: this.checkDay,
                    week: this.checkWeek,
                    mounth: this.checkMounth,
                    year: this.checkYear,
                };
                return checkMap[this.cycleMeeting.range]();
                
            },
            checkDay () {
                
                if (this.cycleMeeting.day.range === "userDefine"
                        ? this.isWrongSize(this.duration, Number(this.cycleMeeting.day.userDefine) * 24)
                        : this.isWrongSize(this.duration, 24)
                ) {
                    return this.wrongMsg()
                }
                return true;
            },
            checkWeek () {
                
                if (this.cycleMeeting.week.dayList.length === 0) {
                    this.$message(this.$t('reservation.message.wrongCycleMode'));
                    return false;
                }
                
                if (this.cycleMeeting.week.dayList.length === 1) {
                    if (this.duration > 7 * 24) {
                        return this.wrongMsg()
                    }
                }
                
                let keys = this.weekList.filter(item => {
                    return this.cycleMeeting.week.dayList.indexOf(item.label) > -1;
                }).map(item => item.key).sort((a, b) => (a - b) < 0 ? 1 : -1);
                
                let arr = [];
                
                for (let i = 0; i < keys.length; i++) {
                    if (typeof keys[i + 1] !== "undefined") {
                        arr.push(keys[i] - keys[i + 1])
                    }
                }
                
                let min = Math.min(...arr);
                if (this.isWrongSize(this.duration, min * 24)) {
                    return this.wrongMsg()
                }
                
                return true;
            },
            checkMounth () {
                if (this.isWrongSize(this.duration, 28 * 24)) {
                    return this.wrongMsg()
                }
                return true;
            },
            checkYear () {
                if (this.isWrongSize(this.duration, 28 * 365)) {
                    return this.wrongMsg()
                }
                return true;
            },
            isWrongSize (size1, size2) {  //size1 用户选择的范围，size2 最大范围
                return (Number(size1) - Number(size2)) > 0
            },
            wrongMsg () {
                this.$message(this.$t('reservation.message.outSideTime'));
                return false
            },
            getTime (date) {
                date = new Date(date);
                let hh = date.getHours();
                let mm = date.getMinutes();
                return this.formatToDouble(hh) + ":" + this.formatToDouble(mm);
            },
            getRangeToDecimal () { //函数组合，从右侧开始执行
                return F.composeRight([this.formatToDecimal, this.getDiffStamp]);
            },
            getDiffStamp (t1, t2) {
                return Math.abs(new Date(t1).valueOf() - new Date(t2).valueOf());
            },
            formatToDecimal(stamp) {
                let H = parseInt(stamp / (60 * 60 * 1000));
                let M = Math.abs(stamp % (60 * 60 * 1000) / (60 * 60 * 1000));
                return H + M;
            },
            formatToDouble(num){
                return Number(num) < 10 ? "0" + num : num;
            },
            showResource () {
                this.businessModel === "cloudPort"
                    ? this.openModal('cloudPortShow')
                    : this.openModal('videoResourceShow');
                this.$nextTick(()=>{
                	if(typeof this.$refs.vmrResource !=="undefined"){
                        this.$refs.vmrResource.resize();
                    }
                })
            },
            changePersonType (index, person) {
                if (this.mode === 'room') return;
                if (person.type === "external") return console.log("外部人员不能修改为主持人");
                this.meetingPersonList.forEach((item, i) => {
                    if (index === i) {
                        if (this.mode === 'video') {   //判断下是预约视频会议还是预约会议室。
                            item.sign = Number(!item.sign);
                        } else if (this.mode === 'room') {
                            item.sign = Number(!item.sign);
                        }
                    }
                })
            },
            deletePerson (index, type) {
                this[type].forEach((item, i) => {
                    if (index === i) {
                        this[type].splice(index, 1)
                    }
                })
            },
            addMember () {
                this.addMemberShow = false;
                
                let checkNodes = this.getCheckedNodes(); //获取选中的节点
                
                let noOccupiedNodes = this.getNoOccupiedNodes(checkNodes);  //去除已经添加过的节点
                
                let {takeupNodes, correctNodes} = this.getTakeupAndCorrectNodes(noOccupiedNodes);  //获取已经占用的和正确的节点
                
                this[this.activePersonList] = this[this.activePersonList].concat(correctNodes).filter(item => {
                    return checkNodes.map(item => item.id).indexOf(item.id) > -1
                });
                
                if (takeupNodes.length > 0) {
                    this.alertTakeup(takeupNodes);
                }
            },
            getTakeupAndCorrectNodes (nodes) {
                let handle = {
                    meetingPersonList: 'meetingAudience',
                    meetingAudience: 'meetingPersonList',
                };
                return {
                    takeupNodes: nodes.filter(item => {
                        return this[handle[this.activePersonList]].map(item => item.id).indexOf(item.id) > -1;
                    }),
                    correctNodes: nodes.filter(item => {
                        return this[handle[this.activePersonList]].map(item => item.id).indexOf(item.id) === -1;
                    }),
                    
                }
            },
            alertTakeup (takeupNodes) {
                this.takeupNodes = takeupNodes;
                this.openModal("takeupTip");
            },
            getCheckedNodes () {
                
                let checkedNodes = this.$refs.memberTransfer.getChecked();
                
                return checkedNodes.outer.map((item) => {
                    return {name: item.name, id: item.name, type: "external"}
                }).concat(checkedNodes.inner.map((item) => {
                    return {name: item.name, id: item.id, type: "internal"}
                }));
            },
            getNoOccupiedNodes (checkNodes) {
                return checkNodes.map((item) => {
                    return {name: item.name, id: item.id, type: item.type, sign: 0,}
                }).filter((item) => {
                    return !this[this.activePersonList].some((person) => {
                        return person.id === item.id;
                    })
                });
            },
            closeTakeupTip () {
                this.takeupTip = false;
                this.takeupNodes = [];
            },
            changeNodesType () {
                let handle = {
                    meetingPersonList: 'meetingAudience',
                    meetingAudience: 'meetingPersonList',
                };
                this[handle[this.activePersonList]] = this[handle[this.activePersonList]].filter((item) => {
                    return this.takeupNodes.every((person) => {
                        return person.id !== item.id;
                    })
                });
                
                this[this.activePersonList] = this[this.activePersonList].concat(this.takeupNodes);
                this.closeTakeupTip();
                
            },
            sendMail () {
                if (!this.checkRervation()) return;
                this.startReservation();
                this.mailPreviewShow = false;
                
            },
            getMemberList () {
                reqPersonList().then(res => {
                    this.setMemberList(res.data.data)
                });
                return this;
            },
            setMemberList (data) {
                let userId = JSON.parse(sessionStorage.user).personal.staffId;
                data.forEach(item => {
                    if (this.isEdit) {
                        if (item.id === this.organizer.id) { // 编辑模式 载入组织者id
                            item.checked = true;
                            item.chkDisabled = true;
                        }
                    } else {
                        if (item.id === userId) { //预约模式载入 用户id
                            item.checked = true;
                            item.chkDisabled = true;
                        }
                    }
                    
                });
                this.memberList = data;
                
            },
            checkRooms () {
                return this.$route.path === "/meeting/index/room"
                    ? this.$refs.reservationMeeting.selectedProject.length === 0
                    : false;
                
            },
            checkRervation () {
                let message = this.tipMessage();
                
                if (this.checkRooms()) {  //检测是否有选择会议室 ：视频会议可以不选会议室
                    this.$message(message.noRooms);
                    return false
                }
                
                if (this.checkTheme()) { //检测主题是否填写
                    this.$message(message.subject);
                    return false
                }


//                if (this.checkResourceMode()) {  //业务模式一二公有云私有云都可以选择主席模式，业务模式三 在选择主席模式时已经禁用私有云 所以此判断取消
//                    this.$message(message.resource);
//                    return false
//                }
                
                if (this.cycleShow === false) { //cycleshow = true 情况处理
                    if (this.checkDate()) {
                        this.$message(message.date);
                        return false
                    }
                }
                if (this.cycleShow === false && this.isEdit === false) { //周期会议不验证时间过期情况, 编辑模式不验证时间过期
                    if (this.checkOverTime()) {
                        this.$message(message.overTime);
                        return false
                    }
                }
                
                
                return true;
            },
            checkVmr () {
                
                let message = this.tipMessage();
                
                if (this.cycleShow === false) {
                    if (this.checkDate()) {
                        this.$message(message.date);
                        return false
                    }
                }
                
                return true;
            },
            tipMessage () {
                return {
                    subject: this.$t('reservation.message.null.subject'),
                    date: this.$t('reservation.message.null.date'),
                    member: this.$t('reservation.message.null.member'),
                    rooms: this.$t('reservation.message.null.rooms'),
                    resource: this.$t('reservation.message.null.resource'),
                    overTime: this.$t('reservation.message.null.overTime'),
                    noRooms: this.$t('reservation.message.null.noRooms'),
                }
            },
            checkTheme () {
                return !this.checkVal(this.meetingThemeForm.theme)
            },
            checkResourceMode () {
                return this.meetingMode === 'demonstrator' && this.checkedResource === 'private'
            },
            checkDate() {
                let chooseDate = this.$refs.reservationMeeting.chooseDate;
                return Object.keys(chooseDate).filter(item => {
                        return !this.checkVal(chooseDate[item]);
                    }).length > 0
                
            },
            checkOverTime () {
                let chooseDate;
                
                if (this.cycleShow === false) {
                    chooseDate = this.$refs.reservationMeeting.chooseDate;
                } else {
                    
                    chooseDate = {
                        startTimestamp: this.meetingTime.startTimestamp,
                    }
                };
                return chooseDate.startTimestamp <= (new Date().valueOf());
            },
            
            getStamp (date, time){
                let utcOffset = this.$refs.reservationMeeting.utcOffset;
                
                return new Date(date.replace(/\//g, "-") + "T" + time + timezone.getTimezoneNum(utcOffset)).valueOf()
            },
            checkVal (val) {
                return val !== "" && typeof val !== "undefined"
            },
            checkArrLength (arr) {
                return arr.length > 0
            },
            getConferenceTime () {
            
            },
            getEditOnceObj() {
                let editObj = F.extend(this.getReservationObj());
                delete editObj.confType;
                editObj.conferenceRecordId = this.editInf.recordId;
                return editObj;
            },
            getEditPlanObj() {
                let editObj = F.extend(this.getReservationObj());
                delete editObj.confType;
                editObj.conferencePlanId = this.editInf.planId;
                return editObj;
            },
            getReservationObj () {
                let chooseDate;
                if (this.cycleShow === false) {
                    chooseDate = this.$refs.reservationMeeting.chooseDate;
                } else {
                    chooseDate = {
                        startDate: timezone.format("yyyy/mm/dd")(this.meetingTime.startDate),
                        endDate: timezone.format("yyyy/mm/dd")(this.meetingTime.endDate),
                        startTime: this.meetingTime.startTime,
                        endTime: this.meetingTime.endTime
                    }
                }
                
                return {
                    confType: this.$route.path === "/meeting/index/reservation" ? "VSC" : "NC",
                    profile: this.$route.path === "/meeting/index/room" ? null : this.meetingMode, //讨论模式，主席模式
                    subject: this.meetingThemeForm.theme, //会议主题
                    conferenceTimePattern: {
                        conferenceTime: {
                            startDate: timezone.format("yyyy-mm-dd")(chooseDate.startDate),
                            startTime: chooseDate.startTime,
                            endDate: timezone.format("yyyy-mm-dd")(chooseDate.endDate),
                            endTime: chooseDate.endTime,
                        },
                        zoneId: this.$refs.reservationMeeting.timeZone,
                        recurrencePattern: this.getRecurrencePattern,
                        dstConfig: { //会议的夏令时设置
                            dstEnable: Number(this.$refs.reservationMeeting.summerTime.checked),
                            dayLightDelta: this.$refs.reservationMeeting.summerTime.offset * 1000 * 60,
                        }
                    },
                    roomIds: this.$refs.reservationMeeting.selectedProject, //会议室id
                    vmrId: this.checkedPublic, //这是啥?
                    isPrivate: this.checkedResource === "private", //是否使用私有云?
                    emailRemark: this.result = this.$refs.editor.getVal(),//邮件备注
                    participants: [
                        ...this.meetingAudience.map(item => {
                            return {
                                id: item.id,
                                type: item.type,
                                role: "castviewer",
                            }
                        }),
                        ...this.meetingPersonList.map(item => {
                            return {
                                id: item.id,
                                type: item.type,
                                role: item.sign === 1 ? "presenter" : "attendee"
                            }
                        }),
                        {
                        	id:this.isEdit
                                ?this.organizer.id
                                :JSON.parse(sessionStorage.user).personal.userId,
                            type:"internal",
                            role:"organizer",
                        }
                    ],//参会人员列表
                    hasViewer: this.meetingAudience.length > 0,
                }
            },
            startReservation: async function () {
                
                const res = this.isEdit
                    ? this.$route.query.condition === "once"
                        ? await reqEditOnceMeeting(this.getEditOnceObj())
                        : await reqEditPlanMeeting(this.getEditPlanObj())
                    : await reqReservationMeeting(this.getReservationObj());
                
                if (res.ret === -1) {
                    this.$alert('', this.$t('reservation.alert.sendFail.title'), {
                        confirmButtonText: this.$t('reservation.btn.ok'),
                        topIcon: 'iconfont icon-cuowuleitishi fail',
                        message:res.error.msg===null
                            ? this.$t(res.error.fieldErrors[0].msg || '')
                            : this.$t(res.error.msg || ''),
                    });
                } else {
                    this.$alert('', this.$t('reservation.alert.sendSuccees.title'), {
                        confirmButtonText: this.$t('reservation.btn.ok'),
                        topIcon: 'iconfont icon-chenggongleitishi success',
                        callback: () => {
                            this.$router.push({path: '/meeting/index/schedule'})
                            //this.$refs.reservationMeeting.fresh()
                        }
                    });
                }
            },
            checkHasViewer () {
                reqhasViewer().then(res => {
                    this.hasViewer = res.data.data.audienceEnable;
                });
                return this;
            },
            getPublicResource () {
                if (this.businessModel !== "vmr") return this;
                reqPublicResource({
                    types: ["cloud"]
                }).then(res => {
                    
                    this.publicResource = [
                        {label: this.$t('reservation.modal.vmrResource.defaultVmrResource'), value: null},
                        ...res.data.map(item => {
                            return {
                                label: `${item.name}(${item.limit+this.$t('reservation.vmr.sites')})`,
                                value: item.id,
                            }
                        })
                    ]
                    
                });
                
                return this;
            },
            changePublic (vmrId) {
                if (vmrId === null) return;
                if (!this.checkVmr()) {
                    this.checkedPublic = null;
                    return
                }
                let chooseDate;
                if (this.cycleShow === false) {
                    chooseDate = this.$refs.reservationMeeting.chooseDate;
                } else {
                    chooseDate = {
                        startDate: timezone.format("yyyy/mm/dd")(this.meetingTime.startDate),
                        endDate: timezone.format("yyyy/mm/dd")(this.meetingTime.endDate),
                        startTime: this.meetingTime.startTime,
                        endTime: this.meetingTime.endTime
                    }
                }
                checkVmrConflict({
                    confType: this.$route.path === "/index/reservation" ? "VSC" : "NC",
                    profile: this.$route.path === "/index/room" ? null : this.meetingMode,
                    conferenceTimePattern: {
                        conferenceTime: {
                            startDate: timezone.format("yyyy-mm-dd")(chooseDate.startDate),
                            startTime: chooseDate.startTime,
                            endDate: timezone.format("yyyy-mm-dd")(chooseDate.endDate),
                            endTime: chooseDate.endTime,
                        },
                        zoneId: this.$refs.reservationMeeting.timeZone,
                        recurrencePattern: this.getRecurrencePattern,
                        dstConfig: { //会议的夏令时设置
                            dstEnable: Number(this.$refs.reservationMeeting.summerTime.checked),
                            dayLightDelta: this.$refs.reservationMeeting.summerTime.offset * 1000 * 60,
                        },
                    },
                    vmrId: vmrId,
                    isPrivate: false,
                    roomIds: this.$refs.reservationMeeting.selectedProject,
                    hasViewer: this.meetingAudience.length > 0,
                    
                }).then(res => {
                    
                    if (res.ret === -1) {
                        this.$message(this.$t(String(res.error.msg)));
                        this.checkedPublic = null
                    }
                })
                
            },
            async setUserInf () {
                /*
                 * basic:基础服务套餐；vmr:虚拟会议室套餐；cloudPort:云会议端口套餐套餐
                 * */
                const res = await reqBussinessMode();
                
                const bussiness = res.data || null;
                const mode = this.formatBussiness(bussiness);
                this.$store.commit("setBussinessMode", mode);
                this.businessModel = mode.businessMode;
                //this.businessModel = "vmr";
                if (this.businessModel === "cloudPort") {
                    this.checkedResource = "public"
                }
                if(mode.hasTerminalVmr===false) {
                    this.checkedResource = "public"
                }
                console.log(mode);
                return this;
            },
            formatBussiness (bussiness) {
                return bussiness === null
                    ? {
                        isTrial: true, //是否试用
                        hasCloudVmr: false, //是否有云端vmr
                        hasTerminalVmr: false, //是否有终端vmr
                        hascloudPortOrder: false, //是否有云会议端口
                        businessMode:null //业务模式
                    }
                    : {
                        isTrial: F.some(item => item.suiteType === 'trial')(bussiness),
                        hasCloudVmr: F.some(item => item.cloudVmrOrderItems !== null && Array.isArray(item.cloudVmrOrderItems))(bussiness),
                        hasTerminalVmr: F.some(item => item.terminalVmrOrderItems !== null && Array.isArray(item.terminalVmrOrderItems))(bussiness),
                        hascloudPortOrder: F.some(item => item.cloudPortOrderItem !== null && Array.isArray(item.cloudPortOrderItem))(bussiness),
                        businessMode: bussiness[0].suiteType
                    }
            },
            initEdit: async function () {
                
                if (!this.isEdit) return this.getMemberList();
                
                const recordId = this.$route.query.recordId;
                const planId = this.$route.query.planId;
                const condition = this.$route.query.condition;
                
                const res = condition === 'once'
                    ? await reqMeetingDetail(recordId)
                    : await reqMeetingPlanDetail(planId);
                
                this.processRes(res, this.distributeMeetingData);
                this.getMemberList();
                
            },
            processRes: async function (res, callback) {
                const correctRes = await this.checkRes(res);
                
                if (correctRes === false) return;
                
                if (callback) callback(correctRes.data);
            },
            checkRes (res) {
                return new Promise((resolve) => {
                    resolve(res.ret > -1 ? res : this.processError(res.error));
                })
            },
            
            processError (error) {
                return false;
            },
            
            distributeMeetingData (res) {
                //讨论模式，主席模式
                if (res.communication) {
                    this.meetingMode = res.communication.profile;
                    if(res.communication.vmr && res.communication.vmr.categoryId.length > 0){
                    	if(res.communication.vmr.type ==="cloud"){
                            this.checkedPublic = res.communication.vmr.id;
                            this.checkedResource = 'public';
                        }else if(res.communication.vmr.type ==="terminal"){
                            this.checkedResource = 'private';
                        }
                    }
                }
                //主题
                this.meetingThemeForm.theme = res.conferenceSubject.subject;
                //地点
                
                this.$refs.reservationMeeting.selectedProject = res.rooms.map(item => item.id);
                
                //参会人员
                this.meetingPersonList = res.participants.filter(item => item.role === "attendee" || item.role === "presenter").map(item => {
                    return {
                        name: item.displayText === null ? item.email : item.displayText,
                        id: item.id,
                        type: item.type,
                        sign: item.role === "presenter" ? 1 : 0,
                    }
                });
                
                //orgnaizer
                this.$store.commit('setOrganizer', res.organizer);
                
                //观众
                this.meetingAudience = res.participants.filter(item => item.role === "castviewer").map(item => {
                    return {
                        name: item.displayText === null ? item.email : item.displayText,
                        id: item.id,
                        type: item.type,
                        sign: item.role === "presenter" ? 1 : 0,
                    }
                });
                //备注
                
                this.$refs.editor.setVal(res.emailRemark);
                this.result = res.emailRemark;
                const editType = this.$route.query.condition;
                
                this.editInf = editType === "plan"
                    ? {
                        planId: res.id,
                        recordId: res.id,
                        type: this.$route.query.type
                    }
                    : {
                        planId: res.conferencePlanId,
                        recordId: res.id,
                        type: this.$route.query.type
                    };
                
                
                this.$store.commit('setRecordId', this.editInf.recordId);
                this.$store.commit('setPlanId', this.editInf.planId);
                this.$store.commit('setEditType', editType);
                
                
                //设置编辑时区
                let {utcOffset, zoneId} = res.conferenceTimePattern.timeZone;
                let {dayLightDelta, dstEnable} = res.conferenceTimePattern.dstConfig;
             
                
                //处理时间
                if (this.editInf.type === "once") {
                    let chooseDate = res.conferenceTimePattern.conferenceTime;
                    
                    this.$refs.reservationMeeting.chooseDate = {
                        startDate: chooseDate.startDate,
                        startTimestamp: chooseDate.startDateTimeStamp,
                        startTime: chooseDate.startTime,
                        endDate: chooseDate.endDate,
                        endTime: chooseDate.endTime,
                        endTimestamp: chooseDate.endDateTimeStamp,
                    };
                    
                } else if (this.editInf.type === "plan") {
                    this.cycleShow = true;
                    let cycleDate = edit.formatToCycleDate(
                        res.conferenceTimePattern.recurrencePattern,
                        {
                            cycleTemp: F.extend(this.cycleMeeting),
                            rangeTemp: F.extend(this.repeatRange)
                        },
                    );
                    this.cycleMeeting = cycleDate.cycleMeeting;
                    this.repeatRange = cycleDate.repeatRange;
                    this.meetingTime = cycleDate.meetingTime;
                
                    
                    this.$refs.reservationMeeting.chooseDate = {
                        
                        startDate: this.meetingTime.startDate,
                        startTimestamp: this.meetingTime.startDateTimeStamp,
                        startTime: this.meetingTime.startTime,
                        endDate: this.meetingTime.endDate,
                        endTime: this.meetingTime.endTime,
                        endTimestamp: this.meetingTime.endDateTimeStamp,
                    };
                }
                this.$store.commit('setTimezone', {zoneId, utcOffset, dayLightDelta, dstEnable});
            },
            cancelReservation () {
                this.$confirm(this.$t('reservation.confirm.cancelReservation.message'),
                    this.$t('reservation.confirm.cancelReservation.prompt'), {
                        confirmButtonText: this.$t('reservation.btn.confirm'),
                        cancelButtonText: this.$t('reservation.btn.cancel')
                    }).then(() => {
                    this.$router.push("/meeting");
                })
            },
        },
        async mounted () {
            
            await this.setUserInf();
            
            this.setDefaultSubject(JSON.parse(sessionStorage.user).personal.name)
                .checkHasViewer()
                .getPublicResource()
                .initEdit()
            
        }
    }
</script>
