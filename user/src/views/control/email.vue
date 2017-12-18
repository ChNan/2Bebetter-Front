<style>
    .el-tag{
        margin-right: 5px;
    }
</style>
<template>
    <el-row class="hemail">
        <el-col :span="24">
            <!--总-->
            <div class="content">
                <!--左侧-->
                <div class="leftDiv">
                    <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
                        <!--收件人-->
                        <el-form-item :label="$t('controlDetail.receiverPerson')">
                            <div class="around-model">
                                <!--添加的联系人-->
                                <div :key="tag.name" v-for="(tag,index) in selectedEmail" class="person-model add-person-pd">
                                   <div :class="{'showred':!tag.email}" class="text-model" :title="tag.nameWithEmail">{{tag.nameWithEmail}}</div>
                                    <div  class=" icon iconfont icon-delete delete-model"  @click.stop="deleteEmail(index,'selectedEmail')"></div>
                                </div>
                                <!--添加块-->
                                <div class="person-model" style="cursor: pointer" v-show="!inputVisible"  @click="showInput" >
                                    <div  class="text-model" >{{$t('controlDetail.addTag')}}</div>
                                    <div  class=" icon iconfont icon-delete delete-model" v-show="false"></div>
                                </div>
                                <!--邮箱验证进行添加-->
                                <div class="addInput-model" >
                                    <div  class="addInput-text-model" >
                                        <el-autocomplete ref="autocomplete" :trigger-on-focus="false" class="inline-input" v-show="inputVisible"  :fetch-suggestions="querySearch" v-model="customEmail"  :placeholder="$t('controlDetail.inputText')"  @select="autocompleteSelect" >
                                        <el-button slot="append" type="primary" @click="addCustomEmail" :disabled="isEmail">{{$t('controlDetail.add')}}</el-button>
                                    </el-autocomplete>
                                    </div>
                                    <div  class="delete2-model" v-show="false"></div>
                                </div>
                            </div>
                        </el-form-item>
                        <!--备注内容-->
                        <el-form-item :label="$t('controlDetail.descript')">
                            <editor ref="editor" :content="content" :path="path" v-model="result"></editor>
                        </el-form-item>
                    </el-form>
                </div>
                <!--右侧-->
                <div class="rightDiv">
                    <!--组织结构-->
                    <yl-tree ref="left-tree" :data="contactPerson" type="STAFF" iconSkinField="type"
                             :showCheckbox="false" @node-click="onNodeEvent" @node-check="onNodeEvent" class="initDiv">
                    </yl-tree>
                </div>
            </div>

            <div class="btnDiv">
                <el-button type="primary" class="submitBtn" @click="sendMail">{{$t('controlDetail.submit')}}</el-button>
                <el-button style="padding: 0.75em 3em " @click="back()">{{$t( 'controlDetail.cancel')}}</el-button>
            </div>
        </el-col>
    </el-row>
