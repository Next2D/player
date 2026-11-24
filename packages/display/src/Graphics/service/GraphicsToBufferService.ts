import type { IColorStop } from "../../interface/IColorStop";
import type { Matrix } from "@next2d/geom";
import type { BitmapData } from "../../BitmapData";
import {
    $MOVE_TO,
    $CURVE_TO,
    $LINE_TO,
    $CUBIC,
    $ARC,
    $FILL_STYLE,
    $STROKE_STYLE,
    $GRADIENT_FILL,
    $GRADIENT_STROKE,
    $BITMAP_FILL,
    $BITMAP_STROKE
} from "../GraphicsCommand";

/**
 * @description 数値を書き込む作業用のバッファ。足りなくなったら 2 倍ずつ広げ、呼び出しをまたいで使い回す。
 *              The work buffer the numbers are written to. Doubled when it runs out and reused
 *              across calls.
 *
 * @type {Float32Array}
 * @private
 */
let $work: Float32Array = new Float32Array(1024);

/**
 * @description 作業用のバッファに、offset から size 個ぶんの空きがあるようにする
 *              Makes sure the work buffer has room for size values from offset.
 *
 * @param  {number} offset
 * @param  {number} size
 * @return {void}
 * @method
 * @private
 */
const $reserve = (offset: number, size: number): void =>
{
    const required = offset + size;
    if (required <= $work.length) {
        return ;
    }

    let length = $work.length * 2;
    while (length < required) {
        length *= 2;
    }

    const work = new Float32Array(length);
    work.set($work.subarray(0, offset));
    $work = work;
};

/**
 * @description 線の端の形を数値にする (無効な値は none)
 *              Converts a caps style to a number (invalid values become none).
 *
 * @param  {string} caps
 * @return {number}
 * @method
 * @private
 */
const $capsToNumber = (caps: string): number =>
{
    return caps === "round" ? 1 : caps === "square" ? 2 : 0;
};

/**
 * @description 線のつなぎ目の形を数値にする (無効な値は round)
 *              Converts a joint style to a number (invalid values become round).
 *
 * @param  {string} joints
 * @return {number}
 * @method
 * @private
 */
const $jointsToNumber = (joints: string): number =>
{
    return joints === "bevel" ? 0 : joints === "miter" ? 1 : 2;
};

/**
 * @description Graphicsのrecodesを解析して、描画用の Float32Array を生成します。
 *              内容は、GraphicsToNumberArrayService の結果を Float32Array にしたものと同じ。
 *
 *              図形を作るたびに呼ばれるので、数値は配列へ 1 つずつ追加せず、作業用の Float32Array へ
 *              直接書き込み、最後に必要な長さだけを複写して返す (配列を経由すると、要素の追加と
 *              Float32Array への変換で 2 回ぶんの処理になる)。
 *
 *              Parses Graphics recodes and generates the Float32Array used for rendering.
 *              The content equals the result of GraphicsToNumberArrayService converted to a
 *              Float32Array. This runs for every shape built, so the numbers are written straight
 *              into a work Float32Array and only the used length is copied out at the end, rather
 *              than being pushed to an array one by one and then converted.
 *
 * @param  {array} recodes
 * @return {Float32Array}
 * @method
 * @public
 */
