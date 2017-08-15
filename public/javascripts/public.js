const commonUtil = {
    serialize: function (data) {
        var result = '';
        if (data) {
            Object.keys(data).forEach(function seriKeyEach(key) {
                var value;
                if (Array.isArray(value = data[key])) {
                    value.forEach(function seriValueEach(val) {
                        if ('void 0' != val) {
                            result += key + '=' + encodeURIComponent(val) + '&';
                        } else {
                            result += key + '=&';
                        }
                    });
                } else {
                    if ('void 0' != value) {
                        result += key + '=' + encodeURIComponent(value) + '&';
                    } else {
                        result += key + '=&';
                    }
                }
            });
        }
        return ''.substring.call(result, 0, result.length - 1);
    },
    getUrlParam: function(param) {
        var isBen = location.href.indexOf("http://") < 0 && location.href.indexOf("https://") < 0;
        var query;
        var allUrl= window.location.href;
        if (isBen){
            query=allUrl.substring(allUrl.indexOf('originPath'))
        }else {
            query=allUrl;
        }
        var iLen = param.length;
        var iStart = query.indexOf(param);
        if (iStart == -1)
            return "";
        iStart += iLen + 1;
        var iEnd = query.indexOf("&", iStart);
        if (iEnd == -1)
            return query.substring(iStart);
        return query.substring(iStart, iEnd);
    },
    getCookie: function(name){
        var myCookie = ""+document.cookie+";";
        var searchName = name + "=";
        var startOfCookie =myCookie.indexOf(searchName);
        var endOfCookie,result;
        if(startOfCookie != -1){
            startOfCookie += searchName.length;
            endOfCookie= myCookie.indexOf(";",startOfCookie);
            result = (myCookie.substring(startOfCookie,endOfCookie));
        }
        return result;
    },
    // 格式化将换行转换成/r/n--</br>
    replaceToBr(str,isReplaceToBr){
        var result = str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "\\'").replace(/\r/g, '\\r').replace(/\n/g, '\\n');
        if (isReplaceToBr){
            result = result.replace(/(\\r)?\\n/g, '<br>');
        }
        return result;
    }
}