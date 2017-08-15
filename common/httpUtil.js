'use strict';
const request = require("request");
const query = require("querystring");
const commonUtil = require('./commonUtil');
// const baseConfig = require('../config/base_config');

module.exports = {
    // 从req中提取完整的URL
    _getFullUrl(req) {
        let url = '未获取到url.';
        if (req) {
            url = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
        }
        return url;
    },

    /**
     * get请求
     * @param object 请求对象
     * @param [req] req对象（可选）
     * @returns {*|promise}
     */
    get(object, req) {
        if (typeof req === 'undefined') {
            console.error(`该接口请求 ${object.url} 方法没有传入req对象！正确传参示例：httpUtil.get(reqInfo.xxx, req);`);
        }
        const that = this;
        const option = {
            url: object.url,
            qs: object.params,
            method: "GET",
            timeout: object.timeout || 30000,
            headers: {
                // 'signal': baseConfig.signal,
                // 'User-Agent': commonUtil.getPathValue(req || {}, 'headers.user-agent', 'Mozilla')
            }
        };
        const startTime = Date.now();
        let urlForLog = option.url + query.stringify(option.qs);
        try {
            urlForLog = decodeURIComponent(urlForLog);
        } catch (e) { }
        try {
            urlForLog = unescape(urlForLog);
        } catch (e) { }
        const url = option.url + query.stringify(option.qs);
        return new Promise((resolve, reject) => {
            request(option, (e, res, body) => {
                if (e) {
                    console.error(`接口请求出错！ URL(解码后)：${urlForLog} 所在页面：${that._getFullUrl(req)} 错误信息：${(e.stack || e.message).toString()}`, req);
                    resolve({ error: e.message });
                } else if (res.statusCode == 200) {
                    try {
                        console.info(`接口请求耗时：${(Date.now() - startTime) / 1000}s. URL(解码后)：${urlForLog} 所在页面：${that._getFullUrl(req)}`, req);
                        const result = JSON.parse(body), code = commonUtil.getPathValue(result, 'code');
                        if (code && code != '1') {
                            console.error(`接口返回值异常：code=${code} URL(解码后)：${urlForLog} 所在页面：${that._getFullUrl(req)}`, req);
                            console.error(result, req);
                        }
                        resolve(result);
                    } catch (err) {
                        console.error(`接口返回数据异常：statusCode=${res.statusCode} URL(解码后)：${urlForLog} 所在页面：${that._getFullUrl(req)}`, req);
                        console.error(err, req);
                        resolve({});
                    }
                } else {
                    console.error(`接口请求异常：statusCode=${res.statusCode} URL(解码后)：${urlForLog} 所在页面：${that._getFullUrl(req)}`, req);
                    resolve({
                        error: `接口请求异常：statusCode=${res.statusCode}  ${res.request.href}`,
                        code: res.statusCode,
                        body
                    });
                }
            });
        });
    },

    /**
     * post请求
     * @param object 请求对象
     * @param [req] req对象（可选）
     * @returns {*|promise}
     */
    post(object, req) {
        if (typeof req === 'undefined') {
            console.error(`该接口请求 ${object.url} 方法没有传入req对象！正确传参示例：httpUtil.post(reqInfo.xxx, req);`);
        }
        const that = this;
        const option = {
            url: object.url,
            method: "POST",
            form: object.params,
            timeout: object.timeout || 30000,
            headers: {
                // 'signal': baseConfig.signal,
                // 'User-Agent': commonUtil.getPathValue(req || {}, 'headers.user-agent', 'Mozilla')
            }
        };
        const startTime = Date.now();
        return new Promise((resolve, reject) => {
            request(option, (e, res, body) => {
                if (e) {
                    console.error(`接口请求出错！ URL：${option.url} FORM：${JSON.stringify(option.form)} 所在页面：${that._getFullUrl(req)} 错误信息：${(e.stack || e.message).toString()}`, req);
                    resolve({ error: e.message });
                } else if (res.statusCode == 200) {
                    try {
                        console.info(`接口请求耗时：${(Date.now() - startTime) / 1000}s. URL:${option.url} FORM：${JSON.stringify(option.form)} 所在页面：${that._getFullUrl(req)}`, req);
                        const result = JSON.parse(body), code = commonUtil.getPathValue(result, 'code');
                        if (code && code != '1') {
                            console.error(`接口返回值异常：code=${code} URL：${option.url} FORM：${JSON.stringify(option.form)} 所在页面：${that._getFullUrl(req)}`, req);
                            console.error(result, req);
                        }
                        resolve(result);
                    } catch (err) {
                        console.error(`接口返回数据异常：statusCode=${res.statusCode}  ${option.url} FORM：${JSON.stringify(option.form)} 所在页面：${that._getFullUrl(req)}`, req);
                        console.error(err, req);
                        resolve({});
                    }
                } else {
                    console.error(`接口请求异常：statusCode=${res.statusCode}  ${res.request.href} 所在页面：${that._getFullUrl(req)}`, req);
                    resolve({ error: `接口请求异常：statusCode=${res.statusCode}  ${res.request.href}`, code: res.statusCode, body });
                }
            });
        });
    },
    /**
     * 同时发送多个请求
     * @param allReq 请求对象数组
     * @param [req] req对象（可选）
     * @returns {*}
     */
    combineReq(allReq, req) {
        const arr = [];
        const that = this;
        allReq.forEach(item => {
            //约定：如果item是空对象{}，则会返回null
            if (Object.keys(item).length === 0) {
                arr.push(null);
            } else {
                if (item.method && item.method.toLowerCase() === "post") {
                    arr.push(that.post(item, req));
                } else {
                    arr.push(that.get(item, req));
                }

            }
        });
        return Promise.all(arr);
    }
};
