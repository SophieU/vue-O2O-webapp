<template>
    <div class="startup">
        <div class="contaibox">
            <div class="logo"><img src="../../assets/images/ic_logo_big.png" alt=""></div>
            <div class="logoinfo">一生约商家O2O</div>
            <div class="welcom">
                <div class="com">欢迎来到</div>
                <div class="title">一生约商家O2O</div>
            </div>
            <div class="discript">
                <span>为服务引流<br>为商品增值<br>我们一起合创共赢</span>
            </div>
            <div class="btnbox">
                <div class="innerb" v-show="showb">
                    <div class="register">
                        <a href="#/loginsign/register">注册</a>
                    </div>
                    <div class="login">
                        <a href="#/loginsign/logindefault">登录</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "startup",
        data() {
            return {
                showb:false
            }
        },
        mounted(){
            //这里做全局登录判断
            let userId = localStorage.getItem("userId");
            if(userId==="undefined"||userId===null){
                this.showb = true;
            }else{
                console.log("已经登录跳转至首页...");
                this.$router.push({name:"index"});
            }
        }
    }
</script>
<style lang="less">
    .startup {
        @size: 37.5;
        display: table;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
        .contaibox {
            text-align: center;
            display: table-cell;
            vertical-align: middle;
            .logo {
                img {
                    width: 58rem/@size;
                    height: auto;
                }
            }
            .logoinfo {
                font-size: 12rem/@size;
                color: #1A1A1A;
            }
            .welcom {
                margin-top: 25rem/@size;
                .com {
                    font-size: 12rem/@size;
                    color: #BFC9D4;
                }
                .title {
                    font-size: 34rem/@size;
                    color: #1A1A1A;
                }
            }
            .discript {
                padding: 0 75rem/@size;
                line-height: 16rem/@size;
                margin-top: 20rem/@size;
                span {
                    font-size: 16rem/@size;
                    color: #1A1A1A;
                }
            }
            .btnbox {
                margin-top: 80rem/@size;
                height: 100rem/@size;
                .register {
                    a {
                        display: block;
                        font-size: 17rem/@size;
                        color: #3B55E6;
                        line-height: 50rem/@size;
                    }
                }
                .login {
                    a {
                        display: block;
                        font-size: 17rem/@size;
                        width: 160rem/@size;
                        height: 50rem/@size;
                        border-radius: 50rem/@size;
                        background-color: #1a1a1a;
                        color: #fff;
                        margin: auto;
                        line-height: 50rem/@size;
                    }
                }
            }
        }
    }
</style>
