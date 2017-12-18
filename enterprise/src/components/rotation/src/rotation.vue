<style lang="scss">
@mixin left {
    float: left;
}

@mixin right {
    float: right;
}



.slide-trans-enter-active {
    -ms-transition: all .4s;
    -webkit-transition: all .4s;
    transition: all .4s;
}

.slide-trans-enter {
    -ms-transform: translateY(20px);
    -webkit-transform: translateY(20px);
    transform: translateY(20px);
}

.m-tips {
    p,
    ul,
    li {
        margin: 0;
        padding: 0;
    }

    ul,
    li {
        list-style: none;
    }
    height: 20px;
    overflow: hidden;
    .s-fc {
        color: #ff9c1b;
        font-size: 16px;
        @include left;
        margin-left: 10px;
        line-height: 20px;
    }
    li {
        list-style: none;
        padding-left: 30px;
        font-size: 14px;
    }
    a {
        color: #333;
        line-height: 20px;
        &:hover {
            color: #2699f4;
        }
    }
}
</style>

<template>
    <ul class="m-tips" @mouseenter.stop="handleMouseEnter" @mouseleave.stop="handleMouseLeave">
        <i class="icon iconfont icon-tongzhi s-fc"></i>
        <li class="item">
            <template>
                <transition name="slide-trans">
                    <div v-if="isShow">
                        <router-link :to="{path:'/enterprise/service'}">
                            {{items[nowIndex]}}
                        </router-link>
                    </div>
                </transition>
            </template>
        </li>
    </ul>
</template>


<script>
export default {
    name: 'rotation',
    components: {

    },
    data() {
        return {
            nowIndex: 0,
            timer: null,
            isShow: true
        }
    },
    props: ['items'],
    computed: {},
    watch: {

    },
    methods: {
        // 轮播滚动
        startTimer() {
            this.timer = setInterval(() => {
                if (this.nowIndex === this.items.length - 1) {
                    this.goto(0)
                } else {
                    this.goto(this.nowIndex + 1)
                }
            }, 3000);
        },
        goto(index) {
            this.isShow = false
            setTimeout(() => {
                this.isShow = true
                this.nowIndex = index
            }, 10)
        },
        handleMouseEnter() {
            this.pauseTimer();
        },

        handleMouseLeave() {
            if (this.items.length > 1) {
                this.startTimer()
            }
        },
        pauseTimer() {
            clearInterval(this.timer);
        }
    },
    mounted() {
        if (this.items.length > 1) {
            this.startTimer()
        }
    },
    destroyed: function() {
        this.pauseTimer();
    }
}
</script>
