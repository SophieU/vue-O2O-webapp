<template>
    <div class="basebg">
        <div class="basebgbox">
            <div class="innerbox">
                <div class="step" v-show="stepnumber!=''">{{stepnumber}}</div>
                <a href="#/startup" class="close"></a>
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
    import {state} from "../../assets/js/state"
    export default {
        name:"logindefault",
        data(){
            return {
                stepnumber:""
            }
        },
        mounted(){
            let _this = this;
            state.$on("step",function (n) {
                _this.stepnumber=n;
            })
        }
    }
</script>
<style lang="less">
    /* 登录注册全局样式 */
    .basebg{
        @size:37.5;
        position: absolute;
        top:0;
        left: 0;
        bottom: 0;
        right:0;
        width: 100%;
        height:100%;
        background-color: #000000;
        display: table;
        background-image: url("../../assets/images/Artboard.png");
        background-repeat: no-repeat;
        background-size: 100% auto;
        .basebgbox{
            display: table-cell;
            vertical-align: middle;
            .innerbox{
                width: 230rem/@size;
                background-color: #ffffff;
                border-radius: 15rem/@size;
                margin: auto;
                padding: 20rem/@size 35rem/@size;
                position: relative;
                .step{
                    font-size: 12rem/@size;
                    color: #B1B1B1;
                    position: absolute;
                    left: 12rem/@size;
                    top: 12rem/@size;
                }
                .close{
                    position: absolute;
                    width: 30rem/@size;
                    height: 30rem/@size;
                    right:12rem/@size;
                    top: 12rem/@size;
                    background-image: url("../../assets/images/ic_close.png");
                    background-size: cover;
                }
            }
        }
    }
    .logindefault {
        @size: 37.5;
        text-align: center;
        .contaibox {
            .header {
                img {
                    width: 30rem/@size;
                    height: auto;
                }
                .title {
                    font-size: 28rem/@size;
                    color: #000000;
                }
            }
            .formbox {
                .formitem {
                    margin-top: 20rem/@size;
                    .atitle {
                        font-size: 11rem/@size;
                        color: #000000;
                        margin-bottom: 6rem/@size;
                    }
                    .error{
                        color: #F34268;
                    }
                    .ainput {
                        width: 100%;
                        height: 40rem/@size;
                        border: 1px solid #EAEBED;
                        border-radius: 40rem/@size;
                        font-size: 0;
                        overflow: hidden;
                        input {
                            width: 100%;
                            border: none;
                            height: 90%;
                            text-align: center;
                            vertical-align: middle;
                            font-size: 17rem/@size;
                            color: #1a1a1a;
                            margin: 0;
                            padding: 0;
                        }
                    }
                    .btn {
                        background: #1a1a1a;
                        border-radius: 40rem/@size;
                        height: 40rem/@size;
                        line-height: 40rem/@size;
                        color: #fff;
                        font-size: 17rem/@size;
                        margin-top: 30rem/@size;
                    }
                    .otherbtn {
                        height: 20rem/@size;
                        font-size: 13rem/@size;
                        padding: 20rem/@size 3rem/@size 0 3rem/@size;
                        .forget {
                            float: left;
                        }
                        .loginfast {
                            float: right;
                            a{
                                color: #3B55E6;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
