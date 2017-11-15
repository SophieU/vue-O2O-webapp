<template>
    <div class="navbox">
        <ul>
            <li class="home" :class="type=='home'?'active':''">
                <a href="#" class="cellbox">
                    <div class="icon"></div>
                    <div class="font">首页</div>
                </a>
            </li>
            <li class="custerm" :class="type=='custerm'?'active':''">
                <a class="cellbox">
                    <div class="icon"></div>
                    <div class="font">客户</div>
                </a>
            </li>
            <li class="yingxiao" :class="type=='yingxiao'?'active':''">
                <a class="cellbox">
                    <div class="icon"></div>
                    <div class="font">营销</div>
                </a>
            </li>
            <li class="more" :class="type=='more'?'active':''">
                <a class="cellbox">
                    <div class="icon"></div>
                    <div class="font">更多</div>
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name:"nav",
        data(){
            return{

            }
        },
        props:['type']
    }
</script>
<style lang="less">
    .navbox{
        @size:37.5;
        background: #FFFFFF;
        box-shadow: 0 1px 8px 0 rgba(0,0,0,0.10);
        height: 50rem/@size;
        border-top: 1px solid #e6e6e6;
        position: fixed;
        z-index: 9;
        width: 100%;
        bottom: 0;
        left:0;
        ul{
            margin: 0 16rem/@size;
            li{
                height: 50rem/@size;
                width: 25%;
                text-align: center;
                float: left;
                font-size: 12px;
                display: table;
                .cellbox{
                    display: table-cell;
                    vertical-align: middle;
                }
                &.home{
                    .icon{
                        background-image: url("../../assets/images/ic_home_default.png");
                        background-size: cover;
                    }
                    &.active{
                        .icon{
                            background-image: url("../../assets/images/ic_home_invition.png");
                            background-size: cover;
                        }
                    }
                }
                &.custerm{
                    .icon{
                        background-image: url("../../assets/images/ic_custerm_default.png");
                        background-size: cover;
                    }
                    &.active{
                        .icon{
                            background-image: url("../../assets/images/ic_custerm_invition.png");
                            background-size: cover;
                        }
                    }
                }
                &.yingxiao{
                    .icon{
                        background-image: url("../../assets/images/ic_marketing_default.png");
                        background-size: cover;
                    }
                    &.active{
                        .icon{
                            background-image: url("../../assets/images/ic_marketing_invition.png");
                            background-size: cover;
                        }
                    }
                }
                &.more{
                    .icon{
                        background-image: url("../../assets/images/ic_more_default.png");
                        background-size: cover;
                    }
                    &.active{
                        .icon{
                            background-image: url("../../assets/images/ic_more_invition.png");
                            background-size: cover;
                        }
                    }
                }
                .font{
                    font-size: 11rem/@size;
                    color: #cccccc;
                    line-height: 10rem/@size;
                }
                &.active{
                    .font{
                        color: #000000;
                    }
                }
                .icon{
                    width: 20rem/@size;
                    height: 20rem/@size;
                    margin: 0 auto 6rem/@size auto;
                }
            }
        }
    }
</style>
