"use strict";

import { Next2D } from "@next2d/core";

/**
 * @type {NodeJS.Timeout}
 * @private
 */
let $resizeTimerId: NodeJS.Timeout;

if (!("next2d" in window)) {

    console.log("%c Next2D Player %c 1.18.12 %c https://next2d.app",
        "color: #fff; background: #5f5f5f",
        "color: #fff; background: #4bc729",
        "");

    window.addEventListener("resize", (): void =>
    {
        clearTimeout($resizeTimerId);
        $resizeTimerId = setTimeout(() => {
            // TODO: resize event
        }, 300);
    });

    window.next2d = new Next2D();
}