<template>
    <div id="body">
        <div class="s-activate">
            <top-bar title="" :line="true"></top-bar>
            <div class="m-container">
                <div class="m-wrap">
                    <div class="m-activate" v-if="activeName === 'failure'">
                        <i class="iconfont icon-kongshuju"></i>
                        <p class="tip">{{$t('activate.failure')}}</p>
                        <el-button size="large" type="primary" @click="login">{{$t('forget.back')}}</el-button>
                    </div>
                    <div class="m-activate" v-else-if="activeName === 'success'">
                        <i class="iconfont icon-chenggongleitishi"></i>
                        <p class="tip">{{$t('activate.success')}}</p>
                        <el-button size="large" type="primary" @click="login">{{$t('forget.back')}}</el-button>
                    </div>
                </div>
            </div>
            <div class="m-footer">
                <span class="u-copyright">
                    {{$t('login.copyright')}}
                </span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "index";
</style>

<script>
import topBar from '@/components/common/TopBar'

export default {
    data() {
        return {
            activeName: 'failure'
        }
    },
    created() {
        if (this.$route.query.result) {
            this.activeName = this.$route.query.result;
        }
    },
    methods: {
        login() {
            this.$router.push('/enterprise/login')
        }
    },
    components: {
        topBar
    }
}
</script>
