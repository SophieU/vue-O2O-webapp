<template>
    <div class="allbox">
        <div class="itemnav">
            <div class="itemdiv" :class="productState==1?'active':''" @click="changeNav(1)">
                <span>出售中</span>
            </div>
            <div class="itemdiv" :class="productState==0?'active':''" @click="changeNav(0)">
                <span>未上架</span>
            </div>
        </div>
        <div class="conditonbox">
            <ul>
                <li :class="sortType*2<5?'active':''" @click="timeSort()">添加时间
                    <img v-if="sortType==1" src="../../assets/images/px.png" alt="">
                    <img v-if="sortType==2" src="../../assets/images/px1.png" alt="">
                </li>
                <li :class="sortType*2>5?'active':''" @click="salesVolume()">销量
                    <img v-if="sortType==3" src="../../assets/images/px.png" alt="">
                    <img v-if="sortType==4" src="../../assets/images/px1.png" alt="">
                </li>
            </ul>
        </div>
        <div class="goodlistbox">
            <div class="addgoodsbox" v-if="!menuShow">
                <div @click="addGoodsBtn()" class="addbtn">添加商品</div>
            </div>
            <ul>
                <li v-for="(item,ind) in list">
                    <img class="img" :src="item.productImages" alt="">
                    <div class="goodsinfo" @click="handle('view',item.id)">
                        <div class="g_title">
                            <span class="g_type">{{item.categoryName || "品类未编辑"}}</span>{{item.productTitle || "标题未编辑"}}
                        </div>
                        <div class="g_price">
                            <span>价格：￥{{item.productPrice || '0'}}</span>
                            <span>销量：0</span>
                            <!--<span>库存：{{item.productNum || '0'}}</span>-->
                        </div>
                        <div class="g_time">添加时间：{{item.createTime}}</div>
                    </div>
                    <div class="listbtnbox">
                        <div class="showbtn" @click="showFlotMeu(ind)">
                            <ul class="meu" style="display: none">
                                <div class="btncover"></div>
                                <li class="btn1" @click="handle('view',item.id)"><img
                                    src="../../assets/images/ic_yulan.png" alt="">预览
                                </li>
                                <li class="btn2" @click="handle('editor',item.id,ind)"><img
                                    src="../../assets/images/ic_edit.png" alt="">编辑
                                </li>
                                <li class="btn3" @click="handle('soldout',item.id)"><img
                                    src="../../assets/images/ic_shelf.png" alt="">{{productState === 1 ? '下架' : '上架'}}
                                </li>
                                <li class="btn4 nobottom" @click="handle('delete',item.id,ind)"><img
                                    src="../../assets/images/ic_delete.png" alt="">删除
                                </li>
                                <div class="trangel"></div>
                            </ul>
                        </div>

                    </div>
                </li>
            </ul>
            <div class="nolist" v-show="nodata">
                <img src="../../assets/images/ic_product_null.png" alt="">
                <div class="nofont">{{productState === 1 ? '暂无出售中的商品' : '暂无未上架的商品'}}</div>
            </div>
        </div>

    </div>
</template>
<script>
    import geditor from "../../assets/js/geditor";
    import msg from "../../assets/js/msg";

    export default {
        name: "allgoods",
        data() {
            return {
                sortType: 2,                              //排序  1-创建时间升,2-创建时间降,3-销量升,4-销量降
                productState: 1,                          //商品状态
                storeId: localStorage.getItem("storeId"), //店铺id
                list: [],                                 //列表数据
                loading: false,                           //是否在请求数据
                nodata: false,                            //没有数据
                enddata: false,                           //没有更多数据
                pageNo: 1,                                //当前页码
                menuShow:false
            }
        },
        mounted() {
            let _this = this;
            //请求第一页数据 (有缓存状态则取缓存状态的查询条件)
            let productState = sessionStorage.getItem('productState');
            let sortType = sessionStorage.getItem('sortType');
            if(productState && sortType){
                this.productState = parseInt(productState);
                this.sortType = parseInt(sortType);
            }
            this.getAllgoods(this.pageNo, this.productState);
            //滚动到底部触发加载更多
            this.toBottom(function () {
                if (_this.loading === false && _this.enddata === false) {
                    _this.getAllgoods(_this.pageNo, _this.productState);
                }
            });
        },
        methods: {
            //获取商品列表
            getAllgoods() {
                let _this = this;
                let postdata = {
                    storeId: _this.storeId,             // 店铺id
                    productState: _this.productState,   //商品状态 1 上架 0 未上架
                    sortType: _this.sortType            //排序  1-创建时间升,2-创建时间降,3-销量升,4-销量降
                };
                //进入数据渲染状态，防止多次请求
                _this.loading = true;
                this.$http.post("api/v1/oto/product/getProductByStoreId?pageNo=" + _this.pageNo + "&pageSize=10", postdata)
                    .then(function (res) {
                        if (res.data.code === 0) {
                            //无数据
                            if (res.data.data.totalCount === 0) {
                                _this.nodata = true;
                            } else {
                                _this.nodata = false;
                            }
                            //加载完最后一页数据
                            if (res.data.data.hasNextPage) {
                                _this.enddata = false
                            } else {
                                _this.enddata = true;
                            }
                            //列表渲染
                            let data = res.data.data.list;

                            data.forEach(function (t) {
                                _this.list.push({
                                    show: false,                   //操作菜单显示状态
                                    categoryName: t.categoryName,  //品类名称
                                    productImages: t.productImage, //主图
                                    productTitle: t.productTitle,  //商品名称
                                    productPrice: t.productPrice,  //价格
                                    createTime: t.createTime,      //添加时间
                                    id: t.id
                                })
                            })
                        }
                        //一页数据渲染完成后 改变页码和加载状态
                        _this.pageNo = res.data.data.nextPage;
                        _this.loading = false;
                    })
            },
            //上架和出售商品的列表切换
            changeNav(number) {
                if (number != this.productState) {
                    //保存商品的状态，下次回到这个页面还能保存查询状态
                    sessionStorage.setItem("productState", number);
                    this.productState = number;
                    this.list = [];
                    this.pageNo = 1;
                    this.enddata = false;
                    this.nodata = false;
                    this.getAllgoods(this.pageNo, this.productState);
                }
            },
            //悬浮的操作菜单显示
            showFlotMeu(ind) {
                let meus = document.getElementsByClassName("meu");
                for (let i = 0; i < meus.length; i++) {
                    if (ind === i) {
                        let style = meus[i].style.display === 'none' ? 'block' : 'none';
                        meus[i].style.display = style;
                    } else {
                        meus[i].style.display = "none";
                    }
                }
            },
            //点击添加时间排序
            timeSort() {
                let sortType;
                if (this.sortType == 2) {
                    sortType = 1;
                } else {
                    sortType = 2;
                }
                sessionStorage.setItem("sortType", sortType);
                this.sortType = sortType;
                this.list = [];
                this.pageNo = 1;
                this.enddata = false;
                this.nodata = false;
                this.getAllgoods();
            },
            //销量排序
            salesVolume(){
                let sortType;
                if (this.sortType == 4) {
                    sortType = 3;
                } else {
                    sortType = 4;
                }
                sessionStorage.setItem("sortType", sortType);
                this.sortType = sortType;
                this.list = [];
                this.pageNo = 1;
                this.enddata = false;
                this.nodata = false;
                this.getAllgoods();
            },
            //点击悬浮菜单触发不同的操作
            handle(type, id, ind) {
                let _this = this;
                //删除
                if (type === "delete") {
                    this.$http.delete("api/v1/oto/product/delete?id=" + id)
                        .then(function (res) {
                            if (res.data.code === 0) {
                                _this.list.splice(ind, 1);
                                msg('商品删除成功');
                                if(_this.list.length==0){
                                    console.log('删除空了')
                                    _this.nodata=true;
                                }
                            }else{
                                msg(res.data.msg);
                            }
                        })
                }
                //编辑
                if (type === "editor") {
                    geditor.isNew = false;
                    _this.$router.push({name: "editorgoods", params:{id:id},query: {id:id}});
                }
                //预览
                if (type === 'view') {
                    _this.$router.push({name: "goodspreview", params: {id: id},query:{id:id,userType:'o2o'}});
                }
                //下架或者上架
                if (type === 'soldout') {
                    let productType = this.productState === 0 ? 1 : 0;
                    let url = 'api/v1/oto/product/changeProductState?id=' + id + '&productState=' + productType;
                    this.$http.get(url).then(function (res) {
                        if (res.data.code === 0) {
                            let tips = productType === 0 ? '商品下架成功' : '商品上架成功';
                            msg(tips);
                            _this.list.splice(ind, 1);
                            if(_this.list.length==0){
                                _this.nodata=true;
                            }
                        }
                    })
                }
            },

            //添加新商品 清除全局数据
            addGoodsBtn() {
                geditor.reset();
                this.$router.push({name: 'addgoods'})
            },

        },
        //离开本页面 摧毁滚动加载更多
        destroyed: function () {
            window.onscroll = null
        }
    }
