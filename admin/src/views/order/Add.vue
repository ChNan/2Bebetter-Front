<template>
	<div class="g-content">
		<div class="m-cover">
			<el-card class="full clearfix" style="border-radius:20px;">
				<div slot="header" class="clearfix">
					<span class="title">{{title}}</span>
					<span class="tip">{{$t('order.add.hint')}}</span>
					<div class="f-fr link">
						<!-- <router-link to="/admin/order"> -->
						<el-button type="text" @click="returnLast">
							<i class="iconfont icon-fanhuishangyiji"></i>{{$t('enterprise.return')}}
						</el-button>
						<!-- </router-link> -->
					</div>
				</div>
				<div class="u-stp" @keyup="getReal($event)">
					<el-steps :space="300" :active="active" finish-status="success" align-center>
						<el-step :title="$t('order.detail.buyerinfo')"></el-step>
						<el-step :title="$t('order.add.choose')"></el-step>
					</el-steps>
					<el-form label-width="180px" :model="form" class="m-fm" v-if="active == 0" :rules="validRule">
						<el-form-item :label="$t('enterprise.id')" required class="u-fm-label" :model="form" prop="enterpriseNumber">
							<el-input v-model="form.enterpriseNumber" name="enterpriseNumber" :placeholder="$t('order.add.id5')" :maxlength="5"></el-input>
						</el-form-item>
						<el-form-item :label="$t('enterprise.edit.name')" required class="u-fm-label" :error="errors.enterpriseName">
							<el-select @keydown.native="changeInput($event)" class="full" name="enterpriseName" v-model="form.enterpriseName" id="name" :loading="loading" filterable remote :placeholder="$t('order.add.entername')" :remote-method="querySearchData">
								<el-option v-for="(item,index) in render" :key="item" :label="item" :value="item">
								</el-option>
							</el-select>
							<!-- <el-autocomplete class="full" v-model="form.enterpriseName" :fetch-suggestions="querySearchData" :placeholder="$t('order.add.entername')" @select="handleSelect"></el-autocomplete> -->
						</el-form-item>
					</el-form>
					<el-form label-width="180px" class="m-fm" v-if="active > 0" ref="formSet" :model="formSet" :rules="validRule">
						<el-form-item :label="$t('order.add.suitType')" class="u-fm-label">
							<el-select @change="changeSetMenu" v-model="formSet.suiteType" style="width:100%">
								<el-option v-for="item in setMenu" :label="item.label" :value="item.value" :key="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item :label="$t('order.add.pakage')" class="u-fm-label" required>
							<el-checkbox v-model="formSet.isCloud" v-if="isView == 'basic'">{{$t('order.suit.cloudbasic')}}</el-checkbox>
							<template v-if="isView == 'vmr'">
								<el-button type="info" @click="pushVirtual()">
									<i class="iconfont icon-jia font14 pdr5"></i>{{$t('order.add.buttonadd')}}
								</el-button>
								<div v-if="virtualArray && virtualArray.length">
									<el-row v-for="(item,index) in virtualArray" class="u-group" :key="index">
										<el-col :span="6" class="u-fm-mg">
											<el-select v-model="item.type" @change="changevmrType(index,item)">
												<el-option v-for="(item,index) in vmrType" :value="item.value" :label="item.label" :key="index"></el-option>
											</el-select>
										</el-col>
										<el-col :span="6" class="u-fm-mg">
											<el-select v-model="item.way">
												<el-option v-for="(item,index) in item.wayArray" :value="item.value" :label="item.label" :key="index"></el-option>
											</el-select>
										</el-col>

										<el-col :span="10" class="u-fm-mg">
											<el-row>
												<span class="u-fm-error" v-if="item.error!=''">{{item.error}}</span>
											</el-row>
											<div class="el-input" :class="{'u-fm-error2':item.error!=''}">
												<input autocomplete="off" type="text" v-model="item.mac" @keyup="checkMac(item,$event)" :id="index" class="el-input__inner" :placeholder="$t(item.holder)">
											</div>
										</el-col>
										<el-col :span="1">
											<span class="u-delete" @click="delVirtualArray(index)">
												<i class="iconfont icon-jianqu"></i>
											</span>
										</el-col>
									</el-row>
								</div>
							</template>
							<template v-if="isView == 'cloudPort'">
								<el-row>
									<el-col :span="9">
										<el-select v-model="portType">
											<el-option v-for="(item,index) in packageType" :key="index" :value="item.value" :label="item.label">
											</el-option>
										</el-select>
									</el-col>
									<el-col :span="14" :offset="1">
										<el-row>
											<span class="u-fm-error5" v-if="portError!=''">{{portError}}</span>
										</el-row>
										<div class="el-input" :class="{'u-fm-error2':portError!=''}">
											<input autocomplete="off" :maxlength="10" type="text" name="limit" @blur="checkCloudPort" @keyup.native="checkCloudPort($event)" class="el-input__inner" v-model="formSet.cloudPortOrderItem.limit" :placeholder="$t('order.add.way')">
										</div>
									</el-col>
								</el-row>
								<span class="txt-tip2">{{$t('order.add.hintCloudport')}}</span>
							</template>
						</el-form-item>
						<el-form-item :label="$t('enterprise.tervmr')" class="u-fm-label" v-if="isView == 'basic'">
							<el-button @click="pushVMR()" type="info">
								<i class="iconfont icon-jia font14 pdr5"></i>{{$t('order.add.buttonadd')}}
							</el-button>
							<div v-if="vmrArray&&vmrArray.length > 0">
								<el-row v-for="(item,index) in vmrArray" class="u-group" :key="index">

									<el-col :span="6" class="u-fm-mg">
										<el-select v-model="item.way">
											<el-option v-for="(item,index) in vmrAdd" :value="item.value" :label="item.label" :key="index"></el-option>
										</el-select>
									</el-col>
									<el-col :span="10" class="u-fm-mg">
										<el-row>
											<span class="u-fm-error" v-if="item.error!=''">{{item.error}}</span>
										</el-row>
										<div class="el-input" :class="{'u-fm-error2':item.error!=''}">
											<input autocomplete="off" type="text" :placeholder="$t('order.add.mac')" :id="index" v-model="item.mac" @keyup="checkMac(item,$event)" class="el-input__inner">
										</div>
									</el-col>
									<el-col :span="1">
										<span class="u-delete" @click="delVMRArray(index)">
											<i class="iconfont icon-jianqu"></i>
										</span>
									</el-col>
								</el-row>
							</div>

						</el-form-item>
						<el-form-item :label="$t('enterprise.tervmr')" class="u-fm-label" v-if="isView == 'cloudPort'">
							<el-button @click="pushVMR()" type="info">
								<i class="iconfont icon-jia font14 pdr5"></i>{{$t('order.add.buttonadd')}}
							</el-button>
							<div v-if="vmrArray&&vmrArray.length > 0">
								<el-row v-for="(item,index) in vmrArray" class="u-group" :key="index">
									<el-col :span="6" class="u-fm-mg">
										<el-select v-model="item.way">
											<el-option v-for="(item,index) in portCloudvmr" :value="item.value" :label="item.label" :key="index"></el-option>
										</el-select>
									</el-col>
									<el-col :span="10" class="u-fm-mg">
										<el-row>
											<span class="u-fm-error" v-if="item.error!=''">{{item.error}}</span>
										</el-row>
										<div class="el-input" :class="{'u-fm-error2':item.error!=''}">
											<input autocomplete="off" type="text" :placeholder="$t('order.add.mac')" :id="index" v-model="item.mac" @keyup="checkMac(item,$event)" class="el-input__inner">
										</div>
									</el-col>
									<el-col :span="1">
										<span class="u-delete" @click="delVMRArray(index)">
											<i class="iconfont icon-jianqu"></i>
										</span>
									</el-col>
								</el-row>
							</div>

						</el-form-item>
						<el-form-item :label="$t('order.add.buydeadline')" prop="deadline" class="u-fm-label">
							<el-input class="u-input" v-model="formSet.deadline" name="deadline" :maxlength="10" @keyup.native="checkCloudPort($event)"></el-input>
							<span>&nbsp;{{$t('order.index.month')}}</span>
						</el-form-item>
						<el-form-item :label="$t('order.add.effectday')" class="u-fm-label" prop="effectiveDate" required>
							<el-date-picker v-model="formSet.effectiveDate" :picker-options="datePickerOptions" type="date" :placeholder="$t('order.add.chooseDays')">
							</el-date-picker>
						</el-form-item>
						<el-form-item :label="$t('order.detail.mark')" class="u-fm-label">
							<el-input type="textarea" :rows="3" style="resize: none;" :maxlength="200" name="remark" v-model="formSet.remark"></el-input>
							<label class="txt-tip1">{{$t('enterprise.edit.restWord',{'restWord':restWord})}}</label>
						</el-form-item>
					</el-form>
					<div class="u-fm-btn">
						<el-button type="primary" v-if="active   == 0 " @click="next" class="btn100" :disabled="disableNext">{{$t('order.add.nextStep')}}</el-button>
						<div v-else>
							<el-button type="primary" @click="submitForm()" class="btn100" :disabled="lock">{{$t('order.add.submit')}}</el-button>
							<el-button class="btn100" @click="cancel()">{{$t('common.cancel')}}</el-button>
						</div>
					</div>

				</div>

			</el-card>
		</div>

	</div>
