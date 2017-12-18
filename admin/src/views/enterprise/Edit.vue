<template>
    <div class="g-content">
        <div class="m-cover" @keyup="getReal($event)">
            <el-card class="full clearfix" style="border-radius:20px;padding-bottom:0px;" >
                <div slot="header" class="clearfix">
                    <span class="title">{{title}}</span>
                    <span class="tip" v-if="!$route.query.id">{{$t('enterprise.edit.note')}}</span>
                </div>
                <el-form label-width="180px" ref="validForm" class="m-bss-fm" :model="detail" :rules="validRule">
                    <h5>{{$t('enterprise.edit.account')}}</h5>
                    <el-form-item :label="$t('enterprise.edit.id')" required class="u-fm-label" v-if="$route.query.id" prop="number">
                        <el-input v-model="detail.number" :maxlength="5" name="number" :placeholder="$t('order.add.id5')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('enterprise.edit.name')" required class="u-fm-label" prop="name">
                        <el-input v-model="detail.name" :minlength="2" name="name" :maxlength="128"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('enterprise.edit.reemail')" required class="u-fm-label" prop="email" style="margin-bottom:10px;">
                        <el-input v-model="detail.email" name="email"  :maxlength="128"></el-input>
                        <span class="txt-tip1">{{$t('enterprise.edit.system')}}</span>
                    </el-form-item>
                    <el-form-item :label="$t('enterprise.edit.pwd')" class="u-fm-label" required prop="password">
                        <el-row v-if="$route.query.id">
                                <el-input :type="isPassword" v-model="detail.password" :readonly="true"></el-input>
                        </el-row>
                        <el-row v-else>
                            <el-input type="password" v-model="detail.password" :placeholder="$t('enterprise.edi.pwdrules')" :minlength="8" :maxlength="64"></el-input>
                        </el-row>
                    </el-form-item>

                    <h5>{{$t('enterprise.edit.company')}}</h5>
                    <el-form-item :label="$t('enterprise.edit.publicweb')" class="u-fm-label" prop="website">
                        <el-input v-model="detail.website" name="website" :placeholder="$t('http://')"  :maxlength="128"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('enterprise.edit.becountry')" class="u-fm-label" required prop="country">
                        <el-select v-model="detail.country" style="width:100%;"  filterable :remote-method="querySearchData">
                            <el-option v-for="(item,index) in countryList" :label="$t(item.twoLetter)" :value="item.twoLetter" :key="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('enterprise.edit.ensize')" class="u-fm-label">
                        <el-select v-model="detail.size" style="width:100%;">
                            <el-option v-for="(item,index) in enMode" :label="item.label" :value="item.value" :key="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('enterprise.edi.telphone')" class="u-fm-label" prop="phoneNo">
                        <el-input v-model="detail.phoneNo" name="phoneNo" :maxlength="128"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('enterprise.edit.contactemail')"class="u-fm-label" prop="contactEmail">
                        <el-input v-model="detail.contactEmail" name="contactEmail"   :maxlength="128"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('enterprise.edit.intro')" class="u-fm-label">
                        <el-input type="textarea" :rows="3" name="description" style="resize:none;" :maxlength="800" v-model="detail.description"></el-input>
                        <label class="txt-tip1">{{$t('enterprise.edit.restWord',{'restWord':restWord})}}</label>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-button type="warning" v-if="this.$route.query.id" class="btn100" @click="resetPassword">{{$t('enterprise.edit.reset')}}</el-button>
                        <el-button type="primary" class="btn100" @click="saveEdit()" :disabled="isAble">
                            {{$t('enterprise.edi.save')}}
                        </el-button>
                        <el-button class="btn100" @click="cancle()">
                            {{$t('enterprise.edit.cancel')}}
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>

