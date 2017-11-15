<template>
    <div class="storeview">
        <div class="natatorium">
            <!-- 轮播 -->
            <swiper :options="swiperOption" ref="mySwiper">
                <!-- slides -->
                <swiper-slide v-bind:key="ind" v-for="(item,ind) in bannerImgs"><img class="swiper-img" :src="item.image" alt=""></swiper-slide>
                <!-- Optional controls -->
                <div class="swiper-pagination"  slot="pagination"></div>
            </swiper>
            <div class="itemallbox">
                <div class="itembox">
                    <div class="title">地址</div>
                    <a :href="'tel:'+storePhone" class="body tel-bg">{{geoInfo}}{{storeAddress}}</a>
                </div>
            </div>
            <div class="itemallbox">
                <div class="itembox">
                    <div class="title">店铺简介</div>
                    <div class="body">{{introduce || '暂无简介'}}</div>
                </div>
            </div>
            <div class="hackimg" @click="imgview()" v-if="smallImg">
                <div class="hackbg">
                    <div class="imgleft" v-bind:style="{backgroundImage:'url('+smallImg+')'}"></div>
                    <div class="imgfont">
                        <div class="title">环境图片</div>
                        <div class="number" v-if="havestoreHjImgList.length>0">共{{havestoreHjImgList.length}}张</div>
                        <div class="number" v-if="havestoreHjImgList.length===0">暂无图片</div>
                    </div>
                </div>
            </div>
            <!--店铺商品-->
            <div class="itemallbox nobottom">
                <div class="itembox">
                    <div class="title">店铺商品</div>
                    <!--没有添加商品-->
                    <div class="nogoods" v-if="goodsList.length===0&&userType!='ysyapp'">
                        <img class="noimg" src="../../assets/images/ic_product_null.png" alt="">
                        <div class="notips">店铺空空荡荡快去添加商品吧</div>
                        <div class="nobtnbox" @click="addGoods()">添加商品</div>

                    </div>
                    <!--有商品-->
                    <div class="goodslist" v-if="goodsList.length>0">
                        <ul>
                            <li v-for="item in goodsList" >
                                <router-link :to="{ name: 'goodspreview', params: { id: item.id },query:{id:item.id}}" class="innergoods">
                                    <div class="goodsimgbox" v-bind:style="item.productImage==''?'background-color: #f6f6f6':'backgroundImage:url('+item.productImage+')'"></div>
                                    <div class="goodsname">{{item.productTitle||'无标题'}}</div>
                                    <div class="goodsprice">¥{{item.productPrice}}</div>
                                </router-link>
                            </li>
                        </ul>
                        <div class="clear"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import TouchSlide from "../../assets/js/touchslider";
    import msg from '../../assets/js/msg'
    import Vue from "vue"
    export default {
        name: "storeview",
        data() {
            return {
                nogoods: false,
                storeName: "",
                introduce: "",
                storeAddress: "",
                storePhone: '',
                havestoreZpImgList: [],
                havestoreHjImgList: [],
                propdata: "",
                bannerImgs:"",
                geoInfo:"",
                smallImg:"",
                goodsList:"",
                userType:'o2o',
                swiperOption: { //轮播
                    loop:true,
                    autoplay: 3000,
                    direction: 'horizontal',
                    initialSlide: 1,
                    autoHeight: true,
                    pagination: '.swiper-pagination',
                    // 如果自行设计了插件，那么插件的一些配置相关参数，也应该出现在这个对象中，如下debugger
                    debugger: true,
                }
            }
        },
        mounted() {

            let storeId = this.$route.query.storeId;
            let userId = localStorage.getItem("userId");
            this.storeId = storeId;
            this.userId = userId;
            this.userType = this.$route.query.userType;

            this.getInfo(storeId, userId);
            this.getGoods();
        },
        methods: {
            getInfo(id, userid) {
                let _this = this;
                let url = '';
                if(this.userType=='ysyapp'){
                    url='api/v1/oto/store/getStoreIfoById?storeId=' + id
                }else{
                    url='api/v1/oto/store/getStoreIfoById?storeId=' + id+ '&otoUserId=' + userid
                }
                this.$http
                    .get(url)
                    .then(function (res) {
                        if (res.data.code === 0) {
                            let data = res.data.data;
                            _this.storeName = data.storeName;
                            document.title = data.storeName;
                            _this.introduce = data.introduce;
                            _this.storeAddress = data.storeAddress;
                            _this.storePhone = data.storePhone;
                            _this.geoInfo = data.geoInfo;
//                            _this.goodslist = data.productVoList;
                            _this.bannerImgs = data.storeZpImgList;
                            if(data.storeHjImgList.length>0){
                                _this.smallImg = data.storeHjImgList[0].image;
                            }
                            _this.havestoreHjImgList = data.storeHjImgList;
                        }
                    }).catch(error=>{
                        msg(error)
                    })
            },
            addGoods() {
                this.$router.push({name:"addgoods"});
            },
            imgview() {
                let _this = this;
                if (this.havestoreHjImgList.length > 0) {
                    this.$router.push({
                        name: "imgview",
                        params:_this.havestoreHjImgList
                    })
                }
            },
//            获取店铺商品
            getGoods(){
                var _this = this;
                var param = {
                    "storeId":this.storeId,
                    "productState":"1",
                    "sortType":"1"
                }
                this.$http.post('/api/v1/oto/product/getProductByStoreId',param).then(res=>{
                    if(res.data.code==0){
                        _this.goodsList=res.data.data.list
                    }
                }).catch(error=>{
                    msg(error)
                })
            }
        }
    }
