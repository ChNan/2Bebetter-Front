<template>
    <div class="empty">
        <div class="noData" v-if="!searchkey">
            <i class="icon iconfont icon-kongshuju"></i>
            <p>{{tips}}</p>
            <!-- <p>还未申请服务，请咨询您的供应商</p> -->
        </div>
        <div class="noSearch" v-if="searchkey">
            <img src="../../assets/img/noSearch.png" alt="">
            <div class="u-tt">
                <p>{{$t('noData.search.tip1')}}</p><p class="searchkey"> {{searchkey}} </p><p></p>{{$t('noData.search.tip2')}}</p>
            </div>
            <p class="u-tips">{{$t('noData.search.notice')}}</p>
            <ul>
                <li>• {{$t('noData.search.p1')}}</li>
                <li>• {{$t('noData.search.p2')}}</li>
                <li>• {{$t('noData.search.p3')}}</li>
            </ul>
            <el-button type="text" class="btn" @click="back">{{$t('noData.search.back')}}</el-button>
        </div>
    </div>
</template>
<script>

export default {
    data() {
        return {};
    },
    props: ['searchkey','tips'],
    created() {},
    methods: {
        back() {
           this.$emit('getList', '')
        }
    }
}
</script>
<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
}

.empty {
    ul,
    li {
        list-style: none;
    }
    .noData {
        width: 300px;
        text-align: center;
        margin: 76px auto;
        color: #333;
        .icon {
            font-size: 98px;
            color: #c9c9c9;
        }
        p {
            margin-top: 20px;
        }
    }
    .noSearch {
        font-size: 14px;
        color: #999;
        width: 580px;
        margin: 44px auto 0;
        .searchkey {
            white-space: nowrap;
            max-width: 100px;
            font-size: 19px;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        img {
            float: left;
            margin-top: 5px;
        }
        .u-tt {
            font-size: 18px;
            color: #333;
            margin-left: 140px;
            line-height: 30px;
            width: 450px;
            height: 30px;
            p {
                float: left;
                height: 30px;
            }
        }
        .u-tips {
            margin-top: 25px;
            margin-left: 140px;
        }
        ul {
            margin-bottom: 25px;
            margin-left: 140px;
            li {
                line-height: 24px;
            }
        }
        .s-fc {
            color: #2699f4;
            font-size: 14px;
        }
        .btn {
            margin-left: 140px;
        }
    }
}
</style>
