<template>
    <div class="g-bd">
        <!--页面头部-->
        <div class="g-hd">
            <h3>{{$t('orders.all')}}</h3>
        </div>
        <div class="s-order">
            <el-input :placeholder="$t('orders.search.key')" class="u-search" icon="search" v-model="searchParams.key" :on-icon-click="handleIconClick">
            </el-input>
            <div class="m-list">
                <div class="u-hd">
                    <span class="u-info">{{$t('orders.info')}}</span>
                    <span class="u-time"  @click="sort('deadline')">{{$t('orders.time')}}
                        <span class="caret-wrapper">
                            <i class="sort-caret ascending" :class="{sortUp: searchParams.orderbys && searchParams.orderbys[0].order == 1 && searchParams.orderbys[0].field == 'deadline'}"></i>
                            <i class="sort-caret descending" :class="{sortDown: searchParams.orderbys &&searchParams.orderbys[0].order == -1 && searchParams.orderbys[0].field == 'deadline'}"></i>
                        </span>
                    </span>
                    <span class="u-expire" @click="sort('endDateStamp')">{{$t('orders.expire')}}
                        <span class="caret-wrapper">
                            <i class="sort-caret ascending" :class="{sortUp: searchParams.orderbys && searchParams.orderbys[0].order == 1 && searchParams.orderbys[0].field == 'endDateStamp'}"></i>
                            <i class="sort-caret descending" :class="{sortDown: searchParams.orderbys &&searchParams.orderbys[0].order == -1 && searchParams.orderbys[0].field == 'endDateStamp'}"></i>
                        </span>
                    </span>
                    <span class="u-status">{{$t('orders.status')}}</span>
                </div>
                <dl class="u-order" v-for="(item, index) in orderData.data" :key="item.id" v-if="item.suiteType != 'trial'">
                    <dt>
                        <span class="u-date">{{dateFormat(item.createDate)}}</span>
                        <span class="u-num">{{$t('orders.number')}}：{{item.number}}</span>
                    </dt>
                    <dd>
                        <table border="1">
                            <tr>
                                <td class="u-img" :rowspan="numCount(item)" v-if="item.suiteType == 'cloudPort'">
                                    <img src="../../assets/img/port.png">
                                    <p>{{$t('service.cloudPort.order')}}</p>
                                </td>
                                <td class="u-img" :rowspan="numCount(item)" v-if="item.suiteType == 'basic'">
                                    <img src="../../assets/img/basis.png">
                                    <p>{{$t('service.basic.order')}}</p>
                                </td>
                                <td class="u-img" :rowspan="numCount(item)" v-if="item.suiteType == 'vmr'">
                                    <img src="../../assets/img/vmr.png">
                                    <p>{{$t('service.vmr.order')}}</p>
                                </td>
                                <td v-if="item.basicOrderItem">
                                    <div class="wrapper">
                                        <div class="u-info">
                                            <p class="f-fw">{{$t('service.basic')}}</p>
                                            <div>
                                                <span class="f-fw">{{$t('service.desc')}}：</span>
                                                <span class="f-fc">{{$t('service.basic.desc')}}</span>
                                            </div>
                                        </div>
                                        <div class="u-time">
                                            <span class="f-fw">{{item.deadline}}</span>
                                            <span class="f-fc">{{$t('orders.deadline')}}</span>
                                        </div>
                                        <div class="u-expire">
                                            {{dateFormat(item.effectiveDate)}}~{{dateFormat(item.endDate)}}
                                        </div>
                                        <div class="u-status" v-html="status[item.status]"></div>
                                    </div>
                                </td>
                            </tr>
                            <!-- 终端VMR服务包 -->
                            <tr v-for="value in item.terminalVmrOrderItems" :key="value.mac">
                                <td>
                                    <div class="wrapper">
                                        <div class="u-info">
                                            <p class="f-fw">{{$t('service.terminal')}}</p>
                                            <div>
                                                <span class="f-fw">MAC：</span>
                                                <span class="f-fc">{{value.mac}}</span>
                                            </div>
                                            <div>
                                                <span class="f-fw">{{$t('orders.capacity')}}：</span>
                                                <span class="f-fc" v-if="value.backendLimit===null">{{value.frontendLimit == 0 ? 'N': value.frontendLimit}}</span>
                                                <span class="f-fc" v-else>{{value.frontendLimit == 0 ? 'N': value.frontendLimit}}+{{value.backendLimit == 0 ? 'N': value.backendLimit}}{{$t('service.fang')}}</span>
                                            </div>
                                            <div>
                                                <span class="f-fw">{{$t('service.desc')}}：</span>
                                                <span class="f-fc" v-if="value.backendLimit===null">{{$t('service.terminal.desc',{frontendLimit:value.frontendLimit == 0 ? 'N': value.frontendLimit, number: 1})}}</span>
                                                <span class="f-fc" v-else>{{$t('service.terminal.desc',{frontendLimit:value.frontendLimit == 0 ? 'N': value.frontendLimit, number: 2})}}</span>
                                            </div>
                                        </div>
                                        <div class="u-time">
                                            <span class="f-fw">{{item.deadline}}</span>
                                            <span class="f-fc">{{$t('orders.deadline')}}</span>
                                        </div>
                                        <div class="u-expire">
                                            {{dateFormat(item.effectiveDate)}}~{{dateFormat(item.endDate)}}
                                        </div>
                                        <div class="u-status" v-html="status[item.status]"></div>
                                    </div>
                                </td>
                            </tr>
                            <!-- 云端VMR服务包 -->
                            <tr v-for="(val, i) in item.cloudVmrOrderItems" :key="i">
                                <td>
                                    <div class="wrapper">
                                        <div class="u-info">
                                            <p class="f-fw">{{$t('service.cloud')}}</p>
                                            <div>
                                                <span class="f-fw">{{$t('orders.amount')}}：</span>
                                                <span class="f-fc">{{val.amount}}</span>
                                            </div>
                                            <div>
                                                <span class="f-fw">{{$t('orders.capacity')}}：</span>
                                                <span class="f-fc">{{val.limit}}{{$t('service.fang')}}</span>
                                            </div>
                                            <div>
                                                <span class="f-fw">{{$t('service.desc')}}：</span>
                                                <span class="f-fc">{{$t('service.vmr.desc', {amount:val.amount, limit: val.limit })}}</span>
                                            </div>
                                        </div>
                                        <div class="u-time">
                                            <span class="f-fw">{{item.deadline}}</span>
                                            <span class="f-fc">{{$t('orders.deadline')}}</span>
                                        </div>
                                        <div class="u-expire">
                                            {{dateFormat(item.effectiveDate)}}~{{dateFormat(item.endDate)}}
                                        </div>
                                        <div class="u-status" v-html="status[item.status]"></div>
                                    </div>
                                </td>
                            </tr>
                            <!-- 云会议端口服务包 -->
                            <tr v-if="item.cloudPortOrderItem">
                                <td>
                                    <div class="wrapper">
                                        <div class="u-info">
                                            <p class="f-fw">{{$t('service.cloudPort')}}</p>
                                            <div>
                                                <span class="f-fw">{{$t('orders.capacity')}}：</span>
                                                <span class="f-fc">{{item.cloudPortOrderItem.limit}}{{$t('service.fang')}}</span>
                                            </div>
                                            <div>
                                                <span class="f-fw">{{$t('service.desc')}}：</span>
                                                <span class="f-fc">{{$t('service.cloudPort.desc', {limit: item.cloudPortOrderItem.limit})}}</span>
                                            </div>
                                        </div>
                                        <div class="u-time">
                                            <span class="f-fw">{{item.deadline}}</span>
                                            <span class="f-fc">{{$t('orders.deadline')}}</span>
                                        </div>
                                        <div class="u-expire">
                                            {{dateFormat(item.effectiveDate)}}~{{dateFormat(item.endDate)}}
                                        </div>
                                        <div class="u-status" v-html="status[item.status]"></div>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </dd>
                </dl>
                <no-data v-if="!orderData.total || (orderData.total <= 0)" :tips="$t('service.index.noData')" :searchkey="searchkey" @getList="getListData"></no-data>
            </div>
            <div class="page">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="orderData.total" v-show="orderData.total > 0">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import noData from '@/components/common/NoData'
