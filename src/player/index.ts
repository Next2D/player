"use strict";

import { $initialize } from "./util/Util";

if (!("next2d" in window)) {

    // output build version
    const packageJson = require("../../package.json");
    console.log(`%c Next2D Player %c ${packageJson.version} %c https://next2d.app`,
        "color: #fff; background: #5f5f5f",
        "color: #fff; background: #4bc729",
        "");

    if (document.readyState === "loading") {

        const initialize = (): void =>
        {
            window.removeEventListener("DOMContentLoaded", initialize);

            $initialize()
                .then((next2d): void =>
                {
                    window.next2d = next2d;
                });
        };

        // @ts-ignore
        window.addEventListener("DOMContentLoaded", initialize);

    } else {

        $initialize()
            .then((next2d): void =>
            {
                window.next2d = next2d;
            });

    }
}
