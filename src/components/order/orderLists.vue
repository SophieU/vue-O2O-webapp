<template>
    <div class="orderWrapper">
        <ul class="tab-nav">
            <li v-for="(item,index) in tabLi" @click="toggleTab(item.type)" :class="{'active':orderType==item.type}"><span>{{item.name}}</span></li>
        </ul>
        <div class="tab-content">
            <img src="../../assets/images/Spinner.svg" class="loading" v-if="loading" alt="">
            <ul class="tab-panel">
                <li class="tab-item" v-for="item in orderLists">
                    <div class="flex-header">
                        <span class="text-grey">订单编号:{{item.orderSn}}</span>
                        <span :class="{
                    'text-grey':item.orderStatus=='交易成功',
                    'text-blue':item.orderStatus=='待付款'||item.orderStatus=='待验证',
                    'text-warm':item.orderStatus=='待商家确认',
                    'text-red':item.orderStatus=='交易关闭'}">{{item.orderStatus}}</span>
                    </div>
                    <router-link :key="true" :to="'/order/orderDetail?orderId='+item.orderId" class="goods-info" v-for="product in item.products">
                        <img :src="product.productImage" alt="">
                        <div class="goods-intro">
                            <div class="clearfix">
                                <p class="pull-left">{{product.productTitle}}</p>
                                <p class="pull-right">¥ {{product.productPrice}}</p>
                            </div>
                            <div class="clearfix">
                                <p class="text-grey pull-left productIntro">{{product.productJingle}}</p>
                                <p class="text-grey pull-right">X{{product.productNum}}</p>
                            </div>
                        </div>
                    </router-link>
                    <div class="calc-order">
                        <span class="text-grey">共 <strong class="text-red">{{item.totalProductNum}}</strong> 件商品</span>
                        <span class="totalPrice">合计：<strong class="text-red">￥{{item.totalAmount}}</strong></span>
                    </div>
                    <div class="order-btn" v-if="item.orderStatus!='待付款'">
                        <!--待商家确认-->
                        <div v-if="item.orderStatus=='待商家确认'">
                            <button class="ubtn"><a :href="'tel:'+item.buyerPhone">联系买家</a></button>
                            <button @click="checkOrder(item.orderId)" class="ubtn black-btn">接单</button>
                        </div>
                        <!--未验证-->
                        <div v-if="item.orderStatus=='待验证'">
                            <button  class="ubtn"><a :href="'tel:'+item.buyerPhone">联系买家</a></button>
                            <button @click="remind(item.orderId,'cancel')" class="ubtn" >取消订单</button>
                            <button @click="checkCode" class="ubtn black-btn" >核销</button>
                        </div>
                        <!--交易完成-->
                        <div v-if="item.orderStatus=='交易成功'">
                            <button class="ubtn"><a :href="'tel:'+item.buyerPhone">联系买家</a></button>
                            <button @click="comment(item.orderId)" class="ubtn black-btn" v-if="item.commentStatus=='Y'">查看评价</button>
                        </div>

                    </div>
                </li>
            </ul>
            <div class="noData" v-if="noData">
                <img src="../../assets/images/ic_product_null.png" alt="">
                <div class="no-result">暂无订单</div>
            </div>

        </div>
        <modal :message="tipMsg" :show="modalShow" @callback="modalCB" @cancelModal="modalHid"></modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import '@/assets/css/common.css'
    import msg from '../../assets/js/msg'
    import modal from './modal.vue'
    export default {
        name: 'hello',
        data() {
            return {
                orderType:'',
                pageNo:1,
                loading:true,
                tabLi:[
                    {type:'',name:'全部' },
                    {type:'STAY_PAY',name:'待付款'},
                    {type:'STAY_CONFIRM',name:'待确认'},
                    {type:'NOT_VERIFY',name:'待验证'},
                    {type:'TRAN_SUCCESS',name:'已完成'}
                ],
                orderLists:[],
                noData:false,
                pageSize:5,
                tipMsg:'确认删除吗？',
                modalShow:false,
            }
        },
        components:{
            modal
        },
        methods:{
            remind(orderId,type){
                this.modalShow=true;
                this.orderId=orderId;
                switch(type){
                    case 'cancel':
                        this.modalCB=this.cancelOrder;
                        this.tipMsg='确认要取消此订单吗？';
                        break;
                    case 'del':
                        this.modalCB=this.delOrder;
                        this.tipMsg='确认要删除此订单吗？';
                        break;
                    default:
                        return;
                }
            },
            modalHid(){
                this.modalShow=false;
            },
            modalCB(){
                console.log(orderId)
            },
            toggleTab(tag){
                this.orderType=tag;
                this.orderLists=[];
                this.pageNo=1;
                this.noData=false;
                this.getLists(this.pageNo,this.orderType);
            },
            getLists(pageNo,orderType){
                // 参数
                var param={
                    storeId:localStorage.storeId,
                    orderState:orderType,
                    pageNo:pageNo,
                    pageSize:this.pageSize
                }
                var _this = this;
                this.$http.get('/api/v1/oto/seller/order',{
                    params:param
                }).then(res=>{
                    if(res.data.code==0){
                      const data = res.data.data;
                        _this.pageNo=data.nextPage;
                        _this.loading=false;
                        if(data.list.length!=0){
                            if(_this.orderLists.length==0){
                                _this.orderLists=data.list;
                            }else{
                               Array.prototype.push.apply(_this.orderLists,data.list)
                            }
                            this.noData=false;
                        }else if(data.list.length==0&&data.pageNo==1){
                            this.noData=true;
                        }

                    }else{
                        msg(res.statusText)
                    }
                })
            },
            arriveBottom(){
                var _that = this
                this.toBottom(function(){
                    if(_that.$route.name=='orderLists'){
                        if(_that.loading){
                            return;
                        }else{
                            _that.loading=true;
                            _that.getLists(_that.pageNo,_that.orderType);
                        }
                    }

                })
            },
            cancelOrder(){
                var orderId = this.orderId;
                var formData = new FormData();
                formData.append('userId',localStorage.userId);
                formData.append('orderId',orderId);

                this.$http.post('/api/v1/oto/seller/order/cancel',formData).then(res=>{
                    if(res.data.code==0){
                        msg('订单取消成功')
                        window.location.reload();
                    }else{
                        msg(res.data.msg)
                    }
                    //关闭弹窗
                    this.modalShow=false;
                })
            },
            checkOrder(orderId){
                var formData = new FormData();
                formData.append('userId',localStorage.userId);
                formData.append('orderId',orderId);

                this.$http.post('/api/v1/oto/seller/order/confirm/order',formData).then(res=>{

                    msg(res.data.msg)
                    window.location.reload();
                })
            },
            comment(orderId){
                this.$router.push({ path: '/order/comment', query: { orderId: orderId }})
            },
            checkCode(){
//                扫码
                if(window.ysyapp){
                    ysyapp({
                        funName:'scanQRcode',
                        data:"",
                        callback:function (res) {
                        }
                    });
                }
            },
            delOrder(){
                var orderId = this.orderId

                //关闭弹窗
                this.modalShow=false;
            }
        },
        mounted(){
            this.getLists(this.pageNo,this.orderType);

            this.arriveBottom();
        }
    }
