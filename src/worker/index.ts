import * as fflate from "fflate";

/**
 * @public
 */
globalThis.addEventListener("message", (event: MessageEvent) =>
{
    const buffer: Uint8Array = fflate.decompressSync(event.data);

    let json = "";
    for (let idx = 0; idx < buffer.length; idx += 4096) {
        // @ts-ignore
        json += String.fromCharCode(...buffer.slice(idx, idx + 4096));
    }

    globalThis.postMessage(JSON.parse(decodeURIComponent(json)));
});