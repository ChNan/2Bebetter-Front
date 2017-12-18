<template>
    <div>
        <!--表格控件   TODO 需要考虑没数据时的布局，还有浏览器的兼容-->
        <table class="u-table g-paddingt-14" cellspacing="1" cellpadding="1">
            <tr>
                <th class="s-bgc-title s-w-empty"></th>
                <th class="s-bgc-title f-fw-norm f-tal f-fs-14 g-paddingl-26 account-width ">{{$t("controlDetail.name")}}/{{$t("controlDetail.account")}}</th>
                <th class="s-bgc-title f-fw-norm f-tal f-fs-14 g-paddingl-26 content-width">{{$t("controlDetail.content")}}</th>
                <th class="s-bgc-title f-fw-norm f-tal f-fs-14 g-paddingl-26 content-width">{{$t("controlDetail.apply")}}</th>
                <th class="s-bgc-title f-fw-norm f-tal f-fs-14 g-paddingl-26 " style="width: 500px">{{$t("controlDetail.confControl")}}</th>
                <th class="s-bgc-title f-fw-norm f-tal f-fs-14 g-paddingl-26 detail-width ">{{$t("controlDetail.count")}}</th>
            </tr>
            <!-- -----主持人------ -->
            <tr v-for="(temp,index) in dataListDown.Users.user" v-if="temp.rolesPri=='presenter'" :key="temp.entity">
                <!--主持人-->
                <th class="s-bg-left s-w-empty f-fw-norm f-tal f-fs-14 g-paddingl-26" v-if="index===masterIndex" :rowspan="getlength().masterLength">
                    <span class="f-fl f-lineh-15 g-padding-20">{{$t("controlDetail.moderators")}}({{getlength().masterLength}})</span>
                </th>
                <!--名称和账号-->
                <td :class="{bgcolor:index%2==0}" >
                    <div style="padding-top:14px;padding-bottom: 14px">
                        <div>
                            <div class=" f-fl g-paddingr-12">
                                <!--是否是组织者-->
                                <!--TODO 需要获得登录的账号，看是否等于用户号码-->
                                <span class="icon iconfont f-fs-28 color-blue g-mute-p" :class="{mastericon:dataListDown.Desc.org_name===temp.phone, 'icon-compere':temp.uid && temp.userAgent.indexOf('Yealink SIP-WEB') ==-1, 'icon-wenhao-mid': !temp.uid || temp.userAgent.indexOf('Yealink SIP-WEB') !=-1}">
                                    <!--是否禁言-->
                                    <span class="f-fs-16 g-mute" v-show="temp.mute==='block' || temp.mute==='unblocking'">
                                        <img src="../../../assets/img/ctrl/mute.png" />
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div :title="temp.displayText">{{temp.displayText}}</div>
                        <div>{{temp.phone}}</div>
                    </div>
                </td>
                <!--分享辅流：讨论模式下谁都可以分享辅流，主席模式下只有主持人可分享辅流dataListDown.Desc.profile==='default'-->
                <td :class="{bgcolor:index%2==0}">
                    <div class=" f-fl padding f-tac " v-if="temp.applicationsharing===true">
                        <div class="icon iconfont icon-share f-fs-28  color-blue"></div>
                        <div>{{$t("controlDetail.share")}}</div>
                    </div>
                </td>
                <!--申请发言:讨论模式下谁都可以讲话，不需要申请发言，主席模式下主持人不需要申请发言-->
                <td :class="{bgcolor:index%2==0}">
                    <div class=" f-fl padding f-tac cursorp" @click="openModal('speak',temp.entity, temp.displayText)" v-show="dataListDown.Desc.profile==='demonstrator'&&temp.mute==='unblocking'">
                        <div class="icon iconfont icon-hand f-fs-28  color-blue apply-color"></div>
                        <div>{{$t("controlDetail.apply")}}</div>
                    </div>
                </td>
                <!--会议操作-->
                <td :class="{bgcolor:index%2==0}" style="position: relative; min-width: 470px">

                    <!--禁言:讨论模式下，主席模式下：主持人可禁言所有除自己和组织者-->
                    <div class=" f-tac cursorp" style="position: absolute;left: 26px;top: 10px;">
                        <div class="icon iconfont icon-mute f-fs-38  color-red " v-if="temp.mute==='block' || temp.mute==='unblocking'" onMouseOver="this.className='icon iconfont icon-unmute  f-fs-38  color-red '" onMouseOut="this.className='icon iconfont icon-mute f-fs-38  color-red'" onMouseDown="this.className='icon iconfont icon-mute  f-fs-38  color-red '" @click="modifyMute(temp.entity, 'unblock')">
                        </div>
                        <div class="icon iconfont icon-unmute f-fs-38  color-gray " v-if="temp.mute==='unblock'" onMouseOver="this.className='icon iconfont icon-unmute  f-fs-38  color-red '" onMouseOut="this.className='icon iconfont icon-unmute f-fs-38  color-gray'" onMouseDown="this.className='icon iconfont icon-mute  f-fs-38  color-red '" @click="modifyMute(temp.entity, 'block')">
                        </div>
                        <div v-if="temp.mute">{{$t("controlDetail.mute")}}</div>
                    </div>
                    <!--演讲:主席模式下：有演讲-->
                    <div class=" f-tac cursorp" style="position: absolute;left: 156px;top: 10px;" v-if="dataListDown.Desc.profile==='demonstrator'">
                        <!--<div class="icon iconfont icon-speech f-fs-38  color-red "></div>-->
                        <div class="this.className='icon iconfont icon-speech f-fs-38  color-red " v-if="temp.rolesDemoState==='demonstrator'" onMouseOver="this.className='icon iconfont icon-unspeech  f-fs-38  color-red '" onMouseOut="this.className='icon iconfont icon-speech f-fs-38  color-red' " onMouseDown="this.className='icon iconfont icon-speech f-fs-38  color-red '" @click="openModal('demonstrator',temp.entity, temp.displayText, 'OffDemo')"></div>
                        <div class="icon iconfont icon-unspeech f-fs-38  color-gray " v-if="temp.rolesDemoState==='audience'" onMouseOver="this.className='icon iconfont icon-unspeech  f-fs-38  color-red '" onMouseOut="this.className='icon iconfont icon-unspeech  f-fs-38  color-gray'" onMouseDown="this.className='icon iconfont icon-speech f-fs-38  color-red '" @click="openModal('demonstrator',temp.entity, temp.displayText, 'OnDemo')"></div>
                        <div>{{$t("controlDetail.speech")}}</div>
                    </div>
                    <!--设为访客：讨论模式下，主席模式下：主持人可将除组织者外的所有人设置为访客（包括自己）-->
                    <div class=" f-tac cursorp" style="position: absolute;left: 266px;top: 10px; width: 120px" @click="openModal('resetToGuest',temp.entity, temp.displayText)">
                        <!--<div class="icon iconfont icon-speech f-fs-38  color-red "></div>-->
                        <div class="icon iconfont icon-bigdissablevisitor f-fs-38  color-gray " onMouseOut="this.className='icon iconfont icon-bigdissablevisitor f-fs-38 color-forbid'" onMouseOver="this.className='icon iconfont icon-bigdissablevisitor f-fs-38 color-blue '" onMouseDown="this.className='icon iconfont icon-bigvisitors  f-fs-38  color-blue '"></div>
                        <div>{{$t("controlDetail.settoguests")}}</div>
                    </div>
                    <!--移除：讨论模式下，主席模式下：主持人可将除组织者外的所有人移除-->
                    <!--如果登录的是组织者，那有这个移除按钮，且遍历到组织者这条数据 （v-if="loginId===dataListDown.Desc.org_uid&&dataListDown.Desc.org_name===temp.phone||dataListDown.Desc.org_name!==temp.phone"）-->
                    <div class=" f-tac cursorp" style="position: absolute;left: 426px;top: 10px;" @click="openModal('removePerson', temp.entity, temp.displayText)">
                        <div class="icon iconfont icon-dissable_remove f-fs-38 color-forbid" onMouseOut="this.className='icon iconfont icon-dissable_remove f-fs-38 color-forbid'" onMouseOver="this.className='icon iconfont icon-dissable_remove f-fs-38 color-red '" onMouseDown="this.className='icon iconfont icon-remove f-fs-38 color-red '">
                        </div>
                        <div>{{$t("controlDetail.remove")}}</div>
                    </div>
                </td>
                <!--详情：显示设备信息-->
                <td :class="{bgcolor:index%2==0}">
                    <div class="f-fl padding f-tac">
                        <span>{{temp.userAgent}}</span>
                    </div>
                </td>
            </tr>
            <tr v-if="getlength().masterLength == 0">
                <!--主持人0个-->
                <th class="s-bg-left s-w-empty f-fw-norm f-tal f-fs-14 g-paddingl-26" :rowspan="1">
                    <span class="f-fl f-lineh-15 g-padding-20">{{$t("controlDetail.moderators")}}(0)</span>
                </th>
             </tr>

            <!--空行-->
            <tr style=" height: 17px;"></tr>

            <!-- ------访客------- -->
            <tr v-for="(temp,index) in dataListDown.Users.user" v-if="temp.rolesPri=='attendee'" :key="temp.entity">
                <!--访客-->
                <th class="s-bg-left s-w-empty f-fw-norm f-tal f-fs-14 g-paddingl-26" v-if="index===audienceIndex" :rowspan="getlength().audienceLength">
                    <span class="f-fl f-lineh-15 g-padding-20">{{$t("controlDetail.guests")}}({{getlength().audienceLength}})</span>
                </th>
                <!--名称账号-->
                <td :class="{bgcolor:index%2==0}" >
                    <div style="padding-top:14px;padding-bottom: 14px;">
                        <div>
                            <div class="f-fl g-paddingr-12">
                                <span class="icon iconfont f-fs-28 color-blue g-mute-p" :class="{'icon-smallvisitors':temp.uid  && temp.userAgent.indexOf('Yealink SIP-WEB') ==-1, 'icon-wenhao-mid': !temp.uid  || temp.userAgent.indexOf('Yealink SIP-WEB') !=-1}">
                                    <span class="f-fs-16 g-mute" v-show="temp.mute==='block' || temp.mute==='unblocking'">
                                        <img src="../../../assets/img/ctrl/mute.png" />
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div :title="temp.displayText">{{temp.displayText}}</div>
                        <div>{{temp.phone}}</div>
                    </div>
                </td>
                <!--分享中:讨论模式下谁都可以发辅流，主席模式下不可以发辅流-->
                <td :class="{bgcolor:index%2==0}">
                    <div class=" f-fl padding f-tac" v-show="dataListDown.Desc.profile==='default'&&temp.applicationsharing">
                        <div class="icon iconfont icon-share f-fs-28  color-blue"></div>
                        <div>{{$t("controlDetail.share")}}</div>
                    </div>
                </td>
                <!--申请发言:讨论模式下谁都可以发言，主席模式下需要申请才能发言-->
                <td :class="{bgcolor:index%2==0}">
                    <div class=" f-fl padding f-tac cursorp" @click="openModal('speak',temp.entity, temp.displayText)" v-show="dataListDown.Desc.profile==='demonstrator'&&temp.mute==='unblocking'">
                        <div class="icon iconfont icon-hand f-fs-28  color-blue apply-color"></div>
                        <div>{{$t("controlDetail.apply")}}</div>
                    </div>
                </td>
                <!--会议操作-->
                <td :class="{bgcolor:index%2==0}" style="position: relative; min-width: 470px">
                    <!--禁言:讨论模式下，主席模式下：主持人可禁言所有除自己和组织者-->
                    <div class=" f-tac cursorp" style="position: absolute;left: 26px;top: 10px;">
                        <div class="con iconfont icon-mute  f-fs-38  color-red " onMouseOver="this.className='icon iconfont icon-unmute  f-fs-38  color-red '" onMouseOut="this.className='icon iconfont icon-mute  f-fs-38  color-red '" onMouseDown="this.className='icon iconfont icon-mute  f-fs-38  color-red '" v-if="temp.mute==='block' || temp.mute==='unblocking'" @click="modifyMute(temp.entity, 'unblock')">
                        </div>
                        <div class="icon iconfont icon-unmute f-fs-38  color-gray " onMouseOver="this.className='icon iconfont icon-unmute  f-fs-38  color-red '" onMouseOut="this.className='icon iconfont icon-unmute f-fs-38  color-gray'" onMouseDown="this.className='icon iconfont icon-mute  f-fs-38  color-red '" v-else @click="modifyMute(temp.entity, 'block')">
                        </div>
                        <div>{{$t("controlDetail.mute")}}</div>
                    </div>
                    <!--演讲:主席模式下：有演讲-->
                    <div class=" f-tac cursorp" style="position: absolute;left: 156px;top: 10px;" v-if="dataListDown.Desc.profile==='demonstrator'">
                        <!--<div class="icon iconfont icon-speech f-fs-38  color-red "></div>-->
                        <div class="this.className='icon iconfont icon-speech f-fs-38  color-red " v-if="temp.rolesDemoState==='demonstrator'" onMouseOver="this.className='icon iconfont icon-unspeech  f-fs-38  color-red '" onMouseOut="this.className='icon iconfont icon-speech f-fs-38  color-red' " onMouseDown="this.className='icon iconfont icon-speech f-fs-38  color-red '" @click="openModal('demonstrator',temp.entity, temp.displayText, 'OffDemo')"></div>
                        <div class="icon iconfont icon-unspeech f-fs-38  color-gray " v-if="temp.rolesDemoState==='audience'" onMouseOver="this.className='icon iconfont icon-unspeech  f-fs-38  color-red '" onMouseOut="this.className='icon iconfont icon-unspeech  f-fs-38  color-gray'" onMouseDown="this.className='icon iconfont icon-speech f-fs-38  color-red '" @click="openModal('demonstrator',temp.entity, temp.displayText, 'OnDemo')"></div>
                        <div>{{$t("controlDetail.speech")}}</div>
                    </div>
                    <!--设为主持人：讨论模式下，主席模式下：主持人可将除组织者外的所有人设置为主持人-->
                    <div class=" f-tac cursorp" style="position: absolute;left: 266px;top: 10px; width: 120px" @click="openModal('resetToModerator', temp.entity, temp.displayText)">
                        <!--<div class="icon iconfont icon-speech f-fs-38  color-red "></div>-->
                        <div class="icon iconfont icon-bigdissablevisitor f-fs-38  color-gray " onMouseOut="this.className='icon iconfont icon-bigdissablevisitor f-fs-38 color-forbid'" onMouseOver="this.className='icon iconfont icon-bigdissablevisitor f-fs-38 color-blue '" onMouseDown="this.className='icon iconfont icon-bigvisitors  f-fs-38  color-blue '"></div>
                        <div>{{$t("controlDetail.settomoderators")}}</div>
                    </div>
                    <!--移除：讨论模式下，主席模式下：主持人可将除组织者外的所有人移除-->
                    <div class=" f-tac cursorp" style="position: absolute;left: 426px;top: 10px;" @click="openModal('removePerson', temp.entity, temp.displayText)">
                        <div class="icon iconfont icon-dissable_remove f-fs-38 color-forbid" onMouseOut="this.className='icon iconfont icon-dissable_remove f-fs-38 color-forbid'" onMouseOver="this.className='icon iconfont icon-dissable_remove f-fs-38 color-red '" onMouseDown="this.className='icon iconfont icon-remove f-fs-38 color-red '">
                        </div>
                        <div>{{$t("controlDetail.remove")}}</div>
                    </div>
                </td>
                <!--详情-->
                <td :class="{bgcolor:index%2==0}">
                    <div class="f-fl padding f-tac" style="padding-top:8px;padding-bottom: 8px">
                        <span>{{temp.userAgent}}</span>
                    </div>
                </td>
            </tr>
            <tr v-if="getlength().audienceLength == 0">
                <!--访客0个-->
                <th class="s-bg-left s-w-empty f-fw-norm f-tal f-fs-14 g-paddingl-26" :rowspan="1">
                    <span class="f-fl f-lineh-15 g-padding-20">{{$t("controlDetail.guests")}}(0)</span>
                </th>
             </tr>

            <!--空行-->
            <tr style=" height: 17px;"></tr>
            <!-- -----观众---------- -->

            <tr v-for="(temp,index) in dataListDown.Users.user" v-if="temp.rolesPri=='castviewer'" :key="temp.entity">
                <!--观众-->
                <th class="s-bg-left s-w-empty f-fw-norm f-tal f-fs-14 g-paddingl-26" v-if="index===viewerIndex" :rowspan="getlength().viewerLength">
                    <span class="f-fl f-lineh-15 g-padding-20">{{$t("controlDetail.audience")}}({{getlength().viewerLength}})</span>
                </th>
                <!--名称账号-->
                <td :class="{bgcolor:index%2==0}" >
                    <div style="padding-top:14px;padding-bottom: 14px">
                        <div>
                            <div class="  f-fl g-paddingr-12">
                                <span class="icon iconfont icon-smallvisitors f-fs-28 color-blue g-mute-p">
                                </span>
                            </div>
                        </div>
                        <div :title="temp.displayText">{{temp.displayText}}</div>
                        <div>{{temp.phone}}</div>
                    </div>
                </td>
                <!--分享中-->
                <td :class="{bgcolor:index%2==0}"></td>
                <!--申请发言-->
                <td :class="{bgcolor:index%2==0}"></td>
                <!--会议操作-->
                <td :class="{bgcolor:index%2==0}" style="position: relative" width="40%">
                    <!--移除：讨论模式下，主席模式下：主持人可将除组织者外的所有人移除-->
                    <div class=" f-tac cursorp" style="position: absolute;left: 426px;top: 10px;" @click="openModal('removePerson', temp.entity, temp.displayText)">
                        <div class="icon iconfont icon-dissable_remove f-fs-38 color-forbid" onMouseOut="this.className='icon iconfont icon-dissable_remove f-fs-38 color-forbid'" onMouseOver="this.className='icon iconfont icon-dissable_remove f-fs-38 color-red '" onMouseDown="this.className='icon iconfont icon-remove f-fs-38 color-red '">
                        </div>
                        <div>{{$t("controlDetail.remove")}}</div>
                    </div>
                </td>
                <!--详情-->
                <td :class="{bgcolor:index%2==0}">
                    <div class="f-fl padding f-tac " style="padding-top:8px;padding-bottom: 8px">
                        <span>{{temp.userAgent}}</span>
                    </div>
                </td>
            </tr>
            <tr v-if="getlength().viewerLength == 0">
                <!--观众0个-->
                <th class="s-bg-left s-w-empty f-fw-norm f-tal f-fs-14 g-paddingl-26" :rowspan="1" v-if="audienceEnable">
                    <span class="f-fl f-lineh-15 g-padding-20">{{$t("controlDetail.audience")}}(0)</span>
                </th>
             </tr>
            <!-- ------无数据时---- -->
            <!-- <tr v-show="persons.masterLength===0&&persons.audienceLength===0&&persons.viewerLength===0">
                <td class="paddingtb" colspan="6">
                    <div class="f-tac v-align"> -->
                        <!-- <img src="../../assets/img/ctrl/noData.png" /> -->
                        <!-- <p class="f-fs-16 f-color ">暂无数据</p>
                    </div>
                </td>
            </tr> -->
        </table>

        <!--申请发言-->
        <el-dialog :title="$t('controlDetail.applyToSpeak')" :visible.sync="speak.show" style="width: 1200px;margin: auto auto" :before-close="closeModal()">
            <p class="tip-font-style" style="text-align: center">{{speak.displayText}} {{$t('controlDetail.applyToSpeak')}}</p>
            <div class="btn-padding" style="text-align: center">
                <el-button style="padding: 0.8em 3em; margin-bottom: 1em;width: 300px" size="large" type="primary" @click="speak.show = false; modifyMute(speak.entity, 'unblock')">{{$t( 'controlDetail.permit')}}</el-button>
                <br/>
                <el-button style="padding: 0.8em 3em; margin-bottom: 1em;width: 300px" size="large" type="primary" @click="speak.show = false; modifyMute(speak.entity, 'block')">{{$t( 'controlDetail.reject')}}</el-button>
                <br/>
                <el-button style="padding: 0.8em 3em;width: 300px" size="large" type="primary" @click="speak.show = false">{{$t( 'controlDetail.ignore')}}</el-button>
                <br/>
            </div>
        </el-dialog>
        <!--设置为访客-->
        <el-dialog class="dialog-set" :title="$t('controlDetail.notice')" :visible.sync="resetToGuest.show" :before-close="closeModal()">
            <p class="tip-font-style  f-tac">{{$t( 'controlDetail.setTogues', {displayText: resetToGuest.displayText})}}</p>
            <div class="btn-padding f-tac">
                <el-button class="dialog-button" size="large" type="primary" @click="resetToGuest.show = false; modifyUserPremission(resetToGuest.entity, 'attendee')">{{$t('controlDetail.confirm')}}</el-button>
                <el-button class="dialog-button" size="large" @click="resetToGuest.show = false">{{$t('controlDetail.cancel')}}</el-button>
            </div>
        </el-dialog>
        <!--设置为演讲者-->
        <el-dialog class="dialog-set" :title="$t('controlDetail.notice')" :visible.sync="demonstrator.show" :before-close="closeModal()">
            <p class="tip-font-style  f-tac" v-if="demonstrator.action === 'OnDemo'">{{$t( 'controlDetail.OnDemo', {displayText: demonstrator.displayText})}}</p>
            <p class="tip-font-style  f-tac" v-if="demonstrator.action === 'OffDemo'">{{$t( 'controlDetail.OffDemo', {displayText: demonstrator.displayText})}}</p>
            <div class="btn-padding f-tac">
                <el-button class="dialog-button" size="large" type="primary" @click="demonstrator.show = false; setDemonstrator(demonstrator.entity, demonstrator.action)">{{$t('controlDetail.confirm')}}</el-button>
                <el-button class="dialog-button" size="large" @click="demonstrator.show = false">{{$t('controlDetail.cancel')}}</el-button>
            </div>
        </el-dialog>
        <!--设置为主持人-->
        <el-dialog class="dialog-set" :title="$t('controlDetail.notice')" :visible.sync="resetToModerator.show" :before-close="closeModal()">
            <p class="tip-font-style  f-tac">{{$t( 'controlDetail.setTomoder', {displayText: resetToModerator.displayText})}}</p>
            <div class="btn-padding f-tac">
                <el-button class="dialog-button" size="large" type="primary" @click="resetToModerator.show = false; modifyUserPremission(resetToModerator.entity, 'presenter')">{{$t('controlDetail.confirm')}}</el-button>
                <el-button class="dialog-button" size="large" @click="resetToModerator.show = false">{{$t('controlDetail.cancel')}}</el-button>
            </div>
        </el-dialog>
        <!--移除-->
        <el-dialog class="dialog-remove" :title="$t('controlDetail.notice')" :visible.sync="removePerson.show" :before-close="closeModal()">
            <p class="tip-font-style f-tac">{{$t( 'controlDetail.removesb', {displayText: removePerson.displayText})}}</p>
            <div class="btn-padding f-tac">
                <el-button class="dialog-button" size="large" type="primary" @click="removePerson.show = false; removeMember(removePerson.entity)">{{$t('controlDetail.confirm')}}</el-button>
                <el-button class="dialog-button" size="large" @click="removePerson.show= false">{{$t('controlDetail.cancel')}}</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import auth from '@/services/authService'