</template>

<style scoped lang="scss">
.u-stp {
	width: 333px;
	margin: 0 auto;

	.el-steps {
		margin-bottom: 40px;
	}
}

.u-delete {
	cursor: pointer;
	color: #FF4948;

	i {
		margin: 3px;
	}

	&:hover {
		i {
			color: #e64545;
		}
	}
}

.m-fm {
	width: 620px;
	margin-left: -230px;

	.u-input {
		width: 20%;
	}
}

.u-group {
	margin-top: 22px;
}

.u-fm-error {
	display: block; // float: right;
	// margin-right: 33%;
	margin-top: -20px;
	color: #fa5050;
	font-size: 12px;
	line-height: 1;
}

.u-fm-error5 {
	display: block;
	margin-top: -16px;
	color: #fa5050;
	font-size: 12px;
	line-height: 1;
}

.u-fm-error2 {
	.el-input__inner {
		border: 1px solid #ff4949;
		&:hover {
			border: 1px solid #ff6d6d;
		}
		&:focus {
			border: 1px solid #e64545;
		}
	}
}

.u-fm-error3 {
	display: block;
	line-height: 20px;
	margin-left: 26%;

	color: #fa5050;
	font-size: 12px;
}

.u-fm-mg {
	margin-right: 5px;
}

