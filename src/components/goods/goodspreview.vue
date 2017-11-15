<template>
    <div class="preview">
        <!--vue插件swiper-->
        <swiper :options="swiperOption" ref="mySwiper">
            <!-- slides -->
            <swiper-slide v-bind:key="ind" v-for="(item,ind) in bannerImgs">
                <img :src="item" alt="">
                {{item}}
            </swiper-slide>
            <!-- Optional controls -->
            <div class="swiper-pagination"  slot="pagination"></div>
        </swiper>
        <div class="checkStore">
            <p class="name">{{productTitle || '商品标题'}}</p>
            <p class="presentation">{{productJingle || '商品描述'}}</p>
            <p class="price">价格：¥{{productPrice || '0.00'}}</p>
            <button class="checkBtn" type="button" @click="showStore" >查看店铺</button>
        </div>
        <div class="environment">
            <div class="address botborder">
                <ul>
                    <li><div class="icon01"></div>地址</li>
                    <li class="addressDetail">{{geoInfo}}{{storeAddress || '商家地址信息'}}</li>
                </ul>
                <a :href="'tel:'+phone" class="call">
                    <img src="../../assets/images/bt_phone.png" />
                </a>
            </div>

            <div class="buyer botborder clearfix" v-show="!localprive">
                <ul>
                    <li><div class="icon01"></div>购买过的邻居</li>
                    <!--<li>-->
                        <!--<ul class="neighbors">-->
                            <!--<li>-->
                                <!--<img src="../../assets/images/g1.png"/>-->
                                <!--<p>Dannis</p>-->
                            <!--</li>-->
                            <!--<li>-->
                                <!--<img src="../../assets/images/g1.png"/>-->
                                <!--<p>Dannis</p>-->
                            <!--</li>-->
                        <!--</ul>-->
                        <!---->
                    <!--</li>-->
                    <div class="noliju">暂时还没有邻居购买过此商品~~~</div>
                </ul>
            </div>

        </div>
        <div class="evaluate clearfix">
            <div class="eva_left" @click="changeNav(true)" :class="showbox?'evaluateborder':'' ">
                商品详情
            </div>

            <div class="eva_right" @click="changeNav(false)" :class="!showbox?'evaluateborder':'' ">
                邻里点评
            </div>
        </div>
        <div class="evaluateinfo">
            <div class="evaluateleft_info" v-show="!showbox">
                <div class="icon01"></div><span class="title">邻里点评（0条）</span>
                <div class="infobox" style="display: none">
                    <div class="head">
                        <img src="../../assets/images/g1.png" />
                        <span>Barbara Silva</span>
                    </div>
                    <div class="content">
                        游泳池很干净，教练也很情切，对于旱鸭子来说简直就是天堂，希望有希望健身同事喜欢游泳的朋友可以来这里游泳，路线也方便，挨着地铁口的
                    </div>
                    <p class="star">
                        <img src="../../assets/images/icon_star.png" alt="">
                        <img src="../../assets/images/icon_star.png" alt="">
                        <img src="../../assets/images/icon_star.png" alt="">
                    </p>
                    <p class="time">2016-09-03</p>
                </div>
                <div class="noinfobox">
                    <img src="../../assets/images/ic_pingjia_null.png" alt="">
                    <div class="noinfotext">还没有邻居对此商品进行评价</div>
                </div>
            </div>
            <div class="evaluateright_info" v-show="showbox">
                <div class="icon01"></div><span class="title">商品详情</span>
                <div class="rich-text" v-html="productDescribe || '商品图文详情'">
                </div>
            </div>
        </div>


    </div>
