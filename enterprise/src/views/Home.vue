<template>
    <el-row class="container">
        <top-bar theme="dark" :account="true" :title="$t('title')"></top-bar>
        <el-col :span="24" class="main">
            <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
                <div class="u-fold" @click.prevent="collapse">
                    <i class="iconfont" :class="collapsed?'icon-ycaidanzhankai':'icon-ycaidanshouqi'"></i>
                </div>
                <div class="u-sep"><span></span></div>
                <!--导航菜单-->
                <el-menu theme="light-dark" :default-active="getDefault()" class="el-menu-vertical" unique-opened router v-show="!collapsed">
                    <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
                        <el-submenu :index="index+''" v-if="!item.leaf">
                            <template slot="title">
                                <i class="iconfont" :class="item.icon"></i>{{$t(item.label)}}
                            </template>
                            <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">
                                {{$t(child.label)}}
                            </el-menu-item>
                        </el-submenu>
                        <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path">
                            <i class="iconfont" :class="item.icon"></i>{{$t(item.children[0].label)}}
                        </el-menu-item>
                    </template>
                </el-menu>
                <!--导航菜单-折叠后-->
                <ul class="el-menu el-menu-vertical collapsed" v-show="collapsed">
                    <li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item" :key="index" :title="$t(item.label)">
                        <template v-if="!item.leaf">
                            <div class="el-submenu__title" :class="isActiveClass(item)?'is-active':''" @click="collapse(item)">
                                <i class="icon-menu iconfont" :class="item.icon"></i>
                            </div>
                            <ul class="el-menu submenu" :class="'submenu-hook-'+index">
                                <li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">
                                    {{$t(child.label)}}
                                </li>
                            </ul>
                        </template>
                        <template v-else>
                            <li class="el-submenu" @click="collapse">
                                <div class="el-submenu__title el-menu-item el-submenu-col" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)">
                                    <i class="icon-menu iconfont" :class="item.icon"></i>
                                </div>
                            </li>
                        </template>
                    </li>
                </ul>
            </aside>
            <section class="content-container" :style="{left:collapsed?'56px':'230px'}">
                <div class="content-wrapper">
                    <transition name="fade" mode="out-in">
                        <router-view></router-view>
                    </transition>
                </div>
            </section>
        </el-col>
    </el-row>
</template>

<script>
    import TopBar from '@/components/common/TopBar'

    export default {
        components: {
            TopBar
        },
        mounted(){
            window.addEventListener('resize', () => {
                this.collapsed = document.body.clientWidth < 1200;
                document.querySelector('.content-container').scrollLeft = 0
            })
        },
        data() {
            return {
                collapsed:document.body.clientWidth < 1200,
                getDefault(){
                    let _menu  = this.$route.meta&&this.$route.meta.menu||this.$route.path
                    return  _menu
                },
                isActiveClass(routes) {
                    /*目前之做两级菜单*/
                    let _active = false;
                    if (routes.children && routes.children.length > 0) {
                        routes.children.forEach(route => {
                            if (route.path === this.$route.path||route.path === this.$route.meta.menu) {
                                _active = true
                            }
                        })
                    }
                    return _active
                }
            }
        },
        methods: {
            collapse(item) {
                this.collapsed = !this.collapsed;
                if (item && item.children) {
                    this.$router.push(item.children[0].path)
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../assets/scss/var';

    $aside-bg-color: #37383c;
    $item-hover-color: #494a4d;
    $item-active-color: #2699f4;

    .container {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;

        .main {
            display: flex;
            position: absolute;
            top: 60px;
            bottom: 0px;
            overflow: hidden;

            aside {
                position: fixed;
                top: 60px;
                bottom: 0;
                width: 230px;
                background-color: $aside-bg-color;

                .u-fold {
                    padding: 0 20px;
                    height: 56px;
                    line-height: 56px;
                    text-align: right;
                    cursor: pointer;

                    i {
                        color: #ccc;
                        font-size: 18px;
                    }

                    &:hover {
                        i {
                            color: $item-active-color;
                        }
                    }
                }

                .u-sep {
                    padding-bottom: 10px;

                    span {
                        height: 1px;
                        background-color: #fff;
                        opacity: 0.1;
                        display: block;
                    }
                }

                .el-menu {
                    height: 100%;

                    .iconfont {
                        margin-right: 10px;
                        font-size: 18px;
                        float: left;
                        line-height: 45px;
                    }

                    .el-submenu {
                        .el-menu {
                            .el-menu-item {
                                padding: 0 0 0 48px;
                            }
                        }
                    }
                }

                .el-submenu-col {
                    padding-left: 20px;
                    height: 48px;
                    line-height: 48px;
                    padding: 0 20px;
                }

                .collapsed {
                    width: 56px;
                    background-color: $aside-bg-color;

                    i {
                        color: #ccc;
                    }

                    .item {
                        position: relative;

                        :hover {
                            background-color: $item-hover-color;

                            i {
                                color: #fff;
                            }
                        }

                        .is-active {
                            background-color: $item-active-color;

                            i {
                                color: #fff;

                                &:hover {
                                    background-color: $item-active-color;
                                }
                            }
                        }
                    }

                    .submenu {
                        position: absolute;
                        top: 0px;
                        left: 56px;
                        z-index: 99999;
                        height: auto;
                        display: none;
                    }
                }
            }

            .menu-collapsed {
                width: 56px;

                .u-fold {
                    i {
                        color: $item-active-color;
                    }

                    &:hover {
                        i {
                            color: #48aeff;
                        }
                    }
                }
            }

            .menu-expanded {
                width: 230px;
            }

            .content-container {
                background: #ebeff5;
                border-bottom: 0px;
                max-width: 100%;
                min-height:568px;
                width: auto;
                position: absolute;
                top: 0px;
                bottom: 0px;
                right: 0px;
                height: 100%;
                overflow: auto;
                -o-transition: all 0.2s ease;
                -ms-transition: all 0.2s ease;
                -moz-transition: all 0.2s ease;
                -webkit-transition: all 0.2s ease;

                .content-wrapper {
                    overflow-x: auto;
                    /*min-width: 970px;*/
                    height: 100%;
                }
            }
        }

        .fade-enter-active, .fade-leave-active {
            transition: all .2s;
        }
        .fade-enter, .fade-leave-active {
            opacity: 0;
        }
    }
</style>
