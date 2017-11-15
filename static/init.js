var init = function () {
    var setFont = function () {
        var sizef = window.screen.width/ 10;
        sizef = sizef >= 75 ? 75 : sizef;
        document.getElementsByTagName('html')[0].style.fontSize = sizef+'px';
    };
    window.onresize = function () {
        setFont()
    };
    setTimeout(function () {
        setFont();
    }, 10)



};
init();
var appinit = function (cb) {
    // 判断ios 和 android
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
    //判断是否在一生约app内
    var isApp = (function () {
        var sUserAgent = navigator.userAgent.toLowerCase();
        if (sUserAgent.match(/yishengyue/i) == "yishengyue") {
            return true;
        } else {
            return false;
        }
    })();
    //ios桥接
    if (isApp) {
        if (device == "ios") {
            function connectToSwiftWebViewBridge(callback) {
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
        } else if (device == "android") {//安卓实际不需桥接 但是为了传参数与ios一致 还是进行了封装
            var app = function (obj) {

                if (obj.data) {
                    var send = JSON.stringify(obj.data);
                    var res = JsToNative[obj.funName](send);
                } else {
                    var res = JsToNative[obj.funName]();
                }
                typeof obj.callback == "function" && obj.callback(JSON.parse(res));
            }
            typeof cb == "function" && cb(app);
        }
    } else {
        typeof cb == "function" && cb();
    }
};
//使用方法
// init(function (app) {
//     if(app){
//         // 到这里说明网页在一生约app中被打开
//         // 并且已经桥接初始化完成 可以调用app定义好的方法
//         // 例：调用app的原生分享  （app端定义的方法名为 'share'）
//         app({
//             funName: "share",//app暴露给你的方法名称
//             data: {          //传给app的参数
//                 title: '分享标题',
//                 des: '分享描述',
//                 img: "分享缩略图（url全路径）",
//                 url: 'http://www.baidu.com'//分享的url地址
//             },
//             callback: function(res) { //调用原生方法后的回调 app端可以通过res告诉你调用成功（失败）等其他业务数据 （也有可能没有回调）
//                 console.log(res);
//             }
//         })
//     }else{
//         // 这里说明该网页在普通浏览器中被打开
//     }
//
// });