</script>
<style lang="less">
    .allbox {
        @size: 37.5;
        -webkit-overflow-scrolling : touch;
        .itemnav {
            height: 40rem/@size;
            line-height: 28rem/@size;
            text-align: center;
            font-size: 13rem/@size;
            color: #B1B1B1;
            background-color: #fff;
            .itemdiv {
                float: left;
                width: 50%;
                margin-top: 10rem/@size;
                span {
                    display: inline-block;
                    padding: 0 5px;
                }
                &.active {
                    span {
                        color: #1a1a1a;
                        border-bottom: 2px solid #1a1a1a;
                    }
                }
            }
        }
        .nolist {
            text-align: center;
            padding: 80px 0;
            img {
                width: 30%;
            }
            .nofont {
                font-size: 13px;
                line-height: 10px;
            }
        }
        .conditonbox {
            margin-top: 10rem/@size;
            height: 40rem/@size;
            background-color: #fff;
            ul {
                li {
                    font-size: 14rem/@size;
                    color: #6A6A6A;
                    float: left;
                    width: 50%;
                    line-height: 40rem/@size;
                    text-align: center;
                    &.active {
                        color: #1a1a1a;
                        font-weight: 700;
                    }
                    img {
                        height: 14rem/@size;
                        vertical-align: middle;
                    }
                }
            }
        }
        .goodlistbox {
            margin-bottom: 150rem/@size;
            -webkit-overflow-scrolling : touch;

            ul {

                li {
                    padding: 16rem/@size 10rem/@size 1rem/@size 20rem/@size;
                    margin-bottom: 10rem/@size;
                    background-color: #ffffff;
                    position: relative;
                    .img {
                        position: absolute;
                        left: 20rem/@size;
                        top: 16rem/@size;
                        height: 66rem/@size;
                        width: 66rem/@size;
                    }
                    .goodsinfo {
                        margin-left: 75rem/@size;
                        border-bottom: 1px solid #f6f6f6;
                        padding-bottom: 15rem/@size;
                        .g_type{
                            display: inline-block;
                            padding:0 2rem/@size;
                        }
                        .g_title {
                            font-size: 14rem/@size;
                            color: #1A1A1A;
                            padding-top: 3rem/@size;
                            line-height: 15rem/@size;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            span {
                                font-size: 10rem/@size;
                                border: 1px solid #3B55E6;
                                border-radius: 2px;
                                color: #3B55E6;
                                vertical-align: top;
                                margin-right: 6rem/@size;
                            }
                        }
                        .g_price {
                            font-size: 13rem/@size;
                            color: #6A6A6A;
                            line-height: 30rem/@size;
                            span {
                                margin-right: 5px;
                            }
                        }
                        .g_time {
                            font-size: 12rem/@size;
                            color: #9A9A9A;
                        }
                    }
                    .listbtnbox {
                        text-align: right;
                        height: 50rem/@size;
                        position: relative;
                        z-index: 999;
                        .showbtn {
                            display: inline-block;
                            height: 20rem/@size;
                            width: 20rem/@size;
                            margin: 13rem/@size 20rem/@size 10rem/@size 0;
                            background-image: url("../../assets/images/ic_more.png");
                            background-size: cover;
                            position: relative;
                            .btncover {
                                position: fixed;
                                top: 0;
                                left: 0;
                                right: 0;
                                bottom: 0;
                            }
                            ul {
                                position: absolute;
                                right: 32rem/@size;
                                top: -4rem/@size;
                                padding: 5rem/@size 10rem/@size;
                                font-size: 12rem/@size;
                                border-radius: 4rem/@size;
                                box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.2);
                                background-color: #ffffff;
                                z-index: 999;
                                &.show {
                                    display: block;
                                }
                                .trangel {
                                    position: absolute;
                                    width: 0;
                                    height: 0;
                                    border-top: 5rem/@size solid transparent;
                                    border-left: 8rem/@size solid #fff;
                                    border-bottom: 5rem/@size solid transparent;
                                    margin: auto;
                                    right: -5rem/@size;
                                    top: 10rem/@size;
                                }
                                li {
                                    height: 40rem/@size;
                                    width: 60rem/@size;
                                    margin: 0;
                                    padding: 0;
                                    text-align: center;
                                    line-height: 40rem/@size;
                                    border-bottom: 1px solid #f6f6f6;
                                    &.nobottom {
                                        border-bottom: none;
                                    }
                                    img {
                                        height: 20rem/@size;
                                        vertical-align: middle;
                                        margin-right: 4px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .addgoodsbox {
            position: fixed;
            height: 50rem/@size;
            bottom: 20rem/@size;
            left: 20rem/@size;
            right: 20rem/@size;
            background-color: #1a1a1a;
            line-height: 50rem/@size;
            font-size: 14rem/@size;
            text-align: center;
            color: #fff;
            z-index:1;

            a {
                display: block;
                color: #ffffff;
            }
        }
    }
</style>
