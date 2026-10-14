define("openDataContext/@babel/runtime/helpers/Objectvalues.js", function(require, module, exports) {
    Object.values || (Object.values = function(e) {
        if (e !== Object(e)) throw new TypeError("Object.values called on a non-object");
        var t, r = [];
        for (t in e) Object.prototype.hasOwnProperty.call(e, t) && r.push(e[t]);
        return r
    });
});
define("openDataContext/@babel/runtime/helpers/arrayLikeToArray.js", function(require, module, exports) {
    function _arrayLikeToArray(r, a) {
        (null == a || a > r.length) && (a = r.length);
        for (var e = 0, n = new Array(a); e < a; e++) n[e] = r[e];
        return n
    }
    module.exports = _arrayLikeToArray;
});
define("openDataContext/@babel/runtime/helpers/createForOfIteratorHelper.js", function(require, module, exports) {
    var unsupportedIterableToArray = require("./unsupportedIterableToArray");

    function _createForOfIteratorHelper(r, e) {
        var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (!t) {
            if (Array.isArray(r) || (t = unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
                t && (r = t);
                var n = 0,
                    o = function() {};
                return {
                    s: o,
                    n: function() {
                        return n >= r.length ? {
                            done: !0
                        } : {
                            done: !1,
                            value: r[n++]
                        }
                    },
                    e: function(r) {
                        throw r
                    },
                    f: o
                }
            }
            throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }
        var a, u = !0,
            i = !1;
        return {
            s: function() {
                t = t.call(r)
            },
            n: function() {
                var r = t.next();
                return u = r.done, r
            },
            e: function(r) {
                i = !0, a = r
            },
            f: function() {
                try {
                    u || null == t.return || t.return()
                } finally {
                    if (i) throw a
                }
            }
        }
    }
    module.exports = _createForOfIteratorHelper;
});
define("openDataContext/@babel/runtime/helpers/typeof.js", function(require, module, exports) {
    function _typeof(o) {
        return module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
            return typeof o
        } : function(o) {
            return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o
        }, _typeof(o)
    }
    module.exports = _typeof;
});
define("openDataContext/@babel/runtime/helpers/unsupportedIterableToArray.js", function(require, module, exports) {
    var arrayLikeToArray = require("./arrayLikeToArray");

    function _unsupportedIterableToArray(r, e) {
        if (r) {
            if ("string" == typeof r) return arrayLikeToArray(r, e);
            var t = Object.prototype.toString.call(r).slice(8, -1);
            return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? arrayLikeToArray(r, e) : void 0
        }
    }
    module.exports = _unsupportedIterableToArray;
});
define("openDataContext/engine.js", function(require, module, exports) {
    "use strict";
    require("../openDataContext/@babel/runtime/helpers/Objectvalues");
    var t = require("../openDataContext/@babel/runtime/helpers/typeof");
    module.exports = function(e) {
        var n = {};

        function r(t) {
            if (n[t]) return n[t].exports;
            var o = n[t] = {
                i: t,
                l: !1,
                exports: {}
            };
            return e[t].call(o.exports, o, o.exports, r), o.l = !0, o.exports
        }
        return r.m = e, r.c = n, r.d = function(t, e, n) {
            r.o(t, e) || Object.defineProperty(t, e, {
                enumerable: !0,
                get: n
            })
        }, r.r = function(t) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(t, "__esModule", {
                value: !0
            })
        }, r.t = function(e, n) {
            if (1 & n && (e = r(e)), 8 & n) return e;
            if (4 & n && "object" === t(e) && e && e.__esModule) return e;
            var o = Object.create(null);
            if (r.r(o), Object.defineProperty(o, "default", {
                    enumerable: !0,
                    value: e
                }), 2 & n && "string" != typeof e)
                for (var i in e) r.d(o, i, function(t) {
                    return e[t]
                }.bind(null, i));
            return o
        }, r.n = function(t) {
            var e = t && t.__esModule ? function() {
                return t.default
            } : function() {
                return t
            };
            return r.d(e, "a", e), e
        }, r.o = function(t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }, r.p = "", r(r.s = 0)
    }([function(t, e, n) {
        n.r(e), n.d(e, "EE", (function() {
            return k
        }));
        n(1);
        var r = n(2),
            o = n(5),
            i = n(4),
            a = n.n(i),
            l = n(6),
            u = n.n(l),
            s = n(7),
            c = n(8),
            h = n.n(c),
            f = n(14),
            d = n(16);

        function y(t) {
            return (y = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t
            } : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            })(t)
        }

        function v(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }

        function p(t, e) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
            }
        }

        function g(t, e) {
            return (g = Object.setPrototypeOf || function(t, e) {
                return t.__proto__ = e, t
            })(t, e)
        }

        function m(t) {
            var e = function() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}))), !0
                } catch (t) {
                    return !1
                }
            }();
            return function() {
                var n, r = x(t);
                if (e) {
                    var o = x(this).constructor;
                    n = Reflect.construct(r, arguments, o)
                } else n = r.apply(this, arguments);
                return b(this, n)
            }
        }

        function b(t, e) {
            return !e || "object" !== y(e) && "function" != typeof e ? w(t) : e
        }

        function w(t) {
            if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }

        function x(t) {
            return (x = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
                return t.__proto__ || Object.getPrototypeOf(t)
            })(t)
        }
        var k = new a.a,
            S = new o.default("imgPool"),
            T = new o.default("canvasPool"),
            _ = {
                view: d.View,
                text: d.Text,
                image: d.Image,
                scrollview: d.ScrollView,
                bitmaptext: d.BitMapText
            };

        function O(t) {
            return "string" == typeof t && /\d+(?:\.\d+)?%/.test(t)
        }

        function E(t, e) {
            if ("number" == typeof t) return t;
            var n = t.match(/(\d+(?:\.\d+)?)%/)[1];
            return n ? e * n * .01 : void 0
        }
        var C = function t(e, n, r) {
                var o = this,
                    i = _[e.name],
                    a = e.children || [],
                    l = e.attr || {},
                    u = l.id || "",
                    s = Object.keys(l).reduce((function(t, e) {
                        var r = l[e],
                            o = e;
                        return "id" === e ? (t.style = Object.assign(t.style || {}, n[u] || {}), t) : "class" === e ? (t.style = r.split(/\s+/).reduce((function(t, e) {
                            return Object.assign(t, n[e])
                        }), t.style || {}), t) : (t[o] = "true" === r || "false" !== r && r, t)
                    }), {});
                s.idName = u, s.className = l.class || "";
                var c, h = s.style;
                h && (c = r ? r.style : "undefined" != typeof sharedCanvas ? sharedCanvas : __env.getSharedCanvas(), O(h.width) && (h.width = c.width ? E(h.width, c.width) : 0), O(h.height) && (h.height = c.height ? E(h.height, c.height) : 0));
                var f = new i(s);
                return f.root = this, a.forEach((function(e) {
                    var r = t.call(o, e, n, s);
                    f.add(r)
                })), f
            },
            B = function t(e) {
                return Object.keys(e.children).map((function(t) {
                    return e.children[t]
                })).map((function(e) {
                    return {
                        id: e.id,
                        name: e.name,
                        style: e.style,
                        children: t(e)
                    }
                }))
            };

        function R(t, e) {
            var n = this;
            t.forEach((function(t) {
                var r = e.find((function(e) {
                    return e.id === t.id
                }));
                r.layoutBox = r.layoutBox || {}, ["left", "top", "width", "height"].forEach((function(e) {
                    r.layoutBox[e] = t.layout[e]
                })), r.parent ? (r.layoutBox.absoluteX = (r.parent.layoutBox.absoluteX || 0) + r.layoutBox.left, r.layoutBox.absoluteY = (r.parent.layoutBox.absoluteY || 0) + r.layoutBox.top) : (r.layoutBox.absoluteX = r.layoutBox.left, r.layoutBox.absoluteY = r.layoutBox.top), r.layoutBox.originalAbsoluteY = r.layoutBox.absoluteY, "ScrollView" === r.type && r.updateRenderPort(n.renderport), R.call(n, t.children, r.children)
            }))
        }
        var N = new(function(t) {
            ! function(t, e) {
                if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        writable: !0,
                        configurable: !0
                    }
                }), e && g(t, e)
            }(i, t);
            var e, n, r, o = m(i);

            function i() {
                var t, e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                    n = e.style,
                    r = e.name;
                return v(this, i), (t = o.call(this, {
                    style: n,
                    id: 0,
                    name: r
                })).hasEventHandler = !1, t.elementTree = null, t.renderContext = null, t.debugInfo = {}, t.renderport = {}, t.viewport = {}, t.touchStart = t.eventHandler("touchstart").bind(w(t)), t.touchMove = t.eventHandler("touchmove").bind(w(t)), t.touchEnd = t.eventHandler("touchend").bind(w(t)), t.touchCancel = t.eventHandler("touchcancel").bind(w(t)), t.version = "0.0.1", t.touchMsg = {}, t.hasViewPortSet = !1, t.realLayoutBox = {
                    realX: 0,
                    realY: 0
                }, t.state = s.STATE.UNINIT, t.bitMapFonts = [], t
            }
            return e = i, (n = [{
                key: "updateViewPort",
                value: function(t) {
                    this.viewport.width = t.width || 0, this.viewport.height = t.height || 0, this.viewport.x = t.x || 0, this.viewport.y = t.y || 0, this.realLayoutBox = {
                        realX: this.viewport.x,
                        realY: this.viewport.y
                    }, this.hasViewPortSet = !0
                }
            }, {
                key: "init",
                value: function(t, e, n) {
                    var r = new Date,
                        o = {
                            attributeNamePrefix: "",
                            attrNodeName: "attr",
                            textNodeName: "#text",
                            ignoreAttributes: !1,
                            ignoreNameSpace: !0,
                            allowBooleanAttributes: !0,
                            parseNodeValue: !1,
                            parseAttributeValue: !1,
                            trimValues: !0,
                            parseTrueNumberOnly: !1
                        };
                    n && "function" == typeof n && (o.attrValueProcessor = n);
                    var i = h.a.parse(t, o, !0).children[0];
                    this.debugInfo.xmlTree = new Date - r, this.layoutTree = C.call(this, i, e), this.debugInfo.layoutTree = new Date - r, this.add(this.layoutTree);
                    var a = {
                        id: this.id,
                        style: {
                            width: this.style.width,
                            height: this.style.height,
                            flexDirection: "row"
                        },
                        children: B(this)
                    };
                    u()(a), this.elementTree = a, this.debugInfo.renderTree = new Date - r;
                    var l = this.children[0];
                    void 0 === l.style.width || void 0 === l.style.height ? console.error("Please set width and height property for root element") : (this.renderport.width = l.style.width, this.renderport.height = l.style.height), this.state = s.STATE.INITED
                }
            }, {
                key: "layout",
                value: function(t) {
                    var e = new Date;
                    this.renderContext = t, this.renderContext && this.renderContext.clearRect(0, 0, this.renderport.width, this.renderport.height), this.hasViewPortSet || console.error("Please invoke method `updateViewPort` before method `layout`"), R.call(this, this.elementTree.children, this.children), this.debugInfo.layoutChildren = new Date - e,
                        function t(e, n, r) {
                            e.forEach((function(e) {
                                var o = n.find((function(t) {
                                    return t.id === e.id
                                }));
                                o.realLayoutBox = o.realLayoutBox || {}, ["left", "top", "width", "height"].forEach((function(t) {
                                    o.realLayoutBox[t] = e.layout[t] * r
                                })), o.parent ? (o.realLayoutBox.realX = (o.parent.realLayoutBox.realX || 0) + o.realLayoutBox.left, Object.defineProperty(o.realLayoutBox, "realY", {
                                    configurable: !0,
                                    enumerable: !0,
                                    get: function() {
                                        var t = (o.parent.realLayoutBox.realY || 0) + o.realLayoutBox.top;
                                        return o.parent && "ScrollView" === o.parent.type && (t -= o.parent.top * r), t
                                    }
                                })) : (o.realLayoutBox.realX = o.realLayoutBox.left, o.realLayoutBox.realY = o.realLayoutBox.top), t(e.children, o.children, r)
                            }))
                        }(this.elementTree.children, this.children, this.viewport.width / this.renderport.width), this.debugInfo.updateRealLayout = new Date - e,
                        function t(e, n) {
                            e.forEach((function(e) {
                                if ("ScrollView" !== e.type) return e.insert(n), t(e.children, n);
                                e.insertScrollView(n)
                            }))
                        }(this.children, t), this.debugInfo.renderChildren = new Date - e, this.bindEvents(), this.state = s.STATE.RENDERED
                }
            }, {
                key: "initRepaint",
                value: function() {
                    var t = this;
                    this.on("repaint", (function() {
                        t.repaint()
                    })), this.EE.on("one__image__render__done", (function(e) {
                        t.repaint()
                    }))
                }
            }, {
                key: "repaint",
                value: function() {
                    new Date, Object(s.repaintChildren)(this.children), this.emit("repaint__done")
                }
            }, {
                key: "getChildByPos",
                value: function(t, e, n) {
                    for (var r = Object.keys(t.children), o = 0; o < r.length; o++) {
                        var i = t.children[r[o]],
                            a = i.realLayoutBox;
                        if (a.realX <= e && e <= a.realX + a.width && a.realY <= n && n <= a.realY + a.height) return Object.keys(i.children).length ? this.getChildByPos(i, e, n) : i
                    }
                    return t
                }
            }, {
                key: "eventHandler",
                value: function(t) {
                    return function(e) {
                        if (this.elementTree) {
                            var n = e.touches && e.touches[0] || e.changedTouches && e.changedTouches[0] || e;
                            if (n && n.pageX && n.pageY) {
                                n.timeStamp || (n.timeStamp = e.timeStamp);
                                var r = n && this.getChildByPos(this, n.pageX, n.pageY);
                                r && r.emit(t, e), "touchstart" !== t && "touchend" !== t || (this.touchMsg[t] = n), "touchend" === t && Object(s.isClick)(this.touchMsg) && r && r.emit("click", e)
                            }
                        }
                    }
                }
            }, {
                key: "bindEvents",
                value: function() {
                    this.hasEventHandler || (this.hasEventHandler = !0, "undefined" != typeof __env ? (__env.onTouchStart(this.touchStart), __env.onTouchMove(this.touchMove), __env.onTouchEnd(this.touchEnd), __env.onTouchCancel(this.touchCancel)) : (document.onmousedown = this.touchStart, document.onmousemove = this.touchMove, document.onmouseup = this.touchEnd, document.onmouseleave = this.touchEnd))
                }
            }, {
                key: "emit",
                value: function(t, e) {
                    k.emit(t, e)
                }
            }, {
                key: "on",
                value: function(t, e) {
                    k.on(t, e)
                }
            }, {
                key: "once",
                value: function(t, e) {
                    k.once(t, e)
                }
            }, {
                key: "off",
                value: function(t, e) {
                    k.off(t, e)
                }
            }, {
                key: "getElementsById",
                value: function(t) {
                    return function t(e) {
                        var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
                            r = arguments.length > 2 ? arguments[2] : void 0;
                        return Object.keys(e.children).forEach((function(o) {
                            var i = e.children[o];
                            i.idName === r && n.push(i), Object.keys(i.children).length && t(i, n, r)
                        })), n
                    }(this, [], t)
                }
            }, {
                key: "getElementsByClassName",
                value: function(t) {
                    return function t(e) {
                        var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
                            r = arguments.length > 2 ? arguments[2] : void 0;
                        return Object.keys(e.children).forEach((function(o) {
                            var i = e.children[o];
                            i.className.split(/\s+/).indexOf(r) > -1 && n.push(i), Object.keys(i.children).length && t(i, n, r)
                        })), n
                    }(this, [], t)
                }
            }, {
                key: "destroyAll",
                value: function(t) {
                    var e = this;
                    t || (t = this), t.children.forEach((function(t) {
                        t.destroy(), e.destroyAll(t), t.destroySelf && t.destroySelf()
                    }))
                }
            }, {
                key: "clear",
                value: function() {
                    this.destroyAll(), this.elementTree = null, this.children = [], this.layoutTree = {}, this.state = s.STATE.CLEAR, T.getList().forEach((function(t) {
                        t.context && t.context.clearRect(0, 0, t.canvas.width, t.canvas.height), t.elements = [], t.canvas = null, t.context = null
                    })), this.renderContext && this.renderContext.clearRect(0, 0, this.renderContext.canvas.width, this.renderContext.canvas.height), this.EE.off("image__render__done")
                }
            }, {
                key: "clearPool",
                value: function() {
                    S.clear(), T.clear()
                }
            }, {
                key: "clearAll",
                value: function() {
                    this.clear(), this.clearPool()
                }
            }, {
                key: "loadImgs",
                value: function(t) {
                    t.forEach((function(t) {
                        var e = Object(s.createImage)();
                        S.set(t, e), e.onload = function() {
                            e.loadDone = !0
                        }, e.onloadcbks = [], e.src = t
                    }))
                }
            }, {
                key: "registBitMapFont",
                value: function(t, e, n) {
                    var r = new f.default(t, e, n);
                    this.bitMapFonts.push(r)
                }
            }]) && p(e.prototype, n), r && p(e, r), i
        }(r.default))({
            style: {
                width: 0,
                height: 0
            },
            name: "layout"
        });
        e.default = N
    }, function(t, e) {
        GameGlobal.__env = GameGlobal.wx || GameGlobal.tt || GameGlobal.swan
    }, function(t, e, n) {
        n.r(e), n.d(e, "default", (function() {
            return s
        }));
        var r = n(3);

        function o(t, e) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
            }
        }
        var i = new(n(4)),
            a = 0;

        function l(t, e) {
            var n = function(t) {
                var e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
                return e ? {
                    r: parseInt(e[1], 16),
                    g: parseInt(e[2], 16),
                    b: parseInt(e[3], 16)
                } : null
            }(t);
            return null == e && (e = 1), "rgba(".concat(n.r, ", ").concat(n.g, ", ").concat(n.b, ", ").concat(e, ")")
        }
        var u = function(t, e) {
                return ["click", "touchstart", "touchmove", "touchend", "touchcancel"].indexOf(t), "element-".concat(e, "-").concat(t)
            },
            s = function() {
                function t(e) {
                    var n = this,
                        o = e.style,
                        u = void 0 === o ? {} : o,
                        s = e.props,
                        c = void 0 === s ? {} : s,
                        h = e.idName,
                        f = void 0 === h ? "" : h,
                        d = e.className,
                        y = void 0 === d ? "" : d,
                        v = e.id,
                        p = void 0 === v ? ++a : v;
                    for (var g in function(t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t), this.children = [], this.childMap = {}, this.parent = null, this.parentId = 0, this.id = p, this.props = c, this.idName = f, this.className = y, this.style = u, this.EE = i, this.root = null, this.isDestroyed = !1, this.layoutBox = {}, void 0 !== u.opacity && u.color && u.color.indexOf("#") > -1 && (u.color = l(u.color, u.opacity)), void 0 !== u.opacity && u.backgroundColor && u.backgroundColor.indexOf("#") > -1 && (u.backgroundColor = l(u.backgroundColor, u.opacity)), this.style) r.scalableStyles.indexOf(g) > -1 && (this.style[g] *= 1);
                    ["touchstart", "touchmove", "touchcancel", "touchend", "click"].forEach((function(t) {
                        n.on(t, (function(e, r) {
                            n.parent && n.parent.emit(t, e, r)
                        }))
                    })), this.initRepaint()
                }
                var e, n, s;
                return e = t, (n = [{
                    key: "initRepaint",
                    value: function() {
                        var t = this;
                        this.on("repaint", (function(e) {
                            t.parent && t.parent.emit("repaint", e)
                        }))
                    }
                }, {
                    key: "repaint",
                    value: function() {}
                }, {
                    key: "insert",
                    value: function() {}
                }, {
                    key: "checkNeedRender",
                    value: function() {
                        return !0
                    }
                }, {
                    key: "destroy",
                    value: function() {
                        var t = this;
                        ["touchstart", "touchmove", "touchcancel", "touchend", "click", "repaint"].forEach((function(e) {
                            t.off(e)
                        })), this.EE.off("image__render__done"), this.isDestroyed = !0, this.EE = null, this.parent = null, this.ctx = null, this.realLayoutBox = null, this.layoutBox = null, this.props = null, this.style = null, this.renderBoxes && (this.renderBoxes = null)
                    }
                }, {
                    key: "add",
                    value: function(t) {
                        t.parent = this, t.parentId = this.id, this.children.push(t)
                    }
                }, {
                    key: "emit",
                    value: function(t) {
                        for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) n[r - 1] = arguments[r];
                        i.emit.apply(i, [u(t, this.id)].concat(n))
                    }
                }, {
                    key: "on",
                    value: function(t, e) {
                        i.on(u(t, this.id), e)
                    }
                }, {
                    key: "once",
                    value: function(t, e) {
                        i.once(u(t, this.id), e)
                    }
                }, {
                    key: "off",
                    value: function(t, e) {
                        i.off(u(t, this.id), e)
                    }
                }, {
                    key: "roundRect",
                    value: function(t, e) {
                        var n = this.style || {},
                            r = e || this.layoutBox,
                            o = r.width,
                            i = r.height,
                            a = n.borderRadius,
                            l = r.absoluteX,
                            u = r.absoluteY;
                        t.moveTo(l + a, u), t.arcTo(l + o, u, l + o, u + i, a), t.arcTo(l + o, u + i, l, u + i, a), t.arcTo(l, u + i, l, u, a), t.arcTo(l, u, l + o, u, a), t.clip()
                    }
                }, {
                    key: "renderBorder",
                    value: function(t, e) {
                        var n = this.style || {};
                        n.borderRadius && this.roundRect(t, e), t.save();
                        var r = e || this.layoutBox,
                            o = n.borderWidth || 0,
                            i = n.borderLeftWidth || 0,
                            a = n.borderRightWidth || 0,
                            l = n.borderTopWidth || 0,
                            u = n.borderBottomWidth || 0,
                            s = n.borderRadius || 0,
                            c = n.borderColor,
                            h = r.absoluteX,
                            f = r.absoluteY;
                        t.beginPath(), o && c && (t.lineWidth = o, t.strokeStyle = c, t.strokeRect(h, f, r.width, r.height)), l && (c || n.borderTopColor) && (t.lineWidth = l, t.strokeStyle = n.borderTopColor || c, t.moveTo(s ? h + s : h, f + l / 2), t.lineTo(s ? h + r.width - s : h + r.width, f + l / 2)), u && (c || n.borderBottomColor) && (t.lineWidth = u, t.strokeStyle = n.borderBottomColor || c, t.moveTo(s ? h + s : h, f + r.height - u / 2), t.lineTo(s ? h + r.width - s : h + r.width, f + r.height - u / 2)), i && (c || n.borderLeftColor) && (t.lineWidth = i, t.strokeStyle = n.borderLeftColor || c, t.moveTo(h + i / 2, s ? f + s : f), t.lineTo(h + i / 2, s ? f + r.height - s : f + r.height)), a && (c || n.borderRightColor) && (t.lineWidth = a, t.strokeStyle = n.borderRightColor || c, t.moveTo(h + r.width - a / 2, s ? f + s : f), t.lineTo(h + r.width - a / 2, s ? f + r.height - s : f + r.height)), t.closePath(), t.stroke(), t.restore()
                    }
                }]) && o(e.prototype, n), s && o(e, s), t
            }()
    }, function(t, e, n) {
        n.r(e), n.d(e, "scalableStyles", (function() {
            return o
        })), n.d(e, "textStyles", (function() {
            return r
        })), n.d(e, "layoutAffectedStyles", (function() {
            return i
        }));
        var r = ["color", "fontSize", "textAlign", "fontWeight", "lineHeight", "lineBreak"],
            o = ["left", "top", "right", "bottom", "width", "height", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "fontSize", "lineHeight", "borderRadius", "minWidth", "maxWidth", "minHeight", "maxHeight"],
            i = ["margin", "marginTop", "marginBottom", "marginLeft", "marginRight", "padding", "paddingTop", "paddingBottom", "paddingLeft", "paddingRight", "width", "height"]
    }, function(t, e) {
        function n() {}
        n.prototype = {
            on: function(t, e, n) {
                var r = this.e || (this.e = {});
                return (r[t] || (r[t] = [])).push({
                    fn: e,
                    ctx: n
                }), this
            },
            once: function(t, e, n) {
                var r = this;

                function o() {
                    r.off(t, o), e.apply(n, arguments)
                }
                return o._ = e, this.on(t, o, n)
            },
            emit: function(t) {
                for (var e = [].slice.call(arguments, 1), n = ((this.e || (this.e = {}))[t] || []).slice(), r = 0, o = n.length; r < o; r++) n[r].fn.apply(n[r].ctx, e);
                return this
            },
            off: function(t, e) {
                var n = this.e || (this.e = {}),
                    r = n[t],
                    o = [];
                if (r && e)
                    for (var i = 0, a = r.length; i < a; i++) r[i].fn !== e && r[i].fn._ !== e && o.push(r[i]);
                return o.length ? n[t] = o : delete n[t], this
            }
        }, t.exports = n, t.exports.TinyEmitter = n
    }, function(t, e, n) {
        function r(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }

        function o(t, e) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
            }
        }
        n.r(e), n.d(e, "default", (function() {
            return a
        }));
        var i = [],
            a = function() {
                function t() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "pool";
                    r(this, t);
                    var n = i.find((function(t) {
                        return t.name === e
                    }));
                    if (n) return n;
                    this.name = e, this.pool = {}, i.push(this)
                }
                var e, n, a;
                return e = t, (n = [{
                    key: "get",
                    value: function(t) {
                        return this.pool[t]
                    }
                }, {
                    key: "set",
                    value: function(t, e) {
                        this.pool[t] = e
                    }
                }, {
                    key: "clear",
                    value: function() {
                        this.pool = {}
                    }
                }, {
                    key: "getList",
                    value: function() {
                        return Object.values(this.pool)
                    }
                }]) && o(e.prototype, n), a && o(e, a), t
            }()
    }, function(t, e, n) {
        var r, o, i;
        o = [], void 0 === (i = "function" == typeof(r = function() {
            var e = function() {
                var t = {
                        row: "left",
                        "row-reverse": "right",
                        column: "top",
                        "column-reverse": "bottom"
                    },
                    e = {
                        row: "right",
                        "row-reverse": "left",
                        column: "bottom",
                        "column-reverse": "top"
                    },
                    n = {
                        row: "left",
                        "row-reverse": "right",
                        column: "top",
                        "column-reverse": "bottom"
                    },
                    r = {
                        row: "width",
                        "row-reverse": "width",
                        column: "height",
                        "column-reverse": "height"
                    };

                function o(t) {
                    return void 0 === t
                }

                function i(t) {
                    return "row" === t || "row-reverse" === t
                }

                function a(t, e) {
                    if (void 0 !== t.style.marginStart && i(e)) return t.style.marginStart;
                    var n = null;
                    switch (e) {
                        case "row":
                            n = t.style.marginLeft;
                            break;
                        case "row-reverse":
                            n = t.style.marginRight;
                            break;
                        case "column":
                            n = t.style.marginTop;
                            break;
                        case "column-reverse":
                            n = t.style.marginBottom
                    }
                    return void 0 !== n ? n : void 0 !== t.style.margin ? t.style.margin : 0
                }

                function l(t, e) {
                    if (void 0 !== t.style.marginEnd && i(e)) return t.style.marginEnd;
                    var n = null;
                    switch (e) {
                        case "row":
                            n = t.style.marginRight;
                            break;
                        case "row-reverse":
                            n = t.style.marginLeft;
                            break;
                        case "column":
                            n = t.style.marginBottom;
                            break;
                        case "column-reverse":
                            n = t.style.marginTop
                    }
                    return null != n ? n : void 0 !== t.style.margin ? t.style.margin : 0
                }

                function u(t, e) {
                    if (void 0 !== t.style.borderStartWidth && t.style.borderStartWidth >= 0 && i(e)) return t.style.borderStartWidth;
                    var n = null;
                    switch (e) {
                        case "row":
                            n = t.style.borderLeftWidth;
                            break;
                        case "row-reverse":
                            n = t.style.borderRightWidth;
                            break;
                        case "column":
                            n = t.style.borderTopWidth;
                            break;
                        case "column-reverse":
                            n = t.style.borderBottomWidth
                    }
                    return null != n && n >= 0 ? n : void 0 !== t.style.borderWidth && t.style.borderWidth >= 0 ? t.style.borderWidth : 0
                }

                function s(t, e) {
                    if (void 0 !== t.style.borderEndWidth && t.style.borderEndWidth >= 0 && i(e)) return t.style.borderEndWidth;
                    var n = null;
                    switch (e) {
                        case "row":
                            n = t.style.borderRightWidth;
                            break;
                        case "row-reverse":
                            n = t.style.borderLeftWidth;
                            break;
                        case "column":
                            n = t.style.borderBottomWidth;
                            break;
                        case "column-reverse":
                            n = t.style.borderTopWidth
                    }
                    return null != n && n >= 0 ? n : void 0 !== t.style.borderWidth && t.style.borderWidth >= 0 ? t.style.borderWidth : 0
                }

                function c(t, e) {
                    return function(t, e) {
                        if (void 0 !== t.style.paddingStart && t.style.paddingStart >= 0 && i(e)) return t.style.paddingStart;
                        var n = null;
                        switch (e) {
                            case "row":
                                n = t.style.paddingLeft;
                                break;
                            case "row-reverse":
                                n = t.style.paddingRight;
                                break;
                            case "column":
                                n = t.style.paddingTop;
                                break;
                            case "column-reverse":
                                n = t.style.paddingBottom
                        }
                        return null != n && n >= 0 ? n : void 0 !== t.style.padding && t.style.padding >= 0 ? t.style.padding : 0
                    }(t, e) + u(t, e)
                }

                function h(t, e) {
                    return function(t, e) {
                        if (void 0 !== t.style.paddingEnd && t.style.paddingEnd >= 0 && i(e)) return t.style.paddingEnd;
                        var n = null;
                        switch (e) {
                            case "row":
                                n = t.style.paddingRight;
                                break;
                            case "row-reverse":
                                n = t.style.paddingLeft;
                                break;
                            case "column":
                                n = t.style.paddingBottom;
                                break;
                            case "column-reverse":
                                n = t.style.paddingTop
                        }
                        return null != n && n >= 0 ? n : void 0 !== t.style.padding && t.style.padding >= 0 ? t.style.padding : 0
                    }(t, e) + s(t, e)
                }

                function f(t, e) {
                    return u(t, e) + s(t, e)
                }

                function d(t, e) {
                    return a(t, e) + l(t, e)
                }

                function y(t, e) {
                    return c(t, e) + h(t, e)
                }

                function v(t, e) {
                    return e.style.alignSelf ? e.style.alignSelf : t.style.alignItems ? t.style.alignItems : "stretch"
                }

                function p(t, e) {
                    if ("rtl" === e) {
                        if ("row" === t) return "row-reverse";
                        if ("row-reverse" === t) return "row"
                    }
                    return t
                }

                function g(t) {
                    return t.style.position ? t.style.position : "relative"
                }

                function m(t) {
                    return "relative" === g(t) && t.style.flex > 0
                }

                function b(t, e) {
                    return t.layout[r[e]] + d(t, e)
                }

                function w(t, e) {
                    return void 0 !== t.style[r[e]] && t.style[r[e]] >= 0
                }

                function x(t, e) {
                    return void 0 !== t.style[e]
                }

                function k(t, e) {
                    return void 0 !== t.style[e] ? t.style[e] : 0
                }

                function S(t, e, n) {
                    var r = {
                            row: t.style.minWidth,
                            "row-reverse": t.style.minWidth,
                            column: t.style.minHeight,
                            "column-reverse": t.style.minHeight
                        }[e],
                        o = {
                            row: t.style.maxWidth,
                            "row-reverse": t.style.maxWidth,
                            column: t.style.maxHeight,
                            "column-reverse": t.style.maxHeight
                        }[e],
                        i = n;
                    return void 0 !== o && o >= 0 && i > o && (i = o), void 0 !== r && r >= 0 && i < r && (i = r), i
                }

                function T(t, e) {
                    return t > e ? t : e
                }

                function _(t, e) {
                    void 0 === t.layout[r[e]] && w(t, e) && (t.layout[r[e]] = T(S(t, e, t.style[r[e]]), y(t, e)))
                }

                function O(t, o, i) {
                    o.layout[e[i]] = t.layout[r[i]] - o.layout[r[i]] - o.layout[n[i]]
                }

                function E(n, r) {
                    return void 0 !== n.style[t[r]] ? k(n, t[r]) : -k(n, e[r])
                }

                function C(s, C, R) {
                    var N = function(t, e) {
                            var n;
                            return "inherit" === (n = t.style.direction ? t.style.direction : "inherit") && (n = void 0 === e ? "ltr" : e), n
                        }(s, R),
                        P = p(function(t) {
                            return t.style.flexDirection ? t.style.flexDirection : "column"
                        }(s), N),
                        j = function(t, e) {
                            return function(t) {
                                return "column" === t || "column-reverse" === t
                            }(t) ? p("row", e) : "column"
                        }(P, N),
                        I = p("row", N);
                    _(s, P), _(s, j), s.layout.direction = N, s.layout[t[P]] += a(s, P) + E(s, P), s.layout[e[P]] += l(s, P) + E(s, P), s.layout[t[j]] += a(s, j) + E(s, j), s.layout[e[j]] += l(s, j) + E(s, j);
                    var M = s.children.length,
                        D = y(s, I);
                    if (function(t) {
                            return void 0 !== t.style.measure
                        }(s)) {
                        var A = !o(s.layout[r[I]]),
                            L = void 0;
                        L = w(s, I) ? s.style.width : A ? s.layout[r[I]] : C - d(s, I), L -= D;
                        var W = !w(s, I) && !A,
                            H = !w(s, "column") && o(s.layout[r.column]);
                        if (W || H) {
                            var V = s.style.measure(L);
                            W && (s.layout.width = V.width + D), H && (s.layout.height = V.height + y(s, "column"))
                        }
                        if (0 === M) return
                    }
                    var Y, X, F, q, K = function(t) {
                            return "wrap" === t.style.flexWrap
                        }(s),
                        z = function(t) {
                            return t.style.justifyContent ? t.style.justifyContent : "flex-start"
                        }(s),
                        G = c(s, P),
                        U = c(s, j),
                        J = y(s, P),
                        $ = y(s, j),
                        Z = !o(s.layout[r[P]]),
                        Q = !o(s.layout[r[j]]),
                        tt = i(P),
                        et = null,
                        nt = null,
                        rt = void 0;
                    Z && (rt = s.layout[r[P]] - J);
                    for (var ot = 0, it = 0, at = 0, lt = 0, ut = 0, st = 0; it < M;) {
                        var ct, ht = 0,
                            ft = 0,
                            dt = 0,
                            yt = 0,
                            vt = Z && "flex-start" === z || !Z && "center" !== z,
                            pt = vt ? M : ot,
                            gt = !0,
                            mt = M,
                            bt = null,
                            wt = null,
                            xt = G,
                            kt = 0;
                        for (Y = ot; Y < M; ++Y) {
                            if ((F = s.children[Y]).lineIndex = st, F.nextAbsoluteChild = null, F.nextFlexChild = null, "stretch" === (Nt = v(s, F)) && "relative" === g(F) && Q && !w(F, j)) F.layout[r[j]] = T(S(F, j, s.layout[r[j]] - $ - d(F, j)), y(F, j));
                            else if ("absolute" === g(F))
                                for (null === et && (et = F), null !== nt && (nt.nextAbsoluteChild = F), nt = F, X = 0; X < 2; X++) q = 0 !== X ? "row" : "column", !o(s.layout[r[q]]) && !w(F, q) && x(F, t[q]) && x(F, e[q]) && (F.layout[r[q]] = T(S(F, q, s.layout[r[q]] - y(s, q) - d(F, q) - k(F, t[q]) - k(F, e[q])), y(F, q)));
                            var St = 0;
                            if (Z && m(F) ? (ft++, dt += F.style.flex, null === bt && (bt = F), null !== wt && (wt.nextFlexChild = F), wt = F, St = y(F, P) + d(F, P)) : (ct = void 0, tt || (ct = w(s, I) ? s.layout[r[I]] - D : C - d(s, I) - D), 0 === at && B(F, ct, N), "relative" === g(F) && (yt++, St = b(F, P))), K && Z && ht + St > rt && Y !== ot) {
                                yt--, at = 1;
                                break
                            }
                            vt && ("relative" !== g(F) || m(F)) && (vt = !1, pt = Y), gt && ("relative" !== g(F) || "stretch" !== Nt && "flex-start" !== Nt || o(F.layout[r[j]])) && (gt = !1, mt = Y), vt && (F.layout[n[P]] += xt, Z && O(s, F, P), xt += b(F, P), kt = T(kt, S(F, j, b(F, j)))), gt && (F.layout[n[j]] += lt + U, Q && O(s, F, j)), at = 0, ht += St, it = Y + 1
                        }
                        var Tt = 0,
                            _t = 0,
                            Ot = 0;
                        if (Ot = Z ? rt - ht : T(ht, 0) - ht, 0 !== ft) {
                            var Et, Ct, Bt = Ot / dt;
                            for (wt = bt; null !== wt;)(Et = Bt * wt.style.flex + y(wt, P)) !== (Ct = S(wt, P, Et)) && (Ot -= Ct, dt -= wt.style.flex), wt = wt.nextFlexChild;
                            for ((Bt = Ot / dt) < 0 && (Bt = 0), wt = bt; null !== wt;) wt.layout[r[P]] = S(wt, P, Bt * wt.style.flex + y(wt, P)), ct = void 0, w(s, I) ? ct = s.layout[r[I]] - D : tt || (ct = C - d(s, I) - D), B(wt, ct, N), F = wt, wt = wt.nextFlexChild, F.nextFlexChild = null
                        } else "flex-start" !== z && ("center" === z ? Tt = Ot / 2 : "flex-end" === z ? Tt = Ot : "space-between" === z ? (Ot = T(Ot, 0), _t = ft + yt - 1 != 0 ? Ot / (ft + yt - 1) : 0) : "space-around" === z && (Tt = (_t = Ot / (ft + yt)) / 2));
                        for (xt += Tt, Y = pt; Y < it; ++Y) "absolute" === g(F = s.children[Y]) && x(F, t[P]) ? F.layout[n[P]] = k(F, t[P]) + u(s, P) + a(F, P) : (F.layout[n[P]] += xt, Z && O(s, F, P), "relative" === g(F) && (xt += _t + b(F, P), kt = T(kt, S(F, j, b(F, j)))));
                        var Rt = s.layout[r[j]];
                        for (Q || (Rt = T(S(s, j, kt + $), $)), Y = mt; Y < it; ++Y)
                            if ("absolute" === g(F = s.children[Y]) && x(F, t[j])) F.layout[n[j]] = k(F, t[j]) + u(s, j) + a(F, j);
                            else {
                                var Nt, Pt = U;
                                if ("relative" === g(F))
                                    if ("stretch" === (Nt = v(s, F))) o(F.layout[r[j]]) && (F.layout[r[j]] = T(S(F, j, Rt - $ - d(F, j)), y(F, j)));
                                    else if ("flex-start" !== Nt) {
                                    var jt = Rt - $ - b(F, j);
                                    Pt += "center" === Nt ? jt / 2 : jt
                                }
                                F.layout[n[j]] += lt + Pt, Q && O(s, F, j)
                            }
                        lt += kt, ut = T(ut, xt), st += 1, ot = it
                    }
                    if (st > 1 && Q) {
                        var It = s.layout[r[j]] - $,
                            Mt = It - lt,
                            Dt = 0,
                            At = U,
                            Lt = function(t) {
                                return t.style.alignContent ? t.style.alignContent : "flex-start"
                            }(s);
                        "flex-end" === Lt ? At += Mt : "center" === Lt ? At += Mt / 2 : "stretch" === Lt && It > lt && (Dt = Mt / st);
                        var Wt = 0;
                        for (Y = 0; Y < st; ++Y) {
                            var Ht = Wt,
                                Vt = 0;
                            for (X = Ht; X < M; ++X)
                                if ("relative" === g(F = s.children[X])) {
                                    if (F.lineIndex !== Y) break;
                                    o(F.layout[r[j]]) || (Vt = T(Vt, F.layout[r[j]] + d(F, j)))
                                }
                            for (Wt = X, Vt += Dt, X = Ht; X < Wt; ++X)
                                if ("relative" === g(F = s.children[X])) {
                                    var Yt = v(s, F);
                                    if ("flex-start" === Yt) F.layout[n[j]] = At + a(F, j);
                                    else if ("flex-end" === Yt) F.layout[n[j]] = At + Vt - l(F, j) - F.layout[r[j]];
                                    else if ("center" === Yt) {
                                        var Xt = F.layout[r[j]];
                                        F.layout[n[j]] = At + (Vt - Xt) / 2
                                    } else "stretch" === Yt && (F.layout[n[j]] = At + a(F, j))
                                }
                            At += Vt
                        }
                    }
                    var Ft = !1,
                        qt = !1;
                    if (Z || (s.layout[r[P]] = T(S(s, P, ut + h(s, P)), J), "row-reverse" !== P && "column-reverse" !== P || (Ft = !0)), Q || (s.layout[r[j]] = T(S(s, j, lt + $), $), "row-reverse" !== j && "column-reverse" !== j || (qt = !0)), Ft || qt)
                        for (Y = 0; Y < M; ++Y) F = s.children[Y], Ft && O(s, F, P), qt && O(s, F, j);
                    for (nt = et; null !== nt;) {
                        for (X = 0; X < 2; X++) q = 0 !== X ? "row" : "column", !o(s.layout[r[q]]) && !w(nt, q) && x(nt, t[q]) && x(nt, e[q]) && (nt.layout[r[q]] = T(S(nt, q, s.layout[r[q]] - f(s, q) - d(nt, q) - k(nt, t[q]) - k(nt, e[q])), y(nt, q))), x(nt, e[q]) && !x(nt, t[q]) && (nt.layout[t[q]] = s.layout[r[q]] - nt.layout[r[q]] - k(nt, e[q]));
                        F = nt, nt = nt.nextAbsoluteChild, F.nextAbsoluteChild = null
                    }
                }

                function B(t, e, n) {
                    t.shouldUpdate = !0;
                    var r = t.style.direction || "ltr";
                    !t.isDirty && t.lastLayout && t.lastLayout.requestedHeight === t.layout.height && t.lastLayout.requestedWidth === t.layout.width && t.lastLayout.parentMaxWidth === e && t.lastLayout.direction === r ? (t.layout.width = t.lastLayout.width, t.layout.height = t.lastLayout.height, t.layout.top = t.lastLayout.top, t.layout.left = t.lastLayout.left) : (t.lastLayout || (t.lastLayout = {}), t.lastLayout.requestedWidth = t.layout.width, t.lastLayout.requestedHeight = t.layout.height, t.lastLayout.parentMaxWidth = e, t.lastLayout.direction = r, t.children.forEach((function(t) {
                        t.layout.width = void 0, t.layout.height = void 0, t.layout.top = 0, t.layout.left = 0
                    })), C(t, e, n), t.lastLayout.width = t.layout.width, t.lastLayout.height = t.layout.height, t.lastLayout.top = t.layout.top, t.lastLayout.left = t.layout.left)
                }
                return {
                    layoutNodeImpl: C,
                    computeLayout: B,
                    fillNodes: function t(e) {
                        return e.layout && !e.isDirty || (e.layout = {
                            width: void 0,
                            height: void 0,
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0
                        }), e.style || (e.style = {}), e.children || (e.children = []), e.children.forEach(t), e
                    }
                }
            }();
            return t.exports = e,
                function(t) {
                    e.fillNodes(t), e.computeLayout(t)
                }
        }) ? r.apply(e, o) : r) || (t.exports = i)
    }, function(t, e, n) {
        function r(t, e, n) {
            var r, o;
            return e || (e = 250),
                function() {
                    var i = n || this,
                        a = +new Date,
                        l = arguments;
                    r && a < r + e ? (clearTimeout(o), o = setTimeout((function() {
                        r = a, t.apply(i, l)
                    }), e)) : (r = a, t.apply(i, l))
                }
        }

        function o() {}

        function i(t) {
            var e = t.touchstart,
                n = t.touchend;
            if (!(e && n && e.timeStamp && n.timeStamp && void 0 !== e.pageX && void 0 !== e.pageY && void 0 !== n.pageX && void 0 !== n.pageY)) return !1;
            var r = e.pageX,
                o = e.pageY,
                i = n.pageX,
                a = n.pageY,
                l = n.timeStamp - e.timeStamp;
            return !!(Math.abs(a - o) < 30 && Math.abs(i - r) < 30 && l < 300)
        }

        function a() {
            return "undefined" != typeof __env ? __env.createCanvas() : document.createElement("canvas")
        }

        function l() {
            return "undefined" != typeof __env ? __env.createImage() : document.createElement("img")
        }
        var u;

        function s() {
            return void 0 !== u || ("undefined" != typeof __env && __env.getSystemInfoSync ? u = __env.getSystemInfoSync().devicePixelRatio : (console.warn("failed to access device pixel ratio, fallback to 1"), u = 1)), u
        }
        n.r(e), n.d(e, "throttle", (function() {
            return r
        })), n.d(e, "none", (function() {
            return o
        })), n.d(e, "isClick", (function() {
            return i
        })), n.d(e, "createCanvas", (function() {
            return a
        })), n.d(e, "createImage", (function() {
            return l
        })), n.d(e, "getDpr", (function() {
            return s
        })), n.d(e, "STATE", (function() {
            return c
        })), n.d(e, "repaintChildren", (function() {
            return h
        })), n.d(e, "repaintTree", (function() {
            return f
        })), "undefined" != typeof swan && __env.onMessage((function(t) {
            t && "engine" === t.type && "systemInfo" === t.event && (u = t.systemInfo.devicePixelRatio)
        }));
        var c = {
                UNINIT: "UNINIT",
                INITED: "INITED",
                RENDERED: "RENDERED",
                CLEAR: "CLEAR"
            },
            h = function t(e) {
                e.forEach((function(e) {
                    e.repaint(), t(e.children)
                }))
            },
            f = function t(e) {
                e.repaint(), e.children.forEach((function(e) {
                    e.repaint(), t(e)
                }))
            }
    }, function(t, e, n) {
        var r = n(9),
            o = n(11),
            i = n(11),
            a = n(10).buildOptions,
            l = n(13);
        e.parse = function(t, e, n) {
            if (n) {
                !0 === n && (n = {});
                var u = l.validate(t, n);
                if (!0 !== u) throw Error(u.err.msg)
            }
            return e = a(e, i.defaultOptions, i.props), r.convertToJson(o.getTraversalObj(t, e), e)
        }
    }, function(t, e, n) {
        var r = n(10);
        e.convertToJson = function t(e, n) {
            var o = {
                name: e.tagname
            };
            return e.child && !r.isEmptyObject(e.child) || e.attrsMap && !r.isEmptyObject(e.attrsMap) ? (r.isExist(e.val) && ("string" != typeof e.val || "" !== e.val && e.val !== n.cdataPositionChar) && ("strict" === n.arrayMode ? o[n.textNodeName] = [e.val] : o[n.textNodeName] = e.val), r.merge(o, e.attrsMap, n.arrayMode), o.children = [], e.children.forEach((function(e) {
                o.children.push(t(e, n))
            })), o) : r.isExist(e.val) && e.val ? e.val : o
        }
    }, function(t, e, n) {
        var r = function(t, e) {
            var n = e.exec(t);
            return !(null == n)
        };
        e.isExist = function(t) {
            return void 0 !== t
        }, e.isEmptyObject = function(t) {
            return 0 === Object.keys(t).length
        }, e.merge = function(t, e, n) {
            if (e)
                for (var r = Object.keys(e), o = r.length, i = 0; i < o; i++) t[r[i]] = "strict" === n ? [e[r[i]]] : e[r[i]]
        }, e.getValue = function(t) {
            return e.isExist(t) ? t : ""
        }, e.buildOptions = function(t, e, n) {
            var r = {};
            if (!t) return e;
            for (var o = 0; o < n.length; o++) void 0 !== t[n[o]] ? r[n[o]] = t[n[o]] : r[n[o]] = e[n[o]];
            return r
        }, e.doesMatch = r, e.doesNotMatch = function(t, e) {
            return !r(t, e)
        }, e.getAllMatches = function(t, e) {
            for (var n = [], r = e.exec(t); r;) {
                for (var o = [], i = r.length, a = 0; a < i; a++) o.push(r[a]);
                n.push(o), r = e.exec(t)
            }
            return n
        }
    }, function(t, e, n) {
        var r = n(10),
            o = n(10).buildOptions,
            i = n(12),
            a = 1,
            l = 2,
            u = 3,
            s = 4,
            c = "<((!\\[CDATA\\[([\\s\\S]*?)(]]>))|(([\\w:\\-._]*:)?([\\w:\\-._]+))([^>]*)>|((\\/)(([\\w:\\-._]*:)?([\\w:\\-._]+))\\s*>))([^<]*)";
        !Number.parseInt && window.parseInt && (Number.parseInt = window.parseInt), !Number.parseFloat && window.parseFloat && (Number.parseFloat = window.parseFloat);
        var h = {
            attributeNamePrefix: "@_",
            attrNodeName: !1,
            textNodeName: "#text",
            ignoreAttributes: !0,
            ignoreNameSpace: !1,
            allowBooleanAttributes: !1,
            parseNodeValue: !0,
            parseAttributeValue: !1,
            arrayMode: !1,
            trimValues: !0,
            cdataTagName: !1,
            cdataPositionChar: "\\c",
            localeRange: "",
            tagValueProcessor: function(t) {
                return t
            },
            attrValueProcessor: function(t) {
                return t
            },
            stopNodes: []
        };
        e.defaultOptions = h;
        var f = ["attributeNamePrefix", "attrNodeName", "textNodeName", "ignoreAttributes", "ignoreNameSpace", "allowBooleanAttributes", "parseNodeValue", "parseAttributeValue", "arrayMode", "trimValues", "cdataTagName", "cdataPositionChar", "localeRange", "tagValueProcessor", "attrValueProcessor", "parseTrueNumberOnly", "stopNodes"];
        e.props = f;

        function d(t, e, n) {
            var r = t[7] || n,
                o = t[14];
            return o && (e.trimValues && (o = o.trim()), o = p(o = e.tagValueProcessor(o, r), e.parseNodeValue, e.parseTrueNumberOnly)), o
        }

        function y(t) {
            return "]]>" === t[4] ? s : "/" === t[10] ? l : void 0 !== t[8] && "/" === t[8].substr(t[8].length - 1) ? u : a
        }

        function v(t, e) {
            if (e.ignoreNameSpace) {
                var n = t.split(":"),
                    r = "/" === t.charAt(0) ? "/" : "";
                if ("xmlns" === n[0]) return "";
                2 === n.length && (t = r + n[1])
            }
            return t
        }

        function p(t, e, n) {
            var o;
            return e && "string" == typeof t ? ("" === t.trim() || isNaN(t) ? o = "true" === t || "false" !== t && t : (o = -1 !== t.indexOf("0x") ? Number.parseInt(t, 16) : -1 !== t.indexOf(".") ? Number.parseFloat(t) : Number.parseInt(t, 10), n && (o = String(o) === t ? o : t)), o) : r.isExist(t) ? t : ""
        }
        var g = new RegExp("([^\\s=]+)\\s*(=\\s*(['\"])(.*?)\\3)?", "g");

        function m(t, e) {
            if (!e.ignoreAttributes && "string" == typeof t) {
                t = t.replace(/\r?\n/g, " ");
                for (var n = r.getAllMatches(t, g), o = n.length, i = {}, a = 0; a < o; a++) {
                    var l = v(n[a][1], e);
                    l.length && (void 0 !== n[a][4] ? (e.trimValues && (n[a][4] = n[a][4].trim()), n[a][4] = e.attrValueProcessor(n[a][4], l), i[e.attributeNamePrefix + l] = p(n[a][4], e.parseAttributeValue, e.parseTrueNumberOnly)) : e.allowBooleanAttributes && (i[e.attributeNamePrefix + l] = !0))
                }
                if (!Object.keys(i).length) return;
                if (e.attrNodeName) {
                    var u = {};
                    return u[e.attrNodeName] = i, u
                }
                return i
            }
        }
        e.getTraversalObj = function(t, e) {
            e = o(e, h, f), t = t.replace(/<!--[\s\S]*?-->/g, "");
            var n = new i("!xml"),
                a = n;
            c = c.replace(/\[\\w/g, "[" + e.localeRange + "\\w");
            for (var v = new RegExp(c, "g"), p = v.exec(t), g = v.exec(t); p;) {
                var b = y(p);
                if (b === l) a.parent && p[14] && (a.parent.val = r.getValue(a.parent.val) + "" + d(p, e, a.parent.tagname)), e.stopNodes.length && e.stopNodes.includes(a.tagname) && (a.child = [], null == a.attrsMap && (a.attrsMap = {}), a.val = t.substr(a.startIndex + 1, p.index - a.startIndex - 1)), a = a.parent;
                else if (b === s)
                    if (e.cdataTagName) {
                        var w = new i(e.cdataTagName, a, p[3]);
                        w.attrsMap = m(p[8], e), a.addChild(w), a.val = r.getValue(a.val) + e.cdataPositionChar, p[14] && (a.val += d(p, e))
                    } else a.val = (a.val || "") + (p[3] || "") + d(p, e);
                else if (b === u) {
                    a && p[14] && (a.val = r.getValue(a.val) + "" + d(p, e));
                    var x = new i(e.ignoreNameSpace ? p[7] : p[5], a, "");
                    p[8] && p[8].length > 0 && (p[8] = p[8].substr(0, p[8].length - 1)), x.attrsMap = m(p[8], e), a.addChild(x)
                } else {
                    var k = new i(e.ignoreNameSpace ? p[7] : p[5], a, d(p, e));
                    e.stopNodes.length && e.stopNodes.includes(k.tagname) && (k.startIndex = p.index + p[1].length), k.attrsMap = m(p[8], e), a.addChild(k), a = k
                }
                p = g, g = v.exec(t)
            }
            return n
        }
    }, function(t, e, n) {
        t.exports = function(t, e, n) {
            this.tagname = t, this.parent = e, this.child = {}, this.attrsMap = {}, this.children = [], this.val = n, this.addChild = function(t) {
                this.children.push(t), Array.isArray(this.child[t.tagname]) ? this.child[t.tagname].push(t) : this.child[t.tagname] = [t]
            }
        }
    }, function(t, e, n) {
        var r = n(10),
            o = {
                allowBooleanAttributes: !1,
                localeRange: "a-zA-Z"
            },
            i = ["allowBooleanAttributes", "localeRange"];

        function a(t, e) {
            for (var n = e; e < t.length; e++)
                if ("?" != t[e] && " " != t[e]);
                else {
                    var r = t.substr(n, e - n);
                    if (e > 5 && "xml" === r) return {
                        err: {
                            code: "InvalidXml",
                            msg: "XML declaration allowed only at the start of the document."
                        }
                    };
                    if ("?" == t[e] && ">" == t[e + 1]) {
                        e++;
                        break
                    }
                }
            return e
        }

        function l(t, e) {
            if (t.length > e + 5 && "-" === t[e + 1] && "-" === t[e + 2]) {
                for (e += 3; e < t.length; e++)
                    if ("-" === t[e] && "-" === t[e + 1] && ">" === t[e + 2]) {
                        e += 2;
                        break
                    }
            } else if (t.length > e + 8 && "D" === t[e + 1] && "O" === t[e + 2] && "C" === t[e + 3] && "T" === t[e + 4] && "Y" === t[e + 5] && "P" === t[e + 6] && "E" === t[e + 7]) {
                var n = 1;
                for (e += 8; e < t.length; e++)
                    if ("<" === t[e]) n++;
                    else if (">" === t[e] && 0 === --n) break
            } else if (t.length > e + 9 && "[" === t[e + 1] && "C" === t[e + 2] && "D" === t[e + 3] && "A" === t[e + 4] && "T" === t[e + 5] && "A" === t[e + 6] && "[" === t[e + 7])
                for (e += 8; e < t.length; e++)
                    if ("]" === t[e] && "]" === t[e + 1] && ">" === t[e + 2]) {
                        e += 2;
                        break
                    }
            return e
        }
        e.validate = function(t, e) {
            e = r.buildOptions(e, o, i);
            var n = [],
                s = !1;
            "\ufeff" === t[0] && (t = t.substr(1));
            for (var h = new RegExp("^[_w][\\w\\-.:]*$".replace("_w", "_" + e.localeRange)), d = new RegExp("^([w]|_)[\\w.\\-_:]*".replace("([w", "([" + e.localeRange)), y = 0; y < t.length; y++) {
                if ("<" !== t[y]) {
                    if (" " === t[y] || "\t" === t[y] || "\n" === t[y] || "\r" === t[y]) continue;
                    return {
                        err: {
                            code: "InvalidChar",
                            msg: "char " + t[y] + " is not expected ."
                        }
                    }
                }
                if ("?" === t[++y]) {
                    if ((y = a(t, ++y)).err) return y
                } else {
                    if ("!" === t[y]) {
                        y = l(t, y);
                        continue
                    }
                    var v = !1;
                    "/" === t[y] && (v = !0, y++);
                    for (var p = ""; y < t.length && ">" !== t[y] && " " !== t[y] && "\t" !== t[y] && "\n" !== t[y] && "\r" !== t[y]; y++) p += t[y];
                    if ("/" === (p = p.trim())[p.length - 1]) {
                        p = p.substring(0, p.length - 1);
                        continue
                    }
                    if (!f(p, d)) return {
                        err: {
                            code: "InvalidTag",
                            msg: "Tag " + p + " is an invalid name."
                        }
                    };
                    var g = u(t, y);
                    if (!1 === g) return {
                        err: {
                            code: "InvalidAttr",
                            msg: 'Attributes for "' + p + '" have open quote.'
                        }
                    };
                    var m = g.value;
                    if (y = g.index, "/" === m[m.length - 1]) {
                        var b = c(m = m.substring(0, m.length - 1), e, h);
                        if (!0 !== b) return b;
                        s = !0
                    } else if (v) {
                        if (!g.tagClosed) return {
                            err: {
                                code: "InvalidTag",
                                msg: 'closing tag "' + p + "\" don't have proper closing."
                            }
                        };
                        if (m.trim().length > 0) return {
                            err: {
                                code: "InvalidTag",
                                msg: 'closing tag "' + p + "\" can't have attributes or invalid starting."
                            }
                        };
                        var w = n.pop();
                        if (p !== w) return {
                            err: {
                                code: "InvalidTag",
                                msg: "closing tag " + w + " is expected inplace of " + p + "."
                            }
                        }
                    } else {
                        var x = c(m, e, h);
                        if (!0 !== x) return x;
                        n.push(p), s = !0
                    }
                    for (y++; y < t.length; y++)
                        if ("<" === t[y]) {
                            if ("!" === t[y + 1]) {
                                y = l(t, ++y);
                                continue
                            }
                            break
                        }
                        "<" === t[y] && y--
                }
            }
            return s ? !(n.length > 0) || {
                err: {
                    code: "InvalidXml",
                    msg: "Invalid " + JSON.stringify(n, null, 4).replace(/\r?\n/g, "") + " found."
                }
            } : {
                err: {
                    code: "InvalidXml",
                    msg: "Start tag expected."
                }
            }
        };

        function u(t, e) {
            for (var n = "", r = "", o = !1; e < t.length; e++) {
                if ('"' === t[e] || "'" === t[e])
                    if ("" === r) r = t[e];
                    else {
                        if (r !== t[e]) continue;
                        r = ""
                    } else if (">" === t[e] && "" === r) {
                    o = !0;
                    break
                }
                n += t[e]
            }
            return "" === r && {
                value: n,
                index: e,
                tagClosed: o
            }
        }
        var s = new RegExp("(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['\"])(([\\s\\S])*?)\\5)?", "g");

        function c(t, e, n) {
            for (var o = r.getAllMatches(t, s), i = {}, a = 0; a < o.length; a++) {
                if (0 === o[a][1].length) return {
                    err: {
                        code: "InvalidAttr",
                        msg: "attribute " + o[a][2] + " has no space in starting."
                    }
                };
                if (void 0 === o[a][3] && !e.allowBooleanAttributes) return {
                    err: {
                        code: "InvalidAttr",
                        msg: "boolean attribute " + o[a][2] + " is not allowed."
                    }
                };
                var l = o[a][2];
                if (!h(l, n)) return {
                    err: {
                        code: "InvalidAttr",
                        msg: "attribute " + l + " is an invalid name."
                    }
                };
                if (Object.prototype.hasOwnProperty.call(i, l)) return {
                    err: {
                        code: "InvalidAttr",
                        msg: "attribute " + l + " is repeated."
                    }
                };
                i[l] = 1
            }
            return !0
        }

        function h(t, e) {
            return r.doesMatch(t, e)
        }

        function f(t, e) {
            return !r.doesNotMatch(t, e)
        }
    }, function(t, e, n) {
        n.r(e), n.d(e, "default", (function() {
            return l
        }));
        var r = n(15);

        function o(t, e) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
            }
        }
        var i = new(n(5).default)("bitMapPool"),
            a = n(4),
            l = function() {
                function t(e, n, o) {
                    var l = this;
                    ! function(t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, t);
                    var u = i.get(e);
                    if (u) return u;
                    this.config = o, this.chars = this.parseConfig(o), this.ready = !1, this.event = new a, this.texture = r.default.loadImage(n, (function(t, e) {
                        e && (l.texture = t), l.ready = !0, l.event.emit("text__load__done")
                    })), i.set(e, this)
                }
                var e, n, l;
                return e = t, (n = [{
                    key: "parseConfig",
                    value: function(t) {
                        var e = (t = t.split("\r\n").join("\n")).split("\n"),
                            n = this.getConfigByKey(e[3], "count");
                        this.lineHeight = this.getConfigByKey(e[1], "lineHeight"), this.fontSize = this.getConfigByKey(e[0], "size");
                        for (var r = {}, o = 4; o < 4 + n; o++) {
                            var i = e[o],
                                a = {};
                            r[String.fromCharCode(this.getConfigByKey(i, "id"))] = a, a.x = this.getConfigByKey(i, "x"), a.y = this.getConfigByKey(i, "y"), a.w = this.getConfigByKey(i, "width"), a.h = this.getConfigByKey(i, "height"), a.offX = this.getConfigByKey(i, "xoffset"), a.offY = this.getConfigByKey(i, "yoffset"), a.xadvance = this.getConfigByKey(i, "xadvance")
                        }
                        return r
                    }
                }, {
                    key: "getConfigByKey",
                    value: function(t, e) {
                        for (var n = t.split(" "), r = 0, o = n.length; r < o; r++) {
                            var i = n[r];
                            if (e === i.substring(0, e.length)) {
                                var a = i.substring(e.length + 1);
                                return parseInt(a)
                            }
                        }
                        return 0
                    }
                }]) && o(e.prototype, n), l && o(e, l), t
            }()
    }, function(t, e, n) {
        n.r(e);
        var r = n(5),
            o = n(7);

        function i(t, e) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
            }
        }
        var a = new r.default("imgPool"),
            l = function() {
                function t() {
                    ! function(t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, t)
                }
                var e, n, r;
                return e = t, (n = [{
                    key: "getRes",
                    value: function(t) {
                        return a.get(t)
                    }
                }, {
                    key: "loadImage",
                    value: function(t) {
                        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : o.none,
                            n = null,
                            r = this.getRes(t);
                        return t ? (r && r.loadDone ? e(n = r, !0) : r && !r.loadDone ? (n = r, r.onloadcbks.push(e)) : ((n = Object(o.createImage)()).onloadcbks = [e], a.set(t, n), n.onload = function() {
                            n.onloadcbks.forEach((function(t) {
                                return t(n, !1)
                            })), n.onloadcbks = [], n.loadDone = !0
                        }, n.onerror = function(t) {
                            console.log("img load error", t)
                        }, n.src = t), n) : n
                    }
                }]) && i(e.prototype, n), r && i(e, r), t
            }();
        e.default = new l
    }, function(t, e, n) {
        n.r(e);
        var r = n(17);
        n.d(e, "View", (function() {
            return r.default
        }));
        var o = n(18);
        n.d(e, "Image", (function() {
            return o.default
        }));
        var i = n(19);
        n.d(e, "Text", (function() {
            return i.default
        }));
        var a = n(20);
        n.d(e, "ScrollView", (function() {
            return a.default
        }));
        var l = n(22);
        n.d(e, "BitMapText", (function() {
            return l.default
        }))
    }, function(t, e, n) {
        function r(t) {
            return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t
            } : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            })(t)
        }

        function o(t, e) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
            }
        }

        function i(t, e) {
            return (i = Object.setPrototypeOf || function(t, e) {
                return t.__proto__ = e, t
            })(t, e)
        }

        function a(t) {
            var e = function() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}))), !0
                } catch (t) {
                    return !1
                }
            }();
            return function() {
                var n, r = u(t);
                if (e) {
                    var o = u(this).constructor;
                    n = Reflect.construct(r, arguments, o)
                } else n = r.apply(this, arguments);
                return l(this, n)
            }
        }

        function l(t, e) {
            return !e || "object" !== r(e) && "function" != typeof e ? function(t) {
                if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return t
            }(t) : e
        }

        function u(t) {
            return (u = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
                return t.__proto__ || Object.getPrototypeOf(t)
            })(t)
        }
        n.r(e), n.d(e, "default", (function() {
            return s
        }));
        var s = function(t) {
            ! function(t, e) {
                if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        writable: !0,
                        configurable: !0
                    }
                }), e && i(t, e)
            }(u, t);
            var e, n, r, l = a(u);

            function u(t) {
                var e, n = t.style,
                    r = void 0 === n ? {} : n,
                    o = t.props,
                    i = void 0 === o ? {} : o,
                    a = t.idName,
                    s = void 0 === a ? "" : a,
                    c = t.className,
                    h = void 0 === c ? "" : c;
                return function(t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, u), (e = l.call(this, {
                    props: i,
                    idName: s,
                    className: h,
                    style: r
                })).type = "View", e.ctx = null, e.renderBoxes = [], e
            }
            return e = u, (n = [{
                key: "destroySelf",
                value: function() {
                    this.isDestroyed = !0, this.children = null, this.root = null
                }
            }, {
                key: "checkNeedRender",
                value: function() {
                    var t = this.style || {},
                        e = t.borderColor;
                    return !!(t.backgroundColor || t.borderWidth && e || t.borderTopWidth && (e || t.borderTopColor) || t.borderBottomWidth && (e || t.borderBottomColor) || t.borderLeftWidth && (e || t.borderLeftColor) || t.borderRightWidth && (e || t.borderRightColor))
                }
            }, {
                key: "render",
                value: function(t, e) {
                    var n = this.style || {},
                        r = e || this.layoutBox;
                    t.save();
                    var o = n.borderWidth || 0,
                        i = r.absoluteX,
                        a = r.absoluteY,
                        l = n.borderLeftWidth || o,
                        u = n.borderRightWidth || o,
                        s = n.borderTopWidth || o,
                        c = n.borderBottomWidth || o;
                    this.renderBorder(t, e), n.backgroundColor && (t.fillStyle = n.backgroundColor, t.fillRect(i + l, a + u, r.width - (l + u), r.height - (s + c))), t.restore()
                }
            }, {
                key: "insert",
                value: function(t, e) {
                    this.ctx = t, e || (e = this.layoutBox), this.renderBoxes.push({
                        ctx: t,
                        box: e
                    }), this.render(t, e)
                }
            }, {
                key: "repaint",
                value: function() {
                    var t = this;
                    this.renderBoxes.forEach((function(e) {
                        t.render(e.ctx, e.box)
                    }))
                }
            }]) && o(e.prototype, n), r && o(e, r), u
        }(n(2).default)
    }, function(t, e, n) {
        n.r(e), n.d(e, "default", (function() {
            return f
        }));
        var r = n(2),
            o = n(15);

        function i(t) {
            return (i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t
            } : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            })(t)
        }

        function a(t, e) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
            }
        }

        function l(t, e) {
            return (l = Object.setPrototypeOf || function(t, e) {
                return t.__proto__ = e, t
            })(t, e)
        }

        function u(t) {
            var e = function() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}))), !0
                } catch (t) {
                    return !1
                }
            }();
            return function() {
                var n, r = h(t);
                if (e) {
                    var o = h(this).constructor;
                    n = Reflect.construct(r, arguments, o)
                } else n = r.apply(this, arguments);
                return s(this, n)
            }
        }

        function s(t, e) {
            return !e || "object" !== i(e) && "function" != typeof e ? c(t) : e
        }

        function c(t) {
            if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }

        function h(t) {
            return (h = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
                return t.__proto__ || Object.getPrototypeOf(t)
            })(t)
        }
        var f = function(t) {
            ! function(t, e) {
                if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        writable: !0,
                        configurable: !0
                    }
                }), e && l(t, e)
            }(s, t);
            var e, n, r, i = u(s);

            function s(t) {
                var e;
                ! function(t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, s);
                var n = t.style,
                    r = void 0 === n ? {} : n,
                    a = t.props,
                    l = void 0 === a ? {} : a,
                    u = t.idName,
                    h = void 0 === u ? "" : u,
                    f = t.className,
                    d = void 0 === f ? "" : f,
                    y = t.src,
                    v = void 0 === y ? "" : y;
                return (e = i.call(this, {
                    props: l,
                    idName: h,
                    className: d,
                    style: r
                })).imgsrc = v, Object.defineProperty(c(e), "src", {get: function() {
                        return this.imgsrc
                    },
                    set: function(t) {
                        var e = this;
                        t !== this.imgsrc && (this.imgsrc = t, o.default.loadImage(this.src, (function(t) {
                            e.img = t, e.emit("repaint")
                        })))
                    },
                    enumerable: !0,
                    configurable: !0
                }), e.type = "Image", e.renderBoxes = [], e
            }
            return e = s, (n = [{
                key: "repaint",
                value: function() {
                    var t = this;
                    this.renderBoxes.forEach((function(e) {
                        t.renderImg(e.ctx, e.box, !1)
                    }))
                }
            }, {
                key: "destroySelf",
                value: function() {
                    this.isDestroyed = !0, this.img = null, delete this.src, this.root = null
                }
            }, {
                key: "renderImg",
                value: function(t, e) {
                    if (this.img) {
                        var n = this.style || {},
                            r = e || this.layoutBox;
                        t.save(), n.borderColor && (t.strokeStyle = n.borderColor), t.lineWidth = n.borderWidth || 0;
                        var o = r.absoluteX,
                            i = r.absoluteY;
                        this.renderBorder(t, e), t.drawImage(this.img, o, i, r.width, r.height), t.restore()
                    }
                }
            }, {
                key: "insert",
                value: function(t, e) {
                    var n = this;
                    this.renderBoxes.push({
                        ctx: t,
                        box: e
                    }), this.img = o.default.loadImage(this.src, (function(r, o) {
                        if (o) n.img = r, n.renderImg(t, e, !1);
                        else if (n.img) {
                            var i = n.isScrollViewChild ? "image__render__done" : "one__image__render__done";
                            n.EE.emit(i, n)
                        }
                    }))
                }
            }, {
                key: "isScrollViewChild",
                get: function() {
                    for (var t = !1, e = this.parent; e && !t;) "ScrollView" === e.type ? t = !0 : e = e.parent;
                    return t
                }
            }]) && a(e.prototype, n), r && a(e, r), s
        }(r.default)
    }, function(t, e, n) {
        n.r(e), n.d(e, "default", (function() {
            return p
        }));
        var r = n(2),
            o = n(7);

        function i(t) {
            return (i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t
            } : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            })(t)
        }

        function a(t, e) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
            }
        }

        function l(t, e) {
            return (l = Object.setPrototypeOf || function(t, e) {
                return t.__proto__ = e, t
            })(t, e)
        }

        function u(t) {
            var e = function() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}))), !0
                } catch (t) {
                    return !1
                }
            }();
            return function() {
                var n, r = h(t);
                if (e) {
                    var o = h(this).constructor;
                    n = Reflect.construct(r, arguments, o)
                } else n = r.apply(this, arguments);
                return s(this, n)
            }
        }

        function s(t, e) {
            return !e || "object" !== i(e) && "function" != typeof e ? c(t) : e
        }

        function c(t) {
            if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }

        function h(t) {
            return (h = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
                return t.__proto__ || Object.getPrototypeOf(t)
            })(t)
        }
        var f = null,
            d = function() {
                if (f) return f;
                var t = Object(o.createCanvas)();
                return t.width = 1, t.height = 1, f = t.getContext("2d")
            };

        function y(t, e) {
            var n = d();
            return n.font = "".concat(t.fontWeight || "normal", " ").concat(t.fontSize || 12, "px ").concat(t.fontFamily || "PingFangSC-Regular, sans-serif"), n.measureText(e).width || 0
        }

        function v(t) {
            return d().measureText(t).width || 0
        }
        var p = function(t) {
            ! function(t, e) {
                if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        writable: !0,
                        configurable: !0
                    }
                }), e && l(t, e)
            }(i, t);
            var e, n, r, o = u(i);

            function i(t) {
                var e, n = t.style,
                    r = void 0 === n ? {} : n,
                    a = t.props,
                    l = void 0 === a ? {} : a,
                    u = t.idName,
                    s = void 0 === u ? "" : u,
                    h = t.className,
                    f = void 0 === h ? "" : h,
                    d = t.value,
                    p = void 0 === d ? "" : d;
                return function(t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, i), void 0 === r.width ? r.width = y(r, p) : "ellipsis" === r.textOverflow && (p = function(t, e) {
                    e = String(e);
                    var n = t.width,
                        r = y(t, e),
                        o = t.textOverflow || "ellipsis";
                    if (r <= n) return e;
                    "ellipsis" === o && (n -= v("..."));
                    for (var i = e.length - 1, a = e.substring(0, i); v(a) > n && i > 0;) i--, a = e.substring(0, i);
                    return i && "ellipsis" === o ? a + "..." : a
                }(r, p)), (e = o.call(this, {
                    props: l,
                    idName: s,
                    className: f,
                    style: r
                })).type = "Text", e.ctx = null, e.valuesrc = p, e.renderBoxes = [], Object.defineProperty(c(e), "value", {get: function() {
                        return this.valuesrc
                    },
                    set: function(t) {
                        t !== this.valuesrc && (this.valuesrc = t, this.emit("repaint"))
                    },
                    enumerable: !0,
                    configurable: !0
                }), e
            }
            return e = i, (n = [{
                key: "toCanvasData",
                value: function() {
                    var t = this.style || {};
                    this.fontSize = t.fontSize || 12, this.textBaseline = "top", this.font = "".concat(t.fontWeight || "", " ").concat(t.fontSize || 12, "px ").concat("PingFangSC-Regular, sans-serif"), this.textAlign = t.textAlign || "left", this.fillStyle = t.color || "#000"
                }
            }, {
                key: "insert",
                value: function(t, e) {
                    this.renderBoxes.push({
                        ctx: t,
                        box: e
                    }), this.render(t, e)
                }
            }, {
                key: "repaint",
                value: function() {
                    var t = this;
                    this.renderBoxes.forEach((function(e) {
                        t.render(e.ctx, e.box)
                    }))
                }
            }, {
                key: "destroySelf",
                value: function() {
                    this.root = null
                }
            }, {
                key: "render",
                value: function(t, e) {
                    this.toCanvasData(), t.save();
                    var n = e || this.layoutBox,
                        r = this.style;
                    t.textBaseline = this.textBaseline, t.font = this.font, t.textAlign = this.textAlign;
                    var o = n.absoluteX,
                        i = n.absoluteY;
                    this.renderBorder(t, e), r.backgroundColor && (t.fillStyle = r.backgroundColor, t.fillRect(o, i, n.width, n.height)), t.fillStyle = this.fillStyle, "center" === this.textAlign ? o += n.width / 2 : "right" === this.textAlign && (o += n.width), r.lineHeight && (t.textBaseline = "middle", i += r.lineHeight / 2), t.fillText(this.value, o, i), t.restore()
                }
            }]) && a(e.prototype, n), r && a(e, r), i
        }(r.default)
    }, function(t, e, n) {
        n.r(e), n.d(e, "default", (function() {
            return p
        }));
        var r = n(17),
            o = n(5),
            i = n(21),
            a = n(7);

        function l(t) {
            return (l = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t
            } : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            })(t)
        }

        function u(t, e) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
            }
        }

        function s(t, e) {
            return (s = Object.setPrototypeOf || function(t, e) {
                return t.__proto__ = e, t
            })(t, e)
        }

        function c(t) {
            var e = function() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}))), !0
                } catch (t) {
                    return !1
                }
            }();
            return function() {
                var n, r = d(t);
                if (e) {
                    var o = d(this).constructor;
                    n = Reflect.construct(r, arguments, o)
                } else n = r.apply(this, arguments);
                return h(this, n)
            }
        }

        function h(t, e) {
            return !e || "object" !== l(e) && "function" != typeof e ? f(t) : e
        }

        function f(t) {
            if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }

        function d(t) {
            return (d = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
                return t.__proto__ || Object.getPrototypeOf(t)
            })(t)
        }
        var y = 0,
            v = new o.default("canvasPool"),
            p = function(t) {
                ! function(t, e) {
                    if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                    t.prototype = Object.create(e && e.prototype, {
                        constructor: {
                            value: t,
                            writable: !0,
                            configurable: !0
                        }
                    }), e && s(t, e)
                }(l, t);
                var e, n, r, o = c(l);

                function l(t) {
                    var e, n = t.style,
                        r = void 0 === n ? {} : n,
                        u = t.props,
                        s = void 0 === u ? {} : u,
                        c = t.name,
                        h = void 0 === c ? "" : c;
                    return function(t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, l), (e = o.call(this, {
                        props: s,
                        name: h,
                        style: r
                    })).type = "ScrollView", e.top = 0, e.touch = new i.default, e.pageHeight = 2e3, e.pageCount = 1, e.canvasMap = {}, e.throttleRepaint = Object(a.throttle)(e.clipRepaint, 16, f(e)), e.throttleImageLoadDone = Object(a.throttle)(e.childImageLoadDoneCbk, 32, f(e)), e.renderTimers = [], e.requestID = null, e
                }
                return e = l, (n = [{
                    key: "repaint",
                    value: function() {
                        var t = this;
                        this.clear(), this.renderBoxes.forEach((function(e) {
                            t.render(e.ctx, e.box)
                        }))
                    }
                }, {
                    key: "clear",
                    value: function() {
                        var t = this;
                        Object.keys(this.canvasMap).forEach((function(e) {
                            var n = t.canvasMap[e];
                            n.context && n.context.clearRect(0, 0, n.canvas.width, n.canvas.height)
                        }))
                    }
                }, {
                    key: "updateRenderPort",
                    value: function(t) {
                        this.renderport = t
                    }
                }, {
                    key: "calPageData",
                    value: function() {
                        this.pageCount = Math.ceil((this.scrollHeight + this.layoutBox.absoluteY) / this.pageHeight);
                        for (var t = 0; t < this.pageCount; t++) {
                            var e = v.get(t);
                            e ? (e.context && e.context.clearRect(0, 0, e.canvas.width, e.canvas.height), e.elements = [], this.canvasMap[t] = e) : (this.canvasMap[t] = {
                                elements: []
                            }, v.set(t, this.canvasMap[t]))
                        }
                    }
                }, {
                    key: "destroySelf",
                    value: function() {
                        this.touch = null, this.isDestroyed = !0, this.throttleRepaint = null, this.renderTimers.forEach((function(t) {
                            clearTimeout(t)
                        })), this.root.off("repaint__done"), this.renderTimers = [], this.canvasMap = {}, this.ctx = null, this.children = null, this.requestID && cancelAnimationFrame(this.requestID), this.root = null
                    }
                }, {
                    key: "clipRepaint",
                    value: function(t) {
                        var e = this;
                        this.isDestroyed || (this.requestID = requestAnimationFrame((function() {
                            t = -t, e.top = t;
                            var n = e.layoutBox,
                                r = n.absoluteY;
                            if (!e.isDestroyed && e.root.state !== a.STATE.CLEAR) {
                                e.ctx.clearRect(n.absoluteX, r, n.width, n.height), e.ctx.fillStyle = e.parent.style.backgroundColor || "#ffffff", e.ctx.fillRect(n.absoluteX, r, n.width, n.height);
                                for (var o = 0; o < e.pageCount; o++) {
                                    var i = e.canvasMap[o].canvas,
                                        l = r + t,
                                        u = r + t + n.height;
                                    if (l < e.pageHeight * (o + 1) && u > e.pageHeight * o) {
                                        var s = r + t - e.pageHeight * o,
                                            c = n.height,
                                            h = r;
                                        s > 0 && e.pageHeight - s < n.height ? c = e.pageHeight - s : s < 0 && (c = s + n.height, h -= s, s = 0), e.ctx.drawImage(i, n.absoluteX, s, n.width, c, n.absoluteX, h, n.width, c)
                                    }
                                }
                            }
                        })))
                    }
                }, {
                    key: "renderChildren",
                    value: function(t) {
                        var e = this,
                            n = t.children,
                            r = this.pageHeight;
                        Object.keys(n).forEach((function(t) {
                            var o = n[t],
                                i = o.layoutBox.originalAbsoluteY,
                                a = Math.floor(i / r),
                                l = a + 1;
                            if (o.layoutBox.absoluteY -= e.pageHeight * a, o.checkNeedRender() && e.canvasMap[a].elements.push({
                                    element: o,
                                    box: o.layoutBox
                                }), i + o.layoutBox.height > r * l) {
                                var u = Object.assign({}, o.layoutBox);
                                u.absoluteY = i - e.pageHeight * l, o.checkNeedRender() && e.canvasMap[l].elements.push({
                                    element: o,
                                    box: u
                                })
                            }
                            e.renderChildren(o)
                        }))
                    }
                }, {
                    key: "insertElements",
                    value: function(t) {
                        var e = this,
                            n = Object(a.createCanvas)(),
                            r = n.getContext("2d");
                        if (n.width = this.renderport.width, n.height = this.pageHeight, r.id = ++y, this.canvasMap[t].canvas = n, this.canvasMap[t].context = r, this.canvasMap[t].elements.forEach((function(t) {
                                t.element.insert(r, t.box)
                            })), t < this.pageCount - 1) {
                            var o = setTimeout((function() {
                                e.insertElements(++t)
                            }), 250);
                            this.renderTimers.push(o)
                        }
                    }
                }, {
                    key: "childImageLoadDoneCbk",
                    value: function(t) {
                        new Date;
                        for (var e = Object.values(this.canvasMap), n = -1, r = 0; r < e.length; r++)
                            if (e[r].elements.find((function(e) {
                                    return e.element === t
                                }))) {
                                n = r;
                                break
                            }
                        if (n > -1) {
                            new Date;
                            var o = this.canvasMap[n],
                                i = o.canvas;
                            o.context.clearRect(0, 0, i.width, i.height), this.canvasMap[n].elements.forEach((function(t) {
                                Object(a.repaintTree)(t.element)
                            }))
                        }
                        this.clipRepaint(-this.top)
                    }
                }, {
                    key: "insertScrollView",
                    value: function(t) {
                        var e = this;
                        this.insert(t), this.root.on("repaint__done", (function() {
                            e.clipRepaint(-e.top)
                        })), this.calPageData(), this.renderChildren(this), this.insertElements(0), this.clipRepaint(-this.top), this.EE.on("image__render__done", (function(t) {
                            e.throttleImageLoadDone(t)
                        })), this.scrollHeight > this.layoutBox.height && (this.touch.setTouchRange(-(this.scrollHeight - this.layoutBox.height), 0, this.clipRepaint.bind(this)), this.on("touchstart", this.touch.startFunc), this.on("touchmove", this.touch.moveFunc), this.on("touchend", this.touch.endFunc))
                    }
                }, {
                    key: "scrollHeight",
                    get: function() {
                        if (!this.children.length) return 0;
                        var t = this.children[this.children.length - 1];
                        return t.layoutBox.top + t.layoutBox.height
                    }
                }]) && u(e.prototype, n), r && u(e, r), l
            }(r.default)
    }, function(t, e, n) {
        n.r(e), n.d(e, "default", (function() {
            return i
        }));
        var r = n(7);

        function o(t, e) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
            }
        }
        var i = function() {
            function t() {
                ! function(t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, t), this.needProcess = !1, this.startFunc = this.touchStartHandler.bind(this), this.endFunc = this.touchEndHandler.bind(this), this.moveFunc = this.touchMoveHandler.bind(this)
            }
            var e, n, i;
            return e = t, (n = [{
                key: "reset",
                value: function() {
                    this.touchTime = new Date, this.touchStartX = 0, this.touchStartY = 0, this.start = 0, this.end = 0, this.move = 0, this.target = 0, this.scroll = null, "undefined" != typeof cancelAnimationFrame && cancelAnimationFrame(this.animate)
                }
            }, {
                key: "enable",
                value: function() {
                    this.reset(), this.needProcess = !0
                }
            }, {
                key: "disable",
                value: function() {
                    this.needProcess = !1
                }
            }, {
                key: "setTouchRange",
                value: function(t, e, n) {
                    this.enable(), this.start = t, this.end = e, 0 === t && 0 === e || (this.scroll = n)
                }
            }, {
                key: "limitTarget",
                value: function(t) {
                    var e = t;
                    return t > this.end ? e = this.end : t < this.start && (e = this.start), e
                }
            }, {
                key: "touchStartHandler",
                value: function(t) {
                    var e = t.touches && t.touches[0] || t.changedTouches && t.changedTouches[0] || t;
                    if (e && e.pageX && e.pageY) {
                        var n = Object(r.getDpr)();
                        this.touchStartX = e.clientX * n, this.touchStartY = e.clientY * n, this.touchTime = new Date, this.isMoving = !0, this.needProcess = !0, this.animate = requestAnimationFrame(this.loop.bind(this))
                    }
                }
            }, {
                key: "touchMoveHandler",
                value: function(t) {
                    if (this.isMoving) {
                        var e = t.touches && t.touches[0] || t.changedTouches && t.changedTouches[0] || t;
                        if (e && e.pageX && e.pageY) {
                            var n = Object(r.getDpr)(),
                                o = e.clientY * n;
                            (this.touchStartY - o > 2 || this.touchStartY - o < -2) && (this.target -= this.touchStartY - o), this.target = this.limitTarget(this.target), this.touchStartY = o
                        }
                    }
                }
            }, {
                key: "touchEndHandler",
                value: function() {
                    this.isMoving = !1;
                    var t = (Date.now() - this.touchTime) / 1e3;
                    t < .9 && (this.target += .6 * (this.target - this.move) / (5 * t), this.target = this.limitTarget(this.target))
                }
            }, {
                key: "loop",
                value: function() {
                    this.needProcess ? (this.isMoving ? this.move !== this.target && (Math.abs(this.target - this.move) > 1 ? this.move += .4 * (this.target - this.move) : this.move = this.target, this.scroll && this.scroll(this.move)) : this.move !== this.target ? (Math.abs(this.target - this.move) > 1 ? this.move += .3 * (this.target - this.move) : this.move = this.target, this.scroll && this.scroll(this.move)) : this.needProcess = !1, this.animate = requestAnimationFrame(this.loop.bind(this))) : "undefined" != typeof cancelAnimationFrame && cancelAnimationFrame(this.animate)
                }
            }]) && o(e.prototype, n), i && o(e, i), t
        }()
    }, function(t, e, n) {
        n.r(e), n.d(e, "default", (function() {
            return f
        }));
        var r = n(2);

        function o(t) {
            return (o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t
            } : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            })(t)
        }

        function i(t, e) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
            }
        }

        function a(t, e) {
            return (a = Object.setPrototypeOf || function(t, e) {
                return t.__proto__ = e, t
            })(t, e)
        }

        function l(t) {
            var e = function() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}))), !0
                } catch (t) {
                    return !1
                }
            }();
            return function() {
                var n, r = c(t);
                if (e) {
                    var o = c(this).constructor;
                    n = Reflect.construct(r, arguments, o)
                } else n = r.apply(this, arguments);
                return u(this, n)
            }
        }

        function u(t, e) {
            return !e || "object" !== o(e) && "function" != typeof e ? s(t) : e
        }

        function s(t) {
            if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }

        function c(t) {
            return (c = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
                return t.__proto__ || Object.getPrototypeOf(t)
            })(t)
        }
        var h = new(n(5).default)("bitMapPool"),
            f = function(t) {
                ! function(t, e) {
                    if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                    t.prototype = Object.create(e && e.prototype, {
                        constructor: {
                            value: t,
                            writable: !0,
                            configurable: !0
                        }
                    }), e && a(t, e)
                }(u, t);
                var e, n, r, o = l(u);

                function u(t) {
                    var e;
                    ! function(t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, u);
                    var n = t.style,
                        r = void 0 === n ? {} : n,
                        i = t.props,
                        a = void 0 === i ? {} : i,
                        l = t.idName,
                        c = void 0 === l ? "" : l,
                        f = t.className,
                        d = void 0 === f ? "" : f,
                        y = t.value,
                        v = void 0 === y ? "" : y,
                        p = t.font,
                        g = void 0 === p ? "" : p;
                    return (e = o.call(this, {
                        props: a,
                        idName: c,
                        className: d,
                        style: r
                    })).type = "BitMapText", e.ctx = null, e.valuesrc = v, e.renderBoxes = [], Object.defineProperty(s(e), "value", {get: function() {
                            return this.valuesrc
                        },
                        set: function(t) {
                            t !== this.valuesrc && (this.valuesrc = t, this.emit("repaint"))
                        },
                        enumerable: !0,
                        configurable: !0
                    }), e.font = h.get(g), e.font || console.error("Please invoke API `registBitMapFont` before using `BitMapText`"), e
                }
                return e = u, (n = [{
                    key: "insert",
                    value: function(t, e) {
                        this.renderBoxes.push({
                            ctx: t,
                            box: e
                        }), this.render(t, e)
                    }
                }, {
                    key: "repaint",
                    value: function() {
                        var t = this;
                        this.renderBoxes.forEach((function(e) {
                            t.render(e.ctx, e.box)
                        }))
                    }
                }, {
                    key: "destroySelf",
                    value: function() {
                        this.root = null
                    }
                }, {
                    key: "render",
                    value: function(t, e) {
                        var n = this;
                        this.font && (this.font.ready ? this.renderText(t, e) : this.font.event.on("text__load__done", (function() {
                            n.isDestroyed || n.renderText(t, e)
                        })))
                    }
                }, {
                    key: "getTextBounds",
                    value: function() {
                        for (var t = this.style.letterSpacing, e = void 0 === t ? 0 : t, n = 0, r = 0, o = this.value.length; r < o; r++) {
                            var i = this.value[r],
                                a = this.font.chars[i];
                            a && (n += a.w, r < o - 1 && (n += e))
                        }
                        return {
                            width: n,
                            height: this.font.lineHeight
                        }
                    }
                }, {
                    key: "renderText",
                    value: function(t, e) {
                        var n = this.getTextBounds(),
                            r = this.font.lineHeight;
                        t.save(), this.renderBorder(t, e);
                        var o = e || this.layoutBox,
                            i = this.style,
                            a = i.width,
                            l = i.height,
                            u = i.lineHeight,
                            s = void 0 === u ? r : u,
                            c = i.textAlign,
                            h = i.verticalAlign,
                            f = o.absoluteX,
                            d = o.absoluteY,
                            y = s / r,
                            v = y * n.width;
                        s < l && ("middle" === h ? d += (l - s) / 2 : "bottom" === h && (d = d + l - s)), a > v && ("center" === c ? f += (a - v) / 2 : "right" === c && (f += a - v));
                        for (var p = 0; p < this.value.length; p++) {
                            var g = this.value[p],
                                m = this.font.chars[g];
                            m && (t.drawImage(this.font.texture, m.x, m.y, m.w, m.h, f + m.offX * y, d + m.offY * y, m.w * y, m.h * y), f += m.w * y)
                        }
                    }
                }]) && i(e.prototype, n), r && i(e, r), u
            }(r.default)
    }]);
});
define("openDataContext/render/dataDemo.js", function(require, module, exports) {
    "use strict";
    var a = require("../../openDataContext/@babel/runtime/helpers/createForOfIteratorHelper"),
        e = {
            data: [],
            test: function() {
                return new Promise((function(a, r) {
                    for (var t = 0; t < 30; t++) e.data.push({
                        frameUrl: "openDataContext/render/frame.png",
                        nickname: "Player-".concat(t + 1),
                        avatarUrl: "openDataContext/render/avatar.png",
                        rankScore: 999 - t + "关"
                    });
                    a(e)
                }))
            },
            load: function(r) {
                return new Promise((function(t, n) {
                    wx.getFriendCloudStorage({
                        keyList: ["maplv"],
                        success: function(n) {
                            e.data = [];
                            var o, c = a(n.data);
                            try {
                                for (c.s(); !(o = c.n()).done;) {
                                    var l = o.value;
                                    if (l.KVDataList.length) {
                                        var i = l.KVDataList[0].value;
                                        e.data.push({
                                            frameUrl: "openDataContext/render/frame".concat(l.openid == r ? "Me" : "", ".png"),
                                            nickname: l.nickname,
                                            avatarUrl: l.avatarUrl,
                                            score: i,
                                            rankScore: i + "关"
                                        }), console.log(8888)
                                    }
                                }
                            } catch (a) {
                                c.e(a)
                            } finally {
                                c.f()
                            }
                            e.data.sort((function(a, e) {
                                return e.score - a.score
                            })), e.data.length > 0 && t(e)
                        },
                        fail: function(a) {
                            console.warn("好友排行拉取失败", a), e.data.length > 0 ? t(e) : n()
                        }
                    })
                }))
            }
        };
    module.exports = e;
});
define("openDataContext/render/style.js", function(require, module, exports) {
    "use strict";
    module.exports = {
        container: {
            width: "100%",
            height: "100%",
            backgroundColor: "#FAFAF3",
            flexDirection: "column",
            justifyContent: "space-between"
        },
        list: {
            width: "100%",
            height: "100%",
            marginLeft: 0,
            marginTop: 0
        },
        listItem: {
            width: "100%",
            height: 144,
            marginBottom: 18,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative"
        },
        listItemFrame: {
            width: "100%",
            height: "100%",
            flexDirection: "row",
            justifyContent: "space-between"
        },
        listItemNum: {
            top: 5,
            width: 88,
            height: "100%",
            fontSize: 50,
            fontWeight: "bold",
            lineHeight: 144,
            color: "#6a4a37",
            textAlign: "center"
        },
        rankArea: {
            width: 140,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "relative"
        },
        jiangBei: {
            top: 5,
            left: 20,
            width: 75,
            height: 88
        },
        listItemCircle: {
            marginLeft: 100,
            marginTop: 13,
            width: 118,
            height: 118,
            borderRadius: 59
        },
        listHeadImg: {
            marginLeft: -20,
            borderRadius: 59,
            width: 118,
            height: 118
        },
        listItemName: {
            top: 5,
            marginLeft: -10,
            width: 250,
            fontSize: 35,
            fontWeight: "bold",
            color: "#6a4a37",
            lineHeight: 144,
            textAlign: "left"
        },
        listItemScore: {
            marginTop: 5,
            width: 160,
            fontSize: 35,
            fontWeight: "bold",
            color: "#6a4a37",
            lineHeight: 144,
            textAlign: "center"
        }
    };
});
define("openDataContext/render/template.js", function(require, module, exports) {
    "use strict";
    var e = require("./dataDemo");

    function t(e) {
        var t = '<view class="container" id="main"> <scrollview class="list"> ',
            n = e.data;
        if (n && n.length > 0) {
            for (var a, c = -1, i = n.length - 1; c < i;) {
                (a = n[c += 1]).isSelf && c;
                var s = null,
                    r = (c + 1).toString();
                c < 3 && (s = c.toString(), r = "");
                var l = null != a.rankScore ? a.rankScore + "" : "未上榜";
                s && '<image class="jiangBei" src="openDataContext/render/'.concat(s, '.png"></image>');
                t += '\n<view class="listItem">\n  <image class="listItemFrame" src="'.concat(a.frameUrl, '">\n    ').concat(s ? '<image class="jiangBei" src="openDataContext/render/'.concat(s, '.png"></image>') : "", "\n    ").concat(r ? '<text class="listItemNum" value="'.concat(r, '"></text>') : "", '\n    <view class="listItemCircle">\n      <image class="listHeadImg" src="').concat(a.avatarUrl, '"></image>\n    </view>\n    <text class="listItemName" value="').concat(a.nickname, '"></text>\n    <text class="listItemScore" value="').concat(l, '"></text>\n  </image>\n</view>\n')
            }
            t += " </scrollview>"
        } else t += " </scrollview>";
        return t += "</view>"
    }
    module.exports = {
        load: function(n) {
            return new Promise((function(a, c) {
                e.load(n).then((function(e) {
                    a(t(e))
                })).catch(c)
            }))
        },
        test: function() {
            return new Promise((function(n, a) {
                e.test().then((function(e) {
                    n(t(e))
                })).catch(a)
            }))
        }
    };
});
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
define("openDataContext/index.js", function(require, module, exports) {
    "use strict";
    var e = require("./render/style"),
        t = require("./render/template"),
        o = require("./engine").default,
        a = GameGlobal.wx || GameGlobal.tt || GameGlobal.swan,
        n = a.getSharedCanvas().getContext("2d");

    function l(t) {
        o.clear(), o.init(t, e), o.layout(n)
    }
    a.onMessage((function(e) {
        "engine" === e.type && "viewport" === e.event ? function(e) {
            o.updateViewPort({
                x: e.x,
                y: e.y,
                width: e.width,
                height: e.height
            })
        }(e) : e.event.startsWith("LOAD_FRIEND_RANK") ? t.load(e.event.split(":")[1]).then((function(e) {
            l(e)
        })) : "uploadPkScore" === e.event && (console.log("[uploadPkScore]", e.data), a.setUserCloudStorage({
            KVDataList: [{
                key: "pk",
                value: e.data
            }],
            success: function() {
                console.log("[uploadPkScore] success")
            },
            fail: function() {
                console.log("[uploadPkScore] fail")
            }
        }))
    }));
});
require("openDataContext/index.js");