import type { Shape } from "../../Shape";
import type { IShapeCharacter } from "../../interface/IShapeCharacter";
import type { LoaderInfo } from "../../LoaderInfo";
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
    const graphics = shape.graphics;

    const width  = Math.ceil(Math.abs(character.bounds.xMax - character.bounds.xMin));
    const height = Math.ceil(Math.abs(character.bounds.yMax - character.bounds.yMin));

    switch (true) {

        case character.bitmapId > 0:
            {
                const loaderInfo = shape.loaderInfo as NonNullable<LoaderInfo>;
                const bitmap = loaderInfo.data?.characters[character.bitmapId] as IShapeCharacter;
                if (!bitmap) {
                    break;
                }

                if (!bitmap.imageBuffer) {
                    bitmap.imageBuffer = new Uint8Array(bitmap.buffer as number[]);
                    bitmap.buffer = null;
                }

                const bitmapWidth  = Math.ceil(Math.abs(bitmap.bounds.xMax - bitmap.bounds.xMin));
                const bitmapHeight = Math.ceil(Math.abs(bitmap.bounds.yMax - bitmap.bounds.yMin));

                if (width === bitmapWidth && height === bitmapHeight) {
                    shape.setBitmapBuffer(
                        Math.ceil(Math.abs(bitmap.bounds.xMax - bitmap.bounds.xMin)),
                        Math.ceil(Math.abs(bitmap.bounds.yMax - bitmap.bounds.yMin)),
                        bitmap.imageBuffer
                    );
                } else {
                    console.log("bitmap: ", bitmap);
                }

            }
            break;

        case character.inBitmap:
            {
                const recodes = character.recodes as any[];
                const bitmap  = recodes[recodes.length - 4];
                if (width === bitmap.width && height === bitmap.height) {
                    shape.setBitmapBuffer(
                        bitmap.width,
                        bitmap.height,
                        bitmap.buffer
                    );
                } else {
                    console.log("inBitmap: ", bitmap, character);
                }
            }
            break;

        case "buffer" in character:
            if (!character.imageBuffer) {
                character.imageBuffer = new Uint8Array(character.buffer as number[]);
                character.buffer = null;
            }

            shape.setBitmapBuffer(
                Math.ceil(Math.abs(graphics.xMax - graphics.xMin)),
                Math.ceil(Math.abs(graphics.yMax - graphics.yMin)),
                character.imageBuffer
            );
            break;

        default:
            if (character.recodes) {
                character.recodeBuffer = new Float32Array(
                    graphicsToNumberArrayService(width, height, character.recodes)
                );
                $poolArray(character.recodes);
                character.recodes = null;
            }

            if (!character.recodeBuffer) {
                break;
            }

            graphics.buffer = character.recodeBuffer;
            break;
    }

    // fixed logic
    graphics.xMin = character.bounds.xMin;
    graphics.xMax = character.bounds.xMax;
    graphics.yMin = character.bounds.yMin;
    graphics.yMax = character.bounds.yMax;
};