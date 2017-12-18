<template>
    <div class="s-service">
        <div class="m-info">
            <div class="u-ct">
                <div class="u-header">
                    <img src="../../../assets/img/port.png">
                </div>
                <div class="u-info">
                    <p class="u-tt f-fw">{{$t('service.cloudPort.order')}}</p>
                    <div class="u-server">
                        <ul>
                            <li>
                                <span class="f-fw">• {{$t('service.cloudPort')}}：</span>
                            </li>
                            <li v-if="info.cloudPort">
                                <span class="f-fw">{{info.cloudPort}}</span>
                                <span class="f-fc"> {{$t('service.fang')}}</span>
                            </li>
                            <li v-else>
                                <span class="f-fw"> {{$t('service.noApply')}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="u-server">
                        <ul>
                            <li>
                                <span class="f-fw">• {{$t('service.terminal')}}：</span>
                            </li>
                            <li v-if="!info.terminal">
                                <span class="f-fw"> {{$t('service.noApply')}}</span>
                            </li>
                            <li v-for="(val, key) in info.terminal" :key="val">
                                <span class="f-fw">{{key=='0+0'||key=='0' ? 'N':key}} {{$t('service.fang')}}：</span>
                                <span class="f-fc">{{val}} {{$t('service.one')}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="$t('service.cloudPort')" name="first">
                <div v-if="firstPage.data && firstPage.data.length > 0">
                    <el-table class="m-table" ref="table" :data="firstPage.data" stripe  @sort-change="sort">
                        <el-table-column prop="createTime" :label="$t('service.createTime')" min-width="160" sortable="custom">
                            <template scope="scope">
                                <span>{{dateFormat(scope.row.createDate)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="limit" :label="$t('service.capacity')" min-width="140">
                        </el-table-column>
                        <el-table-column prop="deadline" :label="$t('service.deadline')" min-width="200">
                        </el-table-column>
                        <el-table-column prop="endDateStamp" :label="$t('service.validity')" min-width="230" sortable="custom">
                            <template scope="scope">
                                <span>{{dateFormat(scope.row.effectiveDate)}}~{{dateFormat(scope.row.endDate)}}</span>
                                <el-tooltip :content="$t('service.expiringSoon')" placement="top" effect="dark" v-if="scope.row.expiringFlag > 0">
                                    <i class="icon iconfont icon-jinggaoleitishi"></i>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('service.desc')" min-width="240" show-overflow-tooltip>
                            <template scope="scope">
                                <span>{{$t('service.cloudPort.desc', {limit: scope.row.limit})}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="table-bar">
                        <div class="u-pagination">
                            <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="firstPage.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="firstPage.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.cloudPortItems.length">
                            </el-pagination>
                        </div>
                    </div>
                </div>
                <no-data v-else :tips="$t('service.noServer')"></no-data>
            </el-tab-pane>

            <el-tab-pane :label="$t('service.terminal')" name="second">
                <div v-if="secondPage.data && secondPage.data.length > 0">
                    <el-table class="m-table" ref="table" :data="secondPage.data" stripe  @sort-change="sort">
                        <el-table-column prop="createTime" :label="$t('service.createTime')" min-width="160" sortable="custom">
                            <template scope="scope">
                                <span>{{dateFormat(scope.row.createDate)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="mac" label="MAC" min-width="160">
                        </el-table-column>
                        <el-table-column :label="$t('service.capacity')" min-width="160">
                            <template scope="scope">
                                <span v-if="scope.row.backendLimit===null">{{scope.row.frontendLimit == 0 ? 'N': scope.row.frontendLimit}}</span>
                                <span v-else>{{scope.row.frontendLimit == 0 ? 'N': scope.row.frontendLimit}} + {{scope.row.backendLimit == 0 ? 'N': scope.row.backendLimit}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="deadline" :label="$t('service.deadline')" min-width="200">
                        </el-table-column>
                        <el-table-column prop="endDateStamp" :label="$t('service.validity')" min-width="230" sortable="custom">
                            <template scope="scope">
                                <span>{{dateFormat(scope.row.effectiveDate)}}~{{dateFormat(scope.row.endDate)}}</span>
                                <el-tooltip :content="$t('service.expiringSoon')" placement="top" effect="dark" v-if="scope.row.expiringFlag > 0">
                                    <i class="icon iconfont icon-jinggaoleitishi"></i>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('service.desc')" min-width="220" show-overflow-tooltip>
                            <template scope="scope">
                                <span v-if="scope.row.backendLimit===null">{{$t('service.terminal.desc',{frontendLimit:scope.row.frontendLimit == 0 ? 'N': scope.row.frontendLimit, number: 1})}}</span>
                                <span v-else>{{$t('service.terminal.desc',{frontendLimit:scope.row.frontendLimit == 0 ? 'N': scope.row.frontendLimit, number: 2})}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="table-bar">
                        <div class="u-pagination">
                            <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="secondPage.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="secondPage.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.terminalVmrItems.length">
                            </el-pagination>
                        </div>
                    </div>
                </div>
                <no-data v-else :tips="$t('service.noServer')"></no-data>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import noData from '@/components/common/NoData'
export default {
    data() {
        return {
            activeName: 'first',
            firstPage: {
                currentPage: 1,
                pageSize: Number.parseInt(localStorage.getItem('currentSize') || 10),
                data: null
            },
            secondPage: {
                currentPage: 1,
                pageSize: Number.parseInt(localStorage.getItem('currentSize') || 10),
                data: null
            }

        };
    },
    props: ['info', 'tableData', 'dateFormat', 'onsort'],
    watch: {
        'tableData': {
            deep: true,
            handler: function(value) {
                this.pageData1();
                this.pageData2();
            }
        }
    },
    created() {
        this.tableData.cloudPortItems.sort(function(x, y) { return x.createTime < y.createTime ? 1 : -1 })
        this.tableData.terminalVmrItems.sort(function(x, y) { return x.createTime < y.createTime ? 1 : -1 })
        this.pageData1();
        this.pageData2();
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        },

        handleSizeChange1(val) {
            this.firstPage.pageSize = val;
            this.firstPage.currentPage = 1;
            this.pageData1();
        },
        handleCurrentChange1(val) {
            this.firstPage.currentPage = val;
            this.pageData1();
        },
        pageData1() {
            this.firstPage.data = this.tableData.cloudPortItems.slice((this.firstPage.currentPage - 1) * this.firstPage.pageSize, this.firstPage.currentPage * this.firstPage.pageSize)
        },

        handleSizeChange2(val) {
            this.secondPage.pageSize = val;
            this.secondPage.currentPage = 1;
            this.pageData2();
        },
        handleCurrentChange2(val) {
            this.secondPage.currentPage = val;
            this.pageData2();
        },
        pageData2() {
            this.secondPage.data = this.tableData.terminalVmrItems.slice((this.secondPage.currentPage - 1) * this.secondPage.pageSize, this.secondPage.currentPage * this.secondPage.pageSize)
        },
        sort(a) {
            let type = null;
            this.activeName == 'first' ? type = "cloudPortItems" : type = "terminalVmrItems"
            this.onsort(a, type)
        }
    },
    components: {
        noData
    }
}
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
li {
    margin: 0;
    padding: 0;
}

ul,
li {
    list-style: none;
}

.s-service {
    padding: 5px 20px 20px;
    ;
    .f-fw {
        font-weight: bold;
    }
    .f-fc {
        color: #999;
    }
    .m-info {
        .u-hd {
            border-bottom: 1px solid #e0e0e0;
            line-height: 56px;
            font-size: 16px;
            font-weight: bold;
        }
        .u-ct {
            height: 180px;
            .u-header {
                @include left(0);
                width: 130px;
                height: 130px;
                margin-top: 20px;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                }
            }
            .u-info {
                @include left(38px);
                margin-top: 22px;
                .u-tt {
                    font-size: 18px;
                    line-height: 46px;
                    padding-bottom: 10px;
                }
                .u-server {
                    font-size: 14px;
                    line-height: 30px;
                    &:after {
                        clear: both;
                        display: block;
                        content: '';
                    }
                    li {
                        @include left(0);
                    }
                    li:not(:first-child) {
                        margin-right: 30px;
                    }
                }
            }
        }
    }
    .m-table {
        .icon-jinggaoleitishi {
            color: #ff4949;
        }
    }
    .iconfont {
        font-size: 14px;
    }
}
</style>


