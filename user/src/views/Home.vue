<template>
    <div>
        <top-bar :title="$t('homepage.platform')" theme="gradient" :account="true"></top-bar>
        <main  class="f-ofya" :style="{'height':viewHeight}">
            <breadcrumb class="g-mainc"></breadcrumb>
            <transition name="fade" mode="out-in">
                <router-view class="g-mainc"></router-view>
            </transition>
        </main>
    </div>
</template>

<script>
    import topBar from '@/components/common/TopBar'
    import breadcrumb from "@/components/breadcrumb"
    import  {mapGetters} from  'vuex'
    export default {
        name: 'home',
        components: {
            topBar,
            breadcrumb,
        },
        data(){
            return {
                title: '',
                viewHeight:930
            }
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            "$route": 'setTitle'
        },
        methods: {
            setTitle(){
                this.title = !this.$route.meta.hideTitle && this.$route.name || false
            },
            getViewHeight () {
                this.viewHeight =  document.body.clientHeight-60;
            },
            scrollControl () {
                this.viewHeight =  document.body.clientHeight-60;
                window.addEventListener('resize',this.getViewHeight)
            }
        },
        mounted(){
            this.setTitle();
            this.scrollControl();
        },
        destroyed () {
            window.removeEventListener("resize",this.getViewHeight)
        }

    }
</script>

<style lang="scss" scoped>

    .g-mainc {
        padding: 0 24px 0 24px;
        background: #f3f3f3;
        min-width: 1200px;
    }
    main {
        position: absolute;
        width: 100%;
        top: 60px;
        bottom: 0;
        background-color: #eef3fa;
    }
    .f-ofya{
        overflow: auto;
    }
</style>
