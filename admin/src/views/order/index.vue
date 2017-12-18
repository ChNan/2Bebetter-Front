<template>
	<div class="g-content" style="min-width:1250px;">
		<div class="g-hd ">
			<div class="clearfix">
				<span class="title">{{title}}</span>
				<router-link :to="{ name: 'order.add'}">
					<el-button type="primary" class="small-i f-fr" style="margin-top:11px;">
						<i class="iconfont icon-jia"></i>
						<span class="u-btn-m3">{{$t('order.index.add')}}</span>
					</el-button>
				</router-link>

			</div>
		</div>
		<div class="g-box">

			<searchbar :tableSearch="getSeachKey" ref="searchBar">
				<div slot="content">
					<el-form :inline="true" style="margin-bottom:-20px;">
						<el-form-item :label="$t('order.index.set')">
							<el-select v-model="searchKey.suiteType" clearable class="u-select">
								<el-option v-for="item in setMenu" :label="item.label" :value="item.value" :key="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item :label="$t('order.index.status')">
							<el-select class="u-select" clearable v-model="searchKey.status">
								<el-option v-for="item in status" :label="item.label" :value="item.value" :key="item.value">
								</el-option>
							</el-select>
						</el-form-item>

						<el-form-item :label="$t('order.index.buyday')">
							<el-date-picker type="daterange" v-model="orderTime" format="yyyy/MM/dd" :placeholder="$t('order.index.chooseday')"></el-date-picker>
						</el-form-item>
						<el-form-item :label="$t('order.index.exDay')">
							<el-date-picker type="daterange" v-model="expireTime" format="yyyy/MM/dd" :placeholder="$t('order.index.chooseday')"></el-date-picker>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="getSeachKey" class="btn100">{{$t('common.search.btn')}}</el-button>
						</el-form-item>
					</el-form>
				</div>
			</searchbar>
			<el-table :data="tableData" stripe ref="table" @sort-change="sortChange">
				<div slot="empty">
					<!-- <table-no-data v-model="searchKey.key" :cb="getSeachKey"></table-no-data>   -->
					<el-row class="u-empty">
						<div v-if="isEmpty" class="f-tac">
							<span class="iconfont icon-kongshuju" style="color:gray;font-size:58px;"></span>
							<br />
							<br/>
							<span>{{$t('common.hint.dataNull')}}</span>
						</div>
						<div class="u-tbtip" v-if="isSearch&&!isEmpty">
							<el-row :gutter="20">
								<el-col :span="6" >
									<!-- <img src="../../assets/img/noSearch.png" alt=""> -->
									<div class="page">
									</div>
								</el-col>
								<el-col :span="16">
									<h4>
										<span style="margin-left:-15px;">{{$t('common.sorry')}}
											<span v-if="searchKey.key">{{$t('common.about')}}"
												<p class="searchkey" :title="searchKey.key">{{searchKey.key}}</p>"</span>
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
											<el-button type="text" @click="resetKey">{{$t('common.hint.clickreturn')}}</el-button>
										</li>

									</ul>
								</el-col>
							</el-row>

						</div>
					</el-row>
				</div>
				<el-table-column prop="createDate" min-width="75" :label="$t('order.index.tablebuyday')" sortable="custom" :sort-method="sortTime" :formatter="formatDate">
				</el-table-column>
				<el-table-column prop="number" min-width="80" :label="$t('order.index.tablenumber')" show-overflow-tooltip>
					<template scope="scope">
						<router-link :to="{path:'/admin/order/detail',query: {type: scope.row.suiteType,id:scope.row._id}}">{{scope.row.number}}</router-link>
					</template>
				</el-table-column>
				<el-table-column prop="suiteType" :formatter="formatSetName" :label="$t('order.index.tablename')" show-overflow-tooltip></el-table-column>
				<el-table-column prop="deadline" min-width="80" :label="$t('order.index.tablestime')" sortable="custom" :formatter="formatSerTime"></el-table-column>
				<el-table-column prop="endDate" min-width="140" :label="$t('order.index.tableeffect')" sortable :formatter="formatDate">

				</el-table-column>
				<el-table-column prop="enterpriseName" min-width="120" :label="$t('order.index.tablebuyer')" show-overflow-tooltip></el-table-column>
				<el-table-column min-width="50" :label="$t('order.index.tablestatus')">
					<template scope="scope">
						<div v-if="scope.row.status == 'inService'">
							{{$t('order.index.inService')}}
						</div>
						<div v-if="scope.row.status == 'expired'">
							{{$t('order.index.expired')}}
						</div>
						<div v-if="scope.row.status == 'ineffective'">
							{{$t('order.index.ineffective')}}
						</div>
						<div v-if="scope.row.status == 'terminated'">
							{{$t('order.index.terminated')}}
						</div>
					</template>
				</el-table-column>
				<el-table-column :label="$t('enterprise.index.operation')" min-width="60" align="center">
					<template scope="scope">
						<a :class="{danger:isExpire(scope.row.status),disabled:!isExpire(scope.row.status)}" v-if="isExpire(scope.row.status)" @click="endServer(scope.row)">{{$t('order.index.term')}}</a>
						<a :class="{danger:isExpire(scope.row.status),disabled:!isExpire(scope.row.status)}" v-else>{{$t('order.index.term')}}</a>
					</template>
				</el-table-column>
			</el-table>
			<div class="f-tar">
				<table-bar :total="total" table="table" ref="tableBar" @change="getOrderList" :checkbox="false"></table-bar>
			</div>
		</div>

		<el-dialog :title="$t('common.hint.title')" :visible.sync="dialogVisible" custom-class="wid200" size="tiny">
			<p class="f-tac">
				{{$t('order.index.hint')}}
			</p>
			<span slot="footer" class="dialog-footer">
				<el-button type="danger" @click="postEndServer">{{$t('order.index.term')}}</el-button>
				<el-button @click="dialogVisible = false">{{$t('common.cancel')}}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<style scoped lang="scss">
