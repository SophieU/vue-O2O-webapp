<template>
    <div class="imgview">
        <div class="imgback" @click="goBack()"></div>
        <div id="focus" class="focus">
            <div class="hd">
                <ul></ul>
            </div>
            <div class="bd">
                <ul id="imglist">
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import TouchSlide from "../../assets/js/touchslider";
    export default {
        name: "imgview",
        data() {
            return {
                imgs:[]
            }
        },
        mounted() {
            let html = "";
            let autoPage;
            let imgs = this.$route.params;
            autoPage = imgs.length>1?true:false;
            imgs.forEach(function (item) {
                let url = item.image;
                let height = window.screen.height+"px";
                html += '<li><div class="item-box" style="background-image: url('+ url +');padding-bottom: '+height+'"></div></li>';
            });
            document.getElementById("imglist").innerHTML = html;
            TouchSlide({
                slideCell: "#focus",
                titCell: ".hd ul",
                mainCell: ".bd ul",
                effect: "left",
                autoPlay: false,
                autoPage: true
            });
        },
        methods:{
            goBack(){
                this.$router.go(-1);
            }
        }
    }
</script>
<style lang="less">
    .imgview {
        @size: 37.5;
        position: fixed;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: #1a1a1a;
        .imgback{
            height: 30rem/@size;
            width: 30rem/@size;
            border-radius: 100%;
            background-color: rgba(255,255,255,0.8);
            position: absolute;
            top:20rem/@size;
            left:20rem/@size;
            background-image: url("../../assets/images/back1.png");
            background-size: 20rem/@size;
            background-position: center;
            background-repeat: no-repeat;
            z-index: 9;
        }
        .focus {
            width: 100%;
            position: relative;
        }
        .focus .hd {
            width: 100%;
            height: 11px;
            position: absolute;
            z-index: 1;
            bottom: 90rem/@size;

            text-align: center;
        }
        .focus .hd ul {
            display: inline-block;
            height: 5px;
            padding: 3px 5px;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
            font-size: 0;
            vertical-align: top;
        }
        .focus .hd ul li {
            display: inline-block;
            width: 6px;
            height: 6px;
            -webkit-border-radius: 6px;
            -moz-border-radius: 6px;
            border-radius: 6px;
            background: #fff;
            margin: 0 3px;
            vertical-align: top;
            overflow: hidden;
            border: 1px solid #3B55E6;
        }
        .focus .hd ul .on {
            background: #3B55E6;
        }

        .focus .bd {
            position: relative;
            z-index: 0;
            height: 100%;
            .tempWrap {
                height: 100%;
            }
        }
        .focus .bd ul {
            height: 100%;
        }
        .focus .bd li {
            height: 100%;
        }
        .focus .bd li img {
            width: 100%;
            display: block;
        }
        .focus .bd li a {
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
        .item-box {
            padding-bottom: 100%;
            margin: 0 auto;
            background-image: url('../../assets/images/p1.jpg');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            position: relative;
        }
        .item-box2 {

        }
        .item-box3 {

        }
        .item-text {
            text-align: center;
            padding: 15px;
            color: #5A5A5A;
        }
    }
</style>
