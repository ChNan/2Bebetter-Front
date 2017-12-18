<template>
	<div class="g-detail">
		<div class="header">
			<span class="title">{{$t('enterprise.detail')}}</span>
			<div class="f-fr link">
				<router-link to="/admin/enterprise">
					<i class="iconfont icon-fanhuishangyiji"></i>
					{{$t('enterprise.return')}}
				</router-link>
			</div>
		</div>

		<el-card>
			<div slot="header" class="clearfix">
				<span class="title">{{$t('enterprise.detail')}}</span>
				<router-link :to="{ path:'/admin/enterprise/edit',query:{id:this.enterpriseId}}">
					<el-button type="primary" class="f-fr small-i">
						<i class="iconfont icon-bianji"></i>
						<span class="u-btn-m3">{{$t('enterprise.edit.editEn')}}</span>
					</el-button>
				</router-link>
			</div>
			<h5 class="txt-over" style="max-width:700px" :title="detail.name || '--'">{{detail.name || '--'}}</h5>
			<p style="color:#999;font-size:14px;" v-if="detail.description">{{detail.description}}</p>
			<p style="border-bottom:1px dashed #e0e0e0;" ></p>
			<el-row class="row">
				<el-col :span="6" class="min-width">
					<label>{{$t('enterprise.id')}}</label>
					<span>{{detail.number || '--'}}</span>
				</el-col>
				<el-col :span="6">
					<label>{{$t('enterprise.size')}}</label>
					<span>{{eMode[detail.size] || '--'}}</span>
				</el-col>
				<el-col :span="12">
					<label>{{$t('enterprise.phone')}}</label>
					<span>{{detail.phoneNo || '--'}}</span>
				</el-col>
			</el-row>
			<el-row class="row">
				<el-col :span="6">
					<label>{{$t('enterprise.loginpw')}}</label>
					<span>*******</span>
				</el-col>
				<el-col :span="6">
					<label>{{$t('enterprise.country')}}</label>
					<span>{{$t(detail.country) || '--'}}</span>
				</el-col>
				<el-col :span="12">
					<label>{{$t('enterprise.email')}}</label>
					<span class="txt-over" style="line-height:19px;vertical-align:bottom;display:inline-block;" :title="detail.email || '--'">{{detail.email || '--'}}</span>
				</el-col>
			</el-row>
			
		<el-row class="row">
		<el-col :span="6">
	        <label></label>
				<span class="email-txt" :title="detail.contactEmail || '--'"><span style="color:#333;">{{$t('enterprise.edit.contactemail')}}</span>{{detail.contactEmail || '--'}}</span>
		</el-col>
		<el-col :span="6">
			<label></label>
			<a class="email-txt"  :title="detail.website || '--'" :href="detail.website"  target="_blank"><span style="color:#333;">{{$t('enterprise.edit.publicweb')}}</span>{{detail.website || '--'}}</a>
		</el-col>
		<!-- <el-col :span="12">
			<label>{{$t('enterprise.edit.intro')}}</label>
			<span class="txt-over" style="line-height:19px;white-space:nowrap;vertical-align:bottom;display:inline-block;" :title="detail.description || '--'">{{detail.description || '--'}}</span>
		</el-col> -->
	</el-row>

		</el-card>

		<el-card>
			<div slot="header" class="clearfix">
				<span class="title">{{$t('enterprise.currrentNum')}}</span>
			</div>
			<el-row>
				<table style="width:100%">
					<tr>
						<td>
							<h1>{{view.conferenceAmount}}</h1>
							<span>{{$t('enterprise.meetting')}}</span>
						</td>
						<td>
							<h1>{{view.onlineStaffAmount}}</h1>
							<span>{{$t('enterprise.online')}}</span>
						</td>
						<td>
							<h1>{{view.staffAmount}}</h1>
							<span>{{$t('enterprise.total')}}</span>
						</td>
						<td>
							<h1>{{view.conferenceRoomAmount}}</h1>
							<span>{{$t('enterprise.roomCount')}}</span>
						</td>
						<td>
							<h1>{{view.vmrAmount}}</h1>
							<span>{{$t('enterprise.cloudCount')}}</span>
						</td>
					</tr>
				</table>
			</el-row>
		</el-card>

		<el-card>
			<div slot="header" class="clearfix">
				<span class="title">{{$t('enterprise.business')}}</span>
				<router-link :to="{ path: '/admin/order', query: { enterpriseId: this.detail.name,id:this.enterpriseId } }">
					<el-button type="primary" class="f-fr small-i">
						<i class="iconfont icon-chakan"></i>
						<span class="u-btn-m3">{{$t('enterprise.check')}}</span>
					</el-button>
				</router-link>
			</div>
			<el-row>
				<el-col :span="2" class="u-icon-min">
					<div :class="{'m-small__port':suitType.type == 'cloudPort',
			                        		'm-small__cloud':suitType.type == 'basic',
			                                'm-small__room':suitType.type == 'vmr',
			                                'm-small__free':suitType.type == 'trial',
											'm-default':suitType.type == ''}" style="width:130px;height:130px;">
						<i :class="{'u-logo__cloud':suitType.type == 'basic',
			                                    'u-logo__port':suitType.type == 'cloudPort',
			                                    'u-logo__room':suitType.type == 'vmr',
			                                    'u-logo__free':suitType.type == 'trial'}"></i>
					</div>
				</el-col>
				<el-col :span="16" class="info">
					<h4 v-if="detail.status =='in-service'">{{setMenu[suitType.type]}}</h4>
					<h4 v-if="detail.status !='in-service' && suitType.type">{{setMenu[suitType.type]}}{{$t('enterprise.setStatus')}}{{suitType.endDate}}{{status[suitType.status]}}</h4>
					<h4 v-if="!suitType.type">{{$t('enterprise.noSet')}}</h4>
					<el-row>
						<ul v-if="suitType.data && suitType.data.cloudPort > 0 ">
							<li>
								<h5>{{$t('enterprise.cloudPort')}}{{suitType.data.cloudPort}} {{$t('enterprise.way')}}</h5>
							</li>

						</ul>
					</el-row>
					<el-row>
						<ul v-if="suitType.data &&suitType.data.terminal">
							<li>
								<h5>{{$t('enterprise.tervmr')}}{{setData.terminalVmrOrderItems}}{{$t('enterprise.one')}} </h5>
							</li>
							<li v-for="(item,index) in vmrShow" :key="index" v-if="item.value > 0">
								<span v-if="item.label == '0' ">n{{$t('enterprise.way')}}</span>
								<template v-else>
									<span v-if="item.label == '8' || item.label =='12'">{{item.label}}+{{item.label}}{{$t('enterprise.way')}}</span>
									<span v-else>{{item.label}}{{$t('enterprise.way')}}</span>
								</template>
								<span>({{item.value}}{{$t('enterprise.one')}})</span>
							</li>
						</ul>
					</el-row>
					<el-row>
						<ul v-if="suitType.data &&suitType.data.cloud">
							<li>
								<h5>{{$t('enterprise.cloudvmr')}}{{setData.cloudVmrOrderItems}}{{$t('enterprise.one')}} </h5>
							</li>
							<li v-for="(item,index) in cloudvmrShow" :key="index" v-if="item.value > 0">
								<span>{{item.label}}{{$t('enterprise.way')}}</span>
								<span>({{item.value}}{{$t('enterprise.one')}})</span>
							</li>
						</ul>
					</el-row>
				</el-col>
			</el-row>
		</el-card>
	</div>