</template>
<script>
    import editor from "@/components/editor"
    import * as api from '../../api/control/'
    import YlTree from '@/components/tree'
    import {language} from '@/i18n/index'
    import moment from 'moment'
    export default{
        components: {
            editor,
            YlTree,
        },
        computed:{
            isEmail(){
                return !/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.customEmail);
            }
        },
        data(){
            return {
                inputVisible: false,
                inputValue: '',
                selectedEmail:[],//左侧选中的人
                customEmail:'',
                selectedPerson: [],//确定已选择的人
                contactPerson: [],//联系人员
                labelPosition: 'left',// 左侧的排版是靠左
                content: '',//编辑器
                path: '',//编辑器
                result: '',//编辑器的内容
                params: {
                    conferenceRecordId: '',
                    isDST: false,
                    utcOffset: 0,
                    language: '',
                    conferenceNumber:'',
                    startDateTimeStamp:"",
                    subject:'',
                },//获取邮箱模板的参数
                //获取邮箱模板的参数
                scheduleId:'',//传来的参数
                subject:'',//传来的参数
                conferenceNumber:'',
                startDateTimeStamp:"",
                paramst: {
                    content: '',
                    receiver: '',
                    subject: '',
                },
                formLabelAlign: {
                    name: '',
                    region: '',
                    type: ''
                },
                distinguish:false,//辨别是否已经添加过
            }
        },
        created() {
            this.scheduleId=this.$route.query.Id;
            this.subject=this.$route.query.Subject;
            this.conferenceNumber=this.$route.query.ConferenceNumber;
            this.startDateTimeStamp=this.$route.query.StartDateTimeStamp;
        },
        methods: {
            deleteEmail (index, type) {
                this[type].forEach((item, i) => {
                    if (index === i) {
                        this[type].splice(index, 1)
                    }
                })
            },
            /**
             *将选中的邮箱添加至左侧
             * */
            addCustomEmail(){
                if(this.selectedEmail.length){
                    this.distinguish =false;
                    this.selectedEmail.map(temp=>{
                        if( temp.email == this.customEmail){
                            this.distinguish=true;
                            this.$message.error(this.$t("controlDetail.emailExists"));
                        }
                    })
                    if(this.distinguish){ //重复的不添加进去
                        // this.selectedEmail.push({
                        //     name:this.customEmail,
                        //     email:null,
                        //     nameWithEmail:this.customEmail,
                        //     type:'danger',
                        // });
                    }else{
                        this.selectedEmail.push({
                            name:this.customEmail,
                            email:this.customEmail,
                            nameWithEmail:this.customEmail,
                        });
                    }
                }else{
                    this.selectedEmail.push({
                        name:this.customEmail,
                        email:this.customEmail,
                        nameWithEmail:this.customEmail
                    });
                }
                this.customEmail = '';
                this.inputVisible = false;

            },
            /**
             *模糊搜索
             */
            querySearch(queryString, cb) {
                let restaurants = this.contactPerson.filter(t=>t.type === 'STAFF').map(x=>{
                    return Object.assign(x,{value:x.name})
                });
                let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.name.indexOf(queryString.toLowerCase()) === 0
                    ||restaurant.namePinyin.indexOf(queryString.toLowerCase()) === 0
                     ||restaurant.nameWithEmail.indexOf(queryString.toLowerCase()) === 0
//                        ||restaurant.email.indexOf(queryString.toLowerCase()) === 0
                    );
                };
            },
            autocompleteSelect(item){
                  this.addToTags([item])
                  this.inputVisible = false;
            },
            handleClose(index) {
                this.selectedEmail.splice(index, 1);
            },
            //添加入的值
            showInput() {
                this.inputVisible = true;
            },
            /**
             * onblur事件
             */
            handleInputConfirm() {
                let inputValue = this.inputValue;
                //模糊匹配
                //判断是否符合邮箱的验证规则
                if (inputValue) {
                    this.selectedPerson.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
            /**
             * 获取邮箱模板        TODO 请求的参数为写死的，需获取
             */
            getEmailSort(){
                if(!this.scheduleId){
                    this.getMeetNowEmail();
                }else{
                    this.getEmailMode();
                }


            },
            getMeetNowEmail(){
                let lan = "CN"
                if (language() === 'zh-CN') {
                    lan = "CN"
                } else if (language() === 'en-US') {
                    lan = "EN"
                }
                this.params = {
                    conferenceNumber:this.conferenceNumber,
                    startDateTimeStamp: this.startDateTimeStamp,
                    subject:this.subject,
                    isDST: moment().isDST(),//当前浏览器的时区是否是夏令时
                    utcOffset: moment().utcOffset()*60,//当前浏览器的时区的偏移量，是夏令时则加3600
                    language: lan,//当前语言
                }
                api.getMeetNowEmailTemplate(this.params, false, '').then(json => {
                    this.result = json.data;
                    this.$refs.editor.setVal(json.data.replace(/\n/g, '<br/>'));

                })

            },
            getEmailMode(){
//                this.params.conferenceRecordId = this.invitationData.dataListMiddle.Desc.scheduleId;//会议ID
//                this.params.isDST = moment().isDST();//当前浏览器的时区是否是夏令时
//                this.params.utcOffset = moment().utcOffset();//当前浏览器的时区的偏移量，
//                this.params.language = "CN";//当前语言
                let lan="CN"
                if(language() ==='zh-CN'){
                    lan="CN"
                }else if(language() ==='en-US'){
                    lan="EN"
                }
                this.params = {
                    conferenceRecordId : this.scheduleId,//会议ID
                    isDST : moment().isDST(),//当前浏览器的时区是否是夏令时
                    utcOffset : moment().utcOffset()*60,//当前浏览器的时区的偏移量，是夏令时则加3600
                    language :  lan,//当前语言
                }
                api.getEmail(this.params, false, '').then(json => {
                    this.result = json.data.replace(/\n/g, '<br/>');
                    this.$refs.editor.setVal(json.data.replace(/\n/g, '<br/>'));
                })
            },
            /**
             * 获取部门树（带用户）
             */
            getCategoryTree(){
                api.getTreeList().then(json => {
                    this.contactPerson = json.data || [];
                });
            },
            addToTags(nodes){
                 nodes.forEach((item,index)=>{
                       if(!this.selectedEmail.some(x=>{
                          return x.id === item.id
                       })) {
                           this.selectedEmail.push(item);
                       }
                 });
            },
            /**
             *点击树时的处理逻辑
             */
            async onNodeEvent(id, node) {
                if(node.type==='ORG'){
                    let nodes =  this.$refs['left-tree'].transformToArray(node);
                   this.addToTags(nodes.filter(x=>x.type === 'STAFF'))
                }
                else if(node.type==='STAFF'){
                    this.addToTags([node])
                }
            },
            /**
             * 发送邮箱
             */
            sendMail(){
                this.paramst.content = this.result;
                this.paramst.subject =this.subject;//主题需进行获取
                let test=true;
                let array=[];
                this.selectedEmail.map(temp=>{
                    if( temp.email){
                        array.push(temp.email);
                    }else{
                        test =false;
                        return;
                    }
                })
                this.paramst.receiver=array;
                if(test&&this.paramst.receiver.length!==0){
                    api.sendEmail(this.paramst).then(json=>{
//                        console.log("发送邮件结果",json);
                        if(json.ret ===0){
                            this.$message(this.$t("controlDetail.emailsuccess"));
                            this.$router.back();
                        }else{

                            this.$message(this.$t("controlDetail.emailfail"));
                        }
                    })
                }else{
                    this.$alert(this.$t("controlDetail.receiverCheck"), this.$t('controlDetail.notice'), {
                        confirmButtonText:this.$t("controlDetail.confirm"),
                        callback: action => {
                        }
                    });
                }

            },
            back(){
                this.$router.back();
            }

        },
        mounted(){
            //获取邮件模板
            this.getEmailSort();
            //获取树的数据
            this.getCategoryTree();

        }
    }
