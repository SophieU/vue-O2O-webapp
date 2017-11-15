//新增商品全局数据
export default {
    storeId:"",           //店铺id
    categoryId: "",       //品类id
    categoryName: "",     //品类名称
    productTitle:"",      //商品名称
    productJingle:"",     //副标题
    productPrice:"",      //价格
    needReserve:"N",      //是否需要预约
    needConfirmValid:"Y", //预约需要确认
    reserveWeek:"1,2,3,4,5,6,7",//预约星期
    reserveBeginTime:"08:00",  //一天内起始时间
    reserveEndTime:"17:00",    //一天内结束时间
    productDescribe:"",   //图文详情内容
    canReserve:"N",       //暂停预约
    images:[],            //商品主要图片
    productState:0,       //0 下架 1正常
    //--------------------前端自定义字段
    hasfilldes:false,     //s是否添加图文详情,
    imagesUrl:[],         //图片全路径
    productId:"",         //商品id
    isNew:true,           //新增还是编辑
    reserveChange:false,   //是否修改过预约时间
    reset:function () {
            this.storeId="";           //店铺id
            this.categoryId= "";       //品类id
            this.categoryName= "";     //品类名称
            this.productTitle="";      //商品名称
            this.productJingle="";     //副标题
            this.productPrice="";      //价格
            this.needReserve="N";      //是否需要预约
            this.needConfirmValid="Y"; //预约需要确认
            this.reserveWeek="1,2,3,4,5,6,7";//预约星期
            this.reserveBeginTime="08:00";  //一天内起始时间
            this.reserveEndTime="17:00";    //一天内结束时间
            this.productDescribe="";   //图文详情内容
            this.canReserve="N";       //暂停预约
            this.images=[];            //商品主要图片
            this.productState=0;       //0 下架 1正常
            this.hasfilldes=false;     //s是否添加图文详情;
            this.imagesUrl=[];         //图片全路径
            this.productId="";         //商品id
            this.isNew=true;           //新增还是编辑
            this.reserveChange=false;   //是否修改过预约时间hasfilldes=false;     //s是否添加图文详情;
            this.imagesUrl=[];         //图片全路径
            this.productId="";         //商品id
            this.isNew=true;           //新增还是编辑
            this.reserveChange=false;  //是否修改过预约时间
    }
}
