"use strict";

import { decompressSync } from "fflate";

/**
 * @public
 */
self.addEventListener("message", async (event: MessageEvent) =>
{
    const buffer: Uint8Array = decompressSync(event.data);

    let json: string = "";
    for (let idx: number = 0; idx < buffer.length; idx += 4096) {
        json += String.fromCharCode(...buffer.slice(idx, idx + 4096));
    }

    self.postMessage(JSON.parse(decodeURIComponent(json)));
});