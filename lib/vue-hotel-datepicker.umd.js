(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["vue-hotel-datepicker"] = factory();
	else
		root["vue-hotel-datepicker"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "02f4":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var defined = __webpack_require__("be13");
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ "0390":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var at = __webpack_require__("02f4")(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};


/***/ }),

/***/ "0bfb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__("cb7c");
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "0d58":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("ce10");
var enumBugKeys = __webpack_require__("e11e");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "11e9":
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__("52a7");
var createDesc = __webpack_require__("4630");
var toIObject = __webpack_require__("6821");
var toPrimitive = __webpack_require__("6a99");
var has = __webpack_require__("69a8");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__("9e1e") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "1495":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var anObject = __webpack_require__("cb7c");
var getKeys = __webpack_require__("0d58");

module.exports = __webpack_require__("9e1e") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "214f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("b0c5");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var fails = __webpack_require__("79e5");
var defined = __webpack_require__("be13");
var wks = __webpack_require__("2b4c");
var regexpExec = __webpack_require__("520a");

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),

/***/ "230e":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var document = __webpack_require__("7726").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "2350":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "23c6":
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__("2d95");
var TAG = __webpack_require__("2b4c")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "2aba":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var has = __webpack_require__("69a8");
var SRC = __webpack_require__("ca5a")('src');
var $toString = __webpack_require__("fa5b");
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("8378").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "2aeb":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("cb7c");
var dPs = __webpack_require__("1495");
var enumBugKeys = __webpack_require__("e11e");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("230e")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("fab2").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "2b4c":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("5537")('wks');
var uid = __webpack_require__("ca5a");
var Symbol = __webpack_require__("7726").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "2d00":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "2d95":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "32e9":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var createDesc = __webpack_require__("4630");
module.exports = __webpack_require__("9e1e") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "4588":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "4630":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "499e":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/listToStyles.js
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/addStylesClient.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return addStylesClient; });
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ "4bf8":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "520a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexpFlags = __webpack_require__("0bfb");

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ "52a7":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "5537":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("8378");
var global = __webpack_require__("7726");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("2d00") ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "5ca1":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var core = __webpack_require__("8378");
var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var ctx = __webpack_require__("9b43");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "5dbc":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var setPrototypeOf = __webpack_require__("8b97").set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),

/***/ "5f1b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__("23c6");
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};


/***/ }),

/***/ "613b":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5537")('keys');
var uid = __webpack_require__("ca5a");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "626a":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("2d95");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "6821":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("626a");
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "69a8":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "6a99":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("d3f4");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "7726":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "77f1":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "79e5":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "7cdf":
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var $export = __webpack_require__("5ca1");

$export($export.S, 'Number', { isInteger: __webpack_require__("9c12") });


/***/ }),

/***/ "8378":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.12' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "86cc":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var toPrimitive = __webpack_require__("6a99");
var dP = Object.defineProperty;

exports.f = __webpack_require__("9e1e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "8b97":
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__("d3f4");
var anObject = __webpack_require__("cb7c");
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__("9b43")(Function.call, __webpack_require__("11e9").f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),

/***/ "9093":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__("ce10");
var hiddenKeys = __webpack_require__("e11e").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "9b43":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("d8e8");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "9c12":
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var isObject = __webpack_require__("d3f4");
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};


/***/ }),

/***/ "9def":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("4588");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "9e1e":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("79e5")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "a481":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__("cb7c");
var toObject = __webpack_require__("4bf8");
var toLength = __webpack_require__("9def");
var toInteger = __webpack_require__("4588");
var advanceStringIndex = __webpack_require__("0390");
var regExpExec = __webpack_require__("5f1b");
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
__webpack_require__("214f")('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});


/***/ }),

/***/ "aa77":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("5ca1");
var defined = __webpack_require__("be13");
var fails = __webpack_require__("79e5");
var spaces = __webpack_require__("fdef");
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),

/***/ "b0c5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpExec = __webpack_require__("520a");
__webpack_require__("5ca1")({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});


/***/ }),

/***/ "be13":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "bf38":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueHotelDatepicker_vue_vue_type_style_index_0_id_a321de44_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c765");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueHotelDatepicker_vue_vue_type_style_index_0_id_a321de44_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueHotelDatepicker_vue_vue_type_style_index_0_id_a321de44_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "c366":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("6821");
var toLength = __webpack_require__("9def");
var toAbsoluteIndex = __webpack_require__("77f1");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "c5f6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var has = __webpack_require__("69a8");
var cof = __webpack_require__("2d95");
var inheritIfRequired = __webpack_require__("5dbc");
var toPrimitive = __webpack_require__("6a99");
var fails = __webpack_require__("79e5");
var gOPN = __webpack_require__("9093").f;
var gOPD = __webpack_require__("11e9").f;
var dP = __webpack_require__("86cc").f;
var $trim = __webpack_require__("aa77").trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__("2aeb")(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__("9e1e") ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__("2aba")(global, NUMBER, $Number);
}


/***/ }),

