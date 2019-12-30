/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ElementRef, Output, EventEmitter, ViewChild, Input, TemplateRef } from '@angular/core';
import { isInputOrTextAreaElement, getContentEditableCaretCoords } from './mention-utils';
import { getCaretCoordinates } from './caret-coords';
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
export { MentionListComponent };
if (false) {
    /** @type {?} */
    MentionListComponent.prototype.labelKey;
    /** @type {?} */
    MentionListComponent.prototype.itemTemplate;
    /** @type {?} */
    MentionListComponent.prototype.itemClick;
    /** @type {?} */
    MentionListComponent.prototype.list;
    /** @type {?} */
    MentionListComponent.prototype.defaultItemTemplate;
    /** @type {?} */
    MentionListComponent.prototype.items;
    /** @type {?} */
    MentionListComponent.prototype.activeIndex;
    /** @type {?} */
    MentionListComponent.prototype.hidden;
    /** @type {?} */
    MentionListComponent.prototype.dropUp;
    /** @type {?} */
    MentionListComponent.prototype.styleOff;
    /**
     * @type {?}
     * @private
     */
    MentionListComponent.prototype.coords;
    /**
     * @type {?}
     * @private
     */
    MentionListComponent.prototype.offset;
    /**
     * @type {?}
     * @private
     */
    MentionListComponent.prototype.element;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudGlvbi1saXN0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItbWVudGlvbnMvIiwic291cmNlcyI6WyJsaWIvbWVudGlvbi1saXN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFDM0UsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLHdCQUF3QixFQUFFLDZCQUE2QixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDMUYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7Ozs7QUFRckQ7SUFrQ0UsOEJBQW9CLE9BQW1CO1FBQW5CLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFaOUIsYUFBUSxHQUFXLE9BQU8sQ0FBQztRQUUxQixjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUd6QyxVQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ1gsZ0JBQVcsR0FBVyxDQUFDLENBQUM7UUFDeEIsV0FBTSxHQUFZLEtBQUssQ0FBQztRQUN4QixXQUFNLEdBQVksS0FBSyxDQUFDO1FBQ3hCLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFDbEIsV0FBTSxHQUE4QixFQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsSUFBSSxFQUFDLENBQUMsRUFBQyxDQUFDO1FBQ3BELFdBQU0sR0FBVyxDQUFDLENBQUM7SUFDZSxDQUFDOzs7O0lBRTNDLHVDQUFROzs7SUFBUjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDO1NBQzlDO0lBQ0gsQ0FBQztJQUVELHFFQUFxRTs7Ozs7OztJQUNyRSx1Q0FBUTs7Ozs7OztJQUFSLFVBQVMsbUJBQXFDLEVBQUUsTUFBZ0M7UUFB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MEI7Ozs7O0lBQzFCLHNDQUE0RDs7Ozs7SUFDNUQsc0NBQTJCOzs7OztJQUNmLHVDQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgVmlld0NoaWxkLCBJbnB1dCwgVGVtcGxhdGVSZWYsIE9uSW5pdFxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgaXNJbnB1dE9yVGV4dEFyZWFFbGVtZW50LCBnZXRDb250ZW50RWRpdGFibGVDYXJldENvb3JkcyB9IGZyb20gJy4vbWVudGlvbi11dGlscyc7XHJcbmltcG9ydCB7IGdldENhcmV0Q29vcmRpbmF0ZXMgfSBmcm9tICcuL2NhcmV0LWNvb3Jkcyc7XHJcblxyXG4vKipcclxuICogQW5ndWxhciBNZW50aW9ucy5cclxuICogaHR0cHM6Ly9naXRodWIuY29tL3cyMjJ3L2FuZ3VsYXItbWVudGlvbnNcclxuICpcclxuICogQ29weXJpZ2h0IChjKSAyMDE2IERhbiBNYWNGYXJsYW5lXHJcbiAqL1xyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ21lbnRpb24tbGlzdCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vbWVudGlvbi1saXN0LmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdEl0ZW1UZW1wbGF0ZSBsZXQtaXRlbT1cIml0ZW1cIj5cclxuICAgICAge3tpdGVtW2xhYmVsS2V5XX19XHJcbiAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgPHVsICNsaXN0IFtoaWRkZW5dPVwiaGlkZGVuXCIgY2xhc3M9XCJkcm9wZG93bi1tZW51IHNjcm9sbGFibGUtbWVudVwiXHJcbiAgICAgIFtjbGFzcy5tZW50aW9uLW1lbnVdPVwiIXN0eWxlT2ZmXCIgW2NsYXNzLm1lbnRpb24tZHJvcGRvd25dPVwiIXN0eWxlT2ZmICYmIGRyb3BVcFwiPlxyXG4gICAgICA8bGkgKm5nRm9yPVwibGV0IGl0ZW0gb2YgaXRlbXM7IGxldCBpID0gaW5kZXhcIlxyXG4gICAgICAgIFtjbGFzcy5hY3RpdmVdPVwiYWN0aXZlSW5kZXg9PWlcIiBbY2xhc3MubWVudGlvbi1hY3RpdmVdPVwiIXN0eWxlT2ZmICYmIGFjdGl2ZUluZGV4PT1pXCI+XHJcbiAgICAgICAgPGEgY2xhc3M9XCJkcm9wZG93bi1pdGVtXCIgW2NsYXNzLm1lbnRpb24taXRlbV09XCIhc3R5bGVPZmZcIlxyXG4gICAgICAgICAgKG1vdXNlZG93bik9XCJhY3RpdmVJbmRleD1pO2l0ZW1DbGljay5lbWl0KCk7JGV2ZW50LnByZXZlbnREZWZhdWx0KClcIlxuICAgICAgICAgICh0YXApPVwiYWN0aXZlSW5kZXg9aTtpdGVtQ2xpY2suZW1pdCgpOyRldmVudC5wcmV2ZW50RGVmYXVsdCgpXCJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwiaXRlbVRlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsnaXRlbSc6aXRlbX1cIj48L25nLXRlbXBsYXRlPlxyXG4gICAgICAgIDwvYT5cclxuICAgICAgPC9saT5cclxuICAgIDwvdWw+XHJcbiAgICBgXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNZW50aW9uTGlzdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgbGFiZWxLZXk6IHN0cmluZyA9ICdsYWJlbCc7XHJcbiAgQElucHV0KCkgaXRlbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBPdXRwdXQoKSBpdGVtQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQFZpZXdDaGlsZCgnbGlzdCcpIGxpc3Q6IEVsZW1lbnRSZWY7XHJcbiAgQFZpZXdDaGlsZCgnZGVmYXVsdEl0ZW1UZW1wbGF0ZScpIGRlZmF1bHRJdGVtVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgaXRlbXMgPSBbXTtcclxuICBhY3RpdmVJbmRleDogbnVtYmVyID0gMDtcclxuICBoaWRkZW46IGJvb2xlYW4gPSBmYWxzZTtcclxuICBkcm9wVXA6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBzdHlsZU9mZjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHByaXZhdGUgY29vcmRzOiB7dG9wOm51bWJlciwgbGVmdDpudW1iZXJ9ID0ge3RvcDowLCBsZWZ0OjB9O1xyXG4gIHByaXZhdGUgb2Zmc2V0OiBudW1iZXIgPSAwO1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZikge31cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICBpZiAoIXRoaXMuaXRlbVRlbXBsYXRlKSB7XHJcbiAgICAgIHRoaXMuaXRlbVRlbXBsYXRlID0gdGhpcy5kZWZhdWx0SXRlbVRlbXBsYXRlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gbG90cyBvZiBjb25mdXNpb24gaGVyZSBiZXR3ZWVuIHJlbGF0aXZlIGNvb3JkaW5hdGVzIGFuZCBjb250YWluZXJzXHJcbiAgcG9zaXRpb24obmF0aXZlUGFyZW50RWxlbWVudDogSFRNTElucHV0RWxlbWVudCwgaWZyYW1lOiBIVE1MSUZyYW1lRWxlbWVudCA9IG51bGwpIHtcclxuICAgIGlmIChpc0lucHV0T3JUZXh0QXJlYUVsZW1lbnQobmF0aXZlUGFyZW50RWxlbWVudCkpIHtcclxuICAgICAgLy8gcGFyZW50IGVsZW1lbnRzIG5lZWQgdG8gaGF2ZSBwb3N0aXRpb246cmVsYXRpdmUgZm9yIHRoaXMgdG8gd29yayBjb3JyZWN0bHk/XHJcbiAgICAgIHRoaXMuY29vcmRzID0gZ2V0Q2FyZXRDb29yZGluYXRlcyhuYXRpdmVQYXJlbnRFbGVtZW50LCBuYXRpdmVQYXJlbnRFbGVtZW50LnNlbGVjdGlvblN0YXJ0LCBudWxsKTtcclxuICAgICAgdGhpcy5jb29yZHMudG9wID0gbmF0aXZlUGFyZW50RWxlbWVudC5vZmZzZXRUb3AgKyB0aGlzLmNvb3Jkcy50b3AgLSBuYXRpdmVQYXJlbnRFbGVtZW50LnNjcm9sbFRvcDtcclxuICAgICAgdGhpcy5jb29yZHMubGVmdCA9IG5hdGl2ZVBhcmVudEVsZW1lbnQub2Zmc2V0TGVmdCArIHRoaXMuY29vcmRzLmxlZnQgLSBuYXRpdmVQYXJlbnRFbGVtZW50LnNjcm9sbExlZnQ7XHJcbiAgICAgIC8vIGdldENyZXRDb29yZGluYXRlcygpIGZvciB0ZXh0L2lucHV0IGVsZW1lbnRzIG5lZWRzIGFuIGFkZGl0aW9uYWwgb2Zmc2V0IHRvIHBvc2l0aW9uIHRoZSBsaXN0IGNvcnJlY3RseVxyXG4gICAgICB0aGlzLm9mZnNldCA9IHRoaXMuZ2V0QmxvY2tDdXJzb3JEaW1lbnNpb25zKG5hdGl2ZVBhcmVudEVsZW1lbnQpLmhlaWdodDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlmcmFtZSkge1xyXG4gICAgICBsZXQgY29udGV4dDogeyBpZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50LCBwYXJlbnQ6IEVsZW1lbnQgfSA9IHsgaWZyYW1lOiBpZnJhbWUsIHBhcmVudDogaWZyYW1lLm9mZnNldFBhcmVudCB9O1xyXG4gICAgICB0aGlzLmNvb3JkcyA9IGdldENvbnRlbnRFZGl0YWJsZUNhcmV0Q29vcmRzKGNvbnRleHQpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGxldCBkb2MgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgICAgIGxldCBzY3JvbGxMZWZ0ID0gKHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2Muc2Nyb2xsTGVmdCkgLSAoZG9jLmNsaWVudExlZnQgfHwgMCk7XHJcbiAgICAgIGxldCBzY3JvbGxUb3AgPSAod2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvYy5zY3JvbGxUb3ApIC0gKGRvYy5jbGllbnRUb3AgfHwgMCk7XHJcbiAgICAgIC8vIGJvdW5kaW5nIHJlY3RhbmdsZXMgYXJlIHJlbGF0aXZlIHRvIHZpZXcsIG9mZnNldHMgYXJlIHJlbGF0aXZlIHRvIGNvbnRhaW5lcj9cclxuICAgICAgbGV0IGNhcmV0UmVsYXRpdmVUb1ZpZXcgPSBnZXRDb250ZW50RWRpdGFibGVDYXJldENvb3Jkcyh7IGlmcmFtZTogaWZyYW1lIH0pO1xyXG4gICAgICBsZXQgcGFyZW50UmVsYXRpdmVUb0NvbnRhaW5lcjogQ2xpZW50UmVjdCA9IG5hdGl2ZVBhcmVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgIHRoaXMuY29vcmRzLnRvcCA9IGNhcmV0UmVsYXRpdmVUb1ZpZXcudG9wIC0gcGFyZW50UmVsYXRpdmVUb0NvbnRhaW5lci50b3AgKyBuYXRpdmVQYXJlbnRFbGVtZW50Lm9mZnNldFRvcCAtIHNjcm9sbFRvcDtcclxuICAgICAgdGhpcy5jb29yZHMubGVmdCA9IGNhcmV0UmVsYXRpdmVUb1ZpZXcubGVmdCAtIHBhcmVudFJlbGF0aXZlVG9Db250YWluZXIubGVmdCArIG5hdGl2ZVBhcmVudEVsZW1lbnQub2Zmc2V0TGVmdCAtIHNjcm9sbExlZnQ7XHJcbiAgICB9XHJcbiAgICAvLyBzZXQgdGhlIGRlZmF1bHQvaW5pdGFsIHBvc2l0aW9uXHJcbiAgICB0aGlzLnBvc2l0aW9uRWxlbWVudCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGFjdGl2ZUl0ZW0oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pdGVtc1t0aGlzLmFjdGl2ZUluZGV4XTtcclxuICB9XHJcblxyXG4gIGFjdGl2YXRlTmV4dEl0ZW0oKSB7XHJcbiAgICAvLyBhZGp1c3Qgc2Nyb2xsYWJsZS1tZW51IG9mZnNldCBpZiB0aGUgbmV4dCBpdGVtIGlzIG91dCBvZiB2aWV3XHJcbiAgICBsZXQgbGlzdEVsOiBIVE1MRWxlbWVudCA9IHRoaXMubGlzdC5uYXRpdmVFbGVtZW50O1xyXG4gICAgbGV0IGFjdGl2ZUVsID0gbGlzdEVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2FjdGl2ZScpLml0ZW0oMCk7XHJcbiAgICBpZiAoYWN0aXZlRWwpIHtcclxuICAgICAgbGV0IG5leHRMaUVsOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD4gYWN0aXZlRWwubmV4dFNpYmxpbmc7XHJcbiAgICAgIGlmIChuZXh0TGlFbCAmJiBuZXh0TGlFbC5ub2RlTmFtZSA9PSBcIkxJXCIpIHtcclxuICAgICAgICBsZXQgbmV4dExpUmVjdDogQ2xpZW50UmVjdCA9IG5leHRMaUVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGlmIChuZXh0TGlSZWN0LmJvdHRvbSA+IGxpc3RFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b20pIHtcclxuICAgICAgICAgIGxpc3RFbC5zY3JvbGxUb3AgPSBuZXh0TGlFbC5vZmZzZXRUb3AgKyBuZXh0TGlSZWN0LmhlaWdodCAtIGxpc3RFbC5jbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBzZWxlY3QgdGhlIG5leHQgaXRlbVxyXG4gICAgdGhpcy5hY3RpdmVJbmRleCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuYWN0aXZlSW5kZXggKyAxLCB0aGlzLml0ZW1zLmxlbmd0aCAtIDEpLCAwKTtcclxuICB9XHJcblxyXG4gIGFjdGl2YXRlUHJldmlvdXNJdGVtKCkge1xyXG4gICAgLy8gYWRqdXN0IHRoZSBzY3JvbGxhYmxlLW1lbnUgb2Zmc2V0IGlmIHRoZSBwcmV2aW91cyBpdGVtIGlzIG91dCBvZiB2aWV3XHJcbiAgICBsZXQgbGlzdEVsOiBIVE1MRWxlbWVudCA9IHRoaXMubGlzdC5uYXRpdmVFbGVtZW50O1xyXG4gICAgbGV0IGFjdGl2ZUVsID0gbGlzdEVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2FjdGl2ZScpLml0ZW0oMCk7XHJcbiAgICBpZiAoYWN0aXZlRWwpIHtcclxuICAgICAgbGV0IHByZXZMaUVsOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD4gYWN0aXZlRWwucHJldmlvdXNTaWJsaW5nO1xyXG4gICAgICBpZiAocHJldkxpRWwgJiYgcHJldkxpRWwubm9kZU5hbWUgPT0gXCJMSVwiKSB7XHJcbiAgICAgICAgbGV0IHByZXZMaVJlY3Q6IENsaWVudFJlY3QgPSBwcmV2TGlFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBpZiAocHJldkxpUmVjdC50b3AgPCBsaXN0RWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wKSB7XHJcbiAgICAgICAgICBsaXN0RWwuc2Nyb2xsVG9wID0gcHJldkxpRWwub2Zmc2V0VG9wO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gc2VsZWN0IHRoZSBwcmV2aW91cyBpdGVtXHJcbiAgICB0aGlzLmFjdGl2ZUluZGV4ID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5hY3RpdmVJbmRleCAtIDEsIHRoaXMuaXRlbXMubGVuZ3RoIC0gMSksIDApO1xyXG4gIH1cclxuXHJcbiAgLy8gcmVzZXQgZm9yIGEgbmV3IG1lbnRpb24gc2VhcmNoXHJcbiAgcmVzZXQoKSB7XHJcbiAgICB0aGlzLmxpc3QubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgPSAwO1xyXG4gICAgdGhpcy5jaGVja0JvdW5kcygpO1xyXG4gIH1cclxuXHJcbiAgLy8gZmluYWwgcG9zaXRpb25pbmcgaXMgZG9uZSBhZnRlciB0aGUgbGlzdCBpcyBzaG93biAoYW5kIHRoZSBoZWlnaHQgYW5kIHdpZHRoIGFyZSBrbm93bilcclxuICAvLyBlbnN1cmUgaXQncyBpbiB0aGUgcGFnZSBib3VuZHNcclxuICBwcml2YXRlIGNoZWNrQm91bmRzKCkge1xyXG4gICAgbGV0IGxlZnQgPSB0aGlzLmNvb3Jkcy5sZWZ0LCB0b3AgPSB0aGlzLmNvb3Jkcy50b3AsIGRyb3BVcCA9IHRoaXMuZHJvcFVwO1xyXG4gICAgY29uc3QgYm91bmRzOiBDbGllbnRSZWN0ID0gdGhpcy5saXN0Lm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAvLyBpZiBvZmYgcmlnaHQgb2YgcGFnZSwgYWxpZ24gcmlnaHRcclxuICAgIGlmIChib3VuZHMubGVmdCArIGJvdW5kcy53aWR0aCA+IHdpbmRvdy5pbm5lcldpZHRoKSB7XHJcbiAgICAgIGxlZnQgLT0gYm91bmRzLmxlZnQgKyBib3VuZHMud2lkdGggLSB3aW5kb3cuaW5uZXJXaWR0aCArIDEwO1xyXG4gICAgfVxyXG4gICAgLy8gaWYgbW9yZSB0aGFuIGhhbGYgb2ZmIHRoZSBib3R0b20gb2YgdGhlIHBhZ2UsIGZvcmNlIGRyb3BVcFxyXG4gICAgLy8gaWYgKChib3VuZHMudG9wK2JvdW5kcy5oZWlnaHQvMik+d2luZG93LmlubmVySGVpZ2h0KSB7XHJcbiAgICAvLyAgIGRyb3BVcCA9IHRydWU7XHJcbiAgICAvLyB9XHJcbiAgICAvLyBpZiB0b3AgaXMgb2ZmIHBhZ2UsIGRpc2FibGUgZHJvcFVwXHJcbiAgICBpZiAoYm91bmRzLnRvcDwwKSB7XHJcbiAgICAgIGRyb3BVcCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLy8gc2V0IHRoZSByZXZpc2VkL2ZpbmFsIHBvc2l0aW9uXHJcbiAgICB0aGlzLnBvc2l0aW9uRWxlbWVudChsZWZ0LCB0b3AsIGRyb3BVcCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBvc2l0aW9uRWxlbWVudChsZWZ0Om51bWJlcj10aGlzLmNvb3Jkcy5sZWZ0LCB0b3A6bnVtYmVyPXRoaXMuY29vcmRzLnRvcCwgZHJvcFVwOmJvb2xlYW49dGhpcy5kcm9wVXApIHtcclxuICAgIGNvbnN0IGVsOiBIVE1MRWxlbWVudCA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50O1xyXG4gICAgdG9wICs9IGRyb3BVcCA/IDAgOiB0aGlzLm9mZnNldDsgLy8gdG9wIG9mIGxpc3QgaXMgbmV4dCBsaW5lXHJcbiAgICBlbC5jbGFzc05hbWUgPSBkcm9wVXAgPyAnZHJvcHVwJyA6IG51bGw7XHJcbiAgICBlbC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgIGVsLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcclxuICAgIGVsLnN0eWxlLnRvcCA9IHRvcCArICdweCc7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldEJsb2NrQ3Vyc29yRGltZW5zaW9ucyhuYXRpdmVQYXJlbnRFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50KSB7XHJcbiAgICBjb25zdCBwYXJlbnRTdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShuYXRpdmVQYXJlbnRFbGVtZW50KTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGhlaWdodDogcGFyc2VGbG9hdChwYXJlbnRTdHlsZXMubGluZUhlaWdodCksXHJcbiAgICAgIHdpZHRoOiBwYXJzZUZsb2F0KHBhcmVudFN0eWxlcy5mb250U2l6ZSlcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiJdfQ==