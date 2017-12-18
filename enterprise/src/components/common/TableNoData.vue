<template>
    <div class="empty">
        <div v-if="!value">
            <div class="noData">
                <i class="icon iconfont icon-kongshuju"></i>
                <p>{{tips|| $t('noData.null')}}</p>
            </div>
        </div>
        <div v-if="value">
            <div class="noSearch">
                <img src="../../assets/img/noSearch.png" alt="">
                <div class="u-tt">
                    <p>{{$t('noData.search.tip1')}}</p>
                    <p class="searchkey"> {{value}} </p>
                    <p>{{$t('noData.search.tip2')}}</p>
                </div>
                <p class="u-tips">{{$t('noData.search.notice')}}</p>
                <ul>
                    <li>• {{$t('noData.search.p1')}}</li>
                    <li>• {{$t('noData.search.p2')}}</li>
                    <li>• {{$t('noData.search.p3')}}</li>
                </ul>
            </div>
            <el-button type="text" class="btn" @click="back">{{$t('noData.search.back')}}</el-button>
        </div>
    </div>
</template>
<script>

export default {
    props: ['value', 'cb', 'tips'],
    data() {
        return {
            selectValue: this.value,
        }
    },
    watch: {
        value(val) {
            this.selectValue = val;
        },
        selectValue(val) {
            this.$emit('input', val);
        }
    },
    created() {

    },
    methods: {
        back() {
            this.selectValue = "";
            this.$emit('cb');
        }
    }
}
</script>
<style lang="scss" scoped>
.f-tac {
    .icon-kongshuju {
        color: #c9c9c9;
        font-size: 58px;
    }
}

.empty {
    *{
        margin: 0;
        padding: 0;
    }
    ul,
    li {
        list-style: none;
    }
    .noData {
        width: 300px;
        text-align: center;

        color: #333;
        .icon {
            font-size: 98px;
            color: #c9c9c9;
        }
        p {
            margin-top: 14px;
        }
    }
    .noSearch {
        font-size: 14px;
        color: #999;
        width: 580px;
        margin: 0px auto 0;
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
            /*margin-top: 25px;*/
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
    }
    .btn {
        margin-left: 140px;
    }
}
</style>
