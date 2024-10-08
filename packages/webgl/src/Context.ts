import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { IBlendMode } from "./interface/IBlendMode";
import type { IBounds } from "./interface/IBounds";
import type { Node } from "@next2d/texture-packer";
import { execute as beginPath } from "./PathCommand/service/PathCommandBeginPathService";
import { execute as moveTo } from "./PathCommand/usecase/PathCommandMoveToUseCase";
import { execute as lineTo } from "./PathCommand/usecase/PathCommandLineToUseCase";
import { execute as quadraticCurveTo } from "./PathCommand/usecase/PathCommandQuadraticCurveToUseCase";
import { execute as closePath } from "./PathCommand/usecase/PathCommandClosePathUseCase";
import { execute as arc } from "./PathCommand/usecase/PathCommandArcUseCase";
import { execute as bezierCurveTo } from "./PathCommand/usecase/PathCommandBezierCurveToUseCase";
import { execute as contextUpdateBackgroundColorService } from "./Context/service/ContextUpdateBackgroundColorService";
import { execute as contextFillBackgroundColorService } from "./Context/service/ContextFillBackgroundColorService";
import { execute as contextResizeUseCase } from "./Context/usecase/ContextResizeUseCase";
import { execute as contextClearRectUseCase } from "./Context/usecase/ContextClearRectUseCase";
import { execute as contextBindUseCase } from "./Context/usecase/ContextBindUseCase";
import { execute as contextSaveService } from "./Context/service/ContextSaveService";
import { execute as contextRestoreService } from "./Context/service/ContextRestoreService";
import { execute as contextSetTransformService } from "./Context/service/ContextSetTransformService";
import { execute as contextTransformService } from "./Context/service/ContextTransformService";
import { execute as contextResetService } from "./Context/service/ContextResetService";
import { execute as contextResetStyleService } from "./Context/service/ContextResetStyleService";
import { execute as contextBeginNodeRenderingService } from "./Context/service/ContextBeginNodeRenderingService";
import { execute as contextEndNodeRenderingService } from "./Context/service/ContextEndNodeRenderingService";
import { execute as contextFillUseCase } from "./Context/usecase/ContextFillUseCase";
import { execute as contextGradientFillUseCase } from "./Context/usecase/ContextGradientFillUseCase";
import { execute as contextGradientStrokeUseCase } from "./Context/usecase/ContextGradientStrokeUseCase";
import { execute as contextClipUseCase } from "./Context/usecase/ContextClipUseCase";
import { execute as atlasManagerCreateNodeService } from "./AtlasManager/service/AtlasManagerCreateNodeService";
import { execute as atlasManagerRemoveNodeService } from "./AtlasManager/service/AtlasManagerRemoveNodeService";
import { execute as blnedDrawDisplayObjectUseCase } from "./Blend/usecase/BlnedDrawDisplayObjectUseCase";
import { execute as blnedClearArraysInstancedUseCase } from "./Blend/usecase/BlnedClearArraysInstancedUseCase";
import { execute as blnedDrawArraysInstancedUseCase } from "./Blend/usecase/BlnedDrawArraysInstancedUseCase";
import { execute as vertexArrayObjectBootUseCase } from "./VertexArrayObject/usecase/VertexArrayObjectBootUseCase";
import { execute as frameBufferManagerTransferMainCanvasService } from "./FrameBufferManager/service/FrameBufferManagerTransferMainCanvasService";
import { execute as blendEnableUseCase } from "./Blend/usecase/BlendEnableUseCase";
import { execute as maskBeginMaskService } from "./Mask/service/MaskBeginMaskService";
import { execute as maskStartMaskService } from "./Mask/service/MaskStartMaskService";
import { execute as maskEndMaskService } from "./Mask/service/MaskEndMaskService";
import { execute as maskLeaveMaskService } from "./Mask/service/MaskLeaveMaskService";
import { execute as contextDrawPixelsUseCase } from "./Context/usecase/ContextDrawPixelsUseCase";
import { execute as contextBitmapFillUseCase } from "./Context/usecase/ContextBitmapFillUseCase";
import { execute as contextBitmapStrokeUseCase } from "./Context/usecase/ContextBitmapStrokeUseCase";
import { execute as contextStrokeUseCase } from "./Context/usecase/ContextStrokeUseCase";
import { execute as contextBeginGridService } from "./Context/service/ContextBeginGridService";
import { execute as contextEndGridService } from "./Context/service/ContextEndGridService";
import { execute as contextSetGridOffsetService } from "./Context/service/ContextSetGridOffsetService";
import { execute as contextApplyFilterUseCase } from "./Context/usecase/ContextApplyFilterUseCase";
import { $getAtlasAttachmentObject } from "./AtlasManager";
import { $setGradientLUTGeneratorMaxLength } from "./Shader/GradientLUTGenerator";
import {
    $setReadFrameBuffer,
    $setDrawFrameBuffer,
    $getCurrentAttachment,
    $setAtlasFrameBuffer,
    $setBitmapFrameBuffer
} from "./FrameBufferManager";
import {
    $setRenderMaxSize,
    $setWebGL2RenderingContext,
    $setSamples,
    $getFloat32Array9,
    $getArray,
    $setContext
} from "./WebGLUtil";

