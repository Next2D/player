import type { Shape } from "../../Shape";
import type { Graphics } from "../../Graphics";
import type { IShapeCharacter } from "../../interface/IShapeCharacter";
import { execute as graphicsToNumberArrayService } from "../../Graphics/service/GraphicsToNumberArrayService";
import { $poolArray } from "../../DisplayObjectUtil";

/**
 * @description characterを元にShapeを構築
 *              Build Shape based on character
 *
 * @param  {Shape} shape
 * @param  {object} character
 * @return {void}
 * @method
 * @protected
 */
export const execute = (shape: Shape, character: IShapeCharacter): void =>
{
    const graphics: Graphics = shape.graphics;

    const width: number  = Math.ceil(Math.abs(character.bounds.xMax - character.bounds.xMin));
    const height: number = Math.ceil(Math.abs(character.bounds.yMax - character.bounds.yMin));

    // fixed logic
    graphics.xMin = character.bounds.xMin;
    graphics.xMax = character.bounds.xMax;
    graphics.yMin = character.bounds.yMin;
    graphics.yMax = character.bounds.yMax;

    if (character.recodes) {

        switch (true) {

            // todo

            default:
                if (!character.recodeBuffer) {
                    character.recodeBuffer = new Float32Array(
                        graphicsToNumberArrayService(width, height, character.recodes)
                    );
                    $poolArray(character.recodes);
                    character.recodes = null;
                }
                graphics.buffer = character.recodeBuffer.slice(0);
                break;

        }
    } else {
        // todo
    }
};