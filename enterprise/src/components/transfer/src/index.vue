<style lang="scss">
    .ztree li span.button.center_docu {
        background-position: -584px -23px;
        width: 22px;
    }

    .ztree li span.button.bottom_docu {
        background-position: -84px -42px;
        width: 22px;
    }

    .el-transfer {
        text-align: center;
        .ztree li a.curSelectedNode {
            background-color: #ffffff;
        }
        .el-transfer__buttons i {
            font-size: 36px;
            color: #e4e4e4;
        }
        .tree-down {
            height: calc(100% - 60px);
        }
        .ico_docu {
            background-image: url('./user.png') !important;
            background-position-x: 7px;
        }
    }

    .el-transfer-panel {
        width: 44%;
        max-width: 285px;
        height: 435px;
        text-align: left;
    }

    .el-transfer-panel__body {
        height: 100%;
        padding-bottom: 0 !important;
    }

    .el-transfer-panel__list.is-filterable {
        height: calc(100% - 96px)
    }

    @media screen and (max-width: 1366px) {
        .el-transfer-panel {
            height: 385px;
        }
    }
</style>
<template>
    <div class="el-transfer">
        <div class="el-transfer-panel">
            <div class="el-transfer-panel__body">
                <yl-tree :filterNodeKey="filterNodeKey" ref="panel-tree" :data="data" :edit="false" show-checkbox :type="type"
                         @node-event="onTreeCheckedChange" :checkedKeys="selectValue" :iconSkinField="iconSkinField">
                </yl-tree>
            </div>
        </div>
        <div class="el-transfer__buttons">
            <i class="el-icon-arrow-right"></i>
        </div>
        <panel-right :right-checked="checked" @checked-change="onTargetCheckedChange" :iconSkinField="iconSkinField">
        </panel-right>
    </div>
</template>

<script>
    import YlTree from '@/components/tree';
    import PanelRight from './panel-right.vue';


    export default {
        name: 'YlTransfer',

        components: {
            YlTree,
            PanelRight
        },

        props: ["data", "value", "type", "iconSkinField", "filterNodeKey"],

        data() {
            return {
                checked: [],
                selectValue: this.value
            };
        },

        computed: {},

        watch: {
            value(val) {
                this.selectValue = val;
               /* if (val && val.length > 0) {
                    this.checked = this.data.filter(x => {
                        return val.indexOf(x.id) >= 0
                    });
                } else {
                    this.checked = [];
                }*/
            },
            selectValue(val) {
                this.$emit('input', val);
            }
        },

        mounted() {

        },

        methods: {
            deleteUpdateValue(index, id) {
                this.checked = this.checked.filter(x => x.id !== id);
                this.$refs["panel-tree"].setCheckedKeys( this.checked.map(x=>x.id), false);
            },
            onTreeCheckedChange(even, node, checked) {
                //// ===================== 未排序 =====================
                /*    let nodes = this.$refs["panel-tree"].getCheckedNodes(true, 1);
                   this.checked = nodes;
                   this.selectValue = nodes.map(n => n.id)  */
                //// =====================  未排序 =====================

                //// ===================== 右侧排序待优化 =====================
                if (even === 'click' && node.type !== "STAFF") return;
                let nodes = this.$refs["panel-tree"].transformToArray(node)
                if (node.checked) {
                    nodes.forEach((node) => {
                        node.type == "STAFF" && this.checked.push(node)
                    });
                } else {
                    for (let i = 0; i < nodes.length; i++) {
                        if (nodes[i].type === "STAFF")
                            for (let j = 0; j < this.checked.length; j++) {
                                if (this.checked[j].id === nodes[i].id) {
                                    this.checked.splice(j, 1);
                                    break;
                                }
                            }
                    }
                }
                this.selectValue = this.checked.map(n => n.id)
                //// ===================== 右侧排序 =====================
                this.$emit('on-change-left', node, nodes);
            },
            setCheckedKeys(newVal, isEmit = true) {
                this.checked = [];
                this.$refs["panel-tree"].setCheckedKeys(newVal, isEmit);
                if(newVal){
                    newVal.forEach(id=>{
                        let node =  this.data.find(x=>x.id===id);
                        if (node) this.checked.push(node);
                    })
                }

//                this.checked = this.data.filter(x => {
//                    return newVal.indexOf(x.id) >= 0
//                });
            },
            onTargetCheckedChange(node, index) {
                if (node === null) {
                    this.$refs["panel-tree"].checkAllNodes(false);
                    this.selectValue = [];
                } else {
                    this.$refs["panel-tree"].checkNodeId(node.id, false, true, false);
                    this.selectValue.splice(index, 1);
//                    this.selectValue.splice(this.selectValue.indexOf(node.id), 1);
                }
                this.$emit('on-change-right', node);
            },
            //获取当前选中的对象集合
            getChecked() {
                return this.checked;
            }
        }
    };
</script>
