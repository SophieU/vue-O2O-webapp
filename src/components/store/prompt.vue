<template>
    <div class="prompt" v-if="propdata.show">
        <div class="promptcell">
            <div class="promptbox">
                <div class="header">{{propdata.title || '提示'}}</div>
                <div class="tbody">
                    <!-- -->
                    <input v-if="propdata.type==='input'" type="text" :placeholder="propdata.placeholder" maxlength="15" v-model="propdata.initval">
                    <textarea v-model="propdata.initval" v-if="propdata.type==='text'" name="" id=""  :placeholder="propdata.placeholder" maxlength="30"></textarea>
                    <div class="right" v-if="propdata.type==='inputPlane'">
                        <input type="text" class="qu" maxlength="4" v-model="propdata.initvalQu"> - <input class="hao" maxlength="8" placeholder="电话" type="text" v-model="propdata.initvalHao">
                    </div>
                </div>

                <div class="tipmsg" v-if="!propdata.fontSize">不超过{{propdata.type==='input'?'15':'30'}}字</div>
                <div class="tipmsg" v-if="propdata.fontSize">不超过{{propdata.fontSize}}字</div>
                <div class="btns">
                    <div class="cancel" @click.stop="cancel()">取消</div>
                    <div class="confirm" @click.stop="confirm()">确定</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {state} from '../../assets/js/state';
    export default {
        name:"prompt",
        data(){
            return{
                inputval:'',
                textval:""
            }
        },
        props:['propdata'],
        mounted(){


        },
        methods:{
            cancel(){
                state.$emit("promptevent","cancelprompt");
            },
            confirm(){
                let _this = this;
                let val = this.propdata.initval;
                let valQu = this.propdata.initvalQu,
                    valHao = this.propdata.initvalHao;
                if(_this.propdata.type=='inputPlane'){
                    state.$emit("promptevent",{valQu:valQu,valHao:valHao,strid:_this.propdata.strid});
                }else{
                    state.$emit("promptevent",{val:val,strid:_this.propdata.strid});

                }
            }
        }
    }
</script>
<style lang="less">
    .prompt{
        @size:37.5;
        position: fixed;
        height: 100%;
        width: 100%;
        top:0;
        left:0;
        right:0;
        bottom: 0;
        background-color: rgba(0,0,0,0.6);
        display: table;
        .promptcell{
            display: table-cell;
            vertical-align:middle;


            .promptbox{
                background-color: #fff;
                width: 310rem/@size;
                text-align: center;
                border-radius: 10rem/@size;
                margin: auto;
                box-shadow: 0 4px 8px 0 rgba(0,0,0,0.30);
                .right {
                    font-size: 14rem/@size;
                    display: flex;
                    align-items: center;
                    color: #1a1a1a;
                    &.noarr {
                        background: none;
                        padding-right: 0;
                    }
                    input{
                        margin: 0;
                        padding: 0;
                        height: 100%;
                        border: none;
                        font-weight: 700;
                        color: #1a1a1a;
                        text-align: right;
                        font-size: 14rem/@size;
                        &.qu{
                            /*width: 40rem/@size;*/
                            flex:0 0 50rem/@size;
                        }
                        &.hao{
                            flex:1;
                            text-align: left;
                            width: 64rem/@size;
                            padding-left: 10rem/@size;
                        }
                        &::placeholder{
                            color: #d5d5d5;
                        }
                    }
                }
                .header{
                    height: 50rem/@size;
                    line-height: 50rem/@size;
                    background-image: url("../../assets/images/img_popup_window.png");
                    background-size: cover;
                    font-size: 16rem/@size;
                    color: #FFFFFF;
                }
                .tbody{
                    margin: 24rem/@size 16rem/@size 0 16rem/@size;
                    border: 1px solid #E5E5E5;
                    input{
                        width: 100%;
                        display: block;
                        margin: 15rem/@size 0;
                        font-size: 14rem/@size;
                        text-align: center;
                        padding: 0;
                        border: none;
                    }
                    textarea{
                        width: 94%;
                        display: block;
                        margin: 12rem/@size auto;
                        border: none;
                        font-size: 14rem/@size;
                        text-align: center;
                        height: 80rem/@size;
                        resize: none;
                    }
                }
                .tipmsg{
                    margin: 6rem/@size 16rem/@size;
                    text-align: right;
                    font-size: 10rem/@size;
                    color: #3B55E6;
                }
                .btns{
                    border-top: 1px solid #e5e5e5;
                    height: 48rem/@size;
                    div{
                        float: left;
                        font-size: 16rem/@size;
                        color: #3B55E6;
                        height: 48rem/@size;
                        line-height: 48rem/@size;
                    }
                    .cancel{
                        width: 49%;
                        border-right: 1px solid #e5e5e5;
                    }
                    .confirm{
                        width: 50%;
                    }
                }
            }
        }
    }

</style>
