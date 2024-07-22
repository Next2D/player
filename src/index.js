"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@next2d/util");
var core_1 = require("@next2d/core");
if (!("next2d" in window)) {
    console.log("%c Next2D Player %c 1.18.12 %c https://next2d.app", "color: #fff; background: #5f5f5f", "color: #fff; background: #4bc729", "");
    window.next2d = new core_1.Next2D([new Promise(function (resolve) {
            if (document.readyState === "loading") {
                var initialize_1 = function () {
                    window.removeEventListener("DOMContentLoaded", initialize_1);
                    (0, util_1.$initialize)()
                        .then(function () {
                        (0, util_1.$currentPlayer)()
                            ._$initializeCanvas();
                        resolve();
                    });
                };
                window.addEventListener("DOMContentLoaded", initialize_1);
            }
            else {
                (0, util_1.$initialize)()
                    .then(function () {
                    (0, util_1.$currentPlayer)()
                        ._$initializeCanvas();
                    resolve();
                });
            }
        })]);
}
