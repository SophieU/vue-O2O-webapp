<template>
    <div id="app">
        <div class="gheader" v-show="$route.name!='index'" >
            <div class="back" @click="goBack()"></div>
            <span id="header">{{$route.meta.title}}</span>
        </div>
        <transition name="fade">
            <router-view></router-view>
        </transition>
        <!-- 弹框小提示 tips -->
        <div class="tips" v-show="showtips">
            <span>{{tipsmsg}}</span>
        </div>
        <div class="tips" id="initmsg"></div>
    </div>
</template>

<script>
    import {state} from "./assets/js/state"
    import Picker from 'better-picker'
    export default {
        name: 'app',
        data() {
            return {
                showtips: false,
                tipsmsg:''
            }
        },
        mounted() {
            let _this = this;
            //地区数据

            if(!localStorage.getItem("geoList")){
                this.$http
                    .get("api/v1/geo/list")
                    .then(function (res) {
                        let list = res.data.data;

                        list =JSON.stringify(list);
                        list = list.replace(/id/g, "value").replace(/name/g, "text");
                        localStorage.setItem('geoList',list);
                        list = JSON.parse(list);
                        _this.initPicker(list);
                    });
            }else{
                let list = JSON.parse(localStorage.getItem("geoList"));
                _this.initPicker(list);
            }

            state.$on("tips", function (msg) {
                _this.showtips = true;
                _this.tipsmsg = msg;
                setTimeout(function () {
                    _this.showtips = false;
                },1800)
            });
            state.$on("picker",function(){
                _this.picker.show();
            })

        },
        methods:{
            goBack(){
                let _this = this;
                let routerlist = [
                    {form:'addgoods',to:'allgoods'},
                    {form:'allgoods',to:'index'},
                ];
                let _thisname = this.$route.name;
                for(let i=0;i<routerlist.length;i++){
                    if(_thisname===routerlist[i].form){
                        _this.$router.push({name:routerlist[i].to})
                        return false;
                    }
                }
                if(this.$route.query.userType=='ysyapp'){
                    ysyapp({
                        funName:'back',
                        data:"",
                        callback:function (res) {

                        }
                    });
                }else{
                    this.$router.go(-1);
                }
            },
            initPicker(list){
                let _this = this;
                _this.picker = new Picker({
                    data: [list, list[0].children, list[0].children[0].children],
                    selectedIndex: [0, 0, 0],
                    title: '选择地址'
                });
                _this.picker.on('picker.select', function (selectedVal, selectedIndex) {
                    let id0,id1,id2;
                    let text0 = list[selectedIndex[0]].text;
                    id0=list[selectedIndex[0]].value;
                    let text1,text2;
                    if(list[selectedIndex[0]].children.length>0){
                        text1 = list[selectedIndex[0]].children[selectedIndex[1]].text;
                        text2 = list[selectedIndex[0]].children[selectedIndex[1]].children[selectedIndex[2]].text;
                        id1 = list[selectedIndex[0]].children[selectedIndex[1]].value;
                        id2 = list[selectedIndex[0]].children[selectedIndex[1]].children[selectedIndex[2]].value;
                    }else{
                        text1="";
                        text2="";
                        id1="";
                        id2="";
                    }

                    let text = text0+' '+text1+' '+text2;
                    _this.enterdata.geoStr = text;
                    _this.enterdata.geoProvinceId = id0;
                    _this.enterdata.geoCityId = id1;
                    _this.enterdata.geoDistrictId = id2;
                    state.$emit("pickerselect",text);
                });
                //滚动停止事件
                _this.picker.on('picker.change', function (index, selectedIndex) {
                    //切换了市
                    if(index===1){
                        let arr0 = _this.picker.options.selectedIndex[0];
                        _this.picker.refillColumn(2,list[arr0].children[selectedIndex].children)
                    }
                    //切换了省
                    if(index===0){
                        _this.picker.refillColumn(1,list[selectedIndex].children);
                        if(list[selectedIndex].children.length>0){
                            _this.picker.refillColumn(2,list[selectedIndex].children[0].children);
                        }else{
                            _this.picker.refillColumn(2,[]);
                        }

                    }
                });

                _this.picker.on('picker.valuechange', function (selectedVal, selectedIndex) {

                });
            }
        }
    }
</script>

<style lang="less">
    body {
        padding: 0;
        margin: 0;
        font-family: "微软雅黑";
        max-width: 750px;
        margin: 0 auto;
        background-color: #f6f6f6;
    }

    a,
    div,
    img,
    button,
    input,
    textarea,
    ul,
    li,
    span {
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
        outline: none;
    }

    input,
    textarea,
    select {
        -webkit-appearance: none;
    }

    ul,
    li {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    a {
        color: #333333;
        text-decoration: none;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: all .2s ease;
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }
    .clear{
        clear: both;
    }
    #app {
        @size:37.5;
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        .gheader{
            height: 44rem/@size;
            font-size: 17rem/@size;
            color: #030303;
            text-align: center;
            position: relative;
            border-bottom: 1px solid #f6f6f6;
            background-color: #ffffff;
            .back{
                position: absolute;
                line-height: 44rem/@size;
                padding-left: 8rem/@size;
                color: #3b55e6;
                top:0;
                left:0;
                height: 44rem/@size;
                width: 44rem/@size;
                background-image: url("assets/images/backBlack.png");
                background-size: 10rem/@size;
                background-repeat: no-repeat;
                background-position: center;
            }
            span{
                display: inline-block;
                line-height: 45rem/@size;

            }
        }
        .tips {
            position: fixed;
            top: 110%;
            width: 100%;
            left: 0;
            text-align: center;
            transition: all 0.3s;
            z-index: 999;
            span {
                color: #fff;
                padding: 10rem/@size 15rem/@size;
                background-color: rgba(0,0,0,0.9);
                font-size: 14rem/@size;
                border-radius: 4px;
            }
        }
    }
</style>
