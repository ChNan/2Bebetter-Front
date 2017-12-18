<template>
    <div class="g-content">
     <div class="g-hd ">
         <div class="clearfix">
         <span class="title">{{title}}</span>
                    <router-link :to="{ name: 'enterprise.edit', params: { add: true }}">
                        <el-button type="primary" class="small-i f-fr" style="margin-top:11px;">
                            <i class="iconfont icon-jia"></i>
                            <span class="u-btn-m3">{{$t('enterprise.add.addEn')}}</span>
                        </el-button>
                    </router-link>
                    
    </div>
    </div>   
    <div class="g-box">
    <searchbar :tableSearch="getSeachKey" ref="searchBar">
        <div slot="content">
            <el-form :inline="true" style="margin-bottom:-20px;">
                <el-form-item :label="$t('enterprise.country')">
                    <el-select v-model="searchKey.country" filterable :remote-method="querySearchData" class="u-select" clearable>
                        <el-option v-for="(item,index) in countryList" :label="$t(item.twoLetter)" :value="item.twoLetter" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('enterprise.index.type')">
                    <el-select v-model="searchKey.type" class="u-select" clearable>
                        <el-option v-for="item in enMode" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('enterprise.index.lstatus')">
                    <el-select v-model="searchKey.status" class="u-select" clearable>
                        <el-option v-for="item in status" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="btn100" @click="getSeachKey">{{$t('common.search.btn')}}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </searchbar>

    <el-table :data="tableData" ref="table" stripe @sort-change="sortChange">
        <div slot="empty">
            <el-row class="u-empty">
                <div v-if="isEmpty" class="f-tac">
                    <span class="iconfont icon-kongshuju" style="color:gray;font-size:58px;"></span>
                    <br />
                    <br/>
                    <span>{{$t('common.hint.dataNull')}}</span>
                </div>
                <div class="u-tbtip" v-if="isSearch && !isEmpty">
                    	<el-row :gutter="20">
							<el-col :span="6" >
									<!-- <img src="../../assets/img/noSearch.png" alt=""> -->
									<div class="page">
									</div>
								</el-col>
								<el-col :span="18">
                    <h4>
                        <span style="margin-left:-15px;">{{$t('common.sorry')}}
                            <span v-if="searchKey.key">{{$t('common.about')}}"</span>
                            <p class="searchkey" :title="searchKey.key">{{searchKey.key}}</p>
                            <span v-if="searchKey.key">"</span>
                        </span>{{$t('common.relative')}}</h4>
                    <ul>
                        <span>{{$t('common.hint.searchHint')}}</span>
                        <li>
                            {{$t('common.hint.first')}}
                        </li>
                        <li>
                            {{$t('common.hint.second')}}
                        </li>
                        <li>
                            {{$t('common.hint.third')}}
                        </li>
                        <li>
                            <el-button type="text" class="btn" @click="resetKey">{{$t('common.hint.clickreturn')}}</el-button>
                        </li>
                    </ul>
                        </el-col>
                        
    </el-row>


                </div>
            </el-row>
        </div>
        <el-table-column prop="number" :label="$t('enterprise.index.enId')" min-width="80" sortable="custom"></el-table-column>
        <el-table-column :label="$t('enterprise.index.name')"  prop="name" :show-overflow-tooltip="true">
            <template scope="scope">
                <router-link :to="{path:'/admin/enterprise/detail',query: {id: scope.row.id}}">{{scope.row.name}}</router-link>
            </template>
        </el-table-column>
        <el-table-column prop="type" :label="$t('enterprise.index.tableType')" :formatter="formatterType"></el-table-column>
        <el-table-column prop="status" :label="$t('enterprise.index.status')" :formatter="formatterStatus"></el-table-column>
        <el-table-column prop="country" :label="$t('enterprise.index.becountry')" :formatter="formatterCountry"></el-table-column>
        <el-table-column :label="$t('enterprise.index.operation')" min-width="100px">
            <template scope="scope">
                <router-link :to="{ path:'/admin/enterprise/edit',query:{id: scope.row.id}}">
                    <el-button type="text" class="u-btn">
                        <i class="icon-operation iconfont icon-bianji"></i>
                    </el-button>
                </router-link>
                <el-button type="text" class="u-btn" @click="settingConfig(scope.row.id)">
                    <i class="icon-operation iconfont icon-yshezhi"></i>
                </el-button>
            </template>
        </el-table-column>
    </el-table>

    <div class="f-tar" v-if="tableData.length>0">
        <table-bar :total="total" table="table" ref="tableBar" @change="handleCurrentChange" :checkbox="false"></table-bar>
    </div>

    </div>

        <el-dialog :title="$t('enterprise.index.parameter')" :visible.sync="dialogVisible" size="tiny" class="m-small">
            <el-row>
                <span>{{$t('enterprise.index.is1080P')}}</span>
                <div class="f-tar u-sw">
                    <el-switch v-model="isOn">
                    </el-switch>
                </div>
            </el-row>
            <el-row class="u-mr20">
                <span>{{$t('enterprise.index.audien')}}</span>
                <div class="f-tar u-sw">
                    <el-switch v-model="linkOn">
                    </el-switch>
                </div>
            </el-row>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="postConfig">{{$t('common.ok')}}</el-button>
                <el-button @click="dialogVisible = false">{{$t('common.cancel')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
.u-sw {
    margin-top: -20px;
}

.u-mr20 {
    margin-top: 20px;
}
</style>

<script>
import searchbar from '@/components/Searchbar'
import { setLang, languages } from '@/i18n/index'
import * as api from '../../api/enterprise/index'
import { setNull } from '../../services/toolService'
export default {
    components: {
        searchbar
    },
    data() {
        return {
            title: this.$t('menu.enterprise'),
            total: 0,
            currentPage: 1,
            dialogVisible: false,
            countryList: [],
            buttonStyle: {
                // position:'absolute'
                display: 'inline-block'
            },
            searchKey: {
                key: '',
                country: '',
                type: '',
                status: '',
                autoCount: true,
                skip: 0,
                limit: Number.parseInt(localStorage.getItem('currentSize') || 10),
                orderbys: null,
                date: ''
            },
            isOn: false,//是否开启1080P
            linkOn: false,//是否开启直播
            currentId: '',
            enMode: [
                {
                    label: this.$t('common.all'),
                    value: ''
                },
                {
                    label: this.$t('enterprise.index.vip'),
                    value: 'vip'
                },
                {
                    label: this.$t('enterprise.index.trial'),
                    value: 'trial'
                }
            ],
            status: [
                {
                    label: this.$t('common.all'),
                    value: ''
                },
                {
                    label: this.$t('enterprise.index.service'),
                    value: 'in-service'
                }, {
                    label: this.$t('enterprise.index.expired'),
                    value: 'expired'
                }
            ],
            isEmpty: false,
            tableData: [
            ]
        }
    },
    created() {
        this.getCountryList();
        this.getEnterpriseList(1);
    },
    mounted() {
        $('input, textarea').placeholder();
    },
    computed:{
        isSearch(){
            return this.searchKey.country ||  this.searchKey.status || this.searchKey.type || this.searchKey.key;
        }
    },
    methods: {
        querySearchData(queryString, cb) {
            let results = this.countryList.filter((item) => {
                return this.$t(item.twoLetter).indexOf(queryString) > -1;
            })
            cb(results);
        },
        resetKey() {
            this.$refs.searchBar.$emit('resetKey');
            this.searchKey.country = null;
            this.searchKey.status = null;
            this.searchKey.type = null;
            this.searchKey.skip=0;
            this.searchKey.limit = Number.parseInt(localStorage.getItem('currentSize') || 10);
            this.getSeachKey('');
        },
        getSeachKey() {
            this.searchKey.key = this.$refs.searchBar.getKey();
            this.$refs.tableBar && this.$refs.tableBar.handleCurrentChange(1);
            this.getEnterpriseList();
        },
        formatterCountry(row) {
            return this.$t(row.country);
        },
        formatterStatus(row) {
            let status;
            this.status.forEach((item) => {
                if (item.value == row.status) {
                    status = item.label;
                }
            })
            return status;
        },
        formatterType(row) {
            let type;
            this.enMode.forEach((item) => {
                if (item.value == row.type) {
                    type = item.label;
                }
            })
            return type;
        },
        postConfig() {
            let fps = this.isOn ? '1080P/30FPS' : '720P/30FPS';
            let data = {
                enterpriseId: this.currentId,
                maxVideoResolution: fps,
                maxSecondaryFlowResolution: this.maxSecondaryFlowResolution,
                audienceEnable: this.linkOn
            }
            api.setConfig(data)
                .then((res) => {
                    if (res.ret > -1) {
                        this.messagePop(this.$t('enterprise.index.set'), 'success', () => {
                            this.dialogVisible = false;
                        })
                    }
                })
        },
        messagePop(message, type, cb) {
            this.$message({
                message: this.$t(message),
                type: type,
                onClose: () => {
                    typeof cb === 'function' && cb();
                }
            });
        },
        settingConfig(id) {
            this.dialogVisible = true;
            this.currentId = id;
            api.getConfig({ enterpriseId: id })
                .then((res) => {
                    if (res.data.ret > -1) {
                        this.linkOn = res.data.data.audienceEnable;
                        this.isOn = !res.data.data.maxVideoResolution.indexOf('1080P');
                        this.maxSecondaryFlowResolution = res.data.data.maxSecondaryFlowResolution;
                    }
                })
        },
        sortChange(column, event) {
            if (!this.searchKey.orderbys) {
                this.searchKey.orderbys = [];
                this.searchKey.orderbys.push({
                    field: '',
                    order: ''
                })
            }
            if (column.prop) {
                this.searchKey.orderbys[0].field = column.prop;
                this.searchKey.orderbys[0].order = column.order === 'ascending' ? 1 : -1;
            } else {
                this.searchKey.orderbys = null;
            }
            this.getEnterpriseList();


        },
        //
        getEnterpriseList(value) {
            api.getEnterpriseList(setNull(this.searchKey))
                .then((res) => {
                    if (res.ret > -1) {
                        this.tableData = res.data.data;
                        this.total = res.data.total;
                        if (value) {
                            this.isEmpty = this.total <= 0 ;
                        }
                    } else {
                        this.searchKey.country = null;
                        this.searchKey.status = null;
                        this.searchKey.type = null;
                        this.isEmpty = true;
                    }
                })
        },
        getCountryList() {
            api.getCountryList()
                .then((res) => {
                    if (res.data.ret > -1) {
                        this.countryList = res.data.data;
                    }
                })
        },
        handleCurrentChange(params, checked) {
            if (typeof params != 'undefined') {
                this.searchKey.skip = params.skip;
                this.searchKey.limit = params.limit;
            }
            this.getEnterpriseList();
        }
    }
}
</script>
