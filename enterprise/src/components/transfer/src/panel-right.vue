<style lang="scss" scoped>
.el-transfer-panel__header {
    line-height: 45px;
    height: 45px;
    .el-button {
        line-height: 45px;
        height: 45px;
        float: right;
        margin-right: 15px;
        padding: 0;
    }
}

.el-transfer-panel__empty {
    text-align: center;
    padding-top: 25px;
}
</style>
<style lang="scss">
.ul-box {
    max-height: calc(100% - 45px);
    ul {
        margin: 0;
        padding: 0;
        max-height: 100%;
        min-height: 100%;
        overflow: auto;
        li {
            padding: 0 25px 0 50px;
            margin: 0;
            list-style: none;
            line-height: 36px;
            height: 36px;
            text-align: left;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            position: relative;
            background: url("./user.png") no-repeat 15px center;
            background-size: 25px 25px;

            .icon {
                padding: 8px 0;
                float: left;
                img {
                    padding: 0 15px 0 0;
                    float: left;
                    width: 20px;
                    height: 20px;
                }
            }
            .delete {
                cursor: pointer;
                padding-right: 15px;
                right: 0px;
                position: absolute;
                color: #ddd;
                display: none
            }
        }
        li:hover {
            background-color: #deedfc;
            .delete {
                color: red;
              display: inline-block
            }
        }
    }
}
</style>
<template>
    <div class="el-transfer-panel">
        <p class="el-transfer-panel__header">
            {{ $t('transfer.now') }} {{ rightChecked.length }}
            <el-button type="text" @click="clearAll">{{ $t('transfer.clear') }}</el-button>
        </p>
        <div class="el-transfer-panel__body ul-box data-infinite-wrapper">
            <ul v-if="rightChecked.length > 0"  infinite-wrapper style="overflow-y: auto">
                <li v-for="(item,index) in option" :key="item.id" :class="[iconSkinField]" :title="item.name">
                    {{item.name}}
                    <i class="delete iconfont icon-jianqu" v-if="!item.chkDisabled" @click="deleteChange(item,index)"></i>
                </li>
                <infinite-loading v-if="rightChecked.length > 0" v-show="rightChecked.length > PAGE" :on-infinite="onInfinite" ref="infiniteLoading">
                    <div slot="no-more"></div>
                </infinite-loading>
            </ul>
            <div class="el-tree__empty-block" v-if="rightChecked.length === 0">
                <span class="el-tree__empty-text">{{ $t('el.tree.emptyText') }}</span>
            </div>
        </div>
    </div>
</template>

<script>

import InfiniteLoading from 'vue-infinite-loading';

const PAGE = 200;
export default {
    name: 'YLTransferPanelRight',
    componentName: 'YLTransferPanelRight',
    components: {
        InfiniteLoading
    },
    props: ["rightChecked","iconSkinField"],

    data() {
        return {
            option: [],
            page: 0,
            PAGE
        }
    },

    watch: {
        rightChecked(val) {
            this.page = 0;
            this.option = this.rightChecked.slice(this.page, this.page += PAGE)
        }
    },
    computed: {
        getOption() {
            return this.rightChecked
        }
    },
    mounted() {

    },
    methods: {
        onInfinite() {
            setTimeout(() => {
                this.option = this.option.concat(this.rightChecked.slice(this.page, this.page += PAGE));
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                if (this.option.length >= this.rightChecked.length) {
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                }
            }, 150)
        },
        deleteChange(node, index) {
            this.$emit('checked-change', node, index);
            this.rightChecked.splice(index, 1);
            this.option.splice(index, 1);
        },
        clearAll() {
            this.$emit('checked-change', null);
            this.rightChecked.splice(0, this.rightChecked.length);
            this.option = [];
        }
    }
};
</script>
