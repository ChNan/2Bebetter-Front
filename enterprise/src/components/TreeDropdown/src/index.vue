<style lang="scss">
    .yl-select {
        max-width: 0;
        .tree-box {
            padding: 0 !important;
            overflow: hidden !important;
            .ico_docu {
                display: none !important;
            }
        }
        .el-select-dropdown__list {
            padding-top: 0;
        }
        .el-select-dropdown__item.selected.hover {
            background-color: #ffffff;
        }
        .el-scrollbar__wrap {
            max-height: 300px;
        }
        .el-select-dropdown__item {
            height: 100%;
            max-height: 280px;
            line-height: 100%;
            background-color: #ffffff;
            overflow: auto;
        }
        .el-scrollbar__bar, .is-vertical {
            display: none;
        }
    }
</style>

<template>
    <el-select ref="yl-select" popper-class="yl-select" :value="selectText" placeholder="请选择" :disabled="disabled"
               @visible-change="visibleChange">
        <el-option disabled value="" label="">
            <yl-tree :ref="ref" :setting=" {view: {fontCss: _getFont}}" :data="orgTreeSource"
                     @node-click="selectNodeClick"
                     @node-check="selectNodeClick" :show-search="false" defaultExpandAll
                     :edit="false" :showCheckbox="false" :showIcon="false">
            </yl-tree>
        </el-option>
    </el-select>
</template>


<script>
    import YlTree from '@/components/tree'

    const STYLE = {'color': '#ccc', 'background-color': '#fff!important', 'cursor': 'not-allowed'}
    export default {
        name: 'TreeDropdown',
        components: {
            YlTree
        },
        data() {
            return {
                selectValue: this.value,
                timer: null,
                disabled: false,
                scrollTop: 0,
                ref: 'select-tree' ///+ Math.ceil(Math.random() * 100000)
            }
        },
        props: ['data', 'value', 'editValue'],
        computed: {
            orgTreeSource() {
                this.disabled = false
                if (!this.data || this.data.length === 0) return []
                return this.data.map(d => {
                    if (this.editValue && ( d.id === this.editValue || d.parentId === this.editValue)) {
                        d.font = Object.assign({}, STYLE)
                        if (this.editValue && !d.parentId) {
                            this.disabled = true
                        }
                    } else {
                        d.font = null
                    }
                    return d
                })
            },
            selectText() {
                let _item = this.data.find(x => x.id === this.selectValue)
                this.selectNode()
                return _item && _item.name
            }
        },
        watch: {
            value(val) {
                this.selectValue = val;
            },
            selectValue(val) {
                this.$emit('input', val);
            }
        },
        methods: {
            visibleChange(t) {
                this.$nextTick(_ => {
                    $('.el-select-dropdown__item').scrollTop(this.scrollTop);
                })
                t && this.$refs[this.ref].expandAll(true)
            },
            selectNodeClick(id, node) {
                if (!node.font || !this.editValue) {
                    this.$refs["yl-select"].toggleMenu();
                    this.selectValue = node.id
                }
            },
            selectNode() {
                setTimeout(_ => {
                    if (this.selectText) this.$refs[this.ref].selectNode(this.selectValue);
                }, 500)
            },
            moveNode(parentId, id) {
                this.$nextTick(_ => {
                    this.$refs[this.ref].moveNode(parentId, id, "inner");
                })
            },
            _getFont(treeId, node) {
//                return node.font? node.font : {};
                return (this.editValue && node.font) ? node.font : {};
            }
        },
        mounted() {
            $('.el-select-dropdown__item').on('scroll', e => {
                this.scrollTop = e.currentTarget.scrollTop
            });
        },
        beforeDestroy() {
            clearTimeout(this.timer)
        }
    }


</script>
