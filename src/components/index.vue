<template>
    <div class="index">
        <div class="indexcantai">
            <div class="headerimg" style="display: none">
                <img src="../assets/images/ic_user_default.png" alt="">
                <div @click="gomanages('manages')" class="editor">编辑</div>
            </div>
            <div class="storeinfo" style="display: none">
                <div class="name">店铺名称</div>
                <div class="descript">你还未添加对店铺的描述</div>
            </div>
            <div class="baseinfo">
                <!-- 未入驻显示新手开店-->
                <div class="newopen" v-if="newopen" v-show="newopen">
                    <div class="top">新手开店流程</div>
                    <div class="steps">
                        <div class="line"></div>
                        <ul>
                            <li class="step1">
                                <img src="../assets/images/ic_ruzhu.png" alt="">
                                <div class="font">01.商家入驻</div>
                            </li>
                            <li class="step2">
                                <img src="../assets/images/ic_fabu.png" alt="">
                                <div class="font">02.发布商品</div>
                            </li>
                            <li class="step3">
                                <img src="../assets/images/ic_shouqian.png" alt="">
                                <div class="font">03.坐等收钱</div>
                            </li>
                        </ul>
                        <div class="clear"></div>
                    </div>
                    <div class="btn" @click="goenter()" v-show="enter===-1" v-if="enter===-1">立即入驻</div>
                    <div class="btn" @click="goprogress()" v-show="enter===1" v-if="enter==1">查看入驻结果</div>

                </div>
                <!-- 已入驻显示收益情况 -->
                <div class="newopen" v-if="!newopen" v-show="!newopen">
                    <div class="top">近30天收入（元）</div>
                    <div class="steps">
                        <div class="yestoday">昨日收入(元)</div>
                        <div class="money">0.00</div>
                        <div class="total">总金额：0.00元</div>
                    </div>
                    <div class="btn" @click="gomanages()">查看收入明细</div>
                </div>
            </div>
            <div class="spacebg"></div>
            <!--操作菜单-->
            <div class="meulist">
                <ul>
                    <li @click="gomanages('orderLists')">
                        <div class="libox">
                            <div class="title">订单管理</div>
                            <div class="des">快速处理订单信息</div>
                            <!--<div class="righttips">暂无订单</div>-->
                        </div>
                    </li>
                    <li class="li2" @click="gomanages('allgoods')">
                        <div class="libox">
                            <div class="title">商品管理</div>
                            <div class="des">实时查看销售数量</div>
                            <!--<div class="righttips">快去添加商品吧</div>-->
                        </div>
                    </li>
                    <li class="li3" @click="gomanages('scanQRcode')">
                        <div class="libox">
                            <div class="title">验证扫码</div>
                            <div class="des">快速验证商品信息</div>
                            <div class="righttips"></div>
                        </div>
                    </li>
                    <li class="li4" @click="gomanages('manages')">
                        <div class="libox">
                            <div class="title">店铺管理</div>
                            <div class="des">完整店铺信息可提高浏览度</div>
                            <!--<div class="righttips">店铺信息未完善</div>-->
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 底部导航 -->
        <!--<nav-components v-bind:type="thistype"></nav-components>-->
        <!-- 未入住弹框 -->
        <div class="entertip" v-if="entertip">
            <div class="tipcell">
                <div class="innerbox">
                    <div class="close" @click="entertip=false"></div>
                    <img class="banner" src="../assets/images/img_tishi.png" alt="">
                    <div class="fontbox">
                        <div class="title">入驻提示</div>
                        <div class="des">亲，您还没有申请商户入驻哦，完成入驻后才能使用这个功能哦~</div>
                        <div class="btn" @click="goenter()">立即入驻</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 正在审核弹框 -->
        <div class="entertip" v-if="prosstip">
            <div class="tipcell">
                <div class="innerbox">
                    <div class="close" @click="prosstip=false"></div>
                    <div class="fontbox">
                        <div class="title">提示</div>
                        <div v-if="enter==1">
                            <div class="des" >亲，您的申请还在审核当中，审核通过后才能使用这个功能哦~</div>
                            <div class="btn" @click="goprogress()" >查看入驻结果</div>
                        </div>
                        <div v-if="enter==-1">
                            <div class="des" >亲，您还未入驻哦，商家入驻后才能使用这个功能哦~</div>
                            <router-link to="/enter/fillinfo" class="btn" @click="goprogress()">立即入驻</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import NavComponents from "./nav/nav.vue"
    import msg from "../assets/js/msg"

    export default {
        name: "index",
        data() {
            return {
                thistype: 'home',
                newopen: true,
                entertip: false,
                prosstip: false,
                enter: -1,//-1表示未入驻 1表示正在审核
                loading:false
            }
        },
        components: {NavComponents},
        mounted() {
            let _this = this;
            let userId = localStorage.getItem("userId");
            if(!userId){
                //没有登录跳转登录
                this.$router.push({name:'logindefault'})
            }else{
                //已经登录 检测店铺状态 未入住，审核中，已入驻
                this.$http.get("api/v1/oto/user/findApplyOrStore?userId="+userId)
                    .then(function (res) {
                        if(res.data.code===0){
                            localStorage.setItem('storeId', res.data.data.storeId);
                            localStorage.setItem('applyId', res.data.data.applyId);
                            let storeId = localStorage.getItem("storeId");
                            let applyId = localStorage.getItem("applyId");

                            if(storeId === 'undefined'){
                                if(applyId === 'undefined'){
                                    //未入驻
                                    _this.newopen = true;
                                    _this.enter = -1;
                                }else{
                                    //已入驻 正在审核
                                    _this.newopen = true;
                                    _this.enter = 1;
                                }
                            }else{
                                //已经有店铺

                                _this.newopen = false;
                                _this.enter = 0;
                            }
                        }
                    });
            }




        },
        methods: {
            checkAplly(id, callback) {
                let _this = this;
                this.$http
                    .get('api/v1/oto/user/findApplyOrStore?userId=' + id)
                    .then(function (res) {
                        if (res.data.code === 0) {
                            callback(res.data.data);
                        }
                    })
            },
            goenter() {
                this.$router.push({name: "fillinfo"});
            },
            goprogress() {
                this.$router.push({name: "status"})
            },
            gomanages(name) {
                let storeId = localStorage.getItem("storeId");
                let applyId = localStorage.getItem("applyId");
                if (name) {
                    //是否入驻
                    if (storeId === 'undefined' || storeId === null) {
                        if (applyId) {
                            this.prosstip = true;
                            return
                        } else {
                            this.entertip = true;
                            return;
                        }
                    }
                    //扫码
                    if(name === 'scanQRcode'){
                        if(window.ysyapp){
                            ysyapp({
                                funName:'scanQRcode',
                                data:"",
                                callback:function (res) {

                                }
                            });
                        }
                        return;
                    }


                    this.$router.push({name: name});
                } else {
                    msg("没有明细可以看哦");
                }
            },
            test(){
                location.href = 'http://twap.yishengyue.cn/o2o/index.html#/';
            }
        }
    }
