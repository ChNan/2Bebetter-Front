<template>
    <div class="g-content">
        <div class="m-cover">
            <el-card class="full clearfix" style="border-radius:20px;">
                <div slot="header" class="clearfix">
                    <span class="title">{{title}}</span>
                    <div class="f-fr link">
                        <router-link to="/admin/order">
                            <i class="iconfont icon-fanhuishangyiji"></i>{{$t('enterprise.return')}}
                        </router-link>
                    </div>
                </div>
                <div class="el-table " style="width: 100%;">
                    <div class="u-tb-th">
                        <span class="title">{{$t('order.index.tablenumber')}}：</span>
                        <span>{{orderDetail.number}}</span>
                        <span class="title">{{$t('order.index.buyday')}}</span>
                        <span>{{orderDetail.createDate || '--'}}</span>
                        <span class="title">{{$t('order.index.tablestatus')}}：</span>
                        <span>{{status[orderDetail.status]}}</span>
                    </div>
                    <div class="is-leaf">
                        <el-form class="m-expand" inline>
                            <el-form-item style="margin-bottom:10px;">
                                <h5>{{$t('order.detail.buyerinfo')}}</h5>
                            </el-form-item>
                            <el-form-item>
                                <h5>{{$t('order.detail.other')}}</h5>
                            </el-form-item>
                            <el-form-item :label="$t('enterprise.id')">
                                <span>{{orderDetail.enterpriseNumber}}</span>
                            </el-form-item>
                            <el-form-item :label="$t('order.detail.mark')">
                                <span class="txt-over"  :title="orderDetail.remark">{{orderDetail.remark || '--'}}</span>
                            </el-form-item>
                            <el-form-item :label="$t('order.detail.buyername')">
                                <span class="txt-over" :title="orderDetail.enterpriseName">{{orderDetail.enterpriseName}}</span>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="is-leaf">
                        <h5>{{$t('order.detail.sdetail')}}</h5>
                        <div class="t-body">
                            <table style="width:100%" class="u-tb">
                                <tr>
                                    <td class="boder">
                                        <div class="g-center" :class="{'m-small__port':type == 'cloudPort',
                                                    'm-small__cloud':type == 'basic',
                                                    'm-small__room':type == 'vmr',
                                                    'm-small__free':type == 'trial',
                                                    'm-default':type == ''}">
                                            <i :class="{'u-logo__cloud':type == 'basic',
                                                        'u-logo__port':type == 'cloudPort',
                                                        'u-logo__room':type == 'vmr',
                                                        'u-logo__free':type == 'trial'}"></i>
                                        </div>
                                        <p>{{setMenu[$route.query.type]}}</p>
                                    </td>
                                    <td>
                                        <table class="m-full border" v-if="!!orderDetail.basicOrderItem">
                                            <tr>
                                                <td style="width:41.66667%">
                                                    <ul>
                                                        <li>
                                                            <h5 class="item"> {{$t('order.suit.cloudbasic')}}</h5>
                                                        </li>
                                                        <li>
                                                            <h5>{{$t('order.desc.description')}}</h5>
                                                            <span class="txt">{{$t('order.detail.cloudbasic')}}</span>
                                                        </li>
                                                    </ul>
                                                </td>
                                                <td style="width:29.16667%" class="f-tac">
                                                    <span>{{$t('order.desc.time')}}&nbsp;
                                                        <h1>{{orderDetail.deadline}}</h1>{{$t('order.index.month')}}
                                                    </span>
                                                </td>
                                                <td style="width:29.16667%" class="f-tac">
                                                    <span>{{$t('order.index.tableeffect')}}：{{orderDetail.effectiveDate || '--'}}~{{orderDetail.endDate || '--'}}</span>
                                                </td>
                                            </tr>
                                        </table>
                                        <table class="border m-full" v-if="!!orderDetail.cloudPortOrderItem && !!orderDetail.cloudPortOrderItem.limit">
                                            <tr>
                                                <td style="width:41.66667%">
                                                    <ul>
                                                        <li>
                                                            <h5 class="item">{{$t('order.suit.cloudport')}}</h5>
                                                        </li>
                                                        <li>
                                                            <h5>{{$t('order.desc.limit')}}{{orderDetail.cloudPortOrderItem.limit}}{{$t('enterprise.way')}}</h5>
                                                        </li>
                                                        <li>
                                                            <h5>{{$t('order.desc.description')}}</h5>
                                                            <span class="txt">{{$t('order.desc.orderDetail',{'limit':orderDetail.cloudPortOrderItem.limit})}}</span>
                                                        </li>
                                                    </ul>
                                                </td>
                                                <td style="width:29.16667%" class="f-tac">
                                                    <span>{{$t('order.desc.time')}}&nbsp;
                                                        <h1>{{orderDetail.deadline}}</h1>{{$t('order.index.month')}}
                                                    </span>
                                                </td>
                                                <td style="width:29.16667%" class="f-tac">
                                                    <span>{{$t('order.index.tableeffect')}}：{{orderDetail.effectiveDate || '--'}}~{{orderDetail.endDate || '--'}}</span>
                                                </td>
                                            </tr>
                                        </table>
                                        <template v-if="orderDetail.terminalVmrOrderItems && orderDetail.terminalVmrOrderItems.length>0" v-for="(item,index) in orderDetail.terminalVmrOrderItems">
                                            <table style="padding:20px;width:100%;" class="border">
                                                <tr>
                                                    <td style="width:41.66667%">
                                                        <ul>
                                                            <li>
                                                                <h5 class="item">{{$t('order.suit.temvmr')}}</h5>
                                                            </li>
                                                            <li>
                                                                <h5>MAC：</h5>
                                                                <span class="txt">{{item.mac}}</span>
                                                            </li>
                                                            <li>
                                                                <h5>{{$t('order.desc.limit')}}</h5>
                                                                <span class="txt" v-if="item.frontendLimit>0 ">{{item.frontendLimit}}<span v-if="item.backendLimit">+</span>{{item.backendLimit}}{{$t('enterprise.way')}}</span>
                                                                <span class="txt" v-else>n {{$t('enterprise.way')}}</span>
                                                            </li>
                                                            <li>
                                                                <h5>{{$t('order.desc.description')}}</h5>
                                                                <span class="txt" v-if="item.frontendLimit>0">{{$t('order.desc.vmrdetail2')}}<span v-if="item.backendLimit">2</span><span v-else>1</span>{{$t('order.desc.vmrdetail3',{'limit':item.frontendLimit})}}</span>
                                                                <span class="txt" v-else>{{$t('order.desc.vmrdetail')}}</span>
                                                            </li>
                                                        </ul>
                                                    </td>
                                                    <td style="width:29.16667%" class="f-tac">
                                                        <span>{{$t('order.desc.time')}}&nbsp;
                                                            <h1>{{orderDetail.deadline}}</h1>{{$t('order.index.month')}}
                                                        </span>
                                                    </td>
                                                    <td style="width:29.16667%" class="f-tac">
                                                        <span>{{$t('order.index.tableeffect')}}：{{orderDetail.effectiveDate || '--'}}~{{orderDetail.endDate || '--'}}</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </template>
                                        <template v-if="orderDetail.cloudVmrOrderItems && orderDetail.cloudVmrOrderItems.length>0" v-for="(item,index) in orderDetail.cloudVmrOrderItems">
                                            <table style="padding:20px;width:100%;" class="border">
                                                <tr>
                                                    <td style="width:41.66667%">
                                                        <ul>
                                                            <li>
                                                                <h5 class="item">{{$t('order.detail.cloudvmr')}}</h5>
                                                            </li>
                                                            <li>
                                                                <h5>{{$t('order.detail.counts')}}</h5>
                                                                <span class="txt">{{item.amount}}{{$t('enterprise.one')}}</span>
                                                            </li>
                                                            <li>
                                                                <h5>{{$t('order.desc.limit')}}</h5>
                                                                <span class="txt">{{item.limit}}{{$t('enterprise.way')}}</span>
                                                            </li>
                                                            <li>
                                                                <h5>{{$t('order.desc.description')}}</h5>
                                                                <span class="txt">
                                                                    {{$t('order.desc.cloudvmrdetail',{'amount':item.amount,'limit':item.limit})}}</span>
                                                            </li>
                                                        </ul>
                                                    </td>
                                                    <td style="width:29.16667%" class="f-tac">
                                                        <span>{{$t('order.desc.time')}}&nbsp;
                                                            <h1>{{orderDetail.deadline}}</h1>{{$t('order.index.month')}}
                                                        </span>
                                                    </td>
                                                    <td style="width:29.16667%" class="f-tac">
                                                        <span>{{$t('order.index.tableeffect')}}：{{orderDetail.effectiveDate || '--'}}~{{orderDetail.endDate || '--'}}</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </template>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.el-table {
    &:after {
        width: 0;
    }

    &:before {
        background-color: #fff;
    }
}

