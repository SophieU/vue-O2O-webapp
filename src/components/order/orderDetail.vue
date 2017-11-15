<template>
    <div class="orderDetail">
        <div class="order-content">
            <div class="order-statu">
                <div>
                    <span class="statu-title">订单状态</span>
                    <span >{{orderDetail.orderStatus}}</span>
                </div>
                <img class="statu-icon" v-if="statu=='checking'" src="../../assets/images/ico_daiqueren.png" />
                <img class="statu-icon" v-if="statu=='verify'" src="../../assets/images/ico_daiyanzheng.png" />
                <img class="statu-icon" v-if="statu=='paying'" src="../../assets/images/ico_daizhifu.png" />
                <img class="statu-icon" v-if="statu=='cancel'" src="../../assets/images/ico_jiaoyiquxiao.png" />
                <img class="statu-icon" v-if="statu=='finished'" src="../../assets/images/ico_yiwancheng.png" />
                <img class="statu-icon" v-if="statu=='refund'" src="../../assets/images/ico_daituikuan.png" />
            </div>
            <!--待付款-->
            <div class="order-item" v-if="orderDetail.payTime!=''">
                <div>
                    <span class="text-grey">支付流水：</span>
                    <span>{{orderDetail.paySn}}</span>
                </div>
                <div>
                    <span class="text-grey">支付日期：</span>
                    <span>{{orderDetail.payTime}}</span>
                </div>
                <div>
                    <span class="text-grey">支付方式：</span>
                    <span>{{orderDetail.payType}}</span>
                </div>
            </div>
            <!--待付款-->
            <div class="order-item">
                <div>
                    <span class="text-grey">订单编号：</span>
                    <span>{{orderDetail.orderSn}}</span>
                </div>
                <div>
                    <span class="text-grey">下单日期：</span>
                    <span>{{orderDetail.addTime}}</span>
                </div>
            </div>
            <div class="order-item">
                <div>
                    <span class="text-grey">联系人：</span>
                    <span>{{orderDetail.receiverName}}，{{orderDetail.receiverPhone}}</span>
                </div>
                <div>
                    <span class="text-grey">服务地址：</span>
                    <span>{{orderDetail.receiveAddress}}</span>
                </div>
                <div v-if="appointmentTime!=''">
                    <span class="text-grey">预约服务时间：</span>
                    <span>{{appointmentTime}}</span>
                </div>
            </div>
            <div class="order-item">
                <div>
                    <span class="text-grey">买家留言：</span>
                    <span>{{orderDetail.buyerMsg}}</span>
                </div>
            </div>
            <div class="order-goods">
                <div class="order-title">商品信息</div>
                <div class="goods-info" v-for="item in orderDetail.products">
                    <img :src="item.productImage" alt="">
                    <div class="goods-intro">
                        <div class="clearfix">
                            <p class="pull-left">{{item.productTitle}}</p>
                            <p class="pull-right">¥ {{item.productPrice}}</p>
                        </div>
                        <div class="clearfix">
                            <p class="text-grey pull-left goodsIntro">{{item.productJingle}}</p>
                            <p class="text-grey pull-right">X{{item.productNum}}</p>
                        </div>
                    </div>
                </div>
                <div class="order-calc">
                    <div>
                        <span class="text-grey">共{{orderDetail.totalProductNum}}件商品  总金额:</span>
                        <strong class="text-black">￥{{orderDetail.totalAmount}}</strong>
                    </div>
                </div>
            </div>
        </div>
        <div  v-if="orderDetail.orderStatus!='待付款'">
            <!--待接单-->
            <div class="btn-groups" v-if="orderDetail.orderStatus=='待商家确认'">
                <button class="ubtn" ><a :href="'tel:'+orderDetail.receiverPhone">联系买家</a></button>
                <button class="ubtn black-btn" >确认接单</button>
            </div>
            <!--交易完成-->
            <div class="btn-groups" v-if="orderDetail.orderStatus=='交易成功'">
                <button class="ubtn"  ><a :href="'tel:'+orderDetail.receiverPhone">联系买家</a></button>
                <button class="ubtn black-btn" v-if="orderDetail.commentStatus=='Y'"><router-link :to="{name:'comment',query:{orderId:orderDetail.id}}">查看评论</router-link></button>
            </div>
            <!--未验证-->
            <div class="btn-groups" v-if="orderDetail.orderStatus=='待验证'">
                <button class="ubtn"  ><a :href="'tel:'+orderDetail.receiverPhone">联系买家</a></button>
                <button class="ubtn" @click="remind">取消订单</button>
                <button class="ubtn black-btn" @click="scanQr">核销</button>
            </div>
        </div>
        <modal :message="tipMsg" :show="modalShow" @callback="modalCB" @cancelModal="modalHid"></modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import '@/assets/css/common.css'
    import  msg from '../../assets/js/msg'
    import modal from './modal.vue'
    export default {
        name: 'hello',
        data() {
            return {
                statu: 'checking',
                orderId:'',
                orderDetail:'',
                appointmentTime:'',
                modalShow:false,
                tipMsg:'确认取消订单吗？'
            }
        },
        components:{
            modal
        },
        methods:{
            scanQr(){
                if(window.ysyapp){
                    ysyapp({
                        funName:'scanQRcode',
                        data:"",
                        callback:function (res) {

                        }
                    });
                }
            },
            remind(){
                this.modalShow=true;
            },
            modalCB(){
                var formData = new FormData();
                formData.append('userId',localStorage.userId);
                formData.append('orderId',this.orderId);

                this.$http.post('/api/v1/oto/user/order/cancel',formData).then(res=>{
                    msg(res.data.msg)
                    //关闭弹窗
                    this.modalShow=false;
                })
            },
            modalHid(){
                this.modalShow=false;
            }
        },
        mounted(){
            var _this = this;
            this.orderId=this.$route.query.orderId;

            this.$http.get('/api/v1/oto/seller/order/detail',{
                params:{
                    orderId:this.$route.query.orderId,
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.orderDetail = res.data.data;
                    _this.appointmentTime = res.data.data.products[0].appointmentTime;

                }else{
                    msg(res.data.msg)
                }
            })
        }
    }
