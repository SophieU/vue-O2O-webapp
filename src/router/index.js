import Vue from 'vue'
import Router from 'vue-router'

//注册登录
import startup from '@/components/loginSign/startup'
import basebg from "@/components/loginSign/basebg"
import logindefault from "@/components/loginSign/logindefault"
import loginfast from "@/components/loginSign/loginfast"
import register from "@/components/loginSign/register"
import setpassword from "@/components/loginSign/setpassword"
import forget from "@/components/loginSign/forget"

//商家入驻
import enter from "@/components/enter/mainenter"
import fillinfo from "@/components/enter/fillinfo"
import fillapt from "@/components/enter/fillapt"
import status from "@/components/enter/status"
import servers from "@/components/enter/servers"
import arg from "@/components/enter/arg"

//店铺管理
import store from "@/components/store/store"
import manages from "@/components/store/manages"
import address from "@/components/store/address"
import connect from "@/components/store/connect"
import storeview from "@/components/store/storeview"
import acinfo from "@/components/store/acinfo"
import edzp from "@/components/store/edzp"
import edhj from "@/components/store/edhj"
import imgview from "@/components/store/imgview"

//商品管理
import goods from "@/components/goods/goodsmain"
import tsuccess from "@/components/goods/addsuccess"
import addimgtext from "@/components/goods/addimgtext"
import allgoods from "@/components/goods/allgoods"
import addgoods from "@/components/goods/addgoods"
import editorgoods from "@/components/goods/editorgoods"
import goodspreview from "@/components/goods/goodspreview"
import plist from "@/components/goods/plist"
import pionttime from "@/components/goods/pionttime"

//订单管理
import order from '@/components/order/order'
import orderList from '@/components/order/orderLists'
import orderDetail from '@/components/order/orderDetail'
import comment from '@/components/order/comment'

import index from "@/components/index"
import test from "@/components/test"

Vue.use(Router);

export default new Router({
    scrollBehavior(to, from, savedPosition) {
        return {x: 0, y: 0}
    },
    routes: [
        {
            path: '/',
            name: "index",
            component: index,
            meta: {
                title: "首页"
            }
        }, {
            path: "/test",
            name: "test",
            component: test,
            meta: {
                title: '测试'
            }
        },
        {
            path: "/startup",
            name: "startup",//引导页
            component: startup,
            meta: {
                title: "一生约商家O2O"
            }
        }, {
            path: "/enter",
            name: "enter",
            component: enter,
            children: [{
                path: "fillinfo",
                name: "fillinfo",
                component: fillinfo,
                meta: {
                    title: "商户入驻"
                }
            }, {
                path: "fillapt",
                name: "fillapt",
                component: fillapt,
                meta: {
                    title: "商户入驻"
                }
            }, {
                path: "status",
                name: "status",
                component: status,
                meta: {
                    title: "商户入驻"
                }
            }, {
                path: "servers",
                name: "servers",
                component: servers,
                meta: {
                    title: "服务类型"
                }
            },{
                path:"arg",
                name:"arg",
                component:arg,
                meta:{
                    title:'入驻协议'
                }
            }]
        },
        {
            path: "/store",
            component: store,
            children: [{
                path: "manages",
                name: "manages",
                component: manages,
                meta: {
                    title: "店铺管理"
                }
            }, {
                path: "address",
                name: "address",
                component: address,
                meta: {
                    title: "店铺地址"
                }

            }, {
                path: "connect",
                name: "connect",
                component: connect,
                meta: {
                    title: "联系方式"
                }
            }, {
                path: "storeview",
                name: "storeview",
                component: storeview,
                meta: {
                    title: "店铺详情"
                }
            }, {
                path: "acinfo",
                name: "acinfo",
                component: acinfo,
                meta: {
                    title: "认证信息"
                }
            }, {
                path: "edzp",
                name: "edzp",
                component: edzp,
                meta: {
                    title: "店铺招牌图片"
                }
            }, {
                path: "edhj",
                name: "edhj",
                component: edhj,
                meta: {
                    title: "店铺环境图片"
                }
            }, {
                path: "imgview",
                name: "imgview",
                component: imgview,
                meta: {
                    title: "图片预览"
                }
            }]
        },
        {
            path: "/loginsign",
            name: "loginsign",
            component: basebg,
            children: [{
                path: "logindefault",
                name: "logindefault",
                component: logindefault,
                meta: {
                    title: "登录"
                }
            }, {
                path: "loginfast",
                name: "loginfast",
                component: loginfast,
                meta: {
                    title: "登录"
                }
            }, {
                path: "register",
                name: "register",
                component: register,
                meta: {
                    title: "注册"
                }
            }, {
                path: "setpassword",
                name: "setpassword",
                component: setpassword,
                meta: {
                    title: "设置密码"
                }
            }, {
                path: "forget",
                component: forget,
                meta: {
                    title: "忘记密码"
                }
            }]
        }, {
            path: "/goods",
            name: "goods",
            component: goods,
            children: [{
                path: "success",
                name: "success",
                component: tsuccess,
                meta: {
                    title: "添加商品"
                }
            }, {
                path: "addimgtext",
                name: "addimgtext",
                component: addimgtext,
                meta: {
                    title: "添加图文描述"
                }
            }, {
                path: "allgoods",
                name: "allgoods",
                component: allgoods,
                meta: {
                    title: "商品管理"
                }
            }, {
                path: "addgoods",
                name: "addgoods",
                component: addgoods,
                meta: {
                    title: "添加商品"
                }
            }, {
                path: "goodspreview",
                name: "goodspreview",
                component: goodspreview,
                meta: {
                    title: "商品预览"
                }
            }, {
                path: "plist",
                name: "plist",
                component: plist,
                meta: {
                    title: "品类"
                }
            },{
                path:"editorgoods",
                name:"editorgoods",
                component:editorgoods,
                meta:{
                    title:"编辑商品"
                }
            },{
                path:"pionttime",
                name:"pionttime",
                component:pionttime,
                meta:{
                    title:"预约时间"
                }
            }]
        },
        {
            path:'/order',
            component:order,
            meta:{
                title:"订单管理"
            },
            children:[
                {
                    path:'',
                    name:'orderLists',
                    component:orderList,
                    meta:{
                        title:"订单管理"
                    }
                },
                {
                    path:'orderDetail',
                    name:'orderDetail',
                    component:orderDetail,
                    meta:{
                        title:'订单详情'
                    }
                },{
                    path:'comment',
                    name:'comment',
                    component:comment,
                    meta:{
                        title:'用户评价'
                    }
                }
            ]
        }
    ]
})