.txt-over {
    display: inline-block;
    max-width: 400px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space:nowrap;

}

.u-tb-th {
    height: 48px;
    line-height: 48px;
    min-width: 0;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    background: #E9EDF6;
    font-size: 14px;
    color: #000;


    .title {
        color: #999;
        margin-left: 60px;

        &:first-child {
            margin-left: 20px;
        }
    }
}

.m-expand {
    font-size: 14px;
    margin-top: -5px;

    .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 49%;
        height: 28px;
    }
}



.u-tb {
    width: 100%;
    max-width: 100%;
    background-color: #fff;
    border: 1px solid #dfe5ec;
    font-size: 14px;
    color: #1f2c3d;
    margin-top: 10px;
    border-collapse: separate;
    border-spacing: 0;
    td.boder {
        border-bottom: none;
        border-right: 1px solid #dfe6ec;
        width: 200px;
        text-align: center;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 20px;
        padding-bottom: 10px;
    }
    td {
        border-bottom: none;
        padding: 0;
    }
}

.border {
    border-top: 1px solid #dfe6ec;

    &:first-child {
        border: none;
    }
}

.m-full {
    padding: 20px;
    width: 100%;
}

.is-leaf {
    border-top: 1px solid #dfe6ec;
    padding: 20px;

    h5 {
        font-size: 14px;
        color: #333;

        &.item {
            margin-bottom: 10px;
        }
    }

    .txt {
        font-size: 14px;
        color: #999;
    }
}

