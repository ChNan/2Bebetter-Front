<template>
  <div class="not-found">
    <div v-if="code=='404'">
      <img src="../assets/img/404.png" alt="">
      <p>{{$t('common.error.page')}} </p>
      <el-button type="text" @click="back" size="large"> {{$t('common.return')}}</el-button>
    </div>
    <div v-if="code=='500'">
      <img src="../assets/img/500.png" alt="">
      <p>{{$t('common.error.message')}} </p>
      <p>{{$t('common.error.handle')}}
        <router-link to="/admin/login"> {{$t('common.error.login')}}</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      code: '404',
    }
  },
  created() {
    /* 
      @401 :访问被拒绝（用户账号过期，重新登录）
      @404：页面未找到
      @500：服务器错误 
    */
    this.code = this.$route.query.code || '404';
  },
  methods:{
    back(){
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="css">
.not-found {
  width: 100%;
  text-align: center;
  margin-top: 250px;
}
</style>
