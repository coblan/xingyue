/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 67);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
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


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _back = __webpack_require__(6);

var back = _interopRequireWildcard(_back);

var _menu_circle = __webpack_require__(9);

var menu_circle = _interopRequireWildcard(_menu_circle);

var _menu_circle_dp = __webpack_require__(13);

var menu_circle_sm = _interopRequireWildcard(_menu_circle_dp);

var _menu_circle_d = __webpack_require__(12);

var menu_circle_d = _interopRequireWildcard(_menu_circle_d);

var _menu_circle_2d = __webpack_require__(10);

var menu_circle_2d = _interopRequireWildcard(_menu_circle_2d);

var _menu_vertical = __webpack_require__(16);

var menu_vertical = _interopRequireWildcard(_menu_vertical);

var _menu_vertical_d = __webpack_require__(17);

var menu_vertical_d = _interopRequireWildcard(_menu_vertical_d);

var _menu_circle_ = __webpack_require__(11);

var menu_circle_720 = _interopRequireWildcard(_menu_circle_);

var _menu_po = __webpack_require__(14);

var menu_po = _interopRequireWildcard(_menu_po);

var _menu_tallbuild = __webpack_require__(15);

var menu_tallbuild = _interopRequireWildcard(_menu_tallbuild);

var _menu_back = __webpack_require__(8);

var menu_back = _interopRequireWildcard(_menu_back);

var _help = __webpack_require__(7);

var help = _interopRequireWildcard(_help);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


named_ctx.first3d = '/media/HLT_D1/index.html';
named_ctx.product = [{ name: 'xx', image_2d: '/static/images/2d3d/pic_星空独栋户型图.jpg' }];

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _home = __webpack_require__(21);

var live_page_home = _interopRequireWildcard(_home);

var _page = __webpack_require__(24);

var page500 = _interopRequireWildcard(_page);

var _contact = __webpack_require__(19);

var contact = _interopRequireWildcard(_contact);

var _block_pos = __webpack_require__(18);

var block_pos = _interopRequireWildcard(_block_pos);

var _six = __webpack_require__(25);

var six = _interopRequireWildcard(_six);

var _garden = __webpack_require__(20);

var garden = _interopRequireWildcard(_garden);

var _page3d = __webpack_require__(23);

var page3d = _interopRequireWildcard(_page3d);

var _page2d = __webpack_require__(22);

var page2d = _interopRequireWildcard(_page2d);

var _vedio_page = __webpack_require__(26);

var vedio_page = _interopRequireWildcard(_vedio_page);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

__webpack_require__(64);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


