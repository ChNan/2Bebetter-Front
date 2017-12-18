<template>
    <div class="empty">
        <div v-if="!value">
            <div class="noData">
                <i class="icon iconfont icon-kongshuju"></i>
                <p>{{tips||'暂无数据'}}</p>
            </div>
        </div>
        <div v-if="value">
            <div class="noSearch">
                <img src="../../assets/img/noSearch.png" alt="">
                <p class="u-tt">很抱歉，没有找到与“ {{value}} ”相关的内容。</p>
                <p class="u-tips">温馨提示：</p>
                <ul>
                    <li>• 请检查您的输入是否正确</li>
                    <li>• 如系统未收录，请先添加</li>
                    <li>• 如有任何意见或建议，请及时联系您的供应商</li>
                </ul>
            </div>
            <el-button type="text" class="btn" @click="back">点击返回</el-button>
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
            !!this.cb && this.cb();
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
            margin-top: 20px;
        }
    }
    .noSearch {
        font-size: 14px;
        color: #999;
        width: 480px;
        margin: 44px auto 0;
        img {
            float: left;
            margin-top: 5px;
        }
        .u-tt {
            font-size: 18px;
            color: #333;
            margin-left: 140px;
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
    }
    .btn {
        margin-left: 140px;
    }
}
</style>
