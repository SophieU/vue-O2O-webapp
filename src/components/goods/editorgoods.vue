<template>
    <div class="addgoods">

        <!-- 品类选择 -->
        <div class="type" @click="toplist()">
            <p class="left">品类</p>
            <p class="right1" :class="categoryName===''?'':'have'">{{categoryName || '未选择'}}</p>
        </div>

        <!-- 主图 -->
        <div class="imgthumb">
            <div class="head">
                <span class="title">商品图片</span>
                <span class="maxnum">最多五张</span>
            </div>
            <div class="content clearfix">
                <ul>
                    <li draggable="true" v-for="(item,ind) in imagesUrl">
                        <img class="main" :src="item.url"/>
                        <img class="close" @click="removeimg(ind)" src="../../assets/images/btn_close.png"/>
                    </li>
                    <li v-show="imagesUrl.length<5">
                        <img class="main" src="../../assets/images/btn_add_img.png"/>
                        <input type="file" id="addfile" @change="upnewfile('addfile')" multiple="multiple"
                               accept="image/gif, image/jpeg,image/jpg,image/png">
                    </li>
                </ul>
            </div>
        </div>

        <!-- 标题 -->
        <div class="titlethumb clearfix">
            <p class="title">商品标题</p>
            <input class="contentInfo" type="text" placeholder="请输入商品标题" @input="savedata()" maxlength="20"
                   v-model="productTitle"/>
        </div>

        <!-- 描述 -->
        <div class="describe clearfix">
            <textarea class="clearfix" maxlength="30" placeholder="给商品写个好描述吧~" @input="savedata()"
                      v-model="productJingle"></textarea>
            <span>最多30字</span>
        </div>

        <!-- 价格 -->
        <div class="priceInventory">
            <div class="price">
                <p class="titles">价格</p>
                <div class="pricerem" v-show="productPrice">元</div>
                <input type="text" class="priceInput" value="" v-model="productPrice" @input="savedata()"
                       placeholder="在此输入商品价格" @keyup="clearNoNum()" maxlength="10"/>

            </div>
        </div>

        <!-- 是否开启预约 -->
        <ul class="appointmentbox">
            <div class="type">
                <p class="left">需要预约</p>
                <p class="swith" @click="changeAppoint()">
                    <span class="fontg">{{needReserve === 'Y' ? '开' : '关'}}</span>
                    <span class="swithbox" :class="needReserve==='Y'?'acgive':''">
                    <span class="inneritem"></span>
                </span>
                </p>
            </div>
            <li class="type" v-show="needReserve==='Y'">
                <div class="left">需要我确认下单</div>
                <div class="right">
                    <div class="radio" @click="makesurefun('Y')" :class="needConfirmValid==='Y'?'active':''">
                        <span class="radioitem">
                            <span class="radioinner"></span>
                        </span>
                        <span class="radiofont">是</span>
                    </div>

                    <div class="radio" @click="makesurefun('N')" :class="needConfirmValid==='Y'?'':'active'">
                        <span class="radioitem">
                            <span class="radioinner"></span>
                        </span>
                        <span class="radiofont">否</span>
                    </div>
                </div>
            </li>
            <li class="type" v-show="needReserve==='Y'">
                <div class="left">可预约时间</div>
                <p class="right1" :class="reserveChange?'have':''" @click="pionttime()">{{reserveChange ? '已选择' : '默认时间'}}</p>
            </li>
        </ul>

        <!-- 添加图文描述 -->
        <div class="type">
            <p class="left">商品图文描述</p>
            <p class="right1" :class="productDescribe===''?'':'have'" @click="toadddes()">
                {{productDescribe === '' ? '未添加' : '已添加'}}</p>
        </div>

        <!-- 暂停预约 -->
        <div class="type" v-show="needReserve==='Y'">
            <p class="left">暂停预约</p>
            <p class="swith" @click="changeStop()">
                <span class="fontg">{{canReserve === 'Y' ? '开' : '关'}}</span>
                <span class="swithbox" :class="canReserve==='Y'?'acgive':''">
                    <span class="inneritem"></span>
                </span>
            </p>
        </div>

        <!-- 底部操作按妞 -->
        <div class="btns clearfix">
            <div @click="gopreview()" class="preview">
                <img src="../../assets/images/ic_yulan.png"/>
                <span>预览</span>
            </div>
            <button class="save" type="button" @click="addgoods(0)">保存</button>
            <button v-show="productState==0" class="putaway" type="button" @click="addgoods(1)">上架出售</button>
            <button v-show="productState==1" class="putaway" type="button" @click="soldout()">下架商品</button>
        </div>

    </div>
