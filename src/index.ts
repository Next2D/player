"use strict";

import { Next2D } from "@next2d/core";

if (!("next2d" in window)) {
    console.log("%c Next2D Player %c 1.18.12 %c https://next2d.app",
        "color: #fff; background: #5f5f5f",
        "color: #fff; background: #4bc729",
        "");

    window.next2d = new Next2D();
}