/**
 * @description WebGL版、Next2Dのコンテキスト
 *              WebGL version, Next2D context
 *
 * @class
 */
export class Context
{
    /**
     * @description matrixのデータを保持するスタック
     *              Stack to hold matrix data
     *
     * @type {Float32Array[]}
     * @protected
     */
    public readonly $stack: Float32Array[];

    /**
     * @description 2D変換行列
     *              2D transformation matrix
     *
     * @type {Float32Array}
     * @protected
     */
    public readonly $matrix: Float32Array;

    /**
     * @description 背景色のR
     *              Background color R
     *
     * @type {number}
     * @protected
     */
    public $clearColorR: number;

    /**
     * @description 背景色のG
     *              Background color G
     *
     * @type {number}
     * @protected
     */
    public $clearColorG: number;

    /**
     * @description 背景色のB
     *              Background color B
     *
     * @type {number}
     * @protected
     */
    public $clearColorB: number;

    /**
     * @description 背景色のA
     *              Background color A
     *
     * @type {number}
     * @protected
     */
    public $clearColorA: number;

    /**
     * @description メインのアタッチメントオブジェクト
     *              Main attachment object
     *
     * @type {IAttachmentObject}
     * @protected
     */
    public $mainAttachmentObject: IAttachmentObject | null;

    /**
     * @description アタッチメントオブジェクトを保持するスタック
     *             Stack to hold attachment objects
     * 
     * @type {IAttachmentObject[]}
     * @protected
     */
    public readonly $stackAttachmentObject: IAttachmentObject[];

    /**
     * @description グローバルアルファ
     *              Global alpha
     *
     * @type {number}
     * @default 1
     * @public
     */
    public globalAlpha: number;

    /**
     * @description 合成モード
     *              composite mode
     *
     * @type {IBlendMode}
     * @default "normal"
     * @public
     */
    public globalCompositeOperation: IBlendMode;

    /**
     * @description イメージのスムージング設定
     *              Image smoothing setting
     *
     * @type {boolean}
     * @default false
     * @public
     */
    public imageSmoothingEnabled: boolean;

    /**
     * @description 塗りつぶしのRGBAを保持するFloat32Array
     *              Float32Array that holds the RGBA of the fill
     *
     * @type {Float32Array}
     * @protected
     */
    public $fillStyle: Float32Array;

    /**
     * @description 線のRGBAを保持するFloat32Array
     *              Float32Array that holds the RGBA of the line
     *
     * @type {Float32Array}
     * @protected
     */
    public $strokeStyle: Float32Array;

    /**
     * @description マスクの描画範囲
     *              Drawing range of the mask
     *
     * @type {IBounds}
     * @protected
     */
    public readonly maskBounds: IBounds;

    /**
     * @description ストロークの太さ
     *              Stroke thickness
     *
     * @type {number}
     * @public
     */
    public thickness: number;

    /**
     * @description ストロークのキャップ
     *              Stroke cap
     *
     * @type {number}
     * @public
     */
    public caps: number;

    /**
     * @description ストロークのジョイント
     *              Stroke joint
     *
     * @type {number}
     * @public
     */
    public joints: number;