ul {
	margin-left: 18px;
	padding: 0;
	span {
		margin-left: -16px;
	}
}
</style>

<script>
import searchbar from '@/components/Searchbar'
import * as api from '../../api/order/index'
import { setNull } from '../../services/toolService'
import moment from 'moment'
export default {
	components: {
		searchbar
	},
	data() {
		return {
			title: this.$t('order.index.allorder'),
			total: 0,
			dialogVisible: false,
			clearLock: true,
			currentPage: 1,
			orderTime: '',
			expireTime: '',
			orderId: '',
			searchKey: {
				key: '',
				enterpriseId: '',
				beginOrderTime: '',
				endOrderTime: '',
				beginExpiryTime: '',
				endExpiryTime: '',
				autoCount: 'true',
				suiteType: '',
				skip: '0',
				status: '',
				limit: Number.parseInt(localStorage.getItem('currentSize') || 10),
				orderbys: [
					{
						field: 'createTime',
						order: -1
					}
				]
			},
			isEmpty: false,
			tableData: [],
			setMenu: [
				{
					label: this.$t('common.all'),
					value: ''
				},
				{
					label: this.$t('enterprise.suitTrial'),
					value: 'trial'
				},
				{
					label: this.$t('enterprise.suitClourd'),
					value: 'basic'
				},
				{
					label: this.$t('enterprise.suitTerm'),
					value: 'vmr'
				},
				{
					label: this.$t('enterprise.suitPort'),
					value: 'cloudPort'
				}
			],
			status: [
				{
					label: this.$t('common.all'),
					value: ''
				},
				{
					label: this.$t('order.index.inService'),
					value: 'inService'
				}, {
					label: this.$t('order.index.expired'),
					value: 'expired'
				},
				{
					label: this.$t('order.index.ineffective'),
					value: 'ineffective'
				},
				{
					label: this.$t('order.index.terminated'),
					value: 'terminated'
				}
			],
		}
	},
	computed: {
		swichDetail() {
			return !!this.$route.query.enterpriseId && this.clearLock;
		},
		isSearch() {
			return this.searchKey.suiteType || this.searchKey.status || this.searchKey.key || this.orderTime || this.expireTime;
		}
	},
	mounted(){
		$('input, textarea').placeholder();
        if (this.$route.query.enterpriseId) {
			this.searchKey.key = this.$route.query.enterpriseId;
			this.searchKey.enterpriseId = this.$route.query.id;
			this.$refs.searchBar.setKey(this.$route.query.enterpriseId)
			this.getOrderList(this.searchKey)
		}else{
			this.getOrderList();
		}
	
	},
	created() {
		// if (this.$route.query.enterpriseId) {
		// 	this.enKey = this.$route.query.enterpriseId;
		// 	//this.searchKey.key = this.enKey;
		// 	this.getOrderList(this.searchKey)
		// 	//this.fetchLastOrder(this.$route.query.enterpriseId);
		// } else{
		// 	this.getOrderList();
		// }
		
	},
	methods: {
		inSearchStatus() {
			//console.log(this.searchKey.status)
			return this.searchKey.key || this.searchKey.suiteType || this.searchKey.status || this.orderTime || this.expireTime;
		},
		fetchLastOrder(id) {
			api.getLatestOrder({ enterpriseId: id })
				.then((res) => {
					if (res.data.ret > -1) {
						let temp = [];
						temp.push(res.data.data)
						this.total = 1;
						this.tableData = temp;
					}
				})
		},
		resetKey() {
			this.$refs.searchBar.$emit('resetKey');
			this.searchKey.suiteType = null;
			this.searchKey.status = null;
			this.orderTime = null;
			this.expireTime = null;
			this.getSeachKey('');
		},
		getSeachKey() {
			this.searchKey.key = this.$refs.searchBar.getKey();
			if (this.$route.query.enterpriseId) {
				let key = this.searchKey.key;
				if(key){
					key = key.trim();
				}
				if(key !== this.$route.query.enterpriseId ){
					this.searchKey.enterpriseId = null;
				}
			}
			this.isInsearch = true;
			this.$refs.tableBar && this.$refs.tableBar.handleCurrentChange(1);
			this.getOrderList(this.searchKey)
		},
		isExpire(value) {
			let valueArray = {
				inService: true,
				expired: false,
				ineffective: true,
				terminated: false
			}
			return valueArray[value];
		},
		//排序接口
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
			this.getOrderList({ skip: this.searchKey.skip, limit: this.searchKey.limit });

		},
		formatDate(row, column) {
			return (column.property == 'createDate' && ((row.createDate && row.createDate.replace(/-/g, "/")) || '--'))||
				(column.property == 'endDate' && ((row.effectiveDate && row.effectiveDate.replace(/-/g, "/")) || '--') + " ~ " + ((row.endDate && row.endDate.replace(/-/g, "/")) || '--'));
		},
		formatSetName(row, column) {
			let temp;
			this.setMenu.forEach((item) => {
				item.value === row.suiteType && (temp = item.label);
			})
			return temp;
		},
		formatSerTime(row, column) {
			return row.deadline + this.$t('order.index.month');
		},
		sortTime(a, b) {
		},
		computedDate() {
			if (!!this.orderTime) {//如果下订单时间不为空
				this.searchKey.beginOrderTime = !!this.orderTime[0] ? new Date(new Date(this.orderTime[0]).setHours(0, 0, 0, 0)).valueOf() : this.orderTime[0];
				this.searchKey.endOrderTime = !!this.orderTime[1] ? new Date(new Date(this.orderTime[1]).setHours(23, 59, 59, 59)).valueOf() : this.orderTime[1];
			} else {
				this.searchKey.beginOrderTime = null;
				this.searchKey.endExpiryTime = null;
			}
			if (!!this.expireTime) {//如果到期时间不为空
				this.searchKey.beginExpiryTime = !!this.expireTime[0] ? new Date(new Date(this.expireTime[0]).setHours(0, 0, 0, 0)).valueOf() : this.expireTime[0];
				this.searchKey.endExpiryTime = !!this.expireTime[1] ? new Date(new Date(this.expireTime[1]).setHours(23, 59, 59, 59)).valueOf() : this.expireTime[1];
			} else {
				this.searchKey.beginExpiryTime = null;
				this.searchKey.endExpiryTime = null;
			}
		},
		getOrderList(params, checked) {
			if (typeof params != 'undefined') {
				this.searchKey.skip = params.skip;
				this.searchKey.limit = params.limit;
			}
			this.computedDate();
			api.getOrderList(setNull(this.searchKey))
				.then((res) => {
					if (res.ret > -1) {
						this.tableData = res.data.data;
						this.total = res.data.total;
						//this.isInsearch = false;
						if (typeof params == 'undefined') {
							this.isEmpty = this.total <= 0;
						}
					} else {
						this.searchKey.suiteType = null;
						this.searchKey.status = null;
						this.orderTime = null;
						this.expireTime = null;
						this.isEmpty = true;
					}

				})
		},
		postEndServer() {
			api.terminateOrder({ id: this.orderId })
				.then((res) => {
					if (res.ret > -1) {
						this.dialogVisible = false;
						this.getOrderList();
					}
				})
		},
		endServer(item) {
			this.dialogVisible = true;
			this.orderId = item._id;
		}
	}
}
</script>