<script>
import * as api from '../../api/enterprise/index'
import { validateEmail, validateURL } from '../../services/verificationService'
import { setNull , capsLock} from '../../services/toolService'
import md5 from 'md5'
export default {
    data() {
        let validPassword = (rule, value, callback) => {
            let REG = /^(?!([a-zA-Z]+$))(?!(\d+$))(?!([@*_\-.]+$))[a-zA-Z\d@*_\-.]+$/;
            let ieg = /[^a-zA-Z\d@*_\-.]/;
             if (ieg.test(value)) {
                callback(new Error('不能包含无效字符'))
            }else if (!REG.test(value)) {
                callback(new Error(this.$t('enterprise.error.two')));
            } else {
                callback();
            }

        }
        	const validateKong = (rule, value, callback) => {
            let rg = /\s+/g;
            if (rg.test(value)) {
                callback(new Error(this.$t('account.error.kong')));
            } else {
                callback();
            }
        }
        let validPhoneNo = (rule, value, callback) => {
            if(value){
                if (!/^(\d{4}-|\d{3}-)?\d{3,14}$/.test(value)) {
                    callback(new Error(this.$t('enterprise.error.number')));
                } else {
                    callback();
                }
            }else{
                callback();
            }
           

        }
        let validCemail = (rule, value, callback) => {
            if(value){
                if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value.trim())) {
                    callback(new Error(this.$t('enterprise.error.email')));
                } else {
                    callback();
                }
            }else{
                callback();
            }
            

        }
        let validURL = (rule,value,callback) =>{
            let reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;
            if(value){
                if (!reg.test(value.trim())) {
                    callback(new Error(this.$t('enterprise.error.web')));
                } else {
                    callback();
                }
            }else{
                callback();
            }
           
        }
        	let checkNumber = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('enterprise.error.numempty')));
            } else if (!/^[0-9]{5,5}$/.test(value)) {
                return callback(new Error(this.$t('enterprise.error.dig5')));
            } else {
                callback();
            }

        }
        return {
            title: this.$t('enterprise.edit.editEn'),
            isAble: true,
            cacheObject: {},
            leave:true,
            path:'/admin/enterprise',
            detail: {
                id: '',
                number: '',
                name: '',
                password: '',
                email: '',
                website: '',
                description: '',
                country: 'CN',
                size: '50',
                contactEmail: '',
                phoneNo: ''
            },
            number: '',
            isPassword: 'password',
            validRule: {
                name: [
                    {
                        required: true,
                        message: this.$t('enterprise.add.nameempty'),
                        trigger: 'blur'
                    }
                ],
                number:[{
                        validator: checkNumber,
                        trigger: 'blur'
                }],
                password: [
                    {
                        required: true,
                        message: this.$t('enterprise.error.pwdempty'),
                        trigger: 'blur'
                    },
                    {
                        min: 8,
                        message: this.$t('enterprise.error.pwd8'),
                        trigger: 'blur'
                    },
                    {
                        validator: validateKong,
                        trigger:'blur,change'
                    },
                    {
                        validator: validPassword,
                        trigger: 'blur'
                    }
                ],
                email: [
                    {
                        type: 'email',
                        trigger: 'blur,change',
                        message: this.$t('enterprise.error.email')
                    }
                ],
                country: [
                    {
                        required: true,
                        message: this.$t('enterprise.error.becountry'),
                        trigger: 'blur'
                    }
                ],
                website:[
                    {
                        validator: validURL,
                        trigger:'blur'
                    }
                ],
                phoneNo:[
                    {
                        validator: validPhoneNo,
                        trigger:'blur'
                    }
                ],
                contactEmail:[
                    {
                        validator:validCemail,
                        trigger:'blur'
                    }
                ]
            },
            countryList: [],
            enMode: [
                {
                    label: '1~50' + this.$t('enterprise.human'),
                    value: '50'
                },
                {
                    label: '50~100'+ this.$t('enterprise.human'),
                    value: '100'
                },
                {
                    label: '100~200'+ this.$t('enterprise.human'),
                    value: '200'
                },
                {
                    label: '200~500'+ this.$t('enterprise.human'),
                    value: '500'
                }, {
                    label: '500~1000' + this.$t('enterprise.human'),
                    value: '1000'
                },
                {
                    label: '1000~2000' + this.$t('enterprise.human'),
                    value: '2000'
                },
                {
                    label: this.$t('enterprise.edit.up100'),
                    value: '0'
                }
            ]
        }
    },
    watch: {
        'detail': {
            deep: true,
            handler: function(value) {
                if(this.leave){
                    if (this.$route.query.id) {
                        this.isAble = this.isEdit(this.cacheObject, this.detail);
                    } else {
                        this.isAble = !!value.name && !!value.password && !!value.email && !!value.country;
                    }
                    this.isAble = !this.isAble;
                }
            }
        }
    },
    computed: {
        restWord() {
            let len = !!this.detail.description ? this.detail.description.length : 0;
            return 800 - len;
        }
    },
    beforeRouteLeave(to, from, next) {
        if (from.path !== '/admin/enterprise/edit' || to.path == '/admin/login') {
            next()
        } else {
            if (this.isAble) {
                 next();
            } else {
                this.$confirm(this.$t('common.hint.leave'), this.$t('common.hint.title'), {
                    confirmButtonText: this.$t('common.ok'),
                    cancelButtonText: this.$t('common.cancel')
                }).then(() => {
                    this.path = to.path;
                    this.saveEdit();
                    // next();
                }).catch(() => {
                    next();
                });
               
            }

        }
    },
    created() {
        this.title = this.$route.query.id ? this.$t('enterprise.edit.editEn') : this.$t('enterprise.add.addEn');
        !this.$route.query.id && (delete this.detail.number, delete this.detail.id, this.cache(this.detail));
        this.$route.query.id && (this.getDetail(this.$route.query.id));
        this.getCountryList();
    },
    mounted() {
        $('input, textarea').placeholder();
    },
    methods: {
           querySearchData(queryString, cb) {
            //console.log(this.zhlang)
            let results = this.countryList.filter((item) => {
                return this.$t(item.twoLetter).indexOf(queryString) > -1;
            })
            cb(results);
        },
        getReal(e){
            this.detail = capsLock(e,this.detail)
        },
        getCountryList() {
            api.getCountryList()
                .then((res) => {
                    if (res.data.ret > -1) {
                        this.countryList = res.data.data;
                    }
                })
        },
        getDetail(id) {
            api.getEnterprise({ id: id })
                .then((res) => {
                    if (res.data.ret > -1) {
                        // this.detail = res.data.data;
                        this.setOwnProp(res.data.data);
                        this.detail.password = "v123456789";
                        this.cache(this.detail);

                    }
                })
        },
        isEdit(olds, news) {
            for (let name in olds) {
                if (typeof news[name] !== 'undefined' && olds[name] !== news[name]) {
                    if(this.$route.query.id ){
                        if(name != 'password'){
                            return true;
                        }
                    }else{
                        return true; 
                    }
                       
                }
            }
            return false;
        },
        cache(value) {
            this.cacheObject = this.copydata(value);
        },
        copydata(data) {
            return Object.assign({}, data);
        },
        setOwnProp(data) {
            for (let name in data) {
                if (this.detail.hasOwnProperty(name)) {
                    this.detail[name] = data[name];
                }
            }
        },
        editEnterprise(cb) {
            let data = this.copydata(this.detail);
            delete data.password;
            api.editEnterprise(setNull(data))
                .then((res) => {
                    if (res.ret > -1) {
                        typeof cb === 'function' && cb();
                        this.isAble = true;
                        this.$message({
                            message: this.$t('common.hint.savesuccess'),
                            type: 'success',
                            onClose: () => {
                                this.$router.push(this.path)
                            }
                        });
                    }else{
                        this.isAble = false;
                    }
                });
        },
        saveEnterprise(cb) {
            let data = Object.assign({}, this.detail,{password:md5(this.detail.password)})
            api.enterpriseRegister(setNull(data))
                .then((res) => {
                    if (res.ret > -1) {
                        typeof cb === 'function' && cb();
                        this.showTip(res.data.number);
                        this.isAble = true;
                    }else{
                        this.isAble = false;
                    }
                })
        },
        resetPassword() {
            api.resetPassword({ id: this.detail.id })
                .then((res) => {
                    if (res.ret > -1) {
                        this.detail.password = res.data;
                        this.isPassword = 'text';
                    }
                })
        },
        saveEdit() {
            this.$refs.validForm.validate((valid) => {
                if (valid) {
                    this.leave = false;
                    if (this.$route.query.id) {
                        this.editEnterprise();
                    } else {
                        //console.log(this.isAble)
                        this.saveEnterprise();
                    }
                } else {
                    //this.isAble = false;
                    return false;
                }
            });
        },
        showTip(number) {
            this.$alert(this.$t('enterprise.id') + number, this.$t('common.hint.addsuccess'), {
                confirmButtonText: this.$t('common.ok'),
                topIcon: 'iconfont icon-chenggongleitishi success',
                callback: action => {
                   // this.isAble = true;
                    this.$router.push(this.path)
                }
            });
        },
        cancle() {
           // this.$router.push('/enterprise')
           this.$router.go(-1);
        }
    }
}
</script>
