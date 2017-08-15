'use strict';
var hbs = require('hbs');
exports.helper = function () {
    var blocks = {};
    hbs.registerHelper('extend', function (name, context) {
        var block = blocks[name];
        if (!block) {
            block = blocks[name] = [];
        }
        block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
    });

    hbs.registerHelper('block', function (name) {
        var val = (blocks[name] || []).join('\n');

        // clear the block
        blocks[name] = [];
        return val;
    });

    hbs.registerHelper('compare', function (left, operator, right, options) {
        if (arguments.length < 3) {
            throw  new Error("Handlerbars Helper 'compare' needs 2 parameters");
        }
        var operators = {
            '==': function (l, r) {
                return l == r;
            },
            '===': function (l, r) {
                return l === r;
            },
            '!=': function (l, r) {
                return l != r;
            },
            '!==': function (l, r) {
                return l !== r;
            },
            '<': function (l, r) {
                return l < r;
            },
            '>': function (l, r) {
                return l > r;
            },
            '<=': function (l, r) {
                return l <= r;
            },
            '>=': function (l, r) {
                return l >= r;
            },
            'typeof': function (l, r) {
                return typeof l == r;
            }
        };
        if (!operators[operator]) {
            throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
        }
        var result = operators[operator](left, right);

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });


    hbs.registerHelper('toFixed', function (str, num) {
        if (!isNaN(str)) {
            return str.toFixed(num);
        }
    });


    hbs.registerHelper('objToString', function (obj) {

        if (obj) {
            return JSON.stringify(obj)
        }
    })


};