<template>
    <div class="s-index">
        <rotation :items="items" v-if="items.length > 0"></rotation>
        <div class="m-company">
            <div class="u-logo">
                <img src="../assets/img/welcome.png">
            </div>
            <div class="u-info">
                <p class="u-tt">{{company}}</p>
                <div class="u-tips" v-if="type=='vip' && status !='expired'" :style="{ backgroundColor: colorType[0] }">
                    <i class="icon iconfont icon-vip"></i>
                    <span>{{$t('dashboard.vip.service')}}</span>
                </div>
                <div class="u-tips" v-else-if="type=='vip' && status=='expired'" :style="{ backgroundColor: colorType[1] }">
                    <i class="icon iconfont icon-vip"></i>
                    <span>{{$t('dashboard.vip.expired')}}</span>
                </div>
                <div class="u-tips" v-else-if="type=='trial' && status !='expired'" :style="{ backgroundColor: colorType[2] }">
                    <i class="icon iconfont icon-shiyongkehu"></i>
                    <span>{{$t('dashboard.trial.service')}}</span>
                </div>
                <div class="u-tips" v-else-if="type=='trial' && status=='expired'" :style="{ backgroundColor: colorType[3] }">
                    <i class="icon iconfont icon-shiyongkehu"></i>
                    <span>{{$t('dashboard.trial.expired')}}</span>
                </div>
                <div class="u-ct" v-if="type=='vip'">
                    <span>{{$t('dashboard.mainPackage')}} {{mainPpackage}}</span>
                    <router-link class="s-fc" :to="{name:'service', params:{action:''}}">{{$t('dashboard.view')}}</router-link>
                </div>
            </div>
        </div>
        <div class="m-statistics">
            <div class="u-hd">
                <p> {{$t('dashboard.overview.preview')}}</p>
            </div>
            <div class="u-ct">
                <div class="u-lst">
                    <div class="u-data">
                        <router-link class="s-fc" :to="{path:'/enterprise/state', query:{target:'confList'}}">{{getGeneralView.conferenceAmount}}</router-link>
                    </div>
                    <div class="u-info">{{$t('dashboard.overview.conferenceAmount')}}</div>
                </div>
                <div class="u-lst">
                    <div class="u-data">
                        <router-link class="s-fc" :to="{path:'/enterprise/state', params:{action:''}}">{{getGeneralView.onlineStaffAmount}}</router-link>
                    </div>
                    <div class="u-info">{{$t('dashboard.overview.onlineStaffAmount')}}</div>
                </div>
                <div class="u-lst">
                    <div class="u-data">
                        <router-link class="s-fc" :to="{path:'/enterprise/user', params:{action:''}}">{{getGeneralView.staffAmount}}</router-link>
                    </div>
                    <div class="u-info">{{$t('dashboard.overview.staffAmount')}}</div>
                    <div class="s-fc">
                        <router-link :to="{path:'/enterprise/user', query:{ target:'add'}}">
                            <i class="icon iconfont icon-tianjia"></i>
                            <span>{{$t('dashboard.overview.add')}}</span>
                        </router-link>
                    </div>
                </div>
                <div class="u-lst">
                    <div class="u-data">
                        <router-link class="s-fc" :to="{path:'/enterprise/room', params:{action:''}}">{{getGeneralView.conferenceRoomAmount}}</router-link>
                    </div>
                    <div class="u-info">{{$t('dashboard.overview.conferenceRoomAmount')}}</div>
                    <div class="s-fc">
                        <router-link :to="{path:'/enterprise/room', query:{target:'add'}}">
                            <i class="icon iconfont icon-tianjia"></i>
                            <span>{{$t('dashboard.overview.add')}}</span>
                        </router-link>
                    </div>
                </div>
                <div class="u-lst">
                    <div class="u-data">
                        <router-link class="s-fc" :to="{path:'/enterprise/cloud', params:{action:''}}">{{getGeneralView.vmrAmount}}</router-link>
                    </div>
                    <div class="u-info">{{$t('dashboard.overview.vmrAmount')}}</div>
                    <div class="s-fc" v-if="!!getGeneralView.hasCloudPort">
                        <router-link :to="{path:'/enterprise/cloud', query:{target:'add'}}">
                            <i class="icon iconfont icon-tianjia"></i>
                            <span>{{$t('dashboard.overview.add')}}</span>
                        </router-link>
                    </div>

                </div>

            </div>
        </div>
        <div class="m-charts">
            <div :span="12" class="m-meet">
                <div class="u-hd">
                    <p>{{$t('dashboard.meeting.overview')}}</p>
                </div>
                <div class="u-pie">
                    <IEcharts :option="bar" :loading="loading" @ready="onReady" @click="onClick"></IEcharts>
                </div>
                <div class="u-percent">
                    <ul>
                        <li v-for="(item, index) in percent" :key="index">{{item}}%</li>
                    </ul>
                </div>
            </div>
            <div :span="12" class="m-root">
                <div class="u-hd">
                    <p>{{$t('dashboard.room.overview')}}</p>
                </div>
                <div class="u-pie">
                    <IEcharts :option="bar2" :loading="loading" @ready="onReady" @click="onClick"></IEcharts>
                </div>
                <div class="u-percent">
                    <ul>
                        <li v-for="(item, index) in percentRoom" :key="index">{{item}}%</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import IEcharts from 'vue-echarts-v3/src/lite.vue'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/legend'
