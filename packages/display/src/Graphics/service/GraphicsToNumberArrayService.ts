import type { IGradientType } from "../../interface/IGradientType";
import type { IColorStop } from "../../interface/IColorStop";
import type { ISpreadMethod } from "../../interface/ISpreadMethod";
import type { IInterpolationMethod } from "../../interface/IInterpolationMethod";
import type { ICapsStyle } from "../../interface/ICapsStyle";
import type { IJointStyle } from "../../interface/IJointStyle";
import type { Matrix } from "@next2d/geom";
import { $getArray } from "../../DisplayObjectUtil";
import {
    $MOVE_TO,
    $CURVE_TO,
    $LINE_TO,
    $CUBIC,
    $ARC,
    $FILL_STYLE,
    $STROKE_STYLE,
    $END_FILL,
    $END_STROKE,
    $BEGIN_PATH,
    $GRADIENT_FILL,
    $GRADIENT_STROKE,
    $CLOSE_PATH,
    $BITMAP_FILL,
    $BITMAP_STROKE
} from "../GraphicsCommand";
import { BitmapData } from "../../BitmapData";

/**
 * @description Graphicsのrecodesを解析して、数値を array へ追加します。
 *              Parses Graphics recodes and appends the numbers to the array.
 *
 * @param  {array} recodes
 * @param  {number[]} array
 * @return {void}
 * @method
 * @public
 */