</template>
<script>
    import g from "../../assets/js/geditor";
    import msg from "../../assets/js/msg";

    export default {
        name: "editgoods",
        data() {
            return {
                storeId: g.storeId,               //店铺id
                categoryId: g.categoryId,         //品类id
                categoryName: g.categoryName,     //品类名称
                productTitle: g.productTitle,     //商品名称
                productJingle: g.productJingle,   //副标题
                productPrice: g.productPrice,     //价格
                needReserve: g.needReserve,       //是否需要预约
                needConfirmValid: g.needConfirmValid, //预约需要确认
                reserveWeek: g.reserveWeek,       //预约星期
                reserveBeginTime: g.reserveBeginTime,  //一天内起始时间
                reserveEndTime: g.reserveEndTime,      //一天内结束时间
                productDescribe: g.productDescribe,    //图文详情内容
                canReserve: g.canReserve,              //暂停预约
                //其他定义
                imagesUrl: [], //主图全路径
                productState: 0,  //是否上架
                reserveChange: g.reserveChange,//设置过预约时间
            }
        },
        mounted() {
            let _this = this;
            let backId = this.$route.params.id,
                id = this.$route.query.id;

            //主图的渲染
            let aux = function () {
                for (let i = 0; i < g.imagesUrl.length; i++) {
                    _this.imagesUrl.push({
                        url: g.imagesUrl[i].url,
                        key: g.imagesUrl[i].key
                    });
                }
            };

            //根据不同来源渲染数据
            if (backId) {
                this.getdata(id, function () {
                    aux()
                });
            } else {
                this.productState=this.$route.query.productState
                aux();
            }


        },
        methods: {
            //根据id获取商品信息
            getdata(id, cb) {
                let _this = this;
                this.$http.get('api/v1/oto/product/publishInfo?id=' + id)
                    .then(function (res) {
                        if (res.data.code === 0) {
                            let d = res.data.data;
                            _this.categoryId = g.categoryId = d.categoryId;
                            _this.categoryName = g.categoryName = d.categoryName;
                            _this.productTitle = g.productTitle = d.productTitle;
                            _this.productJingle = g.productJingle = d.productJingle;
                            _this.productPrice = g.productPrice = d.productPrice;
                            _this.needReserve = g.needReserve = d.needReserve;
                            _this.needConfirmValid = g.needConfirmValid = d.needConfirmValid;
                            _this.reserveWeek = g.reserveWeek = d.reserveWeek;
                            _this.reserveBeginTime = g.reserveBeginTime = d.reserveBeginTime;
                            _this.reserveEndTime = g.reserveEndTime = d.reserveEndTime;
                            _this.canReserve = g.canReserve = d.canReserve;
                            _this.productDescribe = g.productDescribe = d.productDescribe;
                            _this.productState = d.productState;
                            _this.id = d.id;
                            g.imagesUrl = [];
                            for (let i = 0; i < d.images.length; i++) {
                                g.imagesUrl.push({
                                    url: d.imagePrefix + d.images[i],
                                    key: d.images[i]
                                })
                            }
                            cb();
                        }
                    })
            },
            //跳转到品类选择页面
            toplist() {
                this.$router.push({name: "plist"})
            },
            //上传商品主图
            upnewfile(id) {
                let _this = this;
                this.uploadimg(id, function (res) {
                    res.forEach(function (t) {
                        g.imagesUrl.push({url: t.imageUrl, key: t.key});
                        _this.imagesUrl.push({url: t.imageUrl, key: t.key});
                    });
                })
            },
            //移除商品主图
            removeimg(ind) {
                g.imagesUrl.splice(ind, 1);
                this.imagesUrl.splice(ind, 1);
            },
            //价格输入限制两位小数
            clearNoNum() {
                let value = this.productPrice;
                value = value.replace(/[^\d.]/g, "");
                value = value.replace(/^\./g, "");
                value = value.replace(/\.{2,}/g, ".");
                value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
                this.productPrice = value;
            },
            //表单输入保存 （标题 简介 价格）
            savedata() {
                g.productTitle = this.productTitle;
                g.productJingle = this.productJingle;
                g.productPrice = this.productPrice;
            },
            //预约开关
            changeAppoint() {
                if (g.needReserve === 'Y') {
                    g.needReserve = 'N';
                    this.needReserve = 'N';
                } else {
                    g.needReserve = 'Y';
                    this.needReserve = 'Y';
                }
            },
            //预约暂停开关
            changeStop() {
                if (g.canReserve === 'Y') {
                    g.canReserve = 'N';
                    this.canReserve = "N";
                } else {
                    g.canReserve = 'Y';
                    this.canReserve = "Y";
                }
            },
            //是否需要我确认订单
            makesurefun(b) {
                g.needConfirmValid = b;
                this.needConfirmValid = b;
            },
            //去设置预约时间
            pionttime() {
                g.reserveChange = true;
                this.reserveChange = true;
                this.$router.push({name: "pionttime"});
            },
            //跳转到图文详情页面
            toadddes() {
                this.$router.push({name: "addimgtext", query: { id: this.id ,productState:this.productState}});
            },
            //验证
            validData() {
                if (!this.categoryName) {
                    msg('请选择品类');
                    return false;
                }
                if (this.imagesUrl.length < 1) {
                    msg('请上传商品图片');
                    return false;
                }
                if (!this.productTitle) {
                    msg("请输入商品标题");
                    return false;
                }
                if (!this.productJingle) {
                    msg("请填写商品描述");
                    return false;
                }
                if (!this.productPrice) {
                    msg("请填写商品价格");
                    return false;
                }
                return true;
            },
            //   预览
            gopreview() {
                this.$router.push({name: "goodspreview", params: {id: this.id}});
            },
            //保存按妞 productState:商品状态 上架/未上架
            addgoods(state) {
                let _this = this;
                //点击保存的时候 商品默认是什么状态就保存为什么状态
                let productState = this.productState;
                //点击上架出售的时候 商品状态强制改为上架
                if (state === 1) {
                    productState = 1;
                }
                //上架状态要验证全部信息是否填写完毕
                if (this.validData()) {
                    //如果是上架出售 增加验证图文详情
                    if (productState === 1) {
                        if (g.productDescribe === '') {
                            msg("请填写图文描述");
                            return;
                        }
                    }
                    //生产图片key值数组
                    let images = [];
                    for (let i = 0; i < g.imagesUrl.length; i++) {
                        images.push(g.imagesUrl[i].key);
                    }
                    //传递参数
                    let postData = {
                        id: _this.$route.query.id,              //商品id
                        storeId: localStorage.getItem("storeId"),//店铺id
                        categoryId: g.categoryId,         //品类id
                        categoryName: g.categoryName,     //品类名称
                        productTitle: g.productTitle,     //商品名称
                        productJingle: g.productJingle,   //副标题
                        productPrice: g.productPrice,     //价格
                        needReserve: g.needReserve,       //是否需要预约
                        needConfirmValid: g.needConfirmValid, //预约需要确认
                        reserveWeek: g.reserveWeek,       //预约星期
                        reserveBeginTime: g.reserveBeginTime,  //一天内起始时间
                        reserveEndTime: g.reserveEndTime,      //一天内结束时间
                        productDescribe: g.productDescribe,    //图文详情内容
                        canReserve: g.canReserve,              //暂停预约
                        images: images,                        //主图
                        productState: productState,       //是否上架
                    };
                    this.$http.post("api/v1/oto/product/save", postData)
                        .then(function (res) {
                            if (res.data.code === 0) {
                                if (state === 1) {
                                    _this.productState = 1;
                                    msg("商品上架成功");
                                } else {
                                    msg("商品编辑成功");
                                }
                                _this.$router.push({"name": "allgoods"})
                            } else {
                                msg(res.data.msg);
                            }
                        });
                }
            },
            //商品下架
            soldout() {
                let _this = this;
                let url = 'api/v1/oto/product/changeProductState?id=' + this.$route.query.id + '&productState=0';
                this.$http.get(url).then(function (res) {
                    if (res.data.code === 0) {
                        _this.productState = 0;
                        msg('商品下架成功');
                    }
                })
            }
        }
    }
