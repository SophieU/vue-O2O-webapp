<template>
    <div class="addsuccess">
        <img class="icon" src="../../assets/images/ic_sueccss.png" alt="">
        <div class="fonttitle">商品添加成功</div>
        <div class="fonttip">您现在可以查看商品信息</div>
        <div class="btnbox">
            <div @click="addMore" class="btn btn1">继续添加</div>
            <router-link :to="{name:'allgoods'}" class="btn btn2">查看商品</router-link>
        </div>
    </div>
</template>
<script>
    import geditor from "../../assets/js/geditor";
    export default {
        name:"addsuccess",
        data(){
            return{

            }
        },
        methods:{
            addMore(){
                geditor.reset();
                this.$router.push({name: 'addgoods'})
            }
        }
    }
</script>
<style lang="less">
    .addsuccess{
        @size:37.5;
        text-align: center;
        .icon{
            width: 60rem/@size;
            height: 60rem/@size;
            display: block;
            margin: 80rem/@size auto 40rem/@size auto;
        }
        .fonttitle{
            font-size: 16rem/@size;
            color: #1A1A1A;
            padding-bottom: 20rem/@size;
        }
        .fonttip{
            font-size: 14rem/@size;
            color: #6A6A6A;
            padding-bottom: 40rem/@size;
        }
        .btnbox{
            .btn{
                display: inline-block;
                width: 130rem/@size;
                height: 40rem/@size;
                font-size: 17rem/@size;
                line-height: 40rem/@size;
                border: 1px solid #1a1a1a;
                border-radius: 40rem/@size;
                &.btn2{
                    background-color: #1a1a1a;
                    color: #fff;
                    margin-left: 15px;
                }
            }

        }
    }
</style>
