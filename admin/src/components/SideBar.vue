<template>
    <div class="m-sidebar" ref="side">
        <!--导航菜单-->
        <el-menu theme="light-dark" :default-active="getDefault()" :style="{top:scrollTop+'px'}" @open="handleOpen" @select="handleSelect" unique-opened router ref="elmenu">
            <div class="collapse" @click="clickSidebar()">
                <i class="iconfont" :class="{'icon-ycaidanshouqi':!isSmall,'icon-ycaidanzhankai':isSmall}"> </i>
            </div>
            <div class="u-sep">
                <span></span>
            </div>
            <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
                <el-submenu :index="index+''" v-if="!item.leaf">
                    <template slot="title">
                        <i :class="item.icon"></i>
                        <span class="item-name">{{$t(item.name)}}</span>
                    </template>
                    <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">
                        {{$t(child.name)}}
                    </el-menu-item>
                </el-submenu>
                <el-menu-item v-if="item.leaf&&item.children&&item.children.length>0" :index="item.children[0].path">
                    <i :class="item.icon"></i>
                    <span class="item-name">{{$t(item.name)}}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<style lang="scss" scoped></style>

<script>
export default {
    props: ['isSmall'],
    data() {
        return {
            yEach: '',
            scrollTop: 0,
            listHeight: '',
            isActiveClass(routes) {
                /*目前之做两级菜单*/
                let _active=false;
                if (routes.children && routes.children.length > 0) {
                    routes.children.forEach(route=> {
                        if (route.path===this.$route.path || route.path===this.$route.meta.menu) {
                            _active=true
                        }
                    })
                }
                return _active
            }
        }
    }
    ,
    created() {}
    ,
    mounted() {
        this.yEach=this.$refs.elmenu.$el.children[0].offsetHeight;
        this.listHeight=this.$refs.elmenu.$el.offsetHeight;
    }
    ,
    methods: {
        mouseSrcoll(e) {
            let check=document.documentElement.clientHeight < this.listHeight+60;
            check && e.deltaY>0 && Math.abs(this.scrollTop) < (this.listHeight - this.yEach) && this.moveDown(); //向下滚
            check && e.deltaY < 0 && this.scrollTop < 0 &&this.moveUp(); //向上滚
        },
        moveDown() {
            this.scrollTop=this.scrollTop>this.yEach ? (this.scrollTop - this.yEach): (this.scrollTop -this.yEach-5);
        },
        moveUp() {
            this.scrollTop=this.scrollTop < -this.yEach ? this.scrollTop+this.yEach: 0;
        },
        getDefault() {
            let _menu=this.$route.meta && this.$route.meta.menu || this.$route.path 
            return _menu
        },
        clickSidebar() {
            sessionStorage.setItem('click', this.isSmall);
            this.$emit('click');
        },
        handleSelect(key, path) {
            sessionStorage.setItem('click', !this.isSmall);
            this.$emit('open');
        },
        handleOpen(key, path) {}
    }
}
</script>
