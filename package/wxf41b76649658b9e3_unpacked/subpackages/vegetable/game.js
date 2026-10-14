var global = (function() {
    return this
})();
if (!global && typeof GameGlobal !== 'undefined') global = GameGlobal;
var pluginInfoMap = {};;
global.requirePlugin = global.requirePlugin || function(path) {
    var position = path.indexOf('/');
    var alias = '';
    var pagePath = '';
    if (position !== -1) {
        alias = path.substr(0, position);
        pagePath = path.substr(position + 1, path.length);
    } else {
        alias = path;
    }
    if (pluginInfoMap.hasOwnProperty(alias)) {
        var realPath = '';
        if (pagePath.length === 0) {
            realPath = '__plugin__/' + pluginInfoMap[alias].appid;
            return require(realPath);
        } else {
            realPath = '__plugin__/' + pluginInfoMap[alias].appid + '/' + pagePath;
            return require(realPath);
        }
    } else {
        console.error('not found alias: ', alias);
        throw new Error('Plugin ' + alias + ' is not defined.')
    }
};
define("subpackages/vegetable/game.js", function(require, module, exports) {
    "use strict";
    var e, t;
    System.register("chunks:///_virtual/vegetable", [], (function() {
        return {
            execute: function() {}
        }
    })), e = "virtual:///prerequisite-imports/vegetable", t = "chunks:///_virtual/vegetable", System.register(e, [t], (function(e, t) {
        return {
            setters: [function(t) {
                var r = {};
                for (var u in t) "default" !== u && "__esModule" !== u && (r[u] = t[u]);
                e(r)
            }],
            execute: function() {}
        }
    }));
});
require("subpackages/vegetable/game.js");