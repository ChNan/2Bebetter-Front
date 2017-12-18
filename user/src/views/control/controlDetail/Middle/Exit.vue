<template>
    <div class="exit-wrapper">
        <p class="tip-font-style f-tac">{{$t( 'controlDetail.exitTip')}}</p>
        <div class="btn-padding f-tac">
            <div>
                <el-button class="btn" size="large" type="primary" @click="leaveMeeting(1)">{{$t('controlDetail.endConf')}}</el-button>
            </div>

            <div>
                <el-button class="btn" size="large" @click="leaveMeeting(2)">{{$t('controlDetail.leave')}}</el-button>
            </div>

            <div>
                <el-button class="btn-last" size="large" @click="exitData.isShowExitDialog = false">{{$t('controlDetail.cancel')}}</el-button>
            </div>
        </div>
    </div>
</template>
<script type="es6">
    import control from '@/services/meetingControl'
    export default {
        name: 'exit',
        props: {
            exitData: {
                type:Object,
                default: function () {
                    return {};
                }
            }
        },
        data() {
            return {
                // TODO
            }
        },
        methods: {
            leaveMeeting(position) {
                switch (position) {
                    case 1:
                        control.deleteConference();
                        this.exitData.isShowExitDialog = false;
                        this.$router.push({path:'/meeting'})
                        break;

                    case 2:
                        control.destroyConferences();
                        this.exitData.isShowExitDialog = false;
                        this.$router.push({path:'/meeting'})
                        break;
                }
            },
        },

    }
</script>

<style lang="scss" scoped>
    @import "../common";
    .exit-wrapper {
        .btn {
            padding: 0.8em 3em;
            margin-bottom: 2em;
            width: 300px;
        }
        .btn-last {
            padding: 0.8em 3em;
            width: 300px;
        }
    }
    .tip-font-style {
        padding-bottom: 26px;
        font-size: 18px;
    }
</style>
