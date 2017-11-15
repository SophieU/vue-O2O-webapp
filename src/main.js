// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import msg from './assets/js/msg';
import VueAwesomeSwiper from 'vue-awesome-swiper'
axios.defaults.timeout = 10000;
axios.defaults.baseURL = 'https://api.yishengyue.cn/';

Vue.use(VueAwesomeSwiper)

Vue.prototype.$http = axios;
import enterdata from "./assets/js/enter";

Vue.prototype.enterdata = enterdata;
//图片上传
Vue.prototype.uploadimg = function (id, callback) {
    let _this = this;
    let imgfiles = document.getElementById(id).files;
    let upLoadImg = function (obj, innercb) {
        // alert(obj.size)

        if (!/image\/\w+/.test(obj.type)) {
            msg('只能上传图片哟');
            return false;
        }
        if (obj.size > 10 * 1024 * 1000) {
            msg('上传图片大小不能超过10M');
            return false;
        }

        //上传

        var formdata = new FormData();
        formdata.append("file", obj);
        _this.$http
            .post("/api/v1/base/qiniu/upload/image", formdata)
            .then(function (res) {
                if (res.data.code === 0) {
                    typeof innercb === "function" && innercb(res.data.data);
                }else{
                    msg(res)
                }
        });


    };
    if (imgfiles.length === 0) {
        return false;
    } else if (imgfiles.length === 1) {

        upLoadImg(imgfiles[0], function (res) {
            typeof callback === "function" && callback([res]);
        });
    } else {
        let backarr = [];
        let i = 0;
        let initfunc = function () {
            if (i < imgfiles.length) {
                upLoadImg(imgfiles[i], function (res) {
                    i++;
                    backarr.push(res);
                    initfunc();
                })
            }else{
                typeof callback === "function" && callback(backarr);
            }
        };
        initfunc();
    }
};
Vue.config.productionTip = false;
// let userId = localStorage.getItem("userId");
// if(!userId){
//     router.push({name:"startup"});
// }
//修改页面title

// 触底事件（简化版）
Vue.prototype.toBottom = function(cb) {
    window.onscroll = function() {
        var a = document.documentElement.scrollTop || document.body.scrollTop;
        var b = document.body.scrollHeight;
        var c = document.documentElement.clientHeight;
        if (a + c >= b - 1) {
            typeof cb == "function" && cb();
        }
    }
};

//vue
var vm = new Vue({
    router,
    template: '<App/>',
    components: {App},
});

//一生约app初始化
appinit(function (ysyapp) {
    window.ysyapp =  ysyapp;
    //获取登录信息
    if(ysyapp){
        ysyapp({
            funName:'getUserId',
            data:"",
            callback:function (res) {
                axios.defaults.headers['accessToken'] = res.accessToken;
                localStorage.setItem('userId', res.userId);
                vm.$mount("#app");

            }
        });
    }else{
        vm.$mount("#app");
    }

});