    /**
     * @description ストロークのマイターリミット
     *              Stroke miter limit
     *
     * @type {number}
     * @public
     */
    public miterLimit: number;

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {number} samples
     * @constructor
     * @public
     */
    constructor (gl: WebGL2RenderingContext, samples: number)
    {
        $setWebGL2RenderingContext(gl);
        $setRenderMaxSize(gl.getParameter(gl.MAX_TEXTURE_SIZE));
        $setSamples(samples);

        this.$stack = $getArray();
        this.$stackAttachmentObject = $getArray();
        this.$matrix = $getFloat32Array9(1, 0, 0, 0, 1, 0, 0, 0, 1);

        // bakground color
        this.$clearColorR = 0;
        this.$clearColorG = 0;
        this.$clearColorB = 0;
        this.$clearColorA = 0;

        // stroke
        this.thickness  = 1;
        this.caps       = 1;
        this.joints     = 2;
        this.miterLimit = 0;

        // メインのアタッチメントオブジェクト
        this.$mainAttachmentObject = null;

        // グローバルアルファ、合成モード、イメージのスムージング設定
        this.globalAlpha              = 1;
        this.globalCompositeOperation = "normal";
        this.imageSmoothingEnabled    = false;

        // 塗りつぶしタイプ、ストロークタイプ
        this.$fillStyle   = new Float32Array([1, 1, 1, 1]);
        this.$strokeStyle = new Float32Array([1, 1, 1, 1]);

        // マスクの描画範囲
        this.maskBounds = {
            "xMin": 0,
            "yMin": 0,
            "xMax": 0,
            "yMax": 0
        };

        // WebTextureの設定
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        // FrameBufferManagerの初期起動
        $setReadFrameBuffer(gl);
        $setDrawFrameBuffer(gl);
        $setAtlasFrameBuffer(gl);
        $setBitmapFrameBuffer(gl);

        // VertexArrayObjectの初期起動
        vertexArrayObjectBootUseCase(gl);

        // ブレンドモードを有効にする
        blendEnableUseCase();

        // グラデーションの最大長を設定
        $setGradientLUTGeneratorMaxLength(gl);

        // コンテキストをセット
        $setContext(this);
    }

    /**
     * @description 背景色を更新
     *              Update background color
     *
     * @param  {number} red
     * @param  {number} green
     * @param  {number} blue
     * @param  {number} alpha
     * @return {void}
     * @method
     * @public
     */
    updateBackgroundColor (red: number, green: number, blue: number, alpha: number): void
    {
        contextUpdateBackgroundColorService(this, red, green, blue, alpha);
    }

    /**
     * @description 背景色を指定カラーで塗りつぶす
     *              Fill the background color with the specified color
     *
     * @return {void}
     * @method
     * @public
     */
    fillBackgroundColor (): void
    {
        contextFillBackgroundColorService(
            this.$clearColorR,
            this.$clearColorG,
            this.$clearColorB,
            this.$clearColorA
        );
    }

    /**
     * @description メインcanvasのサイズを変更
     *              Change the size of the main canvas
     *
     * @param  {number} width
     * @param  {number} height
     * @return {void}
     * @method
     * @public
     */
    resize (width: number, height: number): void
    {
        contextResizeUseCase(this, width, height);
    }

    /**
     * @description 指定範囲をクリアする
     *              Clear the specified range
     *
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @return {void}
     * @method
     * @purotected
     */
    clearRect (x: number, y: number, w: number, h: number): void
    {
        contextClearRectUseCase(x, y, w, h);
    }

    /**
     * @description アタッチメントオブジェクトをバインド
     *              Bind the attachment object
     *
     * @param {IAttachmentObject} attachment_object
     * @return {void}
     * @method
     * @public
     */
    bind (attachment_object: IAttachmentObject): void
    {
        contextBindUseCase(this, attachment_object);
    }

    /**
     * @description 現在の2D変換行列を保存
     *             Save the current 2D transformation matrix
     *
     * @return {void}
     * @method
     * @public
     */
    save (): void
    {
        contextSaveService(this);
    }

