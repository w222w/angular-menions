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
export class MentionListComponent {
    /**
     * @param {?} element
     */
    constructor(element) {
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
    ngOnInit() {
        if (!this.itemTemplate) {
            this.itemTemplate = this.defaultItemTemplate;
        }
    }
    // lots of confusion here between relative coordinates and containers
    /**
     * @param {?} nativeParentElement
     * @param {?=} iframe
     * @return {?}
     */
    position(nativeParentElement, iframe = null) {
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
            let context = { iframe: iframe, parent: iframe.offsetParent };
            this.coords = getContentEditableCaretCoords(context);
        }
        else {
            /** @type {?} */
            let doc = document.documentElement;
            /** @type {?} */
            let scrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
            /** @type {?} */
            let scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
            // bounding rectangles are relative to view, offsets are relative to container?
            /** @type {?} */
            let caretRelativeToView = getContentEditableCaretCoords({ iframe: iframe });
            /** @type {?} */
            let parentRelativeToContainer = nativeParentElement.getBoundingClientRect();
            this.coords.top = caretRelativeToView.top - parentRelativeToContainer.top + nativeParentElement.offsetTop - scrollTop;
            this.coords.left = caretRelativeToView.left - parentRelativeToContainer.left + nativeParentElement.offsetLeft - scrollLeft;
        }
        // set the default/inital position
        this.positionElement();
    }
    /**
     * @return {?}
     */
    get activeItem() {
        return this.items[this.activeIndex];
    }
    /**
     * @return {?}
     */
    activateNextItem() {
        // adjust scrollable-menu offset if the next item is out of view
        /** @type {?} */
        let listEl = this.list.nativeElement;
        /** @type {?} */
        let activeEl = listEl.getElementsByClassName('active').item(0);
        if (activeEl) {
            /** @type {?} */
            let nextLiEl = (/** @type {?} */ (activeEl.nextSibling));
            if (nextLiEl && nextLiEl.nodeName == "LI") {
                /** @type {?} */
                let nextLiRect = nextLiEl.getBoundingClientRect();
                if (nextLiRect.bottom > listEl.getBoundingClientRect().bottom) {
                    listEl.scrollTop = nextLiEl.offsetTop + nextLiRect.height - listEl.clientHeight;
                }
            }
        }
        // select the next item
        this.activeIndex = Math.max(Math.min(this.activeIndex + 1, this.items.length - 1), 0);
    }
    /**
     * @return {?}
     */
    activatePreviousItem() {
        // adjust the scrollable-menu offset if the previous item is out of view
        /** @type {?} */
        let listEl = this.list.nativeElement;
        /** @type {?} */
        let activeEl = listEl.getElementsByClassName('active').item(0);
        if (activeEl) {
            /** @type {?} */
            let prevLiEl = (/** @type {?} */ (activeEl.previousSibling));
            if (prevLiEl && prevLiEl.nodeName == "LI") {
                /** @type {?} */
                let prevLiRect = prevLiEl.getBoundingClientRect();
                if (prevLiRect.top < listEl.getBoundingClientRect().top) {
                    listEl.scrollTop = prevLiEl.offsetTop;
                }
            }
        }
        // select the previous item
        this.activeIndex = Math.max(Math.min(this.activeIndex - 1, this.items.length - 1), 0);
    }
    // reset for a new mention search
    /**
     * @return {?}
     */
    reset() {
        this.list.nativeElement.scrollTop = 0;
        this.checkBounds();
    }
    // final positioning is done after the list is shown (and the height and width are known)
    // ensure it's in the page bounds
    /**
     * @private
     * @return {?}
     */
    checkBounds() {
        /** @type {?} */
        let left = this.coords.left;
        /** @type {?} */
        let top = this.coords.top;
        /** @type {?} */
        let dropUp = this.dropUp;
        /** @type {?} */
        const bounds = this.list.nativeElement.getBoundingClientRect();
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
    }
    /**
     * @private
     * @param {?=} left
     * @param {?=} top
     * @param {?=} dropUp
     * @return {?}
     */
    positionElement(left = this.coords.left, top = this.coords.top, dropUp = this.dropUp) {
        /** @type {?} */
        const el = this.element.nativeElement;
        top += dropUp ? 0 : this.offset; // top of list is next line
        el.className = dropUp ? 'dropup' : null;
        el.style.position = "absolute";
        el.style.left = left + 'px';
        el.style.top = top + 'px';
    }
    /**
     * @private
     * @param {?} nativeParentElement
     * @return {?}
     */
    getBlockCursorDimensions(nativeParentElement) {
        /** @type {?} */
        const parentStyles = window.getComputedStyle(nativeParentElement);
        return {
            height: parseFloat(parentStyles.lineHeight),
            width: parseFloat(parentStyles.fontSize)
        };
    }
}
MentionListComponent.decorators = [
    { type: Component, args: [{
                selector: 'mention-list',
                template: `
    <ng-template #defaultItemTemplate let-item="item">
      {{item[labelKey]}}
    </ng-template>
    <ul #list [hidden]="hidden" class="dropdown-menu scrollable-menu"
      [class.mention-menu]="!styleOff" [class.mention-dropdown]="!styleOff && dropUp">
      <li *ngFor="let item of items; let i = index"
        [class.active]="activeIndex==i" [class.mention-active]="!styleOff && activeIndex==i">
        <a class="dropdown-item" [class.mention-item]="!styleOff"
          (mousedown)="activeIndex=i;itemClick.emit();$event.preventDefault()"
          (tap)="activeIndex=i;itemClick.emit();$event.preventDefault()"
          >
          <ng-template [ngTemplateOutlet]="itemTemplate" [ngTemplateOutletContext]="{'item':item}"></ng-template>
        </a>
      </li>
    </ul>
    `,
                styles: [".mention-menu{position:absolute;top:100%;left:0;z-index:1000;display:none;float:left;min-width:11em;padding:.5em 0;margin:.125em 0 0;font-size:1em;color:#212529;text-align:left;list-style:none;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,.15);border-radius:.25em}.mention-item{display:block;padding:.2em 1.5em;line-height:1.5em;clear:both;font-weight:400;color:#212529;text-align:inherit;white-space:nowrap;background-color:transparent;border:0}.mention-active>a{color:#fff;text-decoration:none;background-color:#337ab7;outline:0}.scrollable-menu{display:block;height:auto;max-height:292px;overflow:auto}[hidden]{display:none}.mention-dropdown{bottom:100%;top:auto;margin-bottom:2px}"]
            }] }
];
/** @nocollapse */
MentionListComponent.ctorParameters = () => [
    { type: ElementRef }
];
MentionListComponent.propDecorators = {
    labelKey: [{ type: Input }],
    itemTemplate: [{ type: Input }],
    itemClick: [{ type: Output }],
    list: [{ type: ViewChild, args: ['list',] }],
    defaultItemTemplate: [{ type: ViewChild, args: ['defaultItemTemplate',] }]
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudGlvbi1saXN0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItbWVudGlvbnMvIiwic291cmNlcyI6WyJsaWIvbWVudGlvbi1saXN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFDM0UsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLHdCQUF3QixFQUFFLDZCQUE2QixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDMUYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7Ozs7QUE2QnJELE1BQU0sT0FBTyxvQkFBb0I7Ozs7SUFhL0IsWUFBb0IsT0FBbUI7UUFBbkIsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQVo5QixhQUFRLEdBQVcsT0FBTyxDQUFDO1FBRTFCLGNBQVMsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBR3pDLFVBQUssR0FBRyxFQUFFLENBQUM7UUFDWCxnQkFBVyxHQUFXLENBQUMsQ0FBQztRQUN4QixXQUFNLEdBQVksS0FBSyxDQUFDO1FBQ3hCLFdBQU0sR0FBWSxLQUFLLENBQUM7UUFDeEIsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUNsQixXQUFNLEdBQThCLEVBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxFQUFDLENBQUM7UUFDcEQsV0FBTSxHQUFXLENBQUMsQ0FBQztJQUNlLENBQUM7Ozs7SUFFM0MsUUFBUTtRQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDO1NBQzlDO0lBQ0gsQ0FBQzs7Ozs7OztJQUdELFFBQVEsQ0FBQyxtQkFBcUMsRUFBRSxTQUE0QixJQUFJO1FBQzlFLElBQUksd0JBQXdCLENBQUMsbUJBQW1CLENBQUMsRUFBRTtZQUNqRCw4RUFBOEU7WUFDOUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQyxtQkFBbUIsRUFBRSxtQkFBbUIsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDakcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsbUJBQW1CLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLG1CQUFtQixDQUFDLFNBQVMsQ0FBQztZQUNsRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsbUJBQW1CLENBQUMsVUFBVSxDQUFDO1lBQ3RHLHlHQUF5RztZQUN6RyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQztTQUN6RTthQUNJLElBQUksTUFBTSxFQUFFOztnQkFDWCxPQUFPLEdBQW1ELEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLFlBQVksRUFBRTtZQUM3RyxJQUFJLENBQUMsTUFBTSxHQUFHLDZCQUE2QixDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3REO2FBQ0k7O2dCQUNDLEdBQUcsR0FBRyxRQUFRLENBQUMsZUFBZTs7Z0JBQzlCLFVBQVUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUM7O2dCQUMzRSxTQUFTLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDOzs7Z0JBRXhFLG1CQUFtQixHQUFHLDZCQUE2QixDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDOztnQkFDdkUseUJBQXlCLEdBQWUsbUJBQW1CLENBQUMscUJBQXFCLEVBQUU7WUFDdkYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsbUJBQW1CLENBQUMsR0FBRyxHQUFHLHlCQUF5QixDQUFDLEdBQUcsR0FBRyxtQkFBbUIsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1lBQ3RILElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLG1CQUFtQixDQUFDLElBQUksR0FBRyx5QkFBeUIsQ0FBQyxJQUFJLEdBQUcsbUJBQW1CLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztTQUM1SDtRQUNELGtDQUFrQztRQUNsQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDekIsQ0FBQzs7OztJQUVELElBQUksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdEMsQ0FBQzs7OztJQUVELGdCQUFnQjs7O1lBRVYsTUFBTSxHQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWE7O1lBQzdDLFFBQVEsR0FBRyxNQUFNLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM5RCxJQUFJLFFBQVEsRUFBRTs7Z0JBQ1IsUUFBUSxHQUFnQixtQkFBYyxRQUFRLENBQUMsV0FBVyxFQUFBO1lBQzlELElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxRQUFRLElBQUksSUFBSSxFQUFFOztvQkFDckMsVUFBVSxHQUFlLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtnQkFDN0QsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLE1BQU0sRUFBRTtvQkFDN0QsTUFBTSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztpQkFDakY7YUFDRjtTQUNGO1FBQ0QsdUJBQXVCO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7Ozs7SUFFRCxvQkFBb0I7OztZQUVkLE1BQU0sR0FBZ0IsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhOztZQUM3QyxRQUFRLEdBQUcsTUFBTSxDQUFDLHNCQUFzQixDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDOUQsSUFBSSxRQUFRLEVBQUU7O2dCQUNSLFFBQVEsR0FBZ0IsbUJBQWMsUUFBUSxDQUFDLGVBQWUsRUFBQTtZQUNsRSxJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTs7b0JBQ3JDLFVBQVUsR0FBZSxRQUFRLENBQUMscUJBQXFCLEVBQUU7Z0JBQzdELElBQUksVUFBVSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxHQUFHLEVBQUU7b0JBQ3ZELE1BQU0sQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztpQkFDdkM7YUFDRjtTQUNGO1FBQ0QsMkJBQTJCO1FBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7Ozs7O0lBR0QsS0FBSztRQUNILElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7Ozs7Ozs7SUFJTyxXQUFXOztZQUNiLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUk7O1lBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRzs7WUFBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU07O2NBQ2xFLE1BQU0sR0FBZSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRTtRQUMxRSxvQ0FBb0M7UUFDcEMsSUFBSSxNQUFNLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRTtZQUNsRCxJQUFJLElBQUksTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO1NBQzdEO1FBQ0QsNkRBQTZEO1FBQzdELHlEQUF5RDtRQUN6RCxtQkFBbUI7UUFDbkIsSUFBSTtRQUNKLHFDQUFxQztRQUNyQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEdBQUMsQ0FBQyxFQUFFO1lBQ2hCLE1BQU0sR0FBRyxLQUFLLENBQUM7U0FDaEI7UUFDRCxpQ0FBaUM7UUFDakMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzFDLENBQUM7Ozs7Ozs7O0lBRU8sZUFBZSxDQUFDLE9BQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxTQUFlLElBQUksQ0FBQyxNQUFNOztjQUNwRyxFQUFFLEdBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYTtRQUNsRCxHQUFHLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQywyQkFBMkI7UUFDNUQsRUFBRSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUMvQixFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQzVCLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7SUFDNUIsQ0FBQzs7Ozs7O0lBRU8sd0JBQXdCLENBQUMsbUJBQXFDOztjQUM5RCxZQUFZLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDO1FBQ2pFLE9BQU87WUFDTCxNQUFNLEVBQUUsVUFBVSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7WUFDM0MsS0FBSyxFQUFFLFVBQVUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDO1NBQ3pDLENBQUM7SUFDSixDQUFDOzs7WUF0SkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUV4QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7S0FnQlA7O2FBQ0o7Ozs7WUFoQ1ksVUFBVTs7O3VCQWtDcEIsS0FBSzsyQkFDTCxLQUFLO3dCQUNMLE1BQU07bUJBQ04sU0FBUyxTQUFDLE1BQU07a0NBQ2hCLFNBQVMsU0FBQyxxQkFBcUI7Ozs7SUFKaEMsd0NBQW9DOztJQUNwQyw0Q0FBd0M7O0lBQ3hDLHlDQUF5Qzs7SUFDekMsb0NBQW9DOztJQUNwQyxtREFBd0U7O0lBQ3hFLHFDQUFXOztJQUNYLDJDQUF3Qjs7SUFDeEIsc0NBQXdCOztJQUN4QixzQ0FBd0I7O0lBQ3hCLHdDQUEwQjs7Ozs7SUFDMUIsc0NBQTREOzs7OztJQUM1RCxzQ0FBMkI7Ozs7O0lBQ2YsdUNBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDb21wb25lbnQsIEVsZW1lbnRSZWYsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBWaWV3Q2hpbGQsIElucHV0LCBUZW1wbGF0ZVJlZiwgT25Jbml0XHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBpc0lucHV0T3JUZXh0QXJlYUVsZW1lbnQsIGdldENvbnRlbnRFZGl0YWJsZUNhcmV0Q29vcmRzIH0gZnJvbSAnLi9tZW50aW9uLXV0aWxzJztcclxuaW1wb3J0IHsgZ2V0Q2FyZXRDb29yZGluYXRlcyB9IGZyb20gJy4vY2FyZXQtY29vcmRzJztcclxuXHJcbi8qKlxyXG4gKiBBbmd1bGFyIE1lbnRpb25zLlxyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdzIyMncvYW5ndWxhci1tZW50aW9uc1xyXG4gKlxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYgRGFuIE1hY0ZhcmxhbmVcclxuICovXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbWVudGlvbi1saXN0JyxcclxuICBzdHlsZVVybHM6IFsnLi9tZW50aW9uLWxpc3QuY29tcG9uZW50LnNjc3MnXSxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPG5nLXRlbXBsYXRlICNkZWZhdWx0SXRlbVRlbXBsYXRlIGxldC1pdGVtPVwiaXRlbVwiPlxyXG4gICAgICB7e2l0ZW1bbGFiZWxLZXldfX1cclxuICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICA8dWwgI2xpc3QgW2hpZGRlbl09XCJoaWRkZW5cIiBjbGFzcz1cImRyb3Bkb3duLW1lbnUgc2Nyb2xsYWJsZS1tZW51XCJcclxuICAgICAgW2NsYXNzLm1lbnRpb24tbWVudV09XCIhc3R5bGVPZmZcIiBbY2xhc3MubWVudGlvbi1kcm9wZG93bl09XCIhc3R5bGVPZmYgJiYgZHJvcFVwXCI+XHJcbiAgICAgIDxsaSAqbmdGb3I9XCJsZXQgaXRlbSBvZiBpdGVtczsgbGV0IGkgPSBpbmRleFwiXHJcbiAgICAgICAgW2NsYXNzLmFjdGl2ZV09XCJhY3RpdmVJbmRleD09aVwiIFtjbGFzcy5tZW50aW9uLWFjdGl2ZV09XCIhc3R5bGVPZmYgJiYgYWN0aXZlSW5kZXg9PWlcIj5cclxuICAgICAgICA8YSBjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIiBbY2xhc3MubWVudGlvbi1pdGVtXT1cIiFzdHlsZU9mZlwiXHJcbiAgICAgICAgICAobW91c2Vkb3duKT1cImFjdGl2ZUluZGV4PWk7aXRlbUNsaWNrLmVtaXQoKTskZXZlbnQucHJldmVudERlZmF1bHQoKVwiXG4gICAgICAgICAgKHRhcCk9XCJhY3RpdmVJbmRleD1pO2l0ZW1DbGljay5lbWl0KCk7JGV2ZW50LnByZXZlbnREZWZhdWx0KClcIlxuICAgICAgICAgID5cclxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJpdGVtVGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieydpdGVtJzppdGVtfVwiPjwvbmctdGVtcGxhdGU+XHJcbiAgICAgICAgPC9hPlxyXG4gICAgICA8L2xpPlxyXG4gICAgPC91bD5cclxuICAgIGBcclxufSlcclxuZXhwb3J0IGNsYXNzIE1lbnRpb25MaXN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBASW5wdXQoKSBsYWJlbEtleTogc3RyaW5nID0gJ2xhYmVsJztcclxuICBASW5wdXQoKSBpdGVtVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQE91dHB1dCgpIGl0ZW1DbGljayA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAVmlld0NoaWxkKCdsaXN0JykgbGlzdDogRWxlbWVudFJlZjtcclxuICBAVmlld0NoaWxkKCdkZWZhdWx0SXRlbVRlbXBsYXRlJykgZGVmYXVsdEl0ZW1UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBpdGVtcyA9IFtdO1xyXG4gIGFjdGl2ZUluZGV4OiBudW1iZXIgPSAwO1xyXG4gIGhpZGRlbjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGRyb3BVcDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHN0eWxlT2ZmOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHJpdmF0ZSBjb29yZHM6IHt0b3A6bnVtYmVyLCBsZWZ0Om51bWJlcn0gPSB7dG9wOjAsIGxlZnQ6MH07XHJcbiAgcHJpdmF0ZSBvZmZzZXQ6IG51bWJlciA9IDA7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmKSB7fVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIGlmICghdGhpcy5pdGVtVGVtcGxhdGUpIHtcclxuICAgICAgdGhpcy5pdGVtVGVtcGxhdGUgPSB0aGlzLmRlZmF1bHRJdGVtVGVtcGxhdGU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBsb3RzIG9mIGNvbmZ1c2lvbiBoZXJlIGJldHdlZW4gcmVsYXRpdmUgY29vcmRpbmF0ZXMgYW5kIGNvbnRhaW5lcnNcclxuICBwb3NpdGlvbihuYXRpdmVQYXJlbnRFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50LCBpZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50ID0gbnVsbCkge1xyXG4gICAgaWYgKGlzSW5wdXRPclRleHRBcmVhRWxlbWVudChuYXRpdmVQYXJlbnRFbGVtZW50KSkge1xyXG4gICAgICAvLyBwYXJlbnQgZWxlbWVudHMgbmVlZCB0byBoYXZlIHBvc3RpdGlvbjpyZWxhdGl2ZSBmb3IgdGhpcyB0byB3b3JrIGNvcnJlY3RseT9cclxuICAgICAgdGhpcy5jb29yZHMgPSBnZXRDYXJldENvb3JkaW5hdGVzKG5hdGl2ZVBhcmVudEVsZW1lbnQsIG5hdGl2ZVBhcmVudEVsZW1lbnQuc2VsZWN0aW9uU3RhcnQsIG51bGwpO1xyXG4gICAgICB0aGlzLmNvb3Jkcy50b3AgPSBuYXRpdmVQYXJlbnRFbGVtZW50Lm9mZnNldFRvcCArIHRoaXMuY29vcmRzLnRvcCAtIG5hdGl2ZVBhcmVudEVsZW1lbnQuc2Nyb2xsVG9wO1xyXG4gICAgICB0aGlzLmNvb3Jkcy5sZWZ0ID0gbmF0aXZlUGFyZW50RWxlbWVudC5vZmZzZXRMZWZ0ICsgdGhpcy5jb29yZHMubGVmdCAtIG5hdGl2ZVBhcmVudEVsZW1lbnQuc2Nyb2xsTGVmdDtcclxuICAgICAgLy8gZ2V0Q3JldENvb3JkaW5hdGVzKCkgZm9yIHRleHQvaW5wdXQgZWxlbWVudHMgbmVlZHMgYW4gYWRkaXRpb25hbCBvZmZzZXQgdG8gcG9zaXRpb24gdGhlIGxpc3QgY29ycmVjdGx5XHJcbiAgICAgIHRoaXMub2Zmc2V0ID0gdGhpcy5nZXRCbG9ja0N1cnNvckRpbWVuc2lvbnMobmF0aXZlUGFyZW50RWxlbWVudCkuaGVpZ2h0O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaWZyYW1lKSB7XHJcbiAgICAgIGxldCBjb250ZXh0OiB7IGlmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQsIHBhcmVudDogRWxlbWVudCB9ID0geyBpZnJhbWU6IGlmcmFtZSwgcGFyZW50OiBpZnJhbWUub2Zmc2V0UGFyZW50IH07XHJcbiAgICAgIHRoaXMuY29vcmRzID0gZ2V0Q29udGVudEVkaXRhYmxlQ2FyZXRDb29yZHMoY29udGV4dCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgbGV0IGRvYyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICAgICAgbGV0IHNjcm9sbExlZnQgPSAod2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvYy5zY3JvbGxMZWZ0KSAtIChkb2MuY2xpZW50TGVmdCB8fCAwKTtcclxuICAgICAgbGV0IHNjcm9sbFRvcCA9ICh3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jLnNjcm9sbFRvcCkgLSAoZG9jLmNsaWVudFRvcCB8fCAwKTtcclxuICAgICAgLy8gYm91bmRpbmcgcmVjdGFuZ2xlcyBhcmUgcmVsYXRpdmUgdG8gdmlldywgb2Zmc2V0cyBhcmUgcmVsYXRpdmUgdG8gY29udGFpbmVyP1xyXG4gICAgICBsZXQgY2FyZXRSZWxhdGl2ZVRvVmlldyA9IGdldENvbnRlbnRFZGl0YWJsZUNhcmV0Q29vcmRzKHsgaWZyYW1lOiBpZnJhbWUgfSk7XHJcbiAgICAgIGxldCBwYXJlbnRSZWxhdGl2ZVRvQ29udGFpbmVyOiBDbGllbnRSZWN0ID0gbmF0aXZlUGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgdGhpcy5jb29yZHMudG9wID0gY2FyZXRSZWxhdGl2ZVRvVmlldy50b3AgLSBwYXJlbnRSZWxhdGl2ZVRvQ29udGFpbmVyLnRvcCArIG5hdGl2ZVBhcmVudEVsZW1lbnQub2Zmc2V0VG9wIC0gc2Nyb2xsVG9wO1xyXG4gICAgICB0aGlzLmNvb3Jkcy5sZWZ0ID0gY2FyZXRSZWxhdGl2ZVRvVmlldy5sZWZ0IC0gcGFyZW50UmVsYXRpdmVUb0NvbnRhaW5lci5sZWZ0ICsgbmF0aXZlUGFyZW50RWxlbWVudC5vZmZzZXRMZWZ0IC0gc2Nyb2xsTGVmdDtcclxuICAgIH1cclxuICAgIC8vIHNldCB0aGUgZGVmYXVsdC9pbml0YWwgcG9zaXRpb25cclxuICAgIHRoaXMucG9zaXRpb25FbGVtZW50KCk7XHJcbiAgfVxyXG5cclxuICBnZXQgYWN0aXZlSXRlbSgpIHtcclxuICAgIHJldHVybiB0aGlzLml0ZW1zW3RoaXMuYWN0aXZlSW5kZXhdO1xyXG4gIH1cclxuXHJcbiAgYWN0aXZhdGVOZXh0SXRlbSgpIHtcclxuICAgIC8vIGFkanVzdCBzY3JvbGxhYmxlLW1lbnUgb2Zmc2V0IGlmIHRoZSBuZXh0IGl0ZW0gaXMgb3V0IG9mIHZpZXdcclxuICAgIGxldCBsaXN0RWw6IEhUTUxFbGVtZW50ID0gdGhpcy5saXN0Lm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICBsZXQgYWN0aXZlRWwgPSBsaXN0RWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYWN0aXZlJykuaXRlbSgwKTtcclxuICAgIGlmIChhY3RpdmVFbCkge1xyXG4gICAgICBsZXQgbmV4dExpRWw6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PiBhY3RpdmVFbC5uZXh0U2libGluZztcclxuICAgICAgaWYgKG5leHRMaUVsICYmIG5leHRMaUVsLm5vZGVOYW1lID09IFwiTElcIikge1xyXG4gICAgICAgIGxldCBuZXh0TGlSZWN0OiBDbGllbnRSZWN0ID0gbmV4dExpRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgaWYgKG5leHRMaVJlY3QuYm90dG9tID4gbGlzdEVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbSkge1xyXG4gICAgICAgICAgbGlzdEVsLnNjcm9sbFRvcCA9IG5leHRMaUVsLm9mZnNldFRvcCArIG5leHRMaVJlY3QuaGVpZ2h0IC0gbGlzdEVsLmNsaWVudEhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIHNlbGVjdCB0aGUgbmV4dCBpdGVtXHJcbiAgICB0aGlzLmFjdGl2ZUluZGV4ID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5hY3RpdmVJbmRleCArIDEsIHRoaXMuaXRlbXMubGVuZ3RoIC0gMSksIDApO1xyXG4gIH1cclxuXHJcbiAgYWN0aXZhdGVQcmV2aW91c0l0ZW0oKSB7XHJcbiAgICAvLyBhZGp1c3QgdGhlIHNjcm9sbGFibGUtbWVudSBvZmZzZXQgaWYgdGhlIHByZXZpb3VzIGl0ZW0gaXMgb3V0IG9mIHZpZXdcclxuICAgIGxldCBsaXN0RWw6IEhUTUxFbGVtZW50ID0gdGhpcy5saXN0Lm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICBsZXQgYWN0aXZlRWwgPSBsaXN0RWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYWN0aXZlJykuaXRlbSgwKTtcclxuICAgIGlmIChhY3RpdmVFbCkge1xyXG4gICAgICBsZXQgcHJldkxpRWw6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PiBhY3RpdmVFbC5wcmV2aW91c1NpYmxpbmc7XHJcbiAgICAgIGlmIChwcmV2TGlFbCAmJiBwcmV2TGlFbC5ub2RlTmFtZSA9PSBcIkxJXCIpIHtcclxuICAgICAgICBsZXQgcHJldkxpUmVjdDogQ2xpZW50UmVjdCA9IHByZXZMaUVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGlmIChwcmV2TGlSZWN0LnRvcCA8IGxpc3RFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3ApIHtcclxuICAgICAgICAgIGxpc3RFbC5zY3JvbGxUb3AgPSBwcmV2TGlFbC5vZmZzZXRUb3A7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBzZWxlY3QgdGhlIHByZXZpb3VzIGl0ZW1cclxuICAgIHRoaXMuYWN0aXZlSW5kZXggPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLmFjdGl2ZUluZGV4IC0gMSwgdGhpcy5pdGVtcy5sZW5ndGggLSAxKSwgMCk7XHJcbiAgfVxyXG5cclxuICAvLyByZXNldCBmb3IgYSBuZXcgbWVudGlvbiBzZWFyY2hcclxuICByZXNldCgpIHtcclxuICAgIHRoaXMubGlzdC5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA9IDA7XHJcbiAgICB0aGlzLmNoZWNrQm91bmRzKCk7XHJcbiAgfVxyXG5cclxuICAvLyBmaW5hbCBwb3NpdGlvbmluZyBpcyBkb25lIGFmdGVyIHRoZSBsaXN0IGlzIHNob3duIChhbmQgdGhlIGhlaWdodCBhbmQgd2lkdGggYXJlIGtub3duKVxyXG4gIC8vIGVuc3VyZSBpdCdzIGluIHRoZSBwYWdlIGJvdW5kc1xyXG4gIHByaXZhdGUgY2hlY2tCb3VuZHMoKSB7XHJcbiAgICBsZXQgbGVmdCA9IHRoaXMuY29vcmRzLmxlZnQsIHRvcCA9IHRoaXMuY29vcmRzLnRvcCwgZHJvcFVwID0gdGhpcy5kcm9wVXA7XHJcbiAgICBjb25zdCBib3VuZHM6IENsaWVudFJlY3QgPSB0aGlzLmxpc3QubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIC8vIGlmIG9mZiByaWdodCBvZiBwYWdlLCBhbGlnbiByaWdodFxyXG4gICAgaWYgKGJvdW5kcy5sZWZ0ICsgYm91bmRzLndpZHRoID4gd2luZG93LmlubmVyV2lkdGgpIHtcclxuICAgICAgbGVmdCAtPSBib3VuZHMubGVmdCArIGJvdW5kcy53aWR0aCAtIHdpbmRvdy5pbm5lcldpZHRoICsgMTA7XHJcbiAgICB9XHJcbiAgICAvLyBpZiBtb3JlIHRoYW4gaGFsZiBvZmYgdGhlIGJvdHRvbSBvZiB0aGUgcGFnZSwgZm9yY2UgZHJvcFVwXHJcbiAgICAvLyBpZiAoKGJvdW5kcy50b3ArYm91bmRzLmhlaWdodC8yKT53aW5kb3cuaW5uZXJIZWlnaHQpIHtcclxuICAgIC8vICAgZHJvcFVwID0gdHJ1ZTtcclxuICAgIC8vIH1cclxuICAgIC8vIGlmIHRvcCBpcyBvZmYgcGFnZSwgZGlzYWJsZSBkcm9wVXBcclxuICAgIGlmIChib3VuZHMudG9wPDApIHtcclxuICAgICAgZHJvcFVwID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvLyBzZXQgdGhlIHJldmlzZWQvZmluYWwgcG9zaXRpb25cclxuICAgIHRoaXMucG9zaXRpb25FbGVtZW50KGxlZnQsIHRvcCwgZHJvcFVwKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcG9zaXRpb25FbGVtZW50KGxlZnQ6bnVtYmVyPXRoaXMuY29vcmRzLmxlZnQsIHRvcDpudW1iZXI9dGhpcy5jb29yZHMudG9wLCBkcm9wVXA6Ym9vbGVhbj10aGlzLmRyb3BVcCkge1xyXG4gICAgY29uc3QgZWw6IEhUTUxFbGVtZW50ID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICB0b3AgKz0gZHJvcFVwID8gMCA6IHRoaXMub2Zmc2V0OyAvLyB0b3Agb2YgbGlzdCBpcyBuZXh0IGxpbmVcclxuICAgIGVsLmNsYXNzTmFtZSA9IGRyb3BVcCA/ICdkcm9wdXAnIDogbnVsbDtcclxuICAgIGVsLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgZWwuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xyXG4gICAgZWwuc3R5bGUudG9wID0gdG9wICsgJ3B4JztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0QmxvY2tDdXJzb3JEaW1lbnNpb25zKG5hdGl2ZVBhcmVudEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQpIHtcclxuICAgIGNvbnN0IHBhcmVudFN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKG5hdGl2ZVBhcmVudEVsZW1lbnQpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaGVpZ2h0OiBwYXJzZUZsb2F0KHBhcmVudFN0eWxlcy5saW5lSGVpZ2h0KSxcclxuICAgICAgd2lkdGg6IHBhcnNlRmxvYXQocGFyZW50U3R5bGVzLmZvbnRTaXplKVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIl19