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




