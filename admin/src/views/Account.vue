<template>
	<div class="g-content">
		<div class="m-cover">
			<el-card class="full clearfix" style="border-radius:20px;">
				<div slot="header" class="clearfix">
					<span class="title">{{title}}</span>
				</div>
				<el-row style="margin: -10px;">
					<el-col :span="7" style="padding:10px;">
						<div class="m-account">
							<div class="m-logo">
								<img src="../assets/img/logo2.png" />
							</div>
							<div class="el-card__body u-font14">
								<p>{{$t('account.id')}}{{form.number}}</p>
								<p>{{$t('account.email')}}{{form.email}}</p>
								<span>{{$t('account.loginpwd')}}******</span>
								<a class="u-change" @click="openDialog">{{$t('account.change')}}</a>
							</div>
						</div>
					</el-col>
					<el-col :span="17" style="padding:10px;">
						<el-card class="m-account-ht" >
							<h5 class="m-account-mg">{{$t('account.basic')}}</h5>
							<el-form ref="form" label-width="160px" :model="form" :rules="rules" @keyup.native="getReal($event,'form')">
								<el-form-item :label="$t('enterprise.edit.name')" class="u-fm-label">
									<el-input disabled v-model="form.name" :maxlength="128"></el-input>
								</el-form-item>
								<el-form-item :label="$t('enterprise.phone')" prop="phoneNo" class="u-fm-label">
									<el-input v-model="form.phoneNo" :maxlength="20" name="phoneNo" auto-complete="off"></el-input>
								</el-form-item>
								<el-form-item :label="$t('enterprise.edit.contactemail')" prop="contactEmail" class="u-fm-label">
									<el-input v-model="form.contactEmail" name="contactEmail" :maxlength="128"></el-input>
								</el-form-item>
								<el-form-item label=" " class="u-fm-label">
									<el-button type="primary" class="btn100" @click="saveAccount()" :disabled="isAble">{{$t('common.save')}}</el-button>
									<el-button class="btn100" @click="cancle()">{{$t('common.cancel')}}</el-button>
								</el-form-item>
							</el-form>
						</el-card>
					</el-col>
				</el-row>
			</el-card>
		</div>
		<el-dialog :title="$t('account.changePwd')" :close-on-click-modal="false" :visible.sync="dialogVisible" size="tiny" custom-class="wid200" :before-close="handleClose">
			<!-- <p>{{$t('enterprise.edi.pwdrules')}}</p> -->
			<el-form :model="pwdForm" ref="pwdForm" :rules="rules" label-width="130px" @keyup.native="getReal($event,'pwdForm')">
				
				<el-form-item :label="$t('account.curpwd')" prop="oldPassword" required class="u-fm-label" >
					 <!-- <el-tooltip effect="dark" :content="$t('validate.pass.format')" placement="top-start" :disabled="passDisabled"> -->
					<el-input type="password" v-model="pwdForm.oldPassword" name="oldPassword" auto-complete="off" :minlength="8" :maxlength="64"></el-input>
					 <!-- </el-tooltip> -->
				</el-form-item>
				<el-form-item :label="$t('account.newpwd')" prop="newPassword" required class="u-fm-label">
                    <el-tooltip class="item" :disabled="disabledCheckPass"  effect="dark" content="密码长度不少于8位，包含2种以上字符类型，区分大小写" placement="top">
                        <el-input type="password" @focus="disabledCheckPass=false&&pwdForm.newPassword" @blur="disabledCheckPass=true" v-model="pwdForm.newPassword" name="newPassword" auto-complete="off" :minlength="8" :maxlength="64"></el-input>
					</el-tooltip>
				</el-form-item>
				<el-form-item :label="$t('account.cormpwd')" prop="checkPass" required class="u-fm-label">
					<el-input type="password" v-model="pwdForm.checkPass" name="checkPass" auto-complete="off" :minlength="8" :maxlength="64"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitFrom()">{{$t('account.change')}}</el-button>
				<el-button @click="handleClose()">{{$t('common.cancel')}}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<style scoped lang="scss">
.m-account {
	border-radius: 4px;
	background-color: #fff;
	overflow: hidden;
}

.el-card__body {
	height: 277px;
	border: 1px solid #e6e6e6;
	border-top: none;
	color: #333;
	font-size: 14px;
}

.u-change {
	margin-left: 10px;
	&:hover {
		cursor: pointer;
	}
}

.u-font14 {
	font-size: 14px;
}

.u-logo {
	height: 37.3px;
}

.m-account-mg {
	width: 115px;
	padding-right: 45px;
	text-align: right;
	margin-bottom: 24px;
	margin-top: 10px;
}

.m-account-ht {
	border: 1px solid #e6e6e6 !important;
	height: 414px;

	.el-input {
		width: 442px;
	}
}

p {
	margin: 0;
	line-height: 20px;
	margin-bottom: 10px;
}
</style>

<script>
import * as api from '../api/account/index'
import { setNull , capsLock } from '../services/toolService'
import md5 from 'md5'
import { validateTel } from '../services/verificationService'

export default {
	data() {
		const validatePassRep = (rule, value, callback) => {
			if (value != '' && value !== this.pwdForm.newPassword) {
				callback(new Error(this.$t('account.difpwd')));
			} else {
				callback();
			}
		}
		const validateKong = (rule,value,callback) =>{
			let rg = /\s+/g;
			if(rg.test(value)){
				callback(new Error(this.$t('account.error.kong')));
			}else{
				callback();
			}
		}
		const validatePass = (rule, value, callback) => {
            let REG = /^(?!([a-zA-Z]+$))(?!(\d+$))(?!([@*_\-.]+$))[a-zA-Z\d@*_\-.]+$/;
            let ieg = /[^a-zA-Z\d@*_\-.]/;
            if(ieg.test(value)){
                callback(new Error('不能包含无效字符'))
            }else if (!REG.test(value)) {
				callback(new Error(this.$t('account.twoword')));
			} else {
				callback();
			}

		}
		const rules = {
			phoneNo: [
				{ required: true, min: 3, message: this.$t('account.enter.tel'), trigger: 'blur' },
				{ validator: validateTel, trigger: 'blur,change' }
			],
			contactEmail: [
				{ required: true, message: this.$t('account.enter.email'), trigger: 'blur' },
				{ type: 'email', message: this.$t('account.enter.rightemail'), trigger: 'blur,change' }
			],
			oldPassword: [
				 {
					required: true,
					message: this.$t('account.enter.pwd'),
					trigger: 'blur'
				}
			],
			newPassword: [
			 {
					required: true,
					message: this.$t('account.enter.pwd'),
					trigger: 'blur'
				},
				{
					min: 8,
					message: this.$t('account.error.pwdlen8'),
					trigger: 'blur'
				},
				{
					validator: validateKong,
					trigger: 'blur,change'
				},
				{
					validator: validatePass,
					trigger: 'blur'
				}
			],
			checkPass: [
				{ required: true, message: this.$t('account.error.emptypwd'), trigger: 'blur' },
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
			title: this.$t('account.title'),
			isAble: true,
			dialogVisible: false,
			pwdForm: Object.assign({}, defaultForm),
            cacheObject: {},
            disabledCheckPass: true,
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
		if (!this.isAble && to.path !='/admin/login') {
			this.$confirm(this.$t('common.hint.leave'), this.$t('common.hint.title'), {
				confirmButtonText: this.$t('common.ok'),
				cancelButtonText: this.$t('common.cancel')
			}).then(() => {
				next();
			}).catch(() => {
				next();
			});
		} else {
			next();
		}
	},
	mounted() {
		$('input, textarea').placeholder();
	},
	methods: {
		getReal(e,name){
			this[name] = capsLock(e,this[name]);
		},
		openDialog() {
			this.dialogVisible = true;
		},
		handleClose() {
			this.$refs.pwdForm.resetFields();
			this.dialogVisible = false;
		},
		submitFrom() {
			this.$refs.pwdForm.validate((valid) => {
				if (valid) {
					let { oldPassword, newPassword } = this.pwdForm;
					api.changePassword({ oldPassword: md5(oldPassword), newPassword: md5(newPassword) }).then((res) => {
						if (res.ret > -1) {
							this.dialogVisible = false;
							this.pwdForm = Object.assign({}, this.defaultForm);
							this.messagePop(this.$t('common.hint.savesuccess'), 'success')
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
					api.editEnterprise(setNull(this.form)).then((res) => {
						if (res.ret > -1) {
							this.cache(this.form);
							this.messagePop(this.$t('common.hint.savesuccess'), 'success', () => { })
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
					if (res.data.ret > -1) {
						this.form = res.data.data;
						this.cache(this.form);
					}
				})
		},
		cancle() {
			this.$router.go(-1)
		}
	}
}
</script>
