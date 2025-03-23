import type { Shape } from "../../Shape";
import { $cacheStore } from "@next2d/cache";
import { execute as displayObjectApplyChangesService } from "../../DisplayObject/service/DisplayObjectApplyChangesService";

/**
 * @description BitmapBufferの設定をクリア
 *              Clear the BitmapBuffer settings
 *
 * @param  {Shape} shape
 * @return {void}
 * @method
 * @protected
 */
export const execute = (shape: Shape): void =>
{
    shape.isBitmap      = false;
    shape.$bitmapBuffer = null;

    // graphics clear
    shape.graphics.clear();

    // cache clear
    if (shape.uniqueKey !== "" && $cacheStore.has(shape.uniqueKey)) {
        $cacheStore.removeById(shape.uniqueKey);
        $cacheStore.$removeIds.push(+shape.uniqueKey);
    }

    // apply changes
    displayObjectApplyChangesService(shape);
};