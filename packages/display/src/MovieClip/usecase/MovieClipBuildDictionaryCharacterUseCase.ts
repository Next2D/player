import type { IDictionaryTag } from "../../interface/IDictionaryTag";
import type { ICharacter } from "../../interface/ICharacter";
import type { IDisplayObject } from "../../interface/IDisplayObject";
import { MovieClip } from "../../MovieClip";
import { Shape } from "../../Shape";

/**
 * @description cahracterを元にDisplayObjectを構築
 *              Build DisplayObject based on character
 * 
 * @param  {object} tag 
 * @param  {object} character 
 * @param  {MovieClip} parent 
 * @return {DisplayObject}
 * @method
 * @protected
 */
export const execute = (
    tag: IDictionaryTag,
    character: ICharacter,
    parent: MovieClip,
    placeId: number = -1
): IDisplayObject<any> => {

    switch (character.extends) {

        case MovieClip.namespace:
            {
                const movieClip = new MovieClip();
                movieClip._$build(tag, character, parent);
                movieClip.placeId = placeId;
                return movieClip;
            }

        case Shape.namespace:
            {
                const shape = new Shape();
                shape._$build(tag, character, parent);
                shape.placeId = placeId;
                return shape;
            }

        // case TextField.namespace:
        //     return new TextField();

        // case Video.namespace:
        //     return new Video();

        default:
            break;

    }
};