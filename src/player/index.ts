"use strict";

import {
    $currentPlayer,
    $initialize,
    $isSafari,
    $rendererWorker
} from "./util/Util";
import { Next2D } from "./player/Next2D";

if (!("next2d" in window)) {

    console.log("%c Next2D Player %c 1.14.9 %c https://next2d.app",
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

                        $currentPlayer()._$initializeCanvas();
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

                    $currentPlayer()._$initializeCanvas();
                    resolve();
                });

        }
    })]);
}
