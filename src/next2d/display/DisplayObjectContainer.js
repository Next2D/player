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
class DisplayObjectContainer extends InteractiveObject
{
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
        this._$children = Util.$getArray();

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
        this._$names = Util.$getMap();

        return new Proxy(this, {
            "get": (object, name) =>
            {
                if (object._$names.size && object._$names.has(name)) {
                    return object._$names.get(name);
                }
                return object[name];
            }
        });
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class DisplayObjectContainer]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class DisplayObjectContainer]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.DisplayObjectContainer
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display.DisplayObjectContainer";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object DisplayObjectContainer]
     * @method
     * @public
     */
    toString ()
    {
        return "[object DisplayObjectContainer]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.DisplayObjectContainer
     * @const
     * @public
     */
    get namespace ()
    {
        return "next2d.display.DisplayObjectContainer";
    }

    /**
     * @description オブジェクトの子がマウスまたはユーザー入力デバイスに対応しているかどうかを判断します。
     *              Determines whether or not the children of the object are mouse, or user input device, enabled.
     *
     * @member {boolean}
     * @public
     */
    get mouseChildren ()
    {
        return this._$mouseChildren;
    }
    set mouseChildren (mouse_children)
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
    get numChildren ()
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
    addChild (child)
    {
        if (!(child instanceof DisplayObject)) {
            throw new TypeError("TypeError: addChild: not DisplayObject.");
        }

        if (child._$parent) {
            child._$parent._$remove(child,
                !(child._$parent._$instanceId === this._$instanceId)
            );
        }

        const children = this._$getChildren();
        children.push(child);

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
    addChildAt (child, index)
    {
        if (!(child instanceof DisplayObject)) {
            throw new TypeError("TypeError: addChildAt: not DisplayObject.");
        }

        if (child._$parent) {
            child._$parent._$remove(child,
                !(child._$parent._$instanceId === this._$instanceId)
            );
        }

        const children = this._$getChildren();
        const length = children.length;
        if (0 > index || index > length) {
            throw new RangeError(`RangeError: addChildAt: index error: ${index}`);
        }

        if (length && length > index) {

            children.splice(index, 0, child);

            for (let idx = 0; idx < index; ++idx) {
                const instance = children[idx];
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
    contains (child)
    {
        if (!(child instanceof DisplayObject)) {
            throw new TypeError("TypeError: contains: not DisplayObject.");
        }

        if (this._$instanceId === child._$instanceId) {
            return true;
        }

        const children = this._$getChildren();
        const length   = children.length;
        for (let idx = 0; idx < length; ++idx) {

            const instance = children[idx];

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
    getChildAt (index)
    {
        const children = this._$getChildren();

        const numChildren = children.length;
        if (0 > index || index > numChildren) {
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
    getChildByName (name)
    {
        if (!name) {
            return null;
        }

        // fixed logic
        const children = this._$getChildren();
        const length   = children.length;
        for (let idx = 0; idx < length; ++idx) {

            const child = children[idx];
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
    getChildIndex (child)
    {
        if (!(child instanceof DisplayObject)) {
            throw new TypeError("TypeError: getChildIndex: not DisplayObject.");
        }

        if (child._$parent !== this) {
            throw new ArgumentError("ArgumentError: getChildIndex: not child");
        }

        const children = this._$getChildren();
        const index = children.indexOf(child);
        if (index === -1) {
            throw new ArgumentError("ArgumentError: getChildIndex: not found.");
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
    removeChild (child)
    {
        if (!(child instanceof DisplayObject)) {
            throw new TypeError("TypeError: removeChild: not DisplayObject.");
        }

        if (child._$parent !== this) {
            throw new ArgumentError(`ArgumentError: removeChild: index error: ${index}`);
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
    removeChildAt (index)
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
    removeChildren (begin_index = 0, end_index = 0x7fffffff)
    {
        const children = this._$getChildren();
        const numChildren = children.length;
        if (!numChildren) {
            return ;
        }

        begin_index = Util.$clamp(begin_index, 0, 0x7ffffffe, 0) - 1;
        end_index   = Util.$clamp(end_index, 1, 0x7ffffff, 0x7ffffff);

        for (let idx = $Math.min(end_index, numChildren - 1); idx > begin_index; --idx) {
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
    setChildIndex (child, index)
    {
        if (!(child instanceof DisplayObject)) {
            throw new TypeError("TypeError: removeChild: not DisplayObject.");
        }

        const currentIndex = this.getChildIndex(child);
        if (currentIndex === index) {
            return ;
        }

        const children = this._$getChildren();
        children.splice(currentIndex, 1);
        children.splice(index, 0, child);

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
    swapChildren (child1, child2)
    {
        if (!(child1 instanceof DisplayObject)
            || !(child2 instanceof DisplayObject)
        ) {
            throw new TypeError("TypeError: removeChild: not DisplayObject.");
        }

        const children = this._$getChildren();
        const index1 = this.getChildIndex(child1);
        const index2 = this.getChildIndex(child2);

        children[index1] = child2;
        children[index2] = child1;

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
    swapChildrenAt (index1, index2)
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
    _$getBounds (matrix = null)
    {
        let multiMatrix = Util.$MATRIX_ARRAY_IDENTITY;
        if (matrix) {

            multiMatrix = matrix;

            const rawMatrix = this._$transform._$rawMatrix();
            if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
                || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
                || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
            ) {
                multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
            }
        }

        const isGraphics = !!this._$graphics;

        const children = this._$needsChildren
            ? this._$getChildren()
            : this._$children;

        const length = children.length;

        // size zero
        if (!length && !isGraphics) {
            const bounds = Util.$getBoundsObject(
                multiMatrix[4], -multiMatrix[4],
                multiMatrix[5], -multiMatrix[5]
            );
            if (matrix && multiMatrix !== matrix) {
                Util.$poolFloat32Array6(multiMatrix);
            }
            return bounds;
        }

        // data init
        const no = $Number.MAX_VALUE;
        let xMin = no;
        let xMax = -no;
        let yMin = no;
        let yMax = -no;

        if (isGraphics) {
            const bounds = Util.$boundsMatrix(this._$graphics._$getBounds(), multiMatrix);
            xMin   = bounds.xMin;
            xMax   = bounds.xMax;
            yMin   = bounds.yMin;
            yMax   = bounds.yMax;
            Util.$poolBoundsObject(bounds);
        }

        for (let idx = 0; idx < length; ++idx) {

            const bounds = children[idx]._$getBounds(multiMatrix);

            xMin = $Math.min(xMin, bounds.xMin);
            xMax = $Math.max(xMax, bounds.xMax);
            yMin = $Math.min(yMin, bounds.yMin);
            yMax = $Math.max(yMax, bounds.yMax);

            Util.$poolBoundsObject(bounds);

        }

        if (matrix && multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }

        // end
        return Util.$getBoundsObject(xMin, xMax, yMin, yMax);
    }

    /**
     * @param  {array} [matrix=null]
     * @return {object}
     * @private
     */
    _$getLayerBounds (matrix = null)
    {

        let multiMatrix = Util.$MATRIX_ARRAY_IDENTITY;
        if (matrix) {

            multiMatrix = matrix;

            const rawMatrix = this._$transform._$rawMatrix();
            if (rawMatrix !== Util.$MATRIX_ARRAY_IDENTITY) {
                multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
            }
        }

        const isGraphics = this._$graphics && this._$graphics._$getBounds();

        const children = this._$needsChildren
            ? this._$getChildren()
            : this._$children;

        const length = children.length;

        // size zero
        if (!length && !isGraphics) {
            const bounds = Util.$getBoundsObject(
                multiMatrix[4], -multiMatrix[4],
                multiMatrix[5], -multiMatrix[5]
            );
            if (matrix && multiMatrix !== matrix) {
                Util.$poolFloat32Array6(multiMatrix);
            }
            return bounds;
        }

        // data init
        const no   = $Number.MAX_VALUE;
        let xMin = no;
        let xMax = -no;
        let yMin = no;
        let yMax = -no;

        if (isGraphics) {
            const bounds = Util.$boundsMatrix(this._$graphics._$getBounds(), multiMatrix);
            xMin   = +bounds.xMin;
            xMax   = +bounds.xMax;
            yMin   = +bounds.yMin;
            yMax   = +bounds.yMax;
            Util.$poolBoundsObject(bounds);
        }

        for (let idx = 0; idx < length; ++idx) {

            const bounds = children[idx]._$getLayerBounds(multiMatrix);

            xMin = $Math.min(xMin, bounds.xMin);
            xMax = $Math.max(xMax, bounds.xMax);
            yMin = $Math.min(yMin, bounds.yMin);
            yMax = $Math.max(yMax, bounds.yMax);

            Util.$poolBoundsObject(bounds);

        }

        if (matrix && multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }

        // end
        if (!matrix) {
            return Util.$getBoundsObject(xMin, xMax, yMin, yMax);
        }

        const filters = this._$filters || this.filters;
        const fLength = filters.length;
        if (!fLength) {
            return Util.$getBoundsObject(xMin, xMax, yMin, yMax);
        }

        let rect = new Rectangle(xMin, yMin, xMax - xMin, yMax - yMin);
        for (let idx = 0; idx < fLength; ++idx) {
            rect = filters[idx]._$generateFilterRect(rect, null, null, true);
        }

        xMin = rect._$x;
        xMax = rect._$x + rect._$width;
        yMin = rect._$y;
        yMax = rect._$y + rect._$height;

        return Util.$getBoundsObject(xMin, xMax, yMin, yMax);
    }

    /**
     * @return {array}
     * @private
     */
    _$getChildren ()
    {
        if (this._$needsChildren) {

            const cacheStore = Util.$cacheStore();
            const useWorker  = Util.$rendererWorker !== null && !!this._$stage;

            // set flag
            this._$needsChildren = false;

            const frame = this._$currentFrame || 1;
            if (!this._$controller) {
                return this._$children;
            }

            let controller = this._$controller[frame];

            const childrenIds = Util.$getArray();

            // first build
            const length = this._$children.length;
            if (!length) {

                if (controller) {
                    const length = controller.length;
                    for (let idx = 0; idx < length; ++idx) {

                        const instance = this._$createInstance(controller[idx]);
                        instance._$placeId = idx;

                        const loopConfig = instance.loopConfig;
                        if (loopConfig) {
                            instance._$currentFrame = instance
                                ._$getLoopFrame(loopConfig);
                        }

                        this._$children.push(instance);
                        if (instance._$name) {
                            this._$names.set(instance._$name, instance);
                        }

                        if (useWorker) {
                            childrenIds.push(instance._$instanceId);
                            instance._$postProperty();
                        }
                    }
                }

                if (useWorker) {
                    Util.$rendererWorker.postMessage({
                        "command": "setChildren",
                        "instanceId": this._$instanceId,
                        "children": childrenIds
                    });
                }

                Util.$poolArray(childrenIds);

                return this._$children;
            }

            const skipIds       = Util.$getMap();
            const poolInstances = Util.$getMap();

            let depth = 0;
            const children = Util.$getArray();
            for (let idx = 0; idx < length; ++idx) {

                const instance = this._$children[idx];

                const parent = instance._$parent;
                if (!parent || parent._$instanceId !== this._$instanceId) {
                    continue;
                }

                const instanceId = instance._$instanceId;
                const startFrame = instance._$startFrame;
                const endFrame   = instance._$endFrame;
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

                        if (useWorker) {
                            childrenIds.push(instanceId);
                            instance._$postProperty();
                        }

                        continue;
                    }

                    const id = controller[depth];
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
                            childrenIds.push(instanceId);
                            instance._$postProperty();
                        }

                        continue;
                    }

                    poolInstances.set(instance._$id, instance);

                    continue;
                }

                if (useWorker) {
                    Util.$rendererWorker.postMessage({
                        "command": "remove",
                        "instanceId": instanceId
                    });
                }

                cacheStore.setRemoveTimer(instanceId);
                if (instance._$loaderInfo && instance._$characterId) {
                    cacheStore.setRemoveTimer(
                        `${instance._$loaderInfo._$id}@${instance._$characterId}`
                    );
                }

                // remove event
                if (instance.willTrigger(Event.REMOVED)) {
                    instance.dispatchEvent(new Event(Event.REMOVED, true));
                }
                if (instance.willTrigger(Event.REMOVED_FROM_STAGE)) {
                    instance.dispatchEvent(
                        new Event(Event.REMOVED_FROM_STAGE, true)
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

                if (instance instanceof DisplayObjectContainer) {
                    instance._$executeRemovedFromStage();
                    instance._$removeParentAndStage();
                }

            }

            if (controller) {
                for (let idx = 0; idx < controller.length; ++idx) {

                    const id = controller[idx];
                    if (skipIds.has(id)) {
                        continue;
                    }

                    const instance = poolInstances.has(id)
                        ? poolInstances.get(id)
                        : this._$createInstance(id);

                    instance._$placeId = idx;

                    const loopConfig = instance.loopConfig;
                    if (loopConfig) {
                        instance._$currentFrame = instance
                            ._$getLoopFrame(loopConfig);
                    }

                    children.push(instance);
                    if (instance._$name) {
                        this._$names.set(instance._$name, instance);
                    }

                    if (useWorker) {
                        childrenIds.push(instance._$instanceId);
                        instance._$postProperty();
                    }
                }
            }

            if (useWorker) {
                Util.$rendererWorker.postMessage({
                    "command": "setChildren",
                    "instanceId": this._$instanceId,
                    "children": childrenIds
                });
            }

            // object pool
            Util.$poolMap(skipIds);
            Util.$poolMap(poolInstances);
            Util.$poolArray(this._$children);
            Util.$poolArray(childrenIds);

            // update
            this._$children = children;
        }

        return this._$children;
    }

    /**
     * @return void
     * @private
     */
    _$clearChildren ()
    {
        this._$doChanged();
        Util.$isUpdated = true;

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
    _$addChild (child)
    {
        // init
        child._$parent = this;
        if (this.constructor === Stage) {

            child._$stage = this;
            child._$root  = child;

        } else {

            child._$stage = this._$stage;
            child._$root  = this._$root;

        }

        if (Util.$rendererWorker && this._$stage) {

            child._$createWorkerInstance();

            const children = this._$getChildren();

            const childrenIds = Util.$getArray();
            for (let idx = 0; idx < children.length; ++idx) {
                childrenIds.push(children[idx]._$instanceId);
            }

            Util.$rendererWorker.postMessage({
                "command": "setChildren",
                "instanceId": this._$instanceId,
                "children": childrenIds
            });

            Util.$poolArray(childrenIds);
        }

        // setup
        if (child instanceof DisplayObjectContainer) {
            child._$setParentAndStage();
            child._$wait = true;
        }

        // added event
        if (!child._$added) {
            if (child.willTrigger(Event.ADDED)) {
                child.dispatchEvent(new Event(Event.ADDED, true));
            }
            child._$added = true;
        }

        if (this._$stage !== null && !child._$addedStage) {

            if (child.willTrigger(Event.ADDED_TO_STAGE)) {
                child.dispatchEvent(new Event(Event.ADDED_TO_STAGE));
            }

            child._$addedStage = true;

            // set params
            if (child instanceof DisplayObjectContainer) {
                child._$executeAddedToStage();
            }
        }

        this._$doChanged();
        child._$active  = true;
        child._$updated = true;
        child._$isNext  = true;

        return child;
    }

    /**
     * @return  {void}
     * @private
     */
    _$setParentAndStage ()
    {
        const children = this._$needsChildren
            ? this._$getChildren()
            : this._$children;

        const length = children.length;
        for (let idx = 0; idx < length; ++idx) {

            const instance = children[idx];

            instance._$root  = this._$root;
            instance._$stage = this._$stage;

            if (instance instanceof DisplayObjectContainer) {
                instance._$setParentAndStage();
                instance._$wait = true;
            }

        }
    }

    /**
     * @return  void
     * @private
     */
    _$executeAddedToStage ()
    {
        const children = this._$needsChildren
            ? this._$getChildren()
            : this._$children;

        const length = children.length;
        for (let idx = 0; idx < length; ++idx) {

            const instance = children[idx];
            if (!instance) {
                continue;
            }

            if (!instance._$addedStage) {
                if (instance.willTrigger(Event.ADDED_TO_STAGE)) {
                    instance.dispatchEvent(new Event(Event.ADDED_TO_STAGE));
                }
                instance._$addedStage = true;
            }

            if (instance instanceof DisplayObjectContainer) {
                instance._$executeAddedToStage();
            }

        }
    }

    /**
     * @param  {DisplayObject} child
     * @param  {boolean} do_event
     * @return {DisplayObject}
     * @private
     */
    _$remove (child, do_event = true)
    {
        child._$transform._$transform();

        // remove
        const children = this._$needsChildren
            ? this._$getChildren()
            : this._$children;

        const depth = this.getChildIndex(child);
        children.splice(depth, 1);

        this._$names.delete(child.name);
        if (do_event) {

            // event
            if (child.willTrigger(Event.REMOVED)) {
                child.dispatchEvent(new Event(Event.REMOVED, true));
            }

            // remove stage event
            if (this._$stage !== null) {
                if (child.willTrigger(Event.REMOVED_FROM_STAGE)) {
                    child.dispatchEvent(new Event(Event.REMOVED_FROM_STAGE));
                }

                if (child instanceof DisplayObjectContainer) {
                    child._$executeRemovedFromStage();
                }
            }

            const cacheStore = Util.$cacheStore();
            cacheStore.setRemoveTimer(child._$instanceId);
            if (child._$loaderInfo && child._$characterId) {
                cacheStore.setRemoveTimer(
                    `${child._$loaderInfo._$id}@${child._$characterId}`
                );
            }

            // reset params
            if (child instanceof DisplayObjectContainer) {

                if (Util.$rendererWorker && this._$stage) {

                    Util.$rendererWorker.postMessage({
                        "command": "remove",
                        "instanceId": child._$instanceId
                    });

                    const childrenIds = Util.$getArray();
                    for (let idx = 0; idx < children.length; ++idx) {
                        childrenIds.push(children[idx]._$instanceId);
                    }

                    Util.$rendererWorker.postMessage({
                        "command": "setChildren",
                        "instanceId": this._$instanceId,
                        "children": childrenIds
                    });

                    Util.$poolArray(childrenIds);
                }
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
            this._$doChanged();

        }

        return child;
    }

    /**
     * @return {void}
     * @private
     */
    _$executeRemovedFromStage ()
    {
        const children = this._$getChildren().slice(0);
        const length   = children.length;
        for (let idx = 0; idx < length; ++idx) {

            const instance = children[idx];
            if (!instance) {
                continue;
            }

            if (instance._$addedStage) {
                if (instance.willTrigger(Event.REMOVED_FROM_STAGE)) {
                    instance.dispatchEvent(new Event(Event.REMOVED_FROM_STAGE));
                }
                instance._$addedStage = false;
            }

            if (instance instanceof DisplayObjectContainer) {
                instance._$executeRemovedFromStage();
            }

        }
    }

    /**
     * @return {void}
     * @private
     */
    _$removeParentAndStage ()
    {
        const children = this._$needsChildren
            ? this._$getChildren()
            : this._$children;

        const cacheStore = Util.$cacheStore();
        const length = children.length;
        for (let idx = 0; idx < length; ++idx) {

            const instance = children[idx];

            cacheStore.setRemoveTimer(instance._$instanceId);
            if (instance._$loaderInfo && instance._$characterId) {
                cacheStore.setRemoveTimer(
                    `${instance._$loaderInfo._$id}@${instance._$characterId}`
                );
            }

            if (Util.$rendererWorker && this._$stage) {
                Util.$rendererWorker.postMessage({
                    "command": "remove",
                    "instanceId": instance._$instanceId
                });
            }

            if (instance instanceof DisplayObjectContainer) {
                instance._$removeParentAndStage();
            }

            instance._$stage      = null;
            instance._$root       = null;
            instance._$addedStage = false;
        }

        if (this._$sounds) {
            const values = this._$sounds.values();
            for (const sounds of values) {
                for (let idx = 0; idx < sounds.length; ++idx) {
                    const sound = sounds[idx];
                    sound.stop();
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
    _$prepareActions ()
    {
        const children = this._$needsChildren
            ? this._$getChildren()
            : this._$children;

        for (let idx = children.length - 1; idx > -1; --idx) {
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
    _$nextFrame ()
    {
        let isNext = false;

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

        // added event
        this._$executeAddedEvent();

        this._$isNext = isNext;

        if (!this._$posted && Util.$rendererWorker) {
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
    _$clip (context, matrix)
    {
        let multiMatrix = matrix;

        const rawMatrix = this._$transform._$rawMatrix();
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        if (this._$graphics && this._$graphics._$getBounds()) {
            this._$graphics._$clip(context, multiMatrix);
        }

        const children = this._$getChildren();
        const length   = children.length;
        for (let idx = 0; idx < length; ++idx) {

            const instance = children[idx];

            // mask instance
            if (instance._$isMask) {
                continue;
            }

            instance._$clip(context, multiMatrix);
            instance._$updated = false;

        }

        if (multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @return {object}
     * @private
     */
    _$preDraw (context, matrix)
    {
        const originMatrix = this._$transform._$rawMatrix();
        const tMatrix = Util.$multiplicationMatrix(matrix, originMatrix);

        // size zero
        if (!tMatrix[0] && !tMatrix[1] || !tMatrix[2] && !tMatrix[3]) {
            return false;
        }

        // return object
        const object = Util.$getPreObject();

        // setup
        object.matrix = tMatrix;

        // check
        const filters   = this._$filters   || this.filters;
        const blendMode = this._$blendMode || this.blendMode;
        if (filters.length > 0 || blendMode !== BlendMode.NORMAL) {

            // check size
            const baseBounds = this._$getBounds(null);
            const bounds = Util.$boundsMatrix(baseBounds, tMatrix);
            const xMax   = +bounds.xMax;
            const xMin   = +bounds.xMin;
            const yMax   = +bounds.yMax;
            const yMin   = +bounds.yMin;

            // pool
            Util.$poolBoundsObject(baseBounds);
            Util.$poolBoundsObject(bounds);

            const width  = $Math.abs(xMax - xMin);
            const height = $Math.abs(yMax - yMin);
            if (0 >= width || 0 >= height) {
                return false;
            }

            if (0 > xMin + width || 0 > yMin + height) {
                return false;
            }

            const currentAttachment = context
                .frameBuffer
                .currentAttachment;

            if (xMin > currentAttachment.width
                || yMin > currentAttachment.height
            ) {
                return false;
            }

            // set origin position
            object.basePosition.x = originMatrix[4];
            object.basePosition.y = originMatrix[5];

            // check after size
            let baseLayerBounds = this._$getLayerBounds(null);
            const layerBounds = Util.$boundsMatrix(baseLayerBounds, tMatrix);

            // filter size
            let layerWidth  = $Math.abs(layerBounds.xMax - layerBounds.xMin);
            let layerHeight = $Math.abs(layerBounds.yMax - layerBounds.yMin);
            Util.$poolBoundsObject(layerBounds);

            if (layerWidth === width && layerHeight === height) {
                Util.$poolBoundsObject(baseLayerBounds);
                baseLayerBounds = null;
            }

            // move size
            let tx = tMatrix[4] - $Math.floor(xMin);
            let ty = tMatrix[5] - $Math.floor(yMin);

            let moveBounds = null;
            if (baseLayerBounds) {

                const layerMatrix = Util.$getFloat32Array6(
                    tMatrix[0], tMatrix[1], tMatrix[2], tMatrix[3], 0, 0
                );
                moveBounds = Util.$boundsMatrix(baseLayerBounds, layerMatrix);

                // pool
                Util.$poolBoundsObject(baseLayerBounds);
                Util.$poolFloat32Array6(layerMatrix);

                tx += -$Math.floor(moveBounds.xMin) - tx;
                ty += -$Math.floor(moveBounds.yMin) - ty;
            }

            let dx = $Math.floor(xMin);
            let dy = $Math.floor(yMin);
            let originX = xMin;
            let originY = yMin;

            if (moveBounds) {
                dx -= -$Math.floor(moveBounds.xMin) - (tMatrix[4] - dx);
                dy -= -$Math.floor(moveBounds.yMin) - (tMatrix[5] - dy);

                originX -= -moveBounds.xMin - (tMatrix[4] - originX);
                originY -= -moveBounds.yMin - (tMatrix[5] - originY);

                Util.$poolBoundsObject(moveBounds);
            }

            // set position
            object.position.dx = dx > 0 ? dx : 0;
            object.position.dy = dy > 0 ? dy : 0;

            // resize
            if (layerWidth + originX > currentAttachment.texture.width) {
                layerWidth -= layerWidth - currentAttachment.texture.width + originX;
            }

            if (layerHeight + originY > currentAttachment.texture.height) {
                layerHeight -= layerHeight - currentAttachment.texture.height + originY;
            }

            if (0 > dx) {
                tx += dx;
                layerWidth += originX;
            }

            if (0 > dy) {
                ty += dy;
                layerHeight += originY;
            }

            if (0 >= layerWidth || 0 >= layerHeight // size (-)
                || !layerWidth || !layerHeight // NaN or Infinity
            ) {
                Util.$poolPreObject(object);
                return false;
            }

            // start layer
            context._$startLayer(
                Util.$getBoundsObject(originX, 0, originY, 0)
            );

            // check cache
            object.canApply = this._$canApply(filters);
            let updated = this._$isFilterUpdated(
                layerWidth, layerHeight, tMatrix, filters,
                object.canApply, object.basePosition.x, object.basePosition.y
            );

            // current mask cache
            context._$saveCurrentMask();

            if (updated) {
                context._$saveAttachment(
                    $Math.ceil(layerWidth),
                    $Math.ceil(layerHeight),
                    false
                );
            }

            // setup
            object.isFilter    = true;
            object.isUpdated   = updated;
            object.color       = Util.$getFloat32Array8();
            object.baseMatrix  = tMatrix;
            object.filters     = filters;
            object.blendMode   = blendMode;
            object.layerWidth  = layerWidth;
            object.layerHeight = layerHeight;
            object.matrix      = Util.$getFloat32Array6(
                tMatrix[0], tMatrix[1], tMatrix[2], tMatrix[3], tx, ty
            );
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
    _$postDraw (context, matrix, color_transform, object)
    {
        // cache
        const cacheKeys = Util.$getArray(this._$instanceId, "f");

        const cacheStore = Util.$cacheStore();
        const manager = context._$frameBufferManager;

        // cache or new texture
        let texture = null;
        if (object.isUpdated) {

            texture = manager.getTextureFromCurrentAttachment();

            const cacheTexture = cacheStore.get(cacheKeys);
            if (cacheTexture) {
                cacheStore.set(cacheKeys, null);
                manager.releaseTexture(cacheTexture);
            }

        } else {

            texture = cacheStore.get(cacheKeys);

        }

        // blend only
        if (!object.canApply) {
            texture._$offsetX = 0;
            texture._$offsetY = 0;
        }

        // set cache offset
        let offsetX = texture._$offsetX;
        let offsetY = texture._$offsetY;

        // execute filter
        if (object.isUpdated && object.canApply) {

            // cache clear
            let cache = cacheStore.get(cacheKeys);
            if (cache) {

                // reset cache params
                cacheStore.set(cacheKeys, null);
                cache.layerWidth     = 0;
                cache.layerHeight    = 0;
                cache._$offsetX      = 0;
                cache._$offsetY      = 0;
                cache.matrix         = null;
                cache.colorTransform = null;
                manager.releaseTexture(cache);

                cache  = null;
            }

            // apply filter
            const length = object.filters.length;
            if (length) {

                // init
                context._$offsetX = 0;
                context._$offsetY = 0;

                for (let idx = 0; idx < length; ++idx) {
                    texture = object
                        .filters[idx]
                        ._$applyFilter(context, matrix);
                }

                offsetX = context._$offsetX;
                offsetY = context._$offsetY;

                // reset
                context._$offsetX = 0;
                context._$offsetY = 0;

                // set offset
                texture._$offsetX = offsetX;
                texture._$offsetY = offsetY;

            }
        }

        // update cache params
        if (object.isUpdated) {

            texture.filterState = object.canApply;

            // cache texture
            const mat = object.baseMatrix;
            texture.matrix = `${mat[0]}_${mat[1]}_${mat[2]}_${mat[3]}`;

            texture.layerWidth  = object.layerWidth;
            texture.layerHeight = object.layerHeight;
        }

        // cache texture
        cacheStore.set(cacheKeys, texture);
        Util.$poolArray(cacheKeys);

        // set current buffer
        if (object.isUpdated) {
            context._$restoreAttachment();
        }

        // set
        Util.$resetContext(context);

        context._$globalAlpha = Util.$clamp(
            color_transform[3] + color_transform[7] / 255, 0, 1
        );
        context._$globalCompositeOperation = object.blendMode;

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.drawImage(texture,
            -offsetX + object.position.dx,
            -offsetY + object.position.dy,
            texture.width, texture.height,
            color_transform
        );

        // end blend
        context._$endLayer();

        // reset
        context._$restoreCurrentMask();

        // object pool
        Util.$poolFloat32Array8(object.color);
        Util.$poolFloat32Array6(object.matrix);
        Util.$poolFloat32Array6(object.baseMatrix);
        Util.$poolPreObject(object);
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
        // not draw
        if (!this._$visible) {
            return ;
        }

        let multiColor = color_transform;
        const rawColor = this._$transform._$rawColorTransform();
        if (rawColor[0] !== 1 || rawColor[1] !== 1
            || rawColor[2] !== 1 || rawColor[3] !== 1
            || rawColor[4] !== 0 || rawColor[5] !== 0
            || rawColor[6] !== 0 || rawColor[7] !== 0
        ) {
            multiColor = Util.$multiplicationColor(color_transform, rawColor);
        }

        // not draw
        const alpha = Util.$clamp(multiColor[3] + multiColor[7] / 255, 0, 1, 0);
        if (!alpha) {
            return ;
        }

        // not draw
        const children = this._$needsChildren
            ? this._$getChildren()
            : this._$children;

        const length = children.length;
        if (!length && (!this._$graphics || !this._$graphics._$canDraw)) {
            return ;
        }

        // pre data
        const preData = this._$preDraw(context, matrix);
        if (!preData) {
            return ;
        }

        // use cache
        if (preData.isFilter && !preData.isUpdated) {
            this._$postDraw(context, matrix, multiColor, preData);
            return ;
        }

        let preMatrix = preData.matrix;
        const preColorTransform = preData.isFilter ? preData.color : multiColor;

        // if graphics draw
        if (this._$graphics && this._$graphics._$canDraw) {
            this._$graphics._$draw(context, preMatrix, preColorTransform);
        }

        // init clip params
        let shouldClip        = true;
        let clipDepth         = null;
        const clipMatrix      = Util.$getArray();
        const instanceMatrix  = Util.$getArray();
        const clipStack       = Util.$getArray();
        const shouldClips     = Util.$getArray();

        // draw children
        const isLayer  = context._$isLayer;
        const isUpdate = this._$isUpdated();
        for (let idx = 0; idx < length; ++idx) {

            const instance = children[idx];

            if (isUpdate) {
                instance._$placeObject = null;
            }

            // mask instance
            if (instance._$isMask) {
                continue;
            }

            // not layer mode
            const blendMode = instance._$blendMode || instance.blendMode;
            if ((blendMode === BlendMode.ALPHA || blendMode === BlendMode.ERASE)
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

                    if (clipMatrix.length) {
                        Util.$poolFloat32Array6(preMatrix);
                        preMatrix = clipMatrix.pop();
                    }

                }

                // clear
                clipDepth  = clipStack.length ? clipStack.pop() : null;
                shouldClip = shouldClips.pop();
            }

            // mask size 0
            if (!shouldClip) {
                continue;
            }

            // mask start
            if (instance._$clipDepth > 0) {

                context.save();

                if (clipDepth) {
                    clipStack.push(clipDepth);
                }

                shouldClips.push(shouldClip);

                clipDepth  = instance._$clipDepth;
                shouldClip = instance._$shouldClip(preMatrix);
                if (shouldClip) {

                    const adjMatrix = instance._$startClip(context, preMatrix);
                    if (adjMatrix === false) { // fixed
                        shouldClip = false;
                        continue;
                    }

                    if (adjMatrix) {
                        clipMatrix.push(preMatrix);
                        preMatrix = adjMatrix;
                    }

                }

                continue;
            }

            // mask start
            const maskInstance = instance._$mask;
            if (maskInstance) {

                maskInstance._$updated = false;

                let maskMatrix;

                if (this === maskInstance._$parent) {

                    maskMatrix = preMatrix;

                } else {

                    maskMatrix = Util.$MATRIX_ARRAY_IDENTITY;

                    let parent = maskInstance._$parent;
                    while (parent) {

                        maskMatrix = Util.$multiplicationMatrix(
                            parent._$transform._$rawMatrix(),
                            maskMatrix
                        );

                        parent = parent._$parent;
                    }

                    const player = this.stage._$player;
                    const mScale = player._$scale * player._$ratio;
                    const playerMatrix = Util.$getFloat32Array6(
                        mScale, 0, 0, mScale, 0, 0
                    );

                    maskMatrix = Util.$multiplicationMatrix(
                        playerMatrix, maskMatrix
                    );
                    Util.$poolFloat32Array6(playerMatrix);

                    if (context._$isLayer) {
                        const currentPosition = context._$getCurrentPosition();
                        maskMatrix[4] -= currentPosition.xMin;
                        maskMatrix[5] -= currentPosition.yMin;
                    }

                    if (context._$cacheCurrentBuffer) {
                        maskMatrix[4] -= context._$cacheCurrentBounds.x;
                        maskMatrix[5] -= context._$cacheCurrentBounds.y;
                    }

                }

                if (!maskInstance._$shouldClip(maskMatrix)) {
                    continue;
                }

                let adjMatrix = maskInstance._$startClip(context, maskMatrix);

                context.save();

                if (adjMatrix === false) { // fixed
                    context.restore();
                    continue;
                }

                if (adjMatrix) {

                    instanceMatrix.push(preMatrix);

                    if (this !== maskInstance._$parent) {
                        const maskTargetParentMatrix = this._$transform._$rawMatrix();
                        adjMatrix[0] = $Math.abs(preMatrix[0]) * $Math.sign(maskTargetParentMatrix[0]);
                        adjMatrix[1] = $Math.abs(preMatrix[1]) * $Math.sign(maskTargetParentMatrix[1]);
                        adjMatrix[2] = $Math.abs(preMatrix[2]) * $Math.sign(maskTargetParentMatrix[2]);
                        adjMatrix[3] = $Math.abs(preMatrix[3]) * $Math.sign(maskTargetParentMatrix[3]);
                        adjMatrix[4] = preMatrix[4] - context._$cacheCurrentBounds.x;
                        adjMatrix[5] = preMatrix[5] - context._$cacheCurrentBounds.y;
                    }

                    preMatrix = adjMatrix;
                }

            }

            instance._$draw(context, preMatrix, preColorTransform);
            instance._$updated = false;

            // mask end
            if (maskInstance) {

                context.restore();

                context._$leaveClip();

                if (instanceMatrix.length) {
                    Util.$poolFloat32Array6(preMatrix);
                    preMatrix = instanceMatrix.pop();
                }

            }

        }

        // end mask
        if (clipDepth) {

            context.restore();

            if (shouldClips.pop()) {
                context._$leaveClip();
            }

        }

        // object pool
        Util.$poolArray(clipMatrix);
        Util.$poolArray(instanceMatrix);
        Util.$poolArray(clipStack);
        Util.$poolArray(shouldClips);

        // filter and blend
        if (preData.isFilter) {
            return this._$postDraw(context, matrix, multiColor, preData);
        }

        Util.$poolFloat32Array6(preMatrix);
        Util.$poolPreObject(preData);
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
    _$mouseHit (context, matrix, options, mouse_children = true)
    {
        let multiMatrix = matrix;
        const rawMatrix = this._$transform._$rawMatrix();
        if (rawMatrix !== Util.$MATRIX_ARRAY_IDENTITY) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        const children = this._$getChildren();

        // mask set
        const clips       = Util.$getArray();
        const targets     = Util.$getArray();
        const clipIndexes = Util.$getMap();

        let length        = children.length;
        let clipDepth     = null;
        let clipIdx       = null;
        for (let idx = 0; idx < length; ++idx) {

            const instance = children[idx];

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
                clipIdx   = null;
                clipDepth = null;
            }

            // clip check on
            if (clipIdx !== null) {
                clipIndexes.set(instance._$instanceId, clipIdx);
            }

            targets.push(instance);

        }

        // setup
        const mouseChildren = $Math.min(this._$mouseChildren, mouse_children);

        let hit      = false;
        const isRoot = this._$root === this;

        length = targets.length;
        for (let idx = 0; idx < length; ++idx) {

            const instance = targets.pop();

            if (instance._$isMask) {
                continue;
            }

            if (isRoot && !(instance instanceof InteractiveObject)) {
                continue;
            }

            // mask target
            if (clipIndexes.has(instance._$instanceId)) {

                const clip = clips[clipIndexes.get(instance._$instanceId)];

                if (!clip._$hit(context, multiMatrix, options, true)) {
                    continue;
                }

            }

            // mask hit test
            const maskInstance = instance._$mask;
            if (maskInstance) {

                if (this === maskInstance._$parent) {

                    if (!maskInstance._$hit(context, multiMatrix, options, true)) {
                        continue;
                    }

                } else {

                    let maskMatrix = Util.$MATRIX_ARRAY_IDENTITY;

                    let parent = maskInstance._$parent;
                    while (parent) {

                        maskMatrix = Util.$multiplicationMatrix(
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

                    if (!instance._$mouseEnabled && !instance._$hitObject) {
                        continue;
                    }

                    if (!Util.$isTouch && !options.pointer) {

                        switch (true) {

                            case instance instanceof TextField:
                                if (instance._$type === TextFieldType.INPUT) {
                                    options.pointer = "text";
                                }
                                break;

                            case instance.buttonMode && instance.useHandCursor:
                                options.pointer = "pointer";
                                break;

                        }

                    }

                    if (!options.hit) {

                        options.hit = !instance._$mouseEnabled && instance._$hitObject
                            ? instance._$hitObject
                            : instance;

                    }

                    return true;
                }

            }

        }

        // pool
        Util.$poolArray(clips);
        Util.$poolArray(targets);
        Util.$poolMap(clipIndexes);

        // graphics
        if (!hit && this._$graphics) {
            hit = this._$graphics._$hit(context, multiMatrix, options);
        }

        if (multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
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
    _$hit (context, matrix, options, is_clip = false)
    {

        let multiMatrix = matrix;
        const rawMatrix = this._$transform._$rawMatrix();
        if (rawMatrix !== Util.$MATRIX_ARRAY_IDENTITY) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        const children = this._$getChildren();

        const length = children.length - 1;
        for (let idx = length; idx > -1; --idx) {

            const instance = children[idx];
            if (instance._$isMask) {
                continue;
            }

            if (instance._$hit(context, multiMatrix, options, is_clip)) {
                return true;
            }

        }

        let hit = false;
        if (this._$graphics) {
            hit = this._$graphics._$hit(context, multiMatrix, options);
        }

        if (multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }

        return hit;
    }

    /**
     * @param  {number} index
     * @return {DisplayObject}
     * @method
     * @private
     */
    _$createInstance (index)
    {
        // build
        const tag        = this._$dictionary[index];
        const loaderInfo = this._$loaderInfo;
        const character  = loaderInfo._$data.characters[tag.characterId];

        // symbol class
        if (!character.class) {
            character.class = character.symbol
                ? Util.$getClass(character.symbol) || Util.$getClass(character.extends)
                : Util.$getClass(character.extends);
        }

        Util.$currentLoaderInfo = null;
        const instance = new character.class();
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
    _$outCheck (x, y)
    {
        let matrix = Util.$MATRIX_ARRAY_IDENTITY;
        let parent = this._$parent;
        while (parent) {

            matrix = Util.$multiplicationMatrix(
                parent._$transform._$rawMatrix(),
                matrix
            );

            parent = parent._$parent;
        }

        Util.$hitContext.setTransform(1, 0, 0, 1, 0, 0);
        Util.$hitContext.beginPath();

        return this._$mouseHit(Util.$hitContext, matrix, { "x": x, "y": y });
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$createWorkerInstance ()
    {
        const options = Util.$getArray();
        const message = {
            "command": "createDisplayObjectContainer",
            "instanceId": this._$instanceId
        };

        const graphics = this._$graphics;
        if (graphics) {

            const recodes = graphics._$getRecodes();

            if (recodes.length
                && graphics._$maxAlpha > 1
                && graphics._$canDraw
            ) {
                message.recodes = recodes;
                message.xMin    = graphics._$xMin;
                message.yMin    = graphics._$yMin;
                message.xMax    = graphics._$xMax;
                message.yMax    = graphics._$yMax;
                options.push(recodes.buffer);
            }
        }

        Util.$rendererWorker.postMessage(message, options);
    }

    /**
     * @return {object}
     * @method
     * @private
     */
    _$postProperty ()
    {
        const options = Util.$getArray();
        const message = super._$postProperty();

        const graphics = this._$graphics;
        if (graphics && !graphics._$buffer) {

            message.maxAlpha = graphics._$maxAlpha;
            message.canDraw  = graphics._$canDraw;

            const recodes = graphics._$getRecodes();
            message.recodes = recodes;
            options.push(recodes.buffer);

            const bounds = this._$getBounds();
            message.xMin = bounds.xMin;
            message.yMin = bounds.yMin;
            message.xMax = bounds.xMax;
            message.yMax = bounds.yMax;
        }

        Util
            .$rendererWorker
            .postMessage(message, options);

        Util.$poolArray(options);
    }
}
