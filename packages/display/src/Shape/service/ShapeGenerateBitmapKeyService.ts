/**
 * @description FNV-1a の 1 ステップ(32bit値を4バイトとして混ぜる)
 *              One FNV-1a step (mixes a 32-bit value as four bytes)
 *
 * @param  {number} hash
 * @param  {number} value
 * @return {number}
 * @method
 * @private
 */
const mix = (hash: number, value: number): number =>
{
    hash = Math.imul(hash ^ value & 0xff, 16777619);
    hash = Math.imul(hash ^ value >> 8 & 0xff, 16777619);
    hash = Math.imul(hash ^ value >> 16 & 0xff, 16777619);
    return Math.imul(hash ^ value >>> 24, 16777619);
};

/**
 * @description URLのうちハッシュに使う最大文字数。これより長いURL(data URLなど)は等間隔に間引く。
 *              Maximum number of URL characters to hash. Longer URLs (e.g. data URLs) are sampled evenly.
 *
 * @type {number}
 * @const
 */
const MAX_URL_SAMPLES: number = 4096;

/**
 * @description ピクセルのうちハッシュに使う最大数。読み込み元が同じで内容が差し替わった場合の検出用。
 *              Maximum number of pixels to hash. Detects content replaced behind the same source.
 *
 * @type {number}
 * @const
 */
const MAX_PIXEL_SAMPLES: number = 256;

/**
 * @description URLから読み込んだ画像の uniqueKey を、読み込み元のURLから生成します。
 *              全ピクセルをハッシュすると、大きな画像ではその計算だけでフレームが止まるため
 *              (JITが使えない環境では数秒)、同じ内容を指すURLをキーの主体にします。
 *              画像サイズと少数のピクセルも混ぜ、同じURLで内容が変わった場合に別のキーになりやすくします。
 *              同じURLの画像は同じキーになるので、描画キャッシュは従来どおり共有されます。
 *
 *              Generates the uniqueKey of an image loaded from a URL, based on that URL.
 *              Hashing every pixel stalls the frame on large images (for seconds where JIT is
 *              unavailable), so the URL, which identifies the content, is the main input.
 *              The image size and a few pixels are mixed in so that content replaced behind the
 *              same URL is likely to get another key. Images from the same URL get the same key,
 *              so the render cache is shared as before.
 *
 * @param  {string} src
 * @param  {number} width
 * @param  {number} height
 * @param  {Uint8Array} buffer
 * @return {number}
 * @method
 * @protected
 */
export const execute = (
    src: string,
    width: number,
    height: number,
    buffer: Uint8Array
): number => {

    let hash = 2166136261; // FNV-1aオフセット basis

    // 文字の数だけ繰り返すので、mix を呼ばずにその場で混ぜる (文字コードは 16bit なので、
    // mix の 4 バイトのうち上位 2 バイトは常に 0。結果は mix を呼んだ場合と同じ)
    const length = src.length;
    hash = mix(hash, length);
    if (length <= MAX_URL_SAMPLES) {
        for (let idx = 0; idx < length; ++idx) {
            const code = src.charCodeAt(idx);
            hash = Math.imul(hash ^ code & 0xff, 16777619);
            hash = Math.imul(hash ^ code >> 8, 16777619);
            hash = Math.imul(hash, 16777619);
            hash = Math.imul(hash, 16777619);
        }
    } else {
        // 等間隔に間引き、末尾の文字は必ず含める
        const step = length / MAX_URL_SAMPLES;
        for (let idx = 0; idx < MAX_URL_SAMPLES; ++idx) {
            const code = src.charCodeAt(Math.floor(idx * step));
            hash = Math.imul(hash ^ code & 0xff, 16777619);
            hash = Math.imul(hash ^ code >> 8, 16777619);
            hash = Math.imul(hash, 16777619);
            hash = Math.imul(hash, 16777619);
        }
        hash = mix(hash, src.charCodeAt(length - 1));
    }

    hash = mix(hash, width);
    hash = mix(hash, height);

    const pixels = buffer.length >>> 2;
    hash = mix(hash, pixels);
    if (pixels > 0) {
        const samples = Math.min(pixels, MAX_PIXEL_SAMPLES);
        const step = pixels / samples;
        for (let idx = 0; idx < samples; ++idx) {
            const offset = Math.floor(idx * step) << 2;
            hash = mix(hash,
                buffer[offset]
                | buffer[offset + 1] << 8
                | buffer[offset + 2] << 16
                | buffer[offset + 3] << 24
            );
        }
    }

    // 32bitハッシュ値を24bitに圧縮 (DisplayObjectGenerateHashService と同じ範囲)
    return (hash >>> 8 ^ hash & 0xff) & 0xffffff;
};
