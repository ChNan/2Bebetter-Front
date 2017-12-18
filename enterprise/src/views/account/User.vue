<style lang="scss">
    @import "../../assets/scss/layout_lr";

    .STAFF_ico_docu {
        background-image: url('../../assets/img/icon/user.png') !important;
    }

    .user {
        height: 100%;
        overflow-y: hidden;
        .ico_docu {
            background-image: url('../../assets/img/icon/user.png') !important;
        }
        .g-bd {
            height: calc(100% - 40px);
        }
        .el-form-item__label {
            padding-right: 15px;
        }
        .a {
            text-decoration: underline;
            cursor: pointer;
            color: #38bcff;
        }
        .form-save-button-small{

            min-width: 670px;
            .el-button {
                min-width: 85px;
                margin-top: 10px;
                margin-right: 10px;
            }
            .el-button+.el-button{
                margin-left: 0;
            }
        }
    }

    .user-dialog {
        .el-dialog__header {
            text-align: center;
        }
        .el-select {
            display: block;
        }
        .dialog-body {
            width: 80%;
            margin: 0 auto;
        }
    }

    .border-bottom {
        border-bottom: 1px solid #e0e0e0;
        margin-bottom: 23px;
    }

    .success {
        color: #40bd6f;
    }
    .message-alert i{
        display: inline-block;
        text-overflow: ellipsis;
        width: 65%;
        white-space: nowrap;
        word-break: break-all;
        max-width: 65%;
        overflow: hidden;
        text-align: right;
    }
    .message-alert {
        width: 100%;
        p {
            width: 90%;
            margin: 0 auto;
            text-align: left;
            line-height:27px;
            span {
                color: #999999;
            }
            i {
                float: right;
                font-style: unset;
                color: #525252;
            }
        }
    }
    @media screen and (max-width: 1366px){
        .user .right .form-save-button-small .el-form-item__content{
            margin-left: 200px!important;
        }
    }
    .item-pin{
        background-color: #eef1f6;
        cursor: text;
        border-radius: 4px;
        border: 1px solid #d1dae5;
        box-sizing: border-box;
        color: #bbb;
        font-size: 13px;
        height: 36px;
        line-height: 36px;
        outline: 0;
        padding: 0px 10px;
        width: 100%;
        display: block;
    }
</style>

