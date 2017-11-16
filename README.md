# o2owebapp

> o2o web app

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
## 项目简介

> 线下商家通过O2O商家app操作发布自己的商品到特定平台（自有销售平台）
- 商家——O2Oapp中入驻平台——O2O中发布商品——O2O中处理订单——根据用户提供的订单验证码进行核销
- 用户——平台App中查看商品——下单——线下消费出示对应订单验证码
- 线上H5预览 https://wap.yishengyue.cn/o2o/index.html#

### 一、功能模块
- 商户登录注册（H5有一套登录流程，app采用原生的登录注册） 
    - 登录（快速登录-验证码、账号登录）
    - 注册
    - 忘记密码
- 商户入驻
    - 填写信息 （验证用户填写，地址选择（better-picker插件），上传店铺图片，输入弹层组件）
    - 提交用户资质 （图片上传）
- 订单管理
    - 订单列表（分页，tab，提示组件）
    - 订单详情
- 商品管理
    - 商品列表（tab，商品操作悬浮层）
    - 编辑商品（上传商品图，时间picker，商品预览）
    - 添加商品（类似编辑商品）
    - 商品详情 （轮播插件：vue-awesome-swiper,自适应）
- 店铺管理
    - 编辑弹层（独立输入组件）
    - 店铺预览（本地状态存储）

### 二、技术栈
- 前端
    - vue：主应用框架
    - vue-router:前端路由控制
    - axios ： 前端资源请求插件
    - better-picker : 地址选择器
    - vue-awesome-swiper : 轮播插件，api文档与swiper是同一个
    - less ： 预编译

- 后台
    - java
    - mySql
- 包
    - android
    - ios

### 三、技能点

#### 3.1  安卓ios的桥接

> 应用中涉及调用原生扫码功能，以及从原生登录后，获取原生传入的 userId等

> 思路：判断ios和android  —— 判断是否在app内  —— ios桥接 —— android桥接

- 1. 判断ios和android
```
var device = (function () {
    var sUserAgent = window.navigator.userAgent.toLowerCase(),
        bIsIpad = sUserAgent.match(/ipad/i) == "ipad",
        bIsIphoneOs = sUserAgent.match(/iphone/i) == "iphone",
        bIsAndroid = sUserAgent.match(/android/i) == "android";

    if (bIsIpad || bIsIphoneOs) {
        return 'ios';
    } else if (bIsAndroid) {
        return 'android';
    }
})();
```
- 2. 判断是否在App内部
```
//判断是否在一生约app内
    var isApp = (function () {
        var sUserAgent = navigator.userAgent.toLowerCase();
        if (sUserAgent.match(/yishengyue/i) == "yishengyue") { //事先通过原生在userAgent加入了此段
            return true;
        } else {
            return false;
        }
    })();
```
- 3. ios桥接
```
if (device == "ios") {
    function connectToSwiftWebViewBridge(callback) {

    // ios通过 swift做的桥接持载，这里通过window.SwiftWebViewBridge拿取ios提供的方法

        if (window.SwiftWebViewBridge) { 
            callback(SwiftWebViewBridge);
        } else {
            document.addEventListener('SwiftWebViewBridgeReady', function () {
                callback(SwiftWebViewBridge);
            }, false);
        }
    }

    connectToSwiftWebViewBridge(function (bridge) {
        bridge.init();
        var app = function (obj) {

            var send = obj.data ? obj.data : '';
            bridge.callSwiftHandler(obj.funName, send, function (res) {
                typeof obj.callback == "function" && obj.callback(res);
            })
        }

        typeof cb == "function" && cb(app);
    });
}
```
- 4. android桥接
```
else if (device == "android") {//安卓实际不需桥接 但是为了传参数与ios一致 还是进行了封装
        var app = function (obj) {

            if (obj.data) {
                var send = JSON.stringify(obj.data);
                // JsToNative是android的webview提供的全局方法
                var res = JsToNative[obj.funName](send);
            } else {
                var res = JsToNative[obj.funName]();
            }
            typeof obj.callback == "function" && obj.callback(JSON.parse(res));
        }
        typeof cb == "function" && cb(app);
    }
```
- 5. 使用
```
appinit(function (ysyapp) { // appinit为包含桥接初始化的函数 ，详见/static/init.js
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
```
#### 3.2  全局数据缓存
> 产品需求：在填写申请入驻信息时，会有从填写页中转到子页进行上传等操作的情况，这时，需要在返回后，填写的页面内容不消失

- 思路： 在Vue上挂全局属性 enterData—— 输入后存储到全局属性中 —— 页面返回时加载enterData中的值




