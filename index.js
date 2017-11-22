var context = require('mobile-adk_context');
var async = require('async');
var _ = require('lodash');


function _bindCallbackWithContext(callback) {

    var ns = context.getNamespace();
    return ns.bind(callback);
}

var _module_ = {
    auto: function(flow, callback) {

        return async.auto(flow, _bindCallbackWithContext(callback));
    },
    series: function(flow, callback) {

        return async.series(flow, _bindCallbackWithContext(callback));
    },
    apply: function(callback) {

        var bindCallback = _bindCallbackWithContext(callback);

        return async.apply.apply(null, [
            bindCallback
        ].concat(_.drop(Array.prototype.slice.call(arguments))));
    }
};


module.exports = _.assignIn({}, async, _module_);