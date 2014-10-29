/**
 * @name: scope
 * @doc: I'm trying to make my own Angular like scope.
 **/

;(function() {
    'use strict';

    /**
     * @name: Scope's constructor
     */
    var Scope = function() {
        this.$$watchers = [];
    };

    Scope.prototype.$watch = function(watchFn, listenerFn, valueEq) {
        var watcher = {
            watchFn: watchFn,
            listenerFn: listenerFn || function() {},
            valueEq: !!valueEq
        };

        this.$$watchers.push(watcher);
    };

    Scope.prototype.$digestOnce = function() {
        var self = this;
        var dirty;
        _.forEach(this.$$watchers, function(watch) {
            var newValue = watch.watchFn(self);
            var oldValue = watch.last;
            if(newValue !== oldValue) {
                watch.listenerFn(newValue, oldValue, self);
                dirty = true;
                watch.last = newValue;
            }
        });
        return dirty;
    };

    Scope.prototype.$digest = function() {
        var dirty;
        var ttl = 10;
        do {
            dirty = this.$digestOnce();
            if(dirty && !(ttl--)) {
                throw "10 digest iterations reached";
            }
        } while (dirty);
    };

    /** 
     * export to window object for browser 
     * or module.export for nodejs (need for test)
     **/
    if (typeof exports !== 'undefined') { 
        module.exports = Scope;
    } else {
        window.Scope = Scope;
    }

})();