    /**
     * @description 2D変換行列を復元
     *              Restore 2D transformation matrix
     *
     * @return {void}
     * @method
     * @public
     */
    restore (): void
    {
        contextRestoreService(this);
    }

    /**
     * @description 2D変換行列を設定
     *              Set 2D transformation matrix
     *
     * @param  {number} a
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @param  {number} e
     * @param  {number} f
     * @return {void}
     * @method
     * @public
     */
    setTransform (
        a: number, b: number, c: number,
        d: number, e: number, f: number
    ): void {
        contextSetTransformService(this.$matrix, a, b, c, d, e, f);
    }

    /**
     * @description 現在の2D変換行列に対して乗算を行います。
     *              Multiply the current 2D transformation matrix.
     *
     * @param  {number} a
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @param  {number} e
     * @param  {number} f
     * @return {void}
     * @method
     * @public
     */
    transform (
        a: number, b: number, c: number,
        d: number, e: number, f: number
    ): void {
        contextTransformService(this, a, b, c, d, e, f);
    }

    /**
     * @description コンテキストの値を初期化する
     *              Initialize the values of the context
     *
     * @return {void}
     * @method
     * @public
     */
    reset (): void
    {
        contextResetService(this);
    }

    /**
     * @description パスを開始
     *              Start the path
     *
     * @return {void}
     * @method
     * @public
     */
    beginPath (): void
    {
        // reset color style
        contextResetStyleService(this);

        // begin path
        beginPath();
    }

    /**
     * @description パスを移動
     *              Move the path
     *
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @method
     * @public
     */
    moveTo (x: number, y: number): void
    {
        moveTo(x, y);
    }

    /**
     * @description パスを線で結ぶ
     *              Connect the path with a line
     *
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @method
     * @public
     */
    lineTo (x: number, y: number): void
    {
        lineTo(x, y);
    }

    /**
     * @description 二次ベジェ曲線を描画
     *              Draw a quadratic Bezier curve
     *
     * @param  {number} cx
     * @param  {number} cy
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @method
     * @public
     */
    quadraticCurveTo (cx: number, cy: number, x: number, y: number): void
    {
        quadraticCurveTo(cx, cy, x, y);
    }

    /**
     * @description 塗りつぶしスタイルを設定
     *              Set fill style
     *
     * @param  {number} red
     * @param  {number} green
     * @param  {number} blue
     * @param  {number} alpha
     * @return {void}
     * @method
     * @public
     */
    fillStyle (red: number, green: number, blue: number, alpha: number): void
    {
        this.$fillStyle[0] = red;
        this.$fillStyle[1] = green;
        this.$fillStyle[2] = blue;
        this.$fillStyle[3] = alpha;
    }

    /**
     * @description 線のスタイルを設定
     *              Set line style
     *
     * @param  {number} red
     * @param  {number} green
     * @param  {number} blue
     * @param  {number} alpha
     * @return {void}
     * @method
     * @public
     */
    strokeStyle (red: number, green: number, blue: number, alpha: number): void
    {
        this.$strokeStyle[0] = red;
        this.$strokeStyle[1] = green;
        this.$strokeStyle[2] = blue;
        this.$strokeStyle[3] = alpha;
    }

    /**
     * @description パスを閉じる
     *              Close the path
     *
     * @return {void}
     * @method
     * @public
     */
    closePath (): void
    {
        closePath();
    }

    /**
     * @description 円弧を描画
     *              Draw an arc
     *
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @return {void}
     * @method
     * @public
     */
    arc (x: number, y: number, radius: number): void
    {
        arc(x, y, radius);
    }

    /**
     * @description 3次ベジェ曲線を描画
     *              Draw a cubic Bezier curve
     *
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
    bezierCurveTo (cx1: number, cy1: number, cx2: number, cy2: number, x: number, y: number): void
    {
        bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
    }

    /**
     * @description 塗りつぶしを実行
     *              Perform fill
     *
     * @return {void}
     * @method
     * @public
     */
    fill (): void
    {
        contextFillUseCase();
    }