/***/ "c69a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("9e1e") && !__webpack_require__("79e5")(function () {
  return Object.defineProperty(__webpack_require__("230e")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "c765":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("cf05");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("3a15c216", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "ca5a":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "cb7c":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "ce10":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("69a8");
var toIObject = __webpack_require__("6821");
var arrayIndexOf = __webpack_require__("c366")(false);
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "cf05":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, "*[data-v-a321de44]{-webkit-box-sizing:border-box;box-sizing:border-box;font-family:Avenir,Helvetica,Arial,sans-serif}svg[data-v-a321de44]{fill:#7d7d7d}@media (hover:hover){svg[data-v-a321de44]:hover{fill:#4a4a4a}}.vhd-container.mobile .vhd-picker[data-v-a321de44]{width:300px;padding:8px}.vhd-container.mobile .vhd-calendar-header[data-v-a321de44]{height:60px}.vhd-container.mobile .vhd-calendar-header>.info[data-v-a321de44]{display:block;width:100%;height:60px;padding-top:36px}.vhd-container.mobile .vhd-calendar-left[data-v-a321de44]{width:100%;margin-right:0}.vhd-container.mobile .vhd-calendar-right[data-v-a321de44],.vhd-container.mobile .vhd-calendar .calendar-month .previous-arrow.offset-2[data-v-a321de44]{display:none}.vhd-container.mobile .vhd-calendar .calendar-month .next-arrow.offset-1[data-v-a321de44],.vhd-container.mobile .vhd-calendar .calendar-month .previous-arrow.offset-1[data-v-a321de44]{display:inline-block}.vhd-container.mobile .vhd-calendar .calendar-date .week .day[data-v-a321de44]{width:14.2857142857%}.vhd-container.mobile .vhd-calendar .calendar-date .week .day.start-date[data-v-a321de44]{color:#fff;border-left:none;background-color:#08f;-webkit-transition:all .2s ease;transition:all .2s ease}.vhd-container.mobile .vhd-calendar .calendar-date .week .day.end-date[data-v-a321de44]{color:#fff;border-right:none;background-color:#08f;-webkit-transition:all .2s ease;transition:all .2s ease}.vhd-container[data-v-a321de44]{display:inline-block;position:relative}.vhd-input[data-v-a321de44]{min-width:300px;padding:8px;border:1px solid #eee;color:#505050;font-size:16px;line-height:32px;outline:none}.vhd-input[data-v-a321de44]::-webkit-input-placeholder{color:#ccc}.vhd-input[data-v-a321de44]::-moz-placeholder{color:#ccc}.vhd-input[data-v-a321de44]:-ms-input-placeholder{color:#ccc}.vhd-input[data-v-a321de44]::-ms-input-placeholder{color:#ccc}.vhd-input[data-v-a321de44]::placeholder{color:#ccc}.vhd-picker[data-v-a321de44]{z-index:100;position:absolute;left:0;width:648px;min-height:420px;padding:24px;background-color:#fff;border-radius:6px;-webkit-box-shadow:0 2px 30px 0 rgba(0,0,0,.27);box-shadow:0 2px 30px 0 rgba(0,0,0,.27);overflow:hidden}.vhd-calendar-header[data-v-a321de44]{position:relative;width:100%;height:36px}.vhd-calendar-header>.info[data-v-a321de44]{display:inline-block;width:calc(100% - 24px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vhd-calendar-header>.info .from-date[data-v-a321de44],.vhd-calendar-header>.info .to-date[data-v-a321de44]{margin:0 8px;font-weight:700}.vhd-calendar-header>a.close[data-v-a321de44]{position:absolute;right:0;width:24px;height:24px;cursor:pointer}.vhd-calendar-footer[data-v-a321de44]{position:relative;width:100%;height:36px}.vhd-calendar-footer .confirm[data-v-a321de44],.vhd-calendar-footer .reset[data-v-a321de44]{position:absolute;bottom:0;margin:8px 0;padding:0 8px;font-weight:500;cursor:pointer}.vhd-calendar-footer .reset[data-v-a321de44]{left:0;color:#7d7d7d}@media (hover:hover){.vhd-calendar-footer .reset[data-v-a321de44]:hover{color:#4a4a4a}}.vhd-calendar-footer .confirm[data-v-a321de44]{right:0;color:#08f}@media (hover:hover){.vhd-calendar-footer .confirm[data-v-a321de44]:hover{color:#005299}}.vhd-calendar-left[data-v-a321de44],.vhd-calendar-right[data-v-a321de44]{display:inline-block;vertical-align:top;width:280px}.vhd-calendar-left[data-v-a321de44]{margin-right:40px}.vhd-calendar .calendar-month[data-v-a321de44]{position:relative;height:32px;margin-bottom:8px}.vhd-calendar .calendar-month .next-arrow[data-v-a321de44],.vhd-calendar .calendar-month .previous-arrow[data-v-a321de44]{position:absolute;top:0;padding-top:4px;cursor:pointer}.vhd-calendar .calendar-month .next-arrow.disabled[data-v-a321de44],.vhd-calendar .calendar-month .previous-arrow.disabled[data-v-a321de44]{display:none!important}.vhd-calendar .calendar-month .previous-arrow[data-v-a321de44]{left:0}.vhd-calendar .calendar-month .next-arrow[data-v-a321de44]{right:0}.vhd-calendar .calendar-month .next-arrow.offset-1[data-v-a321de44],.vhd-calendar .calendar-month .previous-arrow.offset-1[data-v-a321de44]{display:none}.vhd-calendar .calendar-month-title[data-v-a321de44]{margin:8px 0;font-size:20px;font-weight:500;line-height:1.6;text-align:center;color:#505050}.vhd-calendar .calendar-week[data-v-a321de44]{width:100%;height:32px}.vhd-calendar .calendar-week-item[data-v-a321de44]{float:left;display:inline-block;font-size:12px;font-weight:500;width:14.2857142857%;height:20px;color:#505050;text-align:center;line-height:20px}.vhd-calendar .calendar-date .week[data-v-a321de44]{display:block;width:100%;height:40px}.vhd-calendar .calendar-date .week .day[data-v-a321de44]{float:left;position:relative;display:inline-block;width:40px;height:40px;font-size:16px;font-weight:500;line-height:40px;color:#505050;background-color:transparent;text-align:center;cursor:pointer;-webkit-transition:background-color .4s cubic-bezier(.165,.84,.44,1);transition:background-color .4s cubic-bezier(.165,.84,.44,1)}.vhd-calendar .calendar-date .week .day[data-v-a321de44]:after,.vhd-calendar .calendar-date .week .day[data-v-a321de44]:before{content:\"\";position:absolute;width:0;height:100%;left:0;background-color:transparent;opacity:0;-webkit-transition:opacity .4s cubic-bezier(.165,.84,.44,1),background-color .4s cubic-bezier(.165,.84,.44,1),width .4s cubic-bezier(.165,.84,.44,1);transition:opacity .4s cubic-bezier(.165,.84,.44,1),background-color .4s cubic-bezier(.165,.84,.44,1),width .4s cubic-bezier(.165,.84,.44,1)}.vhd-calendar .calendar-date .week .day[data-v-a321de44]:after{left:auto;right:0}.vhd-calendar .calendar-date .week .day.disabled[data-v-a321de44]{color:#ececec;pointer-events:none}.vhd-calendar .calendar-date .week .day.in-date-range[data-v-a321de44]{background-color:#b2d7ff}.vhd-calendar .calendar-date .week .day.start-date[data-v-a321de44]{position:relative;background-color:#b2d7ff}.vhd-calendar .calendar-date .week .day.start-date[data-v-a321de44]:before{width:4px;background-color:#08f;opacity:1}.vhd-calendar .calendar-date .week .day.end-date[data-v-a321de44]{position:relative;background-color:#b2d7ff}.vhd-calendar .calendar-date .week .day.end-date[data-v-a321de44]:after{width:4px;background-color:#08f;opacity:1;-webkit-transition:opacity .2s cubic-bezier(.165,.84,.44,1),background-color .2s cubic-bezier(.165,.84,.44,1),width .2s cubic-bezier(.165,.84,.44,1);transition:opacity .2s cubic-bezier(.165,.84,.44,1),background-color .2s cubic-bezier(.165,.84,.44,1),width .2s cubic-bezier(.165,.84,.44,1)}.vhd-calendar .calendar-date .week .day.today[data-v-a321de44]{border:1px solid #08f}.vhd-calendar .calendar-date .week .day.forbidden[data-v-a321de44]{color:#fed9d8;cursor:not-allowed}@media only screen and (max-width:767.98px){.vhd-container:not(.desktop) .vhd-picker[data-v-a321de44]{width:300px;padding:8px}.vhd-container:not(.desktop) .vhd-calendar-header[data-v-a321de44]{height:60px}.vhd-container:not(.desktop) .vhd-calendar-header>.info[data-v-a321de44]{display:block;width:100%;height:60px;padding-top:36px}.vhd-container:not(.desktop) .vhd-calendar-left[data-v-a321de44]{width:100%;margin-right:0}.vhd-container:not(.desktop) .vhd-calendar-right[data-v-a321de44],.vhd-container:not(.desktop) .vhd-calendar .calendar-month .previous-arrow.offset-2[data-v-a321de44]{display:none}.vhd-container:not(.desktop) .vhd-calendar .calendar-month .next-arrow.offset-1[data-v-a321de44],.vhd-container:not(.desktop) .vhd-calendar .calendar-month .previous-arrow.offset-1[data-v-a321de44]{display:inline-block}.vhd-container:not(.desktop) .vhd-calendar .calendar-date .week .day[data-v-a321de44]{width:14.2857142857%}.vhd-container:not(.desktop) .vhd-calendar .calendar-date .week .day.start-date[data-v-a321de44]{color:#fff;border-left:none;background-color:#08f;-webkit-transition:all .2s ease;transition:all .2s ease}.vhd-container:not(.desktop) .vhd-calendar .calendar-date .week .day.end-date[data-v-a321de44]{color:#fff;border-right:none;background-color:#08f;-webkit-transition:all .2s ease;transition:all .2s ease}}", ""]);

