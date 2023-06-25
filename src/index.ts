"use strict";

import {
    $currentPlayer,
    $initialize,
    $isSafari,
    $rendererWorker
} from "@next2d/util";
import { Next2D } from "@next2d/core";

if (!("next2d" in window)) {

    console.log("%c Next2D Player %c 1.14.19 %c https://next2d.app",
        "color: #fff; background: #5f5f5f",
        "color: #fff; background: #4bc729",
        "");

    // @ts-ignore
    window.next2d = new Next2D([new Promise((resolve) =>
    {
        if (document.readyState === "loading") {

            const initialize = (): void =>
            {
                window.removeEventListener("DOMContentLoaded", initialize);

                $initialize()
                    .then((): void =>
                    {
                        if ($rendererWorker) {
                            $rendererWorker.postMessage({
                                "command": "setSafari",
                                "isSafari": $isSafari
                            });
                        }

                        $currentPlayer()
                            ._$initializeCanvas();

                        resolve();
                    });
            };

            // @ts-ignore
            window.addEventListener("DOMContentLoaded", initialize);

        } else {

            $initialize()
                .then((): void =>
                {
                    if ($rendererWorker) {
                        $rendererWorker.postMessage({
                            "command": "setSafari",
                            "isSafari": $isSafari
                        });
                    }

                    $currentPlayer()
                        ._$initializeCanvas();

                    resolve();
                });

        }
    })]);
}