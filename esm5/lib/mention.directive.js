/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ComponentFactoryResolver, Directive, ElementRef, TemplateRef, ViewContainerRef } from "@angular/core";
import { EventEmitter, Input, Output } from "@angular/core";
import { getCaretPosition, getValue, insertValue, setCaretPosition } from './mention-utils';
import { MentionListComponent } from './mention-list.component';
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
export { MentionDirective };
if (false) {
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.mentionItems;
    /** @type {?} */
    MentionDirective.prototype.mentionConfig;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.activeConfig;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.DEFAULT_CONFIG;
    /** @type {?} */
    MentionDirective.prototype.mentionListTemplate;
    /** @type {?} */
    MentionDirective.prototype.searchTerm;
    /** @type {?} */
    MentionDirective.prototype.opened;
    /** @type {?} */
    MentionDirective.prototype.closed;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.triggerChars;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.searchString;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.startPos;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.startNode;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.searchList;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.searching;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.iframe;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype.lastKeyCode;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype._element;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype._componentResolver;
    /**
     * @type {?}
     * @private
     */
    MentionDirective.prototype._viewContainerRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudGlvbi5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLW1lbnRpb25zLyIsInNvdXJjZXMiOlsibGliL21lbnRpb24uZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDL0csT0FBTyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQWEsTUFBTSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUN0RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRzVGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDOztJQUUxRCxhQUFhLEdBQUcsQ0FBQzs7SUFDakIsT0FBTyxHQUFHLENBQUM7O0lBQ1gsU0FBUyxHQUFHLEVBQUU7O0lBQ2QsU0FBUyxHQUFHLEVBQUU7O0lBQ2QsVUFBVSxHQUFHLEVBQUU7O0lBQ2YsU0FBUyxHQUFHLEVBQUU7O0lBQ2QsUUFBUSxHQUFHLEVBQUU7O0lBQ2IsTUFBTSxHQUFHLEVBQUU7O0lBQ1gsU0FBUyxHQUFHLEVBQUU7O0lBQ2QsUUFBUSxHQUFHLEVBQUU7O0lBQ2IsWUFBWSxHQUFHLEdBQUc7Ozs7Ozs7QUFReEI7SUFxREUsMEJBQ1UsUUFBb0IsRUFDcEIsa0JBQTRDLEVBQzVDLGlCQUFtQztRQUg3QyxpQkFJSztRQUhLLGFBQVEsR0FBUixRQUFRLENBQVk7UUFDcEIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUEwQjtRQUM1QyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCOztRQXJDcEMsa0JBQWEsR0FBa0IsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFJOUMsbUJBQWMsR0FBa0I7WUFDdEMsS0FBSyxFQUFFLEVBQUU7WUFDVCxX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L0Msd0JBQXdCO2dCQUFzQyxnQkFBZ0I7OzswQkF1Q3BGLEtBQUssU0FBQyxTQUFTO2dDQUtmLEtBQUs7c0NBZUwsS0FBSzs2QkFHTCxNQUFNO3lCQUdOLE1BQU07eUJBQ04sTUFBTTs7SUFtU1QsdUJBQUM7Q0FBQSxBQTVVRCxJQTRVQztTQW5VWSxnQkFBZ0I7Ozs7OztJQUczQix3Q0FBNEI7O0lBTzVCLHlDQUFzRDs7Ozs7SUFFdEQsd0NBQW9DOzs7OztJQUVwQywwQ0FRQzs7SUFHRCwrQ0FBK0M7O0lBRy9DLHNDQUFrRDs7SUFHbEQsa0NBQXNDOztJQUN0QyxrQ0FBc0M7Ozs7O0lBRXRDLHdDQUE0RDs7Ozs7SUFFNUQsd0NBQTZCOzs7OztJQUM3QixvQ0FBeUI7Ozs7O0lBQ3pCLHFDQUFrQjs7Ozs7SUFDbEIsc0NBQXlDOzs7OztJQUN6QyxxQ0FBMkI7Ozs7O0lBQzNCLGtDQUFvQjs7Ozs7SUFDcEIsdUNBQTRCOzs7OztJQUcxQixvQ0FBNEI7Ozs7O0lBQzVCLDhDQUFvRDs7Ozs7SUFDcEQsNkNBQTJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFRlbXBsYXRlUmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25DaGFuZ2VzLCBPdXRwdXQsIFNpbXBsZUNoYW5nZXMgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBnZXRDYXJldFBvc2l0aW9uLCBnZXRWYWx1ZSwgaW5zZXJ0VmFsdWUsIHNldENhcmV0UG9zaXRpb24gfSBmcm9tICcuL21lbnRpb24tdXRpbHMnO1xyXG5cclxuaW1wb3J0IHsgTWVudGlvbkNvbmZpZyB9IGZyb20gXCIuL21lbnRpb24tY29uZmlnXCI7XHJcbmltcG9ydCB7IE1lbnRpb25MaXN0Q29tcG9uZW50IH0gZnJvbSAnLi9tZW50aW9uLWxpc3QuY29tcG9uZW50JztcclxuXHJcbmNvbnN0IEtFWV9CQUNLU1BBQ0UgPSA4O1xyXG5jb25zdCBLRVlfVEFCID0gOTtcclxuY29uc3QgS0VZX0VOVEVSID0gMTM7XHJcbmNvbnN0IEtFWV9TSElGVCA9IDE2O1xyXG5jb25zdCBLRVlfRVNDQVBFID0gMjc7XHJcbmNvbnN0IEtFWV9TUEFDRSA9IDMyO1xyXG5jb25zdCBLRVlfTEVGVCA9IDM3O1xyXG5jb25zdCBLRVlfVVAgPSAzODtcclxuY29uc3QgS0VZX1JJR0hUID0gMzk7XHJcbmNvbnN0IEtFWV9ET1dOID0gNDA7XHJcbmNvbnN0IEtFWV9CVUZGRVJFRCA9IDIyOTtcclxuXHJcbi8qKlxyXG4gKiBBbmd1bGFyIE1lbnRpb25zLlxyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdzIyMncvYW5ndWxhci1tZW50aW9uc1xyXG4gKlxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgRGFuIE1hY0ZhcmxhbmVcclxuICovXHJcbkBEaXJlY3RpdmUoe1xyXG4gIHNlbGVjdG9yOiAnW21lbnRpb25dLCBbbWVudGlvbkNvbmZpZ10nLFxyXG4gIGhvc3Q6IHtcclxuICAgICcoa2V5ZG93biknOiAna2V5SGFuZGxlcigkZXZlbnQpJyxcclxuICAgICcoaW5wdXQpJzogJ2lucHV0SGFuZGxlcigkZXZlbnQpJyxcclxuICAgICcoYmx1ciknOiAnYmx1ckhhbmRsZXIoJGV2ZW50KScsXHJcbiAgICAnYXV0b2NvbXBsZXRlJzogJ29mZidcclxuICB9XHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNZW50aW9uRGlyZWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzIHtcclxuXHJcbiAgLy8gc3RvcmVzIHRoZSBpdGVtcyBwYXNzZWQgdG8gdGhlIG1lbnRpb25zIGRpcmVjdGl2ZSBhbmQgdXNlZCB0byBwb3B1bGF0ZSB0aGUgcm9vdCBpdGVtcyBpbiBtZW50aW9uQ29uZmlnXHJcbiAgcHJpdmF0ZSBtZW50aW9uSXRlbXM6IGFueVtdO1xyXG5cclxuICBASW5wdXQoJ21lbnRpb24nKSBzZXQgbWVudGlvbihpdGVtczogYW55W10pIHtcclxuICAgIHRoaXMubWVudGlvbkl0ZW1zID0gaXRlbXM7XHJcbiAgfVxyXG5cclxuICAvLyB0aGUgcHJvdmlkZWQgY29uZmlndXJhdGlvbiBvYmplY3RcclxuICBASW5wdXQoKSBtZW50aW9uQ29uZmlnOiBNZW50aW9uQ29uZmlnID0geyBpdGVtczogW10gfTtcclxuXHJcbiAgcHJpdmF0ZSBhY3RpdmVDb25maWc6IE1lbnRpb25Db25maWc7XHJcblxyXG4gIHByaXZhdGUgREVGQVVMVF9DT05GSUc6IE1lbnRpb25Db25maWcgPSB7XHJcbiAgICBpdGVtczogW10sXHJcbiAgICB0cmlnZ2VyQ2hhcjogJ0AnLFxyXG4gICAgbGFiZWxLZXk6ICdsYWJlbCcsXHJcbiAgICBtYXhJdGVtczogLTEsXHJcbiAgICBhbGxvd1NwYWNlOiBmYWxzZSxcclxuICAgIHJldHVyblRyaWdnZXI6IGZhbHNlLFxyXG4gICAgbWVudGlvblNlbGVjdDogKGl0ZW06IGFueSkgPT4gdGhpcy5hY3RpdmVDb25maWcudHJpZ2dlckNoYXIgKyBpdGVtW3RoaXMuYWN0aXZlQ29uZmlnLmxhYmVsS2V5XVxyXG4gIH1cclxuXHJcbiAgLy8gdGVtcGxhdGUgdG8gdXNlIGZvciByZW5kZXJpbmcgbGlzdCBpdGVtc1xyXG4gIEBJbnB1dCgpIG1lbnRpb25MaXN0VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIC8vIGV2ZW50IGVtaXR0ZWQgd2hlbmV2ZXIgdGhlIHNlYXJjaCB0ZXJtIGNoYW5nZXNcclxuICBAT3V0cHV0KCkgc2VhcmNoVGVybSA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xyXG5cclxuICAvLyBldmVudCBlbWl0dGVkIHdoZW5ldmVyIHRoZSBtZW50aW9uIGxpc3QgaXMgb3BlbmVkIG9yIGNsb3NlZFxyXG4gIEBPdXRwdXQoKSBvcGVuZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGNsb3NlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgcHJpdmF0ZSB0cmlnZ2VyQ2hhcnM6IHsgW2tleTogc3RyaW5nXTogTWVudGlvbkNvbmZpZyB9ID0ge307XHJcblxyXG4gIHByaXZhdGUgc2VhcmNoU3RyaW5nOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBzdGFydFBvczogbnVtYmVyO1xyXG4gIHByaXZhdGUgc3RhcnROb2RlO1xyXG4gIHByaXZhdGUgc2VhcmNoTGlzdDogTWVudGlvbkxpc3RDb21wb25lbnQ7XHJcbiAgcHJpdmF0ZSBzZWFyY2hpbmc6IGJvb2xlYW47XHJcbiAgcHJpdmF0ZSBpZnJhbWU6IGFueTsgLy8gb3B0aW9uYWxcclxuICBwcml2YXRlIGxhc3RLZXlDb2RlOiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZixcclxuICAgIHByaXZhdGUgX2NvbXBvbmVudFJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXHJcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmXHJcbiAgKSB7IH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2NvbmZpZyBjaGFuZ2UnLCBjaGFuZ2VzKTtcclxuICAgIGlmIChjaGFuZ2VzWydtZW50aW9uJ10gfHwgY2hhbmdlc1snbWVudGlvbkNvbmZpZyddKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlQ29uZmlnKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdXBkYXRlQ29uZmlnKCkge1xyXG4gICAgbGV0IGNvbmZpZyA9IHRoaXMubWVudGlvbkNvbmZpZztcclxuICAgIHRoaXMudHJpZ2dlckNoYXJzID0ge307XHJcbiAgICAvLyB1c2UgaXRlbXMgZnJvbSBkaXJlY3RpdmUgaWYgdGhleSBoYXZlIGJlZW4gc2V0XHJcbiAgICBpZiAodGhpcy5tZW50aW9uSXRlbXMpIHtcclxuICAgICAgY29uZmlnLml0ZW1zID0gdGhpcy5tZW50aW9uSXRlbXM7XHJcbiAgICB9XHJcbiAgICB0aGlzLmFkZENvbmZpZyhjb25maWcpO1xyXG4gICAgLy8gbmVzdGVkIGNvbmZpZ3NcclxuICAgIGlmIChjb25maWcubWVudGlvbnMpIHtcclxuICAgICAgY29uZmlnLm1lbnRpb25zLmZvckVhY2goY29uZmlnID0+IHRoaXMuYWRkQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gYWRkIGNvbmZpZ3VyYXRpb24gZm9yIGEgdHJpZ2dlciBjaGFyXHJcbiAgcHJpdmF0ZSBhZGRDb25maWcoY29uZmlnOiBNZW50aW9uQ29uZmlnKSB7XHJcbiAgICAvLyBkZWZhdWx0c1xyXG4gICAgbGV0IGRlZmF1bHRzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5ERUZBVUxUX0NPTkZJRyk7XHJcbiAgICBjb25maWcgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRzLCBjb25maWcpO1xyXG4gICAgLy8gaXRlbXNcclxuICAgIGxldCBpdGVtcyA9IGNvbmZpZy5pdGVtcztcclxuICAgIGlmIChpdGVtcyAmJiBpdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIC8vIGNvbnZlcnQgc3RyaW5ncyB0byBvYmplY3RzXHJcbiAgICAgIGlmICh0eXBlb2YgaXRlbXNbMF0gPT0gJ3N0cmluZycpIHtcclxuICAgICAgICBpdGVtcyA9IGl0ZW1zLm1hcCgobGFiZWwpID0+IHtcclxuICAgICAgICAgIGxldCBvYmplY3QgPSB7fTtcclxuICAgICAgICAgIG9iamVjdFtjb25maWcubGFiZWxLZXldID0gbGFiZWw7XHJcbiAgICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjb25maWcubGFiZWxLZXkpIHtcclxuICAgICAgICAvLyByZW1vdmUgaXRlbXMgd2l0aG91dCBhbiBsYWJlbEtleSAoYXMgaXQncyByZXF1aXJlZCB0byBmaWx0ZXIgdGhlIGxpc3QpXHJcbiAgICAgICAgaXRlbXMgPSBpdGVtcy5maWx0ZXIoZSA9PiBlW2NvbmZpZy5sYWJlbEtleV0pO1xyXG4gICAgICAgIGlmICghY29uZmlnLmRpc2FibGVTb3J0KSB7XHJcbiAgICAgICAgICBpdGVtcy5zb3J0KChhLCBiKSA9PiBhW2NvbmZpZy5sYWJlbEtleV0ubG9jYWxlQ29tcGFyZShiW2NvbmZpZy5sYWJlbEtleV0pKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbmZpZy5pdGVtcyA9IGl0ZW1zO1xyXG5cclxuICAgIC8vIGFkZCB0aGUgY29uZmlnXHJcbiAgICB0aGlzLnRyaWdnZXJDaGFyc1tjb25maWcudHJpZ2dlckNoYXJdID0gY29uZmlnO1xyXG5cclxuICAgIC8vIGZvciBhc3luYyB1cGRhdGUgd2hpbGUgbWVudS9zZWFyY2ggaXMgYWN0aXZlXHJcbiAgICBpZiAodGhpcy5hY3RpdmVDb25maWcgJiYgdGhpcy5hY3RpdmVDb25maWcudHJpZ2dlckNoYXIgPT0gY29uZmlnLnRyaWdnZXJDaGFyKSB7XHJcbiAgICAgIHRoaXMuYWN0aXZlQ29uZmlnID0gY29uZmlnO1xyXG4gICAgICB0aGlzLnVwZGF0ZVNlYXJjaExpc3QoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldElmcmFtZShpZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50KSB7XHJcbiAgICB0aGlzLmlmcmFtZSA9IGlmcmFtZTtcclxuICB9XHJcblxyXG4gIHN0b3BFdmVudChldmVudDogYW55KSB7XHJcbiAgICAvL2lmIChldmVudCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQpIHsgLy8gZG9lcyBub3Qgd29yayBmb3IgaWZyYW1lXHJcbiAgICBpZiAoIWV2ZW50Lndhc0NsaWNrKSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGJsdXJIYW5kbGVyKGV2ZW50OiBhbnkpIHtcclxuICAgIHRoaXMuc3RvcEV2ZW50KGV2ZW50KTtcclxuICAgIHRoaXMuc3RvcFNlYXJjaCgpO1xyXG4gIH1cclxuXHJcbiAgaW5wdXRIYW5kbGVyKGV2ZW50OiBhbnksIG5hdGl2ZUVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpIHtcclxuICAgIGlmICh0aGlzLmxhc3RLZXlDb2RlID09PSBLRVlfQlVGRkVSRUQgJiYgZXZlbnQuZGF0YSkge1xyXG4gICAgICBsZXQga2V5Q29kZSA9IGV2ZW50LmRhdGEuY2hhckNvZGVBdCgwKTtcclxuICAgICAgdGhpcy5rZXlIYW5kbGVyKHsga2V5Q29kZSwgaW5wdXRFdmVudDogdHJ1ZSB9LCBuYXRpdmVFbGVtZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEBwYXJhbSBuYXRpdmVFbGVtZW50IGlzIHRoZSBhbHRlcm5hdGl2ZSB0ZXh0IGVsZW1lbnQgaW4gYW4gaWZyYW1lIHNjZW5hcmlvXHJcbiAga2V5SGFuZGxlcihldmVudDogYW55LCBuYXRpdmVFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50ID0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50KSB7XHJcbiAgICB0aGlzLmxhc3RLZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcclxuXHJcbiAgICBpZiAoZXZlbnQuaXNDb21wb3NpbmcgfHwgZXZlbnQua2V5Q29kZSA9PT0gS0VZX0JVRkZFUkVEKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgdmFsOiBzdHJpbmcgPSBnZXRWYWx1ZShuYXRpdmVFbGVtZW50KTtcclxuICAgIGxldCBwb3MgPSBnZXRDYXJldFBvc2l0aW9uKG5hdGl2ZUVsZW1lbnQsIHRoaXMuaWZyYW1lKTtcclxuICAgIGxldCBjaGFyUHJlc3NlZCA9IGV2ZW50LmtleTtcclxuICAgIGlmICghY2hhclByZXNzZWQpIHtcclxuICAgICAgbGV0IGNoYXJDb2RlID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcclxuICAgICAgaWYgKCFldmVudC5zaGlmdEtleSAmJiAoY2hhckNvZGUgPj0gNjUgJiYgY2hhckNvZGUgPD0gOTApKSB7XHJcbiAgICAgICAgY2hhclByZXNzZWQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNoYXJDb2RlICsgMzIpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIGVsc2UgaWYgKGV2ZW50LnNoaWZ0S2V5ICYmIGNoYXJDb2RlID09PSBLRVlfMikge1xyXG4gICAgICAvLyAgIGNoYXJQcmVzc2VkID0gdGhpcy5jb25maWcudHJpZ2dlckNoYXI7XHJcbiAgICAgIC8vIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgLy8gVE9ETyAoZG1hY2ZhcmxhbmUpIGZpeCB0aGlzIGZvciBub24tYWxwaGEga2V5c1xyXG4gICAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjIyMDE5Ni9ob3ctdG8tZGVjb2RlLWNoYXJhY3Rlci1wcmVzc2VkLWZyb20tanF1ZXJ5cy1rZXlkb3ducy1ldmVudC1oYW5kbGVyP2xxPTFcclxuICAgICAgICBjaGFyUHJlc3NlZCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChldmVudC5rZXlDb2RlID09IEtFWV9FTlRFUiAmJiBldmVudC53YXNDbGljayAmJiBwb3MgPCB0aGlzLnN0YXJ0UG9zKSB7XHJcbiAgICAgIC8vIHB1dCBjYXJldCBiYWNrIGluIHBvc2l0aW9uIHByaW9yIHRvIGNvbnRlbnRlZGl0YWJsZSBtZW51IGNsaWNrXHJcbiAgICAgIHBvcyA9IHRoaXMuc3RhcnROb2RlLmxlbmd0aDtcclxuICAgICAgc2V0Q2FyZXRQb3NpdGlvbih0aGlzLnN0YXJ0Tm9kZSwgcG9zLCB0aGlzLmlmcmFtZSk7XHJcbiAgICB9XHJcbiAgICAvL2NvbnNvbGUubG9nKFwia2V5SGFuZGxlclwiLCB0aGlzLnN0YXJ0UG9zLCBwb3MsIHZhbCwgY2hhclByZXNzZWQsIGV2ZW50KTtcclxuXHJcbiAgICBsZXQgY29uZmlnID0gdGhpcy50cmlnZ2VyQ2hhcnNbY2hhclByZXNzZWRdO1xyXG4gICAgaWYgKGNvbmZpZykge1xyXG4gICAgICB0aGlzLmFjdGl2ZUNvbmZpZyA9IGNvbmZpZztcclxuICAgICAgdGhpcy5zdGFydFBvcyA9IGV2ZW50LmlucHV0RXZlbnQgPyBwb3MgLSAxIDogcG9zO1xyXG4gICAgICB0aGlzLnN0YXJ0Tm9kZSA9ICh0aGlzLmlmcmFtZSA/IHRoaXMuaWZyYW1lLmNvbnRlbnRXaW5kb3cuZ2V0U2VsZWN0aW9uKCkgOiB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkpLmFuY2hvck5vZGU7XHJcbiAgICAgIHRoaXMuc2VhcmNoaW5nID0gdHJ1ZTtcclxuICAgICAgdGhpcy5zZWFyY2hTdHJpbmcgPSBudWxsO1xyXG4gICAgICB0aGlzLnNob3dTZWFyY2hMaXN0KG5hdGl2ZUVsZW1lbnQpO1xyXG4gICAgICB0aGlzLnVwZGF0ZVNlYXJjaExpc3QoKTtcclxuXHJcbiAgICAgIGlmIChjb25maWcucmV0dXJuVHJpZ2dlcikge1xyXG4gICAgICAgIHRoaXMuc2VhcmNoVGVybS5lbWl0KGNvbmZpZy50cmlnZ2VyQ2hhcik7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0aGlzLnN0YXJ0UG9zID49IDAgJiYgdGhpcy5zZWFyY2hpbmcpIHtcclxuICAgICAgaWYgKHBvcyA8PSB0aGlzLnN0YXJ0UG9zKSB7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hMaXN0LmhpZGRlbiA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgLy8gaWdub3JlIHNoaWZ0IHdoZW4gcHJlc3NlZCBhbG9uZSwgYnV0IG5vdCB3aGVuIHVzZWQgd2l0aCBhbm90aGVyIGtleVxyXG4gICAgICBlbHNlIGlmIChldmVudC5rZXlDb2RlICE9PSBLRVlfU0hJRlQgJiZcclxuICAgICAgICAhZXZlbnQubWV0YUtleSAmJlxyXG4gICAgICAgICFldmVudC5hbHRLZXkgJiZcclxuICAgICAgICAhZXZlbnQuY3RybEtleSAmJlxyXG4gICAgICAgIHBvcyA+IHRoaXMuc3RhcnRQb3NcclxuICAgICAgKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZUNvbmZpZy5hbGxvd1NwYWNlICYmIGV2ZW50LmtleUNvZGUgPT09IEtFWV9TUEFDRSkge1xyXG4gICAgICAgICAgdGhpcy5zdGFydFBvcyA9IC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChldmVudC5rZXlDb2RlID09PSBLRVlfQkFDS1NQQUNFICYmIHBvcyA+IDApIHtcclxuICAgICAgICAgIHBvcy0tO1xyXG4gICAgICAgICAgaWYgKHBvcyA9PSB0aGlzLnN0YXJ0UG9zKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcFNlYXJjaCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICghdGhpcy5zZWFyY2hMaXN0LmhpZGRlbikge1xyXG4gICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEtFWV9UQUIgfHwgZXZlbnQua2V5Q29kZSA9PT0gS0VZX0VOVEVSKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcEV2ZW50KGV2ZW50KTtcclxuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuYWN0aXZlQ29uZmlnLm1lbnRpb25TZWxlY3QodGhpcy5zZWFyY2hMaXN0LmFjdGl2ZUl0ZW0pO1xyXG4gICAgICAgICAgICAvLyB2YWx1ZSBpcyBpbnNlcnRlZCB3aXRob3V0IGEgdHJhaWxpbmcgc3BhY2UgZm9yIGNvbnNpc3RlbmN5XHJcbiAgICAgICAgICAgIC8vIGJldHdlZW4gZWxlbWVudCB0eXBlcyAoZGl2IGFuZCBpZnJhbWUgZG8gbm90IHByZXNlcnZlIHRoZSBzcGFjZSlcclxuICAgICAgICAgICAgaW5zZXJ0VmFsdWUobmF0aXZlRWxlbWVudCwgdGhpcy5zdGFydFBvcywgcG9zLCB0ZXh0LCB0aGlzLmlmcmFtZSk7XHJcbiAgICAgICAgICAgIC8vIGZpcmUgaW5wdXQgZXZlbnQgc28gYW5ndWxhciBiaW5kaW5ncyBhcmUgdXBkYXRlZFxyXG4gICAgICAgICAgICBpZiAoXCJjcmVhdGVFdmVudFwiIGluIGRvY3VtZW50KSB7XHJcbiAgICAgICAgICAgICAgbGV0IGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiSFRNTEV2ZW50c1wiKTtcclxuICAgICAgICAgICAgICBpZiAodGhpcy5pZnJhbWUpIHtcclxuICAgICAgICAgICAgICAgIC8vIGEgJ2NoYW5nZScgZXZlbnQgaXMgcmVxdWlyZWQgdG8gdHJpZ2dlciB0aW55bWNlIHVwZGF0ZXNcclxuICAgICAgICAgICAgICAgIGV2dC5pbml0RXZlbnQoXCJjaGFuZ2VcIiwgdHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGV2dC5pbml0RXZlbnQoXCJpbnB1dFwiLCB0cnVlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIC8vIHRoaXMgc2VlbXMgYmFja3dhcmRzLCBidXQgZmlyZSB0aGUgZXZlbnQgZnJvbSB0aGlzIGVsZW1lbnRzIG5hdGl2ZUVsZW1lbnQgKG5vdCB0aGVcclxuICAgICAgICAgICAgICAvLyBvbmUgcHJvdmlkZWQgdGhhdCBtYXkgYmUgaW4gYW4gaWZyYW1lLCBhcyBpdCB3b24ndCBiZSBwcm9wb2dhdGUpXHJcbiAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZ0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0UG9zID0gLTE7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcFNlYXJjaCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIGlmIChldmVudC5rZXlDb2RlID09PSBLRVlfRVNDQVBFKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcEV2ZW50KGV2ZW50KTtcclxuICAgICAgICAgICAgdGhpcy5zdG9wU2VhcmNoKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IEtFWV9ET1dOKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcEV2ZW50KGV2ZW50KTtcclxuICAgICAgICAgICAgdGhpcy5zZWFyY2hMaXN0LmFjdGl2YXRlTmV4dEl0ZW0oKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PT0gS0VZX1VQKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcEV2ZW50KGV2ZW50KTtcclxuICAgICAgICAgICAgdGhpcy5zZWFyY2hMaXN0LmFjdGl2YXRlUHJldmlvdXNJdGVtKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSBLRVlfTEVGVCB8fCBldmVudC5rZXlDb2RlID09PSBLRVlfUklHSFQpIHtcclxuICAgICAgICAgIHRoaXMuc3RvcEV2ZW50KGV2ZW50KTtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5zZWFyY2hpbmcpIHtcclxuICAgICAgICAgIGxldCBtZW50aW9uID0gdmFsLnN1YnN0cmluZyh0aGlzLnN0YXJ0UG9zICsgMSwgcG9zKTtcclxuICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlICE9PSBLRVlfQkFDS1NQQUNFICYmICFldmVudC5pbnB1dEV2ZW50KSB7XHJcbiAgICAgICAgICAgIG1lbnRpb24gKz0gY2hhclByZXNzZWQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLnNlYXJjaFN0cmluZyA9IG1lbnRpb247XHJcbiAgICAgICAgICBpZiAodGhpcy5hY3RpdmVDb25maWcucmV0dXJuVHJpZ2dlcikge1xyXG4gICAgICAgICAgICBjb25zdCB0cmlnZ2VyQ2hhciA9ICh0aGlzLnNlYXJjaFN0cmluZyB8fCBldmVudC5rZXlDb2RlID09PSBLRVlfQkFDS1NQQUNFKSA/IHZhbC5zdWJzdHJpbmcodGhpcy5zdGFydFBvcywgMSkgOiAnJztcclxuICAgICAgICAgICAgdGhpcy5zZWFyY2hUZXJtLmVtaXQodHJpZ2dlckNoYXIgKyB0aGlzLnNlYXJjaFN0cmluZyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNlYXJjaFRlcm0uZW1pdCh0aGlzLnNlYXJjaFN0cmluZyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZVNlYXJjaExpc3QoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGV4cG9zZWQgZm9yIGV4dGVybmFsIGNhbGxzIHRvIG9wZW4gdGhlIG1lbnRpb24gbGlzdCwgZS5nLiBieSBjbGlja2luZyBhIGJ1dHRvblxyXG4gIHB1YmxpYyBzdGFydFNlYXJjaCh0cmlnZ2VyQ2hhcj86IHN0cmluZywgbmF0aXZlRWxlbWVudDogSFRNTElucHV0RWxlbWVudCA9IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCkge1xyXG4gICAgdHJpZ2dlckNoYXIgPSB0cmlnZ2VyQ2hhciB8fCB0aGlzLm1lbnRpb25Db25maWcudHJpZ2dlckNoYXIgfHwgdGhpcy5ERUZBVUxUX0NPTkZJRy50cmlnZ2VyQ2hhcjtcclxuICAgIGNvbnN0IHBvcyA9IGdldENhcmV0UG9zaXRpb24obmF0aXZlRWxlbWVudCwgdGhpcy5pZnJhbWUpO1xyXG4gICAgaW5zZXJ0VmFsdWUobmF0aXZlRWxlbWVudCwgcG9zLCBwb3MsIHRyaWdnZXJDaGFyLCB0aGlzLmlmcmFtZSk7XHJcbiAgICB0aGlzLmtleUhhbmRsZXIoeyBrZXk6IHRyaWdnZXJDaGFyLCBpbnB1dEV2ZW50OiB0cnVlIH0sIG5hdGl2ZUVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgc3RvcFNlYXJjaCgpIHtcclxuICAgIHRoaXMuY2xvc2VkLmVtaXQoKTtcclxuXHJcbiAgICBpZiAodGhpcy5zZWFyY2hMaXN0KSB7XHJcbiAgICAgIHRoaXMuc2VhcmNoTGlzdC5oaWRkZW4gPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgdGhpcy5hY3RpdmVDb25maWcgPSBudWxsO1xyXG4gICAgdGhpcy5zZWFyY2hpbmcgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVNlYXJjaExpc3QoKSB7XHJcbiAgICBsZXQgbWF0Y2hlczogYW55W10gPSBbXTtcclxuICAgIGlmICh0aGlzLmFjdGl2ZUNvbmZpZyAmJiB0aGlzLmFjdGl2ZUNvbmZpZy5pdGVtcykge1xyXG4gICAgICBsZXQgb2JqZWN0cyA9IHRoaXMuYWN0aXZlQ29uZmlnLml0ZW1zO1xyXG4gICAgICAvLyBkaXNhYmxpbmcgdGhlIHNlYXJjaCByZWxpZXMgb24gdGhlIGFzeW5jIG9wZXJhdGlvbiB0byBkbyB0aGUgZmlsdGVyaW5nXHJcbiAgICAgIGlmICghdGhpcy5hY3RpdmVDb25maWcuZGlzYWJsZVNlYXJjaCAmJiB0aGlzLnNlYXJjaFN0cmluZyAmJiB0aGlzLmFjdGl2ZUNvbmZpZy5sYWJlbEtleSkge1xyXG4gICAgICAgIGxldCBzZWFyY2hTdHJpbmdMb3dlckNhc2UgPSB0aGlzLnNlYXJjaFN0cmluZy50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIG9iamVjdHMgPSBvYmplY3RzLmZpbHRlcihlID0+IGVbdGhpcy5hY3RpdmVDb25maWcubGFiZWxLZXldLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChzZWFyY2hTdHJpbmdMb3dlckNhc2UpKTtcclxuICAgICAgfVxyXG4gICAgICBtYXRjaGVzID0gb2JqZWN0cztcclxuICAgICAgaWYgKHRoaXMuYWN0aXZlQ29uZmlnLm1heEl0ZW1zID4gMCkge1xyXG4gICAgICAgIG1hdGNoZXMgPSBtYXRjaGVzLnNsaWNlKDAsIHRoaXMuYWN0aXZlQ29uZmlnLm1heEl0ZW1zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gdXBkYXRlIHRoZSBzZWFyY2ggbGlzdFxyXG4gICAgaWYgKHRoaXMuc2VhcmNoTGlzdCkge1xyXG4gICAgICB0aGlzLnNlYXJjaExpc3QuaXRlbXMgPSBtYXRjaGVzO1xyXG4gICAgICB0aGlzLnNlYXJjaExpc3QuaGlkZGVuID0gbWF0Y2hlcy5sZW5ndGggPT0gMDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNob3dTZWFyY2hMaXN0KG5hdGl2ZUVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQpIHtcclxuICAgIHRoaXMub3BlbmVkLmVtaXQoKTtcclxuXHJcbiAgICBpZiAodGhpcy5zZWFyY2hMaXN0ID09IG51bGwpIHtcclxuICAgICAgbGV0IGNvbXBvbmVudEZhY3RvcnkgPSB0aGlzLl9jb21wb25lbnRSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShNZW50aW9uTGlzdENvbXBvbmVudCk7XHJcbiAgICAgIGxldCBjb21wb25lbnRSZWYgPSB0aGlzLl92aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChjb21wb25lbnRGYWN0b3J5KTtcclxuICAgICAgdGhpcy5zZWFyY2hMaXN0ID0gY29tcG9uZW50UmVmLmluc3RhbmNlO1xyXG4gICAgICB0aGlzLnNlYXJjaExpc3QuaXRlbVRlbXBsYXRlID0gdGhpcy5tZW50aW9uTGlzdFRlbXBsYXRlO1xyXG4gICAgICBjb21wb25lbnRSZWYuaW5zdGFuY2VbJ2l0ZW1DbGljayddLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgbmF0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgIGxldCBmYWtlS2V5ZG93biA9IHsga2V5Q29kZTogS0VZX0VOVEVSLCB3YXNDbGljazogdHJ1ZSB9O1xyXG4gICAgICAgIHRoaXMua2V5SGFuZGxlcihmYWtlS2V5ZG93biwgbmF0aXZlRWxlbWVudCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zZWFyY2hMaXN0LmxhYmVsS2V5ID0gdGhpcy5hY3RpdmVDb25maWcubGFiZWxLZXk7XHJcbiAgICB0aGlzLnNlYXJjaExpc3QuZHJvcFVwID0gdGhpcy5hY3RpdmVDb25maWcuZHJvcFVwO1xyXG4gICAgdGhpcy5zZWFyY2hMaXN0LnN0eWxlT2ZmID0gdGhpcy5tZW50aW9uQ29uZmlnLmRpc2FibGVTdHlsZTtcclxuICAgIHRoaXMuc2VhcmNoTGlzdC5hY3RpdmVJbmRleCA9IDA7XHJcbiAgICB0aGlzLnNlYXJjaExpc3QucG9zaXRpb24obmF0aXZlRWxlbWVudCwgdGhpcy5pZnJhbWUpO1xyXG4gICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZWFyY2hMaXN0LnJlc2V0KCkpO1xyXG4gIH1cclxufVxyXG4iXX0=