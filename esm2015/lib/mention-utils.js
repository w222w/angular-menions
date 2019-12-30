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
export function insertValue(el, start, end, text, iframe, noRecursion = false) {
    //console.log("insertValue", el.nodeName, start, end, "["+text+"]", el);
    if (isTextElement(el)) {
        /** @type {?} */
        let val = getValue(el);
        setValue(el, val.substring(0, start) + text + val.substring(end, val.length));
        setCaretPosition(el, start + text.length, iframe);
    }
    else if (!noRecursion) {
        /** @type {?} */
        let selObj = getWindowSelection(iframe);
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
export function setCaretPosition(el, pos, iframe = null) {
    //console.log("setCaretPosition", pos, el, iframe==null);
    if (isInputOrTextAreaElement(el) && el.selectionStart) {
        el.focus();
        el.setSelectionRange(pos, pos);
    }
    else {
        /** @type {?} */
        let range = getDocument(iframe).createRange();
        range.setStart(el, pos);
        range.collapse(true);
        /** @type {?} */
        let sel = getWindowSelection(iframe);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}
/**
 * @param {?} el
 * @param {?=} iframe
 * @return {?}
 */
export function getCaretPosition(el, iframe = null) {
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
    let markerTextChar = '\ufeff';
    /** @type {?} */
    let markerId = 'sel_' + new Date().getTime() + '_' + Math.random().toString().substr(2);
    /** @type {?} */
    let doc = getDocument(ctx ? ctx.iframe : null);
    /** @type {?} */
    let sel = getWindowSelection(ctx ? ctx.iframe : null);
    /** @type {?} */
    let prevRange = sel.getRangeAt(0);
    // create new range and set postion using prevRange
    /** @type {?} */
    let range = doc.createRange();
    range.setStart(sel.anchorNode, prevRange.startOffset);
    range.setEnd(sel.anchorNode, prevRange.startOffset);
    range.collapse(false);
    // Create the marker element containing a single invisible character
    // using DOM methods and insert it at the position in the range
    /** @type {?} */
    let markerEl = doc.createElement('span');
    markerEl.id = markerId;
    markerEl.appendChild(doc.createTextNode(markerTextChar));
    range.insertNode(markerEl);
    sel.removeAllRanges();
    sel.addRange(prevRange);
    /** @type {?} */
    let coordinates = {
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
    let obj = (/** @type {?} */ (element));
    /** @type {?} */
    let iframe = ctx ? ctx.iframe : null;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudGlvbi11dGlscy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItbWVudGlvbnMvIiwic291cmNlcyI6WyJsaWIvbWVudGlvbi11dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUdBLFNBQVMsUUFBUSxDQUFDLEVBQW9CLEVBQUUsS0FBVTtJQUNoRCxzREFBc0Q7SUFDdEQsSUFBSSx3QkFBd0IsQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNoQyxFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNsQjtTQUNJO1FBQ0gsRUFBRSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7S0FDeEI7QUFDSCxDQUFDOzs7OztBQUVELE1BQU0sVUFBVSxRQUFRLENBQUMsRUFBb0I7SUFDM0MsT0FBTyx3QkFBd0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQztBQUNsRSxDQUFDOzs7Ozs7Ozs7O0FBRUQsTUFBTSxVQUFVLFdBQVcsQ0FDekIsRUFBb0IsRUFDcEIsS0FBYSxFQUNiLEdBQVcsRUFDWCxJQUFZLEVBQ1osTUFBeUIsRUFDekIsY0FBdUIsS0FBSztJQUU1Qix3RUFBd0U7SUFDeEUsSUFBSSxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQUU7O1lBQ2pCLEdBQUcsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBQ3RCLFFBQVEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzlFLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztLQUNuRDtTQUNJLElBQUksQ0FBQyxXQUFX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Li4uXHJcbi8vXHJcblxyXG5mdW5jdGlvbiBzZXRWYWx1ZShlbDogSFRNTElucHV0RWxlbWVudCwgdmFsdWU6IGFueSkge1xyXG4gIC8vY29uc29sZS5sb2coXCJzZXRWYWx1ZVwiLCBlbC5ub2RlTmFtZSwgXCJbXCIrdmFsdWUrXCJdXCIpO1xyXG4gIGlmIChpc0lucHV0T3JUZXh0QXJlYUVsZW1lbnQoZWwpKSB7XHJcbiAgICBlbC52YWx1ZSA9IHZhbHVlO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVsLnRleHRDb250ZW50ID0gdmFsdWU7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmFsdWUoZWw6IEhUTUxJbnB1dEVsZW1lbnQpIHtcclxuICByZXR1cm4gaXNJbnB1dE9yVGV4dEFyZWFFbGVtZW50KGVsKSA/IGVsLnZhbHVlIDogZWwudGV4dENvbnRlbnQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRWYWx1ZShcclxuICBlbDogSFRNTElucHV0RWxlbWVudCxcclxuICBzdGFydDogbnVtYmVyLFxyXG4gIGVuZDogbnVtYmVyLFxyXG4gIHRleHQ6IHN0cmluZyxcclxuICBpZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50LFxyXG4gIG5vUmVjdXJzaW9uOiBib29sZWFuID0gZmFsc2VcclxuKSB7XHJcbiAgLy9jb25zb2xlLmxvZyhcImluc2VydFZhbHVlXCIsIGVsLm5vZGVOYW1lLCBzdGFydCwgZW5kLCBcIltcIit0ZXh0K1wiXVwiLCBlbCk7XHJcbiAgaWYgKGlzVGV4dEVsZW1lbnQoZWwpKSB7XHJcbiAgICBsZXQgdmFsID0gZ2V0VmFsdWUoZWwpO1xyXG4gICAgc2V0VmFsdWUoZWwsIHZhbC5zdWJzdHJpbmcoMCwgc3RhcnQpICsgdGV4dCArIHZhbC5zdWJzdHJpbmcoZW5kLCB2YWwubGVuZ3RoKSk7XHJcbiAgICBzZXRDYXJldFBvc2l0aW9uKGVsLCBzdGFydCArIHRleHQubGVuZ3RoLCBpZnJhbWUpO1xyXG4gIH1cclxuICBlbHNlIGlmICghbm9SZWN1cnNpb24pIHtcclxuICAgIGxldCBzZWxPYmo6IFNlbGVjdGlvbiA9IGdldFdpbmRvd1NlbGVjdGlvbihpZnJhbWUpO1xyXG4gICAgaWYgKHNlbE9iaiAmJiBzZWxPYmoucmFuZ2VDb3VudCA+IDApIHtcclxuICAgICAgdmFyIHNlbFJhbmdlID0gc2VsT2JqLmdldFJhbmdlQXQoMCk7XHJcbiAgICAgIHZhciBwb3NpdGlvbiA9IHNlbFJhbmdlLnN0YXJ0T2Zmc2V0O1xyXG4gICAgICB2YXIgYW5jaG9yTm9kZSA9IHNlbE9iai5hbmNob3JOb2RlO1xyXG4gICAgICAvLyBpZiAodGV4dC5lbmRzV2l0aCgnICcpKSB7XHJcbiAgICAgIC8vICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIHRleHQubGVuZ3RoLTEpICsgJ1xceEEwJztcclxuICAgICAgLy8gfVxyXG4gICAgICBpbnNlcnRWYWx1ZSg8SFRNTElucHV0RWxlbWVudD5hbmNob3JOb2RlLCBwb3NpdGlvbiAtIChlbmQgLSBzdGFydCksIHBvc2l0aW9uLCB0ZXh0LCBpZnJhbWUsIHRydWUpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzSW5wdXRPclRleHRBcmVhRWxlbWVudChlbDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcclxuICByZXR1cm4gZWwgIT0gbnVsbCAmJiAoZWwubm9kZU5hbWUgPT0gJ0lOUFVUJyB8fCBlbC5ub2RlTmFtZSA9PSAnVEVYVEFSRUEnKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1RleHRFbGVtZW50KGVsOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBlbCAhPSBudWxsICYmIChlbC5ub2RlTmFtZSA9PSAnSU5QVVQnIHx8IGVsLm5vZGVOYW1lID09ICdURVhUQVJFQScgfHwgZWwubm9kZU5hbWUgPT0gJyN0ZXh0Jyk7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0Q2FyZXRQb3NpdGlvbihlbDogSFRNTElucHV0RWxlbWVudCwgcG9zOiBudW1iZXIsIGlmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQgPSBudWxsKSB7XHJcbiAgLy9jb25zb2xlLmxvZyhcInNldENhcmV0UG9zaXRpb25cIiwgcG9zLCBlbCwgaWZyYW1lPT1udWxsKTtcclxuICBpZiAoaXNJbnB1dE9yVGV4dEFyZWFFbGVtZW50KGVsKSAmJiBlbC5zZWxlY3Rpb25TdGFydCkge1xyXG4gICAgZWwuZm9jdXMoKTtcclxuICAgIGVsLnNldFNlbGVjdGlvblJhbmdlKHBvcywgcG9zKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBsZXQgcmFuZ2UgPSBnZXREb2N1bWVudChpZnJhbWUpLmNyZWF0ZVJhbmdlKCk7XHJcbiAgICByYW5nZS5zZXRTdGFydChlbCwgcG9zKTtcclxuICAgIHJhbmdlLmNvbGxhcHNlKHRydWUpO1xyXG4gICAgbGV0IHNlbCA9IGdldFdpbmRvd1NlbGVjdGlvbihpZnJhbWUpO1xyXG4gICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpO1xyXG4gICAgc2VsLmFkZFJhbmdlKHJhbmdlKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDYXJldFBvc2l0aW9uKGVsOiBIVE1MSW5wdXRFbGVtZW50LCBpZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50ID0gbnVsbCkge1xyXG4gIC8vY29uc29sZS5sb2coXCJnZXRDYXJldFBvc2l0aW9uXCIsIGVsKTtcclxuICBpZiAoaXNJbnB1dE9yVGV4dEFyZWFFbGVtZW50KGVsKSkge1xyXG4gICAgdmFyIHZhbCA9IGVsLnZhbHVlO1xyXG4gICAgcmV0dXJuIHZhbC5zbGljZSgwLCBlbC5zZWxlY3Rpb25TdGFydCkubGVuZ3RoO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBzZWxPYmogPSBnZXRXaW5kb3dTZWxlY3Rpb24oaWZyYW1lKTsgLy93aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XHJcbiAgICBpZiAoc2VsT2JqLnJhbmdlQ291bnQgPiAwKSB7XHJcbiAgICAgIHZhciBzZWxSYW5nZSA9IHNlbE9iai5nZXRSYW5nZUF0KDApO1xyXG4gICAgICB2YXIgcHJlQ2FyZXRSYW5nZSA9IHNlbFJhbmdlLmNsb25lUmFuZ2UoKTtcclxuICAgICAgcHJlQ2FyZXRSYW5nZS5zZWxlY3ROb2RlQ29udGVudHMoZWwpO1xyXG4gICAgICBwcmVDYXJldFJhbmdlLnNldEVuZChzZWxSYW5nZS5lbmRDb250YWluZXIsIHNlbFJhbmdlLmVuZE9mZnNldCk7XHJcbiAgICAgIHZhciBwb3NpdGlvbiA9IHByZUNhcmV0UmFuZ2UudG9TdHJpbmcoKS5sZW5ndGg7XHJcbiAgICAgIHJldHVybiBwb3NpdGlvbjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8vIEJhc2VkIG9uIG1lbnQuaW8gZnVuY3Rpb25zLi4uXHJcbi8vXHJcblxyXG5mdW5jdGlvbiBnZXREb2N1bWVudChpZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50KSB7XHJcbiAgaWYgKCFpZnJhbWUpIHtcclxuICAgIHJldHVybiBkb2N1bWVudDtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0V2luZG93U2VsZWN0aW9uKGlmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQpOiBTZWxlY3Rpb24ge1xyXG4gIGlmICghaWZyYW1lKSB7XHJcbiAgICByZXR1cm4gd2luZG93LmdldFNlbGVjdGlvbigpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZ2V0U2VsZWN0aW9uKCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udGVudEVkaXRhYmxlQ2FyZXRDb29yZHMoY3R4OiB7IGlmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQsIHBhcmVudD86IEVsZW1lbnQgfSkge1xyXG4gIGxldCBtYXJrZXJUZXh0Q2hhciA9ICdcXHVmZWZmJztcclxuICBsZXQgbWFya2VySWQgPSAnc2VsXycgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKSArICdfJyArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKS5zdWJzdHIoMik7XHJcbiAgbGV0IGRvYyA9IGdldERvY3VtZW50KGN0eCA/IGN0eC5pZnJhbWUgOiBudWxsKTtcclxuICBsZXQgc2VsID0gZ2V0V2luZG93U2VsZWN0aW9uKGN0eCA/IGN0eC5pZnJhbWUgOiBudWxsKTtcclxuICBsZXQgcHJldlJhbmdlID0gc2VsLmdldFJhbmdlQXQoMCk7XHJcblxyXG4gIC8vIGNyZWF0ZSBuZXcgcmFuZ2UgYW5kIHNldCBwb3N0aW9uIHVzaW5nIHByZXZSYW5nZVxyXG4gIGxldCByYW5nZSA9IGRvYy5jcmVhdGVSYW5nZSgpO1xyXG4gIHJhbmdlLnNldFN0YXJ0KHNlbC5hbmNob3JOb2RlLCBwcmV2UmFuZ2Uuc3RhcnRPZmZzZXQpO1xyXG4gIHJhbmdlLnNldEVuZChzZWwuYW5jaG9yTm9kZSwgcHJldlJhbmdlLnN0YXJ0T2Zmc2V0KTtcclxuICByYW5nZS5jb2xsYXBzZShmYWxzZSk7XHJcblxyXG4gIC8vIENyZWF0ZSB0aGUgbWFya2VyIGVsZW1lbnQgY29udGFpbmluZyBhIHNpbmdsZSBpbnZpc2libGUgY2hhcmFjdGVyXHJcbiAgLy8gdXNpbmcgRE9NIG1ldGhvZHMgYW5kIGluc2VydCBpdCBhdCB0aGUgcG9zaXRpb24gaW4gdGhlIHJhbmdlXHJcbiAgbGV0IG1hcmtlckVsID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICBtYXJrZXJFbC5pZCA9IG1hcmtlcklkO1xyXG4gIG1hcmtlckVsLmFwcGVuZENoaWxkKGRvYy5jcmVhdGVUZXh0Tm9kZShtYXJrZXJUZXh0Q2hhcikpO1xyXG4gIHJhbmdlLmluc2VydE5vZGUobWFya2VyRWwpO1xyXG4gIHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcclxuICBzZWwuYWRkUmFuZ2UocHJldlJhbmdlKTtcclxuXHJcbiAgbGV0IGNvb3JkaW5hdGVzID0ge1xyXG4gICAgbGVmdDogMCxcclxuICAgIHRvcDogbWFya2VyRWwub2Zmc2V0SGVpZ2h0XHJcbiAgfTtcclxuXHJcbiAgbG9jYWxUb1JlbGF0aXZlQ29vcmRpbmF0ZXMoY3R4LCBtYXJrZXJFbCwgY29vcmRpbmF0ZXMpO1xyXG5cclxuICBtYXJrZXJFbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG1hcmtlckVsKTtcclxuICByZXR1cm4gY29vcmRpbmF0ZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvY2FsVG9SZWxhdGl2ZUNvb3JkaW5hdGVzKFxyXG4gIGN0eDogeyBpZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50LCBwYXJlbnQ/OiBFbGVtZW50IH0sXHJcbiAgZWxlbWVudDogRWxlbWVudCxcclxuICBjb29yZGluYXRlczogeyB0b3A6IG51bWJlcjsgbGVmdDogbnVtYmVyIH1cclxuKSB7XHJcbiAgbGV0IG9iaiA9IDxIVE1MRWxlbWVudD5lbGVtZW50O1xyXG4gIGxldCBpZnJhbWUgPSBjdHggPyBjdHguaWZyYW1lIDogbnVsbDtcclxuICB3aGlsZSAob2JqKSB7XHJcbiAgICBpZiAoY3R4LnBhcmVudCAhPSBudWxsICYmIGN0eC5wYXJlbnQgPT0gb2JqKSB7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgY29vcmRpbmF0ZXMubGVmdCArPSBvYmoub2Zmc2V0TGVmdCArIG9iai5jbGllbnRMZWZ0O1xyXG4gICAgY29vcmRpbmF0ZXMudG9wICs9IG9iai5vZmZzZXRUb3AgKyBvYmouY2xpZW50VG9wO1xyXG4gICAgb2JqID0gPEhUTUxFbGVtZW50Pm9iai5vZmZzZXRQYXJlbnQ7XHJcbiAgICBpZiAoIW9iaiAmJiBpZnJhbWUpIHtcclxuICAgICAgb2JqID0gaWZyYW1lO1xyXG4gICAgICBpZnJhbWUgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuICBvYmogPSA8SFRNTEVsZW1lbnQ+ZWxlbWVudDtcclxuICBpZnJhbWUgPSBjdHggPyBjdHguaWZyYW1lIDogbnVsbDtcclxuICB3aGlsZSAob2JqICE9PSBnZXREb2N1bWVudChudWxsKS5ib2R5ICYmIG9iaiAhPSBudWxsKSB7XHJcbiAgICBpZiAoY3R4LnBhcmVudCAhPSBudWxsICYmIGN0eC5wYXJlbnQgPT0gb2JqKSB7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgaWYgKG9iai5zY3JvbGxUb3AgJiYgb2JqLnNjcm9sbFRvcCA+IDApIHtcclxuICAgICAgY29vcmRpbmF0ZXMudG9wIC09IG9iai5zY3JvbGxUb3A7XHJcbiAgICB9XHJcbiAgICBpZiAob2JqLnNjcm9sbExlZnQgJiYgb2JqLnNjcm9sbExlZnQgPiAwKSB7XHJcbiAgICAgIGNvb3JkaW5hdGVzLmxlZnQgLT0gb2JqLnNjcm9sbExlZnQ7XHJcbiAgICB9XHJcbiAgICBvYmogPSA8SFRNTEVsZW1lbnQ+b2JqLnBhcmVudE5vZGU7XHJcbiAgICBpZiAoIW9iaiAmJiBpZnJhbWUpIHtcclxuICAgICAgb2JqID0gaWZyYW1lO1xyXG4gICAgICBpZnJhbWUgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=