</script>
<style>
    .el-input__icon {
        color: white !important;
    }

    .ico_docu {
        background-image: url('./controlDetail/Middle/img/person.png') !important;
    }

    .ico_docu_org {
        background-image: url('./controlDetail/Middle/img/org.png') !important;
    }
    .STAFF_ico_docu {
        background-image: url('./controlDetail/Middle/img/person.png') !important;
    }
</style>
<style lang="scss">
.hemail{

    .el-autocomplete {
        width: 100%
    }

    .around-model {
        border: 1px solid #cccccc;
        border-radius: 6px;
        padding: 5px;
    }

    .add-person-pd {
        margin-right: 5px;
    }
    /*添加的邮箱*/

    .person-model {
        width: 30%;
        position: relative;
        padding: 1px 5px;
        border: 1px solid #97a6be;
        border-radius: 6px;
        display: inline-block;
    }

    .person-model:hover {
        border: 1px solid #2eaff0;
        .icon-delete {
            color: #2eaff0;
        }
    }

    .text-model {
        width: 70%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    /*点击添加按钮*/

    .addInput-model {
        width: 30%;
        position: relative;
        border-radius: 6px;
        display: inline-block;
    }

    .addInput-text-model {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    /*删除按钮*/

    .delete-model {
        position: absolute;
        right: 5px;
        top: 0px;
    }

    .delete2-model {
        width: 1px;
        position: absolute;
        right: 0px;
        top: 0px;
    }

    .showred {
        color: red;
    }
    /*删除按钮*/

    .icon-delete:hover {
        color: #FA4D4D !important;
        cursor: pointer;
    }

    .icon-delete :active {
        color: #ef1010 !important;
    }



    .tag-style {
        width: 30%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .wangEditor-txt {
        height: 340px !important;
    }

    .content {
        background-color: white;
        border: 1px solid #CCCCCC;
        border-radius: 6px;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.4);
        position: relative;
        width: 100%;
        font-size: 12px;
        .leftDiv {
            display: inline-block;
            padding: 20px;
            width: calc(70% - 41px);
            border-right: 1px solid #CCCCCC;
        }
        .rightDiv {
            min-height: 460px;
            max-height: 460px;
            position: relative;
            display: inline-block;
            padding: 20px;
            float: right;
            width: calc(30% - 40px);
            .initDiv {
                width: calc(100% - 40px);
                position: absolute;
                left: 20px;
                right: 20px;
                min-height: 460px;
                max-height: 460px;
            }
        }
    }

    .btnDiv {
        clear: both;
        text-align: center;
        padding-top: 20px;
        .submitBtn {
            padding-left: 3em;
            padding-right: 3em;
            margin-right: 30px
        }
        .cancelBtn {
            padding-left: 3em;
            padding-right: 3em;
        }
    }

}


</style>
