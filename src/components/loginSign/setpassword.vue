<template>
    <div class="logindefault setpassword">
        <div class="contaibox">
            <div class="header">
                <img src="../../assets/images/ic_logo_small.png" alt="">
                <div class="title">设置密码</div>
            </div>
            <div class="formbox">
                <div class="formitem">
                    <div class="atitle">登录密码</div>
                    <div class="ainput">
                        <input type="password" maxlength="11" placeholder="请设置你的登录密码" v-model="pass1">
                    </div>
                </div>
                <div class="formitem">
                    <div class="atitle" :class="passclass">{{passclass===''?'确定密码':passerrmsg}}</div>
                    <div class="ainput">
                        <input type="password" placeholder="请再次输入你的登录密码" v-model="pass2" @focus="passfocus()">
                    </div>
                    <div class="btn" @click="submit()">完成</div>
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
    export default {
        name: "setpassword",
        data() {
            return {
                passclass:"",
                passerrmsg:"请输入密码",
                pass1:"",
                pass2:""
            }
        },
        mounted(){
            let tel = this.$route.params.tel;
            let code = this.$route.params.code;
            if(tel&&code){

            }else{
                this.$router.push({name:"register"})
            }


        },
        methods:{
            register(tel, password, code) {
                let _this = this;
                this.$http.post('api/v1/oto/user/register', {
                    "loginName": tel,
                    "password": password,
                    "verifyCode": code
                })
                    .then(function (res) {
                        if(res.data.code===0){
                            _this.$router.push({name:"logindefault"})
                        }else{
                            _this.passclass="error";
                            _this.passerrmsg=res.data.msg;
                        }
                    })
                    .catch(function (err) {

                    })
            },
            submit(){
                if(this.pass1===''||this.pass2===''){
                    this.passclass="error";
                    this.passerrmsg="请输入密码";
                    return;
                }
                if(this.pass1!=this.pass2){
                    this.passclass="error";
                    this.passerrmsg="两次密码不一致，重新输入";
                    return;
                }
                let tel = this.$route.params.tel;
                let code = this.$route.params.code;
                this.register(tel,this.pass1,code);
            },
            passfocus(){
                this.passclass="";
            }
        }
    }
</script>
<style lang="less">
    .setpassword{
        @size: 37.5;
        .contaibox {
            .loginfast {
                a {
                    text-decoration: underline;
                }
            }
        }
    }
</style>
