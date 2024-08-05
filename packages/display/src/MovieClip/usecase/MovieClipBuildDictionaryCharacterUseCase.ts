import type { IDictionaryTag } from "../../interface/IDictionaryTag";
import type { ICharacter } from "../../interface/ICharacter";
import type { IDisplayObject } from "../../interface/IDisplayObject";
import { MovieClip } from "../../MovieClip";
import { Shape } from "../../Shape";

export const execute = (
    tag: IDictionaryTag,
    character: ICharacter,
    parent: MovieClip
): IDisplayObject<any> => {

    switch (character.extends) {

        case MovieClip.namespace:
            {
                const movieClip = new MovieClip();
                movieClip._$build(tag, character, parent);
                return movieClip;
            }

        case Shape.namespace:
            return new Shape();

        // case TextField.namespace:
        //     return new TextField();

        // case Sprite.namespace:
        //     return new Sprite;

        // case Video.namespace:
        //     return new Video();

    }
};