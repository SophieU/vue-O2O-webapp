<template>
    <div class="store">
        <div class="managebox">
            <ul>
                <li @click="editorName()">
                    <div class="left">店铺名称</div>
                    <div class="right">{{storeName}}</div>
                </li>
                <li @click="clickIntroduce()">
                    <div class="left">店铺简介</div>
                    <div class="right">{{introduce || '未填写'}}</div>
                </li>
                <li @click="acinfo()">
                    <div class="left">认证信息</div>
                    <div class="right"> 已认证</div>
                </li>
                <li @click="setAddress()">
                    <div class="left">店铺地址</div>
                    <div class="right">{{geoInfo}}{{storeAddress}}</div>
                </li>
                <li @click="setPhone()">
                    <div class="left">联系方式</div>
                    <div class="right">{{storePhone}}</div>
                </li>
            </ul>
            <ul>
                <li @click="setZpimg()">
                    <div class="left">门店招牌图片</div>
                    <div class="right">{{havestoreZpImgList}}</div>
                </li>
                <li @click="setHjimg()">
                    <div class="left">门店环境图片</div>
                    <div class="right">{{havestoreHjImgList}}</div>
                </li>
            </ul>
        </div>
        <div class="clear"></div>
        <div class="btnbox">
            <router-link :to="{name:'storeview',query:{storeId:storeId}}" class="btn">店铺预览</router-link>
        </div>
        <show-prompt v-bind:propdata="propdata"></show-prompt>
    </div>
</template>
<script>
    import ShowPrompt from "./prompt.vue"
    import {state} from '../../assets/js/state';
    import  msg from '../../assets/js/msg'

    export default {
        name: "manages",
        data() {
            return {
                storeName: "",
                introduce: "",
                geoInfo:"",
                storeAddress: "",
                storePhone: '',
                havestoreZpImgList: '未上传',
                havestoreHjImgList: '未上传',
                propdata: {},
                storeId:'',
                userId:''
            }
        },
        components: {ShowPrompt},
        mounted() {
            var storeId;
            if(localStorage.getItem('storeId')!= 'undefined'){
                storeId = localStorage.getItem("storeId")
            }else{
                storeId =this.$route.query.storeId
            }
            let userId = localStorage.getItem("userId");
            this.storeId = storeId;
            this.userId = userId;
            let _this = this;
            if(storeId==''){
                msg('storeId为空，未请求到店铺信息')
            }
            this.getInfo(storeId, userId);
            state.$on("promptevent", function (res) {
                if (res === 'cancelprompt') {
                    _this.propdata.show = false;
                } else {
                    if (res.val === '') {
                        _this.propdata.show = false;
                    } else {
                        if (res.strid === "storeName") {
                            _this.editorNameSend(res.val);
                        }
                        if (res.strid === "introduce") {
                            _this.editorIntroduce(res.val);
                        }
                    }
                }
            })
        },
        methods: {
            getInfo(id, userid) {
                let _this = this;
                this.$http
                    .get('api/v1/oto/store/getStoreIfoById?storeId=' + id + '&otoUserId=' + userid)
                    .then(function (res) {
                        if (res.data.code === 0) {
                            let data = res.data.data;
                            _this.storeName = data.storeName;
                            _this.introduce = data.introduce;
                            _this.geoInfo = data.geoInfo;
                            _this.storeAddress = data.storeAddress;
                            _this.storePhone = data.storePhone;
                            _this.telPhone= data.telPhone;
                            _this.havestoreZpImgList = (data.storeZpImgList.length < 1 ? '未上传' : '已上传');
                            _this.havestoreHjImgList = (data.storeHjImgList.length < 1 ? '未上传' : '已上传');
                            _this.storeHjImgList = data.storeHjImgList;
                            _this.storeZpImgList = data.storeZpImgList;
                        }
                    }).catch(function () {
                })
            },
            editorName() {
                let _this = this;
                _this.propdata = {
                    show: true,
                    strid: "storeName",
                    title: "店铺名称",
                    type: "input",
                    initval:_this.storeName,
                    placeholder: "请输入店铺名称"
                }
            },
            editorNameSend(name) {
                let _this = this;
                this.$http
                    .get('api/v1/oto/store/setStoreName?storeId=' + _this.storeId + "&name=" + name)
                    .then(function (res) {
                        console.log(res);
                        if (res.data.code === 0) {
                            _this.propdata.show = false;
                            _this.storeName = name;
                        }
                    })
            },
            clickIntroduce() {
                let _this = this;
                this.propdata = {
                    show: true,
                    strid: "introduce",
                    title: "店铺简介",
                    type: "text",
                    initval: _this.introduce,
                    placeholder: "请在此输入对你店铺特色、服务内容、营业时间的介绍"
                }
            },
            editorIntroduce(txt) {
                let _this = this;
                this.$http
                    .get('api/v1/oto/store/setStoreIntro?storeId=' + _this.storeId + "&intro=" + txt)
                    .then(function (res) {
                        console.log(res);
                        if (res.data.code === 0) {
                            _this.propdata.show = false;
                            _this.introduce = txt;
                        }
                    })
            },
            acinfo() {
                this.$router.push({name: "acinfo"})
            },
            setAddress() {
                this.$router.push({name: "address",params:{geostr:this.geoInfo,desstr:this.storeAddress}})
            },
            setPhone() {
                this.$router.push({name: "connect", params: {storePhone: this.storePhone, telPhone: this.telPhone}})
            },
            setHjimg(){
                this.$router.push({name: "edhj", params:{imgs:this.storeHjImgList}})
            },
            setZpimg(){
                this.$router.push({name: "edzp", params:{imgs:this.storeZpImgList}})
            }
        }
    }
</script>
<style lang="less">
    .store {
        @size: 37.5;
        .managebox {
            ul {
                margin-top: 10rem/@size;
                background-color: #fff;
                li {
                    height: 54rem/@size;
                    line-height: 54rem/@size;
                    color: #1a1a1a;
                    margin-left: 20rem/@size;
                    padding-right: 15rem/@size;
                    border-bottom: 1px solid #f5f5f5;
                    .left {
                        font-size: 15rem/@size;
                        float: left;
                    }
                    .right {
                        font-size: 14rem/@size;
                        font-weight: 700;
                        width: 210rem/@size;
                        text-align: right;
                        float: right;
                        background-image: url("../../assets/images/ic_arrow.png");
                        background-position: right center;
                        background-size: 16rem/@size;
                        background-repeat: no-repeat;
                        padding-right: 20rem/@size;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }
        .btnbox {
            position: fixed;
            width: 100%;
            bottom: 0;
            left: 0;
            .btn {
                margin: 20rem/@size;
                background-color: #1a1a1a;
                text-align: center;
                height: 50rem/@size;
                line-height: 50rem/@size;
                color: #fff;
                font-size: 14rem/@size;
                display: block;
            }
        }
    }
</style>
