<template>
    <div class="g-content">
        <div class="m-cover">
            <el-card class="full clearfix" style="border-radius:20px;">
                <div slot="header" class="clearfix">
                    <span class="title">{{title}}</span>
                    <div class="f-fr link">
                        <router-link to="/admin/setmenu">
                            <i class="iconfont icon-fanhuishangyiji"></i>{{$t('enterprise.return')}}
                        </router-link>
                    </div>
                </div>
                <el-card class="border">
                    <div slot="header" class="clearfix">
                        <h4>{{subtitle}}</h4>
                    </div>
                    <el-row style="margin: 20px 0;">
                        <el-col :span="1" style="min-width:80px;">
                            <div :class="{'m-small__cloud':index ==0,'m-small__room':index == 1,'m-small__port':index == 2}">
                                <i class="u-logo__cloud" v-if="index == 0"></i>
                                <i class="u-logo__room" v-if="index == 1"></i>
                                <i class="u-logo__port" v-if="index == 2"></i>
                            </div>
                        </el-col>
                        <div class="">
                            <el-col :span="9" style="min-width:420px;">
                                <ul v-if="index == 0">
                                    <li>
                                        <h5>{{$t('order.suit.cloudbasic')}}</h5>
                                    </li>
                                    <li>
                                        <span class="u-nonwrap">{{$t('order.desc.description')}}</span>
                                        <span class="u-hint14 u-nonwrap">{{$t('order.detail.cloudbasic')}}</span>
                                    </li>
                                </ul>
                                <ul v-if="index == 1">
                                    <li>
                                        <h5>{{$t('order.suit.temvmr')}}</h5>
                                    </li>
                                    <li>{{$t('order.desc.limit')}}
                                        <span class="u-hint14">4+4/8+8/12+12 {{$t('enterprise.way')}}</span>
                                    </li>
                                    <li>{{$t('order.sold.limit')}}
                                        <span class="u-hint14">20%</span>
                                    </li>
                                    <li>{{$t('order.desc.description')}}
                                        <span class="u-hint14">{{$t('order.sold.descterm')}}</span>
                                    </li>
                                </ul>
                                <ul v-if="index == 2">
                                    <li>
                                        <h5>{{$t('order.suit.cloudport')}}</h5>
                                    </li>
                                    <li>{{$t('order.desc.limit')}}
                                        <span class="u-hint14">{{$t('order.sold.descport')}}</span>
                                    </li>
                                    <li>{{$t('order.sold.limit')}}
                                        <span class="u-hint14">50%</span>
                                    </li>
                                    <li>{{$t('order.desc.description')}}
                                        <span class="u-hint14">{{$t('order.sold.descportcloud')}}</span>
                                    </li>
                                </ul>
                            </el-col>
                            <el-col :span="9">
                                <ul v-if="index == 0">
                                    <li>
                                        <h5>{{$t('order.suit.temvmr')}}</h5>
                                    </li>
                                    <li>{{$t('order.desc.limit')}}
                                        <span class="u-hint14">n {{$t('enterprise.way')}}</span>
                                    </li>
                                    <li>{{$t('order.desc.description')}}
                                        <span class="u-hint14">{{$t('order.sold.desctermvmr')}}</span>
                                    </li>
                                </ul>
                                <ul v-if="index == 1">
                                    <li>
                                        <h5>{{$t('order.detail.cloudvmr')}}</h5>
                                    </li>
                                    <li>{{$t('order.desc.limit')}}
                                        <span class="u-hint14">10/25/50/100/200 {{$t('enterprise.way')}}</span>
                                    </li>
                                    <li>{{$t('order.sold.limit')}}
                                        <span class="u-hint14">20%</span>
                                    </li>
                                    <li>{{$t('order.desc.description')}}
                                        <span class="u-hint14">{{$t('order.sold.desccloudvmr')}}</span>
                                    </li>
                                </ul>
                                <ul v-if="index == 2">
                                    <li>
                                        <h5>{{$t('order.suit.temvmr')}}</h5>
                                    </li>
                                    <li>{{$t('order.desc.limit')}}
                                        <span class="u-hint14">16/24 {{$t('enterprise.way')}}</span>
                                    </li>
                                       <li>{{$t('order.sold.limit')}}
                                        <span class="u-hint14">20%</span>
                                    </li>
                                    <li>{{$t('order.desc.description')}}
                                        <span class="u-hint14">{{$t('order.sold.descmulvmr')}}</span>
                                    </li>
                                </ul>
                            </el-col>
                        </div>
    
                    </el-row>
                </el-card>
            </el-card>
        </div>
    </div>
</template>

<style lang="scss" scoped>
ul {
    list-style: none;
    margin-top: 0;
    padding-bottom: 0;
    margin-bottom: 0;

    li {
        font-size: 14px;
        margin-top: 6px;
        color: #333;

        &:first-child {
            margin-top: 0;
        }
    }
}

.u-nonwrap {
    white-space: nowrap;
}

.border {
    border: 1px solid #e0e0e0 !important;
}

h4 {
    line-height: 23px;
    color: #333;
}

h5 {
    margin-bottom: 10px;
    display: inline-block;
}

.u-hint14 {
    font-size: 14px;
    color: #999;
}
</style>

<script>
export default {
    data() {
        return {
            title: this.$t('order.sold.detail'),
            subtitle: '',
            index: 0,
            titleList:{
                0: this.$t('enterprise.suitClourd'),
                1: this.$t('enterprise.suitTerm'),
                2: this.$t('enterprise.suitPort')
            }
        }
    },
    created() {
        //this.index= this.$router
        this.index = this.$route.query.index;
        this.subtitle = this.titleList[this.index];
        
    }
}
</script>
