<template>
    <div class="servers">
        <ul>
            <li v-for="item in serverlist">
                <div class="paddbox">
                    <span>
                        <div class="innerbox" @click="selectServer(item.serviceTypeId,item.serviceName)">
                            <img :src="item.iconUrl" alt="">
                            <div class="item">{{item.serviceName}}</div>
                        </div>
                    </span>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: "servers",
        data() {
            return {
                serverlist: []
            }
        },
        mounted() {
            let _this = this;
            this.$http
                .get("api/v1/oto/serviceTypes")
                .then(function (res) {
                    console.log(res);
                    if (res.data.code === 0) {
                        _this.serverlist = res.data.data;
                    }
                })
        },
        methods:{
            selectServer(id,name){
                this.enterdata.serviceTypeName = name;
                this.enterdata.serviceTypeId = id;
                this.$router.push({name:"fillinfo"})
            }
        }
    }
</script>
<style lang="less">
    .servers {
        @size: 37.5;
        overflow: hidden;
        border-top: 1px solid #f5f5f5;
        ul {
            margin-right: -1px;
            li {
                float: left;
                width: 33.3333%;
                background-color: #fff;
                border-bottom: 1px solid #f5f5f5;
                .paddbox {
                    padding-bottom: 100%;
                    position: relative;
                    span {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        background-color: #fff;
                        .innerbox {
                            border-right: 1px solid #f5f5f5;
                            text-align: center;
                            vertical-align: middle;
                            height: 100%;
                            img {
                                width: 35rem/@size;
                                height: 35rem/@size;
                                display: block;
                                margin: auto;
                                padding-top: 30rem/@size;
                            }
                            .item {
                                font-size: 13rem/@size;
                                padding-top: 10rem/@size;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
