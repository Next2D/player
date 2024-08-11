import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import type { IMovieClipCharacter } from "../../interface/IMovieClipCharacter";
import type { MovieClip } from "../../MovieClip";
import { execute as movieClipBuildDictionaryCharacterUseCase } from "../usecase/MovieClipBuildDictionaryCharacterUseCase";

/**
 * @description MovieClipの現在のフレームに設置されている子要素の取得
 *              Get the child elements placed on the current frame of MovieClip
 *
 * @param  {MovieClip} movie_clip
 * @param  {DisplayObject[]} children
 * @return {DisplayObject[]}
 * @method
 * @public
 */
export const execute = <D extends DisplayObject>(
    movie_clip: MovieClip,
    children: D[]
): D[] => {

    const loaderInfo = movie_clip.loaderInfo;
    if (!loaderInfo || !loaderInfo.data) {
        return children;
    }

    const character = loaderInfo.data.characters[movie_clip.characterId] as IMovieClipCharacter;
    if (!character) {
        return children;
    }

    const frame = movie_clip.currentFrame;

    const controller: number[] = character.controller[frame];
    if (!controller) {
        return children;
    }

    const dictionary = character.dictionary;
    for (let idx: number = 0; idx < controller.length; ++idx) {

        if (!(idx in controller)) {
            continue;
        }
        
        const dictionaryId = controller[idx];
        if (typeof dictionaryId !== "number") {
            continue;
        }
        
        const tag = dictionary[dictionaryId];
        if (!tag) {
            continue;
        }

        const character = loaderInfo.data.characters[tag.characterId];
        if (!character || !character) {
            continue;
        }

        const displayObject = movieClipBuildDictionaryCharacterUseCase(tag, character, movie_clip, idx);
        if (!displayObject) {
            continue
        }

        children.push(displayObject);
    }
    

    return children;

    if (this._$needsChildren) {

        // set flag
        this._$needsChildren = false;

        const currentChildren: D[] = this._$children;


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

                    continue;
                }

                poolInstances.set(instance._$id, instance);

                continue;
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
            }
        }

        // update
        currentChildren.length = 0;
        currentChildren.push(...children);
        $poolArray(children);
    }

    return this._$children;
};