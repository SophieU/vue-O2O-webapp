<template>
    <div class="acinfo">
        <div class="baseinfo">
            <ul>
                <li>
                    <div class="title">营业执照注册号</div>
                    <div class="inputbox">
                        <input type="text" placeholder="输入营业执照号码，必填" disabled v-model="businessCertificateNum" @input="saveInfo()">
                    </div>
                    <div class="clear"></div>
                </li>
                <li>
                    <div class="title">身份证姓名</div>
                    <div class="inputbox">
                        <input type="text" placeholder="输入身份证姓名，必填" disabled v-model="storeOwnerName" @input="saveInfo()">
                    </div>
                    <div class="clear"></div>
                </li>
                <li>
                    <div class="title">身份证号码</div>
                    <div class="inputbox">
                        <input type="text" placeholder="输入身份证号码，必填" disabled v-model="storeOwnerIdCard" @input="saveInfo()">
                    </div>
                    <div class="clear"></div>
                </li>
            </ul>
        </div>
        <div class="spectitle">身份证照片</div>
        <div class="baseimg">
            <div class="itemlist">
                <div class="imglist">
                    <div class="uploaded" v-show="idCardImagesUrl1"><img :src="idCardImagesUrl1" alt=""> </div>
                    <div class="tipimg"></div>
                </div>
                <div class="imglist">
                    <div class="uploaded" v-show="idCardImagesUrl2"><img :src="idCardImagesUrl2" alt=""> </div>
                    <div class="tipimg"></div>
                </div>
                <div class="bottomtips">
                    认证时间 <span>{{ctime1}}</span>
                </div>

            </div>
            <div class="spectitle">店铺营业执照</div>
            <div class="itemlist">
                <div class="imglist">
                    <div class="uploaded" v-show="businessCertificateImagesUrl"><img :src="businessCertificateImagesUrl" alt=""> </div>
                    <div class="tipimg"></div>
                </div>
                <div class="bottomtips">
                    认证时间 <span>{{ctime2}}</span>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    export default {
        name:"acinfo",
        data(){
            return{
                accpt:false,
                showpop:0,
                businessCertificateNum:"",
                storeOwnerIdCard:"",
                cansubmit:true,
                idCardImagesUrl1:'',
                idCardImagesUrl2:'',
                businessCertificateImagesUrl:'',
                storeOwnerName:'',
                ctime1:'',
                ctime2:""
            }
        },
        mounted(){
            let _this = this;
            let storeId = localStorage.getItem('storeId');
            this.$http.get("api/v1/oto/store/storeAuthenticatio?storeId="+storeId).then(function (res) {
                if(res.data.code===0){
                    let data = res.data.data;
                    _this.businessCertificateNum = data.businessCertificateNum;
                    _this.storeOwnerIdCard = data.storeOwnerIdCard;
                    _this.storeOwnerName = data.storeOwnerName;
                    _this.businessCertificateImagesUrl = data.businessCertificateImage.imgName;
                    _this.ctime1=data.businessCertificateImage.createTime;
                    _this.idCardImagesUrl1 = data.storeOwnerCardImage[0].imgName;
                    _this.idCardImagesUrl2 = data.storeOwnerCardImage[1].imgName;
                    _this.ctime2=data.storeOwnerCardImage[0].createTime;
                }
            })
        },
        methods:{

        }
    }
</script>
<style lang="less">
    .acinfo{
        @size:37.5;
        background-color: #fff;
        margin-top: 10rem/@size;
        .baseinfo{
            ul{
                margin-bottom: -1px;
                li{
                    margin-left: 20rem/@size;
                    padding-right: 15rem/@size;
                    border-bottom: 1px solid #F6F6F6;

                    .title{
                        font-size: 15px;
                        color: #1A1A1A;
                        float: left;
                        line-height: 54rem/@size;
                    }
                    .inputbox{
                        float: right;
                        input{
                            width: 5rem;
                            display: block;
                            border:none;
                            height: 23rem/@size;
                            margin: 15rem/@size 0;
                            text-align: right;
                            font-size: 15rem/@size;
                            &:disabled{
                                background-color: #fff;
                            }
                            &::placeholder{
                                color: #cccccc;
                            }
                        }
                    }
                }
            }
        }
        .spectitle{
            background-color: #f6f6f6;
            height: 54rem/@size;
            line-height: 54rem/@size;
            font-size: 15rem/@size;
            color: #3c3c3c;
            padding: 0 20rem/@size;
        }
        .baseimg{
            .itemlist{
                margin: 10rem/@size 0 0rem/@size 15rem/@size;
                padding-bottom: 20rem/@size;
                .title{
                    font-size: 15rem/@size;
                    color: #3C3C3C;
                    span{
                        color: #F15949;
                        padding-right: 10rem/@size;
                        vertical-align: bottom;
                    }
                }
                .imglist{
                    width: 150rem/@size;
                    height: 95rem/@size;
                    border-radius: 6px;
                    display: inline-block;
                    background: #F9F9F9;
                    border: 1px solid #DCDCDC;
                    margin: 18rem/@size 0rem/@size 0rem/@size 12rem/@size;
                    text-align: center;
                    position: relative;
                    input{
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        top:0;
                        left:0;
                        opacity: 0;
                    }
                    .innerfont{
                        font-size: 12rem/@size;
                        text-align: center;
                        color: #4A4A4A;
                    }
                    .addicon{
                        width: 27rem/@size;
                        margin-top: 20rem/@size;
                    }
                    .uploaded{
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        top:0;
                        left:0;
                        img{
                            height: 100%;
                            width: 100%;
                            border-radius: 6px;
                        }
                    }
                    .tipimg{
                        position: absolute;
                        top:0;
                        right:0;
                        width: 54rem/@size;
                        height: 54rem/@size;
                        background-image: url("../../assets/images/ic_renzheng.png");
                        background-size: cover;
                    }
                }
                .bottomtips{
                    font-size: 12rem/@size;
                    color: #3a3a3a;
                    padding:6rem/@size 10rem/@size;
                    span{
                        color: #1a1a1a;
                        font-weight: 700;
                        display: block;
                        padding-top: 6rem/@size;
                    }
                }
            }
        }
    }
</style>
