<template>
    <div class="s-service">
        <div class="m-info">
            <div class="u-ct">
                <div class="u-header">
                    <img src="../../../assets/img/free.png">
                </div>
                <div class="u-info">
                    <p class="u-tt f-fw">{{$t('service.free.order')}}</p>
                    <div class="u-server">
                        <ul>
                            <li>
                                <span class="f-fw">• {{$t('service.cloudPort')}}： {{info.cloudPort}}</span>
                                <span class="f-fc">{{$t('service.fang')}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="u-server">
                        <ul>
                            <li>
                                <span class="f-fw">• {{$t('service.basic')}}：</span>
                                <span class="f-fc">{{$t('service.basic.desc')}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="tips">
                <i class="icon iconfont icon-jinggaoleitishi"></i>{{$t('service.free.expired',{date: dateFormat(tableData.cloudPortItems[0].endDate)})}}
            </div>
        </div>

    </div>
</template>

<script>
import noData from '@/components/common/NoData'
export default {
    data() {
        return {
            activeName: 'first',
        };
    },
    props: ['info','tableData', 'dateFormat'],
    methods: {
    },
    components: {
        noData

    }
}
</script>

<style lang="scss" scoped>
@mixin left( $value: 20px) {
    float: left;
    margin-left: $value;
}

@mixin right( $value: 20px) {
    float: right;
    margin-right: $value;
}

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

.s-service {
    padding: 5px 20px 20px;
    ;
    .f-fw {
        font-weight: bold;
    }
    .f-fc {
        color: #999;
    }
    .m-info {
        .u-hd {
            border-bottom: 1px solid #e0e0e0;
            line-height: 56px;
            font-size: 16px;
            font-weight: bold;
        }
        .u-ct {
            height: 180px;
            .u-header {
                @include left(0);
                width: 130px;
                height: 130px;
                margin-top: 20px;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                }
            }
            .u-info {
                @include left(38px);
                margin-top: 22px;
                width: 700px;
                .u-tt {
                    font-size: 18px;
                    line-height: 46px;
                    padding-bottom: 10px;
                }
                .u-server {
                    font-size: 14px;
                    line-height: 30px;
                    &:after {
                        clear: both;
                        display: block;
                        content: '';
                    }
                    li {
                        @include left(0);
                        margin-right: 30px;
                    }
                }
            }
        }
    }
    .icon-jinggaoleitishi {
        color: #ff4949;
        cursor: default;
        margin-right: 10px;
    }
    .tips{
        font-size: 14px;
        margin-top: 15px;
    }
}
</style>
