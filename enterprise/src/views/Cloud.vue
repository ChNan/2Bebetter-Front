<style lang="scss">
@import "../assets/scss/layout_lr";

.cloud {
    height: 100%;
    overflow: hidden;

    .el-form-item__label {
        padding-right: 15px;
    }
    .password {
        .el-form-item__content {
            top: 12px;
        }
    }
    .ico_docu_org {
        background-image: url('../assets/img/icon/org.png') !important;
    }
    .terminal_ico_docu {
        background-image: url('../assets/img/icon/terminal.png') !important;
    }
    .cloudPort_ico_docu,
    .cloud_ico_docu {
        background-image: url('../assets/img/icon/cloud.png') !important;
    }
    .STAFF_ico_docu {
        background-image: url('../assets/img/icon/user.png') !important;
    }
    .g-bd {
        height: calc(100% - 40px);
    }

    .info {
        color: #9d9d9d;
        font-size: 14px;
    }
    .presenter {
        .el-button i {
            font-size: 14px;
        }
        ul {
            margin: 0;
            padding: 18px 0 0 0;
            color: #333;
            .more {
                text-align: center;
                line-height: 45px;
                width: 100%;
                color: #38bcff;
                cursor: pointer;
                span {
                    padding-left: 18px;
                }
            }
            li {
                list-style: none;
                float: left;
                width: calc(100% / 2);
                height: 45px;
                line-height: 0px;
                .name {
                    i {
                        padding: 0 4px 0 6px;
                        color: #38bcff;
                    }
                    width: 120px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    border: none;
                    background-color: #ebf1fa;
                    display: inline-block;
                    height: 24px;
                    line-height: 24px;
                    border-radius: 5px;
                    padding: 5px;
                }
                .delete {
                    display: inline-block;
                    width: 24px;
                    height: 24px;
                    line-height: 24px;
                    border-radius: 5px;
                    padding:0 5px 5px 5px;
                    cursor: pointer;
                    i {
                        position: absolute;
                        color: #ddd;
                        display: none
                    }
                }
            }
            li:hover {
                .delete {
                    i {
                        color: red;
                        display: block
                    }
                }
            }
        }
    }
    .cloud-dialog {
        .el-select {
            display: block;
        }
        .dialog-body {
            width: 80%;
            margin: 0 auto;
        }
        .footer {
            text-align: center;
            .el-button {
                min-width: 100px;
            }
        }
    }
    .presenter-model {
        .el-dialog__body {
            padding: 20px 20px;
        }
    }
    .border-bottom {
        border-bottom: 1px solid #e0e0e0;
        margin-bottom: 23px;
    }
    .form-save-button-small{
        .el-button {
            min-width: 91px;
        }
    }
    .el-checkbox, .el-checkbox__input{
        white-space: inherit;
    }
}
</style>
<template>
    <div class="cloud">
        <div class="g-bd">
            <!--页面头部-->
            <div class="g-hd">
                <h3>{{$t('cloud.manage')}}</h3>
                <div class="btn-right">
                    <el-button type="primary" @click="addGroup(false)">
                        <i class="iconfont icon-bumen"></i>
                        {{$t('cloud.add.group')}}
                    </el-button>
                    <el-button type="primary" @click="addVmr(false)" v-if="hasCloudPort">
                        <i class="iconfont icon-yyunhuichang"></i>
                        {{$t('cloud.add.cloud')}}
                    </el-button>
                </div>
            </div>
            <!-- 左右布局 -->
            <div class="g-lr">
                <div class="left">
                    <!--组织结构-->
                    <yl-tree ref="left-tree" :data="categoryTreeWithVmrs" type="VMR" iconSkinField="innerType" :filterNodeKey="['name', 'namePinyin','namePinyinAlia','vmrId']" :showCheckbox="false" @node-event="onNodeEvent">
                    </yl-tree>
                </div>
                <div class="right">
                    <!--右侧内容-添加、编辑云会场-->
                    <div v-show="flag===1">
                        <div class="title border-bottom" v-if="!vmr.id">
                            {{$t('cloud.add.cloud')}}
                        </div>
                        <el-row>
                            <el-col>
                                <div class="head-img">
                                    <img src="../assets/img/cloud.png" v-if="!vmr.id" alt="">
                                    <img src="../assets/img/terminal.png" v-if="!!vmr.id&&vmr.type==='terminal'" alt="">
                                    <img src="../assets/img/cloudPort.png" v-if="!!vmr.id&&vmr.type!=='terminal'" alt="">
                                    <div class="alert" :class="{green:vmr.status === 'effective'}">
                                        {{vmrStatus[vmr.status]}}
                                    </div>
                                </div>
                            </el-col>
                            <el-col class="form-box">
                                <el-form ref="form" :model="vmr" :rules="rules" label-width="245px">
                                    <el-form-item :label="$t( 'cloud.name')" prop="name" required>
                                        <el-input v-model="vmr.name" :maxlength="128"></el-input>
                                    </el-form-item>
                                    <el-form-item :label="$t('cloud.group')">
                                        <tree-dropdown :data="categoryTree" v-model="vmr.categoryId"></tree-dropdown>
                                    </el-form-item>
                                    <el-form-item :label="$t('cloud.type')" required v-if="vmr.id">
                                        <el-radio-group v-model="vmr.type" :disabled="true">
                                            <el-radio label="cloudPort" v-if="vmr.type==='cloudPort'">
                                                {{$t('cloud.type.cloud')}}
                                            </el-radio>
                                            <el-radio label="terminal">{{$t('cloud.type.terminal')}}</el-radio>
                                            <el-radio label="cloud" v-if="vmr.type!=='cloudPort'">
                                                {{$t('cloud.type.cloud')}}
                                            </el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item :label="$t('cloud.maxAccessCount')" prop="maxAccessCount" v-if="vmr.type==='cloudPort'">
                                        <el-input v-model.number="vmr.maxAccessCount" :maxlength="2" :disabled="vmr.generated"></el-input>
                                    </el-form-item>
                                    <el-form-item :label="$t('cloud.mode')" required v-if="!vmr.generated">
                                        <el-radio-group v-model="vmr.mode">
                                            <el-radio v-for="m in vmrModel" :key="m.label" :label="m.label">{{m.text}}
                                            </el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item :label="$t('cloud.accountSave')" class="both">
                                    </el-form-item>
                                    <el-form-item :label="$t('cloud.id')" required>
                                        <div>
                                            <yl-pass-input ref="yl-pass-input" v-model="vmr.vmrId" :disabled="!!vmr.id?10:5" :count="10">
                                                <div slot="info" class="small-info"> {{ $t('cloud.smallInfo')}}</div>
                                            </yl-pass-input>
                                            <el-checkbox :label="$t('cloud.tagPassword')" v-model="tagPassword"></el-checkbox>
                                            <el-form-item class="password" prop="password" required v-if="tagPassword">
                                                <el-input :maxlength="6" :placeholder="$t( 'cloud.placeholder.password')" v-model="vmr.password"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-form-item>
                                    <el-form-item :label="$t('cloud.presenter')" v-if="!vmr.generated">
                                        <div class="presenter">
                                            <el-button type="info" @click="openPresenterDialog">
                                                <i class="iconfont icon-jia"></i> {{$t('cloud.add')}}
                                            </el-button>
                                            <ul>
                                                <li v-for="(item,index) in presenterList" :key="index">
                                                    <div class="name">
                                                        <i class="iconfont icon-morentouxiangtubiao"></i> {{item.name}}
                                                    </div>
                                                    <div class="delete" @click="deletePresenterList(index,item.id)">
                                                        <i class="iconfont icon-jianqu"></i>
                                                    </div>
                                                </li>
                                                <li class="more" v-if="vmr.moderatorsList&&vmr.moderatorsList.length>defaultPresenterPv&&vmr.moderatorsList.length>=presenterList.length" @click="setPresenterListPv">
                                                    <span v-if="presenterList.length<vmr.moderatorsList.length">{{ $t('cloud.more')}}</span>
                                                    <span v-else>{{ $t('cloud.unMore')}}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </el-form-item>
                                    <el-form-item :label="$t('cloud.senior.setting')">
                                        <el-checkbox v-model="vmr.syncDirectory">
                                            {{ $t('cloud.syncDirectory')}}
                                            <span class="info">{{ $t('cloud.syncDirectory.info')}}</span>
                                        </el-checkbox>
                                        <div></div>
                                        <el-checkbox v-model="vmr.enable" :disabled="vmr.type!=='terminal'||vmr.status!=='offline'" v-if="!!vmr.id">
                                            {{ $t('cloud.ban')}}
                                            <span class="info"> {{ $t('cloud.ban.info')}}</span>
                                        </el-checkbox>
                                    </el-form-item>
                                    <el-form-item label-width="245px" class="form-save-button form-save-button-small">
                                        <el-button type="primary" :disabled="isAble||vmr.status==='expired'||isAblePass" @click="saveVrm">
                                            {{$t('common.save')}}
                                        </el-button>
                                        <el-button @click="flag=2" v-if="!vmr.fromTree">{{$t('common.cancel')}}
                                        </el-button>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                        </el-row>
                    </div>
                    <!--右侧内容-列表-->
                    <div v-if="flag===2">
                        <div class="title" :title="title">
                            {{title}}
                        </div>
                        <div class="list">
                            <el-table ref="table" :data="tableData" :default-sort="{prop: 'date', order: 'descending'}" stripe @selection-change="handleSelectionChange" :max-height="TABLE_HEIGHT" @sort-change="orderByField">
                                <div slot="empty">
                                    <table-no-data></table-no-data>
                                </div>
                                <el-table-column type="selection" width="58" align="center"></el-table-column>
                                <el-table-column width="1" align="center" class-name="right-tooltip-cell">
                                    <template scope="scope">
                                        <el-tooltip v-if="scope.row.type!=='terminal'" class="tooltip-cloud" effect="dark" :content="scope.row.type==='cloudPort'?$t('cloud.type.cloudPort'):$t('cloud.type.cloud')" placement="top-start">
                                            <i class="iconfont icon-cloud"></i>
                                        </el-tooltip>
                                        <el-tooltip v-if="scope.row.type==='terminal'" class="tooltip-vmr" effect="dark" :content="$t('cloud.type.terminal')" placement="top-start">
                                            <i class="iconfont icon-zhongduanVMR"></i>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="name" min-width="150" :label="$t('cloud.vmr.name')" show-overflow-tooltip sortable="custom" class-name="right-tooltip-next-cell">
                                </el-table-column>
                                <el-table-column prop="vmrId" min-width="120" :label="$t('cloud.idName')" sortable="custom"></el-table-column>
                                <el-table-column prop="password" min-width="120" :label="$t('cloud.password')">
                                    <template scope="scope">
                                        {{scope.row.password ||'— —'}}
                                    </template>
                                </el-table-column>
                                <el-table-column min-width="150" :label="$t('cloud.meeting.mode')">
                                    <template scope="scope">
                                        {{scope.row.mode === "default" ? $t('cloud.meeting.default') : $t('cloud.meeting.president')}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="categoryName" min-width="125" :label="$t('cloud.groupName')" show-overflow-tooltip></el-table-column>
                                <el-table-column min-width="100" :label="$t('cloud.static')">
                                    <template scope="scope">
                                        <span :class="{green:scope.row.status === 'effective'}">{{vmrStatus[scope.row.status]}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="$t('common.operate')" width="120" align="center">
                                    <template scope="scope">
                                        <el-button type="text" @click="handleClick(scope.row,'edit')" :title="$t('user.table.title.edit')">
                                            <i class="icon-operation iconfont icon-bianji"></i>
                                        </el-button>
                                        <el-button type="text" @click="handleClick(scope.row,'delete')" :disabled="scope.row.type!=='cloudPort'" :title="$t('user.table.title.delete')">
                                            <i class="icon-operation iconfont icon-shanchu" :style="{'color':scope.row.type!=='cloudPort'?'#bfcad9':''+'!important'}"></i>
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <table-bar :total="total" table="table" @change="getList">
                                <span slot="more">
                                    <el-button type="primary" size="small" @click.native="batchDelete" :disabled="multipleSelection.length===0">{{$t('common.batchDelete')}}</el-button>
                                </span>
                            </table-bar>
                        </div>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>

            <!--模态框-添加部门-->
            <el-dialog :title="!group.id?$t('cloud.add.group'):$t('cloud.edit.group')" v-model="dialogGroup" customClass="ed50 user-dialog" size="small" class="cloud-dialog">
                <el-form label-position="left" ref="addForm" :model="group" :rules="rules" label-width="160px" v-if="dialogGroup" class="dialog-body">
                    <el-form-item :label="$t('cloud.name')" prop="name" required>
                        <el-input v-model="group.name" :maxlength="128" :placeholder="$t( 'cloud.placeholder.group')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('cloud.higher')" prop="parentId" required >
                        <tree-dropdown ref="tree-dropdown-dialog" :data="categoryTree" v-model="group.parentId" :edit-value="group.id"></tree-dropdown>
                    </el-form-item>
                    <el-form-item class="dialog-footer">
                        <el-button type="primary" @click="saveGroup">{{$t('common.ok')}}</el-button>
                        <el-button @click="dialogGroup = false">{{$t('common.cancel')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!--模态框-选择主持人-->
            <el-dialog :title="$t('cloud.select.presenter')" v-model="presenter" customClass="ed50 presenter-model" size="small">
                <yl-transfer :filterNodeKey="['name', 'namePinyin','email','namePinyinAlia','extension']" v-show="presenter" ref="transfer" v-model="copyModeratorsList" :data="orgTreeWithUsers" iconSkinField="type"></yl-transfer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="surePresenter">{{$t('common.ok')}}</el-button>
                    <el-button @click="cancelPresenter">{{$t('common.cancel')}}</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
//加载组件
import YlTree from '@/components/tree'
import YlTransfer from '@/components/transfer'
import YlPassInput from '@/components/passInput'
import TreeDropdown from '@/components/TreeDropdown'
import TableNoData from '@/components/common/TableNoData'
//加载服务
import * as api from '../api/cloud/'
import { getOrgTreeWithUsers } from '../api/account/user'
import { getGeneralView } from '../api/dashboard/index'
import PageList from '../services/mixins/pageList'
import auth from '@/services/authService'
import { defaultsDeep } from 'lodash';

export default {
    mixins: [PageList],
    components: {
        YlTree,
        YlPassInput,
        TreeDropdown,
        YlTransfer,
        TableNoData
    },
    data() {

        let { enterprise: { number } } = auth.getEnterprise()

        //vmr模式
        const vmrModel = [{
            label: 'default',
            text: this.$t('cloud.meeting.default')
        }, {
            label: 'demonstrator',
            text: this.$t('cloud.meeting.president')
        }];

        //vmr状态
        const vmrStatus = {
            effective: this.$t('cloud.static.effective'),
            ineffective: this.$t('cloud.static.ineffective'),
            offline: this.$t('cloud.static.offline'),
            expired: this.$t('cloud.static.expired'),
        };
        const randomNumber = [2, 3, 4, 5, 6, 7, 8]; //不能019数字开头
        //生成的5位随机数
        const createVmrId = () => {
            let id = number
            for (let i = 0; i < 5; i++) {
                if (i === 0) {
                    id += randomNumber[Math.floor(Math.random() * 6)];
                } else {
                    id += Math.floor(Math.random() * 10);
                }
            }
            return  number +'';// or id;
        }

        //初始化VMR对象
        const defaultVmr = {
            id: null,
            categoryId: '',
            mode: 'default',
            type: 'cloudPort',
            name: '',
            password: '',
            maxAccessCount: 0,
            vmrId: null,
            syncDirectory: false,
            moderatorsList: [],
            status: 'ineffective',
            generated: false,
            enable: false,
        }

        //初始化分组对象
        const defaultGroup = {
            name: null,
            id: '',
            parentId: ''
        }

        //页面默认显示的主持人数量
        const defaultPresenterPv = 2;
        //点击加载更多
        const defaultPresenterAddPv = 500;
        //表单验证
        const rules = {
            name: [
                { required: true, message: this.$t('cloud.placeholder.name'), trigger: 'blur' },
                {
                    min: 2,
                    max: 128,
                    message: this.$t('common.placeholder.length', { min: 2, max: 128 }),
                    trigger: 'blur'
                }
            ],
            password: [
                { required: true,  message: this.$t('vmr.password.not.null'), trigger: 'blur' },
                {
                    validator: (rule, value, callback) => {
                        if (!value || !/^\d{6}$/.test(value)) {
                            callback(new Error(this.$t('cloud.placeholder.password')));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur'
                }
            ],
            maxAccessCount: [
                { required: true, type: 'number', message: this.$t('cloud.placeholder.number'), trigger: 'blur' },
                { type: 'number', message: this.$t('cloud.placeholder.number'), trigger: 'blur' },
            ],
        }

        return {
            title: '',
            rules,
            vmrModel,
            defaultVmr,
            vmrStatus,
            defaultGroup,
            defaultPresenterPv,
            defaultPresenterAddPv,
            createVmrId,
            flag: 2,
            total: 0,
            mixinHeight: 0,
            node: {},
            categoryTree: [],
            categoryTreeWithVmrs: [],
            orgTreeWithUsers: [],
            tagPassword: false,
            copyTagPassword: false,
            copyModeratorsList: [],
            dialogGroup: false,
            presenter: false,
            group: Object.assign({}, defaultGroup),
            vmr: Object.assign({}, defaultVmr),
            copyVmr: {},
            presenterListPv: defaultPresenterPv,
            hasCloudPort: false,
            getWhiteSpace(source) {
                let _source = defaultsDeep({}, source);
                for (let [key, value] of Object.entries(_source)) {
                    if (value === undefined || value === null) {
                        _source[key] = '';
                    }
                }
                return _source;
            }
        }
    },
    computed: {
        //通过id获取主持人
        presenterList() {
            if (!this.vmr.moderatorsList) return;
            let showList = this.vmr.moderatorsList.slice(0, this.presenterListPv);
            let _list = showList.map(l => {
                return this.orgTreeWithUsers.find(x => x.id === l) || {}
            })
            return _list;
        },
        isAble() {
            return JSON.stringify(this.getWhiteSpace(this.copyVmr)) === JSON.stringify(this.getWhiteSpace(this.vmr)) && this.copyTagPassword === this.tagPassword;
        },
        isAblePass(){
            return this.vmr&&this.vmr.vmrId&&this.vmr.vmrId.replace(' ','').length!==10;
        }
    },
    watch: {
        tagPassword(n, o) {
            if (!n) this.vmr.password = null
        },
        flag(n, o) {
         /*   if (o === 0 && !this.isAble) {
                this.popUpWindow().then(() => {
                    this.saveVrm(false);
                }).catch(() => { });
            }*/
        }
    },
    beforeRouteLeave(to, from, next) {
        if (!this.isAble && this.flag !== 2&&!!this.vmr.id&&this.vmr.status!=='expired') {
            this.popUpWindow().then(() => {
                this.saveVrm(false).then(_ => {
                    next();
                })
            }).catch(() => {
                next();
            });
        } else {
            next();
        }
    },
    created() {
        $('.content-wrapper').css("min-width","970px");
    },
    beforeDestroy(){
        $('.content-wrapper').css("min-width","auto");
    },
    async mounted() {
        await this.exec();
        this.$nextTick(()=>{
            this.$route.query.target && this.addVmr(false);
        })

        getGeneralView('', false, '').then(_ => {
            this.hasCloudPort = _.data && _.data.hasCloudPort;
        });
    },
    methods: {
        //程序进来执行逻辑
        async exec() {
            await this.getCategoryTree();
            await this.getCategoryTreeWithVmrs();
            await this.getOrgTreeWithUsers();
        },
        popUpWindow() {
            return this.$confirm(this.$t('popUpWindow.tipContent'), this.$t('popUpWindow.tip'), {
                confirmButtonText: this.$t('popUpWindow.confirm'),
                cancelButtonText: this.$t('popUpWindow.cancel')
            });
        },
        //获取列表
        getList(assign) {
            if (assign instanceof Object) {
                Object.assign(this.params, assign)
            }
            api.getPagedList(this.params, this.params.skip === 0).then(json => {
                this.tableData = json.data.data;
                this.total = json.data.total
            })
        },
        confirmDelete() {
            return this.$confirm(this.$t('list.delete.vmr'), this.$t('login.dialog.tit'), {
                confirmButtonText: this.$t('user.table.title.delete'),
                cancelButtonText: this.$t('popUpWindow.cancel')
            })
        },
        //列表的删除与批量删除
        doListDelete(id, fromTree) {
            let ids = [];
            if (id instanceof Array) {
                ids = [...id]
            } else {
                ids.push(id)
            }
            this.confirmDelete().then(() => {
                api.deleteVmr({ ids }).then(json => {
                    if (json.ret >= 0) {
                        this.$message({
                            message: this.$t('common.message.delete.ok'),
                            type: 'success'
                        })
                        this.getList();
                        this.multipleSelection = [];
                        if (!fromTree) this.getCategoryTreeWithVmrs();
                        else this.initTreeSelectNode();
                    }
                })
            }).catch(() => {
            })
        },
        //执行类目删除
        doCategoryDelete(id) {
            this.confirmDeleteTree().then(() => {
                api.deleteCategory({ id }).then(json => {
                    if (json.ret >= 0) {
                        this.$message({
                            message: this.$t('common.message.delete.ok'),
                            type: 'success'
                        })
                        delete this.params.categoryId;
                        if(this.node&&this.node.type==='CATEGORY')  this.node =null;
                        this.getList();
                        this.getCategoryTree();
                        this.initTreeSelectNode();
                    }
                })
            }).catch(() => {
            })
        },
        //删除树目录或者树子节点，默认选中第一个
        initTreeSelectNode() {
            this.flag = 2;
            this.$refs["left-tree"].deleteNodes();
            this.$refs["left-tree"].selectNode(this.categoryTreeWithVmrs.find(x => x.parentId === null).id);
        },
        //获取类目树
        getCategoryTree(tree) {
            return api.getCategoryTree().then(json => {
                this.categoryTree = json.data || [];
                if(!tree&&this.categoryTree.length>0) this.title = this.categoryTree[0].name;
            })
        },
        //获取类目树（带人）
        getCategoryTreeWithVmrs() {
            return api.getCategoryTreeWithVmrs().then(json => {
                this.categoryTreeWithVmrs = json.data || []
            })
        },
        //获取组织树（带人）
        getOrgTreeWithUsers() {
            return getOrgTreeWithUsers().then(json => {
                this.orgTreeWithUsers = json.data || [];
            })
        },
        //获取Vmr
        getVmr(id, fromTree) {
            this.presenterListPv = this.defaultPresenterPv;
            api.getVmr({ id }, false).then(json => {
                this.flag = 1;
                this.vmr = json.data || {};
                this.vmr.enable = !this.vmr.enable;
                this.vmr.syncDirectory = !!this.vmr.syncDirectory;
                if (fromTree) this.vmr.fromTree = fromTree;
                this.copyVmr = defaultsDeep({}, this.vmr);
                this.tagPassword = !!this.vmr.password;
                this.copyTagPassword = !!this.vmr.password;
                try {
                    this.$refs['form'].resetFields();
                }catch (e){

                }
            })
        },
        //处理点击组织树的逻辑
        async onNodeEvent(event, node, targetNode) {
            this.node = node;
            switch (event) {
                case 'prev':
                case 'next':
                    if (targetNode === null || node.parentId !== targetNode.parentId) return;
                    const getItems = nodes => {
                        return nodes.map(x => {
                            let { id, index, type } = x;
                            return { id, index, type }
                        })
                    }
                    [node.index, targetNode.index] = [targetNode.index, node.index];
                    let { id: parentId } = node.getParentNode();
                    let params = { parentId, reIndexItems: getItems([node, targetNode]) };
                    let result = await api.reIndex(params, false);
                    if (result.ret === 0) {
                        this.getCategoryTree();
                        this.$refs["left-tree"].setPrevNextNodes(event)
                    }
                    break;
                case 'delete':
                    if (node.type === "CATEGORY") {
                        this.doCategoryDelete(node.id);
                    } else {
                        this.doListDelete(node.id, true)// if "VMR"
                    }
                    break;
                case 'edit':
                    if (node.type === "CATEGORY") this.addGroup(node);
                    break;
                case 'check':
                case 'click':
                    if (node.type === "CATEGORY") {
                        if (node.parentId === null) {
                            this.params.categoryId = null;
                        } else {
                            this.params.categoryId = node.id
                        }
                        this.title = node.name;
                        this.group = node;
                        this.flag = 2;
                        this.getList();
                    } else {
                        this.getVmr(node.id, true)
                    }
                    break;
            }
        },
        //添加分组
        addGroup(group) {
            if (group instanceof Object) {
                this.group = defaultsDeep({}, group);
                this.groupMoveNodeId = group.id;
            } else {
                let parentId =(this.node&&this.node.type=== "CATEGORY"&&this.node.id)||( this.categoryTree.length > 0 ? this.categoryTree[0].id : null);
                this.group = Object.assign({}, this.defaultGroup, { parentId })
            }
            this.dialogGroup = true;
        },
        //添加VMR
        addVmr(vmr) {
            this.flag = 1;
            this.vmr = Object.assign({}, this.defaultVmr);
            this.vmr.vmrId = this.createVmrId();
            this.vmr.categoryId = this.params.categoryId || (this.categoryTree.length > 0 ? this.categoryTree[0].id : null);
            this.vmr.moderatorsList = [];
            this.copyVmr = Object.assign({}, this.vmr);
            this.tagPassword = false;
            this.copyTagPassword = false;
//            this.$refs["left-tree"].cancelSelectedNode();
            this.$nextTick(_=>{
                if(!!this.$refs["transfer"]) this.$refs["transfer"].setCheckedKeys(this.vmr.moderatorsList||[]);
                this.$refs["yl-pass-input"].rest();
            });
        },
        //保存分组
        saveGroup() {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    let { name, parentId, id } = this.group;
                    let result = !id ? api.addCategory({ name, parentId }) : api.editCategory({ name, parentId, id });
                    result.then(json => {
                        if (json.ret === 0) {
                            this.$message({
                                message: this.$t('common.message.save.ok'),
                                type: 'success'
                            })
                            if (!id) {
                                this.exec();
                                this.getList({categoryId:null});
                            } else {
//                                if (this.groupMoveNodeId !== parentId) {
//                                    this.$refs["left-tree"].moveNode(parentId, this.groupMoveNodeId, "inner")
//                                }
//                                this.$refs["left-tree"].updateNode(this.group.id,false,{name:this.group.name});
                                this.title = this.group.name;
                                this.getCategoryTree(true);
                                this.getCategoryTreeWithVmrs();
                                this.getOrgTreeWithUsers();
                                this.getList();
                            }
                            this.dialogGroup = false;
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        //保存VMR
        saveVrm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let { id, categoryId, name, vmrId, mode, password, maxAccessCount, syncDirectory, moderatorsList, enable, fromTree } = this.vmr;
                    if (!password || !this.tagPassword) {
                        password = null
                    }
                    if (!moderatorsList || moderatorsList.length === 0) {
                        moderatorsList = null
                    }
                    let params = {
                        id,
                        categoryId,
                        name,
                        vmrId,
                        mode,
                        password,
                        maxAccessCount,
                        syncDirectory,
                        moderatorsList,
                        enable: !enable
                    }
                    let result = !id ? api.addVmr(params) : api.editVmr(params);
                    result.then(json => {
                        if (json.ret === 0) {
                            /* 重新取列表因为有可能移动分组 */
                            delete this.params.categoryId;
                            if(this.categoryTree.length>0) this.title = this.categoryTree[0].name;
                            this.getList({skip:0});
                            if (!!id && fromTree) {
                                /* 不刷新页面直接update,NODE,重新取数是为了获取拼音，这块后续改成成前端处理拼音 */
                                api.getVmr({ id }, false).then(json => {
                                    let { name, namePinyin, categoryId, namePinyinAlia } = json.data;
                                    if (this.node.parentId !== categoryId) {
                                        this.$refs["left-tree"].moveNode(categoryId, this.node.id, "inner")
                                    }
                                    this.node.name = name;
                                    this.node.namePinyin = namePinyin;
                                    this.node.parentId = categoryId;
                                    this.node.namePinyinAlia = namePinyinAlia;
                                    this.$refs["left-tree"].updateNode(this.node);
                                    this.vmr.syncDirectory = !!this.vmr.syncDirectory;
                                    this.copyVmr = defaultsDeep({}, this.vmr);
                                    this.copyTagPassword = this.tagPassword;
                                })
                            } else {
                                this.getCategoryTreeWithVmrs();
                            }
                            if (!fromTree) this.flag = 2;
                            this.$message({
                                message: this.$t('common.message.save.ok'),
                                type: 'success'
                            })
                        }
                    })
                } else {
                    return false;
                }
            })
        },
        //选择主持人
        surePresenter() {
            this.vmr.moderatorsList = defaultsDeep([], this.copyModeratorsList);//this.$refs["transfer"].getChecked().map(x=>x.id)
            this.presenter = false;
            this.presenterListPv = this.defaultPresenterPv;
        },
        cancelPresenter() {
            this.$refs["transfer"].setCheckedKeys(this.vmr.moderatorsList||[]);
            this.presenter = false;
        },
        openPresenterDialog() {
            this.presenter = true;
            this.copyModeratorsList = defaultsDeep([], this.vmr.moderatorsList);
            this.$nextTick(_=>{
                this.$refs["transfer"].setCheckedKeys(this.copyModeratorsList||[]);
            });
        },
        //删除主持人
        deletePresenterList(index, id) {
            this.vmr.moderatorsList.splice(index, 1);
//            this.vmr.moderatorsList.splice(this.vmr.moderatorsList.indexOf(id), 1);
            if (!!this.$refs["transfer"]) this.$refs["transfer"].deleteUpdateValue(index, id);
        },
        //点击加载更多
        setPresenterListPv() {
            if (this.presenterList.length === this.vmr.moderatorsList.length) {
                this.presenterListPv = this.defaultPresenterPv;
            } else {
                this.presenterListPv += this.defaultPresenterAddPv;
            }
        },
        //表格中点击触发事件
        handleClick(row, type) {
            if (type === 'edit') this.getVmr(row.id);
            else if (type === 'delete') {
                this.doListDelete(row.id);
            }
        }
    }
}
</script>

