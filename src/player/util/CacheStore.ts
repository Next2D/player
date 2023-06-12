import type { CanvasToWebGLContext } from "../../webgl/CanvasToWebGLContext";
import { $document } from "./Shortcut";
import {
    $requestAnimationFrame,
    $clearTimeout,
    $setTimeout,
    $getMap,
    $poolMap,
    $getArray
} from "./RenderUtil";

/**
 * @class
 */
export class CacheStore
{
    private readonly _$pool: HTMLCanvasElement[];
    private readonly _$store: Map<string, any>;
    private readonly _$timerMap: Map<string, any>;
    private _$context: CanvasToWebGLContext | null;

    /**
     * @constructor
     */
    constructor ()
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
         * @type {Map}
         * @private
         */
        this._$timerMap = new Map();

        /**
         * @type {CanvasToWebGLContext}
         * @private
         */
        this._$context = null;
    }

    /**
     * @member {CanvasToWebGLContext}
     * @param  {CanvasToWebGLContext} context
     * @public
     */
    set context (context: CanvasToWebGLContext)
    {
        this._$context = context;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    reset (): void
    {
        for (const data of this._$store.values()) {

            for (const value of data.values()) {
                this.destroy(value);
            }

            $poolMap(data);
        }

        this._$store.clear();
    }

    /**
     * @param  {CanvasRenderingContext2D|WebGLTexture} object
     * @return {void}
     * @method
     * @public
     */
    destroy (object: CanvasRenderingContext2D | WebGLTexture | null = null): void
    {
        if (!object) {
            return ;
        }

        if (object instanceof WebGLTexture) {
            $requestAnimationFrame((): void =>
            {
                if (!this._$context) {
                    return ;
                }

                this
                    ._$context
                    .frameBuffer
                    .releaseTexture(object);
            });

            return ;
        }

        if (object instanceof CanvasRenderingContext2D) {

            const canvas: HTMLCanvasElement = object.canvas;
            const width: number  = canvas.width;
            const height: number = canvas.height;

            object.clearRect(0, 0, width + 1, height + 1);

            // canvas reset
            canvas.width = canvas.height = 1;

            // pool
            this._$pool.push(canvas);
        }
    }

    /**
     * @return {HTMLCanvasElement}
     * @method
     * @public
     */
    getCanvas (): HTMLCanvasElement
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
    remove (id: string, type: string): void
    {
        if (!this._$store.has(id)) {
            return ;
        }

        const data: Map<string, any> = this._$store.get(id);
        if (!data.has(type)) {
            return ;
        }

        // delete key
        data.delete(type);

        if (!data.size) {
            $poolMap(data);
            this._$store.delete(id);
        }
    }

    /**
     * @param  {string|number} id
     * @return {void}
     * @method
     * @public
     */
    stopTimer (id: string | number): void
    {
        id = `${id}`;
        if (this._$timerMap.has(id)) {
            $clearTimeout(this._$timerMap.get(id));
            this._$timerMap.delete(id);
        }
    }

    /**
     * @param   {string|number} id
     * @returns {void}
     * @method
     * @public
     */
    removeCache (id: string | number): void
    {
        id = `${id}`;
        if (this._$store.has(id)) {

            const data: Map<string, any> = this._$store.get(id);
            for (const value of data.values()) {
                this.destroy(value);
            }

            data.clear();
            $poolMap(data);
            this._$store.delete(id);
        }

        this._$timerMap.delete(id);
    }

    /**
     * @description 5秒後にキャッシュを削除
     *
     * @param  {number|string} id
     * @return {void}
     * @method
     * @public
     */
    setRemoveTimer (id: string | number): void
    {
        id = `${id}`;

        this.stopTimer(id);

        // set timer
        if (this._$store.has(id)) {
            // @ts-ignore
            const timerId: number = $setTimeout(() =>
            {
                this.removeCache(id);
            }, 5000);
            this._$timerMap.set(id, timerId);
        }
    }

    /**
     * @param  {*} id
     * @param  {*} type
     * @return {string}
     * @method
     * @public
     */
    generateLifeKey (id: any, type: any): string
    {
        return `${id}:${type}`;
    }

    /**
     * @param  {array} keys
     * @return {*}
     * @method
     * @public
     */
    get (keys: any[]): any
    {
        const id: string   = `${keys[0]}`;
        const type: string = `${keys[1]}`;

        if (this._$store.has(id)) {

            this.stopTimer(id);

            const data: Map<string, any> = this._$store.get(id);
            if (data.has(type)) {
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
    set (keys: any[], value: any = null): void
    {
        const id: string   = `${keys[0]}`;
        const type: string = `${keys[1]}`;

        // init
        if (!this._$store.has(id)) {
            this._$store.set(id, $getMap());
        }

        const data: Map<string, any> = this._$store.get(id);
        if (!value) {

            data.delete(type);

            if (!data.size) {
                $poolMap(data);
                this._$store.delete(id);
            }

            return ;

        }

        const oldValue: any = data.get(type);
        if (oldValue && oldValue !== value) {
            this.destroy(oldValue);
        }

        // set cache
        data.set(type, value);
    }

    /**
     * @param  {array} keys
     * @return {boolean}
     * @method
     * @public
     */
    has (keys: any[]): boolean
    {
        const id: string = `${keys[0]}`;
        if (!this._$store.has(id)) {
            return false;
        }
        return this._$store.get(id).has(`${keys[1]}`);
    }

    /**
     * @param  {*} unique_key
     * @param  {array}         [matrix=null]
     * @param  {Float32Array}  [color=null]
     * @return {array}
     * @method
     * @public
     */
    generateKeys (
        unique_key: any,
        matrix: number[]|null = null,
        color:Float32Array|null = null
    ): string[] {

        let str = "";
        if (matrix) {
            str += `${matrix.join("_")}`;
        }

        // color
        if (color) {
            str += this.colorToString(color);
        }

        const keys: any[] = $getArray();
        keys[1] = str ? this.generateHash(str) : "_0";
        keys[0] = `${unique_key}`;

        return keys;
    }

    /**
     * @param  {Float32Array} color
     * @return {string}
     * @method
     * @public
     */
    colorToString (color: Float32Array): string
    {
        return color[7] === 0 ? "" : `_${color[7]}`;
    }

    /**
     * @param  {string} str
     * @return {string}
     * @method
     * @public
     */
    generateHash (str: string): string
    {
        let hash = 0;
        const length: number = str.length;
        for (let idx: number = 0; idx < length; idx++) {

            const chr: number = str.charCodeAt(idx);

            hash  = (hash << 5) - hash + chr;
            hash |= 0;
        }
        return `_${hash}`;
    }
}
