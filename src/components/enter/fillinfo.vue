<template>
    <div class="fillinfo">
        <div class="fillhead">
            <div class="step step1">
                <div class="number">1</div>
                <div class="font">填写信息</div>
                <div class="triangle-up"></div>
            </div>
            <div class="step step2">
                <div class="number">2</div>
                <div class="font">提交资质</div>
            </div>
        </div>
        <div class="infolist">
            <ul>
                <li>
                    <div class="title">商户名称</div>
                    <div class="putbox"><input type="text" placeholder="请输入商户名称" maxlength="15" v-model="storeName"
                                               @input="seveInfo()"></div>
                </li>
                <li>
                    <div class="title">服务类型</div>
                    <a href="#/enter/servers" class="selectbox"
                       :class="serviceTypeName?'hasval':''">{{serviceTypeName || '选择'}}</a>
                </li>
                <li>
                    <div class="title">商家地址</div>
                    <div class="selectbox" :class="geostr?'hasval':''" @click="pickergeo()">{{geostr || '选择'}}</div>
                </li>
                <li>
                    <div class="title">详细街道</div>
                    <div class="putbox"><input type="text" placeholder="请输入详细街道信息" v-model="storeAddress"
                                               @input="seveInfo()"></div>
                </li>
            </ul>
            <div class="spech"></div>
            <ul>
                <li>
                    <div class="title">手机号码</div>
                    <div class="putbox"><input maxlength="11" type="tel" placeholder="输入商户联系方式，必填" v-model="phone"
                                               @input="seveInfo()"></div>
                </li>
                <li class="noborder">
                    <div class="title">座机号码</div>
                    <div class="putbox">
                        <input type="tel" maxlength="4" class="quhao" placeholder="区号" v-model="telephone1"
                               @input="seveInfo()">

                        <div class="spand"> - </div>

                        <input type="tel" maxlength="8" class="telphone" placeholder="电话" v-model="telephone2"
                               @input="seveInfo()">
                    </div>
                </li>
            </ul>
        </div>
        <!--店铺简介-->
        <div class="addimg">
            <div class="title left" ><span>添加店铺简介</span></div>
            <div class="introduce">
                <textarea name="" id="" maxlength="30" @input="seveInfo()" v-model="introduce"></textarea>
            </div>
            <div class="fontnumber">最多30字</div>
        </div>
        <!-- 添加图片 -->
        <div class="addimg">
            <div class="title">添加门店图片</div>
            <ul>
                <li>
                    <div class="itemf">门店招牌图片 <span> 最多5张</span></div>
                    <div class="imglist">
                        <div class="itemimg" v-for="(item,ind) in storeImgUlr">
                            <img :src="item" alt="">
                            <div class="close" @click="removeImg(ind)"></div>
                        </div>
                        <div class="itemimg" v-show="storeImgUlr.length<5">
                            <input type="file" name="file" id="file0" @change="upstoreimg('file0')"/>
                        </div>
                        <div class="clear"></div>
                    </div>
                </li>
                <li>
                    <div class="itemf">门店环境图片 <span>(选填) 最多10张</span></div>
                    <div class="imglist">
                        <div class="itemimg" v-for="(item,index) in storeEnvironmentImagesUrl">
                            <img :src="item" alt="">
                            <div class="close" @click="removeImghack(index)"></div>
                        </div>
                        <div class="itemimg" v-show="storeEnvironmentImagesUrl.length<10">
                            <input type="file" name="file" id="file1" @change="uphackimg('file1')"/>
                        </div>
                        <div class="clear"></div>
                    </div>
                </li>
            </ul>
        </div>
        <!--底部-->
        <div class="footbtn">
            <div class="accpt" :class="accpt?'active':''">
                <span @click="changeAccpt()"></span>我已阅读并同意 <a href="#/enter/arg">《一生约平台商家入驻协议》</a>
            </div>
            <div class="next" :class="cannext?'':'disabled'" @click="gonext()">下一步</div>
        </div>
    </div>
