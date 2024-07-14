import { InteractiveObject } from "./InteractiveObject";
import { Event as Next2DEvent } from "@next2d/events";
import type { LoaderInfo } from "./LoaderInfo";
import type { Player } from "@next2d/core";
import type { Sound } from "@next2d/media";
import type { Transform } from "@next2d/geom";
import type {
    DictionaryTagImpl,
    PlaceObjectImpl,
    DisplayObjectImpl,
    BoundsImpl,
    FilterArrayImpl,
    LoopConfigImpl,
    ParentImpl,
    PreObjectImpl,
    AttachmentImpl,
    BlendModeImpl,
    PlayerHitObjectImpl,
    PropertyMessageMapImpl,
    PropertyContainerMessageImpl,
    Character
} from "@next2d/interface";
import type {
    CanvasToWebGLContext,
    FrameBufferManager
} from "@next2d/webgl";
import {
    $createInstance,
    $currentPlayer,
    $getRenderBufferArray,
    $getRenderMessageObject,
    $hitContext,
    $isTouch,
    $MATRIX_HIT_ARRAY_IDENTITY,
    $poolRenderMessageObject,
    $rendererWorker
} from "@next2d/util";
import {
    $cacheStore,
    $doUpdated,
    $boundsMatrix,
    $clamp,
    $getArray,
    $getBoundsObject,
    $getFloat32Array6,
    $getFloat32Array8,
    $getMap,
    $getPreObject,
    $Math,
    $COLOR_ARRAY_IDENTITY,
    $MATRIX_ARRAY_IDENTITY,
    $multiplicationColor,
    $multiplicationMatrix,
    $Number,
    $poolArray,
    $poolBoundsObject,
    $poolFloat32Array6,
    $poolFloat32Array8,
    $poolMap,
    $poolPreObject,
    $devicePixelRatio
} from "@next2d/share";

/**
 * DisplayObjectContainer クラスは、表示リストで表示オブジェクトコンテナとして機能するすべてのオブジェクトの基本クラスです。
 * このクラス自体は、画面上でのコンテンツの描画のための API を含みません。
 * そのため、DisplayObject クラスのカスタムサブクラスを作成する場合は、
 * Sprite、または MovieClip など、画面上にコンテンツを描画する API を持つサブクラスの 1 つを拡張する必要があります。
 *
 * The DisplayObjectContainer class is the base class for all objects that can serve
 * as display object containers on the display list.
 * This class itself does not contain any API for drawing content on the screen.
 * Therefore, if you want to create a custom subclass of the DisplayObject class,
 * you need to extend one of its subclasses that has an API for drawing content on the screen,
 * such as Sprite or MovieClip.
 *
 * @class
 * @memberOf next2d.display
 * @extends  InteractiveObject
 */
export class DisplayObjectContainer extends InteractiveObject
{
    protected _$placeMap: Array<Array<number>> | null;
    protected _$placeObjects: PlaceObjectImpl[] | null;
    protected _$controller: Array<Array<number>> | null;
    protected _$dictionary: DictionaryTagImpl[] | null;
    protected readonly _$children: DisplayObjectImpl<any>[];
    protected _$needsChildren: boolean;
    protected _$mouseChildren: boolean;
    protected _$wait: boolean;
    protected readonly _$names: Map<string, DisplayObjectImpl<any>>;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$placeMap = null;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$placeObjects = null;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$controller = null;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$dictionary = null;

        /**
         * @type {array}
         * @private
         */
        this._$children = $getArray();

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$needsChildren = true;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$mouseChildren = true;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$wait = true;

        /**
         * @type {Map}
         * @private
         */
        this._$names = $getMap();

