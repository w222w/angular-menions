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
export function getValue(el) {
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
export function insertValue(el, start, end, text, iframe, noRecursion) {
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
export function isInputOrTextAreaElement(el) {
    return el != null && (el.nodeName == 'INPUT' || el.nodeName == 'TEXTAREA');
}
;
/**
 * @param {?} el
 * @return {?}
 */
export function isTextElement(el) {
    return el != null && (el.nodeName == 'INPUT' || el.nodeName == 'TEXTAREA' || el.nodeName == '#text');
}
;
/**
 * @param {?} el
 * @param {?} pos
 * @param {?=} iframe
 * @return {?}
 */
export function setCaretPosition(el, pos, iframe) {
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
export function getCaretPosition(el, iframe) {
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
export function getContentEditableCaretCoords(ctx) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudGlvbi11dGlscy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItbWVudGlvbnMvIiwic291cmNlcyI6WyJsaWIvbWVudGlvbi11dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUdBLFNBQVMsUUFBUSxDQUFDLEVBQW9CLEVBQUUsS0FBVTtJQUNoRCxzREFBc0Q7SUFDdEQsSUFBSSx3QkFBd0IsQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNoQyxFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNsQjtTQUNJO1FBQ0gsRUFBRSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7S0FDeEI7QUFDSCxDQUFDOzs7OztBQUVELE1BQU0sVUFBVSxRQUFRLENBQUMsRUFBb0I7SUFDM0MsT0FBTyx3QkFBd0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQztBQUNsRSxDQUFDOzs7Ozs7Ozs7O0FBRUQsTUFBTSxVQUFVLFdBQVcsQ0FDekIsRUFBb0IsRUFDcEIsS0FBYSxFQUNiLEdBQVcsRUFDWCxJQUFZLEVBQ1osTUFBeUIsRUFDekIsV0FBNEI7SUFBNUIsNEJBQUEsRUFBQSxtQkFBNEI7SUFFNUIsd0VBQXdFO0lBQ3hFLElBQUksYUFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFOztZQUNqQixHQUFHLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUN0QixRQUFRLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM5RSxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDbkQ7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c291cmNlc0NvbnRlbnQiOlsiLy8gRE9NIGVsZW1lbnQgbWFuaXB1bGF0aW9uIGZ1bmN0aW9ucy4uLlxyXG4vL1xyXG5cclxuZnVuY3Rpb24gc2V0VmFsdWUoZWw6IEhUTUxJbnB1dEVsZW1lbnQsIHZhbHVlOiBhbnkpIHtcclxuICAvL2NvbnNvbGUubG9nKFwic2V0VmFsdWVcIiwgZWwubm9kZU5hbWUsIFwiW1wiK3ZhbHVlK1wiXVwiKTtcclxuICBpZiAoaXNJbnB1dE9yVGV4dEFyZWFFbGVtZW50KGVsKSkge1xyXG4gICAgZWwudmFsdWUgPSB2YWx1ZTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbC50ZXh0Q29udGVudCA9IHZhbHVlO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFZhbHVlKGVsOiBIVE1MSW5wdXRFbGVtZW50KSB7XHJcbiAgcmV0dXJuIGlzSW5wdXRPclRleHRBcmVhRWxlbWVudChlbCkgPyBlbC52YWx1ZSA6IGVsLnRleHRDb250ZW50O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0VmFsdWUoXHJcbiAgZWw6IEhUTUxJbnB1dEVsZW1lbnQsXHJcbiAgc3RhcnQ6IG51bWJlcixcclxuICBlbmQ6IG51bWJlcixcclxuICB0ZXh0OiBzdHJpbmcsXHJcbiAgaWZyYW1lOiBIVE1MSUZyYW1lRWxlbWVudCxcclxuICBub1JlY3Vyc2lvbjogYm9vbGVhbiA9IGZhbHNlXHJcbikge1xyXG4gIC8vY29uc29sZS5sb2coXCJpbnNlcnRWYWx1ZVwiLCBlbC5ub2RlTmFtZSwgc3RhcnQsIGVuZCwgXCJbXCIrdGV4dCtcIl1cIiwgZWwpO1xyXG4gIGlmIChpc1RleHRFbGVtZW50KGVsKSkge1xyXG4gICAgbGV0IHZhbCA9IGdldFZhbHVlKGVsKTtcclxuICAgIHNldFZhbHVlKGVsLCB2YWwuc3Vic3RyaW5nKDAsIHN0YXJ0KSArIHRleHQgKyB2YWwuc3Vic3RyaW5nKGVuZCwgdmFsLmxlbmd0aCkpO1xyXG4gICAgc2V0Q2FyZXRQb3NpdGlvbihlbCwgc3RhcnQgKyB0ZXh0Lmxlbmd0aCwgaWZyYW1lKTtcclxuICB9XHJcbiAgZWxzZSBpZiAoIW5vUmVjdXJzaW9uKSB7XHJcbiAgICBsZXQgc2VsT2JqOiBTZWxlY3Rpb24gPSBnZXRXaW5kb3dTZWxlY3Rpb24oaWZyYW1lKTtcclxuICAgIGlmIChzZWxPYmogJiYgc2VsT2JqLnJhbmdlQ291bnQgPiAwKSB7XHJcbiAgICAgIHZhciBzZWxSYW5nZSA9IHNlbE9iai5nZXRSYW5nZUF0KDApO1xyXG4gICAgICB2YXIgcG9zaXRpb24gPSBzZWxSYW5nZS5zdGFydE9mZnNldDtcclxuICAgICAgdmFyIGFuY2hvck5vZGUgPSBzZWxPYmouYW5jaG9yTm9kZTtcclxuICAgICAgLy8gaWYgKHRleHQuZW5kc1dpdGgoJyAnKSkge1xyXG4gICAgICAvLyAgIHRleHQgPSB0ZXh0LnN1YnN0cmluZygwLCB0ZXh0Lmxlbmd0aC0xKSArICdcXHhBMCc7XHJcbiAgICAgIC8vIH1cclxuICAgICAgaW5zZXJ0VmFsdWUoPEhUTUxJbnB1dEVsZW1lbnQ+YW5jaG9yTm9kZSwgcG9zaXRpb24gLSAoZW5kIC0gc3RhcnQpLCBwb3NpdGlvbiwgdGV4dCwgaWZyYW1lLCB0cnVlKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0lucHV0T3JUZXh0QXJlYUVsZW1lbnQoZWw6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIGVsICE9IG51bGwgJiYgKGVsLm5vZGVOYW1lID09ICdJTlBVVCcgfHwgZWwubm9kZU5hbWUgPT0gJ1RFWFRBUkVBJyk7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNUZXh0RWxlbWVudChlbDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcclxuICByZXR1cm4gZWwgIT0gbnVsbCAmJiAoZWwubm9kZU5hbWUgPT0gJ0lOUFVUJyB8fCBlbC5ub2RlTmFtZSA9PSAnVEVYVEFSRUEnIHx8IGVsLm5vZGVOYW1lID09ICcjdGV4dCcpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldENhcmV0UG9zaXRpb24oZWw6IEhUTUxJbnB1dEVsZW1lbnQsIHBvczogbnVtYmVyLCBpZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50ID0gbnVsbCkge1xyXG4gIC8vY29uc29sZS5sb2coXCJzZXRDYXJldFBvc2l0aW9uXCIsIHBvcywgZWwsIGlmcmFtZT09bnVsbCk7XHJcbiAgaWYgKGlzSW5wdXRPclRleHRBcmVhRWxlbWVudChlbCkgJiYgZWwuc2VsZWN0aW9uU3RhcnQpIHtcclxuICAgIGVsLmZvY3VzKCk7XHJcbiAgICBlbC5zZXRTZWxlY3Rpb25SYW5nZShwb3MsIHBvcyk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgbGV0IHJhbmdlID0gZ2V0RG9jdW1lbnQoaWZyYW1lKS5jcmVhdGVSYW5nZSgpO1xyXG4gICAgcmFuZ2Uuc2V0U3RhcnQoZWwsIHBvcyk7XHJcbiAgICByYW5nZS5jb2xsYXBzZSh0cnVlKTtcclxuICAgIGxldCBzZWwgPSBnZXRXaW5kb3dTZWxlY3Rpb24oaWZyYW1lKTtcclxuICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcclxuICAgIHNlbC5hZGRSYW5nZShyYW5nZSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FyZXRQb3NpdGlvbihlbDogSFRNTElucHV0RWxlbWVudCwgaWZyYW1lOiBIVE1MSUZyYW1lRWxlbWVudCA9IG51bGwpIHtcclxuICAvL2NvbnNvbGUubG9nKFwiZ2V0Q2FyZXRQb3NpdGlvblwiLCBlbCk7XHJcbiAgaWYgKGlzSW5wdXRPclRleHRBcmVhRWxlbWVudChlbCkpIHtcclxuICAgIHZhciB2YWwgPSBlbC52YWx1ZTtcclxuICAgIHJldHVybiB2YWwuc2xpY2UoMCwgZWwuc2VsZWN0aW9uU3RhcnQpLmxlbmd0aDtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgc2VsT2JqID0gZ2V0V2luZG93U2VsZWN0aW9uKGlmcmFtZSk7IC8vd2luZG93LmdldFNlbGVjdGlvbigpO1xyXG4gICAgaWYgKHNlbE9iai5yYW5nZUNvdW50ID4gMCkge1xyXG4gICAgICB2YXIgc2VsUmFuZ2UgPSBzZWxPYmouZ2V0UmFuZ2VBdCgwKTtcclxuICAgICAgdmFyIHByZUNhcmV0UmFuZ2UgPSBzZWxSYW5nZS5jbG9uZVJhbmdlKCk7XHJcbiAgICAgIHByZUNhcmV0UmFuZ2Uuc2VsZWN0Tm9kZUNvbnRlbnRzKGVsKTtcclxuICAgICAgcHJlQ2FyZXRSYW5nZS5zZXRFbmQoc2VsUmFuZ2UuZW5kQ29udGFpbmVyLCBzZWxSYW5nZS5lbmRPZmZzZXQpO1xyXG4gICAgICB2YXIgcG9zaXRpb24gPSBwcmVDYXJldFJhbmdlLnRvU3RyaW5nKCkubGVuZ3RoO1xyXG4gICAgICByZXR1cm4gcG9zaXRpb247XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vLyBCYXNlZCBvbiBtZW50LmlvIGZ1bmN0aW9ucy4uLlxyXG4vL1xyXG5cclxuZnVuY3Rpb24gZ2V0RG9jdW1lbnQoaWZyYW1lOiBIVE1MSUZyYW1lRWxlbWVudCkge1xyXG4gIGlmICghaWZyYW1lKSB7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQ7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFdpbmRvd1NlbGVjdGlvbihpZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50KTogU2VsZWN0aW9uIHtcclxuICBpZiAoIWlmcmFtZSkge1xyXG4gICAgcmV0dXJuIHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGlmcmFtZS5jb250ZW50V2luZG93LmdldFNlbGVjdGlvbigpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRlbnRFZGl0YWJsZUNhcmV0Q29vcmRzKGN0eDogeyBpZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50LCBwYXJlbnQ/OiBFbGVtZW50IH0pIHtcclxuICBsZXQgbWFya2VyVGV4dENoYXIgPSAnXFx1ZmVmZic7XHJcbiAgbGV0IG1hcmtlcklkID0gJ3NlbF8nICsgbmV3IERhdGUoKS5nZXRUaW1lKCkgKyAnXycgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCkuc3Vic3RyKDIpO1xyXG4gIGxldCBkb2MgPSBnZXREb2N1bWVudChjdHggPyBjdHguaWZyYW1lIDogbnVsbCk7XHJcbiAgbGV0IHNlbCA9IGdldFdpbmRvd1NlbGVjdGlvbihjdHggPyBjdHguaWZyYW1lIDogbnVsbCk7XHJcbiAgbGV0IHByZXZSYW5nZSA9IHNlbC5nZXRSYW5nZUF0KDApO1xyXG5cclxuICAvLyBjcmVhdGUgbmV3IHJhbmdlIGFuZCBzZXQgcG9zdGlvbiB1c2luZyBwcmV2UmFuZ2VcclxuICBsZXQgcmFuZ2UgPSBkb2MuY3JlYXRlUmFuZ2UoKTtcclxuICByYW5nZS5zZXRTdGFydChzZWwuYW5jaG9yTm9kZSwgcHJldlJhbmdlLnN0YXJ0T2Zmc2V0KTtcclxuICByYW5nZS5zZXRFbmQoc2VsLmFuY2hvck5vZGUsIHByZXZSYW5nZS5zdGFydE9mZnNldCk7XHJcbiAgcmFuZ2UuY29sbGFwc2UoZmFsc2UpO1xyXG5cclxuICAvLyBDcmVhdGUgdGhlIG1hcmtlciBlbGVtZW50IGNvbnRhaW5pbmcgYSBzaW5nbGUgaW52aXNpYmxlIGNoYXJhY3RlclxyXG4gIC8vIHVzaW5nIERPTSBtZXRob2RzIGFuZCBpbnNlcnQgaXQgYXQgdGhlIHBvc2l0aW9uIGluIHRoZSByYW5nZVxyXG4gIGxldCBtYXJrZXJFbCA9IGRvYy5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgbWFya2VyRWwuaWQgPSBtYXJrZXJJZDtcclxuICBtYXJrZXJFbC5hcHBlbmRDaGlsZChkb2MuY3JlYXRlVGV4dE5vZGUobWFya2VyVGV4dENoYXIpKTtcclxuICByYW5nZS5pbnNlcnROb2RlKG1hcmtlckVsKTtcclxuICBzZWwucmVtb3ZlQWxsUmFuZ2VzKCk7XHJcbiAgc2VsLmFkZFJhbmdlKHByZXZSYW5nZSk7XHJcblxyXG4gIGxldCBjb29yZGluYXRlcyA9IHtcclxuICAgIGxlZnQ6IDAsXHJcbiAgICB0b3A6IG1hcmtlckVsLm9mZnNldEhlaWdodFxyXG4gIH07XHJcblxyXG4gIGxvY2FsVG9SZWxhdGl2ZUNvb3JkaW5hdGVzKGN0eCwgbWFya2VyRWwsIGNvb3JkaW5hdGVzKTtcclxuXHJcbiAgbWFya2VyRWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChtYXJrZXJFbCk7XHJcbiAgcmV0dXJuIGNvb3JkaW5hdGVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsb2NhbFRvUmVsYXRpdmVDb29yZGluYXRlcyhcclxuICBjdHg6IHsgaWZyYW1lOiBIVE1MSUZyYW1lRWxlbWVudCwgcGFyZW50PzogRWxlbWVudCB9LFxyXG4gIGVsZW1lbnQ6IEVsZW1lbnQsXHJcbiAgY29vcmRpbmF0ZXM6IHsgdG9wOiBudW1iZXI7IGxlZnQ6IG51bWJlciB9XHJcbikge1xyXG4gIGxldCBvYmogPSA8SFRNTEVsZW1lbnQ+ZWxlbWVudDtcclxuICBsZXQgaWZyYW1lID0gY3R4ID8gY3R4LmlmcmFtZSA6IG51bGw7XHJcbiAgd2hpbGUgKG9iaikge1xyXG4gICAgaWYgKGN0eC5wYXJlbnQgIT0gbnVsbCAmJiBjdHgucGFyZW50ID09IG9iaikge1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICAgIGNvb3JkaW5hdGVzLmxlZnQgKz0gb2JqLm9mZnNldExlZnQgKyBvYmouY2xpZW50TGVmdDtcclxuICAgIGNvb3JkaW5hdGVzLnRvcCArPSBvYmoub2Zmc2V0VG9wICsgb2JqLmNsaWVudFRvcDtcclxuICAgIG9iaiA9IDxIVE1MRWxlbWVudD5vYmoub2Zmc2V0UGFyZW50O1xyXG4gICAgaWYgKCFvYmogJiYgaWZyYW1lKSB7XHJcbiAgICAgIG9iaiA9IGlmcmFtZTtcclxuICAgICAgaWZyYW1lID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcbiAgb2JqID0gPEhUTUxFbGVtZW50PmVsZW1lbnQ7XHJcbiAgaWZyYW1lID0gY3R4ID8gY3R4LmlmcmFtZSA6IG51bGw7XHJcbiAgd2hpbGUgKG9iaiAhPT0gZ2V0RG9jdW1lbnQobnVsbCkuYm9keSAmJiBvYmogIT0gbnVsbCkge1xyXG4gICAgaWYgKGN0eC5wYXJlbnQgIT0gbnVsbCAmJiBjdHgucGFyZW50ID09IG9iaikge1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICAgIGlmIChvYmouc2Nyb2xsVG9wICYmIG9iai5zY3JvbGxUb3AgPiAwKSB7XHJcbiAgICAgIGNvb3JkaW5hdGVzLnRvcCAtPSBvYmouc2Nyb2xsVG9wO1xyXG4gICAgfVxyXG4gICAgaWYgKG9iai5zY3JvbGxMZWZ0ICYmIG9iai5zY3JvbGxMZWZ0ID4gMCkge1xyXG4gICAgICBjb29yZGluYXRlcy5sZWZ0IC09IG9iai5zY3JvbGxMZWZ0O1xyXG4gICAgfVxyXG4gICAgb2JqID0gPEhUTUxFbGVtZW50Pm9iai5wYXJlbnROb2RlO1xyXG4gICAgaWYgKCFvYmogJiYgaWZyYW1lKSB7XHJcbiAgICAgIG9iaiA9IGlmcmFtZTtcclxuICAgICAgaWZyYW1lID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19