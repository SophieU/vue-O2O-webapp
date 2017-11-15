<template>
    <div class="logindefault">
        <div class="contaibox">
            <div class="header">
                <img src="../../assets/images/ic_logo_small.png" alt="">
                <div class="title">登录</div>
            </div>
            <div class="formbox">
                <div class="formitem">
                    <div class="atitle" :class="telclass">{{telclass===''?'手机号':telmsg}}</div>
                    <div class="ainput">
                        <input type="tel" maxlength="11" placeholder="请输入你的手机号码" v-model="tel" @focus="telfocus()">
                    </div>
                </div>
                <div class="formitem">
                    <div class="atitle" :class="wordclass">{{wordclass===''?'登录密码':wordmsg}}</div>
                    <div class="ainput">
                        <input type="password" placeholder="请输入登录密码" v-model="password" @focus = "wordfocus()">
                    </div>
                    <div class="btn" @click="tologin()">登录</div>
                    <div class="otherbtn">
                        <!--<div class="forget"><a href="#/loginsign/forget">忘记密码</a></div>-->
                        <div class="loginfast"><a href="#/loginsign/loginfast">验证码快速登录</a></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "logindefault",
        data() {
            return {
                tel:"",
                password:"",
                telclass:"",
                telmsg:"请输入手机号",
                wordclass:"",
                wordmsg:"请输入密码"
            }
        },
        methods: {
            login(loginName,password) {
                let _this = this;
                let f = new FormData();
                f.append("loginName",loginName);
                f.append("password",password);
                this.$http
                    .post("api/v1/oto/user/login/password",f)
                    .then(function(res){
                        if(res.data.code===0){
                            localStorage.setItem('userId', res.data.data.userId);
                            localStorage.setItem('storeId', res.data.data.storeId);
                            localStorage.setItem('applyId', res.data.data.applyId);
                            _this.$router.push({name:"index"});
                        }else{
                            _this.telclass="error";
                            _this.telmsg = res.data.msg;
                        }
                    })
                    .catch(function (err) {

                    });
            },
            telfocus() {
                this.telclass = "";
            },
            wordfocus(){
                this.wordclass="";
            },
            tologin(){
                if(this.tel===''){
                    this.telclass="error";
                    this.telmsg="请输入登录手机号";
                    return;
                }
                if(this.password===""){
                    this.wordclass="error";
                    this.wordmsg= "请输入密码";
                    return;
                }
                this.login(this.tel,this.password);
            }
        }
    }
</script>
<style lang="less">

</style>