        return new Proxy(this, {
            "get": (object: this, name: string): any =>
            {
                if (object._$names.size && object._$names.has(name)) {
                    return object._$names.get(name);
                }
                // @ts-ignore
                return object[name];
            }
        });
    }

    /**
     * @description オブジェクトの子がマウスまたはユーザー入力デバイスに対応しているかどうかを判断します。
     *              Determine if the object's children are compatible with mouse or user input devices.
     *
     * @member {boolean}
     * @public
     */
    get mouseChildren (): boolean
    {
        return this._$mouseChildren;
    }
    set mouseChildren (mouse_children: boolean)
    {
        this._$mouseChildren = !!mouse_children;
    }

    /**
     * @description このオブジェクトの子の数を返します。
     *              Returns the number of children of this object.
     *
     * @member   {number}
     * @readonly
     * @public
     */
    get numChildren (): number
    {
        return this._$needsChildren
            ? this._$getChildren().length
            : this._$children.length;
    }

    /**
     * @description この DisplayObjectContainer インスタンスに子 DisplayObject インスタンスを追加します。
     *              Adds a child DisplayObject instance to this DisplayObjectContainer instance.
     *
     * @param  {DisplayObject} child
     * @return {DisplayObject}
     * @method
     * @public
     */
    addChild (child: DisplayObjectImpl<any>): DisplayObjectImpl<any>
    {
        if (child._$parent) {
            child._$parent._$remove(child,
                !(child._$parent._$instanceId === this._$instanceId)
            );
        }

        this._$getChildren().push(child);

        if (child._$name) {
            this._$names.set(child._$name, child);
        }

        return this._$addChild(child);
    }

    /**
     * @description この DisplayObjectContainer インスタンスに子 DisplayObject インスタンスを追加します。
     *              Adds a child DisplayObject instance to this DisplayObjectContainer instance.
     *
     * @param  {DisplayObject} child
     * @param  {number}        index
     * @return {DisplayObject}
     * @method
     * @public
     */
    addChildAt (
        child: DisplayObjectImpl<any>,
        index: number
    ): DisplayObjectImpl<any> {

        if (child._$parent) {
            child._$parent._$remove(child,
                !(child._$parent._$instanceId === this._$instanceId)
            );
        }

        const children: DisplayObjectImpl<any>[] = this._$getChildren();
        const length: number = children.length;
        if (0 > index || index > length) {
            throw new RangeError(`RangeError: addChildAt: index error: ${index}`);
        }

        if (length && length > index) {

            children.splice(index, 0, child);

            for (let idx: number = 0; idx < index; ++idx) {
                const instance: DisplayObjectImpl<any> = children[idx];
                if (instance._$name) {
                    this._$names.set(instance._$name, instance);
                }
            }

        } else {

            children.push(child);
            if (child._$name) {
                this._$names.set(child._$name, child);
            }

        }

        return this._$addChild(child);
    }

    /**
     * @description 指定された表示オブジェクトが、DisplayObjectContainer インスタンスの子であるか
     *              インスタンス自体であるかを指定します。
     *              Determines whether the specified display object is a child
     *              of the DisplayObjectContainer instance or the instance itself.
     *
     * @param  {DisplayObject} child
     * @return {boolean}
     * @method
     * @public
     */
    contains (child: DisplayObjectImpl<any>): boolean
    {
        if (this._$instanceId === child._$instanceId) {
            return true;
        }

        const children: DisplayObjectImpl<any>[] = this._$getChildren();
        for (let idx: number = 0; idx < children.length; ++idx) {

            const instance: DisplayObjectImpl<any> = children[idx];

            if (instance._$instanceId === child._$instanceId) {
                return true;
            }

            if (instance instanceof DisplayObjectContainer) {

                if (instance.contains(child)) {
                    return true;
                }

            }

        }

        return false;
    }

    /**
     * @description 指定のインデックス位置にある子表示オブジェクトインスタンスを返します。
     *              Returns the child display object instance that exists at the specified index.
     *
     * @param  {number} index
     * @return {DisplayObject}
     * @method
     * @public
     */
    getChildAt (index: number): DisplayObjectImpl<any>
    {
        const children: DisplayObjectImpl<any>[] = this._$getChildren();

        if (0 > index || index > children.length) {
            throw new RangeError(`RangeError: getChildAt: index error: ${index}`);
        }

        return index in children ? children[index] : null;
    }

    /**
     * @description 指定された名前に一致する子表示オブジェクトを返します。
     *              Returns the child display object that exists with the specified name.
     *
     * @param  {string} name
     * @return {{DisplayObject}|null}
     * @method
     * @public
     */
    getChildByName (name: string): DisplayObjectImpl<any> | null
    {
        if (!name) {
            return null;
        }

        // fixed logic
        const children: DisplayObjectImpl<any>[] = this._$getChildren();
        for (let idx: number = 0; idx < children.length; ++idx) {

            const child: DisplayObjectImpl<any> = children[idx];
            if (child.name !== name) {
                continue;
            }

            return child;
        }

        return null;
    }

    /**
     * @description 子 DisplayObject インスタンスのインデックス位置を返します。
     *              Returns the index position of a child DisplayObject instance.
     *
     * @param  {DisplayObject} child
     * @return {number}
     * @method
     * @public
     */
    getChildIndex (child: DisplayObjectImpl<any>): number
    {
        if (child._$parent !== this) {
            throw new Error("ArgumentError: getChildIndex: not child");
        }

        const index: number = this._$getChildren().indexOf(child);
        if (index === -1) {
            throw new Error("ArgumentError: getChildIndex: not found.");
        }

        return index;
    }

    /**
     * @description DisplayObjectContainer インスタンスの子リストから指定の
     *              child DisplayObject インスタンスを削除します。
     *              Removes the specified child DisplayObject instance from the
     *              child list of the DisplayObjectContainer instance.
     *
     * @param  {DisplayObject} child
     * @return {DisplayObject}
     * @method
     * @public
     */
    removeChild (child: DisplayObjectImpl<any>): DisplayObjectImpl<any>
    {
        if (child._$parent !== this) {
            throw new Error("ArgumentError: removeChild: not child");
        }
        return this._$remove(child);
    }

    /**
     * @description DisplayObjectContainer の子リストの指定された index 位置から子 DisplayObject を削除します。
     *              Removes a child DisplayObject from the specified index position
     *              in the child list of the DisplayObjectContainer.
     *
     * @param  {number} index
     * @return {DisplayObject}
     * @method
     * @public
     */
    removeChildAt (index: number): DisplayObjectImpl<any>
    {
        return this._$remove(this.getChildAt(index));
    }

    /**
     * @description DisplayObjectContainer インスタンスの子リストから
     *              すべての child DisplayObject インスタンスを削除します。
     *              Removes all child DisplayObject instances from
     *              the child list of the DisplayObjectContainer instance.
     *
     * @param  {number} [begin_index=0]
     * @param  {number} [end_index=0x7fffffff]
     * @return {void}
     * @method
     * @public
     */
    removeChildren (
        begin_index: number = 0,
        end_index: number = 0x7fffffff
    ): void {

        const children: DisplayObjectImpl<any>[] = this._$getChildren();
        if (!children.length) {
            return ;
        }

        begin_index = $clamp(begin_index, 0, 0x7ffffffe, 0) - 1;
        end_index   = $clamp(end_index, 1, 0x7ffffff, 0x7ffffff);

        for (let idx: number = $Math.min(end_index, children.length - 1); idx > begin_index; --idx) {
            this._$remove(children[idx]);
        }
    }

    /**
     * @description 表示オブジェクトコンテナの既存の子の位置を変更します。
     *              Changes the position of an existing child in the display object container.
     *
     * @param  {DisplayObject} child
     * @param  {number} index
     * @return {void}
     * @method
     * @public
     */
    setChildIndex (
        child: DisplayObjectImpl<any>,
        index: number
    ): void {

        const currentIndex: number = this.getChildIndex(child);
        if (currentIndex === index) {
            return ;
        }

        const children: DisplayObjectImpl<any>[] = this._$getChildren();
        children.splice(currentIndex, 1);
        children.splice(index, 0, child);

        if ($rendererWorker) {
            this._$postChildrenIds();
        }

        this._$doChanged();
    }

    /**
     * @description 指定された 2 つの子オブジェクトの z 順序（重ね順）を入れ替えます。
     *              Swaps the z-order (front-to-back order) of the two specified child objects.
     *
     * @param  {DisplayObject} child1
     * @param  {DisplayObject} child2
     * @return {void}
     * @method
     * @public
     */
    swapChildren (
        child1: DisplayObjectImpl<any>,
        child2: DisplayObjectImpl<any>
    ): void {

        const children: DisplayObjectImpl<any>[] = this._$getChildren();
        const index1: number = this.getChildIndex(child1);
        const index2: number = this.getChildIndex(child2);

        children[index1] = child2;
        children[index2] = child1;

        if ($rendererWorker) {
            this._$postChildrenIds();
        }

        this._$doChanged();
    }

    /**
     * @description 子リスト内の指定されたインデックス位置に該当する 2 つの子オブジェクトの z 順序（重ね順）を入れ替えます。
     *              Swaps the z-order (front-to-back order) of the child objects at
     *              the two specified index positions in the child list.
     *
     * @param  {number} index1
     * @param  {number} index2
     * @return {void}
     * @method
     * @public
     */
    swapChildrenAt (index1: number, index2: number): void
    {
        this.swapChildren(
            this.getChildAt(index1),
            this.getChildAt(index2)
        );
    }

    /**
     * @param  {array} [matrix=null]
     * @return {object}
     * @private
     */
    _$getBounds (matrix: Float32Array | null = null): BoundsImpl
    {
        let multiMatrix: Float32Array = $MATRIX_ARRAY_IDENTITY;
        if (matrix) {

            multiMatrix = matrix;

            const rawMatrix: Float32Array = this._$transform._$rawMatrix();
            if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
                || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
                || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
            ) {
                multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
            }
        }

        const children: DisplayObjectImpl<any>[] = this._$needsChildren
            ? this._$getChildren()
            : this._$children;

        // size zero
        if (!children.length) {

            const bounds: BoundsImpl = $getBoundsObject(
                multiMatrix[4], -multiMatrix[4],
                multiMatrix[5], -multiMatrix[5]
            );

            if (matrix && multiMatrix !== matrix) {
                $poolFloat32Array6(multiMatrix);
            }

            return bounds;
        }

        // data init
        const no = $Number.MAX_VALUE;
        let xMin = no;
        let xMax = -no;
        let yMin = no;
        let yMax = -no;
        for (let idx: number = 0; idx < children.length; ++idx) {

            const bounds: BoundsImpl = children[idx]._$getBounds(multiMatrix);

            xMin = $Math.min(xMin, bounds.xMin);
            xMax = $Math.max(xMax, bounds.xMax);
            yMin = $Math.min(yMin, bounds.yMin);
            yMax = $Math.max(yMax, bounds.yMax);

            $poolBoundsObject(bounds);

        }

        if (matrix && multiMatrix !== matrix) {
            $poolFloat32Array6(multiMatrix);
        }

        // end
        return $getBoundsObject(xMin, xMax, yMin, yMax);
    }

    /**
     * @param  {Float32Array} multi_matrix
     * @return {object}
     * @private
     */
    _$getLayerBounds (multi_matrix: Float32Array): BoundsImpl
    {

        const children: DisplayObjectImpl<any>[] = this._$needsChildren
            ? this._$getChildren()
            : this._$children;

        // size zero
        if (!children.length) {
            return $getBoundsObject(0, 0, 0, 0);
        }

        // data init
        const no: number = $Number.MAX_VALUE;
        let xMin: number = no;
        let xMax: number = -no;
        let yMin: number = no;
        let yMax: number = -no;
        for (let idx: number = 0; idx < children.length; ++idx) {

            const instance = children[idx];

            let multiMatrix = multi_matrix;
            const rawMatrix: Float32Array = instance._$transform._$rawMatrix();
            if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
                || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
                || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
            ) {
                multiMatrix = $multiplicationMatrix(multi_matrix, rawMatrix);
            }

            const bounds: BoundsImpl = instance._$getLayerBounds(multiMatrix);

            xMin = $Math.min(xMin, bounds.xMin);
            xMax = $Math.max(xMax, bounds.xMax);
            yMin = $Math.min(yMin, bounds.yMin);
            yMax = $Math.max(yMax, bounds.yMax);

            $poolBoundsObject(bounds);

            if (multiMatrix !== multi_matrix) {
                $poolFloat32Array6(multiMatrix);
            }
        }

        const filters: FilterArrayImpl = this._$filters || this.filters;
        if (!filters.length) {
            return $getBoundsObject(xMin, xMax, yMin, yMax);
        }

        let filterBounds: BoundsImpl = $getBoundsObject(
            0, xMax - xMin,
            0, yMax - yMin
        );

        let xScale: number = +$Math.sqrt(
            multi_matrix[0] * multi_matrix[0]
            + multi_matrix[1] * multi_matrix[1]
        );
        let yScale: number = +$Math.sqrt(
            multi_matrix[2] * multi_matrix[2]
            + multi_matrix[3] * multi_matrix[3]
        );

        xScale /= $devicePixelRatio;
        yScale /= $devicePixelRatio;

        xScale *= 2;
        yScale *= 2;

        for (let idx: number = 0; idx < filters.length; ++idx) {
            filterBounds = filters[idx]
                ._$generateFilterRect(filterBounds, xScale, yScale);
        }

        xMax += filterBounds.xMax - (xMax - xMin);
        yMax += filterBounds.yMax - (yMax - yMin);
        xMin += filterBounds.xMin;
        yMin += filterBounds.yMin;

        $poolBoundsObject(filterBounds);

        return $getBoundsObject(xMin, xMax, yMin, yMax);
    }

    /**
     * @return {array}
     * @private
     */
    _$getChildren (): DisplayObjectImpl<any>[]
    {
        if (this._$needsChildren) {

            // set flag
            this._$needsChildren = false;

            const currentChildren: DisplayObjectImpl<any>[] = this._$children;
            if (!this._$controller) {
                return currentChildren;
            }

            const frame: number = "_$currentFrame" in this ? this._$currentFrame as number : 1;
            const controller: number[] = this._$controller[frame];

            // first build
            if (!currentChildren.length) {

                if (controller) {

                    for (let idx: number = 0; idx < controller.length; ++idx) {

                        const dictionaryId = controller[idx];
                        if (typeof dictionaryId !== "number") {
                            continue;
                        }

                        const instance: DisplayObjectImpl<any> = this._$createInstance(dictionaryId);
                        instance._$placeId = idx;

                        const loopConfig: LoopConfigImpl | null = instance.loopConfig;
                        if (loopConfig) {
                            instance._$currentFrame = instance
                                ._$getLoopFrame(loopConfig);
                        }

                        currentChildren.push(instance);
                        if (instance._$name) {
                            this._$names.set(instance._$name, instance);
                        }
                    }
                }

                return currentChildren;
            }

            const useWorker: boolean = !!$rendererWorker && !!this._$stage;

            const skipIds: Map<number, boolean> = $getMap();
            const poolInstances: Map<number, DisplayObjectImpl<any>> = $getMap();

            let depth: number = 0;
            const children: DisplayObjectImpl<any>[] = $getArray();
            for (let idx: number = 0; idx < currentChildren.length; ++idx) {

                const instance: DisplayObjectImpl<any> = currentChildren[idx];

                const parent: ParentImpl<any> = instance._$parent;
                if (!parent || parent._$instanceId !== this._$instanceId) {
                    continue;
                }

                const instanceId: number = instance._$instanceId;
                const startFrame: number = instance._$startFrame;
                const endFrame: number   = instance._$endFrame;
                if (startFrame === 1 && endFrame === 0
                    || startFrame <= frame && endFrame > frame
                ) {

                    // reset
                    instance._$isNext      = true;
                    instance._$placeObject = null;
                    instance._$filters     = null;
                    instance._$blendMode   = null;

                    if (instance._$id === -1) {

                        children.push(instance);
                        if (instance._$name) {
                            this._$names.set(instance._$name, instance);
                        }

                        continue;
                    }

                    const id: number = controller[depth];
                    if (instance._$id === id) {

                        instance._$placeId = depth;
                        children.push(instance);

                        if (instance._$name) {
                            this._$names.set(instance._$name, instance);
                        }

                        if (poolInstances.has(id)) {
                            poolInstances.delete(id);
                        }

                        skipIds.set(id, true);
                        depth++;

                        if (useWorker) {
                            instance._$postProperty();
                        }

                        continue;
                    }

                    poolInstances.set(instance._$id, instance);

                    continue;
                }

                if (useWorker) {
                    instance._$removeWorkerInstance();
                }

                $cacheStore.setRemoveTimer(instanceId);
                if (instance._$loaderInfo && instance._$characterId) {
                    $cacheStore.setRemoveTimer(
                        `${instance._$loaderInfo._$id}@${instance._$characterId}`
                    );
                }
                if (instance._$graphics) {
                    $cacheStore.setRemoveTimer(instance._$graphics._$uniqueKey);
                }

                // remove event
                if (instance.willTrigger(Next2DEvent.REMOVED)) {
                    instance.dispatchEvent(
                        new Next2DEvent(Next2DEvent.REMOVED, true)
                    );
                }
                if (instance.willTrigger(Next2DEvent.REMOVED_FROM_STAGE)) {
                    instance.dispatchEvent(
                        new Next2DEvent(Next2DEvent.REMOVED_FROM_STAGE, true)
                    );
                }

                // reset
                instance._$added       = false;
                instance._$addedStage  = false;
                instance._$active      = false;
                instance._$updated     = true;
                instance._$filters     = null;
                instance._$blendMode   = null;
                instance._$isNext      = true;
                instance._$placeObject = null;
                instance._$created     = false;
                instance._$posted      = false;

                if (instance instanceof DisplayObjectContainer) {
                    instance._$executeRemovedFromStage();
                    instance._$removeParentAndStage();
                }

            }

            if (controller) {

                for (let idx: number = 0; idx < controller.length; ++idx) {

                    const dictionaryId: number = controller[idx];
                    if (typeof dictionaryId !== "number" ||  skipIds.has(dictionaryId)) {
                        continue;
                    }

                    const instance: DisplayObjectImpl<any> = poolInstances.has(dictionaryId)
                        ? poolInstances.get(dictionaryId)
                        : this._$createInstance(dictionaryId);

                    instance._$placeId = idx;

                    const loopConfig: LoopConfigImpl | null = instance.loopConfig;
                    if (loopConfig) {
                        instance._$currentFrame = instance
                            ._$getLoopFrame(loopConfig);
                    }

                    children.push(instance);
                    if (instance._$name) {
                        this._$names.set(instance._$name, instance);
                    }

                }
            }

            // object pool
            $poolMap(skipIds);
            $poolMap(poolInstances);

            // update
            currentChildren.length = 0;
            currentChildren.push(...children);
            $poolArray(children);
        }

        return this._$children;
    }

    /**
     * @return void
     * @private
     */
    _$clearChildren (): void
    {
        this._$doChanged();
        $doUpdated();

        // reset
        this._$names.clear();

        // clear
        this._$needsChildren = true;
    }

    /**
     * @param   {DisplayObject} child
     * @returns {DisplayObject}
     * @private
     */
    _$addChild (child: DisplayObjectImpl<any>): DisplayObjectImpl<any>
    {
        // init
        child._$parent = this;
        if (!child._$stage || !child._$root) {
            child._$stage = this._$stage;
            child._$root  = this._$root;
        }

        // setup
        if (child instanceof DisplayObjectContainer) {
            child._$setParentAndStage();
            child._$wait = true;
        }

        // added event
        if (!child._$added) {
            if (child.willTrigger(Next2DEvent.ADDED)) {
                child.dispatchEvent(
                    new Next2DEvent(Next2DEvent.ADDED, true)
                );
            }
            child._$added = true;
        }

        if (this._$stage !== null && !child._$addedStage) {

            if (child.willTrigger(Next2DEvent.ADDED_TO_STAGE)) {
                child.dispatchEvent(
                    new Next2DEvent(Next2DEvent.ADDED_TO_STAGE)
                );
            }

            child._$addedStage = true;

            // set params
            if (child instanceof DisplayObjectContainer) {
                child._$executeAddedToStage();
            }

            if ($rendererWorker) {
                child._$createWorkerInstance();
                this._$postChildrenIds();
            }
        }

        this._$doChanged();
        child._$active  = true;
        child._$updated = true;
        child._$isNext  = true;

        return child;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$setParentAndStage (): void
    {
        const children: DisplayObjectImpl<any>[] = this._$needsChildren
            ? this._$getChildren()
            : this._$children;

        for (let idx: number = 0; idx < children.length; ++idx) {

            const instance: DisplayObjectImpl<any> = children[idx];

            instance._$root  = this._$root;
            instance._$stage = this._$stage;

            if (instance instanceof DisplayObjectContainer) {
                instance._$setParentAndStage();
                instance._$wait = true;
            }

        }
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$executeAddedToStage (): void
    {
        const children: DisplayObjectImpl<any>[] = this._$needsChildren
            ? this._$getChildren()
            : this._$children;

        const childrenIds: number[] = $getArray();

        for (let idx: number = 0; idx < children.length; ++idx) {

            const instance: DisplayObjectImpl<any> = children[idx];
            if (!instance) {
                continue;
            }

            childrenIds.push(instance._$instanceId);
            if (!instance._$addedStage) {

                if ($rendererWorker) {
                    instance._$createWorkerInstance();
                }

                if (instance.willTrigger(Next2DEvent.ADDED_TO_STAGE)) {
                    instance.dispatchEvent(
                        new Next2DEvent(Next2DEvent.ADDED_TO_STAGE)
                    );
                }

                instance._$addedStage = true;
            }

            if (instance instanceof DisplayObjectContainer) {
                instance._$executeAddedToStage();
            }

        }

        if ($rendererWorker) {
            this._$postChildrenIds(childrenIds);
        }

        $poolArray(childrenIds);
    }

    /**
     * @param  {DisplayObject} child
     * @param  {boolean} do_event
     * @return {DisplayObject}
     * @private
     */
    _$remove (
        child: DisplayObjectImpl<any>,
        do_event: boolean = true
    ): DisplayObjectImpl<any> {

        child._$transform._$transform();

        // remove all broadcast events
        if (child.hasEventListener(Next2DEvent.ENTER_FRAME)) {
            child.removeAllEventListener(Next2DEvent.ENTER_FRAME);
        }

        if (child.hasEventListener(Next2DEvent.EXIT_FRAME)) {
            child.removeAllEventListener(Next2DEvent.EXIT_FRAME);
        }

        if (child.hasEventListener(Next2DEvent.FRAME_CONSTRUCTED)) {
            child.removeAllEventListener(Next2DEvent.FRAME_CONSTRUCTED);
        }

        if (child.hasEventListener(Next2DEvent.RENDER)) {
            child.removeAllEventListener(Next2DEvent.RENDER);
        }

        if (child.hasEventListener(Next2DEvent.ACTIVATE)) {
            child.removeAllEventListener(Next2DEvent.ACTIVATE);
        }

        if (child.hasEventListener(Next2DEvent.DEACTIVATE)) {
            child.removeAllEventListener(Next2DEvent.DEACTIVATE);
        }

        if (child.hasEventListener("keyDown")) {
            child.removeAllEventListener("keyDown");
        }

        if (child.hasEventListener("keyUp")) {
            child.removeAllEventListener("keyUp");
        }

        // remove
        const children: DisplayObjectImpl<any>[] = this._$needsChildren
            ? this._$getChildren()
            : this._$children;

        const depth: number = this.getChildIndex(child);
        children.splice(depth, 1);

        this._$names.delete(child.name);
        if (do_event) {

            // event
            if (child.willTrigger(Next2DEvent.REMOVED)) {
                child.dispatchEvent(
                    new Next2DEvent(Next2DEvent.REMOVED, true)
                );
            }

            // remove stage event
            if (this._$stage !== null) {

                // worker側のDisplayObjectも削除
                if ($rendererWorker) {
                    child._$removeWorkerInstance();
                    this._$postChildrenIds();
                }

                if (child.willTrigger(Next2DEvent.REMOVED_FROM_STAGE)) {
                    child.dispatchEvent(
                        new Next2DEvent(Next2DEvent.REMOVED_FROM_STAGE)
                    );
                }

                if (child instanceof DisplayObjectContainer) {
                    child._$executeRemovedFromStage();
                }
            }

            $cacheStore.setRemoveTimer(child._$instanceId);
            if (child._$loaderInfo && child._$characterId) {
                $cacheStore.setRemoveTimer(
                    `${child._$loaderInfo._$id}@${child._$characterId}`
                );
            }
            if (child._$graphics) {
                $cacheStore.setRemoveTimer(child._$graphics._$uniqueKey);
            }

            // reset params
            if (child instanceof DisplayObjectContainer) {
                child._$removeParentAndStage();
            }

            // reset
            child._$stage      = null;
            child._$parent     = null;
            child._$root       = null;
            child._$active     = false;
            child._$wait       = true;
            child._$updated    = true;
            child._$added      = false;
            child._$addedStage = false;
            child._$created    = false;
            child._$posted     = false;
            this._$doChanged();

        }

        return child;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$executeRemovedFromStage (): void
    {
        const children: DisplayObjectImpl<any>[] = this._$getChildren().slice(0);
        for (let idx: number = 0; idx < children.length; ++idx) {

            const instance: DisplayObjectImpl<any> = children[idx];
            if (!instance) {
                continue;
            }

            if (instance._$addedStage) {

                // workerのDisplayObjectを削除
                if ($rendererWorker) {
                    instance._$removeWorkerInstance();
                }

                if (instance.willTrigger(Next2DEvent.REMOVED_FROM_STAGE)) {
                    instance.dispatchEvent(
                        new Next2DEvent(Next2DEvent.REMOVED_FROM_STAGE)
                    );
                }

                instance._$created    = false;
                instance._$posted     = false;
                instance._$addedStage = false;
            }

            if (instance instanceof DisplayObjectContainer) {
                instance._$executeRemovedFromStage();
            }

        }
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$removeParentAndStage (): void
    {
        const children: DisplayObjectImpl<any>[] = this._$needsChildren
            ? this._$getChildren()
            : this._$children;

        for (let idx: number = 0; idx < children.length; ++idx) {

            const instance: DisplayObjectImpl<any> = children[idx];

            $cacheStore.setRemoveTimer(instance._$instanceId);
            if (instance._$loaderInfo && instance._$characterId) {
                $cacheStore.setRemoveTimer(
                    `${instance._$loaderInfo._$id}@${instance._$characterId}`
                );
            }
            if (instance._$graphics) {
                $cacheStore.setRemoveTimer(instance._$graphics._$uniqueKey);
            }

            if (instance instanceof DisplayObjectContainer) {
                instance._$removeParentAndStage();
            }

            instance._$stage      = null;
            instance._$root       = null;
            instance._$addedStage = false;
        }

        if ("_$sounds" in this) {
            const soundsMap: Map<number, Sound[]> = this._$sounds as Map<number, Sound[]>;
            if (soundsMap.size) {
                for (const sounds of soundsMap.values()) {
                    for (let idx: number = 0; idx < sounds.length; ++idx) {
                        const sound: Sound = sounds[idx];
                        sound.stop();
                    }
                }
            }
        }

        this._$needsChildren = true;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$prepareActions (): void
    {
        const children: DisplayObjectImpl<any>[] = this._$needsChildren
            ? this._$getChildren()
            : this._$children;

        for (let idx: number = children.length - 1; idx > -1; --idx) {
            children[idx]._$prepareActions();
        }

        // added event
        this._$executeAddedEvent();
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$nextFrame (): boolean
    {
        let isNext: boolean = false;

        const children: DisplayObjectImpl<any>[] = this._$getChildren();
        for (let idx: number = children.length - 1; idx > -1; --idx) {

            const child: DisplayObjectImpl<any> = children[idx];
            if (!child._$isNext) {
                continue;
            }

            if (isNext) {

                child._$nextFrame();

            } else {

                isNext = child._$nextFrame();

            }
        }

        // added event
        this._$executeAddedEvent();

        this._$isNext = isNext;

        if (!this._$posted && $rendererWorker) {
            this._$postProperty();
        }

        return this._$isNext;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @return {void}
     * @method
     * @private
     */
    _$clip (
        context: CanvasToWebGLContext,
        matrix: Float32Array
    ): void {

        let multiMatrix: Float32Array = matrix;

        const rawMatrix: Float32Array = this._$transform._$rawMatrix();
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
        }

        const children: DisplayObjectImpl<any>[] = this._$getChildren();
        for (let idx: number = 0; idx < children.length; ++idx) {

            const instance: DisplayObjectImpl<any> = children[idx];

            // mask instance
            if (instance._$isMask) {
                continue;
            }

            instance._$clip(context, multiMatrix);
            instance._$updated = false;

        }

        if (multiMatrix !== matrix) {
            $poolFloat32Array6(multiMatrix);
        }
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @return {object}
     * @private
     */
    _$preDraw (
        context: CanvasToWebGLContext,
        matrix: Float32Array
    ): PreObjectImpl | null {

        let multiMatrix: Float32Array = matrix;
        const rawMatrix: Float32Array = this._$transform._$rawMatrix();
        if (rawMatrix !== $MATRIX_HIT_ARRAY_IDENTITY
            && rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
        }

        // size zero
        if (!multiMatrix[0] && !multiMatrix[1]
            || !multiMatrix[2] && !multiMatrix[3]
        ) {
            if (multiMatrix !== matrix) {
                $poolFloat32Array6(multiMatrix);
            }
            return null;
        }

        // return object
        const object: PreObjectImpl = $getPreObject();

        // setup
        object.matrix = multiMatrix;

        // check
        const filters: FilterArrayImpl = this._$filters   || this.filters;
        const blendMode: BlendModeImpl = this._$blendMode || this.blendMode;
        if (filters.length > 0 || blendMode !== "normal") {

            // check size
            const baseBounds: BoundsImpl = this._$getBounds(null);
            const bounds: BoundsImpl = $boundsMatrix(baseBounds, multiMatrix);
            $poolBoundsObject(baseBounds);

            const xMax: number = +bounds.xMax;
            const xMin: number = +bounds.xMin;
            const yMax: number = +bounds.yMax;
            const yMin: number = +bounds.yMin;
            $poolBoundsObject(bounds);

            const width: number  = $Math.ceil($Math.abs(xMax - xMin));
            const height: number = $Math.ceil($Math.abs(yMax - yMin));
            if (0 >= width || 0 >= height) {
                $poolPreObject(object);
                if (multiMatrix !== matrix) {
                    $poolFloat32Array6(multiMatrix);
                }
                return null;
            }

            let xScale: number = +$Math.sqrt(
                multiMatrix[0] * multiMatrix[0]
                + multiMatrix[1] * multiMatrix[1]
            );
            if (!$Number.isInteger(xScale)) {
                const value: string = xScale.toString();
                const index: number = value.indexOf("e");
                if (index !== -1) {
                    xScale = +value.slice(0, index);
                }
                xScale = +xScale.toFixed(4);
            }

            let yScale: number = +$Math.sqrt(
                multiMatrix[2] * multiMatrix[2]
                + multiMatrix[3] * multiMatrix[3]
            );
            if (!$Number.isInteger(yScale)) {
                const value: string = yScale.toString();
                const index: number = value.indexOf("e");
                if (index !== -1) {
                    yScale = +value.slice(0, index);
                }
                yScale = +yScale.toFixed(4);
            }

            object.canApply = this._$canApply(filters);
            let filterBounds: BoundsImpl = $getBoundsObject(0, width, 0, height);
            if (object.canApply && filters) {
                for (let idx: number = 0; idx < filters.length ; ++idx) {
                    filterBounds = filters[idx]
                        ._$generateFilterRect(filterBounds, xScale, yScale);
                }
            }

            const currentAttachment: AttachmentImpl | null = context
                .frameBuffer
                .currentAttachment;

            if (!currentAttachment
                || !currentAttachment.texture
                || xMin - filterBounds.xMin > currentAttachment.width
                || yMin - filterBounds.yMin > currentAttachment.height
            ) {
                $poolBoundsObject(filterBounds);
                $poolPreObject(object);
                if (multiMatrix !== matrix) {
                    $poolFloat32Array6(multiMatrix);
                }
                return null;
            }

            if (0 > xMin + filterBounds.xMax || 0 > yMin + filterBounds.yMax) {
                $poolBoundsObject(filterBounds);
                $poolPreObject(object);
                if (multiMatrix !== matrix) {
                    $poolFloat32Array6(multiMatrix);
                }
                return null;
            }

            // move size
            let tx: number = multiMatrix[4] - xMin;
            let ty: number = multiMatrix[5] - yMin;

            // start layer
            context._$startLayer(
                $getBoundsObject(xMin, xMax, yMin, yMax)
            );

            // check cache
            const updated: boolean = this._$isFilterUpdated(
                multiMatrix, filters, object.canApply
            );

            const layerBounds: BoundsImpl = this._$getLayerBounds(multiMatrix);

            const layerWidth: number  = $Math.ceil($Math.abs(layerBounds.xMax - layerBounds.xMin));
            const layerHeight: number = $Math.ceil($Math.abs(layerBounds.yMax - layerBounds.yMin));
            $poolBoundsObject(layerBounds);

            const sw = layerWidth  - filterBounds.xMax + filterBounds.xMin;
            const sh = layerHeight - filterBounds.yMax + filterBounds.yMin;

            tx += sw;
            ty += sh;

            object.sw = sw;
            object.sh = sh;
            if (updated) {
                context._$saveAttachment(
                    $Math.ceil(width  + sw),
                    $Math.ceil(height + sh),
                    true
                );
            }

            // setup
            object.isLayer   = true;
            object.isUpdated = updated;
            object.filters   = filters;
            object.blendMode = blendMode;
            object.color     = $getFloat32Array8();
            object.matrix    = $getFloat32Array6(
                multiMatrix[0], multiMatrix[1],
                multiMatrix[2], multiMatrix[3],
                tx, ty
            );

            if (multiMatrix !== matrix) {
                $poolFloat32Array6(multiMatrix);
            }

            $poolBoundsObject(filterBounds);
        }

        return object;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @param  {object} object
     * @return {void}
     * @method
     * @private
     */
    _$postDraw (
        context: CanvasToWebGLContext,
        matrix: Float32Array,
        color_transform: Float32Array,
        object: PreObjectImpl
    ): void {

        context.drawInstacedArray();

        // cache
        const cacheKeys: any[] = $getArray(this._$instanceId, "f");

        const manager: FrameBufferManager = context.frameBuffer;
        const multiMatrix: Float32Array = object.matrix as NonNullable<Float32Array>;

        let offsetX: number = 0;
        let offsetY: number = 0;
        let texture: WebGLTexture | null = $cacheStore.get(cacheKeys);

        if (!texture || object.isUpdated) {

            // remove
            if (texture) {
                $cacheStore.set(cacheKeys, null);
            }

            texture = manager
                .getTextureFromCurrentAttachment();

            const filters: FilterArrayImpl | null = object.filters;
            let filterState = false;
            if (filters && filters.length) {

                for (let idx: number = 0; idx < filters.length; ++idx) {
                    texture = filters[idx]
                        ._$applyFilter(context, matrix);
                }

                // update
                filterState = true;
                offsetX = context._$offsetX;
                offsetY = context._$offsetY;

                // reset
                context._$offsetX = 0;
                context._$offsetY = 0;
            }

            texture.filterState = filterState;
            texture.matrix = `${multiMatrix[0]}_`
                + `${multiMatrix[1]}_`
                + `${multiMatrix[2]}_`
                + `${multiMatrix[3]}`;

            texture.offsetX = offsetX;
            texture.offsetY = offsetY;

            $cacheStore.set(cacheKeys, texture);

            context._$restoreAttachment();
        }

        if (texture.offsetX) {
            offsetX = texture.offsetX;
        }

        if (texture.offsetY) {
            offsetY = texture.offsetY;
        }

        // set
        context.reset();
        context.globalAlpha = $clamp(
            color_transform[3] + color_transform[7] / 255, 0, 1
        );
        context.globalCompositeOperation = object.blendMode;

        const bounds: BoundsImpl = context.getCurrentPosition();

        context.setTransform(
            1, 0, 0, 1,
            bounds.xMin - offsetX - object.sw,
            bounds.yMin - offsetY - object.sh
        );

        context.drawImage(texture,
            0, 0, texture.width, texture.height,
            color_transform
        );

        // end blend
        context._$endLayer();

        // object pool
        $poolFloat32Array6(object.matrix as NonNullable<Float32Array>);
        $poolPreObject(object);

        // reset
        context.cachePosition = null;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @return {void}
     * @method
     * @private
     */
    _$draw (
        context: CanvasToWebGLContext,
        matrix: Float32Array,
        color_transform: Float32Array
    ): void {

        // not draw
        if (!this._$visible) {
            return ;
        }

        const transform: Transform = this._$transform;

        let multiColor: Float32Array = color_transform;
        const rawColor: Float32Array = transform._$rawColorTransform();
        if (rawColor !== $COLOR_ARRAY_IDENTITY
            && rawColor[0] !== 1 || rawColor[1] !== 1
            || rawColor[2] !== 1 || rawColor[3] !== 1
            || rawColor[4] !== 0 || rawColor[5] !== 0
            || rawColor[6] !== 0 || rawColor[7] !== 0
        ) {
            multiColor = $multiplicationColor(color_transform, rawColor);
        }

        // not draw
        const alpha: number = $clamp(multiColor[3] + multiColor[7] / 255, 0, 1, 0);
        if (!alpha) {
            return ;
        }

        // not draw
        const children: DisplayObjectImpl<any>[] = this._$getChildren();
        const length: number = children.length;
        if (!length) {
            return ;
        }

        // pre data
        const preObject: PreObjectImpl | null = this._$preDraw(context, matrix);
        if (!preObject) {
            return ;
        }

        // use cache
        if (preObject.isLayer && !preObject.isUpdated) {
            this._$postDraw(context, matrix, multiColor, preObject);
            return ;
        }

        const preMatrix: Float32Array = preObject.matrix as NonNullable<Float32Array>;

        const preColorTransform: Float32Array = preObject.isLayer && preObject.color
            ? preObject.color
            : multiColor;

        // init clip params
        let shouldClip: boolean = true;
        let clipDepth: number   = 0;

        const player: Player = $currentPlayer();

        // draw children
        const isLayer: boolean  = context.isLayer;
        const isUpdate: boolean = this._$isUpdated();
        for (let idx: number = 0; idx < length; ++idx) {

            const instance = children[idx];

            if (isUpdate) {
                instance._$placeObject = null;
            }

            // mask instance
            if (instance._$isMask) {
                continue;
            }

            // not layer mode
            const blendMode: BlendModeImpl = instance._$blendMode || instance.blendMode;
            if ((blendMode === "alpha" || blendMode === "erase")
                && !isLayer
            ) {
                continue;
            }

            // mask end
            if (clipDepth
                && (instance._$placeId > clipDepth || instance._$clipDepth > 0)
            ) {

                context.restore();

                if (shouldClip) {
                    context._$leaveClip();
                }

                // clear
                clipDepth  = 0;
                shouldClip = true;
            }

            // mask size 0
            if (!shouldClip) {
                continue;
            }

            // mask start
            if (instance._$clipDepth > 0) {

                clipDepth  = instance._$clipDepth;
                shouldClip = instance._$shouldClip(preMatrix);

                if (shouldClip) {
                    context.save();
                    shouldClip = instance._$startClip(context, preMatrix);
                }

                continue;
            }

            // mask start
            const maskInstance: DisplayObjectImpl<any> | null = instance._$mask;
            if (maskInstance) {

                maskInstance._$updated = false;

                let maskMatrix: Float32Array;

                if (this === maskInstance._$parent) {

                    maskMatrix = preMatrix;

                } else {

                    maskMatrix = $MATRIX_ARRAY_IDENTITY;

                    let parent: ParentImpl<any> | null = maskInstance._$parent;
                    while (parent) {

                        maskMatrix = $multiplicationMatrix(
                            parent._$transform._$rawMatrix(),
                            maskMatrix
                        );

                        parent = parent._$parent;
                    }

                    const mScale: number = player.scaleX;
                    const playerMatrix: Float32Array = $getFloat32Array6(
                        mScale, 0, 0, mScale, 0, 0
                    );

                    maskMatrix = $multiplicationMatrix(
                        playerMatrix, maskMatrix
                    );
                    $poolFloat32Array6(playerMatrix);

                    if (context.isLayer) {
                        const currentPosition: BoundsImpl = context.getCurrentPosition();
                        maskMatrix[4] -= currentPosition.xMin;
                        maskMatrix[5] -= currentPosition.yMin;
                    }

                }

                if (!maskInstance._$shouldClip(maskMatrix)) {
                    continue;
                }

                const result: boolean = maskInstance._$startClip(context, maskMatrix);

                context.save();

                if (!result) { // fixed
                    context.restore();
                    continue;
                }

            }

            instance._$draw(context, preMatrix, preColorTransform);
            instance._$updated = false;

            // mask end
            if (maskInstance) {
                context.restore();
                context._$leaveClip();
            }
        }

        // end mask
        if (clipDepth) {
            context.restore();

            if (shouldClip) {
                context._$leaveClip();
            }
        }

        // filter and blend
        if (preObject.isLayer) {
            return this._$postDraw(context, matrix, multiColor, preObject);
        }

        if (preObject.matrix !== matrix) {
            $poolFloat32Array6(preObject.matrix as NonNullable<Float32Array>);
        }

        if (multiColor !== color_transform) {
            $poolFloat32Array8(multiColor);
        }

        $poolPreObject(preObject);
    }

    /**
     * @param  {CanvasRenderingContext2D} context
     * @param  {Float32Array} matrix
     * @param  {object} options
     * @param  {boolean} [mouse_children=true]
     * @return {boolean}
     * @method
     * @private
     */
    _$mouseHit (
        context: CanvasRenderingContext2D,
        matrix: Float32Array,
        options: PlayerHitObjectImpl,
        mouse_children: boolean = true
    ): boolean {

        let multiMatrix: Float32Array = matrix;
        const rawMatrix: Float32Array = this._$transform._$rawMatrix();
        if (rawMatrix !== $MATRIX_ARRAY_IDENTITY) {
            multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
        }

        const children: DisplayObjectImpl<any>[] = this._$getChildren();

        // mask set
        const clips: DisplayObjectImpl<any>[]   = $getArray();
        const targets: DisplayObjectImpl<any>[] = $getArray();
        const clipIndexes: Map<number, number>  = $getMap();

        let clipDepth: number = 0;
        let clipIdx: number   = 0;
        for (let idx: number = 0; idx < children.length; ++idx) {

            const instance: DisplayObjectImpl<any> = children[idx];

            if (!instance._$visible && !instance._$hitObject) {
                continue;
            }

            if (instance._$clipDepth) {
                clipIdx   = clips.length;
                clipDepth = instance._$clipDepth;
                clips.push(instance);
                continue;
            }

            // clip end
            if (clipDepth && instance._$placeId > clipDepth) {
                clipIdx   = 0;
                clipDepth = 0;
            }

            // clip check on
            if (clipIdx) {
                clipIndexes.set(instance._$instanceId, clipIdx);
            }

            targets.push(instance);

        }

        // setup
        const mouseChildren: boolean = this._$mouseChildren && mouse_children;

        let hit: boolean = false;
        const isRoot = this._$root === this;

        while (targets.length) {

            const instance: DisplayObjectImpl<any> = targets.pop();
            if (instance._$isMask) {
                continue;
            }

            if (isRoot && !(instance instanceof InteractiveObject)) {
                continue;
            }

            // mask target
            if (clipIndexes.has(instance._$instanceId)) {

                const index: number | void = clipIndexes.get(instance._$instanceId);
                if (!index) {
                    continue;
                }

                const clip: DisplayObjectImpl<any> = clips[index];
                if (!clip._$hit(context, multiMatrix, options, true)) {
                    continue;
                }

            }

            // mask hit test
            const maskInstance: DisplayObjectImpl<any> | null = instance._$mask;
            if (maskInstance) {

                if (this === maskInstance._$parent) {

                    if (!maskInstance._$hit(context, multiMatrix, options, true)) {
                        continue;
                    }

                } else {

                    let maskMatrix: Float32Array = $MATRIX_ARRAY_IDENTITY;

                    let parent: ParentImpl<any> | null = maskInstance._$parent;
                    while (parent) {

                        maskMatrix = $multiplicationMatrix(
                            parent._$transform._$rawMatrix(),
                            maskMatrix
                        );

                        parent = parent._$parent;
                    }

                    if (!maskInstance._$hit(context, maskMatrix, options, true)) {
                        continue;
                    }

                }

            }

            if (instance._$mouseHit(context, multiMatrix, options, mouseChildren)
                || instance._$hitArea
                    && instance
                        ._$hitArea
                        ._$mouseHit(context, multiMatrix, options, mouseChildren)
            ) {

                if (instance._$root === instance) {
                    return true;
                }

                if (!mouseChildren) {
                    return true;
                }

                hit = true;
                if (instance instanceof InteractiveObject) {

                    if (!instance.mouseEnabled && !instance._$hitObject) {
                        continue;
                    }

                    if (!$isTouch && !options.pointer) {

                        if ("_$text" in instance
                            && "type" in instance
                            && instance.type === "input"
                        ) {
                            options.pointer = "text";
                        }

                        if ("buttonMode" in instance
                            && "useHandCursor" in instance
                            && instance.buttonMode
                            && instance.useHandCursor
                        ) {
                            options.pointer = "pointer";
                        }

                    }

                    if (!options.hit) {

                        options.hit = !instance.mouseEnabled && instance._$hitObject
                            ? instance._$hitObject
                            : instance;

                    }

                    return true;
                }

            }

        }

        // pool
        $poolArray(clips);
        $poolArray(targets);
        $poolMap(clipIndexes);

        if (multiMatrix !== matrix) {
            $poolFloat32Array6(multiMatrix);
        }

        // not found
        return hit;
    }

    /**
     * @param  {CanvasRenderingContext2D} context
     * @param  {Float32Array} matrix
     * @param  {object}  options
     * @param  {boolean} [is_clip=false]
     * @return {boolean}
     * @method
     * @private
     */
    _$hit (
        context: CanvasRenderingContext2D,
        matrix: Float32Array,
        options: PlayerHitObjectImpl,
        is_clip: boolean = false
    ): boolean {

        let multiMatrix: Float32Array = matrix;
        const rawMatrix: Float32Array = this._$transform._$rawMatrix();
        if (rawMatrix !== $MATRIX_ARRAY_IDENTITY) {
            multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
        }

        const children: DisplayObjectImpl<any>[] = this._$getChildren();
        for (let idx: number = children.length; idx > -1; --idx) {

            const instance: DisplayObjectImpl<any> = children[idx];
            if (instance._$isMask) {
                continue;
            }

            if (instance._$hit(context, multiMatrix, options, is_clip)) {
                return true;
            }

        }

        if (multiMatrix !== matrix) {
            $poolFloat32Array6(multiMatrix);
        }

        return false;
    }

    /**
     * @param  {number} index
     * @return {DisplayObject}
     * @method
     * @private
     */
    _$createInstance (index: number): DisplayObjectImpl<any>
    {
        if (!this._$dictionary) {
            throw new Error("the dictionary is null.");
        }

        // build
        const tag: DictionaryTagImpl = this._$dictionary[index];
        const loaderInfo: LoaderInfo | null = this._$loaderInfo;
        if (!loaderInfo || !loaderInfo._$data) {
            throw new Error("the loaderInfo or data is null.");
        }

        const character: Character<any> = loaderInfo._$data.characters[tag.characterId];

        // symbol class
        const instance: DisplayObjectImpl<any> = $createInstance(character.extends);
        instance._$build(tag, this);
        instance._$id = index;

        return instance;
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @return {boolean}
     * @method
     * @private
     */
    _$outCheck (x: number, y: number): boolean
    {
        let matrix: Float32Array = $MATRIX_ARRAY_IDENTITY;
        let parent: ParentImpl<any> | null = this._$parent;
        while (parent) {

            matrix = $multiplicationMatrix(
                parent._$transform._$rawMatrix(),
                matrix
            );

            parent = parent._$parent;
        }

        $hitContext.setTransform(1, 0, 0, 1, 0, 0);
        $hitContext.beginPath();

        const options: PlayerHitObjectImpl = {
            "x": x,
            "y": y,
            "pointer": "",
            "hit": null
        };

        return this._$mouseHit($hitContext, matrix, options);
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$createWorkerInstance (): void
    {
        if (this._$created || !$rendererWorker) {
            return ;
        }

        this._$created = true;
        this._$posted  = true;
        this._$updated = false;

        let index: number = 0;
        const buffer: Float32Array = $getRenderBufferArray();
        buffer[index++] = this._$instanceId;
        buffer[index++] = this._$parent ? this._$parent._$instanceId : -1;

        this._$registerProperty(buffer, index);

        const message: PropertyMessageMapImpl<any> = $getRenderMessageObject();
        message.command = "createDisplayObjectContainer";
        message.buffer  = buffer;

        const options: ArrayBuffer[] = $getArray(buffer.buffer);
        $rendererWorker.postMessage(message, options);

        $poolRenderMessageObject(message);
        $poolArray(options);

        this._$postChildrenIds();
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$postProperty (): void
    {
        if (!$rendererWorker) {
            return ;
        }

        this._$postChildrenIds();

        const options: ArrayBuffer[] = $getArray();
        const message: PropertyMessageMapImpl<PropertyContainerMessageImpl> = this._$createMessage();

        $rendererWorker
            .postMessage(message, options);

        $poolArray(options);

        this._$posted  = true;
        this._$updated = false;
    }

    /**
     * @param  {array} [childrenIds=null]
     * @return {void}
     * @method
     * @private
     */
    _$postChildrenIds (childrenIds: number[] | null = null): void
    {
        if (!$rendererWorker || !this._$created) {
            return ;
        }

        let poolIds = false;
        if (!childrenIds) {

            const children: DisplayObjectImpl<any>[] = this._$getChildren();

            childrenIds = $getArray();
            for (let idx: number = 0; idx < children.length; ++idx) {
                childrenIds.push(children[idx]._$instanceId);
            }

            poolIds = true;
        }

        const buffer: Int32Array = new Int32Array(childrenIds.length + 1);
        buffer[0] = this._$instanceId;
        buffer.set(childrenIds, 1);

        const message: PropertyMessageMapImpl<any> = $getRenderMessageObject();
        message.command = "setChildren";
        message.buffer  = buffer;

        const options: ArrayBuffer[] = $getArray(buffer.buffer);
        $rendererWorker.postMessage(message, options);

        $poolRenderMessageObject(message);
        $poolArray(options);

        if (poolIds) {
            $poolArray(childrenIds);
        }
    }
}