</script>
<style lang="less">
    .index {
        @size: 37.5;
        background-color: #fff;
        .indexcantai {
            margin: 0 20rem/@size;
            /*padding-bottom: 50rem/@size;*/
            .headerimg {
                height: 50rem/@size;
                padding: 15rem/@size 0;
                background-color: #fff;
                .editor {
                    float: right;
                    font-size: 15rem/@size;
                    color: #1A1A1A;
                }
                img {
                    height: 50rem/@size;
                    width: auto;
                }
            }
            .storeinfo {
                background-color: #fff;
                .name {
                    font-size: 14rem/@size;
                    color: #1A1A1A;
                    font-weight: 700;
                }
                .descript {
                    font-size: 12rem/@size;
                    color: #414852;
                }
            }
            .baseinfo {
                padding: 15rem/@size 0 20rem/@size 0;
                background-color: #fff;
                .newopen {
                    .top {
                        font-size: 13rem/@size;
                        color: #54585C;
                    }
                    .steps {
                        padding: 20rem/@size 20rem/@size;
                        position: relative;
                        .yestoday {
                            font-size: 12rem/@size;
                            color: #1A1A1A;
                            text-align: center;
                        }
                        .money {
                            font-size: 36rem/@size;
                            color: #1A1A1A;
                            text-align: center;
                            padding: 6rem/@size;
                        }
                        .total {
                            font-size: 15rem/@size;
                            color: #1A1A1A;
                            text-align: center;
                        }
                        .line {
                            position: relative;
                            margin: 0rem/@size 35rem/@size;
                            top: 18rem/@size;
                            border-top: 1px dashed #1a1a1a;
                        }
                        ul {
                            position: relative;
                            li {
                                float: left;
                                width: 33.33333%;
                                font-size: 12rem/@size;
                                color: #1A1A1A;
                                text-align: center;
                                img {
                                    height: 36rem/@size;
                                    width: auto;
                                    background-color: #fff;
                                    margin-bottom: 3px;
                                }
                            }
                        }
                    }
                    .btn {
                        height: 50rem/@size;
                        font-size: 14rem/@size;
                        color: #FFFFFF;
                        background-color: #1a1a1a;
                        text-align: center;
                        line-height: 50rem/@size;
                    }
                }
            }
            .spacebg {
                background-color: #e6e6e6;
                height: 10rem/@size;
                margin: 0 -20rem/@size;
            }
            .meulist {
                margin-top: 10rem/@size;
                ul {
                    border-bottom: 1px solid #fff;
                    li {
                        padding: 16rem/@size 0;
                        background-image: url("../assets/images/ic_order.png");
                        background-size: 20rem/@size;
                        background-repeat: no-repeat;
                        background-position: 0 16rem/@size;
                        position: relative;
                        border-bottom: 1px solid #e6e6e6;
                        margin-bottom: -1px;
                        &.li2 {
                            background-image: url("../assets/images/ic_product.png");
                        }
                        &.li3 {
                            background-image: url("../assets/images/ic_idcard.png");
                        }
                        &.li4 {
                            background-image: url("../assets/images/ic_store.png");
                        }
                        .libox {
                            margin-left: 30rem/@size;
                            .title {
                                font-size: 15rem/@size;
                                color: #1A1A1A;
                                line-height: 18rem/@size;
                                padding-bottom: 3rem/@size;
                                font-weight: 700;
                            }
                            .des {
                                font-size: 13rem/@size;
                                color: #9A9A9A;
                            }
                            .righttips {
                                position: absolute;
                                height: 20rem/@size;
                                line-height: 20rem/@size;
                                right: 0;
                                top: 50%;
                                margin-top: -10rem/@size;
                                font-size: 13rem/@size;
                                color: #B1B1B1;
                            }
                        }
                    }
                }
            }
        }
        .entertip {
            position: fixed;
            z-index: 10;
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background-color: rgba(0, 0, 0, 0.4);
            display: table;
            .tipcell {
                display: table-cell;
                vertical-align: middle;
                .innerbox {
                    position: relative;
                    min-height: 100px;
                    width: 270rem/@size;
                    background-color: #fff;
                    margin: auto;
                    .close {
                        position: absolute;
                        height: 30rem/@size;
                        width: 30rem/@size;
                        background-image: url("../assets/images/ic_close.png");
                        background-size: cover;
                        right: -10rem/@size;
                        top: -10rem/@size;
                    }
                    .banner {
                        display: block;
                        width: 100%;
                        height: auto;
                    }
                    .fontbox {
                        padding: 16rem/@size 20rem/@size 20rem/@size 20rem/@size;
                        .title {
                            font-size: 18rem/@size;
                            color: #1A1A1A;
                            font-weight: 700;
                        }
                        .des {
                            font-size: 12rem/@size;
                            color: #5F5D70;
                            padding: 10rem/@size 0 30rem/@size 0;
                        }
                        .btn {
                            display: block;
                            height: 44rem/@size;
                            line-height: 44rem/@size;
                            text-align: center;
                            background-color: #1a1a1a;
                            color: #fff;
                            font-size: 14rem/@size;
                        }
                    }
                }
            }
        }
    }
</style>
