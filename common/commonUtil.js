'use strict';
/**
 * @module commonUtil
 */
module.exports = {
    /**
     * 获取对象的指定属性的值（或属性路径）
     * 
     * @param {object} object - 对象
     * @param {string} path - 属性值，可以是路径，如：'a.b.c[0].d'
     * @param {any} [defaultVal=''] - 获取不到值时返回的默认值，可不传
     * @returns {any} 指定属性的值
     * @example 
     * const obj = {a: {b: {c: [{d: 123}]}}};
     * console.log(getPathValue(obj, 'a.b.c[0].d'));
     */
    getPathValue(object, path, defaultVal = '') {
        let ret = defaultVal;
        if (object === null || typeof object !== 'object' || typeof path !== 'string') {
            return ret;
        }
        path = path.split(/[\.\[\]]/).filter(n => n != '');
        let index = -1;
        const len = path.length;
        let key;
        let result = true;
        while (++index < len) {
            key = path[index];
            if (!Object.prototype.hasOwnProperty.call(object, key)) {
                result = false;
                break;
            }
            object = object[key];
        }
        if (result) {
            ret = object;
        }
        return ret;
    },
    /**
     /**
     * 深拷贝任意类型对象
     * 参考修改自http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript/25921504
     * 支持：值类型、普通对象、数组、日期、正则表达式、DOM
     * @param src 要拷贝的对象
     * @param _visited 内部使用，不用传参！
     * @returns {*} 传入的对象的副本
     */
    deepCopy(src, /* INTERNAL */ _visited) {
        if (src == null || typeof(src) !== 'object') {
            return src;
        }

        // Initialize the visited objects array if needed
        // This is used to detect cyclic references
        if (_visited == undefined) {
            _visited = [];
        }
        // Otherwise, ensure src has not already been visited
        else {
            const len = _visited.length;
            for (let i = 0; i < len; i++) {
                // If src was already visited, don't try to copy it, just return the reference
                if (src === _visited[i]) {
                    return src;
                }
            }
        }

        // Add this object to the visited array
        _visited.push(src);

        //Honor native/custom clone methods
        if (typeof src.clone == 'function') {
            return src.clone(true);
        }

        //Special cases:
        //Array
        if (Object.prototype.toString.call(src) == '[object Array]') {
            //[].slice(0) would soft clone
            ret = src.slice();
            let j = ret.length;
            while (j--) {
                ret[j] = this.deepCopy(ret[j], _visited);
            }
            return ret;
        }
        //Date
        if (src instanceof Date) {
            return new Date(src.getTime());
        }
        //RegExp
        if (src instanceof RegExp) {
            return new RegExp(src);
        }
        //DOM Elements
        if (src.nodeType && typeof src.cloneNode == 'function') {
            return src.cloneNode(true);
        }

        //If we've reached here, we have a regular object, array, or function

        //make sure the returned object has the same prototype as the original
        let proto = (Object.getPrototypeOf ? Object.getPrototypeOf(src) : src.__proto__);
        if (!proto) {
            proto = src.constructor.prototype; //this line would probably only be reached by very old browsers
        }
        var ret = Object.create(proto);

        for (const key in src) {
            if (Object.prototype.hasOwnProperty.call(src, key)) {
                ret[key] = this.deepCopy(src[key], _visited);
            }
        }
        return ret;
    },

    /**
     * 字符串转义特殊字符
     * @param str 待转义的字符串
     * @param replaceToBr 是否要替换\r\n为<br>，默认false
     * @returns {*}
     */
    escapeData(str, replaceToBr) {
        if (str === undefined) {
            return '';
        }
        if (typeof str !== 'string') {
            console.error('escapeData方法的入参必须是字符串类型！');
            return "";
        }
        if (replaceToBr === undefined) {
            replaceToBr = false;
        }
        let result = str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "\\'").replace(/\r/g, '\\r').replace(/\n/g, '\\n');
        if (replaceToBr) {
            result = result.replace(/(\\r)?\\n/g, '<br>');
        }
        return result;
    }
};