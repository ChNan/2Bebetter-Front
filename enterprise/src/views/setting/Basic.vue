<template>
    <div class="g-bd">
        <!--页面头部-->
        <div class="g-hd">
            <!--基本设置-->
            <h3>{{$t('basic.settings')}}</h3>
        </div>
        <div class="g-wrap">
            <el-form :model="form" label-width="240px" class="u-fm ">
                <!--预约默认时区：-->
                <el-form-item :label="$t('basic.timeZone')" class="u-fm-label">
                    <el-select v-model="form.conferenceTimeZone" style="width:100%">
                        <el-option v-if="lan==='zh-CN'" v-for="item in timeZones" :key="item.zoneId" :label="item.cnZoneName"
                                   :value="item.zoneId"></el-option>
                        <el-option v-if="lan==='en-US'" v-for="item in timeZones" :key="item.zoneId" :label="item.usZoneName"
                                   :value="item.zoneId"></el-option>
                    </el-select>
                </el-form-item>
                <!--默认启用夏令时：-->
                <el-form-item :label="$t('enterprise.summerTime')" class="u-fm-label">
                    <el-select v-model="form.summerTime" placeholder="" style="width:100%">
                        <!--停用和启动-->
                        <el-option :label="$t('enterprise.stop')" :value="0"></el-option>
                        <el-option :label="$t('enterprise.start')" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <!--保存-->
                <el-form-item label=" " style="margin-top:36px;">
                    <el-button type="primary" :disabled="isAble" class="btn-width" @click="saveEdit()">
                        {{$t('enterprise.save')}}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import * as api from '../../api/setting/basic'
    import {language} from '@/i18n/index'
    export default {
        name: 'basicSetting',
        created() {},
        beforeRouteLeave(to, from, next) {
            if (from.path !== '/enterprise/basic') {
                next(to.path)
            } else {
                if (!this.isAble && !this.is403) {
                    this.$confirm(this.$t('popUpWindow.tipContent'), this.$t('popUpWindow.tip'), {
                        confirmButtonText: this.$t('popUpWindow.confirm'),
                        cancelButtonText:this.$t('popUpWindow.cancel')
                    }).then(() => {
                        //确定执行
                        this.saveEdit();
                       // console.log("then")
                        next();
                    }).catch(() => {
                        //取消执行
                        //console.log("catch")
                        next();
                    });
                } else {
                    next();
                }

            }
        },
        data() {
            return {
                form: {
                    summerTime: '0',
                    conferenceTimeZone: ''
                },
                saveData: {},
                datetime: '',
                timeZones: [],
                lan:'zh-CN',
                is403:true
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
        mounted(){
            this.getTimeZone();
            this.getTimeZones();
        },
        methods: {
            /**
             * 获取默认的时区和夏令时
             */
            getTimeZone(){
                api.getTimeConfig().then(json => {
                    if(json.ret > -1){
                        this.form = Object.assign({}, json.data);
                        this.saveData = Object.assign({}, json.data);
                        this.form.summerTime = parseInt(this.form.summerTime);
                        this.is403 = false;
                    }else{
                        if(json.error && json.error.errorCode){
                            this.is403 = json.error.errorCode == 403;
                        }
                        this.saveData = Object.assign(this.form);
                    }

                })
            },
            /**
             * 获取时区
             */
            getTimeZones(){
                this.lan=language();
                api.getTimeZons().then(json => {
                    if(json.ret > -1){
                        this.timeZones = json.data;
                    }


                })
            },
            /**
             * 保存编辑
             */
            saveEdit() {
                api.editTimeZone(this.form).then(json => {
                    if (json.ret === 0) {
                        this.$message({
                            message: this.$t('user.message.save.ok'),
                            type: 'success'
                        })
                        this.saveData = Object.assign({}, this.form);
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import '../../assets/scss/meeting.scss';

    .u-fm {
        padding-top: 20px;
        width: 800px;
        .el-form-item {
            margin-left: 10px;
        }
    }
</style>