    /**
     * @description グラデーションの塗りつぶしを実行
     *              Perform gradient fill
     *
     * @param  {number} type
     * @param  {array} stops
     * @param  {Float32Array} matrix
     * @param  {number} spread
     * @param  {number} interpolation
     * @param  {number} focal
     * @return {void}
     * @method
     * @public
     */
    gradientFill (
        type: number,
        stops: number[],
        matrix: Float32Array,
        spread: number,
        interpolation: number,
        focal: number
    ): void {
        contextGradientFillUseCase(
            type, stops, matrix,
            spread, interpolation, focal
        );
    }

    /**
     * @description 塗りのピクセルデータを描画
     *              Draw pixel data of the fill
     *
     * @param  {Uint8Array} pixels
     * @param  {number} width
     * @param  {number} height
     * @param  {boolean} repeat
     * @param  {boolean} smooth
     * @return {void}
     * @method
     * @public
     */
    bitmapFill (
        pixels: Uint8Array,
        width: number,
        height: number,
        repeat: boolean,
        smooth: boolean
    ): void {
        contextBitmapFillUseCase(
            pixels, width, height, repeat, smooth
        );
    }

    /**
     * @description 線の描画を実行
     *              Perform line drawing
     *
     * @return {void}
     * @method
     * @public
     */
    stroke (): void
    {
        contextStrokeUseCase();
    }

    /**
     * @description 線のグラデーションを実行
     *              Perform gradient of the line
     *
     * @param  {number} type
     * @param  {array} stops
     * @param  {Float32Array} matrix
     * @param  {number} spread
     * @param  {number} interpolation
     * @param  {number} focal
     * @return {void}
     * @method
     * @public
     */
    gradientStroke (
        type: number,
        stops: number[],
        matrix: Float32Array,
        spread: number,
        interpolation: number,
        focal: number
    ): void {
        contextGradientStrokeUseCase(
            type, stops, matrix,
            spread, interpolation, focal
        );
    }

    /**
     * @description 線のピクセルデータを描画
     *              Draw pixel data of the line
     *
     * @param  {Uint8Array} pixels
     * @param  {number} width
     * @param  {number} height
     * @param  {boolean} repeat
     * @param  {boolean} smooth
     * @return {void}
     * @method
     * @public
     */
    bitmapStroke (
        pixels: Uint8Array,
        width: number,
        height: number,
        repeat: boolean,
        smooth: boolean
    ): void {
        contextBitmapStrokeUseCase(
            pixels, width, height, repeat, smooth
        );
    }

    /**
     * @description マスク処理を実行
     *              Perform mask processing
     *
     * @return {void}
     * @method
     * @public
     */
    clip (): void
    {
        contextClipUseCase();
    }

    /**
     * @description 現在のアタッチメントオブジェクトを取得
     *              Get the current attachment object
     *
     * @return {IAttachmentObject | null}
     * @readonly
     * @public
     */
    get currentAttachmentObject (): IAttachmentObject | null
    {
        return $getCurrentAttachment();
    }

    /**
     * @description アトラス専用のアタッチメントオブジェクトを取得
     *              Get the attachment object for the atlas
     *
     * @return {IAttachmentObject}
     * @readonly
     * @public
     */
    get atlasAttachmentObject (): IAttachmentObject
    {
        return $getAtlasAttachmentObject();
    }

    /**
     * @description キャッシュするポジションのノードを作成
     *              Create a node for the position to cache
     *
     * @param  {number} width
     * @param  {number} height
     * @return {Node}
     * @method
     * @public
     */
    createNode (width: number, height: number): Node
    {
        return atlasManagerCreateNodeService(width, height);
    }

    /**
     * @description 指定のノードを削除
     *              Remove the specified node
     *
     * @param  {Node} node
     * @return {void}
     * @method
     * @public
     */
    removeNode (node: Node): void
    {
        atlasManagerRemoveNodeService(node);
    }

    /**
     * @description 指定のノード範囲で描画を開始
     *              Start drawing in the specified node range
     *
     * @param  {Node} node
     * @return {void}
     * @method
     * @public
     */
    beginNodeRendering (node: Node): void
    {
        contextBeginNodeRenderingService(
            node.x, node.y, node.w, node.h
        );
    }

    /**
     * @description 指定のノード範囲で描画を終了
     *              End drawing in the specified node range
     *
     * @return {void}
     * @method
     * @public
     */
    endNodeRendering (): void
    {
        contextEndNodeRenderingService();
    }

