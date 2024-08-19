import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { IBlendMode } from "./interface/IBlendMode";
import type { IFillTyle } from "./interface/IFillTyle";
import type { IStrokeTyle } from "./interface/IStrokeTyle";
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
import { execute as contextClearRectService } from "./Context/service/ContextClearRectService";
import { execute as contextBindUseCase } from "./Context/usecase/ContextBindUseCase";
import { execute as contextSaveService } from "./Context/service/ContextSaveService";
import { execute as contextRestoreService } from "./Context/service/ContextRestoreService";
import { execute as contextSetTransformService } from "./Context/service/ContextSetTransformService";
import { execute as contextTransformService } from "./Context/service/ContextTransformService";
import { execute as contextResetService } from "./Context/service/ContextResetService";
import { execute as contextResetStyleService } from "./Context/service/ContextResetStyleService";
import { execute as contextBeginNodeRenderingService } from "./Context/service/ContextBeginNodeRenderingService";
import { execute as contextEndNodeRenderingService } from "./Context/service/ContextEndNodeRenderingService";
import { execute as contextDebugService } from "./Context/service/ContextDebugService";
import { execute as contextFillUseCase } from "./Context/usecase/ContextFillUseCase";
import { execute as atlasManagerBootUseCase } from "./AtlasManager/usecase/AtlasManagerBootUseCase";
import { execute as atlasManagerCreateNodeService } from "./AtlasManager/service/AtlasManagerCreateNodeService";
import { $getAtlasAttachmentObject } from "./AtlasManager";
import {
    $setReadFrameBuffer,
    $setDrawFrameBuffer,
    $getCurrentAttachment
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
    public $mainAttachment: IAttachmentObject | null;

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
     * @description 塗りつぶしタイプ
     *              Fill type
     * 
     * @type {number}
     * @default -1
     * @protected
     */
    public $fillType: IFillTyle;

    /**
     * @description ストロークタイプ
     *              Stroke type
     * 
     * @type {number}
     * @default -1
     * @protected
     */
    public $strokeType: IStrokeTyle;

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

        this.$stack  = $getArray();
        this.$matrix = $getFloat32Array9(1, 0, 0, 0, 1, 0, 0, 0, 1);

        // bakground color
        this.$clearColorR = 0;
        this.$clearColorG = 0;
        this.$clearColorB = 0;
        this.$clearColorA = 0;

        // メインのアタッチメントオブジェクト
        this.$mainAttachment = null;

        // グローバルアルファ、合成モード、イメージのスムージング設定
        this.globalAlpha              = 1;
        this.globalCompositeOperation = "normal";
        this.imageSmoothingEnabled    = false;

        // 塗りつぶしタイプ、ストロークタイプ
        this.$fillType   = -1;
        this.$strokeType = -1;

        this.$fillStyle   = new Float32Array([1, 1, 1, 1]);
        this.$strokeStyle = new Float32Array([1, 1, 1, 1]);

        // WebTextureの設定
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        // FrameBufferManagerの初期起動
        $setReadFrameBuffer(gl);
        $setDrawFrameBuffer(gl);

        // AtlasManagerの初期起動
        atlasManagerBootUseCase();

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
        contextClearRectService(x, y, w, h);
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
        contextSetTransformService(this, a, b, c, d, e, f);
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
        this.$fillType = 0;
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
        this.$strokeType = 0;
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
     * @param  {boolean} has_grid
     * @return {void}
     * @method
     * @public
     */
    fill (has_grid: boolean): void
    {
        contextFillUseCase(has_grid);
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
        console.log("stroke");
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
    drawInstance (
        node: Node,
        x_min: number, 
        y_min: number,
        x_max: number,
        y_max: number, 
        color_transform: Float32Array
    ): void {
        console.log("drawInstance", node, x_min, y_min, x_max, y_max, color_transform);
    }

    debug = (): void =>
    {
        contextDebugService();
    }
}