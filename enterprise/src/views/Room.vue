<style lang="scss">
@import "../assets/scss/layout_lr";

.room {
    height: 100%;
    overflow-y: hidden;
    .el-form-item__label {
        padding-right: 15px;
    }
    .normal_room_ico_docu {
        background-image: url('../assets/img/icon/normal_room.png') !important;
    }
    .vc_room_ico_docu {
        background-image: url('../assets/img/icon/vc_room.png') !important;
    }
    .ico_docu_org {
        background-image: url('../assets/img/icon/org.png') !important;
    }

    .g-bd {
        height: calc(100% - 40px);
    }

    .room-dialog {
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

    .button-group {
        padding-bottom: 20px;
        .el-button {
            min-width: 100px;
        }
    }

    .border-bottom {
        border-bottom: 1px solid #e0e0e0;
        margin-bottom: 23px;
    }
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
</style>

<template>
    <div class="room">
        <div class="g-bd ">
            <!--页面头部-->
            <div class="g-hd">
                <h3>{{$t('room.manage')}}</h3>
                <div class="btn-right">
                    <el-button type="primary" @click="addGroup(false)">
                        <i class="iconfont icon-bumen"></i>
                        {{$t('room.add.group')}}
                    </el-button>
                    <el-button type="primary" @click="addRoom(false)">
                        <i class="iconfont icon-yhuiyishi"></i>
                        {{$t('room.add.room')}}
                    </el-button>
                </div>
            </div>
            <div class="g-lr">
                <div class="left">
                    <!--组织结构-->
                    <yl-tree ref="left-tree" :data="categoryTreeWithRooms" type="ROOM" iconSkinField="innerType" @node-event="onNodeEvent">
                    </yl-tree>
                </div>
                <div class="right">
                    <!--右侧内容-编辑会议室-->
                    <div v-show="flag===0||flag===1">
                        <div class="title border-bottom" v-if="flag===1&&!room.id">
                            {{!room.id?$t('room.add.room'):$t('room.edit.room')}}
                        </div>
                        <el-row>
                            <el-col>
                                <div class="head-img">
                                    <img src="../assets/img/room.png"  v-if="!room.id" alt="">
                                    <img src="../assets/img/vc_room.png" v-if="!!room.id&&room.type==='vc_room'" alt="">
                                    <img src="../assets/img/normal_room.png" v-if="!!room.id&&room.type!=='vc_room'" alt="">
                                </div>
                            </el-col>
                            <el-col class="form-box">
                                <el-form ref="form" :rules="rules" :model="room" label-width="230px">
                                    <el-form-item :label="$t('room.name')" prop="name" required>
                                        <el-input v-model="room.name" :maxlength="128"></el-input>
                                    </el-form-item>
                                    <el-form-item :label="$t('room.group')">
                                        <tree-dropdown :data="categoryTree" v-model="room.categoryId"></tree-dropdown>
                                    </el-form-item>
                                    <el-form-item :label="$t('room.type')" required>
                                        <el-radio-group v-model="room.type">
                                            <el-radio v-for="(item,index) in roomType" v-if="item.label" :key="index" :label="item.label">{{item.text}}</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item :label="$t('room.account')" class="both" v-show="showVcRoom&&flag===0">
                                    </el-form-item>
                                    <el-form-item :label="$t('room.extension')" prop="extension" required v-if="showVcRoom">
                                        <yl-extension ref="yl-extension" v-model="room.extension" @dialog="openDeviceDialog" :fetch-suggestions="querySearchAsync" :placeholder="$t('room.placeholder.extension')" @select="handleSelect"></yl-extension>
                                    </el-form-item>
                                    <el-form-item :label="$t('room.account.name')" v-show="showVcRoom">
                                        <label>{{room.deviceName||'— —'}}</label>
                                    </el-form-item>
                                    <el-form-item label-width="230px" class="form-save-button">
                                        <el-button type="primary" @click="saveRoom" :disabled="isAble">{{$t('common.save')}}</el-button>
                                        <el-button @click="flag=2" v-if="!room.fromTree">{{$t('common.cancel')}}</el-button>
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
                            <div class="button-group">
                                <el-button-group>
                                    <el-button :type="buttonGroupTag===index?'primary':''" :key="index" size="small" v-for="(item,index) in  roomType" @click.native="changeButtonGroup(index)">{{item.text}}
                                    </el-button>
                                </el-button-group>
                            </div>
                            <el-table ref="table" :data="tableData" :default-sort="{prop: 'date', order: 'descending'}" stripe @sort-change="orderByField" :max-height="TABLE_HEIGHT" @selection-change="handleSelectionChange">
                                <div slot="empty">
                                    <table-no-data></table-no-data>
                                </div>
                                <el-table-column type="selection" width="58" align="center"></el-table-column>
                                <el-table-column width="1" align="center" class-name="right-tooltip-cell">
                                    <template scope="scope">
                                        <el-tooltip :class="[scope.row.type===roomType[1].label ? ' tooltip-general' : ' tooltip-video']" effect="dark" :content="getTooltipContent(scope.row.type)" placement="top-start">
                                            <i class="iconfont" :class="[scope.row.type===roomType[1].label ? ' icon-Generalmeeting' : 'icon-Videoconference']"></i>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="name" min-width="150" :label="$t('room.roomName')" show-overflow-tooltip sortable="custom" class-name="right-tooltip-next-cell"></el-table-column>
                                <el-table-column prop="extension" min-width="130" :label="$t('room.extensionName')" sortable="custom"></el-table-column>
                                <el-table-column prop="categoryName" min-width="160" show-overflow-tooltip :label="$t('room.groupName')"></el-table-column>
                                <el-table-column width="135" :label="$t('room.details')">
                                    <template scope="scope">
                                        <yl-popover :title="$t('room.check')">
                                            <el-table slot="table" :data="scope.row.equipDetailList" max-height="240" style="width:650px;" class="device-info">
                                                <el-table-column prop="model" min-width="150" :label="$t('room.device.mode')">
                                                </el-table-column>
                                                <el-table-column prop="version" min-width="150" :label="$t('room.device.soft')">
                                                </el-table-column>
                                                <el-table-column prop="ip"min-width="120" :label="$t('room.device.ip')"></el-table-column>
                                                <el-table-column :label="$t('room.device.static')" min-width="120">
                                                    <template scope="scope">
                                                        <span v-if="scope.row.status==='offline'">{{$t('room.device.offline')}}</span>
                                                        <span class="green" v-if="scope.row.status==='online'">{{$t('room.device.online')}}</span>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </yl-popover>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="$t('common.operate')" width="160" align="center">
                                    <template scope="scope">
                                        <el-button type="text" @click="handleClick(scope.row,'edit')" :title="$t('user.table.title.edit')">
                                            <i class="icon-operation iconfont icon-bianji"></i>
                                        </el-button>
                                        <el-button type="text" @click="handleClick(scope.row,'delete')" :title="$t('user.table.title.delete')">
                                            <i class="icon-operation iconfont icon-shanchu"></i>
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <table-bar :total="total" table="table" @change="getList">
                                <span slot="more">
                                    <el-button type="primary" size="small" @click.native="batchDelete" :disabled="multipleSelection.length===0">
                                        {{$t('common.batchDelete')}}
                                    </el-button>
                                </span>
                            </table-bar>
                        </div>
                    </div>
                </div>
            </div>
            <!--添加分组-->
            <el-dialog :title="!group.id?$t('room.add.group'):$t('room.edit.group')" v-model="dialogGroup" customClass="ed50" size="small" class="room-dialog">
                <el-form label-position="left" ref="addForm" label-width="160px" :model="group" :rules="rules" class="dialog-body" v-if="dialogGroup">
                    <el-form-item :label="$t('room.name')" prop="name" required>
                        <el-input v-model="group.name" :placeholder="$t( 'cloud.placeholder.group')" :maxlength="128"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('room.higher')" prop="parentId" required class="cloud-dialog">
                        <tree-dropdown ref="tree-dropdown-dialog" :data="categoryTree" v-model="group.parentId" :edit-value="group.id"></tree-dropdown>
                    </el-form-item>
                    <el-form-item class="dialog-footer">
                        <el-button type="primary" @click="saveGroup">{{$t('common.ok')}}</el-button>
                        <el-button @click="dialogGroup =false">{{$t('common.cancel')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
        <el-dialog :title=" $t('device.edit.addTitle')" v-model="dialogDevice"  class="cloud-dialog" size="small">
            <el-form ref="e-form" :rules="rulesDevice" :model="device" label-width="120px"  class="dialog-body">
                <el-form-item :label="$t('device.edit.name')" prop="name" required class="b20">
                    <el-input v-model="device.name" :maxlength="128" class="el-form-item-default-color"></el-input>
                </el-form-item>
                <el-form-item :label="$t('device.edit.extension')" prop="extension" required  class="b20">
                    <el-input v-model="device.extension" :maxlength="4"  class="el-form-item-default-color"></el-input>
                </el-form-item>
                <el-form-item :label="$t('device.edit.email')" prop="email"  class="b20">
                    <el-input v-model="device.email" :maxlength="128"  class="el-form-item-default-color"></el-input>
                    <label class="layer">{{$t('device.edit.email.info')}}</label>
                </el-form-item>
            </el-form>
            <div class="dialog-footer">
                <el-button type="primary" @click="saveDevice()">{{$t('device.edit.save')}}</el-button>
                <el-button @click="dialogDevice = false">{{$t('device.edit.cancel')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import YlTree from '@/components/tree'
import YlPopover from '@/components/popover'
import * as api from '../api/room/index'
import PageList from '../services/mixins/pageList'
import TreeDropdown from '@/components/TreeDropdown'
import YlExtension from '../components/extension'
import auth from '@/services/authService'
import { getPagedList,addDevice,sendMail } from '../api/account/device'
import TableNoData from '@/components/common/TableNoData'
import { defaultsDeep } from 'lodash';
export default {
    mixins: [PageList],
    components: {
        YlTree, YlPopover, TreeDropdown, YlExtension, TableNoData
    },
    data() {
        const defaultGroup = {
            name: null,
            id: null,
            parentId: ''
        }
        const roomType = [{ label: null, text: this.$t('room.type.all') }, { label: 'normal_room', text: this.$t('room.type.normal') }, { label: 'vc_room', text: this.$t('room.type.vc') }];

        const defaultRoom = {
            id: null,
            categoryId: '',
            type: roomType[1].label,
            name: '',
            deviceId: null,
            extension: '',
            deviceName: '',
            fromTree: false
        };
        const defaultDevice = {
            id: null,
            name: '',
            extension: '',
            email: ''
        };
        const rulesDevice = {
            name: [
                {required: true, message: this.$t('room.placeholder.name'), trigger: 'blur'},
                {
                    min: 2,
                    max: 128,
                    message: this.$t('common.placeholder.length', {min: 2, max: 128}),
                    trigger: 'blur'
                }
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
                {type: 'email', message: this.$t('user.placeholder.email'), trigger: 'blur'}
            ],
        }
        let { enterprise: { username } } = auth.getEnterprise();
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
            ]
        }
        return {
            title: '',
            rules,
            rulesDevice,
            roomType,
            defaultRoom,
            buttonGroupTag: 0,
            flag: 2,
            total: 0,
            dialogGroup: false,
            dialogDevice: false,
            categoryTree: [],
            mixinHeight: 135,
            device: Object.assign({}, defaultDevice),
            categoryTreeWithRooms: [],
            getTooltipContent(type) {
                return roomType.find(x => {
                    return x.label === type
                }).text;
            },
            username: username,
            group: Object.assign({}, defaultGroup),
            room: Object.assign({}, defaultRoom),
            copyRoom: Object.assign({}, defaultRoom),
            node: {},
            getWhiteSpace(source) {
                let _source = defaultsDeep({}, source);
                for (let [key, value] of Object.entries(_source)) {
                    if (value === undefined || value === null) {
                        _source[key] = '';
                    }
                }
                return _source;
            },
            messageAlert: (res) => {
                const h = this.$createElement;
                const createRow = rows => {
                    return rows.map(row => {
                        return h('p', null, [
                            h('span', null, `${row.label}：`),
                            h('i', null, res[row.value])
                        ])
                    })
                }

                this.$msgbox({
                    title: this.$t('user.message.ok'),
                    message: h('div', { class: 'message-alert' }, [
                        ...createRow([
                            { label: this.$t('user.table.account'), value: 'account' },
                            { label: this.$t('device.name'), value: 'name' },
                            { label: this.$t('user.table.password'), value: 'password' },
                            { label: this.$t('user.table.pin'), value: 'pin' },
                        ])
                    ]),
                    showConfirmButton: !!this.device.email,
                    showCancelButton: true,
                    confirmButtonText: this.$t('user.form.send'),
                    cancelButtonText: this.$t('user.form.ok'),
                    topIcon: 'iconfont icon-chenggongleitishi success mt20',
                    callback: action => {
                        if ("confirm" === action) { //else   cancel
                            this.sendAccountInfoMail();
                        }
                    }
                });
            }
        }
    },
    computed: {
        showVcRoom() {
            return this.room.type !== this.roomType[1].label;
        },
        isAble() {
            return JSON.stringify(this.getWhiteSpace(this.room)) === JSON.stringify(this.getWhiteSpace(this.copyRoom));
        }
    },
    async mounted() {
        await this.exec();
        this.$nextTick(()=>{
            this.$route.query.target && this.addRoom(false);
        });
//     for(let i =0; i<50; i++){
//         api.addRoom({
//             categoryId: "70e30da00d6c4270947911f4fe73ffe1",
//             name:String(Math.random()),
//             type:"normal_room",
//         })
//     }


    },
    created() {

    },
    watch: {
        flag(n, o) {
            /*if (o === 0 && !this.isAble) {
                this.popUpWindow().then(() => {
                    this.saveRoom(false);
                }).catch(() => { });
            }*/
        }
    },
    beforeRouteLeave(to, from, next) {
        if (!this.isAble && this.flag !== 2&&!!this.room.id) {
            this.popUpWindow().then(() => {
                this.saveRoom(false).then(_ => {
                    next();
                })
            }).catch(() => {
                next();
            });
        } else {
            next();
        }
    },
    methods: {
        sendAccountInfoMail(){
            sendMail({ id:  this.device.id }).then(sendJson => {
                if (sendJson.ret >= 0 ) {
                    this.$message({
                        message: this.$t('user.message.send.ok'),
                        type: 'success'
                    })
                }
            })
        },
        openDeviceDialog(){
            this.dialogDevice = true;
            this.$nextTick(_=>{
                this.$refs['e-form'].resetFields();
            });
        },
        saveDevice() {
            this.$refs['e-form'].validate(async (valid) => {
                if (valid) {
                    let { name, extension, email } = this.device;
                    if (!email) email = null
                    let result = await addDevice({ name, email, extension });
                    if (result.ret >= 0) {
                        this.messageAlert(result.data);
                        this.device.id = result.data.id;//为了发送邮件
                        this.dialogDevice = false;
                        this.$refs['yl-extension']&&this.$refs['yl-extension'].handleFocus();
                    }
                } else {
                    return false
                }
            })
        },
        popUpWindow() {
            return this.$confirm(this.$t('popUpWindow.tipContent'), this.$t('popUpWindow.tip'), {
                confirmButtonText: this.$t('popUpWindow.confirm'),
                cancelButtonText: this.$t('popUpWindow.cancel')
            });
        },
        /*分机号处理*/
        handleSelect(item) {
            this.room.deviceId = item.id;
            this.room.deviceName = item.name;
            this.$refs.form.validateField('extension');
        },
        querySearchAsync(queryString, cb) {
            let params = {
                skip: 0,
                limit: 100,
                orderbys: [],
                key: queryString,
                autoCount: true,
                bind: false
            }
            getPagedList(params, false).then(json => {
                let results = json.data.data || [];
                cb(results)
            })
        },
        //程序进来执行逻辑
        async exec() {
            await this.getCategoryTree();
            await this.getCategoryTreeWithRooms();
        },
        getList(assign) {
            if (assign instanceof Object) {
                Object.assign(this.params, assign)
            }
            api.getPagedList(this.params, this.params.skip === 0).then(json => {
                this.tableData = json.data.data || [];
                this.total = json.data.total || 0;
            })
        },
        changeButtonGroup(index) {
            this.buttonGroupTag = index;
            this.resetParams({ type: this.roomType[index].label }, true);
        },
        confirmDelete() {
            return this.$confirm(this.$t('list.delete.room'), this.$t('login.dialog.tit'), {
                confirmButtonText: this.$t('user.table.title.delete'),
                cancelButtonText: this.$t('popUpWindow.cancel')
            })
        },
        //列表的删除与批量删除
        doListDelete(id, fromTree) {
            let ids = [];
            if (id instanceof Array) {
                ids = [...id];
            } else {
                ids.push(id);
            }
            this.confirmDelete().then(() => {
                api.deleteRoom({ ids }).then(json => {
                    if (json.ret >= 0) {
                        this.$message({
                            message: this.$t('common.message.delete.ok'),
                            type: 'success'
                        });
                        this.getList();
                        this.multipleSelection = [];
                        if (!fromTree) this.getCategoryTreeWithRooms();
                        else this.initTreeSelectNode()
                    }
                })
            }).catch(() => { })
        },

        //执行类目删除
        doCategoryDelete(id) {
            this.confirmDeleteTree().then(() => {
                api.deleteRoomCategory({ id }).then(json => {
                    if (json.ret >= 0) {
                        this.$message({
                            message: this.$t('common.message.delete.ok'),
                            type: 'success'
                        });
                        if(this.node&&this.node.type==='CATEGORY')  this.node =null;
                        delete this.params.categoryId;
                        this.getList();
                        this.getCategoryTree();
                        this.initTreeSelectNode();
                    }
                })
            }).catch(() => { })
        },
        //删除树目录或者树子节点，默认选中第一个
        initTreeSelectNode() {
            this.flag = 2;
            this.$refs["left-tree"].deleteNodes();
            this.$refs["left-tree"].selectNode(this.categoryTreeWithRooms.find(x => x.parentId === null).id);
        },
        //获取类目树
        getCategoryTree(tree) {
           return api.getCategoryTree().then(json => {
                this.categoryTree = json.data || [];
                if(!tree&&this.categoryTree.length>0) this.title = this.categoryTree[0].name;
            })
        },

        //获取类目树（带人）
        getCategoryTreeWithRooms() {
            return api.getCategoryTreeWithRooms().then(json => {
                this.categoryTreeWithRooms = Object.freeze(json.data || []);
            })
        },

        //获取Room
        getRoom(id, fromTree) {
            api.getRoom({ id }, false).then(json => {
                this.flag = 1;
                this.room = json.data;
                if (fromTree) this.room.fromTree = fromTree;
                this.copyRoom = defaultsDeep({}, this.room);
                this.tagPassword = !!this.room.password;
                this.$refs['form'].resetFields();
            })
        },
        //处理点击组织树的逻辑
        async onNodeEvent(event, node, targetNode) {
            this.node = node;
            switch (event) {
                case 'prev':
                case 'next':
                    if (targetNode === null || node.parentId !== targetNode.parentId) return
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
                        this.getRoom(node.id, true);
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
                let parentId = (this.node&&this.node.type=== "CATEGORY"&&this.node.id)|| (this.categoryTree.length > 0 ? this.categoryTree[0].id : null);
                this.group = Object.assign({}, this.defaultGroup, { parentId });
            }
            this.dialogGroup = true;
        },
        //添加会议室
        addRoom(room) {
            this.$refs.form.resetFields();
            this.flag = 1;
            if (room instanceof Object) {
                this.room = Object.assign({}, room);
                this.copyRoom = defaultsDeep({}, this.room);
            } else {
                this.room = Object.assign({}, this.defaultRoom);
                this.room.categoryId = this.params.categoryId || (this.categoryTree.length > 0 ? this.categoryTree[0].id : null);
                this.copyRoom = defaultsDeep({}, this.room);
            }
//            this.$refs["left-tree"].cancelSelectedNode();
        },
        //保存分组
        saveGroup() {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    let { name, parentId, id } = this.group;
                    let res = !id ? api.addRoomCategory({ name, parentId }) : api.editRoomCategory({ name, parentId, id });
                    res.then(json => {
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
//                                    this.$refs["left-tree"].moveNode(parentId, this.groupMoveNodeId, "inner");
//                                }
//                                this.$refs["left-tree"].updateNode(this.group.id,false,{name:this.group.name});
                                this.title = this.group.name;
                                this.getCategoryTree(true);
                                this.getCategoryTreeWithRooms();
                                this.getList();
                            }
                            this.dialogGroup = false;
                        }
                    })
                } else {
                    return false
                }
            })
        },
        //保存会议室
        saveRoom() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let { id, categoryId, name, type, deviceId, fromTree } = this.room;
                    let params = { id, categoryId, name, type, deviceId };
                    let res = !id ? api.addRoom(params) : api.editRoom(params);
                    res.then(json => {
                        if (json.ret === 0) {
                            this.changeButtonGroup(0);
                            delete this.params.categoryId;
                            if(this.categoryTree.length>0) this.title = this.categoryTree[0].name;
                            this.getList({skip:0});
                            if (!!id && fromTree) {
                                /* 不刷新页面直接update,NODE,重新取数是为了获取拼音，这块后续改成成前端处理拼音 */
                                api.getRoom({ id }, false).then(json => {
                                    let { name, namePinyin, categoryId, namePinyinAlia } = json.data;
                                    if (this.node.parentId !== categoryId) {
                                        this.$refs["left-tree"].moveNode(categoryId, this.node.id, "inner")
                                    }
                                    this.node.name = name;
                                    this.node.namePinyin = namePinyin;
                                    this.node.parentId = categoryId;
                                    this.node.namePinyinAlia = namePinyinAlia;
                                    this.node.iconSkin = type;
                                    this.$refs["left-tree"].updateNode(this.node);
                                    this.copyRoom = defaultsDeep({},this.room);
                                })
                            } else {
                                this.getCategoryTreeWithRooms();
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
        //表格中点击触发事件
        handleClick(row, type) {
            if (type === 'edit') this.getRoom(row.id);
            else if (type === 'delete') {
                this.doListDelete(row.id);
            }
        }
    }
};
</script>

