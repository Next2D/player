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
        // params
        this._$pool  = [];
        this._$store = Util.$getMap();
        this._$lives = Util.$getMap();

        // cache
        this._$lifeCount      = 2;
        this._$delayLifeCheck = this.lifeCheck.bind(this);

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

        switch (true) {

            case (object.constructor === Util.$WebGLTexture):
                const player = Util.$players[this._$playerId];
                if (player) {

                    // cache to buffer
                    if (object._$bitmapData) {
                        object._$bitmapData._$buffer = object._$bitmapData._$getPixels(
                            0, 0, object._$bitmapData.width, object._$bitmapData.height, "RGBA", size => new Util.$Uint8Array(size));
                        delete object._$bitmapData;
                    }

                    if (player._$context) {
                        player
                            ._$context
                            .frameBuffer
                            .releaseTexture(object);
                    }
                }
                break;

            case (object.constructor === Util.$CanvasRenderingContext2D):

                const canvas = object.canvas;
                const width  = canvas.width|0;
                const height = canvas.height|0;

                object.clearRect(0, 0, width + 1, height + 1);

                // canvas reset
                canvas.width = canvas.height = 1;

                // pool
                this._$pool[this._$pool.length] = canvas;
                break;

            case (typeof object === "object"):
                Util.$poolInstance(object);
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
        id += "";
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
        return id + ":" + type;
    }

    /**
     * @param   {array} keys
     * @returns {*}
     * @public
     */
    get (keys)
    {
        const id   = keys[0] + "";
        const type = keys[1] + "";

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
        const id   = keys[0] + "";
        const type = keys[1] + "";

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
     * @param   {array} matrix
     * @param   {array} [color=null]
     * @returns {array}
     * @public
     */
    generateShapeKeys (unique_key, matrix, color = null)
    {
        // to string
        unique_key = unique_key + "";

        const keys = Util.$getArray();
        keys[0] = unique_key;

        let str = "";
        str += matrix[0] + "_" + matrix[1] + "_" + matrix[2] + "_" + matrix[3];

        // color
        if (color && color.length === 8 && (
            color[0] !== 1 || color[1] !== 1 || color[2] !== 1 ||
            color[4] !== 0 || color[5] !== 0 || color[6] !== 0 || color[7] !== 0
        )) {
            str += color[0] +"_"+ color[1] +"_"+ color[2]
                +"_"+ color[4] +"_"+ color[5]
                +"_"+ color[6] +"_"+ color[7];
        }

        keys[1] = (str) ? this.generateHash(str) : "_0";

        return keys;

    }

    /**
     * @param   {string|number} unique_key
     * @param   {array} [matrix=null]
     * @param   {array} [color=null]
     * @returns {array}
     * @public
     */
    generateKeys (unique_key, matrix = null, color = null)
    {
        // to string
        unique_key = unique_key + "";

        const keys = Util.$getArray();
        keys[0] = unique_key;

        let str = "";
        if (matrix) {
            str += matrix[0] + "_" + matrix[1];
        }

        // color
        if (color && color.length === 8 && (
            color[0] !== 1 || color[1] !== 1 || color[2] !== 1 ||
            color[4] !== 0 || color[5] !== 0 || color[6] !== 0 || color[7] !== 0
        )) {
            str += "_"+ color[0] +"_"+ color[1] +"_"+ color[2]
                +"_"+ color[4] +"_"+ color[5] +"_"+ color[6] +"_"+ color[7];
        }

        keys[1] = (str) ? this.generateHash(str) : "_0";

        return keys;
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
        return "_" + hash;
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