ul {
    margin: 0;
    padding-left: 10px;
    min-width: 350px;
    list-style: none;

    li {
        margin-top: 10px;

        &:first-child {
            margin-top: 0;
        }
    }
}

.g-center {
    margin: 0 auto;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    width: auto;
    display: inline-block;
}

.el-card__body {
    .el-table {
        height: 100%;
    }
}
</style>

<script>
import * as api from '../../api/order/index'
import moment from 'moment'
export default {

    data() {
        return {
            title: this.$t('order.deati.detailinfo'),
            type: '',
            serList: [],
            status: {
                'inService': this.$t('order.index.inService'),
                'expired': this.$t('order.index.expired'),
                'ineffective': this.$t('order.index.ineffective'),
                'terminated': this.$t('order.index.terminated')
            },
            setMenu: {
                'trial': this.$t('enterprise.suitTrial'),
                'basic': this.$t('enterprise.suitClourd'),
                'vmr': this.$t('enterprise.suitTerm'),
                'cloudPort': this.$t('enterprise.suitPort')
            },
            orderDetail: {
                id: '',
                createTime: '',
                status: '',
                number: '',
                enterpriseName: '',
                effectiveDateStamp: '',
                endDateStamp: '',
                effectiveDate:'',
                endDate:'',
                remark: '',
                enterpriseNumber: '',
                deadline: '',
                basicOrderItem: null
            }
        }
    },
    filters: {
        dateFormat(value) {
            return moment(value).format('YYYY/MM/DD');
        }
    },
    created() {
        this.type = this.$route.query.type || '';
        this.getOrderDetail(this.$route.query.id);
    },
    methods: {
        getOrderDetail(id) {
            api.getOrderDetail({ id: id })
                .then((res) => {
                    if (res.data.ret > 0) {
                        this.orderDetail = res.data.data;
                        if(this.orderDetail.createDate){
                           this.orderDetail.createDate =  this.orderDetail.createDate.replace(/-/g, "/");
                        }
                        if(this.orderDetail.effectiveDate){
                            this.orderDetail.effectiveDate = this.orderDetail.effectiveDate.replace(/-/g, "/");
                        }
                        if(this.orderDetail.endDate){
                           this.orderDetail.endDate = this.orderDetail.endDate.replace(/-/g, "/");
                        }
                    
                    }

                })
        }

    }
}
</script>
