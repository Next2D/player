/**
 * @class
 */
class Player
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        /**
         * @type {Stage}
         * @private
         */
        this._$stage = new Stage();
        this._$stage._$player = this;

        /**
         * @type {CacheStore}
         * @private
         */
        this._$cacheStore = new CacheStore();

        /**
         * @type {string}
         * @private
         */
        this._$mode = "loader";

        /**
         * @type {number}
         * @private
         */
        this._$actionOffset = 0;

        /**
         * @type {array}
         * @private
         */
        this._$actions = Util.$getArray();

        /**
         * @type {array}
         * @private
         */
        this._$loaders = Util.$getArray();

        /**
         * @type {array}
         * @private
         */
        this._$sounds = Util.$getMap();

        /**
         * @type {object}
         * @private
         */
        this._$hitObject = {
            "x": 0,
            "y": 0,
            "pointer": "",
            "hit": null
        };

        /**
         * @type {DisplayObject}
         * @default null
         * @private
         */
        this._$rollOverObject = null;

        /**
         * @type {DisplayObject}
         * @default null
         * @private
         */
        this._$mouseOverTarget = null;

        /**
         * @type {DisplayObject}
         * @default null
         * @private
         */
        this._$mouseWheelEvent = null;

        /**
         * @type {number}
         * @private
         */
        this._$ratio = Util.$devicePixelRatio;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$stopFlag = true;

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
        this._$fps = 60;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isLoad = false;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$loadStatus = 0;

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
         * @type {number}
         * @default 0
         * @private
         */
        this._$baseWidth = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$baseHeight = 0;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$scale = 1;

        /**
         * @type {Float32Array}
         * @private
         */
        this._$matrix = new Util.$window.Float32Array([1, 0, 0, 1, 0, 0]); // fixed size 6

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$tx = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$ty = 0;

        /**
         * @type {string|number}
         * @default null
         * @private
         */
        this._$backgroundColor = null;

        /**
         * @type {string}
         * @default up
         * @private
         */
        this._$state = "up";

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$hitTestStart = false;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$stageX = -1;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$stageY = -1;

        /**
         * @type {Map}
         * @private
         */
        this._$broadcastEvents = Util.$getMap();

        /**
         * @type {null}
         * @default null
         * @private
         */
        this._$context = null;

        /**
         * @type {null}
         * @default null
         * @private
         */
        this._$canvas = null;

        /**
         * @type {null}
         * @default null
         * @private
         */
        this._$buffer = null;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$optionWidth = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$optionHeight = 0;

        /**
         * @type {string|null}
         * @default null
         * @private
         */
        this._$tagId = null;

        /**
         * @type {string|boolean}
         * @default null
         * @private
         */
        this._$bgColor = null;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$base = "";

        /**
         * @type {boolean}
         * @default ""
         * @private
         */
        this._$fullScreen = false;

        /**
         * @type {string}
         * @default StageQuality.HIGH
         * @private
         */
        this._$quality = StageQuality.HIGH;

        /**
         * @type {array}
         * @private
         */
        this._$sources = Util.$getArray();

        /**
         * @type {array}
         * @private
         */
        this._$videos = Util.$getArray();

        /**
         * @type {TextField}
         * @default null
         * @private
         */
        this._$textField = null;

        // delay
        this._$bindRun = this._$run.bind(this);
        this._$timerId = -1;
        this._$loadId  = -1;
    }

    /**
     * @return  {number}
     * @default 1
     * @const
     * @static
     */
    static get LOAD_START ()
    {
        return 1;
    }

    /**
     * @return {number}
     * @default 2
     * @const
     * @static
     */
    static get LOAD_END ()
    {
        return 2;
    }

    /**
     * @return {Map}
     * @readonly
     * @public
     */
    get broadcastEvents ()
    {
        return this._$broadcastEvents;
    }

    /**
     * @member {string}
     * @default ""
     * @public
     */
    get base ()
    {
        return this._$base;
    }
    set base (base)
    {
        if (typeof base === "string") {

            if (base.indexOf("//") === -1) {

                const urls = base.split("/");
                if (urls[0] === "" || urls[0] === ".") {
                    urls.shift();
                }
                urls.pop();

                this._$base = `${Util.$location.origin}/`;
                if (urls.length) {
                    this._$base += `${urls.join("/")}/`;
                }

            } else {

                const urls = base.split("?")[0].split("/");
                urls.pop();

                this._$base = `${urls.join("/")}/`;

            }
        }
    }

    /**
     * @return {Stage}
     * @readonly
     * @public
     */
    get stage ()
    {
        return this._$stage;
    }

    /**
     * @member {number}
     * @readonly
     * @public
     */
    get x ()
    {
        return this._$tx;
    }

    /**
     * @member {number}
     * @readonly
     * @public
     */
    get y ()
    {
        return this._$ty;
    }

    /**
     * @member {number}
     * @readonly
     * @public
     */
    get scaleX ()
    {
        return this._$matrix[0];
    }

    /**
     * @member {number}
     * @readonly
     * @public
     */
    get scaleY ()
    {
        return this._$matrix[3];
    }

    /**
     * @return {string}
     * @readonly
     * @public
     */
    get contentElementId ()
    {
        return `${Util.$PREFIX}`;
    }

    /**
     * @member {number}
     * @public
     */
    get width ()
    {
        return this._$baseWidth;
    }
    set width (width)
    {
        this._$baseWidth = width | 0;
    }

    /**
     * @member {number}
     * @public
     */
    get height ()
    {
        return this._$baseHeight;
    }
    set height (height)
    {
        this._$baseHeight = height | 0;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    play ()
    {
        if (this._$stopFlag) {

            this._$stopFlag = false;

            if (this._$timerId > -1) {
                const clearTimer = Util.$cancelAnimationFrame;
                clearTimer(this._$timerId);
            }

            this._$startTime = Util.$performance.now();

            this._$fps = 1000 / this._$stage._$frameRate;

            const timer = Util.$requestAnimationFrame;
            this._$timerId = timer(this._$bindRun);
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    stop ()
    {
        const clearTimer = Util.$cancelAnimationFrame;
        clearTimer(this._$timerId);

        this._$stopFlag = true;
        this._$timerId  = -1;

        SoundMixer.stopAll();
        Util.$cacheStore().reset();
    }

    /**
     * @param  {object} [options=null]
     * @return {void}
     * @public
     */
    setOptions (options = null)
    {
        if (options) {
            this._$optionWidth  = options.width  || this._$optionWidth;
            this._$optionHeight = options.height || this._$optionHeight;
            this._$tagId        = options.tagId  || this._$tagId;
            this.base           = options.base   || this._$base;
            this._$fullScreen   = !!options.fullScreen;

            if ("bgColor" in options) {
                this._$bgColor = options.bgColor;
            }
        }

        this._$initialize();
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$updateLoadStatus ()
    {
        if (this._$loadStatus === Player.LOAD_END) {
            this._$loaded();
            return ;
        }

        const timer = Util.$requestAnimationFrame;
        this._$loadId = timer(this._$updateLoadStatus.bind(this));
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$loaded ()
    {
        const element = Util.$document.getElementById(this.contentElementId);
        if (element) {

            // set backgroundColor
            if (this._$bgColor !== null) {
                this._$backgroundColor = this._$bgColor;
            }

            // background color
            if (this._$context) {

                if (!this._$backgroundColor || this._$backgroundColor === "transparent") {

                    this._$context._$setColor(0, 0, 0, 0);

                } else {

                    this._$context._$setColor(
                        this._$backgroundColor[0],
                        this._$backgroundColor[1],
                        this._$backgroundColor[2],
                        this._$backgroundColor[3]
                    );

                }

            }

            // DOM
            this._$deleteNode();

            // append canvas
            element.appendChild(this._$canvas);

            // start
            this.play();

            // stage init action
            this._$stage._$prepareActions();

            // constructed event
            if (this._$broadcastEvents.has(Event.FRAME_CONSTRUCTED)) {
                this._$dispatchEvent(new Event(Event.FRAME_CONSTRUCTED));
            }

            // frame1 action
            this._$doAction();

            // exit event
            if (this._$broadcastEvents.has(Event.EXIT_FRAME)) {
                this._$dispatchEvent(new Event(Event.EXIT_FRAME));
            }

            // loader events
            const length = this._$loaders.length | 0;
            for (let idx = 0; idx < length; ++idx) {

                const loader = this._$loaders.shift();

                // unlock
                if (loader instanceof LoaderInfo) {
                    loader._$lock = false;
                }

                // init event
                if (loader.hasEventListener(Event.INIT)) {
                    loader.dispatchEvent(new Event(Event.INIT));
                }

                // complete event
                if (loader.hasEventListener(Event.COMPLETE)) {
                    loader.dispatchEvent(new Event(Event.COMPLETE));
                }

                // reset scope player
                loader._$player = null;
            }

            // activate event
            if (this._$broadcastEvents.has(Event.ACTIVATE)) {
                this._$dispatchEvent(new Event(Event.ACTIVATE));
            }

            // frame action
            this._$doAction();

            // render
            this._$draw();

        }

    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$initialize ()
    {
        const doc = Util.$document;
        if (doc.readyState === "loading") {

            const initialize = function (event)
            {
                event.target.removeEventListener("DOMContentLoaded", initialize);
                this._$initialize();

            }.bind(this);

            Util.$window.addEventListener("DOMContentLoaded", initialize);

            return ;
        }

        const contentElementId = this.contentElementId;
        if (this._$tagId === null) {

            doc
                .body
                .insertAdjacentHTML(
                    "beforeend", `<div id="${contentElementId}"></div>`
                );

        } else {

            const container = doc.getElementById(this._$tagId);
            if (!container) {
                alert("Not Found Tag ID:" + this._$tagId);
                return ;
            }

            const div = doc.getElementById(contentElementId);
            if (!div) {

                const element    = doc.createElement("div");
                element.id       = contentElementId;
                element.tabIndex = -1;
                container.appendChild(element);

            } else {

                this._$deleteNode();

            }

        }

        if (!this._$canvas) {
            this._$initializeCanvas();
        }

        const element = doc.getElementById(contentElementId);
        const parent = element.parentNode;
        if (parent) {

            this._$initStyle(element);
            this._$buildWait();

            const width  = this._$optionWidth
                ? this._$optionWidth
                : parent.tagName === "BODY"
                    ? Util.$window.innerWidth
                    : parent.offsetWidth;

            const height = this._$optionHeight
                ? this._$optionHeight
                : parent.tagName === "BODY"
                    ? Util.$window.innerHeight
                    : parent.offsetHeight;

            // set center
            if (this._$mode === "loader" && width && height) {
                this._$baseWidth  = width;
                this._$baseHeight = height;
                this._$resize();
            }
        }

        if (this._$mode === "loader") {
            this._$loadStatus = Player.LOAD_START;
            this._$updateLoadStatus();
        } else {
            this._$resize();
            this._$loaded();
        }
    }

    /**
     * @param   {object} element
     * @returns {void}
     * @method
     * @private
     */
    _$initStyle (element)
    {
        const style = element.style;

        // set css
        style.position        = "relative";
        style.top             = "0";
        style.left            = "0";
        style.backgroundColor = "transparent";
        style.overflow        = "hidden";
        style.padding         = "0";
        style.margin          = "0";
        style.userSelect      = "none";
        style.outline         = "none";

        const width  = this._$optionWidth;
        const height = this._$optionHeight;

        const parent = element.parentNode;
        if (parent.tagName === "BODY") {
            style.width  = width  ? `${width}px`  : `${window.innerWidth}px`;
            style.height = height ? `${height}px` : `${window.innerHeight}px`;
            return ;
        }

        style.width  = width  ? `${width}px`  : `${parent.offsetWidth}px`;
        style.height = height ? `${height}px` : `${parent.offsetHeight}px`;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$buildWait ()
    {
        const element = Util.$document.getElementById(this.contentElementId);
        if (element) {

            const loadingId = `${this.contentElementId}_loading`;

            element.innerHTML = `<style>
#${loadingId} {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -24px 0 0 -24px;
    width: 50px;
    height: 50px;
    border-radius: 50px;
    border: 8px solid #dcdcdc;
    border-right-color: transparent;
    box-sizing: border-box;
    animation: ${loadingId} 0.8s infinite linear;
}
@keyframes ${loadingId} {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>`;

            const div = Util.$document.createElement("div");
            div.id    = loadingId;

            element.appendChild(div);
        }
    }

    /**
     * @returns {void}
     * @method
     * @private
     */
    _$deleteNode ()
    {
        const element = Util.$document.getElementById(this.contentElementId);
        if (element) {
            while (element.childNodes.length) {
                element.removeChild(element.childNodes[0]);
            }
        }
    }

    /**
     * @return {void}
     * @private
     */
    _$initializeCanvas ()
    {
        // main canvas
        const canvas  = Util.$document.createElement("canvas");
        canvas.width  = 1;
        canvas.height = 1;
        this._$canvas = canvas;

        // create gl context
        const option = {
            "stencil": true,
            "premultipliedAlpha": true,
            "antialias": false,
            "depth": false,
            "preserveDrawingBuffer": true
        };

        let isWebGL2Context = true;

        let gl = canvas.getContext("webgl2", option);
        if (!gl) {
            gl = canvas.getContext("webgl", option)
                || canvas.getContext("experimental-webgl", option);
            isWebGL2Context = false;
        }

        if (gl) {
            this._$context = new CanvasToWebGLContext(gl, isWebGL2Context);
        } else {
            alert("WebGL setting is off. Please turn the setting on.");
        }

        // @ifdef DEBUG
        if (window.glstats) {
            glstats.init(gl, isWebGL2Context, Util.$isChrome, Util.$isFireFox);
        }
        // @endif

        // set event
        if (Util.$isTouch) {

            const loadSpAudio = function (event)
            {
                event.target.removeEventListener(Util.$TOUCH_END, loadSpAudio);
                Util.$loadAudioData();
            };

            // audio context load event
            canvas.addEventListener(Util.$TOUCH_END, loadSpAudio);

            // touch event
            canvas.addEventListener(Util.$TOUCH_START, function (event)
            {
                Util.$event     = event;
                Util.$eventType = Util.$TOUCH_START;

                this._$hitTest();
            }.bind(this));

            canvas.addEventListener(Util.$TOUCH_MOVE, function (event)
            {
                Util.$event     = event;
                Util.$eventType = Util.$TOUCH_MOVE;

                this._$hitTest();
            }.bind(this));

            canvas.addEventListener(Util.$TOUCH_END, function (event)
            {
                Util.$event     = event;
                Util.$eventType = Util.$TOUCH_END;

                this._$hitTest();
            }.bind(this));

        } else {

            const loadWebAudio = function (event)
            {
                event.target.removeEventListener(Util.$MOUSE_DOWN, loadWebAudio);
                Util.$loadAudioData();
            };

            // audio context load event
            canvas.addEventListener(Util.$MOUSE_DOWN, loadWebAudio);

            // mouse event
            canvas.addEventListener(Util.$MOUSE_DOWN, function (event)
            {
                Util.$event     = event;
                Util.$eventType = Util.$MOUSE_DOWN;

                if (!event.button) {
                    this._$hitTest();
                }
            }.bind(this));

            canvas.addEventListener(Util.$DOUBLE_CLICK, function (event)
            {
                Util.$event     = event;
                Util.$eventType = Util.$DOUBLE_CLICK;

                if (!event.button) {
                    this._$hitTest();
                }
            }.bind(this));

            canvas.addEventListener(Util.$MOUSE_LEAVE, function (event)
            {
                Util.$event     = event;
                Util.$eventType = Util.$MOUSE_LEAVE;

                this._$hitTest();

                Util.$event = null;
                this._$stageX = -1;
                this._$stageY = -1;
            }.bind(this));

            canvas.addEventListener(Util.$MOUSE_UP, function (event)
            {
                Util.$event     = event;
                Util.$eventType = Util.$MOUSE_UP;

                if (!event.button) {
                    this._$hitTest();
                }
            }.bind(this));

            canvas.addEventListener(Util.$MOUSE_MOVE, function (event)
            {
                Util.$event     = event;
                Util.$eventType = Util.$MOUSE_MOVE;

                this._$hitTest();
            }.bind(this));

            // mouse wheel
            canvas.addEventListener(Util.$MOUSE_WHEEL, function (event)
            {
                this._$mouseWheelEvent = event;
            }.bind(this));

        }

        // set css
        const style = canvas.style;
        style.position                = "absolute";
        style.top                     = "0";
        style.left                    = "0";
        style.webkitTapHighlightColor = "rgba(0,0,0,0)";
        style.backfaceVisibility      = "hidden";
        style.transformOrigin         = "0 0";
        if (Util.$devicePixelRatio !== 1) {
            style.transform = `scale(${1 / Util.$devicePixelRatio})`;
        }

    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$resize ()
    {
        const div = Util.$document.getElementById(this.contentElementId);
        if (div) {

            const parent = div.parentNode;

            const innerWidth = this._$optionWidth
                ? this._$optionWidth
                : parent.tagName === "BODY"
                    ? Util.$window.innerWidth
                    : parent.offsetWidth
                        ? parent.offsetWidth
                        : Util.$parseFloat(parent.style.width);

            const innerHeight = this._$optionHeight
                ? this._$optionHeight
                : parent.tagName === "BODY"
                    ? Util.$window.innerHeight
                    : parent.offsetHeight
                        ? parent.offsetHeight
                        : Util.$parseFloat(parent.style.height);

            const screenWidth = parent.tagName === "BODY"
                ? Util.$window.innerWidth
                : parent.offsetWidth;

            const scale = Util.$min(
                innerWidth  / this._$baseWidth,
                innerHeight / this._$baseHeight
            );

            let width = this._$fullScreen
                ? innerWidth
                : this._$baseWidth  * scale | 0;

            let height = this._$fullScreen
                ? innerHeight
                : this._$baseHeight * scale | 0;

            // div
            const style  = div.style;
            style.width  = `${width}px`;
            style.height = `${height}px`;
            style.top    = "0";
            style.left   = this._$fullScreen
                ? "0"
                : `${screenWidth / 2 - width / 2}px`;

            width  *= Util.$devicePixelRatio;
            height *= Util.$devicePixelRatio;

            // params
            this._$scale  = scale;
            this._$width  = width;
            this._$height = height;

            // main
            this._$canvas.width  = width;
            this._$canvas.height = height;
            this._$canvas.style.transform = this._$ratio === 1 && Util.$devicePixelRatio === 1
                ? ""
                : `scale(${1 / this._$ratio})`;

            // stage buffer
            if (this._$context) { // unit test

                this._$context._$gl.viewport(0, 0, width, height);

                const manager = this._$context._$frameBufferManager;
                if (this._$buffer) {
                    manager.unbind();
                    manager.releaseAttachment(this._$buffer, true);
                }

                this._$buffer = manager
                    .createCacheAttachment(width, height, false);

                // update cache max size
                manager._$stencilBufferPool._$maxWidth  = width;
                manager._$stencilBufferPool._$maxHeight = height;
                manager._$textureManager._$maxWidth     = width;
                manager._$textureManager._$maxHeight    = height;
                this._$context._$pbo._$maxWidth         = width;
                this._$context._$pbo._$maxHeight        = height;
            }

            const mScale = this._$scale * this._$ratio;
            this._$matrix[0] = mScale;
            this._$matrix[3] = mScale;

            if (this._$fullScreen) {

                this._$tx = (width -
                        this._$baseWidth
                        * scale
                        * Util.$devicePixelRatio) / 2;

                this._$ty = (height -
                        this._$baseHeight
                        * scale
                        * Util.$devicePixelRatio) / 2;

                this._$matrix[4] = this._$tx;
                this._$matrix[5] = this._$ty;

            }

            if (div.children.length > 1) {
                div.children[1].dispatchEvent(
                    new Util.$window.Event(`${Util.$PREFIX}_blur`)
                );
            }

            // cache reset
            this._$stage._$doChanged();
            this._$cacheStore.reset();

        }
    }

    /**
     * @return {uint}
     * @method
     * @public
     */
    getSamples ()
    {
        switch (this._$quality) {

            case StageQuality.HIGH:
                return Util.$HIGH_SAMPLES;

            case StageQuality.MEDIUM:
                return Util.$MEDIUM_SAMPLES;

            default:
                return Util.$LOW_SAMPLES;

        }
    }

    /**
     * @param  {Event} event
     * @return {boolean}
     * @method
     * @private
     */
    _$dispatchEvent (event)
    {
        if (this._$broadcastEvents.size
            && this._$broadcastEvents.has(event.type)
        ) {

            // clone
            const events = this
                ._$broadcastEvents
                .get(event.type)
                .slice(0);

            // start target
            event._$eventPhase = EventPhase.AT_TARGET;

            const length = events.length;
            for (let idx = 0; idx < length; ++idx) {

                const obj = events[idx];

                // event execute
                event._$currentTarget = obj.target;

                event._$listener = obj.listener;
                obj.listener.call(Util.$window, event);

                if (event._$stopImmediatePropagation) {
                    break;
                }

            }

            Util.$poolArray(events);

            return true;

        }
    }

    /**
     * @return void
     * @public
     */
    _$wheelEvent ()
    {
        const event = this._$mouseWheelEvent;
        if (event) {

            if (!event.defaultPrevented) {

                Util.$event     = event;
                Util.$eventType = Util.$MOUSE_WHEEL;

                this._$hitTest();
            }

            this._$mouseWheelEvent = null;
        }
    }

    /**
     * @param  {number} timestamp
     * @return {void}
     * @method
     * @private
     */
    _$run (timestamp = 0)
    {
        if (this._$stopFlag) {
            return ;
        }

        // @ifdef DEBUG
        if (window.stats) {
            stats.begin();
        }

        if (window.glstats) {
            glstats.begin();
        }
        // @endif

        this._$wheelEvent();

        // delay action
        this._$doAction();

        let delta = timestamp - this._$startTime;
        if (delta > this._$fps) {

            // update
            this._$startTime = timestamp - delta % this._$fps;

            // execute
            this._$action();
            this._$draw(0);

            // draw event
            if (!this._$hitTestStart
                && this._$state === "up" && Util.$event
                && this._$stageX > -1 && this._$stageY > -1
            ) {
                this._$pointerCheck();
            }
        }

        // @ifdef DEBUG
        if (window.stats) {
            stats.end();
        }

        if (window.glstats) {
            glstats.end();
        }
        // @endif

        // next frame
        const timer = Util.$requestAnimationFrame;
        this._$timerId = timer(this._$bindRun);
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$pointerCheck ()
    {
        const stageX = this._$stageX;
        const stageY = this._$stageY;

        // setup
        this._$hitObject.x       = stageX;
        this._$hitObject.y       = stageY;
        this._$hitObject.pointer = "";
        this._$hitObject.hit     = null;

        // reset
        Util.$hitContext.setTransform(1, 0, 0, 1, 0, 0);
        Util.$hitContext.beginPath();

        // hit test
        Util.$MATRIX_HIT_ARRAY_IDENTITY[4] = this._$tx / this._$scale / Util.$devicePixelRatio;
        Util.$MATRIX_HIT_ARRAY_IDENTITY[5] = this._$ty / this._$scale / Util.$devicePixelRatio;
        this._$stage._$mouseHit(
            Util.$hitContext, Util.$MATRIX_HIT_ARRAY_IDENTITY,
            this._$hitObject, true
        );

        // change state
        // params
        let instance       = null;
        let target         = null;
        let canPointerText = false;
        let canPointer     = false;

        // execute
        if (this._$hitObject.hit) {

            instance = this._$hitObject.hit;

            // (1) mouseOut
            if (this._$mouseOverTarget
                && this._$mouseOverTarget !== instance
            ) {

                const outInstance = this._$mouseOverTarget;

                if (outInstance.willTrigger(MouseEvent.MOUSE_OUT)) {
                    outInstance.dispatchEvent(new MouseEvent(
                        MouseEvent.MOUSE_OUT, true, false,
                        outInstance.mouseX, outInstance.mouseY
                    ));
                }

            }

            // rollOut and rollOver
            if (this._$rollOverObject !== instance) {

                let hitParent = null;
                if (this._$rollOverObject) {

                    // (2) prev object rollOut
                    target = this._$rollOverObject;

                    if (target.willTrigger(MouseEvent.ROLL_OUT)) {
                        target.dispatchEvent(new MouseEvent(
                            MouseEvent.ROLL_OUT, false, false,
                            target.mouseX, target.mouseY
                        ));
                    }

                    // rollOver flag instance
                    hitParent = target._$parent;
                    while (hitParent && hitParent._$root !== hitParent) {

                        if (hitParent === instance) {
                            break;
                        }

                        if (hitParent._$mouseEnabled
                            && hitParent._$outCheck(stageX, stageY)
                        ) {

                            let isUpperLayer = false;
                            let check = instance;
                            while (check && check._$root !== check) {

                                if (check !== hitParent) {
                                    check = check._$parent;
                                    continue;
                                }

                                isUpperLayer = true;

                                break;
                            }

                            if (!isUpperLayer && hitParent._$parent === instance._$parent
                                && hitParent._$index > instance._$index
                            ) {
                                isUpperLayer = true;
                            }

                            if (isUpperLayer) {
                                break;
                            }

                        }

                        if (hitParent.willTrigger(MouseEvent.ROLL_OUT)) {
                            hitParent.dispatchEvent(new MouseEvent(
                                MouseEvent.ROLL_OUT, false, false,
                                hitParent.mouseX, hitParent.mouseY
                            ));
                        }

                        hitParent = hitParent._$parent;

                    }
                }

                // (3) current object rollOver
                target = instance;
                for (;;) {

                    if (target.willTrigger(MouseEvent.ROLL_OVER)) {
                        target.dispatchEvent(new MouseEvent(
                            MouseEvent.ROLL_OVER, false, false,
                            target.mouseX, target.mouseY
                        ));
                    }

                    target = target._$parent;
                    if (!target || target === hitParent
                        || target.stage === target
                    ) {
                        break;
                    }

                }

            }

            this._$rollOverObject = instance;

            // (4) mouseOver
            switch (true) {

                case this._$mouseOverTarget === null:
                case this._$mouseOverTarget !== instance:

                    if (instance.willTrigger(MouseEvent.MOUSE_OVER)) {
                        instance.dispatchEvent(new MouseEvent(
                            MouseEvent.MOUSE_OVER, true, false,
                            instance.mouseX, instance.mouseY
                        ));
                    }

                    // set target
                    this._$mouseOverTarget = instance;
                    break;

            }

            // click reset
            if (this._$state === "up") {
                this._$clickTarget = null;
            }

            // PC
            if (!Util.$isTouch && this._$state === "up") {

                target = instance;
                while (target && target.root !== target) {

                    switch (true) {

                        case target instanceof TextField:
                            if (target._$type === TextFieldType.INPUT) {
                                canPointerText = true;
                            }
                            break;

                        case target.buttonMode:
                            canPointer = true;
                            break;

                    }

                    if (canPointerText || canPointer) {
                        break;
                    }

                    target = target._$parent;

                }

            }

        } else {

            // (1) mouseOut
            if (this._$mouseOverTarget) {

                instance = this._$mouseOverTarget;

                if (instance.willTrigger(MouseEvent.MOUSE_OUT)) {
                    instance.dispatchEvent(new MouseEvent(
                        MouseEvent.MOUSE_OUT, true, false,
                        instance.mouseX, instance.mouseY
                    ));
                }
            }

            // (2) rollOut
            if (this._$rollOverObject) {

                target = this._$rollOverObject;

                // parent target
                while (target && target.root !== target) {

                    if (target.willTrigger(MouseEvent.ROLL_OUT)) {
                        target.dispatchEvent(new MouseEvent(
                            MouseEvent.ROLL_OUT, false, false,
                            target.mouseX, target.mouseY
                        ));
                    }

                    target = target._$parent;

                }

            }

            // reset
            this._$rollOverObject  = null;
            this._$mouseOverTarget = null;
        }

        // change cursor
        switch (true) {

            case canPointerText:
                this._$canvas.style.cursor = "text";
                break;

            case canPointer:
                this._$canvas.style.cursor = "pointer";
                break;

            case !Util.$isTouch && this._$state === "up":
                this._$canvas.style.cursor = "auto";
                break;

        }

        if (this._$actions.length > 1) {
            this._$doAction();
        }
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$action ()
    {

        if (this._$stopFlag) {
            return ;
        }

        let loaders = null;

        const length = this._$loaders.length;
        if (length) {

            // clone
            loaders = this._$loaders.slice(0);

            // array reset
            this._$loaders.length = 0;

            for (let idx = 0; idx < length; ++idx) {

                const loader = loaders[idx];

                // first action
                if ("content" in loader) {
                    loader.content._$prepareActions();
                }
            }
        }

        // next frame
        this._$stage._$nextFrame();

        // enter frame event
        if (this._$broadcastEvents.has(Event.ENTER_FRAME)) {
            this._$dispatchEvent(new Event(Event.ENTER_FRAME));
        }

        // constructed event
        if (this._$broadcastEvents.has(Event.FRAME_CONSTRUCTED)) {
            this._$dispatchEvent(new Event(Event.FRAME_CONSTRUCTED));
        }

        // execute frame action
        this._$doAction();

        // exit event
        if (this._$broadcastEvents.has(Event.EXIT_FRAME)) {
            this._$dispatchEvent(new Event(Event.EXIT_FRAME));
        }

        // render event
        if (this._$stage._$invalidate) {

            // reset
            this._$stage._$invalidate = false;

            // execute render event
            this._$dispatchEvent(new Event(Event.RENDER));

        }

        // loader events
        if (length) {

            for (let idx = 0; idx < length; ++idx) {

                const loader = loaders[idx];

                // init event
                if (loader.hasEventListener(Event.INIT)) {
                    loader.dispatchEvent(new Event(Event.INIT));
                }

                // complete event
                if (loader.hasEventListener(Event.COMPLETE)) {
                    loader.dispatchEvent(new Event(Event.COMPLETE));
                }

            }

            // pool
            Util.$poolArray(loaders);
        }

        // execute frame action
        this._$doAction();
    }

    /**
     * @returns void
     * @public
     */
    _$draw ()
    {
        const canvas  = this._$canvas;
        const width   = canvas.width;
        const height  = canvas.height;
        const context = this._$context;

        if (this._$buffer && this._$stage._$updated
            && context && width > 0 && height > 0
        ) {

            context._$bind(this._$buffer);

            // pre draw
            Util.$resetContext(context);
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, width, height);

            // draw
            context.beginPath();

            this
                ._$stage
                ._$draw(context, this._$matrix, Util.$COLOR_ARRAY_IDENTITY);

            // stage end
            this._$stage._$updated = false;

            // start sound
            if (this._$sounds.size) {
                const values = this._$sounds.values();
                for (let movieClip of values) {
                    movieClip._$soundPlay();
                }
                this._$sounds.clear();
            }

            const bufferTexture = context
                .frameBuffer
                .getTextureFromCurrentAttachment();

            context.frameBuffer.unbind();

            // reset and draw to canvas
            Util.$resetContext(context);
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, width, height);
            context.drawImage(bufferTexture, 0, 0, width, height);

            context._$bind(this._$buffer);
        }

    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$doAction ()
    {
        while (this._$actions.length) {

            Util.$actionProcess = true;

            // target object
            const mc = this._$actions.pop();
            mc._$canAction    = false;
            mc._$actionOffset = 0;
            mc._$actionLimit  = 0;

            const frame = mc._$currentFrame;
            if (!mc._$actions.has(frame)) {
                continue;
            }

            mc._$actionProcess = true;
            const actions = mc._$actions.get(frame);
            const length  = actions.length;
            for (let idx = 0; idx < length; ++idx) {
                Util.$currentLoaderInfo = mc._$loaderInfo;
                actions[idx].apply(mc);
            }
            mc._$actionProcess = false;

            // adjustment
            if (mc._$frameCache.size) {
                mc._$currentFrame = mc._$frameCache.get("nextFrame");
                mc._$clearChildren();

                mc._$stopFlag  = mc._$frameCache.get("stopFlag");
                mc._$isPlaying = mc._$frameCache.get("isPlaying");
                mc._$frameCache.clear();
            }

        }

        Util.$currentLoaderInfo = null;
        Util.$actionProcess     = false;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$hitTest ()
    {
        if (this._$stopFlag) {
            return ;
        }

        // update flags
        this._$hitTestStart = true;
        Util.$isUpdated     = false;

        // setup
        const event = Util.$event;

        // params
        let instance = null;
        let target   = null;

        let x = Util.$window.pageXOffset;
        let y = Util.$window.pageYOffset;

        const div = Util.$document.getElementById(this.contentElementId);
        if (div) {
            const rect = div.getBoundingClientRect();
            x += rect.left;
            y += rect.top;
        }

        let stageX = 0;
        let stageY = 0;

        if (Util.$isTouch) {
            const changedTouche = event.changedTouches[0];
            stageX = changedTouche.pageX;
            stageY = changedTouche.pageY;
        } else {
            stageX = event.pageX;
            stageY = event.pageY;
        }

        // drop point
        stageX = (stageX - x) / this._$scale;
        stageY = (stageY - y) / this._$scale;

        // update
        event._$stageX = stageX;
        event._$stageY = stageY;
        this._$stageX  = stageX;
        this._$stageY  = stageY;

        // setup
        this._$hitObject.x       = stageX;
        this._$hitObject.y       = stageY;
        this._$hitObject.pointer = "";
        this._$hitObject.hit     = null;

        // reset
        Util.$hitContext.setTransform(1, 0, 0, 1, 0, 0);
        Util.$hitContext.beginPath();

        // hit test
        Util.$MATRIX_HIT_ARRAY_IDENTITY[4] = this._$tx / this._$scale / Util.$devicePixelRatio;
        Util.$MATRIX_HIT_ARRAY_IDENTITY[5] = this._$ty / this._$scale / Util.$devicePixelRatio;
        this._$stage._$mouseHit(
            Util.$hitContext, Util.$MATRIX_HIT_ARRAY_IDENTITY,
            this._$hitObject, true
        );

        // change state
        let canPointerText = false;
        let staticPointer  = false;
        let canPointer     = false;
        switch (Util.$eventType) {

            case Util.$TOUCH_MOVE:
            case Util.$MOUSE_MOVE:

                if (Util.$dropTarget) {

                    const point = Util.$dropTarget._$dragMousePoint();

                    let dragX = point.x;
                    let dragY = point.y;

                    if (!Util.$dragRules.lock) {
                        dragX += Util.$dragRules.position.x;
                        dragY += Util.$dragRules.position.y;
                    }

                    const bounds = Util.$dragRules.bounds;
                    if (bounds) {

                        dragX = Util.$clamp(dragX, bounds.left, bounds.right);
                        dragY = Util.$clamp(dragY, bounds.top,  bounds.bottom);

                    }

                    // set move xy
                    Util.$dropTarget.x = dragX;
                    Util.$dropTarget.y = dragY;

                }

                break;

            case Util.$TOUCH_START:
            case Util.$MOUSE_DOWN:
                this._$state  = "down";
                canPointer    = this._$canvas.style.cursor === "pointer";
                staticPointer = true;
                break;

            case Util.$TOUCH_END:
            case Util.$MOUSE_UP:
            case Util.$DOUBLE_CLICK:
                this._$state = "up";
                break;

        }

        // execute
        switch (true) {

            case this._$hitObject.hit === null:
            case Util.$eventType === Util.$MOUSE_LEAVE:

                // (1) mouseOut
                if (this._$mouseOverTarget) {

                    instance = this._$mouseOverTarget;
                    if (instance.willTrigger(MouseEvent.MOUSE_OUT)) {
                        instance.dispatchEvent(new MouseEvent(
                            MouseEvent.MOUSE_OUT, true, false,
                            instance.mouseX, instance.mouseY
                        ));
                    }

                }

                // (2) rollOut
                if (this._$rollOverObject) {

                    target = this._$rollOverObject;

                    // parent target
                    while (target && target.root !== target) {

                        if (target.willTrigger(MouseEvent.ROLL_OUT)) {
                            target.dispatchEvent(new MouseEvent(
                                MouseEvent.ROLL_OUT, false, false,
                                target.mouseX, target.mouseY
                            ));
                        }

                        target = target._$parent;

                    }

                }

                // reset
                this._$rollOverObject  = null;
                this._$mouseOverTarget = null;

                // stage event
                switch (Util.$eventType) {

                    case Util.$MOUSE_WHEEL:
                        if (this._$stage.hasEventListener(MouseEvent.MOUSE_WHEEL)) {

                            this._$stage.dispatchEvent(new MouseEvent(
                                MouseEvent.MOUSE_WHEEL, true, false,
                                this._$stage.mouseX, this._$stage.mouseY
                            ));

                        }
                        break;

                    case Util.$TOUCH_START:
                    case Util.$MOUSE_DOWN:
                        if (this._$stage.hasEventListener(MouseEvent.MOUSE_DOWN)) {
                            this._$stage.dispatchEvent(new MouseEvent(
                                MouseEvent.MOUSE_DOWN, true, false,
                                this._$stage.mouseX, this._$stage.mouseY
                            ));
                        }

                        // TextField focus out
                        if (this._$textField
                            && this._$textField instanceof TextField
                        ) {
                            this._$textField.focus = false;
                            this._$textField = null;
                        }
                        break;

                    case Util.$TOUCH_END:
                    case Util.$MOUSE_UP:

                        // TextField focus out
                        if (this._$textField
                            && this._$textField instanceof TextField
                        ) {
                            this._$textField.focus = false;
                            this._$textField = null;
                        }

                        if (this._$stage.hasEventListener(MouseEvent.CLICK)) {
                            this._$stage.dispatchEvent(new MouseEvent(
                                MouseEvent.CLICK, true, false,
                                this._$stage.mouseX, this._$stage.mouseY
                            ));
                        }

                        if (this._$stage.hasEventListener(MouseEvent.MOUSE_UP)) {
                            this._$stage.dispatchEvent(new MouseEvent(
                                MouseEvent.MOUSE_UP, true, false,
                                this._$stage.mouseX, this._$stage.mouseY
                            ));
                        }

                        break;

                    case Util.$TOUCH_MOVE:
                    case Util.$MOUSE_MOVE:
                        if (this._$stage.hasEventListener(MouseEvent.MOUSE_MOVE)) {
                            this._$stage.dispatchEvent(new MouseEvent(
                                MouseEvent.MOUSE_MOVE, true, false,
                                this._$stage.mouseX, this._$stage.mouseY
                            ));
                        }
                        break;

                    case Util.$DOUBLE_CLICK:
                        if (this._$stage.hasEventListener(MouseEvent.DOUBLE_CLICK)) {
                            this._$stage.dispatchEvent(new MouseEvent(
                                MouseEvent.DOUBLE_CLICK, true, false,
                                this._$stage.mouseX, this._$stage.mouseY
                            ));
                        }
                        break;

                }

                break;

            default:

                instance = this._$hitObject.hit;

                switch (Util.$eventType) {

                    // move event
                    case Util.$TOUCH_MOVE:
                    case Util.$MOUSE_MOVE:

                        // (1) mouseMove
                        if (instance.willTrigger(MouseEvent.MOUSE_MOVE)) {
                            instance.dispatchEvent(new MouseEvent(
                                MouseEvent.MOUSE_MOVE, true, false,
                                instance.mouseX, instance.mouseY
                            ));
                        }

                        // (2) mouseOut
                        if (this._$mouseOverTarget
                            && this._$mouseOverTarget !== instance
                        ) {

                            const outInstance = this._$mouseOverTarget;

                            if (outInstance.willTrigger(MouseEvent.MOUSE_OUT)) {
                                outInstance.dispatchEvent(new MouseEvent(
                                    MouseEvent.MOUSE_OUT, true, false,
                                    outInstance.mouseX, outInstance.mouseY
                                ));
                            }

                        }

                        // rollOut and rollOver
                        if (this._$rollOverObject !== instance) {

                            let hitParent = null;
                            if (this._$rollOverObject) {

                                // (3) prev object rollOut
                                target = this._$rollOverObject;

                                if (target.willTrigger(MouseEvent.ROLL_OUT)) {
                                    target.dispatchEvent(new MouseEvent(
                                        MouseEvent.ROLL_OUT, false, false,
                                        target.mouseX, target.mouseY
                                    ));
                                }

                                // rollOver flag instance
                                hitParent = target._$parent;
                                while (hitParent && hitParent._$root !== hitParent) {

                                    if (hitParent === instance) {
                                        break;
                                    }

                                    if (hitParent._$mouseEnabled
                                        && hitParent._$outCheck(stageX, stageY)
                                    ) {

                                        let isUpperLayer = false;
                                        let check = instance;
                                        while (check && check._$root !== check) {

                                            if (check !== hitParent) {
                                                check = check._$parent;
                                                continue;
                                            }

                                            isUpperLayer = true;

                                            break;
                                        }

                                        if (!isUpperLayer && hitParent._$parent === instance._$parent
                                            && hitParent._$index > instance._$index
                                        ) {
                                            isUpperLayer = true;
                                        }

                                        if (isUpperLayer) {
                                            break;
                                        }

                                    }

                                    if (hitParent.willTrigger(MouseEvent.ROLL_OUT)) {
                                        hitParent.dispatchEvent(new MouseEvent(
                                            MouseEvent.ROLL_OUT, false, false,
                                            hitParent.mouseX, hitParent.mouseY
                                        ));
                                    }

                                    hitParent = hitParent._$parent;

                                }
                            }

                            // (4) current object rollOver
                            target = instance;
                            for (;;) {

                                if (target.willTrigger(MouseEvent.ROLL_OVER)) {
                                    target.dispatchEvent(new MouseEvent(
                                        MouseEvent.ROLL_OVER, false, false,
                                        target.mouseX, target.mouseY
                                    ));
                                }

                                target = target._$parent;
                                if (!target || target === hitParent
                                    || target.stage === target
                                ) {
                                    break;
                                }

                            }

                        }

                        this._$rollOverObject = instance;

                        // (5) mouseOver
                        switch (true) {

                            case this._$mouseOverTarget === null:
                            case this._$mouseOverTarget !== instance:

                                if (instance.willTrigger(MouseEvent.MOUSE_OVER)) {
                                    instance.dispatchEvent(new MouseEvent(
                                        MouseEvent.MOUSE_OVER, true, false,
                                        instance.mouseX, instance.mouseY
                                    ));
                                }

                                // set target
                                this._$mouseOverTarget = instance;
                                break;

                        }

                        // click reset
                        if (this._$state === "up") {
                            this._$clickTarget = null;
                        }

                        break;

                    // down event
                    case Util.$TOUCH_START:
                    case Util.$MOUSE_DOWN:

                        // TextField focus out
                        if (instance instanceof TextField) {
                            instance.focus   = true;
                            this._$textField = instance;
                        }

                        // (3) mouseDown
                        if (instance.willTrigger(MouseEvent.MOUSE_DOWN)) {
                            instance.dispatchEvent(new MouseEvent(
                                MouseEvent.MOUSE_DOWN, true, false,
                                instance.mouseX, instance.mouseY
                            ));
                        }

                        // (4) click
                        this._$clickTarget = instance;

                        break;

                    // up event
                    case Util.$TOUCH_END:
                    case Util.$MOUSE_UP:

                        // TextField focus out
                        if (instance !== this._$textField
                            && this._$textField instanceof TextField
                        ) {
                            this._$textField.focus = false;
                            this._$textField       = null;
                        }

                        // (1) mouseUp
                        if (instance.willTrigger(MouseEvent.MOUSE_UP)) {
                            instance.dispatchEvent(new MouseEvent(
                                MouseEvent.MOUSE_UP, true, false,
                                instance.mouseX, instance.mouseY
                            ));
                        }

                        // (2) click
                        if (this._$clickTarget === instance) {

                            if (instance.willTrigger(MouseEvent.CLICK)) {
                                instance.dispatchEvent(new MouseEvent(
                                    MouseEvent.CLICK, true, false,
                                    instance.mouseX, instance.mouseY
                                ));
                            }

                        }

                        // reset
                        this._$clickTarget = null;

                        break;

                    case Util.$MOUSE_WHEEL:
                        if (instance.willTrigger(MouseEvent.MOUSE_WHEEL)) {
                            instance.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_WHEEL));
                        }

                        if (instance instanceof TextField) {
                            instance.scrollV += event.deltaY;
                        }
                        break;

                    case Util.$DOUBLE_CLICK:
                        if (instance.willTrigger(MouseEvent.DOUBLE_CLICK)) {
                            instance.dispatchEvent(new MouseEvent(MouseEvent.DOUBLE_CLICK));
                        }
                        break;

                    default:
                        break;

                }

                // PC
                if (!staticPointer) {

                    if (!Util.$isTouch && this._$state === "up") {

                        target = instance;
                        while (target && target.root !== target) {

                            if (target instanceof TextField) {

                                if (target._$type === TextFieldType.INPUT) {
                                    canPointerText = true;
                                    break;
                                }

                            } else {

                                if (target._$buttonMode) {
                                    canPointer = true;
                                    break;
                                }

                            }

                            target = target._$parent;

                        }
                    }
                }
                break;

        }

        // change cursor
        switch (true) {

            case canPointerText:
                this._$canvas.style.cursor = "text";
                break;

            case canPointer:
                this._$canvas.style.cursor = "pointer";
                break;

            case !Util.$isTouch && this._$state === "up":
                this._$canvas.style.cursor = "auto";
                break;

        }

        // execute action
        if (!Util.$actionProcess && this._$actions.length > 1) {
            this._$doAction();
        }

        if (Util.$isUpdated) {

            // stop event
            event.preventDefault();

            // action script
            this._$stage._$prepareActions();
            if (!Util.$actionProcess) {
                this._$doAction();
            }

        }

        this._$hitTestStart = false;
    }
}