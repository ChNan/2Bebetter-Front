<template>
    <div class="g-bd">
        <!--页面头部-->
        <div class="g-hd">
            <!--通话设置-->
            <h3>{{$t('call.callSetting')}}</h3>
        </div>

        <div class="g-wrap call" style="padding-top:20px;">

            <el-form :model="form" label-width="240px" class="m-fm m-bss-fm rem-bss-fm">
                <!--视频布局-->
                <h5>{{$t('call.videoMode')}}</h5>
                <!--默认布局-->
                <el-form-item :label="$t('call.defaultMode')" class="u-fm-label">
                    <el-radio-group v-model="form.defaultLayout">
                        <!--等分模式-->
                        <el-radio label="Equality">{{$t('call.equalNxN')}}</el-radio>
                        <!--1+N模式-->
                        <el-radio label="SpeechExcitation">{{$t('call.onePlusN')}}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!--等分模式-->
                <el-form-item :label="$t('call.equalNxNm')" class="u-fm-label">
                    <el-select v-model="form.videoDividedMode" style="width:100%">
                        <el-option v-for=" it in 6" :value="it+1" :key="it+1" :label="it+1|mul"></el-option>
                    </el-select>
                    <el-row>
                        <!--设置视频等分布局的最大分屏数-->
                        <div class="u-hint">{{$t('call.equalNxNTip')}}</div>
                        <el-form>
                            <el-form-item>
                                <!--当视频方数>设定的最大分屏数，则每隔-->
                                <span>{{$t('call.equalNxNSeconds')}}&nbsp;</span>
                                <el-select v-model="form.intervalForDividedMode" placeholder="" size="small" style="width:70px;">
                                    <el-option v-for="(n,index) in timeList" :label="n+`s`" :value="n" :key="index"></el-option>
                                </el-select>

                            </el-form-item>
                            <!--单张视图轮巡(每次仅轮换1张)-->
                            <el-form-item>
                                <el-radio v-model="form.tourRoundForDividedMode" label="1">{{$t('call.equalNxNOneVideo')}}
                                    <span class="u-hint14"> &nbsp;{{$t('call.equalNxNOneVideoTip')}}</span>
                                </el-radio>
                            </el-form-item>
                            <!--全屏轮巡(每次轮换全屏视图)-->
                            <el-form-item>
                                <el-radio v-model="form.tourRoundForDividedMode" label="2">{{$t('call.equalNxNAllVideo')}}
                                    <span class="u-hint14"> &nbsp;{{$t('call.equalNxNAllVideoTip')}}</span>
                                </el-radio>
                            </el-form-item>
                        </el-form>
                    </el-row>
                </el-form-item>



                <!-- -------------1+N模式------------------ -->
                <el-form-item :label="$t('call.onePlusNm')" class="u-fm-label">

                    <!--1+N模式，允许值：0、4、7、9-->
                    <el-select v-model="form.videoOneplusNMode" placeholder="" style="width:100%">
                        <!--<el-option v-for="(n,index) in modeList" :label="'1+'+n" :value="index" :key="index"></el-option>-->
                        <el-option v-for="(item,index) in  modeList" :label="'1+'+item.value" :value="item.key" :key="item.key"></el-option>
                    </el-select>
                    <!--设置视频1+N布局下小视图的最大分屏数-->
                    <div class="u-hint">{{$t('call.onePlusNTip')}}</div>
                    <!--设定的最大分屏数-->
                    <el-form-item>
                        <!--当小视图方数>设定的最大分屏数，则每隔-->
                        <span>{{$t('call.onePlusNSeconds')}}&nbsp;</span>
                        <el-select v-model="form.intervalForOneplusNMode" placeholder="" size="small" style="width:70px;">
                            <el-option v-for="(n,index) in timeList" :label="n+`s`" :value="n" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <!--x张图轮巡-->
                    <el-form-item>
                        <el-radio label="1" v-model="form.tourRoundForOneplusNMode">&nbsp;</el-radio>
                        <el-select v-model="form.numberofPicForOneplusNMode" size="small" style="width:70px;">
                            <el-option v-for="n in picNum" :label="n" :value="n" :key="n"></el-option>
                        <!--张图轮巡-->
                        </el-select> {{$t('call.onePlusNOneVideo')}}
                        <!--(每次仅轮换1张小视图)-->
                        <span class="u-hint14"> &nbsp;{{$t('call.onePlusNOneVideoTip')}}</span>
                    </el-form-item>
                    <!-- 全屏轮巡-->
                    <el-form-item>
                        <!--全屏轮巡-->
                        <el-radio label="2" v-model="form.tourRoundForOneplusNMode" :disabled="form.videoOneplusNMode=== '0'"> &nbsp;</el-radio>
                       {{$t('call.onePlusNAllVideo')}}
                        <!--(每次轮换全屏视图)-->
                        <span class="u-hint14"> &nbsp;{{$t('call.onePlusNAllVideoTip')}}</span>
                    </el-form-item>
                    <el-form-item>
                        <!--语音激励时间：-->
                        <span>{{$t('call.VoiceActivated')}}</span>
                        <el-select v-model="form.numberofVoiceAcvitedTime" size="small" style="width:70px;">
                            <el-option v-for="n in 10" :label="n+`s`" :value="n" :key="n"></el-option>
                        </el-select>
                    </el-form-item>

                </el-form-item>

                <!--会议设置-->
                <h5>{{$t('call.Confsettings')}}</h5>
                <!--提前入会时间-->
                <el-form-item :label="$t('call.joinConfBeforehand')" class="u-fm-label">
                    <el-select v-model="form.forwardMeetingTime" placeholder="" style="width:100%">
                        <el-option v-for="(item,index) in timeList" v-if="item>3" :label="item+$t('call.minute')|minutes" :value="item" :key="item"></el-option>

                    </el-select>
                </el-form-item>

                <!--IVR服务-->
                <h5>{{$t('call.IVRService')}}</h5>
                <!--IVR语言-->
                <el-form-item :label="$t('call.IVRLanguage')" class="u-fm-label">
                    <el-select v-model="form.ivrLanguage" placeholder="" style="width:100%">
                        <el-option v-for="(item,index) in langList" :label="item.value" :value="item.key" :key="item.key"></el-option>
                    </el-select>
                </el-form-item>

                <!--保存按钮-->
                <el-form-item label=" " style="margin-top:36px;">
                    <el-button type="primary" :disabled="isAble" class="btn-width" @click="saveEdit()"> {{$t('enterprise.save')}}</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>
