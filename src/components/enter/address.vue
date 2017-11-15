<template>
    <div class="address">
        <ul class="top">
            <li class="active" @click="pickerinit()">{{str}}</li>
        </ul>

        <div class="name" id="name"></div>
    </div>
</template>
<script>
    import Picker from 'better-picker'
    export default {
        name: "address",
        data() {
            return {
                geolist:[],
                str:"请选择",
                picker:''
            }

        },
        mounted() {
            let _this = this;
            //地区数据
            this.$http
                .get("api/v1/geo/list")
                .then(function (res) {
                    if(res.data.code==0){
                        let list = res.data.data;
                        list =JSON.stringify(list);
                        list = list.replace(/id/g, "value").replace(/name/g, "text");
                        list = JSON.parse(list);
                        _this.picker = new Picker({
                            data: [list, list[0].children, list[0].children[0].children],
                            selectedIndex: [0, 0, 0],
                            title: '选择地址'
                        });
                        _this.picker.on('picker.select', function (selectedVal, selectedIndex) {
                            console.log(selectedVal,selectedIndex,"111111")
                            let text0 = list[selectedIndex[0]].text;
                            let text1,text2;
                            if(list[selectedIndex[0]].children.length>0){
                                text1 = list[selectedIndex[0]].children[selectedIndex[1]].text;
                                text2 = list[selectedIndex[0]].children[selectedIndex[1]].children[selectedIndex[2]].text;
                            }else{
                                text1="";
                                text2="";
                            }

                            let text = text0+' '+text1+' '+text2;
                            _this.str = text;
                            console.log(text);
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


                });
        },
        methods:{
            pickerinit(){
                this.picker.show();
            }
        }
    }
</script>
<style lang="less">
    .address{
        @size:37.5;
        ul{
            &.top{
                background-color: #f5f5f5;
                .active{
                    background-color: #e5e5e5;
                }
            }
            li{
                font-size: 16rem/@size;
                padding: 12rem/@size 15rem/@size;
                border-bottom: 1px solid #d5d5d5;
            }
        }
    }
</style>
