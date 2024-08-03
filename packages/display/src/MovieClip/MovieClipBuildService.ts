import type { DictionaryTagImpl } from "../interface/DictionaryTagImpl";
import type { ParentImpl } from "../interface/ParentImpl";
import type { MovieClipCharacterImpl } from "../interface/MovieClipCharacterImpl";
import type { DisplayObjectContainer } from "../DisplayObjectContainer";
import { execute as displayObjectBaseBuildService } from "../DisplayObject/DisplayObjectBaseBuildService";
import { execute as movieClipAddActionsService } from "./MovieClipAddActionsService";
import { execute as movieClipAddLabelsService } from "./MovieClipAddLabelsService";
import { execute as movieClipBuildSoundsService } from "./MovieClipBuildSoundsService";

/**
 * @description 指定タグからキャラクターを取得して、MovieClipを構築
 *              Get character from specified tag and build MovieClip
 *
 * @param  {DisplayObjectContainer} display_object
 * @param  {object} tag
 * @param  {DisplayObjectContainer} parent
 * @return {Promise}
 * @method
 * @protected
 */
export const execute = async <T extends DisplayObjectContainer>(
    display_object: T,
    tag: DictionaryTagImpl,
    parent: T
): Promise<void> => {

    const character = displayObjectBaseBuildService(display_object, tag, parent) as MovieClipCharacterImpl;

    display_object._$controller   = character.controller;
    display_object._$dictionary   = character.dictionary;
    display_object._$placeMap     = character.placeMap;
    display_object._$placeObjects = character.placeObjects;

    if (character.actions) {
        if (!display_object._$actions) {
            display_object._$actions = new Map();
        }
        movieClipAddActionsService(display_object._$actions, character.actions);
    }

    if (character.sounds) {
        if (!display_object._$sounds) {
            display_object._$sounds = new Map();
        }
        movieClipBuildSoundsService(display_object, display_object._$sounds, character.sounds);
    }

    if (character.labels) {
        if (!display_object._$labels) {
            display_object._$labels = new Map();
        }
        movieClipAddLabelsService(display_object._$labels, character.labels);
    }

    display_object._$totalFrames = character.totalFrame || 1;
};