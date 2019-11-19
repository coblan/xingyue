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
/******/ 	return __webpack_require__(__webpack_require__.s = 250);
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


Object.defineProperty(exports, "__esModule", {
    value: true
});
__webpack_require__(10);

var com_sim_fields = exports.com_sim_fields = {
    props: {
        heads: '',
        row: '',
        okBtn: {
            default: function _default() {
                return '确定';
            }
        },
        crossBtn: '',
        autoWidth: {
            default: function _default() {
                return true;
            }
        },
        btnCls: {
            default: function _default() {
                return 'btn-primary btn-sm';
            }
        }
    },
    data: function data() {
        return {
            env: cfg.env,
            small: false
            //small_srn:ex.is_small_screen(),
        };
    },
    mounted: function mounted() {
        // 由于与nicevalidator 有冲突，所以等渲染完成，再检测
        var self = this;

        //setTimeout(function(){
        //    console.log('sss')
        //    self.update_small()
        //},5000)
    },
    watch: {
        //'evn.width':function (){
        //    var self=this
        //if($(self.$el).width() <450 ){
        //    self.small=true
        //}else{
        //    self.small=false
        //}
        //self.update_nice()
        //}
    },
    computed: {
        small_srn: function small_srn() {
            return this.env.width < 760;
        },
        //normed_heads:function(){
        //    return this.heads
        //},
        label_width: function label_width() {
            if (!this.autoWith) {}
            var max = 4;
            ex.each(this.heads, function (head) {
                if (max < head.label.length) {
                    max = head.label.length;
                }
            });
            max += 1;
            return { width: max + 'em' };
        }
    },
    //created:function(){
    //    if(!this.okBtn){
    //        this.okBtn='确定'
    //    }
    //},
    components: window._baseInput,
    mixins: [mix_fields_data, mix_nice_validator],
    template: ' <div :class="[\'field-panel sim-fields\',{\'msg-bottom\':small_srn}]"\n    style="text-align:center;">\n           <table class="table-fields">\n        <tr v-for="head in normed_heads">\n            <td class="field-label-td"  valign="top" >\n            <div class="field-label" :style="label_width">\n                <span class="label-content">\n                     <span v-text="head.label"></span>\n                     <span class="req_star" v-if=\'head.required\'>*</span>\n                </span>\n            </div>\n\n            </td>\n            <td class="field-input-td" >\n                <div class="field-input">\n                    <component v-if="head.editor" :is="head.editor"\n                         @field-event="$emit(\'field-event\',$event)"\n                         :head="head" :row="row"></component>\n\n                </div>\n            </td>\n            <td>\n                <span v-if="head.help_text" class="help-text clickable">\n                            <i style="color: #3780af;position: relative;top:10px;"   @click="show_msg(head.help_text,$event)" class="fa fa-question-circle" ></i>\n                </span>\n            </td>\n        </tr>\n        <slot :row="row">\n            <!--\u6309\u94AE\u6A2A\u8DE8\u4E24\u5217 \uFF01\u5C0F\u5C3A\u5BF8\u65F6 \u5F3A\u5236 -->\n             <tr v-if="crossBtn || small_srn" class="btn-row">\n                <td class="field-input-td" colspan="3">\n                    <div class="submit-block">\n                        <button @click="panel_submit" type="btn"\n                            :class="[\'form-control btn\',btnCls]"><span v-text="okBtn"></span></button>\n                    </div>\n                </td>\n            </tr>\n            <!--\u6309\u94AE\u5728\u7B2C\u4E8C\u5217-->\n               <tr v-else class="btn-row">\n                   <td class="field-label-td"></td>\n                    <td class="field-input-td" colspan="1">\n                        <div class="submit-block">\n                            <button @click="panel_submit" type="btn"\n                                :class="[\'btn\',btnCls]"><span v-text="okBtn"></span></button>\n                        </div>\n                     </td>\n                     <td></td>\n               </tr>\n        </slot>\n\n    </table>\n\n\n        </div>',
    methods: {
        update_small: function update_small() {
            var self = this;
            if ($(self.$el).width() < 450) {
                self.small = true;
            } else {
                self.small = false;
            }

            setTimeout(function () {
                self.update_nice();
            }, 100);
        },
        panel_submit: function panel_submit() {
            if (this.$listeners && this.$listeners.submit) {
                if (this.isValid()) {
                    this.$emit('submit', this.row);
                }
            } else {
                this.submit();
            }
        },
        show_msg: function show_msg(msg, event) {
            layer.tips(msg, event.target);
        },
        after_save: function after_save(row) {
            this.$emit('after-save', row);
        }

    }
};

window.com_sim_fields = com_sim_fields;

Vue.component('com-sim-fields', com_sim_fields);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pop_fields_layer = pop_fields_layer;
exports.get_proper_size = get_proper_size;

var _com_pop_fields = __webpack_require__(124);

function pop_fields_layer(row, fields_ctx, callback, layerConfig) {
    // row,head ->//model_name,relat_field

    var row = ex.copy(row);
    var heads = fields_ctx.heads;
    var ops = fields_ctx.ops;
    var extra_mixins = fields_ctx.extra_mixins || [];

    if (typeof fields_ctx.fieldsPanel == 'string') {
        var com_fields = window[fields_ctx.fieldsPanel] || _com_pop_fields.com_pop_field;
    } else {
        var com_fields = fields_ctx.fieldsPanel || _com_pop_fields.com_pop_field;
    }

    var id_string = JSON.stringify(com_fields) + JSON.stringify(extra_mixins);
    var com_id = md5(id_string);

    if (!window['_vue_com_' + com_id]) {
        extra_mixins = ex.map(extra_mixins, function (mix) {
            if (typeof mix == 'string') {
                return window[mix];
            } else {
                return mix;
            }
        });
        //var com_pop_field_real = $.extend({}, com_fields);
        //com_pop_field_real.mixins = com_fields.mixins.concat(extra_mixins)
        var com_pop_field_real = ex.vueExtend(com_fields, extra_mixins);
        Vue.component('com-pop-fields-' + com_id, com_pop_field_real);
        window['_vue_com_' + com_id] = true;
    }

    var pop_id = new Date().getTime();
    var psize = get_proper_size();
    var layer_config = {
        type: 1,
        area: psize, //['800px', '500px'],
        title: '详细',
        resize: true,
        zIndex: 1000,
        resizing: function resizing(layero) {
            var total_height = $('#fields-pop-' + pop_id).parents('.layui-layer').height();
            $('#fields-pop-' + pop_id).parents('.layui-layer-content').height(total_height - 42);
        },
        //shadeClose: true, //点击遮罩关闭
        content: '<div id="fields-pop-' + pop_id + '" style="height: 100%;">\n                    <component :is="\'com-pop-fields-\'+com_id" @del_success="on_del()" @submit-success="on_sub_success($event)"\n                    :row="row" :heads="fields_heads" :ops="ops" ref="field_panel"></component>\n                </div>',
        end: function end() {

            //eventBus.$emit('openlayer_changed')
            ex.remove(cfg.layer_index_stack, openfields_layer_index);
        }
    };
    if (layerConfig) {
        ex.assign(layer_config, layerConfig);
    }
    var openfields_layer_index = layer.open(layer_config);
    debugger;
    cfg.layer_index_stack.push(openfields_layer_index);
    (function (pop_id, row, heads, ops, com_id, openfields_layer_index) {

        //Vue.nextTick(function(){
        //    var store_id ='store_fields_'+ new Date().getTime()

        var vc = new Vue({
            el: '#fields-pop-' + pop_id,
            data: {
                head: fields_ctx,
                has_heads_adaptor: false,
                row: row,
                fields_heads: heads,
                ops: ops,
                com_id: com_id

            },
            mounted: function mounted() {
                var vc = this;
                this.childStore = new Vue({
                    data: {
                        fields_obj: vc.$refs.field_panel,
                        vc: vc
                    },
                    methods: {
                        showErrors: function showErrors(errors) {
                            this.fields_obj.setErrors(errors);
                            this.fields_obj.showErrors(errors);
                        }
                    }

                });
                //this.$store.registerModule(store_id,{
                //    namespaced: true,
                //    state:{
                //        fields_obj:this.$refs.field_panel
                //    },
                //    mutations:{
                //        showErrors:function(state,errors){
                //            state.fields_obj.setErrors(errors)
                //            state.fields_obj.showErrors(errors)
                //        }
                //    }
                //})
            },
            methods: {
                on_sub_success: function on_sub_success(new_row) {
                    callback(new_row, this.childStore, openfields_layer_index);
                }
            }
        });

        //eventBus.$emit('openlayer_changed')

        //})
    })(pop_id, row, heads, ops, com_id, openfields_layer_index);

    return openfields_layer_index;
} /*
  * root 层面创建Vue组件，形成弹出框
  
   fields_ctx:{
           'heads':[{'name':'matchid','label':'比赛','editor':'com-field-label-shower','readonly':True},
                   {'name':'home_score','label':'主队分数','editor':'linetext'},
              ],
           'ops':[{"fun":'produce_match_outcome','label':'保存','editor':'com-field-op-btn'},],
           'extra_mixins':['produce_match_outcome'],
           'fieldsPanel': 'produceMatchOutcomePanel',
           // 使用extra_mixins与fieldsPanel的区别是，设置fieldPanel可以防止引入com_pop_field对象，如果只设置extra_mixin的话，会默认引入com_pop_field
   }
  
  * */


window.pop_fields_layer = pop_fields_layer;

function get_proper_size() {
    var ww = $(window).width();
    var wh = $(window).height();
    var width = 0;
    var height = 0;
    if (ww > 1400) {
        width = '1000px';
    } else if (ww > 900) {
        width = '800px';
    } else {
        width = ww * 0.9 + 'px';
    }

    if (wh > 1200) {
        height = '800px';
    } else if (wh > 700) {
        height = '600px';
    } else {
        height = wh * 0.9 + 'px';
    }
    return [width, height];
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
* head={
*   inn_editor: com-table-mapper  //【可选】 传入一个 table_editor ，除了具备该editor的显示方式外，还具备点击功能
*   get_row:{
*       fun:'get_table_row',
*   },
*   fields_ctx={},
*   after_save:{
*       fun:'update_or_insert'
*   }
* }
*
* */

var pop_fields = exports.pop_fields = {
    template: '<span @click="edit_me()" class="clickable">\n        <component v-if="head.inn_editor" :is="head.inn_editor" :rowData="rowData" :field="field" :index="index"></component>\n        <span v-else v-text="show_text"  ></span>\n    </span>',
    props: ['rowData', 'field', 'index'],
    created: function created() {
        // find head from parent table
        this.parStore = ex.vueParStore(this);
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        if (table_par) {
            var value = this.rowData[this.field];
            this.head = ex.findone(table_par.heads, { name: this.field });
        }
    },
    computed: {
        show_text: function show_text() {
            if (this.head.show_label) {
                return show_label[this.head.show_label.fun](this.rowData, this.head.show_label);
            } else {
                return this.rowData[this.field];
            }
        }
    },
    methods: {
        edit_me: function edit_me() {
            this.open_layer();
        },
        open_layer: function open_layer() {
            var self = this;

            var fun = get_row[this.head.get_row.fun];
            if (this.head.get_row.kws) {
                //  这个是兼顾老的调用，新的调用，参数直接写在get_row里面，与fun平级
                var kws = this.head.get_row.kws;
            } else {
                var kws = this.head.get_row;
            }
            kws.director_name = this.head.fields_ctx.director_name;

            fun(function (pop_row) {
                //pop_fields_layer(pop_row,self.head.fields_heads,ops,self.head.extra_mixins,function(kws){
                var win_index = pop_fields_layer(pop_row, self.head.fields_ctx, function (new_row) {
                    //TODO 配合 tab_fields ，mix_fields_data 统一处理 after_save的问题
                    var fun = after_save[self.head.after_save.fun];
                    fun(self, new_row, pop_row);

                    layer.close(win_index);
                });
            }, this.rowData, kws);
        }

    }
};
Vue.component('com-table-pop-fields', pop_fields);

var show_label = {
    use_other_field: function use_other_field(row, kws) {
        var other_field = kws.other_field;
        return row[other_field];
    },
    text_label: function text_label(row, show_label) {
        return show_label.text;
    }
};

var get_row = {
    use_table_row: function use_table_row(callback, row, kws) {
        callback(row);
    },
    get_table_row: function get_table_row(callback, row, kws) {
        var cache_row = ex.copy(row);
        callback(cache_row);
    },
    get_with_relat_field: function get_with_relat_field(callback, row, kws) {
        var director_name = kws.director_name;
        var relat_field = kws.relat_field;

        var dc = { fun: 'get_row', director_name: director_name };
        dc[relat_field] = row[relat_field];
        var post_data = [dc];
        cfg.show_load();
        ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
            cfg.hide_load();
            callback(resp.get_row);
        });
    }
};

var after_save = {
    do_nothing: function do_nothing(self, new_row, old_row, table) {},
    update_or_insert: function update_or_insert(self, new_row, old_row) {
        //self.$emit('on-custom-comp',{name:'update_or_insert',new_row:new_row,old_row:old_row})
        self.parStore.update_or_insert(new_row, old_row);
        //var par_name=ex.vuexParName(self)
        //if(par_name){
        //self.parStore.$emit('row.update_or_insert',{new_row:new_row,old_row:old_row})
        //}
    }
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.suit_fields = undefined;

var _sim_fields = __webpack_require__(2);

var suit_fields = exports.suit_fields = {
    props: ['row', 'heads', 'ops'],
    mixins: [_sim_fields.com_sim_fields],

    template: '<div class="flex-v" style="margin: 0;height: 100%;">\n    <div class = "flex-grow" style="overflow: auto;margin: 0;">\n        <div class="field-panel suit" >\n            <field  v-for="head in normed_heads" :key="head.name" :head="head" :row="row"></field>\n        </div>\n      <div style="height: 1em;">\n      </div>\n    </div>\n    <slot>\n         <div style="text-align: right;padding: 8px 3em;">\n         <button @click="submit" type="btn"\n                            :class="[\'btn\',btnCls]"><span v-text="okBtn">\u4FDD\u5B58</span></button>\n        <!--<component v-for="op in ops" :is="op.editor" @operation="on_operation(op)" :head="op"></component>-->\n        </div>\n    </slot>\n\n     </div>'

};

Vue.component('com-suit-fields', suit_fields);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//require('./scss/tab_fields.scss')
__webpack_require__(223);
var fields_all_in_one = exports.fields_all_in_one = {
    props: ['ctx'],
    data: function data() {
        var data_row = ex.copy(this.ctx.row || {});
        var self = this;
        var childStore = new Vue({
            data: {
                vc: self
            }
        });
        var parStore = ex.vueParStore(this);
        return {
            head: this.ctx,
            par_row: this.ctx.par_row,
            heads: this.ctx.heads,
            //layout:this.ctx.layout,
            fields_group: this.ctx.fields_group,
            table_grid: this.ctx.table_grid,
            ops: this.ctx.ops,
            errors: {},
            row: data_row,
            org_row: data_row,
            childStore: childStore,
            parStore: parStore,
            ops_loc: this.ctx.ops_loc || 'up'
        };
    },
    mixins: [mix_fields_data, mix_nice_validator],
    template: '<div class="com-form-one flex-v" :class="head.class">\n   <div class="oprations" v-if="ops_loc==\'up\'">\n        <component v-for="op in ops" :is="op.editor" :ref="\'op_\'+op.name" :head="op" @operation="on_operation(op)"></component>\n    </div>\n    <div style="overflow: auto;" class="flex-grow fields-area">\n            <!--\u6709\u5206\u7EC4\u7684\u60C5\u51B5-->\n           <div v-if="fields_group" >\n                <div v-for="group in grouped_heads_bucket" :class="\'group_\'+group.name" v-if="group.heads.length > 0">\n\n                         <div class="fields-group-title"  v-html="group.label"></div>\n                        <com-fields-table-block v-if="table_grid "\n                            :heads="group.heads" :row="row" :option="{table_grid:table_grid}">\n                         </com-fields-table-block>\n                         <div v-else class=\'field-panel suit\' >\n                            <field  v-for=\'head in group.heads\' :key="head.name" :head="head" :row=\'row\'></field>\n                        </div>\n                </div>\n        </div>\n        <!--\u53EA\u6709table\u5206\u7EC4-->\n         <div v-else-if="table_grid " >\n                    <com-fields-table-block\n                        :heads="normed_heads" :row="row" :option="{table_grid:table_grid}"></com-fields-table-block>\n         </div>\n         <!--\u6CA1\u6709\u5206\u7EC4-->\n        <div v-else class=\'field-panel suit\' id="form" >\n            <field  v-for=\'head in normed_heads\' :key="head.name" :head="head" :row=\'row\'></field>\n        </div>\n    </div>\n    <div class="oprations bottom" v-if="ops_loc==\'bottom\'">\n        <component v-for="op in normed_ops" :is="op.editor" :ref="\'op_\'+op.name" :head="op" @operation="on_operation(op)"></component>\n    </div>\n    </div>',

    //created:function(){
    //    // find head from parent table
    //    var table_par = this.$parent
    //    while (true){
    //        if (table_par.heads){
    //            break
    //        }
    //        table_par = table_par.$parent
    //        if(!table_par){
    //            break
    //        }
    //    }
    //    this.table_par = table_par
    //},
    computed: {
        normed_ops: function normed_ops() {
            var _this = this;

            return ex.filter(this.ops, function (op) {
                if (op.show) {
                    return ex.eval(op.show, { row: _this.row, vc: _this });
                } else {
                    return true;
                }
            });
        },

        grouped_heads_bucket: function grouped_heads_bucket() {
            var _this2 = this;

            var out_bucket = [];
            ex.each(this.fields_group, function (group) {
                if (group.show && !ex.eval(group.show, { row: _this2.row, head: _this2.head })) {
                    return;
                }
                var heads = ex.filter(_this2.normed_heads, function (head) {
                    return ex.isin(head.name, group.heads);
                });
                out_bucket.push({ name: group.name, label: group.label, heads: heads });
            });
            return out_bucket;
        }
    },

    methods: {
        group_filter_heads: function group_filter_heads(group) {
            return ex.filter(this.normed_heads, function (head) {
                return ex.isin(head.name, group.heads);
            });
        },
        data_getter: function data_getter() {
            var self = this;
            if (self.tab_head.get_data) {
                var fun = get_data[self.tab_head.get_data.fun];
                var kws = self.tab_head.get_data.kws;
                fun(self, function (row) {
                    self.org_row = row;
                    self.row = ex.copy(row);
                    self.childStore.$emit('row.update_or_insert', row);
                }, kws);
            }
            if (self.tab_head.get_row) {
                ex.eval(self.tab_head.get_row, { vc: self });
            }
        },
        save: function save() {
            if (this.head.save_express) {
                return ex.eval(this.head.save_express, { vc: this });
            } else {
                return mix_fields_data.methods.save.call(this);
            }
        }
    }
    // data_getter  回调函数，获取数据,


};

Vue.component('com-form-one', fields_all_in_one);

var get_data = {
    get_row: function get_row(self, callback, kws) {
        //kws={model_name ,relat_field}
        var director_name = kws.director_name;
        var relat_field = kws.relat_field;
        var dt = { fun: 'get_row', director_name: director_name };
        dt[relat_field] = self.par_row[relat_field];
        //var post_data=[dt]
        cfg.show_load();
        ex.director_call('d.get_row?dname=' + director_name, dt).then(function (resp) {
            cfg.hide_load();
            callback(resp);
        });

        //$.post('/d/ajax',JSON.stringify(post_data),function(resp){
        //    cfg.hide_load()
        //    callback(resp.get_row)
        //})
    },
    table_row: function table_row(self, callback, kws) {
        callback(self.par_row);
    }
};

var after_save = {
    update_or_insert: function update_or_insert(self, new_row, kws) {
        var old_row = self.old_row;
        var parStore = ex.vueParStore(self);
        parStore.update_or_insert(new_row, old_row);
        // 要update_or_insert ，证明一定是 更新了 par_row
        //ex.vueAssign(self.par_row,new_row)
        //self.$emit('tab-event',{name:'update_or_insert',new_row:self.par_row,old_row:old_row})
    },
    do_nothing: function do_nothing(self, new_row, kws) {},

    update_par_row_from_db: function update_par_row_from_db(self, new_row, kws) {
        //
        var post_data = [{ fun: 'get_row', director_name: self.par_row._director_name, pk: self.par_row.pk }];
        ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
            ex.vueAssign(self.par_row, resp.get_row);
        });
    }
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
__webpack_require__(11);

var com_fields_panel = exports.com_fields_panel = {
    props: ['ctx'],
    data: function data() {
        return {
            row: this.ctx.row || {},
            heads: this.ctx.heads,
            ops: this.ctx.ops,
            fields_editor: this.ctx.fields_editor || cfg.fields_editor || com_sim_fields,
            small: false,
            small_srn: ex.is_small_screen(),
            cssCls: '',
            crossBtn: this.ctx.crossBtn || '',
            okBtn: this.ctx.okBtn || '确定'
        };
    },
    mounted: function mounted() {
        if ($(this.$el).width() < 600) {
            this.small = true;
        } else {
            this.small = false;
        }
    },
    methods: {
        on_finish: function on_finish(e) {
            this.$emit('finish', e);
        }
    },
    template: '<div :class="[\'flex-v com-fields-panel\',cssCls,{\'small_srn\':small_srn}]">\n     <component class="msg-bottom" :is="fields_editor" :heads="heads" :row="row" :ok-btn="okBtn"\n       :cross-btn="crossBtn" @finish="on_finish($event)"></component>\n     </div>'
};
window.com_fields_panel = com_fields_panel;
Vue.component('com-fields-panel', com_fields_panel);
Vue.component('com-panel-fields', com_fields_panel);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var mix_editor = exports.mix_editor = {
    data: function data() {
        return {
            org_value: this.rowData[this.field]
        };
    },
    computed: {
        is_dirty: function is_dirty() {
            return this.rowData[this.field] != this.org_value;
        }
    },
    watch: {
        'rowData._hash': function rowData_hash() {
            this.org_value = this.rowData[this.field];
        }
    },
    methods: {
        on_changed: function on_changed() {
            var value = this.rowData[this.field];
            if (value == this.org_value) {
                this.$emit('on-custom-comp', { name: 'row_changed_undo_act', row: this.rowData });
            } else {
                this.$emit('on-custom-comp', { name: 'row_changed', row: this.rowData });
            }
        }
    }
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(174);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./ele_tree_name_layer.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./ele_tree_name_layer.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(178);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./sim_fields.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./sim_fields.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(186);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./fields_panel.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./fields_panel.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(207);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./datetime_range.styl", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./datetime_range.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(208);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./sys_link.styl", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./sys_link.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


ex.assign(cfg, {
    fields_editor: 'com-suit-fields',
    fields_local_editor: 'com-suit-fields-local'
});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var china_address_logic = {
    props: ['row', 'head'],
    template: '<div class="com-field-china-address">\n            <el-cascader\n              :options="options"\n              v-model="row[head.name]"></el-cascader>\n               </div>',
    mounted: function mounted() {},
    data: function data() {
        return {
            options: china_address
        };
    }
};

Vue.component('com-field-china-address', function (resolve, reject) {
    ex.load_js('/static/lib/china_address.js', function () {
        resolve(china_address_logic);
    });
});

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var lay_datetime = {
    props: ['row', 'head'],
    template: '<div class="com-field-datetime">\n    <span class="readonly-info" v-show=\'head.readonly\' v-text=\'row[head.name]\'></span>\n      <el-date-picker\n        v-if="!head.readonly"\n      v-model="row[head.name]"\n      type="datetime"\n      :placeholder="head.placeholder"\n      align="right"\n      size="small"\n      value-format="yyyy-MM-dd HH:mm:ss"\n      :picker-options="pickerOptions">\n    </el-date-picker>\n    <input style="display: none" type="text" :name="head.name" :id="\'id_\'+head.name" v-model="row[head.name]">\n               </div>',
    data: function data() {
        return {
            pickerOptions: {
                shortcuts: [{
                    text: '今天',
                    onClick: function onClick(picker) {
                        var d = new Date();
                        d.setHours(0, 0, 0, 0);
                        picker.$emit('pick', d);
                    }
                }, {
                    text: '昨天',
                    onClick: function onClick(picker) {
                        var date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        date.setHours(0, 0, 0, 0);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick: function onClick(picker) {
                        var date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        date.setHours(0, 0, 0, 0);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '30天前',
                    onClick: function onClick(picker) {
                        var date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
                        date.setHours(0, 0, 0, 0);
                        picker.$emit('pick', date);
                    }
                }]
            }
        };
    },

    mounted: function mounted() {
        var self = this;
    }
};

Vue.component('com-field-datetime', lay_datetime);

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ele_transfer = {
    props: ['row', 'head'],
    template: '<div>\n     <el-transfer v-model="value1" :data="trans_data"></el-transfer>\n     </div>',
    data: function data() {
        return {
            value1: []
        };
    },
    computed: {
        trans_data: function trans_data() {
            return [{ key: 'xx', label: 'bbbb' }];
        }
    }
};
Vue.component('com-field-ele-transfer', ele_transfer);

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(9);
var label_shower = {
    props: ['row', 'head'],
    methods: {
        handleCheckChange: function handleCheckChange(data, checked, indeterminate) {
            console.log(data, checked, indeterminate);
            var ls = this.$refs.et.getCheckedKeys();
            ls = ex.filter(ls, function (itm) {
                return itm != undefined;
            });
            this.row[this.head.name] = ls;
        },
        handleNodeClick: function handleNodeClick(data) {
            console.log(data);
        }
    },
    data: function data() {
        return {
            selected: [1, 2],
            // demon 数据
            data: [{
                label: '一级 1',
                children: [{
                    label: '二级 1-1',
                    children: [{
                        label: '三级 1-1-1',
                        pk: 1
                    }]
                }]
            }, {
                label: '一级 2',
                children: [{
                    label: '二级 2-1',
                    children: [{
                        label: '三级 2-1-1',
                        pk: 3
                    }]
                }, {
                    label: '二级 2-2',
                    children: [{
                        label: '三级 2-2-1'
                    }]
                }]
            }, {
                label: '一级 3',
                children: [{
                    label: '二级 3-1',
                    children: [{
                        label: '三级 3-1-1',
                        pk: 2
                    }]
                }, {
                    label: '二级 3-2',
                    children: [{
                        label: '三级 3-2-1'
                    }]
                }]
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        };
    },
    template: '<div class="com-field-ele-tree-name-layer">\n        <el-tree ref="et" :data="head.options" :props="defaultProps"\n             @node-click="handleNodeClick"\n             show-checkbox\n             @check-change="handleCheckChange"\n\n             :default-checked-keys="row[head.name]"\n             node-key="value"\n    ></el-tree>\n    </div>',
    //default-expand-all
    computed: {
        label: function label() {
            return this.row['_' + this.head.name + '_label'];
        }
    }
};

Vue.component('com-field-ele-tree', label_shower);
//Vue.component('com-field-ele-tree-name-layer',function(resolve,reject){
//ex.load_css('https://unpkg.com/element-ui/lib/theme-chalk/index.css')
//ex.load_js('https://unpkg.com/element-ui/lib/index.js',function(){
//resolve(label_shower)
//})
//})

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(9);

var label_shower = {
    props: ['row', 'head'],

    methods: {
        check_depend: function check_depend(node) {
            var self = this;
            if (node.depend_list) {
                ex.each(node.depend_list, function (dep_node) {
                    var node = self.$refs.et.getNode(dep_node.value);
                    if (node && !node.checked) {
                        self.$refs.et.setChecked(dep_node.value, true);
                        self.check_depend(dep_node);
                    }
                });
            }
        },
        walk_check_depend: function walk_check_depend(node) {
            var self = this;
            if (!node.children) {
                this.check_depend(node);
            } else {
                ex.each(node.children, function (item) {
                    self.walk_check_depend(item);
                });
            }
        },
        uncheck_depended: function uncheck_depended(node) {
            var self = this;
            if (node.depended_list) {
                ex.each(node.depended_list, function (dep_node) {
                    var node = self.$refs.et.getNode(dep_node.value);
                    if (node && node.checked) {
                        self.$refs.et.setChecked(dep_node.value, false);
                        self.uncheck_depended(dep_node);
                    }
                });
            }
        },
        walk_uncheck_depended: function walk_uncheck_depended(node) {
            var self = this;
            if (!node.children) {
                this.uncheck_depended(node);
            } else {
                ex.each(node.children, function (item) {
                    self.walk_uncheck_depended(item);
                });
            }
        },
        handleCheckChange: function handleCheckChange(data, checked, indeterminate) {
            console.log(data, checked, indeterminate);
        },
        handleNodeClick: function handleNodeClick(data) {
            //this.last_click=data
            //console.log(data);
        },

        handleCheck: function handleCheck(data, e) {
            console.log(data);
            var self = this;
            if (!data.children) {
                var check = ex.isin(data, e.checkedNodes);
                if (check) {
                    self.check_depend(data);
                } else {
                    self.uncheck_depended(data);
                }
            } else {
                var check = ex.isin(data, e.checkedNodes) || ex.isin(data, e.halfCheckedNodes);
                if (check) {
                    self.walk_check_depend(data);
                } else {
                    self.walk_uncheck_depended(data);
                }
            }

            var ls = this.$refs.et.getCheckedKeys();
            ls = ex.filter(ls, function (itm) {
                return itm != undefined;
            });
            var namelist = [];
            ex.walk(this.inn_head.options, function (option) {
                if (option.value) {
                    namelist.push(option.value);
                }
            });
            if (this.row[this.head.name] && this.row[this.head.name].length > 0) {
                this.row[this.head.name] = ex.filter(this.row[this.head.name], function (item) {
                    return !ex.isin(item, namelist);
                });
                this.row[this.head.name] = this.row[this.head.name].concat(ls);
            } else {
                this.row[this.head.name] = ls;
            }
        },
        filterNode: function filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        init: function init() {
            var self = this;
            self.depend = {};
            self.has_depend_list = [];

            var options_dict = {};
            ex.walk(this.inn_head.options, function (opt) {
                if (opt.value) {
                    if (options_dict[opt.value]) {
                        cfg.showError(opt.value + '重复了，请检查备选项！');
                    }
                    options_dict[opt.value] = opt;
                }
            });

            ex.walk(this.inn_head.options, function (opt) {
                if (!opt.depend) {
                    return;
                }
                opt.depend_list = [];

                ex.each(opt.depend, function (item_name) {
                    var item = options_dict[item_name];
                    if (!item) {
                        cfg.showError(item_name + '\u4E0D\u5B58\u5728\uFF0C\u800C\u88AB ' + opt.label + ' \u4F9D\u8D56!');
                    }
                    opt.depend_list.push(item);
                    if (!item.depended_list) {
                        item.depended_list = [];
                    }
                    item.depended_list.push(opt);
                });
            });
        },
        refresh: function refresh(options) {
            var _this = this;

            this.inn_head.options = [];
            setTimeout(function () {
                _this.inn_head.options = options;
                _this.init();
            }, 300);
        }
    },
    mounted: function mounted() {
        this.init();
        ex.vueEventRout(this);
    },
    watch: {
        filterText: function filterText(val) {
            this.$refs.et.filter(val);
        }
    },
    data: function data() {
        var inn_head = ex.copy(this.head);
        return {
            parStore: ex.vueParStore(this),
            filterText: '',
            inn_head: inn_head,
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        };
    },
    template: '<div class="com-field-ele-tree-name-layer">\n    <el-input\n      placeholder="\u8F93\u5165\u5173\u952E\u5B57\u8FDB\u884C\u8FC7\u6EE4"\n      v-model="filterText">\n    </el-input>\n        <el-tree ref="et" :data="inn_head.options" :props="defaultProps"\n             @node-click="handleNodeClick"\n             @check="handleCheck"\n             show-checkbox\n             @check-change="handleCheckChange"\n             :default-checked-keys="row[head.name]"\n             node-key="value"\n             :filter-node-method="filterNode"\n    >\n      <span class="custom-tree-node" slot-scope="{ node, data }">\n        <span :title="data.help_text" v-text="node.label"></span>\n      </span>\n\n    </el-tree>\n    </div>',
    //default-expand-all
    computed: {
        label: function label() {
            return this.row['_' + this.head.name + '_label'];
        }
    }
};

Vue.component('com-field-ele-tree-depend', label_shower);
//Vue.component('com-field-ele-tree-name-layer',function(resolve,reject){
//ex.load_css('https://unpkg.com/element-ui/lib/theme-chalk/index.css')
//ex.load_js('https://unpkg.com/element-ui/lib/index.js',function(){
//resolve(label_shower)
//})
//})

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var label_shower = {
    props: ['row', 'head'],
    template: '<div class="com-field-label-shower">\n        <span class="readonly-info" v-text=\'label\'></span>\n        </div>',
    computed: {
        label: function label() {
            return this.row['_' + this.head.name + '_label'];
        }
    }
};

Vue.component('com-field-label-shower', label_shower);

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _invite_code = __webpack_require__(97);

var invite_code = _interopRequireWildcard(_invite_code);

var _line_text = __webpack_require__(98);

var line_text = _interopRequireWildcard(_line_text);

var _phone_code = __webpack_require__(102);

var phone_code = _interopRequireWildcard(_phone_code);

var _month = __webpack_require__(100);

var month = _interopRequireWildcard(_month);

var _radio = __webpack_require__(104);

var radio = _interopRequireWildcard(_radio);

var _blocktext = __webpack_require__(92);

var blocktext = _interopRequireWildcard(_blocktext);

var _cascader = __webpack_require__(93);

var cascader = _interopRequireWildcard(_cascader);

var _date = __webpack_require__(96);

var field_date = _interopRequireWildcard(_date);

var _pop_tree_select = __webpack_require__(103);

var pop_tree_select = _interopRequireWildcard(_pop_tree_select);

var _compute = __webpack_require__(95);

var compute = _interopRequireWildcard(_compute);

var _range = __webpack_require__(105);

var range = _interopRequireWildcard(_range);

var _time = __webpack_require__(108);

var time = _interopRequireWildcard(_time);

var _list_ctn = __webpack_require__(99);

var list_ctn = _interopRequireWildcard(_list_ctn);

var _color = __webpack_require__(94);

var color = _interopRequireWildcard(_color);

var _number = __webpack_require__(101);

var number = _interopRequireWildcard(_number);

var _richtext = __webpack_require__(106);

var richtext = _interopRequireWildcard(_richtext);

var _split_text = __webpack_require__(107);

var split_text = _interopRequireWildcard(_split_text);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var order_list = {
    props: ['row', 'head'],
    template: '<div class="com-field-table-list">\n    <div>\n        <button @click="add_new()" class="btn btn-default btn-xs">\n            <i style="color: green" class="fa fa-plus-circle"></i>\n        </button>\n        <button @click="delete_rows()" :disabled="selected.length==0" class="btn btn-default btn-xs">\n            <i style="color: red" class="fa fa-minus-circle"></i>\n        </button>\n        <div style="display: inline-block;position: relative;vertical-align: top">\n            <textarea :name="head.name" v-model="row[head.name]"  style="display: none"></textarea>\n        </div>\n    </div>\n\n\n                    <el-table ref="core_table" class="table"\n                              :data="rows"\n                              border\n                              :stripe="true"\n                              size="mini"\n                               @selection-change="handleSelectionChange"\n                              style="width: 100%">\n                              <!--:summary-method="getSum"-->\n                        <el-table-column\n                                type="selection"\n                                width="55">\n                        </el-table-column>\n\n                        <template  v-for="col in heads">\n\n                            <el-table-column v-if="col.editor"\n                                             :show-overflow-tooltip="is_show_tooltip(col) "\n                                             :label="col.label"\n                                             :prop="col.name.toString()"\n                                             :width="col.width">\n                                <template slot-scope="scope">\n                                    <component :is="col.editor"\n                                               @on-custom-comp="on_td_event($event)"\n                                               :row-data="scope.row" :field="col.name" :index="scope.$index">\n                                    </component>\n\n                                </template>\n\n                            </el-table-column>\n                            <el-table-column v-else\n                                             :show-overflow-tooltip="is_show_tooltip(col) "\n                                             :prop="col.name.toString()"\n                                             :label="col.label"\n                                             :width="col.width">\n                            </el-table-column>\n                        </template>\n                    </el-table>\n              </div>',
    mixins: [mix_table_data, mix_ele_table_adapter],
    data: function data() {
        if (this.row[this.head.name]) {
            var rows = JSON.parse(this.row[this.head.name]);
        } else {
            var rows = [];
        }

        return {
            rows: rows,
            row_sort: {},
            heads: this.head.table_heads,
            selected: []
        };
    },
    mounted: function mounted() {
        //var self=this
        //ex.assign(this.op_funs, {
        //        edit_over: function () {
        //            self.row[self.head.name] = JSON.stringify(self.rows)
        //        },
        //    }
        //)
        //this.$on('commit',this.on_commit)
    },
    computed: {
        out_row_this_field: function out_row_this_field() {
            return this.row[this.head.name];
        }
    },
    watch: {
        out_row_this_field: function out_row_this_field() {
            if (this.row[this.head.name]) {
                this.rows = JSON.parse(this.row[this.head.name]);
            } else {
                this.rows = [];
            }
        },
        rows: {
            handler: function handler(v) {
                if (v.length > 0) {
                    Vue.set(this.row, this.head.name, JSON.stringify(v));
                    //this.row[this.head.name] = JSON.stringify(v)
                } else {
                    Vue.set(this.row, this.head.name, '');
                    //this.row[this.head.name] = ''
                }
            },
            deep: true
        }

    },
    methods: {
        commit: function commit() {
            var self = this;
            self.row[self.head.name] = JSON.stringify(self.rows);
        },
        add_new: function add_new() {
            var self = this;
            self.crt_row = {};

            var fields_ctx = {
                heads: self.head.fields_heads,
                ops_loc: 'bottom',
                //extra_mixin:[],
                save_express: 'scope.vc.$emit("finish",scope.vc.row);rt=Promise.resolve(scope.vc.row)',
                ops: [{
                    'name': 'save', 'editor': 'com-field-op-btn', 'label': '确定', 'icon': 'fa-save'
                }],
                genPar: self
                //var win= pop_edit_local(self.crt_row,fields_ctx,function(resp) {
                //     var new_row=resp
                //     ex.vueAssign(self.crt_row,new_row)
                //    self.rows.push(self.crt_row)
                //    layer.close(win)
                // })
            };cfg.pop_vue_com('com-form-one', fields_ctx).then(function (row) {
                self.rows.push(row);
            });
        },
        delete_rows: function delete_rows() {
            var self = this;
            layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
                //do something
                ex.remove(self.rows, function (row) {
                    return self.selected.indexOf(row) != -1;
                });
                layer.close(index);
            });
            //alert(this.selected.length)
        },
        norm_head: function norm_head(head, row) {
            if (row._editing) {}
        }
    }

};

Vue.component('com-field-table-list', order_list);

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
__webpack_require__(218);

/*
 * config={
 *    accept:""
 * }
 * */

var field_file_uploader = exports.field_file_uploader = {
    props: ['row', 'head'],
    template: '<div><com-file-uploader-tmp :name="head.name" v-model="row[head.name]" :config="head.config" :readonly="head.readonly"></com-file-uploader-tmp></div>'
};

var com_file_uploader = exports.com_file_uploader = {
    props: ['value', 'readonly', 'config', 'name'],
    data: function data() {

        return {
            picstr: this.value,
            pictures: this.value ? this.value.split(';') : [],
            crt_pic: ''
        };
    },

    template: '<div class="file-uploader">\n    <div v-if="!readonly">\n        <input v-if="cfg.multiple"  v-show="!cfg.com_btn" class="pic-input" type="file" @change="upload_pictures($event)" :accept="cfg.accept" multiple="multiple">\n        <input v-else v-show="!cfg.com_btn"  class="pic-input" type="file" @change="upload_pictures($event)" :accept="cfg.accept">\n        <input type="text" :name="name" style="display: none" v-model="value">\n    </div>\n\n    <div class="wrap">\n           <a v-for="pic in pictures" :href="pic"><span  v-text="pic"></span></a>\n    </div>\n\n     <!--<component v-if="cfg.com_btn && ! readonly" :is="cfg.com_btn" @click.native="browse()"></component>-->\n\n\n\n    </div>',
    mounted: function mounted() {
        var self = this;
        if (this.cfg.sortable) {
            ex.load_js("/static/lib/sortable.min.js", function () {
                new Sortable($(self.$el).find('.sortable')[0], {
                    onSort: function onSort( /**Event*/evt) {
                        self.ajust_order();
                    }
                });
            });
        }
    },
    computed: {
        //res_url:function(){
        //    return this.cfg.upload_url ? this.to: "/_face/upload"
        //},
        cfg: function cfg() {
            var def_config = {
                upload_url: '/d/upload',
                accept: 'image/*',
                multiple: false,
                sortable: true,
                on_click: function on_click(url) {
                    window.open(url, '_blank' // <- This is what makes it open in a new window.
                    );
                }
            };
            if (this.config) {
                //if(! this.config.hasOwnProperty('multiple') || this.config.multiple){
                //    def_config.com_btn='file-uploader-btn-plus'
                //}
                ex.assign(def_config, this.config);
            }

            return def_config;
        }

    },
    watch: {
        value: function value(new_val, old_val) {
            if (this.picstr != new_val) {
                this.picstr = new_val;
                this.pictures = this.value ? this.value.split(';') : [];
            }
            if (!this.picstr) {
                $(this.$el).find('.pic-input').val("");
            }
        }
    },
    methods: {
        browse: function browse() {
            $(this.$el).find('input').click();
        },
        enter: function enter(pic) {
            this.crt_pic = pic;
        },
        out: function out() {
            this.crt_pic = '';
        },
        upload_pictures: function upload_pictures(event) {
            var self = this;
            var file_list = event.target.files;
            if (file_list.length == 0) {
                return;
            }
            var upload_url = this.cfg.upload_url;

            //show_upload()

            cfg.show_load();
            fl.uploads(file_list, upload_url, function (resp) {
                cfg.hide_load();
                if (resp) {
                    if (self.cfg.multiple) {
                        self.add_value(resp);
                    } else {
                        self.set_value(resp);
                    }
                }
                //hide_upload(300)
            });
        },
        set_value: function set_value(value) {
            //@value: [url1,url2]
            var val = value.join(';');
            this.$emit('input', val);
        },
        add_value: function add_value(value) {
            var self = this;
            var real_add = ex.filter(value, function (item) {
                return !ex.isin(item, self.pictures);
            });
            var real_list = self.pictures.concat(real_add);
            var val = real_list.join(';');
            self.$emit('input', val);
        },
        ajust_order: function ajust_order() {
            var list = $(this.$el).find('ul.sortable img');
            var url_list = [];
            for (var i = 0; i < list.length; i++) {
                var ele = list[i];
                url_list.push($(ele).attr('src'));
            }
            var val = url_list.join(';');
            this.picstr = val;
            this.$emit('input', val);
        },
        remove: function remove(pic) {
            var pics = this.picstr.split(';');
            ex.remove(pics, function (item) {
                return pic == item;
            });
            var val = pics.join(';');
            this.$emit('input', val);
        },
        is_image: function is_image(url) {
            var type = this.get_res_type(url);
            return ex.isin(type.toLowerCase(), ['jpg', 'png', 'webp', 'gif', 'jpeg', 'ico']);
        },
        get_res_type: function get_res_type(url) {
            var mt = /[^.]+$/.exec(url);
            if (mt.length > 0) {
                return mt[0];
            } else {
                return "";
            }
        },
        get_res_basename: function get_res_basename(url) {
            var mt = /[^/]+$/.exec(url);
            if (mt.length > 0) {
                return mt[0];
            } else {
                return mt[0];
            }
        }
    }

    //var plus_btn={
    //    props:['accept'],
    //    template:`<div class="file-uploader-btn-plus">
    //        <div class="inn-btn"><span>+</span></div>
    //        <div style="text-align: center">添加文件</div>
    //    </div>`,
    //}
    //Vue.component('file-uploader-btn-plus',plus_btn)

};Vue.component('com-file-uploader-tmp', com_file_uploader);
Vue.component('com-field-plain-file', field_file_uploader);

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var pop_table_select = {
    props: ['row', 'head'],
    template: '<div>\n        <span  v-text="label"></span>\n        <input type="text" v-model="row[head.name]" style="display: none;" :id="\'id_\'+head.name" :name="head.name">\n        <span v-if="!head.readonly" class="clickable" @click="open_win"><i class="fa fa-search"></i></span>\n    </div>',
    computed: {
        label: function label() {
            return this.row['_' + this.head.name + '_label'];
        }
    },
    mounted: function mounted() {
        //var self=this
        //var name =this.head.name
        //this.validator=$(this.$el).validator({
        //    fields: {
        //        name:'required;'
        //    }
        //})
    },
    methods: {
        open_win: function open_win() {
            var self = this;
            if (this.head.init_express) {
                ex.eval(this.head.init_express, { head: this.head, row: this.row });
            }
            cfg.pop_vue_com('com-table-panel', this.head.table_ctx).then(function (foreign_row) {
                if (self.head.after_select) {
                    ex.eval(self.head.after_select, { selected_row: foreign_row, row: self.row });
                } else if (self.head.select_field) {
                    Vue.set(self.row, self.head.name, foreign_row[self.head.select_field]);
                } else {
                    Vue.set(self.row, self.head.name, foreign_row.pk);
                }
                Vue.set(self.row, '_' + self.head.name + '_label', foreign_row._label);
            });
            //var win_close = cfg.pop_middle('com-table-panel',this.head.table_ctx,function(foreign_row){
            //    if(self.head.action){
            //        ex.eval(self.head.action,{new_row:foreign_row,row:self.row})
            //    }else if(self.head.select_field){
            //        Vue.set(self.row,self.head.name,foreign_row[self.head.select_field])
            //    }else{
            //        Vue.set(self.row,self.head.name,foreign_row[self.head.name])
            //    }
            //        Vue.set(self.row,'_'+self.head.name+'_label',foreign_row._label)
            //    win_close()
            //})
        }
        //isValid:function(){
        //    return this.validator.isValid()
        //}
    }
};

Vue.component('com-field-pop-table-select', pop_table_select);

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var validate_code = {
    props: ['row', 'head'],
    template: '<div style="position: relative;">\n    <input type="text" class="form-control input-sm" v-model="row[head.name]" :id="\'id_\'+head.name" :name="head.name">\n    <div>\n    <div style="display: inline-block;border: 1px solid #9e9e9e;">\n        <img  :src="head.code_img" alt="">\n    </div>\n    <span class="clickable" @click="change_code" style="white-space:nowrap;">\u770B\u4E0D\u6E05\uFF0C\u6362\u4E00\u5F20</span>\n    </div>\n    </div>',
    methods: {
        change_code: function change_code() {
            var self = this;
            var post_data = [{ fun: 'new_validate_code' }];
            cfg.show_load();
            ex.post('/d/ajax/authuser', JSON.stringify(post_data), function (resp) {
                self.head.code_img = resp.new_validate_code;
                cfg.hide_load();
            });
        }
    }

};

Vue.component('com-field-validate-code', validate_code);

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Vue.component('com-field-op-btn', {
    props: ['head'],
    template: '<div class="com-field-op-btn" style="display: inline-block;margin: 0 3px">\n    <button @click="operation_call()" :class="head.class?head.class:\'btn btn-default\'">\n        <i v-if="head.icon" :class="[\'fa\',head.icon]"></i><span style="display: inline-block;margin-left: 5px" v-text="head.label"></span>\n        </button>\n    </div>',
    methods: {
        operation_call: function operation_call() {
            this.$emit('operation', this.head.name);
        }
    }
});

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _com_form = __webpack_require__(109);

var com_form = _interopRequireWildcard(_com_form);

var _suit_fields = __webpack_require__(5);

var suit_fields = _interopRequireWildcard(_suit_fields);

var _suit_fields_local = __webpack_require__(111);

var suit_fields_local = _interopRequireWildcard(_suit_fields_local);

var _fields_table_block = __webpack_require__(110);

var fields_table_block = _interopRequireWildcard(_fields_table_block);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
* 可能无用了。
* */

__webpack_require__(220);

var com_plain_fields = {
    props: {
        heads: '',
        row: '',
        okBtn: {
            default: function _default() {
                return '确定';
            }
        },
        btnCls: {
            default: function _default() {
                return 'btn-primary btn-sm';
            }
        }
    },
    data: function data() {
        return {};
    },
    created: function created() {
        if (!this.okBtn) {
            this.okBtn = '确定';
        }
    },
    components: window._baseInput,
    mixins: [mix_fields_data, mix_nice_validator],
    template: ' <div class="field-panel plain-field-panel">\n        <div class="field" v-for="head in heads">\n            <label for="" v-text="head.label"></label>\n            <span class="req_star" v-if=\'head.required\'>*</span>\n             <span v-if="head.help_text" class="help-text clickable">\n                    <i style="color: #3780af;position: relative;top:10px;" @click="show_msg(head.help_text,$event)" class="fa fa-question-circle" ></i>\n              </span>\n              <div class="field-input">\n                <component v-if="head.editor" :is="head.editor"\n                     @field-event="$emit(\'field-event\',$event)"\n                     :head="head" :row="row"></component>\n            </div>\n\n        </div>\n\n        <div class="submit-block">\n            <button @click="panel_submit" type="btn"\n                :class="[\'btn\',btnCls]"><span v-text="okBtn"></span></button>\n        </div>\n        </div>',
    methods: {
        panel_submit: function panel_submit() {
            if (this.$listeners && this.$listeners.submit) {
                if (this.isValid()) {
                    this.$emit('submit', this.row);
                }
            } else {
                this.submit();
            }
        },
        show_msg: function show_msg(msg, event) {
            layer.tips(msg, event.target);
        }
    }
};

window.com_plain_fields = com_plain_fields;

Vue.component('com-plain-field-panel', com_plain_fields);

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
废弃了，采用 cfg.pop_middle('local-panel',ctx,callbank)
* */

function pop_edit_local(row, fields_ctx, callback, layerConfig) {

    var no_sub_to_server = {
        methods: {
            save: function save() {
                var _this = this;

                //cfg.show_load()
                if (this.isValid()) {
                    this.$emit('submit-success', this.row);
                }
                // 该组件应该会被移除掉。这里暂时补充返回一个 promise ,以免造成报错
                return new Promise(function (resolve, reject) {
                    resolve(_this.row);
                });
            }
        }
    };

    if (!fields_ctx.extra_mixins) {
        fields_ctx.extra_mixins = [no_sub_to_server];
    } else {
        fields_ctx.extra_mixins = [no_sub_to_server].concat(fields_ctx.extra_mixins);
    }
    var openfields_layer_index = pop_fields_layer(row, fields_ctx, callback, layerConfig);
    return openfields_layer_index;
}
//window.no_sub_to_server=no_sub_to_server
window.pop_edit_local = pop_edit_local;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _sim_fields = __webpack_require__(2);

var com_sim_fields_local = {
    mixins: [_sim_fields.com_sim_fields],
    methods: {
        submit: function submit() {
            if (this.isValid()) {
                this.$emit('finish', this.row);
            }
        }
    }
};

window.com_sim_fields_local = com_sim_fields_local;

Vue.component('com-sim-fields-local', com_sim_fields_local);

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _check = __webpack_require__(112);

var check = _interopRequireWildcard(_check);

var _datetime_range = __webpack_require__(115);

var datetime_range = _interopRequireWildcard(_datetime_range);

var _date_range = __webpack_require__(114);

var date_range = _interopRequireWildcard(_date_range);

var _compare = __webpack_require__(113);

var compare = _interopRequireWildcard(_compare);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(221);

Vue.component('com-head-dropdown', {
    props: ['head'],
    template: '<div class="com-head-userinfo">\n    <div style="z-index:200" class="login" >\n        <el-dropdown class="com-head-userinfo">\n          <span class="el-dropdown-link">\n          <span v-html="head.label"></span>\n            <i class="el-icon-arrow-down el-icon--right"></i>\n          </span>\n          <el-dropdown-menu slot="dropdown">\n            <el-dropdown-item v-for="action in head.options">\n                <a class="com-head-dropdown-action" :href="action.link" v-text="action.label"></a>\n            </el-dropdown-item>\n          </el-dropdown-menu>\n        </el-dropdown>\n    </div>\n    </div>'
});

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _sys_link = __webpack_require__(118);

var sys_link = _interopRequireWildcard(_sys_link);

var _user_info = __webpack_require__(119);

var user_info = _interopRequireWildcard(_user_info);

var _space = __webpack_require__(117);

var space = _interopRequireWildcard(_space);

var _bell_msg = __webpack_require__(116);

var bell_msg = _interopRequireWildcard(_bell_msg);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(222);

// header 上的小链接,例如右上角的  [登录 | 注册  ]
Vue.component('com-head-sm-link', {
    props: ['head'],
    template: '<div class="small-link">\n    <span class="item" v-for="action in head.options">\n        <a  @click="on_click(action)" class="login-link clickable" v-text="action.label"></a>\n        <span class="space" v-if="action != head.options[head.options.length-1]">&nbsp;|&nbsp;</span>\n    </span>\n    </div>',
    methods: {
        on_click: function on_click(action) {
            if (this.$listeners && this.$listeners.jump) {
                this.$emit('jump', action);
            } else {
                location = action.link;
            }
        }
    }
});

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _table = __webpack_require__(121);

var table = _interopRequireWildcard(_table);

var _table_type = __webpack_require__(123);

var table_type = _interopRequireWildcard(_table_type);

var _fields = __webpack_require__(120);

var fields = _interopRequireWildcard(_fields);

var _table_grid = __webpack_require__(122);

var table_grid = _interopRequireWildcard(_table_grid);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var el_tab = {
    props: ['ctx'],
    template: '<div class="tab-full active-tab-hightlight-top" style="position: absolute;bottom: 0;top: 0;left: 0;right: 0;" >\n     <el-tabs  v-if="ctx.tabs.length >1" type="border-card"\n                           @tab-click="handleClick"\n                           style="width: 100%;height: 100%;"\n                           :value="ctx.crt_tab_name" >\n\n                    <!--<el-tab-pane v-for="tab in normed_tab( tabgroup.tabs )"-->\n                    <el-tab-pane v-for="tab in normed_tab"\n                                lazy\n                                 :key="tab.name"\n                                 :name="tab.name">\n                        <span slot="label" v-text="tab.label" ></span>\n                        <!--<span v-if="!tab._loaded"></span>-->\n                        <component :is="tab.com || tab.editor" :tab_head="tab"\n                                   :par_row="ctx.par_row"\n                                   :ref="\'_tab_\'+tab.name" @tab-event="up_event($event)"></component>\n\n\n                    </el-tab-pane>\n                </el-tabs>\n\n                <component v-else v-for="tab in ctx.tabs"  :is="tab.com" :tab_head="tab"\n                           :par_row="ctx.par_row"\n                           :ref="\'_tab_\'+tab.name" @tab-event="up_event($event)"></component>\n    </div>',
    data: function data() {
        //ex.each(this.ctx.tabs,tab=>{
        //    if(tab.lazy_init){
        //        Vue.set(tab,'_loaded',false)
        //    }
        //})
        return {
            is_mounted: false
        };
    },

    watch: {
        //'ctx.crt_tab_name':function (v){
        //     this.show_tab(v)
        // }
    },
    created: function created() {},

    mounted: function mounted() {
        this.is_mounted = true;
        this.show_tab(this.ctx.crt_tab_name);
    },
    computed: {
        normed_tab: function normed_tab() {
            var tabs = this.ctx.tabs;
            var par_row = this.ctx.par_row;
            var out_tabs = ex.filter(tabs, function (tab) {
                if (tab.show) {
                    return ex.eval(tab.show, { par_row: par_row });
                    //return ex.boolExpress(par_row,tab.show)
                } else {
                    return true;
                }
            });
            return out_tabs;
        }
    },
    methods: {
        show_tab: function show_tab(name) {
            //var tab_head = ex.findone(this.normed_tab,{name:name})
            //if(tab_head.lazy_init){
            //     ex.eval(tab_head.lazy_init,{head:tab_head}).then(()=>{
            //         delete tab_head.lazy_init
            //         Vue.set(tab_head,'_loaded',true)
            //         this.ctx.crt_tab_name=name
            //     })
            //
            //}else{
            //    Vue.set(tab_head,'_loaded',true)
            //
            //}
            this.ctx.crt_tab_name = name;

            //var self =this
            //if(this.is_mounted){
            //    Vue.nextTick(function(){
            //        if(self.$refs['_tab_'+name][0].on_show){
            //            self.$refs['_tab_'+name][0].on_show()
            //        }
            //    })
            //}
        },
        handleClick: function handleClick(tab, event) {
            this.show_tab(tab.name);
        },

        up_event: function up_event(event) {
            this.$emit('win-event', event);
        }
    }
};
Vue.component('com-widget-el-tab', el_tab);
window.live_el_tab = el_tab;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _form_one = __webpack_require__(6);

var form_one = _interopRequireWildcard(_form_one);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pop_layer = pop_layer;

var _pop_fields_layer = __webpack_require__(3);

function pop_layer(com_ctx, component_name, callback, layerConfig) {
    // row,head ->//model_name,relat_field


    var pop_id = new Date().getTime();
    var psize = (0, _pop_fields_layer.get_proper_size)();
    var layer_config = {
        type: 1,
        area: psize, // ['800px', '500px'],
        title: com_ctx.title || '详细',
        zIndex: 1000,
        resize: true,
        resizing: function resizing(layero) {
            var total_height = $('#fields-pop-' + pop_id).parents('.layui-layer').height();
            if (this.title) {
                $('#fields-pop-' + pop_id).parents('.layui-layer-content').height(total_height - 42);
            } else {
                $('#fields-pop-' + pop_id).parents('.layui-layer-content').height(total_height);
            }
        },
        //shadeClose: true, //点击遮罩关闭  style="height: 100%;width: 100%"
        content: '<div id="fields-pop-' + pop_id + '" class="pop-layer" style="height: 100%;width: 100%">\n                    <component :is="component_name" :ctx="com_ctx" @finish="on_finish($event)"></component>\n                </div>',
        end: function end() {
            ex.remove(cfg.layer_index_stack, opened_layer_index);
        }
    };
    if (layerConfig) {
        ex.assign(layer_config, layerConfig);
    }
    var opened_layer_index = layer.open(layer_config);
    cfg.layer_index_stack.push(opened_layer_index);
    new Vue({
        el: '#fields-pop-' + pop_id,
        data: {
            com_ctx: com_ctx,
            component_name: component_name
        },
        methods: {
            on_finish: function on_finish(e) {
                if (callback) {
                    callback(e);
                }
            }
        }
    });
    return opened_layer_index;
}

window.pop_layer = pop_layer;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pop_table_layer = pop_table_layer;

var _pop_fields_layer = __webpack_require__(3);

function pop_table_layer(row, table_ctx, callback, layer_config) {
    // row,head ->//model_name,relat_field


    var pop_id = new Date().getTime();
    var psize = (0, _pop_fields_layer.get_proper_size)();
    var inn_config = {
        type: 1,
        area: psize, //['800px', '500px'],
        title: '列表',
        resize: true,
        resizing: function resizing(layero) {
            var total_height = $('#pop-table-' + pop_id).parents('.layui-layer').height();
            $('#pop-table-' + pop_id).parents('.layui-layer-content').height(total_height - 42);
            layer_vue.resize();
            layer_vue.setHeight(total_height - 160);
        },
        shadeClose: true, //点击遮罩关闭
        content: '<div id="pop-table-' + pop_id + '" style="height: 100%;padding-left: 10px">\n\n            <div class="rows-block flex-v" style="height: 100%">\n                <div class=\'flex\' style="min-height: 3em;" v-if="row_filters.length > 0">\n                    <com-filter class="flex" :heads="row_filters" :search_args="search_args"\n                                @submit="search()"></com-filter>\n                    <div class="flex-grow"></div>\n                </div>\n                <div class="box box-success flex-grow flex-v" >\n                    <div class="table-wraper flex-grow" style="position: relative">\n                    <div style="position: absolute;top:0;right:0;left:0;bottom: 0">\n                     <el-table class="table" ref="e_table"\n                                      :data="rows"\n                                      border\n                                      show-summary\n                                      :fit="false"\n                                      :stripe="true"\n                                      size="mini"\n                                      @sort-change="sortChange($event)"\n                                      @selection-change="handleSelectionChange"\n                                      :summary-method="getSum"\n                                      height="100%"\n                                      style="width: 100%">\n                                <el-table-column\n                                        v-if="selectable"\n                                        type="selection"\n                                        width="55">\n                                </el-table-column>\n\n                                <template  v-for="head in heads">\n\n                                    <el-table-column v-if="head.editor"\n                                                     :show-overflow-tooltip="is_show_tooltip(head) "\n                                                     :label="head.label"\n                                                     :sortable="is_sort(head)"\n                                                     :width="head.width">\n                                        <template slot-scope="scope">\n                                            <component :is="head.editor"\n                                                       @on-custom-comp="on_td_event($event)"\n                                                       :row-data="scope.row" :field="head.name" :index="scope.$index">\n                                            </component>\n\n                                        </template>\n\n                                    </el-table-column>\n\n                                    <el-table-column v-else\n                                                     :show-overflow-tooltip="is_show_tooltip(head) "\n                                                     :prop="head.name.toString()"\n                                                     :label="head.label"\n                                                     :sortable="is_sort(head)"\n                                                     :width="head.width">\n                                    </el-table-column>\n\n                                </template>\n\n                            </el-table>\n                     </div>\n\n                    </div>\n                    <div style="margin-top: 10px;">\n                         <el-pagination\n                                @size-change="on_perpage_change"\n                                @current-change="get_page"\n                                :current-page="row_pages.crt_page"\n                                :page-sizes="[20, 50, 100, 500]"\n                                :page-size="row_pages.perpage"\n                                layout="total, sizes, prev, pager, next, jumper"\n                                :total="row_pages.total">\n                        </el-pagination>\n                    </div>\n                </div>\n        </div>\n    </div>'
    };
    ex.assign(inn_config, layer_config);
    var opened_layer_indx = layer.open(inn_config);

    if (table_ctx.extra_mixins) {
        var real_extra_mixins = ex.map(table_ctx.extra_mixins, function (item) {
            if (typeof item == 'string') {
                return window[item];
            } else {
                return item;
            }
        });
        var mixins = [mix_table_data, mix_ele_table_adapter].concat(real_extra_mixins);
    } else {
        var mixins = [mix_table_data, mix_ele_table_adapter];
    }
    if (table_ctx.selectable == undefined) {
        table_ctx.selectable = true;
    }

    var layer_vue = new Vue({
        el: '#pop-table-' + pop_id,

        data: {
            par_row: row,
            //table_ctx:table_ctx,
            table_ctx: table_ctx,
            heads: table_ctx.heads,
            selectable: table_ctx.selectable,

            row_filters: table_ctx.row_filters,
            row_sort: table_ctx.row_sort,
            director_name: table_ctx.director_name,
            row_pages: {},
            rows: [],
            footer: [],
            selected: [],
            del_info: [],
            search_args: table_ctx.search_args || {},

            height: 350
        },
        mixins: mixins,
        mounted: function mounted() {
            this.getRows();
            //this.$refs.com_table.getRows()
            //var self =this
            //setTimeout(function(){
            //     self.$refs.com_table.getRows()
            // },1000)

            var self = this;
            ex.assign(this.op_funs, {
                send_select: function send_select(kws) {
                    // 用作选择框时，(只选择一个) 会用到该函数
                    callback(kws.row);
                    layer.close(opened_layer_indx);
                }
            });
        },
        methods: {
            setHeight: function setHeight(height) {
                this.height = height;
            }
            //on_sub_success:function(event){
            //    callback({name:'selected',row:event.row})
            //    //callback({name:'after_save',new_row:event.new_row,old_row:event.old_row})
            //
            //},

        }
    });
} /*
   * root 层面创建Vue组件，形成弹出框
   * */


window.pop_table_layer = pop_table_layer;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(224);

Vue.component('com-widget-stack', {
    props: ['ctx_list'],
    template: '<div class="com-widget-stack">\n        <component v-for="(ctx,index) in ctx_list" v-show="index==ctx_list.length-1"\n            :is="ctx.widget" :ctx="ctx" @win-event="$emit(\'win-event\',$event)"></component>\n    </div>'

});

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mix_fields_data = __webpack_require__(125);

var mix_fields_data = _interopRequireWildcard(_mix_fields_data);

var _mix_nice_validator = __webpack_require__(126);

var mix_nice_validator = _interopRequireWildcard(_mix_nice_validator);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(225);

var mix_ele_table_adapter = {
    mounted: function mounted() {
        if (!this.search_args._sort) {
            Vue.set(this.search_args, '_sort', '');
        }
    },
    watch: {
        'search_args._sort': function search_args_sort(v) {
            if (!v && this.$refs.e_table) {
                this.$refs.e_table.clearSort();
            }
        }
    },
    methods: {
        is_sort: function is_sort(head) {
            if (ex.isin(head.name, this.row_sort.sortable)) {
                return 'custom';
            } else {
                return false;
            }
        },
        is_show_tooltip: function is_show_tooltip(head) {
            if (head.show_tooltip == undefined) {
                return true;
            } else {
                return head.show_tooltip;
            }
        },
        handleSelectionChange: function handleSelectionChange(val) {
            this.selected = val;
        },

        clearSelection: function clearSelection() {
            this.selected = [];
            this.$refs.e_table.clearSelection();
        },
        sortChange: function sortChange(params) {
            //{ column, prop, order }
            var self = this;
            //                this.$refs.e_table.clearSort()
            //                ex.each(this.row_sort.sortable,function(name){
            if (params.prop) {
                if (params.order == 'ascending') {
                    self.search_args._sort = params.prop;
                } else if (params.order == 'descending') {
                    self.search_args._sort = '-' + params.prop;
                }
            } else {
                self.search_args._sort = '';
            }
            this.search();
            //                })
        },

        //getSum:function(param){
        //    return this.footer
        //},
        on_perpage_change: function on_perpage_change(perpage) {
            this.search_args._perpage = perpage;
            this.search_args._page = 1;
            this.getRows();
        }
    }
};

window.mix_ele_table_adapter = mix_ele_table_adapter;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
被 table_store 替代掉了
* */
var mix_table_data = {
    created: function created() {
        if (!this.search_args) {
            this.search_args = search_args;
        }
    },
    data: function data() {
        return {
            op_funs: {},
            changed_rows: [],
            table_layout: {}
        };
    },
    mounted: function mounted() {
        var self = this;
        //this.childStore=new Vue({
        //
        //})

        ex.assign(this.op_funs, {
            save_changed_rows: function save_changed_rows() {
                self.save_rows(self.changed_rows);
                self.changed_rows = [];
            },
            add_new: function add_new(kws) {
                /*
                * model_name,
                * */
                self.add_new(kws);
            },
            delete: function _delete() {
                self.del_selected();
            },
            get_data: function get_data() {
                self.getRows();
            },
            refresh: function refresh() {
                self.search();
            },
            selected_set_value: function selected_set_value(kws) {
                /* kws ={ field,value }
                * */
                ex.each(self.selected, function (row) {
                    row[kws.field] = kws.value;
                    if (row._hash != ex.hashDict(row)) {
                        if (!ex.isin(row, self.changed_rows)) {
                            self.changed_rows.push(row);
                        }
                    }
                });
            },
            selected_set_and_save: function selected_set_and_save(kws) {
                /*
                这个是主力函数
                 // 路线：弹出->编辑->update前端（缓存的）row->保存->后台->成功->update前端row->关闭窗口
                * */
                // head: row_match:many_row ,
                var row_match_fun = kws.row_match || 'many_row';
                if (!row_match[row_match_fun](self, kws)) {
                    return;
                }

                function bb(all_set_dict, after_save_callback) {
                    var cache_rows = ex.copy(self.selected);
                    ex.each(cache_rows, function (row) {
                        ex.assign(row, all_set_dict);
                        if (kws.fields_ctx && kws.fields_ctx.director_name) {
                            row._cache_director_name = row._director_name; // [1] 有可能是用的特殊的 direcotor
                            row._director_name = kws.fields_ctx.director_name;
                        }
                        row[kws.field] = kws.value;
                    });
                    var post_data = [{ fun: 'save_rows', rows: cache_rows }];
                    cfg.show_load();
                    ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                        if (!resp.save_rows.errors) {
                            ex.each(resp.save_rows, function (new_row) {
                                delete new_row._director_name; // [1]  这里还原回去
                                self.update_or_insert(new_row);
                            });
                            self.clearSelection();

                            cfg.hide_load(2000);
                        } else {
                            cfg.hide_load();
                            // 留到下面的field弹出框，按照nicevalidator的方式去显示错误
                            //cfg.showError(resp.save_rows.msg)
                        }

                        //self.op_funs.update_or_insert_rows({rows:resp.save_rows} )

                        if (after_save_callback) {
                            after_save_callback(resp);
                        }
                    });
                }

                function judge_pop_fun() {
                    if (kws.fields_ctx) {
                        var one_row = ex.copy(self.selected[0]);
                        var win_index = pop_edit_local(one_row, kws.fields_ctx, function (new_row, store_id) {
                            bb(new_row, function (resp) {
                                if (resp.save_rows.errors) {
                                    self.$store.commit(store_id + '/showErrors', resp.save_rows.errors);
                                } else {
                                    layer.close(win_index);
                                }
                            });
                        });
                    } else {
                        bb({});
                    }
                }

                if (kws.confirm_msg) {
                    layer.confirm(kws.confirm_msg, { icon: 3, title: '提示' }, function (index) {
                        layer.close(index);
                        judge_pop_fun();
                    });
                } else {
                    judge_pop_fun();
                }
            },
            selected_pop_set_and_save: function selected_pop_set_and_save(kws) {
                // 被  selected_set_and_save 取代了。
                // 路线：弹出->编辑->保存->后台(成功)->update前端row->关闭窗口
                var row_match_fun = kws.row_match || 'one_row';
                if (!row_match[row_match_fun](self, kws)) {
                    return;
                }

                var crt_row = self.selected[0];
                var cache_director_name = crt_row._director_name;
                crt_row._director_name = kws.fields_ctx.director_name;
                var win_index = pop_fields_layer(crt_row, kws.fields_ctx, function (new_row) {
                    ex.assign(crt_row, new_row);
                    crt_row._director_name = cache_director_name;
                    layer.close(win_index);
                });
            },
            ajax_row: function ajax_row(kws) {
                // kws 是head : {'fun': 'ajax_row', 'app': 'maindb', 'ajax_fun': 'modify_money_pswd', 'editor': 'com-op-btn', 'label': '重置资金密码', },
                if (self.selected.length == 0) {
                    cfg.showMsg('请选择一行数据');
                    return;
                }
                var row = self.selected[0];
                var post_data = [{ fun: kws.ajax_fun, row: row }];

                cfg.show_load();
                ex.post('/d/ajax/' + kws.app, JSON.stringify(post_data), function (resp) {
                    cfg.hide_load(2000);
                });
            },
            create_child_row: function create_child_row(kws) {
                /*
                 * */
                if (kws.fields_ctx) {
                    var fields_ctx = kws.fields_ctx;
                    var dc = { fun: 'get_row', director_name: fields_ctx.director_name };
                    if (kws.init_fields) {
                        ex.assign(dc, kws.init_fields);
                    }
                    var post_data = [dc];
                    cfg.show_load();
                    ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                        cfg.hide_load();
                        var crt_row = resp.get_row;
                        self.crt_row = crt_row;
                        crt_row.carry_parents = self.parents;

                        if (kws.tab_name) {
                            self.$emit('operation', { fun: 'switch_to_tab', tab_name: kws.tab_name, row: crt_row });
                        } else {
                            var win = pop_fields_layer(crt_row, fields_ctx, function (new_row) {
                                layer.close(win);
                                if (kws.after_save == 'refresh') {
                                    self.search();
                                } else {
                                    self.update_or_insert(new_row, crt_row);
                                }
                            });
                        }
                    });

                    //var row={
                    //    _director_name:kws.fields_ctx._director_name
                    //}
                    //pop_edit_local(row,kws.fields_ctx,function(new_row){
                    //    cfg.show_load()
                    //    ex.director_call(kws.fields_ctx.director_name,{row:new_row,parents:self.parents},function(resp){
                    //        cfg.hide_load(300)
                    //        self.update_or_insert(resp.row)
                    //    })
                    //})
                }
            },

            director_call: function director_call(kws) {
                function bb() {
                    cfg.show_load();
                    ex.director_call(kws.director_name, {}, function (resp) {
                        if (!resp.msg) {
                            cfg.hide_load(2000);
                        } else {
                            cfg.hide_load();
                        }
                        if (kws.after_call) {
                            self.op_funs[kws.after_call](resp);
                            if (resp.msg) {
                                cfg.showMsg(resp.msg);
                            }
                        }
                    });
                }

                if (kws.confirm_msg) {
                    layer.confirm(kws.confirm_msg, { icon: 3, title: '提示' }, function (index) {
                        layer.close(index);
                        bb();
                    });
                } else {
                    bb();
                }
            },
            director_rows: function director_rows(kws) {
                // kws: {after_call:'update_or_insert_rows'}
                var row_match_fun = kws.row_match || 'one_row';
                if (!row_match[row_match_fun](self, kws)) {
                    return;
                }

                function bb() {
                    cfg.show_load();
                    ex.director_call(kws.director_name, { rows: self.selected }, function (resp) {
                        if (!resp.msg) {
                            cfg.hide_load(2000);
                        } else {
                            cfg.hide_load();
                        }
                        if (kws.after_call) {
                            self.op_funs[kws.after_call](resp);
                            if (resp.msg) {
                                cfg.showMsg(resp.msg);
                            }
                        }
                    });
                }

                if (kws.confirm_msg) {
                    layer.confirm(kws.confirm_msg, { icon: 3, title: '提示' }, function (index) {
                        layer.close(index);
                        bb();
                    });
                } else {
                    bb();
                }
            },
            emitEvent: function emitEvent(e) {
                self.$emit(e);
            },

            update_or_insert: function update_or_insert(kws) {
                self.update_or_insert(kws.new_row, kws.old_row);
            },
            update_or_insert_rows: function update_or_insert_rows(kws) {
                var rows = kws.rows;
                ex.each(rows, function (row) {
                    self.update_or_insert(row);
                });
            },

            export_excel: function export_excel() {
                var search_args = ex.copy(self.search_args);
                search_args._perpage = 5000;
                var post_data = [{ fun: 'get_excel', director_name: self.director_name, search_args: search_args }];
                cfg.show_load();
                ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                    cfg.hide_load();
                    var url = resp.get_excel.file_url;
                    ex.download(url);
                });
            },

            // 为了刷新界面，付出了清空的代价，这两个函数小心使用，
            row_up: function row_up(kws) {
                var row = kws.row;
                var index = self.rows.indexOf(row);
                if (index >= 1) {
                    var ss = swap(self.rows, index - 1, index);
                    //self.rows=[]
                    //Vue.nextTick(function(){
                    //    self.rows=ss
                    //})
                }
                //self.$refs.core_table.sort()
            },
            row_down: function row_down(kws) {
                var row = kws.row;
                var index = self.rows.indexOf(row);
                if (index < self.rows.length - 1) {
                    //Vue.set(self,'rows',swap(self.rows,index+1,index))
                    //self.rows =
                    var ss = swap(self.rows, index + 1, index);
                    //self.rows=[]
                    //Vue.nextTick(function(){
                    //    self.rows=ss
                    //})
                }
                //self.$refs.core_table.sort()
            }

        });
        //this.$refs.op_save_changed_rows[0].set_enable(false)
        //this.$refs.op_delete[0].set_enable(false)
    },
    computed: {
        changed: function changed() {
            return this.changed_rows.length != 0;
        },
        has_select: function has_select() {
            return this.selected.length != 0;
        }
    },

    methods: {
        on_operation: function on_operation(kws) {
            var fun_name = kws.fun || kws.name;
            this.op_funs[fun_name](kws);
        },
        on_td_event: function on_td_event(kws) {
            var fun_name = kws.fun || kws.name;
            this.op_funs[fun_name](kws);
            //this.op_funs[e.name](e)
        },
        search: function search() {
            this.search_args._page = 1;
            this.getRows();
        },
        add_new: function add_new(kws) {
            var self = this;
            var fields_ctx = kws.fields_ctx;
            var dc = { fun: 'get_row', director_name: fields_ctx.director_name };
            if (kws.pre_set) {
                var pre_set = ex.eval(kws.pre_set, { vc: self });
                ex.assign(dc, pre_set);
            } else if (kws.init_fields) {
                // 老的的调用，准备移除
                ex.assign(dc, kws.init_fields);
            }
            var post_data = [dc];
            cfg.show_load();
            ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                cfg.hide_load();
                var crt_row = resp.get_row;
                self.crt_row = crt_row;
                if (kws.tab_name) {
                    //self.switch_to_tab(kws)
                    self.$emit('operation', { fun: 'switch_to_tab', tab_name: kws.tab_name, row: crt_row });
                    //self.switch_to_tab({tab_name:kws.tab_name,row:crt_row})
                } else {
                    var win = pop_fields_layer(crt_row, fields_ctx, function (new_row) {
                        self.update_or_insert(new_row, crt_row);
                        layer.close(win);
                    });
                }
            });
        },
        editRow: function editRow(kws) {
            var row = kws.row;
            var fields_ctx = kws.fields_ctx;
        },
        update_or_insert: function update_or_insert(new_row, old_row) {
            // 如果是更新，不用输入old_row，old_row只是用来判断是否是创建的行为
            if (old_row && !old_row.pk) {

                //var rows = this.rows.splice(0, 0, new_row)

                this.rows = [new_row].concat(this.rows);
                this.row_pages.total += 1;
            } else {
                var table_row = ex.findone(this.rows, { pk: new_row.pk });
                //ex.assign(table_row,new_row)
                for (var key in new_row) {
                    Vue.set(table_row, key, new_row[key]);
                }
            }
        },
        getRows: function getRows() {
            /*
            以后都用这个函数，不用什么get_data 或者 data_getter 了
            * */
            var self = this;

            cfg.show_load();
            self.rows = [];

            var post_data = [{ fun: 'get_rows', director_name: self.director_name, search_args: self.search_args }];
            ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {

                self.rows = resp.get_rows.rows;
                self.row_pages = resp.get_rows.row_pages;
                //self.search_args=resp.get_rows.search_args
                ex.vueAssign(self.search_args, resp.get_rows.search_args);
                self.footer = resp.get_rows.footer;
                self.parents = resp.get_rows.parents;
                self.table_layout = resp.get_rows.table_layout;
                cfg.hide_load();
            });
        },
        get_page: function get_page(page_number) {
            this.search_args._page = page_number;
            this.getRows();
        },
        get_search_args: function get_search_args() {
            return this.search_args;
        },
        //data_getter:function(){
        //    // 默认的 data_getter
        //    var self=this
        //
        //    cfg.show_load()
        //    var post_data=[{fun:'get_rows',director_name:this.director_name,search_args:this.search_args}]
        //    $.get('/d/ajax',JSON.stringify(post_data),function(resp){
        //        self.rows = resp.rows
        //        self.row_pages = resp.row_pages
        //        cfg.hide_load()
        //    })
        //},
        save_rows: function save_rows(rows) {
            var self = this;
            var post_data = [{ fun: 'save_rows', rows: rows }];
            cfg.show_load();
            ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                ex.each(rows, function (row) {
                    var new_row = ex.findone(resp.save_rows, { pk: row.pk });
                    ex.assign(row, new_row);
                });
                cfg.hide_load(2000);
            });
        },
        clear: function clear() {
            this.rows = [];
            this.row_pages = {};
        },

        del_selected: function del_selected() {
            var self = this;
            layer.confirm('真的删除吗?', { icon: 3, title: '确认' }, function (index) {
                layer.close(index);
                //var ss = layer.load(2);
                cfg.show_load();
                var post_data = [{ fun: 'del_rows', rows: self.selected }];
                ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                    //self.row_pages.total -= self.selected.length
                    //ex.each(self.selected,function(item){
                    //    ex.remove(self.rows,{pk:item.pk} )
                    //})
                    //self.selected=[]
                    cfg.hide_load(500);
                    self.search();
                    //layer.msg('删除成功',{time:2000})
                });
            });
        },
        get_attr: function get_attr(name) {
            if (name == undefined) {
                return false;
            }
            if (name.startsWith('!')) {
                name = name.slice(1);
                name = name.trim();
                return !this[name];
            } else {
                name = name.trim();
                return this[name];
            }
        }
        //has_select:function(){
        //    return this.selected.length > 0
        //}

    }
};

var row_match = {
    one_row: function one_row(self, head) {
        if (self.selected.length != 1) {
            cfg.showMsg('请选择一行数据！');
            return false;
        } else {
            return true;
        }
    },
    many_row: function many_row(self, head) {
        if (self.selected.length == 0) {
            cfg.showMsg('请至少选择一行数据！');
            return false;
        } else {
            return true;
        }
    },
    one_row_match: function one_row_match(self, head) {
        if (self.selected.length != 1) {
            cfg.showMsg('请选择一行数据！');
            return false;
        } else {
            var field = head.match_field;
            var values = head.match_values;
            var msg = head.match_msg;

            var row = self.selected[0];

            if (!ex.isin(row[field], values)) {
                cfg.showMsg(msg);
                return false;
            } else {
                return true;
            }
        }
    },
    many_row_match: function many_row_match(self, head) {
        // head : @match_field , @match_values ,@match_msg
        if (self.selected.length == 0) {
            cfg.showMsg('请至少选择一行数据！');
            return false;
        } else {
            var field = head.match_field;
            var values = head.match_values;
            var msg = head.match_msg;

            for (var i = 0; i < self.selected.length; i++) {
                var row = self.selected[i];
                if (!ex.isin(row[field], values)) {
                    cfg.showMsg(msg);
                    return false;
                }
            }
            return true;
        }
    }
};

function swap(arr, k, j) {
    var c = arr[k];
    arr.splice(k, 1, arr[j]);
    arr.splice(j, 1, c);
    //arr[k] = arr[j];
    //arr[j] = c;
    return arr;
}

window.mix_table_data = mix_table_data;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mix_v_table_adapter = {

    mounted: function mounted() {
        eventBus.$on('content_resize', this.resize);
        eventBus.$on('openlayer_changed', this.refreshSize);
    },
    computed: {
        columns: function columns() {
            var self = this;
            var first_col = {
                width: 60,
                titleAlign: 'center',
                columnAlign: 'center',
                type: 'selection',
                isFrozen: true
            };
            var cols = [first_col];
            var converted_heads = ex.map(this.heads, function (head) {
                var col = ex.copy(head);
                var dc = {
                    field: head.name,
                    title: head.label,
                    isResize: true
                };
                if (head.editor) {
                    dc.componentName = head.editor;
                }
                if (ex.isin(head.name, self.row_sort.sortable)) {
                    dc.orderBy = '';
                }
                ex.assign(col, dc);
                if (!col.width) {
                    col.width = 200;
                }
                return col;
            });
            cols = cols.concat(converted_heads);
            return cols;
        }
    },
    methods: {
        refreshSize: function refreshSize() {
            this.$refs.vtable.resize();
        },
        resize: function resize() {
            var self = this;
            $(self.$refs.vtable.$el).find('.v-table-rightview').css('width', '100%');
            $(self.$refs.vtable.$el).find('.v-table-header').css('width', '100%');
            $(self.$refs.vtable.$el).find('.v-table-body').css('width', '100%');

            var tmid = setInterval(function () {
                self.$refs.vtable.resize();
            }, 50);
            setTimeout(function () {
                //self.$refs.vtable.resize()
                clearInterval(tmid);
            }, 600);
        },
        on_perpage_change: function on_perpage_change(perpage) {
            this.search_args._perpage = perpage;
            this.search_args._page = 1;
            this.getRows();
        },
        sortChange: function sortChange(params) {
            var self = this;
            ex.each(this.row_sort.sortable, function (name) {
                if (params[name]) {
                    if (params[name] == 'asc') {
                        self.search_args._sort = name;
                    } else {
                        self.search_args._sort = '-' + name;
                    }
                    return 'break';
                }
            });
            this.get_data();
        }
    }
};
window.mix_v_table_adapter = mix_v_table_adapter;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


$.validator.config({
    rules: {
        mobile: [/^1[3-9]\d{9}$/, "请填写有效的手机号"],
        chinese: [/^[\u0391-\uFFE5]+$/, "请填写中文字符"],
        number: function number(element, params) {
            if (!element.value) {
                return true;
            }
            var pattern = "^(\\-|\\+)?\\d+(\\.\\d+)?$";
            return RegExp(pattern).test(element.value) || '请输入数字';
        },
        digit: function digit(element, params) {
            var digits = params[0];
            var pattern = "\\.\\d{0," + digits + "}$|^[\\d]+$";
            return RegExp(pattern).test(element.value) || '请输入有效位数为' + digits + '的数字';
        },
        dot_split_int: function dot_split_int(element, params) {
            return (/^(\d+[,])*(\d+)$/.test(element.value) || '请输入逗号分隔的整数'
            );
        },
        ip: [/^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i, '请填写有效的 IP 地址'],

        regexp: function regexp(element, param) {
            var exp = new RegExp(param);
            return exp.test(element.value) || '不满足规则';
        },
        express: function express(element, param) {
            // 举例
            //express = base64.b64encode("parseFloat(scope.value) > 0".encode('utf-8'))
            //msg = base64.b64encode('必须大于0'.encode('utf-8'))
            //head['fv_rule']= 'express(%s , %s)'%( express.decode('utf-8'),msg.decode('utf-8'))

            var real_param = ex.atou(param[0]);
            if (param[1]) {
                var msg = ex.atou(param[1]);
            } else {
                var msg = '不满足规则';
            }
            return ex.eval(real_param, { value: element.value, element: element }) || msg;
        },
        myremote: function myremote(element, param) {
            var real_param = ex.atou(param[0]);
            return ex.eval(real_param, { value: element.value, element: element });
        },

        // com-field-table-list
        key_unique: function key_unique(elem, param) {
            //return /^1[3458]\d{9}$/.test($(elem).val()) || '请检查手机号格式';
            var keys = param;
            var value = $(elem).val();
            if (!value) return true;
            var rows = JSON.parse(value);
            var dc = {};
            ex.each(keys, function (key) {
                dc[key] = [];
            });
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                for (var j = 0; j < keys.length; j++) {
                    var key = keys[j];
                    if (ex.isin(row[key], dc[key])) {
                        return key + "重复了";
                    } else {
                        dc[key].push(row[key]);
                    }
                }
            }
            return true;
        },
        group_unique: function group_unique(elem, param) {
            var keys = param;
            var value = $(elem).val();
            if (!value) return true;
            var rows = JSON.parse(value);
            var ls = [];
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var group_value = '';
                ex.each(keys, function (key) {
                    group_value += row[key];
                });
                if (ex.isin(group_value, ls)) {
                    return group_value + "重复了";
                } else {
                    ls.push(group_value);
                }
            }
            return true;
        }
    }
});

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _table_store = __webpack_require__(128);

var table_store = _interopRequireWildcard(_table_store);

var _table_page_store = __webpack_require__(127);

var table_page_store = _interopRequireWildcard(_table_page_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _switch = __webpack_require__(131);

var switch_btn = _interopRequireWildcard(_switch);

var _plain_btn = __webpack_require__(129);

var plain_btn = _interopRequireWildcard(_plain_btn);

var _search = __webpack_require__(130);

var search = _interopRequireWildcard(_search);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _fields_panel = __webpack_require__(7);

var fields_panel = _interopRequireWildcard(_fields_panel);

var _html_panel = __webpack_require__(138);

var html_panel = _interopRequireWildcard(_html_panel);

var _table_panel = __webpack_require__(141);

var table_panel = _interopRequireWildcard(_table_panel);

var _iframe = __webpack_require__(139);

var iframe = _interopRequireWildcard(_iframe);

var _html_content_panel = __webpack_require__(137);

var html_content_panel = _interopRequireWildcard(_html_content_panel);

var _form_panel = __webpack_require__(135);

var form_panel = _interopRequireWildcard(_form_panel);

var _pop_fields_panel = __webpack_require__(140);

var pop_fields_panel = _interopRequireWildcard(_pop_fields_panel);

var _table_setting = __webpack_require__(142);

var table_setting = _interopRequireWildcard(_table_setting);

var _grid_layout = __webpack_require__(136);

var grid_layout = _interopRequireWildcard(_grid_layout);

var _chart = __webpack_require__(132);

var chart = _interopRequireWildcard(_chart);

var _main = __webpack_require__(133);

var charts_main = _interopRequireWildcard(_main);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
//var table_store={
//    namespace:true,
//    state(){
//        return {
//            childbus:new Vue(),
//        }
//    },
//    mutations:{
//    }
//}

//window.table_store = table_store


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
以html形式显示  _html_field 的内容
* */
var append_html_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-html="rowData[\'_html_\'+field]"></span>'

};

Vue.component('com-table-append-html-shower', append_html_shower);

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
将 pk 数组映射为 label字符串
[1,2,3] -> '小王;小张;小赵'

* */
var array_mapper = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-text="show_data"></span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    computed: {
        show_data: function show_data() {
            var self = this;
            var values = self.rowData[self.field];
            if (!values) {
                return values;
            }

            if (this.table_par) {
                if (this.head.parse_input) {
                    var values = parse_input[this.head.parse_input](values);
                }
                var value_labels = ex.map(values, function (value) {
                    var item = ex.findone(self.head.options, { value: value });
                    if (item) {
                        return item.label;
                    } else {
                        return '';
                    }
                    // {value:value,label:self.head.options[value]}
                });
                var ordered_values = ex.sortOrder(value_labels);

                //var str =''
                //ex.each(ordered_values,function(itm){
                //    str+=itm.label
                //    //str+= options[itm]
                //    str+=';'
                //})
                return ordered_values.join(';');
                //return options[value]
            }
        }

    }
};

var parse_input = {
    dotSplit: function dotSplit(str) {
        return str.split(',');
    }
};

Vue.component('com-table-array-mapper', array_mapper);

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var array_mapper = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-text="show_data"></span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    computed: {
        show_data: function show_data() {
            var self = this;
            var values = self.rowData[self.field];
            if (!values) {
                return values;
            }
            var obj_list = JSON.parse(values);
            var out_list = ex.map(obj_list, function (item) {
                return item[self.head.key || 'label'];
            });
            return out_list.join(';');
        }
    }

};

Vue.component('com-table-array-obj-shower', array_mapper);

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*

** 这个文件应该是不用了。。

映射[一个]
 options:{
 key:value
 }
 * */
var mapper = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-text="show_data"></span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
    },
    computed: {
        show_data: function show_data() {
            if (this.table_par) {
                var value = this.rowData[this.field];
                var head = ex.findone(this.table_par.heads, { name: this.field });
                var options = head.options;
                var opt = ex.findone(options, { value: value });
                return opt.label;
            }
        }
    }
};

Vue.component('com-table-array-option-mapper', mapper);

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bool_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<span>\n       <el-switch\n              v-model="is_true"\n              active-color="#13ce66"\n              inactive-color="#ff4949">\n        </el-switch>\n    </span>',

    computed: {
        is_true: {
            get: function get() {
                var value = this.rowData[this.field];
                if (value == 1) {
                    return true;
                } else {
                    return value;
                }
            },
            set: function set(newValue) {
                var crt_value = this.rowData[this.field];
                if (crt_value == 0 || crt_value == 1) {
                    this.rowData[this.field] = newValue ? 1 : 0;
                } else {
                    this.rowData[this.field] = newValue;
                }
            }
        }
    }

};

Vue.component('com-table-bool-editor', bool_shower);

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bool_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<span class="com-table-bool-shower">\n    <i v-if="rowData[field]" style="color: green" class="fa fa-check-circle"></i>\n    <i v-else-if="rowData[field]==false" style="color: red" class="fa fa-times-circle"></i>\n    </span>'

};

Vue.component('com-table-bool-shower', bool_shower);

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var call_fun = {
    // head: {fun:'xxx'}
    props: ['rowData', 'field', 'index'],
    template: '<span v-text="rowData[field]" class="clickable" @click="on_click()"></span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    methods: {
        on_click: function on_click() {
            this.$emit('on-custom-comp', { name: this.head.fun, row: this.rowData, head: this.head });
        }
    }
};

Vue.component('com-table-call-fun', call_fun);

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(230);
var change_order = {
    props: ['rowData', 'field', 'index'],
    template: '<span class="change-order">\n    <span class="arrow" @click="up()">\n    <i  class="fa fa-long-arrow-up"></i>\n    </span>\n    <span class="arrow" @click="down()">\n     <i  class="fa fa-long-arrow-down"></i>\n    </span>\n    </span>',
    methods: {
        up: function up() {
            this.$emit('on-custom-comp', { fun: 'row_up', row: this.rowData });
        },
        down: function down() {
            this.$emit('on-custom-comp', { fun: 'row_down', row: this.rowData });
        }
    }

};

Vue.component('com-table-change-order', change_order);

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mix_editor = __webpack_require__(8);

__webpack_require__(231);

var check_box = {
    props: ['rowData', 'field', 'index'],
    template: '<div :class="[\'com-table-checkbox\',{\'dirty\':is_dirty}]"><input style="width: 100%" @change="on_changed()" type="checkbox" v-model="rowData[field]"></div>',
    mixins: [_mix_editor.mix_editor]
};

Vue.component('com-table-checkbox', check_box);

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var money_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-text="show_text" ></span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },

    computed: {
        show_text: function show_text() {
            if (this.rowData[this.field]) {
                return parseFloat(this.rowData[this.field]).toFixed(this.head.digit);
            } else {
                return this.rowData[this.field];
            }
        }
    }

};

Vue.component('com-table-digit-shower', money_shower);

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
额外的点击列，例如“详情”
head['label']=
head['fun']

现在全部使用  com-table-ops-cell 控件

* */

var extra_click = {
    props: ['rowData', 'field', 'index'],
    template: '<span class="clickable" v-text="head.label" @click="on_click()"></span>',
    created: function created() {
        // find head from parent table
        this.parStore = ex.vueParStore(this);
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },

    methods: {
        on_click: function on_click() {
            if (this.head.action) {
                ex.eval(this.head.action, { row: this.rowData, head: this.head, ps: this.parStore });
            } else {
                this.$emit('on-custom-comp', { name: this.head.fun, row: this.rowData, head: this.head });
            }
        }

    }
};

Vue.component('com-table-extraclick', extra_click);

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 与 extra_click的区别是
 1. 可以添加多个按钮
 2. 根据filter返回不同的按钮

 现在全部使用  com-table-ops-cell 控件

 * */

__webpack_require__(232);

var extra_click_plus = {
    props: ['rowData', 'field', 'index'],
    data: function data() {
        return {
            is_mobile: !ex.device.pc
        };
    },
    template: '<div :class="[\'extra-click-plus\',{\'mobile\':is_mobile}]"><span v-for="(ope,index) in operations">\n                <span v-if="ope.icon" class="icon">\n                      <span class="clickable item" v-html="ope.icon" @click="on_click(ope)"\n                      :title="ope.label"></span>\n                </span>\n                <span v-else>\n                    <span class="clickable item" v-text="ope.label" @click="on_click(ope)"></span>\n                    <span v-if="index < operations.length-1">/</span>  </span>\n                </span>\n                </div>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },

    computed: {
        operations: function operations() {
            if (this.head.filter) {
                if (typeof this.head.filter == 'string') {
                    var filter_fun = window[this.head.filter];
                } else {
                    var filter_fun = this.head.filter;
                }
                return filter_fun(this.head, this.rowData);
            } else {
                return this.head.operations;
            }
        }
    },

    methods: {
        on_click: function on_click(ope) {
            this.$emit('on-custom-comp', { name: ope.fun, row: this.rowData, head: this.head });
        }

    }
};

Vue.component('com-table-extraclick-plus', extra_click_plus);

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var foreign_click_select = {
    props: ['rowData', 'field', 'index'],
    template: '<span class="clickable" v-text="rowData[field]" @click="on_click()"></span>',
    data: function data() {
        return {
            parStore: ex.vueParStore(this),
            label: '_' + this.field + '_label'
        };
    },
    computed: {},
    methods: {
        on_click: function on_click() {
            //this.$emit('on-custom-comp',{fun:'send_select',row:this.rowData})
            this.parStore.$emit('finish', this.rowData);
        }
    }
};

Vue.component('com-table-foreign-click-select', foreign_click_select);

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var html_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-html="rowData[field]"></span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    mounted: function mounted() {}
};

Vue.component('com-table-html-shower', html_shower);

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bool_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<span>\n    <a :href="link" target="_blank" v-text="rowData[field]"></a>\n    </span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    computed: {
        link: function link() {
            return this.rowData[this.head.link_field];
        }
    }

};

Vue.component('com-table-jump-link', bool_shower);

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var label_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<div class="com-table-label-shower" v-html="show_text"></div>',
    data: function data() {
        return {
            label: '_' + this.field + '_label'
        };
    },
    computed: {
        show_text: function show_text() {
            if (this.rowData[this.label] != undefined) {
                return this.rowData[this.label];
            } else {
                return '';
            }
        }
    }
};

Vue.component('com-table-label-shower', label_shower);

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(233);
var line_text = {
    props: ['rowData', 'field', 'index'],
    template: '<div :class="[\'com-table-linetext\',{\'dirty\':is_dirty}]">\n        <span v-if="readonly" v-text="rowData[field]"></span>\n        <input v-else @change="on_changed()" style="width: 100%" type="text" v-model="rowData[field]">\n    </div>',
    data: function data() {
        return {
            org_value: this.rowData[this.field]
        };
    },
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    computed: {
        is_dirty: function is_dirty() {
            return this.rowData[this.field] != this.org_value;
        },
        readonly: function readonly() {
            if (this.head.readonly) {
                return _readonly[this.head.readonly.fun](this, this.head.readonly);
            } else {
                return false;
            }
        }
    },
    watch: {
        'rowData._hash': function rowData_hash() {
            this.org_value = this.rowData[this.field];
        }
    },
    methods: {
        getRowValue: function getRowValue(field) {
            return this.rowData[field];
        },
        on_changed: function on_changed() {
            var value = this.rowData[this.field];
            if (value == this.org_value) {
                this.$emit('on-custom-comp', { name: 'row_changed_undo_act', row: this.rowData });
            } else {
                this.$emit('on-custom-comp', { name: 'row_changed', row: this.rowData });
            }
        }
    }
};

Vue.component('com-table-linetext', line_text);

var _readonly = {
    checkRowValue: function checkRowValue(self, kws) {
        var field = kws.field;
        var target_value = kws.target_value;
        return self.rowData[field] == target_value;
    }
};

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _pop_fields_from_row = __webpack_require__(153);

var pop_fields_from_row = _interopRequireWildcard(_pop_fields_from_row);

var _sequence = __webpack_require__(155);

var sequence = _interopRequireWildcard(_sequence);

var _style_block = __webpack_require__(157);

var style_block = _interopRequireWildcard(_style_block);

var _ops_cell = __webpack_require__(152);

var ops_cell = _interopRequireWildcard(_ops_cell);

var _span = __webpack_require__(156);

var table_span = _interopRequireWildcard(_span);

var _array_shower = __webpack_require__(143);

var array_shower = _interopRequireWildcard(_array_shower);

var _click = __webpack_require__(144);

var click = _interopRequireWildcard(_click);

var _json = __webpack_require__(147);

var my_json = _interopRequireWildcard(_json);

var _multi_image = __webpack_require__(150);

var multi_image = _interopRequireWildcard(_multi_image);

var _map_html = __webpack_require__(149);

var map_html = _interopRequireWildcard(_map_html);

var _link = __webpack_require__(148);

var link = _interopRequireWildcard(_link);

var _rich_span = __webpack_require__(154);

var rich_span = _interopRequireWildcard(_rich_span);

var _multi_row = __webpack_require__(151);

var multi_row = _interopRequireWildcard(_multi_row);

var _color = __webpack_require__(145);

var color = _interopRequireWildcard(_color);

var _icon_cell = __webpack_require__(146);

var icon_cell = _interopRequireWildcard(_icon_cell);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
options:{
    key:value
}
* */
var mapper = {
    props: ['rowData', 'field', 'index'],
    template: '<span class="com-table-mapper" v-text="show_data"></span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    //mounted(){
    //    if(this.head.css){
    //        ex.append_css(this.head.css)
    //    }
    //},
    computed: {
        //myclass(){
        //    if(this.head.class){
        //        return ex.eval(this.head.class,{head:this.head,row:this.rowData})
        //    }else{
        //        return ''
        //    }
        //},
        show_data: function show_data() {
            if (this.table_par) {
                var value = this.rowData[this.field];
                var options = this.head.options;
                var opt = ex.findone(options, { value: value });
                if (opt) {
                    return opt['label'];
                } else {
                    return value;
                }
            }
        }
    }
};

Vue.component('com-table-mapper', mapper);

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//
var picture = {
    props: ['rowData', 'field', 'index'],
    template: '<span>\n        <img @load=\'loaded=true\' :style="cusStyle"  @click="open()" :src="src" alt="" height="96px" style="cursor: pointer;">\n        </span>',
    data: function data() {
        return {
            loaded: false
        };
    },
    watch: {
        src: function src() {
            this.loaded = false;
        }
    },
    computed: {
        src: function src() {
            return this.rowData[this.field];
        },
        cusStyle: function cusStyle() {
            if (!this.loaded) {
                return {
                    visibility: 'hidden'
                };
            } else {
                return {
                    visibility: 'visible'
                };
            }
        }
    },
    methods: {
        open: function open() {
            //window.open(this.rowData[this.field])
            var ctx = { imgsrc: this.rowData[this.field] };
            pop_layer(ctx, 'com-pop-image', function () {}, {
                title: false,
                area: ['90%', '90%'],
                shade: 0.8,
                skin: 'img-shower',
                shadeClose: true
            });
        }
    }
};

Vue.component('com-table-picture', picture);

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var pop_fields = exports.pop_fields = {
    template: '<div class="com-table-pop-fields-local">\n        <span  @click="edit_me()" class="clickable">\n        <component v-if="head.inn_editor" :is="head.inn_editor" :rowData="rowData" :field="field" :index="index"></component>\n         <span v-else v-text="show_text"></span>\n         </span>\n    </div>',
    props: ['rowData', 'field', 'index'],
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        if (table_par) {
            var value = this.rowData[this.field];
            this.head = ex.findone(table_par.heads, { name: this.field });
        }
    },
    computed: {
        show_text: function show_text() {
            if (this.head.show_label) {
                return show_label[this.head.show_label.fun](this.rowData, this.head.show_label);
            } else {
                return this.rowData[this.field];
            }
        }
    },
    methods: {
        edit_me: function edit_me() {
            this.open_layer();
        },
        open_layer: function open_layer() {
            var self = this;
            var fields_ctx = {
                heads: self.table_par.head.fields_heads,
                ops: [{
                    'name': 'save', 'editor': 'com-field-op-btn', 'label': '确定', 'icon': 'fa-save'
                }],
                extra_mixin: []
            };

            var win = pop_edit_local(self.rowData, fields_ctx, function (new_row) {
                ex.assign(self.rowData, new_row);
                //self.$emit('on-custom-comp',{fun:'edit_over'} )
                layer.close(win);
            });
        }

    }
};
Vue.component('com-table-pop-fields-local', pop_fields);

var show_label = {
    use_other_field: function use_other_field(row, kws) {
        var other_field = kws.other_field;
        return row[other_field];
    },
    text_label: function text_label(row, show_label) {
        return show_label.text;
    }

    //var get_row={
    //    use_table_row:function(callback,row,kws){
    //        callback(row)
    //    },
    //    get_table_row:function(callback,row,kws){
    //        var cache_row=ex.copy(row)
    //        callback(cache_row)
    //    },
    //    get_with_relat_field:function(callback,row,kws){
    //        var director_name=kws.director_name
    //        var relat_field = kws.relat_field
    //
    //        var dc ={fun:'get_row',director_name:director_name}
    //        dc[relat_field] = row[relat_field]
    //        var post_data=[dc]
    //        cfg.show_load()
    //        ex.post('/d/ajax',JSON.stringify(post_data),function(resp){
    //            cfg.hide_load()
    //            callback(resp.get_row)
    //        })
    //
    //    }
    //}
    //
    //var after_save={
    //    do_nothing:function(self,new_row,old_row,table){
    //    },
    //    update_or_insert:function(self,new_row,old_row){
    //        self.$emit('on-custom-comp',{name:'update_or_insert',new_row:new_row,old_row:old_row})
    //        //if(! old_row.pk) {
    //        //    table.rows.splice(0, 0, new_row)
    //        //}else{
    //        //    ex.assign(table.rowData,new_row)
    //        //}
    //
    //
    //    }
    //}

};

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/*

 * */

var pop_table = exports.pop_table = {
    template: '<span @click="open_layer()" class="clickable">\n        <component v-if="head.inn_editor" :is="head.inn_editor" :rowData="rowData" :field="field" :index="index"></component>\n        <span v-else v-text="show_text"  ></span>\n    </span>',
    props: ['rowData', 'field', 'index'],
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        if (table_par) {
            var value = this.rowData[this.field];
            this.head = ex.findone(table_par.heads, { name: this.field });
        }
    },
    computed: {
        show_text: function show_text() {
            return this.rowData[this.field];
        }
    },
    methods: {
        open_layer: function open_layer() {
            var table_ctx = init_table_ctx(this.head.table_ctx);
            pop_table_layer(this.rowData, table_ctx, function () {});
        }

    }
};
Vue.component('com-table-pop-table', pop_table);

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mix_editor = __webpack_require__(8);

__webpack_require__(234);


var select = {
    props: ['rowData', 'field', 'index'],
    template: '<div :class="[\'com-table-select\',{\'dirty\':is_dirty}]">\n            <el-dropdown trigger="click" placement="bottom" @command="handleCommand">\n                <span class="el-dropdown-link clickable" v-html="show_label"></span>\n                <el-dropdown-menu slot="dropdown">\n                    <el-dropdown-item v-for="op in head.options"\n                    :command="op.value"\n                    :class="{\'crt-value\':rowData[field]==op.value}" >\n                    <div v-text="op.label"></div>\n                    </el-dropdown-item>\n                </el-dropdown-menu>\n            </el-dropdown>\n        </div>\n\n    ',
    data: function data() {
        return {};
    },
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    mixins: [_mix_editor.mix_editor],
    computed: {
        show_label: function show_label() {
            var value = this.rowData[this.field];
            var opt = ex.findone(this.head.options, { value: value });
            return opt.html_label || opt.label;
        }
    },
    methods: {
        handleCommand: function handleCommand(command) {
            //this.$message('click on item ' + command);
            if (this.rowData[this.field] != command) {
                this.rowData[this.field] = command;
                this.on_changed();
            }
        },

        setSelect: function setSelect(value) {
            if (this.rowData[this.field] != value) {
                this.rowData[this.field] = value;
                this.on_changed();
            }
        }
        //on_changed:function(){
        //    this.$emit('on-custom-comp',{name:'row_changed',row:this.rowData})
        //}
    }
};

Vue.component('com-table-select', select);

//Vue.component('com-table-select',function(resolve,reject){
//    ex.load_css('https://unpkg.com/element-ui/lib/theme-chalk/index.css')
//    ex.load_js('https://unpkg.com/element-ui/lib/index.js',function(){
//        resolve(select)
//    })
//})


//var select = {
//    props:['rowData','field','index'],
//    template:`<div >
//    <select style="width: 100%" @change="on_changed()"  v-model="rowData[field]">
//        <option v-for="op in head.options" :value="op.value" v-text="op.label"></option>
//    </select>
//    </div>`,
//    data:function(){
//        return {
//        }
//    },
//    created:function(){
//        // find head from parent table
//        var table_par = this.$parent
//        while (true){
//            if (table_par.heads){
//                break
//            }
//            table_par = table_par.$parent
//            if(!table_par){
//                break
//            }
//        }
//        this.table_par = table_par
//        this. head  = ex.findone(this.table_par.heads,{name:this.field})
//    },
//    methods:{
//        on_changed:function(){
//            this.$emit('on-custom-comp',{name:'row_changed',row:this.rowData})
//        }
//    }
//}

//Vue.component('com-table-select',select)

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var switch_to_tab = {
    props: ['rowData', 'field', 'index'],
    template: '<span @click="goto_tab()" class="com-table-switch-to-tab clickable">\n     <component v-if="head.inn_editor" :is="head.inn_editor" :rowData="rowData" :field="field" :index="index"></component>\n    <span v-else v-text="rowData[field]"></span>\n    </span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        var head = ex.findone(table_par.heads, { name: this.field });
        this.head = head;
    },
    methods: {
        goto_tab: function goto_tab() {
            if (this.head.tab_name_express) {
                var tab_name = ex.eval(this.head.tab_name_express, { par_row: this.rowData, head: this.head });
            } else {
                var tab_name = this.head.tab_name;
            }
            if (this.head.ctx_name_express) {
                var ctx_name = ex.eval(this.head.ctx_name_express, { par_row: this.rowData, head: this.head });
            } else {
                var ctx_name = this.head.ctx_name;
            }

            this.$emit('on-custom-comp', {
                fun: 'switch_to_tab',
                tab_name: tab_name,
                ctx_name: ctx_name,
                named_tabs: this.head.named_tabs, // 准备淘汰
                par_row: this.rowData
            });
        }
    }
};

Vue.component('com-table-switch-to-tab', switch_to_tab);

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _cascader_filter = __webpack_require__(158);

var cascader_filter = _interopRequireWildcard(_cascader_filter);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _table_grid = __webpack_require__(163);

var table_grid = _interopRequireWildcard(_table_grid);

var _table_rows = __webpack_require__(164);

var table_rows = _interopRequireWildcard(_table_rows);

var _operations = __webpack_require__(160);

var operations = _interopRequireWildcard(_operations);

var _filter = __webpack_require__(159);

var filter = _interopRequireWildcard(_filter);

var _pagination = __webpack_require__(161);

var pagination = _interopRequireWildcard(_pagination);

var _parents = __webpack_require__(162);

var parents = _interopRequireWildcard(_parents);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 无用了。准备删除
var delete_op = {
    props: ['name'],
    template: ' <a class="clickable" @click="delete_op()" :disabled="!enable">\u5220\u9664</a>',
    data: function data() {
        return {
            enable: false
        };
    },
    methods: {
        delete_op: function delete_op() {
            this.$emit('operation', this.name);
        },
        set_enable: function set_enable(yes) {
            this.enable = yes;
        }
    }
};
Vue.component('com-op-delete', delete_op);

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _group_check = __webpack_require__(166);

var group_check = _interopRequireWildcard(_group_check);

var _auto_fresh = __webpack_require__(165);

var auto_fresh = _interopRequireWildcard(_auto_fresh);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var op_a = {
    props: ['head'],
    template: ' <a class="clickable" @click="operation_call()"  :style="head.style">\n    <i v-if="head.icon" :class=\'["fa",head.icon]\'></i> <span  v-text="head.label"></span></a>',
    data: function data() {
        var parStore = ex.vueParStore(this);
        return {
            enable: true,
            parStore: parStore
        };
    },
    methods: {
        operation_call: function operation_call() {
            if (this.head.action) {
                ex.eval(this.head.action, { ps: this.parStore, head: this.head });
            } else {
                this.$emit('operation', this.head.name);
            }
        },
        set_enable: function set_enable(yes) {
            this.enable = yes;
        }
    }
};
Vue.component('com-op-a', op_a);

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var op_a = {
    props: ['head', 'disabled'],
    template: ' <span class="com-op-btn" style="margin-left: 3px">\n    <button :class="norm_class" @click="operation_call()"  :style="head.style" :disabled="disabled">\n        <i v-if="head.icon" :class=\'["fa",head.icon]\'></i>\n        <span  v-text="head.label"></span>\n    </button>\n    </span>',
    data: function data() {
        var parStore = ex.vueParStore(this);
        return {
            enable: true,
            parStore: parStore
        };
    },
    mounted: function mounted() {
        if (this.head.css) {
            ex.append_css(this.head.css);
        }
    },

    computed: {
        norm_class: function norm_class() {
            if (this.head.class) {
                return 'btn btn-sm ' + this.head.class;
            } else {
                return 'btn btn-sm btn-default';
            }
        }
    },
    methods: {
        operation_call: function operation_call() {
            var _this = this;

            if (this.head.action) {
                if (this.head.row_match && !this.parStore.check_selected(this.head)) {
                    return;
                }
                if (this.head.confirm_msg) {
                    cfg.confirm(this.head.confirm_msg).then(function () {
                        ex.eval(_this.head.action, { ps: _this.parStore, head: _this.head, self: _this });
                    });
                } else {
                    ex.eval(this.head.action, { ps: this.parStore, head: this.head, self: this });
                }
            } else {
                this.$emit('operation', this.head.name || this.head.fun);
            }
        },
        set_enable: function set_enable(yes) {
            this.enable = yes;
        }
    }
};
Vue.component('com-op-btn', op_a);

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function init_table_ctx(ctx) {
    ctx.search_args = ctx.search_args || {};

    ctx.row_sort = ctx.row_sort || { sortable: [] };
    ctx.footer = ctx.footer || [];
    ctx.ops = ctx.ops || [];
    ctx.row_pages = ctx.row_pages || { crt_page: 1, total: 0, perpage: 20 };

    ctx.row_filters = ctx.row_filters || [];
    ctx.director_name = ctx.director_name || '';

    if (ctx.selectable == undefined) {
        ctx.selectable = true;
    }

    return ctx;
}

function init_table_bus(bus) {
    //bus.search_args= bus.search_args || {}
    //bus.row_sort =bus.row_sort || {sortable:[]}
    //bus.footer =bus.footer || []
    //bus.ops = bus.ops || []
    //bus.row_pages= bus.row_pages || {crt_page:1,total:0,perpage:20}

    bus = init_table_ctx(bus);
    bus.eventBus = new Vue();
    return bus;
}

var ele_table = {
    props: ['bus'],
    created: function created() {
        this.bus.table = this;
    },
    data: function data() {
        return {
            heads: this.bus.heads,
            //rows:this.bus.rows,
            search_args: this.bus.search_args,
            row_sort: this.bus.row_sort
            //footer:this.bus.footer
        };
    },
    mounted: function mounted() {
        this.bus.eventBus.$on('search', this.bus_search);
        this.bus.eventBus.$on('pageindex-change', this.get_page);
        this.bus.eventBus.$on('operation', this.on_operation);
        this.bus.eventBus.$on('perpage-change', this.on_perpage_change);
    },
    methods: {
        bus_search: function bus_search(search_args) {
            ex.assign(this.search_args, search_args);
            this.search();
        }
    },
    //watch:{
    //    bus_serarch_count:function(){
    //        this.search()
    //    }
    //},
    computed: {
        //bus_serarch_count:function(){
        //    return this.bus.search_count
        //},
        rows: {
            get: function get() {
                return this.bus.rows;
            },
            set: function set(v) {
                this.bus.rows = v;
            }
        },
        footer: {
            get: function get() {
                return this.bus.footer;
            },
            set: function set(v) {
                this.bus.footer = v;
            }
            //search_args:{
            //    get:function(){
            //        return this.bus.search_args
            //    },
            //    set:function(v){
            //        this.bus.search_args=v
            //    }
            //}
        } },
    // height="100%"
    //style="width: 100%"
    mixins: [mix_table_data, mix_ele_table_adapter],
    template: '  <el-table class="table flat-head" ref="e_table"\n                              :data="rows"\n                              border\n                              show-summary\n                              :fit="false"\n                              :stripe="true"\n                              size="mini"\n                              @sort-change="sortChange($event)"\n                              @selection-change="handleSelectionChange"\n                              :summary-method="getSum">\n                        <el-table-column v-if="bus.selectable"\n                                type="selection"\n                                width="55">\n                        </el-table-column>\n\n                        <template  v-for="head in heads">\n\n                            <el-table-column v-if="head.editor"\n                                             :show-overflow-tooltip="is_show_tooltip(head) "\n                                             :label="head.label"\n                                             :prop="head.name.toString()"\n                                             :sortable="is_sort(head)"\n                                             :width="head.width">\n                                <template slot-scope="scope">\n                                    <component :is="head.editor"\n                                               @on-custom-comp="on_td_event($event)"\n                                               :row-data="scope.row" :field="head.name" :index="scope.$index">\n                                    </component>\n\n                                </template>\n\n                            </el-table-column>\n\n                            <el-table-column v-else\n                                             :show-overflow-tooltip="is_show_tooltip(head) "\n                                             :prop="head.name.toString()"\n                                             :label="head.label"\n                                             :sortable="is_sort(head)"\n                                             :width="head.width">\n                            </el-table-column>\n\n                        </template>\n\n                    </el-table>\n'
};
var ele_operations = {
    props: ['bus'],
    //                      :disabled="get_attr(op.disabled)"
    //v-show="! get_attr(op.hide)"
    template: '<div class="oprations" style="padding: 5px;">\n                <component v-for="op in ops"\n                           :is="op.editor"\n                           :ref="\'op_\'+op.name"\n                           :head="op"\n                           @operation="on_operation(op)"></component>\n            </div>',
    data: function data() {
        return {
            ops: this.bus.ops
        };
    },
    methods: {
        get_attr: function get_attr(attr) {
            return this.bus.table.get_attr(attr);
        },
        on_operation: function on_operation(op) {
            this.bus.eventBus.$emit('operation', op);
        }
    }
};

var ele_filter = {
    props: ['bus'],
    computed: {},
    template: ' <com-filter class="flex" :heads="bus.row_filters" :search_args="bus.search_args"\n                        @submit="search()"></com-filter>',
    methods: {
        search: function search() {
            this.bus.eventBus.$emit('search', this.bus.search_args);
        }
    }
};

var ele_page = {
    props: ['bus'],
    data: function data() {
        return {
            row_pages: this.bus.row_pages,
            search_args: this.bus.search_args
        };
    },
    methods: {
        on_page_change: function on_page_change(v) {
            this.bus.eventBus.$emit('pageindex-change', v);
        },
        on_perpage_change: function on_perpage_change(v) {
            this.bus.eventBus.$emit('perpage-change', v);
        }
    },
    //  @size-change="on_perpage_change"
    //@current-change="get_page"
    template: ' <el-pagination\n                         @size-change="on_perpage_change"\n                        @current-change="on_page_change"\n                        :current-page="row_pages.crt_page"\n                        :page-sizes="[20, 50, 100, 500]"\n                        :page-size="row_pages.perpage"\n                        layout="total, sizes, prev, pager, next, jumper"\n                        :total="row_pages.total">\n                </el-pagination>'
};

Vue.component('com-table-bus', ele_table);
Vue.component('com-table-bus-ops', ele_operations);
Vue.component('com-table-bus-filter', ele_filter);
Vue.component('com-table-bus-page', ele_page);

window.init_table_ctx = init_table_ctx;
window.init_table_bus = init_table_bus;

window.bus_ele_table_logic = ele_table;

window.ele_table_logic = ele_table;
window.ele_table_page_logic = ele_page;

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _layout_picture_grid = __webpack_require__(167);

var layout_picture_grid = _interopRequireWildcard(_layout_picture_grid);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ajax_fields = {
    props: ['tab_head', 'par_row'],
    data: function data() {
        var data_row = this.tab_head.row || {};
        return {
            heads: this.tab_head.heads,
            ops: this.tab_head.ops,
            errors: {},
            row: data_row
        };
    },
    mixins: [mix_fields_data, mix_nice_validator],
    template: '<div class="flex-v"  style="position: absolute;top:0;left:0;bottom: 0;right:0;overflow: auto;padding-bottom: 1rem;">\n\n    <div>\n        <div class=\'field-panel suit\' id="form" >\n            <field  v-for=\'head in normed_heads\' :key="head.name" :head="head" :row=\'row\'></field>\n        </div>\n    </div>\n\n    <div class="oprations" style="margin-left: 3em;margin-top: 2em;">\n        <component v-for="op in ops" :is="op.editor" :ref="\'op_\'+op.name" :head="op" @operation="on_operation(op)"></component>\n    </div>\n    </div>\n    </div>',

    //created:function(){
    //    // find head from parent table
    //    var table_par = this.$parent
    //    while (true){
    //        if (table_par.heads){
    //            break
    //        }
    //        table_par = table_par.$parent
    //        if(!table_par){
    //            break
    //        }
    //    }
    //    this.table_par = table_par
    //},

    mounted: function mounted() {
        if (!this.tab_head.row) {
            this.get_data();
        }
    },
    methods: {
        //on_show:function(){
        //    if(! this.fetched){
        //        this.get_data()
        //        this.fetched = true
        //    }
        //},
        data_getter: function data_getter() {
            var self = this;
            var fun = get_data[self.tab_head.get_data.fun];
            var kws = self.tab_head.get_data.kws;
            fun(self, function (row) {
                //ex.assign(self.row,row)
                self.row = row;
            }, kws);

            //var self=this
            //cfg.show_load()
            //var dt = {fun:'get_row',model_name:this.model_name}
            //dt[this.relat_field] = this.par_row[this.relat_field]
            //var post_data=[dt]
            //$.post('/d/ajax',JSON.stringify(post_data),function(resp){
            //    self.row=resp.get_row
            //    cfg.hide_load()
            //})
        },
        after_save: function after_save(new_row) {
            if (this.tab_head.after_save) {
                var fun = _after_save[this.tab_head.after_save.fun];
                var kws = this.tab_head.after_save.kws;
                // new_row ,old_row
                fun(this, new_row, kws);

                //if(  self.par_row._director_name == row._director_name){
                //    // ，应该将新的属性值 去更新par_row
                //    ex.vueAssign(self.par_row,row)
                //}
            }
            this.row = new_row;
        }
        // data_getter  回调函数，获取数据,


    } };

Vue.component('com_tab_fields', ajax_fields);

var get_data = {
    get_row: function get_row(self, callback, kws) {
        //kws={model_name ,relat_field}
        var director_name = kws.director_name;
        var relat_field = kws.relat_field;
        var dt = { fun: 'get_row', director_name: director_name };
        dt[relat_field] = self.par_row[relat_field];
        var post_data = [dt];
        cfg.show_load();
        $.post('/d/ajax', JSON.stringify(post_data), function (resp) {
            cfg.hide_load();
            callback(resp.get_row);
        });
    },
    table_row: function table_row(self, callback, kws) {
        callback(self.par_row);
    }
};

var _after_save = {
    update_or_insert: function update_or_insert(self, new_row, kws) {
        var old_row = self.old_row;
        // 要update_or_insert ，证明一定是 更新了 par_row
        ex.vueAssign(self.par_row, new_row);
        self.$emit('tab-event', { name: 'update_or_insert', new_row: self.par_row, old_row: old_row });
    },
    do_nothing: function do_nothing(self, new_row, kws) {},

    update_par_row_from_db: function update_par_row_from_db(self, new_row, kws) {
        //
        var post_data = [{ fun: 'get_row', director_name: self.par_row._director_name, pk: self.par_row.pk }];
        ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
            ex.vueAssign(self.par_row, resp.get_row);
        });
    }
};

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ajax_table = {
    props: ['tab_head', 'par_row'], //['heads','row_filters','kw'],
    data: function data() {
        var self = this;
        var heads_ctx = this.tab_head.table_ctx;
        var childStore = new Vue({
            data: function data() {
                return {
                    vc: self,
                    vcname: 'ajax_table'
                };
            }
        });
        return {
            childStore: childStore,
            heads: heads_ctx.heads,
            row_filters: heads_ctx.row_filters,
            row_sort: heads_ctx.row_sort,
            director_name: heads_ctx.director_name,
            footer: heads_ctx.footer || [],
            ops: heads_ctx.ops || [],
            rows: [],
            row_pages: {},
            selectable: heads_ctx.selectable == undefined ? true : heads_ctx.selectable,
            selected: [],
            del_info: [],

            search_args: {}
        };
    },
    mixins: [mix_table_data, mix_ele_table_adapter],
    //watch:{
    //    // 排序变换，获取数据
    //    'row_sort.sort_str':function(v){
    //        this.search_args._sort=v
    //        this.get_data()
    //    }
    //},
    template: '<div class="rows-block flex-v" style="position: absolute;top:0;left:0;bottom: 0;right:0;overflow: auto;padding-bottom: 1em;" >\n        <div class=\'flex\' style="min-height: 3em;" v-if="row_filters.length > 0">\n            <com-filter class="flex" :heads="row_filters" :search_args="search_args"\n                        @submit="search()"></com-filter>\n            <div class="flex-grow"></div>\n        </div>\n\n        <div  v-if="ops.length>0">\n            <div class="oprations" style="padding: 5px">\n                <component v-for="op in ops"\n                           :is="op.editor"\n                           :ref="\'op_\'+op.name"\n                           :head="op"\n                           :disabled="get_attr(op.disabled)"\n                           v-show="! get_attr(op.hide)"\n                           @operation="on_operation(op)"></component>\n            </div>\n        </div>\n\n        <div class="box box-success flex-grow">\n            <div class="table-wraper" style="position: absolute;top:0;left:0;bottom: 0;right:0;">\n               <el-table class="table" ref="e_table"\n                              :data="rows"\n                              border\n                              show-summary\n                              :span-method="arraySpanMethod"\n                              :fit="false"\n                              :stripe="true"\n                              size="mini"\n                              @sort-change="sortChange($event)"\n                              @selection-change="handleSelectionChange"\n                              :summary-method="getSum"\n                              height="100%"\n                              style="width: 100%">\n\n                            <el-table-column\n                                    v-if="selectable"\n                                     type="selection"\n                                    :width="55">\n                            </el-table-column>\n                        <template  v-for="head in heads">\n                            <el-table-column v-if="head.editor"\n                                             :show-overflow-tooltip="is_show_tooltip(head) "\n                                             :label="head.label"\n                                             :sortable="is_sort(head)"\n                                             :width="head.width">\n                                <template slot-scope="scope">\n                                    <component :is="head.editor"\n                                               @on-custom-comp="on_td_event($event)"\n                                               :row-data="scope.row" :field="head.name" :index="scope.$index">\n                                    </component>\n\n                                </template>\n\n                            </el-table-column>\n\n                            <el-table-column v-else\n                                             :show-overflow-tooltip="is_show_tooltip(head) "\n                                             :prop="head.name"\n                                             :label="head.label"\n                                             :sortable="is_sort(head)"\n                                             :width="head.width">\n                            </el-table-column>\n\n                        </template>\n\n                    </el-table>\n            </div>\n\n        </div>\n          <div v-if="row_pages.crt_page">\n                    <el-pagination\n                        @size-change="on_perpage_change"\n                        @current-change="get_page"\n                        :current-page="row_pages.crt_page"\n                        :page-sizes="[20, 50, 100, 500]"\n                        :page-size="row_pages.perpage"\n                        layout="total, sizes, prev, pager, next, jumper"\n                        :total="row_pages.total">\n                </el-pagination>\n            </div>\n    </div>',

    mounted: function mounted() {
        this.search();
    },
    methods: {
        //on_show:function(){
        //    if(! this.fetched){
        //        this.search()
        //        this.fetched = true
        //    }
        //},
        getRows: function getRows() {
            //
            var self = this;
            if (self.tab_head.tab_field) {
                self.search_args[self.tab_head.tab_field] = self.par_row[self.tab_head.par_field];
            } else {
                self.search_args[self.tab_head.par_field] = self.par_row[self.tab_head.par_field];
            }

            ex.vueSuper(self, { fun: 'getRows' });
            //var fun = get_data[this.tab_head.get_data.fun ]
            //fun(function(rows,row_pages,footer){
            //    self.rows = rows
            //    self.row_pages =row_pages
            //    self.footer = footer
            //
            //},this.par_row,this.tab_head.get_data.kws,this.search_args)
        },
        add_new: function add_new(kws) {
            var self = this;
            var inn_kws = ex.copy(kws);
            var init_fields = {};
            if (self.tab_head.tab_field) {
                init_fields[self.tab_head.tab_field] = self.par_row[self.tab_head.par_field];
            } else {
                init_fields[self.tab_head.par_field] = self.par_row[self.tab_head.par_field];
            }
            var dc = { fun: 'add_new', init_fields: init_fields };
            ex.assign(inn_kws, dc);
            ex.vueSuper(this, inn_kws);
        },
        arraySpanMethod: function arraySpanMethod(_ref) {
            var row = _ref.row,
                column = _ref.column,
                rowIndex = _ref.rowIndex,
                columnIndex = _ref.columnIndex;

            if (this.table_layout) {
                return this.table_layout[rowIndex + ',' + columnIndex] || [1, 1];
            } else {
                return [1, 1];
            }
            //var head = this.heads[columnIndex]

            //return [1,1]
        }
    }
};

Vue.component('com_tab_table', ajax_table);

//var get_data={
//    get_rows:function(callback,row,kws,search_args){
//        var relat_field = kws.relat_field
//        var director_name = kws.director_name
//
//        var self=this
//        var relat_pk = row[kws.relat_field]
//        var relat_field = kws.relat_field
//        search_args[relat_field] = relat_pk
//        var post_data=[{fun:'get_rows',search_args:search_args,director_name:director_name}]
//        cfg.show_load()
//        $.post('/d/ajax',JSON.stringify(post_data),function(resp){
//            cfg.hide_load()
//            callback(resp.get_rows.rows,resp.get_rows.row_pages,resp.get_rows.footer)
//            //self.rows = resp.get_rows.rows
//            //self.row_pages =resp.get_rows.row_pages
//        })
//    }
//}

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _tab_table = __webpack_require__(172);

var tab_table = _interopRequireWildcard(_tab_table);

var _tab_fields = __webpack_require__(169);

var tab_fields = _interopRequireWildcard(_tab_fields);

var _tab_fields_v = __webpack_require__(170);

var tab_fields_v1 = _interopRequireWildcard(_tab_fields_v);

var _tab_lazy_wrap = __webpack_require__(171);

var tab_lazy_wrap = _interopRequireWildcard(_tab_lazy_wrap);

var _tab_table_type = __webpack_require__(173);

var tab_table_type = _interopRequireWildcard(_tab_table_type);

var _tab_chart = __webpack_require__(168);

var tab_chart = _interopRequireWildcard(_tab_chart);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(189);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./element_ex.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./element_ex.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(190);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./fields.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./fields.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(191);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./tab.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./tab.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(192);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(193);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table_page.scss", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table_page.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(199);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table_editor_base.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table_editor_base.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(211);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./adminlte.styl", function() {
			var newContent = require("!!../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./adminlte.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Vue.component('com-field-blocktext', {
    props: ['row', 'head'],
    template: '<div>\n            <span v-if=\'head.readonly\' v-text=\'row[head.name]\'></span>\n            <textarea :style="head.style" v-else :maxlength="head.maxlength" class="form-control input-sm"\n                :name="head.name"\n                :id="\'id_\'+head.name" v-model="row[head.name]" :placeholder="head.placeholder"\n                :readonly=\'head.readonly\'></textarea>\n            </div>'
});

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var cascader_field = {
    props: ['row', 'head'],
    methods: {},
    data: function data() {
        return {
            selected: [1, 2],
            // demon 数据
            options: [{
                value: '1',
                label: '一级 1',
                children: [{
                    value: '21',
                    label: '二级 1-1',
                    children: [{
                        value: '31',
                        label: '三级 1-1-1',
                        children: [{
                            value: '41',
                            label: '四级1'
                        }]
                    }]
                }]
            }, {
                value: '2',
                label: '一级 2',
                children: [{
                    value: '22',
                    label: '二级 2-1',
                    children: [{
                        value: '32',
                        label: '三级 2-1-1',
                        pk: 3
                    }]
                }, {
                    value: '23',
                    label: '二级 2-2',
                    children: [{
                        value: '33',
                        label: '三级 2-2-1'
                    }]
                }]
            }]
        };
    },
    template: '<div class="com-field-cascader">\n      <el-cascader\n            :show-all-levels="false"\n            v-model="row[head.name]"\n            :options="head.options"\n            :props="{checkStrictly: true,emitPath:false }"\n            size="small"\n            clearable>\n        </el-cascader>\n    </div>',
    //default-expand-all
    computed: {
        label: function label() {
            return this.row['_' + this.head.name + '_label'];
        }
    }
};

Vue.component('com-field-cascader', cascader_field);
//Vue.component('com-field-ele-tree-name-layer',function(resolve,reject){
//ex.load_css('https://unpkg.com/element-ui/lib/theme-chalk/index.css')
//ex.load_js('https://unpkg.com/element-ui/lib/index.js',function(){
//resolve(label_shower)
//})
//})

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var color = {
    props: ['row', 'head'],
    template: '<div :class="[\'com-field-color\',head.class]">\n   \t<input type="text"  v-model="row[head.name]"\n            \t\t \t    :id="\'id_\'+head.name" :name="head.name" style="display: none;">\n    <el-color-picker\n  v-model="row[head.name]"\n  color-format="hex"\n   :show-alpha="head.has_opacity"\n  :predefine="predefineColors">\n</el-color-picker>\n            \t\t\t<!--<span class="readonly-info" v-if=\'head.readonly\' v-text=\'row[head.name]\'></span>-->\n            \t\t\t<!--<input v-else type="text" :class="[\'form-control input-sm\',head.input_class]" v-model="row[head.name]"-->\n            \t\t \t    <!--:id="\'id_\'+head.name" :name="head.name" data- -->\n                        \t<!--:placeholder="head.placeholder" :autofocus="head.autofocus" :maxlength=\'head.maxlength\'>-->\n                       </div>',
    data: function data() {
        return {
            predefineColors: ['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585']
        };
    },
    mounted: function mounted() {
        if (this.head.css) {
            ex.append_css(this.head.css);
        }
    }
};
Vue.component('com-field-color', color);

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Vue.component('com-field-compute', {
    props: ['row', 'head'],
    template: '<div class="com-field-compute">\n           <input type="text" :class="[\'form-control input-sm\',head.input_class]" v-model="row[head.name]"\n            \t\t \t    :id="\'id_\'+head.name" :name="head.name" readonly\n                        \t:placeholder="head.placeholder"  :maxlength=\'head.maxlength\'>\n            </div>',
    watch: {
        row: function row(v) {
            ex.eval(this.head.express, { row: v, head: this.head });
        }
    }
});

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var lay_datetime = {
    props: ['row', 'head'],
    template: '<div class="com-field-date">\n        <span class="readonly-info" v-show=\'head.readonly\' v-text=\'row[head.name]\'></span>\n\n     <input v-if="!head.readonly" type="text" style="display: none"\n            :id="\'id_\'+head.name"\n            :name="head.name"\n            v-model="row[head.name]">\n     <el-date-picker\n        v-if="!head.readonly"\n      v-model="row[head.name]"\n      type="date"\n      :placeholder="head.placeholder"\n      align="right"\n      size="small"\n      value-format="yyyy-MM-dd"\n      :picker-options="pickerOptions">\n    </el-date-picker>\n</div>',
    mounted: function mounted() {
        //var self=this
        //laydate.render({
        //    elem: $(this.$el).find('input')[0], //指定元素
        //    type: 'date',
        //    done: function(value, date, endDate){
        //        self.row[self.head.name] = value
        //    }
        //});
    },
    data: function data() {
        return {
            pickerOptions: {
                shortcuts: [{
                    text: '今天',
                    onClick: function onClick(picker) {
                        var d = new Date();
                        d.setHours(0, 0, 0, 0);
                        picker.$emit('pick', d);
                    }
                }, {
                    text: '昨天',
                    onClick: function onClick(picker) {
                        var date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        date.setHours(0, 0, 0, 0);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick: function onClick(picker) {
                        var date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        date.setHours(0, 0, 0, 0);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '30天前',
                    onClick: function onClick(picker) {
                        var date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
                        date.setHours(0, 0, 0, 0);
                        picker.$emit('pick', date);
                    }
                }]
            }
        };
    }
};

Vue.component('com-field-date', lay_datetime);

//Vue.component('com-field-date',function(resolve,reject){
//    ex.load_js('/static/lib/laydate/laydate.js',function(){
//        resolve(lay_datetime)
//    })
//})

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var com_field_invite_code = {
    props: ['row', 'head'],
    created: function created() {

        if (search_args[this.head.key]) {
            this.row[this.head.name] = search_args[this.head.key];
        }
    },
    template: '<div class="com-field-invite-code">\n        <com-field-linetext :head="head" :row="row"></com-field-linetext>\n    </div>',
    computed: {
        label: function label() {
            return this.row['_' + this.head.name + '_label'];
        }
    }
};

Vue.component('com-field-invite-code', com_field_invite_code);

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var line_text = {
    props: ['row', 'head'],
    template: '<div :class="[\'com-field-linetext\',head.class]" :style="head.style">\n            \t\t\t<span class="readonly-info" v-if=\'head.readonly\' v-text=\'row[head.name]\'></span>\n            \t\t\t<input v-else type="text" :class="[\'form-control input-sm\',head.input_class]" v-model="row[head.name]"\n            \t\t \t    :id="\'id_\'+head.name" :name="head.name"\n                        \t:placeholder="head.placeholder" :autofocus="head.autofocus" :maxlength=\'head.maxlength\'>\n                       </div>',
    mounted: function mounted() {
        if (this.head.css) {
            ex.append_css(this.head.css);
        }
    }
};
Vue.component('com-field-linetext', line_text);

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(237);

var list_ctn_field = {
    props: ['row', 'head'],
    template: '<div :class="[\'com-field-list-ctn\',head.class]" >\n            \t<component class="list-ctn-field" v-for="head2 in myhead" :is="head2.editor" :head="head2" :row="row"></component>\n              </div>',
    data: function data() {
        var parStore = ex.vueParStore(this);
        return {
            parStore: parStore
        };
    },

    computed: {
        myhead: function myhead() {
            var _this = this;

            var out_heads = [];
            ex.each(this.head.children, function (item_name) {
                var head2 = ex.findone(_this.parStore.vc.heads, { name: item_name });
                if (head2) {
                    out_heads.push(head2);
                }
            });
            return out_heads;
        }
    },
    mounted: function mounted() {
        if (this.head.css) {
            ex.append_css(this.head.css);
        }
    }
};
Vue.component('com-field-list-ctn', list_ctn_field);

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var lay_datetime = {
    props: ['row', 'head'],
    template: '<div class="com-field-month">\n     <input style="display: none" type="text"\n     :id="\'id_\'+head.name" v-model="row[head.name]"\n     :name="head.name">\n   <el-date-picker\n      v-model="row[head.name]"\n      type="month"\n      :readonly="head.readonly"\n      size="small"\n      value-format="yyyy-MM"\n      :placeholder="head.placeholder || \'\u9009\u62E9\u6708\u4EFD\'">\n    </el-date-picker>\n\n               </div>',
    mounted: function mounted() {
        //var self=this
        //laydate.render({
        //    elem: $(this.$el).find('input')[0], //指定元素
        //    type: 'month',
        //    done: function(value, date, endDate){
        //        self.row[self.head.name] = value
        //    }
        //});
    }
};

Vue.component('com-field-month', lay_datetime);

//Vue.component('com-field-month',function(resolve,reject){
//    ex.load_js('/static/lib/laydate/laydate.js',function(){
//        resolve(lay_datetime)
//    })
//})

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var number = {
    props: ['row', 'head'],

    template: '<div :class="[\'com-field-number\',\'field-\'+head.name,head.class]" >\n       <span v-if=\'head.readonly && !head.prefix && !head.suffix\' v-text=\'row[head.name]\'></span>\n       <div  v-else class="form-inline">\n          <div class="input-group" >\n              <div class="input-group-addon" v-if="head.prefix" v-html="head.prefix"></div>\n                <input  type="text" class="form-control input-sm" v-model="row[head.name]" :id="\'id_\'+head.name"\n                                :style="{width:head.width}"\n                                :name="head.name" :step="head.step"\n                                 @keypress="isNumber($event)"\n                                :readonly="head.readonly"\n                                :placeholder="head.placeholder" :autofocus="head.autofocus">\n              <div class="input-group-addon" v-if="head.suffix" v-html="head.suffix"></div>\n          </div>\n       </div>\n\n         </div>',
    created: function created() {
        //if(this.head.fv_rule==undefined){
        //    Vue.set(this.head,'fv_rule','digit(4)')
        //}
    },
    mounted: function mounted() {
        //if(this.head.width){
        //    var width = this.head.width
        //    var myclass ='.com-field-number.field-'+this.head.name
        //    ex.append_css(`${myclass} input{width:${width} !important`)
        //}
    },

    methods: {
        isNumber: function isNumber(evt) {
            evt = evt ? evt : window.event;
            var charCode = evt.which ? evt.which : evt.keyCode;
            if (charCode >= 48 && charCode <= 57 || charCode == 46 || charCode == 45) {
                if (charCode == 46 && this.row[this.head.name].indexOf('.') != -1) {
                    return evt.preventDefault();
                } else {
                    return true;
                }
            } else {
                return evt.preventDefault();
            }
            //if (charCode==101 ||charCode==69 ) { // 排除掉E
            //    evt.preventDefault();
            //} else if(charCode==46 && this.row[this.head.name].indexOf('.')!=-1){
            //    return evt.preventDefault();
            //} else  {
            //    return true;
            //}
        }
    }
};

Vue.component('com-field-number', number);

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(219);

Vue.component('com-field-phone-code', {
    /*
    parStore.get_phone_code(callback){
      }
      * */
    props: ['row', 'head'],
    template: ' <div class="com-field-phone-code flex">\n         <input  type="text" class="form-control input-sm" v-model="row[head.name]"\n            :id="\'id_\'+head.name" :name="head.name"\n            :placeholder="head.placeholder" :autofocus="head.autofocus" :maxlength=\'head.maxlength\'>\n\n          <button style="width: 9em" type="button" class="btn btn-sm"\n              :disabled="vcode_count !=0"\n               @click="get_phone_code" v-text="vcodeLabel"></button>\n     </div>\n    ',
    data: function data() {
        var parStore = ex.vueParStore(this);
        return {
            parStore: parStore,
            vcode_count: 0
        };
    },
    computed: {
        vcodeLabel: function vcodeLabel() {
            if (this.vcode_count != 0) {
                return '' + this.vcode_count + ' s';
            } else {
                return '获取验证码';
            }
        }
    },
    methods: {
        get_phone_code: function get_phone_code() {
            var self = this;
            this.parStore.get_phone_code(function () {
                self.vcode_count = self.head.vcode_count || 120;
                self.countGetVCodeAgain();
            });
        },
        //get_phone_code:function(){
        //var phone = this.row[this.head.phone_field]
        //var img_code = this.row[this.head.img_code_field]
        ////var com_vcode =kws.com_vcode
        //var ph =$(this.$el).find('#id_'+this.hea).trigger("validate")
        //var image_code_input_element=$(this.$el).find('[name=image_code]')
        //var image_code =image_code_input_element.trigger("validate")
        //
        //if(ph.isValid() && image_code.isValid()){
        //    self.checkImageCode(this.row.Phone,this.row.image_key,this.row.image_code,image_code_input_element)
        //}

        //if(this.head.isValid()){
        //    self.checkImageCode(self.row.Phone,self.row.image_key,self.row.image_code,image_code_input_element)
        //}

        //var self=this
        //this.$emit('trigger-get-code',function(){
        //    self.checkImageCode(self.row.Phone,self.row.image_key,self.row.image_code,image_code_input_element)
        //})
        //},

        //sendGetCodeOrder:function(){
        //    ex.vueParCall(this,'get_phone_code',{com_vcode:this})
        //    //this.$emit('field-event',{fun:'get_phone_code'})
        //
        //},
        //checkImageCode:function(phone,image_key,image_code,image_code_input_element){
        //    var self=this
        //    $(self.$el).find('input').trigger("hidemsg")
        //
        //    //if(this.row.image_code && this.hasValidPhone){
        //    var data={
        //        Phone:phone,
        //        Key:image_key,
        //        Answer:image_code,
        //    }
        //    cfg.show_load()
        //    service_post('/anonymity/vcode/generate',data,function(resp){
        //        if(resp.error_description){
        //            image_code_input_element.trigger("showmsg", ["error", resp.error_description ])
        //        }else if(resp.success){
        //            setTimeout(function(){
        //                self.countGetVCodeAgain()
        //            },1000)
        //        }
        //        // else {
        //        //    $(self.$el).find('.image_code').trigger("showmsg", ["error", resp.error_description ])
        //        //}
        //
        //    },false)
        //    //}
        //},
        countGetVCodeAgain: function countGetVCodeAgain() {
            var self = this;
            var idx = setInterval(function () {
                self.vcode_count -= 1;
                if (self.vcode_count <= 0) {
                    clearInterval(idx);
                    self.vcode_count = 0;
                }
            }, 1000);
        }
    }
});

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(238);

var pop_tree_select = {
    props: ['row', 'head'],
    template: '<div class="com-field-pop-tree-select" style="white-space: nowrap">\n        <!--<span  v-text="label" style="display: inline-block;background-color: white;border-bottom: 1px solid grey"></span>-->\n       <!--<input type="text" :class="[\'form-control input-sm label-shower\',head.input_class]" v-model="label"-->\n                     <!--readonly  :placeholder="head.placeholder" @click="open_win" />-->\n       <el-input\n    :placeholder="head.placeholder"\n    readonly\n    size="small"\n   v-model="label">\n    <el-button slot="append" icon="el-icon-search" @click="open_win"></el-button>\n  </el-input>\n        <input type="text" v-model="row[head.name]" style="display: none;" :id="\'id_\'+head.name" :name="head.name" />\n        <!--<span v-if="!head.readonly" class="clickable" @click="open_win"><i class="fa fa-search"></i></span>-->\n    </div>',

    computed: {
        label: function label() {
            return this.row['_' + this.head.name + '_label'];
        }
    },
    mounted: function mounted() {},
    methods: {
        open_win: function open_win() {
            var self = this;
            cfg.pop_vue_com('com-pop-tree', this.head.tree_ctx).then(function (resp) {
                if (self.head.after_select) {
                    ex.eval(self.head.after_select, { selected_row: resp, row: self.row });
                } else {
                    Vue.set(self.row, self.head.name, resp.value);
                    Vue.set(self.row, '_' + self.head.name + '_label', resp.path);
                }
            });
        }
    }
};

Vue.component('com-field-pop-tree-select', pop_tree_select);

Vue.component('com-pop-tree', {
    props: ['ctx'],
    template: '<div>\n    <el-tree\n          :data="ctx.options"\n          :props="defaultProps"\n          accordion\n          @node-click="handleNodeClick">\n       </el-tree>\n    </div>',
    data: function data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        };
    },

    methods: {
        handleNodeClick: function handleNodeClick(data) {
            this.$emit('finish', { value: data.value, label: data.label, path: data.path });
        }
    }
});

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var field_bool = {
    props: ['row', 'head'],
    template: '<div class="com-field-radio">\n            <input type="text" v-model=\'row[head.name]\' style="display: none" :name="head.name">\n\t        <span v-if="head.readonly" v-text="mylabel"></span>\n\t        <template v-else>\n                <div v-for="op in head.options" style="display: inline-block;margin: 0 3px">\n                      <input type="radio" :id="\'_radio\'+head.name+op.value"\n                        :value="op.value" v-model=\'row[head.name]\'>\n                     <label :for="\'_radio\'+head.name+op.value" v-text="op.label" style="font-weight: 400;"></label>\n                </div>\n\t        </template>\n\t\t</div>',
    computed: {
        mylabel: function mylabel() {
            var one = ex.findone(this.head.options, { value: this.row[this.head.name] });
            if (one) {
                return one.label;
            } else {
                return '';
            }
        }
    }

};
Vue.component('com-field-radio', field_bool);

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(239);

var range_field = {
    props: ['row', 'head'],
    template: '<div :class="[\'com-field-range\',head.class]" >\n            \t    <component class="range-field" :is="start_head.editor" :head="start_head" :row="row"></component>\n                    <div style="display: inline-block;margin: 0 2px;" >-</div>\n                     <component class="range-field" :is="end_head.editor" :head="end_head" :row="row"></component>\n              </div>',
    data: function data() {
        var parStore = ex.vueParStore(this);
        var start_head = ex.findone(parStore.vc.heads, { name: this.head.start_name });
        var end_head = ex.findone(parStore.vc.heads, { name: this.head.end_name });
        return {
            start_head: start_head,
            end_head: end_head

        };
    },
    mounted: function mounted() {
        if (this.head.css) {
            ex.append_css(this.head.css);
        }
    }
};
Vue.component('com-field-range', range_field);

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Vue.component('com-field-richtext', {
    props: ['row', 'head'],
    template: '<div >\n            <span v-if=\'head.readonly\' v-text=\'row[head.name]\'></span>\n            <div v-else>\n                <ckeditor ref="ck" :style="head.style" v-model="row[head.name]"\n                :maxlength=\'head.maxlength\'\n                :id="\'id_\'+head.name" :set="head.set" :config="head.config"></ckeditor>\n                <div style="height: 1em;width: 0;position: relative">\n                <input type="text" :name=\'head.name\' style="display: none"  v-model="row[head.name]">\n                </div>\n            </div>\n         </div>',
    methods: {
        commit: function commit() {
            Vue.set(this.row, this.head.name, this.$refs.ck.editor.getData());
        }
    }
});

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(240);

var line_text = {
    props: ['row', 'head'],
    template: '<div :class="[\'com-field-split-text\',head.class]" :style="head.style">\n            \t\t\t<span class="readonly-info" v-if=\'head.readonly\' v-text=\'row[head.name]\'></span>\n            \t\t\t<input v-else type="text" :class="[\'my-input-field\',head.input_class]" v-model="row[head.name]"\n            \t\t \t    :id="\'id_\'+head.name" :name="head.name"\n                        \t:placeholder="head.placeholder" :autofocus="head.autofocus" :maxlength=\'head.maxlength\'>\n                       </div>',
    mounted: function mounted() {
        var _this = this;

        if (this.head.css) {
            ex.append_css(this.head.css);
        }
        var self = this;

        setTimeout(function () {

            //var value = self.row[self.head.name]
            //
            //if (value){
            //    var items =   value.split(',') //ex.map(value.split(','),ii=>{ return {label:ii} })
            //}else{
            //    var items = []
            //}
            //var options = self.head.options .concat(items)
            var bb = $(_this.$el).find('.my-input-field').selectize({
                delimiter: ',',
                persist: false,
                create: true,
                //items:items,
                //create: function(input) {
                //    return {
                //        value: input,
                //        text: input
                //    }
                //},
                //create: function(input) {
                //    return {
                //        label: input,
                //    }
                //},
                hideSelected: true,
                valueField: 'value',
                labelField: 'label',
                searchField: 'label',
                //options:  self.head.options ||  [], //options,// items ,//
                onChange: function onChange(value) {
                    self.row[self.head.name] = value;
                },
                onBlur: function onBlur() {
                    $(self.$el).find('.my-input-field').trigger('validate');
                }
            });
            Vue.nextTick(function () {
                //ex.each(items,(ii)=>{
                //    bb[0].selectize.removeOption(ii)
                //})
                //bb[0].selectize.clearOptions()
                bb[0].selectize.addOption(self.head.options);
                //bb[0].selectize.setValue(items, true)
            });
        }, 100);
    }
};

Vue.component('com-field-split-text', function (resovle, reject) {
    ex.load_css(js_config.js_lib.selectizejs_css);
    ex.load_js(js_config.js_lib.selectizejs).then(function () {
        resovle(line_text);
    });
});

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var time_field = {
    props: ['row', 'head'],
    template: '<div :class="[\'com-field-time\',\'field-\'+head.name,head.class]" >\n        <input v-if="!head.readonly" type="text" style="display: none"\n            :id="\'id_\'+head.name"\n            :name="head.name"\n            v-model="row[head.name]">\n\n            \t  <el-time-picker\n                    v-model="row[head.name]"\n                    value-format="HH:mm:ss"\n                    size="small"\n                    :placeholder="head.placeholder || \'\u8BF7\u8F93\u5165\u65F6\u95F4\'">\n                   </el-time-picker>\n              </div>',
    computed: {
        innvalue: function innvalue() {
            return this.row[this.head.name];
        }
    },
    watch: {
        innvalue: function innvalue(v) {
            if (v.length > 10) {
                this.row[this.head.name] = v.slice(11);
            } else {
                this.row[this.head.name] = v;
            }
        }
    },
    mounted: function mounted() {
        if (this.head.css) {
            ex.append_css(this.head.css);
        }
        if (this.head.width) {
            var width = this.head.width;
            var myclass = '.com-field-time.field-' + this.head.name;
            ex.append_css(myclass + ' input{width:' + width + ' !important;');
        }
    }
};
Vue.component('com-field-time', time_field);

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
__webpack_require__(10);

/*
*  todo  感觉无用，移除该组件
* */
var com_form = exports.com_form = {
    props: {
        heads: '',
        row: '',
        options: {}
        //autoWidth:{
        //    default:function(){
        //        return true
        //    }
        //},
        //btnCls:{
        //    default:function(){
        //        return 'btn-primary btn-sm'
        //    }
        //}
    },
    data: function data() {
        return {
            okBtn: this.option.okBtn || '确定',
            //autoWidth:this.option.autoWidth==undefined?true:this.option.autoWidth,
            small_srn: ex.is_small_screen(),
            small: false
        };
    },
    mounted: function mounted() {
        // 由于与nicevalidator 有冲突，所以等渲染完成，再检测
        setTimeout(function () {
            if ($(this.$el).width() < 600) {
                this.small = true;
            } else {
                this.small = false;
            }
        }, 10);
    },
    computed: {
        normed_heads: function normed_heads() {
            return this.heads;
        },
        label_width: function label_width() {
            if (!this.autoWith) {}
            var max = 4;
            ex.each(this.heads, function (head) {
                if (max < head.label.length) {
                    max = head.label.length;
                }
            });
            max += 1;
            return { width: max + 'em' };
        }
    },
    //created:function(){
    //    if(!this.okBtn){
    //        this.okBtn='确定'
    //    }
    //},
    components: window._baseInput,
    mixins: [mix_fields_data, mix_nice_validator],
    template: ' <div :class="[\'field-panel sim-fields\',{\'small\':small,\'msg-bottom\':small}]"\n    style="text-align:center;">\n           <table class="table-fields">\n        <tr v-for="head in heads">\n            <td class="field-label-td"  valign="top" >\n            <div class="field-label" :style="label_width">\n                <span class="label-content">\n                     <span v-text="head.label"></span>\n                     <span class="req_star" v-if=\'head.required\'>*</span>\n                </span>\n\n\n            </div>\n\n            </td>\n            <td class="field-input-td" >\n                <div class="field-input">\n                    <component v-if="head.editor" :is="head.editor"\n                         @field-event="$emit(\'field-event\',$event)"\n                         :head="head" :row="row"></component>\n\n                </div>\n            </td>\n            <td>\n                <span v-if="head.help_text" class="help-text clickable">\n                            <i style="color: #3780af;position: relative;top:10px;"   @click="show_msg(head.help_text,$event)" class="fa fa-question-circle" ></i>\n                </span>\n            </td>\n        </tr>\n        <slot :row="row">\n            <!--\u6309\u94AE\u6A2A\u8DE8\u4E24\u5217 \uFF01\u5C0F\u5C3A\u5BF8\u65F6 \u5F3A\u5236 -->\n             <tr v-if="crossBtn || small" class="btn-row">\n                <td class="field-input-td" colspan="3">\n                    <div class="submit-block">\n                        <button @click="submit" type="btn"\n                            :class="[\'form-control btn\',btnCls]"><span v-text="okBtn"></span></button>\n                    </div>\n                </td>\n            </tr>\n            <!--\u6309\u94AE\u5728\u7B2C\u4E8C\u5217-->\n               <tr v-else class="btn-row">\n                   <td class="field-label-td"></td>\n                    <td class="field-input-td" colspan="1">\n                        <div class="submit-block">\n                            <button @click="panel_submit" type="btn"\n                                class="btn "><span v-text="okBtn"></span></button>\n                        </div>\n                     </td>\n                     <td></td>\n               </tr>\n        </slot>\n\n    </table>\n\n\n        </div>',
    methods: {

        panel_submit: function panel_submit() {
            if (this.$listeners && this.$listeners.submit) {
                if (this.isValid()) {
                    this.$emit('submit', this.row);
                }
            } else {
                this.submit();
            }
        },
        show_msg: function show_msg(msg, event) {
            layer.tips(msg, event.target);
        },
        after_save: function after_save(row) {
            this.$emit('after-save', row);
        }

    }
};

window.com_form = com_form;

Vue.component('com-form', com_form);

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(241);

Vue.component('com-fields-table-block', {
    props: ['heads', 'row', 'option'],
    template: '<div class="com-fields-table-block field-panel msg-bottom">\n           <table >\n            <tr v-for="heads_row in table_grid_heads">\n                <template v-for="head in heads_row">\n                    <td class="field-label-td" :class="head.class"  :colspan="head.label_colspan" :rowspan="head.label_rowspan">\n                        <div class="field-label">\n                            <span class="label-content">\n                                 <span v-text="head.label"></span>\n                            </span>\n                             <span class="req_star" v-if=\'head.required\'>*</span>\n                        </div>\n                    </td>\n                    <td class="field-input-td" :class="head.class" :colspan="head.colspan" :rowspan="head.rowspan">\n                        <div class="field-input">\n                            <component v-if="head.editor" :is="head.editor"\n                                 @field-event="$emit(\'field-event\',$event)"\n                                 :head="head" :row="row"></component>\n                            <span v-if="head.help_text" class="help-text clickable" @mouseenter="show_msg(head.help_text,$event)" @mouseleave="hide_msg()">\n                                 <i style="color: #3780af;"   class="fa fa-question-circle" ></i>\n                            </span>\n                        </div>\n                    </td>\n                </template>\n            </tr>\n        </table>\n       </div>',
    computed: {
        table_grid_heads: function table_grid_heads() {
            var self = this;
            var table_grid = this.option.table_grid;
            var heads_bucket = [];
            ex.each(table_grid, function (name_row) {
                var heads_row = [];
                ex.each(self.heads, function (head) {
                    if (ex.isin(head.name, name_row)) {
                        heads_row.push(head);
                    }
                });
                if (heads_row) {
                    heads_bucket.push(heads_row);
                }
            });
            return heads_bucket;
        }
    },
    methods: {
        show_msg: function show_msg(msg, event) {
            this.msg_index = layer.tips(msg, event.target, {
                time: 0
            });
        },
        hide_msg: function hide_msg() {
            layer.close(this.msg_index);
        }
    }
});

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _suit_fields = __webpack_require__(5);

var suit_fields_local = {
    mixins: [_suit_fields.suit_fields],
    methods: {
        submit: function submit() {
            if (this.isValid()) {
                this.$emit('finish', this.row);
            }
        }
    }
};

window.suit_fields_local = suit_fields_local;

Vue.component('com-suit-fields-local', suit_fields_local);

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var filter_check = {
    props: ['head', 'search_args', 'config'],
    template: '<div class=\'com-filter-check\'>\n        <label style="font-weight: 400" :for="\'filter_\'+head.name" v-text="head.label"></label>\n        <input :id="\'filter_\'+head.name" type="checkbox" v-model="search_args[head.name]">\n    </div>',
    data: function data() {
        var self = this;
        return {
            order: this.head.order || false,
            parStore: ex.vueParStore(this)
        };
    },

    computed: {
        myvalue: function myvalue() {
            return this.search_args[this.head.name];
        },

        options: function options() {}
    },
    watch: {
        myvalue: function myvalue(v) {
            this.$emit('input', v);
        },
        options: function options(v) {
            delete this.search_args[this.head.name];
        }
    },
    mounted: function mounted() {
        if (this.head.event_slots) {
            this.set_event_slot();
        }
    },
    methods: {}
};
Vue.component('com-filter-check', filter_check);

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var filter_compare = {
    props: ['head', 'search_args'],
    data: function data() {
        this.search_args['_' + this.head.name + '_compare'] = this.search_args['_' + this.head.name + '_compare'] || 0;
        return {};
    },
    template: '<div  class="com-filter-datetime-range flex flex-ac" :style="{width:head.width}">\n                <!--<span v-text="head.label" style="white-space: nowrap"></span>:-->\n                   <select name="" id="" class="form-control input-sm" style="width: 50px" v-model="search_args[\'_\'+head.name+\'_compare\']">\n                        <option value="0">=</option>\n                         <option value="1">\u2265</option>\n                         <option value="-1">\u2264</option>\n                   </select>\n                   <input @keyup.enter="parStore.search()" type="text" v-model=\'search_args[head.name]\' class="form-control input-sm" :placeholder="head.label">\n                </div>'

};

Vue.component('com-filter-compare', filter_compare);

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(12);

var com_datetime_range = {
    props: ['head', 'search_args'],
    data: function data() {

        //var start=this.search_args['_start_'+this.head.name]
        //var end=this.search_args['_end_'+this.head.name]
        return {
            heads: [{ name: '_start_' + this.head.name, placeholder: '开始日期' }, { name: '_end_' + this.head.name, placeholder: '结束日期' }]
        };
    },
    template: '<div  class="com-filter-datetime-range flex flex-ac">\n                <span v-text="head.label" style="white-space: nowrap"></span>:\n                    <!--<input class="start form-control input-sm " v-model="start" readonly-->\n                        <!--style="background-color: white;width: 12em"-->\n                        <!--placeholder="\u5F00\u59CB\u65F6\u95F4">-->\n                    <com-field-date :head="heads[0]" :row="search_args"></com-field-date>\n                    <div style="display: inline-block;margin: 0 2px;" >-</div>\n                     <com-field-date :head="heads[1]" :row="search_args"></com-field-date>\n                    <!--<input class="end form-control input-sm"  v-model="end"  readonly-->\n                     <!--style="background-color: white;width: 12em"-->\n                     <!--placeholder="\u7ED3\u675F\u65F6\u95F4">-->\n                </div>',
    //mounted:function(){
    //    var self=this
    //    ex.load_js('/static/lib/laydate/laydate.js',function(){
    //        laydate.render({
    //            elem: $(self.$el).find('.start')[0],
    //            type: 'datetime',
    //            done: function(value, date, endDate){
    //                //self.search_args['_start_'+self.head.name]=value
    //                self.start = value
    //                //console.log(value); //得到日期生成的值，如：2017-08-18
    //                //console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
    //                //console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
    //            }
    //        });
    //        laydate.render({
    //            elem: $(self.$el).find('.end')[0],
    //            type: 'datetime',
    //            done: function(value, date, endDate){
    //                self.end=value
    //                //console.log(value); //得到日期生成的值，如：2017-08-18
    //                //console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
    //                //console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
    //            }
    //        });
    //    })
    //},
    computed: {
        start: function start() {
            return this.search_args['_start_' + this.head.name];
        },
        end: function end() {
            return this.search_args['_end_' + this.head.name];
        }
    },
    watch: {
        //start_value(v){
        //    this.start = v
        //},
        //end_value(v){
        //    this.end=v
        //},
        start: function start(nv, ov) {
            if (nv && this.end) {
                if (nv > this.end) {
                    cfg.showError('开始日期必须小于结束日期');

                    //this.search_args['_start_'+this.head.name] = ov
                    Vue.set(this.search_args, '_start_' + this.head.name, ov);
                }
            }
            //Vue.set(this.search_args,'_start_'+this.head.name,nv)
        },
        end: function end(nv, ov) {
            if (nv && this.start) {
                if (nv < this.start) {
                    cfg.showError('结束日期必须大于开始日期');
                    Vue.set(this.search_args, '_end_' + this.head.name, ov);
                    //var self=this
                    //Vue.nextTick(function(){
                    //    self.end = ov
                    //})
                    //return
                }
            }
            //Vue.set(this.search_args,'_end_'+this.head.name,nv)
        }
    }

};

Vue.component('com-filter-date-range', com_datetime_range);

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(12);

var com_datetime_range = {
    props: ['head', 'search_args'],
    data: function data() {

        //var start=this.search_args['_start_'+this.head.name]
        //var end=this.search_args['_end_'+this.head.name]
        return {
            heads: [{ name: '_start_' + this.head.name, placeholder: '开始时间' }, { name: '_end_' + this.head.name, placeholder: '结束时间' }]
        };
    },
    template: '<div  class="com-filter-datetime-range flex flex-ac">\n                <span v-text="head.label" style="white-space: nowrap"></span>:\n                    <!--<input class="start form-control input-sm " v-model="start" readonly-->\n                        <!--style="background-color: white;width: 12em"-->\n                        <!--placeholder="\u5F00\u59CB\u65F6\u95F4">-->\n                    <com-field-datetime :head="heads[0]" :row="search_args"></com-field-datetime>\n                    <div style="display: inline-block;margin: 0 2px;" >-</div>\n                     <com-field-datetime :head="heads[1]" :row="search_args"></com-field-datetime>\n                    <!--<input class="end form-control input-sm"  v-model="end"  readonly-->\n                     <!--style="background-color: white;width: 12em"-->\n                     <!--placeholder="\u7ED3\u675F\u65F6\u95F4">-->\n                </div>',
    //mounted:function(){
    //    var self=this
    //    ex.load_js('/static/lib/laydate/laydate.js',function(){
    //        laydate.render({
    //            elem: $(self.$el).find('.start')[0],
    //            type: 'datetime',
    //            done: function(value, date, endDate){
    //                //self.search_args['_start_'+self.head.name]=value
    //                self.start = value
    //                //console.log(value); //得到日期生成的值，如：2017-08-18
    //                //console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
    //                //console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
    //            }
    //        });
    //        laydate.render({
    //            elem: $(self.$el).find('.end')[0],
    //            type: 'datetime',
    //            done: function(value, date, endDate){
    //                self.end=value
    //                //console.log(value); //得到日期生成的值，如：2017-08-18
    //                //console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
    //                //console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
    //            }
    //        });
    //    })
    //},
    computed: {
        start: function start() {
            return this.search_args['_start_' + this.head.name];
        },
        end: function end() {
            return this.search_args['_end_' + this.head.name];
        }
    },
    watch: {
        //start_value(v){
        //    this.start = v
        //},
        //end_value(v){
        //    this.end=v
        //},
        start: function start(nv, ov) {
            if (nv && this.end) {
                if (nv > this.end) {
                    cfg.showError('开始时间必须小于结束时间');

                    //this.search_args['_start_'+this.head.name] = ov
                    Vue.set(this.search_args, '_start_' + this.head.name, ov);
                }
            }
            //Vue.set(this.search_args,'_start_'+this.head.name,nv)
        },
        end: function end(nv, ov) {
            if (nv && this.start) {
                if (nv < this.start) {
                    cfg.showError('结束时间必须大于开始时间');
                    Vue.set(this.search_args, '_end_' + this.head.name, ov);
                    //var self=this
                    //Vue.nextTick(function(){
                    //    self.end = ov
                    //})
                    //return
                }
            }
            //Vue.set(this.search_args,'_end_'+this.head.name,nv)
        }
    }

};

Vue.component('com-filter-datetime-range', com_datetime_range);

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Vue.component('com-head-bell-msg', {
    props: ['head'],
    template: ' <li  class="com-head-bell-msg dropdown notifications-menu" @click="on_click()">\n        <a href="#" class="dropdown-toggle" data-toggle="dropdown">\n            <i class="fa fa-bell-o"></i>\n            <span v-if="head.count !=0 " class="label label-warning" v-text="head.count"></span>\n        </a>\n    </li>',
    mounted: function mounted() {
        if (this.head.init_express) {
            ex.eval(this.head.init_express, { head: this.head, vc: this });
        }
    },

    methods: {
        on_click: function on_click() {
            if (this.head.link) {
                location = this.head.link;
            }
        }
    }
});

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(13);

Vue.component('com-headbar-space', {
    props: ['head'],
    template: '<li :class="[\'com-headbar-space\',head.class]" :style="head.style">\n    </li>'
});

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(13);

Vue.component('com-headbar-sys-link', {
    props: ['head'],
    template: '<li :class="[\'com-headbar-sys-link user-menu\',{active:head.active,link:head.link}]" @click="on_click()">\n    <span v-text="head.label"></span>\n    </li>',
    methods: {
        on_click: function on_click() {
            if (this.head.link) {
                location = this.head.link;
            }
        }
    }
});

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var user_info = {
    props: ['head'],
    template: ' <li class="dropdown user user-menu">\n                        <!-- Menu Toggle Button -->\n                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">\n                            <!-- The user image in the navbar-->\n                            <!--<img src="dist/img/user2-160x160.jpg" class="user-image" alt="User Image">-->\n                            <i class="fa fa-user-circle-o"></i>\n\n                            <!-- hidden-xs hides the username on small devices so only the image appears. -->\n                            <span class="hidden-xs" v-text="head.first_name || head.username">\n                            </span>\n                        </a>\n                        <ul class="dropdown-menu">\n                            <!-- The user image in the menu -->\n                            <li class="user-header" style="font-size: 3em;">\n                                <!--<img src="dist/img/user2-160x160.jpg" class="img-circle" alt="User Image">-->\n                                <i class="fa fa-user-circle-o fa-lg"></i>\n                                <p v-text="head.first_name || head.username">\n                                </p>\n                            </li>\n                            <!-- Menu Body -->\n                            <!--<li class="user-body">-->\n                                <!--<div class="row">-->\n                                    <!--<div class="col-xs-4 text-center">-->\n                                        <!--<a href="#">Followers</a>-->\n                                    <!--</div>-->\n                                    <!--<div class="col-xs-4 text-center">-->\n                                        <!--<a href="#">Sales</a>-->\n                                    <!--</div>-->\n                                    <!--<div class="col-xs-4 text-center">-->\n                                        <!--<a href="#">Friends</a>-->\n                                    <!--</div>-->\n                                <!--</div>-->\n                                <!--&lt;!&ndash; /.row &ndash;&gt;-->\n                            <!--</li>-->\n                            <!-- Menu Footer-->\n                            <li class="user-footer">\n                                <div class="pull-left">\n                                    <a href="/accounts/pswd" class="btn btn-default btn-flat" v-text="tr.change_password"></a>\n                                </div>\n                                <div class="pull-right">\n                                    <a href="/accounts/logout" class="btn btn-default btn-flat" v-text="tr.logout"></a>\n                                </div>\n                            </li>\n                        </ul>\n                    </li>',
    data: function data() {
        return {
            tr: cfg.tr
        };
    }
};

Vue.component('com-headbar-user-info', user_info);

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _form_one = __webpack_require__(6);

var live_fields = {
    props: ['ctx'],
    basename: 'live-fields',
    mixins: [_form_one.fields_all_in_one]
};

window.live_fields = live_fields;

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var live_table = {
    props: ['ctx'],
    basename: 'live-table',
    //props:['tab_head','par_row'],
    data: function data() {
        var vc = this;
        //var heads_ctx = this.ctx
        var my_table_store = {
            data: function data() {
                return {
                    heads: vc.ctx.heads,
                    row_filters: vc.ctx.row_filters,
                    row_sort: vc.ctx.row_sort,
                    director_name: vc.ctx.director_name,
                    footer: vc.ctx.footer || [],
                    ops: vc.ctx.ops || [],
                    rows: [],
                    row_pages: {},
                    selectable: vc.ctx.selectable == undefined ? true : vc.ctx.selectable,
                    selected: [],
                    del_info: [],
                    search_args: vc.ctx.search_args || {},
                    vc: vc,
                    parStore: ex.vueParStore(vc)
                };
            },
            mixins: [table_store],
            watch: {
                search_args: function search_args(v) {
                    console.log(v);
                }
            },
            methods: {
                //switch_to_tab:function(kws){
                //    this.parStore.switch_to_tab(kws)
                //},
                //getRows:function(){
                //    if(vc.tab_head.pre_set){
                //        var pre_set = ex.eval(vc.tab_head.pre_set,{par_row:vc.par_row})
                //        ex.assign(this.search_args,pre_set)
                //    }else if(vc.tab_head.tab_field){ // 下面是老的调用，
                //        this.search_args[vc.tab_head.tab_field] = vc.par_row[vc.tab_head.par_field]
                //    }else if(vc.tab_head.par_field){
                //        this.search_args[vc.tab_head.par_field] = vc.par_row[vc.tab_head.par_field]
                //    }
                //    table_store.methods.getRows.call(this)
                //
                //},
            }
        };
        return {
            childStore: new Vue(my_table_store),
            parStore: ex.vueParStore(vc)
        };
    },
    mounted: function mounted() {
        if (this.ctx.event_slots) {
            ex.vueEventRout(this, this.ctx.event_slots);
        }
        this.childStore.search();
    },

    template: '<div class="live-table flex-v" style="position: absolute;top:0;left:0;bottom: 0;right:0;overflow: auto;padding-bottom: 1em;">\n       <div v-if="childStore.row_filters.length > 0" style="background-color: #fbfbf8;padding: 8px 1em;border-radius: 4px;margin-top: 8px">\n            <com-table-filters></com-table-filters>\n        </div>\n        <div  v-if="childStore.ops.length>0 ">\n            <com-table-operations></com-table-operations>\n        </div>\n\n        <div v-if="childStore.parents.length>0">\n            <com-table-parents></com-table-parents>\n        </div>\n\n        <!--<ol v-if="parents.length>0" class="breadcrumb jb-table-parent">-->\n            <!--<li v-for="par in parents"><a href="#" @click="get_childs(par)"  v-text="par.label"></a></li>-->\n        <!--</ol>-->\n\n        <div class="box box-success flex-v flex-grow" style="margin-bottom: 0">\n            <div class="table-wraper flex-grow" style="position: relative;">\n                <com-table-rows></com-table-rows>\n               </div>\n        </div>\n        <div style="background-color: white;">\n            <com-table-pagination></com-table-pagination>\n        </div>\n    </div>'
};

window.live_table = live_table;

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var live_table_grid = {
    props: ['ctx'],
    basename: 'live-table-type',
    mixins: [live_table_type],
    data: function data() {
        if (this.ctx.inn_editor) {
            this.ctx.inn_editor = 'com-table-layout-picture-grid';
        }
    }
};

window.live_table_grid = live_table_grid;

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var live_table_type = {
    props: ['ctx'],
    basename: 'live-table-type',
    data: function data() {
        var vc = this;
        //var heads_ctx = this.ctx
        var my_table_store = {
            data: function data() {
                return {
                    head: vc.ctx,
                    heads: vc.ctx.heads,
                    row_filters: vc.ctx.row_filters,
                    row_sort: vc.ctx.row_sort,
                    director_name: vc.ctx.director_name,
                    footer: vc.ctx.footer || [],
                    ops: vc.ctx.ops || [],
                    rows: vc.ctx.rows || [],
                    row_pages: vc.ctx.row_pages || {},
                    selectable: vc.ctx.selectable == undefined ? true : vc.ctx.selectable,
                    selected: [],
                    del_info: [],
                    search_args: vc.ctx.search_args || {},
                    vc: vc,
                    parStore: ex.vueParStore(vc)
                };
            },
            mixins: [table_store],
            watch: {
                search_args: function search_args(v) {
                    console.log(v);
                }
            },
            methods: {}
        };
        return {
            childStore: new Vue(my_table_store),
            parStore: ex.vueParStore(vc)
        };
    },
    mounted: function mounted() {
        if (this.ctx.event_slots) {
            ex.vueEventRout(this, this.ctx.event_slots);
        }
        if (this.ctx.autoload) {
            this.childStore.search();
        }
    },

    template: '<div class="live-table flex-v" style="position: absolute;top:0;left:0;bottom: 0;right:0;overflow: auto;padding-bottom: 2px;">\n       <div v-if="childStore.row_filters.length > 0" style="background-color: #fbfbf8;padding: 8px 1em;border-radius: 4px;margin-top: 8px">\n            <com-table-filters></com-table-filters>\n        </div>\n        <div  v-if="childStore.ops.length>0 ">\n            <com-table-operations></com-table-operations>\n        </div>\n\n        <div v-if="childStore.parents.length>0">\n            <com-table-parents></com-table-parents>\n        </div>\n        <div class="box box-success flex-v flex-grow" style="margin-bottom: 0">\n            <div class="table-wraper flex-grow" style="position: relative;">\n                <!--<com-table-rows></com-table-rows>-->\n                <!--<div style="position: absolute;top:0;left: 0;bottom: 10px;right: 0;overflow: auto">-->\n                    <component :is="ctx.inn_editor"></component>\n                <!--</div>-->\n               </div>\n        </div>\n        <div style="background-color: white;">\n            <com-table-pagination></com-table-pagination>\n        </div>\n    </div>'
};

window.live_table_type = live_table_type;
Vue.component('com-live-table-type', live_table_type);

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var com_pop_field = exports.com_pop_field = {
    props: ['row', 'heads', 'ops'],
    mixins: [mix_fields_data, mix_nice_validator],
    //computed:{
    //    real_heads:function(){
    //        if(this.dict_heads){
    //            return this.dict_heads
    //        }else{
    //            return this.heads
    //        }
    //    }
    //},
    methods: {
        after_save: function after_save(new_row) {
            //this.$emit('sub_success',{new_row:new_row,old_row:this.row})
            this.$emit('submit-success', new_row);
            ex.assign(this.row, new_row);
            this.$emit('finish', new_row);
        },
        del_row: function del_row() {
            var self = this;
            layer.confirm('真的删除吗?', { icon: 3, title: '确认' }, function (index) {
                layer.close(index);
                var ss = layer.load(2);
                var post_data = [{ fun: 'del_rows', rows: [self.row] }];
                $.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                    layer.close(ss);
                    self.$emit('del_success', self.row);
                });
            });
        }
    },
    template: '<div class="flex-v com-pop-fields" style="margin: 0;height: 100%;">\n    <div class = "flex-grow" style="overflow: auto;margin: 0;">\n        <div class="field-panel suit" >\n            <field  v-for="head in normed_heads" :key="head.name" :head="head" :row="row"></field>\n        </div>\n      <div style="height: 1em;">\n      </div>\n    </div>\n     <div style="text-align: right;padding: 8px 3em;">\n        <component v-for="op in normed_ops" :is="op.editor" @operation="on_operation(op)" :head="op"></component>\n    </div>\n     </div>',
    data: function data() {
        return {
            fields_kw: {
                heads: this.heads,
                row: this.row,
                errors: {}
            }
        };
    },
    computed: {
        normed_ops: function normed_ops() {
            var _this = this;

            return ex.filter(this.ops, function (op) {
                if (op.show) {
                    return ex.eval(op.show, { row: _this.row, vc: _this });
                } else {
                    return true;
                }
            });
        }
    }
};

window.com_pop_field = com_pop_field;
//Vue.component('com-pop-fields',)

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mix_fields_data = {
    data: function data() {
        return {
            op_funs: {}
        };
    },
    mounted: function mounted() {
        var self = this;
        ex.assign(this.op_funs, {
            save: function save() {
                //self.save()
                self.submit();
            },
            submit: function submit() {
                self.submit();
            }
        });
        self.setErrors({});
        if (this.head) {
            // TODO 以后吧 style 代码去掉
            if (this.head.style) {
                ex.append_css(this.head.style);
            }
            if (this.head.css) {
                ex.append_css(this.head.css);
            }
            if (this.head.init_express) {
                ex.eval(this.head.init_express, { row: this.row, ps: this.parStore, cs: this.childStore, vc: this });
            }
            ex.vueEventRout(this, this.head.event_slots);
        }
    },
    created: function created() {
        var self = this;
        ex.each(this.heads, function (head) {
            if (typeof head.readonly == 'string') {
                head._org_readonly = head.readonly;
                var is_readonly = ex.eval(head._org_readonly, { row: self.row });
                Vue.set(head, 'readonly', is_readonly);
                //head.readonly=ex.eval(head._org_readonly,{row:self.row})
            }
            if (typeof head.required == 'string') {
                head._org_required = head.required;
                head.required = ex.eval(head._org_required, { row: self.row });
            }
            //if(typeof head.show=='string'){
            //    head._org_show=head.show
            //    head.show=ex.eval(head._org_show,{row:self.row})
            //}
        });
    },
    computed: {
        normed_heads: function normed_heads() {
            var self = this;
            ex.each(self.heads, function (head) {
                if (head._org_readonly) {
                    var is_readonly = ex.eval(head._org_readonly, { row: self.row });
                    Vue.set(head, 'readonly', is_readonly);
                }
                if (head._org_required) {
                    head.required = ex.eval(head._org_required, { row: self.row });
                }
            });

            // 准备用下面两个替换前面所有逻辑
            var heads = ex.filter(self.heads, function (head) {
                if (head.sublevel) {
                    return false;
                } else if (head.show) {
                    return ex.eval(head.show, { row: self.row });
                } else {
                    return true;
                }
            });

            // head.express  用来干啥?
            ex.each(self.heads, function (head) {
                if (head.express) {
                    ex.vueAssign(head, ex.eval(head.express, { row: self.row }));
                }
            });
            return heads;
        },
        normed_ops: function normed_ops() {
            var _this = this;

            return ex.filter(this.ops, function (op) {
                if (op.show) {
                    return ex.eval(op.show, { vc: _this });
                } else {
                    return true;
                }
            });
        }
    },
    methods: {
        //updateRowBk:function(director_name,data){
        //    // 后端可以控制，直接更新row数据
        //    // 该函数废弃，替换为 直接调用 ex.director_call .then
        //
        //    cfg.show_load()
        //    ex.director_call(director_name,data).then(resp=>{
        //        cfg.hide_load()
        //        if(this.par_row){
        //            ex.vueAssign(this.par_row,resp.row)
        //        }
        //        ex.vueAssign(this.row,resp.row)
        //    })
        //},
        on_operation: function on_operation(op) {
            if (op.action) {
                ex.eval(op.action, { vc: this, row: this.row, head: this.head });
            } else {
                var fun_name = op.fun || op.name;
                this.op_funs[fun_name](op.kws);
            }
        },
        on_field_event: function on_field_event(kws) {
            var fun_name = kws.fun || kws.name;
            this.op_funs[fun_name](kws);
        },
        get_data: function get_data() {
            this.data_getter(this);
        },
        setErrors: function setErrors(errors) {
            // errors:{field:['xxx','bbb']}
            var self = this;
            var errors = ex.copy(errors);
            if (!this.heads) {
                return;
            }
            ex.each(this.heads, function (head) {
                if (errors[head.name]) {
                    Vue.set(head, 'error', errors[head.name].join(';'));
                    delete errors[head.name];
                } else if (head.error) {
                    //delete head.error
                    //Vue.delete(head,'error')
                    Vue.set(head, 'error', '');
                    $(self.$el).find('[name=' + head.name + ']').trigger("hidemsg");
                    //Vue.set(head,'error',null)
                }
            });

            if (!ex.isEmpty(errors)) {
                cfg.showMsg(JSON.stringify(errors));
                //layer.alert(
                //    JSON.stringify(errors)
                //)
            }
        },
        dataSaver: function dataSaver(callback) {
            // 该函数已经被废弃
            var post_data = [{ fun: 'save_row', row: this.row }];
            ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                callback(resp.save_row);
            });
        },
        submit: function submit() {
            var self = this;
            this.setErrors({});
            ex.vueBroadCall(self, 'commit');
            return new Promise(function (resolve, reject) {
                Vue.nextTick(function () {
                    if (!self.isValid()) {
                        //reject()
                    } else {
                        self.save().then(function (res) {
                            resolve(res);
                        }).then(function () {
                            // 如果所有流程都没处理load框，再隐藏load框
                            //cfg.hide_load(2000)
                            //cfg.toast('保存成功!')
                        });
                    }
                });
            });
        },
        save: function save() {
            var _this2 = this;

            /*三种方式设置after_save
            * 1. ps.submit().then((new_row)=>{ps.update_or_insert(new_row)})
            * 2. head.after_save = "scope.ps.update_or_insert(scope.row)"
            * 3. @finish="onfinish"   函数: onfinsih(new_row){}
            * */
            var self = this;
            cfg.show_load();
            var post_data = [{ fun: 'save_row', row: this.row }];
            this.old_row = ex.copy(this.row);
            var p = new Promise(function (resolve, reject) {
                //ex.post('/d/ajax',JSON.stringify(post_data), (resp) =>{
                ex.director_call('d.save_row', { row: _this2.row }).then(function (resp) {
                    cfg.hide_load();
                    var rt = resp; //resp.save_row
                    if (rt.errors) {
                        //cfg.hide_load()
                        self.setErrors(rt.errors);
                        self.showErrors(rt.errors);
                        //reject(rt.errors)
                    } else if (rt._outdate) {
                        //cfg.hide_load()
                        layer.confirm(rt._outdate, {
                            icon: 3,
                            title: '提示',
                            btn: ['刷新数据', '仍然保存', '取消'] //可以无限个按钮
                            , btn3: function btn3(index, layero) {
                                layer.close(index);
                            }
                        }, function (index, layero) {
                            layer.close(index);
                            ex.director_call(self.row._director_name, { pk: self.row.pk }).then(function (resp) {
                                ex.vueAssign(self.row, resp.row);
                            });
                            //self.updateRowBk(self.row._director_name,{pk:self.row.pk})
                        }, function (index) {
                            layer.close(index);
                            self.row.meta_hash_fields = '';
                            self.submit();
                        });
                        //cfg.showMsg(rt._outdate)
                    } else {
                        ex.vueAssign(self.row, rt.row);
                        if (_this2.head && _this2.head.after_save && typeof _this2.head.after_save == 'string') {
                            ex.eval(_this2.head.after_save, { ps: self.parStore, vc: self, row: rt.row });
                        } else {
                            // 调用组件默认的
                            self.after_save(rt.row);
                            if (resp.msg || rt.msg) {
                                //cfg.hide_load()
                                cfg.showMsg(resp.msg || rt.msg);
                            } else {
                                cfg.toast('操作成功！', { time: 1000 });
                            }
                        }

                        self.setErrors({});
                        self.$emit('finish', rt.row);
                        resolve(rt.row);
                    }
                });
            });
            return p;
        },

        after_save: function after_save(new_row) {

            //ex.assign(this.row,new_row)
            //TODO 配合 table_pop_fields ，tab-fields 统一处理 after_save的问题
            if (this.par_row) {
                if (this.par_row._director_name == new_row._director_name && this.par_row.pk == new_row.pk) {
                    ex.vueAssign(this.par_row, new_row);
                }
            }
        },
        showErrors: function showErrors(errors) {
            // 落到 nice validator去
        },
        clear: function clear() {
            this.row = {};
            this.set_errors({});
        }

    }
};

window.mix_fields_data = mix_fields_data;

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
用在fields表单里面的mixins

增加nicevalidator功能
* */

var nice_validator = {
    mounted: function mounted() {
        this.update_nice();
    },
    computed: {
        head_fv_rules: function head_fv_rules() {
            var ls = [];
            ex.each(this.heads, function (head) {
                var tmp = '';
                if (head.required) {
                    tmp += 'required';
                }
                if (head.fv_rule) {
                    tmp += head.fv_rule;
                }
                ls.push(head.name + tmp);
            });
            return ls.join(';');
        }
    },
    watch: {
        head_fv_rules: function head_fv_rules() {
            this.update_nice();
        }
    },
    //watch:{
    //    heads:function(new_heads,old_heads){
    //        for(let i=0;i<new_heads.length;i++){
    //            let new_head = new_heads[i]
    //            let old_head = old_heads[i]
    //            if(new_head!=old_head){
    //                let new_rule = this.get_head_fv_rule(new_head)
    //                let old_rule = this.get_head_fv_rule(old_head)
    //                if(new_rule != old_rule){
    //                    this.nice_validator.setField(new_head.name,new_rule)
    //                }
    //            }
    //        }
    //    }
    //},
    methods: {
        get_head_fv_rule: function get_head_fv_rule(head) {
            // todo  判断 该函数应该是没有用了，注意删除
            var ls = [];
            if (head.fv_rule) {
                ls.push(head.fv_rule);
            }
            if (head.required) {
                if (!head.fv_rule || head.fv_rule.search('required') == -1) {
                    // 规则不包含 required的时候，再添加上去
                    ls.push('required');
                }
            }
            if (head.validate_showError) {
                return {
                    rule: ls.join(';'),
                    msg: head.fv_msg,
                    msgClass: 'hide',
                    invalid: function invalid(e, b) {
                        var label = head.label;
                        ex.eval(head.validate_showError, { msg: label + ' : ' + b.msg });
                    }
                };
            } else {
                return {
                    rule: ls.join(';'),
                    msg: head.fv_msg
                };
            }
        },
        update_nice: function update_nice() {
            var self = this;
            var validate_fields = {};
            ex.each(this.heads, function (head) {
                var ls = [];
                if (head.readonly) {
                    return;
                }
                if (head.fv_rule) {
                    ls.push(head.fv_rule);
                }
                if (head.required) {
                    if (!head.fv_rule || head.fv_rule.search('required') == -1) {
                        // 规则不包含 required的时候，再添加上去
                        ls.push('required');
                    }
                }

                if (head.validate_showError) {
                    validate_fields[head.name] = {
                        rule: ls.join(';'),
                        msg: head.fv_msg,
                        msgClass: 'hide',
                        invalid: function invalid(e, b) {
                            var label = head.label;
                            ex.eval(head.validate_showError, { msg: b.msg, head: head });
                        },
                        valid: function valid(element, result) {
                            ex.eval(head.validate_clearError, { head: head });
                        }
                    };
                } else {
                    validate_fields[head.name] = {
                        rule: ls.join(';'),
                        msg: head.fv_msg

                    };
                }
            });
            this.nice_validator = $(this.$el).validator({
                fields: validate_fields
                //msgShow:function($msgbox, type){
                //    alert('aajjyy')
                //},validation: function(element, result){
                //   alert('aaabbbb')
                //}
            });
        },
        isValid: function isValid() {
            var nice_rt = this.nice_validator.isValid();
            return nice_rt;
            //var totalValid=[nice_rt]
            //var totalValid=ex.vueBroadCall(this,'isValid')
            //totalValid.push(nice_rt)
            //
            ////ex.each(this.$children,function(child){
            ////    if(child.isValid){
            ////        totalValid.push(child.isValid())
            ////    }
            ////})
            //
            //var valid =true
            //ex.each(totalValid,function(item){
            //    valid = valid && item
            //})
            //return valid
        },
        //before_save:function(){
        //    ex.vueSuper(this,{mixin:nice_validator,fun:'before_save'})
        //    if(this.isValid()){
        //        return 'continue'
        //    }else{
        //        return 'break'
        //    }
        //},
        showErrors: function showErrors(errors) {
            var real_input = $(this.$el).find('.real-input');
            if (real_input.length != 0) {
                real_input.trigger("showmsg", ["error", errors[k].join(';')]);
            }

            for (var k in errors) {
                var head = ex.findone(this.heads, { name: k });
                if (head && head.validate_showError) {
                    ex.eval(head.validate_showError, { head: this.head, msg: errors[k].join(';') });
                } else {
                    $(this.$el).find('[name=' + k + ']').trigger("showmsg", ["error", errors[k].join(';')]);
                }
            }
        }
    }

    //$.validator.config({
    //    rules: {
    //        error_msg: function(ele,param){
    //
    //        }
    //    }
    //}
    //
    //);

};window.mix_nice_validator = nice_validator;

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var table_page_store = {
    data: function data() {
        return {
            tab_stack: [],
            tabs: [],
            //named_tabs:[],
            childStore_event_slot: childStore_event_slot
        };
    },
    created: function created() {
        var self = this;
        // 这个不用了，转到 table_store 里面去了
        ex.each(this.childStore_event_slot, function (router) {
            self.$on(router.event, function (e) {
                var kws = ex.eval(router.kws, e);
                self[router.fun](kws);
            });
        });
    },
    methods: {
        hello: function hello(mm) {
            alert(mm);
        },
        update_ctx: function update_ctx(kws) {
            var post_data = kws.post_data || {};
            ex.director_call(kws.director_name, post_data, function (resp) {

                //Vue.set(named_ctx,router.ctx_name,resp)
                named_ctx[kws.ctx_name] = resp;
            });
        },

        pop_tab_stack: function pop_tab_stack() {

            if (this.tab_stack.length != 0) {
                this.tab_stack.pop();
            }
            //                if(this.tab_stack.length==0){
            //                    this.tabgroup.crt='_main'
            //                    this.tabgroup.crt_tabs=[]
            //                }
            var self = this;
            Vue.nextTick(function () {
                // 返回table页面时，可能是由于布局原因，造成table看不见
                self.e_table.doLayout();
            });
        }
    }
};

window.table_page_store = table_page_store;

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var table_store = {
    data: function data() {
        return {
            parents: [],
            heads: [],
            rows: [],
            row_filters: {},
            row_sort: {},
            row_pages: {},
            director_name: '',
            footer: {},
            selected: [],
            search_args: {}, //ex.parseSearch(),
            ops: [],
            crt_row: {},
            selectable: true,
            changed_rows: [],
            event_slots: [],
            option: {},
            table_layout: {},
            after_get_rows: null

        };
    },
    mixins: [mix_ele_table_adapter],
    created: function created() {
        var self = this;
        ex.each(this.event_slots, function (router) {
            self.$on(router.event, function (e) {
                ex.eval(router.express, { event: e, ps: self });
            });
        });
        if (this.head) {
            if (this.head.init_express) {
                ex.eval(this.head.init_express, { par_row: this.par_row, ps: this, vc: this.vc });
            }
        }
    },
    computed: {
        changed: function changed() {
            return this.changed_rows.length != 0;
        },
        has_select: function has_select() {
            return this.selected.length != 0;
        }
    },
    methods: {
        row_has_field: function row_has_field(name) {
            if (this.rows.length == 0) {
                return false;
            } else {
                return this.rows[0][name] != undefined;
            }
        },

        express: function express(kws) {
            var self = this;
            var row_match_fun = kws.row_match;
            if (row_match_fun && !row_match[row_match_fun](self, kws)) {
                return;
            }
            if (kws.confirm_msg) {
                layer.confirm(kws.confirm_msg, { icon: 3, title: '提示' }, function (index) {
                    layer.close(index);
                    ex.eval(kws.express, self);
                });
            } else {
                var real_kws = ex.copy(kws);
                if (kws.update_kws) {
                    ex.assign(real_kws, ex.eval(real_kws, { ps: self, kws: kws }));
                }
                ex.eval(real_kws.express, { ps: self, kws: real_kws });
            }
        },
        search: function search() {
            this.search_args._page = 1;
            return this.getRows();
        },
        getRows: function getRows() {
            /*
             以后都用这个函数，不用什么get_data 或者 data_getter 了
             * */
            var self = this;

            cfg.show_load();

            var post_data = { director_name: self.director_name, search_args: self.search_args };
            return new Promise(function (resolve, reject) {
                ex.director_call('d.get_rows', post_data, function (resp) {
                    cfg.hide_load();
                    self.selected = [];
                    self.rows = resp.rows;
                    ex.vueAssign(self.row_pages, resp.row_pages);
                    ex.vueAssign(self.search_args, resp.search_args);
                    self.footer = resp.footer;
                    self.parents = resp.parents;
                    self.table_layout = resp.table_layout;
                    if (self.after_get_rows) {
                        ex.eval(self.after_get_rows, { ps: self, resp: resp });
                    }
                    self.$emit('data-updated-backend');
                    resolve(resp);
                });
            });

            //var post_data=[{fun:'get_rows',director_name:self.director_name,search_args:self.search_args}]
            //ex.post('/d/ajax',JSON.stringify(post_data),function(resp){
            //    cfg.hide_load()
            //    self.rows = resp.get_rows.rows
            //    ex.vueAssign( self.row_pages,resp.get_rows.row_pages)
            //    ex.vueAssign(self.search_args,resp.get_rows.search_args)
            //    self.footer=resp.get_rows.footer
            //    self.parents=resp.get_rows.parents
            //    self.table_layout=resp.get_rows.table_layout
            //    if(self.after_get_rows){
            //        ex.eval(self.after_get_rows,{ps:self,resp:resp})
            //    }
            //    self.$emit('data-updated-backend')
            //})
        },
        add_new: function add_new(kws) {
            var head = kws;

            var self = this;
            var fields_ctx = kws.fields_ctx;
            var dc = { fun: 'get_row', director_name: fields_ctx.director_name };

            if (kws.pre_set) {
                var pre_set = ex.eval(kws.pre_set, { vc: self.vc, ps: self, search_args: self.search_args });
                ex.assign(dc, pre_set);
            } else if (kws.init_fields) {
                // 老的的调用，准备移除
                ex.assign(dc, kws.init_fields);
            }
            var post_data = [dc];
            cfg.show_load();
            ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                cfg.hide_load();
                var crt_row = resp.get_row;
                if (self.search_args._par) {
                    crt_row.meta_par = self.search_args._par;
                }
                if (head.preset) {
                    ex.vueAssign(crt_row, ex.eval(head.preset, { ps: self }));
                }
                self.crt_row = crt_row;
                if (kws.tab_name) {
                    // 需要继承table_page_store
                    //self.switch_to_tab(kws)
                    var bb = ex.copy(kws);
                    bb.par_row = crt_row;
                    self.switch_to_tab(bb);
                    //self.$emit('operation',{fun:'switch_to_tab',tab_name:kws.tab_name,row:crt_row})
                    //self.switch_to_tab({tab_name:kws.tab_name,row:crt_row})
                } else {
                    fields_ctx.row = crt_row;
                    cfg.pop_vue_com('com-form-one', fields_ctx).then(function (row) {
                        self.update_or_insert(row);
                    });
                    //var win=pop_fields_layer(crt_row,fields_ctx,function(new_row){
                    //    self.update_or_insert(new_row, crt_row)
                    //    layer.close(win)
                    //    if(kws.after_save){
                    //        ex.eval(kws.after_save,{ps:self})
                    //    }
                    //})
                }
            });
        },
        pop_edit: function pop_edit(_ref) {
            var row = _ref.row,
                fields_ctx = _ref.fields_ctx,
                after_save = _ref.after_save;

            var self = this;
            var win_index = pop_fields_layer(row, fields_ctx, function (new_row) {
                if (after_save) {
                    ex.eval(after_save, { new_row: new_row, ps: self });
                } else {
                    self.update_or_insert(new_row);
                }
                //var fun = after_save[self.head.after_save.fun]
                //fun(self, new_row, pop_row)

                layer.close(win_index);
            });
            //var fun= get_row[this.head.get_row.fun]
            //if(this.head.get_row.kws){
            //    //  这个是兼顾老的调用，新的调用，参数直接写在get_row里面，与fun平级
            //    var kws= this.head.get_row.kws
            //}else{
            //    var kws= this.head.get_row
            //}
            //kws.director_name = this.head.fields_ctx.director_name

            //fun(function(pop_row){
            //    //pop_fields_layer(pop_row,self.head.fields_heads,ops,self.head.extra_mixins,function(kws){
            //    var win_index =  pop_fields_layer(pop_row,self.head.fields_ctx,function(new_row){
            //
            //        var fun = after_save[self.head.after_save.fun]
            //        fun(self,new_row,pop_row)
            //
            //        layer.close(win_index)
            //
            //    })
            //},this.rowData,kws)
        },

        clearSelection: function clearSelection() {
            this.selected = [];
            // 在mix_ele_table_adaptor 中会触发 element table 自动清除选择。
        },
        get_childs: function get_childs(par) {
            this.search_args._par = par;
            this.search();
        },
        update_or_insert: function update_or_insert(new_row, old_row) {
            // 如果是更新，不用输入old_row，old_row只是用来判断是否是创建的行为
            // 不用 old_row 了， 只需要判断 pk 是否在rows里面即可。
            var table_row = ex.findone(this.rows, { pk: new_row.pk });
            if (table_row) {
                ex.vueAssign(table_row, new_row);
            } else {
                this.rows = [new_row].concat(this.rows);
                this.row_pages.total += 1;
            }

            //if(old_row && ! old_row.pk) {
            //
            //    //var rows = this.rows.splice(0, 0, new_row)
            //    this.rows=[new_row].concat(this.rows)
            //    this.row_pages.total+=1
            //}else{
            //    var table_row = ex.findone(this.rows,{pk:new_row.pk})
            //    if(table_row){
            //        ex.vueAssign(table_row,new_row)
            //    }
            //}
            this.$emit('row.update_or_insert', [new_row]);
        },
        update_rows: function update_rows(rows) {
            var self = this;
            ex.each(rows, function (row) {
                var table_row = ex.findone(self.rows, { pk: row.pk });
                ex.vueAssign(table_row, row);
            });
            self.$emit('row.update_or_insert', [rows]);
        },
        check_selected: function check_selected(head) {
            var row_match_fun = head.row_match || 'many_row';
            return row_match[row_match_fun](this, head);
        },

        selected_set_and_save: function selected_set_and_save(kws, resend) {
            /*
             这个是主力函数
             // 路线：弹出->编辑->update前端（缓存的）row->保存->后台->成功->update前端row->关闭窗口
             * */
            // head: row_match:many_row ,
            var self = this;
            var row_match_fun = kws.row_match || 'many_row';
            if (!row_match[row_match_fun](self, kws)) {
                return;
            }

            /*
            弹框确认
            * */
            new Promise(function (resolve, reject) {
                if (kws.confirm_msg && !resend) {
                    layer.confirm(kws.confirm_msg, { icon: 3, title: '提示' }, function (index) {
                        layer.close(index);
                        resolve();
                    });
                } else {
                    resolve();
                }
            }).then(function () {
                //  弹出编辑框/ 或者不弹出
                var one_row = {};
                if (kws.field) {
                    // 兼容老的，新的采用eval形式，
                    one_row[kws.field] = kws.value;
                    one_row.meta_overlap_fields = kws.field;
                } else if (kws.pre_set) {
                    var dc = ex.eval(kws.pre_set);
                    ex.assign(one_row, dc);
                    one_row.meta_overlap_fields = Object.keys(dc).join(',');
                }

                if (kws.fields_ctx) {
                    ex.map(kws.fields_ctx.heads, function (head) {
                        if (!head.name.startsWith('_') && one_row[head.name] == undefined) {
                            one_row[head.name] = self.selected[0][head.name];
                        }
                    });
                    var win_index = pop_edit_local(one_row, kws.fields_ctx, function (new_row, store) {
                        var dc = { new_row: new_row, field_store: store, pop_fields_win_index: win_index };
                        after_proc(dc);
                    });
                } else {
                    after_proc({ new_row: one_row });
                }
            });

            function after_proc(_ref2) {
                var new_row = _ref2.new_row,
                    field_store = _ref2.field_store,
                    pop_fields_win_index = _ref2.pop_fields_win_index;

                // 编辑后，提交
                var cache_rows = ex.copy(self.selected);
                ex.each(cache_rows, function (row) {
                    ex.assign(row, new_row);
                    if (kws.fields_ctx && kws.fields_ctx.director_name) {
                        row._cache_director_name = row._director_name; // [1] 有可能是用的特殊的 direcotor
                        row._director_name = kws.fields_ctx.director_name;
                    }
                });
                //var post_data=[{fun:'save_rows',rows:cache_rows}]
                cfg.show_load();
                //ex.post('/d/ajax',JSON.stringify(post_data),function(resp){
                ex.director_call('d.save_rows', { rows: cache_rows }).then(function (resp) {
                    cfg.hide_load();
                    if (resp._outdate) {
                        layer.confirm(resp._outdate, {
                            icon: 3,
                            title: '提示',
                            btn: ['刷新数据', '仍然保存', '取消'] //可以无限个按钮
                            , btn3: function btn3(index, layero) {
                                layer.close(index);
                            }
                        }, function (index, layero) {
                            layer.close(index);
                            self.search();
                        }, function (index) {
                            layer.close(index);
                            ex.each(self.selected, function (row) {
                                row.meta_hash_fields = '';
                            });
                            self.selected_set_and_save(kws, true);
                        });
                        return;
                    } else if (!resp.errors) {
                        cfg.toast('操作成功！', { time: 1000 });
                        if (kws.after_save) {
                            if (ex.eval(kws.after_save, { rows: resp, ps: self }) == 'stop') {
                                return;
                            }
                        }
                        ex.each(resp, function (new_row) {
                            // [1]  这里还原回去
                            if (new_row._cache_director_name) {
                                new_row._director_name = new_row._cache_director_name;
                            }
                            self.update_or_insert(new_row);
                        });

                        self.clearSelection();
                        if (pop_fields_win_index) {
                            layer.close(pop_fields_win_index);
                        }
                    } else {
                        if (kws.after_error) {
                            ex.eval(kws.after_error, { fs: field_store, errors: resp.errors });
                        } else {
                            cfg.showError(JSON.stringify(resp.errors));
                        }
                    }
                });
            }
        },
        save_rows: function save_rows(rows, option) {
            var self = this;
            var promise = new ex.DefPromise(function (resolve, reject) {

                ex.director_call('d.save_rows', { rows: rows }).then(function (resp) {
                    cfg.hide_load();

                    if (resp._outdate) {
                        layer.confirm(resp._outdate, {
                            icon: 3,
                            title: '提示',
                            btn: ['刷新数据', '仍然保存', '取消'] //可以无限个按钮
                            , btn3: function btn3(index, layero) {
                                layer.close(index);
                            }
                        }, function (index, layero) {
                            layer.close(index);
                            self.search();
                        }, function (index) {
                            layer.close(index);
                            ex.each(rows, function (row) {
                                row.meta_hash_fields = '';
                            });
                            self.save_rows(rows);
                        });
                    } else if (resp.errors) {
                        if (option.after_error) {
                            ex.eval(option.after_error, { errors: resp.errors });
                        } else {
                            cfg.showError(JSON.stringify(resp.errors));
                        }
                    } else if (promise.has_then) {
                        resolve(resp);
                    } else if (option.after_save) {
                        return ex.eval(option.after_save, { ps: self, resp: resp });
                    } else {
                        cfg.toast('操作成功！', { time: 1000 });
                        ex.each(resp, function (new_row) {
                            self.update_or_insert(new_row);
                        });
                    }
                });
            });

            return promise;
        },

        export_excel: function export_excel() {
            var self = this;
            var search_args = ex.copy(self.search_args);
            search_args._perpage = 5000;
            var post_data = [{ fun: 'get_excel', director_name: self.director_name, search_args: search_args }];
            cfg.show_load();
            ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                cfg.hide_load();
                var url = resp.get_excel.file_url;
                ex.download(url);
            });
        },
        director_call: function director_call(kws) {
            var self = this;
            var row_match_fun = kws.row_match;
            if (row_match_fun) {
                if (row_match[row_match_fun]) {
                    if (!row_match[row_match_fun](self, kws)) {
                        return;
                    }
                } else {
                    // 如果匹配不了，就说明是express
                    if (!ex.eval(row_match_fun, { ps: self })) {
                        if (kws.match_msg) {
                            ex.eval(kws.match_msg, { ps: self });
                        }
                        return;
                    }
                }
            }

            function do_director_call(new_row, callback) {
                cfg.show_load();
                ex.director_call(kws.director_name, { rows: self.selected, new_row: new_row }, function (resp) {
                    debugger;
                    if (!resp || !resp.msg) {
                        cfg.hide_load(2000);
                    } else {
                        cfg.hide_load();
                        cfg.toast(resp.msg, { time: 1500 });
                    }
                    if (kws.after_save) {
                        ex.eval(kws.after_save, { resp: resp, ps: self, rows: self.selected });
                    } else if (resp) {
                        // 兼容老的调用
                        // 返回rows ，默认更新
                        if (resp.rows) {
                            self.update_rows(resp.rows);
                        }
                        if (resp.row) {
                            self.update_or_insert(resp.row);
                        }
                    }

                    self.clearSelection();
                    if (callback) {
                        callback(resp);
                    }
                });
            }

            function judge_pop_fun() {
                var one_row = {};
                ex.assign(one_row, ex.eval(kws.pre_set, { head: kws, ps: self.parStore, self: self }));
                if (kws.fields_ctx) {
                    ex.map(kws.fields_ctx.heads, function (head) {
                        if (!head.name.startsWith('_') && one_row[head.name] == undefined) {
                            one_row[head.name] = self.selected[0][head.name];
                        }
                    });
                    var win_index = pop_edit_local(one_row, kws.fields_ctx, function (new_row, store) {
                        do_director_call(new_row, function (resp) {
                            layer.close(win_index);
                        });
                    });
                } else {
                    do_director_call(one_row);
                }
            }

            if (kws.confirm_msg) {
                layer.confirm(kws.confirm_msg, { icon: 3, title: '提示' }, function (index) {
                    layer.close(index);
                    judge_pop_fun();
                });
            } else {
                judge_pop_fun();
            }
        },
        arraySpanMethod: function arraySpanMethod(_ref3) {
            var row = _ref3.row,
                column = _ref3.column,
                rowIndex = _ref3.rowIndex,
                columnIndex = _ref3.columnIndex;

            // 计算布局
            if (this.table_layout) {
                if (_typeof(this.table_layout) == 'object') {
                    return this.table_layout[rowIndex + ',' + columnIndex] || [1, 1];
                } else {
                    return ex.eval(this.table_layout, { row: row, column: column, rowIndex: rowIndex, columnIndex: columnIndex });
                }
            } else {
                return [1, 1];
            }
        },
        delete_selected: function delete_selected() {
            var self = this;
            layer.confirm('真的删除吗?', { icon: 3, title: '确认' }, function (index) {
                layer.close(index);
                //var ss = layer.load(2);
                cfg.show_load();
                var post_data = [{ fun: 'del_rows', rows: self.selected }];
                ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
                    cfg.hide_load();
                    self.search();
                });
            });
        },
        pop_panel: function pop_panel(kws) {
            var self = this;
            var row_match_fun = kws.row_match || 'many_row';
            if (!row_match[row_match_fun](self, kws)) {
                return;
            }
            if (kws.panel) {
                var panel = kws.panel;
            } else {
                var panel = ex.eval(kws.panel_express, { ps: self, kws: kws });
            }
            var ctx = ex.copy(kws);
            if (kws.ctx_express) {
                var cus_ctx = ex.eval(kws.ctx_express, { ps: self, kws: kws });
                ex.assign(ctx, cus_ctx);
            }
            var winclose = cfg.pop_middle(panel, ctx, function (resp) {
                if (ctx.after_express) {
                    ex.eval(ctx.after_express, { ps: self, resp: resp });
                } else {
                    self.update_or_insert(resp);
                }
                self.clearSelection();
                winclose();
            });
        },
        switch_to_tab: function switch_to_tab(kws) {
            // 从 table_page_store 移过来的。因为 live_table 可能有这个需求
            var self = this;
            var tabs = named_ctx[kws.ctx_name];
            if (!tabs) {
                throw 'named_ctx. ' + kws.ctx_name + ' \u4E0D\u5B58\u5728\uFF0C\u68C0\u67E5\u662F\u5426\u4F20\u5165';
            }

            var canfind = ex.findone(tabs, { name: kws.tab_name });
            if (!kws.tab_name || !canfind) {
                kws.tab_name = tabs[0].name;
            }

            if (window.root_live) {
                // keeplive 页面
                root_live.open_live(live_el_tab, { tabs: tabs, title: kws.par_row._label, crt_tab_name: kws.tab_name, par_row: kws.par_row, last_ps: self });
            } else {
                // 传统 页面
                self.tab_stack.push({
                    widget: 'com-widget-el-tab',
                    tabs: tabs,
                    crt_tab_name: kws.tab_name,
                    par_row: kws.par_row

                });
            }
            // 这里暂时打开，以后移除
            self.crt_row = kws.par_row;
        }
    }

};

var row_match = {
    one_row: function one_row(self, head) {
        if (self.selected.length == 0) {
            cfg.showMsg('请选择一条数据！');
            return false;
        } else if (self.selected.length > 1) {
            cfg.showMsg('只能选择一条数据！');
            return false;
        } else if (head.match_express) {
            var matched = ex.eval(head.match_express, { row: self.selected[0] });
            if (!matched) {
                cfg.showError(head.match_msg);
                return false;
            }
        }
        return true;
    },
    many_row: function many_row(self, head) {
        if (self.selected.length == 0) {
            cfg.showMsg('请至少选择一条数据！');
            return false;
        } else {
            if (head.match_express) {
                for (var i = 0; i < self.selected.length; i++) {
                    var row = self.selected[i];
                    if (!ex.eval(head.match_express, { row: row })) {
                        cfg.showError(head.match_msg);
                        return false;
                    }
                }
            }
            return true;
        }
    },
    one_row_match: function one_row_match(self, head) {
        if (self.selected.length != 1) {
            cfg.showMsg('请选择一行数据！');
            return false;
        } else {
            var field = head.match_field;
            var values = head.match_values;
            var msg = head.match_msg;

            var row = self.selected[0];

            if (!ex.isin(row[field], values)) {
                cfg.showMsg(msg);
                return false;
            } else {
                return true;
            }
        }
    },
    // 这个函数被 many_row 替代了。 只需要加上 match_express 就可以替换这个函数
    many_row_match: function many_row_match(self, head) {
        // head : @match_field , @match_values ,@match_msg
        if (self.selected.length == 0) {
            cfg.showMsg('请至少选择一行数据！');
            return false;
        } else {
            if (head.match_field) {
                // 老的用法，准备剔除  ,现在全部改用 match_express
                var field = head.match_field;
                var values = head.match_values;
                var msg = head.match_msg;

                for (var i = 0; i < self.selected.length; i++) {
                    var row = self.selected[i];
                    if (!ex.isin(row[field], values)) {
                        cfg.showMsg(msg);
                        return false;
                    }
                }
                return true;
            } else {
                for (var i = 0; i < self.selected.length; i++) {
                    var row = self.selected[i];
                    if (!ex.eval(head.match_express)) {
                        cfg.showMsg(head.match_msg);
                        return false;
                    }
                }
                return true;
            }
        }
    }
};

window.table_store = table_store;

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var op_a = {
    props: ['head', 'disabled'],
    template: '<button class="btn btn-sm btn-default" :class="this.head.class"\n        :style="head.style" :disabled="disabled" @click="operation_call">\n        <i v-if="head.icon" :class=\'["fa",head.icon]\'></i>\n        <span  v-text="head.label"></span>\n    </button>',
    data: function data() {
        return {
            enable: true
        };
    },
    mounted: function mounted() {
        if (this.head.css) {
            ex.append_css(this.head.css);
        }
    },

    computed: {
        norm_class: function norm_class() {
            if (this.head.class) {
                return 'btn btn-sm ' + this.head.class;
            } else {
                return 'btn btn-sm btn-default';
            }
        }
    },
    methods: {
        operation_call: function operation_call() {
            this.$emit('operation', this.head);
        },
        set_enable: function set_enable(yes) {
            this.enable = yes;
        }
    }
};
Vue.component('com-op-plain-btn', op_a);

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(226);

Vue.component('com-op-search', {
    props: ['head'],
    data: function data() {
        return {
            myvalue: '',
            parStore: ex.vueParStore(this)
        };
    },
    template: '<div class="com-op-search">\n         <template v-if="head.btn_text">\n          <input type="text" :placeholder="head.label" v-model="myvalue"> <button  @click="operation_call()" v-text="head.btn_text"></button>\n         </template>\n         <input v-else type="text" :placeholder="head.label" v-model="myvalue" :key="operation_call()">\n    </div>',

    methods: {
        operation_call: function operation_call() {
            var head = ex.copy(this.head);
            head.value = this.myvalue;
            this.$emit('operation', head);
        }

    }
});

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(227);

Vue.component('com-op-switch', {
    props: ['head'],
    data: function data() {
        return {
            myvalue: false,
            parStore: ex.vueParStore(this)
        };
    },
    template: '<div class="com-op-switch">\n    <span v-text="head.label"></span>\n    <el-switch @click.native="trig_switch()"\n      v-model="myvalue"\n      :active-color="head.active_color || \'#13ce66\'"\n      inactive-color="#888">\n    </el-switch>\n    </div>',
    mounted: function mounted() {
        if (this.head.init_express) {
            ex.eval(this.head.init_express, { ps: this.parStore, vc: this });
        }

        //switch_get_value(this)
    },
    methods: {

        trig_switch: function trig_switch() {
            var self = this;
            if (this.head.op_confirm_msg) {
                var mymsg = ex.eval(this.head.op_confirm_msg, { value: this.myvalue });
                layer.confirm(mymsg, { icon: 3, title: '提示', closeBtn: 0 }, function (index) {
                    layer.close(index);
                    self.do_switch();
                }, function () {
                    self.myvalue = !self.myvalue;
                });
            } else {
                self.do_switch();
            }
        },
        do_switch: function do_switch() {
            this.head.value = this.myvalue;
            this.$emit('operation', this.head.name);
        }
        //operation_call:function(){
        //    this.$emit('operation',this.head.name)
        //},
    }
});

function switch_get_value(self) {
    ex.director_call(self.head.init_express, {}).then(function (resp) {
        self.myvalue = resp;
    });
}

//async  function asyncDirector(name){
//    return new Promise((resolve,reject)=>{
//        ex.director_call(name,{},function(resp){
//            resolve(resp)
//        })
//    })
//}

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(242);

Vue.component('com-chart-plain', {
    props: ['ctx'],
    data: function data() {
        return {
            barRows: [],
            rows: [],
            parStore: ex.vueParStore(this)
        };
    },
    template: ' <div class="com-chart-plain" :class="ctx.class" :style="ctx.style"></div>',
    mounted: function mounted() {
        //$('#mainjj').width($(this.$el).width()-30)
        //this. myChart = echarts.init(document.getElementById('mainjj'));
        this.myChart = echarts.init(this.$el);
        //this.getRows()
        this.parStore.$on('data-updated-backend', this.update_chart);
        if (this.ctx.css) {
            ex.append_css(this.ctx.css);
        }
    },
    methods: {
        //getRows:function(){
        //    var self=this
        //    cfg.show_load()
        //    ex.director_call('trend_data',{key:this.trend.key},function(resp){
        //        self.barRows=resp
        //        cfg.hide_load()
        //    })
        //}
        update_chart: function update_chart() {
            var _this = this;

            var self = this;
            if (this.ctx.source_rows) {
                var rows = ex.eval(this.ctx.source_rows, { ps: this.parStore });
            } else {
                var rows = this.parStore.rows;
            }
            if (this.ctx.xdata) {
                var x_data = ex.map(rows, function (row) {
                    return row[_this.ctx.xdata];
                });
            } else {
                var x_data = ex.eval(this.ctx.xdata_express, { rows: rows });
            }

            var ydata_list = [];
            var legend_list = [];
            if (this.ctx.ydata) {
                ex.each(this.ctx.ydata, function (head) {
                    var y_data = ex.map(rows, function (row) {
                        return row[head.name];
                    });
                    ydata_list.push({
                        name: head.label,
                        type: head.type,
                        data: y_data,
                        barMaxWidth: 30,
                        itemStyle: {
                            normal: {
                                color: head.color // || '#27B6AC'
                            }
                        }
                    });
                    legend_list.push(head.label);
                });
            } else {
                ex.eval(this.ctx.ydata_express, { rows: rows, ydata_list: ydata_list, legend_list: legend_list });
            }

            var option = {
                title: {
                    text: self.ctx.title
                },
                tooltip: {},
                legend: {
                    data: legend_list
                },
                xAxis: {
                    data: x_data
                },
                yAxis: {},
                series: ydata_list
            };
            if (this.ctx.echarts_option) {
                ex.mergeObject(option, this.ctx.echarts_option);
            }

            //if(this.ctx.x_interval != undefined){
            //    var axisLabel={
            //        interval:this.ctx.x_interval,//横轴信息全部显示
            //        fontSize:10,
            //        //formatter:function(value){//只显示7个字 其余省略号
            //        //    //return value.length > 7?value.substring(0,7)+'...':value;
            //        //    var out=''
            //        //    for(var i=0;i<value.length;i+=7){
            //        //        out+= value.substring(i,i+7)+'\n'
            //        //    }
            //        //    return out
            //        //    //return value.length > 7?value.substring(0,7)+'...':value;
            //        //},
            //        //formatter: [
            //        //    '{mylabel|这段文本采用样式mylabel}',
            //        //
            //        //].join('\n'),
            //        //formatter:  '{a|{value}a}',
            //                //formatter:function(val){
            //                //    return val.split("").join("\n");
            //                //},
            //        //rich: {
            //        //    a: {
            //        //        color: 'red',
            //        //        textOverflow:'ellipsis',
            //        //        width:'100px'
            //        //    },
            //        //}
            //    }
            //    if(this.ctx.x_rotate){
            //        axisLabel.rotate = this.ctx.x_rotate
            //    }
            //    option.xAxis.axisLabel = axisLabel
            //}


            this.myChart.setOption(option);
        }
    },
    watch: {
        barRows: function barRows(v) {
            var self = this;
            var x_data = ex.map(v, function (item) {
                return item.time;
            });
            var y_data = ex.map(v, function (item) {
                return item.amount;
            });

            var option = {
                title: {
                    //                text: 'ECharts 入门示例'
                },
                tooltip: {},
                //            legend: {
                //                data:['销量']
                //            },
                xAxis: {
                    data: x_data
                },
                yAxis: {},
                series: [{
                    name: self.trend.label,
                    type: 'bar',
                    data: y_data
                }]
            };
            this.myChart.setOption(option);
        }
    }
});

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _radar = __webpack_require__(134);

var radar = _interopRequireWildcard(_radar);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Vue.component('com-chart-radar', {
    props: ['ctx'],
    data: function data() {
        return {
            barRows: [],
            rows: [],
            parStore: ex.vueParStore(this)
        };
    },
    template: ' <div class="com-chart-plain com-chart-radar" style="height:400px;width: 500px;display: inline-block"></div>',
    mounted: function mounted() {
        //$('#mainjj').width($(this.$el).width()-30)
        //this. myChart = echarts.init(document.getElementById('mainjj'));
        this.myChart = echarts.init(this.$el);
        //this.getRows()
        this.parStore.$on('data-updated-backend', this.update_chart);
        this.update_chart();
    },
    methods: {
        update_chart: function update_chart() {
            var _this = this;

            var self = this;
            if (this.ctx.source_rows) {
                var rows = ex.eval(this.ctx.source_rows, { ps: this.parStore });
            } else {
                var rows = this.parStore.rows;
            }

            var x_data = ex.map(rows, function (row) {
                return { name: row[_this.ctx.xdata], max: 5000, min: -5000 };
            });

            var ydata_list = [];
            var legend_list = [];
            debugger;
            ex.each(this.ctx.ydata, function (head) {
                var y_data = ex.map(rows, function (row) {
                    return row[head.name];
                });
                ydata_list.push({
                    name: head.label,
                    value: y_data
                    //itemStyle: {
                    //    normal: {
                    //        color: head.color // || '#27B6AC'
                    //    },
                    //},
                });
                legend_list.push(head.label);
            });

            var option = {
                title: {
                    text: self.ctx.title
                },
                tooltip: {},
                legend: {
                    data: legend_list
                },
                radar: {
                    // shape: 'circle',
                    name: {
                        textStyle: {
                            color: '#fff',
                            backgroundColor: '#999',
                            borderRadius: 3,
                            padding: [3, 5]
                        }
                    },
                    indicator: x_data
                    //    [
                    //    { name: '销售（sales）', max: 6500},
                    //    { name: '管理（Administration）', max: 16000},
                    //    { name: '信息技术（Information Techology）', max: 30000},
                    //    { name: '客服（Customer Support）', max: 38000},
                    //    { name: '研发（Development）', max: 52000},
                    //    { name: '市场（Marketing）', max: 25000}
                    //]
                },
                //xAxis: {
                //    data: x_data
                //},
                //yAxis: {},
                series: [{
                    name: 'xxx',
                    type: 'radar',
                    data: ydata_list

                }]
            };
            this.myChart.setOption(option);
        }
    }

});

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
__webpack_require__(11);

var com_form_panel = exports.com_form_panel = {
    props: ['ctx'],
    data: function data() {
        var self = this;
        var option = {
            okBtn: self.ctx.okBtn || '确定',
            ops: self.ctx.ops
        };
        if (this.ctx.option) {
            ex.assign(option, this.ctx.option);
        }

        return {
            row: this.ctx.row || {},
            heads: this.ctx.heads,
            form: this.ctx.form || cfg.form || com_form,
            small: false,
            small_srn: ex.is_small_screen(),
            option: option

        };
    },
    mounted: function mounted() {
        if ($(this.$el).width() < 600) {
            this.small = true;
        } else {
            this.small = false;
        }
    },
    methods: {
        on_finish: function on_finish(e) {
            this.$emit('finish', e);
        }
    },
    template: '<div :class="[\'flex-v com-fields-panel\',option.cssCls,{\'small_srn\':small_srn}]">\n     <component class="msg-bottom" :is="form" :heads="heads" :row="row" :option="option" @finish="on_finish($event)"></component>\n     </div>'
};
window.com_form_panel = com_form_panel;
Vue.component('com-form-panel', com_form_panel);

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Vue.component('com-layout-grid', {
    prop: ['ctx'],
    template: '<div>\n    this is grid\n    </div>'
});

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(228);

var html_panel = {
    props: ['ctx'],
    template: '<div class="com-html-content-panel" v-html="ctx.content"></div>'

};
Vue.component('com-html-content-panel', html_panel);

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var html_panel = {
    props: ['ctx'],
    template: '<div class="com-html-panel" v-html="ctx.content"></div>'

};
Vue.component('com-html-panel', html_panel);

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(229);

var iframe_panel = {
    props: ['ctx'],
    template: '<div class="com-iframe-panel">\n        <iframe :src="ctx.url" style="width: 100%;height:100%;vertical-align:top" scrolling="auto"></iframe>\n    </div>'

};
Vue.component('com-iframe-panel', iframe_panel);

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _fields_panel = __webpack_require__(7);

var com_pop_fields_panel = {
    props: ['ctx'],
    data: function data() {
        return {
            fields_editor: this.ctx.fields_editor || com_pop_field
        };
    },
    mixins: [_fields_panel.com_fields_panel],
    template: '<div :class="[\'flex-v com-fields-panel\',cssCls,{\'small_srn\':small_srn}]" style="height: 100%">\n     <component class="msg-bottom"  :is="fields_editor" :heads="heads" :row="row" :ops="ops"\n       :cross-btn="crossBtn" @finish="on_finish($event)"></component>\n     </div>'
};

Vue.component('com-panel-pop-fields', com_pop_fields_panel);

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var table_panel = {
    props: ['ctx'],

    data: function data() {
        var self = this;
        if (this.ctx.selectable == undefined) {
            this.ctx.selectable = true;
        }
        var base_table_panel_store = {
            props: ['ctx'],
            propsData: {
                ctx: self.ctx
            },
            data: function data() {
                return {
                    head: self.ctx,
                    vc: self,
                    par_row: self.ctx.par_row || {},
                    heads: self.ctx.heads || [],
                    selectable: self.ctx.selectable,
                    search_args: self.ctx.search_args || {},
                    row_filters: self.ctx.row_filters || {},
                    row_sort: self.ctx.row_sort || { sortable: [] },
                    director_name: self.ctx.director_name || '',
                    ops: self.ctx.ops || [],
                    row_pages: self.ctx.row_pages || { crt_page: 1, total: 0, perpage: 20 },
                    rows: [],
                    footer: [],
                    selected: []
                };
            },
            mixins: [table_store]
        };
        var this_table_store = this.get_custom_store(base_table_panel_store);
        //var this_table_store =  {
        //    mixins:[table_store,base_table_store].concat(custom_store)
        //}
        return {
            childStore: new Vue(this_table_store),
            par_row: this.ctx.par_row || {},
            del_info: []
        };
    },
    mixins: [mix_table_data, mix_ele_table_adapter],

    mounted: function mounted() {
        this.childStore.$on('finish', this.emit_finish);
        if (this.ctx.event_slots) {
            ex.vueEventRout(this, this.ctx.event_slots);
        }
        // 如果有复杂的需求，则被 table_store.init_express接管
        if (!this.childStore.head.init_express) {
            this.childStore.search();
        }
    },
    methods: {
        get_custom_store: function get_custom_store(base_table_panel_store) {
            return base_table_panel_store;
        },
        emit_finish: function emit_finish(event) {
            this.$emit('finish', event);
        }
    },
    template: '<div class="com-table-panel" style="height: 100%;">\n\n            <div class="rows-block flex-v" style="height: 100%">\n\n\n              <div v-if="childStore.row_filters.length > 0" style="background-color: #fbfbf8;padding: 8px 1em;border-radius: 4px;margin-top: 8px">\n\n                     <com-table-filters></com-table-filters>\n\n               </div>\n\n               <!--<div  v-if="childStore.ops.length>0 && childStore.tab_stack.length ==0">-->\n               <div  v-if="childStore.ops.length>0">\n                        <com-table-operations></com-table-operations>\n               </div>\n\n                <div class="box box-success flex-v flex-grow" style="margin-bottom: 0">\n                    <div class="table-wraper flex-grow" style="position: relative;">\n\n                        <com-table-rows></com-table-rows>\n                    </div>\n                </div>\n            <div style="background-color: white;">\n                <com-table-pagination></com-table-pagination>\n            </div>\n\n        </div>\n    </div>'
};

window.com_table_panel = table_panel;
//Vue.component('com-table-editor',table_panel)

//window.com_table_panel=table_panel
Vue.component('com-table-panel', table_panel);

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

__webpack_require__(243);

var table_setting_panel = {
    props: ['ctx'],
    template: '<div class="com-panel-table-setting">\n    <div class="head-panel">\n        <div class="panel panel-info">\n            <div class="panel-heading">\u666E\u901A\u5217</div>\n            <div style="padding: 10px">\n             <el-checkbox-group class="mygroup" v-model="heads_bucket._first_layer" data-name="_first_layer">\n                <el-checkbox v-for="head in first_layer_field" :data-id="head.name" :label="head.name" size="small" border>\n                    <i class="fa fa-level-down" aria-hidden="true" v-if="head.children"></i>\n                        <span v-text="head.label"></span>\n                </el-checkbox>\n             </el-checkbox-group>\n            </div>\n\n        </div>\n\n        <div class="panel panel-warning" v-for="field_group in group_field_list">\n             <div class="panel-heading"> <span v-text="field_group.label"></span></div>\n             <div style="padding: 10px">\n                  <el-checkbox-group class="mygroup" v-model="heads_bucket[field_group.name]" :data-name="field_group.name">\n                    <el-checkbox v-for="head in field_list(field_group.children)" :data-id="head.name" :label="head.name" size="small" border>\n                            <span v-text="head.label"></span>\n                    </el-checkbox>\n                  </el-checkbox-group>\n             </div>\n\n        </div>\n\n    </div>\n\n\n    <div class="mybtn-panel">\n         <el-button size="small" @click="clear_format()">\u6062\u590D\u9ED8\u8BA4</el-button>\n         <el-button type="primary" size="small" @click="make_catch()">\u786E\u5B9A</el-button>\n    </div>\n\n    </div>',
    data: function data() {
        var advise_heads = this.ctx.table_ps.advise_heads;
        var advise_order = this.ctx.table_ps.advise_order;
        var table_heads = ex.sort_by_names(this.ctx.table_ps.heads, advise_order, true);
        var first_layer_field = ex.filter(table_heads, function (head) {
            return !head.sublevel;
        });
        var group_field_list = ex.filter(table_heads, function (head) {
            return head.children;
        });

        var first_layer_heads_name = ex.map(first_layer_field, function (head) {
            return head.name;
        });
        var first_layer_advise_heads = ex.filter(advise_heads, function (name) {
            return ex.isin(name, first_layer_heads_name);
        });
        var heads_bucket = {
            _first_layer: first_layer_advise_heads
        };
        ex.each(group_field_list, function (group_head) {
            heads_bucket[group_head.name] = ex.filter(advise_heads, function (name) {
                return ex.isin(name, group_head.children);
            });
        });

        return {
            table_heads: table_heads,
            advise_heads: advise_heads,
            advise_order: advise_order,
            heads_bucket: heads_bucket,
            order_bucket: {},
            first_layer_field: first_layer_field,
            group_field_list: group_field_list
        };
    },
    mounted: function mounted() {
        var self = this;
        var ddom = $(this.$el).find('.mygroup');
        ex.each(ddom, function (mydom) {
            var name = $(mydom).attr('data-name');
            var order_list = [];
            self.order_bucket[name] = order_list;
            new Sortable(mydom, {
                animation: 150,
                store: {
                    /**
                     * Get the order of elements. Called once during initialization.
                     * @param   {Sortable}  sortable
                     * @returns {Array}
                     */
                    //get: function (sortable) {
                    //    var order = localStorage.getItem(sortable.options.group.name);
                    //    return order ? order.split('|') : [];
                    //},

                    /**
                     * Save the order of elements. Called onEnd (when the item is dropped).
                     * @param {Sortable}  sortable
                     */
                    set: function set(sortable) {
                        //self.advise_order = sortable.toArray()
                        order_list.splice.apply(order_list, [0, order_list.length].concat(_toConsumableArray(sortable.toArray())));
                    }
                }
            });
        });
    },

    computed: {
        myheads: function myheads() {
            return ex.filter(this.ctx.table_ps.heads, function (head) {
                return head.name;
            });
        }
    },
    methods: {
        field_list: function field_list(children) {
            return ex.filter(this.table_heads, function (head) {
                return ex.isin(head.name, children);
            });
        },
        make_catch: function make_catch() {
            var _this = this;

            this.advise_heads = [];
            this.advise_order = [];
            for (var key in this.heads_bucket) {
                var mylist = this.heads_bucket[key];
                this.advise_heads = this.advise_heads.concat(mylist);
            }
            this.advise_order = this.order_bucket._first_layer;
            ex.each(this.group_field_list, function (head) {
                var _advise_order;

                var index = _this.advise_order.indexOf(head.name);
                var mylist = _this.order_bucket[head.name];
                (_advise_order = _this.advise_order).splice.apply(_advise_order, [index, 0].concat(_toConsumableArray(mylist)));
            });

            //ex.each(this.order_bucket,(mylist)=>{
            //
            //    this.advise_order = this.advise_order.concat(mylist)
            //})


            this.ctx.table_ps.advise_heads = this.advise_heads;
            if (this.advise_order.length > 0) {
                this.ctx.table_ps.advise_order = this.advise_order;
            }

            var key = '_table_settings_' + this.ctx.table_ps.director_name;
            var setting_str = localStorage.getItem(key);
            if (setting_str) {
                var setting_obj = JSON.parse(setting_str);
                setting_obj.advise_heads = this.advise_heads;
                if (this.advise_order.length > 0) {
                    setting_obj.advise_order = this.advise_order;
                }
            } else {
                var setting_obj = {
                    advise_heads: this.advise_heads,
                    advise_width: {},
                    advise_order: this.advise_order
                };
            }

            localStorage.setItem(key, JSON.stringify(setting_obj));

            if (this.advise_order.length > 0) {
                var tmp = ex.sort_by_names(this.ctx.table_ps.heads, this.advise_order, true);
                var tmp_rows = this.ctx.table_ps.rows;

                this.ctx.table_ps.heads = [];
                this.ctx.table_ps.rows = [];
                setTimeout(function () {
                    _this.ctx.table_ps.heads = tmp;
                    _this.ctx.table_ps.rows = tmp_rows;
                    _this.ctx.table_ps.$emit('data-updated-backend');
                }, 200);
            }
            this.$emit('finish');
        },
        clear_format: function clear_format() {
            var key = '_table_settings_' + this.ctx.table_ps.director_name;
            localStorage.clear(key);
            this.$emit('finish');
            cfg.show_load();
            location.reload();
        }
    }
};

Vue.component('com-panel-table-setting', function (resolve, reject) {
    ex.load_js_list([js_config.js_lib.sortablejs, 'https://cdnjs.cloudflare.com/ajax/libs/Vue.Draggable/2.20.0/vuedraggable.umd.min.js'], function () {
        resolve(table_setting_panel);
    });
});

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
将数据  [1,2,3,4]   显示为 1;2;3;4

 * */
var array_mapper = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-text="show_data"></span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    computed: {
        show_data: function show_data() {
            if (this.rowData[this.field]) {
                return this.rowData[this.field].join(';');
            } else {
                return '';
            }
        }

    }
};

Vue.component('com-table-array-shower', array_mapper);

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var my_click = {
    // head: {fun:'xxx'}
    props: ['rowData', 'field', 'index'],
    template: '<div class="com-table-click clickable" @click="on_click()" style="display: inline-block">\n        <component v-if="head.inn_editor"\n            :is="head.inn_editor"\n            :row-data="rowData" :field="field" :index="index"></component>\n        <span v-else="" v-text="rowData[field]" ></span>\n    </div>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });

        this.parStore = ex.vueParStore(this);
    },
    methods: {
        on_click: function on_click() {
            ex.eval(this.head.action, { row: this.rowData, head: this.head, ps: this.parStore });
            //this.$emit('on-custom-comp',{name:this.head.fun,row:this.rowData,head:this.head})
        }
    }
};

Vue.component('com-table-click', my_click);

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var my_link = {
    props: ['rowData', 'field', 'index'],
    template: '<div class="com-table-color" style="width:5em;height: 2em" :style="{background: rowData[field]}">\n\n    </div>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    data: function data() {
        return {
            parStore: ex.vueParStore(this)
        };
    }
};

Vue.component('com-table-color', my_link);

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(244);

var operations = {
    props: ['rowData', 'field', 'index'],
    template: '<div class="com-table-icon-cell">\n        <div class="icon-item" v-for="icon in myicons">\n            <img :src="icon.url" alt="" :title="icon.label">\n        </div>\n    </div>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    computed: {
        myicons: function myicons() {
            var pp = ex.eval(this.head.icon_express, { row: this.rowData });
            return pp;
        }
    },
    mounted: function mounted() {
        this.parStore = ex.vueParStore(this);
    },
    methods: {
        on_operation: function on_operation(op) {
            if (op.action) {
                ex.eval(op.action, { ps: this.parStore, head: this.head, row: this.rowData });
            }
        }
        //on_click:function(op){
        //    if(op.action){
        //        ex.eval(op.action,{ps:this.parStore,head:this.head,row:this.rowData})
        //    }
        //}

    }
};

Vue.component('com-table-icon-cell', operations);

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Vue.component('com-table-json', {
    props: ['rowData', 'field', 'index'],
    template: '<span class="com-table-json" v-text="show_text">\n    </span>',
    computed: {
        show_text: function show_text() {
            if (this.rowData[this.field]) {
                return JSON.stringify(this.rowData[this.field]);
            } else {
                return '';
            }
        }
    }
});

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var my_link = {
    props: ['rowData', 'field', 'index'],
    template: '<span class="com-table-link clickable" v-text="rowData[field]" @click="on_click">\n    </span>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    data: function data() {
        return {
            parStore: ex.vueParStore(this)
        };
    },

    methods: {
        on_click: function on_click() {
            ex.eval(this.head.action, { head: this.head, row: this.rowData, ps: this.parStore });
        }
    }
};

Vue.component('com-table-link', my_link);

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var html_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<div :class="[\'com-table-map-html\',head.class]" v-html="show_label"></div>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },

    computed: {
        show_label: function show_label() {
            var value = this.rowData[this.field];
            if (this.head.map_express) {
                return ex.eval(this.head.map_express, { head: this.head, row: this.rowData });
            }
        }
    },
    mounted: function mounted() {
        if (this.head.css) {
            ex.append_css(this.head.css);
        }
    }
};

Vue.component('com-table-map-html', html_shower);

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 options:{
 key:value
 }
 * */
var mapper = {
    props: ['rowData', 'field', 'index'],
    template: '<div class="com-table-multi-image" style="white-space: nowrap">\n    <div v-for="image in image_list" style="display: inline-block;margin: 3px;">\n        <img @click="big_win(image)" style="max-height: 100px;max-width:100px;"  :src="image" alt="\u56FE\u7247\u4E0D\u80FD\u663E\u793A">\n    </div>\n\n    </div>',
    created: function created() {
        // find head from parent table
        //var table_par = this.$parent
        //while (true){
        //    if (table_par.heads){
        //        break
        //    }
        //    table_par = table_par.$parent
        //    if(!table_par){
        //        break
        //    }
        //}
        //this.table_par = table_par
        //this.head= ex.findone(this.table_par.heads,{name:this.field})
    },
    computed: {
        image_list: function image_list() {
            if (this.rowData[this.field]) {
                return this.rowData[this.field];
            } else {
                return [];
            }
        }
    },
    methods: {
        big_win: function big_win(imgsrc) {
            var ctx = { imgsrc: imgsrc };
            pop_layer(ctx, 'com-pop-image', function () {}, {
                title: false,
                area: ['90%', '90%'],
                shade: 0.8,
                skin: 'img-shower',
                shadeClose: true
            });
        }
    }
};

Vue.component('com-table-multi-image', mapper);

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(245);

var multi_row = {
    props: ['rowData', 'field', 'index'],
    template: '<div class="com-field-multi-row">\n    <div class="myrow" v-for="(row,rindex) in rowData[head.rows_field]" >\n        <component :is="head.row_editor" :rowData="row" :field="head.name" :index="rindex"></component>\n    </div>\n    </div>',
    data: function data() {
        this.init_head();
        return {
            parStore: ex.vueParStore(this)
        };
    },
    mounted: function mounted() {
        var _this = this;

        setTimeout(function () {
            _this.update_title();
        }, 1000);
        this.parStore.$on('header-dragend', this.on_drag);
    },

    computed: {
        mydata: function mydata() {
            var _this2 = this;

            var rows = this.rowData[this.head.rows_field];
            return ex.map(rows, function (row) {
                return row[_this2.field];
            });
        }
    },
    watch: {
        mydata: function mydata() {
            var _this3 = this;

            setTimeout(function () {
                _this3.update_title();
            }, 1000);
        }
    },
    methods: {
        init_head: function init_head() {
            var table_par = this.$parent;
            while (true) {
                if (table_par.heads) {
                    break;
                }
                table_par = table_par.$parent;
                if (!table_par) {
                    break;
                }
            }
            this.table_par = table_par;
            this.head = ex.findone(this.table_par.heads, { name: this.field });
        },
        on_drag: function on_drag(kws) {
            var _this4 = this;

            //newWidth, oldWidth, column, event
            if (kws.column.property == this.field) {
                setTimeout(function () {
                    _this4.update_title();
                }, 1000);
            }
        },
        update_title: function update_title() {

            ex.each($(this.$el).find('.myrow'), function (mydiv) {
                if ($(mydiv).width() < $(mydiv).find('span').width()) {
                    $(mydiv).attr('title', mydiv.textContent);
                } else {
                    $(mydiv).attr('title', '');
                }
            });
        }
    }

};

Vue.component('com-field-multi-row', multi_row);

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 额外的点击列，例如“详情”
 * */

/*
* head={
*
* }
* */
var operations = {
    props: ['rowData', 'field', 'index'],
    template: '<div class="com-table-ops-cell">\n        <!--<span style="margin-right: 1em" v-for="op in head.operations" v-show="! rowData[\'_op_\'+op.name+\'_hide\']" class="clickable" v-text="op.label" @click="on_click()"></span>-->\n        <component v-for="op in head.ops" :is="op.editor" :head="op" @operation="on_operation($event)"></component>\n    </div>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    //data:function(){
    //var self=this
    //return {
    //    parStore:ex.vueParStore(self)
    //}
    //},
    mounted: function mounted() {
        this.parStore = ex.vueParStore(this);
    },
    methods: {
        on_operation: function on_operation(op) {
            if (op.action) {
                ex.eval(op.action, { ps: this.parStore, head: this.head, row: this.rowData });
            }
        }
        //on_click:function(op){
        //    if(op.action){
        //        ex.eval(op.action,{ps:this.parStore,head:this.head,row:this.rowData})
        //    }
        //}

    }
};

Vue.component('com-table-ops-cell', operations);

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _pop_fields = __webpack_require__(4);

var pop_fields_from_row = {
    // fields 的 所有 ctx 从row中获取 。
    // 因为有时，需要根据不同的row，显示不同的 forms。 
    mixins: [_pop_fields.pop_fields],
    methods: {
        open_layer: function open_layer() {
            var self = this;
            var ctx_name = this.rowData[this.head.ctx_field];
            var allinone_ctx = named_ctx[ctx_name];
            var fun = get_row[allinone_ctx.get_row.fun];
            if (allinone_ctx.get_row.kws) {
                //  这个是兼顾老的调用，新的调用，参数直接写在get_row里面，与fun平级
                var kws = allinone_ctx.get_row.kws;
            } else {
                var kws = allinone_ctx.get_row;
            }
            kws.director_name = allinone_ctx.fields_ctx.director_name;

            fun(function (pop_row) {
                //pop_fields_layer(pop_row,self.head.fields_heads,ops,self.head.extra_mixins,function(kws){
                var win_index = pop_fields_layer(pop_row, allinone_ctx.fields_ctx, function (new_row) {

                    var fun = after_save[allinone_ctx.after_save.fun];
                    fun(self, new_row, pop_row);

                    layer.close(win_index);
                });
            }, this.rowData, kws);
        }
    }

};

Vue.component('com-table-pop-fields-from-row', pop_fields_from_row);

var show_label = {
    use_other_field: function use_other_field(row, kws) {
        var other_field = kws.other_field;
        return row[other_field];
    },
    text_label: function text_label(row, show_label) {
        return show_label.text;
    }
};

var get_row = {
    use_table_row: function use_table_row(callback, row, kws) {
        callback(row);
    },
    get_table_row: function get_table_row(callback, row, kws) {
        var cache_row = ex.copy(row);
        callback(cache_row);
    },
    get_with_relat_field: function get_with_relat_field(callback, row, kws) {
        var director_name = kws.director_name;
        var relat_field = kws.relat_field;

        var dc = { fun: 'get_row', director_name: director_name };
        dc[relat_field] = row[relat_field];
        var post_data = [dc];
        cfg.show_load();
        ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
            cfg.hide_load();
            callback(resp.get_row);
        });
    }
};

var after_save = {
    do_nothing: function do_nothing(self, new_row, old_row, table) {},
    update_or_insert: function update_or_insert(self, new_row, old_row) {
        self.parStore.update_or_insert(new_row, old_row);
        //self.$emit('on-custom-comp',{name:'update_or_insert',new_row:new_row,old_row:old_row})
        //var par_name=ex.vuexParName(self)
        //if(par_name){
        //self.parStore.$emit('row.update_or_insert',{new_row:new_row,old_row:old_row})
        //}
    }
};

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

__webpack_require__(246);

var label_shower = {
    props: ['rowData', 'field', 'index'],
    //:class="myclass"
    template: '<div :class="[\'com-table-rich-span\',myclass]" :style="mystyle">\n <component v-if="head.inn_editor"\n            :is="head.inn_editor"\n            :row-data="rowData" :field="field" :index="index"></component>\n            <span v-else v-text="show_text"></span>\n</div>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
        this.parStore = ex.vueParStore(this);
    },
    mounted: function mounted() {
        if (this.head.css) {
            ex.append_css(this.head.css);
        }
        this.on_row_change();
    },

    watch: {
        rowData: {
            handler: function handler(v) {
                this.on_row_change();
            },

            deep: true
        }
    },
    methods: {
        on_row_change: function on_row_change() {
            if (this.head.row_change_express) {
                ex.eval(this.head.row_change_express, { row: this.rowData, head: this.head, td: $(this.$el).parents('td').first() });
            }
        },
        light_level: function light_level(h) {
            var h = h.slice(1);
            var r = 0,
                g = 0,
                b = 0;
            r = parseInt(h[0], 16) * 16 + parseInt(h[1], 16);
            g = parseInt(h[2], 16) * 16 + parseInt(h[3], 16);
            b = parseInt(h[4], 16) * 16 + parseInt(h[5], 16);
            return r * 0.299 + g * 0.587 + b * 0.114;
        },
        hexToReverse: function hexToReverse(h) {
            var h = h.slice(1);
            var r = 0,
                g = 0,
                b = 0;
            r = 255 - parseInt(h[0], 16) * 16 - parseInt(h[1], 16);
            g = 255 - parseInt(h[2], 16) * 16 - parseInt(h[3], 16);
            b = 255 - parseInt(h[4], 16) * 16 - parseInt(h[5], 16);
            var out = (r < 16 ? "0" + r.toString(16).toUpperCase() : r.toString(16).toUpperCase()) + (g < 16 ? "0" + g.toString(16).toUpperCase() : g.toString(16).toUpperCase()) + (b < 16 ? "0" + b.toString(16).toUpperCase() : b.toString(16).toUpperCase());
            return '#' + out;
        }
    },
    computed: {
        mystyle: function mystyle() {
            if (this.head.style) {
                return ex.eval(this.head.style, { row: this.rowData, head: this.head, vc: this });
            }
        },

        show_text: function show_text() {
            var value = this.rowData[this.field];
            if (value == undefined) {
                return '';
            } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
                return JSON.stringify(value);
            } else {
                return this.rowData[this.field];
            }
        },
        myclass: function myclass() {
            if (this.head.cell_class) {
                return ex.eval(this.head.cell_class, { row: this.rowData, head: this.head });
            } else {
                return '';
            }
        }
    }
};

Vue.component('com-table-rich-span', label_shower);

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
* 用于 表格最左侧的 序号显示。。。
* */
var com_table_sequence = {
    props: ['rowData', 'field', 'index'],
    template: '<div><span v-text="show_text" ></span></div>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
        this.parStore = ex.vueParStore(this);
    },
    computed: {
        show_text: function show_text() {
            var perpage = this.parStore.row_pages.perpage;
            var crt_page = this.parStore.row_pages.crt_page;
            return this.index + 1 + (crt_page - 1) * perpage;
        }
    }
};
Vue.component('com-table-sequence', com_table_sequence);

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var label_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<span v-text="show_text"></span>',
    computed: {
        show_text: function show_text() {
            var value = this.rowData[this.field];
            if (value == undefined) {
                return '';
            } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
                return JSON.stringify(value);
            } else {
                return this.rowData[this.field];
            }
        }
    }
};

Vue.component('com-table-span', label_shower);

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var money_shower = {
    props: ['rowData', 'field', 'index'],
    template: '<div v-text="rowData[field]" :style="my_style"></div>',
    created: function created() {
        // find head from parent table
        var table_par = this.$parent;
        while (true) {
            if (table_par.heads) {
                break;
            }
            table_par = table_par.$parent;
            if (!table_par) {
                break;
            }
        }
        this.table_par = table_par;
        this.head = ex.findone(this.table_par.heads, { name: this.field });
    },
    computed: {
        my_style: function my_style() {
            return ex.eval(this.head.style_express, { row: this.rowData });
        }
    }
};

Vue.component('com-table-style-block', money_shower);

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var cascasder_filter = {
    props: ['head', 'search_args'],

    template: '<div class="com-filter-cascasder">\n       <el-cascader\n            :show-all-levels="false"\n            v-model="search_args[head.name]"\n            :options="head.options"\n            :props="{checkStrictly: true ,emitPath:false}"\n            size="small"\n            clearable>\n        </el-cascader>\n    </div> '

};
Vue.component('com-filter-cascasder', cascasder_filter);

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ele_filter = {
    data: function data() {
        this.parStore = ex.vueParStore(this);
        return {
            row_filters: this.parStore.row_filters,
            search_args: this.parStore.search_args
        };
    },
    template: ' <com-filter class="flex" :heads="normed_heads" :search_args="search_args"\n                        @submit="search()"></com-filter>',
    computed: {
        normed_heads: function normed_heads() {
            var _this = this;

            var out_ls = [];
            ex.each(this.row_filters, function (head) {
                if (head.show) {
                    if (!ex.eval(head.show, { ps: _this.parStore, head: head })) {
                        return;
                    }
                }
                out_ls.push(head);
            });
            return out_ls;
        }
    },
    methods: {
        search: function search() {
            this.parStore.search();
            //this.bus.eventBus.$emit('search',this.bus.search_args)
        }
    }
};

Vue.component('com-table-filters', ele_filter);

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ele_operations = {

    //                      :disabled="get_attr(op.disabled)"
    //v-show="! get_attr(op.hide)"
    template: '<div class="oprations" style="padding: 5px;">\n                <component v-for="(op,index) in ops"\n                           :is="op.editor"\n                           :ref="\'op_\'+op.name"\n                           :head="op"\n                           :key="index"\n                           :disabled="is_disable(op)"\n                           v-show="is_show(op)"\n                           @operation="on_operation(op)"></component>\n            </div>',
    data: function data() {
        var self = this;
        this.parStore = ex.vueParStore(this);
        return {
            ops: this.parStore.ops
        };
    },

    methods: {
        is_disable: function is_disable(op) {
            if (op.disabled == undefined) {
                return false;
            } else {
                return ex.eval(op.disabled, { ps: this.parStore });
            }
        },
        is_show: function is_show(op) {
            count += 1;
            console.log(count);
            console.log(op.label);
            if (op.show == undefined) {
                return true;
            } else {
                return ex.eval(op.show, { ps: this.parStore });
            }
        },
        eval: function _eval(express) {
            if (express == undefined) {
                return false;
            } else {
                return ex.eval(express, this.parStore);
            }
        },
        on_operation: function on_operation(op) {
            var fun_name = op.fun || op.name; // 以后都使用 fun
            this.parStore[fun_name](op);
            //this.bus.eventBus.$emit('operation',op)
        }
    }
};

var count = 0;
Vue.component('com-table-operations', ele_operations);

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ele_page = {

    data: function data() {
        var parStore = ex.vueParStore(this);
        this.parStore = parStore.table ? parStore.table : parStore;
        return {
            row_pages: this.parStore.row_pages,
            search_args: this.parStore.search_args
        };
    },
    methods: {
        on_page_change: function on_page_change(v) {
            this.search_args._page = v;
            this.parStore.getRows();
            //this.bus.eventBus.$emit('pageindex-change',v)
        },
        on_perpage_change: function on_perpage_change(v) {
            this.search_args._perpage = v;
            this.parStore.search();
            //this.bus.eventBus.$emit('perpage-change',v)
        }
    },
    //  @size-change="on_perpage_change"
    //@current-change="get_page"
    template: ' <el-pagination\n                         @size-change="on_perpage_change"\n                        @current-change="on_page_change"\n                        :current-page="row_pages.crt_page"\n                        :page-sizes="[20, 50, 100, 500]"\n                        :page-size="row_pages.perpage"\n                        layout="total, sizes, prev, pager, next, jumper"\n                        :total="row_pages.total">\n                </el-pagination>'
};

Vue.component('com-table-pagination', ele_page);

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var table_parents = {
    data: function data() {
        var self = this;
        return {
            parStore: ex.vueParStore(self)
        };
    },
    template: '<div class="com-table-parents">\n          <ol v-if="parStore.parents.length>0" class="breadcrumb jb-table-parent">\n            <li v-for="par in parStore.parents"><a href="#" @click="on_click(par)"  v-text="par.label"></a></li>\n        </ol>\n    </div>',
    methods: {
        on_click: function on_click(par) {
            if (this.parStore.option.parent_click) {
                ex.eval(this.parStore.option.parent_click, { ps: this.parStore, parent: par });
            } else {
                this.parStore.$emit('parent_changed', par);
                this.parStore.get_childs(par.value);
            }
        }
    }
};
Vue.component('com-table-parents', table_parents);

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ele_table = {
    props: ['ctx'],
    created: function created() {},
    data: function data() {
        var parStore = ex.vueParStore(this);
        var keyed_heads = {};
        ex.each(parStore.heads, function (head) {
            keyed_heads[head.name] = head;
        });

        if (parStore.advise_heads && parStore.advise_heads.length > 0) {
            var key = '_table_settings_' + parStore.director_name;
            var setting_str = localStorage.getItem(key);
            if (setting_str) {
                var setting_obj = JSON.parse(setting_str);
                setting_obj.advise_width = setting_obj.advise_width || {};
                setting_obj.advise_order = setting_obj.advise_order || [];
                ex.each(parStore.heads, function (head) {
                    if (setting_obj.advise_width[head.name]) {
                        head.width = setting_obj.advise_width[head.name];
                    }
                });
            } else {
                var setting_obj = {
                    advise_heads: parStore.advise_heads,
                    advise_width: {},
                    advise_order: []
                };
                localStorage.setItem(key, JSON.stringify(setting_obj));
            }
            parStore.advise_heads = setting_obj.advise_heads;
            parStore.advise_width = setting_obj.advise_width || {};
            parStore.advise_order = setting_obj.advise_order || [];
        } else {
            parStore.advise_heads = [];
            parStore.advise_width = {};
            parStore.advise_order = [];
        }
        if (parStore.advise_order.length > 0) {
            parStore.heads = ex.sort_by_names(parStore.heads, parStore.advise_order, true);
        }

        return {
            parStore: parStore,
            heads: parStore.heads,
            keyed_heads: keyed_heads,
            //rows:this.parStore.rows,
            search_args: parStore.search_args,
            row_sort: parStore.row_sort
            //selectable:this.parStore.selectable,

        };
    },
    mounted: function mounted() {
        this.parStore.e_table = this.$refs.e_table;
        this.parStore.$on('data-updated-backend', this.on_data_updated);
        ex.each(this.parStore.heads, function (head) {
            if (head.style) {
                ex.append_css(head.style);
            }
        });
    },

    computed: {
        default_sort: function default_sort() {
            var sort_str = this.parStore.row_sort.sort_str;
            if (!sort_str) {
                return {};
            }
            var sort_list = sort_str.split(',');
            sort_str = sort_list[0];
            if (sort_str.startsWith('-')) {
                var prop = sort_str.slice(1);
                var order = 'descending';
            } else {
                var prop = sort_str;
                var order = 'ascending';
            }
            return { prop: prop, order: order };
        },
        normed_heads: function normed_heads() {
            var _this = this;

            var out_ls = [];
            if (this.parStore.advise_heads.length > 0) {
                var left_heads = ex.filter(this.parStore.heads, function (head) {
                    return ex.isin(head.name, _this.parStore.advise_heads);
                });
            } else {
                var left_heads = this.parStore.heads;
            }

            ex.each(left_heads, function (head) {
                if (head.show) {
                    if (!ex.eval(head.show, { ps: _this.parStore, vc: _this, head: head })) {
                        return;
                    }
                }
                out_ls.push(head);
            });

            return out_ls;
        },

        rows: function rows() {
            return this.parStore.rows;
        },
        selected: function selected() {
            return this.parStore.selected;
        }
        //footer:function(){
        //    return this.parStore.footer
        //},
    },
    watch: {
        selected: function selected(newvalue, old) {
            var _this2 = this;

            if (newvalue.length == 0 && old.length != 0) {
                this.$refs.e_table.clearSelection();
            } else {
                ex.each(old, function (row) {
                    if (newvalue.indexOf(row) == -1) {
                        _this2.$refs.e_table.toggleRowSelection(row, false);
                    }
                });
                ex.each(newvalue, function (row) {
                    if (old.indexOf(row) == -1) {
                        _this2.$refs.e_table.toggleRowSelection(row, true);
                    }
                });
            }
        }

    },

    mixins: [mix_table_data, mix_ele_table_adapter],
    template: '<div class="com-table-grid" style="position: absolute;top:0;left:0;bottom: 0;right:0;">\n        <el-table class="table flat-head" ref="e_table"\n                              :data="rows"\n                               border\n                              show-summary\n                              :row-class-name="tableRowClassName"\n                              :span-method="parStore.arraySpanMethod"\n                              :fit="false"\n                              :stripe="true"\n                              :default-sort=\'default_sort\'\n                              size="mini"\n                              height="100%"\n                              style="width: 100%"\n                              @header-dragend="on_header_dragend"\n                              @sort-change="on_sort_change($event)"\n                              @selection-change="parStore.handleSelectionChange"\n                              :summary-method="getSum">\n\n                        <el-table-column v-if="parStore.selectable"\n                                type="selection"\n                                width="50">\n                        </el-table-column>\n                        <template v-for="(head,index) in normed_heads">\n                             <el-table-column v-if="head.children"\n                                :label="head.label"\n                                :key="head.name"\n                                 :class-name="head.class">\n                                   <el-table-column v-for="head2 in name_in_list(head.children)"\n                                            :class-name="head2.class"\n                                            :key="head2.name"\n                                             :show-overflow-tooltip="parStore.is_show_tooltip(head2) "\n                                              :fixed="head2.fixed"\n                                             :label="head2.label"\n                                             :prop="head2.name.toString()"\n                                             :sortable="parStore.is_sort(head2)"\n                                             :sort-orders="[\'ascending\', \'descending\']"\n                                             :width="head2.width">\n                                        <template  slot-scope="scope">\n                                            <component :is="head2.editor"\n                                                        :key="head2.name"\n                                                       @on-custom-comp="on_td_event($event)"\n                                                       :row-data="scope.row" :field="head2.name" :index="scope.$index">\n                                            </component>\n\n                                        </template>\n\n                                    </el-table-column>\n                             </el-table-column>\n                            <el-table-column v-else-if="! head.sublevel && head.editor"\n                                              :class-name="head.class"\n                                              :key="head.name"\n                                             :show-overflow-tooltip="parStore.is_show_tooltip(head) "\n                                              :fixed="head.fixed"\n                                             :label="head.label"\n                                             :prop="head.name.toString()"\n                                             :sortable="parStore.is_sort(head)"\n                                             :sort-orders="[\'ascending\', \'descending\']"\n                                             :width="head.width">\n                                <template  slot-scope="scope">\n                                    <component :is="head.editor"\n                                               @on-custom-comp="on_td_event($event)"\n                                               :row-data="scope.row" :field="head.name" :index="scope.$index">\n                                    </component>\n\n                                </template>\n\n                            </el-table-column>\n                              <el-table-column v-else-if="! head.sublevel"\n                                             :show-overflow-tooltip="parStore.is_show_tooltip(head) "\n                                             :fixed="head.fixed"\n                                             :key="head.name"\n                                             :class-name="head.class"\n                                             :prop="head.name.toString()"\n                                             :label="head.label"\n                                             :sortable="parStore.is_sort(head)"\n                                             :sort-orders="[\'ascending\', \'descending\']"\n                                             :width="head.width">\n                            </el-table-column>\n\n                        </template>\n                    </el-table>\n                    </div>',
    methods: {
        getSum: function getSum(param) {
            var _this3 = this;

            var footer = [];
            if (this.parStore.selectable) {
                footer.push(this.parStore.footer._label || '');
            }
            ex.each(this.normed_heads, function (head) {
                if (head.children) {
                    var subheads = _this3.name_in_list(head.children);
                    ex.each(subheads, function (subhead) {
                        if (_this3.parStore.footer[subhead.name] != undefined) {
                            footer.push(_this3.parStore.footer[subhead.name]);
                        } else {
                            footer.push('');
                        }
                    });
                } else if (!head.sublevel) {
                    if (_this3.parStore.footer[head.name] != undefined) {
                        footer.push(_this3.parStore.footer[head.name]);
                    } else {
                        footer.push('');
                    }
                }
            });
            return footer;
        },
        on_header_dragend: function on_header_dragend(newWidth, oldWidth, column, event) {
            this.parStore.$emit('header-dragend', { newWidth: newWidth, oldWidth: oldWidth, column: column, event: event });

            if (this.parStore.advise_heads && this.parStore.advise_heads.length > 0) {
                var key = '_table_settings_' + this.parStore.director_name;
                var setting_str = localStorage.getItem(key);
                var setting_obj = JSON.parse(setting_str);
                setting_obj.advise_width = setting_obj.advise_width || {};
                setting_obj.advise_width[column.property] = newWidth;
                localStorage.setItem(key, JSON.stringify(setting_obj));
            }
        },
        on_data_updated: function on_data_updated() {
            var _this4 = this;

            Vue.nextTick(function () {
                _this4.parStore.e_table.doLayout();
                //this.$refs.e_table.doLayout()
            });
        },
        on_sort_change: function on_sort_change(event) {
            if (this._sort_has_changed) {
                this.parStore.sortChange(event);
            } else if (event.order != this.default_sort.order || event.prop != this.default_sort.prop) {
                this._sort_has_changed = true;
                this.parStore.sortChange(event);
            }
        },

        name_in_list: function name_in_list(name_list) {

            return ex.filter(this.normed_heads, function (head) {
                return ex.isin(head.name, name_list);
            });
            //var heads_list = ex.filter(name_list,(name)=>{
            //   return ex.findone(this.normed_heads,{name:name})
            //})
            //var bb =  ex.map(heads_list,(name)=>{
            //    return this.keyed_heads[name]
            //})
            //return ex.filter(bb,(item)=>{
            //    return Boolean(item)
            //})
        },
        tableRowClassName: function tableRowClassName(_ref) {
            var row = _ref.row,
                rowIndex = _ref.rowIndex;

            var class_list = [];
            if (row._css_class) {
                clss_list.push(row._css_class);
            }
            if (ex.isin(row, this.selected)) {
                class_list.push('row-select');
            }
            return class_list.join(' ');
        },
        bus_search: function bus_search(search_args) {
            ex.assign(this.search_args, search_args);
            this.search();
        },
        on_td_event: function on_td_event(e) {
            var fun_name = e.fun || e.name; // 以后都用fun
            if (e.head && e.head.arg_filter) {
                var filter_fun = arg_filter[e.head.arg_filter];
                var normed_args = filter_fun(e.row, e.head);
                this.parStore[fun_name](normed_args);
            } else {
                this.parStore[fun_name](e);
            }
        }
    }
};
Vue.component('com-table-grid', ele_table);

var arg_filter = {
    field: function field(row, head) {
        return row[head.field];
    }
};

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(235);
__webpack_require__(247);
var ele_table = {
    props: ['ctx'],
    created: function created() {
        //this.bus.table = this

    },
    data: function data() {
        var parStore = ex.vueParStore(this);
        var keyed_heads = {};
        ex.each(parStore.heads, function (head) {
            keyed_heads[head.name] = head;
        });

        if (parStore.advise_heads && parStore.advise_heads.length > 0) {
            var key = '_table_settings_' + parStore.director_name;
            var setting_str = localStorage.getItem(key);
            if (setting_str) {
                var setting_obj = JSON.parse(setting_str);
                setting_obj.advise_width = setting_obj.advise_width || {};
                setting_obj.advise_order = setting_obj.advise_order || [];
                ex.each(parStore.heads, function (head) {
                    if (setting_obj.advise_width[head.name]) {
                        head.width = setting_obj.advise_width[head.name];
                    }
                });
            } else {
                var setting_obj = {
                    advise_heads: parStore.advise_heads,
                    advise_width: {},
                    advise_order: []
                };
                localStorage.setItem(key, JSON.stringify(setting_obj));
            }
            parStore.advise_heads = setting_obj.advise_heads;
            parStore.advise_width = setting_obj.advise_width || {};
            parStore.advise_order = setting_obj.advise_order || [];
        } else {
            parStore.advise_heads = [];
            parStore.advise_width = {};
            parStore.advise_order = [];
        }
        if (parStore.advise_order.length > 0) {
            parStore.heads = ex.sort_by_names(parStore.heads, parStore.advise_order, true);
        }

        return {
            parStore: parStore,
            heads: parStore.heads,
            keyed_heads: keyed_heads,
            //rows:this.parStore.rows,
            search_args: parStore.search_args,
            row_sort: parStore.row_sort
            //selectable:this.parStore.selectable,

        };
    },
    mounted: function mounted() {
        var _this = this;

        this.parStore.e_table = this.$refs.e_table;
        this.parStore.$on('data-updated-backend', this.on_data_updated);
        ex.each(this.parStore.heads, function (head) {
            if (head.style) {
                ex.append_css(head.style);
            }
        });
        ex.each(this.parStore.selected, function (row) {
            _this.parStore.e_table.toggleRowSelection(row);
        });
    },

    computed: {
        default_sort: function default_sort() {
            var sort_str = this.parStore.row_sort.sort_str;
            if (!sort_str) {
                return {};
            }
            var sort_list = sort_str.split(',');
            sort_str = sort_list[0];
            if (sort_str.startsWith('-')) {
                var prop = sort_str.slice(1);
                var order = 'descending';
            } else {
                var prop = sort_str;
                var order = 'ascending';
            }
            return { prop: prop, order: order };
        },
        normed_heads: function normed_heads() {
            var _this2 = this;

            var out_ls = [];
            if (this.parStore.advise_heads.length > 0) {
                var left_heads = ex.filter(this.parStore.heads, function (head) {
                    return ex.isin(head.name, _this2.parStore.advise_heads);
                });
            } else {
                var left_heads = this.parStore.heads;
            }

            ex.each(left_heads, function (head) {
                if (head.show) {
                    if (!ex.eval(head.show, { ps: _this2.parStore, vc: _this2, head: head })) {
                        return;
                    }
                }
                out_ls.push(head);
            });

            return out_ls;
        },

        rows: function rows() {
            return this.parStore.rows;
        },
        selected: function selected() {
            return this.parStore.selected;
        }
        //footer:function(){
        //    return this.parStore.footer
        //},
    },
    watch: {
        selected: function selected(newvalue, old) {
            var _this3 = this;

            if (newvalue.length == 0 && old.length != 0) {
                this.$refs.e_table.clearSelection();
            } else {
                ex.each(old, function (row) {
                    if (newvalue.indexOf(row) == -1) {
                        _this3.$refs.e_table.toggleRowSelection(row, false);
                    }
                });
                ex.each(newvalue, function (row) {
                    if (old.indexOf(row) == -1) {
                        _this3.$refs.e_table.toggleRowSelection(row, true);
                    }
                });
            }
        }

    },

    mixins: [mix_table_data, mix_ele_table_adapter],
    template: '<div class="com-table-rows com-table-grid" style="position: absolute;top:0;left:0;bottom: 0;right:0;">\n        <el-table class="table flat-head" ref="e_table"\n                              :data="rows"\n                               border\n                              show-summary\n                              :row-class-name="tableRowClassName"\n                              :span-method="parStore.arraySpanMethod"\n                              :fit="false"\n                              :stripe="true"\n                              :default-sort=\'default_sort\'\n                              size="mini"\n                              height="100%"\n                              style="width: 100%"\n                              @header-dragend="on_header_dragend"\n                              @sort-change="on_sort_change($event)"\n                              @selection-change="parStore.handleSelectionChange"\n                              :summary-method="getSum">\n\n                        <el-table-column v-if="parStore.selectable"\n                                type="selection"\n                                width="50">\n                        </el-table-column>\n                        <template v-for="(head,index) in normed_heads">\n                             <el-table-column v-if="head.children"\n                                :label="head.label"\n                                :key="head.name"\n                                 :class-name="head.class">\n                                   <el-table-column v-for="head2 in name_in_list(head.children)"\n                                            :class-name="head2.class"\n                                            :key="head2.name"\n                                             :show-overflow-tooltip="parStore.is_show_tooltip(head2) "\n                                              :fixed="head2.fixed"\n                                             :label="head2.label"\n                                             :prop="head2.name.toString()"\n                                             :sortable="parStore.is_sort(head2)"\n                                             :sort-orders="[\'ascending\', \'descending\']"\n                                             :width="head2.width">\n                                        <template  slot-scope="scope">\n                                            <component :is="head2.editor"\n                                                        :key="head2.name"\n                                                       @on-custom-comp="on_td_event($event)"\n                                                       :row-data="scope.row" :field="head2.name" :index="scope.$index">\n                                            </component>\n\n                                        </template>\n\n                                    </el-table-column>\n                             </el-table-column>\n                            <el-table-column v-else-if="! head.sublevel && head.editor"\n                                              :class-name="head.class"\n                                              :key="head.name"\n                                             :show-overflow-tooltip="parStore.is_show_tooltip(head) "\n                                              :fixed="head.fixed"\n                                             :label="head.label"\n                                             :prop="head.name.toString()"\n                                             :sortable="parStore.is_sort(head)"\n                                             :sort-orders="[\'ascending\', \'descending\']"\n                                             :width="head.width">\n                                <template  slot-scope="scope">\n                                    <component :is="head.editor"\n                                               @on-custom-comp="on_td_event($event)"\n                                               :row-data="scope.row" :field="head.name" :index="scope.$index">\n                                    </component>\n\n                                </template>\n\n                            </el-table-column>\n                              <el-table-column v-else-if="! head.sublevel"\n                                             :show-overflow-tooltip="parStore.is_show_tooltip(head) "\n                                             :fixed="head.fixed"\n                                             :key="head.name"\n                                             :class-name="head.class"\n                                             :prop="head.name.toString()"\n                                             :label="head.label"\n                                             :sortable="parStore.is_sort(head)"\n                                             :sort-orders="[\'ascending\', \'descending\']"\n                                             :width="head.width">\n                            </el-table-column>\n\n                        </template>\n                    </el-table>\n                    </div>',
    methods: {
        getSum: function getSum(param) {
            var _this4 = this;

            var footer = [];
            if (this.parStore.selectable) {
                footer.push(this.parStore.footer._label || '');
            }
            ex.each(this.normed_heads, function (head) {
                if (head.children) {
                    var subheads = _this4.name_in_list(head.children);
                    ex.each(subheads, function (subhead) {
                        if (_this4.parStore.footer[subhead.name] != undefined) {
                            footer.push(_this4.parStore.footer[subhead.name]);
                        } else {
                            footer.push('');
                        }
                    });
                } else if (!head.sublevel) {
                    if (_this4.parStore.footer[head.name] != undefined) {
                        footer.push(_this4.parStore.footer[head.name]);
                    } else {
                        footer.push('');
                    }
                }
            });
            return footer;
        },
        on_header_dragend: function on_header_dragend(newWidth, oldWidth, column, event) {
            this.parStore.$emit('header-dragend', { newWidth: newWidth, oldWidth: oldWidth, column: column, event: event });

            if (this.parStore.advise_heads && this.parStore.advise_heads.length > 0) {
                var key = '_table_settings_' + this.parStore.director_name;
                var setting_str = localStorage.getItem(key);
                var setting_obj = JSON.parse(setting_str);
                setting_obj.advise_width = setting_obj.advise_width || {};
                setting_obj.advise_width[column.property] = newWidth;
                localStorage.setItem(key, JSON.stringify(setting_obj));
            }
        },
        on_data_updated: function on_data_updated() {
            var _this5 = this;

            Vue.nextTick(function () {
                //this.$refs.e_table.doLayout()
                _this5.parStore.e_table.doLayout();
            });
        },
        on_sort_change: function on_sort_change(event) {
            if (this._sort_has_changed) {
                this.parStore.sortChange(event);
            } else if (event.order != this.default_sort.order || event.prop != this.default_sort.prop) {
                this._sort_has_changed = true;
                this.parStore.sortChange(event);
            }
        },

        name_in_list: function name_in_list(name_list) {

            return ex.filter(this.normed_heads, function (head) {
                return ex.isin(head.name, name_list);
            });
            //var heads_list = ex.filter(name_list,(name)=>{
            //   return ex.findone(this.normed_heads,{name:name})
            //})
            //var bb =  ex.map(heads_list,(name)=>{
            //    return this.keyed_heads[name]
            //})
            //return ex.filter(bb,(item)=>{
            //    return Boolean(item)
            //})
        },
        tableRowClassName: function tableRowClassName(_ref) {
            var row = _ref.row,
                rowIndex = _ref.rowIndex;

            var class_list = [];
            if (row._css_class) {
                clss_list.push(row._css_class);
            }
            if (ex.isin(row, this.selected)) {
                class_list.push('row-select');
            }
            return class_list.join(' ');
        },
        bus_search: function bus_search(search_args) {
            ex.assign(this.search_args, search_args);
            this.search();
        },
        on_td_event: function on_td_event(e) {
            var fun_name = e.fun || e.name; // 以后都用fun
            if (e.head && e.head.arg_filter) {
                var filter_fun = arg_filter[e.head.arg_filter];
                var normed_args = filter_fun(e.row, e.head);
                this.parStore[fun_name](normed_args);
            } else {
                this.parStore[fun_name](e);
            }
        }
    }
};
Vue.component('com-table-rows', ele_table);

var arg_filter = {
    field: function field(row, head) {
        return row[head.field];
    }
};

Vue.component('com-element-table-colomu', {
    props: ['head'],
    data: function data() {
        var self = this;
        return {
            parStore: ex.vueParStore(self)
        };
    },
    template: '<template >\n\n                            <el-table-column v-if="head.editor"\n                                             :show-overflow-tooltip="parStore.is_show_tooltip(head) "\n                                              :fixed="head.fixed"\n                                             :label="head.label"\n                                             :prop="head.name.toString()"\n                                             :sortable="parStore.is_sort(head)"\n                                             :sort-orders="[\'ascending\', \'descending\']"\n                                             :width="head.width">\n                                <template slot-scope="scope">\n                                    <component :is="head.editor"\n                                               @on-custom-comp="on_td_event($event)"\n                                               :row-data="scope.row" :field="head.name" :index="scope.$index">\n                                    </component>\n\n                                </template>\n\n                            </el-table-column>\n\n                            <el-table-column v-else\n                                             :show-overflow-tooltip="parStore.is_show_tooltip(head) "\n                                             :fixed="head.fixed"\n                                             :prop="head.name.toString()"\n                                             :label="head.label"\n                                             :sortable="parStore.is_sort(head)"\n                                             :sort-orders="[\'ascending\', \'descending\']"\n                                             :width="head.width">\n                            </el-table-column>\n\n         </template>\n    '
});

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var op_a = {
    props: ['head', 'disabled'],
    template: ' <div class="com-op-table-refresh" style="display: inline-block;margin: 0 1px 0 3px">\n        <select v-model=\'myvalue\' class="form-control input-sm com-filter-select" >\n         <option class="fake-placeholder"  value="" v-text=\'head.label\' ></option>\n        <option v-for=\'option in head.options\' :value="option.value" v-text=\'option.label\'></option>\n    </select>\n    </div>',
    data: function data() {
        var parStore = ex.vueParStore(this);
        return {
            myvalue: this.head.init_value || '',
            parStore: parStore
        };
    },
    computed: {},
    watch: {
        myvalue: function myvalue(v) {
            var _this = this;

            debugger;
            if (this.interval_index) {
                clearInterval(this.interval_index);
            }

            if (v) {
                setInterval(function () {
                    ex.eval(_this.head.action, { ps: _this.parStore });
                }, v);
            }
        }
    },
    methods: {}
};
Vue.component('com-op-table-refresh', op_a);

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var group_check = {
    props: ['head', 'disabled'],
    template: ' <div class="com-table-op-group-check" style="margin-left: 3px">\n    <el-checkbox-group v-model="myvalue" size="small">\n      <el-checkbox-button v-for="option in head.options" :label="option.value"  :key="option.value">\n        <span v-text="option.label"></span>\n      </el-checkbox-button>\n    </el-checkbox-group>\n    <!--<button :class="norm_class" @click="operation_call()"  :style="head.style" :disabled="disabled">-->\n        <!--<i v-if="head.icon" :class=\'["fa",head.icon]\'></i>-->\n        <!--<span  v-text="head.label"></span>-->\n    <!--</button>-->\n    </div>',
    data: function data() {
        var parStore = ex.vueParStore(this);
        return {
            myvalue: this.head.init_value || [],
            enable: true,
            parStore: parStore
        };
    },
    computed: {
        norm_class: function norm_class() {
            if (this.head.class) {
                return 'btn btn-sm ' + this.head.class;
            } else {
                return 'btn btn-sm btn-default';
            }
        }
    },
    watch: {
        myvalue: function myvalue(newvalue, oldvalue) {
            ex.eval(this.head.action, { value: newvalue, ps: this.parStore });
        }
    },
    methods: {
        operation_call: function operation_call() {
            if (this.head.action) {
                if (this.head.row_match && !this.parStore.check_selected(this.head)) {
                    return;
                }
                ex.eval(this.head.action, { ps: this.parStore, head: this.head, self: this });
            } else {
                this.$emit('operation', this.head.name || this.head.fun);
            }
        },
        set_enable: function set_enable(yes) {
            this.enable = yes;
        }
    }
};
Vue.component('com-table-op-group-check', group_check);

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(248);

Vue.component('com-table-layout-picture-grid', {
    template: '<div class="com-table-layout-picture-grid">\n    <div class="item" v-for="row in parStore.rows">\n\n        <div class="main-img" >\n            <img  :src="row.image_url" alt="">\n        </div>\n\n        <input type="checkbox"  :value="row" v-model="parStore.selected">\n        <span :class="{clickable:has_action}" v-text="row.image_title" @click="on_click(row)"></span>\n    </div>\n    </div>',
    data: function data() {
        return {
            parStore: ex.vueParStore(this)
        };
    },
    mounted: function mounted() {},

    computed: {
        has_action: function has_action() {
            return this.parStore.head.title_click;
        }
    },
    methods: {
        //is_select(row){
        //    return ex.isin(row,this.parStore.selected)
        //},
        //toggle_row(row){
        //    if(ex.isin(row,this.parStore.selected)){
        //        ex.remove(this.parStore.selected,row)
        //    }else{
        //        this.parStore.selected.push(row)
        //    }
        //},
        on_click: function on_click(row) {
            var ctx = this.parStore.head;
            if (ctx.title_click) {
                ex.eval(ctx.title_click, { row: row, ctx: ctx, ps: this.parStore });
            }
        }
    }
});

/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(249);

var tab_chart = {
    props: ['tab_head', 'par_row'],
    data: function data() {
        var vc = this;
        var heads_ctx = this.tab_head.table_ctx;
        var my_table_store = {
            data: function data() {
                return {
                    head: heads_ctx,
                    heads: heads_ctx.heads,
                    row_filters: heads_ctx.row_filters,
                    row_sort: heads_ctx.row_sort,
                    director_name: heads_ctx.director_name,
                    footer: heads_ctx.footer || [],
                    ops: heads_ctx.ops || [],
                    rows: [],
                    row_pages: {},
                    selectable: heads_ctx.selectable == undefined ? true : heads_ctx.selectable,
                    advise_heads: heads_ctx.advise_heads || [],
                    selected: [],
                    del_info: [],
                    search_args: {},
                    vc: vc,
                    parStore: ex.vueParStore(vc),
                    after_get_rows: heads_ctx.after_get_rows,
                    option: heads_ctx.option || {}
                };
            },
            mixins: [table_store],
            methods: {
                switch_to_tab: function switch_to_tab(kws) {
                    if (window.root_live) {
                        table_store.methods.switch_to_tab(kws);
                    } else {
                        this.parStore.switch_to_tab(kws);
                    }
                },
                getRows: function getRows() {
                    if (vc.tab_head.pre_set) {
                        var pre_set = ex.eval(vc.tab_head.pre_set, { par_row: vc.par_row, vc: vc, ps: this });
                        ex.assign(this.search_args, pre_set);
                    }
                    table_store.methods.getRows.call(this);
                }
            }
        };
        return {
            childStore: new Vue(my_table_store),
            parStore: ex.vueParStore(vc),
            loaded: false
        };
    },
    mounted: function mounted() {
        ex.vueEventRout(this, this.tab_head.event_slots);
        // 如果有复杂的需求，则被 table_store.init_express接管
        if (!this.childStore.head.init_express) {
            this.childStore.search();
        }
        if (this.tab_head.css) {
            ex.append_css(this.tab_head.css);
        }
    },

    methods: {},

    template: '<div class="com-tab-table com-tab-chart flex-v" style="position: absolute;top:0;left:0;bottom: 0;right:0;overflow: auto;padding-bottom: 1em;">\n       <div v-if="childStore.row_filters.length > 0" style="background-color: #fbfbf8;padding: 8px 1em;border-radius: 4px;margin-top: 8px">\n            <com-table-filters></com-table-filters>\n        </div>\n        <div  v-if="childStore.ops.length>0 ">\n            <com-table-operations></com-table-operations>\n        </div>\n\n        <div v-if="childStore.parents.length>0">\n            <com-table-parents></com-table-parents>\n        </div>\n\n        <div class="box box-success flex-v flex-grow" style="margin-bottom: 0">\n            <div class="table-wraper flex-grow" style="position: relative;">\n                <!--<com-table-rows></com-table-rows>-->\n                <div style="position: absolute;top:0;left:0;bottom: 0;right:0;overflow-y: auto">\n                       <div class="statistic-panel" v-if="tab_head.foot_heads">\n                    <label class="title-label" v-text="childStore.footer._label"></label>\n                        <div class="foot-item" v-for="head in tab_head.foot_heads">\n                            <span v-text="childStore.footer[head.name]"></span><br>\n                            <span v-text="head.label"></span>\n                        </div>\n                    </div>\n\n                    <div class="chart-panel">\n                        <component :class="tab_head.chart_class"  v-for="head in tab_head.chart_heads" :is="head.editor" :ctx="head"></component>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <!--<div style="background-color: white;">-->\n            <!--<com-table-pagination></com-table-pagination>-->\n        <!--</div>-->\n    </div>'
};

Vue.component('com-tab-chart', function (resolve, reject) {
    ex.load_js(js_config.js_lib.echarts).then(function () {
        resolve(tab_chart);
    });
});

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(236);

var tab_fields = {
    props: ['tab_head', 'par_row'],
    data: function data() {
        var data_row = this.tab_head.row || {};
        var self = this;
        var childStore = new Vue({
            data: {
                vc: self
            }
        });
        var parStore = ex.vueParStore(this);

        return {
            head: this.tab_head,
            heads: this.tab_head.heads || this.tab_head.fields_ctx.heads,
            ops: this.tab_head.ops || this.tab_head.fields_ctx.ops,
            errors: {},
            row: data_row,
            org_row: data_row,
            childStore: childStore,
            parStore: parStore
        };
    },
    mixins: [mix_fields_data, mix_nice_validator],
    template: '<div class="com-tab-fields flex-v"  style="position: absolute;top:0;left:0;bottom: 0;right:0;overflow: auto;">\n\n   <div class="oprations" >\n        <component v-for="op in ops" :is="op.editor" :ref="\'op_\'+op.name" :head="op" @operation="on_operation(op)"></component>\n    </div>\n    <div style="overflow: auto;" class="flex-grow fields-area">\n        <div v-if="heads[0].name !=\'_meta_head\'" class=\'field-panel suit\' id="form" >\n            <field  v-for=\'head in normed_heads\' :key="head.name" :head="head" :row=\'row\'></field>\n        </div>\n        <template v-else>\n               <div v-if="heads[0].fields_group" :class="heads[0].class">\n                    <div v-for="group in heads[0].fields_group" :class="\'group_\'+group.name">\n                        <div class="fields-group-title" v-html="group.label"></div>\n                        <com-fields-table-block v-if="heads[0].table_grid"\n                            :heads="group_filter_heads(group)" :meta-head="heads[0]" :row="row">\n                            </com-fields-table-block>\n                         <div v-else class=\'field-panel suit\' id="form" >\n                            <field  v-for=\'head in group_filter_heads(group)\' :key="head.name" :head="head" :row=\'row\'></field>\n                       </div>\n                    </div>\n                </div>\n                <div v-else :class="heads[0].class">\n                    <com-fields-table-block v-if="heads[0].table_grid"\n                        :heads="normed_heads.slice(1)" :row="row" :metaHead="heads[0]"></com-fields-table-block>\n                </div>\n        </template>\n\n\n    </div>\n    </div>',

    //created:function(){
    //    // find head from parent table
    //    var table_par = this.$parent
    //    while (true){
    //        if (table_par.heads){
    //            break
    //        }
    //        table_par = table_par.$parent
    //        if(!table_par){
    //            break
    //        }
    //    }
    //    this.table_par = table_par
    //},

    mounted: function mounted() {
        if (this.heads[0] && this.heads[0].name == '_meta_head' && this.heads[0].style) {
            ex.append_css(this.heads[0].style);
        }
        if (!this.tab_head.row) {
            this.get_data();
        }
        ex.vueEventRout(this, this.tab_head.event_slots);
    },

    methods: {
        back: function back() {
            this.parStore.pop_tab_stack();
        },

        group_filter_heads: function group_filter_heads(group) {
            return ex.filter(this.normed_heads, function (head) {
                return ex.isin(head.name, group.head_names);
            });
        },
        data_getter: function data_getter() {
            var self = this;
            // 兼容老调用,废弃  现在用 init_express 来初始化
            if (self.tab_head.get_data) {
                var fun = get_data[self.tab_head.get_data.fun];
                var kws = self.tab_head.get_data.kws;
                fun(self, function (row) {
                    self.org_row = row;
                    self.row = ex.copy(row);
                    self.childStore.$emit('row.update_or_insert', row);
                }, kws);
            }
            //if(self.tab_head.get_row){
            //    ex.eval(self.tab_head.get_row,{vc:self})
            //}
        },
        after_save: function after_save(new_row) {
            // 为了兼容 老的 版本，才留下 这个 after-save TODO 移除老系统调用后，删除这个函数
            if (this.tab_head.after_save) {
                if (typeof this.tab_head.after_save == 'string') {
                    ex.eval(this.tab_head.after_save, { vc: this });
                } else {
                    // 为了兼容老的
                    if (this.tab_head.after_save) {
                        if (this.parStore) {
                            this.parStore.update_or_insert(new_row);
                        }
                    }
                    ex.vueAssign(this.org_row, new_row);
                }
            }
            // 老的调用名字，新的后端调用名全部用 after_save
            else if (this.tab_head.after_save_express) {
                    ex.eval(this.tab_head.after_save_express, { vc: this });
                } else {
                    // 默认
                    this.parStore.update_or_insert(new_row);
                }
        }
        // data_getter  回调函数，获取数据,


    } };

Vue.component('com-tab-fields', tab_fields);

var get_data = {
    get_row: function get_row(self, callback, kws) {
        //kws={model_name ,relat_field}
        var director_name = kws.director_name;
        var relat_field = kws.relat_field;
        var dt = { director_name: director_name };
        dt[relat_field] = self.par_row[relat_field];
        //var post_data=[dt]
        cfg.show_load();
        ex.director_call('d.get_row?dname=' + director_name, dt).then(function (resp) {
            cfg.hide_load();
            callback(resp);
        });
        //$.post('/d/ajax',JSON.stringify(post_data),function(resp){
        //    cfg.hide_load()
        //    callback(resp.get_row)
        //})
    },
    table_row: function table_row(self, callback, kws) {
        callback(self.par_row);
    }
};

var after_save = {
    update_or_insert: function update_or_insert(self, new_row, kws) {
        var old_row = self.old_row;
        var parStore = ex.vueParStore(self);
        parStore.update_or_insert(new_row, old_row);
        // 要update_or_insert ，证明一定是 更新了 par_row
        //ex.vueAssign(self.par_row,new_row)
        //self.$emit('tab-event',{name:'update_or_insert',new_row:self.par_row,old_row:old_row})
    },
    do_nothing: function do_nothing(self, new_row, kws) {},

    update_par_row_from_db: function update_par_row_from_db(self, new_row, kws) {
        //
        var post_data = [{ fun: 'get_row', director_name: self.par_row._director_name, pk: self.par_row.pk }];
        ex.post('/d/ajax', JSON.stringify(post_data), function (resp) {
            ex.vueAssign(self.par_row, resp.get_row);
        });
    }
};

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var tab_fields = {
    props: ['tab_head', 'par_row'],
    data: function data() {
        var ctx = this.tab_head.fields_ctx;
        ex.assign(ctx, {
            par_row: this.par_row,
            init_express: this.tab_head.init_express
        });
        return {
            ctx: ctx
        };
    },

    template: '<div class="com-tab-fields">\n    <com-form-one :ctx="ctx"></com-form-one>\n    </div>'
};

Vue.component('com-tab-fields-v1', tab_fields);

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
* 用于封装延迟加载的tab页面
* */
var lazy_wrap = {
    props: ['tab_head', 'par_row'],

    mounted: function mounted() {
        if (this.tab_head.lazy_init) {
            ex.eval(this.tab_head.lazy_init, { head: this.tab_head });
        }
    },

    template: '<div class="com-tab-lazy-wrap">\n    </div>'
};

Vue.component('com-tab-lazy-wrap', lazy_wrap);

/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var tab_table = {
    props: ['tab_head', 'par_row'],
    data: function data() {
        var vc = this;
        var heads_ctx = this.tab_head.table_ctx;
        var my_table_store = {
            data: function data() {
                return {
                    head: heads_ctx,
                    heads: heads_ctx.heads,
                    row_filters: heads_ctx.row_filters,
                    row_sort: heads_ctx.row_sort,
                    director_name: heads_ctx.director_name,
                    footer: heads_ctx.footer || [],
                    ops: heads_ctx.ops || [],
                    rows: [],
                    row_pages: {},
                    selectable: heads_ctx.selectable == undefined ? true : heads_ctx.selectable,
                    advise_heads: heads_ctx.advise_heads || [],
                    selected: [],
                    del_info: [],
                    search_args: {},
                    vc: vc,
                    parStore: ex.vueParStore(vc)
                };
            },
            mixins: [table_store],
            watch: {
                search_args: function search_args(v) {
                    console.log(v);
                }
            },
            methods: {
                switch_to_tab: function switch_to_tab(kws) {
                    if (window.root_live) {
                        table_store.methods.switch_to_tab(kws);
                    } else {
                        this.parStore.switch_to_tab(kws);
                    }
                },
                getRows: function getRows() {
                    if (vc.tab_head.pre_set) {
                        var pre_set = ex.eval(vc.tab_head.pre_set, { par_row: vc.par_row, vc: vc, ps: this });
                        ex.assign(this.search_args, pre_set);
                    } else if (vc.tab_head.tab_field) {
                        // 下面是老的调用，
                        this.search_args[vc.tab_head.tab_field] = vc.par_row[vc.tab_head.par_field];
                    } else if (vc.tab_head.par_field) {
                        this.search_args[vc.tab_head.par_field] = vc.par_row[vc.tab_head.par_field];
                    }
                    table_store.methods.getRows.call(this);
                }
            }
        };
        return {
            childStore: new Vue(my_table_store),
            parStore: ex.vueParStore(vc),
            loaded: false
        };
    },
    mounted: function mounted() {
        ex.vueEventRout(this, this.tab_head.event_slots);
        // 如果有复杂的需求，则被 table_store.init_express接管
        if (!this.childStore.head.init_express) {
            this.childStore.search();
        }
    },

    methods: {
        on_show: function on_show() {
            // 如果有复杂的需求，则被 table_store.init_express接管
            //if(this.childStore.head.init_express){
            //    return
            //}
            //// TODO 下面的加载方式可能不需要了，因为tab是lazy加载,在mounted hook函数中可以达到同样功能，后面需要花时间移除该函数
            //if(! this.loaded ){
            //    this.childStore.search()
            //    this.loaded=true
            //}
        }
    },

    template: '<div class="com-tab-table flex-v" style="position: absolute;top:0;left:0;bottom: 0;right:0;overflow: auto;padding-bottom: 1em;">\n       <div v-if="childStore.row_filters.length > 0" style="background-color: #fbfbf8;padding: 8px 1em;border-radius: 4px;margin-top: 8px">\n            <com-table-filters></com-table-filters>\n        </div>\n        <div  v-if="childStore.ops.length>0 ">\n            <com-table-operations></com-table-operations>\n        </div>\n\n        <div v-if="childStore.parents.length>0">\n            <com-table-parents></com-table-parents>\n        </div>\n\n        <!--<ol v-if="parents.length>0" class="breadcrumb jb-table-parent">-->\n            <!--<li v-for="par in parents"><a href="#" @click="get_childs(par)"  v-text="par.label"></a></li>-->\n        <!--</ol>-->\n\n        <div class="box box-success flex-v flex-grow" style="margin-bottom: 0">\n            <div class="table-wraper flex-grow" style="position: relative;">\n                <com-table-rows></com-table-rows>\n               </div>\n        </div>\n        <div style="background-color: white;">\n            <com-table-pagination></com-table-pagination>\n        </div>\n    </div>'
};

Vue.component('com-tab-table', tab_table);

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var tab_table_type = {
    props: ['tab_head', 'par_row'],
    data: function data() {
        var vc = this;
        var heads_ctx = this.tab_head.table_ctx;
        var my_table_store = {
            data: function data() {
                return {
                    head: heads_ctx,
                    heads: heads_ctx.heads,
                    row_filters: heads_ctx.row_filters,
                    row_sort: heads_ctx.row_sort,
                    director_name: heads_ctx.director_name,
                    footer: heads_ctx.footer || [],
                    ops: heads_ctx.ops || [],
                    rows: [],
                    row_pages: {},
                    selectable: heads_ctx.selectable == undefined ? true : heads_ctx.selectable,
                    advise_heads: heads_ctx.advise_heads || [],
                    selected: [],
                    del_info: [],
                    search_args: {},
                    vc: vc,
                    parStore: ex.vueParStore(vc)
                };
            },
            mixins: [table_store],
            methods: {
                switch_to_tab: function switch_to_tab(kws) {
                    if (window.root_live) {
                        table_store.methods.switch_to_tab(kws);
                    } else {
                        this.parStore.switch_to_tab(kws);
                    }
                },
                getRows: function getRows() {
                    if (vc.tab_head.pre_set) {
                        var pre_set = ex.eval(vc.tab_head.pre_set, { par_row: vc.par_row, vc: vc, ps: this });
                        ex.assign(this.search_args, pre_set);
                    }
                    table_store.methods.getRows.call(this);
                }
            }
        };
        return {
            childStore: new Vue(my_table_store),
            parStore: ex.vueParStore(vc),
            loaded: false
        };
    },
    mounted: function mounted() {
        ex.vueEventRout(this, this.tab_head.event_slots);
        // 如果有复杂的需求，则被 table_store.init_express接管
        if (!this.childStore.head.init_express) {
            this.childStore.search();
        }
    },

    methods: {},

    template: '<div class="com-tab-table flex-v" style="position: absolute;top:0;left:0;bottom: 0;right:0;overflow: auto;padding-bottom: 1em;">\n       <div v-if="childStore.row_filters.length > 0" style="background-color: #fbfbf8;padding: 8px 1em;border-radius: 4px;margin-top: 8px">\n            <com-table-filters></com-table-filters>\n        </div>\n        <div  v-if="childStore.ops.length>0 ">\n            <com-table-operations></com-table-operations>\n        </div>\n\n        <div v-if="childStore.parents.length>0">\n            <com-table-parents></com-table-parents>\n        </div>\n\n        <div class="box box-success flex-v flex-grow" style="margin-bottom: 0">\n            <div class="table-wraper flex-grow" style="position: relative;">\n                <!--<com-table-rows></com-table-rows>-->\n                 <component :is="tab_head.inn_editor"></component>\n            </div>\n        </div>\n        <div style="background-color: white;">\n            <com-table-pagination></com-table-pagination>\n        </div>\n    </div>'
};

Vue.component('com-tab-table-type', tab_table_type);

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-field-ele-tree-name-layer {\n  min-width: 20em;\n  border: 1px solid #b1b1b1; }\n  .com-field-ele-tree-name-layer .el-tree {\n    min-height: 20em; }\n  .com-field-ele-tree-name-layer .el-input input.el-input__inner[type=text] {\n    width: inherit !important; }\n", ""]);

// exports


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".file-uploader .item img {\n  max-width: 300px;\n  cursor: pointer; }\n\n.file-uploader .wrap {\n  display: inline-block; }\n\n.file-uploader .sortable {\n  display: flex;\n  flex-wrap: wrap; }\n  .file-uploader .sortable li {\n    display: block;\n    margin: 0.5em;\n    padding: 0.3em;\n    position: relative; }\n    .file-uploader .sortable li:hover .remove-btn {\n      visibility: visible; }\n    .file-uploader .sortable li .file-wrap {\n      width: 10em;\n      height: 12em;\n      border: 2em solid #68abff;\n      text-align: center;\n      padding: 1em 0;\n      background-color: white;\n      box-shadow: 10px 10px 5px #888888;\n      color: #68abff;\n      display: table-cell;\n      vertical-align: middle;\n      cursor: pointer; }\n      .file-uploader .sortable li .file-wrap .file-type {\n        font-size: 250%;\n        font-weight: 700;\n        text-transform: uppercase; }\n\n.file-uploader .remove-btn {\n  font-size: 2em;\n  position: absolute;\n  top: -1em;\n  right: 0.3em;\n  visibility: hidden; }\n  .file-uploader .remove-btn i {\n    color: red; }\n\n.file-uploader-btn-plus {\n  display: inline-block;\n  vertical-align: top; }\n  .file-uploader-btn-plus .inn-btn {\n    width: 5em;\n    height: 5em;\n    display: table-cell;\n    text-align: center;\n    vertical-align: middle;\n    border: 1px solid #e1e1e1;\n    cursor: pointer; }\n    .file-uploader-btn-plus .inn-btn span {\n      font-size: 300%; }\n    .file-uploader-btn-plus .inn-btn:hover {\n      background-color: #e1e1e1; }\n", ""]);

// exports


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-field-phone-code input {\n  flex-grow: 10; }\n\n.com-field-phone-code button {\n  flex-grow: 0; }\n", ""]);

// exports


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".plain-field-panel .submit-block {\n  text-align: center;\n  margin-top: 2em; }\n  .plain-field-panel .submit-block .btn {\n    min-width: 10em; }\n", ""]);

// exports


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".sim-fields .table-fields {\n  width: 100%; }\n\n.sim-fields .field-label-td {\n  padding-right: 1em;\n  padding-bottom: 1em;\n  text-align: left; }\n\n.sim-fields .field-input-td {\n  padding-bottom: 1em; }\n\n.sim-fields .field-label {\n  text-align: left; }\n  .sim-fields .field-label .label-content {\n    max-width: 12rem;\n    word-break: break-all;\n    position: relative;\n    display: inline-block; }\n    .sim-fields .field-label .label-content .req_star {\n      top: -0.3em;\n      right: -0.6em; }\n\n.sim-fields .field-input {\n  text-align: left;\n  position: relative; }\n\n.sim-fields .help-text {\n  position: relative;\n  top: -2rem;\n  right: auto; }\n\n.sim-fields .submit-block {\n  margin-top: 1em;\n  text-align: left; }\n  .sim-fields .submit-block button {\n    min-width: 10em;\n    padding-left: 2em;\n    padding-right: 2em; }\n\n.sim-fields.no-label .field-label-td {\n  display: none; }\n\n.sim-fields.no-label .field-input {\n  width: 100%;\n  text-align: left; }\n\n.sim-fields.no-label .table-fields {\n  width: 100%; }\n\n.sim-fields.no-label .submit-block {\n  margin-top: 1em;\n  text-align: left; }\n  .sim-fields.no-label .submit-block button {\n    width: 100%; }\n\n.sim-fields.field-panel.pop {\n  padding-top: 8px; }\n  .sim-fields.field-panel.pop .field-input {\n    width: 20em; }\n  .sim-fields.field-panel.pop .submit-block {\n    margin-top: 10px; }\n    .sim-fields.field-panel.pop .submit-block button {\n      min-width: 8em; }\n\n.sim-fields.field-panel.mb {\n  padding: 1em; }\n  .sim-fields.field-panel.mb .field-label {\n    min-width: 5em;\n    text-align: right; }\n  .sim-fields.field-panel.mb .field-input {\n    width: auto; }\n  .sim-fields.field-panel.mb .submit-block {\n    margin-top: 10px; }\n    .sim-fields.field-panel.mb .submit-block button {\n      width: 100%; }\n", ""]);

// exports


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-head-dropdown-action {\n  display: inline-block;\n  min-width: 8em;\n  text-align: center; }\n", ""]);

// exports


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "@media (max-width: 900px) {\n  /*.small-link{*/\n  /*.item{*/\n  /*display: block;*/\n  /*color:white;*/\n  /*margin: 0.6em 1.2em;*/\n  /*a{*/\n  /*color: white;*/\n  /*}*/\n  /*.space{*/\n  /*display: none;*/\n  /*}*/\n  /*}*/\n  /*}*/ }\n\n.small-link.vertical .item {\n  display: block;\n  color: white;\n  margin: 0.6em 1.2em; }\n  .small-link.vertical .item a {\n    color: white; }\n  .small-link.vertical .item .space {\n    display: none; }\n", ""]);

// exports


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-form-one {\n  height: 100%; }\n  .com-form-one .oprations {\n    padding: 5px 10px; }\n  .com-form-one .oprations.bottom {\n    text-align: right;\n    border-top: 1px solid #d7d7d7; }\n  .com-form-one .table-fields {\n    border: 1px solid #efefef;\n    background-color: #f8f8f8;\n    margin: 5px 15px;\n    padding: 5px 30px; }\n  .com-form-one .fields-group-title {\n    margin: 10px 0; }\n", ""]);

// exports


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-widget-stack {\n  position: absolute;\n  bottom: 0;\n  top: 0;\n  left: 0;\n  right: 0; }\n", ""]);

// exports


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".table .el-table__row > td, .table tr > th, table.el-table__footer tr > td {\n  padding: 2px 0; }\n", ""]);

// exports


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-op-search {\n  display: inline-block; }\n", ""]);

// exports


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-op-switch {\n  display: inline-block; }\n", ""]);

// exports


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-fields-panel {\n  padding: 2rem;\n  border-radius: 0.3rem;\n  background-color: white; }\n", ""]);

// exports


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-html-content-panel {\n  padding: 4rem 3rem; }\n  .com-html-content-panel img {\n    max-width: 100%; }\n", ""]);

// exports


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-iframe-panel {\n  width: 100%;\n  height: 100%; }\n", ""]);

// exports


/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".el-select-dropdown {\n  z-index: 99891020 !important; }\n", ""]);

// exports


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".msg-hide .field .msg {\n  display: none; }\n\n.field .picture {\n  position: relative; }\n  .field .picture .msg-box {\n    position: absolute;\n    left: 260px; }\n", ""]);

// exports


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".active-tab-hightlight-top .el-tabs__item.is-top.is-active {\n  color: #3e8ebd; }\n\n.active-tab-hightlight-top .el-tabs__item.is-top.is-active:after {\n  content: '';\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  width: 100%;\n  height: 3px;\n  background-color: #3e8ebd; }\n\n.tab-full .el-tabs {\n  display: flex;\n  flex-direction: column;\n  height: 100%; }\n  .tab-full .el-tabs .el-tabs__content {\n    flex-grow: 10;\n    position: relative;\n    overflow: auto; }\n\nbody {\n  height: 100%; }\n", ""]);

// exports


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".table.flat-head th .cell {\n  white-space: nowrap; }\n", ""]);

// exports


/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".jb-table-parent {\n  margin-bottom: 0; }\n", ""]);

// exports


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".change-order .arrow {\n  cursor: pointer;\n  display: inline-block;\n  padding: 0.2em 0.6em; }\n\n.change-order .arrow:hover {\n  color: #00c000; }\n", ""]);

// exports


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-table-checkbox.dirty input {\n  background-color: yellow; }\n", ""]);

// exports


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".extra-click-plus .icon .item {\n  display: inline-block;\n  margin-right: 0.5em; }\n\n.extra-click-plus.mobile .item {\n  display: inline-block;\n  margin-left: 0.5rem;\n  margin-right: 0.5rem; }\n", ""]);

// exports


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-table-linetext.dirty input {\n  background-color: yellow; }\n", ""]);

// exports


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".el-dropdown-menu__item.crt-value {\n  background-color: #eaf8ff; }\n\n.com-table-select.dirty {\n  background-color: yellow; }\n", ""]);

// exports


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".dirty {\n  background-color: yellow; }\n", ""]);

// exports


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n.el-table .success {\n  background: #f0f9eb; }\n\n.el-table .row-select {\n  background-color: #ffe5d2; }\n  .el-table .row-select td:hover {\n    background: #ffe9eb; }\n\n.el-table--striped .el-table__body tr.el-table__row--striped.row-select td {\n  background: #ffe5d2; }\n\n.el-table--enable-row-hover .el-table__body tr.row-select:hover > td {\n  background: #ffe9eb; }\n\n.el-table__fixed {\n  /*由于element.table的bug造成固定列覆盖层 覆盖了滚动条，造成无法滚动。所以去掉覆盖层的事件获取能力，再加上内部元素的事件获取能力*/\n  pointer-events: none; }\n  .el-table__fixed * {\n    pointer-events: auto; }\n", ""]);

// exports


/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-tab-fields .oprations {\n  background: #fbfbf8;\n  padding: 0.2rem 1rem;\n  margin: 0.2rem 0;\n  border-bottom: 1px solid #cccccc; }\n\n.com-tab-fields .table-fields {\n  border: 1px solid #efefef;\n  background-color: #f8f8f8;\n  margin: 5px 15px;\n  padding: 10px 30px; }\n\n.fields-group-title {\n  padding: .3rem 0 .3rem 2rem;\n  font-weight: 700; }\n", ""]);

// exports


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-field-list-ctn {\n  display: flex;\n}\n.field-panel.suit .form-group.field .field_input .com-field-list-ctn .list-ctn-field {\n  position: relative;\n}\n.field-panel.suit .form-group.field .field_input .com-field-list-ctn .list-ctn-field .msg-box.n-right {\n  left: 0;\n  bottom: 0;\n  transform: translateX(0);\n}\n", ""]);

// exports


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-field-pop-tree-select .label-shower {\n  background-color: #fff;\n}\n", ""]);

// exports


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-field-range {\n  display: flex;\n  padding: 0 0 10px 0;\n}\n.com-field-range .el-date-editor.el-input {\n  width: auto;\n}\n.field-panel.suit .form-group.field .field_input .com-field-range input[type=text],\n.field-panel.suit .form-group.field .field_input .com-field-range input[type=number] {\n  width: 10em;\n}\n.field-panel.suit .form-group.field .field_input .com-field-range .range-field {\n  position: relative;\n}\n.field-panel.suit .form-group.field .field_input .com-field-range .range-field .msg-box.n-right {\n  left: 0;\n  bottom: 0;\n  transform: translateX(0);\n}\n", ""]);

// exports


/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-field-split-text .my-input-field {\n  min-width: 300px;\n  max-width: 500px;\n}\n", ""]);

// exports


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-fields-table-block.field-panel {\n  background-color: #fafafa;\n  padding: 5px 20px;\n  position: relative;\n  border: 1px solid #f6f6f6;\n}\n.com-fields-table-block.field-panel td {\n  padding: 8px 5px;\n  position: relative;\n}\n.com-fields-table-block.field-panel td .field-label {\n  text-align: right;\n}\n.com-fields-table-block .field-label {\n  display: flex;\n}\n.com-fields-table-block .field-label .label-content {\n  min-width: 4em;\n}\n.com-fields-table-block .field-label .req_star {\n  position: relative;\n  color: #f00;\n}\n.com-fields-table-block .field-input {\n  position: relative;\n  display: flex;\n}\n.com-fields-table-block .field-input .help-text {\n  display: inline-block;\n  padding: 0 3px;\n}\n.com-fields-table-block .field-input span.readonly-info {\n  background-color: #f5f5f5;\n  border: 1px solid #ebebeb;\n  color: #808080;\n  height: 30px;\n  display: inline-block;\n  padding: 3px;\n}\n", ""]);

// exports


/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-filter-datetime-range .el-input__inner {\n  width: 182px;\n}\n", ""]);

// exports


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-headbar-sys-link {\n  height: 100%;\n  padding: 15px;\n  line-height: 20px;\n  float: right;\n  color: #dcdcdc;\n}\n.com-headbar-sys-link.active {\n  color: #fdf7ff;\n  background-color: #980000;\n}\n.com-headbar-sys-link.active:hover {\n  background-color: #bd0000;\n}\n.com-headbar-sys-link:hover {\n  background: rgba(0,0,0,0.1);\n  color: #f6f6f6;\n}\n.com-headbar-sys-link.link:hover {\n  cursor: pointer;\n}\n.com-headbar-space {\n  display: inline-block;\n  float: right;\n  height: 10px;\n}\n", ""]);

// exports


/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-chart-plain {\n  border: 1px dashed #e5e5e5;\n  height: 400px;\n  width: 500px;\n  display: inline-block;\n}\n", ""]);

// exports


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-panel-table-setting .head-panel {\n  padding: 20px;\n}\n.com-panel-table-setting .mybtn-panel {\n  padding: 30px 50px;\n  text-align: right;\n}\n.com-panel-table-setting label[role=checkbox]:first-child {\n  margin-left: 10px;\n}\n", ""]);

// exports


/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".main-header {\n  z-index: 900;\n}\n.input-group .input-group-addon {\n  background-color: #eee;\n}\n", ""]);

// exports


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-table-icon-cell .icon-item {\n  display: inline-block;\n  padding: 2px;\n}\n.com-table-icon-cell .icon-item img {\n  height: 14px;\n}\n", ""]);

// exports


/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-field-multi-row .myrow:not(:last-child):after {\n  content: '';\n  display: block;\n  width: 100%;\n  height: 0;\n  border-bottom: 1px solid #e2e2e2;\n  left: 0;\n  position: absolute;\n}\n.com-field-multi-row div.myrow {\n  padding: 5px 0;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n.com-field-multi-row div.myrow span {\n  display: inline-block;\n  height: 1em;\n}\n", ""]);

// exports


/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-table-rows .middle-col {\n  text-align: center !important;\n}\n.com-table-rows .btn-like-col .com-table-rich-span {\n  border-radius: 3px;\n  font-size: 80%;\n  display: inline-block;\n  height: 16px;\n  padding: 0 5px;\n  line-height: 16px;\n  min-width: 40px;\n}\n.com-table-rows .btn-like-col .com-table-rich-span.warning {\n  color: #fff;\n  background-color: #f56d6d;\n}\n.com-table-rows .btn-like-col .com-table-rich-span.success {\n  color: #fff;\n  background-color: #3db035;\n}\n.com-table-rows .btn-like-col .com-table-rich-span.primary {\n  color: #fff;\n  background-color: #499cff;\n}\n.com-table-rows .btn-like-col .com-table-rich-span.ignore {\n  color: #f0f0f0;\n  background-color: #909399;\n}\n", ""]);

// exports


/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-table-layout-picture-grid {\n  background-color: #e7e7e7;\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  bottom: 0px;\n  right: 0px;\n  overflow: auto;\n}\n.com-table-layout-picture-grid .item {\n  display: inline-block;\n  background-color: #fff;\n  margin: 20px;\n  vertical-align: top;\n  padding: 10px;\n}\n.com-table-layout-picture-grid .main-img {\n  position: relative;\n  width: 180px;\n  height: 220px;\n  background-size: cover;\n  text-align: center;\n  padding: 10px;\n}\n.com-table-layout-picture-grid .main-img img {\n  max-height: 100%;\n  max-width: 100%;\n}\n", ""]);

// exports


/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".com-tab-chart .box {\n  background-color: #ecf0f5;\n}\n.com-tab-chart .statistic-panel,\n.com-tab-chart .chart-panel {\n  margin: 20px;\n  padding: 20px;\n  background-color: #fff;\n  position: relative;\n}\n.com-tab-chart .statistic-panel .title-label,\n.com-tab-chart .chart-panel .title-label {\n  position: absolute;\n  top: 5px;\n  left: 5px;\n}\n.com-tab-chart .statistic-panel .foot-item,\n.com-tab-chart .chart-panel .foot-item {\n  display: inline-block;\n  margin: 2rem;\n  width: 20rem;\n  padding-bottom: 1rem;\n  text-align: center;\n  border-bottom: 1px solid #dadada;\n}\n", ""]);

// exports


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(175);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./file_uploader.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./file_uploader.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(176);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./phone_code.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./phone_code.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(177);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./plain_field_panel.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./plain_field_panel.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(179);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./dropdown.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./dropdown.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(180);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./sm_link.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./sm_link.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(181);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./form_one.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./form_one.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(182);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./stack_widget.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./stack_widget.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(183);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./mix_ele_table_adapter.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./mix_ele_table_adapter.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(184);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./search.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./search.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(185);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./switch.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./switch.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(187);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./html_content_panel.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./html_content_panel.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(188);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./ifram_panel.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./ifram_panel.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(194);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./change_order.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./change_order.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(195);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./check_box.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./check_box.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(196);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./extra_click_plus.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./extra_click_plus.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(197);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./linetext.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./linetext.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(198);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./select.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./select.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(200);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table_grid.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./table_grid.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(201);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./tab_fields.scss", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/sass-loader/lib/loader.js!./tab_fields.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(202);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./list_ctn.styl", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./list_ctn.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(203);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./pop_tree_select.styl", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./pop_tree_select.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(204);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./range.styl", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./range.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(205);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./split_text.styl", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./split_text.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(206);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./fields_table_block.styl", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./fields_table_block.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(209);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./chart.styl", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./chart.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(210);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./table_setting.styl", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./table_setting.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(212);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./icon_cell.styl", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./icon_cell.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(213);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./multi_row.styl", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./multi_row.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(214);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./rich_span.styl", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./rich_span.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(215);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./table_rows.styl", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./table_rows.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(216);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./layout_picture_grid.styl", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./layout_picture_grid.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(217);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./tab_chart.styl", function() {
			var newContent = require("!!../../../../../../../../../../coblan/webcode/node_modules/css-loader/index.js!../../../../../../../../../../coblan/webcode/node_modules/stylus-loader/index.js!./tab_chart.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _config = __webpack_require__(14);

var config = _interopRequireWildcard(_config);

var _mix_table_data = __webpack_require__(43);

var mix_table_data = _interopRequireWildcard(_mix_table_data);

var _mix_v_table_adapter = __webpack_require__(44);

var mix_v_table_adapter = _interopRequireWildcard(_mix_v_table_adapter);

var _mix_ele_table_adapter = __webpack_require__(42);

var mix_ele_table_adapter = _interopRequireWildcard(_mix_ele_table_adapter);

var _main = __webpack_require__(41);

var mix_main = _interopRequireWildcard(_main);

var _ajax_fields = __webpack_require__(82);

var ajax_fields = _interopRequireWildcard(_ajax_fields);

var _ajax_table = __webpack_require__(83);

var ajax_table = _interopRequireWildcard(_ajax_table);

var _ele_tree = __webpack_require__(18);

var ele_tree = _interopRequireWildcard(_ele_tree);

var _picture = __webpack_require__(69);

var table_picture = _interopRequireWildcard(_picture);

var _label_shower = __webpack_require__(65);

var table_label_shower = _interopRequireWildcard(_label_shower);

var _mapper = __webpack_require__(68);

var table_mapper = _interopRequireWildcard(_mapper);

var _call_fun = __webpack_require__(56);

var call_fun = _interopRequireWildcard(_call_fun);

var _pop_fields = __webpack_require__(4);

var table_pop_fields = _interopRequireWildcard(_pop_fields);

var _pop_fields_local = __webpack_require__(70);

var pop_fields_local = _interopRequireWildcard(_pop_fields_local);

var _linetext = __webpack_require__(66);

var table_linetext = _interopRequireWildcard(_linetext);

var _check_box = __webpack_require__(58);

var table_checkbox = _interopRequireWildcard(_check_box);

var _switch_to_tab = __webpack_require__(73);

var switch_to_tab = _interopRequireWildcard(_switch_to_tab);

var _select = __webpack_require__(72);

var select = _interopRequireWildcard(_select);

var _extra_click = __webpack_require__(60);

var extra_click = _interopRequireWildcard(_extra_click);

var _extra_click_plus = __webpack_require__(61);

var extra_click_plus = _interopRequireWildcard(_extra_click_plus);

var _array_mapper = __webpack_require__(51);

var array_mapper = _interopRequireWildcard(_array_mapper);

var _bool_shower = __webpack_require__(55);

var bool_shower = _interopRequireWildcard(_bool_shower);

var _foreign_click_select = __webpack_require__(62);

var foreign_click_select = _interopRequireWildcard(_foreign_click_select);

var _array_option_mapper = __webpack_require__(53);

var array_option_mapper = _interopRequireWildcard(_array_option_mapper);

var _html_shower = __webpack_require__(63);

var html_shower = _interopRequireWildcard(_html_shower);

var _bool_editor = __webpack_require__(54);

var bool_editor = _interopRequireWildcard(_bool_editor);

var _jump_link = __webpack_require__(64);

var jump_link = _interopRequireWildcard(_jump_link);

var _change_order = __webpack_require__(57);

var change_order = _interopRequireWildcard(_change_order);

var _digit = __webpack_require__(59);

var digit = _interopRequireWildcard(_digit);

var _append_html_shower = __webpack_require__(50);

var append_html_shower = _interopRequireWildcard(_append_html_shower);

var _array_obj_shower = __webpack_require__(52);

var array_obj_shower = _interopRequireWildcard(_array_obj_shower);

var _pop_table = __webpack_require__(71);

var pop_table = _interopRequireWildcard(_pop_table);

var _main2 = __webpack_require__(81);

var table_type_main = _interopRequireWildcard(_main2);

var _main3 = __webpack_require__(21);

var fields_editor_main = _interopRequireWildcard(_main3);

var _label_shower2 = __webpack_require__(20);

var field_label_shower = _interopRequireWildcard(_label_shower2);

var _ele_transfer = __webpack_require__(17);

var ele_transfer = _interopRequireWildcard(_ele_transfer);

var _datetime = __webpack_require__(16);

var datetime = _interopRequireWildcard(_datetime);

var _pop_table_select = __webpack_require__(24);

var pop_table_select = _interopRequireWildcard(_pop_table_select);

var _plain_file = __webpack_require__(23);

var plain_file = _interopRequireWildcard(_plain_file);

var _validate_code = __webpack_require__(25);

var validate_code = _interopRequireWildcard(_validate_code);

var _order_list_table = __webpack_require__(22);

var order_list_table = _interopRequireWildcard(_order_list_table);

var _ele_tree_depend = __webpack_require__(19);

var ele_tree_depend = _interopRequireWildcard(_ele_tree_depend);

var _china_address = __webpack_require__(15);

var com_china_address = _interopRequireWildcard(_china_address);

var _operator_a = __webpack_require__(78);

var op_a = _interopRequireWildcard(_operator_a);

var _delete_op = __webpack_require__(76);

var delete_op = _interopRequireWildcard(_delete_op);

var _operator_btn = __webpack_require__(79);

var operator_btn = _interopRequireWildcard(_operator_btn);

var _btn = __webpack_require__(26);

var btn = _interopRequireWildcard(_btn);

var _pop_table_layer = __webpack_require__(39);

var pop_table_layer = _interopRequireWildcard(_pop_table_layer);

var _pop_fields_layer = __webpack_require__(3);

var pop_fields_layer = _interopRequireWildcard(_pop_fields_layer);

var _pop_layer = __webpack_require__(38);

var pop_layer = _interopRequireWildcard(_pop_layer);

var _main4 = __webpack_require__(37);

var misc_main = _interopRequireWildcard(_main4);

var _main5 = __webpack_require__(48);

var panels_main = _interopRequireWildcard(_main5);

var _sim_fields = __webpack_require__(2);

var sim_fields = _interopRequireWildcard(_sim_fields);

var _sim_fields_local = __webpack_require__(30);

var sim_fields_local = _interopRequireWildcard(_sim_fields_local);

var _pop_edit_local = __webpack_require__(29);

var pop_edit_local = _interopRequireWildcard(_pop_edit_local);

var _plain_field_panel = __webpack_require__(28);

var plain_field_panel = _interopRequireWildcard(_plain_field_panel);

var _ele_table = __webpack_require__(80);

var ele_table = _interopRequireWildcard(_ele_table);

var _nice_validator_rule = __webpack_require__(45);

var nice_validator_rule = _interopRequireWildcard(_nice_validator_rule);

var _dropdown = __webpack_require__(32);

var dropdown = _interopRequireWildcard(_dropdown);

var _sm_link = __webpack_require__(34);

var sm_link = _interopRequireWildcard(_sm_link);

var _main6 = __webpack_require__(33);

var header_main = _interopRequireWildcard(_main6);

var _stack_widget = __webpack_require__(40);

var stack_widget = _interopRequireWildcard(_stack_widget);

var _el_tab_widget = __webpack_require__(36);

var el_tab_widget = _interopRequireWildcard(_el_tab_widget);

var _table_store = __webpack_require__(49);

var table_store = _interopRequireWildcard(_table_store);

var _main7 = __webpack_require__(27);

var fields_panels_main = _interopRequireWildcard(_main7);

var _main8 = __webpack_require__(67);

var table_editor_main = _interopRequireWildcard(_main8);

var _main9 = __webpack_require__(75);

var table_group_main = _interopRequireWildcard(_main9);

var _main10 = __webpack_require__(46);

var node_store_main = _interopRequireWildcard(_main10);

var _main11 = __webpack_require__(84);

var tabs_main = _interopRequireWildcard(_main11);

var _main12 = __webpack_require__(47);

var operator_main = _interopRequireWildcard(_main12);

var _main13 = __webpack_require__(31);

var filter_editor_main = _interopRequireWildcard(_main13);

var _main14 = __webpack_require__(35);

var livepage_main = _interopRequireWildcard(_main14);

var _main15 = __webpack_require__(77);

var table_operator_main = _interopRequireWildcard(_main15);

var _main16 = __webpack_require__(74);

var table_filter_main = _interopRequireWildcard(_main16);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

__webpack_require__(86);
__webpack_require__(90);
__webpack_require__(87);
__webpack_require__(88);
__webpack_require__(89);
__webpack_require__(85);

//import * as pop_win_main from './pop_win/main'
__webpack_require__(91);
//table mix

//import * as mix_nice_validator from './mix/mix_nice_validator.js'
//import * as mix_fields_data from './mix/mix_fields_data.js'

//import * as com_pop_fields from './com_pop_fields.js'

// table editor


// field editor

//import * as phon_code from  './field_editor/phon_code.js'


// table operator


//fields operator


//import * as validate from  './validator'

//import * as com_table from  './misc/com_table.js'

//misc


//fields_panels


// top_heads


//ui


// store

/***/ })
/******/ ]);