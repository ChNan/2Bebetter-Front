<template>
    <div>
        <div class="layout-total">
            <div class="layout-items" v-show="!isShowBigOne">
                <a class="item" :class="{selected: currentLayout == 'Exclusive'}" @click="selectLayout(1)">
                    <div class="layout-item"></div>
                    <div class="mode-font-style">{{$t('controlDetail.layout.exclusive')}}</div>
                </a>
                <a class="item" :class="{selected: currentLayout == 'Equality'}" @click="selectLayout(2)">
                    <div class="layout-item"></div>
                    <div class="mode-font-style">{{$t('controlDetail.layout.equality')}}</div>
                </a>
                <a class="item" :class="{selected: currentLayout == 'SpeechExcitation' && currentMaxView == '1'}" @click="selectLayout(3)">
                    <div class="layout-item"></div>
                    <div class="mode-font-style">{{$t('controlDetail.layout.speechExcitation1')}}</div>
                </a>
                <a class="item" :class="{selected: currentLayout == 'SpeechExcitation' && currentMaxView != '1'}" @click="selectLayout(4)">
                    <div class="layout-item"></div>
                    <div class="mode-font-style">{{$t('controlDetail.layout.speechExcitationN')}}</div>
                </a>
            </div>

            <div class="layout-one-big" v-show="isShowBigOne">
                <ul v-if="this.profile === 'default'">
                    <li class="user-item" v-for="(item, index) in dataListMiddle.Users.user" :key="item.entity" @click="selectItem(item, index)" :class="{'bg-blue': item.rolesDemoState == 'demonstrator'}"
                    v-show="item.rolesPri != 'castviewer'">
                        <span class="icon iconfont icon-visitors"></span>
                        <span class="name">{{item.displayText | handleStr}}</span>
                    </li>
                </ul>
                <ul v-else-if="this.profile === 'demonstrator'">
                    <li class="user-item" v-for="(item, index) in dataListMiddle.Users.user" :key="item.entity" @click="selectItem(item, index)" :class="{'bg-blue': item.presenterDemostate == 'demonstrator'}" v-show="item.rolesPri === 'presenter'">
                        <span class="icon iconfont icon-visitors"></span>
                        <span class="name">{{item.displayText | handleStr}}</span>
                    </li>
                </ul>
            </div>

            <div class="f-tac btns">
                <el-button class="btn" size="large" type="primary" @click="confirm" :disabled="currentLayout=='Exclusive' && !selectedItem">{{$t('controlDetail.confirm')}}</el-button>
                <el-button class="btn" size="large" @click="cancel">{{$t('controlDetail.cancel')}}</el-button>
            </div>

        </div>
    </div>
