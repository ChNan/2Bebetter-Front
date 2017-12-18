<template>
    <div class="row-gutter my-table-bar">
        <span>
            <el-checkbox @change="notify" :checked="checkAll" v-model="checkAll">
                {{$t('vc.common.selectAll')}}
            </el-checkbox>
        </span>
        <slot name="more"></slot>
        <el-pagination v-show="totalPage>=currentSize" @size-change="handleSizeChange"
                       @current-change="handleCurrentChange" :current-page="currentPage"
                       :page-sizes="[10, 20, 50, 100]" :page-size="currentSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="totalPage" class="inline">
        </el-pagination>
    </div>
</template>
<script>

    /*
     * @table = 对应绑定表格的ref（必须）
     * @handleData = 获取方法的数据（必须）
     * @totalPage = 数据的总页数（必须）
     * */
    export default {
        data() {
            return {
                checkAll: false,
                currentSize: Number.parseInt(localStorage.getItem('currentSize') || 10),
                currentPage: 1
            };
        },
        created: function () {
            this.$nextTick(_ => {
                this.table.$on('select-all', s => {
                    this.checkAll = !(s.length === 0)
                })
            });
            this.$nextTick(_ => {
                this.table.$on('select', s => {
                    this.checkAll = ( s.length === this.totalPage)
                })
            });
        },
        props: {
            table: {
                type: Object
            },
            handleData: {
                type: Function
            },
            totalPage: {
                type: Number
            }
        },
        methods: {
            handleSizeChange(val) {
                this.currentSize = val;
                localStorage.setItem('currentSize', val)
                this.getData();
            },
            notify() {
                this.table.store.commit('toggleAllSelection');
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            getData(){
                let pageInfo = {}
                pageInfo.skip = (this.currentPage - 1) * this.currentSize;
                pageInfo.limit = this.currentSize;
                this.handleData(pageInfo);
            }
        }
    }
</script>
<style lang="css" scoped>
    .inline {
        display: inline-block;
        float: right;
    }

    .my-table-bar {
        margin-bottom: 10px;
    }
</style>
