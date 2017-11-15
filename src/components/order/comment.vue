<template>
    <div class="comment-wrapper">
       <div class="product">
           <img :src="comment.productImage" alt="">
           <div class="product-info">
               <p>{{comment.productName}}</p>
               <p class="text-grey">{{comment.productJingle}}</p>
           </div>
       </div>
        <div class="comments">
            <div class="user-info">
                <div class="user-intro">
                    <div class="avatar">
                        <img :src="comment.userAvatar" alt="">
                    </div>
                    <span>{{comment.nickName}}</span>
                </div>
                <span class="text-grey">{{comment.commentTime}}</span>
            </div>
            <div class="comment-info">
                <div class="star-bar">
                    <span class="star " :class="{'active':1<=comment.starNum}"></span>
                    <span class="star " :class="{'active':2<=comment.starNum}"></span>
                    <span class="star " :class="{'active':3<=comment.starNum}"></span>
                    <span class="star " :class="{'active':4<=comment.starNum}"></span>
                    <span class="star" :class="{'active':5<=comment.starNum}"></span>
                </div>
                <div class="comment-text">{{comment.commentContent}}</div>
                <ul class="comment-gallery">
                    <li v-for="img in comment.list"><img :src="img" alt=""></li>
                </ul>
            </div>
        </div>

    </div>
</template>
<script type="text/ecmascript-6">
    import msg from '../../assets/js/msg'
    export default {
        name: 'hello',
        data() {
            return {
                comment:{}
            }
        },
        mounted(){
            var orderId = this.$route.query.orderId
            this.$http.get('/api/v1/oto/seller/order/find/comment',{
                params:{
                    orderId:orderId
                }
            }).then(res=>{
                if(res.data.code==0){
                    this.comment=res.data.data
                }else{
                    msg(res.data.msg)
                }
            })
        }
    }
</script>
<style lang="less" scoped="">
    @size:37.5;
    .product{
        padding:15rem/@size;
        border-bottom: 0.5px solid #D2D2D2;
        display: flex;
        justify-content: flex-start;
        img{
            width:70rem/@size;
            height:70rem/@size;
            border:0.5px solid #DEDEDE;
            margin-right:10rem/@size ;
        }
        .product-info{
            font-size: 15px;
            color: #2C2C2C;
            line-height: 1.8em;
        }
        .text-grey{
            font-size: 13.5rem/@size;
        }
    }
    .comments{
        padding-left:15rem/@size ;
    }
    .user-info{
        padding:15rem/@size 15rem/@size 15rem/@size 0;
        font-size: 12.5rem/@size;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom:0.5px solid #D2D2D2;
        .avatar{
            width:30rem/@size;
            height:30rem/@size;
            overflow: hidden;
            margin-right: 15rem/@size;
            border-radius: 100%;
            border:0.5px solid #D2D2D2;
            img{
                width:100%;
                height:100%;
            }
        }
        .user-intro{
            display: flex;
            align-items: center;
            color: #515151;
        }
    }
    .star-bar{
        padding:10px 10px 10px 0;
        display: flex;
        span{
            display: block;
            vertical-align:top;
            margin-right:5rem/@size ;
            width:12rem/@size;
            height:12.5rem/@size;
            background-image: url(../../assets/images/star-off.png);
            background-size: 100% 100%;
            background-position: center center;
            &.active{
                background-image: url(../../assets/images/star-on.png);
            }
        }
    }
    .comment-text{
        font-size: 14rem/@size;
        color: #515151;
        padding:0 10rem/@size 10rem/@size 0;
    }
    .comment-gallery{
        overflow: hidden;
        li{
            margin-right:4%;
            float: left;
            width:28%;
            height:105rem/@size;
            overflow: hidden;
            &:last-child{
                margin-right: 0;
            }
            img{
                width:100%;
                height:100%;
            }
        }
    }
</style>
