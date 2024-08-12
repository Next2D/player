import { BezierConverter } from "./BezierConverter";
import type { VerticesImpl } from "./interface/VerticesImpl";
import {
    $getArray,
    $poolArray
} from "./WebGLUtil";

/**
 * @class
 */
export class CanvasToWebGLContextPath
{
    private _$currentPath: Array<number | boolean>;
    private readonly _$vertices: VerticesImpl;
    private readonly _$bezierConverter: BezierConverter;

    /**
     * @constructor
     */
    constructor ()
    {
        /**
         * @type {array}
         * @private
         */
        this._$currentPath = $getArray();

        /**
         * @type {array}
         * @private
         */
        this._$vertices = $getArray();

        /**
         * @type {BezierConverter}
         * @private
         */
        this._$bezierConverter = new BezierConverter();
    }

    /**
     * @member {array}
     * @readonly
     * @public
     */
    get vertices (): VerticesImpl
    {
        this._$pushCurrentPathToVertices();
        return this._$vertices;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    begin (): void
    {
        this._$currentPath.length = 0;

        while (this._$vertices.length) {
            $poolArray(this._$vertices.pop());
        }
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @method
     * @public
     */
    moveTo (x: number, y: number): void
    {
        if (!this._$currentPath.length) {
            this._$pushPointToCurrentPath(x, y, false);
            return;
        }

        if (this._$equalsToLastPoint(x, y)) {
            return;
        }

        this._$pushCurrentPathToVertices();
        this._$pushPointToCurrentPath(x, y, false);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @method
     * @public
     */
    lineTo (x: number, y: number): void
    {
        if (!this._$currentPath.length) {
            this.moveTo(0, 0);
        }

        if (this._$equalsToLastPoint(x, y)) {
            return;
        }

        this._$pushPointToCurrentPath(x, y, false);
    }

    /**
     * @param  {number} cx
     * @param  {number} cy
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @method
     * @public
     */
    quadTo (cx: number, cy: number, x: number, y: number): void
    {
        if (!this._$currentPath.length) {
            this.moveTo(0, 0);
        }

        if (this._$equalsToLastPoint(x, y)) {
            return;
        }

        this._$pushPointToCurrentPath(cx, cy, true);
        this._$pushPointToCurrentPath(x, y, false);
    }

    /**
     * @param  {number} cx1
     * @param  {number} cy1
     * @param  {number} cx2
     * @param  {number} cy2
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @method
     * @public
     */
    cubicTo (
        cx1: number, cy1: number,
        cx2: number, cy2: number,
        x: number, y: number
    ): void {

        if (!this._$currentPath.length) {
            this.moveTo(0, 0);
        }

        if (this._$equalsToLastPoint(x, y)) {
            return;
        }

        const fromX: number = +this._$currentPath[this._$currentPath.length - 3];
        const fromY: number = +this._$currentPath[this._$currentPath.length - 2];

        this
            ._$bezierConverter
            .cubicToQuad(fromX, fromY, cx1, cy1, cx2, cy2, x, y);

        const buffer: Float32Array = this
            ._$bezierConverter
            ._$bezierConverterBuffer;

        for (let i: number = 0; i < 32; ) {
            this.quadTo(
                buffer[i++],
                buffer[i++],
                buffer[i++],
                buffer[i++]
            );
        }
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} radius
     * @return {void}
     * @method
     * @public
     */
    drawCircle (x: number, y: number, radius: number): void
    {
        const r: number = radius;
        const k: number = radius * 0.5522847498307936;
        this.cubicTo(x + r, y + k, x + k, y + r, x, y + r);
        this.cubicTo(x - k, y + r, x - r, y + k, x - r, y);
        this.cubicTo(x - r, y - k, x - k, y - r, x, y - r);
        this.cubicTo(x + k, y - r, x + r, y - k, x + r, y);
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    close ()
    {
        if (this._$currentPath.length <= 6) {
            return;
        }

        const x: number = +this._$currentPath[0];
        const y: number = +this._$currentPath[1];

        if (this._$equalsToLastPoint(x, y)) {
            return;
        }

        this._$pushPointToCurrentPath(x, y, false);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @return {boolean}
     * @method
     * @private
     */
    _$equalsToLastPoint (x: number, y: number): boolean
    {
        const lastX: number = +this._$currentPath[this._$currentPath.length - 3];
        const lastY: number = +this._$currentPath[this._$currentPath.length - 2];
        return x === lastX && y === lastY;
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {boolean} is_control_point
     * @return {void}
     * @method
     * @private
     */
    _$pushPointToCurrentPath (x: number, y: number, is_control_point: boolean): void
    {
        this._$currentPath.push(x, y, is_control_point);
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$pushCurrentPathToVertices (): void
    {
        if (this._$currentPath.length < 4) {
            this._$currentPath.length = 0;
            return;
        }

        this._$vertices.push(this._$currentPath);
        this._$currentPath = $getArray();
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @return {array}
     * @method
     * @public
     */
    createRectVertices (
        x: number, y: number,
        w: number, h: number
    ): VerticesImpl {
        return $getArray($getArray(
            x,     y,     false,
            x + w, y,     false,
            x + w, y + h, false,
            x,     y + h, false
        ));
    }
}
