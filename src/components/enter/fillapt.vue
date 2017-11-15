<template>
    <div class="fillapt">
        <div class="fillhead">
            <div class="step step1">
                <div class="number">1</div>
                <div class="font">填写信息</div>
            </div>
            <div class="step step2">
                <div class="number">2</div>
                <div class="font">提交资质</div>
                <div class="triangle-up"></div>
            </div>
        </div>
        <div class="baseinfo">
            <ul>
                <li>
                    <div class="title">营业执照注册号</div>
                    <div class="inputbox">
                        <input type="text" maxlength="18" placeholder="输入营业执照号码，必填" v-model="businessCertificateNum"
                               @input="saveInfo()">
                    </div>
                    <div class="clear"></div>
                </li>
                <li>
                    <div class="title">身份证姓名</div>
                    <div class="inputbox">
                        <input type="text" maxlength="15" placeholder="输入身份证姓名，必填" v-model="storeOwnerName"
                               @input="saveInfo()">
                    </div>
                    <div class="clear"></div>
                </li>
                <li>
                    <div class="title">身份证号码</div>
                    <div class="inputbox">
                        <input type="text" maxlength="18" placeholder="输入身份证号码，必填" v-model="storeOwnerIDCard"
                               @input="saveInfo()">
                    </div>
                    <div class="clear"></div>
                </li>
            </ul>
        </div>
        <div class="spec"></div>
        <div class="baseimg">
            <div class="itemlist">
                <div class="title"><span>*</span>上传本人身份证</div>
                <div class="imglist">
                    <img class="addicon" src="../../assets/images/btn_add.png" alt="">
                    <div class="innerfont">身份证正面照片</div>
                    <div class="uploaded" v-show="idCardImagesUrl1"><img :src="idCardImagesUrl1" alt=""></div>
                    <input type="file" id="f1" @change="upsfzimg('f1')">
                </div>
                <div class="imglist">
                    <img class="addicon" src="../../assets/images/btn_add.png" alt="">
                    <div class="innerfont">身份证背面照片</div>
                    <div class="uploaded" v-show="idCardImagesUrl2"><img :src="idCardImagesUrl2" alt=""></div>
                    <input type="file" id="f2" @change="upsfzimg('f2')">
                </div>
                <div class="bottomtips">*仅作为真实身份核实使用</div>

            </div>
            <div class="itemlist">
                <div class="title"><span>*</span>上传店铺营业执照</div>
                <div class="imglist">
                    <img class="addicon" src="../../assets/images/btn_add.png" alt="">
                    <div class="innerfont">营业执照</div>
                    <div class="uploaded" v-show="businessCertificateImagesUrl"><img :src="businessCertificateImagesUrl"
                                                                                     alt=""></div>
                    <input type="file" id="f3" @change="upsfzimg('f3')">

                </div>
                <div class="bottomtips">*仅作为真实身份核实使用</div>
            </div>
        </div>
        <div class="footbtn">
            <div class="next" :class="cansubmit?'':'disabled'" @click="submit()">提交</div>
        </div>

        <!-- 结果提示成功 -->
        <div class="pop" v-if="showpop===1">
            <div class="popcell">
                <div class="popinner">
                    <img src="../../assets/images/ic_succeed.png" alt="">
                    <div class="thismsg">资料提交成功</div>
                </div>
            </div>
        </div>

        <!-- 结果提示失败 -->
        <div class="pop" v-if="showpop===-1">
            <div class="popcell">
                <div class="popinner">
                    <img src="../../assets/images/ic_fail.png" alt="">
                    <div class="thismsg fail">资料提交失败</div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>

    import g from "../../assets/js/enter";
    import m from "../../assets/js/msg";

    export default {
        name: "fillinfo",
        data() {
            return {
                accpt: false,
                showpop: 0,
                businessCertificateNum: "",
                storeOwnerIDCard: "",
                cansubmit: false,
                idCardImagesUrl1: '',
                idCardImagesUrl2: '',
                businessCertificateImagesUrl: '',
                storeOwnerName: ''
            }
        },
        mounted() {
            this.businessCertificateNum = g.businessCertificateNum;
            this.storeOwnerName = g.storeOwnerName;
            this.storeOwnerIDCard = g.storeOwnerIDCard;
            this.idCardImagesUrl1 = g.idCardImagesUrl1;
            this.idCardImagesUrl2 = g.idCardImagesUrl2;
            this.businessCertificateImagesUrl = g.businessCertificateImagesUrl;
            this.checkall();
        },
        methods: {
            saveInfo() {
                this.enterdata.businessCertificateNum = this.businessCertificateNum;
                this.enterdata.storeOwnerIDCard = this.storeOwnerIDCard;
                this.enterdata.storeOwnerName = this.storeOwnerName;
                this.checkall();
            },
            submit() {
                let _this = this;
                if (this.cansubmit) {
                    //提交审核前把地址存放本地 备用
                    localStorage.setItem('storeAddress', g.geoStr + g.storeAddress);
                    let userId = localStorage.getItem("userId");
                    let postdata = JSON.stringify(this.enterdata);
                    postdata = JSON.parse(postdata);
                    postdata.userId = userId;
                    if (postdata.telephone1 && postdata.telephone2) {
                        postdata.telephone = postdata.telephone1 + '-' + postdata.telephone2;
                    } else {
                        postdata.telephone = '';
                    }
                    delete postdata.serviceTypeName;
                    delete postdata.geoStr;
                    delete postdata.storeImgUlr;
                    delete postdata.storeEnvironmentImagesUrl;
                    delete postdata.accpt;
                    delete postdata.businessCertificateImagesUrl;
                    delete postdata.idCardImagesUrl1;
                    delete postdata.idCardImagesUrl2;
                    delete postdata.telephone1;
                    delete postdata.telephone2;
                    console.log(postdata);
                    this.$http.post('api/v1/oto/storeApply', postdata)
                        .then(function (res) {
                            if (res.data.code === 0) {

                                _this.showpop = 1;
                                setTimeout(function () {
                                    _this.$router.push({name: "index"});
                                }, 1200);
                            } else {
                                m(res.data.msg);
                            }
                        })
                }
            },
            //上传身份证
            upsfzimg(id) {
                let _this = this;
                this.uploadimg(id, function (res) {
                    res = res[0];
                    if (id === 'f1') {
                        _this.idCardImagesUrl1 = res.imageUrl;
                        g.idCardImagesUrl1 = res.imageUrl;
                        g.idCardImages[0] = res.key;
                    }
                    if (id === 'f2') {
                        _this.idCardImagesUrl2 = res.imageUrl;
                        g.idCardImagesUrl2 = res.imageUrl;
                        g.idCardImages[1] = res.key;
                    }
                    if (id === 'f3') {
                        _this.businessCertificateImagesUrl = res.imageUrl;
                        g.businessCertificateImagesUrl = res.imageUrl;
                        g.businessCertificateImages[0] = res.key;
                    }
                    _this.checkall();
                })
            },
            //表单验证
            checkall() {
                let _this = this;
                let innercheck = function () {
                    if (_this.businessCertificateNum === '') {
                        console.log("营业执照号没写");
                        return false;
                    }
                    if (_this.storeOwnerName === '') {
                        console.log("身份证姓名没写");
                        return false;
                    }
                    if (_this.storeOwnerIDCard === '') {
                        console.log("身份证号没写");
                        return false;
                    }
                    if (_this.idCardImagesUrl1 === '') {
                        console.log("正面没传");
                        return false;
                    }
                    if (_this.idCardImagesUrl2 === '') {
                        console.log("背面没传");
                        return false;
                    }
                    if (_this.businessCertificateImagesUrl == '') {
                        console.log("执照没传");
                        return false;
                    }
                    return true;
                };
                if (innercheck()) {
                    this.cansubmit = true;
                } else {
                    this.cansubmit = false;
                }
            }
        }
    }
