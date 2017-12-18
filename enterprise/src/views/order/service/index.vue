<template>
    <div class="g-bd">
        <!--页面头部-->
        <div class="g-hd">
            <h3>{{$t('service.index.server')}}</h3>
        </div>
        <div v-if="type=='vip' && status != 'expired'">
            <service-basis v-if="profile == 'basic' && flag && flag2" :tableData="tableData" :info="info" :dateFormat='dateFormat' :onsort = "orderby"></service-basis>
            <service-port v-if="profile == 'cloudPort' && flag && flag2" :tableData="tableData" :info="info" :dateFormat='dateFormat' :onsort = "orderby"></service-port>
            <service-vmr v-if="profile == 'vmr' && flag && flag2" :tableData="tableData" :info="info" :dateFormat='dateFormat' :onsort = "orderby"></service-vmr>
        </div>
        <div v-else-if="type=='trial'  && status != 'expired'">
            <service-free v-if="flag && flag2" :tableData="tableData" :info="info" :dateFormat='dateFormat'></service-free>
        </div>
        <no-data v-else :tips="$t('service.noServer')"></no-data>
    </div>
</template>

<style lang="scss" scoped>
.s-service {
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 20px;
}
</style>

<script>
import noData from '@/components/common/NoData'
import serviceBasis from './Basic'
import servicePort from './Port'
import serviceVmr from './Vmr'
import serviceFree from './Free'
import { getOrderNow } from '../../../api/dashboard'
import {
    getMergeView, getItemList
} from '../../../api/order'

export default {
    data() {
        return {
            profile: null, //当前服务套餐
            type: null, //试用客户区分 trial使用  vip会员
            status: '',
            tableData: null,
            info: null, //概况显示    
            flag: false,
            flag2: false
        };
    },
    components: {
        noData, serviceBasis, servicePort, serviceVmr, serviceFree
    },
    created() {
        this.myService()
        this.getData()
        this.getOrder()
    },
    methods: {
        // 当前服务详情
        myService() {
            getMergeView('', false, '')
                .then(response => {
                    this.info = response.data
                    this.flag = true
                })
        },
        // 表格数据
        getData() {
            getItemList('', false, '')
                .then(response => {
                    if(response.ret > -1) {
                        this.tableData = response.data
                        this.sortData = response.data
                    }
                    this.flag2 = true
                    console.log(this.tableData)
                })
        },
        // 最新订单
        getOrder() {
            getOrderNow('', false, '')
                .then(response => {
                    if (response.ret > 0) {
                        this.profile = response.data['suiteType']
                        this.type = response.data['type']
                        this.status =response.data['status']
                    }
                })
        },
        dateFormat(date) {
            if (date)
                return date.replace(/-/g, '/')
        },
        orderby(a, type) {
            if (a.order == 'ascending') {
                this.tableData[type].sort(function(x, y) { return x[a.prop] > y[a.prop] ? 1 : -1 })
            } else if(a.order == 'descending'){
                this.tableData[type].sort(function(x, y) { return x[a.prop] < y[a.prop] ? 1 : -1 })
            } else {
                this.tableData = this.sortData
            }
        }
    }
};
</script>
<style lang="scss">
.table-bar {
    border: solid 1px #e6e6e6;
    border-top: 0px;
    margin-left: 0px !important;
    margin-right: 0px !important;
    height: 53px;
    .u-pagination {
        display: inline-block;
        float: right;
        padding-right: 10px;
        padding-top: 10px;
    }
}

.table-bar-pagination {
    text-align: right;
    padding-right: 10px;
}

.el-pagination__editor {
    width: 45px !important;
}

.el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background: #fff !important;
    border-color: #bfcbd9 !important;
}
</style>