</template>
<script>
    import {state} from "../../assets/js/state"
    import phonereg from "../../assets/js/data"
    import msg from "../../assets/js/msg"

    export default {
        name: "fillinfo",
        data() {
            return {
                accpt: false,
                serviceTypeName: "",
                storeName: '',
                phone: "",
                telephone: "",
                telephone1: "",
                telephone2: "",
                imgfiles: "",
                geostr: "",
                storeAddress: "",
                storeImgUlr: [],
                storeEnvironmentImagesUrl: [],
                cannext: false,
                introduce: "",
            }
        },
        mounted() {
            let _this = this;
            //数据回填
            if (this.enterdata.serviceTypeName) {
                this.serviceTypeName = this.enterdata.serviceTypeName;
            }
            if (this.enterdata.geoStr) {
                this.geostr = this.enterdata.geoStr;
            }
            this.phone = this.enterdata.phone;
            this.accpt = this.enterdata.accpt;
            this.storeName = this.enterdata.storeName;
            this.introduce = this.enterdata.introduce;
            this.telephone1 = this.enterdata.telephone1;
            this.telephone2 = this.enterdata.telephone2;
            this.storeImgUlr = this.enterdata.storeImgUlr;
            this.storeAddress = this.enterdata.storeAddress;
            this.storeEnvironmentImagesUrl = this.enterdata.storeEnvironmentImagesUrl;
            this.checkInputall();
            state.$on("pickerselect", function (res) {
                _this.geostr = res;
            })
        },
        components: {},
        methods: {
            //表单有输入的时候保存到全局
            seveInfo() {
                this.enterdata.storeName = this.storeName;
                this.enterdata.phone = this.phone;
                this.enterdata.storeAddress = this.storeAddress;
                this.enterdata.telephone1 = this.telephone1;
                this.enterdata.telephone2 = this.telephone2;
                this.enterdata.introduce = this.introduce;
                this.checkInputall();
            },
            //上传招牌图片
            upstoreimg(id) {
                let _this = this;
                this.uploadimg(id, function (res) {
                    res.forEach(function (t) {
                        _this.storeImgUlr.push(t.imageUrl);
                        _this.enterdata.storeImages.push(t.key);
                    });

                    _this.checkInputall();
                });
            },
            //同意协议
            changeAccpt() {
                this.accpt = !this.accpt;
                this.enterdata.accpt = !this.enterdata.accpt;
                this.checkInputall();
            },
            //上传环境图片
            uphackimg(id) {
                let _this = this;
                this.uploadimg(id, function (res) {
                    res.forEach(function (t) {
                        _this.storeEnvironmentImagesUrl.push(t.imageUrl);
                        _this.enterdata.storeEnvironmentImages.push(t.key);
                    })
                });
            },
            //触发地址选择
            pickergeo() {
                state.$emit("picker", "");
            },
            //下一步
            gonext() {
                let _this = this;
                if (this.cannext) {
                    function next() {
                        _this.validateAddress(_this.storeAddress, function (lng, lat) {
                            _this.enterdata.lng = lng;
                            _this.enterdata.lat = lat;
                            _this.$router.push({name: "fillapt"})
                        })
                    }

                    //验证手机号
                    if (!phonereg.checkMobile(_this.phone)) {
                        msg("手机号格式不正确");
                        return;
                    }
                    //验证座机号
                    if (_this.telephone1 || _this.telephone2) {
                        if (!phonereg.checkTel(_this.telephone1 + '-' + _this.telephone2)) {
                            msg("座机号格式不正确");
                            return false;
                        } else {
                            next();
                        }
                    } else {
                        next();
                    }

                }
            },
            //删除招牌上传的图片
            removeImg(index) {
                this.storeImgUlr.splice(index, 1);
                this.enterdata.storeImages.splice(index, 1);
                this.checkInputall();
            },
            //删除环境图片
            removeImghack(index) {
                this.storeEnvironmentImagesUrl.splice(index, 1);
                this.enterdata.storeEnvironmentImages.splice(index, 1);
            },
            //检验必填项是否都已经填完
            checkInputall() {
                let _this = this;
                let innercheck = function () {
                    if (_this.storeName === '') {
                        console.log("请填写店铺名称");
                        return false;
                    }
                    if (_this.enterdata.serviceTypeId === '') {
                        console.log("请选择服务类型");
                        return false;
                    }
                    if (_this.geostr === "") {
                        console.log("请选择地址");
                        return false;
                    }
                    if (_this.storeAddress === "") {
                        console.log("请填写详细地址");
                        return false;
                    }
                    if (_this.phone === "") {
                        console.log("请填写手机号");
                        return false;
                    }
                    if (_this.storeImgUlr.length < 1) {
                        console.log("至少上传一张店铺图片");
                        return false;
                    }
                    if (_this.accpt === false) {
                        console.log("请同意协议");
                        return false;
                    }
                    console.log("通过");
                    return true;
                };
                if (innercheck()) {
                    this.cannext = true;
                } else {
                    this.cannext = false;
                }
            },
            //检验地址有效性
            validateAddress(address, cb) {
                this.$http.get('api/v1/oto/validateAddress?address=' + address)
                    .then(function (res) {
                        if (res.data.data) {
                            cb(res.data.data.lng, res.data.data.lat);
                        } else {
                            msg('详细街道地址不合法');
                        }
                    })
            }
        }
    }