</script>
<style lang="less">
    .fillapt {
        @size: 37.5;
        .fillhead {
            height: 100rem/@size;
            background-color: #3B55E6;
            overflow: hidden;
            .step {
                float: left;
                width: 50%;
                color: #fff;
                text-align: center;
                margin: 16rem/@size 0;
                .font {
                    font-size: 15rem/@size;
                    line-height: 36rem/@size;
                }
                .triangle-up {
                    width: 0;
                    height: 0;
                    border-left: 4rem/@size solid transparent;
                    border-right: 4rem/@size solid transparent;
                    border-bottom: 6rem/@size solid #fff;
                    margin: auto;
                    position: relative;
                    bottom: -6rem/@size;
                }
                &.step2 {
                    .number {
                        width: 36rem/@size;
                        height: 36rem/@size;
                        background-color: #fff;
                        color: #3B55E6;
                        font-size: 20rem/@size;
                        line-height: 36rem/@size;
                        margin: auto;
                        border-radius: 100%;
                    }
                }
                &.step1 {
                    .number {
                        width: 36rem/@size;
                        height: 36rem/@size;
                        font-size: 20rem/@size;
                        line-height: 36rem/@size;
                        margin: auto;
                    }
                    .font {
                        color: #9AB4FF;
                    }
                }
            }
        }
        .baseinfo {
            ul {
                margin-bottom: -1px;
                li {
                    margin-left: 20rem/@size;
                    padding-right: 15rem/@size;
                    border-bottom: 1px solid #F6F6F6;

                    .title {
                        font-size: 15px;
                        color: #1A1A1A;
                        float: left;
                        line-height: 54rem/@size;
                    }
                    .inputbox {
                        float: right;
                        input {
                            width: 5rem;
                            display: block;
                            border: none;
                            height: 23rem/@size;
                            margin: 15rem/@size 0;
                            text-align: right;
                            font-size: 15rem/@size;
                            &::placeholder {
                                color: #cccccc;
                            }
                        }
                    }
                }
            }
        }
        .spec {
            background-color: #f6f6f6;
            height: 10rem/@size;
        }
        .baseimg {
            .itemlist {
                margin: 10rem/@size 0 20rem/@size 15rem/@size;
                .title {
                    font-size: 15rem/@size;
                    color: #3C3C3C;
                    span {
                        color: #F15949;
                        padding-right: 10rem/@size;
                        vertical-align: bottom;
                    }
                }
                .imglist {
                    width: 150rem/@size;
                    height: 95rem/@size;
                    border-radius: 6px;
                    display: inline-block;
                    background: #F9F9F9;
                    border: 1px solid #DCDCDC;
                    margin: 18rem/@size 0rem/@size 0rem/@size 12rem/@size;
                    text-align: center;
                    position: relative;
                    input {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        top: 0;
                        left: 0;
                        opacity: 0;
                    }
                    .innerfont {
                        font-size: 12rem/@size;
                        text-align: center;
                        color: #4A4A4A;
                    }
                    .addicon {
                        width: 27rem/@size;
                        margin-top: 20rem/@size;
                    }
                    .uploaded {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        top: 0;
                        left: 0;
                        img {
                            height: 100%;
                            width: 100%;
                            border-radius: 6px;
                        }
                    }
                }
                .bottomtips {
                    font-size: 12rem/@size;
                    color: #F15949;
                    padding: 6rem/@size 10rem/@size;
                }
            }
        }
        .footbtn {
            background-color: #f6f6f6;
            border-top: 1px solid #DFE4E6;
            text-align: center;
            padding-bottom: 20rem/@size;
            .next {
                margin: 34rem/@size 20rem/@size 5rem/@size 20rem/@size;
                height: 50rem/@size;
                background-color: #1a1a1a;
                text-align: center;
                color: #fff;
                line-height: 50rem/@size;
                font-size: 14rem/@size;
            }
            .disabled {
                background-color: #e3e3e3;
                color: #c0c0c0;
            }
        }
        .pop {
            position: fixed;
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.4);
            display: table;
            .popcell {
                display: table-cell;
                vertical-align: middle;
                .popinner {
                    width: 270rem/@size;
                    margin: 0 auto;
                    background-color: #fff;
                    border-radius: 6px;
                    text-align: center;
                    padding: 30rem/@size 0;
                    .thismsg {
                        font-size: 17rem/@size;
                        color: #00BD21;
                        &.fail {
                            color: #F15949;
                        }
                    }
                    img {
                        width: 40rem/@size;
                        height: auto;
                        margin-bottom: 10rem/@size;
                    }
                }
            }
        }
    }
</style>
