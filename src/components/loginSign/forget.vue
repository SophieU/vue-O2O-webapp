<template>
    <div class="logindefault forget">
        <div class="contaibox step1" v-if="step===1">
            <div class="header">
                <img src="../../assets/images/ic_logo_small.png" alt="">
                <div class="title">忘记密码</div>
            </div>
            <div class="formbox">
                <div class="formitem">
                    <div class="atitle">手机号</div>
                    <div class="ainput">
                        <input type="tel" maxlength="11" placeholder="请输入你的手机号码">
                    </div>
                </div>
                <div class="formitem">
                    <div class="btn" @click="getcode()">获取验证码</div>
                </div>
            </div>
        </div>
        <div class="contaibox step2" v-if="step===2">
            <div class="header">
                <img src="../../assets/images/ic_logo_small.png" alt="">
                <div class="title">忘记密码</div>
            </div>
            <div class="formbox">
                <div class="formitem">
                    <div class="atitle">验证码</div>
                    <div class="ainput">
                        <input type="tel" maxlength="11" placeholder="请输入短信验证码">
                    </div>
                </div>
                <div class="formitem">
                    <div class="btn" @click="tonext()">下一步</div>
                </div>
            </div>
        </div>
        <div class="contaibox step3" v-if="step===3">
            <div class="header">
                <img src="../../assets/images/ic_logo_small.png" alt="">
                <div class="title">忘记密码</div>
            </div>
            <div class="formbox">
                <div class="formitem">
                    <div class="atitle">设置密码</div>
                    <div class="ainput">
                        <input type="tel" maxlength="11" placeholder="请设置新的登录密码">
                    </div>
                </div>
                <div class="formitem">
                    <div class="btn" @click="submit()">完成</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { state } from "../../assets/js/state"
    export default {
        name: "setpassword",
        data() {
            return {
                step:1
            }
        },
        mounted(){
            state.$emit("step","1/3")
        },
        methods:{
            getcode(){
                this.step = 2;
                state.$emit("step","2/3")
            },
            tonext(){
                this.step = 3;
                state.$emit("step","3/3")
            },
            submit(){
                state.$emit('tips', '密码修改成功')
            }
        },
        destroyed(){
            state.$emit("step","");
        }
    }
</script>
<style lang="less">
    .forget{
        @size: 37.5;
        .contaibox {
            .formitem{
                .btn{
                    margin-bottom: 15rem/@size;
                }
            }
        }
    }
</style>
