"use strict";

import { decompressSync } from "fflate";

/**
 * @description zilbの圧縮されたデータを解凍します。
 *              Unzips zlib-compressed data.
 *
 * @param  {MessageEvent} event
 * @return {void}
 * @method
 * @public
 */
self.addEventListener("message", (event: MessageEvent): void =>
{
    const buffer = decompressSync(event.data);

    let json = "";
    for (let idx: number = 0; idx < buffer.length; idx += 4096) {
        json += String.fromCharCode(...buffer.subarray(idx, idx + 4096));
    }

    self.postMessage(JSON.parse(decodeURIComponent(json)));
});

export default {};