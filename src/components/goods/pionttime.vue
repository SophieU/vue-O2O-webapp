<template>
    <div class="pionttime">
        <div class="title">预约日</div>
        <ul class="weeklist">
            <li v-for="(item,ind) in weeklist" @click="checkweek(ind)">
                <div class="left">{{item.week}}</div>
                <div class="right">
                    <div class="radio" :class="item.check?'active':''">
                        <span class="radioitem">
                            <span class="radioinner"></span>
                        </span>
                    </div>
                </div>
            </li>
        </ul>
        <div class="title">预约时间段</div>
        <div class="time" @click="showpicker(true)">
            <div class="left">开始时间段</div>
            <div class="right">{{startTime || '未选择'}}</div>
        </div>
        <div class="time" @click="showpicker(false)">
            <div class="left">结束时间段</div>
            <div class="right">{{endTime || '未选择'}}</div>
        </div>
    </div>
</template>
<script>
    import Picker from 'better-picker'
    import g from '../../assets/js/geditor'
    export default {
        name: "pointtime",
        data() {
            return {
                weeklist: [
                    {
                        week: '周一',
                        check: false,
                    }, {
                        week: '周二',
                        check: false,
                    }, {
                        week: '周三',
                        check: false,
                    }, {
                        week: '周四',
                        check: false,
                    }, {
                        week: '周五',
                        check: false,
                    }, {
                        week: '周六',
                        check: false,
                    }, {
                        week: '周日',
                        check: false,
                    },
                ],
                startTime: g.reserveBeginTime,//开始时间
                endTime: g.reserveEndTime,//结束时间
                setStart: true,//设置开始时间 false：设置结束时间
            }
        },
        mounted() {
            let _this = this;
            //默认星期显示
            let weeklist = g.reserveWeek.split(",");
            for(let i=0;i<7;i++){
                let ind = (i+1).toString();
                if(weeklist.indexOf(ind)>-1){
                    _this.weeklist[i].check = true;
                }else{
                    _this.weeklist[i].check = false;
                }
            }
            //制作小时数据和分钟数据 给选择器使用
            let datesrc = [];
            let timesrc = [0];
            for (let i = 0; i < 24; i++) {
                let str = i < 10 ? ('0' + i) : i.toString();
                datesrc.push({
                    text: str,
                    value: str
                })
            }
//            需求整点
//            for (let i = 0; i < 60; i++) {
//                let str = i < 10 ? ('0' + i) : i.toString();
//                timesrc.push({
//                    text: str,
//                    value: str
//                })
//            }
            let font = [{
                text: "　　小时:",
                value: 0
            }];
            let font1 = [{
                text: '　　分钟:',
                value: 0
            }];
            this.picker = new Picker({
                data: [font, datesrc, font1,timesrc],
                selectedIndex: [0, 8, 0, 0],
                title: '选择时间'
            });
            //监听选择器确定事件
            this.picker.on('picker.select', function (selectedVal, selectedIndex) {
                let scate = selectedIndex[3] < 10 ? ('0' + selectedIndex[3]) : selectedIndex[3];
                let str = selectedVal[1] + ':' + scate;
                if (_this.setStart) {
                    _this.startTime = str;
                    g.reserveBeginTime = str;
                } else {
                    _this.endTime = str;
                    g.reserveEndTime = str;
                }
            })
        },
        methods: {
            //选择时间弹框
            showpicker(bloo) {
                this.setStart = bloo;
                this.picker.show();
            },
            //星期选择
            checkweek(ind){
                this.weeklist[ind].check = !this.weeklist[ind].check;
                //选中的星期转化成字符串保存
                let weekarr = [];
                for(let i=0;i<7;i++){
                    if(this.weeklist[i].check){
                        let ind = (i+1).toString();
                        weekarr.push(ind);
                    }
                }
                g.reserveWeek = weekarr.join(',');
            }
        }
    }
</script>
<style lang="less">
    .pionttime {
        @size: 37.5;
        .title {
            height: 40rem/@size;
            line-height: 40rem/@size;
            padding: 0 20rem/@size;
            font-size: 14px;
            color: #CCCCCC;
        }
        .weeklist {
            font-size: 13px;
            color: #1A1A1A;
            background-color: #fff;
            li {
                height: 50rem/@size;
                line-height: 50rem/@size;
                margin: 0 0 0 20rem/@size;
                padding: 0 20rem/@size 0 0;
                overflow: hidden;
                border-bottom: 1px solid #f6f6f6;
                .left {
                    float: left;
                }
                .right {
                    float: right;
                    .radio {
                        font-size: 14rem/@size;
                        display: inline-block;
                        vertical-align: middle;
                        .radioitem {
                            width: 15rem/@size;
                            height: 15rem/@size;
                            border: 1px solid #9a9a9a;
                            border-radius: 100%;
                            text-align: center;
                            display: inline-block;
                            line-height: 15rem/@size;
                            .radioinner {
                                background-color: #ffffff;
                                border-radius: 10rem/@size;
                                width: 9rem/@size;
                                height: 9rem/@size;
                                display: inline-block;
                                font-size: 0;
                            }
                        }
                    }
                    .active {
                        .radioitem {
                            border: 1px solid #1a1a1a;
                            .radioinner {
                                background-color: #1a1a1a;
                            }

                        }
                    }
                }
            }
        }
        .time {
            font-size: 15rem/@size;
            color: #1A1A1A;
            height: 52rem/@size;
            line-height: 52rem/@size;
            margin-bottom: 10rem/@size;
            padding: 0 18rem/@size 0 20rem/@size;
            background-color: #ffffff;
            .left {
                float: left;
            }
            .right {
                float: right;
                font-size: 14rem/@size;
                color: #9A9A9A;
                padding-right: 20rem/@size;
                background-image: url("../../assets/images/ic_arrow.png");
                background-size: 16rem/@size;
                background-repeat: no-repeat;
                background-position: right center;
            }
        }
    }
</style>