</script>
<style lang="less" scoped>
    .addgoods {
        @size: 37.5;
        .appointmentbox {
            margin-top: 10px;
            background-color: #fff;
            div {
                &.type {
                    border-bottom: 1px solid #f6f6f6;
                    margin: 0;
                }
            }
            li {
                &.type {
                    margin: 0 0 0 20px;
                    padding: 0 20px 0 0;
                    border-bottom: 1px solid #f6f6f6;
                }
                .right {
                    float: right;
                    .radio {
                        font-size: 14rem/@size;
                        display: inline-block;
                        vertical-align: middle;
                        margin-right: 5px;
                        .radiofont {
                            color: #9a9a9a;
                        }
                        .radioitem {
                            width: 15rem/@size;
                            height: 15rem/@size;
                            border: 1px solid #9a9a9a;
                            border-radius: 100%;
                            text-align: center;
                            display: inline-block;
                            line-height: 15rem/@size;
                            .radioinner {
                                background-color: #ffffff;
                                border-radius: 100%;
                                width: 9rem/@size;
                                height: 9rem/@size;
                                display: inline-block;
                                font-size: 0;
                            }
                        }
                    }
                    .active {
                        .radiofont {
                            color: #1a1a1a;
                        }
                        .radioitem {
                            border: 1px solid #1a1a1a;
                            .radioinner {
                                background-color: #1a1a1a;
                            }

                        }
                    }
                }
            }
        }
        .type {
            height: 53px;
            background-color: #fff;
            padding: 0px 20px;
            margin-top: 10px;
            overflow: hidden;
            p {
                margin: 0;
            }
            .swith {
                font-size: 15rem/@size;
                color: #1a1a1a;
                line-height: 55px;
                float: right;

                .swithbox {
                    width: 46rem/@size;
                    height: 20rem/@size;
                    background-image: linear-gradient(-90deg, #EEEEEE 0%, #EAEAEA 62%);
                    box-shadow: inset 0 0 6px 0 rgba(0, 0, 0, 0.10);
                    border-radius: 24rem/@size;
                    display: inline-block;
                    position: relative;
                    vertical-align: middle;
                    .fontg {
                        vertical-align: middle;
                        padding-right: 3px;
                    }
                    .inneritem {
                        background: #FFFFFF;
                        box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.30), 0 1px 3px 0 rgba(0, 0, 0, 0.20);
                        height: 18rem/@size;
                        width: 18rem/@size;
                        position: absolute;
                        border-radius: 100%;
                        top: 1rem/@size;
                        left: 2rem/@size;
                    }
                }
                .acgive {
                    background-image: linear-gradient(-90deg, #3C3C3C 0%, #000000 62%);
                    .inneritem {
                        left: auto;
                        right: 2rem/@size;
                    }
                }
            }
        }
        .type .left {
            line-height: 53px;
            float: left;
            font-size: 15px;
            color: #1A1A1A;
        }
        .type .right1 {
            line-height: 53px;
            float: right;
            font-size: 14px;
            color: #CCCCCC;
            margin-right: -5rem/@size;
            padding-right: 18rem/@size;
            background-image: url("../../assets/images/ic_arrow.png");
            background-size: 14rem/@size;
            background-position: right center;
            background-repeat: no-repeat;
        }
        .type .have {
            color: #3a3a3a;
        }
        .type .right2 {
            line-height: 53px;
            float: right;
            font-size: 14px;
            color: #CCCCCC;
            margin-left: 10px;
        }
        .imgthumb {
            background-color: #fff;
            margin-top: 10px;
            padding: 10px 20px;

        }
        .clearfix:after {
            content: "";
            display: block;
            height: 0;
            clear: both;
            visibility: hidden;
        }
        .imgthumb .head {
            background-color: #fff;
            line-height: 22px;
        }
        .imgthumb .head .title {
            font-size: 15px;
            color: #3A3A3A;
        }
        .imgthumb .head .maxnum {
            font-size: 12px;
            color: #9B9B9B;
        }
        .imgthumb .content {
            padding-top: 15px;

        }
        .imgthumb .content ul li {
            float: left;
            position: relative;
            margin-right: 15rem/@size;
            margin-bottom: 15px;
            input {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                opacity: 0;
            }
        }
        .imgthumb .content ul li .main {
            width: 60px;
            height: 60px;
            display: block;
        }
        .imgthumb .content ul li .close {
            width: 12px;
            height: 12px;
            position: absolute;
            top: -6px;
            right: -6px;
        }
        .imgthumb .warn {
            font-size: 12px;
            color: #9A9A9A;
            margin: 0;
        }
        .titlethumb {
            margin-top: 10px;
            background-color: #fff;
            padding: 0px 20px;
        }
        .titlethumb .title {
            float: left;
            line-height: 52px;
            font-size: 15px;
            color: #1A1A1A;
            margin: 0;
        }
        .titlethumb .contentInfo {
            margin-left: 25px;
            float: right;
            height: 52px;
            text-align: right;
            font-size: 15px;
            border: 0px;
            outline: none;
            color: #1A1A1A;
            &::placeholder {
                color: #cccccc;
            }
        }
        .describe {
            background-color: #fff;
            margin-top: 10px;
            padding: 12px 20px;
        }
        .describe textarea {
            width: 100%;
            height: 30px;
            font-size: 15px;
            color: #1A1A1A;
            outline: none;
            resize: none;
            border: 0px;
            margin: 0px;
        }
        .describe span {
            float: right;
            margin: 0px;
            font-size: 12px;
            color: #9B9B9B;
        }
        .priceInventory {
            padding-left: 20px;
            background-color: #fff;
            margin-top: 10px;
            .titles {
                font-size: 15px;
                color: #3a3a3a;
                margin: 0;
                display: inline-block;
                line-height: 50px;
            }
            .pricerem {
                font-size: 15rem/@size;
                color: #3C6DF8;
                float: right;
                line-height: 55px;
                margin-left: 2px;
            }
        }
        .priceInventory input {
            display: inline-block;
            height: 52px;
            width: 230rem/@size;
            border: 0px;
            outline: none;
            font-size: 15rem/@size;
            color: #3C6DF8;
            margin-left: 25px;
            float: right;
            text-align: right;
            &::placeholder {
                color: #cccccc;
            }

        }
        .priceInventory .price {
            padding-right: 20px;
            border-bottom: 1px solid #F6F6F6;;
        }
        .inventoryWarn {
            font-size: 12px;
            color: #1A1A1A;
            text-align: right;
            padding: 10px 20px 0px;
        }
        .btns {
            padding: 40px 0px 20px 20px;
        }
        .btns .preview {
            float: left;
            height: 50px;
            width: 50px;
            background-color: #fff;
            text-align: center;
            line-height: 50px;
            position: relative;
            span {
                font-size: 12rem/@size;
            }
        }
        .btns .preview img {
            width: 20px;
            height: auto;
            position: absolute;
            top: 4px;
            left: 15px;
        }
        .btns .save {
            float: left;
            height: 50px;
            width: 120rem/@size;
            background-color: #1A1A1A;
            line-height: 50px;
            border-radius: 2px;
            text-align: center;
            border: 0px;
            color: #fff;
            margin-left: 20rem/@size;
        }
        .btns .putaway {
            float: left;
            height: 50px;
            width: 120rem/@size;
            background-color: #3B55E6;
            line-height: 50px;
            border-radius: 2px;
            text-align: center;
            border: 0px;
            color: #fff;
            margin-left: 20rem/@size;
        }
    }
</style>
