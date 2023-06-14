import { Rectangle } from "../player/next2d/geom/Rectangle";
import { BevelFilter } from "../player/next2d/filters/BevelFilter";
import { BlurFilter } from "../player/next2d/filters/BlurFilter";
import { ColorMatrixFilter } from "../player/next2d/filters/ColorMatrixFilter";
import { ConvolutionFilter } from "../player/next2d/filters/ConvolutionFilter";
import { DisplacementMapFilter } from "../player/next2d/filters/DisplacementMapFilter";
import { DropShadowFilter } from "../player/next2d/filters/DropShadowFilter";
import { GlowFilter } from "../player/next2d/filters/GlowFilter";
import { GradientBevelFilter } from "../player/next2d/filters/GradientBevelFilter";
import { GradientGlowFilter } from "../player/next2d/filters/GradientGlowFilter";
import type { BlendModeImpl } from "../interface/BlendModeImpl";
import type { FilterArrayImpl } from "../interface/FilterArrayImpl";
import type { RenderPlayer } from "./RenderPlayer";
import type { BoundsImpl } from "../interface/BoundsImpl";
import type { CanvasToWebGLContext } from "../webgl/CanvasToWebGLContext";
import type { PropertyMessageMapImpl } from "../interface/PropertyMessageMapImpl";
import type { CacheStore } from "../player/util/CacheStore";
import type { FrameBufferManager } from "../webgl/FrameBufferManager";
import type { AttachmentImpl } from "../interface/AttachmentImpl";
import { $renderPlayer } from "./RenderGlobal";
import {
    $getBoundsObject,
    $poolBoundsObject,
    $getFloat32Array6,
    $getFloat32Array8,
    $Math,
    $multiplicationMatrix,
    $boundsMatrix,
    $poolFloat32Array6,
    $getArray
} from "../player/util/RenderUtil";

/**
 * @class
 */
export class RenderDisplayObject
{
    public _$instanceId: number;
    public _$parentId: number;
    public _$loaderInfoId: number;
    public _$characterId: number;
    public _$clipDepth: number;
    public _$depth: number;
    public _$isMask: boolean;
    public _$updated: boolean;
    public readonly _$matrix: Float32Array;
    public _$blendMode: BlendModeImpl;
    public readonly _$colorTransform: Float32Array;
    public _$filters: FilterArrayImpl | null;
    public _$visible: boolean;
    public _$maskId: number;
    public _$maskMatrix: Float32Array | null;
    public _$xMin: number;
    public _$yMin: number;
    public _$xMax: number;
    public _$yMax: number;
    public _$scale9Grid: Rectangle | null;
    public _$matrixBase: Float32Array | null;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$instanceId = -1;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$parentId = -1;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$loaderInfoId = -1;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$characterId = -1;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$clipDepth = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$depth = 0;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isMask = false;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$updated = true;

        /**
         * @type {Float32Array}
         * @private
         */
        this._$matrix = $getFloat32Array6(1, 0, 0, 1, 0, 0);

        /**
         * @type {Float32Array}
         * @private
         */
        this._$colorTransform = $getFloat32Array8(1, 1, 1, 1, 0, 0, 0, 0);

        /**
         * @type {string}
         * @default BlendMode.NORMAL
         * @private
         */
        this._$blendMode = "normal";

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$filters = null;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$visible = true;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$maskId = -1;

        /**
         * @type {Float32Array}
         * @default null
         * @private
         */
        this._$maskMatrix = null;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isMask = false;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$xMin = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$yMin = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$xMax = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$yMax = 0;

        /**
         * @type {Rectangle|null}
         * @default null
         * @private
         */
        this._$scale9Grid = null;

