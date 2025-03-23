import type { IDictionaryTag } from "../../interface/IDictionaryTag";
import type { ICharacter } from "../../interface/ICharacter";
import type { IMovieClipCharacter } from "../../interface/IMovieClipCharacter";
import type { IShapeCharacter } from "../../interface/IShapeCharacter";
import type { ITextFieldCharacter } from "../../interface/ITextFieldCharacter";
import type { IVideoCharacter } from "../../interface/IVideoCharacter";
import type { DisplayObject } from "../../DisplayObject";
import { MovieClip } from "../../MovieClip";
import { Shape } from "../../Shape";
import { TextField } from "@next2d/text";
import { Video } from "@next2d/media";
import { execute as displayObjectBaseBuildService } from "../../DisplayObject/service/DisplayObjectBaseBuildService";

/**
 * @description cahracterを元にDisplayObjectを構築
 *              Build DisplayObject based on character
 *
 * @param  {number} dictionary_id
 * @param  {object} tag
 * @param  {object} character
 * @param  {MovieClip} parent
 * @return {DisplayObject}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject> (
    dictionary_id: number,
    tag: IDictionaryTag,
    character: ICharacter,
    parent: MovieClip,
    placeId: number = -1
): D => {

    switch (character.extends) {

        case MovieClip.namespace:
        {
            const movieClip = new MovieClip();
            displayObjectBaseBuildService(movieClip, dictionary_id, tag, parent, placeId);
            movieClip.$sync(character as IMovieClipCharacter);
            return movieClip as unknown as D;
        }

        case Shape.namespace:
        {
            const shape = new Shape();
            displayObjectBaseBuildService(shape, dictionary_id, tag, parent, placeId);
            shape.$sync(character as IShapeCharacter);
            return shape as unknown as D;
        }

        case TextField.namespace:
        {
            const textField = new TextField();
            displayObjectBaseBuildService(textField, dictionary_id, tag, parent, placeId);
            textField.$sync(character as ITextFieldCharacter);
            return textField as unknown as D;
        }

        case Video.namespace:
        {
            const video = new Video();
            displayObjectBaseBuildService(video, dictionary_id, tag, parent, placeId);
            video.$sync(character as IVideoCharacter);
            return video as unknown as D;
        }

        default:
            throw new Error(`Character extends not found: ${character.extends}`);

    }
};