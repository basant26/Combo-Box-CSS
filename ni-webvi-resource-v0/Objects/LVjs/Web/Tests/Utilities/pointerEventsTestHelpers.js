"use strict";
(function () {
    'use strict';
    window.testHelpers = window.testHelpers || {};
    /**
     * Disable mouse pointer events for the given DOM element. Useful for tests which are asserting based on computed styles.
     * This also sets position:absolute since pointerEvents:none is unreliable when position is static
     * (In some cases we have different styling for hover/ active state for controls, and we don't want the test result
     * to be affected by where the mouse cursor is when it's running.)
     * @param {HTMLElement} element The DOM element to disable mouse pointer events on.
     */
    window.testHelpers.disablePointerEvents = function (element) {
        element.style.pointerEvents = 'none';
        element.style.position = 'absolute';
    };
}());
//# sourceMappingURL=pointerEventsTestHelpers.js.map