</template>
<script>
    import TouchSlide from "../../assets/js/touchslider";
    import msg from "../../assets/js/msg";
    import g from "../../assets/js/geditor";

    export default {
        name:"goodspreview",
        data(){
            return {
                showbox: true,
                categoryName: "请选择",
                categoryId: "",//品类id
                storeId: localStorage.getItem("storeId"),//店铺id
                productTitle: "",//商品名称
                productJingle: "",//副标题
                productDescribe: "",//商品简介
                productNum: "",//库存
                productPrice: "",//价格
                images: [],//图片
                hasfilldes: false,//是否添加图文详情
                storeAddress: "",//地址
                geoInfo: "",
                phone: "",
                localprive: true,//本地预览还是接口预览,
                inApp: false,
                userType: '',
                bannerImgs: ' ', //商品图片
                swiperOption: { //轮播
                    loop:true,
                    autoplay: 3000,
                    direction: 'horizontal',
                    initialSlide: 0,
                    autoHeight: true,
                    pagination: '.swiper-pagination',
                    // 如果自行设计了插件，那么插件的一些配置相关参数，也应该出现在这个对象中，如下debugger
                    debugger: true,
                }
            }
        },
        mounted(){
            let id = this.$route.query.id,
                paramId = this.$route.params.id;
            this.userType = this.$route.query.userType;
            this.getData(id);
            this.localprive=false;

            if(ysyapp){
                this.inApp=true;
            }

//            在ysy用户端打开
            var mySwiper = new Swiper ('.swiper-container', {
                direction: 'horizontal',
                loop: true,
                // 如果需要分页器
                pagination: '.swiper-pagination',

            })
        },
        methods:{
            showStore(){
                this.$router.push({name:'storeview',query:{userType:this.userType,storeId:this.storeId}})
            },
            //请求接口数据预览
            getData(id){
                let _this = this;
                let url = "api/v1/oto/product/preview?id="+id;
                this.$http.get(url)
                    .then(function (res) {
                        if(res.data.code===0){
                            let data = res.data.data;
                             _this.productTitle = data.productTitle;
                             _this.productJingle = data.productJingle;
                             _this.productPrice =data.productPrice.toFixed(2);
                            _this.productNum = data.productNum;
                            _this.storeAddress = data.storeAddress;
                            _this.geoInfo = data.geoInfo;
                            _this.productDescribe = data.productDescribe;
                            _this.phone = data.storePhone;
                            _this.storeId=data.storeId;
                            _this.bannerImgs = data.images
                        }
                    }).catch(err=>{
                        msg(err)
                })
            },
            //本地缓存数据预览
            previewLocal(){
                this.categoryName = g.categoryName;
                this.productTitle = g.productTitle;
                this.productJingle = g.productJingle;
                this.productPrice = g.productPrice;
                this.productDescribe = g.productDescribe;
                let html = "";
                g.imagesUrl.forEach(function (item) {
                    html += '<li><div class="innerimgbox" style="background-image: url(' + item.url + ')"></div></li>'
                });
                document.getElementById("bannerimg").innerHTML = html;
                let autoPage;
                autoPage =  g.imagesUrl.length>1?true:false;
                TouchSlide({
                    slideCell: "#focus",
                    titCell: ".hd ul",
                    mainCell: ".bd ul",
                    effect: "left",
                    autoPlay: true,
                    autoPage: autoPage
                });
            },
            //详情和点评切换
            changeNav(bool){
                if(this.localprive){
                    return;
                }
                if(this.showbox!==bool){
                    this.showbox = bool;
                }
            },
            //点击购买提示
            bookorder(){
                msg("本页仅供预览，购买请下载一生约APP");
            }
        }
    }