<script>
    import * as api from '../../api/setting/call'
    export default {
        name: 'phoneSetting',
        filters: {
            mul(value) {
                return "" + value + "*" + value;
            },
            minutes(value) {
                return value
            }
        },
        data() {
            return {
                picNum:[1,2,3,4,5,6,7],
                saveValue:'',
                timeList: [3, 5,10, 15, 30, 45, 60],
                langList: [
                    {
                    key: 'zh_CN',
                    value: this.$t('call.zh_CN')
                    },
                    {
                        key: 'en_US',
                        value: this.$t('call.en_US')
                    },
//                    {
//                        key: 'ru_RU',
//                        value: this.$t('call.ru_RU')
//                    },
//                    {
//                        key: 'pt_PT',
//                        value:this.$t('call.pt_PT')
//                    },
//                    {
//                        key: 'es_ES',
//                        value: this.$t('call.es_ES')
//                    },
//                    {
//                        key: 'pl_PL',
//                        value:this.$t('call.pl_PL')
//                    },
                ],
//                modeList: ['0', '4', '7', '9'],
                modeList: [
                    {
                        key: '0',
                        value: '0'
                    },
                    {
                        key: '4',
                        value: '4'
                    },
                    {
                        key: '7',
                        value: '7'
                    },
                    {
                        key: '9',
                        value: '9'
                    },
                ],
                form:{
                    "defaultLayout": "Equality",//默认布局
                    "videoDividedMode": "4",//等分模式的等分数
                    "intervalForDividedMode": 30,//等分模式下的视图轮巡间隔时间
                    "tourRoundForDividedMode": "1",//等分模式下的视图轮巡模式
                    "videoOneplusNMode": "4",//1+N模式
                    "intervalForOneplusNMode": 30,//1+N模式下的视图轮巡间隔时间
                    "numberofPicForOneplusNMode": 1,//1+N模式下的视图轮巡图片数目
                    "tourRoundForOneplusNMode": "1",//1+N模式下的视图轮巡模式
                    "numberofVoiceAcvitedTime": 2,//语音激励时间
                    "forwardMeetingTime": 30,//提前入会时间
                    "ivrLanguage": "zh_CN",//Ivr语言
                    "maxVideoResolution": "720P/30FPS",//最大视频分辨率
                    "maxSecondaryFlowResolution": "720P/30FPS",//最大辅流分辨率
                    "brandWidthStrategy": "1",//最大带宽
                    "audienceEnable": false//是否开启直播
                },
                saveData:{},
                is403:true,
            }
        },
        computed: {
            isAble() {
                for (let [key, value] of Object.entries(this.form)) {
                    if(this.saveData[key] !== value) {
                        return  false
                    }
                }
                return true
            }
        },
        watch: {
            'form': {
                deep: true,
                handler: function (value) {
//                    只要有个为空则使得按钮不可用
//                    for (let name of Object.keys(value)) {
//                        if (value[name] == '') {
//                            return;
//                        }
//                    }
//                    若值与原先的值不一致，则改变下拉框的默认值
                    if(this.saveValue!==this.form.videoOneplusNMode){
                        this.form.numberofPicForOneplusNMode=1;
                        this.picNum=parseInt(this.form.videoOneplusNMode);
                        if(this.picNum===0){
                            this.picNum=[1];
                        }
                        this.saveValue=this.form.videoOneplusNMode;
                    }





//                    if(this.form.defaultLayout!==this.saveData.defaultLayout)
//                    {
//                        this.isAble = false;
//                    }else{
//                        this.isAble = true;
//                    }

                }
            }
        },
        beforeRouteLeave(to, from, next) {
            if (from.path !== '/enterprise/call') {
                next(to.path)
            } else {
                //next()
                if (!this.isAble&&!this.is403) {
                    this.$confirm(this.$t('popUpWindow.tipContent'), this.$t('popUpWindow.tip'), {
                        confirmButtonText:this.$t('popUpWindow.confirm'),
                        cancelButtonText:this.$t('popUpWindow.cancel')
                    }).then(() => {
                        this.saveEdit();
                        next();
                    }).catch(() => {
                        next();
                    });
                } else {
                    next();
                }

            }
        },
        mounted() {
            this.talkConfig();
        },
        methods: {
            /**
             * 查询通话设置
             */
            talkConfig(){
                api.getTalkConfig().then(json=>{
                    if(json.ret > -1){
                        this.form = json.data;
                        this.form.videoDividedMode = parseInt(this.form.videoDividedMode);
                        this.saveData = Object.assign({}, this.form);
                        this.saveValue = this.saveData.videoOneplusNMode;
                        this.is403 = false;
                    }else{
                         if (json.error && json.error.errorCode) {
                            this.is403 = json.error.errorCode == 403;
                        }
                        this.saveData = Object.assign({},this.form);
                    }

                })
            },
            /**
             * 编辑通话设置
             */
            saveEdit() {
                let params =this.form;
                let res=api.editTalkConfig(params);
                res.then(json => {
                    if (json.ret === 0) {
                        this.$message({
                            message: this.$t('user.message.save.ok'),
                            type: 'success'
                        })
                        this.saveData = Object.assign({}, this.form);
                    }
                })
            },
        },

    }
</script>
<style lang="scss" scoped>
    @import '../../assets/scss/meeting.scss';
    h4 {
        @include fontsize(14px, bold, #333333);
        span {
            margin-left: 78px;
        }
    }
    .rem-bss-fm{
        width:800px!important;
    }
    .call{
        h5{
            width: 195px;
        }
    }
</style>
