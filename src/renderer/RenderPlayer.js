/**
 * @class
 */
class RenderPlayer
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {Map}
         * @private
         */
        this._$instances = new Map();

        /**
         * @type {CacheStore}
         * @private
         */
        this._$cacheStore = new CacheStore();

        /**
         * @type {Float32Array}
         * @default null
         * @private
         */
        this._$matrix = Util.$getFloat32Array6(1, 0, 0, 1, 0, 0);

        /**
         * @type {Float32Array}
         * @default null
         * @private
         */
        this._$colorTransform = new $Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$stopFlag = true;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$timerId = -1;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$startTime = 0;

        /**
         * @type {number}
         * @default 60
         * @private
         */
        this._$frameRate = 60;

        /**
         * @type {number}
         * @private
         */
        this._$fps = 1000 / 60;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$width = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$height = 0;

        /**
         * @type {RenderDisplayObjectContainer}
         * @default null
         * @private
         */
        this._$stage = new RenderDisplayObjectContainer();

        /**
         * @type {array}
         * @private
         */
        this._$videos = [];

        /**
         * @type {number}
         * @default 4
         * @private
         */
        this._$samples = 4;

        /**
         * @type {OffscreenCanvas}
         * @default null
         * @private
         */
        this._$canvas = null;

        /**
         * @type {CanvasToWebGLContext}
         * @default null
         * @private
         */
        this._$context = null;

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$buffer = null;

        /**
         * @type {function}
         * @private
         */
        this._$bindRun = this._$run.bind(this);
    }

    /**
     * @description 描画を開始
     *
     * @return {void}
     * @method
     * @public
     */
    play ()
    {
        if (this._$stopFlag) {

            this._$stopFlag = false;

            if (this._$timerId > -1) {
                const clearTimer = $cancelAnimationFrame;
                clearTimer(this._$timerId);
                this._$timerId = -1;
            }

            this._$startTime = $performance.now();

            this._$fps = 1000 / this._$frameRate;

            const timer = $requestAnimationFrame;
            this._$timerId = timer(this._$bindRun);
        }
    }

    /**
     * @description 描画の停止
     *
     * @return {void}
     * @method
     * @public
     */
    stop ()
    {
        const clearTimer = $cancelAnimationFrame;
        clearTimer(this._$timerId);

        this._$stopFlag = true;
        this._$timerId  = -1;
    }

    /**
     * @description フレームレートに合わせて描画を実行
     *
     * @param  {number} timestamp
     * @return {void}
     * @method
     * @public
     */
    _$run (timestamp = 0)
    {
        if (this._$stopFlag) {
            return ;
        }

        let delta = timestamp - this._$startTime;
        if (delta > this._$fps) {

            // update
            this._$startTime = timestamp - delta % this._$fps;

            // execute
            this._$draw();

        } else {

            if (this._$videos.length) {
                this._$draw();
            }

        }

        // next frame
        const timer = $requestAnimationFrame;
        this._$timerId = timer(this._$bindRun);
    }

    /**
     * @description 描画処理を実行
     *
     * @return {void}
     * @method
     * @private
     */
    _$draw ()
    {
        if (!this._$width || !this._$height) {
            return ;
        }

        if (!this._$stage._$updated) {
            return ;
        }

        const context = this._$context;

        context._$bind(this._$buffer);

        // reset
        Util.$resetContext(context);
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, this._$width, this._$height);
        context.beginPath();

        this._$stage._$draw(
            context,
            this._$matrix,
            Util.$COLOR_ARRAY_IDENTITY
        );

        // stage end
        this._$stage._$updated = false;

        const manager = context._$frameBufferManager;
        const texture = manager.getTextureFromCurrentAttachment();

        manager.unbind();

        // reset and draw to main canvas
        Util.$resetContext(context);
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, this._$width, this._$height);
        context.drawImage(texture, 0, 0, this._$width, this._$height);

        // re bind
        context._$bind(this._$buffer);
    }

    /**
     * @description 描画範囲のサイズを変更
     *
     * @param  {number} width
     * @param  {number} height
     * @param  {number} scale
     * @param  {number} [tx = 0]
     * @param  {number} [ty = 0]
     * @return {void}
     * @method
     * @private
     */
    _$resize (width, height, scale, tx = 0, ty = 0)
    {
        this._$width  = width;
        this._$height = height;

        this._$canvas.width  = width;
        this._$canvas.height = height;

        const context = this._$context;

        context._$gl.viewport(0, 0, width, height);

        const manager = context._$frameBufferManager;
        if (this._$buffer) {
            manager.unbind();
            manager.releaseAttachment(this._$buffer, true);
        }

        this._$buffer = manager
            .createCacheAttachment(width, height, false);

        this._$matrix[0] = scale;
        this._$matrix[3] = scale;
        this._$matrix[4] = tx;
        this._$matrix[5] = ty;

        // update cache max size
        manager._$stencilBufferPool._$maxWidth  = width;
        manager._$stencilBufferPool._$maxHeight = height;
        manager._$textureManager._$maxWidth     = width;
        manager._$textureManager._$maxHeight    = height;
        context._$pbo._$maxWidth                = width;
        context._$pbo._$maxHeight               = height;

        this._$stage._$updated = true;
        this._$cacheStore.reset();
    }

    /**
     * @param  {number} instance_id
     * @return {void}
     * @method
     * @private
     */
    _$setStage (instance_id)
    {
        this._$stage._$instanceId = instance_id;
        this._$instances.set(instance_id, this._$stage);
    }

    /**
     * @description Stageの更新情報をセット
     *
     * @return {void}
     * @method
     * @private
     */
    _$updateStage ()
    {
        this._$stage._$updated = true;
    }

    /**
     * @description DisplayObjectContainerクラスを生成
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @private
     */
    _$createDisplayObjectContainer (object)
    {
        const sprite = Util.$getDisplayObjectContainer();

        sprite._$instanceId = object.instanceId;

        if (object.recodes) {
            sprite._$recodes = object.recodes;
            sprite._$xMin    = object.xMin;
            sprite._$yMin    = object.yMin;
            sprite._$xMax    = object.xMax;
            sprite._$yMax    = object.yMax;
        }

        this._$instances.set(sprite._$instanceId, sprite);
    }

    /**
     * @description Shapeクラスを生成
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @private
     */
    _$createShape (object)
    {
        const shape = Util.$getShape();

        shape._$instanceId = object.instanceId;
        shape._$recodes    = object.recodes;
        shape._$maxAlpha   = object.maxAlpha;
        shape._$canDraw    = object.canDraw;

        shape._$xMin = object.xMin;
        shape._$yMin = object.yMin;
        shape._$xMax = object.xMax;
        shape._$yMax = object.yMax;

        if ("characterId" in object) {
            shape._$characterId = object.characterId;
        }
        if ("loaderInfoId" in object) {
            shape._$loaderInfoId = object.loaderInfoId;
        }

        if (object.grid) {
            shape._$scale9Grid = new Rectangle(
                object.grid.x, object.grid.y,
                object.grid.w, object.grid.h
            );
        }

        this._$instances.set(shape._$instanceId, shape);
    }

    /**
     * @description Videoクラスを生成
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @private
     */
    _$createVideo (object)
    {
        const video = Util.$getVideo();

        video._$instanceId = object.instanceId;

        if ("characterId" in object) {
            video._$characterId = object.characterId;
        }
        if ("loaderInfoId" in object) {
            video._$loaderInfoId = object.loaderInfoId;
        }

        video._$updateProperty(object);

        this._$instances.set(video._$instanceId, video);
    }

    /**
     * @description TextFieldクラスを生成
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @private
     */
    _$createTextField (object)
    {
        const textField = Util.$getTextField();

        textField._$instanceId = object.instanceId;

        // bounds
        textField._$xMin = object.xMin;
        textField._$yMin = object.yMin;
        textField._$xMax = object.xMax;
        textField._$yMax = object.yMax;

        if ("characterId" in object) {
            textField._$characterId = object.characterId;
        }
        if ("loaderInfoId" in object) {
            textField._$loaderInfoId = object.loaderInfoId;
        }

        textField._$updateProperty(object);

        this._$instances.set(textField._$instanceId, textField);
    }
}

Util.$renderPlayer = new RenderPlayer();