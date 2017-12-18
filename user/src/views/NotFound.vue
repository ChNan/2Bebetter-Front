<template>
    <div class="s-bg">
        <top-bar :title="$t('homepage.platform')" :line="true" :account="true"></top-bar>
        <div class="m-container">
            <div class="m-wrap">
                <div class="not-found">
                    <div v-if="code==404">
                        <img src="../assets/img/404.png" alt="">
                        <p>{{$t('common.error.message')}} </p>
                        <p>{{$t('common.error.handle')}}
                            <router-link to="/meeting/login"> {{$t('common.error.login')}}</router-link>
                        </p>
                    </div>
                    <div v-if="code!=404&&code!=403">
                        <img src="../assets/img/500.png" alt="">
                        <p>{{$t('common.error.message')}} </p>
                        <p>{{$t('common.error.handle')}}
                            <router-link to="/meeting/login"> {{$t('common.error.login')}}</router-link>
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
            </div>
        </div>
        <div class="m-footer">
            <span class="u-copyright">
                {{$t('login.copyright')}}
            </span>
        </div>
       
    </div>
  
</template>

<script>
    import topBar from '@/components/common/TopBar'
    export default {
        components: {
            topBar
        },
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
             */
            this.code = this.$route.query.code || '404';
        }
    }
</script>

<style lang="scss">
    .s-bg {
        height: 100%;
        width: 100%;
        background: url("../assets/img/bg.jpg");
        background-size: cover;
        background-position: 50%;
    }
    .not-found {
        width: 100%;
        text-align: center;
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

    .m-container {
        height: 100%;
        min-height: 600px;
        text-align: center;
        min-width: 420px;
        &:before {
            content: "";
            display: inline-block;
            height: 100%;
            width: 0;
            vertical-align: middle;
        } //登录框
        .m-wrap {
            min-width: 300px;
            margin: 0 auto;
            display: inline-block;
            vertical-align: middle;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
            padding: 38px 40px 24px; //登录标题
            .u-tt {
                font-size: 24px;
                text-align: center;
                margin-bottom: 14px;
                color: #000;
                height: 32px;
                line-height: 32px;
            }
            .u-tabs {
                font-size: 19px;
                text-align: center;
                height: 40px;
                line-height: 40px;
                border-bottom: 1px solid #d3dbe6;
                position: relative;
                a {
                    color: #333;
                    display: block;
                }
                .item {
                    float: left;
                    width: 150px;
                }
                .active {
                    color: #2699f4;
                }
                .bar {
                    position: absolute;
                    bottom: 0;
                    left: 150px;
                    height: 3px;
                    background-color: #2699f4;
                    z-index: 1;
                    width: 150px;
                }
            }
            .u-tip {
                font-size: 13px;
                color: #999;
                height: 20px;
                line-height: 20px;
                display: block;
            }
            .m-menu {
                height: 20px;
                line-height: 20px;
                margin-top: 2px;
                margin-bottom: 12px;
                .el-checkbox {
                    float: left;
                    color: #333;
                }
                a {
                    color: #333;
                    font-size: 14px;
                    &:hover {
                        color: #2699f4;
                    }
                    &:focus {
                        color: #2288d6;
                    }
                    &:first-child {
                        float: right;
                    }
                }
            }
            .u-captcha {
                cursor: pointer;
            }
            .el-form-item {
                &:first-child {
                    margin-top: 30px;
                }
            }
            .el-button {
                width: 100%;
                margin-bottom: 10px;
                margin-top: 12px;
            }
            .u-back {
                font-size: 14px;
                color: #2699f4;
                display: block;
                height: 20px;
                line-height: 20px;
                &:hover {
                    color: #51adf6;
                }
            }
            .el-row {
                width: 240px;
                margin-left: 30px !important;
            }
        }
    }
    .m-footer {
        margin-top: -60px;
        text-align: center;
        .u-copyright {
            line-height: 60px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.3);
        }
    }
</style>
