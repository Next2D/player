import { WebGLFillMeshGenerator } from "./WebGLFillMeshGenerator";
import type { CanvasToWebGLContext } from "./CanvasToWebGLContext";
import type { ShapeShaderVariantCollection } from "./shader/variants/ShapeShaderVariantCollection";
import type { CanvasToWebGLShader } from "./shader/CanvasToWebGLShader";
import type { WebGLShaderUniform } from "./shader/WebGLShaderUniform";
import type { AttachmentImpl } from "./interface/AttachmentImpl";
import type { ClipObjectImpl } from "./interface/ClipObjectImpl";
import type { IndexRangeImpl } from "./interface/IndexRangeImpl";
import { $poolArray } from "@next2d/share";

/**
 * @class
 */
export class CanvasToWebGLContextMask
{
    private readonly _$context: CanvasToWebGLContext;
    private readonly _$gl: WebGL2RenderingContext;
    private readonly _$clips: boolean[];
    private readonly _$poolClip: ClipObjectImpl[];
    private _$clipStatus: boolean;
    private _$containerClip: boolean;
    private _$currentClip: boolean;

    /**
     * @param {CanvasToWebGLContext} context
     * @param {WebGL2RenderingContext} gl
     * @constructor
     * @public
     */
    constructor (context: CanvasToWebGLContext, gl: WebGL2RenderingContext)
    {
        /**
         * @type {CanvasToWebGLContext}
         * @private
         */
        this._$context = context;

        /**
         * @type {WebGL2RenderingContext}
         * @private
         */
        this._$gl = gl;

        /**
         * @type {array}
         * @private
         */
        this._$clips = [];

        /**
         * @type {array}
         * @private
         */
        this._$poolClip = [];

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$clipStatus = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$containerClip = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$currentClip = false;
    }

    /**
     * @member {boolean}
     * @public
     */
    get containerClip (): boolean
    {
        return this._$containerClip;
    }
    set containerClip (flag: boolean)
    {
        this._$containerClip = flag;
    }

    /**
     * @param {boolean} mask
     * @return {void}
     * @method
     * @private
     */
    _$onClear (mask: boolean): void
    {
        if (mask) {
            this._$gl.enable(this._$gl.STENCIL_TEST);
            this._$currentClip = true;
        }
    }

