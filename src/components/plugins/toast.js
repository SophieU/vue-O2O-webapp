import Vue from 'vue'
import toastComopnent from './toast.vue'
const ToastConstructor = Vue.extend(toastComopnent)

let removeDom = event=>{
    event.target.parentNode.removeChild(event.target)
}

ToastConstructor.prototype.close=function(){
    this.visible=false;
    this.$el.addEventListener('transitionend',removeDom)
}

const Toast = (options={})=>{
    var instance = new ToastConstructor().$mount(document.createElement('div'))
    let duration = options.duration||2500;
    instance.message=typeof options==='string'?options:options.message
    instance.position=options.position||'middle'
    instance.visible=true;
    document.body.appendChild(instance.$el);
    Vue.nextTick(()=>{ // Vue.nextTick 获取DOM更新后的循环
        instance.timer=setTimeout(function(){
            instance.close();
        },duration)
    })
    return instance
}

export default Toast