import {
    getPagedList
} from '../../api/order'
export default {
    data() {
        return {
            currentPage: 1,
            searchkey: null,
            searchParams: {
                key: null,
                skip: 0,
                limit: Number.parseInt(localStorage.getItem('currentSize') || 10),
                autoCount: true,
                orderbys: null
            },
            orderData: {
                data: null
            },
            status: {
                ineffective: `<div style="color: #999;">${this.$t('orders.ineffective')}</div>`,
                inService: `<div style="color: #32aa5f;">${this.$t('orders.inService')}</div>`,
                expired: `<div style="color: #999;">${this.$t('orders.expired')}</div>`,
                terminated: `<div style="color: #999;">${this.$t('orders.terminated')}</div>`
            }
        };
    },
    components: {
        noData
    },
    created() {
        this.getList(this.searchParams)
        this.enter()
    },
    methods: {
        // 获取数据
        getList(val) {
            getPagedList(val, true, '')
                .then(response => {
                     if(response.ret > -1) {
                        this.orderData = response.data
                        this.orderData.data.filter((data) => {
                            if (data.suiteType == 'trial') {
                                this.orderData.total -= 1
                            }
                            return data.suiteType != 'trial'
                        })
                    }                    
                    this.searchkey = this.searchParams.key
                })
        },
        // 获取数据
        getListData() {
            this.searchParams.key = ""
            getPagedList(this.searchParams, true, '')
                .then(response => {
                    if(response.ret > -1) {
                        this.orderData = response.data
                        this.orderData.data.filter((data) => {
                            if (data.suiteType == 'trial') {
                                this.orderData.total -= 1
                            }
                            return data.suiteType != 'trial'
                        })
                    }
                })
        },
        // 订购服务数量计算
        numCount(item) {
            let count = 0;
            if (item.basicOrderItem) {
                count++
            }
            if (item.cloudVmrOrderItems) {
                count += item.cloudVmrOrderItems.length
            }
            if (item.terminalVmrOrderItems) {
                count += item.terminalVmrOrderItems.length
            }
            if (item.cloudPortOrderItem) {
                count++
            }
            return count
        },
        handleIconClick() {
            //每次搜索置到第一数据
            this.currentPage = 1;
            this.searchParams.skip = 0;
            this.getList(this.searchParams);
        },
        handleSizeChange(val) {
            this.searchParams.limit = val;
            this.getList(this.searchParams);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.searchParams.skip = (this.currentPage - 1) * this.searchParams.limit;
            this.getList(this.searchParams);
        },

        //enter监听Enter
        listener(e) {
            if (e) {
                var e = window.event ? window.event : e;
                if (e.keyCode == 13) {
                    this.handleIconClick()
                }
            }
        },
        enter() {
            document.addEventListener('keydown', this.listener);
        },
        dateFormat(date) {
            if(date)
                return date.replace(/-/g,'/')
        },
        sort(field) {
            if (!this.searchParams.orderbys) {
                this.searchParams.orderbys = [{ field: field, order: 1 }]
            } else if (this.searchParams.orderbys && this.searchParams.orderbys[0].order == 1) {
                this.searchParams.orderbys = [{ field: field, order: -1 }]
            } else if (this.searchParams.orderbys && this.searchParams.orderbys[0].order == -1 ) {
                this.searchParams.orderbys = null
            }
            this.getList(this.searchParams)
        }
    },
    destroyed: function() {
        document.removeEventListener('keydown', this.listener)
    }
};
</script>


