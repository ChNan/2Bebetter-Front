
<template>
    <!-- -------搜索框与按钮-------- -->
    <div class="g-body g-paddingt-15 font-fam" >
        <!-- --------左侧搜索框-------- -->
        <div class="f-fl" @keyup.enter="handleIconClick">
                <el-input class="inline-input s-w-search" v-model="searchKey" icon="search" :fetch-suggestions="querySearch" :placeholder="$t('controlDetail.search.tip')" @select="handleSelect" :trigger-on-focus="false" :on-icon-click="handleIconClick"></el-input>
            </div>
        <!-- ----------右侧按钮-------- -->
        <div class="f-fr u-control-btns">
            <!--全员解言按钮-->
            <el-button type="primary" v-show="forbidAll" @click="forbidClick(1)">
                <div>
                    <i class="icon iconfont icon-allmute "></i>
                    {{$t("controlDetail.unmuteAll")}}
                </div>
            </el-button>

            <!--全员禁言按钮-->
            <el-button type="danger" v-show="!forbidAll" @click="forbidClick(2)">
                <div>
                    <i class="icon iconfont icon-allmute "></i>
                    {{$t("controlDetail.muteAll")}}
                </div>
            </el-button>

            <!--邀请按钮-->
            <el-button type="primary" @click="invitationData.isShowInvitationDataDialog = true">
                <div>
                    <i class="icon iconfont icon-add "></i>
                    {{$t("controlDetail.invite")}}
                </div>
            </el-button>

            <!--锁按钮-->
            <el-button type="primary" @click="lockOrNot">
                <div v-show="dataListMiddle.State.policy == '1'">
                    <i class="icon iconfont icon-unlock "></i>
                    {{$t("controlDetail.unlock")}}
                </div>
                <div v-show="dataListMiddle.State.policy == '3'">
                    <i class="icon iconfont icon-lock "></i>
                    {{$t("controlDetail.lock")}}
                </div>
            </el-button>

            <!--  布局按钮-->
            <el-button type="primary" @click="openLayoutDialog" v-if="dataListMiddle.Desc.profile != 'demonstrator'">
                <div>
                    <i class="icon iconfont icon-layout "></i>
                    {{$t("controlDetail.layout")}}
                </div>
            </el-button>

            <!--退出按钮-->
            <el-button type="danger" @click="exitData.isShowExitDialog = true">
                <div>
                    <i class="icon iconfont icon-export "></i>
                    {{$t("controlDetail.exit")}}
                </div>
            </el-button>
        </div>

        <!--邀请弹窗 start-->
        <el-dialog custom-class="invite-pd20" class="dialog-invited" :title="$t( 'controlDetail.inviteTip', {number: dataListMiddle.Desc.confNumber})" :visible.sync="invitationData.isShowInvitationDataDialog" :before-close="closeModal()">
            <invitation v-if="invitationData.isShowInvitationDataDialog" :invitationData="invitationData"></invitation>
        </el-dialog>
        <!--邀请弹窗 end-->

        <!--布局的弹窗 start-->
        <el-dialog custom-class="invite-pd20" class="dialog-width" :title="layoutData.dialogTitle" :visible.sync="layoutData.isShowLayoutDialog" :before-close="closeModal()">
            <layout v-if="layoutData.isShowLayoutDialog" :dataListMiddle="dataListMiddle" :layoutData="layoutData"></layout>
        </el-dialog>
        <!--布局的弹窗 end-->


        <!--退出的弹窗 start -->
        <el-dialog  class="dialog-exit" :title="$t('controlDetail.exitConf')" :visible.sync="exitData.isShowExitDialog" :before-close="closeModal()">
            <exit :exitData="exitData"></exit>
        </el-dialog>
        <!--退出的弹窗 end -->
    </div>
