'use strict';
const httpUtil = require('../../common/httpUtil');
const commonUtil = require('../../common/commonUtil');
exports.service = function (req, res) {
    let model = {};
    let ajaxFlag = req.query.ajaxFlag || false;
    httpUtil.get({
        url:'http://192.168.0.227/bullet/index.php?s=/OutlandTicket/getOutlandTicketList&stationCode=SH&page=1&pageSize=10',
        method:'GET',
        params:{}
    },req).then(result => {
        if(result && result.code && result.code == 1){
            let list = commonUtil.getPathValue(result.datas,'list',[]);
            if(ajaxFlag){
                res.json({
                    list:list
                });
            }else{
                model.list = list
                res.render("index", model);
            }

        }

    },error => {
        console.log(error)
    })

};