// exports


/***/ }),

/***/ "d3f4":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "d8e8":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "e11e":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "f6fd":
/***/ (function(module, exports) {

// document.currentScript polyfill by Adam Miller

// MIT license

(function(document){
  var currentScript = "currentScript",
      scripts = document.getElementsByTagName('script'); // Live NodeList collection

  // If browser needs currentScript polyfill, add get currentScript() to the document object
  if (!(currentScript in document)) {
    Object.defineProperty(document, currentScript, {
      get: function(){

        // IE 6-10 supports script readyState
        // IE 10+ support stack trace
        try { throw new Error(); }
        catch (err) {

          // Find the second match for the "at" string to get file src url from stack.
          // Specifically works with the format of stack traces in IE.
          var i, res = ((/.*at [^\(]*\((.*):.+:.+\)$/ig).exec(err.stack) || [false])[1];

          // For all scripts on the page, if src matches or if ready state is interactive, return the script tag
          for(i in scripts){
            if(scripts[i].src == res || scripts[i].readyState == "interactive"){
              return scripts[i];
            }
          }

          // If no match, return null
          return null;
        }
      }
    });
  }
})(document);


/***/ }),

/***/ "fa5b":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("5537")('native-function-to-string', Function.toString);


/***/ }),

/***/ "fab2":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("7726").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  if (true) {
    __webpack_require__("f6fd")
  }

  var i
  if ((i = window.document.currentScript) && (i = i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"15fc8c9b-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/VueHotelDatepicker.vue?vue&type=template&id=a321de44&scoped=true
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vhd-container",class:_vm.mobile.toLowerCase()},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.value),expression:"value"}],staticClass:"vhd-input",attrs:{"placeholder":_vm.placeholder,"type":"text","aria-label":"vue-hotel-datepicker-input"},domProps:{"value":(_vm.value)},on:{"mousedown":function($event){$event.preventDefault();return _vm.toggle($event)},"focus":function($event){$event.preventDefault();return _vm.toggle($event)},"input":function($event){if($event.target.composing){ return; }_vm.value=$event.target.value}}}),(_vm.active)?_c('div',{staticClass:"vhd-picker"},[_c('div',{staticClass:"vhd-calendar"},[_c('div',{staticClass:"vhd-calendar-header"},[_c('a',{staticClass:"close",on:{"click":_vm.close}},[_c('IconClose')],1),_c('span',{staticClass:"info"},[(_vm.selectStartDate)?_c('span',{staticClass:"from-text"},[_vm._v(_vm._s(_vm.fromText))]):_vm._e(),(_vm.selectStartDate)?_c('span',{staticClass:"from-date"},[_vm._v(" "+_vm._s(_vm.displayDateText(_vm.selectStartDate))+" ")]):_vm._e(),(_vm.selectEndDate)?_c('span',{staticClass:"to-text"},[_vm._v(_vm._s(_vm.toText))]):_vm._e(),(_vm.selectEndDate)?_c('span',{staticClass:"from-date"},[_vm._v(" "+_vm._s(_vm.displayDateText(_vm.selectEndDate))+" ")]):_vm._e()])]),_c('div',{staticClass:"vhd-calendar-left"},[_c('div',{staticClass:"calendar-month"},[_c('a',{staticClass:"previous-arrow offset-2",class:_vm.disabledPreviousArrow(_vm.startMonthDate),on:{"click":function($event){return _vm.updateCalendar(-2)}}},[_c('IconArrowBack',{staticClass:"arrow"})],1),_c('a',{staticClass:"previous-arrow offset-1",class:_vm.disabledPreviousArrow(_vm.startMonthDate),on:{"click":function($event){return _vm.updateCalendar(-1)}}},[_c('IconArrowBack',{staticClass:"arrow"})],1),_c('div',{staticClass:"calendar-month-title"},[_vm._v("\n            "+_vm._s(_vm.monthList[_vm.startMonthDate.getMonth()])+" "+_vm._s(_vm.startMonthDate.getFullYear())+"\n          ")]),_c('a',{staticClass:"next-arrow offset-1",on:{"click":function($event){return _vm.updateCalendar(1)}}},[_c('IconArrowForward',{staticClass:"arrow"})],1)]),_c('div',{staticClass:"calendar-week"},_vm._l((_vm.weekList),function(wItem,index){return _c('div',{key:index,staticClass:"calendar-week-item"},[_vm._v("\n            "+_vm._s(wItem)+"\n          ")])}),0),_c('div',{staticClass:"calendar-date"},_vm._l((_vm.startMonthAry),function(week,wIndex){return _c('div',{key:wIndex,staticClass:"week"},_vm._l((week),function(startDay,dIndex){return _c('div',{key:dIndex,staticClass:"day",class:_vm.dayStatus(startDay),on:{"click":function($event){return _vm.dayOnClick(startDay)}}},[(startDay)?_c('span',[_vm._v("\n                "+_vm._s(startDay.getDate())+"\n              ")]):_vm._e()])}),0)}),0)]),_c('div',{staticClass:"vhd-calendar-right"},[_c('div',{staticClass:"calendar-month"},[_c('a',{staticClass:"next-arrow",on:{"click":function($event){return _vm.updateCalendar(2)}}},[_c('IconArrowForward',{staticClass:"arrow"})],1),_c('div',{staticClass:"calendar-month-title"},[_vm._v("\n            "+_vm._s(_vm.monthList[_vm.endMonthDate.getMonth()])+" "+_vm._s(_vm.endMonthDate.getFullYear())+"\n          ")])]),_c('div',{staticClass:"calendar-week"},_vm._l((_vm.weekList),function(wItem,index){return _c('div',{key:index,staticClass:"calendar-week-item"},[_vm._v("\n            "+_vm._s(wItem)+"\n          ")])}),0),_c('div',{staticClass:"calendar-date"},_vm._l((_vm.endMonthAry),function(week,wIndex){return _c('div',{key:wIndex,staticClass:"week"},_vm._l((week),function(endDay,dIndex){return _c('div',{key:dIndex,staticClass:"day",class:_vm.dayStatus(endDay),on:{"click":function($event){return _vm.dayOnClick(endDay)}}},[(endDay)?_c('span',[_vm._v("\n                "+_vm._s(endDay.getDate())+"\n              ")]):_vm._e()])}),0)}),0)]),(_vm.message)?_c('div',{staticClass:"vhd-calendar-message"},[_vm._v("\n          "+_vm._s(_vm.message)+"\n      ")]):_vm._e(),_c('div',{staticClass:"vhd-calendar-footer"},[(_vm.selectStartDate || _vm.selectEndDate)?_c('div',{staticClass:"reset",on:{"click":_vm.reset}},[_vm._v(_vm._s(_vm.resetText))]):_vm._e(),(_vm.selectStartDate && _vm.selectEndDate)?_c('div',{staticClass:"confirm",on:{"click":_vm.confirm}},[_vm._v(_vm._s(_vm.confirmText))]):_vm._e()])])]):_vm._e()])}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/VueHotelDatepicker.vue?vue&type=template&id=a321de44&scoped=true

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.number.is-integer.js
var es6_number_is_integer = __webpack_require__("7cdf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.replace.js
var es6_regexp_replace = __webpack_require__("a481");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.number.constructor.js
var es6_number_constructor = __webpack_require__("c5f6");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"15fc8c9b-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/icon/IconClose.vue?vue&type=template&id=b24fb48a
var IconClosevue_type_template_id_b24fb48a_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{attrs:{"xmlns":"http://www.w3.org/2000/svg","width":"24","height":"24","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}}),_c('path',{attrs:{"d":"M0 0h24v24H0z","fill":"none"}})])}
var IconClosevue_type_template_id_b24fb48a_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/icon/IconClose.vue?vue&type=template&id=b24fb48a

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/icon/IconClose.vue?vue&type=script&lang=js
//
//
//
//
//
//

/* harmony default export */ var IconClosevue_type_script_lang_js = ({
  name: 'IconClose'
});
// CONCATENATED MODULE: ./src/components/icon/IconClose.vue?vue&type=script&lang=js
 /* harmony default export */ var icon_IconClosevue_type_script_lang_js = (IconClosevue_type_script_lang_js); 
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent(
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */,
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options =
    typeof scriptExports === 'function' ? scriptExports.options : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) {
    // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
          injectStyles.call(
            this,
            (options.functional ? this.parent : this).$root.$options.shadowRoot
          )
        }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./src/components/icon/IconClose.vue





/* normalize component */

var component = normalizeComponent(
  icon_IconClosevue_type_script_lang_js,
  IconClosevue_type_template_id_b24fb48a_render,
  IconClosevue_type_template_id_b24fb48a_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var IconClose = (component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"15fc8c9b-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/icon/IconArrowBack.vue?vue&type=template&id=595db2dc
var IconArrowBackvue_type_template_id_595db2dc_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{attrs:{"xmlns":"http://www.w3.org/2000/svg","width":"24","height":"24","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M0 0h24v24H0z","fill":"none"}}),_c('path',{attrs:{"d":"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"}})])}
var IconArrowBackvue_type_template_id_595db2dc_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/icon/IconArrowBack.vue?vue&type=template&id=595db2dc

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/icon/IconArrowBack.vue?vue&type=script&lang=js
//
//
//
//
//
//

/* harmony default export */ var IconArrowBackvue_type_script_lang_js = ({
  name: 'IconArrowBack'
});
// CONCATENATED MODULE: ./src/components/icon/IconArrowBack.vue?vue&type=script&lang=js
 /* harmony default export */ var icon_IconArrowBackvue_type_script_lang_js = (IconArrowBackvue_type_script_lang_js); 
// CONCATENATED MODULE: ./src/components/icon/IconArrowBack.vue





/* normalize component */

var IconArrowBack_component = normalizeComponent(
  icon_IconArrowBackvue_type_script_lang_js,
  IconArrowBackvue_type_template_id_595db2dc_render,
  IconArrowBackvue_type_template_id_595db2dc_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var IconArrowBack = (IconArrowBack_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"15fc8c9b-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/icon/IconArrowForward.vue?vue&type=template&id=1b504fa6
var IconArrowForwardvue_type_template_id_1b504fa6_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{attrs:{"xmlns":"http://www.w3.org/2000/svg","width":"24","height":"24","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M0 0h24v24H0z","fill":"none"}}),_c('path',{attrs:{"d":"M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"}})])}
var IconArrowForwardvue_type_template_id_1b504fa6_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/icon/IconArrowForward.vue?vue&type=template&id=1b504fa6

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/icon/IconArrowForward.vue?vue&type=script&lang=js
//
//
//
//
//
//

/* harmony default export */ var IconArrowForwardvue_type_script_lang_js = ({
  name: 'IconArrowForward'
});
// CONCATENATED MODULE: ./src/components/icon/IconArrowForward.vue?vue&type=script&lang=js
 /* harmony default export */ var icon_IconArrowForwardvue_type_script_lang_js = (IconArrowForwardvue_type_script_lang_js); 
// CONCATENATED MODULE: ./src/components/icon/IconArrowForward.vue





/* normalize component */

var IconArrowForward_component = normalizeComponent(
  icon_IconArrowForwardvue_type_script_lang_js,
  IconArrowForwardvue_type_template_id_1b504fa6_render,
  IconArrowForwardvue_type_template_id_1b504fa6_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var IconArrowForward = (IconArrowForward_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/VueHotelDatepicker.vue?vue&type=script&lang=js



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ var VueHotelDatepickervue_type_script_lang_js = ({
  name: 'VueHotelDatepicker',
  components: {
    IconClose: IconClose,
    IconArrowBack: IconArrowBack,
    IconArrowForward: IconArrowForward
  },
  directives: {},
  props: {
    placeholder: {
      type: String,
      default: 'Select a date range'
    },
    separator: {
      type: String,
      default: '~'
    },
    format: {
      type: String,
      default: 'YYYY/MM/DD'
    },
    startDate: {
      type: [String, Date],
      default: undefined
    },
    endDate: {
      type: [String, Date],
      default: undefined
    },
    minDate: {
      type: [String, Date],
      default: function _default() {
        return new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0);
      }
    },
    maxDate: {
      type: [String, Date, Boolean],
      default: false
    },
    minNight: {
      type: Number,
      default: undefined
    },
    maxNight: {
      type: Number,
      default: undefined
    },
    selectForward: {
      type: Boolean,
      default: true
    },
    disabledDates: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    weekList: {
      type: Array,
      default: function _default() {
        return ['Sun.', 'Mon.', 'Tue.', 'Wen.', 'Thu.', 'Fri.', 'Sat.'];
      }
    },
    monthList: {
      type: Array,
      default: function _default() {
        return ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct', 'Nov.', 'Dec.'];
      }
    },
    fromText: {
      type: String,
      default: 'From'
    },
    toText: {
      type: String,
      default: 'To'
    },
    resetText: {
      type: String,
      default: 'Reset'
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    mobile: {
      type: String,
      default: '' // mobile or desktop
    },
    message: {
      type: String,
      default: ''
    }
  },
  data: function data() {
    return {
      value: '',
      active: false,
      startMonthDate: undefined,
      endMonthDate: undefined,
      selectStartDate: undefined,
      selectEndDate: undefined,
      selectMinDate: undefined,
      selectMaxDate: undefined,
      startMonthAry: [],
      endMonthAry: []
    };
  },
  computed: {},
  watch: {},
  created: function created() {
    this.render();
  },
  mounted: function mounted() {},
  methods: {
    render: function render() {
      if (this.minDate) {
        var minDateValue = typeof this.minDate === 'string' ? this.minDate : this.minDate.getTime();
        this.selectMinDate = new Date(minDateValue);
      }
      if (this.maxDate) {
        var maxDateValue = typeof this.maxDate === 'string' ? this.maxDate : this.maxDate.getTime();
        this.selectMaxDate = new Date(maxDateValue);
      }
      if (this.startDate) {
        var startDateValue = typeof this.startDate === 'string' ? this.startDate : this.startDate.getTime();
        this.selectStartDate = new Date(startDateValue);
        if (this.selectMinDate && this.selectMinDate.getTime() > this.selectStartDate.getTime()) {
          this.selectMinDate = new Date(startDateValue);
        }
        if (!this.endDate) {
          this.selectEndDate = new Date(this.selectStartDate.getTime() + 24 * 60 * 60 * 1000);
        } else {
          var endDateValue = typeof this.endDate === 'string' ? this.endDate : this.endDate.getTime();
          this.selectEndDate = new Date(endDateValue);
        }
        this.updateValue();
      }
      this.updateCalendar(); // after setting
    },
    toggle: function toggle(e) {
      if (e.type === 'focus') {
        this.$emit('beforeopen');
        this.active = true;
        this.$emit('open');
        return true;
      }
      this.active = !this.active;
      this.$emit(this.active ? 'open' : 'close');
    },
    close: function close() {
      this.active = false;
      this.$emit('close');
    },
    open: function open() {
      this.active = true;
      this.$emit('open');
    },
    reset: function reset() {
      this.selectStartDate = undefined;
      this.selectEndDate = undefined;
      this.value = '';
      this.$emit('reset');
    },
    confirm: function confirm() {
      if (this.selectStartDate && !this.selectEndDate) {
        this.selectEndDate = new Date(this.selectStartDate.getTime());
        this.selectEndDate.setDate(this.selectStartDate.getDate() + 1);
        this.updateValue();
      }
      if (this.selectStartDate && this.selectEndDate) {
        var dateResult = {
          start: this.displayDateText(this.selectStartDate),
          end: this.displayDateText(this.selectEndDate)
        };
        this.$emit('confirm', dateResult);
        this.active = false;
      }
    },
    displayDateText: function displayDateText(datetime) {
      if (datetime) {
        datetime = typeof datetime === 'string' ? new Date(datetime) : datetime;
        var yyyy = datetime.getFullYear();
        var mm = datetime.getMonth() + 1 > 9 ? datetime.getMonth() + 1 : "0".concat(datetime.getMonth() + 1);
        var dd = datetime.getDate() > 9 ? datetime.getDate() : "0".concat(datetime.getDate());
        var displayStr = (this.format || 'YYYY/MM/DD').replace('YYYY', yyyy).replace('MM', mm).replace('DD', dd);
        return displayStr;
      } else {
        return undefined;
      }
    },
    generateCalendar: function generateCalendar() {
      var calculateYear = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date().getFullYear();
      var calculateMonth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date().getMonth();
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var showPreviousMonthDate = config.showPreviousMonthDate || false;
      var showNextMonthDate = config.showNextMonthDate || false;
      var baseDateTime = new Date(calculateYear, calculateMonth, 1, 0, 0, 0);
      var countTime = new Date(calculateYear, calculateMonth, 1, 0, 0, 0);
      var tempMonthAry = [];
      var tempWeekAry = [];
      var nextMonth = false;
      var completed = false;
      while (!nextMonth || nextMonth && !completed) {
        var day = countTime.getDay();
        var date = countTime.getDate();
        var month = countTime.getMonth();
        // check next month
        if (month !== calculateMonth) {
          nextMonth = true;
          if (day === 6 || date === 1 && day === 0) {
            completed = true;
          }
        }
        // Set date
        if (!nextMonth) {
          tempWeekAry[day] = new Date(countTime.getTime()); // date obj
        } else {
          tempWeekAry[day] = showNextMonthDate ? new Date(countTime.getTime()) : false;
        }
        // check previous
        if (countTime.getTime() === baseDateTime.getTime() && day !== 0) {
          // Fill previous
          var previousDay = day;
          var previousCountTime = new Date(countTime.getTime());
          previousCountTime.setDate(previousCountTime.getDate());
          if (showPreviousMonthDate) {
            while (previousDay !== 0) {
              // let previousDate = previousDateTime.getDate()
              var previousDateTime = new Date(previousCountTime.getTime());
              previousDay = previousDateTime.getDay();
              tempWeekAry[previousDay] = previousDateTime; // date obj
              previousCountTime.setDate(previousCountTime.getDate() - 1);
            }
          }
        }
        // check new week
        if (countTime.getTime() === baseDateTime.getTime() && tempWeekAry.length === 7 || countTime.getTime() > baseDateTime && day === 6) {
          // Next week
          tempMonthAry.push(tempWeekAry);
          tempWeekAry = [];
        }
        // calculate next day
        countTime.setDate(countTime.getDate() + 1);
      }
      return tempMonthAry;
    },
    updateCalendar: function updateCalendar() {
      var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      if (!this.startMonthDate) {
        this.startMonthDate = this.selectStartDate ? new Date(this.selectStartDate.getTime()) : new Date(new Date().getFullYear(), new Date().getMonth()); // now
      }
      this.startMonthDate.setMonth(this.startMonthDate.getMonth() + offset);
      this.endMonthDate = new Date(this.startMonthDate.getFullYear(), this.startMonthDate.getMonth() + 1);
      this.startMonthAry = [];
      this.endMonthAry = [];
      this.startMonthAry = this.generateCalendar(this.startMonthDate.getFullYear(), this.startMonthDate.getMonth());
      this.endMonthAry = this.generateCalendar(this.endMonthDate.getFullYear(), this.endMonthDate.getMonth());
    },
    updateValue: function updateValue() {
      this.value = "".concat(this.displayDateText(this.selectStartDate) || '', " ").concat(this.separator, " ").concat(this.displayDateText(this.selectEndDate) || '');
    },
    disabledPreviousArrow: function disabledPreviousArrow(monthDatetime) {
      var now = new Date();
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      if (monthDatetime && this.selectForward) {
        if (this.selectMinDate) {
          if (monthDatetime.getFullYear() < this.selectMinDate.getFullYear()) {
            return 'disabled';
          }
          if (monthDatetime.getFullYear() === this.selectMinDate.getFullYear() && monthDatetime.getMonth() <= this.selectMinDate.getMonth()) {
            return 'disabled';
          }
        } else {
          if (monthDatetime.getFullYear() === today.getFullYear() && monthDatetime.getMonth() === today.getMonth()) {
            return 'disabled';
          }
        }
      }
    },
    dayStatus: function dayStatus(datetime) {
      var classList = [];
      if (datetime) {
        var now = new Date();
        // const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
        // check status
        if (this.selectMinDate.getTime() > datetime.getTime()) {
          classList.push('disabled');
        } else if (this.selectMaxDate && this.selectMaxDate.getTime() < datetime.getTime()) {
          classList.push('disabled');
        } else if (this.disabledDates.indexOf(this.displayDateText(datetime)) > -1) {
          classList.push('disabled');
          classList.push('forbidden');
        } else if (this.selectStartDate && this.selectStartDate.getTime() > datetime.getTime() && !this.selectForward) {
          classList.push('disabled');
        } else if (this.selectStartDate && this.selectStartDate.getTime() === datetime.getTime()) {
          classList.push('start-date');
        } else if (this.selectEndDate && this.selectEndDate.getTime() === datetime.getTime()) {
          classList.push('end-date');
        } else if (this.selectStartDate && this.selectEndDate && datetime.getTime() > this.selectStartDate.getTime() && datetime.getTime() < this.selectEndDate.getTime()) {
          classList.push('in-date-range');
        }
        // check min night and max night
        if (this.selectStartDate && (Number.isInteger(this.minNight) && this.minNight > 0 || Number.isInteger(this.maxNight) && this.maxNight > 0)) {
          var night = Math.abs(datetime.getTime() - this.selectStartDate.getTime()) / (1000 * 60 * 60 * 24);
          if (night < this.minNight) {
            classList.push('disabled');
          } else if (night > this.maxNight) {
            classList.push('disabled');
          }
        }
        // check today
        if (now.getFullYear() === datetime.getFullYear() && now.getMonth() === datetime.getMonth() && now.getDate() === datetime.getDate()) {
          classList.push('today');
        }
      }
      return classList;
    },
    dayOnClick: function dayOnClick(datetime) {
      if (datetime) {
        // v7.1
        // if dates are already selected, then first click resets start date
        if (this.selectStartDate && this.selectEndDate) {
          this.isSettingStartDate = true;
        }
        // check which date we gonna set first - start or end
        if (!this.selectStartDate || this.isSettingStartDate) {
          // console.log("start date")
          // If start date is not set or it's time to set start date
          this.selectStartDate = datetime;
          this.selectEndDate = null; // Reset end date
          this.isSettingStartDate = false; // Prepare for setting the end date
        } else {
          // console.log("end date")
          // Setting the end date
          if (datetime.getTime() === this.selectStartDate.getTime()) {
            // If the selected date is the same as the start date, reset only the end date for a new selection
            this.selectEndDate = null;
            this.isSettingStartDate = false; // Remain in the state of setting the end date
          } else if (datetime.getTime() < this.selectStartDate.getTime()) {
            // If the selected date is before the start date, set this as start date and previous start date as end date
            this.selectEndDate = this.selectStartDate;
            this.selectStartDate = datetime;
            this.isSettingStartDate = true; // Next click will start a new selection
          } else {
            // Set the end date
            this.selectEndDate = datetime;
            this.isSettingStartDate = true; // Next click will start a new selection
          }
        }

        // check maxNight
        if (this.selectStartDate && this.selectEndDate && this.maxNight) {
          var limitDate = this.selectStartDate.getTime() + this.maxNight * 1000 * 60 * 60 * 24;
          if (this.selectEndDate.getTime() > limitDate) {
            this.selectEndDate = new Date(limitDate);
          }
        }
        // check minNight
        if (this.selectStartDate && this.selectEndDate && this.minNight) {
          var _limitDate = this.selectStartDate.getTime() + this.minNight * 1000 * 60 * 60 * 24;
          if (this.selectEndDate.getTime() < _limitDate) {
            this.selectEndDate = new Date(_limitDate);
          }
        }
        var dateResult = {
          start: this.displayDateText(this.selectStartDate),
          end: this.displayDateText(this.selectEndDate)
        };
        this.$emit('update', dateResult);
        this.updateValue();
      }
    }
  }
});
// CONCATENATED MODULE: ./src/components/VueHotelDatepicker.vue?vue&type=script&lang=js
 /* harmony default export */ var components_VueHotelDatepickervue_type_script_lang_js = (VueHotelDatepickervue_type_script_lang_js); 
// EXTERNAL MODULE: ./src/components/VueHotelDatepicker.vue?vue&type=style&index=0&id=a321de44&prod&lang=scss&scoped=true
var VueHotelDatepickervue_type_style_index_0_id_a321de44_prod_lang_scss_scoped_true = __webpack_require__("bf38");

// CONCATENATED MODULE: ./src/components/VueHotelDatepicker.vue






/* normalize component */

var VueHotelDatepicker_component = normalizeComponent(
  components_VueHotelDatepickervue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "a321de44",
  null
  
)

/* harmony default export */ var VueHotelDatepicker = (VueHotelDatepicker_component.exports);
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (VueHotelDatepicker);



/***/ }),

/***/ "fdef":
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ })

/******/ })["default"];
});
//# sourceMappingURL=vue-hotel-datepicker.umd.js.map