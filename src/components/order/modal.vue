<template>
  <div class="modal" v-if="visible">
      <div class="modal-dialog">
          <div class="modal-content">{{message}}</div>
          <div class="modal-footer">
              <button @click="cancel">取消</button>
              <button class="sureBtn" @click="exctCB">确认</button>
          </div>
      </div>
  </div>
</template>
<script type="text/ecmascript-6">
    import msg from '../../assets/js/msg'
    import Vue from 'vue'

    export default {
        name: 'hello',
        data() {
            return {
                visible:this.show
            }
        },
        props:['message','show'],
        methods:{
            cancel(){
               this.$emit('cancelModal')
            },
            exctCB(){
                this.$emit('callback')
            }
        },
        watch:{
            show(show){
                this.visible=show;
            }
        }
    }
</script>
<style lang="less" scoped="">
    @size:37.5;
    .modal{
        position: fixed;
        top:0;
        left:0;
        right:0;
        bottom:0;
        background: rgba(0,0,0,0.4);
        display: flex;
        justify-content: center;
        align-items: center;
        .modal-dialog{
            width:60%;
            padding:30rem/@size 10rem/@size 10rem/@size 10rem/@size;
            background: #fff;
            border-radius: 3px;
        }
        .modal-content{
            font-size: 16rem/@size;
            text-align: center;
        }
        .modal-footer{
            text-align: right;

            button{
                background: transparent;
                border:none;
                font-size: 14rem/@size;
            }
            .sureBtn{
                color: #3C6DF8;
            }
        }
    }
</style>