</script>
<style lang="less">
    .fillinfo {
        @size: 37.5;
        .left{
            clear: both;
            text-align: left;
        }
        .noborder{
            border-bottom: none!important;
        }
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
                &.step1 {
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
                &.step2 {
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
        .infolist {
            .spech {
                height: 10rem/@size;
                background-color: #f5f5f5;
            }
            ul {
                margin-bottom: -1px;
                li {
                    border-bottom: 1px solid #DFE4E6;
                    margin-left: 15rem/@size;
                    height: 44rem/@size;
                    line-height: 44rem/@size;
                    .title {
                        font-size: 15px;
                        color: #3A3A3A;
                        float: left;
                        margin-right: 25rem/@size;
                    }
                    .putbox {
                        float: left;
                        .spand {
                            font-size: 18rem/@size;
                            color: #333;
                            display: inline-block;
                            padding: 0 5px;
                            vertical-align: top;
                        }
                        input {
                            vertical-align: middle;
                            border: none;
                            width: 6rem;
                            font-size: 15rem/@size;
                            height: 24rem/@size;
                            line-height: 24rem/@size;
                            margin: 10rem/@size 0;
                            display: block;
                            padding: 0;
                            color: #333333;
                            &.quhao {
                                width: 36rem/@size;
                                display: inline-block;

                            }
                            &.telphone {
                                width: 100rem/@size;
                                display: inline-block;
                            }

                            &::placeholder {
                                color: #cccccc;
                            }
                        }
                    }
                    .selectbox {
                        float: right;
                        text-align: right;
                        width: 6rem;
                        margin-right: 12rem/@size;
                        padding-right: 20rem/@size;
                        font-size: 14rem/@size;
                        color: #AAB4BE;
                        background-image: url("../../assets/images/ic_arrow.png");
                        background-size: 16rem/@size;
                        background-repeat: no-repeat;
                        background-position: right center;
                    }
                    .hasval {
                        color: #333333;
                        font-size: 14rem/@size;
                    }

                }
            }
        }
        .addimg {
            .title {
                background-color: #f6f6f6;
                font-size: 13rem/@size;
                color: #9B9B9B;
                line-height: 38rem/@size;
                height: 38rem/@size;
                padding: 0 15rem/@size;
                border-top: 1px solid #fff;
            }
            .introduce {
                margin: 10rem/@size 13rem/@size;
                textarea {
                    border: none;
                    display: block;
                    font-size: 15rem/@size;
                    color: #4a4a4a;
                    resize: none;
                    width: 100%;
                    height: 60rem/@size;
                }
            }
            .fontnumber {
                font-size: 12rem/@size;
                color: #9B9B9B;
                padding: 10rem/@size;
                text-align: right;
            }
            ul {
                margin-bottom: -1px;
                li {
                    margin: 12rem/@size 0rem/@size 0rem/@size 15rem/@size;
                    border-bottom: 1px solid #DFE4E6;
                    .itemf {
                        font-size: 15rem/@size;
                        color: #3C3C3C;
                        margin-bottom: 15rem/@size;

                        span {
                            ont-size: 12rem/@size;
                            color: #9B9B9B;
                        }
                    }
                    .imglist {
                        .itemimg {
                            height: 60rem/@size;
                            width: 60rem/@size;
                            background-image: url("../../assets/images/btn_add_img.png");
                            background-size: cover;
                            position: relative;
                            float: left;
                            margin-right: 10rem/@size;
                            margin-bottom: 15rem/@size;
                            input {
                                display: block;
                                height: 100%;
                                width: 100%;
                                opacity: 0;
                            }
                            .close {
                                position: absolute;
                                height: 12rem/@size;
                                width: 12rem/@size;
                                background-image: url("../../assets/images/btn_close.png");
                                top: -4rem/@size;
                                right: -4rem/@size;
                                background-size: cover;
                            }
                            img {
                                height: 100%;
                                width: 100%;
                            }
                        }
                    }
                }
            }
        }
        .footbtn {
            background-color: #f6f6f6;
            border-top: 1px solid #DFE4E6;
            text-align: center;
            .accpt {
                font-size: 12rem/@size;
                color: #999999;
                margin-top: 40rem/@size;
                padding-top: 4rem/@size;
                display: inline-block;
                background-image: url("../../assets/images/ic_selecte_mull.png");
                background-size: 16rem/@size;
                background-repeat: no-repeat;
                background-position: left center;
                &.active {
                    background-image: url("../../assets/images/ic_selected.png");
                }
                a {
                    font-size: 12rem/@size;
                    color: #3B55E6;
                }
                span {
                    padding: 8rem/@size 15rem/@size;
                }
            }
            .next {
                margin: 12rem/@size 20rem/@size 25rem/@size 20rem/@size;
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
    }
</style>
