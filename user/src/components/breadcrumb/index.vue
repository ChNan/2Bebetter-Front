<template>
    <div>
        <div class="title">
            <div class="pull-left">{{name}}</div>
            <div class="pull-right">
                <div class="back point" @click="back()">

                    <div class="u-inf pull-right">
                        {{$t('title.back')}}
                    </div>
                    <div class="icon iconfont icon-back u-icon pull-right"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped="">

    .u-icon{
        font-size: 24px;
        color: #26c7ec;
        padding-right: 10px;
    }
    .u-inf{
        font-size: 14px;
        height: 32px;
        line-height: 35px;
    }
    .title{
        height: 2em;
        line-height: 2em;
        padding: 0.5em 2px;
        font-size: 16px;
    }
    .pull-right{
        float: right;
    }
    .pull-left{
        float: left;
    }
    .back{
        font-size: 16px;
    }
    .back:hover{
        color: #2196F3 !important;
    }
    .back:hover .icon-back{
        color: #2196F3 !important;
    }
    .back:active{
        color: #20cbf3 !important;
    }
    .back:active .icon-back{
        color: #20cbf3 !important;
    }
    .point{
        cursor: pointer;
    }
</style>
<script>

    export default{
    	data () {
    	    return {

            }
        },
        methods:{
    		back () {
    			this.$router.back();
            }
        },
        computed:{
    	    name () {
                return this.$t(this.$route.name);
            }
        },
        mounted () {

        }

    }
</script>
