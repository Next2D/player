import { $context } from "../../RendererUtil";

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
 * @return {void}
 * @method
 * @protected
 */
export const execute = (commands: Float32Array, has_grid: boolean): void =>
{
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
                $context.fillStyle(
                    commands[index++] / 255, commands[index++] / 255,
                    commands[index++] / 255, commands[index++] / 255
                );
                break;

            case END_FILL:
                $context.fill(has_grid);
                break;

            case STROKE_STYLE:
                $context.strokeStyle(
                    commands[index++] / 255, commands[index++] / 255,
                    commands[index++] / 255, commands[index++] / 255
                );
                break;
            
            case END_STROKE:
                $context.stroke();
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
                // todo
                break;

            case GRADIENT_STROKE:
                // todo
                break;

            case BITMAP_FILL:
                // todo
                break;

            case BITMAP_STROKE:
                // todo
                break;

        }
    }
};