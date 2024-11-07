import type { IDictionaryTag } from "../../interface/IDictionaryTag";
import type { ICharacter } from "../../interface/ICharacter";
import type { IDisplayObject } from "../../interface/IDisplayObject";
import type { IMovieClipCharacter } from "../../interface/IMovieClipCharacter";
import type { IShapeCharacter } from "../../interface/IShapeCharacter";
import type { ITextFieldCharacter } from "../../interface/ITextFieldCharacter";
import type { IVideoCharacter } from "../../interface/IVideoCharacter";
import { MovieClip } from "../../MovieClip";
import { Shape } from "../../Shape";
import { TextField } from "@next2d/text";
import { Video } from "@next2d/media";
import { execute as displayObjectBaseBuildService } from "../../DisplayObject/service/DisplayObjectBaseBuildService";
import { execute as movieClipBuildFromCharacterUseCase } from "../../MovieClip/usecase/MovieClipBuildFromCharacterUseCase";
import { execute as shapeBuildFromCharacterUseCase } from "../../Shape/usecase/ShapeBuildFromCharacterUseCase";
import { execute as textFieldBuildFromCharacterUseCase } from "../../TextField/usecase/TextFieldBuildFromCharacterUseCase";
import { execute as videoBuildFromCharacterUseCase } from "../../Video/usecase/VideoBuildFromCharacterUseCase";

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
export const execute = (
    dictionary_id: number,
    tag: IDictionaryTag,
    character: ICharacter,
    parent: MovieClip,
    placeId: number = -1
): IDisplayObject<any> => {

    switch (character.extends) {

        case MovieClip.namespace:
            {
                const movieClip = new MovieClip();
                displayObjectBaseBuildService(movieClip, dictionary_id, tag, parent, placeId);
                movieClipBuildFromCharacterUseCase(movieClip, character as IMovieClipCharacter);
                return movieClip as IDisplayObject<MovieClip>;
            }

        case Shape.namespace:
            {
                const shape = new Shape();
                displayObjectBaseBuildService(shape, dictionary_id, tag, parent, placeId);
                shapeBuildFromCharacterUseCase(shape, character as IShapeCharacter);
                return shape;
            }

        case TextField.namespace:
            {
                const textField = new TextField();
                displayObjectBaseBuildService(textField, dictionary_id, tag, parent, placeId);
                textFieldBuildFromCharacterUseCase(textField, character as ITextFieldCharacter);
                return textField;
            }

        case Video.namespace:
            {
                const video = new Video();
                displayObjectBaseBuildService(video, dictionary_id, tag, parent, placeId);
                videoBuildFromCharacterUseCase(video, character as IVideoCharacter);
                return video;
            }

        default:
            break;

    }
};