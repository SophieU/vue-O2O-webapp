export default function (msg) {
    let doms = document.getElementById('initmsg');
    if(doms.style.top==='75%'){
        doms.style.top='110%';
        clearTimeout(window.msgtime);
    }
    doms.innerHTML= '<span>'+msg+'</span>';
    doms.style.top='75%';
    window.msgtime = setTimeout(function () {
        doms.style.top = "110%";
    },1800)
}
