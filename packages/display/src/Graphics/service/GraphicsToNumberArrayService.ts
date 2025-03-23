import type { IGradientType } from "../../interface/IGradientType";
import type { IColorStop } from "../../interface/IColorStop";
import type { ISpreadMethod } from "../../interface/ISpreadMethod";
import type { IInterpolationMethod } from "../../interface/IInterpolationMethod";
import type { ICapsStyle } from "../../interface/ICapsStyle";
import type { IJointStyle } from "../../interface/IJointStyle";
import type { Matrix } from "@next2d/geom";
import { $getArray } from "../../DisplayObjectUtil";
import { Graphics } from "../../Graphics";
import { BitmapData } from "../../BitmapData";

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
    for (let idx = 0; idx < recodes.length;) {

        const type = recodes[idx++];
        array.push(type);

        switch (type) {

            case Graphics.BEGIN_PATH:
            case Graphics.END_FILL:
            case Graphics.END_STROKE:
            case Graphics.CLOSE_PATH:
                break;

            case Graphics.MOVE_TO:
            case Graphics.LINE_TO:
                array.push(recodes[idx++], recodes[idx++]);
                break;

            case Graphics.CURVE_TO:
            case Graphics.FILL_STYLE:
                array.push(
                    recodes[idx++], recodes[idx++],
                    recodes[idx++], recodes[idx++]
                );
                break;

            case Graphics.CUBIC:
                array.push(
                    recodes[idx++], recodes[idx++],
                    recodes[idx++], recodes[idx++],
                    recodes[idx++], recodes[idx++]
                );
                break;

            case Graphics.STROKE_STYLE:
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

                    }

                    array.push(
                        recodes[idx++], // MITER LIMIT
                        recodes[idx++], recodes[idx++],
                        recodes[idx++], recodes[idx++]
                    );
                }
                break;

            case Graphics.ARC:
                array.push(recodes[idx++], recodes[idx++], recodes[idx++]);
                break;

            case Graphics.GRADIENT_FILL:
                {
                    const type: IGradientType = recodes[idx++];
                    const stops: IColorStop[] = recodes[idx++];
                    const matrix: Float32Array = recodes[idx++];
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

                    array.push(...matrix);

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

            case Graphics.GRADIENT_STROKE:
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

                    }

                    // miterLimit
                    array.push(recodes[idx++]);

                    const type: IGradientType = recodes[idx++];
                    const stops: IColorStop[] = recodes[idx++];
                    const matrix: Float32Array = recodes[idx++];
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

                    array.push(...matrix);

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

            case Graphics.BITMAP_FILL:
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

            case Graphics.BITMAP_STROKE:
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

                    const matrix: Float32Array = recodes[idx++];
                    if (matrix) {
                        array.push(...matrix);
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

    return array;
};