var express = require('express');
var router = express.Router();

var serv_index= require("../busiLogic/index/index_service.js");
router.get('/', serv_index.service);

module.exports = router;