    /**
     * @description インスタンスを描画
     *              Draw an instance
     *
     * @param  {number} x_min
     * @param  {number} y_min
     * @param  {number} x_max
     * @param  {number} y_max
     * @param  {Float32Array} color_transform
     * @return {void}
     * @method
     * @public
     */
    drawDisplayObject (
        node: Node,
        x_min: number,
        y_min: number,
        x_max: number,
        y_max: number,
        color_transform: Float32Array
    ): void {
        blnedDrawDisplayObjectUseCase(
            node, x_min, y_min, x_max, y_max, color_transform
        );
    }

    /**
     * @description インスタンス配列を描画
     *              Draw an instance array
     *
     * @return {void}
     * @method
     * @public
     */
    drawArraysInstanced (): void
    {
        blnedDrawArraysInstancedUseCase();
    }

    /**
     * @description インスタンス配列をクリア
     *              Clear the instance array
     *
     * @return {void}
     * @method
     * @public
     */
    clearArraysInstanced (): void
    {
        blnedClearArraysInstancedUseCase();
    }

    /**
     * @description フレームバッファの描画情報をキャンバスに転送
     *              Transfer the drawing information of the frame buffer to the canvas
     *
     * @return {void}
     * @method
     * @public
     */
    transferMainCanvas (): void
    {
        frameBufferManagerTransferMainCanvasService();
    }

    /**
     * @description ピクセルバッファをNodeの指定箇所に転送
     *              Transfer the pixel buffer to the specified location of the Node
     *
     * @param  {Node} node
     * @param  {Uint8Array} pixels
     * @return {void}
     * @method
     * @public
     */
    drawPixels (node: Node, pixels: Uint8Array): void
    {
        contextDrawPixelsUseCase(node, pixels);
    }

    /**
     * @description マスクを開始準備
     *              Prepare to start drawing the mask
     *
     * @return {void}
     * @method
     * @public
     */
    beginMask (): void
    {
        maskBeginMaskService();
    }

    /**
     * @description マスクの描画を開始
     *              Start drawing the mask
     *
     * @param  {number} x_min
     * @param  {number} y_min
     * @param  {number} x_max
     * @param  {number} y_max
     * @return {void}
     * @method
     * @public
     */
    startMask (
        x_min: number,
        y_min: number,
        x_max: number,
        y_max: number
    ): void {
        maskStartMaskService(x_min, y_min, x_max, y_max);
    }

    /**
     * @description マスクの描画を終了
     *              End mask drawing
     *
     * @return {void}
     * @method
     * @public
     */
    endMask (): void
    {
        maskEndMaskService();
    }

    /**
     * @description マスクの終了処理
     *              Mask end processing
     *
     * @return {void}
     * @method
     * @public
     */
    leaveMask (): void
    {
        this.drawArraysInstanced();
        maskLeaveMaskService();
    }

    /**
     * @description グリッドの描画を開始
     *              Start drawing the grid
     *
     * @param {Float32Array} grid_data
     * @return {void}
     * @method
     * @public
     */
    beginGrid (grid_data: Float32Array): void
    {
        contextBeginGridService(grid_data);
    }

    /**
     * @description グリッドの描画を終了
     *              End drawing the grid
     *
     * @return {void}
     * @method
     * @public
     */
    endGrid (): void
    {
        contextEndGridService();
    }

    /**
     * @description グリッドのオフセットを設定
     *              Set the grid offset
     *
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @method
     * @public
     */
    setGridOffset (x: number, y: number): void
    {
        contextSetGridOffsetService(x, y);
    }

    /**
     * @description フィルターを適用
     *              Apply the filter
     * 
     * @param  {Node} node
     * @param  {string} unique_key
     * @param  {number} width
     * @param  {number} height
     * @param  {Float32Array} matrix
     * @param  {Float32Array} params
     * @return {void}
     * @method
     * @public
     */
    applyFilter (
        node: Node,
        unique_key: string,
        width: number,
        height: number,
        matrix: Float32Array,
        params: Float32Array
    ): void {
        contextApplyFilterUseCase(
            node, unique_key, width, height, matrix, params
        );
    }
}