</script>
<style lang="less">
    .preview{
        @size:37.5;
        .swiper-container{
            height: 300rem/@size;
        }
        .swiper-slide{
            img{
                height:300rem/@size;
                width:100%;
            }
        }
        p{
            margin: 0;
        }
        .checkStore{
            padding: 32px 20px 24px;
            background-color: #fff;
            position: relative;
        }
        .checkStore .name{
            font-size: 24px;
            color: #1A1A1A;
        }
        .checkStore .presentation{
            font-size: 14px;
            color: #6A6A6A;
            margin: 7px 0px;
        }
        .checkStore .price{
            font-size: 14px;
            color: #1A1A1A;
        }
        .checkStore .inventory{
            font-size: 14px;
            color: #1A1A1A;
        }
        .checkStore .checkBtn{
            text-align: center;
            width: 90px;
            height: 36px;
            border: 1px solid #1A1A1A;
            border-radius: 2px;
            background-color: #fff;
            position: absolute;
            bottom: 24rem/@size;
            right:20rem/@size
        }
        .environment{
            background-color: #fff;
            margin-top: 10rem/@size;
            padding: 0 20rem/@size;
        }
        .environment ul li{
            font-size: 13rem/@size;
            color: #1A1A1A;
        }
        .environment ul li.addressDetail{
            font-size: 13rem/@size;
            color: #1A1A1A;
            max-width:250rem/@size;
        }
        .environment .buyer ul li .neighbors{
            height: 54rem/@size;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            overflow-x: scroll;
            margin-top: 10rem/@size;
        }
        .environment .buyer ul li .neighbors li{
            float: left;
            width: 54rem/@size;
            height: 54rem/@size;
            text-align: center;
            margin-right: 5rem/@size;
            overflow: hidden;
        }
        .environment .buyer ul li .neighbors li img{
            display: block;
            width: 32rem/@size;
            height: 32rem/@size;
            border-radius: 100%;
            margin: 0 auto;
        }
        .environment .buyer ul li .neighbors li p{
            width: 54rem/@size;
            line-height: 25rem/@size;
            font-size: 13rem/@size;
            color: #1A1A1A;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .environment ul li:first-child{
            font-size: 13rem/@size;
            color: #6A6A6A;
            line-height: 25rem/@size;
        }
        .environment ul li .icon01{
            display: inline-block;
            width: 3rem/@size;
            height: 10rem/@size;
            background-color: #000;
            margin-right: 6rem/@size;
        }
        .environment .botborder{
            border-bottom: 1rem/@size solid #eee;
            padding: 16rem/@size 0rem/@size;
        }
        .environment .botborder:last-child{
            border: 0rem/@size;
        }
        .environment .address{
            position: relative;
        }
        .environment .address .call{
            width: 58rem/@size;
            height: 24rem/@size;
            border-left: 1rem/@size solid #B1B1B1;
            position: absolute;
            right:0rem/@size;
            top: 30rem/@size;
        }
        .environment .address .call img{
            width: 24rem/@size;
            height: 24rem/@size;
            float: right;
            margin-right: 8rem/@size;
        }
        .buyBtn{
            width: 100%;
            background-color: #fff;
            box-shadow: 0 -2rem/@size 8rem/@size 0 rgba(0,0,0,0.10);
            position: fixed;
            bottom: 0rem/@size;
            display: flex;
        }

        .buyBtn .buyBtnright{
            flex:1;
            text-align: center;
            height: 50rem/@size;
            background-color: #1A1A1A;
            color: #fff;
            float: left;
            line-height: 50rem/@size;
            font-size: 17rem/@size;
        }
        .buyBtn .buyBtnleft .price{
            font-size: 17rem/@size;
            color: #000000;
            vertical-align: middle;
        }
        .buyBtn .buyBtnleft .price span{
            font-size: 12rem/@size;
            color: #1A1A1A;
        }
        .evaluate{
            background-color: #fff;
            height: 48rem/@size;
            margin-top: 10rem/@size;
        }
        .evaluate .eva_left{
            margin-left:54rem/@size;
            float: left;
            height: 46rem/@size;
            width: 80rem/@size;
            text-align: center;
            line-height: 46rem/@size;
            font-size: 15rem/@size;
            color: #1A1A1A;
            font-weight: 700;
        }
        .evaluate .eva_right{
            margin-right: 54rem/@size;
            float: right;
            height: 46rem/@size;
            width: 80rem/@size;
            text-align: center;
            line-height: 46rem/@size;
            font-size: 15rem/@size;
            color: #1A1A1A;
            font-weight: 700;
        }
        .evaluate .evaluateborder{
            border-bottom: 2rem/@size solid #000;
        }
        .evaluateinfo{
            /*margin-bottom: 50rem/@size;*/
            background-color: #fff;
            padding: 0rem/@size 20rem/@size;
        }
        .evaluateinfo .evaluateleft_info .infobox{
            border-bottom: 1rem/@size solid #eee;
            padding-bottom: 16rem/@size;
        }
        .noliju{
            font-size: 13rem/@size;
            padding-top: 5rem/@size;
            color: #3a3a3a;
        }
        .noinfobox{


            padding: 80rem/@size 0 40rem/@size 0;
            img{
                width: 40%;
                display: block;
                margin: auto;
            }
            .noinfotext{
                font-size: 13rem/@size;
                color: #1A1A1A;
                line-height: 50rem/@size;
                text-align: center;
            }
        }
        .evaluateinfo .evaluateleft_info .infobox:last-child{
            border-bottom: 0rem/@size;
        }
        .evaluateinfo .evaluateleft_info .icon01,.evaluateinfo .evaluateright_info .icon01{
            display: inline-block;
            width: 3rem/@size;
            height: 10rem/@size;
            background-color: #000;
            margin-right: 6rem/@size;
        }
        .rich-text{
            margin-top: 6rem/@size;
            /*padding-bottom: 50rem/@size;*/
            font-size: 14rem/@size;
            line-height: 24rem/@size;
            img{
                max-width: 100%;
            }
        }
        .evaluateinfo .evaluateleft_info>.title,.evaluateinfo .evaluateright_info>.title{
            font-size: 13rem/@size;
            color: #6A6A6A;
        }
        .evaluateinfo .evaluateleft_info .head{
            margin-top: 16rem/@size;
            height: 32rem/@size;
            line-height: 32rem/@size;
        }
        .evaluateinfo .evaluateleft_info .head img{
            width: 32rem/@size;
            height: 32rem/@size;
            border-radius: 100%;
            float: left;
        }
        .evaluateinfo .evaluateleft_info .head span{
            line-height: 32rem/@size;
            margin-left: 8rem/@size;
            font-size: 15rem/@size;
            color: #1A1A1A;
            vertical-align: middle;
        }
        .evaluateinfo .evaluateleft_info .content{
            margin-top: 16rem/@size;
            font-size: 13rem/@size;
            color: #6A6A6A;
        }
        .evaluateinfo .evaluateleft_info .star{
            line-height: 15rem/@size;

            height: 15rem/@size;
            padding-top: 6rem/@size;
            img{
                height: 14rem/@size;
                width: 14rem/@size;
                vertical-align: middle;
                font-size: 15rem/@size;
                float: left;
                margin-right: 2rem/@size;
            }
        }
        .evaluateinfo .evaluateleft_info .time{
            font-size: 13rem/@size;
            color: #9A9A9A;
            margin-top: 7rem/@size;
        }
        .rich-text img{
            max-width: 100%;
            height: auto;
            margin: 0rem/@size;
            display: block;
        }
    }
</style>