</template>
<script>
    import control from '@/services/meetingControl'
    import ElButton from "yl-element/packages/button/src/button";
    import Layout from "./Layout.vue";
    import Exit from "./Exit.vue";
    import Invitation from "./Invitation.vue";

    export default{
        props: {
            dataListMiddle: {
                type:Object,
                default: function () {
                    return {};
                }
            },

        },
        components: {
            Invitation,
            Exit,
            Layout,
            ElButton,
        },
        mounted() {

        },
        data(){
            return{
                forbidAll:false,//全员解言禁言的控制显示
                isLocked: false,
                searchKey:'',//模糊搜索的默认值

                invitationData: {
                    isShowInvitationDataDialog: false,
                    dataListMiddle:this.dataListMiddle,
                },

                exitData: {
                    isShowExitDialog: false,
                },

                layoutData: {
                    dialogTitle: this.$t('controlDetail.layout.check'),
                    isShowLayoutDialog: false,
                }
            }
        },
        watch: {
            'dataListMiddle': {
                deep: true,
                handler: function(value) {
                    this.invitationData.dataListMiddle=this.dataListMiddle;
                    this.forbidAll = this.dataListMiddle.View.muteAll;
                }
            }
        },
        created() {
             this.forbidAll = this.dataListMiddle.View.muteAll;
        },
        methods:{
            openLayoutDialog() {
                this.layoutData.isShowLayoutDialog = true;
                this.layoutData.dialogTitle = this.$t('controlDetail.layout.check');
            },
            /**
             * 弹窗操作的方法
             */
            closeModal(name) {
                this[name] = false
            },
            openModal(name) {
                this[name] = true;
            },

            forbidClick(position) {
                switch (position) {
                    case 1:
                        control.modifyMembersMute('unblock').then((arg) => {
                            if (arg) {
                                this.forbidAll = false;
                            } else {
                                this.$message.error(this.$t('controlDetail.failure.unMute'));
                            }
                        });
                        break;

                    case 2:
                        control.modifyMembersMute('block').then((arg) => {
                            if (arg) {
                                this.forbidAll = true;
                            } else {
                                this.$message.error(this.$t('controlDetail.failure.mute'));
                            }
                        });
                        break;
                }

            },

            lockOrNot() {
                if (this.dataListMiddle.State.policy == '1') {
                    control.modifyConferenceLock('3').then((arg)=>{
                        if (!arg) {
                            this.$message.error(this.$t('controlDetail.failure.unLock'));
                        }
                    });

                } else {
                    control.modifyConferenceLock('1').then((arg) => {
                        if (!arg) {
                            this.$message.error(this.$t('controlDetail.failure.lock'));
                        }
                    });
                }
            },

            querySearch(queryString, cb) {
                let users = this.dataListMiddle.Users.user;
                let results = queryString ? users.filter(this.createFilter(queryString)) : users;
                // 调用 callback 返回建议列表的数据
                let items=[];
                results.forEach(function(val) {
                    items.push({'value':val.displayText})
                }, this);
                cb(items);
            },
            createFilter(queryString) {
                return (users) => {
                    return (users.displayText.indexOf(queryString.toLowerCase()) === 0 || users.phone.indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(item) {
                this.$emit('filter', item)
            },
            handleIconClick() {
                this.$emit('filter', this.searchKey)
            }
        }
    }
</script>
<style lang="scss">
    .dialog-width {
        width: 1320px;
        margin: auto auto;
    }

    .dialog-exit {
        width: 1200px;
        margin: auto auto;
    }

    /*.el-dialog--small {*/
        /*width: 60%!important;*/
    /*}*/
    /*.el-dialog__body {*/
        /*padding: 20px 20px 20px 20px;*/
    /*}*/




</style>
<style lang="scss" scoped="">

    @import '../common';
    .dialog-invited {
        min-width: 1400px;
    }

    .s-w-search {
        width: 300px;
        height: 34px;
        background-color: #ffffff;
    }

    .dialog-lock {
        width: 900px;
        margin: auto auto;
    }

    .dialog-forbidall {
        width: 900px;
        margin: auto auto;
    }

    .btn-padding {
        margin: 1.5em 1em;
    }

</style>
