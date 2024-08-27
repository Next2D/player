import type { DisplayObject } from "../../DisplayObject";
import type { IDisplayObject } from "../../interface/IDisplayObject";
import type { IMovieClipCharacter } from "../../interface/IMovieClipCharacter";
import type { MovieClip } from "../../MovieClip";
import { execute as movieClipBuildDictionaryCharacterUseCase } from "../usecase/MovieClipBuildDictionaryCharacterUseCase";
import { $cacheStore } from "@next2d/cache";
import { Event } from "@next2d/events";

/**
 * @description MovieClip の子要素で次のフレームに移動するDisplayObjectの格納マップ
 *              Storage map of DisplayObjects that move to the next frame in the child elements of MovieClip
 * 
 * @type {Map<number, IDisplayObject<any>>}
 * @private
 */
const $stayDisplayObjectMap: Map<number, IDisplayObject<any>> = new Map();

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
    if (!children.length) {

        for (let idx = 0; idx < controller.length; ++idx) {

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
            if (!character) {
                continue;
            }
    
            const displayObject = movieClipBuildDictionaryCharacterUseCase(
                dictionaryId, tag, character, movie_clip, idx
            );

            if (!displayObject) {
                continue
            }
    
            children.push(displayObject);
        }

        return children;
    }
    
    for (let idx = 0; idx < children.length; ++idx) {
        
        const displayObject = children[idx];
        if (!displayObject) {
            continue;
        }

        const startFrame = displayObject.startFrame;
        const endFrame   = displayObject.endFrame;
        if (startFrame === 1 && endFrame === 0
            || startFrame <= frame && endFrame > frame
        ) {
            $stayDisplayObjectMap.set(displayObject.dictionaryId, displayObject);
            continue;
        }

        // remove
        if (displayObject.uniqueKey) {
            // $cacheStore.removeCache(displayObject.uniqueKey);
        }

        if (displayObject.willTrigger(Event.REMOVED)) {
            displayObject.dispatchEvent(
                new Event(Event.REMOVED, true)
            );
        }

        if (displayObject.willTrigger(Event.REMOVED_FROM_STAGE)) {
            displayObject.dispatchEvent(
                new Event(Event.REMOVED_FROM_STAGE, true)
            );
        }

        if (displayObject.isContainerEnabled) {
            // todo
        }

    }

    children.length = 0;
    for (let idx = 0; idx < controller.length; ++idx) {

        if (!(idx in controller)) {
            continue;
        }
        
        const dictionaryId = controller[idx];
        if (typeof dictionaryId !== "number") {
            continue;
        }

        if ($stayDisplayObjectMap.has(dictionaryId)) {
            const displayObject = $stayDisplayObjectMap.get(dictionaryId) as D;
            displayObject.placeId     = idx;
            displayObject.placeObject = null;
            children.push(displayObject);
            continue;
        }

        const tag = dictionary[dictionaryId];
        if (!tag) { 
            continue;
        }

        const character = loaderInfo.data.characters[tag.characterId];
        if (!character) {
            continue;
        }

        const displayObject = movieClipBuildDictionaryCharacterUseCase(
            dictionaryId, tag, character, movie_clip, idx
        );
        if (!displayObject) {
            continue
        }

        children.push(displayObject);
    }

    $stayDisplayObjectMap.clear();
    
    return children;
};