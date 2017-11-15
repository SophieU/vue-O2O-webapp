<template>
    <div class="edimgs">
        <ul>
            <li v-for="(item,ind) in imglist">
                <div class="libox">
                    <div class="innerbox">
                        <img :src="item.imgurl" alt="">
                    </div>
                    <div class="close" @click="close(ind)" ></div>
                </div>
            </li>
            <li v-show="imglist.length<10">
                <div class="libox">
                    <div class="innerbox addbgn"><input type="file" id="file" @change="upimg('file')"></div>
                </div>
            </li>
        </ul>
        <div class="btnbox" @click="sendData()"><div class="btn">保存</div></div>
    </div>
</template>
<script>
    import m from "../../assets/js/msg"
    export default {
        name:"edzp",
        data(){
            return {
                imglist:[]
            }
        },
        mounted(){
            let _this = this;
            let init = this.$route.params.imgs;
            init.forEach(function (item) {
                _this.imglist.push({
                    imgurl:item.image,
                    key:item.imageUrl
                })
            })
        },
        methods:{
            upimg(id){
                let _this = this;
                this.uploadimg(id,function (res) {
                    res.forEach(function (t) {
                        _this.imglist.push({imgurl:t.imageUrl,key:t.key});
                    })
                });
            },
            sendData(){
                let _this = this;
                let url = [];
                _this.imglist.forEach(function (e) {
                    url.push(e.key);
                });
                let data = {
                    storeId : localStorage.getItem("storeId"),
                    url:url,
                    imageType:2
                };
                console.log(data);
                _this.$http.post("api/v1/oto/store/setStorePhoto",data)
                    .then(function (res) {
                        if(res.data.code===0){
                            m('门店环境图片修改成功');
                            _this.$router.go(-1);
                        }
                    })
            },
            close(index){
                this.imglist.splice(index,1);
            }
        }
    }
</script>
<style lang="less">
    .edimgs{
        @size:37.5;
        ul{
            margin: 10rem/@size;
            li{
                width: 33.33%;
                float: left;
                .libox{
                    position: relative;
                    padding-bottom: 100%;
                    width: 100%;
                    .close{
                        position: absolute;
                        width: 20rem/@size;
                        height: 20rem/@size;
                        background-image: url("../../assets/images/btn_close.png");
                        background-size: cover;
                        right: 0rem/@size;
                        top:0rem/@size;
                    }
                    .innerbox{
                        position: absolute;
                        left: 8rem/@size;
                        top:8rem/@size;
                        right: 8rem/@size;
                        bottom: 8rem/@size;
                        img{
                            height: 100%;
                            width: 100%;
                        }
                        input{
                            height: 100%;
                            width: 100%;
                            opacity: 0;
                        }
                    }
                    .addbgn{
                        background-color: #eee;
                        background-image: url("../../assets/images/ic_camera.png");
                        background-size: 60% 60%;
                        background-repeat: no-repeat;
                        background-position: center;
                        input[type='file']{
                            position: absolute;
                            top:0;
                            left:0;
                            right:0;
                            bottom:0;
                            opacity: 0;
                        }
                    }
                }
            }
        }
    }
</style>
