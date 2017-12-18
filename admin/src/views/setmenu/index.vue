<template>
    <div class="g-content">
        <div class="m-cover">
            <el-card class="full clearfix" style="border-radius:20px;">
                <div slot="header" class="clearfix">
                    <span class="title">{{title}}</span>
                </div>
                <el-row style="margin: -10px;">
                    <el-col class="u-width" v-for="(o, index) in menu" :key="index">
                        <div class="u-pad">
                            <el-card :body-style="{ padding: '0px' }" class="border">   
                                <div>
                                    <div :class="{'m-menu__cloud':index ==0,'m-menu__room ':index==1,'m-menu__port':index==2}" style="margin-bottom:20px;">
                                        <div style="height:180px;">
                                            <div class="u-icon">
                                                <i class="u-logo__cloud" v-if="index == 0"></i>
                                                <i class="u-logo__room" v-if="index == 1"></i>
                                                <i class="u-logo__port" v-if="index == 2"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="clearfix f-tac">
                                        <h4>{{o.type}}</h4>
                                        <h6 class="u-hint14 m-tb-mg">{{$t('order.sold')}}{{o.sold}}</h6>
                                        <el-button @click="checkDetail(index)" type="info" class="button bottom">{{$t('enterprise.check')}}</el-button>
                                    </div>
                                </div>
                            </el-card>
                        </div>   
                    </el-col>
                </el-row>
            </el-card>
        </div>  
    </div>
</template>

<style lang="scss" scoped>
    $my_width: percentage(553/1660);
    
    .bottom {
        margin-top: 20px;
        margin-bottom: 30px;
    }

    .u-icon {
        width: 90px;
        height: 100%;
        margin: 0 auto;
    }

    .u-pad {
        margin: 10px;
    }

    .u-width {
        width: $my_width;
    }

    .border {
        border: 1px solid #d1dae5 !important;
    }

    h4 {
        color: #333;
    }

    h6 {
        font-size: 14px;
        color: rgba(153, 153, 153, 0.8);
        margin: 15px 0 10px 0;
    }

    .m-cover .el-card__body {
        padding: 10px;
    }
</style>

<script>
import * as api from '../../api/order/index'
export default {
    data() {
        return {
            title: this.$t('order.set.menus'),
            menu: [{
                type: this.$t('enterprise.suitClourd'),
                sold: null
            }, {
                type: this.$t('enterprise.suitTerm'),
                sold: null
            }, {
                type: this.$t('enterprise.suitPort'),
                sold: null
            }]
        }
    },
    created(){
        this.getSalesCount();
    },
    methods: {
        checkDetail(index) {
            this.$router.push('/admin/setmenu/detail?index=' + index);
        },
        getSalesCount(){
            api.getSales()
                .then((res)=>{
                    if(res.data.ret > -1){
                        this.menu[2].sold = res.data.data.salesVolume.cloudPort;
                        this.menu[1].sold = res.data.data.salesVolume.vmr;
                        this.menu[0].sold = res.data.data.salesVolume.basic;
                    }
                })
        }
    }
}

</script>