</script>
<style lang="less" scoped="scoped">

    @size:37.5;

    .loading{
        position: absolute;
        width:60rem/@size;
        height:60rem/@size;
        top:50%;
        left:50%;
        margin-top: -30rem/@size;
        margin-left: -30rem/@size;
    }
    .productIntro{
        white-space: nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
        max-width:230rem/@size;
    }
    .orderWrapper{
        background: #f6f6f6;
        overflow: hidden;
    }
    .tab-nav{
        width:100%;
        display: flex;
        font-size:13rem/@size;
        height:40rem/@size;
        line-height: 40rem/@size;
        overflow: hidden;
        background: #fff;
        li{
            flex: 1;
            text-align: center;
            color: rgba(0,0,0,0.7);
            /*color: #B1B1B1;*/
            &.active{
                opacity:1;
                color: rgba(0,0,0,1);
                position: relative;
                &:after{
                    content: '';
                    width:70%;
                    position: absolute;
                    bottom:0;
                    left:15%;
                    height:3rem/@size;
                    background:#1A1A1A;
                }
            }
            &.badge{
                span{
                    position: relative;
                    &:before{
                        content: '';
                        width:6rem/@size;
                        height:6rem/@size;
                        border-radius: 100%;
                        background: #FF5078;
                        position: absolute;
                        top:-3rem/@size;
                        right:-3rem/@size;
                    }
                }

            }
        }
    }

    .ubtn>a{
        display: block;
    }
    .tab-panel{
        background: #F8F8F8;
        .tab-item{
            margin-top:10rem/@size ;
            background: #fff;

        }
        .flex-header{
            display: flex;
            justify-content: space-between;
            padding:15rem/@size;
            font-size:14rem/@size ;
            border-bottom:1px solid #f6f6f6;
        }
        .goods-info{
            display: flex;
            padding:20rem/@size 15rem/@size;
            border-bottom:1px solid #f6f6f6;

            &>img{
                width:60rem/@size;
                max-height:60rem/@size;
                margin-right: 10rem/@size;
            }
            .goods-intro{
                flex:1;
                padding:10rem/@size 0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                p{margin:0;padding:0;}
                .clearfix:first-child{
                    font-size: 14rem/@size;
                    color: #3C3C3C;
                }
                .clearfix:last-child{
                    font-size: 12px;
                    color: #B1B1B1;
                }
            }
        }
        .calc-order{
            font-size: 14px;
            color: #B1B1B1;
            padding:15rem/@size;
            text-align: right;
            border-bottom:1px solid #f6f6f6;
            .totalPrice{
                color: #9A9A9A;
                margin-left: 10rem/@size;
            }
        }
        .order-btn{
            padding:15rem/@size;
            text-align: right;
            display: flex;
            justify-content: flex-end;
            background:#F8FAFF;
            button{
                margin-left: 10rem/@size;
                font-size: 14rem/@size;
                min-width:90rem/@size;
                height:32rem/@size;
            }

        }
    }
    .noData {
        text-align: center;
        padding: 80px 0;
        img {
            width: 30%;
        }
        .no-result {
            font-size: 13px;
            line-height: 10px;
        }
    }
</style>
