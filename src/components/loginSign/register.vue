<template>
    <div class="logindefault register">
        <div class="contaibox">
            <div class="header">
                <img src="../../assets/images/ic_logo_small.png" alt="">
                <div class="title">注册</div>
            </div>
            <div class="formbox">
                <div class="formitem">
                    <div class="atitle" :class="telerr">{{telerr === '' ? '手机号' : telmsg}}</div>
                    <div class="ainput">
                        <input type="tel" maxlength="11" placeholder="请输入你的手机号码" v-model="tel" @focus="telfocus()">
                    </div>
                </div>
                <div class="formitem">
                    <!--有error样式表示错误提示样式   默认没有-->
                    <div class="atitle" :class="codeerrorcalss">{{codeerrorcalss === '' ? '验证码' : codeerrormsg}}</div>
                    <div class="codebox">
                        <div class="inputcode">
                            <input type="tel" placeholder="输入验证码" maxlength="4" @focus="codefocus" v-model="code">
                        </div>
                        <div class="getcode" @click="getcode()" :class="codeclass">{{codemsg}}</div>
                    </div>
                    <div class="btn" @click="tonext()">下一步</div>
                    <div class="otherbtn">
                        <div class="forget"></div>
                        <div class="loginfast">已有账号，去<a href="#/loginsign/logindefault">登录</a></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {state} from "../../assets/js/state";
    import check from "../../assets/js/data"
    import msg from "../../assets/js/msg"
    export default {
        name: "register",
        data() {
            return {
                telmsg: "请输入手机号",
                telerr: "",
                codeerrormsg: "验证码错误",
                codeerrorcalss: "",
                codemsg: "获取验证码",
                codeclass: "",
                tel: '',
                code: ""
            }
        },
        methods: {
            getcode() {
                if (this.codeclass === '') {
                    if (this.tel) {
                        if(check.checkMobile(this.tel)){
                            this.getCode(this.tel);
                        }else{
                            msg("请输入正确的手机号格式");
                        }

                    } else {
                        this.telerr = "error";
                        this.telmsg = "请输入手机号";
                        return
                    }
                    this.codemsg = "60S";
                    this.codeclass = "geted";
                    this.cartTime();
                }
            },
            telfocus() {
                this.telerr = "";
            },
            codefocus() {
                this.codeerrorcalss = "";
            },
            cartTime() {
                let _this = this;
                let i = 59;
                let time = setInterval(function () {
                    _this.codemsg = i + 'S';
                    i--;
                    if (i === -1) {
                        clearInterval(time);
                        _this.codemsg = "获取验证码";
                        _this.codeclass = "";
                    }
                }, 1000)
            },
            tonext() {

                console.log(check.checkMobile(this.tel));
                if(!this.tel){
                    this.telerr = "error";
                    this.telmsg = "请输入手机号";
                    return;
                }
                if(!check.checkMobile(this.tel)){
                    this.telerr = "error";
                    this.telmsg = "手机号格式错误";
                    return;
                }
                if(!this.code){
                    this.codeerrorcalss = "error";
                    this.codeerrormsg= "请填写验证码";
                    return;
                }
                if (this.code === this.sendcode || this.code === "9876") {
                    this.$router.push({name: 'setpassword', params: {code: this.code, tel: this.tel}})
                } else {
                    this.codeerrorcalss = "error";
                    this.codeerrormsg= "验证码错误";
                }
            },
            getCode(tel) {
                let _this = this;
                this.$http
                    .get('api/v1/verifycode/getVerifyCode?mobile=' + tel)
                    .then(function (res) {
                        if (res.data.code === 0) {
                            _this.sendcode = res.data.data.verifyCode;
                        } else {
                            _this.codeerrorcalss = "error";
                            _this.codeerrormsg = res.data.msg;
                        }
                    })
            }
        },
        mounted() {

        }
    }
</script>
<style lang="less">
    .register {
        @size: 37.5;
        .contaibox {
            .loginfast {
                a {
                    text-decoration: underline;
                }
            }
            .codebox {
                height: 40rem/@size;
                .inputcode {
                    width: 60%;
                    height: 40rem/@size;
                    border: 1px solid #EAEBED;
                    border-radius: 40rem/@size;
                    font-size: 0;
                    overflow: hidden;
                    float: left;
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
                .getcode {
                    float: right;
                    width: 35%;
                    font-size: 12rem/@size;
                    background-color: #1a1a1a;
                    color: #fff;
                    height: 40rem/@size;
                    border-radius: 40rem/@size;
                    line-height: 40rem/@size;
                }
                .geted {
                    background-color: #EAEBED;
                    font-size: 17rem/@size;
                }
            }
        }
    }
</style>
