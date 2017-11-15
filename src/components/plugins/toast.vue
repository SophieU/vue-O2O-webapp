<template>
    <transition name='fade'>
        <div v-show='visible' :class='position' class='toast'>
            <span>{{message}}</span>
        </div>
    </transition>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'hello',
        data() {
            return {
                visible: false,
                message : '',
                position : ''
            }
        }
    }
</script>
<style lang="less">
    @size:37.5;
    .toast{
        background: #000;
        position: fixed;
        left:50%;
        transform:translate(-50%,-50%) ;
        word-wrap:break-word;
        padding:10px;
        text-align: center;
        z-index:9999;
        font-size:15rem/@size;
        width:100rem/@size;
        max-width:200rem/@size;
        color: #fff;
        border-radius: 5px;
        background: rgba(0,0,0,0.7);
        overflow: hidden;
    }
    .toast.middle{
        top:50%;
    }
    .toast.top{
        top:10%;
    }
    .toast.bottom{
        top:90%;
    }
    .fade-enter-active, .fade-leave-active {
        transition: all .5s;
        opacity:1;
    }
    .fade-enter, .fade-leave-active {
        transform:translate(-50%,-50%) ;
        opacity:0;
    }

</style>
