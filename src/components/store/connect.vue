<template>
    <div class="connect">
        <div class="managebox">
            <ul>
                <li @click="setMobilePhone()">
                    <div class="left">手机号码</div>
                    <div class="right">{{mobilephone}}</div>
                </li>
                <li @click="setTel()">
                    <div class="left">座机号码</div>
                    <!--<div class="right">{{tel||'未设置'}}</div>-->
                    <div class="right">
                        <input type="text" class="qu" maxlength="4" placeholder="区号" v-model="qu"> - <input class="hao" maxlength="8" placeholder="电话" type="text" v-model="hao">
                    </div>
                </li>
            </ul>
        </div>
        <div class="btnbox">
            <div class="btn" @click="save()">保存</div>
        </div>
        <show-prompt v-bind:propdata="propdata"></show-prompt>
    </div>
</template>
<script>
    import ShowPrompt from "./prompt.vue";
    import gfun from "../../assets/js/data";
    import {state} from '../../assets/js/state';
    import m from "../../assets/js/msg";

    export default {
        name: "connect",
        data() {
            return {
                propdata: {},
                mobilephone: "",
                tel: "",
                qu: "",
                hao: "",
            }
        },
        components: {ShowPrompt},
        mounted() {
            let _this = this;
            let storePhone = this.$route.params.storePhone;
            let telPhone = this.$route.params.telPhone;
            this.tel = telPhone;
            if (telPhone) {
                this.qu = telPhone.split('-')[0];
                this.hao = telPhone.split('-')[1];
            }
            this.mobilephone = storePhone;
            state.$on("promptevent", function (res) {
                if (res === 'cancelprompt') {
                    _this.propdata.show = false;
                } else {
                    if (res.val === '') {
                        _this.propdata.show = false;
                    } else {
                        if (res.strid === "mobilephone") {
                            if (gfun.checkMobile(res.val)) {
                                _this.mobilephone = res.val;
                            } else {
                                m("手机号格式不对,请重新输入");
                            }
                        }else if(res.strid==='tel'){
                            var hao = res.valHao,
                                qu = res.valQu;
                            let tel = qu +'-'+ hao;
                            if(gfun.checkTel(tel)){
                                _this.qu=res.valQu;
                                _this.hao=res.valHao;
                            }else{
                                m("座机号格式不对,请重新输入");
                            }
                        }
                        _this.propdata.show = false;
                    }
                }
            })
        },
        methods: {
            setMobilePhone() {
                let _this = this;
                _this.propdata = {
                    show: true,
                    title: "手机号码",
                    type: "input",
                    initval: _this.mobilephone,
                    strid: "mobilephone",
                    fontSize:11,
                    placeholder: "请输入手机号"
                }
            },
            setTel() {
                let _this = this;
                _this.propdata = {
                    show: true,
                    title: "座机号码",
                    type: "inputPlane",
                    strid: "tel",
                    initvalQu: _this.qu,
                    initvalHao: _this.hao,
                    fontSize:12,
                    placeholder: "请输入座机号"
                }
            },
            save() {
                let _this = this;
                if(this.qu || this.hao){
                    let tel = this.qu +'-'+ this.hao;
                    if (gfun.checkTel(tel)) {
                        _this.tel = tel;
                    } else {
                        m("座机号格式不正确");
                        return;
                    }
                }else{
                    _this.tel = '';
                }
                this.$http
                    .post('api/v1/oto/store/setStoreContact', {
                        storeId: localStorage.getItem("storeId"),
                        phone: _this.mobilephone,
                        telPhone: _this.tel
                    })
                    .then(function (res) {
                        if (res.data.code === 0) {
                            m('联系方式修改成功');
                            _this.$router.go(-1);
                        }else{
                            m(res.data.msg);
                        }
                    })
            }
        }

    }
</script>
<style lang="less">
    .connect {
        @size: 37.5;
        .managebox {
            ul {
                margin-top: 10rem/@size;
                background-color: #fff;
                li {
                    height: 54rem/@size;
                    line-height: 54rem/@size;
                    color: #1a1a1a;
                    margin-left: 20rem/@size;
                    padding-right: 15rem/@size;
                    border-bottom: 1px solid #f5f5f5;
                    .left {
                        font-size: 15rem/@size;
                        float: left;
                    }
                    .right {
                        font-size: 14rem/@size;
                        /*font-weight: 700;*/
                        float: right;
                        background-image: url("../../assets/images/ic_arrow.png");
                        background-position: right center;
                        background-size: 16rem/@size;
                        background-repeat: no-repeat;
                        padding-right: 20rem/@size;
                        color: #1a1a1a;
                        &.noarr {
                            background: none;
                            padding-right: 0;
                        }
                        input{
                            margin: 0;
                            padding: 0;
                            height: 100%;
                            border: none;
                            font-weight: 700;
                            color: #1a1a1a;
                            text-align: right;
                            font-size: 14rem/@size;
                            &.qu{
                                width: 30rem/@size;
                            }
                            &.hao{
                                width: 64rem/@size;
                            }
                            &::placeholder{
                                color: #d5d5d5;
                            }
                        }
                    }
                }
            }
        }
        .btnbox {
            position: fixed;
            width: 100%;
            bottom: 0;
            left: 0;
            .btn {
                margin: 20rem/@size;
                background-color: #1a1a1a;
                text-align: center;
                height: 50rem/@size;
                line-height: 50rem/@size;
                color: #fff;
                font-size: 14rem/@size;
            }
        }
    }
</style>
