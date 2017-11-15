<template>
    <div class="addimgtext">
        <!--<div class="edtitle"><span class="defaultfont">商品详情编辑</span></div>-->
        <div class="editor" id="editor" contentEditable="true" @blur="blureditor()" @focus="oneditor()"></div>
        <div class="addimgbtn">
            <input type="file" id="addimg" @change="addimg('addimg')" multiple="multiple" accept="image/gif, image/jpeg,image/jpg,image/png">
        </div>
        <div class="savebtn" @click="savedes()">完成</div>
    </div>
</template>
<script>
    import geditor from "../../assets/js/geditor";
    import m from "../../assets/js/msg";
    export default {
        name: "addimgtext",
        data() {
            return {
                shiwaddimg:false
            }
        },
        mounted(){
            document.getElementById("editor").focus();
            document.getElementById("editor").innerHTML = geditor.productDescribe;
            this.id=this.$route.query.id
        },
        methods: {
            oneditor() {
                this.shiwaddimg=true;
            },
            blureditor() {
                let _this = this;
                setTimeout(function () {
                    _this.shiwaddimg=false;
                },500);
            },
            addimg(id) {

                let _this = this;
                this.uploadimg(id, function (res) {
                    let html = "";
                    if(Object.prototype.toString.call(res)==='[object Array]'){
                        res.forEach(function (item) {
                            html += '<div><img src="' + item.imageUrl + '"></div>';
                        })
                    }else{
                         html = '<div><img src="' + res.imageUrl + '"></div>';
                    }
                    html += '<span style="font-size: 12px;margin-left: -3px;">&nbsp;</span>'
                    _this.pasteHtmlAtCaret(html);
                });
            },
            pasteHtmlAtCaret(html) {
                var sel, range;
                if (window.getSelection) {
                    sel = window.getSelection();
                    if (sel.getRangeAt && sel.rangeCount) {
                        range = sel.getRangeAt(0);
                        range.deleteContents();
                        var el = document.createElement("p");
                        el.innerHTML = html;
                        var frag = document.createDocumentFragment(), node, lastNode;
                        while ( (node = el.firstChild) ) {
                            lastNode = frag.appendChild(node);
                        };
                        range.insertNode(frag);
                        if (lastNode) {
                            range = range.cloneRange();
                            range.setStartAfter(lastNode);
                            range.collapse(true);
                            sel.removeAllRanges();
                            sel.addRange(range);
                        };
                    };
                } else if (document.selection && document.selection.type != "Control") {
                    document.selection.createRange().pasteHTML(html);
                }
            },
            savedes(){
                let dom = document.getElementById("editor");
                let str = dom.innerHTML;
                geditor.productDescribe = str;
                if(str){
                    m('图文描述本地保存成功');
                }else{
                    m('图文描述未填写');
                }
                if(this.$route.query.id===undefined){
                    //跳添加商品
                    this.$router.push({name:"addgoods"});
                }else{
//                    跳编辑商品
                    this.$router.push({name:"editorgoods",query:{'id':this.$route.query.id,'productState':this.$route.query.productState}});
                }
//                this.$router.go(-1)
//                this.$router.push({name:"addgoods"});
            }
        }
    }
</script>
<style lang="less">
    .addimgtext {
        @size: 37.5;
        background-color: #ffffff;
        .edtitle{
            height: 30rem/@size;
            color: #999999;
            margin: 0 20rem/@size;
            border-bottom: 1px solid #d5d5d5;
            line-height: 0rem/@size;
            .defaultfont {
                display: inline-block;
                line-height: 14rem/@size;
                font-size: 14rem/@size;
                color: #888888;
                border-left:2px solid #1a1a1a;
                padding-left: 8px;
                margin-top: 8rem/@size;
            }
        }
        .editor {
            margin:0 20rem/@size 0rem/@size 20rem/@size;
            padding-top: 10rem/@size;
            font-size: 14rem/@size;
            line-height: 18rem/@size;
            padding-bottom: 100rem/@size;
            -webkit-overflow-scrolling: touch;
            min-height: 600rem/@size;

            img {
                max-width: 100%;
                display: block;
                height: auto;
                margin: 5px 0;
            }
        }
        .addimgbtn {
            height: 60rem/@size;
            width: 60rem/@size;
            position: fixed;
            top: 38rem/@size;
            right: 2rem/@size;
            background-image: url("../../assets/images/addimg.png");
            background-size: 30rem/@size;
            background-position: center;
            background-repeat: no-repeat;
            opacity: 0.7;
            input {
                height: 100%;
                width: 100%;
                opacity: 0;
            }
        }
        .savebtn {
            position: fixed;
            bottom: 20rem/@size;
            left: 20rem/@size;
            right: 20rem/@size;
            height: 40rem/@size;
            background-color: #1a1a1a;
            color: #fff;
            text-align: center;
            line-height: 40rem/@size;
            font-size: 14rem/@size;
        }
    }
</style>
