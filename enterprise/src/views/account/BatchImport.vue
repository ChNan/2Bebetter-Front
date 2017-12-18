<style lang="scss">
    .step {
        .pl5{
            margin-right: 4px;
        }
        .info {
            height: 12px;
            font-size: 12px;
            line-height: 2;
            color: #b3b3b3;
            margin-left: 15px;
        }
        .pl15{
            padding-left: 15px;
        }
        .m-top {
            margin-top: 37px;
        }
        .el-button {
            margin-left: 15px;
        }
        .el-button i {
            font-size: 14px;
        }
    }

    .import-list {
        margin-left: 15px;

        .title {
            font-size: 12px;
            line-height: 2;
            text-align: left;
            color: #ff4949;
        }
        .footer {
            margin-top: 60px;
            .el-button {
                min-width: 98px;
            }
        }
        .red{
            color: #f44326;
            list-style-type: none;
        }
    }

    .batchImport .el-upload-list__item {
        width: 300px !important;
    }
</style>

<template>
    <div class="g-bd batchImport" >
        <!--页面头部-->
        <div class="g-hd">
            <h3>{{$t('import.title')}}</h3>
            <div class="btn-right">
                <el-button type="text" @click="goBack">
                    <i class="iconfont icon-fanhuishangyiji"></i>
                    {{$t('import.back')}}
                </el-button>
            </div>
        </div>
        <div class="g-box">
            <div class="step">
                <div>
                    <p class="pl15">{{$t('import.step.0')}}</p>
                    <a :href="`/enterprise/front/download/ImportTemplate-${language}.xls`">
                        <el-button type="info">
                            <i class="iconfont icon-xiazai pl5" ></i>{{$t('import.download')}}
                        </el-button>
                    </a>
                </div>
                <div class="m-top">
                    <p class="pl15">{{$t('import.step.1')}}</p>
                    <yl-upload ref="upload" upload-icon="iconfont icon-shangchuan" @beforeUpload="beforeUpload"
                               @fileQueued="onFileQueued"
                               :configs="config"
                               @uploadSuccess="uploadSuccess" @uploadFail="uploadFail" style="margin-left:15px;">
                    </yl-upload>
                </div>
                <p class="info">{{$t('import.upload.info')}} </p>
            </div>
            <div class="import-list">
                <p class="title" v-show="tableData.length>0" v-if="0">
                    {{$t('import.result', {count: '2', update: '1'})}}
                </p>
                <el-table ref="table" :data="tableData" v-show="tableData.length>0">
                    <el-table-column type="index" width="55"></el-table-column>
                    <el-table-column prop="name" :label="$t('import.table.name')"></el-table-column>
                    <el-table-column prop="extension" :label="$t('import.table.extension')"></el-table-column>
                    <el-table-column prop="email" :label="$t('import.table.email')"></el-table-column>
                    <el-table-column prop="date" :label="$t('import.table.date')"></el-table-column>
                    <el-table-column :label="$t('import.table.errorMessage')">
                        <template scope="scope">
                            <li class="red" v-for="(item,index) in scope.row.errorMessage" :key="index">
                                {{$t(item)}}
                            </li>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="footer">
                    <el-button type="primary" @click="upload">
                        {{$t('import.confirm')}}
                    </el-button>
                    <el-button @click="goBack">
                        {{$t('import.cancel')}}
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import YlUpload from '@/components/uploader';
    import moment from 'moment';
    import {language, languages} from '@/i18n/index';
    import {sendAllAccountInfoMail} from  '../../api/account/user'
    /*
    * @TAG 0:编辑帐号  1:添加帐号 2:部门列表
    * */
    export default {
        components: {
            YlUpload
        },
        data() {
            return {
                config: {
                    auto: false,
                    server: '/enterprise/api/v1/manager/staff/import',
                    fileNumLimit: 2,
                    fileSizeLimit: 5 * 1024 * 1024,
                    fileSingleSizeLimit: 5 * 1024 * 1024,
                    multiple: false,
                    accept: {
                        extensions: 'xls',
                        mimeTypes: 'application/vnd.ms-excel'
                    },
                    headers:{
                        token:''
                    }
                },
                tableData: [],
                date: moment().format('YYYY/MM/DD'),
                language: language()
            }
        },
        computed: {},

        mounted() {

        },
        created() {

        },
        beforeRouteLeave(to, from, next) {
            next();
            if ($("#greybackground")){
                $("#greybackground").remove();
            }
        },
        methods: {
            onFileQueued(){
                console.log(1)
                this.tableData =[];
            },
            beforeUpload(type) {
                if (type == "Q_TYPE_DENIED") {
                    this.$message.error(this.$t('import.Q_TYPE_DENIED'));
                } else if (type == "Q_EXCEED_SIZE_LIMIT") {
                    this.$message.error(this.$t('import.Q_EXCEED_SIZE_LIMIT'));
                }
            },
            goBack() {
                this.$router.push('/enterprise/user');
            },
            upload() {
                if(this.tableData.length>0){
                    this.$message.error(this.$t('upload.msg.error'));
                    return;
                }
                this.tableData =[];
                if (this.$refs.upload.hasFile()) {
                    this.$refs.upload.upload();
                } else {
                    this.$message.error(this.$t('import.Q_EXCEED_NULL'));
                }
            },
            uploadSuccess(resault) {
                let errorInputList = resault.data && resault.data.errorInputList || false;
                let message = resault.data && resault.data.message || false;
                if (message) {
                    this.$refs.upload.removeFile();
                    this.$message.error(this.$t(message));
                    return;
                }
                if (errorInputList) {
                    this.$refs.upload.removeFile();
                    this.tableData = errorInputList.map(x => {
                        x.date = this.date;
                        return x
                    });
                }
                if (!errorInputList) {
                    this.$confirm(this.$t('account.send.all'), this.$t('login.dialog.tit'), {
                        confirmButtonText: this.$t('account.send'),
                        cancelButtonText:  this.$t('popUpWindow.cancel')
                    }).then(() => {
                        sendAllAccountInfoMail().then( json=> {
                            if (json.ret >= 0) {
                                this.$message({
                                    message: this.$t('user.message.send.ok'),
                                    type: 'success'
                                });
                            }
                            this.$router.push('/enterprise/user')
                        })
                    }).catch(() => {
                        this.$router.push('/enterprise/user')
                    })
//                    this.$message({
//                        message: this.$t('import.Q_SUCCESS'),
//                        type: 'success',
//                        onClose: () => {
//                            this.$router.push('/enterprise/user')
//                        }
//                    });
                }
               // this.$refs.upload.removeFile();
            },
            uploadFail(e) {
                let {error: {errorCode}} = e;
                if (401 === errorCode) {
                    this.$router.replace('/enterprise/login')
                } else {

                }
            }
        }
    };
</script>
