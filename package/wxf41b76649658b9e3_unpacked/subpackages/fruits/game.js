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
define("subpackages/fruits/game.js", function(require, module, exports) {
    "use strict";
    var t, e;
    System.register("chunks:///_virtual/fruits", [], (function() {
        return {
            execute: function() {}
        }
    })), t = "virtual:///prerequisite-imports/fruits", e = "chunks:///_virtual/fruits", System.register(t, [e], (function(t, e) {
        return {
            setters: [function(e) {
                var r = {};
                for (var u in e) "default" !== u && "__esModule" !== u && (r[u] = e[u]);
                t(r)
            }],
            execute: function() {}
        }
    }));
});
require("subpackages/fruits/game.js");