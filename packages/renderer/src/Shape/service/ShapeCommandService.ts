import {
    $context,
    $getArray
} from "../../RendererUtil";

const MOVE_TO: number         = 0;
const CURVE_TO: number        = 1;
const LINE_TO: number         = 2;
const CUBIC: number           = 3;
const ARC: number             = 4;
const FILL_STYLE: number      = 5;
const STROKE_STYLE: number    = 6;
const END_FILL: number        = 7;
const END_STROKE: number      = 8;
const BEGIN_PATH: number      = 9;
const GRADIENT_FILL: number   = 10;
const GRADIENT_STROKE: number = 11;
const CLOSE_PATH: number      = 12;
const BITMAP_FILL: number     = 13;
const BITMAP_STROKE: number   = 14;

/**
 * @description Shapeのグラフィックコマンドを実行します。
 *              Execute the graphic commands of Shape.
 *
 * @param  {Float32Array} commands
 * @param  {boolean} has_grid
 * @param  {boolean} [is_clip=false]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    commands: Float32Array,
    has_grid: boolean,
    is_clip: boolean = false
): void => {

    let index = 0;
    while (commands.length > index) {

        switch (commands[index++]) {

            case BEGIN_PATH:
                $context.beginPath();
                break;

            case MOVE_TO:
                $context.moveTo(commands[index++], commands[index++]);
                break;

            case LINE_TO:
                $context.lineTo(commands[index++], commands[index++]);
                break;

            case CURVE_TO:
                $context.quadraticCurveTo(
                    commands[index++], commands[index++],
                    commands[index++], commands[index++]
                );
                break;

            case FILL_STYLE:
                if (is_clip) {
                    index += 4;
                    break;
                }

                $context.fillStyle(
                    commands[index++] / 255, commands[index++] / 255,
                    commands[index++] / 255, commands[index++] / 255
                );
                break;

            case END_FILL:
                if (is_clip) {
                    break;
                }

                $context.fill(has_grid);
                break;

            case STROKE_STYLE:
                if (is_clip) {
                    index += 8;
                    break;
                }

                $context.thickness  = commands[index++];
                $context.caps       = commands[index++];
                $context.joints     = commands[index++];
                $context.miterLimit = commands[index++];
                $context.strokeStyle(
                    commands[index++] / 255, commands[index++] / 255,
                    commands[index++] / 255, commands[index++] / 255
                );

                break;
            
            case END_STROKE:
                if (is_clip) {
                    break;
                }
                
                $context.stroke(has_grid);
                break;

            case CLOSE_PATH:
                $context.closePath();
                break;

            case ARC:
                $context.arc(commands[index++], commands[index++], commands[index++]);
                break;

            case CUBIC:
                $context.bezierCurveTo(
                    commands[index++], commands[index++],
                    commands[index++], commands[index++],
                    commands[index++], commands[index++]
                );
                break;

            case GRADIENT_FILL:
                {
                    if (is_clip) {
                        index += 1;
                        const length = commands[index++];
                        index += length * 5;
                        index += 9;
                        break;
                    }

                    const type = commands[index++];

                    const stops = $getArray();
                    const length = commands[index++];
                    for (let idx = 0; idx < length; ++idx) {
                        stops.push(
                            commands[index++], // ratio
                            commands[index++], // red
                            commands[index++], // green
                            commands[index++], // blue
                            commands[index++]  // alpha
                        );
                    }

                    const matrix = new Float32Array([
                        commands[index++], commands[index++], commands[index++],
                        commands[index++], commands[index++], commands[index++]
                    ]);

                    const spread = commands[index++];
                    const interpolation = commands[index++];
                    const focal = commands[index++];

                    $context.gradientFill(
                        has_grid,
                        type, stops, matrix, 
                        spread, interpolation, focal
                    );
                }
                break;

            case BITMAP_FILL:
                {
                    if (is_clip) {
                        index += 2;
                        const length = commands[index++];
                        index += length;
                        index += 8;
                        break;
                    }

                    const width  = commands[index++];
                    const height = commands[index++];
                    
                    const length = commands[index++];
                    const buffer = new Uint8Array(
                        commands.subarray(index, index + length)
                    );
                    index += length;
                    
                    $context.save();
                    $context.transform(
                        commands[index++], commands[index++], commands[index++],
                        commands[index++], commands[index++], commands[index++]
                    );

                    $context.bitmapFill(
                        has_grid,
                        buffer, width, height,
                        Boolean(commands[index++]), 
                        Boolean(commands[index++])
                    );

                    $context.restore();
                }
                break;

            case GRADIENT_STROKE:
                
                $context.thickness  = commands[index++];
                $context.caps       = commands[index++];
                $context.joints     = commands[index++];
                $context.miterLimit = commands[index++];

                const type = commands[index++];

                const stops = $getArray();
                const length = commands[index++];
                for (let idx = 0; idx < length; ++idx) {
                    stops.push(
                        commands[index++], // ratio
                        commands[index++], // red
                        commands[index++], // green
                        commands[index++], // blue
                        commands[index++]  // alpha
                    );
                }

                const matrix = new Float32Array([
                    commands[index++], commands[index++], commands[index++],
                    commands[index++], commands[index++], commands[index++]
                ]);

                const spread = commands[index++];
                const interpolation = commands[index++];
                const focal = commands[index++];

                $context.gradientStroke(
                    has_grid,
                    type, stops, matrix, 
                    spread, interpolation, focal
                );
                break;

            case BITMAP_STROKE:
                console.log("BITMAP_STROKE");
                break;

        }
    }
};