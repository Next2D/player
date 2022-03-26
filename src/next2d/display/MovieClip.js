/**
 * MovieClip クラスは、Sprite、DisplayObjectContainer、InteractiveObject、DisplayObject
 * および EventDispatcher クラスを継承します。
 * MovieClip オブジェクトには、Sprite オブジェクトとは違ってタイムラインがあります。
 * タイムラインの再生ヘッドが停止されても、その MovieClip オブジェクトの子 MovieClip オブジェクトの再生ヘッドは停止しません。
 *
 * The MovieClip class inherits from the following classes: Sprite, DisplayObjectContainer,
 * InteractiveObject, DisplayObject, and EventDispatcher.
 * Unlike the Sprite object, a MovieClip object has a timeline.
 * When the playback head of the timeline is stopped,
 * the playback head of the child MovieClip object of that MovieClip object will not be stopped.
 *
 * @class
 * @memberOf next2d.display
 * @extends  Sprite
 */
class MovieClip extends Sprite
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$stopFlag = false;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$canAction = true;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$childRemove = false;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$canSound = true;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$actionProcess = false;

        /**
         * @type {Map}
         * @private
         */
        this._$actions = Util.$getMap();

        /**
         * @type {Map}
         * @private
         */
        this._$frameCache = Util.$getMap();

        /**
         * @type {Map}
         * @default null
         * @private
         */
        this._$labels = null;

        /**
         * @type {Map}
         * @private
         */
        this._$sounds = Util.$getMap();

        /**
         * @type {Map}
         * @private
         */
        this._$channels = Util.$getMap();

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$actionOffset = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$actionLimit = 0;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$currentFrame = 1;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$totalFrames = 1;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isPlaying = false;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$loopConfigs = null;

        /**
         * @type {LoopConfig}
         * @default null
         * @private
         */
        this._$loopConfig = null;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class MovieClip]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class MovieClip]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.MovieClip
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display.MovieClip";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object MovieClip]
     * @method
     * @public
     */
    toString ()
    {
        return "[object MovieClip]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.MovieClip
     * @const
     * @public
     */
    get namespace ()
    {
        return "next2d.display.MovieClip";
    }

    /**
     * @description MovieClip インスタンスのタイムライン内の再生ヘッドが置かれているフレームの番号を示します。
     *              Specifies the number of the frame in which the playhead is located
     *              in the timeline of the MovieClip instance.
     *
     * @member {number}
     * @default 1
     * @readonly
     * @public
     */
    get currentFrame ()
    {
        return this._$currentFrame;
    }

    /**
     * @description MovieClip インスタンスのタイムライン内の現在のフレームにあるラベルです。
     *              The label at the current frame in the timeline of the MovieClip instance.
     *
     * @member  {FrameLabel|null}
     * @readonly
     * @public
     */
    get currentFrameLabel ()
    {
        if (!this._$labels) {
            return null;
        }

        const frame = this._$currentFrame;
        if (!this._$labels.has(frame)) {
            return null;
        }

        return this._$labels.get(frame);
    }

    /**
     * @description 現在のシーンの FrameLabel オブジェクトの配列を返します。
     *              Returns an array of FrameLabel objects from the current scene.
     *
     * @member  {array|null}
     * @readonly
     * @public
     */
    get currentLabels ()
    {
        return !this._$labels ? null : Util.$Array.from(this._$labels.values());
    }

    /**
     * @description ムービークリップが現在再生されているかどうかを示すブール値です。
     *              A Boolean value that indicates whether a movie clip is curently playing.
     *
     * @member  {boolean}
     * @default false
     * @readonly
     * @public
     */
    get isPlaying ()
    {
        return this._$isPlaying;
    }

    /**
     * @description MovieClip インスタンス内のフレーム総数です。
     *              The total number of frames in the MovieClip instance.
     *
     * @member  {number}
     * @default 1
     * @readonly
     * @public
     */
    get totalFrames ()
    {
        return this._$totalFrames;
    }

    /**
     * @description MovieClipのフレームヘッダーの移動方法の設定オブジェクトを返します。
     *              Returns a configuration object for how MovieClip's frame headers are moved.
     *
     * @member  {object}
     * @default null
     * @public
     */
    get loopConfig ()
    {
        if (this._$loopConfig) {
            return this._$loopConfig;
        }

        const placeId = this._$placeId;
        if (placeId === null) {
            return null;
        }

        const parent = this._$parent;
        if (!parent) {
            return null;
        }

        const placeMap = parent._$placeMap;
        if (!placeMap || !placeMap.length) {
            return null;
        }

        const map = placeMap[parent._$currentFrame || 1];
        if (!map) {
            return null;
        }

        return parent._$loopConfigs[map[placeId]];
    }
    set loopConfig (loop_config)
    {
        this._$loopConfig = null;
        if (loop_config instanceof LoopConfig) {
            loop_config._$frame = this._$startFrame;
            this._$loopConfig   = loop_config;
            this._$currentFrame = this._$getLoopFrame(loop_config);
        }
    }

    /**
     * @description 指定されたフレームで SWF ファイルの再生を開始します。
     *              Starts playing the SWF file at the specified frame.
     *
     * @param   {number|string} frame
     * @return {void}
     * @method
     * @public
     */
    gotoAndPlay (frame)
    {
        this.play();
        this._$goToFrame(frame);
    }

    /**
     * @description このムービークリップの指定されたフレームに再生ヘッドを送り、そこで停止させます。
     *              Brings the playhead to the specified frame
     *              of the movie clip and stops it there.
     *
     * @param  {number|string} frame
     * @return {void}
     * @method
     * @public
     */
    gotoAndStop (frame)
    {
        this.stop();
        this._$goToFrame(frame);
    }

    /**
     * @description 次のフレームに再生ヘッドを送り、停止します。
     *              Sends the playhead to the next frame and stops it.
     *
     * @return {void}
     * @method
     * @public
     */
    nextFrame ()
    {
        this.stop();
        if (this._$totalFrames > this._$currentFrame) {
            this._$goToFrame(this._$currentFrame + 1);
        }
    }

    /**
     * @description ムービークリップのタイムライン内で再生ヘッドを移動します。
     *              Moves the playhead in the timeline of the movie clip.
     *
     * @return {void}
     * @method
     * @public
     */
    play ()
    {
        this._$stopFlag  = false;
        this._$isPlaying = true;
        this._$updateState();
    }

    /**
     * @description 直前のフレームに再生ヘッドを戻し、停止します。
     *              Sends the playhead to the previous frame and stops it.
     *
     * @return {void}
     * @method
     * @public
     */
    prevFrame ()
    {
        const frame = this._$currentFrame - 1;
        if (frame) {
            this.stop();
            this._$goToFrame(frame);
        }
    }

    /**
     * @description ムービークリップ内の再生ヘッドを停止します。
     *              Stops the playhead in the movie clip.
     *
     * @return {void}
     * @method
     * @public
     */
    stop ()
    {
        this._$stopFlag  = true;
        this._$isPlaying = false;
    }

    /**
     * @description タイムラインに対して動的にLabelを追加できます。
     *              Labels can be added dynamically to the timeline.
     *
     * @example <caption>Example1 usage of addFrameLabel.</caption>
     * // case 1
     * const {MovieClip, FrameLabel} = next2d.display;
     * const movieClip = new MovieClip();
     * movieClip.addFrameLabel(new FrameLabel(1, "start"));
     *
     * @param  {FrameLabel} frame_label
     * @return {void}
     * @public
     */
    addFrameLabel (frame_label)
    {
        if (!this._$labels) {
            this._$labels = Util.$getMap();
        }

        if (frame_label instanceof FrameLabel) {
            this._$labels.set(frame_label.frame, frame_label);
        }
    }

    /**
     * @description 指定のフレームのアクションを追加できます
     *              You can add an action for a given frame.
     *
     * @example <caption>Example1 usage of addFrameScript.</caption>
     * // case 1
     * const {MovieClip} = next2d.display;
     * const movieClip = new MovieClip();
     * movieClip.addFrameScript(1 , function ()
     * {
     *     this.stop();
     * });
     *
     * @example <caption>Example3 usage of addFrameScript.</caption>
     * // case 2
     * const {MovieClip} = next2d.display;
     * const movieClip = new MovieClip();
     * movieClip.addFrameScript(1, method_1, 2, method_2, 10, method_10);
     *
     * @return {void}
     * @method
     * @public
     */
    addFrameScript ()
    {
        const length = arguments.length;
        for (let idx = 0; idx < length; idx += 2) {

            let frame = arguments[idx];
            if (Util.$isNaN(frame | 0)) {
                frame = this._$getFrameForLabel(frame);
            }

            frame |= 0;

            const script = arguments[idx + 1];
            if (script && frame && this._$totalFrames >= frame) {
                this._$addAction(frame, script);
            }

            // end action add
            if (frame === this._$currentFrame) {

                // set action position
                const player = Util.$currentPlayer();
                player._$actionOffset = player._$actions.length;

                // execute action stack
                this._$canAction = true;
                this._$setAction();

                // adjustment
                if (player._$actionOffset !== player._$actions.length) {

                    // marge
                    const actions = player._$actions.splice(0, player._$actionOffset);
                    player._$actions.push.apply(player._$actions, actions);

                    // reset
                    player._$actionOffset = 0;
                }

            }
        }
    }

    /**
     * @param  {string} name
     * @return {number}
     * @private
     */
    _$getFrameForLabel (name)
    {
        for (let [frame, frameLabel] of this._$labels) {
            if (frameLabel.name === name) {
                return frame | 0;
            }
        }
        return 0;
    }

    /**
     * @param {number}   frame
     * @param {function} script
     * @private
     */
    _$addAction(frame, script)
    {
        frame |= 0;
        if (frame) {
            if (!this._$actions.has(frame)) {
                this._$actions.set(frame, Util.$getArray());
            }
            this._$actions.get(frame).push(script);
        }
    }

    /**
     * @return {void}
     * @private
     */
    _$setAction ()
    {
        // added event
        this._$executeAddedEvent();

        if (this._$canAction) {

            const frame = this._$currentFrame;

            // frame label event
            if (this._$labels && this._$labels.has(frame)) {
                const frameLabel = this._$labels.get(frame);
                if (frameLabel.willTrigger(Event.FRAME_LABEL)) {
                    frameLabel.dispatchEvent(new Event(Event.FRAME_LABEL));
                }
            }

            // add action queue
            if (this._$actions.size && this._$actions.has(frame)) {

                const player = Util.$currentPlayer();
                if (player) {
                    const index = player._$actions.indexOf(this);
                    if (index === -1) {
                        player._$actions.push(this);
                    }
                }
            }
        }
    }

    /**
     * @param  {number|string} frame
     * @return {void}
     * @private
     */
    _$goToFrame (frame)
    {
        if (Util.$isNaN(+frame)) {
            frame = this._$getFrameForLabel(frame);
        }

        if (frame < 1) {
            frame = 1;
        }

        // over
        if (frame > this._$totalFrames) {
            this._$currentFrame = this._$totalFrames;
            this._$clearChildren();

            // flag off
            this._$canAction = false;
            this._$wait      = false;

            return ;
        }

        const player = Util.$currentPlayer();
        switch (true) {

            case frame !== this._$currentFrame:
                {
                    // flag off
                    this._$wait = false;

                    const currentFrame = this._$currentFrame;

                    if (this._$actionProcess) {
                        this._$frameCache.set("nextFrame", frame);
                        this._$frameCache.set("stopFlag",  this._$stopFlag);
                        this._$frameCache.set("isPlaying", this._$isPlaying);
                    }

                    // setup
                    this._$currentFrame = frame;
                    this._$clearChildren();

                    // set action position
                    player._$actionOffset = player._$actions.length;
                    const position = player._$actionOffset
                        ? player._$actions.indexOf(this)
                        : -1;

                    this._$canAction = true;
                    this._$prepareActions();

                    // adjustment
                    if (player._$actionOffset && player._$actionOffset !== player._$actions.length) {

                        // marge
                        const actions = player._$actions.splice(0, player._$actionOffset);
                        player._$actions.push.apply(player._$actions, actions);

                        // reset
                        player._$actionOffset = 0;
                    }

                    if (!this._$actionProcess && (position > -1 || !player._$actionOffset)) {

                        while (player._$actions.length) {

                            if (player._$actions.length === position) {
                                break;
                            }

                            // target object
                            const mc = player._$actions.pop();
                            mc._$canAction    = false;
                            mc._$actionOffset = 0;
                            mc._$actionLimit  = 0;

                            if (mc._$actionProcess && mc._$frameCache.size) {

                                mc._$currentFrame = mc._$frameCache.get("nextFrame");
                                mc._$clearChildren();

                                mc._$stopFlag  = mc._$frameCache.get("stopFlag");
                                mc._$isPlaying = mc._$frameCache.get("isPlaying");
                                mc._$frameCache.clear();
                            }

                            const frame = mc._$currentFrame;
                            if (!mc._$actions.has(frame)) {
                                continue;
                            }

                            const actions = mc._$actions.get(frame);
                            const length  = actions.length;
                            for (let idx = 0; idx < length; ++idx) {

                                try {

                                    Util.$currentLoaderInfo = mc._$loaderInfo;
                                    actions[idx].apply(mc);

                                } catch (e) {

                                    mc.stop();

                                    // TODO

                                }
                            }
                        }
                    }

                    if (this._$actionProcess) {
                        this._$currentFrame = currentFrame;
                        this._$clearChildren();
                    }
                }
                break;

            case !this._$actionProcess && player._$actions.indexOf(this) > -1:
                {
                    if (!this._$actionLimit) {
                        break;
                    }

                    // flag off
                    this._$wait = false;

                    const myActions = player._$actions.splice(
                        this._$actionOffset, this._$actionLimit
                    );

                    while (myActions.length) {

                        const mc = myActions.pop();

                        // target reset
                        mc._$canAction    = false;
                        mc._$actionOffset = 0;
                        mc._$actionLimit  = 0;

                        const frame = mc._$currentFrame;
                        if (!mc._$actions.has(frame)) {
                            continue;
                        }

                        const actions = mc._$actions.get(frame);
                        const length  = actions.length;
                        for (let idx = 0; idx < length; ++idx) {

                            try {

                                Util.$currentLoaderInfo = mc._$loaderInfo;
                                actions[idx].apply(mc);

                            } catch (e) {

                                mc.stop();

                                // TODO
                                // mc
                                //     .loaderInfo
                                //     .uncaughtErrorEvents
                                //     .dispatchEvent(
                                //         new UncaughtErrorEvent(
                                //             UncaughtErrorEvent.UNCAUGHT_ERROR, true, true, Util.$errorObject
                                //         )
                                //     );

                            }

                        }

                    }
                }
                break;

            default:
                break;

        }

        Util.$currentLoaderInfo = null;

        // set sound
        if (this._$canSound && this._$sounds.size
            && this._$sounds.has(this._$currentFrame)
            && !player._$sounds.has(this._$instanceId)
        ) {
            player._$sounds.set(this._$instanceId, this);
        }
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$prepareActions ()
    {
        // draw flag
        this._$wait = false;

        const children = this._$needsChildren
            ? this._$getChildren()
            : this._$children;

        for (let idx = children.length - 1; idx > -1; --idx) {
            children[idx]._$prepareActions();
        }

        this._$setAction();
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {array} matrix
     * @param  {array} color_transform
     * @return {void}
     * @method
     * @private
     */
    _$draw (context, matrix, color_transform)
    {
        super._$draw(context, matrix, color_transform);

        // set sound
        const player = Util.$currentPlayer();

        if (this._$canSound && this._$sounds.size
            && this._$sounds.has(this._$currentFrame)
            && !player._$sounds.has(this._$instanceId)
        ) {
            player._$sounds.set(this._$instanceId, this);
        }
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$nextFrame ()
    {

        let isNext = this._$needsChildren;
        switch (true) {

            case this._$wait:
                isNext = true;
                this._$wait = false;
                break;

            case this._$stopFlag:
            case this._$totalFrames === 1:
                break;

            default:
                {
                    isNext = true;

                    // action on
                    this._$canAction = true;

                    // sound on
                    this._$canSound = true;

                    const loopConfig = this.loopConfig;
                    if (!loopConfig) {
                        // next frame point
                        ++this._$currentFrame;
                        if (this._$currentFrame > this._$totalFrames) {
                            this._$currentFrame = 1;
                        }
                    } else {
                        this._$currentFrame = this._$getLoopFrame(loopConfig);
                    }

                    // clear
                    this._$clearChildren();
                }
                break;

        }

        const children = this._$needsChildren
            ? this._$getChildren()
            : this._$children;

        for (let idx = children.length - 1; idx > -1; --idx) {

            const child = children[idx];

            if (!child._$isNext) {
                continue;
            }

            if (isNext) {

                child._$nextFrame();

            } else {

                isNext = child._$nextFrame();

            }

        }

        // frame action
        this._$setAction();

        this._$isNext = isNext;

        return this._$isNext;
    }

    /**
     * @param  {LoopConfig} loop_config
     * @return {number}
     * @method
     * @private
     */
    _$getLoopFrame (loop_config)
    {
        const parent = this._$parent;
        const length = parent._$currentFrame - loop_config.frame;

        let frame = 1;
        switch (loop_config.type) {

            case LoopType.REPEAT:
                {
                    const totalFrame = loop_config.end
                        ? loop_config.end
                        : this._$totalFrames;

                    frame = loop_config.start;
                    for (let idx = 0; idx < length; ++idx) {

                        ++frame;

                        if (frame > totalFrame) {
                            frame = loop_config.start;
                        }

                    }
                }
                break;

            case LoopType.NO_REPEAT:
                {
                    const totalFrame = loop_config.end
                        ? loop_config.end
                        : this._$totalFrames;

                    frame = $Math.min(totalFrame, loop_config.start + length);
                }
                break;

            case LoopType.FIXED:
                frame = loop_config.start;
                break;

            case LoopType.NO_REPEAT_REVERSAL:

                frame = loop_config.end
                    ? loop_config.end
                    : this._$totalFrames;

                frame = $Math.max(loop_config.start, frame - length);
                break;

            case LoopType.REPEAT_REVERSAL:
                {
                    const totalFrame = loop_config.end
                        ? loop_config.end
                        : this._$totalFrames;

                    frame = totalFrame;
                    for (let idx = 0; idx < length; ++idx) {

                        --frame;

                        if (loop_config.start > frame) {
                            frame = totalFrame;
                        }

                    }
                }
                break;

        }

        return frame;
    }

    /**
     * @param  {object} character
     * @return {void}
     * @method
     * @private
     */
    _$buildCharacter (character)
    {
        for (let idx = 0; idx < character.sounds.length; ++idx) {

            const object = character.sounds[idx];

            const sounds = Util.$getArray();
            for (let idx = 0; idx < object.sound.length; ++idx) {

                const sound = new Sound();
                sound._$build(object.sound[idx], this);

                sounds.push(sound);
            }

            this._$sounds.set(object.frame, sounds);
        }

        for (let idx = 0; idx < character.actions.length; ++idx) {

            const object = character.actions[idx];
            if (!object.script) {
                object.script = Function(object.action);
            }

            this._$addAction(object.frame, object.script);
        }

        for (let idx = 0; idx < character.labels.length; ++idx) {

            const label = character.labels[idx];

            this.addFrameLabel(new FrameLabel(label.name, label.frame));

        }

        this._$loopConfigs = character.loopConfigs;
        this._$totalFrames = character.totalFrame || 1;
    }

    /**
     * @return {object}
     * @method
     * @private
     */
    _$sync ()
    {
        const character = super._$sync();

        if (character) {
            this._$buildCharacter(character);
        }

        return character;
    }

    /**
     * @param  {object} tag
     * @param  {DisplayObjectContainer} parent
     * @return {object}
     * @method
     * @private
     */
    _$build (tag, parent)
    {
        const character = super._$build(tag, parent);

        this._$buildCharacter(character);

        return character;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$soundPlay ()
    {
        const sounds = this._$sounds.get(this._$currentFrame);
        if (!sounds) {
            return;
        }

        const length = sounds.length;
        if (length) {

            // set SoundTransform
            let soundTransform = this._$soundTransform;

            let parent = this._$parent;
            while (parent) {

                if (parent._$soundTransform) {
                    soundTransform = parent._$soundTransform;
                }

                parent = parent._$parent;
            }

            // play sound
            for (let idx = 0; idx < length; ++idx) {

                const sound = sounds[idx];

                if (soundTransform) {
                    sound.loop   = soundTransform.loop;
                    sound.volume = soundTransform.volume;
                }
                sound.play();
            }
        }

        this._$canSound = false;
    }
}