export const write = (recodes: any[], array: number[]): void =>
{
    for (let idx = 0; idx < recodes.length;) {

        const type = recodes[idx++];
        array.push(type);

        switch (type) {

            case $BEGIN_PATH:
            case $END_FILL:
            case $END_STROKE:
            case $CLOSE_PATH:
                break;

            case $MOVE_TO:
            case $LINE_TO:
                array.push(recodes[idx++], recodes[idx++]);
                break;

            case $CURVE_TO:
            case $FILL_STYLE:
                array.push(
                    recodes[idx++], recodes[idx++],
                    recodes[idx++], recodes[idx++]
                );
                break;

            case $CUBIC:
                array.push(
                    recodes[idx++], recodes[idx++],
                    recodes[idx++], recodes[idx++],
                    recodes[idx++], recodes[idx++]
                );
                break;

            case $STROKE_STYLE:
                {
                    array.push(recodes[idx++]);

                    const lineCap = recodes[idx++];
                    switch (lineCap) {

                        case "none":
                            array.push(0);
                            break;

                        case "round":
                            array.push(1);
                            break;

                        case "square":
                            array.push(2);
                            break;

                        default:
                            // 無効な値の場合はデフォルトで"none"(0)を使用
                            array.push(0);
                            break;

                    }

                    const lineJoin = recodes[idx++];
                    switch (lineJoin) {

                        case "bevel":
                            array.push(0);
                            break;

                        case "miter":
                            array.push(1);
                            break;

                        case "round":
                            array.push(2);
                            break;

                        default:
                            // 無効な値の場合はデフォルトで"round"(2)を使用
                            array.push(2);
                            break;

                    }

                    array.push(
                        recodes[idx++], // MITER LIMIT
                        recodes[idx++], recodes[idx++],
                        recodes[idx++], recodes[idx++]
                    );
                }
                break;

            case $ARC:
                array.push(recodes[idx++], recodes[idx++], recodes[idx++]);
                break;

            case $GRADIENT_FILL:
                {
                    const type: IGradientType = recodes[idx++];
                    const stops: IColorStop[] = recodes[idx++];
                    const matrix: ArrayLike<number> = recodes[idx++];
                    const spread: ISpreadMethod = recodes[idx++];
                    const interpolation: IInterpolationMethod = recodes[idx++];
                    const focal: number = recodes[idx++];

                    array.push(type === "linear" ? 0 : 1);

                    array.push(stops.length);

                    // 昇順に並び替え
                    const sortStops = stops.sort((a, b) => a.ratio - b.ratio);

                    for (let idx: number = 0; idx < sortStops.length; ++idx) {
                        const color = sortStops[idx];
                        array.push(
                            color.ratio,
                            color.R,
                            color.G,
                            color.B,
                            color.A
                        );
                    }

                    // JSON由来のデシリアライズではFloat32Arrayがkeyed object
                    // ({0:v,...,5:v})になるためspreadではなくindexアクセスで読む
                    array.push(
                        matrix[0], matrix[1], matrix[2],
                        matrix[3], matrix[4], matrix[5]
                    );

                    switch (spread) {

                        case "reflect":
                            array.push(0);
                            break;

                        case "repeat":
                            array.push(1);
                            break;

                        default:
                            array.push(2);
                            break;

                    }

                    array.push(
                        interpolation === "linearRGB" ? 0 : 1
                    );

                    array.push(focal);
                }
                break;

            case $GRADIENT_STROKE:
                {
                    array.push(recodes[idx++]);

                    const lineCap: ICapsStyle = recodes[idx++];
                    switch (lineCap) {

                        case "none":
                            array.push(0);
                            break;

                        case "round":
                            array.push(1);
                            break;

                        case "square":
                            array.push(2);
                            break;

                        default:
                            // 無効な値の場合はデフォルトで"none"(0)を使用
                            array.push(0);
                            break;

                    }

                    const lineJoin: IJointStyle = recodes[idx++];
                    switch (lineJoin) {

                        case "bevel":
                            array.push(0);
                            break;

                        case "miter":
                            array.push(1);
                            break;

                        case "round":
                            array.push(2);
                            break;

                        default:
                            // 無効な値の場合はデフォルトで"round"(2)を使用
                            array.push(2);
                            break;

                    }

                    // miterLimit
                    array.push(recodes[idx++]);

                    const type: IGradientType = recodes[idx++];
                    const stops: IColorStop[] = recodes[idx++];
                    const matrix: ArrayLike<number> = recodes[idx++];
                    const spread: ISpreadMethod = recodes[idx++];
                    const interpolation: IInterpolationMethod = recodes[idx++];
                    const focal: number = recodes[idx++];

                    array.push(type === "linear" ? 0 : 1);

                    array.push(stops.length);
                    for (let idx: number = 0; idx < stops.length; ++idx) {
                        const color = stops[idx];
                        array.push(
                            color.ratio,
                            color.R,
                            color.G,
                            color.B,
                            color.A
                        );
                    }

                    // JSON由来のデシリアライズではFloat32Arrayがkeyed object
                    // ({0:v,...,5:v})になるためspreadではなくindexアクセスで読む
                    array.push(
                        matrix[0], matrix[1], matrix[2],
                        matrix[3], matrix[4], matrix[5]
                    );

                    switch (spread) {

                        case "reflect":
                            array.push(0);
                            break;

                        case "repeat":
                            array.push(1);
                            break;

                        default:
                            array.push(2);
                            break;

                    }

                    array.push(
                        interpolation === "linearRGB" ? 0 : 1
                    );

                    array.push(focal);
                }
                break;

            case $BITMAP_FILL:
                {
                    const bitmapData: BitmapData = recodes[idx++];
                    const buffer = bitmapData.buffer;

                    if (!buffer) {
                        idx += 3;
                        break;
                    }

                    array.push(
                        bitmapData.width,
                        bitmapData.height,
                        buffer.length
                    );

                    for (let idx = 0; idx < buffer.length; idx += 4096) {
                        array.push(...buffer.subarray(idx, idx + 4096));
                    }

                    const matrix: Matrix = recodes[idx++];
                    if (matrix) {
                        array.push(...matrix.rawData);
                    } else {
                        array.push(1, 0, 0, 1, 0, 0);
                    }

                    const repeat: boolean = recodes[idx++];
                    array.push(repeat ? 1 : 0);

                    const smooth: boolean = recodes[idx++];
                    array.push(smooth ? 1 : 0);
                }
                break;

            case $BITMAP_STROKE:
                {
                    array.push(recodes[idx++]);

                    const lineCap: ICapsStyle = recodes[idx++];
                    switch (lineCap) {

                        case "none":
                            array.push(0);
                            break;

                        case "round":
                            array.push(1);
                            break;

                        case "square":
                            array.push(2);
                            break;

                        default:
                            // 無効な値の場合はデフォルトで"none"(0)を使用
                            array.push(0);
                            break;

                    }

                    const lineJoin: IJointStyle = recodes[idx++];
                    switch (lineJoin) {

                        case "bevel":
                            array.push(0);
                            break;

                        case "miter":
                            array.push(1);
                            break;

                        case "round":
                            array.push(2);
                            break;

                        default:
                            // 無効な値の場合はデフォルトで"round"(2)を使用
                            array.push(2);
                            break;

                    }

                    // MITER LIMIT
                    array.push(recodes[idx++]);

                    const bitmapData: BitmapData = recodes[idx++];
                    const buffer = bitmapData.buffer;
                    if (!buffer) {
                        idx += 3;
                        break;
                    }

                    array.push(
                        bitmapData.width,
                        bitmapData.height,
                        buffer.length
                    );

                    for (let idx = 0; idx < buffer.length; idx += 4096) {
                        array.push(...buffer.subarray(idx, idx + 4096));
                    }

                    const matrix: Matrix = recodes[idx++];
                    if (matrix) {
                        array.push(...matrix.rawData);
                    } else {
                        array.push(1, 0, 0, 1, 0, 0);
                    }

                    const repeat: boolean = recodes[idx++];
                    array.push(repeat ? 1 : 0);

                    const smooth: boolean = recodes[idx++];
                    array.push(smooth ? 1 : 0);
                }
                break;

            default:
                break;

        }
    }
};

/**
 * @description Graphicsのrecodesを解析して数値配列を生成します。
 *              Parses Graphics recodes and generates a numerical array.
 *
 * @param  {array} recodes
 * @return {any[]}
 * @method
 * @public
 */
export const execute = (recodes : any[] | null): any[] =>
{
    if (!recodes) {
        return [];
    }

    const array: number[] = $getArray();
    write(recodes, array);
    return array;
};