</script>
<style scoped lang="less">
    @size:37.5;
    .orderDetail{
        position: relative;
        background:#F6F6F6;
        padding-bottom: 60rem/@size;
        .goodsIntro{
            max-width:250rem/@size;
        }
        .btn-groups{
            height: 60rem/@size;
            align-items: center;
            position: fixed;
            bottom:0;
            left: 0;
            right:0;
            display: flex;
            justify-content: space-between;
            background: #fff;
            padding:0 7.5rem/@size;
            button{
                height:44rem/@size;
                line-height: 44rem/@size;
                vertical-align:middle;
                padding:0;
                color: #3C3C3C;
                flex:1;
                margin:0 7.5rem/@size;
                &>a{
                    display: block;
                    color: inherit;
                }
                &.black-btn{
                    color: #fff;
                }
            }
        }
    }
    .order-statu{
        height:50rem/@size;
        line-height:50rem/@size;
        padding:0 15rem/@size;
        font-size: 15rem/@size;
        color: #fff;
        background-image: linear-gradient(-145deg, #FDBA3A 0%, #FF6F2D 100%);
        display: flex;
        justify-content: space-between;
        align-items: center;
        .statu-title{
            opacity:0.8;
            font-weight: lighter;
            margin-right: 10rem/@size;
        }
        strong{
            margin-left: 10rem/@size;

        }
        .statu-icon{
            height:18.5rem/@size;
        }
    }
    .order-item{
        background: #fff;
        margin-top: 10rem/@size;
        font-size: 14rem/@size;
        padding:15rem/@size;
        border-style:solid;
        border-width:1px 0 1px 0;
        border-color: #f6f6f6;
    }
    .order-goods{
        background: #fff;
        margin-top: 10rem/@size;
        font-size: 14rem/@size;
        border-top: 1px solid #f6f6f6;
        border-bottom: 1px solid #f6f6f6;
        .order-title{
            color: #AAB4BE;
            padding:10rem/@size 15rem/@size;
            border-bottom: 1px solid #f6f6f6;
        }
        .goods-info{
            display: flex;
            padding:15rem/@size;
            &>img{
                width:60rem/@size;
                max-height:60rem/@size;
                margin-right: 10rem/@size;
            }
            .goods-intro{
                flex:1;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
            }
        }
        .order-calc{
            padding:15rem/@size;
            text-align: right;
            border-top: 1px solid #f6f6f6;
        }
    }

</style>
