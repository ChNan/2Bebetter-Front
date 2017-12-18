<template>
    <div class="g-bd">
        <!--页面头部-->
        <div class="g-hd">
            <!--企业信息-->
            <h3>{{$t('enterprise.info')}}</h3>
        </div>
        <div class="g-wrap">
            <el-form ref="form" :model="form" label-width="240px" class="m-fms" :rules="rules" >
                <!--企业名称：-->
                <el-form-item :label="$t('enterprise.name')" required class="u-fm-label">
                    <el-input v-model="form.name" disabled></el-input>
                </el-form-item>
                <!--官网网址：-->
                <el-form-item :label="$t('enterprise.website')" class="u-fm-label" prop="website" :error="errors.backendt" >
                    <el-input v-model="form.website" :maxlength="128">
                    </el-input>
                </el-form-item>
                <!--联系邮箱：-->
                <el-form-item :label="$t('enterprise.email')" class="u-fm-label" prop="contactEmail" :error="errors.backend"  >
                    <el-input v-model="form.contactEmail" :maxlength="128"></el-input>
                </el-form-item>
                 <el-form-item :label="$t('enterprise.scale')" class="u-fm-label">
                    <el-select v-model="form.size" style="width:100%">
                        <el-option v-for="(item,index) in mode" :label="item.label" :key="index" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <!--企业规模：--->

                <!-- 国家：-->
                <el-form-item :label="$t('enterprise.country')" class="u-fm-label">
                    <el-select v-model="form.country" filterable :remote-method="querySearchData":placeholder="$t('enterprise.countryt')" style="width:100%">
                        <el-option v-for="(item,index) in countryList" :label="$t(item.twoLetter)" :key="index" :value="item.twoLetter"></el-option>
                    </el-select>
                </el-form-item>
                <!--简介：-->
                <el-form-item :label="$t('enterprise.description')" style="margin-bottom:10px;" class="u-fm-label">
                    <el-input type="textarea"  v-model="form.description" :rows="7" :maxlength="800" ></el-input>
                    <!--还可输入800个字-->
                    <span class="el-upload__tip">{{$t('enterprise.words')}}{{restWord}}{{$t('enterprise.wordst')}}
                    </span>
                </el-form-item>
                <!--保存-->
                <el-form-item label=" " style="margin-top:25px;" class="u-fm-label">
                    <el-button type="primary" :disabled="isAble" class="btn-width" @click="saveEdit()">{{$t('enterprise.save')}}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import * as api from '../../api/setting/enterprise'
