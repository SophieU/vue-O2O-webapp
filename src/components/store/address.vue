<template>
    <div class="address">
        <div class="managebox">
            <ul>
                <li @click="showPicker()">
                    <div class="left">商家地址</div>
                    <div class="right">{{geostr}}</div>
                </li>
                <li @click="showPop()">
                    <div class="left">详细地址</div>
                    <div class="right noarr">{{desstr}}</div>
                </li>
            </ul>
        </div>
        <div class="btnbox">
            <div class="btn" @click="save()">保存</div>
        </div>
        <show-prompt v-bind:propdata="propdata"></show-prompt>
    </div>
</template>
<script>
    import { state } from "../../assets/js/state"
    import ShowPrompt from "./prompt.vue"
    import msg from "../../assets/js/msg"
    export default {
        name:"address",
        data(){
            return{
                geostr:'',
                desstr:"",
                propdata:{},
            }
        },
        components:{ShowPrompt},
        mounted(){
            let _this = this;
            this.geostr = this.$route.params.geostr;
            this.desstr = this.$route.params.desstr;
            state.$on("pickerselect",function (res) {
                _this.geostr = res;
            });
            state.$on("promptevent",function (res) {
                if(res==='cancelprompt'){
                    _this.propdata.show = false;
                }else{
                    if(res.val===''){
                        _this.propdata.show = false;
                    }else{
                        if(res.strid==="address"){
                            _this.desstr = res.val;
                            _this.propdata.show = false;
                        }
                    }
                }
            })
        },
        methods:{
            showPicker(){
                state.$emit("picker","");
            },
            showPop(){
                let _this = this;
                this.propdata={
                    show:true,
                    strid:"address",
                    title:"详细地址",
                    type:"text",
                    initval:_this.desstr,
                    placeholder:"请输入详细地址"
                }
            },
            save(){
                let _this = this;
                let data ={
                    storeId:localStorage.getItem("storeId"),
                    provinceId:this.enterdata.geoProvinceId,
                    cityId:this.enterdata.geoCityId,
                    areaId:this.enterdata.geoDistrictId,
                    streetAddress:this.desstr,
                    geoInfo:this.geostr
                };
                console.log(data)
                this.validateAddress(this.desstr,function(lng,lat){
                   console.log('详细街道地址合法')
                    _this.$http.post("api/v1/oto/store/setStoreAddress",data)
                        .then(function (res) {
                            console.log(res.data)

                            if(res.data.code===0){
                                msg(res.data.msg);
                                _this.$router.go(-1);
                            }else{
                                msg(res.data.msg)
                            }
                        })
                });

            },
            //检验地址有效性
            validateAddress(address, cb) {
                this.$http.get('api/v1/oto/validateAddress?address=' + address)
                    .then(function (res) {
                        if (res.data.data) {
                            cb(res.data.data.lng, res.data.data.lat);
                        } else {
                            msg('详细街道地址不合法');
                        }
                    })
            }
        }
    }
</script>
<style lang="less">
    .address{
        @size:37.5;
        .managebox{
            ul{
                margin-top: 10rem/@size;
                background-color: #fff;
                li{
                    height: 54rem/@size;
                    line-height: 54rem/@size;
                    color: #1a1a1a;
                    margin-left: 20rem/@size;
                    padding-right: 15rem/@size;
                    border-bottom: 1px solid #f5f5f5;
                    .left{
                        font-size: 15rem/@size;
                        float: left;
                    }
                    .right{
                        font-size: 14rem/@size;
                        font-weight: 700;
                        float: right;
                        background-image: url("../../assets/images/ic_arrow.png");
                        background-position: right center;
                        background-size: 16rem/@size;
                        background-repeat: no-repeat;
                        padding-right: 20rem/@size;
                        &.noarr{
                            background: none;
                            padding-right: 0;
                        }
                    }
                }
            }
        }
        .btnbox{
            position: fixed;
            width: 100%;
            bottom: 0;
            left:0;
            .btn{
                margin: 20rem/@size;
                background-color: #1a1a1a;
                text-align: center;
                height: 50rem/@size;
                line-height: 50rem/@size;
                color: #fff;
                font-size: 14rem/@size;
            }
        }
    }
</style>