</template>
<script type="es6">
    import control from '@/services/meetingControl'
    import {getLength, cutStr} from '@/assets/js/utils'
    export default {
        name: 'layout',
        components: {},
        props: {
            dataListMiddle: {
                type:Object,
                default: function () {
                    return {};
                }
            },
            layoutData: {
                type:Object,
                default: function () {
                    return {};
                }
            }
        },
        data() {
            return {
                isShowBigOne: false,
                selectedLayout: 0,
                currentLayout: '',
                currentMaxView: '',
                profile: '',
                selectedItem: null,
            }
        },
        mounted() {
            this.profile = this.dataListMiddle.Desc.profile;
            this.currentLayout = this.dataListMiddle.Desc.profile == 'default'
                ? this.dataListMiddle.View.videoLayout : this.dataListMiddle.View.videoPresenterLayout;
            this.currentMaxView = this.dataListMiddle.Desc.profile == 'default'
                ? this.dataListMiddle.View.videoMaxView : this.dataListMiddle.View.videoPresenterMaxView;
        },

        destroyed: function () {

        },

        filters: {
            handleStr: function (val) {
                return getLength(val) > 15 ? cutStr(val, 15) : val;
            }
        },

        methods: {
            // click events start
            selectLayout(position) {
                switch (position) {
                    case 1:
                        this.isShowBigOne = true;
                        this.layoutData.dialogTitle = this.$t('controlDetail.layout.exclusive');
                        this.currentLayout = 'Exclusive';
                        break;

                    case 2:
                        this.currentLayout = 'Equality';
                        break;

                    case 3:
                        this.currentLayout = 'SpeechExcitation';
                        this.currentMaxView = '1'
                        break;

                    case 4:
                        this.currentLayout = 'SpeechExcitation';
                        this.currentMaxView = 'N'
                        break;
                }
            },
            selectItem(item, index) {
                this.selectedItem = item;
                $('.user-item').removeClass('bg-blue');
                $($('.user-item').get(index)).addClass('bg-blue');
            },
            confirm() {
                let options = {
                    type: this.profile,
                    layout: this.currentLayout,
                };
                if (this.currentLayout == 'SpeechExcitation') {
                    options.viewnum = this.currentMaxView;
                }
                control.modifyConferenceLayout(options).then((arg) => {
                    if (arg) {
                        if (this.currentLayout == 'Exclusive') {
                            if(this.profile === 'default'){
                                control.setDemonstrator(this.selectedItem.entity, 'OnDemo');
                            }else if(this.profile === 'demonstrator'){
                                control.setPresenterDemonstrator(this.selectedItem.entity, 'OnDemo');
                            }
                            
                        }
                        this.layoutData.isShowLayoutDialog = false;
                    } else {
                        this.$message.error(this.$t('controlDetail.failure.layout'));
                    }
                });
            },
            cancel() {
                this.layoutData.isShowLayoutDialog = false;
            }
            // click events end
        }
    }
</script>

<style lang="scss" scoped>
    @import "../common";
    .layout-items {
        border: 1px solid #cccccc;
        padding: 30px 100px;
        height: 338px;
        position: relative
    }

    .layout-one-big {
        border: 1px solid #cccccc;
        padding: 10px 20px;
        height: 238px;
        position: relative;
        overflow: auto;
        li, ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .user-item {
            display: inline-block;
            /*background-color: #7dd1fa;*/
            height: 30px;
            border: 1px solid #ccc;
            margin-right: 10px;
            margin-top: 13px;
            cursor: pointer;
            padding: 5px 10px;
            line-height: 30px;
            width: 28%;
            span {
                float: left;
            }
            .icon {
                font-size: 30px;
                color: #1b97f4;
            }
            .name {
                height: 30px;
                margin-left: 10px;
                //max-width: 150px;
                text-overflow: ellipsis;
            }
        }
    }

    .bg-blue {
        background-color: #7dd1fa;
    }

    @mixin layout-position($top, $left) {
        position: absolute;
        top: $top;
        left: $left;
        cursor: pointer
    }

    .item {
        .layout-item {
            height: 128px;
            width: 213px;
            background-position: 0px 0px;
            &:hover {
                background-position: -213px 0px;
            }

        }
        &:nth-child(1) {
            @include layout-position(40px, 100px);
            div:first-child {
                background-image: url(./img/layout_1.png);
            }
        }
        &:nth-child(2) {
            @include layout-position(40px, 429px);
            div:first-child {
                background-image: url(./img/layout_2.png);
            }
        }
        &:nth-child(3) {
            @include layout-position(210px, 100px);
            div:first-child {
                background-image: url(./img/layout_3.png);
            }
        }
        &:nth-child(4) {
            @include layout-position(210px, 429px);
            div:first-child {
                background-image: url(./img/layout_4.png);
            }
        }
    }

    .selected {
        div:first-child {
            background-position: -426px 0px;
        }
        color: #2495ff;
    }

    .mode-font-style {
        padding-top: 11px;
        text-align: center;
        width: 211px;
        font-size: 14px;
        font-weight: 700;
    }

    .btns {
        padding-top: 26px;
    }

    .btn {
        padding: 0.8em 3em;
        &:nth-child(2) {
            margin-left: 60px
        }
    }
</style>
