<template>
	<div class="g-bd">
		<div class="g-hd">
			<!--基本设置-->
			<h3>{{$t('user.update.title')}}</h3>
		</div>
		<!--页面头部-->
		<div class="g-wrap-account">
			<el-row class="header">
				<el-col class="m-logo">
					<div>
						<img src="../assets/img/default.png" />
					</div>
				</el-col>
				<el-col :span="14" class="pl40">
					<div>
						<p>{{$t('user.update.account')}} {{form.email}}</p>
						<p>{{$t('user.update.number')}} {{form.number}}</p>
						<p>{{$t('user.update.email')}} {{form.email}}</p>
						<span>{{$t('user.update.password')}} ******</span>
						<a class="u-change" @click="openDialog"> {{$t('user.update.edit')}}</a>
					</div>
				</el-col>
			</el-row>
			<el-form ref="form" label-width="155px" :model="form" :rules="rules">
				<el-form-item :label="$t( 'user.update.base')" class="both">
				</el-form-item>
				<el-form-item :label="$t( 'user.update.name')" required class="pl30">
					<el-input v-model="form.name" disabled :maxlength="128"></el-input>
				</el-form-item>
				<el-form-item :label="$t( 'user.update.tel')" prop="phoneNo" class="pl30">
					<el-input v-model="form.phoneNo" :maxlength="64" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label=" " class="pl30">
					<el-button type="primary" class="btn100" @click="saveAccount()" :disabled="isAble">{{$t('common.save')}}</el-button>
					<el-button class="btn100" @click="cancel()">{{$t('common.cancel')}}</el-button>
				</el-form-item>
			</el-form>
		</div>
		<el-dialog :title="$t('user.update.edit.title')" :visible.sync="dialogVisible"  customClass="ed50" :before-close="handleClose">
			<el-form :model="pwdForm" ref="pwdForm" :rules="rules" label-width="180px">
				<el-form-item :label="$t('user.update.now')" prop="oldPassword" required>
						<el-input type="password" v-model="pwdForm.oldPassword" auto-complete="off" :maxlength="64"></el-input>
				</el-form-item>
				<el-form-item :label="$t('user.update.new')" prop="newPassword" required>
					<el-tooltip class="item" :disabled="disabledNewPassword&&!pwdForm.newPassword"  effect="dark" :content="$t('validate.pass.format')" placement="top">
						<el-input type="password" @focus="disabledNewPassword=false" @blur="disabledNewPassword=true"
                                  v-model="pwdForm.newPassword" auto-complete="off" :maxlength="64"></el-input>
					</el-tooltip>
				</el-form-item>
				<el-form-item :label="$t('user.update.sure')" prop="checkPass" required>
					<el-tooltip class="item" :disabled="disabledCheckPass"  effect="dark" :content="$t('recovery.newPass.passAgain')" placement="top">
						<el-input type="password"  @focus="disabledCheckPass=false&&pwdForm.checkPass" @blur="disabledCheckPass=true"
                                   v-model="pwdForm.checkPass" auto-complete="off" :maxlength="64"></el-input>
					</el-tooltip>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitFrom()">{{$t('user.update.edit')}}</el-button>
				<el-button @click="handleClose()">{{$t('common.cancel')}}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<style scoped lang="scss" scoped>
.m-logo {
	width: 100px;
	height: 100px;
}

.g-bd {
	min-height: calc(100% - 42px);
}

.g-wrap-account {
	font-size: 14px;
	width: 600px;
	.header {
		margin: 40px;
	}
	.pl30 {
		padding-left: 30px;
	}
	.pl40 {
		padding-left: 40px;
	}
	.btn100 {
		width: 100px;
	}
	.both {
		font-weight: bold;
	}
	.u-change {
		color: #2699f4;
        cursor: pointer;
	}
	p {
		padding: 0;
		margin: 0px;
		line-height: 26px;
	}
}
</style>