.u-fm-btn {
	margin-left: -50px;
}

.u-btn-dis {
	opacity: .5;
	&:hover {
		cursor: not-allowed;
	}
}
</style>

<script>
import * as api from '../../api/order/index'
import timezone from './timezone'
import moment from 'moment'
import { capsLock } from '../../services/toolService'
export default {
	data() {
		let checkNumber = (rule, value, callback) => {
			if (value === '') {
				callback(new Error(this.$t('enterprise.error.numempty')));
			} else if (!/^[0-9]{5,5}$/.test(value)) {
				return callback(new Error(this.$t('enterprise.error.dig5')));
			} else {
				callback();
			}

		}
		let checkDeadline = (rule, value, callback) => {
			if (!/^([1-9]\d*)+$/.test(value)) {
				callback(new Error(this.$t('order.add.error')));
			} else {
				callback();
			}
		}
		let checkEffectDate = (rule, value, callback) => {//诡异的require：true出错
			if (!value) {
				callback(new Error(this.$t('order.add.dayempty')));
			} else {
				callback();
			}
		}
		return {
			title: this.$t('order.index.add'),
			active: 0,
			lock: true,
			effectCount: 0,
			toNext: true,
			isError: true,
			portError: '',
			errors: {
				enterpriseName: '',
				selectValue: 'yealink'
			},
			loading: false,
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7;
				}
			},
			validRule: {
				enterpriseNumber: [
					{
						validator: checkNumber, trigger: 'blur'
					}
				],
				enterpriseName: [
					{ required: true, message: this.$t('enterprise.add.nameempty'), trigger: 'blur' }
				],
				deadline: [
					{ required: true, message: this.$t('order.add.buyerempty'), trigger: 'blur' },
					{ validator: checkDeadline, trigger: 'blur' }
				],
				effectiveDate: [
					{ validator: checkEffectDate, trigger: 'blur' }
				]
			},
			form: {
				enterpriseNumber: '',
				enterpriseName: ''
			},
			portType: 'port',
			vmrAdd: [
				{
					label: 'n' + this.$t('enterprise.way'),
					value: 0
				}
			],
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
			packageType: [
				{
					label: this.$t('order.suit.cloudport'),
					value: 'port'
				}],
			vmrType: [
				{
					label: this.$t('order.suit.temvmr'),
					value: 0,
					way: [
						{
							label: '4+4' + this.$t('enterprise.way'),
							value: 4
						}, {
							label: '8+8' + this.$t('enterprise.way'),
							value: 8
						},
						{
							label: '12+12' + this.$t('enterprise.way'),
							value: 12
						}]
				},
				{
					label: this.$t('order.detail.cloudvmr'),
					value: 1,
					way: [{
						label: '10' + this.$t('enterprise.way'),
						value: 10
					},
					{
						label: '25' + this.$t('enterprise.way'),
						value: 25
					},
					{
						label: '50' + this.$t('enterprise.way'),
						value: 50
					},
					{
						label: '100' + this.$t('enterprise.way'),
						value: 100
					},
					{
						label: '200' + this.$t('enterprise.way'),
						value: 200
					}]
				}
			],
			portCloudvmr: [{
				label: '16' + this.$t('enterprise.way'),
				value: 16
			}, {
				label: '24' + this.$t('enterprise.way'),
				value: 24
			}],
			wayArray: [
				{
					label: '4+4' + this.$t('enterprise.way'),
					value: 4
				}, {
					label: '8+8' + this.$t('enterprise.way'),
					value: 8
				},
				{
					label: '12+12' + this.$t('enterprise.way'),
					value: 12
				}],
			virtualArray: [],//虚拟会议室
			vmrArray: [],//其他两种类型存的vmr
			utcOffset: '',
			render: [],
			timeout: null,
			formSet: {
				suiteType: 'basic',
				isCloud: true,
				deadline: null,
				effectiveDate: '',
				remark: '',
				terminalVmrOrderItems: [],
				cloudVmrOrderItems: [],
				cloudPortOrderItem: {
					limit: ''
				}
			},
			isView: 'basic',
			flag: false,
			zhlang: false,
		}
	},
	computed: {

		datePickerOptions() {
			return {
				disabledDate: (time) => {
					let now = new Date().valueOf();
					//console.log(this.utcoffset)
					let nowZoneDate = timezone.getTimezoneDate(now, this.utcOffset);
					let nowZoneStamp = this.initStamp(nowZoneDate, "00:00", this.utcOffset);
					let pickerDate = this.getDate(time);
					let pickerStamp = this.initStamp(pickerDate, "00:00", this.utcOffset);
					return nowZoneStamp > pickerStamp
				},
			}
		},
		restWord() {
			return 200 - this.formSet.remark.length;
		},
		disableNext() {
			return !!this.errors.enterpriseName || this.errors.selectValue !== this.form.enterpriseName
		}
	},
	watch: {
		//检测输入框填写完后提交按钮解禁
		'formSet': {
			deep: true,
			handler: function(value) {
				//console.log(this.effectCount+value)
				//console.log(this.effectCount)
				if (this.firslock && this.effectCount === 0) {
					this.effectCount++;
				} else {
					this.setLock(this.unLock(value));
				}

			}
		}

	},
	mounted() {
		$('input, textarea').placeholder();
		if (this.isChrome()) {
			let node = document.getElementById('name');
			node.addEventListener('compositionstart', () => {
				this.flag = false;
				this.zhlang = true;
			})
			node.addEventListener('compositionend', () => {
				this.flag = true;
				this.zhlang = false;
			})
		}

	},
	methods: {
		getReal(e) {
			if (this.active == 0) {
				this.form = capsLock(e, this.form);
			} else {
				this.formSet = capsLock(e, this.formSet);
			}
		},
		changeInput(e) {
			if (e.shiftKey == 1) {
				if (this.zhlang) {
					if (e.target.value)
						this.queryData(e.target.value);
				}
			}
		},
		isChrome() {
			let userAgent = navigator.userAgent;
			return navigator.userAgent.indexOf('Chrome') > -1;
		},
		getZone(id) {
			api.getTimezone({ enterpriseName: this.form.enterpriseName, enterpriseNumber: this.form.enterpriseNumber })
				.then((res) => {
					if (res.data.ret > -1) {
						this.utcOffset = res.data.data.utcOffset / 60;
					}
				})

		},
		initStamp(date, timePoint) {
			date = this.getDate(date);
			return new Date(date.replace(/\//g, "-") + "T" + timePoint + timezone.getTimezoneNum(this.utcOffset)).valueOf()
		},
		getDate(date) {
			if (typeof date === "undefined" || date === '' || date === null) date = new Date();
			let year = new Date(date).getFullYear();
			let month = new Date(date).getMonth() + 1;
			let day = new Date(date).getDate();
			month = month < 10 ? "0" + month : month;
			day = day < 10 ? "0" + day : day;
			return year + "/" + month + "/" + day;
		},
		queryData(queryString) {
			if (queryString !== '') {
				this.loading = true;
				clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					api.fuzzyMatchName({ fuzzyName: queryString.trim(), number: this.form.enterpriseNumber }, false, '')
						.then((res) => {
							if (res.data.ret > -1) {
								this.errors.enterpriseName = '';
								this.render[0] = res.data.data;
								this.errors.selectValue = res.data.data;
							} else {
								let { data: { error: { msg, fieldErrors: [{ msg: _msg }] } } } = res;
								this.errors.enterpriseName = this.$t(msg || _msg);
								this.render = [];
							}
							this.loading = false;

						}).catch((err) => {
							this.loading = false;
							this.render = [];
						})
				}, 800)
			} else {
				this.errors.enterpriseName = '';
				this.render = [];
			}
		},
		querySearchData(queryString) {
			//console.log(this.zhlang)
			if (this.isChrome() && this.zhlang) {
				if (this.flag && queryString !== '')
					this.queryData(queryString.trim());
				else {
					this.render = [];
				}
			} else {
				if (queryString !== '')
					this.queryData(queryString.trim());
				else {
					this.render = [];
				}
			}
		},
		handleSelect(item) {
			this.form.enterpriseName = item.value;
		},
		unLock(value) {
			let islock;
			//console.log(value.suiteType)
			switch (value.suiteType) {
				case 'basic':
					if (this.vmrArray.length > 0) {//vmr 非必需
						islock = this.isAbleArray(this.vmrArray) && this.objectCheck(value) && !this.isError;
					} else {
						//this.isError = false;
						islock = this.objectCheck(value);
					}
					break;
				case 'vmr': islock = this.isAbleArray(this.virtualArray) && this.objectCheck(value) && !this.isError;
					break;
				case 'cloudPort':
					//console.log(/^\d+$/.test(this.formSet.cloudPortOrderItem.limit));
					if (!/^[1-9]\d*$/.test(this.formSet.cloudPortOrderItem.limit)) {
						this.portError = this.$t('order.add.lg0');
					} else {
						this.portError = '';
					}
					if (this.vmrArray.length > 0) {//vmr 非必需
						islock = this.isAbleArray(this.vmrArray) && this.objectCheck(value) && this.formSet.cloudPortOrderItem.limit && !this.isError && !this.portError;
					} else {
						islock = this.objectCheck(value) && this.formSet.cloudPortOrderItem.limit && !this.portError;
					}
					//console.log(islock)
					break;
			}
			return !islock;
		},
		objectCheck(value) {
			for (let name in value) {
				if (!Array.isArray(value[name]) && name !== 'remark' && value[name] == "" || value[name] == null) {

					return false;
				}
			}
			return true;
		},
		next() {
			let data = {
				fuzzyName: this.form.enterpriseName,
				number: this.form.enterpriseNumber
			}
			api.fuzzyMatchName(data, false, '')
				.then((res) => {
					if (res.data.ret > -1) {
						this.getZone(this.form.enterpriseNumber);
						this.active++;
						this.$nextTick(() => {
							$('input, textarea').placeholder();
						})

					} else {
						let { data: { error: { msg, fieldErrors: [{ msg: _msg }] } } } = res;
						this.errors.enterpriseName = this.$t(msg || _msg);
					}
				}).catch((err) => {

					this.loading = false;
					this.render = [];
				})


		},
		submitForm() {
			this.$refs.formSet.validate((valid) => {
				if (valid) {
					if (!this.lock) {
						api.addOrder(this.formatData()).then((res) => {
							if (res.ret > 0) {
								this.showSuccess(res.data)
							} else {
								this.formSet.terminalVmrOrderItems = [];
								this.formSet.cloudVmrOrderItems = [];
							}
						})
					}
				} else {
					return false;
				}
			}
			);

		},
		showSuccess(orderId) {
			this.$alert(this.$t('order.add.orderId') + orderId, this.$t('common.hint.addsuccess'), {
				confirmButtonText: this.$t('common.ok'),
				topIcon: 'iconfont icon-chenggongleitishi success',
				callback: action => {
					this.$router.push('/admin/order')
				}
			});
		},
		isAbleArray(arrays) {
			let count = 0;
			arrays.forEach((item) => {
				if (item.type == 0 || typeof item.type == 'undefined') {
					item.error = this.testMac(item.mac) ? '' : this.$t('order.add.macerrror');
					if (!item.error) {
						item.error = this.uniMac(arrays, item.mac) ? this.$t('order.add.macreduce') : '';
					}
				} else {
					item.error = /^\d{1,10}$/.test(item.mac) ? '' : this.$t('order.add.numberneed');
				}
				if (item.error != '') {
					this.isError = true;
					count = count + 1;
				}
			})
			if (arrays && arrays.length > 0 && count == 0) {
				this.isError = false;
			}
			return arrays && arrays.length > 0;
		},
		//提交数据的重构
		formatData() {
			if (this.isAbleArray(this.virtualArray)) {
				this.virtualArray.forEach((item) => {
					//两种type
					if (item.type == 0) {
						let vmrtemp = this.computedOrder(this.formSet.suiteType, item.way)
						vmrtemp.mac = item.mac;
						this.resetArray(this.formSet.terminalVmrOrderItems);
						this.formSet.terminalVmrOrderItems.push(vmrtemp)
					} else {
						let cloudtemp = {
							limit: item.way,
							amount: item.mac
						}
						this.resetArray(this.formSet.cloudVmrOrderItems);
						this.formSet.cloudVmrOrderItems.push(cloudtemp)
					}
				})
			}
			if (this.isAbleArray(this.vmrArray)) {
				this.vmrArray.forEach((item) => {
					let vmrtemp = this.computedOrder(this.formSet.suiteType, item.way)
					vmrtemp.mac = item.mac;
					this.resetArray(this.formSet.terminalVmrOrderItems);
					this.formSet.terminalVmrOrderItems.push(vmrtemp)
				})
			}
			//this.formSet.effectiveDateStamp = new Date(this.formSet.effectiveDateStamp).valueOf();
			this.formSet.effectiveDate = moment(this.formSet.effectiveDate).format('YYYY-MM-DD');
			let data = Object.assign({}, this.formSet, this.form);
			delete data.isCloud;
			this.setNull(data);
			return data;
		},
		setParentNull(data, prop) {
			let tempData = data[prop];
			if (typeof data[prop] == 'object') {
				for (let prop in tempData) {
					if (!!tempData[prop]) {
						return true;
					}
				}
			}
			return false;
		},
		setNull(data) {
			for (let prop in data) {
				if (typeof data[prop] == 'object') {
					this.setNull(data[prop]);
					!this.setParentNull(data, prop) && (data[prop] = null);
				} else {
					if (data[prop] === "") {
						data[prop] = null;
					} else if (typeof data[prop] === 'string') {
						data[prop] = data[prop].trim();
					}
				}
			}
		},
		resetArray(value) {
			typeof value == 'array' && (value = []);
		},
		pushVirtual() {
			let data = {
				type: 0,
				way: 4,
				mac: '',
				holder: this.$t('order.add.macholder'),
				wayArray: this.vmrType[0].way,
				error: ''
			}
			this.virtualArray.unshift(data);

			this.$nextTick(() => {
				$('input, textarea').placeholder();
			})


		},
		checkCloudPort(e) {
			if (this.isView == 'cloudPort') {
				if (typeof e != 'undefined')
					this.formSet.cloudPortOrderItem = capsLock(e, this.formSet.cloudPortOrderItem);
				if (!/^[1-9]\d*$/.test(this.formSet.cloudPortOrderItem.limit)) {
					this.portError = this.$t('order.add.lg0');
				} else {
					this.portError = '';
				}
			}
			this.effectCount++;
		},
		setLock(value) {
			this.lock = value;
		},
		testMac(mac) {
			return /^([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2}$/.test(mac) |
				/^([A-Fa-f0-9]{2}){5}[A-Fa-f0-9]{2}$/.test(mac) |
				/^([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}$/.test(mac);
		},
		uniMac(arrays, mac) {
			let count = 0;
			arrays.forEach((item) => {
				if (item.mac == mac) {
					count++;
				}
			})
			return count > 1;
		},
		checkMac(item, e) {
			item = capsLock(e, item);
			if (item.type == 1) {
				item.error = /^\d+$/.test(item.mac) ? '' : this.$t('order.add.numberneed');
			} else {
				item.error = this.testMac(item.mac) ? '' : this.$t('order.add.macerrror');
			}
			return this.setLock(this.unLock(this.formSet));
		},
		pushVMR() {
			//$(function() { $('input, textarea').placeholder(); });
			let data = {
				way: this.formSet.suiteType === 'cloudPort' ? 16 : 0,
				mac: '',
				error: ''
			}
			this.vmrArray.unshift(data);

			this.$nextTick(() => {
				$('input, textarea').placeholder();
			})
		},
		delVirtualArray(index) {
			this.virtualArray.splice(index, 1);
			this.setLock(this.unLock(this.formSet));
		},
		delVMRArray(index) {
			this.vmrArray.splice(index, 1);
			this.setLock(this.unLock(this.formSet));
		},
		//选择vmr类型变化，变化对应的选项
		changevmrType(index, item) {
			this.vmrType.forEach((it) => {
				if (it.value == item.type) {
					this.virtualArray[index].wayArray = it.way;
				}
			})
			this.virtualArray[index].way = item.type == 0 ? 8 : 10;
			this.virtualArray[index].holder = item.type == 0 ? this.$t('order.add.macholder') : this.$t('order.add.way');
			this.setLock(this.unLock(this.formSet));
		},
		//选择套餐类型变化
		changeSetMenu(item) {
			this.isView = item;
			this.vmrArray = [];
			this.portError = '';
			//this.formSet.deadline='';
			this.isError = true;
			//this.formSet.effectiveDate='';
			this.virtualArray = [];
			this.formSet.isCloud = true;
			//this.formSet.cloudPortOrderItem.limit = '';
			//this.$refs.formSet.resetFields();
			if (this.isView === 'cloudPort') {
				this.firslock = true;
				//this.effectCount = 0;
			}
			this.$nextTick(() => {
				$('input, textarea').placeholder();
			})
		},

		/**
		 * @argument type 套餐类型 value 容量值
		 */
		//计算各套餐情况的前后端值
		computedOrder(type, value) {
			let order = {
				frontendLimit: "",
				backendLimit: ""
			}
			switch (type) {
				case 'basic':
					order.frontendLimit = 0;
					order.backendLimit = 0;
					break;
				case 'vmr':
					order.frontendLimit = value;
					order.backendLimit = value;
					break;
				case 'cloudPort':
					order.frontendLimit = value;
					order.backendLimit = null;
					break;
			}
			return order;
		},
		cancel() {
			this.$router.push('/admin/order');
		},
		returnLast() {
			if (this.active > 0) {
				this.active = 0;
			} else {
				this.$router.go(-1);
			}
		}
	}
}
</script>
