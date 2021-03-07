/**
 * @class
 */
class CacheStore
{
    /**
     * @constructor
     */
    constructor ()
    {
        /**
         * @type {array}
         * @private
         */
        this._$pool  = Util.$getArray();

        /**
         * @type {Map}
         * @private
         */
        this._$store = Util.$getMap();

        /**
         * @type {Map}
         * @private
         */
        this._$lives = Util.$getMap();

        /**
         * @type {number}
         * @default 2
         * @private
         */
        this._$lifeCount = 2;

        /**
         * @type {function}
         * @private
         */
        this._$delayLifeCheck = this.lifeCheck.bind(this);

        /**
         * @type {number|null}
         * @default null
         * @private
         */
        this._$playerId = null;

        const timer = Util.$setTimeout;
        timer(this._$delayLifeCheck, 5000);
    }

    /**
     * @returns void
     * @public
     */
    reset ()
    {
        for (const [id, data] of this._$store) {

            for (const [type, value] of data) {

                this.destroy(value);

                this._$lives.delete(
                    this.generateLifeKey(id, type)
                );
            }

            Util.$poolMap(data);
        }

        this._$store.clear();
    }

    /**
     * @param   {CanvasRenderingContext2D|WebGLTexture} object
     * @returns void
     * @public
     */
    destroy (object)
    {
        if (!object) {
            return ;
        }

        switch (object.constructor) {

            case Util.$WebGLTexture:
                const player = Util.$players[this._$playerId];
                if (player) {

                    // TODO
                    // // cache to buffer
                    // if (object._$bitmapData) {
                    //     object._$bitmapData._$buffer = object._$bitmapData._$getPixels(
                    //         0, 0, object._$bitmapData.width, object._$bitmapData.height, "RGBA", size => new Util.$Uint8Array(size));
                    //     delete object._$bitmapData;
                    // }
                    //
                    // if (player._$context) {
                    //     player
                    //         ._$context
                    //         .frameBuffer
                    //         .releaseTexture(object);
                    // }

                }
                break;

            case Util.$CanvasRenderingContext2D:

                const canvas = object.canvas;
                const width  = canvas.width;
                const height = canvas.height;

                object.clearRect(0, 0, width + 1, height + 1);

                // canvas reset
                canvas.width = canvas.height = 1;

                // pool
                this._$pool[this._$pool.length] = canvas;
                break;

            default:
                break;

        }
    }

    /**
     * @returns {HTMLCanvasElement}
     * @public
     */
    getCanvas ()
    {
        return this._$pool.pop() || Util.$document.createElement("canvas");
    }

    /**
     * @param   {string|number} id
     * @returns void
     * @public
     */
    removeCache (id)
    {
        id = `${id}`;
        if (this._$store.has(id)) {

            const data = this._$store.get(id);

            for (const [type, value] of data) {

                this.destroy(value);

                this._$lives.delete(
                    this.generateLifeKey(id, type)
                );
            }

            Util.$poolMap(data);
            this._$store.delete(id);
        }
    }

    /**
     * @param  {*} id
     * @param  {*} type
     * @return {string}
     */
    generateLifeKey (id, type)
    {
        return `${id}:${type}`;
    }

    /**
     * @param   {array} keys
     * @returns {*}
     * @public
     */
    get (keys)
    {
        const id   = `${keys[0]}`;
        const type = `${keys[1]}`;

        if (this._$store.has(id)) {

            const data = this._$store.get(id);

            if (data.has(type)) {

                const key = this.generateLifeKey(id, type);
                const lifeCount = this._$lives.get(key);

                if (lifeCount === 1) {
                    this._$lives.set(key, this._$lifeCount);
                }

                return data.get(type);
            }

        }

        return null;
    }

    /**
     * @param {array} keys
     * @param {*} value
     * @public
     */
    set (keys, value)
    {
        const id   = `${keys[0]}`;
        const type = `${keys[1]}`;

        // init
        if (!this._$store.has(id)) {
            this._$store.set(id, Util.$getMap());
        }

        // life key
        const key = this.generateLifeKey(id, type);

        const data = this._$store.get(id);

        if (!value) {

            data.delete(type);
            this._$lives.delete(key);

            if (!data.size) {
                Util.$poolMap(data);
                this._$store.delete(id);
            }

            return ;

        } else {
            const oldValue = data.get(type);
            if (oldValue && oldValue !== value) {
                console.log("TODO delete cache");
                //this.destroy(oldValue);
            }
        }

        // set cache
        data.set(type, value);

        // set life count
        this._$lives.set(key, this._$lifeCount);
    }

    /**
     * @param   {string|number} unique_key
     * @param   {Float32Array} matrix
     * @param   {Float32Array} [color=null]
     * @returns {array}
     * @public
     */
    generateShapeKeys (unique_key, matrix, color = null)
    {
        const str = `${matrix[0]}_${matrix[1]}_${matrix[2]}_${matrix[3]}${this.colorToString(color)}`;

        const keys = Util.$getArray();

        keys[0] = `${unique_key}`;
        keys[1] = this.generateHash(str);

        return keys;

    }

    /**
     * @param   {string|number} unique_key
     * @param   {Float32Array} [matrix=null]
     * @param   {Float32Array} [color=null]
     * @returns {array}
     * @public
     */
    generateKeys (unique_key, matrix = null, color = null)
    {

        let str = "";
        if (matrix) {
            str += `${matrix[0]}_${matrix[1]}`;
        }

        // color
        str += this.colorToString(color);

        const keys = Util.$getArray();
        keys[1] = (str) ? this.generateHash(str) : "_0";
        keys[0] = `${unique_key}`;

        return keys;
    }

    /**
     * @param  {Float32Array} [c=null]
     * @return {string}
     */
    colorToString (c = null)
    {
        if (!c) {
            return "";
        }

        switch (true) {

            case c[0] !== 1:
            case c[1] !== 1:
            case c[2] !== 1:
            case c[4] !== 0:
            case c[5] !== 0:
            case c[6] !== 0:
            case c[7] !== 0:
                return `_${c[0]}_${c[1]}_${c[2]}_${c[4]}_${c[5]}_${c[6]}_${c[7]}`;

            default:
                return "";
        }
    }

    /**
     * @param  {string} str
     * @return {string}
     */
    generateHash (str)
    {
        let hash = 0;
        const length = str.length;
        for (let idx = 0; idx < length; idx++) {
            const chr = str.charCodeAt(idx);

            hash  = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return `_${hash}`;
    }

    /**
     * @return void
     * @public
     */
    lifeCheck ()
    {
        for (const [id, data] of this._$store) {

            for (const [type, value] of data) {

                const key = this.generateLifeKey(id, type);
                const lifeCount = this._$lives.get(key) - 1;
                if (!lifeCount) {

                    // destroy
                    this.destroy(value);

                    // delete key
                    data.delete(type);

                    this._$lives.delete(key);

                    continue;
                }

                // update life count
                this._$lives.set(key, lifeCount);

            }

            // delete id
            if (!data.size) {
                Util.$poolMap(data);
                this._$store.delete(id);
            }

        }

        const timer = Util.$setTimeout;
        timer(this._$delayLifeCheck, 5000);
    }
}