        /**
         * @type {Float32Array}
         * @default null
         * @private
         */
        this._$matrixBase = null;
    }

    /**
     * @param  {Float32Array} matrix
     * @return {boolean}
     * @method
     * @private
     */
    _$shouldClip (matrix: Float32Array): boolean
    {
        const bounds: BoundsImpl = this._$getBounds(matrix);
        const width: number  = $Math.abs(bounds.xMax - bounds.xMin);
        const height: number = $Math.abs(bounds.yMax - bounds.yMin);
        $poolBoundsObject(bounds);

        return !(!width || !height);
    }

    /**
     * @param   {Float32Array}  [matrix=null]
     * @returns {object}
     * @private
     */
    _$getLayerBounds (matrix: Float32Array | null = null): BoundsImpl
    {
        const baseBounds: BoundsImpl = this._$getBounds(matrix);

        const filters: FilterArrayImpl | null = this._$filters;
        if (!filters || !filters.length) {
            return baseBounds;
        }

        let rect: Rectangle = new Rectangle(
            baseBounds.xMin,
            baseBounds.yMin,
            baseBounds.xMax - baseBounds.xMin,
            baseBounds.yMax - baseBounds.yMin
        );
        $poolBoundsObject(baseBounds);

        for (let idx: number = 0; idx < filters.length; ++idx) {
            rect = filters[idx]._$generateFilterRect(rect, 0, 0);
        }

        const xMin = rect.x;
        const xMax = rect.x + rect.width;
        const yMin = rect.y;
        const yMax = rect.y + rect.height;

        return $getBoundsObject(xMin, xMax, yMin, yMax);
    }

    /**
     * @param   {Float32Array} [matrix=null]
     * @returns {object}
     * @method
     * @private
     */
    _$getBounds (matrix: Float32Array | null = null): BoundsImpl
    {
        const baseBounds: BoundsImpl = $getBoundsObject(
            this._$xMin, this._$xMax,
            this._$yMin, this._$yMax
        );

        if (!matrix) {
            return baseBounds;
        }

        let multiMatrix: Float32Array = matrix;
        const rawMatrix: Float32Array = this._$matrix;
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
        }

        const bounds: BoundsImpl = $boundsMatrix(baseBounds, multiMatrix);
        $poolBoundsObject(baseBounds);

        if (multiMatrix !== matrix) {
            $poolFloat32Array6(multiMatrix);
        }

        return bounds;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @return {Float32Array|boolean|null}
     * @method
     * @private
     */
    _$startClip (
        context: CanvasToWebGLContext,
        matrix: Float32Array
    ): Float32Array | boolean | null {

        let clipMatrix: Float32Array | null = null;

        // ネストしてない初回のマスクだけ実行
        // ネストしてる場合は初回に作られたbufferを流用
        if (!context.cacheAttachment) {

            let multiMatrix: Float32Array = matrix;
            const rawMatrix: Float32Array = this._$matrix;
            if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
                || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
                || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
            ) {
                multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
            }

            const baseBounds: BoundsImpl = this._$getBounds(null);
            const bounds: BoundsImpl = $boundsMatrix(baseBounds, multiMatrix);
            $poolBoundsObject(baseBounds);

            clipMatrix = context._$startClip(matrix, bounds);
            $poolBoundsObject(bounds);

            if (multiMatrix !== matrix) {
                $poolFloat32Array6(multiMatrix);
            }

            if (!clipMatrix) {
                return false;
            }

        }

        // start clip
        context._$enterClip();

        // mask start
        context._$beginClipDef();

        let containerClip = false;
        if ("_$children" in this) {
            containerClip = true;
            context._$updateContainerClipFlag(true);
        }

        // @ts-ignore
        this._$clip(context, clipMatrix || matrix);
        this._$updated = false;

        // container clip
        if (containerClip) {

            // update flag
            context._$updateContainerClipFlag(false);

            // execute clip
            context._$drawContainerClip();
        }

        // mask end
        context._$endClipDef();

        return clipMatrix;
    }

    /**
     * @description 描画情報を更新
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @private
     */
    _$update (object: PropertyMessageMapImpl<any>): void
    {
        this._$updated   = true;
        this._$visible   = object.visible;
        this._$isMask    = object.isMask;
        this._$depth     = object.depth;
        this._$clipDepth = object.clipDepth;

        this._$maskId = object.maskId;
        if (this._$maskId > -1 && object.maskMatrix) {
            this._$maskMatrix = object.maskMatrix;
        }

        this._$matrix[0] = object.a  || 1;
        this._$matrix[1] = object.b  || 0;
        this._$matrix[2] = object.c  || 0;
        this._$matrix[3] = object.d  || 1;
        this._$matrix[4] = object.tx || 0;
        this._$matrix[5] = object.ty || 0;

        this._$colorTransform[0] = object.f0 || 1;
        this._$colorTransform[1] = object.f1 || 1;
        this._$colorTransform[2] = object.f2 || 1;
        this._$colorTransform[3] = object.f3 || 1;
        this._$colorTransform[4] = object.f4 || 0;
        this._$colorTransform[5] = object.f5 || 0;
        this._$colorTransform[6] = object.f6 || 0;
        this._$colorTransform[7] = object.f7 || 0;

        this._$blendMode = object.blendMode || "normal";

        this._$filters = null;
        if (object.filters && object.filters.length) {
            this._$filters = $getArray();
            for (let idx: number = 0; idx < object.filters.length; ++idx) {

                const parameters = object.filters[idx];
                const type: number = parameters.shift();

                switch (type) {

                    case 0:
                        this._$filters.push(
                            new BevelFilter(...parameters)
                        );
                        break;

                    case 1:
                        this._$filters.push(
                            new BlurFilter(...parameters)
                        );
                        break;

                    case 2:
                        this._$filters.push(
                            new ColorMatrixFilter(...parameters)
                        );
                        break;

                    case 3:
                        this._$filters.push(
                            new ConvolutionFilter(...parameters)
                        );
                        break;

                    case 4:
                        this._$filters.push(
                            new DisplacementMapFilter(...parameters)
                        );
                        break;

                    case 5:
                        this._$filters.push(
                            new DropShadowFilter(...parameters)
                        );
                        break;

                    case 6:
                        this._$filters.push(
                            new GlowFilter(...parameters)
                        );
                        break;

                    case 7:
                        this._$filters.push(
                            new GradientBevelFilter(...parameters)
                        );
                        break;

                    case 8:
                        this._$filters.push(
                            new GradientGlowFilter(...parameters)
                        );
                        break;

                }
            }
        }

        if (object.grid) {
            this._$scale9Grid = new Rectangle(
                object.grid.x, object.grid.y,
                object.grid.w, object.grid.h
            );

            if (object.matrixBase) {
                this._$matrixBase = object.matrixBase;
            }
        }
    }

    /**
     * @param  {array} [filters]
     * @return {boolean}
     * @private
     */
    _$canApply (filters: FilterArrayImpl | null = null): boolean
    {
        if (filters) {
            for (let idx: number = 0; idx < filters.length; ++idx) {
                if (filters[idx]._$canApply()) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @description Playerから登録を削除
     *
     * @return {void}
     * @method
     * @private
     */
    _$remove (): void
    {
        const player: RenderPlayer = $renderPlayer;

        // キャッシュ削除のタイマーをセット
        const cacheStore: CacheStore = player.cacheStore;
        cacheStore.setRemoveTimer(this._$instanceId);

        if (this._$loaderInfoId > -1 && this._$characterId) {
            cacheStore.setRemoveTimer(
                `${this._$loaderInfoId}@${this._$characterId}`
            );
        }

        player.instances.delete(this._$instanceId);

        // reset
        this._$instanceId     = -1;
        this._$parentId       = -1;
        this._$loaderInfoId   = -1;
        this._$characterId    = -1;
        this._$updated        = true;
        this._$blendMode      = "normal";
        this._$filters        = null;
        this._$visible        = true;
        this._$maskId         = -1;
        this._$isMask         = false;
        this._$depth          = 0;
        this._$clipDepth      = 0;
        this._$scale9Grid     = null;
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$isUpdated (): boolean
    {
        return this._$updated;
    }

    /**
     * @param  {number}       width
     * @param  {number}       height
     * @param  {Float32Array} matrix
     * @param  {array}        [filters=null]
     * @param  {boolean}      [can_apply=false]
     * @param  {number}       [position_x=0]
     * @param  {number}       [position_y=0]
     * @return {boolean}
     * @private
     */
    _$isFilterUpdated (
        width: number, height: number, matrix: Float32Array,
        filters: FilterArrayImpl | null = null,
        can_apply: boolean = false,
        position_x: number = 0, position_y: number = 0
    ): boolean {

        // cache flag
        if (this._$isUpdated()) {
            return true;
        }

        // check filter data
        if (filters && can_apply) {

            for (let idx: number = 0; idx < filters.length; ++idx) {

                if (!filters[idx]._$isUpdated()) {
                    continue;
                }

                return true;
            }

        }

        // check status
        const cache: WebGLTexture | null = $renderPlayer
            .cacheStore
            .get([this._$instanceId, "f"]);

        if (!cache) {
            return true;
        }

        switch (true) {

            case cache.filterState !== can_apply:
            case cache.layerWidth  !== $Math.ceil(width):
            case cache.layerHeight !== $Math.ceil(height):
            case cache.matrix !== matrix[0] + "_"
                + matrix[1] + "_"
                + matrix[2] + "_"
                + matrix[3] + "_"
                + position_x + "_"
                + position_y:
                return true;

            default:
                return false;

        }
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {array} filters
     * @param  {WebGLTexture} target_texture
     * @param  {Float32Array} matrix
     * @param  {number} width
     * @param  {number} height
     * @return {WebGLTexture}
     * @private
     */
    _$applyFilter (
        context: CanvasToWebGLContext,
        filters: FilterArrayImpl,
        target_texture: WebGLTexture,
        matrix: Float32Array,
        width: number, height: number
    ): WebGLTexture {

        const xScale: number = +$Math.sqrt(
            matrix[0] * matrix[0]
            + matrix[1] * matrix[1]
        );
        const yScale: number = +$Math.sqrt(
            matrix[2] * matrix[2]
            + matrix[3] * matrix[3]
        );

        const radianX: number = $Math.atan2(matrix[1], matrix[0]);
        const radianY: number = $Math.atan2(0 - matrix[2], matrix[3]);

        const parentMatrix: Float32Array = $getFloat32Array6(
            $Math.cos(radianX), $Math.sin(radianX),
            0 - $Math.sin(radianY), $Math.cos(radianY),
            width / 2, height / 2
        );

        const baseMatrix: Float32Array = $getFloat32Array6(
            1, 0, 0, 1,
            0 - target_texture.width / 2,
            0 - target_texture.height / 2
        );

        const multiMatrix: Float32Array = $multiplicationMatrix(
            parentMatrix, baseMatrix
        );
        $poolFloat32Array6(parentMatrix);
        $poolFloat32Array6(baseMatrix);

        const manager: FrameBufferManager = context.frameBuffer;
        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;

        const attachment: AttachmentImpl = manager
            .createCacheAttachment(width, height);

        context._$bind(attachment);

        context.reset();
        context.setTransform(
            multiMatrix[0], multiMatrix[1],
            multiMatrix[2], multiMatrix[3],
            multiMatrix[4], multiMatrix[5]
        );
        $poolFloat32Array6(multiMatrix);

        context.drawImage(target_texture,
            0, 0, target_texture.width, target_texture.height
        );

        // init
        context._$offsetX = 0;
        context._$offsetY = 0;

        const filterMatrix: Float32Array = $getFloat32Array6(
            xScale, 0, 0, yScale, 0, 0
        );

        let texture: WebGLTexture | null = null;
        for (let idx: number = 0; idx < filters.length; ++idx) {
            texture = filters[idx]._$applyFilter(context, filterMatrix);
        }

        $poolFloat32Array6(filterMatrix);

        if (!texture) {
            return target_texture;
        }

        const offsetX: number = context._$offsetX;
        const offsetY: number = context._$offsetY;

        // reset
        context._$offsetX = 0;
        context._$offsetY = 0;

        // set offset
        texture._$offsetX = offsetX;
        texture._$offsetY = offsetY;

        // cache texture
        texture.matrix =
            matrix[0] + "_" + matrix[1] + "_"
            + matrix[2] + "_" + matrix[3];

        texture.filterState = true;
        texture.layerWidth  = width;
        texture.layerHeight = height;

        context._$bind(currentAttachment);
        manager.releaseAttachment(attachment, false);

        return texture;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {WebGLTexture}         target_texture
     * @param  {Float32Array}         matrix
     * @param  {array}                filters
     * @param  {number}               width
     * @param  {number}               height
     * @return {WebGLTexture}
     * @method
     * @private
     */
    _$drawFilter (
        context: CanvasToWebGLContext,
        target_texture: WebGLTexture,
        matrix: Float32Array,
        filters: FilterArrayImpl,
        width: number, height: number
    ): WebGLTexture {

        const cacheStore: CacheStore = $renderPlayer.cacheStore;

        const cacheKeys: any[] = [this._$instanceId, "f"];
        const cache: WebGLTexture | void = cacheStore.get(cacheKeys);

        const updated: boolean = this._$isFilterUpdated(
            width, height, matrix, filters, true
        );

        if (cache && !updated) {
            return cache;
        }

        // cache clear
        if (cache) {

            cacheStore.set(cacheKeys, null);
            cache.layerWidth     = 0;
            cache.layerHeight    = 0;
            cache._$offsetX      = 0;
            cache._$offsetY      = 0;
            cache.matrix         = null;
            cache.colorTransform = null;

            context
                .frameBuffer
                .releaseTexture(cache);
        }

        if (!cache || updated) {

            const texture = this._$applyFilter(
                context, filters, target_texture,
                matrix, width, height
            );

            cacheStore.set(cacheKeys, texture);

            return texture;
        }

        return cache;
    }
}