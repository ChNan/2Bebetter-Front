<template>
    <div class="g-content">
        <div class="g-hd ">
            <div class="clearfix">
                <span class="title">{{title}}</span>
            </div>
        </div>
        <div class="g-box">
            <searchbar :tableSearch="getSeachKey" placeholder="请输入consul服务地址" ref="searchBar" :isMore="false">
            </searchbar>

            <el-table :data="tableData" ref="table" stripe>
                <div slot="empty">
                    <el-row class="u-empty">
                        <div v-if="isEmpty" class="f-tac">
                            <span class="iconfont icon-kongshuju" style="color:gray;font-size:58px;"></span>
                            <br />
                            <br/>
                            <span>{{$t('common.hint.dataNull')}}</span>
                        </div>
                    </el-row>
                </div>

                <el-table-column prop="serviceName" label="服务名称" min-width="120" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="version" label="版本号" show-overflow-tooltip sortable></el-table-column>
                <el-table-column prop="datacenter" label="数据中心" show-overflow-tooltip sortable></el-table-column>
                <el-table-column prop="environment" label="部署环境" show-overflow-tooltip sortable></el-table-column>
                <el-table-column prop="serviceAddress" label="服务地址" show-overflow-tooltip sortable></el-table-column>
                <el-table-column prop="servicePort" label="服务端口" show-overflow-tooltip sortable>  
                </el-table-column>
                    <el-table-column prop="serviceID" label="服务Id" show-overflow-tooltip sortable></el-table-column>
                <el-table-column prop="node" label="节点" show-overflow-tooltip sortable></el-table-column>

            </el-table>

        </div>
    </div>
</template>
<script>
import searchbar from '@/components/Searchbar'
import * as api from '../api/account/index'
import { setNull } from '../services/toolService'
export default {
    components: {
        searchbar
    },
    data() {
        return {
            tableData: [],
            title: this.$t('menu.ver'),
            total: 0,
            searchKey: {
                ip: '127.0.0.1',
            },
            isEmpty: false
        }


    },
    mounted() {
        $('input, textarea').placeholder();
        this.$refs.searchBar.setKey('127.0.0.1')
    },
    computed: {
        isSearch() {
            return !!this.searchKey.ip;
        }
    },
    created() {
        this.getList();
    },
    methods: {
        resetKey() {
            this.$refs.searchBar.$emit('resetKey');
            this.searchKey.ip = null;
            this.getSeachKey('');
        },
        getSeachKey() {
            this.searchKey.ip = this.$refs.searchBar.getKey();
            if (this.searchKey.ip != '127.0.0.1') {
                this.getSp();
            } else {
                this.getList();
            }

        },
        getSp() {
            api.getspList(this.searchKey)
                .then((res) => {
                    if (res.data.ret > -1) {
                        this.tableData = res.data.data;
                        this.total = res.data.ret;
                    }
                })

        },
        getList() {
            api.getVersionList()
                .then((res) => {
                    if (res.data.ret > -1) {
                        this.tableData = res.data.data;
                        this.total = res.data.ret;
                    } else {
                        this.searchKey.ip = '127.0.0.1';
                    }
                })
        }

    }

}
</script>