</script>
<style lang="less">
    .storeview {
        @size: 37.5;
        .swiper-img{
            height:300rem/@size;
            width:100%;
        }
        .natatorium .focus {
            width: 100%;
            position: relative;
        }
        .natatorium .focus .hd {
            width: 100%;
            height: 11px;
            position: absolute;
            z-index: 1;
            bottom: 15px;
            text-align: center;
        }
        .natatorium .focus .hd ul {
            display: inline-block;
            height: 5px;
            padding: 3px 5px;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
            font-size: 0;
            vertical-align: top;
        }
        .natatorium .focus .hd ul li {
            display: inline-block;
            width: 6px;
            height: 6px;
            -webkit-border-radius: 6px;
            -moz-border-radius: 6px;
            border-radius: 6px;
            background: rgba(60, 109, 248, 0.3);
            margin: 0 2px;
            vertical-align: top;
            overflow: hidden;
            transition: all 0.3s;
            -webkit-transition: all 0.3s;
        }
        .natatorium .focus .hd ul .on {
            background: #3c6df8;
            width: 10px;
            transition: all 0.3s;
            -webkit-transition: all 0.3s;
        }
        .natatorium .focus .bd {
            position: relative;
            z-index: 0;
        }
        .natatorium .focus .bd li .innerimgbox {
            height: 240rem/@size;
            overflow: hidden;
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
            background-image: url("../../assets/images/p1.jpg");
        }
        .natatorium .focus .bd li img {
            width: 100%;
            display: block;
        }
        .natatorium .focus .bd li a {
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
        .natatorium {
            .hackimg {
                background-color: #fff;
                margin-bottom: 10rem/@size;
                height: 40rem/@size;
                padding: 16rem/@size 20rem/@size;
                .hackbg {
                    background-image: url("../../assets/images/ic_arrow.png");
                    background-position: right center;
                    background-repeat: no-repeat;
                    background-size: 16rem/@size;
                    height: 100%;
                }

                .imgleft {
                    float: left;
                    height: 40rem/@size;
                    width: 60rem/@size;
                    background-image: url("../../assets/images/p1.jpg");
                    background-size: cover;
                    background-position: center;
                }
                .imgfont {
                    float: left;
                    margin-left: 10rem/@size;
                    .title {
                        font-size: 13rem/@size;
                        color: #1A1A1A;

                    }
                    .number {
                        font-size: 13rem/@size;
                        color: #B1B1B1;
                        line-height: 28rem/@size;
                    }
                }
            }
        }
        .itemallbox {
            padding: 0 20rem/@size;
            margin-bottom: 10rem/@size;
            background-color: #fff;
            &.nobottom {
                margin-bottom: 0;
            }
        }
        .itembox {
            padding: 16rem/@size 0;
            border-bottom: 1px solid #f5f5f5;
            margin-bottom: -1px;
            &.nobottom {
                padding-bottom: 0;
            }
            .title {
                border-left: 3rem/@size solid #1A1A1A;
                text-indent: 6rem/@size;
                font-size: 13rem/@size;
                color: #6A6A6A;
                height: 12rem/@size;
                line-height: 12rem/@size;
                margin-bottom: 8rem/@size;
                .title-right {
                    float: right;
                    line-height: 12rem/@size;
                    color: #9a9a9a;
                    span {
                        color: rgba(60, 109, 248, 1);
                    }
                }
            }
            .body {
                font-size: 13rem/@size;
                color: #1A1A1A;
                padding-top: 5rem/@size;
                min-height: 20rem/@size;
                line-height: 20rem/@size;
                display: block;
                padding-right: 35rem/@size;
            }
            .tel-bg {
                background-image: url("../../assets/images/bt_phone.png");
                background-size: 24rem/@size 24rem/@size;
                background-repeat: no-repeat;
                background-position: right center;
            }
        }
        .nogoods {
            .noimg {
                margin: 70rem/@size auto 20rem/@size auto;
                display: block;
                width: 120rem/@size;
                height: auto;
            }
            .notips {
                font-size: 13rem/@size;
                text-align: center;
                color: #1A1A1A;
            }
            .nobtnbox {
                height: 40rem/@size;
                border-radius: 40rem/@size;
                width: 150rem/@size;
                font-size: 17rem/@size;
                text-align: center;
                line-height: 40rem/@size;
                color: #fff;
                background-color: #1a1a1a;
                margin: 40rem/@size auto 30rem/@size auto;
            }
        }
        .goodslist {
            margin-top: 16rem/@size;
            ul {
                margin-left: -8rem/@size;
                margin-right: -8rem/@size;
                li {
                    float: left;
                    width: 50%;
                    margin-bottom: 20rem/@size;
                    .innergoods {
                        margin: 0 8rem/@size;
                        display: block;
                        .goodsimgbox{
                            padding-bottom: 100%;
                            background-position: center;
                            background-size: cover;
                        }
                        img {
                            width: 100%;
                            height: auto;
                        }
                        .goodsname {
                            font-size: 14rem/@size;
                            color: #1A1A1A;
                            margin-bottom: 6rem/@size;
                            line-height: 30rem/@size;
                            height: 30rem/@size;
                            white-space: nowrap;
                            overflow: hidden;
                            -ms-text-overflow: ellipsis;
                            text-overflow: ellipsis;
                        }
                        .goodsprice {
                            font-size: 15rem/@size;
                            color: #1A1A1A;
                            font-weight: 700;
                        }
                    }
                }
            }
        }
    }
</style>
