<style lang="scss" scoped>
    .yl-extension-suggestion {
        z-index: 1999;
        width: 180px;
        position: absolute;
        .no-search {
            height: 42px;
            background-color: #f0f0f0;
            text-align: center;
        }
        a {
            color: #2699f4;
        }
    }
    .b20{
        margin-bottom: 22px!important;
    }
</style>
<style  lang="scss">
    .el-autocomplete-suggestion__wrap {
        margin-bottom: -24px !important;
    }
    .el-autocomplete-suggestion__wrap .el-table__empty-block{
        min-height: 150px!important;
        .el-table__empty-text{
            text-align: center;
            width: 100%!important;
        }
    }
</style>
<template>
    <div>
        <transition name="el-zoom-in-top" @after-leave="doDestroy">
            <div v-show="showPopper" class="el-autocomplete-suggestion yl-extension-suggestion"
                 :class="{ 'is-loading': parent.loading }" :style="{ width: dropdownWidth }">
                <el-scrollbar tag="ul" wrap-class="el-autocomplete-suggestion__wrap" view-class="el-autocomplete-suggestion__list">
                    <li v-if="parent.loading">
                        <i class="el-icon-loading"></i>
                    </li>
                    <el-table :data="suggestions" @row-click="select">
                        <div slot="empty">
                            <span v-if="!search">{{$t('extension.empty.prefix')}}
                              <a href="javascript:" @click="openDialog">{{$t('extension.empty.add')}}</a>
                                {{$t('extension.empty.account')}}
                            </span>
                            <span v-if="search">{{$t('extension.empty')}}</span>
                        </div>
                        <el-table-column prop="name" :label="$t('extension.name')" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="account" :label="$t('extension.account')">
                        </el-table-column>
                        <el-table-column prop="extension" :label="$t('extension.extension')">
                        </el-table-column>
                    </el-table>
                    <div class="no-search">
                        {{$t('extension.account.empty')}}<a href="javascript:" @click="openDialog">{{$t('extension.add')}}</a>
                        <!--{{$t('extension.empty.account')}}-->
                    </div>
                </el-scrollbar>
            </div>
        </transition>
    </div>

</template>
<script>
    import Popper from '../utils/vue-popper';
    import Emitter from '../utils/emitter';

    export default {
        components: {},
        mixins: [Popper, Emitter],
        componentName: 'YlExtensionSuggestions',
        data() {
            return {

                parent: this.$parent,
                dropdownWidth: ''
            };
        },

        props: {
            search: String,
            props: Object,
            suggestions: Array,
            options: {
                default() {
                    return {
                        forceAbsolute: true,
                        gpuAcceleration: false
                    };
                }
            }
        },

        methods: {
            select(item) {
                this.dispatch('YlExtension', 'item-click', item);
            },
            openDialog(){
                this.dispatch('YlExtension', 'dialog');
            }
        },

        updated() {
            this.$nextTick(_ => {
                this.updatePopper();
            });
        },

        mounted() {

        },

        created() {
            this.$on('visible', (val, inputWidth) => {
                this.dropdownWidth = inputWidth + 'px';
                this.showPopper = val;
            });
        }
    };
</script>
