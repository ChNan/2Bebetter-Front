<template>
    <div class="not-found">
        <div v-if="code==404">
            <img src="../assets/img/404.png" alt="">
            <p>{{$t('common.error.message')}} </p>
            <p>{{$t('common.error.handle')}}
                <router-link to="/enterprise/login"> {{$t('common.error.login')}}</router-link>
            </p>
        </div>
        <div v-if="code!=404&&code!=403">
            <img src="../assets/img/500.png" alt="">
            <p>{{$t('common.error.message')}} </p>
            <p>{{$t('common.error.handle')}}
                <router-link to="/enterprise/login"> {{$t('common.error.login')}}</router-link>
            </p>
        </div>
        <div v-if="code==403">
            <p class="page403">
                <i class="iconfont icon-cuowuleitishi"></i>
            </p>
            <p class="txt">
                {{$t('common.error.expired')}}
            </p>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            code: '',
        }
    },
    created() {
        /*
          @401 :访问被拒绝（用户账号过期，重新登录）
          @404：页面未找到
          @500：服务器错误
          @403: 过期
        */
        this.code = this.$route.query.code || '404';
    }
}
</script>

<style lang="scss">
.not-found {
    width: 100%;
    text-align: center;
    margin-top: 250px;
}

.page403 {
    color: #ff4949;
    .iconfont {
        font-size: 66px;
    }
    .txt {
        font-size: 16px;
        text-align: center;
        color: #333333;
    }
}
</style>