</template>

<style lang="scss" scoped>
$my_width: percentage(319.2/1620);
.email-txt{	
width:100%;
text-overflow: ellipsis;
overflow: hidden;
line-height:19px;
white-space:nowrap;
vertical-align:bottom;
display:inline-block;

}
.row {
	margin-bottom: 10px;
	font-size: 14px;

	label {
		color: #333;
	}

	span {
		color: #999;
	}
}

.info {
	h4 {
		color: #333;
		margin-bottom: 5px;
		margin-top: 12px;
	}

	h5 {
		color: #333;
	}
}

.txt-over {
	max-width: 400px;
	text-overflow: ellipsis;
	overflow: hidden;
}

ul {
	margin: 0;
	padding: 0;
	list-style: none;

	span {
		font-size: 14px;
		display: inline-block;
		line-height: 18px;
		vertical-align: top;
		color: #444;
	}
	span:nth-of-type(2n+1) {
		font-size: 14px;
		margin-left: 46px;
		line-height: 18px;
		vertical-align: top;
		color: #999;
	}
	li {
		float: left;
		margin-top: 18px;
	}
}

.u-icon-min {
	min-width: 160px;
}

table td {
	width: $my_width;
	text-align: center;
	height: 120px;
	h1 {
		font-size: 48px;
		color: #333;
		margin-bottom: 0;
	}
	span {
		font-size: 14px;
	}
}
</style>