import rotation from '@/components/rotation'
import auth from '@/services/authService'
import * as api from '../api/dashboard'
import { t } from '@/i18n/index'

const options = {
    tooltip: {
        show: false,
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)",
        triggerOn: 'none',
        itemGap: 28
    },
    // color: ['#f75d5d', '#ffb726', '#2ba9f1', '#8f9ef4', '#4dc9a0', '#ff9e6e'],
    legend: {
        orient: 'vertical',
        x: 'right',
        top: 'middle',
        align: 'left',
        itemGap: 28,
        data: []
    },
    series: [
        {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            // hoverAnimation: false,
            avoidLabelOverlap: false,
            center: ['30%', '50%'],
            label: {
                normal: {
                    show: false,
                    position: 'center',
                    formatter: '{b}: {d}%'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '12',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: []
        }
    ]
}

const suiteType = {
    trial: t('dashboard.trial'),
    basic: t('dashboard.basic'),
    vmr: t('dashboard.vmr'),
    cloudPort: t('dashboard.cloudPort')
}
export default {
    name: 'view',
    components: {
        IEcharts, rotation
    },
    mounted: function() {

    },
    data: () => ({
        loading: true,
        bar: {},
        bar2: {},
        items: [],//即将过期订单
        type: 'trial',//vip vip,1 vip过期，trial 试用， 3 试用过期
        status: '',
        colorType: ["#ffb22c", "#ccc", "#9fabe8", "#ccc"],
        company: '',
        mainPpackage: null, //主套餐
        getGeneralView: {
            conferenceAmount: 0,//当前会议总数
            onlineStaffAmount: 0,// 在线用户
            conferenceRoomAmount: 0, //会议室总数
            vmrAmount: 0, //云会场总数
            staffAmount: 0, //用户总数
            hasCloudPort:false
        },
        percent: [0, 0, 0],
        percentRoom: [0, 0, 0]
    }),
    created() {
        this.doRandom();
        this.findExpiringOrders();
        this.getOrder();
        // 获取企业信息
        if (auth.getEnterprise()) {
            let userObj = auth.getEnterprise();
            this.type = userObj.enterprise.type;
            this.status = userObj.enterprise.status;
            this.company = userObj.enterprise.company;
        }
        this.getGeneral()
    },
    methods: {
        // 企业快要过期的订单
        findExpiringOrders() {
            api.getOrderList('', false, '')
                .then(response => {
                    if (response.ret > 0) {
                        response.data.forEach(function(val) {
                            if (val.suiteType == 'trial') {
                                this.items.push( this.$t('dashboard.trial.order', {order:suiteType[val.suiteType], date:this.dateFormat(val.endDate)}))
                            } else {
                                this.items.push( this.$t('dashboard.vip.order', {order:suiteType[val.suiteType], date:this.dateFormat(val.endDate)}))
                            }
                        }, this);
                    }
                })
        },

         // 概况统计
        getOrder() {
            api.getOrderNow('', false, '')
                .then(response => {
                    if (response.ret > 0) {
                        this.mainPpackage = suiteType[response.data['suiteType']]
                    }
                })
        },

        // 概况统计
        getGeneral() {
            api.getGeneralView('', false, '')
                .then(response => {
                    if (response.ret > 0) {
                        Object.assign(this.getGeneralView, response.data)
                    }
                })
        },

        doRandom() {
            // 当前会议概况
            api.getConferenceAmount('', false, '')
                .then(response => {
                    let data = [
                        { value: 0, name: this.$t('dashboard.meeting.meetnow') },
                        { value: 0, name: this.$t('dashboard.meeting.recurrence') },
                        { value: 0, name: this.$t('dashboard.meeting.p2p') },
                    ];
                    if (response.ret > 0) {
                        let res = response.data
                        data[0]['value'] = res.meetNowAmount
                        data[1]['value'] = res.recurrenceAmount
                        data[2]['value'] = res.p2pAmount
                        let total = res.meetNowAmount + res.recurrenceAmount + res.p2pAmount
                        this.percent[0] = res.meetNowAmount == 0 ? res.meetNowAmount : ((res.meetNowAmount / total).toFixed(4) * 100).toFixed(2);
                        this.percent[1] = res.recurrenceAmount == 0 ? res.recurrenceAmount : ((res.recurrenceAmount / total).toFixed(4) * 100).toFixed(2);
                        this.percent[2] = res.p2pAmount == 0 ? res.p2pAmount : ((res.p2pAmount / total).toFixed(4) * 100).toFixed(2);
                    }

                    let data2 = [this.$t('dashboard.meeting.meetnow'), this.$t('dashboard.meeting.recurrence'), this.$t('dashboard.meeting.p2p')];

                    let g = Object.assign({}, options);
                    this.bar = JSON.parse(JSON.stringify(g));

                    this.bar.series[0].data = data;
                    this.bar.legend.data = data2;
                    this.bar.color = ['#f75d5d', '#ffb726', '#2ba9f1'];
                })

            // 当前会议室概况
            api.getRoomAmount('', false, '')
                .then(response => {
                    let _data = [
                        { value: 0, name: this.$t('dashboard.room.vcRoomAmount') },
                        { value: 0, name: this.$t('dashboard.room.vmrRoomAmount') },
                        { value: 0, name: this.$t('dashboard.room.normalRoomAmount') },
                    ];
                    if (response.ret > 0) {
                        let res = response.data
                        _data[0]['value'] = res.vcRoomAmount
                        _data[1]['value'] = res.vmrRoomAmount
                        _data[2]['value'] = res.normalRoomAmount
                        let total = res.vcRoomAmount + res.vmrRoomAmount + res.normalRoomAmount
                        this.percentRoom[0] = res.vcRoomAmount == 0 ? res.vcRoomAmount : ((res.vcRoomAmount / total).toFixed(4) * 100).toFixed(2);
                        this.percentRoom[1] = res.vmrRoomAmount == 0 ? res.vmrRoomAmount : ((res.vmrRoomAmount / total).toFixed(4) * 100).toFixed(2);
                        this.percentRoom[2] = res.normalRoomAmount == 0 ? res.normalRoomAmount : ((res.normalRoomAmount / total).toFixed(4) * 100).toFixed(2);
                    }
                    let _data2 = [this.$t('dashboard.room.vcRoomAmount'), this.$t('dashboard.room.vmrRoomAmount'), this.$t('dashboard.room.normalRoomAmount')];

                    let m = Object.assign({}, options);
                    this.bar2 = JSON.parse(JSON.stringify(m));

                    this.bar2.series[0].data = _data;
                    this.bar2.legend.data = _data2;
                    this.bar2.color = ['#8f9ef4', '#4dc9a0', '#ff9e6e'];
                })

            this.loading = !this.loading;

        },
        onReady(instance) {
            console.log(instance);
        },
        onClick(event, instance, echarts) {
            console.log(arguments);
        },
        dateFormat(date) {
            if(date)
                return date.replace(/-/g,'/')
        },
    }
};
</script>

<style lang="scss" scoped>
@mixin left {
    float: left;
}

@mixin right {
    float: right;
}


.s-index {

    p,
    ul,
    li {
        margin: 0;
        padding: 0;
    }

    ul,
    li {
        list-style: none;
    }
    padding: 28px 20px 20px;
    background: #ebeff5;
    min-width: 935px;
    .m-company {
        margin-top: 10px;
        background: #fff;
        height: 172px;
        border-radius: 8px;
        .u-logo {
            @include left;
            padding: 32px 20px 30px 30px;
            img {
                border: none;
                width: 108px;
                height: 108px;
                border-radius: 8px;
            }
        }
        .u-info {
            margin-top: 32px;
            @include left;
            .u-tt {
                font-size: 18px;
                margin-top: 6px;
                margin-bottom: 17px;
            }
            .u-tips {
                display: inline;
                border-radius: 14px;
                color: #fff;
                font-size: 14px;
                text-align: center;
                padding: 5px 16px 4px;
                span {
                    margin-left: 6px;
                }
                .icon-vip {
                    font-size: 18px;
                }
            }
            .u-ct {
                margin-top: 18px;
                font-size: 14px;
                .s-fc {
                    color: #2699f4;
                    margin-left: 21px;
                    &:hover {
                        color: #51adf6;
                    }
                }
            }
        }
    }
    .m-statistics {
        height: 260px;
        border-radius: 8px;
        background-color: #fff;
        margin-top: 20px;
        .u-ct {
            .u-lst {
                height: 199px;
                width: 20%;
                text-align: center;
                @include left;
                .u-data {
                    font-size: 45px;
                    font-weight: bold;
                    margin-top: 42px;
                    font-family: Arial;
                    a {
                        color: #333;
                        &:hover {
                            color: #2699f4;
                        }
                    }
                }
                .u-info {
                    margin-top: 12px;
                    font-size: 12px;
                    color: #293039;
                }
                .s-fc {
                    margin-top: 18px;
                    a {
                        font-size: 14px;
                        color: #2699f4;
                        display: block;
                        .icon-tianjia {
                            font-size: 18px;
                            vertical-align: -1px;
                        }
                        &:hover {
                            color: #51adf6;
                        }
                    }
                }
            }
        }
    }
    .m-charts {
        margin-top: 20px;
        &:after {
            clear: both;
            display: block;
            content: '';
        }
        .m-meet,
        .m-root {
            height: 300px;
            border-radius: 8px;
            background-color: #fff;
            width: calc(50% - 10px);
        }
        .m-meet {
            @include left;
        }
        .m-root {
            @include right;
        }
        .u-pie {
            width: 400px;
            height: 239px;
            @include left;
        }
    }
    .u-hd {
        height: 60px;
        border-bottom: solid 1px rgba(0, 0, 0, .1);
        p {
            padding-left: 32px;
            padding-top: 22px;
            font-weight: bold;
            font-size: 16px;
        }
    }
    .u-percent {
        @include left;
        margin-top: 44px;
        margin-left: 10%;
        li {
            margin-top: 26px;
            font-size: 12px;
        }
    }
}

@media screen and (max-width: 1366px) {
    .u-pie {
        width: 350px !important;
    }
}

@media screen and (mix-width: 1367px) {
    .u-pie {
        width: 400px !important;
    }
}
</style>