import control from '@/services/meetingControl'
export default {
    data() {
        return {
            masterIndex: 0,//主持人index
            audienceIndex: 0,//访客index
            viewerIndex: 0,//观众index
            persons: {},//计算主持人访客观众的数量
            speak: {
                show: false,
                entity: null,
                displayText: null,
            }, //申请发言弹窗
            removePerson: {
                show: false,
                entity: null,
                displayText: null,
            }, //移除按钮的弹窗
            resetToGuest: {
                show: false,
                entity: null,
                displayText: null,
            }, //设置为访客的弹窗
            resetToModerator: {
                show: false,
                entity: null,
                displayText: null,
            }, //设置为主持人的弹窗
            demonstrator: {
                show: false,
                entity: null,
                displayText: null,
                action: null
            },//设置为演讲者的弹窗

            loginId: '',//假数据：当前登录账号（组织者）（支持人）

        }
    },
    props: ['dataListDown','audienceEnable'],
    watch: {
        'dataListDown': {
            deep: true,
            handler: function(value) {
                this.geindex();
                this.getlength();
            }
        }
    },
    mounted() {
        /**
         *主持人、访客、观众的数量
         */
        this.getlength();
    },
    created() {
        this.loginId = auth.getUser().personal.userId;
        /**
         * 主持人，访客、观众的第一条index
         */
        this.geindex();
    },
    methods: {
        /**
         * 弹窗操作的方法
         */
        closeModal(name) {
            this[name] = false
        },
        openModal(name, entity, displayText, action) {
            this[name]['show'] = true;
            this[name]['entity'] = entity;
            this[name]['displayText'] = displayText;
            if (action) {
                this[name]['action'] = action;
            }
        },
        /**
         *获取当前人数
         */
        getlength() {
            this.persons.masterLength = 0;
            this.persons.audienceLength = 0;
            this.persons.viewerLength = 0;
            for (let i = 0; i < this.dataListDown.Users.user.length; i++) {
                if (this.dataListDown.Users.user[i].rolesPri === 'presenter') {
                    this.persons.masterLength++;
                }
                else if (this.dataListDown.Users.user[i].rolesPri === 'attendee') {
                    this.persons.audienceLength++;
                }
                else if (this.dataListDown.Users.user[i].rolesPri === 'castviewer') {
                    this.persons.viewerLength++;
                }
            }
            return this.persons;
        },
        geindex() {
            //获取主持人的index
            for (let i = 0; i < this.dataListDown.Users.user.length; i++) {
                if (this.dataListDown.Users.user[i].rolesPri === 'presenter') {
                    this.masterIndex = i;
                    break;
                }
            }
            //获取访客的index
            for (let i = 0; i < this.dataListDown.Users.user.length; i++) {
                if (this.dataListDown.Users.user[i].rolesPri === 'attendee') {
                    this.audienceIndex = i;
                    break;
                }
            }
            //获取观众的Index
            for (let i = 0; i < this.dataListDown.Users.user.length; i++) {
                if (this.dataListDown.Users.user[i].rolesPri === 'castviewer') {
                    this.viewerIndex = i;
                    break;
                }
            }
        },
        // 禁言状态
        modifyMute(entity, action) {
            control.modifyMemberMedia({
                type: 'mute',
                ifilter: action,
                userEntity: entity
            }).then((res)=>{
                if(!res){
                    if(action === 'block')
                        this.$message.error(this.$t('controlDetail.failure.mute'));
                    else if(action === 'unblock')
                        this.$message.error(this.$t('controlDetail.failure.unMute'));
                }
            })
        },
        // 设为主持人、访客
        modifyUserPremission(entity, action) {
            control.modifyUserPremission(entity, action).then((res)=>{
                if(!res){
                    if(action === 'presenter')
                        this.$message.error(this.$t('controlDetail.failure.presenter'));
                    else if(action === 'attendee')
                        this.$message.error(this.$t('controlDetail.failure.attendee'));
                }
            })
        },
        // 移除
        removeMember(entity) {
            control.removeMember(entity).then((res)=>{
                if(!res){
                    this.$message.error(this.$t('controlDetail.failure.remove'));
                }
            })
        },
        //  设为演讲者、下台
        setDemonstrator(entity, action) {
            control.setDemonstrator(entity, action).then((res)=>{
                if(!res){
                    if(action === 'OnDemo')
                        this.$message.error(this.$t('controlDetail.failure.OnDemo'));
                    else if(action === 'OffDemo')
                        this.$message.error(this.$t('controlDetail.failure.OffDemo'));
                }
            })
        }

    }
}
</script>
<style lang="scss" scoped="">
@import "controlDown.scss";
@import "common.scss";
.account-width{
    min-width: 120px;
}
.content-width{
    min-width: 100px;
}
.detail-width{
    min-width: 90px;
}
</style>