<style lang="scss" scoped>
@mixin left( $value: 20px) {
    float: left;
    margin-left: $value;
}

@mixin right( $value: 20px) {
    float: right;
    margin-right: $value;
}

p,
ul,
li,
dd {
    margin: 0;
    padding: 0;
}

ul,
li {
    list-style: none;
}

.s-order {
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    .f-fw {
        font-weight: bold;
    }
    .f-cs {
        color: #32aa5f;
    }
    .f-ce {
        color: #999;
    }
    .u-search {
        width: 30%;
    }
    .m-list {
        margin-top: 20px;
        .u-hd {
            background: #edf0f5;
            height: 40px;
            line-height: 40px;
            border: solid 1px #e0e0e0;
            .u-info,
            .u-time,
            .u-expire,
            .u-status {
                @include left(0);
                text-align: center;
                font-size: 14px;
            }
            .u-info {
                width: 50%;
            }
            .u-time {
                width: 15%;
                cursor: pointer;
            }
            .u-expire {
                width: 20%;
                cursor: pointer;
            }
            .u-status {
                width: 15%;
            }
            .caret-wrapper {
                cursor: pointer;
                margin-left: 5px;
                margin-top: -2px;
                width: 16px;
                height: 30px;
                overflow: visible;
                overflow: initial;
            }
            .caret-wrapper {
                position: relative;
                display: inline-block;
                vertical-align: middle;
            }
            .sort-caret.ascending {
                top: 9px;
                border-top: none;
                border-bottom: 5px solid #97a6be;
            }
            .sort-caret.descending {
                bottom: 9px;
                border-top: 5px solid #97a6be;
                border-bottom: none;
            }
            .sort-caret.ascending, .sort-caret.descending {
                border-right: 5px solid transparent;
                border-left: 5px solid transparent;
            }
            .sort-caret {
                display: inline-block;
                width: 0;
                height: 0;
                border: 0;
                content: "";
                position: absolute;
                left: 3px;
                z-index: 2;
            }
            .sortUp {
                border-bottom-color: #48566a !important;
            }
            .sortDown {
                border-top-color: #48566a !important;
            }
        }
        .u-order {
            table {
                width: 100%;
                border: 1px solid #e0e0e0;
                border-collapse: collapse;
                border-spacing: 0;
                font-size: 14px;
                td {
                    height: 150px;
                    border: 1px solid #e0e0e0;
                }
            }
            .wrapper {
                display: table;
                width: 100%;
            }
            dt {
                margin-top: 20px;
                height: 38px;
                line-height: 38px;
                background-color: #edf0f5;
                border-top: solid 1px #e0e0e0;
                border-left: solid 1px #e0e0e0;
                border-right: solid 1px #e0e0e0;
                font-size: 14px;
                .u-date {
                    @include left(30px);
                }
                .u-num {
                    @include left(44px);
                }
            }
            .u-img {
                width: 15%;
                text-align: center;
                img {
                    width: 80px;
                    height: 80px;
                    border-radius: 8px;
                    margin-top: 20px;
                }
                p {
                    font-size: 14px;
                    margin-top: 8px;
                }
            }
            .u-info,
            .u-time,
            .u-expire,
            .u-status {
                display: table-cell;
                vertical-align: middle;
            }
            .u-info {
                line-height: 24px;
                padding-left: 3%;
                .f-fc {
                    color: #999;
                }
                p {
                    margin-bottom: 8px;
                }
            }
            .u-time {
                width: 17.5%;
                text-align: center;
                .f-fw {
                    font-size: 30px;
                    font-weight: bold;
                    font-family: Arial;
                }
            }
            .u-expire {
                width: 23.4%;
                text-align: center;
            }
            .u-status {
                width: 17.6%;
                text-align: center;
            }
        }
    }
    .page {
        text-align: right;
    }
}
</style>

