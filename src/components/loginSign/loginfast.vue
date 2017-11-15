<template>
    <div class="logindefault loginfast">
        <div class="contaibox">
            <div class="header">
                <img src="../../assets/images/ic_logo_small.png" alt="">
                <div class="title">快速登录</div>
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
                    <div class="btn" @click="tologin()">登录</div>
                    <div class="otherbtn">
                        <div class="forget"></div>
                        <div class="loginfast">还没有账号，去<a href="#/loginsign/register">注册</a></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import check from "../../assets/js/data"

    export default {
        name: "loginfast",
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
                let _this = this;
                if (this.codeclass === '') {
                    if (!this.tel) {
                        this.telerr = "error";
                        this.telmsg = "请输入手机号";
                        return;
                    }
                    if (!check.checkMobile(this.tel)) {
                        this.telerr = "error";
                        this.telmsg = "手机号格式错误";
                        return;
                    }
                    this.getCode(this.tel,function () {
                        _this.codeclass = "geted";
                        _this.codemsg = "60S";
                        _this.cartTime();
                    });
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
            login(loginName, verifyCode) {
                let _this = this;
                let f = new FormData();
                f.append("loginName", loginName);
                f.append("verifyCode", verifyCode);
                this.$http
                    .post("api/v1/oto/user/login/verifyCode", f)
                    .then(function (res) {
                        if (res.data.code === 0) {
                            localStorage.setItem("userId", res.data.data.userId);
                            _this.$router.push({name: "index"});
                        } else {
                            _this.codeerrorcalss = "error";
                            _this.codeerrormsg = res.data.msg;
                        }
                    })
            },
            getCode(tel, cb) {
                let _this = this;
                this.$http
                    .get('api/v1/verifycode/getVerifyCode?mobile=' + tel)
                    .then(function (res) {
                        if (res.data.code === 0) {
                            _this.sendcode = res.data.data.verifyCode;
                            typeof cb === 'function' && cb();
                        } else {
                            _this.codeerrorcalss = "error";
                            _this.codeerrormsg = res.data.msg;
                        }
                    })
            },
            tologin() {
                if (!this.tel) {
                    this.telerr = "error";
                    this.telmsg = "请输入手机号";
                    return;
                }
                if (!check.checkMobile(this.tel)) {
                    this.telerr = "error";
                    this.telmsg = "手机号格式错误";
                    return;
                }
                if(!this.code){
                    this.codeerrorcalss = "error";
                    this.codeerrormsg = "请输入验证码";
                    return;
                }
                this.login(this.tel, this.code);
            }
        }
    }
</script>
<style lang="less">
    .loginfast {
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