<script>
import * as api from '../../api/enterprise/index'
export default {
	data() {
		return {
			detail: '',
			enterpriseId: this.$route.query.id,
			vmrAdd: [
				{
					label: 'n'+this.$t('enterprise.way'),
					value: 0
				}
			],
			eMode:{
				'50': '1~50' + this.$t('enterprise.human'),
				'100': '50~100' + this.$t('enterprise.human'),
				'200': '100~200' + this.$t('enterprise.human'),
				'500': '200~500' + this.$t('enterprise.human'),
				'1000': '500~1000' + this.$t('enterprise.human'),
				'2000': '1000~2000' + this.$t('enterprise.human'),
				'0': this.$t('enterprise.edit.up100')
			},
			setMenu: [
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
			firslock: false,
			cloudvmr:
			{
				'10': 0,
				'25': 0,
				'100': 0,
				'200': 0
			},
			tervmr: {
				'0': 0,
				'8': 0,
				'12': 0,
				'16': 0,
				'24': 0
			},
			view:
			{
				conferenceAmount: '',
				onlineStaffAmount: '',
				staffAmount: '',
				vmrAmount: '',
				conferenceRoomAmount: ''
			},
			setData: {
				basicOrderItem: 0,
				cloudPortOrderItem: 0,
				cloudVmrOrderItems: 0,
				terminalVmrOrderItems: 0
			},
			suitType: {
				type: '',
				status: '',
				endDate: '',
				data: ''
			},
			status: {
				'expired': this.$t('enterprise.statusExpried'),
				'terminated': this.$t('enterprise.end')
			},
			setMenu: {
				trial: this.$t('enterprise.suitTrial'),
				basic: this.$t('enterprise.suitClourd'),
				vmr: this.$t('enterprise.suitTerm'),
				cloudPort: this.$t('enterprise.suitPort'),
			},
			cloudTotal:0,
		}
	},
	computed: {
		vmrShow() {
			let temp = [];
			Object.keys(this.tervmr).forEach((item) => {
				temp.push({
					label: item,
					value: this.tervmr[item]
				})
			})
			return temp;
		},
		cloudvmrShow() {
			let temp = [];
			Object.keys(this.cloudvmr).forEach((item) => {
				// console.log(item)
				temp.push({
					label: item,
					value: this.cloudvmr[item]
				})
			})
			return temp;
		}
	},
	created() {
		this.getDetail(this.enterpriseId);
		this.getType(this.enterpriseId);
		this.getMergeView(this.enterpriseId);
		this.getEnterpriseCount(this.enterpriseId);
	},
	methods: {
		getDetail(id) {
			api.getEnterprise({ id: id })
				.then((res) => {
					if (res.data.ret > -1) {
						//console.log(res.data.data)
						this.detail = res.data.data;
					}
				})
		},
		//企业当前情况
		getEnterpriseCount(id) {
			api.getAllCounts({ enterpriseId: id })
				.then((res) => {
					if (res.data.ret > -1) {
						this.view = res.data.data;
					}

				})
		},
		getType(id) {
			api.getSuitType({ enterpriseId: id })
				.then((res) => {
					if (res.data.ret > -1) {
						if (res.data.data) {
							//console.log(res.data.data);
							let data = res.data.data;
							//this.suitType.type = data.suiteType;
							this.suitType = Object.assign(this.suitType, {
								type: data.suiteType,
								status: data.status,
								endDate: data.terminatedDate
							})
						}

					}
				})
		},
		getMergeView(id) {
			api.getAllowSet({ enterpriseId: id })
				.then((res) => {
					if (res.data.ret > -1) {
						this.suitType.data = res.data.data;
						if(this.suitType.data){
							if (this.suitType.data.cloud) {
								Object.keys(this.suitType.data.cloud).forEach((item) => {
									//if(!this.setData.cloudVmrOrderItems)
									this.setData.cloudVmrOrderItems = this.setData.cloudVmrOrderItems + this.suitType.data.cloud[item];
									//let index = item.split('+')[0];
									this.cloudvmr[item] = this.suitType.data.cloud[item];
								})
							}
							if (this.suitType.data.terminal) {
								Object.keys(this.suitType.data.terminal).forEach((item) => {
									this.setData.terminalVmrOrderItems = this.setData.terminalVmrOrderItems + this.suitType.data.terminal[item];
									let index = item.split('+')[0];
									this.tervmr[index] = this.suitType.data.terminal[item];
								})
							}
						}
						
					}
				})
		}
	}
}
</script>