<template>
    <div class="user">
        <div class="g-bd">
            <!--页面头部-->
            <div class="g-hd">
                <h3>{{$t('user.title')}}</h3>
                <div class="btn-right">
                    <el-button type="primary" @click="addOrg(false)">
                        <i class="iconfont icon-bumen"></i>
                        {{$t('user.add.group')}}
                    </el-button>
                    <el-button type="primary" @click="addUser(false)">
                        <i class="iconfont icon-yzhanghao"></i>
                        {{$t('user.add.user')}}
                    </el-button>
                    <el-button type="warning" @click="addUser(true)">
                        <i class="iconfont icon-daoru"></i>
                        {{$t('user.add.import')}}
                    </el-button>
                </div>
            </div>
            <!-- 左右布局 -->
            <div class="g-lr">
                <div class="left">
                    <!--组织结构-->
                    <yl-tree ref="left-tree" :data="orgTreeWithUsers" type="STAFF" @node-event="onNodeEvent" :filterNodeKey="['name', 'namePinyin','namePinyinAlia','extension']" iconSkinField="type">
                    </yl-tree>
                </div>
                <div class="right g-lr-right">
                    <!--右侧内容、编辑用户-->
                    <div v-show="flag===0||flag===1" class="user-right">
                        <div class="title border-bottom" v-show="flag===1">
                            {{$t('user.add.user')}}
                        </div>
                        <el-row>
                            <el-col v-show="flag===0">
                                <div class="head-img">
                                    <img src="../../assets/img/default.png" alt="">
                                </div>
                            </el-col>
                            <el-col class="form-box">
                                <el-form ref="form" :model="staff" :rules="rules" :label-width="flag===0?'245px':'195px'">
                                    <el-form-item prop="name" :label="$t('user.form.name')" required>
                                        <el-input v-model="staff.name" :maxlength="128"></el-input>
                                    </el-form-item>
                                    <el-form-item :label="$t('user.form.orgName')" required>
                                        <tree-dropdown ref="tree-dropdown-form" :data="orgTree" v-model="staff.orgs[0].orgId"></tree-dropdown>
                                    </el-form-item>
                                    <el-form-item :label="$t('user.form.title')">
                                        <el-input v-model="staff.orgs[0].title" :maxlength="128"></el-input>
                                    </el-form-item>
                                    <el-form-item :label="$t('user.form.info')" class="both" v-show="flag===0">
                                    </el-form-item>
                                    <el-form-item prop="extension" :label="$t('user.form.extension')" required :error="errors.extension">
                                        <el-input v-model="staff.extension" :maxlength="4" :disabled="flag===0"></el-input>
                                    </el-form-item>
                                    <el-form-item prop="email" :label="$t('device.edit.email')" :error="errors.email">
                                        <el-input v-model="staff.email" :maxlength="128"></el-input>
                                        <label class="layer">{{$t('device.edit.email.info')}}</label>
                                    </el-form-item>
                                    <el-form-item prop="mobile":label="$t('user.form.mobile')" :error="$t(errors.mobile)">
                                        <el-input v-model="staff.mobile" :maxlength="64"></el-input>
                                    </el-form-item>
                                    <div v-show="flag===0">
                                        <el-form-item :label="$t('user.form.save')" class="both">
                                        </el-form-item>
                                        <el-form-item :label="$t('user.form.account')">
                                            <!--<el-input v-model="staff.username" :disabled="true"></el-input>-->
                                            <span class="item-pin">{{staff.username}}</span>
                                        </el-form-item>
                                        <el-form-item :label="$t('user.form.password')">
                                            <!--<el-input :type="staff.password" :disabled="true" v-model="defaultPassWord.password"></el-input>-->
                                            <span class="item-pin">{{defaultPassWord.password}}</span>
                                        </el-form-item>
                                        <el-form-item :label="$t('user.form.pin')">
                                            <!--<el-input :type="staff.pin" :disabled="true" v-model="defaultPassWord.pin"></el-input>-->
                                            <span class="item-pin">{{defaultPassWord.pin}}</span>
                                        </el-form-item>
                                    </div>
                                    <el-form-item class="form-save-button form-save-button-small" :label-width="flag===0?'245px':'195px'" v-show="flag===0">
                                        <el-button type="warning" @click="resetTextWord('password')">{{$t('device.edit.restPassword')}}</el-button>
                                        <el-button type="warning" @click="resetTextWord('pin')">{{$t('device.edit.restPin')}}</el-button>
                                        <el-button type="primary" :disabled="!staff.email" @click="sendInfo()">{{$t('device.edit.send')}}</el-button>
                                        <el-button type="primary" :disabled="isAble" @click="saveUser(false)">{{$t('device.edit.save')}}</el-button>
                                    </el-form-item>
                                    <el-form-item class="form-save-button" :label-width="flag===0?'245px':'195px'" v-show="flag===1">
                                        <el-button type="primary" @click="saveUser(false)">{{$t('common.ok')}}</el-button>
                                        <el-button @click="flag=2">{{$t('common.cancel')}}</el-button>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                        </el-row>
                    </div>

                    <!--右侧内容、列表-->
                    <div v-if="flag===2" class="user-right">
                        <div class="title" :title="title">
                            {{title}}
                        </div>
                        <div class="list">
                            <el-table ref="table" :data="tableData" :default-sort="{prop: 'date', order: 'descending'}" stripe @selection-change="handleSelectionChange" :max-height="TABLE_HEIGHT" @sort-change="orderByField">
                                <div slot="empty">
                                    <table-no-data></table-no-data>
                                </div>
                                <el-table-column type="selection" width="58" align="center"></el-table-column>
                                <el-table-column prop="account" :label="$t('user.table.account')" min-width="120"  sortable="custom"></el-table-column>
                                <el-table-column prop="name" :label="$t('user.table.name')" show-overflow-tooltip min-width="170" sortable="custom"></el-table-column>
                                <el-table-column :label="$t('user.table.group')"  show-overflow-tooltip  min-width="170">
                                    <template scope="scope">
                                        {{scope.row.orgs[0].orgName}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="extension" :label="$t('user.table.extension')" min-width="120"></el-table-column>
                                <el-table-column :label="$t('common.operate')" width="160" align="center">
                                    <template scope="scope">
                                        <el-button type="text" @click="handleClick(scope.row,'edit')" :title="$t('user.table.title.edit')">
                                            <i class="icon-operation iconfont icon-bianji"></i>
                                        </el-button>
                                        <el-button :disabled="!scope.row.email" type="text" @click="handleClick(scope.row,'send')" :title="$t('device.edit.send')">
                                            <i class="icon-operation iconfont icon-youjian"></i>
                                        </el-button>
                                        <el-button type="text" @click="handleClick(scope.row,'delete')" :title="$t('user.table.title.delete')">
                                            <i class="icon-operation iconfont icon-shanchu"></i>
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <table-bar ref="tableBar" :total="total" table="table" @change="getList">
                                <span slot="more">
                                    <el-button type="primary" size="small" @click.native="batchDelete" :disabled="multipleSelection.length===0">{{$t('common.batchDelete')}}</el-button>
                                    <el-button type="primary" size="small" @click.native="batchSend" :disabled="canSendEmail">{{$t('account.batch.send')}}</el-button>
                                </span>
                            </table-bar>

                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
            <!--添加部门-->
            <el-dialog ref="dialog" :title="!org.id?$t('user.add.group'):$t('user.edit.group')" v-model="dialog" customClass="ed50" size="small" class="user-dialog">
                <el-form ref="addForm" label-width="160px" :model="org" :rules="rules" class="dialog-body" v-if="dialog" label-position="left">
                    <el-form-item :label="$t('room.name')" prop="name" required>
                        <el-input v-model="org.name" :placeholder="$t( 'user.placeholder.group')" :maxlength="128"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('room.higher')" prop="company" required>
                        <tree-dropdown ref="tree-dropdown-dialog" :data="orgTree" v-model="org.parentId" :edit-value="org.id"></tree-dropdown>
                    </el-form-item>
                    <el-form-item class="dialog-footer">
                        <el-button type="primary" @click="saveOrg">{{$t('common.ok')}}</el-button>
                        <el-button @click="dialog = false">{{$t('common.cancel')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!--添加成功-->

        </div>
    </div>
</template>
<script>
    import YlTree from '@/components/tree'
    import * as api from '../../api/account/user'
    import PageList from '../../services/mixins/pageList'
    import auth from '@/services/authService'
    import TreeDropdown from '@/components/TreeDropdown'
    import { defaultsDeep } from 'lodash'
    import { filterParams, equals } from '../../services/toolService'
    import TableNoData from '@/components/common/TableNoData'
    import { GetErr } from '@/services/toolService'
    /*
    * @flag 0:编辑帐号  1:添加帐号 2:部门列表
    * */
    export default {
        mixins: [PageList],
        components: {
            YlTree, TreeDropdown, TableNoData
        },
        data() {
            const showText = "******";

            const defaultPassWord = {
                password: showText,
                pin: showText
            };

            const defaultStaff = {
                name: '',
                email: '',
                extension: '',
                orgs: [{ orgId: '', title: '', orgName: '' }],
                mobile: ''
            };


            const defaultOrg = {
                name: '',
                id: '',
                parentId: ''
            };

            //表单验证
            const rules = {
                name: [
                    { required: true, message: this.$t('room.placeholder.name'), trigger: 'blur' },
                    { min: 2, max: 128, message: this.$t('common.placeholder.length', { min: 2, max: 128 }), trigger: 'blur' }
                ],
                extension: [
                    {
                        validator: (rule, value, callback) => {
                            if (!/^\d{4}$/.test(value)) {
                                callback(new Error(this.$t('room.placeholder.number')));
                            } else {
                                callback();
                            }
                        }, trigger: 'blur'
                    }
                ],
                email: [
                    { type: 'email', message: this.$t('user.placeholder.email'), trigger: 'blur' }
                ],
                mobile: [
                    {
                        validator: (rule, value, callback) => {
                            if(!value){
                                callback();
                            }else if (!/^(\d{4}-|\d{3}-|\d{5}-)?(\d{4}-|\d{3}-|\d{5}-|\d{6}-)?\d{3,64}$/.test(value)) {
                                callback(new Error(this.$t('common.validator.phone.number.invalid')));
                            } else {
                                callback();
                            }
                        }, trigger: 'blur'
                    }
                ]
            };

            return {
                title: '',
                flag: 2,////
                rules,
                defaultStaff,
                defaultOrg,
                orderType: 0,
                showText,
                defaultPassWord: {
                    password: showText,
                    pin: showText
                },
                dialog: false,
                staff: Object.assign({}, defaultStaff),
                copyStaff: Object.assign({}, defaultStaff),
                org: Object.assign({}, defaultOrg),
                orgMoveNode: null,
                orgTree: [],
                orgTreeWithUsers: [],
                mixinHeight: 0,
                errors: {
                    extension: '',
                    mobile: '',
                    email: ''
                },
                //再做个页面
                messageAlert: (res) => {
                    const h = this.$createElement;
                    const createRow = rows => {
                        return rows.map(row => {
                            return h('p', null, [
                                h('span', null, `${row.label}：`),
                                h('i', null, res[row.value])
                            ])
                        })
                    };
                    return new Promise((resolve, reject) => {
                        this.$msgbox({
                            title: this.$t('user.message.ok'),
                            message: h('div', { class: 'message-alert' }, [
                                ...createRow([
                                    { label: this.$t('user.table.account'), value: 'username' },
                                    { label: this.$t('user.table.name'), value: 'name' },
                                    { label: this.$t('user.table.password'), value: 'password' },
                                    { label: this.$t('user.table.pin'), value: 'pinCode' },
                                ])
                            ]),
                            showConfirmButton: !!this.staff.email,
                            showCancelButton: true,
                            confirmButtonText: this.$t('user.form.send'),
                            cancelButtonText: this.$t('user.form.ok'),
                            topIcon: 'iconfont icon-chenggongleitishi success mt20',
                            callback: action => {
                                if ("confirm" === action) { //else   cancel
                                    this.sendAccountInfoMail();
                                }
                                resolve(action);
                            }
                        });
                    });
                },
                getWhiteSpace(source) {
                    let _source = defaultsDeep({}, source);
                    for (let [key, value] of Object.entries(_source)) {
                        if (source[key] && (Object.prototype.toString.call(source[key]) === "[object Object]" || Object.prototype.toString.call(source[key]) === "[object Array]")) {
                            this.getWhiteSpace(source[key]);
                        } else {
                            if (value === undefined || value === null) {
                                _source[key] = '';
                            }
                        }
                    }
                    return _source;
                },
                setWhiteSpace(source) {
                    for (let [key, value] of Object.entries(source)) {
                        if (source[key] && Object.prototype.toString.call(source[key]) === "[object Object]") {
                            this.setWhiteSpace(source[key]);
                        } else {
                            if (value === undefined || value === '') {
                                source[key] = null;
                            }
                        }
                    }
                },
            }
        },
        computed: {
            isAble() {
                return JSON.stringify(this.getWhiteSpace(this.staff)) === JSON.stringify(this.getWhiteSpace(this.copyStaff));
            },
            canSendEmail(){
                return this.multipleSelection.length===0||this.multipleSelection.every(e=>!e.email);
            }
        },
        beforeRouteLeave(to, from, next) {
            if (!this.isAble && this.flag !== 2&&!!this.staff.id) {
                this.popUpWindow().then(() => {
                    this.saveUser(false).then(_ => {
                        next();
                    })
                }).catch(() => {
                    next();
                });
            } else {
                next();
            }
        },
        async mounted() {
            await this.exec();
            this.$nextTick(_ => {
                this.$route.query.target && this.addUser(false);
            });
        },
        watch: {
            /* flag(n, o) {
                 if (o === 0 && !this.isAble) {
                     this.popUpWindow().then(() => {
                         this.saveUser(false);
                     }).catch(() => { });
                 }
             }*/
        },
        created() {

        },
        methods: {
            popUpWindow() {
                return this.$confirm(this.$t('popUpWindow.tipContent'), this.$t('popUpWindow.tip'), {
                    confirmButtonText: this.$t('popUpWindow.confirm'),
                    cancelButtonText: this.$t('popUpWindow.cancel')
                });
            },
            async exec() {
               await this.getOrgTree();
               await this.getOrgTreeWithUsers();
            },
            getList(assign) {
                if (assign instanceof Object) {
                    Object.assign(this.params, assign);
                }
                api.getPagedList(this.params, this.params.skip === 0).then(json => {
                    this.tableData = json.data.data;
                    this.total = json.data.total;
                })
            },
            confirmDelete() {
                return this.$confirm(this.$t('list.delete.account'), this.$t('login.dialog.tit'), {
                    confirmButtonText: this.$t('user.table.title.delete'),
                    cancelButtonText: this.$t('popUpWindow.cancel')
                });
            },
            getOrgTree(tree) {
                return api.getOrgTree().then(json => {
                    this.orgTree = json.data;
                    if(!tree&&this.orgTree.length>0) this.title = this.orgTree[0].name;
                })
            },
            getOrgTreeWithUsers() {
                return api.getOrgTreeWithUsers().then(json => {
                    this.orgTreeWithUsers = json.data;
                })
            },

            doCategoryDelete(id) {
                this.confirmDeleteTree().then(() => {
                    api.orgDelete({ id }).then(json => {
                        if (json.ret >= 0) {
                            this.$message({
                                message: this.$t('common.message.delete.ok'),
                                type: 'success'
                            })
                            delete this.params.orgId;
                            if(this.node&&this.node.type==='ORG')  this.node =null;
                            this.getList();
                            this.getOrgTree();
                            this.initTreeSelectNode();
                            this.multipleSelection = [];
                        }
                    })
                }).catch(() => {
                })
            },
            //列表的删除与批量删除
            doListDelete(item, fromTree) {
                let ids = [];
                if (item instanceof Array) {
                    ids = [...item];
                } else {
                    ids.push(item);
                }

                let params = [];
                if (ids.length > 1 || !fromTree) {
                    params = this.tableData.filter(d => {
                        return ids.indexOf(d.id) > -1;
                    }).map(m => {
                        return {
                            id: m.id,
                            orgId: m.orgs[0].orgId
                        }
                    });
                } else {
                    params = [{
                        id: item.id,
                        orgId: item.parentId
                    }];
                }

                this.confirmDelete().then(() => {
                    api.staffBatchDelete({ ids: [...params] }).then(json => {
                        if (json.ret >= 0) {
                            this.$message({
                                message: this.$t('common.message.delete.ok'),
                                type: 'success'
                            })
                            this.getList();
                            if (!fromTree) this.getOrgTreeWithUsers();
                            else this.initTreeSelectNode();
                        }
                    })
                }).catch(() => {
                })
            },
            //删除树目录或者树子节点，默认选中第一个
            initTreeSelectNode() {
                this.flag = 2;
                this.$refs["left-tree"].deleteNodes();
                this.$refs["left-tree"].selectNode(this.orgTreeWithUsers.find(x => x.parentId === null).id);
            },
            saveOrg() {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        let { name, parentId, id } = this.org;
                        let res = !id ? api.orgAdd({ name, parentId }) : api.orgEdit({ name, parentId, id });
                        res.then(json => {
                            if (json.ret > 0) {
                                this.$message({
                                    message: this.$t('common.message.save.ok'),
                                    type: 'success'
                                })
                                if (!id) {
                                    this.exec();
                                    this.getList({orgId:null});
                                } else {
//                                    if (this.orgMoveNodeId !== parentId) {
//                                        this.$refs["left-tree"].moveNode(parentId, this.orgMoveNodeId, "inner");
//                                    }
//                                    this.$refs["left-tree"].updateNode(this.org.id,false,{name:this.org.name});
                                    this.title = this.org.name;
                                    this.getOrgTree(true);
                                    this.getOrgTreeWithUsers();
                                    this.getList();
                                }
                                this.dialog = false;
                            }
                        })
                    } else {
                        return false
                    }
                })
            },

            async onNodeEvent(event, node, targetNode) {
//            console.log(node)
                this.node = node;
                switch (event) {
                    case 'prev':
                    case 'next':
                        if (targetNode === null || node.parentId !== targetNode.parentId) return
                        const getItems = nodes => {
                            return nodes.map(x => {
                                let { id, index, type } = x;
                                return { id, index, type };
                            })
                        }
                        [node.index, targetNode.index] = [targetNode.index, node.index];
                        let { id: parentId } = node.getParentNode();
                        let params = { parentOrgId: parentId, reIndexItems: getItems([node, targetNode]) };
                        let result = await api.reIndex(params, false);
                        if (result.ret === 0) {
                            this.getOrgTree();
                            this.$refs["left-tree"].setPrevNextNodes(event);
                        }
                        break;
                    case 'delete':
                        if (node.type === "ORG") {
                            this.doCategoryDelete(node.id);
                        } else {
                            this.doListDelete(node, true)// if "VMR"
                        }
                        break;
                    case 'edit':
                        if (node.type === "ORG") {
                            this.addOrg(this.node);
                        }
                        break;
                    case 'check':
                    case 'click':
                        if (node.type === "ORG") {
                            if (node.parentId === null) {
                                this.params.orgId = null;
                            } else {
                                this.params.orgId = node.id;
                            }
                            this.title = node.name;
                            if(this.org||this.org.id!==node.id) this.org = defaultsDeep({}, node);
                            this.flag = 2;
                            this.getList();
                        } else {
                            this.errors.email = '';
                            this.errors.mobile = '';
                            this.errors.extension = '';
                            if (!this.isAble) {
                                //                                await this.popUpWindow()
                                this.getStaff(node.id, true);
                            } else {
                                this.getStaff(node.id, true);
                            }
                        }
                        break;
                }
            },
            isEmpty (str) {
                return str === "" || str === null || typeof str ==="undefined"
            },
            //获取Room
            getStaff(id, fromTree) {
                this.defaultPassWord = {
                    password: this.showText,
                    pin: this.showText
                };
                api.getStaff({ id }, false).then(json => {
                    this.staff = json.data || {};
                    if (fromTree) this.staff.fromTree = fromTree;
                    this.copyStaff = defaultsDeep({}, this.staff);
                    this.flag = 0;
                    this.$refs.form.resetFields();
                    if(this.isEmpty(json.data.pinCode)) this.defaultPassWord.pin = "";

                })
            },
            addOrg(org) {
                if (org instanceof Object) {
                    this.org = defaultsDeep({}, org);
                    this.orgMoveNodeId = org.id;
                } else {
                    let parentId = (this.node&&this.node.type=== "ORG"&&this.node.id)|| (this.orgTree.length > 0 ? this.orgTree[0].id : null);
                    this.org = Object.assign({}, this.defaultOrg, { parentId });
                }
                this.dialog = true;
            },

            addUser(user) {
                this.errors.email = '';
                this.errors.mobile = '';
                this.errors.extension = '';
                if (!user) {
//                this.$refs["left-tree"].cancelSelectedNode();
                    this.staff = Object.assign({}, this.defaultStaff);
                    this.staff.orgs[0].orgId = this.params.orgId || (this.orgTree.length > 0 ? this.orgTree[0].id : null);
                    this.copyStaff  = Object.assign({}, this.staff);
                    this.flag = 1;
                } else {
                    this.$router.push('/enterprise/batchImport')
                }
            },
            sendAccountInfoMail(_id) {
                api.sendAccountInfoMail({ id: _id || this.staff.id },false,'').then(response => {
                    if (response.ret < 0) {
                        let error = response.error;
                        let _msg = error.msg;
                        if (error.fieldErrors && error.fieldErrors[0]) {
                            _msg = error.fieldErrors[0].msg;
                        }
                        this.$alert( this.$t(_msg) , this.$t('login.dialog.tit'), {
                            confirmButtonText:this.$t('user.message.update.go'),
                            callback: action => {

                            }
                        });
                    } else {
                        this.$message({
                            message: this.$t('user.message.send.ok'),
                            type: 'success'
                        });
                    }
                })
            },
            sendInfo() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        if (!this.isAble) {
                            this.$confirm(this.$t('popUpWindow.tipContentSend'), this.$t('popUpWindow.tip'), {
                                confirmButtonText: this.$t('popUpWindow.confirm'),
                                cancelButtonText: this.$t('popUpWindow.cancel')
                            }).then(() => {
                                //确定执行
                                this.saveUser(true);
//                                this.sendAccountInfoMail();
                            }).catch(() => {
                                //this.sendAccountInfoMail();
                            });
                        } else {
                            this.sendAccountInfoMail();
                        }

                    } else {
                        return false
                    }
                })
            },
            saveUser(send) {
                this.errors.extension = '';
                this.errors.mobile = '';
                this.errors.email = '';
                //新增需要传递部门名称 2017/10/11
                if (!this.staff && this.orgTree && this.staff.orgs[0]) {
                    let org = this.orgTree.find(f => f.id === this.staff.orgs[0].orgId);
                    if (org) this.staff.orgs[0].orgName = org.name;
                }
                //新增需要传递部门名称

                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let { id, name, email, extension, mode, mobile, orgs: [{ orgId, title, orgName }], fromTree } = this.staff;
                        let params = filterParams({ id, name, email, extension, mode, mobile, orgs: [{ orgId, title, orgName }] });
                        let result = !id ? api.staffAdd(params, false, '') : api.staffEdit(params, false, '');
                        result.then(json => {
                            if (json.ret >= 0) {
                                this.copyStaff = defaultsDeep({}, this.staff);
                                /* 重新取列表因为有可能移动分组 */
                                delete this.params.orgId;
                                if(this.orgTree.length>0) this.title = this.orgTree[0].name;
                                this.getList({skip:0});
                                if (!!id && fromTree) {
                                    /* 不刷新页面直接update,NODE,重新取数是为了获取拼音，这块后续改成成前端处理拼音 */
                                    api.getStaff({ id }, false).then(json => {
                                        let { name, namePinyin, orgs: [{ orgId: parentId }], namePinyinAlia } = json.data;
                                        if (this.node.parentId !== parentId) {
                                            this.$refs["left-tree"].moveNode(parentId, this.node.id, "inner");
                                        }
                                        this.node.name = name;
                                        this.node.namePinyin = namePinyin;
                                        this.node.parentId = parentId;
                                        this.node.namePinyinAlia = namePinyinAlia;
                                        this.$refs["left-tree"].updateNode(this.node);
                                    })
                                    if (send) {
                                        this.sendAccountInfoMail();
                                    } else {
                                        this.$message({
                                            message: this.$t('user.message.save.ok'),
                                            type: 'success'
                                        });
                                        if (!fromTree) this.flag = 2;
                                    }
                                } else {
                                    this.staff.id = json.data.id;//为了发送邮件
                                    if (!id) {
                                        this.messageAlert(json.data).then(_ => {
                                            if (!fromTree) this.flag = 2;
                                        });
                                    } else {
                                       if(!send) {
                                           this.$message({
                                               message: this.$t('user.message.save.ok'),
                                               type: 'success'
                                           });
                                           this.flag = 2;//发送后是否跳转
                                       }else{
                                           this.sendAccountInfoMail();
                                       }
                                    }
                                    this.getOrgTreeWithUsers();
                                }
                            } else {
//                                if (!id) {
                                    let error = GetErr(json);
                                    if (error.indexOf('email') > -1) {
                                        this.errors.email = this.$t(error) ;
                                    } else if(error.indexOf('phone') > -1){
                                        this.errors.mobile = this.$t(error) ;
                                    }else{
                                        this.$message({
                                            message:  this.$t(error) ,
                                            type: 'warning'
                                        });
                                    }
//                                }
                            }
                        })
                    } else {
                        return false
                    }
                })
            },

            //表格中点击触发事件
            handleClick(row, type) {
                if (type === 'edit') this.getStaff(row.id);
                else if (type === 'delete') {
                    this.doListDelete(row.id)
                }else if(type==='send'){
                    this.tabelSend(row.id)
                }
            },
            //重置账号、Pin密码操作
            resetTextWord(type) {
                let result = type === 'password' ? api.staffResetPassword({
                    id: this.staff.id,
                    principle: this.staff.username
                }) : api.staffResetPin({ id: this.staff.id });
                result.then(json => {
                    if (json.ret >= 0) {
                        this.defaultPassWord[type] = json.data;
                    }
                })
            },
            batchSend() {
                if (this.multipleSelection && this.multipleSelection.length > 0) {
                    let ids = this.multipleSelection.map(data => {
                        return data.id
                    });
                    api.batchSendAccountInfoMail({ids}).then(json => {
                        if (json.ret >= 0) {
                            this.$message({
                                message: this.$t('user.message.send.ok'),
                                type: 'success'
                            });
                            this.$refs['table'].$emit('select', []);
                            this.$refs['table'].clearSelection();
                        }
                    })

                } else {

                }
            },
            tabelSend(id) {
                api.sendAccountInfoMail({id}).then(json => {
                    if (json.ret >= 0) {
                        this.$message({
                            message: this.$t('user.message.send.ok'),
                            type: 'success'
                        });
                    }
                })

            },
        }
    };
</script>

