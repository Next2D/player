/**
 * @class
 * @memberOf next2d.display
 * @extends  InteractiveObject
 */
class DisplayObjectContainer extends InteractiveObject
{
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
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        /**
         * @type {array}
         * @private
         */
        this._$placeController = Util.$getArray();

        /**
         * @type {array}
         * @private
         */
        this._$placeObjects = Util.$getArray();

        /**
         * @type {array}
         * @private
         */
        this._$controller = Util.$getArray();

        /**
         * @type {array}
         * @private
         */
        this._$dictionary = Util.$getArray();

        /**
         * @type {array}
         * @private
         */
        this._$instances = Util.$getArray();

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
            "get": function (object, name)
            {
                if (object._$names.size
                    && object._$names.has(name)
                ) {
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
    static toString()
    {
        return "[class DisplayObjectContainer]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:DisplayObjectContainer
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:DisplayObjectContainer";
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
     * @default next2d.display:DisplayObjectContainer
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:DisplayObjectContainer";
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
        this._$mouseChildren = mouse_children;
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
        return (this._$needsChildren)
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
        this._$names.set(child.name, child);

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
                this._$names.set(instance.name, instance);
            }

        } else {

            children.push(child);
            this._$names.set(child.name, child);

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

        return (index in children) ? children[index] : null;
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
            throw new ArgumentError(`ArgumentError: getChildIndex: index error: ${index}`);
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

        for (let idx = Util.$min(end_index, numChildren - 1); idx > begin_index; --idx) {
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
     * @return {array}
     * @private
     */
    _$getChildren ()
    {
        if (this._$needsChildren) {

            // set flag
            this._$needsChildren = false;

            if (!this._$instances.length) {
                return this._$children;
            }

            const frame = this._$currentFrame || 1;

            let controller = this._$controller[frame];
            if (controller) {
                if (controller.length) {
                    controller = controller.filter(() => true);
                } else {
                    controller = undefined;
                }
            }

            // first build
            const length = this._$children.length;
            if (!length) {

                if (controller) {

                    // MovieClip
                    const length = controller.length;
                    for (let idx = 0; idx < length; ++idx) {

                        const id = controller[idx];
                        const instance = this._$instances[id];
                        if (!instance || instance._$id !== id) {
                            continue;
                        }

                        this._$children.push(instance);
                        this._$names.set(instance.name, instance);
                    }

                } else {

                    // MovieClip
                    if (frame > 1) {
                        return this._$children;
                    }

                    // Sprite
                    const length = this._$instances.length;
                    for (let idx = 0; idx < length; ++idx) {

                        const instance = this._$instances[idx];
                        if (instance && instance._$startFrame === 1) {
                            this._$children.push(instance);
                            this._$names.set(instance.name, instance);
                        }

                    }

                }

                return this._$children;
            }


            const skipIds = Util.$getMap();

            let depth = 0;
            const children = Util.$getArray();
            for (let idx = 0; idx < length; ++idx) {

                const instance = this._$children[idx];

                if (!instance._$parent
                    || instance._$parent._$instanceId !== this._$instanceId
                ) {
                    continue;
                }

                if (instance._$startFrame <= frame
                    && (instance._$endFrame === 0 || instance._$endFrame > frame)
                ) {

                    instance._$filters   = null;
                    instance._$blendMode = null;

                    if (instance._$id === null || !controller) {
                        children.push(instance);
                        this._$names.set(instance.name, instance);
                        continue;
                    }


                    if (skipIds.has(instance._$id)) {
                        continue;
                    }


                    let id = controller[depth++];
                    skipIds.set(id, 1);

                    if (instance._$id === id) {
                        children.push(instance);
                        this._$names.set(instance.name, instance);
                        continue;
                    }


                    const child = this._$instances[id];
                    if (child && child._$id === id) {
                        children.push(child);
                        this._$names.set(child.name, child);
                    }


                    while (true) {

                        id = controller[depth++];
                        skipIds.set(id, 1);

                        const child = this._$instances[id];
                        if (!child || child._$id !== id) {
                            continue;
                        }

                        children.push(child);
                        this._$names.set(child.name, child);

                        if (instance._$id === id) {
                            break;
                        }

                    }

                    continue;
                }


                // remove event
                instance.dispatchEvent(new Event(Event.REMOVED, true));
                instance.dispatchEvent(new Event(Event.REMOVED_FROM_STAGE, true));

                instance._$added      = false;
                instance._$addedStage = false;
                instance._$active     = false;
                instance._$updated    = true;
                instance._$filters    = null;
                instance._$blendMode  = null;
                instance._$isNext     = true;
                if (instance instanceof DisplayObjectContainer) {
                    instance._$executeRemovedFromStage();
                    instance._$removeParentAndStage();
                }

                this._$createInstance(instance._$dictionaryId);
            }


            if (controller) {

                const length = controller.length;
                for ( ; depth < length; ++depth) {

                    const id = controller[depth];
                    const instance = this._$instances[id];
                    if (!instance || instance._$id !== id) {
                        continue;
                    }

                    children.push(instance);

                    this._$names.set(instance.name, instance);
                }

            }

            Util.$poolMap(skipIds);
            Util.$poolArray(this._$children);

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
        child._$stage        = this._$stage;
        child._$parent       = this;
        child._$loaderInfoId = (this._$fixLoaderInfoId === null)
            ? this._$loaderInfoId
            : this._$fixLoaderInfoId;

        if (this.constructor !== Stage) {
            child._$root = this._$root;
        }


        // setup
        if (child instanceof DisplayObjectContainer) {
            child._$setParentAndStage();
            child._$wait = true;
        }


        // add
        this._$instances.push(child);


        // added event
        if (!child._$added) {
            child.dispatchEvent(new Event(Event.ADDED, true));
            child._$added = true;
        }


        if (this._$stage !== null && !child._$addedStage) {

            child.dispatchEvent(new Event(Event.ADDED_TO_STAGE));
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
        const length = this._$instances.length;
        for (let idx = 0; idx < length; ++idx) {

            const instance = this._$instances[idx];
            if (!instance) {
                continue;
            }

            instance._$stage        = this._$stage;
            instance._$root         = this._$root;
            instance._$loaderInfoId = (this._$fixLoaderInfoId === null)
                ? this._$loaderInfoId
                : this._$fixLoaderInfoId;

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
        const children = this._$getChildren();
        const length   = children.length;
        for (let idx = 0; idx < length; ++idx) {

            const instance = children[idx];
            if (!instance) {
                continue;
            }

            if (!instance._$addedStage) {
                instance.dispatchEvent(new Event(Event.ADDED_TO_STAGE));
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
        const children = this._$getChildren();
        const depth = this.getChildIndex(child);
        children.splice(depth, 1);


        this._$names.delete(child.name);
        const index = this._$instances.indexOf(child);
        if (child._$id === null) {

            if ((this._$instances.length - 1) === index) {

                this._$instances.pop();

            } else {

                this._$instances.splice(index, 1);

            }

        } else {

            this._$instances[index] = null;

        }

        if (do_event) {

            // event
            child.dispatchEvent(new Event(Event.REMOVED, true));

            // remove stage event
            if (this._$stage !== null) {

                child.dispatchEvent(new Event(Event.REMOVED_FROM_STAGE));

                if (child instanceof DisplayObjectContainer) {
                    child._$executeRemovedFromStage();
                }
            }

            // reset params
            if (child instanceof DisplayObjectContainer) {
                child._$removeParentAndStage();
            }

            // reset
            child._$stage        = null;
            child._$parent       = null;
            child._$root         = null;
            child._$loaderInfoId = null;
            child._$active       = false;
            child._$wait         = true;
            child._$updated      = true;
            child._$added        = false;
            child._$addedStage   = false;
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
                instance.dispatchEvent(new Event(Event.REMOVED_FROM_STAGE));
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
        const length = this._$instances.length;
        for (let idx = 0; idx < length; ++idx) {

            const instance = this._$instances[idx];

            if (!instance) {
                continue;
            }

            if (instance instanceof DisplayObjectContainer) {
                instance._$removeParentAndStage();
            }

            instance._$stage        = null;
            instance._$root         = null;
            instance._$loaderInfoId = null;
            instance._$addedStage   = false;
        }
    }







}