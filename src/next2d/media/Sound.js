/**
 * Sound クラスを使用すると、アプリケーション内のサウンドを処理することができます。
 * Sound クラスを使用すると、Sound オブジェクトの作成や、外部 MP3 ファイルのオブジェクトへのロードと再生ができます。
 *
 * The Sound class lets you work with sound in an application.
 * The Sound class lets you create a Sound object,
 * load and play an external MP3 file into that object.
 *
 * @class
 * @memberOf next2d.media
 * @extends  EventDispatcher
 */
class Sound extends EventDispatcher
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {

        super();

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$bytesLoaded = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$bytesTotal  = 0;

        /**
         * @type {Uint8Array}
         * @default null
         * @private
         */
        this._$buffer = null;

        /**
         * @type {Uint8Array}
         * @default null
         * @private
         */
        this._$audioBuffer = null;

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$character = null;

        /**
         * @type {array}
         * @private
         */
        this._$sources = Util.$getArray();

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$volume = 1;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$loop = false;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$stopFlag = true;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Sound]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class Sound]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.media.Sound
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.media.Sound";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object Sound]
     * @method
     * @public
     */
    toString ()
    {
        return "[object Sound]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.media.Sound
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.media.Sound";
    }

    /**
     * @description 既にアプリケーションにロードされているデータのバイト数です。
     *              The number of bytes of data that have been loaded into the application.
     *
     * @member {number}
     * @default 0
     * @readonly
     * @public
     */
    get bytesLoaded ()
    {
        return this._$bytesLoaded;
    }

    /**
     * @description アプリケーションにロードされるファイルの総バイト数。
     *              The total size in bytes of the file being loaded into the application.
     *
     * @member {number}
     * @default 0
     * @readonly
     * @public
     */
    get bytesTotal ()
    {
        return this._$bytesTotal;
    }

    /**
     * @description ループ設定です。
     *              loop setting.
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get loop ()
    {
        return this._$loop;
    }
    set loop (loop)
    {
        this._$loop = loop;
    }

    /**
     * @description ボリュームです。範囲は 0（無音）～ 1（フルボリューム）です。
     *              The volume, ranging from 0 (silent) to 1 (full volume).
     *
     * @member {number}
     * @default 1
     * @public
     */
    get volume ()
    {
        return this._$volume;
    }
    set volume (volume)
    {
        this._$volume = Util.$min(
            SoundMixer.volume,
            Util.$clamp(volume, 0, 1, 1)
        );

        const length = this._$sources.length;
        if (length && Util.$audioContext) {
            for (let idx = 0; idx < length; ++idx) {

                const source = this._$sources[idx];

                source._$gainNode.gain.value = this._$volume;
                source._$volume = this._$volume;
            }
        }
    }

    /**
     * @description Sound クラスを複製します。
     *              Duplicate the Sound class.
     *
     * @return {Sound}
     * @method
     * @public
     */
    clone ()
    {
        const sound  = new Sound();
        sound.volume = this.volume;
        sound.loop   = this.loop;

        if (this._$character) {
            sound._$character = this._$character;
        } else {
            sound._$audioBuffer = this._$audioBuffer;
        }

        return sound;
    }

    /**
     * @description 指定した URL から外部 MP3 ファイルのロードを開始します。
     *              Initiates loading of an external MP3 file from the specified URL.
     *
     * @param {URLRequest} request
     * @return {void}
     * @method
     * @public
     */
    load (request)
    {
        Util.$ajax({
            "format": URLLoaderDataFormat.ARRAY_BUFFER,
            "url": request.url,
            "method": request.method,
            "data": request.data,
            "headers": request.headers,
            "credentials": request.withCredentials,
            "event": {
                "loadstart": function (event)
                {
                    this._$bytesLoaded = event.loaded;
                    this._$bytesTotal  = event.total;

                    if (this.willTrigger(Event.OPEN)) {
                        this.dispatchEvent(new Event(Event.OPEN));
                    }
                    if (this.willTrigger(ProgressEvent.PROGRESS)) {
                        this.dispatchEvent(new ProgressEvent(
                            ProgressEvent.PROGRESS, false, false,
                            event.loaded, event.total
                        ));
                    }

                }.bind(this),
                "progress": function (event)
                {
                    this._$bytesLoaded = event.loaded;
                    this._$bytesTotal  = event.total;

                    if (this.willTrigger(ProgressEvent.PROGRESS)) {
                        this.dispatchEvent(new ProgressEvent(
                            ProgressEvent.PROGRESS, false, false,
                            event.loaded, event.total
                        ));
                    }
                }.bind(this),
                "loadend": function (event)
                {
                    this._$bytesLoaded = event.loaded;
                    this._$bytesTotal  = event.total;

                    if (this.willTrigger(ProgressEvent.PROGRESS)) {
                        this.dispatchEvent(new ProgressEvent(
                            ProgressEvent.PROGRESS, false, false,
                            event.loaded, event.total
                        ));
                    }

                    if (199 < event.target.status && 400 > event.target.status) {

                        this._$buffer = new Uint8Array(event.target.response);

                        if (Util.$audioContext) {
                            Util.$decodeAudioData(this);
                        } else {
                            Util.$audios.push(this);
                        }

                        // load complete
                        Util.$currentPlayer()._$loaders.push(this);

                    } else {

                        if (this.willTrigger(IOErrorEvent.IO_ERROR)) {
                            this.dispatchEvent(new IOErrorEvent(
                                IOErrorEvent.IO_ERROR, false, false,
                                event.target.statusText,
                                event.target.status
                            ));
                        }

                    }

                }.bind(this)
            }
        });
    }

    /**
     * @description サウンドを再生します。
     *              Play a sound.
     *
     * @param   {number} [start_time=0]
     * @return  {void}
     * @method
     * @public
     */
    play (start_time = 0)
    {
        const buffer = this._$character
            ? this._$character.audioBuffer
            : this._$audioBuffer;

        // execute
        if (!Util.$audioContext || !buffer) {

            const wait = function (now, start_time = 0)
            {
                const buffer = this._$character
                    ? this._$character.audioBuffer
                    : this._$audioBuffer;

                if (buffer !== null && Util.$audioContext !== null) {
                    const offset = (Util.$performance.now() - now) / 1000;
                    this._$createBufferSource(start_time, offset);
                    return ;
                }

                const timer = Util.$requestAnimationFrame;
                timer(wait);

            }.bind(this, Util.$performance.now(), start_time);

            const timer = Util.$requestAnimationFrame;
            timer(wait);

        } else {

            this._$createBufferSource(start_time);

        }
    }

    /**
     * @description チャンネルで再生しているサウンドを停止します。
     *              Stops the sound playing in the channel.
     *
     * @return {void}
     * @method
     * @public
     */
    stop ()
    {
        this._$stopFlag = true;
        const length = this._$sources.length;
        if (length) {

            const player = Util.$currentPlayer();
            if (Util.$audioContext) {

                for (let idx = 0; idx < length; ++idx) {

                    const source = this._$sources[idx];

                    if (source._$gainNode) {
                        source._$gainNode.gain.value = 0;
                        source._$gainNode.disconnect();
                        source._$gainNode = null;
                    }

                    source.onended = null;
                    source.disconnect();
                }
            }

            player._$sources.splice(
                player._$sources.indexOf(this), 1
            );

            this._$sources.length = 0;
        }
    }

    /**
     * @param  {object} tag
     * @param  {MovieClip} parent
     * @return {void}
     * @method
     * @private
     */
    _$build(tag, parent)
    {
        this._$character = parent
            ._$loaderInfo
            ._$data.characters[tag.characterId];

        if (!this._$character.init) {

            this._$character.init   = true;
            this._$character.buffer = new Uint8Array(this._$character.buffer);

            if (Util.$audioContext) {
                Util.$decodeAudioData(this);
            } else {
                Util.$audios.push(this);
            }
        }

        this._$loop   = tag.loop;
        this._$volume = Util.$min(SoundMixer.volume, tag.volume);
    }

    /**
     * @param  {number}  [start_time=0]
     * @param  {number}  [offset=0]
     * @return {void}
     * @method
     * @private
     */
    _$createBufferSource (start_time = 0, offset = 0)
    {
        // setup
        const source = Util.$audioContext.createBufferSource();
        source._$startTime = start_time;

        source.onended = this._$endEventHandler.bind(this);

        // main
        source.buffer = this._$character
            ? this._$character.audioBuffer
            : this._$audioBuffer;

        source._$gainNode = Util.$audioContext.createGain();
        source._$gainNode.connect(Util.$audioContext.destination);

        const volume = Util.$min(SoundMixer.volume, this._$volume);

        source._$gainNode.gain.value = volume;
        source._$volume = volume;

        source.connect(source._$gainNode);
        source.start(start_time | 0, offset);

        const player = Util.$currentPlayer();
        if (player._$sources.indexOf(this) === -1) {
            player._$sources.push(this);
        }

        this._$sources.push(source);

        this._$stopFlag = false;
    }

    /**
     * @param  {Event} event
     * @return {void}
     * @method
     * @private
     */
    _$endEventHandler (event)
    {
        const source = event.target;

        this._$sources.splice(
            this._$sources.indexOf(source), 1
        );

        if (this._$loop && !this._$stopFlag) {

            this._$createBufferSource();

        } else {

            if (Util.$audioContext) {

                if (source._$gainNode) {
                    source._$gainNode.gain.value = 0;
                    source._$gainNode.disconnect();
                    source._$gainNode = null;
                }

                // Firefoxにて、disconnectした時にonendedが呼び出されるのを回避
                source.onended = null;
                source.disconnect();
            }

            if (!this._$sources.length) {
                const player = Util.$currentPlayer();
                player._$sources.splice(
                    player._$sources.indexOf(this), 1
                );
            }

            if (this.willTrigger(Event.SOUND_COMPLETE)) {
                this.dispatchEvent(new Event(Event.SOUND_COMPLETE));
            }

        }
    }
}