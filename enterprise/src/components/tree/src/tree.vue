<style lang="scss">
@import './css/metroStyle/metroStyle.css';
.ztree {
    display: inline-block;
    min-width: 100%;
}
.yl-tree {
    background-color: #ffffff;
    display: block;
    position: relative;
    height: 100%;
    width: 100%;
    .tree-top {
        width: 100%;
        .edit-bar {
            text-align: right;
            height: 39px;
            line-height: 39px;
            border-bottom: 1px solid #e6e6e6;
            padding: 0 10px;
            .title {
                float: left;
                font-size: 14px;
                font-weight: bold;
            }
            .el-button {
                .icon {
                    font-size: 18px;
                }
            }
        }
        .search-bar {
            padding: 10px;
            .search {
                overflow-y: auto;
                position: absolute;
                width: 93%;
                background-color: #fff;
                border: 1px solid #ccc;
                z-index: 100;
                border-radius: 3px;
                margin-top: 1px;
            }
        }
    }
    .tree-down {
        overflow: hidden;
        height: calc(100% - 96px);
        .tree-box {
            padding: 0px;
            height: 100%;
            overflow: auto;
        }
        .empty-filter {
            font-size: 18px;
            text-align: left;
            padding-left: 10px;
            width: 90%;
            a {
                color: #38bcff;
                cursor: pointer;
            }
        }
    }
}

.search {
    max-height: 50%;
    overflow: hidden;
    ul {
        margin: 0;
        padding: 0;
        max-height: 100%;
        li {
            padding: 0 0 0 10px;
            margin: 0;
            list-style: none;
            line-height: 36px;
            height: 36px;
            text-align: left;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            position: relative;
            background-size: 25px 25px;
            .ico_docu_org {
                background-image: url('./icon/org.png');
            }
            span {
                line-height: 0;
                margin: 6px 8px 6px 0;
                padding: 0;
                width: 24px;
                height: 24px;
                display: inline-block;
                vertical-align: middle;
                border: 0 none;
                cursor: pointer;
                outline: none;
                background-position-x: 0px!important;
                padding-left: 0px !important;
            }
        }
        li:hover {
            background-color: #deedfc;
            .delete {
                color: red;
            }
        }
    }
    .ztree li span.button.center_docu{
        width: 22px!important;
    }
}
    .el-dropdown-menu{
        min-width: 60px;
    }
    .icon-big-size{
        font-size: 20px;
    }
    .default-color{
        color: #38bcff;
    }
    .is-disabled  .default-color{
        color: #bfcad9;
    }
</style>