export default {
    name: 'enterprise',
    data() {
//        网址校验
        var validateWebsite = (rule, value, callback) => {
//            var reg=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
            var reg=/^(([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)|())(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
            if(this.form.website ===null ||this.form.website === ""){
                callback();
            }else{
                if(!reg.test(this.form.website)){
                    callback(new Error(this.$t('enterprise.url.validate')));
                }else{
                    callback();
                }
            }

        };
        //邮箱校验
        var validateEmail = (rule, value, callback) => {
            var reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if(this.form.contactEmail ===null ||this.form.contactEmail=== ""){
                callback();
            }else{
                if(!reg.test(this.form.contactEmail)){
                    callback(new Error(this.$t('enterprise.email.validate')));
                }else{
                    callback();
                }
            }

        };

        return {
            countryList:[],
            mode: [
                {
                label: '1~50' + this.$t('enterprise.person'),
                value: '50'
            },
                {
                label: '50~100' + this.$t('enterprise.person'),
                value: '100'
            },
                {
                label: '100~200' + this.$t('enterprise.person'),
                value: '200'
            },
                {
                label: '200~500' + this.$t('enterprise.person'),
                value: '500'
            },
                {
                label: '500~1000' + this.$t('enterprise.person'),
                value: '1000'
            },
                {
                label: '1000~2000' + this.$t('enterprise.person'),
                value: '2000'
            },
                {
                label: this.$t('enterprise.person.up', {number: '2000'}),
                value: '0'
            }
            ],
            form: {
                name: 'Yealink',
                website: '',
                contactEmail: '',//企业邮箱
                size: '',//企业规模
                country: '',//企业所属国家
                description:'',//简介
            },
            saveData:{},
            emailform:false,
            errors: {
                backend: '123',
                backendt: '123'
            },
            is403:true,
            rules: {
                contactEmail: [
//                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type: 'email', message: this.$t('enterprise.email.validate'), trigger: 'blur' },
//                   { validator: validateEmail, trigger: 'blur' }
                ],
                website:[
//                    { required: false, message: '请输入网址', trigger: 'blur' },
                    { validator: validateWebsite, trigger: 'blur' }
                ],
            }

        }
    },
    computed: {
            restWord() {
                let len = !!this.form.description ? this.form.description.length : 0;
                return 800 - len;
            },
        isAble() {
            for (let [key, value] of Object.entries(this.form)) {
                if(this.saveData[key] !== value) {
                    return  false
                }
            }
            return true
        }
    },
    beforeRouteLeave(to, from, next) {
        if (from.path !== '/enterprise/enterprise') {
            next(to.path)
        } else {
            //next()
            if (!this.isAble && !this.is403) {
                this.$confirm(this.$t('popUpWindow.tipContent'), this.$t('popUpWindow.tip'), {
                    confirmButtonText:this.$t('popUpWindow.confirm'),
                    cancelButtonText: this.$t('popUpWindow.cancel')
                }).then(() => {
                    this. saveEdit();
                    next();
                }).catch(() => {
                    next();
                });
            } else {
                next();
            }

        }
    },
    created() {},
    mounted() {
        this.enterpriseMsg();
        this.getCountryMsg();
//        this.enter()
    },
    methods: {
         querySearchData(queryString, cb) {
            //console.log(this.zhlang)
            let results = this.countryList.filter((item) => {
                return this.$t(item.twoLetter).indexOf(queryString) > -1;
            })
            cb(results);
        },
        /**
         *查询企业信息
         */
        enterpriseMsg(){
            api.getEnterprise().then(json=>{
                if(json.ret > -1){
                    this.form = Object.assign({}, json.data);
                    this.form.size = this.form.size;
                    this.saveData = Object.assign({}, this.form);
                    this.is403 = false;
                }else{
                     if (json.error && json.error.errorCode) {
                        this.is403 = json.error.errorCode == 403;
                    }
                    this.saveData = Object.assign({},this.form);
                }

            })
        },
        /**
         *保存修改
         */
        saveEdit() {
//            this.errors.backend = '';
//            this.errors.backendt = '';
            this.$refs.form.validate((valid) => {
                if (valid) {
                        let params = {
                            country:this.form.country,
                            phoneNo:this.form.phoneNo,
                            size:this.form.size,
                            website:this.form.website,
                            description:this.form.description,
                            contactEmail:this.form.contactEmail
                        };
                        if(params.website&&!params.website.toUpperCase().startsWith('HTTP')){
                            params.website= 'http://'+params.website;
                        }
                        if(params.contactEmail === ""){
                            params.contactEmail=null;
                        }
                        let res=api.editEnterprise(params);
                        res.then(json => {
                            if (json.ret === 0) {
                                this.$message({
                                    message: this.$t('user.message.save.ok'),
                                    type: 'success'
                                })
                                this.form.website=params.website;
                                this.saveData = Object.assign({}, this.form);
                            }
                        })
//
//                    alert('submit!');

                } else {
//                    console.log('error submit!!');
                    return false;
                }
            });


        },
        /**
         * 获取国家信息
         */
        getCountryMsg(){
            api.getCountry().then(json=>{
                if(json.ret > -1){
                    this.countryList = json.data;
                }

            });
        },
    }
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/meeting.scss';
.m-fms {
    margin-top: 20px;
    width: 800px;
}
</style>
