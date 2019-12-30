import { CommonModule } from '@angular/common';
import { Component, ElementRef, Output, EventEmitter, ViewChild, Input, ComponentFactoryResolver, Directive, ViewContainerRef, NgModule } from '@angular/core';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// DOM element manipulation functions...
//
/**
 * @param {?} el
 * @param {?} value
 * @return {?}
 */
function setValue(el, value) {
    //console.log("setValue", el.nodeName, "["+value+"]");
    if (isInputOrTextAreaElement(el)) {
        el.value = value;
    }
    else {
        el.textContent = value;
    }
}
/**
 * @param {?} el
 * @return {?}
 */
function getValue(el) {
    return isInputOrTextAreaElement(el) ? el.value : el.textContent;
}
/**
 * @param {?} el
 * @param {?} start
 * @param {?} end
 * @param {?} text
 * @param {?} iframe
 * @param {?=} noRecursion
 * @return {?}
 */
function insertValue(el, start, end, text, iframe, noRecursion) {
    if (noRecursion === void 0) { noRecursion = false; }
    //console.log("insertValue", el.nodeName, start, end, "["+text+"]", el);
    if (isTextElement(el)) {
        /** @type {?} */
        var val = getValue(el);
        setValue(el, val.substring(0, start) + text + val.substring(end, val.length));
        setCaretPosition(el, start + text.length, iframe);
    }
    else if (!noRecursion) {
        /** @type {?} */
        var selObj = getWindowSelection(iframe);
        if (selObj && selObj.rangeCount > 0) {
            /** @type {?} */
            var selRange = selObj.getRangeAt(0);
            /** @type {?} */
            var position = selRange.startOffset;
            /** @type {?} */
            var anchorNode = selObj.anchorNode;
            // if (text.endsWith(' ')) {
            //   text = text.substring(0, text.length-1) + '\xA0';
            // }
            insertValue((/** @type {?} */ (anchorNode)), position - (end - start), position, text, iframe, true);
        }
    }
}
/**
 * @param {?} el
 * @return {?}
 */
function isInputOrTextAreaElement(el) {
    return el != null && (el.nodeName == 'INPUT' || el.nodeName == 'TEXTAREA');
}
/**
 * @param {?} el
 * @return {?}
 */
function isTextElement(el) {
    return el != null && (el.nodeName == 'INPUT' || el.nodeName == 'TEXTAREA' || el.nodeName == '#text');
}
/**
 * @param {?} el
 * @param {?} pos
 * @param {?=} iframe
 * @return {?}
 */