    /**
     * @param {boolean} mask
     * @return {void}
     * @method
     * @private
     */
    _$onBind (mask: boolean): void
    {
        if (!mask && this._$currentClip) {
            // キャッシュ作成前は、一旦マスクを無効にする
            this._$gl.disable(this._$gl.STENCIL_TEST);
            this._$currentClip = false;
        } else if (mask && !this._$currentClip) {
            // キャッシュ作成後は、マスクの状態を復元する
            this._$gl.enable(this._$gl.STENCIL_TEST);
            this._$currentClip = true;
            this._$endClipDef();
        }
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$onClearRect (): void
    {
        this._$gl.disable(this._$gl.STENCIL_TEST);
        this._$currentClip = false;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$enterClip ()
    {
        if (!this._$currentClip) {
            this._$gl.enable(this._$gl.STENCIL_TEST);
            this._$currentClip = true;
        }

        // buffer mask on
        const currentAttachment: AttachmentImpl | null = this
            ._$context
            .frameBuffer
            .currentAttachment;

        if (!currentAttachment) {
            throw new Error("mask currentAttachment is null.");
        }

        currentAttachment.mask = true;
        ++currentAttachment.clipLevel;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$beginClipDef ()
    {
        const currentAttachment: AttachmentImpl | null = this
            ._$context
            .frameBuffer
            .currentAttachment;

        if (!currentAttachment) {
            throw new Error("mask currentAttachment is null.");
        }

        this._$gl.enable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE);
        this._$gl.stencilFunc(this._$gl.ALWAYS, 0, 0xff);
        this._$gl.stencilOp(this._$gl.KEEP, this._$gl.INVERT, this._$gl.INVERT);
        this._$gl.stencilMask(1 << currentAttachment.clipLevel - 1);
        this._$gl.colorMask(false, false, false, false);
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$endClipDef (): void
    {
        const currentAttachment: AttachmentImpl | null = this
            ._$context
            .frameBuffer
            .currentAttachment;

        if (!currentAttachment) {
            throw new Error("mask currentAttachment is null.");
        }

        const clipLevel: number = currentAttachment.clipLevel;

        let mask: number = 0;
        for (let idx: number = 0; idx < clipLevel; ++idx) {
            mask |= (1 << clipLevel - idx) - 1;
        }

        this._$gl.disable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE);
        this._$gl.stencilFunc(this._$gl.EQUAL, mask & 0xff, mask);
        this._$gl.stencilOp(this._$gl.KEEP, this._$gl.KEEP, this._$gl.KEEP);
        this._$gl.stencilMask(0xff);
        this._$gl.colorMask(true, true, true, true);
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$leaveClip (): void
    {
        const currentAttachment: AttachmentImpl | null = this
            ._$context
            .frameBuffer
            .currentAttachment;

        if (!currentAttachment) {
            throw new Error("mask currentAttachment is null.");
        }

        --currentAttachment.clipLevel;
        currentAttachment.mask = !!currentAttachment.clipLevel;

        // end clip
        if (!currentAttachment.clipLevel) {
            this._$context._$clearRectStencil();
            return;
        }

        // replace
        const w: number = currentAttachment.width;
        const h: number = currentAttachment.height;

        // create buffer
        const vertices: any[] = this
            ._$context
            .path
            .createRectVertices(0, 0, w, h);

        const object: WebGLVertexArrayObject = this
            ._$context
            .vao
            .createFill(vertices);

        $poolArray(vertices.pop());
        $poolArray(vertices);

        const variants: ShapeShaderVariantCollection = this
            ._$context
            .shaderList
            .shapeShaderVariants;

        const shader: CanvasToWebGLShader = variants.getMaskShapeShader(false, false);
        const uniform: WebGLShaderUniform = shader.uniform;
        variants.setMaskShapeUniformIdentity(uniform, w, h);

        const range: IndexRangeImpl = object.indexRanges[0];

        // deny
        if (!this._$currentClip) {
            this._$currentClip = true;
            this._$gl.enable(this._$gl.STENCIL_TEST);
        }

        this._$gl.enable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE);
        this._$gl.stencilFunc(this._$gl.ALWAYS, 0, 0xff);
        this._$gl.stencilOp(this._$gl.REPLACE, this._$gl.REPLACE, this._$gl.REPLACE);
        this._$gl.stencilMask(1 << currentAttachment.clipLevel);
        this._$gl.colorMask(false, false, false, false);

        shader._$containerClip(object, range.first, range.count);

        // object pool
        const indexRanges: IndexRangeImpl[] = object.indexRanges;
        for (let idx = 0; idx < indexRanges.length; ++idx) {
            WebGLFillMeshGenerator
                .indexRangePool
                .push(indexRanges[idx]);
        }

        $poolArray(object.indexRanges);

        this._$context.vao.releaseFill(object);

        this._$endClipDef();
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$drawContainerClip (): void
    {
        const currentAttachment: AttachmentImpl | null = this
            ._$context
            .frameBuffer
            .currentAttachment;

        if (!currentAttachment) {
            throw new Error("mask currentAttachment is null.");
        }

        const currentClipLevel: number = currentAttachment.clipLevel;

        const variants: ShapeShaderVariantCollection = this
            ._$context
            .shaderList
            .shapeShaderVariants;

        const shader: CanvasToWebGLShader = variants
            .getMaskShapeShader(false, false);

        const uniform: WebGLShaderUniform = shader.uniform;

        let useLevel: number = currentClipLevel;

        // create buffer
        const w: number = currentAttachment.width;
        const h: number = currentAttachment.height;

        this._$gl.enable(this._$gl.SAMPLE_ALPHA_TO_COVERAGE);
        this._$gl.stencilFunc(this._$gl.ALWAYS, 0, 0xff);
        this._$gl.stencilOp(this._$gl.KEEP, this._$gl.INVERT, this._$gl.INVERT);
        this._$gl.colorMask(false, false, false, false);

        const length: number = this._$poolClip.length;
        for (let idx: number = 0; idx < length; ++idx) {

            const object: ClipObjectImpl | void = this._$poolClip.shift(); // fixed
            if (!object) {
                continue;
            }

            variants.setMaskShapeUniform(
                uniform, false,
                object.matrixA, object.matrixB, object.matrixC,
                object.matrixD, object.matrixE, object.matrixF,
                object.matrixG, object.matrixH, object.matrixI,
                object.viewportWidth, object.viewportHeight, null
            );

            const indexRanges: IndexRangeImpl[] = object.vertexArrayObject.indexRanges;
            for (let idx: number = 0; idx < indexRanges.length; ++idx) {

                const range: IndexRangeImpl = indexRanges[idx];

                this._$gl.stencilMask(1 << useLevel - 1);
                shader
                    ._$containerClip(
                        object.vertexArrayObject,
                        range.first,
                        range.count
                    );

                WebGLFillMeshGenerator
                    .indexRangePool
                    .push(range);
            }
            $poolArray(indexRanges);

            this._$context.vao.releaseFill(object.vertexArrayObject);

            ++useLevel;

            // union
            if (useLevel > 7) {

                // union
                this._$unionStencilMask(currentClipLevel, w, h);

                // reset
                useLevel = currentClipLevel;

            }

        }

        // last union
        if (useLevel > currentClipLevel + 1) {
            this._$unionStencilMask(currentClipLevel, w, h);
        }
    }

    /**
     * @param  {number} level
     * @param  {number} w
     * @param  {number} h
     * @return {void}
     * @method
     * @private
     */
    _$unionStencilMask (level: number, w: number, h: number): void
    {
        // create buffer
        const vertices: any[] = this
            ._$context
            .path
            .createRectVertices(0, 0, w, h);

        const object: WebGLVertexArrayObject = this
            ._$context
            .vao
            .createFill(vertices);

        $poolArray(vertices.pop());
        $poolArray(vertices);

        const variants: ShapeShaderVariantCollection = this
            ._$context
            .shaderList
            .shapeShaderVariants;

        const shader: CanvasToWebGLShader  = variants
            .getMaskShapeShader(false, false);

        const uniform: WebGLShaderUniform = shader.uniform;

        variants
            .setMaskShapeUniformIdentity(uniform, w, h);

        const range: IndexRangeImpl = object.indexRanges[0];

        // 例として level=4 の場合
        //
        // ステンシルバッファの4ビット目以上を4ビット目に統合する。
        //   |?|?|?|?|?|*|*|*|  ->  | | | | |?|*|*|*|
        //
        // このとき、4ビット目以上に1のビットが1つでもあれば4ビット目を1、
        // そうでなければ4ビット目を0とする。
        //
        //   00000***  ->  00000***
        //   00001***  ->  00001***
        //   00010***  ->  00001***
        //   00011***  ->  00001***
        //   00100***  ->  00001***
        //    ...
        //   11101***  ->  00001***
        //   11110***  ->  00001***
        //   11111***  ->  00001***
        //
        // したがってステンシルの現在の値を 00001000 と比較すればよい。
        // 比較して 00001000 以上であれば 00001*** で更新し、そうでなければ 00000*** で更新する。
        // 下位3ビットは元の値を保持する必要があるので 11111000 でマスクする。

        this._$gl.stencilFunc(this._$gl.LEQUAL, 1 << level - 1, 0xff);
        this._$gl.stencilOp(this._$gl.ZERO, this._$gl.REPLACE, this._$gl.REPLACE);
        this._$gl.stencilMask(~((1 << level - 1) - 1));

        shader._$containerClip(object, range.first, range.count);

        // reset
        if (this._$poolClip.length) {
            this._$gl.stencilFunc(this._$gl.ALWAYS, 0, 0xff);
            this._$gl.stencilOp(this._$gl.KEEP, this._$gl.INVERT, this._$gl.INVERT);
        }

        // object pool
        const indexRanges: IndexRangeImpl[] = object.indexRanges;
        for (let idx = 0; idx < indexRanges.length; ++idx) {
            WebGLFillMeshGenerator
                .indexRangePool
                .push(indexRanges[idx]);
        }

        $poolArray(object.indexRanges);

        this._$context.vao.releaseFill(object);
    }

    /**
     * @param  {WebGLVertexArrayObject} vertex_array
     * @param  {Float32Array} matrix
     * @param  {number} width
     * @param  {number} height
     * @return {boolean}
     * @method
     * @private
     */
    _$onClip (
        vertex_array: WebGLVertexArrayObject,
        matrix: Float32Array,
        width: number, height: number
    ): boolean {

        this._$clipStatus = true;

        if (this._$containerClip) {

            this._$poolClip.push({
                "vertexArrayObject": vertex_array,
                "matrixA": matrix[0],
                "matrixB": matrix[1],
                "matrixC": matrix[2],
                "matrixD": matrix[3],
                "matrixE": matrix[4],
                "matrixF": matrix[5],
                "matrixG": matrix[6],
                "matrixH": matrix[7],
                "matrixI": matrix[8],
                "viewportWidth": width,
                "viewportHeight": height
            });

            return true;
        }

        return false;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    _$onSave (): void
    {
        this._$clips.push(this._$clipStatus);
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    _$onRestore (): void
    {
        if (this._$clips.length) {
            this._$clipStatus = !!this._$clips.pop();
        }
    }
}