<script>
import * as api from '../api/common'
import { filterParams } from '../services/toolService'
import md5 from 'md5'
import { validatePass, validateTel } from '../services/verificationService'

export default {
	data() {
		const validatePassRep = (rule, value, callback) => {
			if (value != '' && value !== this.pwdForm.newPassword) {
				callback(new Error(this.$t('validate.pass.confirm')));
			} else {
				callback();
			}
		}

		const rules = {
			phoneNo: [
				{ validator: validateTel, trigger: 'blur' }
			],
			contactEmail: [
				{ required: true, message: this.$t('validate.word.null'), trigger: 'blur' },
				{ type: 'email', message: this.$t('user.update.error.email'), trigger: 'blur,change' }
			],
			oldPassword: [
				{ required: true, message: this.$t('validate.word.null'), trigger: 'blur' }
			],
			newPassword: [
				{ required: true, message: this.$t('validate.word.null'), trigger: 'blur' },
				{ validator: validatePass, trigger: 'blur' }
			],
			checkPass: [
				{ required: true, message: this.$t('validate.word.null'), trigger: 'blur' },
				{ validator: validatePassRep, trigger: 'blur' }
			]
		}

		const defaultForm = {
			oldPassword: '',
			newPassword: '',
			checkPass: ''
		};

		return {
			rules,
			defaultForm,
			isAble: true,
			dialogVisible: false,
            disabledNewPassword:true,
            disabledCheckPass:true,
			pwdForm: Object.assign({}, defaultForm),
			cacheObject: {},
			form: {
				id: '',
				name: 'Yealink',
				phoneNo: '',
				email: '',
				contactEmail: '',
				number: ''
			}
		}
	},
	watch: {
		'form': {
			deep: true,
			handler: function(value) {
				for (let name of Object.keys(value)) {
					if (value[name] != this.cacheObject[name]) {
						this.isAble = false;
						return;
					}
				}
				this.isAble = true;
			}
		}
	},
	created() {
		this.getDetail();
	},
	beforeRouteLeave(to, from, next) {
		if (!this.isAble) {
			this.$confirm(this.$t('popUpWindow.tipContent'), this.$t('popUpWindow.tip'), {
				confirmButtonText: this.$t('popUpWindow.confirm'),
				cancelButtonText: this.$t('popUpWindow.cancel')
			}).then(() => {
			    this.saveAccount();
				next();
			}).catch(() => {
				next();
			});
		} else {
			next();
		}
	},
	methods: {
		openDialog() {
			this.pwdForm = Object.assign({}, this.defaultForm);
			this.dialogVisible = true;
			this.$nextTick(_=>{
                this.$refs.pwdForm.resetFields();
            });
		},
		handleClose() {
			this.dialogVisible = false;
		},
		submitFrom() {
			this.$refs.pwdForm.validate((valid) => {
				if (valid) {
					let { oldPassword, newPassword } = this.pwdForm;
					api.changePassword({ oldPassword: md5(oldPassword.trim()), newPassword: md5(newPassword.trim()) }).then((res) => {
						if (res.ret > -1) {
							this.dialogVisible = false;
							this.pwdForm = Object.assign({}, this.defaultForm);
							this.messagePop(this.$t('user.message.update.ok'), 'success')
						}
					})
				} else {
					return false;
				}
			});
		},
		cache(value) {
			this.isAble = true;
			this.cacheObject = Object.assign({}, value);
		},
		saveAccount() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					api.editContactInfo(filterParams(this.form)).then((res) => {
						if (res.ret > -1) {
							this.cache(this.form);
							this.messagePop(this.$t('user.message.save.ok'), 'success', () => { })
						}
					})
				} else {
					return false;
				}
			});
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
		getDetail() {
			api.getCurrentEnterprise()
				.then((res) => {
					if (res.ret > -1) {
						this.form = res.data;
						this.cache(this.form);
					}
				})
		},
		cancel() {
			this.$router.go(-1)
		}
	}
}
</script>