function setCaretPosition(el, pos, iframe) {
    if (iframe === void 0) { iframe = null; }
    //console.log("setCaretPosition", pos, el, iframe==null);
    if (isInputOrTextAreaElement(el) && el.selectionStart) {
        el.focus();
        el.setSelectionRange(pos, pos);
    }
    else {
        /** @type {?} */
        var range = getDocument(iframe).createRange();
        range.setStart(el, pos);
        range.collapse(true);
        /** @type {?} */
        var sel = getWindowSelection(iframe);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}
/**
 * @param {?} el
 * @param {?=} iframe
 * @return {?}
 */
function getCaretPosition(el, iframe) {
    if (iframe === void 0) { iframe = null; }
    //console.log("getCaretPosition", el);
    if (isInputOrTextAreaElement(el)) {
        /** @type {?} */
        var val = el.value;
        return val.slice(0, el.selectionStart).length;
    }
    else {
        /** @type {?} */
        var selObj = getWindowSelection(iframe);
        if (selObj.rangeCount > 0) {
            /** @type {?} */
            var selRange = selObj.getRangeAt(0);
            /** @type {?} */
            var preCaretRange = selRange.cloneRange();
            preCaretRange.selectNodeContents(el);
            preCaretRange.setEnd(selRange.endContainer, selRange.endOffset);
            /** @type {?} */
            var position = preCaretRange.toString().length;
            return position;
        }
    }
}
// Based on ment.io functions...
//
/**
 * @param {?} iframe
 * @return {?}
 */
function getDocument(iframe) {
    if (!iframe) {
        return document;
    }
    else {
        return iframe.contentWindow.document;
    }
}
/**
 * @param {?} iframe
 * @return {?}
 */
function getWindowSelection(iframe) {
    if (!iframe) {
        return window.getSelection();
    }
    else {
        return iframe.contentWindow.getSelection();
    }
}
/**
 * @param {?} ctx
 * @return {?}
 */
function getContentEditableCaretCoords(ctx) {
    /** @type {?} */
    var markerTextChar = '\ufeff';
    /** @type {?} */
    var markerId = 'sel_' + new Date().getTime() + '_' + Math.random().toString().substr(2);
    /** @type {?} */
    var doc = getDocument(ctx ? ctx.iframe : null);
    /** @type {?} */
    var sel = getWindowSelection(ctx ? ctx.iframe : null);
    /** @type {?} */
    var prevRange = sel.getRangeAt(0);
    // create new range and set postion using prevRange
    /** @type {?} */
    var range = doc.createRange();
    range.setStart(sel.anchorNode, prevRange.startOffset);
    range.setEnd(sel.anchorNode, prevRange.startOffset);
    range.collapse(false);
    // Create the marker element containing a single invisible character
    // using DOM methods and insert it at the position in the range
    /** @type {?} */
    var markerEl = doc.createElement('span');
    markerEl.id = markerId;
    markerEl.appendChild(doc.createTextNode(markerTextChar));
    range.insertNode(markerEl);
    sel.removeAllRanges();
    sel.addRange(prevRange);
    /** @type {?} */
    var coordinates = {
        left: 0,
        top: markerEl.offsetHeight
    };
    localToRelativeCoordinates(ctx, markerEl, coordinates);
    markerEl.parentNode.removeChild(markerEl);
    return coordinates;
}
/**
 * @param {?} ctx
 * @param {?} element
 * @param {?} coordinates
 * @return {?}
 */
function localToRelativeCoordinates(ctx, element, coordinates) {
    /** @type {?} */
    var obj = (/** @type {?} */ (element));
    /** @type {?} */
    var iframe = ctx ? ctx.iframe : null;
    while (obj) {
        if (ctx.parent != null && ctx.parent == obj) {
            break;
        }
        coordinates.left += obj.offsetLeft + obj.clientLeft;
        coordinates.top += obj.offsetTop + obj.clientTop;
        obj = (/** @type {?} */ (obj.offsetParent));
        if (!obj && iframe) {
            obj = iframe;
            iframe = null;
        }
    }
    obj = (/** @type {?} */ (element));
    iframe = ctx ? ctx.iframe : null;
    while (obj !== getDocument(null).body && obj != null) {
        if (ctx.parent != null && ctx.parent == obj) {
            break;
        }
        if (obj.scrollTop && obj.scrollTop > 0) {
            coordinates.top -= obj.scrollTop;
        }
        if (obj.scrollLeft && obj.scrollLeft > 0) {
            coordinates.left -= obj.scrollLeft;
        }
        obj = (/** @type {?} */ (obj.parentNode));
        if (!obj && iframe) {
            obj = iframe;
            iframe = null;
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/* From: https://github.com/component/textarea-caret-position */
/* jshint browser: true */
// (function () {
// We'll copy the properties below into the mirror div.
// Note that some browsers, such as Firefox, do not concatenate properties
// into their shorthand (e.g. padding-top, padding-bottom etc. -> padding),
// so we have to list every single property explicitly.
/** @type {?} */
var properties = [
    'direction',
    'boxSizing',
    'width',
    'height',
    'overflowX',
    'overflowY',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderStyle',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    // https://developer.mozilla.org/en-US/docs/Web/CSS/font
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'fontSizeAdjust',
    'lineHeight',
    'fontFamily',
    'textAlign',
    'textTransform',
    'textIndent',
    'textDecoration',
    'letterSpacing',
    'wordSpacing',
    'tabSize',
    'MozTabSize'
];
/** @type {?} */
var isBrowser = (typeof window !== 'undefined');
/** @type {?} */
var isFirefox = (isBrowser && window['mozInnerScreenX'] != null);
/**
 * @param {?} element
 * @param {?} position
 * @param {?} options
 * @return {?}
 */
function getCaretCoordinates(element, position, options) {
    if (!isBrowser) {
        throw new Error('textarea-caret-position#getCaretCoordinates should only be called in a browser');
    }
    /** @type {?} */
    var debug = options && options.debug || false;
    if (debug) {
        /** @type {?} */
        var el = document.querySelector('#input-textarea-caret-position-mirror-div');
        if (el)
            el.parentNode.removeChild(el);
    }
    // The mirror div will replicate the textarea's style
    /** @type {?} */
    var div = document.createElement('div');
    div.id = 'input-textarea-caret-position-mirror-div';
    document.body.appendChild(div);
    /** @type {?} */
    var style = div.style;
    /** @type {?} */
    var computed = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle;
    // currentStyle for IE < 9
    /** @type {?} */
    var isInput = element.nodeName === 'INPUT';
    // Default textarea styles
    style.whiteSpace = 'pre-wrap';
    if (!isInput)
        style.wordWrap = 'break-word'; // only for textarea-s
    // Position off-screen
    style.position = 'absolute'; // required to return coordinates properly
    if (!debug)
        style.visibility = 'hidden'; // not 'display: none' because we want rendering
    // Transfer the element's properties to the div
    properties.forEach((/**
     * @param {?} prop
     * @return {?}
     */
    function (prop) {
        if (isInput && prop === 'lineHeight') {
            // Special case for <input>s because text is rendered centered and line height may be != height
            if (computed.boxSizing === "border-box") {
                /** @type {?} */
                var height = parseInt(computed.height);
                /** @type {?} */
                var outerHeight = parseInt(computed.paddingTop) +
                    parseInt(computed.paddingBottom) +
                    parseInt(computed.borderTopWidth) +
                    parseInt(computed.borderBottomWidth);
                /** @type {?} */
                var targetHeight = outerHeight + parseInt(computed.lineHeight);
                if (height > targetHeight) {
                    style.lineHeight = height - outerHeight + "px";
                }
                else if (height === targetHeight) {
                    style.lineHeight = computed.lineHeight;
                }
                else {
                    style.lineHeight = '0';
                }
            }
            else {
                style.lineHeight = computed.height;
            }
        }
        else {
            style[prop] = computed[prop];
        }
    }));
    if (isFirefox) {
        // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
        if (element.scrollHeight > parseInt(computed.height))
            style.overflowY = 'scroll';
    }
    else {
        style.overflow = 'hidden'; // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
    }
    div.textContent = element.value.substring(0, position);
    // The second special handling for input type="text" vs textarea:
    // spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
    if (isInput)
        div.textContent = div.textContent.replace(/\s/g, '\u00a0');
    /** @type {?} */
    var span = document.createElement('span');
    // Wrapping must be replicated *exactly*, including when a long word gets
    // onto the next line, with whitespace at the end of the line before (#7).
    // The  *only* reliable way to do that is to copy the *entire* rest of the
    // textarea's content into the <span> created at the caret position.
    // For inputs, just '.' would be enough, but no need to bother.
    span.textContent = element.value.substring(position) || '.'; // || because a completely empty faux span doesn't render at all
    div.appendChild(span);
    /** @type {?} */
    var coordinates = {
        top: span.offsetTop + parseInt(computed['borderTopWidth']),
        left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
        height: parseInt(computed['lineHeight'])
    };
    if (debug) {
        span.style.backgroundColor = '#aaa';
    }
    else {
        document.body.removeChild(div);
    }
    return coordinates;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Angular Mentions.
 * https://github.com/w222w/angular-mentions
 *
 * Copyright (c) 2016 Dan MacFarlane
 */
var MentionListComponent = /** @class */ (function () {
    function MentionListComponent(element) {
        this.element = element;
        this.labelKey = 'label';
        this.itemClick = new EventEmitter();
        this.items = [];
        this.activeIndex = 0;
        this.hidden = false;
        this.dropUp = false;
        this.styleOff = false;
        this.coords = { top: 0, left: 0 };
        this.offset = 0;
    }
    /**
     * @return {?}
     */
    MentionListComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (!this.itemTemplate) {
            this.itemTemplate = this.defaultItemTemplate;
        }
    };
    // lots of confusion here between relative coordinates and containers
    // lots of confusion here between relative coordinates and containers
    /**
     * @param {?} nativeParentElement
     * @param {?=} iframe
     * @return {?}
     */
    MentionListComponent.prototype.position = 
    // lots of confusion here between relative coordinates and containers
    /**
     * @param {?} nativeParentElement
     * @param {?=} iframe
     * @return {?}
     */
    function (nativeParentElement, iframe) {
        if (iframe === void 0) { iframe = null; }
        if (isInputOrTextAreaElement(nativeParentElement)) {
            // parent elements need to have postition:relative for this to work correctly?
            this.coords = getCaretCoordinates(nativeParentElement, nativeParentElement.selectionStart, null);
            this.coords.top = nativeParentElement.offsetTop + this.coords.top - nativeParentElement.scrollTop;
            this.coords.left = nativeParentElement.offsetLeft + this.coords.left - nativeParentElement.scrollLeft;
            // getCretCoordinates() for text/input elements needs an additional offset to position the list correctly
            this.offset = this.getBlockCursorDimensions(nativeParentElement).height;
        }
        else if (iframe) {
            /** @type {?} */
            var context = { iframe: iframe, parent: iframe.offsetParent };
            this.coords = getContentEditableCaretCoords(context);
        }
        else {
            /** @type {?} */
            var doc = document.documentElement;
            /** @type {?} */
            var scrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
            /** @type {?} */
            var scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
            // bounding rectangles are relative to view, offsets are relative to container?
            /** @type {?} */
            var caretRelativeToView = getContentEditableCaretCoords({ iframe: iframe });
            /** @type {?} */
            var parentRelativeToContainer = nativeParentElement.getBoundingClientRect();
            this.coords.top = caretRelativeToView.top - parentRelativeToContainer.top + nativeParentElement.offsetTop - scrollTop;
            this.coords.left = caretRelativeToView.left - parentRelativeToContainer.left + nativeParentElement.offsetLeft - scrollLeft;
        }
        // set the default/inital position
        this.positionElement();
    };
    Object.defineProperty(MentionListComponent.prototype, "activeItem", {
        get: /**
         * @return {?}
         */
        function () {
            return this.items[this.activeIndex];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MentionListComponent.prototype.activateNextItem = /**
     * @return {?}
     */
    function () {
        // adjust scrollable-menu offset if the next item is out of view
        /** @type {?} */
        var listEl = this.list.nativeElement;
        /** @type {?} */
        var activeEl = listEl.getElementsByClassName('active').item(0);
        if (activeEl) {
            /** @type {?} */
            var nextLiEl = (/** @type {?} */ (activeEl.nextSibling));
            if (nextLiEl && nextLiEl.nodeName == "LI") {
                /** @type {?} */
                var nextLiRect = nextLiEl.getBoundingClientRect();
                if (nextLiRect.bottom > listEl.getBoundingClientRect().bottom) {
                    listEl.scrollTop = nextLiEl.offsetTop + nextLiRect.height - listEl.clientHeight;
                }
            }
        }
        // select the next item
        this.activeIndex = Math.max(Math.min(this.activeIndex + 1, this.items.length - 1), 0);
    };
    /**
     * @return {?}
     */
    MentionListComponent.prototype.activatePreviousItem = /**
     * @return {?}
     */
    function () {
        // adjust the scrollable-menu offset if the previous item is out of view
        /** @type {?} */
        var listEl = this.list.nativeElement;
        /** @type {?} */
        var activeEl = listEl.getElementsByClassName('active').item(0);
        if (activeEl) {
            /** @type {?} */
            var prevLiEl = (/** @type {?} */ (activeEl.previousSibling));
            if (prevLiEl && prevLiEl.nodeName == "LI") {
                /** @type {?} */
                var prevLiRect = prevLiEl.getBoundingClientRect();
                if (prevLiRect.top < listEl.getBoundingClientRect().top) {
                    listEl.scrollTop = prevLiEl.offsetTop;
                }
            }
        }
        // select the previous item
        this.activeIndex = Math.max(Math.min(this.activeIndex - 1, this.items.length - 1), 0);
    };
    // reset for a new mention search
    // reset for a new mention search
    /**
     * @return {?}
     */
    MentionListComponent.prototype.reset = 
    // reset for a new mention search
    /**
     * @return {?}
     */
    function () {
        this.list.nativeElement.scrollTop = 0;
        this.checkBounds();
    };
    // final positioning is done after the list is shown (and the height and width are known)
    // ensure it's in the page bounds
    // final positioning is done after the list is shown (and the height and width are known)
    // ensure it's in the page bounds
    /**
     * @private
     * @return {?}
     */
    MentionListComponent.prototype.checkBounds = 
    // final positioning is done after the list is shown (and the height and width are known)
    // ensure it's in the page bounds
    /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var left = this.coords.left;
        /** @type {?} */
        var top = this.coords.top;
        /** @type {?} */
        var dropUp = this.dropUp;
        /** @type {?} */
        var bounds = this.list.nativeElement.getBoundingClientRect();
        // if off right of page, align right
        if (bounds.left + bounds.width > window.innerWidth) {
            left -= bounds.left + bounds.width - window.innerWidth + 10;
        }
        // if more than half off the bottom of the page, force dropUp
        // if ((bounds.top+bounds.height/2)>window.innerHeight) {
        //   dropUp = true;
        // }
        // if top is off page, disable dropUp
        if (bounds.top < 0) {
            dropUp = false;
        }
        // set the revised/final position
        this.positionElement(left, top, dropUp);
    };
    /**
     * @private
     * @param {?=} left
     * @param {?=} top
     * @param {?=} dropUp
     * @return {?}
     */
    MentionListComponent.prototype.positionElement = /**
     * @private
     * @param {?=} left
     * @param {?=} top
     * @param {?=} dropUp
     * @return {?}
     */
    function (left, top, dropUp) {
        if (left === void 0) { left = this.coords.left; }
        if (top === void 0) { top = this.coords.top; }
        if (dropUp === void 0) { dropUp = this.dropUp; }
        /** @type {?} */
        var el = this.element.nativeElement;
        top += dropUp ? 0 : this.offset; // top of list is next line
        el.className = dropUp ? 'dropup' : null;
        el.style.position = "absolute";
        el.style.left = left + 'px';
        el.style.top = top + 'px';
    };
    /**
     * @private
     * @param {?} nativeParentElement
     * @return {?}
     */
    MentionListComponent.prototype.getBlockCursorDimensions = /**
     * @private
     * @param {?} nativeParentElement
     * @return {?}
     */
    function (nativeParentElement) {
        /** @type {?} */
        var parentStyles = window.getComputedStyle(nativeParentElement);
        return {
            height: parseFloat(parentStyles.lineHeight),
            width: parseFloat(parentStyles.fontSize)
        };
    };
    MentionListComponent.decorators = [
        { type: Component, args: [{
                    selector: 'mention-list',
                    template: "\n    <ng-template #defaultItemTemplate let-item=\"item\">\n      {{item[labelKey]}}\n    </ng-template>\n    <ul #list [hidden]=\"hidden\" class=\"dropdown-menu scrollable-menu\"\n      [class.mention-menu]=\"!styleOff\" [class.mention-dropdown]=\"!styleOff && dropUp\">\n      <li *ngFor=\"let item of items; let i = index\"\n        [class.active]=\"activeIndex==i\" [class.mention-active]=\"!styleOff && activeIndex==i\">\n        <a class=\"dropdown-item\" [class.mention-item]=\"!styleOff\"\n          (mousedown)=\"activeIndex=i;itemClick.emit();$event.preventDefault()\"\n          (tap)=\"activeIndex=i;itemClick.emit();$event.preventDefault()\"\n          >\n          <ng-template [ngTemplateOutlet]=\"itemTemplate\" [ngTemplateOutletContext]=\"{'item':item}\"></ng-template>\n        </a>\n      </li>\n    </ul>\n    ",
                    styles: [".mention-menu{position:absolute;top:100%;left:0;z-index:1000;display:none;float:left;min-width:11em;padding:.5em 0;margin:.125em 0 0;font-size:1em;color:#212529;text-align:left;list-style:none;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,.15);border-radius:.25em}.mention-item{display:block;padding:.2em 1.5em;line-height:1.5em;clear:both;font-weight:400;color:#212529;text-align:inherit;white-space:nowrap;background-color:transparent;border:0}.mention-active>a{color:#fff;text-decoration:none;background-color:#337ab7;outline:0}.scrollable-menu{display:block;height:auto;max-height:292px;overflow:auto}[hidden]{display:none}.mention-dropdown{bottom:100%;top:auto;margin-bottom:2px}"]
                }] }
    ];
    /** @nocollapse */
    MentionListComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    MentionListComponent.propDecorators = {
        labelKey: [{ type: Input }],
        itemTemplate: [{ type: Input }],
        itemClick: [{ type: Output }],
        list: [{ type: ViewChild, args: ['list',] }],
        defaultItemTemplate: [{ type: ViewChild, args: ['defaultItemTemplate',] }]
    };
    return MentionListComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var KEY_BACKSPACE = 8;
/** @type {?} */
var KEY_TAB = 9;
/** @type {?} */
var KEY_ENTER = 13;
/** @type {?} */
var KEY_SHIFT = 16;
/** @type {?} */
var KEY_ESCAPE = 27;
/** @type {?} */
var KEY_SPACE = 32;
/** @type {?} */
var KEY_LEFT = 37;
/** @type {?} */
var KEY_UP = 38;
/** @type {?} */
var KEY_RIGHT = 39;
/** @type {?} */
var KEY_DOWN = 40;
/** @type {?} */
var KEY_BUFFERED = 229;
/**
 * Angular Mentions.
 * https://github.com/w222w/angular-mentions
 *
 * Copyright (c) 2017 Dan MacFarlane
 */
var MentionDirective = /** @class */ (function () {
    function MentionDirective(_element, _componentResolver, _viewContainerRef) {
        var _this = this;
        this._element = _element;
        this._componentResolver = _componentResolver;
        this._viewContainerRef = _viewContainerRef;
        // the provided configuration object
        this.mentionConfig = { items: [] };
        this.DEFAULT_CONFIG = {
            items: [],
            triggerChar: '@',
            labelKey: 'label',
            maxItems: -1,
            allowSpace: false,
            returnTrigger: false,
            mentionSelect: (/**
             * @param {?} item
             * @return {?}
             */
            function (item) { return _this.activeConfig.triggerChar + item[_this.activeConfig.labelKey]; })
        };
        // event emitted whenever the search term changes
        this.searchTerm = new EventEmitter();
        // event emitted whenever the mention list is opened or closed
        this.opened = new EventEmitter();
        this.closed = new EventEmitter();
        this.triggerChars = {};
    }
    Object.defineProperty(MentionDirective.prototype, "mention", {
        set: /**
         * @param {?} items
         * @return {?}
         */
        function (items) {
            this.mentionItems = items;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} changes
     * @return {?}
     */
    MentionDirective.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        // console.log('config change', changes);
        if (changes['mention'] || changes['mentionConfig']) {
            this.updateConfig();
        }
    };
    /**
     * @return {?}
     */
    MentionDirective.prototype.updateConfig = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var config = this.mentionConfig;
        this.triggerChars = {};
        // use items from directive if they have been set
        if (this.mentionItems) {
            config.items = this.mentionItems;
        }
        this.addConfig(config);
        // nested configs
        if (config.mentions) {
            config.mentions.forEach((/**
             * @param {?} config
             * @return {?}
             */
            function (config) { return _this.addConfig(config); }));
        }
    };
    // add configuration for a trigger char
    // add configuration for a trigger char
    /**
     * @private
     * @param {?} config
     * @return {?}
     */
    MentionDirective.prototype.addConfig = 
    // add configuration for a trigger char
    /**
     * @private
     * @param {?} config
     * @return {?}
     */
    function (config) {
        // defaults
        /** @type {?} */
        var defaults = Object.assign({}, this.DEFAULT_CONFIG);
        config = Object.assign(defaults, config);
        // items
        /** @type {?} */
        var items = config.items;
        if (items && items.length > 0) {
            // convert strings to objects
            if (typeof items[0] == 'string') {
                items = items.map((/**
                 * @param {?} label
                 * @return {?}
                 */
                function (label) {
                    /** @type {?} */
                    var object = {};
                    object[config.labelKey] = label;
                    return object;
                }));
            }
            if (config.labelKey) {
                // remove items without an labelKey (as it's required to filter the list)
                items = items.filter((/**
                 * @param {?} e
                 * @return {?}
                 */
                function (e) { return e[config.labelKey]; }));
                if (!config.disableSort) {
                    items.sort((/**
                     * @param {?} a
                     * @param {?} b
                     * @return {?}
                     */
                    function (a, b) { return a[config.labelKey].localeCompare(b[config.labelKey]); }));
                }
            }
        }
        config.items = items;
        // add the config
        this.triggerChars[config.triggerChar] = config;
        // for async update while menu/search is active
        if (this.activeConfig && this.activeConfig.triggerChar == config.triggerChar) {
            this.activeConfig = config;
            this.updateSearchList();
        }
    };
    /**
     * @param {?} iframe
     * @return {?}
     */
    MentionDirective.prototype.setIframe = /**
     * @param {?} iframe
     * @return {?}
     */
    function (iframe) {
        this.iframe = iframe;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MentionDirective.prototype.stopEvent = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        //if (event instanceof KeyboardEvent) { // does not work for iframe
        if (!event.wasClick) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MentionDirective.prototype.blurHandler = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.stopEvent(event);
        this.stopSearch();
    };
    /**
     * @param {?} event
     * @param {?=} nativeElement
     * @return {?}
     */
    MentionDirective.prototype.inputHandler = /**
     * @param {?} event
     * @param {?=} nativeElement
     * @return {?}
     */
    function (event, nativeElement) {
        if (nativeElement === void 0) { nativeElement = this._element.nativeElement; }
        if (this.lastKeyCode === KEY_BUFFERED && event.data) {
            /** @type {?} */
            var keyCode = event.data.charCodeAt(0);
            this.keyHandler({ keyCode: keyCode, inputEvent: true }, nativeElement);
        }
    };
    // @param nativeElement is the alternative text element in an iframe scenario
    // @param nativeElement is the alternative text element in an iframe scenario
    /**
     * @param {?} event
     * @param {?=} nativeElement
     * @return {?}
     */
    MentionDirective.prototype.keyHandler = 
    // @param nativeElement is the alternative text element in an iframe scenario
    /**
     * @param {?} event
     * @param {?=} nativeElement
     * @return {?}
     */
    function (event, nativeElement) {
        if (nativeElement === void 0) { nativeElement = this._element.nativeElement; }
        this.lastKeyCode = event.keyCode;
        if (event.isComposing || event.keyCode === KEY_BUFFERED) {
            return;
        }
        /** @type {?} */
        var val = getValue(nativeElement);
        /** @type {?} */
        var pos = getCaretPosition(nativeElement, this.iframe);
        /** @type {?} */
        var charPressed = event.key;
        if (!charPressed) {
            /** @type {?} */
            var charCode = event.which || event.keyCode;
            if (!event.shiftKey && (charCode >= 65 && charCode <= 90)) {
                charPressed = String.fromCharCode(charCode + 32);
            }
            // else if (event.shiftKey && charCode === KEY_2) {
            //   charPressed = this.config.triggerChar;
            // }
            else {
                // TODO (dmacfarlane) fix this for non-alpha keys
                // http://stackoverflow.com/questions/2220196/how-to-decode-character-pressed-from-jquerys-keydowns-event-handler?lq=1
                charPressed = String.fromCharCode(event.which || event.keyCode);
            }
        }
        if (event.keyCode == KEY_ENTER && event.wasClick && pos < this.startPos) {
            // put caret back in position prior to contenteditable menu click
            pos = this.startNode.length;
            setCaretPosition(this.startNode, pos, this.iframe);
        }
        //console.log("keyHandler", this.startPos, pos, val, charPressed, event);
        /** @type {?} */
        var config = this.triggerChars[charPressed];
        if (config) {
            this.activeConfig = config;
            this.startPos = event.inputEvent ? pos - 1 : pos;
            this.startNode = (this.iframe ? this.iframe.contentWindow.getSelection() : window.getSelection()).anchorNode;
            this.searching = true;
            this.searchString = null;
            this.showSearchList(nativeElement);
            this.updateSearchList();
            if (config.returnTrigger) {
                this.searchTerm.emit(config.triggerChar);
            }
        }
        else if (this.startPos >= 0 && this.searching) {
            if (pos <= this.startPos) {
                this.searchList.hidden = true;
            }
            // ignore shift when pressed alone, but not when used with another key
            else if (event.keyCode !== KEY_SHIFT &&
                !event.metaKey &&
                !event.altKey &&
                !event.ctrlKey &&
                pos > this.startPos) {
                if (!this.activeConfig.allowSpace && event.keyCode === KEY_SPACE) {
                    this.startPos = -1;
                }
                else if (event.keyCode === KEY_BACKSPACE && pos > 0) {
                    pos--;
                    if (pos == this.startPos) {
                        this.stopSearch();
                    }
                }
                else if (!this.searchList.hidden) {
                    if (event.keyCode === KEY_TAB || event.keyCode === KEY_ENTER) {
                        this.stopEvent(event);
                        /** @type {?} */
                        var text = this.activeConfig.mentionSelect(this.searchList.activeItem);
                        // value is inserted without a trailing space for consistency
                        // between element types (div and iframe do not preserve the space)
                        insertValue(nativeElement, this.startPos, pos, text, this.iframe);
                        // fire input event so angular bindings are updated
                        if ("createEvent" in document) {
                            /** @type {?} */
                            var evt = document.createEvent("HTMLEvents");
                            if (this.iframe) {
                                // a 'change' event is required to trigger tinymce updates
                                evt.initEvent("change", true, false);
                            }
                            else {
                                evt.initEvent("input", true, false);
                            }
                            // this seems backwards, but fire the event from this elements nativeElement (not the
                            // one provided that may be in an iframe, as it won't be propogate)
                            this._element.nativeElement.dispatchEvent(evt);
                        }
                        this.startPos = -1;
                        this.stopSearch();
                        return false;
                    }
                    else if (event.keyCode === KEY_ESCAPE) {
                        this.stopEvent(event);
                        this.stopSearch();
                        return false;
                    }
                    else if (event.keyCode === KEY_DOWN) {
                        this.stopEvent(event);
                        this.searchList.activateNextItem();
                        return false;
                    }
                    else if (event.keyCode === KEY_UP) {
                        this.stopEvent(event);
                        this.searchList.activatePreviousItem();
                        return false;
                    }
                }
                if (event.keyCode === KEY_LEFT || event.keyCode === KEY_RIGHT) {
                    this.stopEvent(event);
                    return false;
                }
                else if (this.searching) {
                    /** @type {?} */
                    var mention = val.substring(this.startPos + 1, pos);
                    if (event.keyCode !== KEY_BACKSPACE && !event.inputEvent) {
                        mention += charPressed;
                    }
                    this.searchString = mention;
                    if (this.activeConfig.returnTrigger) {
                        /** @type {?} */
                        var triggerChar = (this.searchString || event.keyCode === KEY_BACKSPACE) ? val.substring(this.startPos, 1) : '';
                        this.searchTerm.emit(triggerChar + this.searchString);
                    }
                    else {
                        this.searchTerm.emit(this.searchString);
                    }
                    this.updateSearchList();
                }
            }
        }
    };
    // exposed for external calls to open the mention list, e.g. by clicking a button
    // exposed for external calls to open the mention list, e.g. by clicking a button
    /**
     * @param {?=} triggerChar
     * @param {?=} nativeElement
     * @return {?}
     */
    MentionDirective.prototype.startSearch = 
    // exposed for external calls to open the mention list, e.g. by clicking a button
    /**
     * @param {?=} triggerChar
     * @param {?=} nativeElement
     * @return {?}
     */
    function (triggerChar, nativeElement) {
        if (nativeElement === void 0) { nativeElement = this._element.nativeElement; }
        triggerChar = triggerChar || this.mentionConfig.triggerChar || this.DEFAULT_CONFIG.triggerChar;
        /** @type {?} */
        var pos = getCaretPosition(nativeElement, this.iframe);
        insertValue(nativeElement, pos, pos, triggerChar, this.iframe);
        this.keyHandler({ key: triggerChar, inputEvent: true }, nativeElement);
    };
    /**
     * @return {?}
     */
    MentionDirective.prototype.stopSearch = /**
     * @return {?}
     */
    function () {
        this.closed.emit();
        if (this.searchList) {
            this.searchList.hidden = true;
        }
        this.activeConfig = null;
        this.searching = false;
    };
    /**
     * @return {?}
     */
    MentionDirective.prototype.updateSearchList = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var matches = [];
        if (this.activeConfig && this.activeConfig.items) {
            /** @type {?} */
            var objects = this.activeConfig.items;
            // disabling the search relies on the async operation to do the filtering
            if (!this.activeConfig.disableSearch && this.searchString && this.activeConfig.labelKey) {
                /** @type {?} */
                var searchStringLowerCase_1 = this.searchString.toLowerCase();
                objects = objects.filter((/**
                 * @param {?} e
                 * @return {?}
                 */
                function (e) { return e[_this.activeConfig.labelKey].toLowerCase().startsWith(searchStringLowerCase_1); }));
            }
            matches = objects;
            if (this.activeConfig.maxItems > 0) {
                matches = matches.slice(0, this.activeConfig.maxItems);
            }
        }
        // update the search list
        if (this.searchList) {
            this.searchList.items = matches;
            this.searchList.hidden = matches.length == 0;
        }
    };
    /**
     * @param {?} nativeElement
     * @return {?}
     */
    MentionDirective.prototype.showSearchList = /**
     * @param {?} nativeElement
     * @return {?}
     */
    function (nativeElement) {
        var _this = this;
        this.opened.emit();
        if (this.searchList == null) {
            /** @type {?} */
            var componentFactory = this._componentResolver.resolveComponentFactory(MentionListComponent);
            /** @type {?} */
            var componentRef = this._viewContainerRef.createComponent(componentFactory);
            this.searchList = componentRef.instance;
            this.searchList.itemTemplate = this.mentionListTemplate;
            componentRef.instance['itemClick'].subscribe((/**
             * @return {?}
             */
            function () {
                nativeElement.focus();
                /** @type {?} */
                var fakeKeydown = { keyCode: KEY_ENTER, wasClick: true };
                _this.keyHandler(fakeKeydown, nativeElement);
            }));
        }
        this.searchList.labelKey = this.activeConfig.labelKey;
        this.searchList.dropUp = this.activeConfig.dropUp;
        this.searchList.styleOff = this.mentionConfig.disableStyle;
        this.searchList.activeIndex = 0;
        this.searchList.position(nativeElement, this.iframe);
        window.setTimeout((/**
         * @return {?}
         */
        function () { return _this.searchList.reset(); }));
    };
    MentionDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[mention], [mentionConfig]',
                    host: {
                        '(keydown)': 'keyHandler($event)',
                        '(input)': 'inputHandler($event)',
                        '(blur)': 'blurHandler($event)',
                        'autocomplete': 'off'
                    }
                },] }
    ];
    /** @nocollapse */
    MentionDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ComponentFactoryResolver },
        { type: ViewContainerRef }
    ]; };
    MentionDirective.propDecorators = {
        mention: [{ type: Input, args: ['mention',] }],
        mentionConfig: [{ type: Input }],
        mentionListTemplate: [{ type: Input }],
        searchTerm: [{ type: Output }],
        opened: [{ type: Output }],
        closed: [{ type: Output }]
    };
    return MentionDirective;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var MentionModule = /** @class */ (function () {
    function MentionModule() {
    }
    MentionModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        MentionDirective,
                        MentionListComponent
                    ],
                    imports: [
                        CommonModule
                    ],
                    exports: [
                        MentionDirective
                    ],
                    entryComponents: [
                        MentionListComponent
                    ]
                },] }
    ];
    return MentionModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { MentionDirective, MentionModule, MentionListComponent as ɵa };

//# sourceMappingURL=angular-mentions.js.map