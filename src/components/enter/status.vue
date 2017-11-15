<template>
    <div class="status">
        <!-- 失败  v-if="status===-1"-->
        <div class="check" :class="{'notCheck':status===-1}"  v-if="status===-1">
            <img class="topimg" src="../../assets/images/ic_failed.png" alt="">
            <div class="statusfont">非常抱歉，您的店铺审核没有通过</div>
            <div class="statusdes">以下资料需要重新编辑</div>
            <div class="s_list">
                <ul>
                    <li :key="ind" v-for="(item,ind) in slist">{{item}}</li>
                </ul>
            </div>
            <a href="#/enter/fillinfo" @click="changeInfo()" class="footerbtn">修改资料</a>
        </div>
        <!-- img -->
        <div class="check" v-if="status===0">
            <img class="topimg" src="../../assets/images/ic_wait.png" alt="">
            <div class="statusfont">等待审核</div>
            <div class="statusdes">我们将在审核完成时，以短信通知您！</div>
        </div>
        <!-- 审核成功 -->
        <div class="check" v-if="status===1">
            <img class="topimg" src="../../assets/images/ic_pass.png" alt="">
            <div class="statusfont">恭喜您，您的店铺审核已通过</div>
            <div class="statusdes">您现在可以去管理自己的店铺了</div>
            <router-link :to="{name:'manages',query:{storeId:storeId}}" class="footerbtn">店铺管理</router-link>
        </div>
    </div>
</template>
<script>
    import g from "../../assets/js/enter"

    export default {
        data() {
            return {
                status: -2,
                slist: [],
            }
        },
        mounted() {
            let _this = this;
            let applyId = localStorage.getItem("applyId");
            this.$http.get("api/v1/oto/applyResult?applyId=" + applyId)
                .then(function (res) {
                    if (res.data.code === 0) {
                        if (res.data.data.resultCode === 'APPLYING') {
                            _this.status = 0
                        }
                        if (res.data.data.resultCode === 'APPLY_SUCCESS') {
                            _this.status = 1;
                            _this.storeId = res.data.data.storeId;
                        }
                        if (res.data.data.resultCode === 'APPLY_FAIL') {
                            _this.status = -1;
                            let result = res.data.data.errorMessage.split("<br>");
                            console.log(res.data.data.errorMessage)
                            result.forEach(function (t) {
                                _this.slist.push(t);
                            })
                        }
                    }
                })
        },
        methods: {
            changeInfo() {
                let _this = this;
                let url = "api/v1/oto/applyInfo?applyId=" + localStorage.getItem('applyId');
                this.$http.get(url)
                    .then(function (res) {
                        if (res.data.code === 0) {
                            let d = res.data.data;
                            let pix = d.imagePrefix;
                            g.storeName = d.storeName;
                            g.serviceTypeId = d.serviceTypeId;
                            g.serviceTypeName = d.serviceTypeName;
                            g.geoProvinceId = d.geoProvinceId;
                            g.geoCityId = d.geoCityId;
                            g.geoDistrictId = d.geoDistrictId;
                            g.storeAddress = d.storeAddress;
                            g.phone = d.phone;
                            g.telephone = d.telephone;
                            let phones ;
                            if(d.telephone){
                                phones=d.telephone.split("-");
                                g.telephone1 = phones[0];
                                g.telephone2 = phones[1];
                            }else{
                                g.telephone1 = '';
                                g.telephone2 = '';
                            }

                            g.introduce = d.introduce;
                            //环境图片
                            g.storeImages = [];
                            g.storeImgUlr = [];
                            for(let i = 0;i<d.storeImages.length;i++){
                                g.storeImages.push(d.storeImages[i]);
                                g.storeImgUlr.push(pix+d.storeImages[i]);
                            }
                            //环境图片
                            g.storeEnvironmentImages = [];
                            g.storeEnvironmentImagesUrl = [];
                            for(let i = 0;i<d.storeEnvironmentImages.length;i++){
                                g.storeEnvironmentImages.push(d.storeEnvironmentImages[i]);
                                g.storeEnvironmentImagesUrl.push(pix + d.storeEnvironmentImages[i]);
                            }
                            g.storeOwnerIDCard = d.storeOwnerIDCard;
                            g.businessCertificateNum = d.businessCertificateNum;
                            g.storeOwnerName = d.storeOwnerName;
                            g.idCardImages = [];
                            //身份证
                            g.idCardImages[0] = d.idCardImages[0];
                            g.idCardImagesUrl1 = pix + d.idCardImages[0];
                            g.idCardImages[1] = d.idCardImages[1];
                            g.idCardImagesUrl2 = pix + d.idCardImages[1];
                            //营业执照
                            g.businessCertificateImages[0] = d.businessCertificateImages[0];
                            g.businessCertificateImagesUrl = pix + d.businessCertificateImages[0];
                            g.geoStr = d.geoProvinceName+' '+d.geoCityName+' '+d.geoDistrictName;
                            g.accpt = true;
                            _this.$router.push({name:"fillinfo"})
                        }
                    })
            }
        }
    }
</script>
<style lang="less">
    @size: 37.5;

    .status {
        position: absolute;
        top:44rem/@size;
        bottom:0;
        /*height: 100%;*/
        width: 100%;
        background-color: #fff;
        .check {
            text-align: center;
            background: #fff;

            .topimg {
                height: 58rem/@size;
                width: auto;
                margin: 90rem/@size auto 45rem/@size auto;
            }
            .statusfont {
                font-size: 16rem/@size;
                color: #1A1A1A;
                padding-bottom: 22rem/@size;
            }
            .statusdes {
                font-size: 14rem/@size;
                color: #6A6A6A;
                padding-bottom: 12rem/@size;
            }
            .s_list {
                width: 230rem/@size;
                padding: 20rem/@size 15rem/@size;
                background: #FAFAFA;
                border-radius: 9px;
                margin: 0 auto;
                ul {
                    li {
                        font-size: 12rem/@size;
                        color: #4A4A4A;
                        line-height: 26rem/@size;
                    }
                }
            }
            .footerbtn {
                background: #fff;
                position: fixed;
                width: 160rem/@size;
                height: 40rem/@size;
                border-radius: 40rem/@size;
                border: 1px solid #4a4a4a;
                text-align: center;
                font-size: 17rem/@size;
                color: #1A1A1A;
                line-height: 40rem/@size;
                bottom: 40rem/@size;
                left: 50%;
                margin-left: -80rem/@size;
            }
            &.notCheck{
                padding-bottom: 20rem/@size;
                .topimg{
                    margin: 50rem/@size auto 30rem/@size auto;
                }
                .footerbtn{
                    position: static;
                    display: block;
                    background: #fff;
                    width: 160rem/@size;
                    height: 40rem/@size;
                    border-radius: 40rem/@size;
                    border: 1px solid #4a4a4a;
                    text-align: center;
                    font-size: 17rem/@size;
                    color: #1A1A1A;
                    line-height: 40rem/@size;
                    margin: 0 auto;
                }
            }
        }
    }

</style>