export const execute = (recodes: any[] | null): Float32Array =>
{
    if (!recodes) {
        return new Float32Array(0);
    }

    const length = recodes.length;

    // 経路と単色の命令は、元の要素数より増えない。増える命令 (グラデーション、画像) は個別に確保する
    $reserve(0, length + 16);

    let work = $work;
    let offset = 0;
    for (let idx = 0; idx < length;) {

        const type = recodes[idx++];
        work[offset++] = type;

        switch (type) {

            case $MOVE_TO:
            case $LINE_TO:
                work[offset++] = recodes[idx++];
                work[offset++] = recodes[idx++];
                break;

            case $CURVE_TO:
            case $FILL_STYLE:
                work[offset++] = recodes[idx++];
                work[offset++] = recodes[idx++];
                work[offset++] = recodes[idx++];
                work[offset++] = recodes[idx++];
                break;

            case $CUBIC:
                work[offset++] = recodes[idx++];
                work[offset++] = recodes[idx++];
                work[offset++] = recodes[idx++];
                work[offset++] = recodes[idx++];
                work[offset++] = recodes[idx++];
                work[offset++] = recodes[idx++];
                break;

            case $ARC:
                work[offset++] = recodes[idx++];
                work[offset++] = recodes[idx++];
                work[offset++] = recodes[idx++];
                break;

            case $STROKE_STYLE:
                work[offset++] = recodes[idx++];
                work[offset++] = $capsToNumber(recodes[idx++]);
                work[offset++] = $jointsToNumber(recodes[idx++]);
                work[offset++] = recodes[idx++]; // MITER LIMIT
                work[offset++] = recodes[idx++];
                work[offset++] = recodes[idx++];
                work[offset++] = recodes[idx++];
                work[offset++] = recodes[idx++];
                break;

            case $GRADIENT_FILL:
            case $GRADIENT_STROKE:
                {
                    const isStroke = type === $GRADIENT_STROKE;

                    let width = 0;
                    let caps = "";
                    let joints = "";
                    let miterLimit = 0;
                    if (isStroke) {
                        width      = recodes[idx++];
                        caps       = recodes[idx++];
                        joints     = recodes[idx++];
                        miterLimit = recodes[idx++];
                    }

                    const gradientType: string = recodes[idx++];
                    const stops: IColorStop[] = recodes[idx++];
                    const matrix: ArrayLike<number> = recodes[idx++];
                    const spread: string = recodes[idx++];
                    const interpolation: string = recodes[idx++];
                    const focal: number = recodes[idx++];

                    $reserve(offset, length - idx + stops.length * 5 + 32);
                    work = $work;

                    if (isStroke) {
                        work[offset++] = width;
                        work[offset++] = $capsToNumber(caps);
                        work[offset++] = $jointsToNumber(joints);
                        work[offset++] = miterLimit;
                    }

                    work[offset++] = gradientType === "linear" ? 0 : 1;
                    work[offset++] = stops.length;

                    // 塗りは昇順に並び替える (線は並び替えない)
                    const colors = isStroke
                        ? stops
                        : stops.sort((a, b) => a.ratio - b.ratio);

                    for (let index = 0; index < colors.length; ++index) {
                        const color = colors[index];
                        work[offset++] = color.ratio;
                        work[offset++] = color.R;
                        work[offset++] = color.G;
                        work[offset++] = color.B;
                        work[offset++] = color.A;
                    }

                    // JSON由来のデシリアライズではFloat32Arrayがkeyed object
                    // ({0:v,...,5:v})になるためindexアクセスで読む
                    work[offset++] = matrix[0];
                    work[offset++] = matrix[1];
                    work[offset++] = matrix[2];
                    work[offset++] = matrix[3];
                    work[offset++] = matrix[4];
                    work[offset++] = matrix[5];

                    work[offset++] = spread === "reflect" ? 0 : spread === "repeat" ? 1 : 2;
                    work[offset++] = interpolation === "linearRGB" ? 0 : 1;
                    work[offset++] = focal;
                }
                break;

            case $BITMAP_FILL:
            case $BITMAP_STROKE:
                {
                    if (type === $BITMAP_STROKE) {
                        work[offset++] = recodes[idx++];
                        work[offset++] = $capsToNumber(recodes[idx++]);
                        work[offset++] = $jointsToNumber(recodes[idx++]);
                        work[offset++] = recodes[idx++]; // MITER LIMIT
                    }

                    const bitmapData: BitmapData = recodes[idx++];
                    const buffer = bitmapData.buffer;
                    if (!buffer) {
                        idx += 3;
                        break;
                    }

                    $reserve(offset, length - idx + buffer.length + 32);
                    work = $work;

                    work[offset++] = bitmapData.width;
                    work[offset++] = bitmapData.height;
                    work[offset++] = buffer.length;

                    work.set(buffer, offset);
                    offset += buffer.length;

                    const matrix: Matrix = recodes[idx++];
                    if (matrix) {
                        const rawData = matrix.rawData;
                        work[offset++] = rawData[0];
                        work[offset++] = rawData[1];
                        work[offset++] = rawData[2];
                        work[offset++] = rawData[3];
                        work[offset++] = rawData[4];
                        work[offset++] = rawData[5];
                    } else {
                        work[offset++] = 1;
                        work[offset++] = 0;
                        work[offset++] = 0;
                        work[offset++] = 1;
                        work[offset++] = 0;
                        work[offset++] = 0;
                    }

                    work[offset++] = recodes[idx++] ? 1 : 0; // repeat
                    work[offset++] = recodes[idx++] ? 1 : 0; // smooth
                }
                break;

            // $BEGIN_PATH / $END_FILL / $END_STROKE / $CLOSE_PATH は値を持たない
            default:
                break;

        }
    }

    return work.slice(0, offset);
};
