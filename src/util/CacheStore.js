/**
 * @class
 */
class CacheStore
{
    /**
     * @param {boolean} [use_worker = false]
     * @constructor
     */
    constructor (use_worker = false)
    {
        /**
         * @type {array}
         * @private
         */
        this._$pool = [];

        /**
         * @type {Map}
         * @private
         */
        this._$store = new Map();

        /**
         * @type {number}
         * @default 2
         * @private
         */
        this._$lifeCount = 2;

        /**
         * @type {Map}
         * @private
         */
        this._$timerMap = new Map();

        /**
         * @type {CanvasToWebGLContext}
         * @default null
         * @private
         */
        this._$context = null;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$useWorker = !!use_worker;

        /**
         * @type {function}
         * @private
         */
        this._$delayLifeCheck = this.lifeCheck.bind(this);

        /**
         * @type {function}
         * @private
         */
        this._$delayBitmapLifeCheck = this.bitmapLifeCheck.bind(this);
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    reset ()
    {
        const store = this._$store.values();
        for (const data of store) {

            const values = data.values();
            for (const value of values) {
                this.destroy(value);
            }

            Util.$poolMap(data);
        }

        this._$store.clear();
    }

    /**
     * @param  {CanvasRenderingContext2D|WebGLTexture} object
     * @return {void}
     * @method
     * @public
     */
    destroy (object)
    {
        if (!object) {
            return ;
        }

        switch (object.constructor) {

            case $WebGLTexture:
                {
                    if (!this._$context) {
                        return ;
                    }

                    const timer = $requestAnimationFrame;
                    timer(() =>
                    {
                        const bitmapData = object._$bitmapData;
                        if (bitmapData && !bitmapData._$buffer) {

                            bitmapData._$getPixelsAsync(
                                0, 0, bitmapData.width, bitmapData.height, "RGBA"
                            );

                            object._$bitmapData = false;

                            // delay delete
                            const timer = $setTimeout;
                            timer(this._$delayBitmapLifeCheck, 2000, bitmapData);
                        }

                        this
                            ._$context
                            .frameBuffer
                            .releaseTexture(object);
                    });
                }
                break;

            case $CanvasRenderingContext2D:
                {
                    const canvas = object.canvas;
                    const width  = canvas.width;
                    const height = canvas.height;

                    object.clearRect(0, 0, width + 1, height + 1);

                    // canvas reset
                    canvas.width = canvas.height = 1;

                    // pool
                    this._$pool.push(canvas);
                }
                break;

            default:
                break;

        }
    }

    /**
     * @return {HTMLCanvasElement}
     * @method
     * @public
     */
    getCanvas ()
    {
        return this._$pool.pop() || $document.createElement("canvas");
    }

    /**
     * @param   {string} id
     * @param   {string} type
     * @returns {void}
     * @method
     * @public
     */
    remove (id, type)
    {
        if (!this._$store.has(id)) {
            return ;
        }

        const data = this._$store.get(id);
        if (!data.has(type)) {
            return ;
        }

        // delete key
        data.delete(type);

        if (!data.size) {
            Util.$poolMap(data);
            this._$store.delete(id);
        }
    }

    /**
     * @param   {string|number} id
     * @returns {void}
     * @method
     * @public
     */
    removeCache (id)
    {
        id = `${id}`;
        if (this._$store.has(id)) {

            const data = this._$store.get(id);

            const values = data.values();
            for (const value of values) {
                this.destroy(value);
            }

            Util.$poolMap(data);
            this._$store.delete(id);
        }

        if (this._$timerMap.has(id)) {
            const timerId = this._$timerMap.get(id);
            const timer = $clearTimeout;
            timer(timerId);
        }
    }

    /**
     * @param  {*} id
     * @param  {*} type
     * @return {string}
     * @method
     * @public
     */
    generateLifeKey (id, type)
    {
        return `${id}:${type}`;
    }

    /**
     * @param  {array} keys
     * @return {*}
     * @method
     * @public
     */
    get (keys)
    {
        const id   = `${keys[0]}`;
        const type = `${keys[1]}`;

        if (this._$store.has(id)) {

            const data = this._$store.get(id);

            if (data.has(type)) {

                const key = `life_${type}`;

                // reset
                if (data.has(key) && data.get(key) === 1) {
                    data.set(key, this._$lifeCount);
                }

                return data.get(type);
            }

        }

        return null;
    }

    /**
     * @param  {array} keys
     * @param  {*} value
     * @return {void}
     * @method
     * @public
     */
    set (keys, value = null)
    {
        const id   = `${keys[0]}`;
        const type = `${keys[1]}`;

        // init
        if (!this._$store.has(id)) {
            this._$store.set(id, Util.$getMap());
        }

        const data = this._$store.get(id);
        if (!value) {

            data.delete(type);
            data.delete(`life_${type}`);

            if (!data.size) {
                Util.$poolMap(data);
                this._$store.delete(id);
            }

            return ;

        }
        const oldValue = data.get(type);
        if (oldValue && oldValue !== value) {
            this.destroy(oldValue);
        }

        // set cache
        data.set(type, value);

        // lifeCheck
        data.set(`life_${type}`, this._$lifeCount);
        const timer = $setTimeout;
        const timerId = timer(() => { this._$delayLifeCheck(id, type) }, 5000);
        this._$timerMap.set(id, timerId);
    }

    /**
     * @param  {array} keys
     * @return {boolean}
     * @method
     * @public
     */
    has (keys)
    {
        const id = `${keys[0]}`;
        if (!this._$store.has(id)) {
            return false;
        }
        return this._$store.get(id).has(`${keys[1]}`);
    }

    /**
     * @param  {BitmapData} bitmap_data
     * @return {void}
     * @method
     * @public
     */
    bitmapLifeCheck (bitmap_data)
    {
        if (!bitmap_data._$pixelBuffer) {
            return ;
        }

        const context = this._$context;
        if (!context) {
            return ;
        }

        bitmap_data._$buffer = context
            .pbo
            .getBufferSubDataAsync(bitmap_data._$pixelBuffer);

        // reset
        bitmap_data._$pixelBuffer = null;
    }

    /**
     * @param  {*} id
     * @param  {string} type
     * @return {void}
     * @method
     * @public
     */
    lifeCheck (id, type)
    {
        if (!this._$store.has(id)) {
            return ;
        }
        const data = this._$store.get(id);
        const key  = `life_${type}`;

        const lifeCount = data.get(key) - 1;
        if (!lifeCount) {

            if (this._$useWorker) {
                globalThis.postMessage({
                    "command": "cacheClear",
                    "id": id,
                    "type": type
                });
            }

            // destroy
            this.destroy(data.get(type));

            // delete key
            data.delete(type);
            data.delete(key);

            if (!data.size) {
                Util.$poolMap(data);
                this._$store.delete(id);
            }

            return ;
        }
        data.set(key, lifeCount);

        // next
        const timer = $setTimeout;
        const timerId = timer(() => { this._$delayLifeCheck(id, type) }, 5000);
        this._$timerMap.set(id, timerId);
    }

    /**
     * @param  {string|number} unique_key
     * @param  {array}         [matrix=null]
     * @param  {Float32Array}  [color=null]
     * @return {array}
     * @method
     * @public
     */
    generateKeys (unique_key, matrix = null, color = null)
    {
        let str = "";
        if (matrix) {
            str += `${matrix.join("_")}`;
        }

        // color
        if (color) {
            str += this.colorToString(color);
        }

        const keys = Util.$getArray();
        keys[1] = str ? this.generateHash(str) : "_0";
        keys[0] = `${unique_key}`;

        return keys;
    }

    /**
     * @param  {Float32Array} [c=null]
     * @return {string}
     * @method
     * @public
     */
    colorToString (c = null)
    {
        return !c || c[7] === 0 ? "" : `_${c[7]}`;
    }

    /**
     * @param  {string} str
     * @return {string}
     * @method
     * @public
     */
    generateHash (str)
    {
        let hash = 0;
        const length = str.length;
        for (let idx = 0; idx < length; idx++) {

            const chr = str.charCodeAt(idx);

            hash  = (hash << 5) - hash + chr;
            hash |= 0;
        }
        return `_${hash}`;
    }
}
