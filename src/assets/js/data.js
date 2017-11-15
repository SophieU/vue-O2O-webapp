export default {
    checkTel: function (str) {
        var re = /^0\d{2,3}-?\d{7,8}$/;
        if (re.test(str)) {
            return true;
        } else {
            return false;
        }
    },
    checkMobile:function(str) {
        var re = /^1[0-9]{10}$/;
        if (re.test(str)) {
            return true;
        } else {
            return false;
        }
    }
}