window.play_music = function (music) {
    //var audio = document.createElement("AUDIO")
    //document.body.appendChild(audio);
    ////audio.loop = 'loop'
    //audio.src = music

    //document.body.addEventListener("mousemove", function () {
    //    audio.play()
    //})
    //document.addEventListener('click', function () {
    //    audio.play()
    //});
    var audio = new Audio(music);
    audio.loop = true;
    setInterval(function () {
        audio.play().catch(function (error) {
            console.log(error);
        });
        console.log('play');
    }, 5000);
    document.addEventListener('click', function () {
        audio.play();
    });

    //document.addEventListener('touchend', function () {
    //    audio.play()
    //});
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(47);

Vue.component('com-btn-back', {
    template: '<div class="com-btn-back" @click="back()">\n        <img src="/static/images/page500/button_\u8FD4\u56DE.png" alt="">\n    </div>',
    methods: {
        back: function back() {
            history.back();
        }
    }
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(48);

Vue.component('com-pop-help', {
    template: '<div class="com-pop-help">\n    <div class="close-btn" @click="get_close()">\n        <img src="/static/images/help/button_\u5173\u95ED.png" alt="">\n    </div>\n     <div class="handle-btn">\n        <img src="/static/images/help/pic_\u6559\u7A0B1.png" alt="">\n     </div>\n     <div class="handle-btn">\n        <img src="/static/images/help/pic_\u6559\u7A0B2.png" alt="">\n     </div>\n     <div class="handle-btn">\n        <img src="/static/images/help/pic_\u6559\u7A0B3.png" alt="">\n     </div>\n     <div class="i-know" @click="get_close()">\n     <img src="/static/images/help/button_\u77E5\u9053\u4E86.png" alt="">\n     </div>\n    </div>',
    methods: {
        get_close: function get_close() {
            this.$emit('finish');
        }
    }
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//require('./styl/menu_back.styl')

Vue.component('com-menu-back', {
    template: '<div class="com-menu-back">\n\n    <!--<div class="mybtn main-menu" @click="is_open = !is_open">-->\n        <!--<img src="/static/images/2d3d/button_\u83DC\u53551.png" alt="">-->\n    <!--</div>-->\n     <!--<div class="mybtn main-menu" @click="back()">-->\n           <!--<img src="/static/images/page500/button_\u8FD4\u56DE.png" alt="">-->\n     <!--</div>-->\n        <com-btn-back class="normal-back-btn"></com-btn-back>\n\n    </div>',
    data: function data() {
        return {
            //is_open:true,
            parStore: ex.vueParStore(this)
        };
    },

    methods: {
        //home(){
        //    location = '/'
        //},
        //goto_po(){
        //    location ='/mb/page3d?page=' + this.parStore.ctx.po_3d
        //    //live_root.open_live('live_page_3d',{menu_circle:'com-menu-circle',menu_vertical:'com-menu-vertical'})
        //},
        //back(){
        //    history.back()
        //},
        //goto_720(){
        //    location ='/mb/page720?page=' + this.parStore.ctx.page_720
        //}
    }
});

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(49);

Vue.component('com-menu-circle', {
    template: '<div class="com-menu-circle">\n    <div class="mybtn main-menu" @click="is_open = !is_open">\n        <img src="/static/images/2d3d/button_\u83DC\u53551.png" alt="">\n    </div>\n     <transition name="btn-fade">\n        <div v-show="is_open">\n            <div class="mybtn back-btn" @click="back()">\n                <img src="/static/images/page500/button_\u8FD4\u56DE.png" alt="">\n            </div>\n             <div class="mybtn btn-720">\n                <img src="/static/images/2d3d/button_720.png" alt="">\n            </div>\n              <div class="mybtn btn-first-page" @click="home()">\n                <img src="/static/images/2d3d/button_\u9996\u9875.png" alt="">\n            </div>\n        </div>\n    </transition>\n\n    </div>',
    data: function data() {
        return {
            is_open: true
        };
    },

    methods: {
        home: function home() {
            location = '/';
        },
        back: function back() {
            history.back();
        }
    }
});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Vue.component('com-menu-circle-2d', {
    template: '<div class="com-menu-circle-2d com-menu-circle">\n    <div class="mybtn main-menu" @click="is_open = !is_open">\n        <!--<img src="/static/images/2d3d/button_\u83DC\u53551.png" alt="">-->\n        <img src="/static/images/2d3d/\u6237\u578B.png" alt="">\n    </div>\n     <transition name="btn-fade">\n        <div v-show="is_open">\n            <div class="mybtn back-btn" @click="back()">\n                <img src="/static/images/page500/button_\u8FD4\u56DE.png" alt="">\n            </div>\n             <div class="mybtn btn-720" @click="goto_po()">\n                <img src="/static/images/2d3d/button_\u5256\u5207\u6237\u578B1.png" alt="">\n            </div>\n              <div class="mybtn btn-first-page"  @click="goto_720()">\n                <!--<img src="/static/images/2d3d/button_\u9996\u9875.png" alt="">-->\n                 <img src="/static/images/2d3d/button_720.png" alt="">\n            </div>\n        </div>\n    </transition>\n\n    </div>',
    data: function data() {
        return {
            is_open: true,
            parStore: ex.vueParStore(this)
        };
    },

    methods: {
        home: function home() {
            location = '/';
        },
        goto_po: function goto_po() {
            location = '/mb/page3d?page=' + this.parStore.ctx.po_3d;
            //live_root.open_live('live_page_3d',{menu_circle:'com-menu-circle',menu_vertical:'com-menu-vertical'})
        },
        back: function back() {
            history.back();
        },
        goto_720: function goto_720() {
            location = '/mb/page720?page=' + this.parStore.ctx.page_720;
        }
    }
});

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(50);

Vue.component('com-menu-circle-720', {
    template: '<div class="com-menu-circle-720">\n     <div class="mybtn main-menu" @click="is_open = !is_open">\n           <img src="/static/images/2d3d/button_720.png" alt="">\n    </div>\n     <transition name="btn-fade">\n        <div v-show="is_open">\n            <div class="mybtn back-btn" @click="back()">\n                <img src="/static/images/page500/button_\u8FD4\u56DE.png" alt="">\n            </div>\n             <div class="mybtn btn-house" @click="open_house()">\n                <img src="/static/images/2d3d/\u6237\u578B.png" alt="">\n            </div>\n            <div class="mybtn btn-po" @click="goto_po()">\n                <img src="/static/images/2d3d/button_\u5256\u5207\u6237\u578B1.png" alt="">\n            </div>\n\n        </div>\n    </transition>\n\n    </div>',
    data: function data() {
        return {
            is_open: true,
            parStore: ex.vueParStore(this)
        };
    },

    methods: {
        home: function home() {
            location = '/';
        },
        back: function back() {
            history.back();
        },
        open_house: function open_house() {
            location = '/mb/page2d?page=' + this.parStore.ctx.page2d;
            //var active =this.parStore.ctx.active
            //live_root.open_live('live_page_2d',{menu_circle:'com-menu-circle-2d',content_img:named_ctx.product[active].image_2d})
        },
        goto_po: function goto_po() {
            location = '/mb/page3d?page=' + this.parStore.ctx.po_3d;
        }
    }
});

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(51);

Vue.component('com-menu-circle-d', {
    template: '<div class="com-menu-circle-d">\n    <!--<div class="mybtn main-menu" @click="is_open = !is_open">-->\n        <!--<img src="/static/images/2d3d/button_\u83DC\u53551.png" alt="">-->\n    <!--</div>-->\n     <div class="mybtn main-menu" @click="is_open = !is_open">\n           <img v-if="parStore.ctx.crt_btn ==\'d1\'" src="/static/images/2d3d/button_D1.png" alt="">\n           <img v-if="parStore.ctx.crt_btn ==\'d2\'" src="/static/images/2d3d/button_D2.png" alt="">\n           <img  v-if="parStore.ctx.crt_btn ==\'d3\'" src="/static/images/2d3d/button_D3.png" alt="">\n    </div>\n     <transition name="btn-fade">\n        <div v-show="is_open">\n            <div class="mybtn back-btn" @click="back()">\n                <img src="/static/images/page500/button_\u8FD4\u56DE.png" alt="">\n            </div>\n             <div class="mybtn btn-house" @click="open_house()">\n                <img src="/static/images/2d3d/\u6237\u578B.png" alt="">\n            </div>\n            <div class="mybtn btn-po" @click="goto_po()">\n                <img src="/static/images/2d3d/button_\u5256\u5207\u6237\u578B1.png" alt="">\n            </div>\n\n            <div class="mybtn btn-720"  @click="goto_720()">\n                <img src="/static/images/2d3d/button_720.png" alt="">\n            </div>\n\n            <!--<div class="mybtn btn-first-page" @click="home()">-->\n                <!--<img src="/static/images/2d3d/button_\u9996\u9875.png" alt="">-->\n            <!--</div>-->\n\n        </div>\n    </transition>\n\n    </div>',
    data: function data() {
        return {
            is_open: true,
            parStore: ex.vueParStore(this)
        };
    },

    methods: {
        home: function home() {
            location = '/';
        },
        back: function back() {
            history.back();
        },
        open_house: function open_house() {
            location = '/mb/page2d?page=' + this.parStore.ctx.page2d;
            //var active =this.parStore.ctx.active
            //live_root.open_live('live_page_2d',{menu_circle:'com-menu-circle-2d',content_img:named_ctx.product[active].image_2d})
        },
        goto_po: function goto_po() {
            location = '/mb/page3d?page=' + this.parStore.ctx.po_3d;
        },
        goto_720: function goto_720() {
            location = '/mb/page720?page=' + this.parStore.ctx.page_720;
        }
    }
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(52);

Vue.component('com-menu-circle-dp', {
    template: '<div class="com-menu-circle-dp">\n    <div class="mybtn main-menu" @click="is_open = !is_open">\n        <img src="/static/images/2d3d/button_\u83DC\u53551.png" alt="">\n    </div>\n\n     <transition name="btn-fade">\n        <div v-show="is_open">\n            <div class="mybtn back-btn" @click="back()">\n                <img src="/static/images/page500/button_\u8FD4\u56DE.png" alt="">\n            </div>\n              <div class="mybtn btn-first-page" @click="home()">\n                <img src="/static/images/2d3d/button_\u9996\u9875.png" alt="">\n            </div>\n\n            <div class="mybtn d1" @click="open_d1()">\n                <img  src="/static/images/2d3d/button_D1.png" alt="">\n            </div>\n            <div class="mybtn d2" @click="open_d2()">\n                <img  src="/static/images/2d3d/button_D2.png" alt="">\n\n            </div>\n             <div class="mybtn d3" @click="open_d3()">\n                <img  src="/static/images/2d3d/button_D3.png" alt="">\n            </div>\n        </div>\n    </transition>\n\n    </div>',
    data: function data() {
        return {
            is_open: true
        };
    },

    methods: {
        home: function home() {
            location = '/';
        },
        back: function back() {
            history.back();
        },
        open_d1: function open_d1() {
            location = '/mb/page3d?page=xing_kong';
            //live_root.open_live('live_page_3d',live_root.link_ctx.xing_kong)
        },
        open_d2: function open_d2() {
            location = '/mb/page3d?page=xing_yue';
        },
        open_d3: function open_d3() {
            location = '/mb/page3d?page=xing_hai';
        }
    }
});

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(53);

Vue.component('com-menu-po', {
    template: '<div class="com-menu-po">\n    <div class="mybtn main-menu" @click="is_open = !is_open">\n         <img src="/static/images/2d3d/button_\u5256\u5207\u6237\u578B1.png" alt="">\n    </div>\n     <transition name="btn-fade">\n        <div v-show="is_open">\n            <div class="mybtn back-btn" @click="back()">\n                <img src="/static/images/page500/button_\u8FD4\u56DE.png" alt="">\n            </div>\n             <div class="mybtn btn-720" @click="goto_720()">\n                <img src="/static/images/2d3d/button_720.png" alt="">\n            </div>\n              <div class="mybtn btn-first-page" @click="open_house()">\n               <img src="/static/images/2d3d/\u6237\u578B.png" alt="">\n            </div>\n        </div>\n    </transition>\n\n    </div>',
    data: function data() {
        return {
            is_open: true,
            parStore: ex.vueParStore(this)
        };
    },

    methods: {
        home: function home() {
            location = '/';
        },
        back: function back() {
            history.back();
        },
        open_house: function open_house() {
            location = '/mb/page2d?page=' + this.parStore.ctx.page2d;
        },
        goto_720: function goto_720() {
            location = '/mb/page720?page=' + this.parStore.ctx.page_720;
        }
    }
});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(54);

Vue.component('com-menu-tallbuild', {
    template: '<div class="com-menu-tallbuild com-menu-circle-2d com-menu-circle">\n    <div class="mybtn main-menu" @click="is_open = !is_open">\n        <img src="/static/images/2d3d/button_\u83DC\u53551.png" alt="">\n    </div>\n     <transition name="btn-fade">\n        <div v-show="is_open">\n            <div class="mybtn back-btn" @click="back()">\n                <img src="/static/images/page500/button_\u8FD4\u56DE.png" alt="">\n            </div>\n             <!--<div class="mybtn btn-720" @click="goto_po()">-->\n                <!--<img src="/static/images/2d3d/button_\u5256\u5207\u6237\u578B1.png" alt="">-->\n            <!--</div>-->\n              <div class="mybtn btn-first-page"  @click="home()">\n                <img src="/static/images/2d3d/button_\u9996\u9875.png" alt="">\n                 <!--<img src="/static/images/2d3d/button_720.png" alt="">-->\n            </div>\n        </div>\n    </transition>\n\n    </div>',
    data: function data() {
        return {
            is_open: true,
            parStore: ex.vueParStore(this)
        };
    },

    methods: {
        home: function home() {
            location = '/';
        },
        goto_po: function goto_po() {
            location = '/mb/page3d?page=' + this.parStore.ctx.po_3d;
            //live_root.open_live('live_page_3d',{menu_circle:'com-menu-circle',menu_vertical:'com-menu-vertical'})
        },
        back: function back() {
            history.back();
        },
        goto_720: function goto_720() {
            location = '/mb/page720?page=' + this.parStore.ctx.page_720;
        }
    }
});

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(55);

Vue.component('com-menu-vertical', {
    template: '<div class="com-menu-vertical">\n    <div class="mybtn f1" @click="open_f1()">\n        <img src="/static/images/2d3d/button_F1.png" alt="">\n    </div>\n    <div class="mybtn f2" @click="open_f2()">\n        <img src="/static/images/2d3d/button_F2.png" alt="">\n    </div>\n\n    </div>',
    data: function data() {
        return {
            parStore: ex.vueParStore(this)
        };
    },

    methods: {
        //open_help(){
        //    cfg.pop_small('com-pop-help',{})
        //}
        open_f1: function open_f1() {
            if (this.parStore.ctx.crt_btn != 'f1' && this.parStore.ctx.f1_page) {
                var url = ex.appendSearch('/mb/page3d', { page: this.parStore.ctx.f1_page });
                location = url;
            }
            //if(this.parStore.ctx.active !=0){
            //    live_root.open_live('live_page_3d',{menu_circle:'com-menu-circle-lg',menu_vertical:'com-menu-vertical-d',active:0})
            //}
        },
        open_f2: function open_f2() {
            if (this.parStore.ctx.crt_btn != 'f2' && this.parStore.ctx.f2_page) {
                var url = ex.appendSearch('/mb/page3d', { page: this.parStore.ctx.f2_page });
                location = url;
            }
        }
    }
});

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(56);

Vue.component('com-menu-vertical-d', {

    template: '<div class="com-menu-vertical-d">\n    <div class="mybtn f1" @click="open_d1()">\n        <img v-if="parStore.ctx.crt_btn !=\'d1\'" src="/static/images/2d3d/button_D1.png" alt="">\n        <img v-else src="/static/images/2d3d/button_D1\u7070.png" alt="">\n    </div>\n    <div class="mybtn f2" @click="open_d2()">\n        <img v-if="parStore.ctx.crt_btn !=\'d2\'" src="/static/images/2d3d/button_D2.png" alt="">\n         <img v-else src="/static/images/2d3d/button_D2\u7070.png" alt="">\n    </div>\n     <div class="mybtn f3" @click="open_d3()">\n        <img  v-if="parStore.ctx.crt_btn !=\'d3\'" src="/static/images/2d3d/button_D3.png" alt="">\n        <img v-else src="/static/images/2d3d/button_D3\u7070.png" alt="">\n    </div>\n\n    </div>',
    data: function data() {
        return {
            parStore: ex.vueParStore(this)
        };
    },

    methods: {
        open_d1: function open_d1() {
            if (this.parStore.ctx.crt_btn != 'd1') {
                location = '/mb/page3d?page=xing_kong';
            }
            //if(this.parStore.ctx.active !=0){
            //    live_root.open_live('live_page_3d',{menu_circle:'com-menu-circle-lg',menu_vertical:'com-menu-vertical-d',active:0})
            //}
        },
        open_d2: function open_d2() {
            if (this.parStore.ctx.crt_btn != 'd2') {
                location = '/mb/page3d?page=xing_yue';
            }
        },
        open_d3: function open_d3() {
            if (this.parStore.ctx.crt_btn != 'd3') {
                location = '/mb/page3d?page=xing_hai';
            }
        }
    }
});

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(57);

window.live_block_pos = {
    props: ['ctx'],
    basename: 'live-block-pos',
    template: '<div class="com-live-block-pos general-page">\n    <div class="scroll-area">\n           <div class="banner">\n            <img src="/static/images/block/back_\u533A\u4F4D\u56FE\u5E95\u56FE.jpg" alt="">\n        </div>\n        <div class="devid-line title-line">\n            <img src="/static/images/pic_\u5206\u5272\u7EBF.png" alt="">\n        </div>\n        <div class="mytitle">\n            <span>\u5929\u5E9C\u65B0\u533A\u6838\u5FC3\u5C45\u4F4F\u533A\u533A\u4F4D\u56FE</span>\n        </div>\n        <div class="right-title">\n            <span>\u533A\u4F4D\u56FE</span>\n        </div>\n       <com-btn-back class="normal-back-btn"></com-btn-back>\n\n    </div>\n    </div>',
    mounted: function mounted() {
        if (ex.os.isTablet) {
            var hh = window.innerWidth / 0.563;
            $(this.$el).find('.scroll-area').height(hh + 'px');
        }
    },

    methods: {}
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(58);

window.live_contact = {
    props: ['ctx'],
    basename: 'live-contact',
    template: '<div class="com-live-contact general-page">\n    <div class="scroll-area">\n        <div class="contace0" >\n            <img src="/static/images/button_\u8054\u7CFB\u65B9\u5F0F_1.png" alt="">\n        </div>\n        <div class="contace1">\n            <img src="/static/images/contact/txt_\u8054\u7CFB1.png" alt="">\n        </div>\n        <div class="contact2">\n            <img src="/static/images/contact/txt_\u8054\u7CFB2.png" alt="">\n        </div>\n        <div class="contact3">\n            <img src="/static/images/contact/txt_\u8054\u7CFB3.png" alt="">\n        </div>\n       <com-btn-back class="normal-back-btn"></com-btn-back>\n    </div>\n\n    </div>',
    mounted: function mounted() {
        if (ex.os.isTablet) {
            var hh = window.innerWidth / 0.563;
            $(this.$el).find('.scroll-area').height(hh + 'px');
        }
    },

    methods: {}
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(59);

window.live_garden = {
    props: ['ctx'],
    basename: 'live-garden',
    template: '<div class="com-live-garden general-page">\n    <div class="scroll-area">\n        <div class="banner">\n            <img src="/static/images/block/back_\u516C\u56ED\u914D\u5957.jpg" alt="">\n        </div>\n        <div class="title1">\n            <span>\u81EA\u7136\u6DF1\u5904.\u8FD1\u4EAB\u9187\u719F</span>\n        </div>\n        <div class="title2">\n            <span>Starlight Lakeshore</span>\n        </div>\n        <div class="devid-line title-line">\n            <img src="/static/images/pic_\u5206\u5272\u7EBF.png" alt="">\n        </div>\n        <div class="title4">\n            <div>\u4E2D\u94C1.\u661F\u6708\u5C71\u6E56\u5750\u843D\u4E8E\u4E2D\u94C1\u9ED1\u9F99\u6EE9.\u56FD\u9645\u65C5\u6E38\u5EA6\u5047\u533A\u7684\u6838\u5FC3\u677F\u5757\u5185,</div>\n            <div>\u88AB200\u4EA9\u6E7F\u5730\u516C\u56ED\u73AF\u62B1\u3002\u5343\u4EA9\u6E7F\u5730\u751F\u6001\u516C\u56ED\u4E0E\u89C4\u5212\u4E2D\u7684</div>\n            <div>\u56DB\u5DDD\u7701\u4EBA\u6C11\u533B\u9662\u8FD1\u5728\u54AB\u5C3A\uFF0C\u6B65\u884C10\u5206\u949F\u5373\u8FBE\u91D1\u6C99\u6E7E\u56FD\u9645\u5EA6\u5047\u6838\u5FC3\u533A\u3002</div>\n            <div>\u79BB\u5C18\u4E0D\u79BB\u57CE\u3001\u95F9\u4E2D\u53D6\u9759\u7684\u8212\u9002\u65F6\u5149\u89E6\u624B\u53EF\u53CA\u3002</div>\n        </div>\n         <div class="right-title">\n            <span>\u516C\u56ED\u914D\u5957</span>\n        </div>\n       <com-btn-back class="normal-back-btn"></com-btn-back>\n    </div>\n    </div>',
    mounted: function mounted() {
        if (ex.os.isTablet) {
            var hh = window.innerWidth / 0.563;
            $(this.$el).find('.scroll-area').height(hh + 'px');
        }
    },

    methods: {}
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(60);

window.live_home = {
    props: ['ctx'],
    basename: 'live-home',
    template: '<div class="com-live-home" >\n\n    <div class="scroll-area" :class="{\'btn-animate\':btn_animate}">\n        <div class="middle-wrap">\n              <div class="light">\n                    <img src="/static/images/\u52A8\u753B-\u5149\u5708.png" alt="">\n                </div>\n                <div class="liuxing">\n                    <img src="/static/images/\u52A8\u753B-\u6D41\u661F.png" alt="">\n                </div>\n\n\n                   <div class="mybtn btn_500 fade-in-btn level-1"  @click="open_500()">\n                        <img src="/static/images/button_500_1.png" alt="">\n                       <div class="mytitle">\u54C1<span>\u724C</span></div>\n                    </div>\n                   <div class="mybtn btn_block fade-in-btn level-1"  @click="open_block()">\n                        <img src="/static/images/button_\u533A\u57DF_1.png" alt="">\n                       <div class="mytitle">\u533A<span>\u57DF</span></div>\n                    </div>\n                   <div class="mybtn produce btn_produce fade-in-btn level-1"  @click="open_product()">\n                        <img src="/static/images/button_\u4EA7\u54C1_1.png?v=1" alt="">\n                       <div class="mytitle">\u4EA7<span>\u54C1</span></div>\n                   </div>\n\n                    <!--<div class="mybtn contact" @click="open_contact()">-->\n                        <!--<img src="/static/images/button_\u8054\u7CFB\u65B9\u5F0F_1.png" alt="">-->\n                       <!--<div class="mytitle">\u8054\u7CFB\u65B9<span>\u5F0F</span></div>-->\n                    <!--</div>-->\n                     <div class="mybtn contact fade-in-btn level-1" @click="open_video()">\n                        <img src="/static/images/button_\u64AD\u653E.png" alt="">\n                       <div class="mytitle">\u5BA3\u4F20<span>\u7247</span></div>\n                    </div>\n\n\n\n            <!--<transition name="btn-fade">-->\n                 <div v-show="crt_model==\'block\'" class="level-block">\n                       <div class="mybtn block-posion after-btn" @click="open_block_pos()">\n                            <img src="/static/images/block_btn/\u533A\u4F4D.png" alt="" >\n                        </div>\n                         <div class="mybtn six after-btn" @click="open_six()">\n                            <img src="/static/images/block_btn/\u4E00\u6E7E\u516D\u6838.png" alt="" >\n                        </div>\n                         <div class="mybtn garden after-btn " @click="open_garden()">\n                            <img src="/static/images/block_btn/\u516C\u56ED\u914D\u5957.png" alt="" >\n                        </div>\n\n\n                 </div>\n\n             <!--</transition>-->\n                <!--<transition name="btn-fade">-->\n                  <div v-show="crt_model==\'produce\'" class="level-product">\n                       <div class="mybtn overloap-btn after-btn " @click="open_overlap()">\n                            <img src="/static/images/product/button_\u53E0\u62FC_1.png" alt="">\n                        </div>\n                         <div class="mybtn tall-build after-btn " @click="open_tall_build()">\n                            <img src="/static/images/product/button_\u9AD8\u5C42_1.png" alt="">\n                        </div>\n                         <div class="mybtn fashion after-btn" @click="open_yang_fang()">\n                            <img src="/static/images/product/button_\u6D0B\u623F_1.png" alt="">\n                        </div>\n                   </div>\n                <!--</transition>-->\n            </div>\n\n            <transition name="fade">\n               <div class="my-model whole-page" v-show="crt_model!=\'\'" @click="crt_model=\'\'"></div>\n            </transition>\n        <!--<iframe src="https://www.w3school.com.cn/tiy/t.asp?f=html5_audio_autoplay" frameborder="0">-->\n             <!--<audio controls="controls" autoplay="autoplay">-->\n                  <!--<source src="/music" type="audio/mpeg" />-->\n                <!--Your browser does not support the audio element.-->\n                <!--</audio>-->\n\n                <iframe v-if="ctx.musice" src="/music" allow="autoplay" frameborder="0" style="display: none" ></iframe>\n        <!--</iframe>-->\n\n        </div>\n\n    </div>',
    data: function data() {
        return {
            crt_model: '',
            show: false,
            btn_animate: true

            //show_light:true,
        };
    },
    mounted: function mounted() {
        var _this = this;

        if (ex.os.isTablet) {
            var hh = window.innerWidth / 0.563;
            $(this.$el).find('.scroll-area').height(hh + 'px');
            //$('#main-panel').css('overflow','auto')
        }
        Vue.nextTick(function () {
            live_root.link_ctx = _this.ctx.link_ctx;

            //window.audio= new Audio(this.ctx.musice)
            //var self =this
            //function play(){
            //    window.audio.autoplay = true
            //    window.audio.play()
            //
            //}
            //document.addEventListener('click', play);
            //document.addEventListener('touchend', play);
        });

        //play_music(this.ctx.musice)

        $(this.$el).find('.level-1').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
            $(this).removeClass('fade-in-btn');
        });

        $(this.$el).find('.after-btn').bind('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
            $(this).removeClass('fade-in-btn');
        });
    },

    watch: {
        crt_model: function crt_model(nv, ov) {
            if (ex.isin(nv, ['block', 'produce'])) {
                $(this.$el).find('.btn_' + nv).addClass('active');
            }
            if (ex.isin(ov, ['block', 'produce'])) {
                $(this.$el).find('.btn_' + ov).removeClass('active');
            }
        }
    },
    methods: {
        activated: function activated() {
            //setTimeout(()=>{
            //    this.btn_animate=true
            //},500)
        },
        deactivated: function deactivated() {
            //this.btn_animate=false
        },
        open_video: function open_video() {
            //live_root.open_live('live_video_page',{src:this.ctx.video_src})
            location = '/mb/video?page=ad_video';
        },
        open_500: function open_500() {
            live_root.open_live('live_page500', {});
        },
        open_block: function open_block() {
            if (!this.crt_model) {
                this.crt_model = 'block';
                $(this.$el).find('.level-block .after-btn').addClass('fade-in-btn');
            } else {
                this.crt_model = '';
            }
        },
        open_contact: function open_contact() {
            live_root.open_live('live_contact', {});
        },
        open_block_pos: function open_block_pos() {
            //live_root.open_live('live_block_pos',{})
            live_root.open_live('live_page_2d', this.ctx.link_ctx.block_image);
        },
        open_six: function open_six() {
            //live_root.open_live('live_six',{})
            live_root.open_live('live_page_2d', this.ctx.link_ctx.one_six);
        },
        open_garden: function open_garden() {
            //live_root.open_live('live_garden',{})
            live_root.open_live('live_page_2d', this.ctx.link_ctx.garden);
        },
        open_product: function open_product() {
            if (!this.crt_model) {
                this.crt_model = 'produce';
                $(this.$el).find('.level-product .after-btn').addClass('fade-in-btn');
            } else {
                this.crt_model = '';
            }
        },
        open_overlap: function open_overlap() {
            location = '/mb/page3d?page=overlap';
            //live_root.open_live('live_page_3d',this.ctx.link_ctx.overlap)
            //live_root.open_live('live_page_3d',{menu_circle:'com-menu-circle-sm',menu_vertical:'com-menu-vertical-d',link3d:named_ctx.first3d})
            //live_root.open_live('live_page_3d',{menu_circle:'com-menu-circle',menu_vertical:'com-menu-vertical'})
        },
        open_tall_build: function open_tall_build() {

            //location = '/mb/page2d?page=tall_buiding_2d'

            live_root.open_live('live_page_2d', this.ctx.link_ctx.tall_buiding_2d);

            //live_root.open_live('live_page_2d',{menu_circle:'com-menu-circle',content_img:'/static/images/2d3d/pic_高层户型图.jpg'})
        },
        open_yang_fang: function open_yang_fang() {
            //location = '/mb/page2d?page=yang_fang_2d'
            live_root.open_live('live_page_2d', this.ctx.link_ctx.yang_fang_2d);
        }
    }
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(61);

window.live_page_2d = {
    props: ['ctx'],
    basename: 'live-page-2d',
    template: '<div class="com-live-page-2d">\n    <div class="content">\n        <img  :src="ctx.img_url" alt="">\n    </div>\n    <component :is="ctx.menu_circle"></component>\n    <iframe v-if="ctx.musice" src="/music" allow="autoplay" frameborder="0" style="display: none" ></iframe>\n    </div>',
    data: function data() {
        var childStore = new Vue();
        childStore.ctx = this.ctx;
        return {
            childStore: childStore
        };
    },
    mounted: function mounted() {
        if (this.ctx.music) {
            //play_music(this.ctx.music)
        }
    },

    methods: {}
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(62);

window.live_page_3d = {
    props: ['ctx'],
    basename: 'live-page-3d',
    template: '<div class="com-live-page-3d">\n    <component :is="ctx.menu_circle"></component>\n     <component :is="ctx.menu_vertical" ></component>\n\n     <iframe v-show="is_show"  :src="ctx.link3d" style="width: 100%;height: 100%"></iframe>\n     <!--<iframe allowvr="yes" scrolling="no"  :src="ctx.link3d" frameborder="0" width="100%" height="100%"></iframe>-->\n     <iframe v-if="ctx.musice" src="/music" allow="autoplay" frameborder="0" style="display: none" ></iframe>\n    </div>',
    data: function data() {
        var childStore = new Vue();
        childStore.ctx = this.ctx;
        return {
            childStore: childStore,
            myurl: '',
            is_show: false
        };
    },
    mounted: function mounted() {
        var _this = this;

        if (this.ctx.show_help) {
            cfg.pop_small('com-pop-help', {});
        }
        //setTimeout(()=>{
        //    this.myurl=this.ctx.link3d
        //    setTimeout(()=>{
        //        //this.myurl=this.ctx.link3d
        //        this.is_show=true
        //    },500)
        //},500)
        setTimeout(function () {
            _this.is_show = true;
        }, 500);
        //if(this.ctx.music){
        //    play_music(this.ctx.music)
        //}
    },

    methods: {}
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(63);

window.live_page500 = {
    props: ['ctx'],
    basename: 'live-page500',
    template: '<div class="com-live-page500 general-page">\n    <!--<div class="mytitle">-->\n        <!--<img src="/static/images/page500/txt_\u54C1\u724Clogo.png" alt="">-->\n    <!--</div>-->\n    <!--<div class="mytitle2">-->\n        <!--<img src="/static/images/page500/txt_\u54C1\u724C1.png" alt="">-->\n    <!--</div>-->\n    <div class="scroll-area">\n        <div class="mytitle">\n            <img src="/static/images/page500/txt_\u54C1\u724C_new.png" alt="">\n        </div>\n        <!--<div class="right-title">-->\n            <!--<span>\u54C1\u724C</span>-->\n        <!--</div>-->\n       <com-btn-back class="normal-back-btn "></com-btn-back>\n    </div>\n\n    </div>',
    mounted: function mounted() {
        if (ex.os.isTablet) {
            var hh = window.innerWidth / 0.563;
            $(this.$el).find('.scroll-area').height(hh + 'px');
        }
    },

    methods: {
        // page500-back-btn
    }
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(65);

window.live_six = {
    props: ['ctx'],
    basename: 'live-six',
    template: '<div class="com-live-six general-page">\n    <div class="scroll-area">\n            <div class="banner">\n                <img src="/static/images/block/back_\u4E00\u6E7E\u516D\u6838.jpg" alt="">\n            </div>\n            <div class="title1">\n                <span>\u4E00\u6E7E\u516D\u6838</span>\n            </div>\n            <div class="title2">\n                <span>\u5168\u7403\u89C6\u91CE\u4E0B\u7684\u521B\u65B0\u578B\u57CE\u5E02\u6837\u672C</span>\n            </div>\n             <div class="devid-line title-line">\n                <img src="/static/images/pic_\u5206\u5272\u7EBF.png" alt="">\n            </div>\n            <div class="title3">\n                <span>\u9762\u5411\u4E16\u754C\u7684\u591A\u7EF4\u4F4F\u5047\u57CE\u5E02\u201C\u4E00\u6E7E\u516D\u6838\u201D\u57CE\u5E02\u7EA7\u914D\u5957</span>\n            </div>\n\n             <div class="right-title">\n                <span>\u4E00\u6E7E\u516D\u6838</span>\n            </div>\n           <com-btn-back class="normal-back-btn"></com-btn-back>\n    </div>\n\n    </div>',
    mounted: function mounted() {
        if (ex.os.isTablet) {
            var hh = window.innerWidth / 0.563;
            $(this.$el).find('.scroll-area').height(hh + 'px');
        }
    },

    methods: {}
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(66);

window.live_video_page = {
    props: ['ctx'],
    basename: 'live-video-page',
    template: '<div class="com-live-video-page">\n    <div class="video-content">\n        <video :src="ctx.src" autoplay controls width="100%" height="auto"></video>\n    </div>\n    <com-btn-back class="normal-back-btn"></com-btn-back>\n    <!--<com-btn-back class="right-top-back-btn"></com-btn-back>-->\n    </div>',
    mounted: function mounted() {
        //if(ex.os.isTablet){
        //    var hh = window.innerWidth / 0.563
        //    $(this.$el).find('.scroll-area').height( hh +'px')
        //}
    },

    methods: {}
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-btn-back img {\n  width: 1rem;\n  height: auto;\n}\n", ""]);

// exports


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-pop-help {\n  background: #fff;\n  width: 4.5rem;\n  height: 7rem;\n  padding-top: 0.5rem;\n  border-radius: 0.3rem;\n}\n.com-pop-help .close-btn {\n  position: absolute;\n  right: -0.4rem;\n  top: -0.4rem;\n}\n.com-pop-help .close-btn img {\n  width: 1rem;\n}\n.com-pop-help .handle-btn {\n  text-align: center;\n  padding: 0.2rem 0;\n}\n.com-pop-help .handle-btn img {\n  width: 1.2rem;\n  height: auto;\n}\n.com-pop-help .i-know {\n  text-align: center;\n  padding-top: 0.4rem;\n}\n.com-pop-help .i-know img {\n  width: 1.2rem;\n}\n", ""]);

// exports


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-menu-circle {\n  position: absolute;\n  bottom: 1rem;\n  left: 50%;\n  transform: translateX(-50%);\n}\n.com-menu-circle .mybtn {\n  top: -1.5rem;\n}\n.com-menu-circle .mybtn img {\n  width: 0.9rem;\n}\n.com-menu-circle .main-menu {\n  left: -0.5rem;\n  top: -0.5rem;\n}\n.com-menu-circle .main-menu img {\n  width: 1.2rem;\n}\n.com-menu-circle .back-btn {\n  left: 1rem;\n}\n.com-menu-circle .btn-720 {\n  left: -0.4rem;\n}\n.com-menu-circle .btn-first-page {\n  left: -1.9rem;\n}\n.btn-fade-enter-active,\n.btn-fade-leave-active {\n  transition: all 0.5s;\n}\n.btn-fade-enter,\n.btn-fade-leave-to {\n  opacity: 0;\n  transform: scale(0.8);\n}\n", ""]);

// exports


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-menu-circle-720 {\n  position: absolute;\n  bottom: 1rem;\n  left: 50%;\n  transform: translateX(-50%);\n}\n.com-menu-circle-720 .mybtn {\n  top: -1.5rem;\n}\n.com-menu-circle-720 .mybtn img {\n  width: 0.9rem;\n}\n.com-menu-circle-720 .main-menu {\n  left: -0.5rem;\n  top: -0.5rem;\n}\n.com-menu-circle-720 .main-menu img {\n  width: 1.2rem;\n}\n.com-menu-circle-720 .back-btn {\n  left: 1.1rem;\n}\n.com-menu-circle-720 .btn-house {\n  left: -1.8rem;\n}\n.com-menu-circle-720 .btn-po {\n  left: -0.4rem;\n}\n", ""]);

// exports


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-menu-circle-d {\n  position: absolute;\n  bottom: 1rem;\n  left: 50%;\n  transform: translateX(-50%);\n}\n.com-menu-circle-d .mybtn {\n  top: -1.5rem;\n}\n.com-menu-circle-d .mybtn img {\n  width: 0.9rem;\n}\n.com-menu-circle-d .main-menu {\n  left: -0.5rem;\n  top: -0.5rem;\n}\n.com-menu-circle-d .main-menu img {\n  width: 1.2rem;\n}\n.com-menu-circle-d .back-btn {\n  left: 1.4rem;\n}\n.com-menu-circle-d .btn-house {\n  left: -1.8rem;\n}\n.com-menu-circle-d .btn-po {\n  left: -0.8rem;\n}\n.com-menu-circle-d .btn-720 {\n  left: 0.4rem;\n}\n", ""]);

// exports


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-menu-circle-dp {\n  position: absolute;\n  bottom: 1rem;\n  left: 50%;\n  transform: translateX(-50%);\n}\n.com-menu-circle-dp .mybtn {\n  top: -1.5rem;\n}\n.com-menu-circle-dp .mybtn img {\n  width: 0.9rem;\n}\n.com-menu-circle-dp .back-btn {\n  left: 1.5rem;\n}\n.com-menu-circle-dp .btn-first-page {\n  left: -2.5rem;\n}\n.com-menu-circle-dp .d1 {\n  left: -1.5rem;\n}\n.com-menu-circle-dp .d2 {\n  left: -0.5rem;\n}\n.com-menu-circle-dp .d3 {\n  left: 0.5rem;\n}\n.com-menu-circle-dp .main-menu {\n  left: -0.5rem;\n  top: -0.5rem;\n}\n.com-menu-circle-dp .main-menu img {\n  width: 1.2rem;\n}\n", ""]);

// exports


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-menu-po {\n  position: absolute;\n  bottom: 1rem;\n  left: 50%;\n  transform: translateX(-50%);\n}\n.com-menu-po .mybtn {\n  top: -1.5rem;\n}\n.com-menu-po .mybtn img {\n  width: 0.9rem;\n}\n.com-menu-po .main-menu {\n  left: -0.5rem;\n  top: -0.5rem;\n}\n.com-menu-po .main-menu img {\n  width: 1.2rem;\n}\n.com-menu-po .back-btn {\n  left: 1rem;\n}\n.com-menu-po .btn-720 {\n  left: -0.4rem;\n}\n.com-menu-po .btn-first-page {\n  left: -1.9rem;\n}\n", ""]);

// exports


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-menu-tallbuild .btn-first-page {\n  left: -1.6rem;\n}\n.com-menu-tallbuild .back-btn {\n  left: 0.8rem;\n}\n", ""]);

// exports


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-menu-vertical .f1 {\n  right: 0.2rem;\n  bottom: 6rem;\n}\n.com-menu-vertical .f2 {\n  right: 0.2rem;\n  bottom: 4rem;\n}\n", ""]);

// exports


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-menu-vertical-d .f1 {\n  right: 0.2rem;\n  bottom: 6rem;\n}\n.com-menu-vertical-d .f2 {\n  right: 0.2rem;\n  bottom: 4.7rem;\n}\n.com-menu-vertical-d .f3 {\n  right: 0.2rem;\n  bottom: 3.4rem;\n}\n", ""]);

// exports


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-live-block-pos .title-line {\n  padding-top: 0.3rem;\n}\n.com-live-block-pos .mytitle {\n  text-align: center;\n  padding-top: 0.2rem;\n  font-size: 0.28rem;\n  font-family: \"\\9ED1\\4F53\";\n  color: #fff;\n}\n", ""]);

// exports


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-live-contact {\n  background: url(\"/static/images/back_通用底图.jpg\");\n  height: var(--app-height);\n  width: var(--app-width);\n  background-size: 100% auto;\n  background-repeat: no-repeat;\n  background-position: center;\n  font-size: 0.3rem;\n  position: relative;\n}\n.com-live-contact .contace0 {\n  padding-top: 2rem;\n  text-align: center;\n}\n.com-live-contact .contace0 img {\n  width: 1rem;\n}\n.com-live-contact .contace1 {\n  padding-top: 0.5rem;\n  text-align: center;\n}\n.com-live-contact .contace1 img {\n  width: 4rem;\n}\n.com-live-contact .contact2 {\n  padding-top: 2rem;\n  text-align: center;\n}\n.com-live-contact .contact2 img {\n  width: 1.2rem;\n}\n.com-live-contact .contact3 {\n  padding: 1rem;\n  text-align: center;\n}\n.com-live-contact .contact3 img {\n  width: 4rem;\n}\n.com-live-contact .normal-back-btn {\n  position: absolute;\n  left: 50%;\n  bottom: 0.6rem;\n  transform: translateX(-50%);\n}\n.com-live-contact .normal-back-btn img {\n  width: 1rem;\n}\n", ""]);

// exports


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-live-garden {\n  text-align: center;\n  font-size: 0.28rem;\n  font-family: \"\\9ED1\\4F53\";\n  color: #fff;\n  vertical-align: middle;\n}\n.com-live-garden .title1 {\n  padding-top: 0.4rem;\n}\n.com-live-garden .title2 {\n  padding-top: 0.3rem;\n  font-family: Cambria;\n  font-size: 0.16rem;\n}\n.com-live-garden .title4 {\n  padding-top: 0.3rem;\n  font-size: 0.2rem;\n  line-height: 0.5rem;\n}\n", ""]);

// exports


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".btn-animate .fade-in-btn {\n  opacity: 0;\n  animation: fade-in 0.4s;\n  animation-fill-mode: forwards;\n}\n.com-live-home {\n  height: 100%;\n  width: 100%;\n  font-size: 0.3rem;\n  position: relative;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n}\n.com-live-home .scroll-area {\n  height: 100%;\n  width: 100%;\n  overflow: hidden;\n  position: relative;\n  background: url(\"/static/1123/back.jpg\");\n  background-size: 100% auto;\n  background-repeat: no-repeat;\n  background-position: center;\n}\n.com-live-home .btn_block {\n  animation-delay: 500ms;\n}\n.com-live-home .produce {\n  animation-delay: 1000ms;\n}\n.com-live-home .contact {\n  animation-delay: 1500ms;\n}\n.com-live-home .middle-wrap {\n  width: 0;\n  height: 0;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n}\n.com-live-home .middle-wrap .light {\n  position: absolute;\n  top: -3.8rem;\n  left: -4.8rem;\n  animation: lightmove 5s linear infinite;\n  opacity: 0;\n}\n.com-live-home .middle-wrap .light img {\n  width: 7.2rem;\n  height: auto;\n}\n@-moz-keyframes lightmove {\n  0% {\n    opacity: 0;\n  }\n  10% {\n    opacity: 0.4;\n  }\n  30% {\n    opacity: 1;\n  }\n  40% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n@-webkit-keyframes lightmove {\n  0% {\n    opacity: 0;\n  }\n  10% {\n    opacity: 0.4;\n  }\n  30% {\n    opacity: 1;\n  }\n  40% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n@-o-keyframes lightmove {\n  0% {\n    opacity: 0;\n  }\n  10% {\n    opacity: 0.4;\n  }\n  30% {\n    opacity: 1;\n  }\n  40% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n@keyframes lightmove {\n  0% {\n    opacity: 0;\n  }\n  10% {\n    opacity: 0.4;\n  }\n  30% {\n    opacity: 1;\n  }\n  40% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n.com-live-home .middle-wrap .liuxing {\n  position: absolute;\n  top: -15rem;\n  left: -8rem;\n  animation: liuxingmove 10s infinite;\n}\n.com-live-home .middle-wrap .liuxing img {\n  width: 7rem;\n  height: auto;\n}\n@-moz-keyframes liuxingmove {\n  from {\n    transform: translate(0, 0);\n  }\n  to {\n    transform: translate(13rem, 17rem);\n  }\n}\n@-webkit-keyframes liuxingmove {\n  from {\n    transform: translate(0, 0);\n  }\n  to {\n    transform: translate(13rem, 17rem);\n  }\n}\n@-o-keyframes liuxingmove {\n  from {\n    transform: translate(0, 0);\n  }\n  to {\n    transform: translate(13rem, 17rem);\n  }\n}\n@keyframes liuxingmove {\n  from {\n    transform: translate(0, 0);\n  }\n  to {\n    transform: translate(13rem, 17rem);\n  }\n}\n.com-live-home .middle-wrap .mybtn {\n  position: absolute;\n  text-align: center;\n}\n.com-live-home .middle-wrap .mybtn img {\n  width: 1rem;\n}\n.com-live-home .middle-wrap .mybtn .mytitle {\n  letter-spacing: 0.4rem;\n  font-size: 0.2rem;\n  color: #fff;\n  white-space: nowrap;\n}\n.com-live-home .middle-wrap .mybtn .mytitle span {\n  letter-spacing: 0;\n}\n.com-live-home .middle-wrap .mybtn.active {\n  z-index: 900;\n  position: relative;\n}\n.com-live-home .middle-wrap .mybtn.active::before {\n  pointer-events: none;\n  z-index: 800;\n  content: '';\n  display: block;\n  position: absolute;\n  width: 0.6rem;\n  height: 0.6rem;\n  border-width: 0.1rem;\n  border-style: solid;\n  top: 0.46rem;\n  left: 0.46rem;\n  box-sizing: border;\n  transform: translate(-50%, -50%);\n  animation: spread 3s infinite;\n}\n@-moz-keyframes spread {\n  0% {\n    opacity: 0;\n    width: 1rem;\n    height: 1rem;\n    border-radius: 1rem;\n    border-width: 0;\n    background-color: #fff;\n    border-color: rgba(100,100,100,0.3);\n  }\n  5% {\n    opacity: 0.3;\n    width: 1rem;\n    height: 1rem;\n    border-radius: 1rem;\n    border-width: 0.1rem;\n    background-color: #fff;\n    border-color: rgba(100,100,100,0.3);\n  }\n  100% {\n    opacity: 0;\n    width: 2.6rem;\n    height: 2.6rem;\n    border-radius: 2.6rem;\n    border-width: 1rem;\n    border-color: rgba(100,100,100,0);\n  }\n}\n@-webkit-keyframes spread {\n  0% {\n    opacity: 0;\n    width: 1rem;\n    height: 1rem;\n    border-radius: 1rem;\n    border-width: 0;\n    background-color: #fff;\n    border-color: rgba(100,100,100,0.3);\n  }\n  5% {\n    opacity: 0.3;\n    width: 1rem;\n    height: 1rem;\n    border-radius: 1rem;\n    border-width: 0.1rem;\n    background-color: #fff;\n    border-color: rgba(100,100,100,0.3);\n  }\n  100% {\n    opacity: 0;\n    width: 2.6rem;\n    height: 2.6rem;\n    border-radius: 2.6rem;\n    border-width: 1rem;\n    border-color: rgba(100,100,100,0);\n  }\n}\n@-o-keyframes spread {\n  0% {\n    opacity: 0;\n    width: 1rem;\n    height: 1rem;\n    border-radius: 1rem;\n    border-width: 0;\n    background-color: #fff;\n    border-color: rgba(100,100,100,0.3);\n  }\n  5% {\n    opacity: 0.3;\n    width: 1rem;\n    height: 1rem;\n    border-radius: 1rem;\n    border-width: 0.1rem;\n    background-color: #fff;\n    border-color: rgba(100,100,100,0.3);\n  }\n  100% {\n    opacity: 0;\n    width: 2.6rem;\n    height: 2.6rem;\n    border-radius: 2.6rem;\n    border-width: 1rem;\n    border-color: rgba(100,100,100,0);\n  }\n}\n@keyframes spread {\n  0% {\n    opacity: 0;\n    width: 1rem;\n    height: 1rem;\n    border-radius: 1rem;\n    border-width: 0;\n    background-color: #fff;\n    border-color: rgba(100,100,100,0.3);\n  }\n  5% {\n    opacity: 0.3;\n    width: 1rem;\n    height: 1rem;\n    border-radius: 1rem;\n    border-width: 0.1rem;\n    background-color: #fff;\n    border-color: rgba(100,100,100,0.3);\n  }\n  100% {\n    opacity: 0;\n    width: 2.6rem;\n    height: 2.6rem;\n    border-radius: 2.6rem;\n    border-width: 1rem;\n    border-color: rgba(100,100,100,0);\n  }\n}\n.com-live-home .middle-wrap .btn_500 {\n  left: -2.5rem;\n  top: -3rem;\n}\n.com-live-home .middle-wrap .btn_block {\n  left: -0.9rem;\n  top: -1.2rem;\n}\n.com-live-home .middle-wrap .produce {\n  left: -0.3rem;\n  top: 1rem;\n}\n.com-live-home .middle-wrap .contact {\n  left: -0.2rem;\n  top: 3.4rem;\n}\n.com-live-home .middle-wrap .contact .mytitle {\n  letter-spacing: 0.1rem;\n}\n.com-live-home .middle-wrap .block-posion {\n  left: -0.2rem;\n  top: -2.8rem;\n  animation-delay: 500ms;\n}\n.com-live-home .middle-wrap .six {\n  left: 0.8rem;\n  top: -1.7rem;\n  animation-delay: 1000ms;\n}\n.com-live-home .middle-wrap .garden {\n  left: 1rem;\n  top: -0.4rem;\n  animation-delay: 1500ms;\n}\n.com-live-home .middle-wrap .overloap-btn {\n  left: 0.5rem;\n  top: -0.5rem;\n  animation-delay: 500ms;\n}\n.com-live-home .middle-wrap .tall-build {\n  left: 1.4rem;\n  top: 0.6rem;\n  animation-delay: 1000ms;\n}\n.com-live-home .middle-wrap .fashion {\n  left: 1rem;\n  top: 2rem;\n  animation-delay: 1500ms;\n}\n.com-live-home .after-btn {\n  z-index: 900;\n}\n.com-live-home .my-model {\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0,0,0,0.3);\n}\n@-moz-keyframes fade-in {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@-webkit-keyframes fade-in {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@-o-keyframes fade-in {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes fade-in {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n", ""]);

// exports


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-live-page-2d {\n  height: 100%;\n  width: 100%;\n  font-size: 0.3rem;\n  position: relative;\n}\n.com-live-page-2d .content {\n  width: 100%;\n  height: 100%;\n  position: relative;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n}\n.com-live-page-2d .content img {\n  display: block;\n  width: 100%;\n  height: auto;\n}\n", ""]);

// exports


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-live-page-3d {\n  background: url(\"/static/images/pic_3d背景图.jpg?v=1\");\n  height: 100%;\n  width: 100%;\n  background-size: 100% auto;\n  background-repeat: no-repeat;\n  background-position: center;\n  font-size: 0.3rem;\n  position: relative;\n}\n", ""]);

// exports


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-live-page500 {\n  background: url(\"/static/images/page500/back_品牌.jpg\");\n  height: var(--app-height);\n  width: var(--app-width);\n  background-size: 100% auto;\n  background-repeat: no-repeat;\n  background-position: center;\n  font-size: 0.3rem;\n  position: relative;\n}\n.com-live-page500 .page500-back-btn {\n  position: absolute;\n  bottom: 1rem;\n  left: 50%;\n  transform: translateX(-50%);\n}\n.com-live-page500 .mytitle {\n  padding-top: 1rem;\n  text-align: center;\n}\n.com-live-page500 .mytitle img {\n  width: 2.6rem;\n  height: auto;\n}\n", ""]);

// exports


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".banner img {\n  width: 100%;\n  height: auto;\n}\n.general-page {\n  height: 100%;\n  width: 100%;\n  font-size: 0.3rem;\n  position: relative;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n}\n.general-page .scroll-area {\n  height: 100%;\n  width: 100%;\n  overflow: hidden;\n  position: relative;\n  background: url(\"/static/images/back_通用底图.jpg\");\n  background-size: 100% auto;\n  background-repeat: no-repeat;\n  background-position: center;\n}\n.normal-back-btn {\n  position: absolute;\n  left: 0.6rem;\n  bottom: 0.6rem;\n}\n.normal-back-btn img {\n  width: 0.8rem;\n}\n.right-top-back-btn {\n  position: absolute;\n  right: 0.5rem;\n  top: 0.5rem;\n}\n.right-top-back-btn img {\n  width: 0.8rem;\n}\n.mybtn {\n  position: absolute;\n  text-align: center;\n}\n.mybtn img {\n  width: 1rem;\n}\n.devid-line {\n  text-align: center;\n}\n.devid-line img {\n  width: 4rem;\n}\n.right-title {\n  color: #fff;\n  font-size: 0.3rem;\n  writing-mode: vertical-rl;\n  text-orientation: upright;\n  letter-spacing: 0.16rem;\n  position: absolute;\n  right: 0.5rem;\n  bottom: 0.3rem;\n  font-family: \"\\6977\\4F53\";\n  font-size: 0.4rem;\n  font-weight: 800;\n}\n.xy-fade-enter-active,\n.xy-fade-leave-active {\n  transition: opacity 14.5s;\n}\n.xy-fade-enter,\n.xy-fade-leave-to {\n  opacity: 0;\n}\n", ""]);

// exports


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-live-six {\n  text-align: center;\n  font-size: 0.28rem;\n  font-family: \"\\9ED1\\4F53\";\n  color: #fff;\n}\n.com-live-six .title1 {\n  padding-top: 0.3rem;\n  font-size: 0.28rem;\n  letter-spacing: 0.1rem;\n}\n.com-live-six .title2 {\n  padding-top: 0.2rem;\n  font-size: 0.32rem;\n  font-weight: 800;\n}\n.com-live-six .title3 {\n  padding-top: 0.5rem;\n  font-size: 0.2rem;\n}\n.com-live-six .title-line {\n  padding-top: 0.2rem;\n}\n", ""]);

// exports


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-live-video-page {\n  background-color: #000;\n  width: 100%;\n  height: 100%;\n  position: relative;\n}\n.com-live-video-page .video-content {\n  width: 100%;\n  height: auto;\n  position: absolute;\n  top: 50%;\n  transform: translateY(-50%);\n}\n", ""]);

// exports


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(27);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./back.styl", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./back.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(28);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./help.styl", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./help.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(29);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./menu_circle.styl", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./menu_circle.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(30);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./menu_circle_720.styl", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./menu_circle_720.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(31);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./menu_circle_lg.styl", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./menu_circle_lg.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(32);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./menu_circle_sm.styl", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./menu_circle_sm.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(33);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./menu_po.styl", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./menu_po.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(34);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./menu_tallbuild.styl", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./menu_tallbuild.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(35);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./menu_vertical.styl", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./menu_vertical.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(36);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./menu_vertical_d.styl", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./menu_vertical_d.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(37);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./block_pos.styl", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./block_pos.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(38);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./contact.styl", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./contact.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(39);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./garden.styl", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./garden.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(40);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./home.styl", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./home.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(41);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./page2d.styl", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./page2d.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(42);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./page3d.styl", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./page3d.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(43);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./page500.styl", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./page500.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(44);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./share.styl", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./share.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(45);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./six.styl", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./six.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(46);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./video_page.styl", function() {
			var newContent = require("!!../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./video_page.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _main = __webpack_require__(4);

var live_page_main = _interopRequireWildcard(_main);

var _main2 = __webpack_require__(2);

var com_main = _interopRequireWildcard(_main2);

var _data = __webpack_require__(3);

var data = _interopRequireWildcard(_data);

var _play_music = __webpack_require__(5);

var play_music = _interopRequireWildcard(_play_music);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ })
/******/ ]);