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
         * @type {Float32Array}
         * @default null
         * @private
         */
        this._$matrix = null;

        /**
         * @type {Float32Array}
         * @default null
         * @private
         */
        this._$colorTransform = new $Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

        /**
         * @type {number}
         * @private
         */
        this._$fps = 1000 / 60;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$stopFlag = false;

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
         * @type {function}
         * @private
         */
        this._$bindRun = this.run.bind(this);

        /**
         * @type {Renderer}
         * @default null
         * @private
         */
        this._$renderer = null;

        /**
         * @type {RenderDisplayObjectContainer}
         * @default null
         * @private
         */
        this._$stage = null;
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
    run (timestamp = 0)
    {
        if (this._$stopFlag) {
            return ;
        }

        let delta = timestamp - this._$startTime;
        if (delta > this._$fps) {

            // update
            this._$startTime = timestamp - delta % this._$fps;

            // execute
            this.draw();

        } else {

            if (this._$videos.length) {
                this.draw();
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
     * @public
     */
    draw ()
    {
        if (this._$renderer
            && this._$renderer._$width > 0
            && this._$renderer._$height > 0
            && this._$stage._$updated
        ) {

            this._$renderer.begin(this._$width, this._$height);

            this._$stage._$draw(
                this._$renderer,
                this._$matrix,
                this._$colorTransform
            );

            // stage end
            this._$stage._$updated = false;

            this._$renderer.updateMain();
        }
    }
}

Util.$renderPlayer = new RenderPlayer();