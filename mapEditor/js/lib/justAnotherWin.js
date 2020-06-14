"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define('justAnotherWin', factory) : (global = global || self, global.justAnotherWin = factory());
})(void 0, function () {
  'use strict';

  function binder(obj, methods, callbacks) {
    var callOriginal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var callOriginalFirst = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var meths = [methods].flat();
    var cbs = [callbacks].flat();

    var _iterator = _createForOfIteratorHelper(meths),
        _step;

    try {
      var _loop = function _loop() {
        var meth = _step.value;
        var og = obj[meth];

        obj[meth] = function () {
          var args = [].slice.apply(arguments);

          if (callOriginal && callOriginalFirst) {
            og.call.apply(og, [obj].concat(_toConsumableArray(args)));
            cbs.forEach(function (cb) {
              return cb.apply(void 0, _toConsumableArray(args));
            });
          } else {
            cbs.forEach(function (cb) {
              return cb.apply(void 0, _toConsumableArray(args));
            });
            if (callOriginal) og.call.apply(og, [obj].concat(_toConsumableArray(args)));
          }
        };
      };

      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _loop();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }


  var Emitter = function (_EventTarget) {
    _inherits(Emitter, _EventTarget);

    var _super = _createSuper(Emitter);

    function Emitter() {
      var _this;

      _classCallCheck(this, Emitter);

      _this = _super.call(this); 

      _this.listeners = {
        '*': [] 

      };
      return _this;
    }

    _createClass(Emitter, [{
      key: "on",
      value: function on(e, cb) {
        var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        !this.listeners[e] ? this.listeners[e] = [cb] : this.listeners[e].push(cb); 

        once ? this.addEventListener(e, cb, {
          once: true
        }) : this.addEventListener(e, cb);
      }
    }, {
      key: "off",
      value: function off(e) {
        var _this2 = this;

        var Fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (this.listeners[e]) {
          var removeListener = function removeListener(target) {
            _this2.removeEventListener(e, target);
          }; 


          var filter = function filter() {
            _this2.listeners[e] = _this2.listeners[e].filter(function (val) {
              return val === Fn ? removeListener(val) : val;
            }); 

            if (_this2.listeners[e].length === 0) {
              e !== '*' ? delete _this2.listeners[e] : null;
            }
          }; 


          var iterate = function iterate() {
            var len = _this2.listeners[e].length;

            while (len--) {
              removeListener(_this2.listeners[e][len]);
            } 


            e !== '*' ? delete _this2.listeners[e] : _this2.listeners[e] = [];
          };

          Fn && typeof Fn === 'function' ? filter() : iterate();
        }
      }
    }, {
      key: "emit",
      value: function emit(e, d) {
        if (this.listeners['*'].length > 0) {
          this.dispatchEvent(new CustomEvent('*', {
            detail: d
          }));
        }

        this.dispatchEvent(new CustomEvent(e, {
          detail: d
        }));
      }
    }, {
      key: "once",
      value: function once(e, cb) {
        this.on(e, cb, true);
      }
    }]);

    return Emitter;
  }( _wrapNativeSuper(EventTarget));

  function isElement(element) {
    return element instanceof Element || element instanceof HTMLDocument;
  }

  var DomBuilder = function () {
    function DomBuilder() {
      _classCallCheck(this, DomBuilder);

      _defineProperty(this, "element", null);
    }

    _createClass(DomBuilder, [{
      key: "createNode",
      value: function createNode(tag) {
        var _this3 = this;

        var _class = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var inner = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var listener = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
        var customAttr = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
        var inlineStyle = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
        this.element = document.createElement(tag);

        if (_class) {
          this.addClasses(_class);
        }

        if (id) {
          this.element.id = id;
        }

        if (inner) {
          inner = [inner].flat();
          inner.forEach(function (content) {
            switch (_typeof(content)) {
              case "string":
                _this3.element.innerText = content;
                break;

              case "number":
                _this3.element.innerText = content.toString();
                break;

              case "object":
                if (isElement(content)) {
                  _this3.element.appendChild(content);
                }

                break;
            }
          });
        }

        if (listener) {
          if (Array.isArray(listener)) {
            listener.forEach(function (l) {
              _this3.createListener(l);
            });
          } else {
            this.createListener(listener);
          }
        }

        if (inlineStyle) {
          this.addInlineStyle(customAttr);
        }

        if (customAttr) {
          this.addCustomAttr(customAttr);
        }

        return this;
      }
    }, {
      key: "addClasses",
      value: function addClasses(_class) {
        var _this4 = this;

        var node = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        _class = [_class].flat();

        _class.forEach(function (c) {
          var _el$classList;

          var el = node ? node : _this4.element;

          (_el$classList = el.classList).add.apply(_el$classList, _toConsumableArray(c.split(" ")));
        });

        return this;
      }
    }, {
      key: "addStyle",
      value: function addStyle(styles) {
        var _this5 = this;

        var node = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        Object.keys(styles).forEach(function (key) {
          var el = node ? node : _this5.element;
          el.style[key] = styles[key];
        });
        return this;
      }
    }, {
      key: "addCustomAttr",
      value: function addCustomAttr(customAttr) {
        var _this6 = this;

        var node = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        customAttr = [customAttr].flat();
        customAttr.forEach(function (attr) {
          var el = node ? node : _this6.element;
          el.setAttribute(attr.type, attr.val);
        });
        return this;
      }
    }, {
      key: "createListener",
      value: function createListener(l) {
        var node = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        if (!l.hasOwnProperty("args")) l.args = [];
        var el = node ? node : this.element;
        el.addEventListener(l.type, function (e) {
          e.preventDefault();

          if (l.hasOwnProperty("event") && !l.event) {
            l.callback.apply(l, _toConsumableArray(l.args));
          } else {
            l.callback.apply(l, [e].concat(_toConsumableArray(l.args)));
          }

          return false;
        });
        return this;
      }
    }, {
      key: "fill",
      value: function fill(inner) {
        var node = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var el = node ? node : this.element;

        if (isElement(inner)) {
          el.appendChild(inner);
        } else {
          var container = document.createElement("p");
          container.innerHTML = inner;
          el.appendChild(container);
        }

        return this;
      }
    }, {
      key: "done",
      value: function done() {
        return this.element;
      }
    }, {
      key: "enclose",
      value: function enclose(_nodes) {
        var _this7 = this;

        var _class = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        var tag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "div";
        var listener = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var customAttrIn = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
        this.element = document.createElement(tag);
        var nodes = [_nodes].flat();

        var _iterator2 = _createForOfIteratorHelper(nodes),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var node = _step2.value;

            if (isElement(node)) {
              this.element.appendChild(node);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        if (customAttrIn) {
          nodes.forEach(function (node) {
            _this7.addCustomAttr(customAttrIn, node);
          });
        }

        if (_class) this.addClasses(_class);

        if (listener) {
          var listeners = [listener].flat();
          listeners.forEach(function (l) {
            _this7.createListener(l);
          });
        }

        return this;
      }
    }]);

    return DomBuilder;
  }();

  var dob = new DomBuilder();

  var _MaximizedPreview = function () {
    function _MaximizedPreview() {
      _classCallCheck(this, _MaximizedPreview);

      this.previewingSide = null;
      this.previewEl = null;
      this.previewStyle = {
        position: "absolute",
        boxShadow: "inset 0px 0px 0px 5px darkgrey"
      };
      this.keyFrames = {
        top: [{
          width: window.innerWidth / 1.5 + "px",
          height: window.innerHeight / 1.5 + "px",
          right: window.innerWidth / 2 - window.innerWidth / 1.5 / 2 + "px"
        }, {
          right: 0,
          width: window.innerWidth + "px",
          height: window.innerHeight + "px"
        }],
        side: [{
          width: window.innerWidth / 3 + "px",
          height: window.innerWidth / 3 + "px",
          top: window.innerHeight / 2 - window.innerWidth / 3 / 2 + "px"
        }, {
          top: 0,
          width: window.innerWidth / 2 + "px",
          height: window.innerHeight + "px"
        }]
      };
      this.timing = {
        duration: 100,
        fill: "forwards"
      };
    }

    _createClass(_MaximizedPreview, [{
      key: "createPreviewNode",
      value: function createPreviewNode() {
        return dob.createNode("div", "win2-max-preview").addStyle(this.previewStyle).done();
      }
    }, {
      key: "preview",
      value: function preview(side, zIndex) {
        if (!side) {
          this.removePreview();
          return;
        }

        if (side === this.previewingSide) return;
        if (this.previewEl) this.removePreview();
        this.previewingSide = side;
        this.previewEl = this.createPreviewNode();
        this["preview".concat(side.charAt(0).toUpperCase() + side.slice(1))](zIndex);
      }
    }, {
      key: "previewLeft",
      value: function previewLeft(zIndex) {
        this.previewEl.style.left = 0;
        this.previewEl.style.zIndex = zIndex - 1;
        document.body.appendChild(this.previewEl);
        this.previewEl.animate(this.keyFrames.side, this.timing);
      }
    }, {
      key: "previewRight",
      value: function previewRight(zIndex) {
        this.previewEl.style.right = 0;
        this.previewEl.style.zIndex = zIndex - 1;
        document.body.appendChild(this.previewEl);
        this.previewEl.animate(this.keyFrames.side, this.timing);
      }
    }, {
      key: "previewTop",
      value: function previewTop(zIndex) {
        this.previewEl.style.top = 0;
        this.previewEl.style.zIndex = zIndex - 1;
        document.body.appendChild(this.previewEl);
        this.previewEl.animate(this.keyFrames.top, this.timing);
      }
    }, {
      key: "removePreview",
      value: function removePreview() {
        if (!this.previewEl) return;
        this.previewEl.remove();
        this.previewEl = null;
        this.previewingSide = null;
      }
    }]);

    return _MaximizedPreview;
  }();

  var Mouse = function () {
    function Mouse() {
      _classCallCheck(this, Mouse);

      this.lastPos = null;
    }

    _createClass(Mouse, [{
      key: "getCursorPos",
      value: function getCursorPos() {
        var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var evt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        if (!evt || !el) return this.lastPos;
        var rect = el.getBoundingClientRect();
        this.lastPos = {
          x: Math.floor((evt.clientX - rect.left) / (rect.right - rect.left) * el.offsetWidth),
          y: Math.floor((evt.clientY - rect.top) / (rect.bottom - rect.top) * el.offsetHeight)
        };
        return this.lastPos;
      }
    }]);

    return Mouse;
  }();

  var dob$1 = new DomBuilder();

  var windowEls = function windowEls(listeners, options) {
    var entete = null;

    if (options.enteteIcon) {
      entete = dob$1.enclose([dob$1.enclose(options.enteteIcon.cloneNode(true), "win2-icon-container").addStyle({
        display: "inline",
        position: "relative",
        top: "2px",
        left: "2px"
      }).done(), dob$1.createNode("p", null, null, options.entete.toString()).addStyle({
        margin: "0 5px 0 7px",
        display: "inline"
      }).done()], "win2-entete-container").done();
    } else {
      entete = dob$1.createNode("p", null, null, options.entete.toString()).addStyle({
        margin: "0 5px 0 7px",
        display: "inline"
      }).done();
    }

    return new function () {
      var _this8 = this;

      this.borderTop = function () {
        return dob$1.createNode("div", "win2-border-top win2-border", null, null, listeners.borders, {
          type: "data-resize",
          val: "top"
        }).addStyle({
          top: 0,
          left: options.cornerSize,
          width: "calc(100% - ".concat(options.cornerSize, " * 2)"),
          height: options.borderWidth,
          cursor: "ns-resize",
          position: "absolute",
          backgroundColor: "lightgrey"
        }).done();
      }();

      this.cornerTopRight = function () {
        return dob$1.enclose([dob$1.createNode("div", "win2-corner-top-right win2-corner-hor").addStyle({
          width: options.cornerSize,
          height: options.borderWidth,
          top: 0,
          right: 0,
          position: "absolute",
          cursor: "nesw-resize",
          backgroundColor: "lightgrey"
        }).done(), dob$1.createNode("div", "win2-corner-top-right win2-corner-ver").addStyle({
          width: options.borderWidth,
          height: options.cornerSize,
          top: 0,
          right: 0,
          position: "absolute",
          cursor: "nesw-resize",
          backgroundColor: "lightgrey"
        }).done()], null, "div", listeners.borders, {
          type: "data-resize",
          val: "top-right"
        }).done();
      }();

      this.borderRight = function () {
        return dob$1.createNode("div", "win2-border-right win2-border", null, null, listeners.borders, {
          type: "data-resize",
          val: "right"
        }).addStyle({
          top: options.cornerSize,
          right: 0,
          width: options.borderWidth,
          height: "calc(100% - ".concat(options.cornerSize, " * 2)"),
          cursor: "ew-resize",
          position: "absolute",
          backgroundColor: "lightgrey"
        }).done();
      }();

      this.cornerTopLeft = function () {
        return dob$1.enclose([dob$1.createNode("div", "win2-corner-top-left win2-corner-hor").addStyle({
          width: options.cornerSize,
          height: options.borderWidth,
          top: 0,
          left: 0,
          position: "absolute",
          cursor: "nwse-resize",
          backgroundColor: "lightgrey"
        }).done(), dob$1.createNode("div", "win2-corner-top-left win2-corner-ver").addStyle({
          width: options.borderWidth,
          height: options.cornerSize,
          top: 0,
          left: 0,
          position: "absolute",
          cursor: "nwse-resize",
          backgroundColor: "lightgrey"
        }).done()], null, "div", listeners.borders, {
          type: "data-resize",
          val: "top-left"
        }).done();
      }();

      this.borderBottom = function () {
        return dob$1.createNode("div", "win2-border-bottom win2-border", null, null, listeners.borders, {
          type: "data-resize",
          val: "bottom"
        }).addStyle({
          bottom: 0,
          left: options.cornerSize,
          width: "calc(100% - ".concat(options.cornerSize, " * 2)"),
          height: options.borderWidth,
          cursor: "ns-resize",
          position: "absolute",
          backgroundColor: "lightgrey"
        }).done();
      }();

      this.cornerBottomRight = function () {
        return dob$1.enclose([dob$1.createNode("div", "win2-corner-bottom-right win2-corner-hor").addStyle({
          width: options.cornerSize,
          height: options.borderWidth,
          bottom: 0,
          right: 0,
          position: "absolute",
          cursor: "nwse-resize",
          backgroundColor: "lightgrey"
        }).done(), dob$1.createNode("div", "win2-corner-bottom-right win2-corner-ver").addStyle({
          width: options.borderWidth,
          height: options.cornerSize,
          bottom: 0,
          right: 0,
          position: "absolute",
          cursor: "nwse-resize",
          backgroundColor: "lightgrey"
        }).done()], null, "div", listeners.borders, {
          type: "data-resize",
          val: "bottom-right"
        }).done();
      }();

      this.borderLeft = function () {
        return dob$1.createNode("div", "win2-border-left win2-border", null, null, listeners.borders, {
          type: "data-resize",
          val: "left"
        }).addStyle({
          top: options.cornerSize,
          left: 0,
          width: options.borderWidth,
          height: "calc(100% - ".concat(options.cornerSize, " * 2)"),
          cursor: "ew-resize",
          position: "absolute",
          backgroundColor: "lightgrey"
        }).done();
      }();

      this.cornerBottomLeft = function () {
        return dob$1.enclose([dob$1.createNode("div", "win2-corner-bottom-left win2-corner-hor").addStyle({
          width: options.cornerSize,
          height: options.borderWidth,
          bottom: 0,
          left: 0,
          position: "absolute",
          cursor: "nesw-resize",
          backgroundColor: "lightgrey"
        }).done(), dob$1.createNode("div", "win2-corner-bottom-left win2-corner-ver").addStyle({
          width: options.borderWidth,
          height: options.cornerSize,
          bottom: 0,
          left: 0,
          position: "absolute",
          cursor: "nesw-resize",
          backgroundColor: "lightgrey"
        }).done()], null, "div", listeners.borders, {
          type: "data-resize",
          val: "bottom-left"
        }).done();
      }();

      this.escapeBtn = function () {
        return dob$1.createNode("button", "win2-button win2-escape-btn", null, options.escapeBtnContent, listeners.escapeBtnListener).done();
      }();

      this.minimizeBtn = function () {
        return dob$1.createNode("button", "win2-button win2-minimize-btn", null, options.minimizeBtnContent, listeners.minimizeBtnListener).done();
      }();

      this.maximizeBtn = function () {
        return dob$1.createNode("button", "win2-button win2-maximize-btn", null, options.maximizeBtnContent, listeners.maximizeBtnListener).done();
      }();

      this.enteteContainer = function () {
        return dob$1.createNode("div", "win2-entete", null, entete).addStyle({
          cursor: "default"
        }).done();
      }();

      this.body = function () {
        return dob$1.createNode("div", "win2-body", null).addStyle({
          overflow: "hidden",
          height: "calc(100% - ".concat(options.headerHeight === "autopx" ? "0px" : options.headerHeight, ")"),
          backgroundColor: "Bisque"
        }).done();
      }();

      this.header = function () {
        return dob$1.createNode("div", "win2-header", null, [_this8.enteteContainer, dob$1.enclose([_this8.minimizeBtn, _this8.maximizeBtn, _this8.escapeBtn], "win2-btn-container").done()], [listeners.headerMouseDownListener, listeners.headerDblClickListener]).addStyle({
          display: "flex",
          justifyContent: "space-between",
          height: options.headerHeight,
          backgroundColor: "BurlyWood"
        }).done();
      }();

      this.windowContent = function () {
        return dob$1.createNode("div", "win2-content", null, [_this8.header, _this8.body]).addStyle({
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          left: options.borderWidth,
          top: options.borderWidth,
          width: "calc(100% - ".concat(options.borderWidth, " * 2)"),
          height: "calc(100% - ".concat(options.borderWidth, " * 2)")
        }).done();
      }();

      this.windowEl = function () {
        return dob$1.createNode("div", "win2-container", null, [_this8.windowContent, _this8.borderTop, _this8.cornerTopRight, _this8.borderRight, _this8.cornerBottomRight, _this8.borderBottom, _this8.cornerBottomLeft, _this8.borderLeft, _this8.cornerTopLeft], listeners.containerMouseDownListener).addStyle({
          position: "absolute"
        }).done();
      }();
    }();
  };

  var _mouse = new Mouse();

  var _Window = function () {
    function _Window() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      _classCallCheck(this, _Window);

      this.postMinimizedHeight = null;
      this.selected = false;
      this.borderSelected = null;
      this.resizeStart = null;
      this.mousePosOnBorder = null;
      this.windowClickPos = {
        x: 0,
        y: 0
      };
      this.winEl = null;
      this.id = "_" + Math.random().toString(36).substr(2, 16);
      this.minimized = false;
      this.maximized = false;
      this.elements = {};
      this.preResizeWidth = null;
      this.preResizeHeight = null;
      this.preMaximizedWidth = null;
      this.preMaximizedHeight = null;
      this.maximizedData = null;
      this.maximizeSides = {
        left: null,
        right: null,
        top: null
      };
      this.disablePreview = false;
      this.content = content;
      this.emitter = new Emitter(); 

      this.name = (options === null || options === void 0 ? void 0 : options.name) || "default";
      this.borderWidth = (options === null || options === void 0 ? void 0 : options.borderWidth) || 3;
      this.minWidth = (options === null || options === void 0 ? void 0 : options.minWidth) ? (options === null || options === void 0 ? void 0 : options.minWidth) + this.borderWidth * 2 : 100 + this.borderWidth * 2;
      this.headerHeight = (options === null || options === void 0 ? void 0 : options.headerHeight) ? (options === null || options === void 0 ? void 0 : options.headerHeight) + this.borderWidth : "auto";
      this.cornerSize = (options === null || options === void 0 ? void 0 : options.cornerSize) || 16;
      this.enableGesture = (options === null || options === void 0 ? void 0 : options.gesture) === true;
      this.entete = (options === null || options === void 0 ? void 0 : options.entete) || "";
      this.enteteIcon = (options === null || options === void 0 ? void 0 : options.enteteIcon) || false;
      this.width = (options === null || options === void 0 ? void 0 : options.width) || 200;
      this.height = (options === null || options === void 0 ? void 0 : options.height) || 200;
      this.x = !isNaN(options === null || options === void 0 ? void 0 : options.x) ? options.x : 200;
      this.y = !isNaN(options === null || options === void 0 ? void 0 : options.y) ? options.y : 200;
      this.maximizeTriggerArea = (options === null || options === void 0 ? void 0 : options.maximizeTriggerArea) || 12;
      this.nextMaximizeDelay = (options === null || options === void 0 ? void 0 : options.nextMaximizeDelay) || 500;
      this.minimizeBtnContent = (options === null || options === void 0 ? void 0 : options.minimizeBtnContent) || "";
      this.maximizeBtnContent = (options === null || options === void 0 ? void 0 : options.maximizeBtnContent) || "";
      this.escapeBtnContent = (options === null || options === void 0 ? void 0 : options.escapeBtnContent) || "";
    }

    _createClass(_Window, [{
      key: "build",
      value: function build() {
        var listeners = {
          escapeBtnListener: {
            type: "click",
            callback: this.removeEl.bind(this)
          },
          minimizeBtnListener: {
            type: "click",
            callback: this.minimize.bind(this)
          },
          maximizeBtnListener: {
            type: "click",
            callback: this.maximizeTrigger.bind(this)
          },
          headerMouseDownListener: {
            type: "mousedown",
            callback: this.focus.bind(this)
          },
          headerDblClickListener: {
            type: "dblclick",
            callback: this.maximizeTrigger.bind(this)
          },
          containerMouseDownListener: {
            type: "mousedown",
            callback: this.focus.bind(this, null)
          },
          borders: {
            type: "mousedown",
            callback: this.borderSelect.bind(this)
          }
        };
        var options = {
          borderWidth: "".concat(this.borderWidth, "px"),
          cornerSize: "".concat(this.cornerSize, "px"),
          headerHeight: "".concat(this.headerHeight, "px"),
          minimizeBtnContent: this.minimizeBtnContent,
          maximizeBtnContent: this.maximizeBtnContent,
          escapeBtnContent: this.escapeBtnContent,
          entete: this.entete,
          enteteIcon: this.enteteIcon
        };
        return windowEls(listeners, options);
      }
    }, {
      key: "create",
      value: function create() {
        this.elements = this.build();
        if (this.content) this.elements.body.appendChild(this.content);
        this.winEl = this.elements.windowEl;
        this.updatePosAndShape();
        document.body.appendChild(this.winEl);

        if (this.headerHeight === "auto") {
          this.headerHeight = this.elements.header.offsetHeight + this.borderWidth;
        }
      }
    }, {
      key: "minimize",
      value: function minimize() {
        this.minimized = !this.minimized;
        this.maximized = false;

        if (this.minimized) {
          this.postMinimizedHeight = this.height;
          this.height = this.headerHeight + this.borderWidth;
        } else {
          this.height = this.postMinimizedHeight;
        }

        this.updatePosAndShape();
        this.emitter.emit("minimizeToggle", this.minimized);
      }
    }, {
      key: "checkMaximize",
      value: function checkMaximize(evt) {
        this.resetMaximizedSides();
        if (this.disablePreview || !this.enableGesture) return;

        if (evt.clientX < this.maximizeTriggerArea) {
          this.maximizeSides.left = true;
        } else if (evt.clientX > window.innerWidth - this.maximizeTriggerArea) {
          this.maximizeSides.right = true;
        } else if (evt.clientY < this.maximizeTriggerArea) {
          this.maximizeSides.top = true;
        }
      }
    }, {
      key: "maximizeTrigger",
      value: function maximizeTrigger(evt) {
        if (evt.target.isSameNode(this.elements.minimizeBtn)) return;

        if (this.maximizeSides.top) {
          this.resetWin();
          return;
        }

        this.maximizeSides.top = true;
        this.maximize();
      }
    }, {
      key: "resetWin",
      value: function resetWin() {
        this.resetMaximizedSides();
        this.minimized = false;
        this.maximized = false;
        this.width = window.innerWidth / 2;
        this.height = window.innerHeight / 2;
        this.x = window.innerWidth / 4;
        this.y = window.innerHeight / 4;
        this.updatePosAndShape();
      }
    }, {
      key: "maximize",
      value: function maximize() {
        this.minimized = false;
        this.preMaximizedWidth = this.width;
        this.preMaximizedHeight = this.height;
        var maxProps = {
          x: null,
          y: null,
          width: null,
          height: null
        };

        for (var key in this.maximizeSides) {
          if (this.maximizeSides[key]) {
            switch (key) {
              case "left":
                maxProps.x = 0;
                maxProps.y = 0;
                maxProps.width = window.innerWidth / 2;
                maxProps.height = window.innerHeight;
                break;

              case "right":
                maxProps.x = window.innerWidth / 2;
                maxProps.y = 0;
                maxProps.width = window.innerWidth / 2;
                maxProps.height = window.innerHeight;
                break;

              case "top":
                maxProps.x = 0;
                maxProps.y = 0;
                maxProps.width = window.innerWidth;
                maxProps.height = window.innerHeight;
                break;
            }
          }
        }

        this.x = maxProps.x;
        this.y = maxProps.y;
        this.width = maxProps.width;
        this.height = maxProps.height;
        this.maximized = true;
        this.maximizedData = maxProps;
        this.emitter.emit("maximizeToggle", maxProps);
        this.updatePosAndShape();
      }
    }, {
      key: "removeEl",
      value: function removeEl() {
        var evt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        this.winEl.remove();
        this.emitter.emit("remove", evt);
      }
    }, {
      key: "focus",
      value: function focus() {
        var evt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        if (!evt) return;
        this.selected = true;
        this.windowClickPos = _mouse.getCursorPos(this.winEl, evt);
        this.emitter.emit("focus", evt);
      }
    }, {
      key: "release",
      value: function release(evt) {
        this.selected = false;
        if (evt.target.tagName.toUpperCase() === "BUTTON") return;
        if (Object.values(this.maximizeSides).some(function (el) {
          return el;
        })) this.maximize();
        this.emitter.emit("release", evt);
      }
    }, {
      key: "drag",
      value: function drag(evt) {
        var _this9 = this;

        if (!this.selected || !this.windowClickPos) return;

        if (this.maximized && !this.minimized) {
          this.width = this.preMaximizedWidth;
          this.height = this.preMaximizedHeight;
          this.windowClickPos.x *= this.preMaximizedWidth / this.maximizedData.width; 

          if (this.windowClickPos.x <= this.borderWidth) {
            this.windowClickPos.x = this.borderWidth + 1;
          } else if (this.windowClickPos.x >= this.width - this.borderWidth) {
            this.windowClickPos.x = this.width - this.borderWidth - 1;
          }

          this.disablePreview = true;
          setTimeout(function () {
            _this9.disablePreview = false;
          }, this.nextMaximizeDelay);
          this.maximized = false;
          this.maximizedData = null;
        }

        this.x = evt.clientX - this.windowClickPos.x;
        this.y = evt.clientY - this.windowClickPos.y;
        this.checkMaximize(evt);
        this.updatePosAndShape();
        this.emitter.emit("drag", evt);
      }
    }, {
      key: "updatePosAndShape",
      value: function updatePosAndShape() {
        this.winEl.style.left = "".concat(this.x, "px");
        this.winEl.style.top = "".concat(this.y, "px");
        this.winEl.style.width = "".concat(this.width, "px");
        this.winEl.style.height = "".concat(this.height, "px");
      }
    }, {
      key: "borderSelect",
      value: function borderSelect(evt) {
        this.resizeStart = {
          x: evt.clientX,
          y: evt.clientY
        };
        this.mousePosOnBorder = _mouse.getCursorPos(evt.target, evt);
        this.preResizeWidth = this.width;
        this.preResizeHeight = this.height;
        this.borderSelected = evt.target.getAttribute("data-resize");
        this.emitter.emit("borderSelect", evt);
      }
    }, {
      key: "borderLeave",
      value: function borderLeave(evt) {
        this.resizeStart = null;
        this.borderSelected = null;
        this.emitter.emit("borderRelease", evt);
      }
    }, {
      key: "resize",
      value: function resize(evt) {
        var _this10 = this;

        var dirObj = {
          right: function right() {
            _this10.width = evt.clientX - _this10.resizeStart.x + _this10.preResizeWidth;
          },
          left: function left() {
            _this10.x = evt.clientX - _this10.mousePosOnBorder.x;
            _this10.width = _this10.resizeStart.x - evt.clientX + _this10.preResizeWidth;

            if (_this10.width - _this10.minWidth <= 0) {
              _this10.x += _this10.width - _this10.minWidth;
            }
          },
          bottom: function bottom() {
            _this10.height = evt.clientY - _this10.resizeStart.y + _this10.preResizeHeight;
          },
          top: function top() {
            _this10.y = evt.clientY - _this10.mousePosOnBorder.y;
            _this10.height = _this10.resizeStart.y - evt.clientY + _this10.preResizeHeight;

            if (_this10.height - _this10.headerHeight <= _this10.borderWidth) {
              _this10.y += _this10.height - _this10.headerHeight - _this10.borderWidth;
            }
          }
        };
        var dirStrings = this.borderSelected.split("-");

        if (this.minimized) {
          dirStrings = dirStrings.filter(function (el) {
            return el !== "top" && el !== "bottom";
          });
        }

        dirStrings.forEach(function (direction) {
          return dirObj[direction]();
        });

        if (this.width - this.minWidth <= 0) {
          this.width = this.minWidth;
        }

        if (this.height - this.headerHeight <= this.borderWidth) {
          this.height = this.headerHeight + this.borderWidth;
        }

        this.maximized = false;
        this.emitter.emit("resize", dirStrings);
        this.updatePosAndShape();
      }
    }, {
      key: "isBorderSelected",
      value: function isBorderSelected() {
        return this.borderSelected;
      }
    }, {
      key: "getID",
      value: function getID() {
        return this.id;
      }
    }, {
      key: "isSelected",
      value: function isSelected() {
        return this.selected;
      }
    }, {
      key: "isMinimized",
      value: function isMinimized() {
        return this.minimized;
      }
    }, {
      key: "getEl",
      value: function getEl() {
        return this.winEl;
      }
    }, {
      key: "getMaximizeSide",
      value: function getMaximizeSide() {
        var _this11 = this;

        return Object.keys(this.maximizeSides).find(function (key) {
          return _this11.maximizeSides[key];
        });
      }
    }, {
      key: "resetMaximizedSides",
      value: function resetMaximizedSides() {
        for (var key in this.maximizeSides) {
          this.maximizeSides[key] = false;
        }
      }
    }, {
      key: "getZindex",
      value: function getZindex() {
        return this.winEl.style.zIndex;
      }
    }, {
      key: "setZindex",
      value: function setZindex(zIndex) {
        this.winEl.style.zIndex = zIndex;
      }
    }, {
      key: "getCoord",
      value: function getCoord() {
        return {
          x: this.x,
          y: this.y
        };
      }
    }, {
      key: "getWidth",
      value: function getWidth() {
        return this.width;
      }
    }, {
      key: "getHeight",
      value: function getHeight() {
        return this.height;
      }
    }]);

    return _Window;
  }();

  var _WindowList = function () {
    function _WindowList() {
      _classCallCheck(this, _WindowList);

      this.list = [];
      this.focusedID = null;
      this.startingZI = 5;
      this.maxPreview = new _MaximizedPreview();
      document.addEventListener("mousemove", this.targetDrag.bind(this));
      document.addEventListener("mouseup", this.deselect.bind(this));
      this.emitter = new Emitter();
      this.eventTypes = ["minimizeToggle", "maximizeToggle", "remove", "focus", "drag", "release", "borderSelect", "borderRelease", "resize"];
    }

    _createClass(_WindowList, [{
      key: "getWinByID",
      value: function getWinByID(id) {
        return this.list.find(function (el) {
          return el.getID() === id;
        });
      }
    }, {
      key: "getAllExceptID",
      value: function getAllExceptID(id) {
        return this.list.filter(function (el) {
          return el.getID() !== id;
        });
      }
    }, {
      key: "getSelectedWin",
      value: function getSelectedWin() {
        return this.list.find(function (el) {
          return el.isSelected();
        });
      }
    }, {
      key: "getBorderSelectedWin",
      value: function getBorderSelectedWin() {
        return this.list.find(function (el) {
          return el.isBorderSelected();
        });
      }
    }, {
      key: "getWinByZindex",
      value: function getWinByZindex(zIndex) {
        return this.list.find(function (el) {
          return Number(el.getEl().style.zIndex) === zIndex;
        });
      }
    }, {
      key: "getFrontWin",
      value: function getFrontWin() {
        return this.list.sort(function (a, b) {
          return Number(b.getEl().style.zIndex) - Number(a.getEl().style.zIndex);
        })[0];
      }
    }, {
      key: "getAllWin",
      value: function getAllWin() {
        return this.list;
      }
    }, {
      key: "closeAllWin",
      value: function closeAllWin() {
        for (var u = this.list.length - 1; u >= 0; u--) {
          this.list[u].removeEl();
        }
      }
    }, {
      key: "add",
      value: function add(options, content) {
        var _this12 = this;

        var win = new _Window(options, content);
        binder(win, "removeEl", function () {
          return _this12.removeOfList(win.getID());
        }, true);
        binder(win, "focus", function () {
          return _this12.changeFocus(win.getID());
        }, true);
        binder(win, "checkMaximize", function () {
          return _this12.maxPreview.preview(win.getMaximizeSide(), win.getZindex());
        }, true, true);
        binder(win, "release", function () {
          return _this12.maxPreview.removePreview();
        }, true);
        win.create();
        win.getEl();
        this.list.push(win);
        this.initZindex(win.getID());
        this.startListening(win);
      }
    }, {
      key: "startListening",
      value: function startListening(win) {
        var _this13 = this;

        this.eventTypes.map(function (type) {
          win.emitter.on(type, function (_ref) {
            var detail = _ref.detail;
            return _this13.emitter.emit(type, {
              id: win.id,
              payload: detail
            });
          });
        });
      }
    }, {
      key: "removeOfList",
      value: function removeOfList(id) {
        this.list.splice(this.list.map(function (el) {
          return el.getID();
        }).indexOf(id), 1);
      }
    }, {
      key: "targetDrag",
      value: function targetDrag(evt) {
        var winSelected = this.getSelectedWin();
        var borderSelectedWin = this.getBorderSelectedWin();

        if (winSelected) {
          winSelected.drag(evt);
        } else if (borderSelectedWin) {
          borderSelectedWin.resize(evt);
        }
      }
    }, {
      key: "deselect",
      value: function deselect(evt) {
        var winSelected = this.getSelectedWin();
        var borderSelectedWin = this.getBorderSelectedWin();

        if (winSelected) {
          winSelected.release(evt);
        } else if (borderSelectedWin) {
          borderSelectedWin.borderLeave(evt);
        }
      } 

    }, {
      key: "changeFocus",
      value: function changeFocus(id) {
        if (this.focusedID === id) return;
        this.focusedID = id;
        var totalZI = this.list.length + this.startingZI;
        var win = this.getWinByID(id);
        var winToReplace = this.getFrontWin(); 

        win.getEl().style.zIndex = totalZI; 

        winToReplace.getEl().style.zIndex = totalZI - 1; 

        var otherWins = this.list 
        .filter(function (el) {
          return el.id !== id && el.id !== winToReplace.getID();
        }).sort(function (b, a) {
          return Number(a.getEl().style.zIndex) - Number(b.getEl().style.zIndex);
        });
        otherWins.forEach(function (win, listIndex, wins) {
          var el = win.getEl();
          var zIndex = Number(el.style.zIndex);

          if (zIndex === totalZI - 1) {
            for (var u = listIndex; u < wins.length - listIndex; u++) {
              var restEl = wins[u].getEl();
              var restZindex = Number(restEl.style.zIndex);
              if (u > 0 && Number(wins[u - 1].getEl().style.zIndex) - restZindex > 0) break; 

              restEl.style.zIndex = restZindex - 1; 
            }
          }
        });
      }
    }, {
      key: "initZindex",
      value: function initZindex(id) {
        var win = this.getWinByID(id);
        win.getEl().style.zIndex = this.list.length + this.startingZI;
      }
    }]);

    return _WindowList;
  }();

  var justAnotherWin = new _WindowList();
  return justAnotherWin;
});