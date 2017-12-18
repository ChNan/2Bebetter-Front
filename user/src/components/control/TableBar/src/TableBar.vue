<template>
    <el-row :gutter="20" class="table-bar">
        <el-col :span="10" class="col yl-inline">
            <!--<el-checkbox @change="notify" :checked="checked" v-model="checked" v-show="showCheck">-->
                <!--{{$t('common.selectAll')}}-->
            <!--</el-checkbox>-->
            <slot name="more"></slot>
        </el-col>
        <el-col :span="14">
            <el-pagination v-show="total>PAGINATION" @size-change="handleSizeChange"
                           @current-change="handleCurrentChange" :current-page="currentPage"
                           :page-sizes="[10, 20, 50, 100]" :page-size="currentSize" class="table-bar-pagination"
                           layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-col>
    </el-row>
</template>
<script>
    /*
     * @table = 对应绑定表格的ref名称（必须）
     * @total = 数据的总页数（必须）
     * @change = 当切换页码，分页触发事件，返回翻页信息和当前是否全选（正常必须）
     * @checkbox = 是否显示checkbox（选填）
     * @check = 当全选触发事件，返回当前是否全选
     * eg: 按需引入、全部不需要引入
     * import  TableBar from '@/components/common/TableBar'
     * components: {TableBar}
     * <table-bar :total="total" :table="$refs.myTable" @change="getData"></table-bar>
     * */
    export default {
        name: 'TableBar',
        props: ['table', 'checkbox', 'total'],
        data() {
            /*
            * 默认小于10条隐藏分页组件*/
            const PAGINATION = 0;
            return {
                PAGINATION,
                checked: false,
                currentSize: Number.parseInt(localStorage.getItem('currentSize') || 10),
                currentPage: 1
            }
        },
        computed: {
            showCheck() {
                return this.checkbox !== false;
            }
        },
        mounted() {
            this.$nextTick(_ => {
                this.$vnode.context.$refs[this.table].$on('select-all', s => {
                    this.checked = !(s.length === 0)
                })
            });
            this.$nextTick(_ => {
                this.$vnode.context.$refs[this.table].$on('select', s => {
                    this.checked = ( s.length === this.total)
                })
            });
        },
        methods: {
            handleSizeChange(val) {
                this.currentSize = val;
                localStorage.setItem('currentSize', val)
                this.emitChange();
            },
            notify() {
                this.$vnode.context.$refs[this.table].store.commit('toggleAllSelection');
                this.$emit('check', this.checked);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.emitChange();
            },
            emitChange() {
                let params = {}
                params.skip = (this.currentPage - 1) * this.currentSize;
                params.limit = this.currentSize;
                this.$emit('change', params, this.checked);
            }
        }
    }
</script>
<style lang="scss">
    .table-bar {
        /*border: solid 1px #e6e6e6;*/
        border-top: 0px;
        padding: 16px 0 0px 0;
        margin-left: 0px !important;
        margin-right: 0px !important;
        .el-checkbox {
            padding-top: 7px;
        }
        .col{
            min-height: 1px;
        }
    }
    .yl-inline div{
        display: inline;
    }
    .table-bar-pagination {
        text-align: right;
    }

    .el-pagination__editor {
        width: 45px !important;
    }

    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background: #fff !important;
        border-color: #bfcbd9 !important;
    }

</style>