<template>
    <div class="yl-tree">
        <div class="tree-top">
            <div class="edit-bar" v-if="edit">
                <div class="title">
                    {{$t('common.tree.title')}}
                </div>

                <el-dropdown @command="handleCommand" :hide-on-click="false">
                      <span class="el-dropdown-link">
                         <i class="el-icon-caret-bottom el-icon-more icon-big-size"></i>
                      </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="prev" :disabled="store.disabledPrev" ><i class="icon iconfont icon-shangyi default-color"></i> {{$t('tree.title.prev')}}</el-dropdown-item>
                        <el-dropdown-item command="next" :disabled="store.disabledNext"><i class="icon iconfont icon-xiayi default-color"></i> {{$t('tree.title.next')}}</el-dropdown-item>
                        <el-dropdown-item command="edit" :disabled="store.disabledEdit"><i class="icon iconfont icon-bianji default-color"></i> {{$t('tree.title.edit')}}</el-dropdown-item>
                        <el-dropdown-item command="delete" :disabled="store.disabledDelete" ><i class="icon iconfont icon-shanchu default-color"></i> {{$t('tree.title.delete')}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
           <!--     <el-button type="text" @click="setPrevNode" :disabled="store.disabledPrev" :title="$t('tree.title.prev')">
                    <i class="icon iconfont icon-shangyi"></i>
                </el-button>
                <el-button type="text" @click="setNextNode" :disabled="store.disabledNext" :title="$t('tree.title.next')">
                    <i class="icon iconfont icon-xiayi"></i>
                </el-button>
                <el-button type="text" @click="onNodeEdit" :disabled="store.disabledEdit" :title="$t('tree.title.edit')">
                    <i class="icon iconfont icon-bianji"></i>
                </el-button>
                <el-button type="text" @click="onNodeDelete" :disabled="store.disabledDelete" :title="$t('tree.title.delete')">
                    <i class="icon iconfont icon-shanchu"></i>
                </el-button>-->
            </div>
            <div class="search-bar data-infinite-wrapper" v-show="showSearch">
                <el-input :placeholder="$t('common.placeholder.default')" v-model="searchValue" icon="search" @blur="onSearchBlur" :maxlength="128"></el-input>
                <div class="search " v-show="searchValue&&filterNodes.length>0" infinite-wrapper>
                    <ul>
                        <li v-for="item in  option" :key="item.id" @click="searchClick(item)" :title="item.name">
                            <span :class="[item.type===type?(item[iconSkinField]+'_ico_docu'):'ico_docu_org']"></span> {{item.name}}
                        </li>
                    </ul>
                    <infinite-loading :on-infinite="onInfinite" v-show="option.length>=200" ref="ztreeinfiniteLoading">
                        <div slot="no-more"></div>
                    </infinite-loading>
                </div>
            </div>
        </div>
        <div class="tree-down">
            <div class="tree-box el-tree__empty-block" v-if="emptyFilter&&searchValue">
                <p class="empty-filter">
                    {{$t('tree.notFound.msg',{displayText:searchValue})}}
                    <a @click="searchValue =''">{{$t('tree.empty.back')}}</a>
                </p>
            </div>
            <div class="tree-box" v-if="data&&data.length!==0" v-loading="loading">
                <ul :id="id" class="ztree">
                </ul>
            </div>
            <div class="el-tree__empty-block" v-if="!data||data.length===0">
                <span class="el-tree__empty-text">{{ emptyText }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import TreeStore from './model/tree-store';
import _ from 'lodash';

const DEBOUNCE_COUNT = 5000;//启用优化的条数 default:5000
const DEBOUNCE_TIME = 500; //延迟时间 default:500

import InfiniteLoading from 'vue-infinite-loading';
const PAGE = 200;

export default {
    name: 'YlTree',
    componentName: 'YlTree',
    components: {
        InfiniteLoading
    },
    data() {
        return {
            store: null,
            currentNode: null,
            loading: false,
            disabledPrev: true,
            disabledNext: true,
            emptyFilter: false,
            filtering: false,
            searchValue: '',
            filterNodes: [],
            option: [],
            page: 0
        };
    },
    props: {
        data: {
            type: Array,
            default() {
                return [];
            }
        },
        ownProperty: {//todo 返回格式是否按照传入时候的格式
            type: Boolean,
            default: true
        },
        id: {
            type: String,
            default() {
                return 'tree-default' + Math.ceil(Math.random() * 100000);
            }
        },
        setting: {
            type: Object,
            default() {
                return {};
            }
        },
        defaultCheckedKeys: Array,
        checkedKeys: Array,
        edit: {
            type: Boolean,
            default: true
        },
        emptyText: {
            type: String,
            default() {
                return this.$t('el.tree.emptyText');
            }
        },
        defaultExpandAll: Boolean,
        autoExpandParent: {
            type: Boolean,
            default: true
        },
        showCheckbox: {
            type: Boolean,
            default: false
        },
        showTitle: {
            type: Boolean,
            default: true
        },
        showSearch: {
            type: Boolean,
            default: true
        },
        showIcon: {
            type: Boolean,
            default: true
        },
        type: {
            type: String,
            default: 'STAFF'
        },
        iconSkinField: {
            type: String
        },
        title: {
            type: String,
            default: 'common.tree.title'
        },
        currentNodeKey: [String, Number],
        filterNodeKey: {
            type: Array,
            default() {
                return ['name', 'namePinyin','namePinyinAlia'];
            }
        },
        props: {
            type: Object,
            default() {
                return {
                    name: 'name',
                    id: 'id',
                    pId: 'parentId',
                    sk: ['name', ''],
                };
            }
        }
    },
    computed: {
        isDebounce() {
            return this.data && this.data.length > DEBOUNCE_COUNT;
        }
    },
    watch: {
        searchValue(newVal) {
            if (newVal == null) return;
            this.store.currentNode = null;
            this.loading = true;
            this.page = 0;
            this.option = [];
            this.isDebounce ? this.filterDebounce(newVal, this) : this.filter(newVal);
        },
        defaultCheckedKeys(newVal) {
            this.store.defaultCheckedKeys = newVal;
            this.store.setDefaultCheckedKeys(newVal);
        },
        checkedKeys(newVal) {
            /* this.store.checkedKeys = newVal;
             this.store.setCheckedKeys(newVal, false);*/
        },
        defaultExpandedKeys(newVal) {
            this.store.defaultExpandedKeys = newVal;
            this.store.setDefaultExpandedKeys(newVal);
        },
        currentNodeKey(newVal) {
            this.store.setCurrentNodeKey(newVal);
            this.store.currentNodeKey = newVal;
        },
        data(newVal) {
            if (newVal && newVal.length > 0)
                this.store.init(newVal);
        }
    },
    methods: {
        handleCommand(e) {
            if (e === 'prev') {
                this.setPrevNode();
            }
            else if (e === 'next') {
                this.setNextNode();
            }
            else if (e === 'edit') {
                this.onNodeEdit();
            } else {
                this.onNodeDelete();
            }
        },
        onSearchBlur() {
            setTimeout(() => {
                this.searchValue = '';
            }, 150);
        },
        searchClick(node) {
            if(node.checked) return;
            this.selectNode(node);
            this.checkNode(node, !node.checked , true, false);
            this.searchValue = '';
            this.$emit('node-event', 'check', node, {});
            this.store.setEditNode();
        },
        expandAll(t) {
            this.store.expandAll(t);
        },
        setPrevNode() {
            this.store.setEditNode();
            this.$emit('node-prev', this.store.currentNode, this.store.preNode);
            this.$emit('node-event', 'prev', this.store.currentNode, this.store.preNode);
        },
        setNextNode() {
            this.store.setEditNode();
            this.$emit('node-next', this.store.currentNode, this.store.nextNode);
            this.$emit('node-event', 'next', this.store.currentNode, this.store.nextNode);
        },
        transformToArray(node) {
            return this.store.transformToArray(node);
        },
        onNodeDelete() {
            this.store.setEditNode();
            this.$emit('node-delete', this.store.currentNode);
            this.$emit('node-event', 'delete', this.store.currentNode, {});
        },
        onNodeEdit() {
            this.store.setEditNode();
            this.$emit('node-edit', this.store.currentNode);
            this.$emit('node-event', 'edit', this.store.currentNode, {});
        },
        getCheckedNodes(leafOnly = 0, checked = true) {
            return this.store.getCheckedNodes(checked, leafOnly);
        },
        getCheckedKeys(leafOnly = 0, checked = true) {
            return this.store.getCheckedKeys(checked, leafOnly);
        },
        getCheckedValues(leafOnly = 0, checked = true) {
            return this.store.getCheckedValues(checked, leafOnly);
        },
        addNodes(newNodes) {
            let { id, parentId, name, isParent } = newNodes;
            return this.store.addNodes({ id, parentId, name, isParent });
        },
        deleteNodes() {
            this.store.setDeleteNode();
        },
        setPrevNextNodes(type) {
            type === 'prev' ? this.store.setPrevNode() : this.store.setNextNode();
        },
        setShowNodes(nodes) {
            this.store.setShowNodes(nodes);
        },
        setHideNodes(nodes) {
            this.store.setHideNodes(nodes);
        },
        setShowNodesKeys(keys) {
            this.store.setShowNodesKeys(keys);
        },
        setHideNodesKeys(keys) {
            this.store.setHideNodesKeys(keys);
        },
        getAllShowNodes(leafOnly = true) {
            return this.store.getAllShowNodes(leafOnly);
        },
        getAllNodes(leafOnly = true) {
            return this.store.getAllNodes(leafOnly);
        },
        setCheckedKeys(newVal, isEmit = true) {
            this.store.isEmit = isEmit;
            this.store.checkedKeys = newVal;
            this.store.setCheckedKeys(newVal, false);
            this.store.isEmit = true;
        },
        updateNode(treeNode, checkTypeFlag,newNode) {
            this.store.updateNode(treeNode, checkTypeFlag,newNode);
        },
        moveNode(targetNode, treeNode, moveType, isSilent) {
            this.store.moveNode(targetNode, treeNode, moveType, isSilent);
        },
        cancelSelectedNode() {
            this.store.cancelSelectedNode();
        },
        selectNode(node) {
            this.store.selectNode(node);
        },
        selectParentNode(node) {
            this.store.selectParentNode(node);
        },
        checkNodeIds(ids, checked, checkTypeFlag, callbackFlag) {
            this.store.checkNodeIds(ids, checked, checkTypeFlag, callbackFlag);
        },
        checkNodeId(id, checked, checkTypeFlag, callbackFlag) {
            this.store.checkNodeId(id, checked, checkTypeFlag, callbackFlag);
        },
        checkAllNodes(checked) {
            this.store.checkAllNodes(checked);
        },
        checkNode(node, checked, checkTypeFlag, callbackFlag) {
            this.store.checkNode(node, checked, checkTypeFlag, callbackFlag);
        },
        checkNodes(nodes, checked, checkTypeFlag, callbackFlag) {
            this.store.checkNodes(nodes, checked, checkTypeFlag, callbackFlag);
        },
        unCheckedNodes(node) {
            this.store.unCheckedNodes(node);
        },
        refresh() {
            //不建议用
            this.store.refresh();
        },
        onCheck(event, treeId, treeNode) {
            this.$emit('node-check', treeNode.id, treeNode, treeNode.checked, treeId);
            this.$emit('node-event', 'check', treeNode, {});
        },
        onClick(event, treeId, treeNode) {
            this.$emit('node-click', treeNode.id, treeNode, treeId);
            this.$emit('node-event', 'click', treeNode, {});
        },
        filter(key) {
            this.$refs['ztreeinfiniteLoading'].$emit('$InfiniteLoading:reset');
            this.filterNodes = this.store.getNodesByFilter(this._filterFun) || [];
            this.emptyFilter = this.filterNodes.length === 0;
            this.option = [...this.filterNodes.slice(this.page, this.page += PAGE)];
            this.loading = false;
        },
        /*性能优化*/
        filterDebounce: _.debounce(
            (key, vm) => {
                vm.$refs['ztreeinfiniteLoading'].$emit('$InfiniteLoading:reset');
                vm.filterNodes = vm.store.getNodesByFilter(vm._filterFun) || [];
                vm.emptyFilter = vm.filterNodes.length === 0;
                vm.option = [...vm.filterNodes.slice(vm.page, vm.page += PAGE)];
                vm.loading = false;
            }, DEBOUNCE_TIME
        ),
        _filterFun(node) {
            let _exits = false;
            this.filterNodeKey.forEach(key => {
                if (node[key]&&node[key].includes(this.searchValue)) _exits = true;
            });
            return _exits;
            /* if (this.filterNodeKey && this.filterNodeKey.length > 0) {
                 return node.name.includes(this.searchValue) || node.namePinyin.includes(this.searchValue)
                // return !node.checked && (node.name.includes(this.searchValue) || node.namePinyin.includes(this.searchValue) )
             } else {
                 return node[this.props.name].includes(this.searchValue)
                 // return !node.checked && node[this.props.name].includes(this.searchValue)
             }*/
        },
        onInfinite() {
            setTimeout(() => {
                this.option = this.option.concat(this.filterNodes.slice(this.page, this.page += PAGE));
                this.$refs['ztreeinfiniteLoading'].$emit('$InfiniteLoading:loaded');
                if (this.option.length >= this.filterNodes.length) {
                    this.$refs['ztreeinfiniteLoading'].$emit('$InfiniteLoading:complete');
                }
            }, 150);
        }
    },
    mounted() {

    },
    created() {
        this.store = new TreeStore({
            id: this.id,
            data: this.data,
            setting: this.setting,
            props: this.props,
            ownProperty: this.ownProperty,
            currentNodeKey: this.currentNodeKey,
            defaultCheckedKeys: this.defaultCheckedKeys,
            checkedKeys: this.checkedKeys,
            defaultExpandedKeys: this.defaultExpandedKeys,
            autoExpandParent: this.autoExpandParent,
            defaultExpandAll: this.defaultExpandAll,
            showCheckbox: this.showCheckbox,
            showIcon: this.showIcon,
            type: this.type,
            edit:this.edit,
            iconSkinField: this.iconSkinField,
            onCheck: this.onCheck,
            onClick: this.onClick,
            disabledPrev: this.disabledPrev,
            disabledNext: this.disabledNext,
            filterNodeMethod: this.filterNodeMethod
        });
    },
    beforeDestroy() {
        let tree = this.store._getTreeObject();
        tree && tree.destroy(this.id);
    }
};
</script>
