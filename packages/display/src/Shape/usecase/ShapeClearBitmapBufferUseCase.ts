import type { Shape } from "../../Shape";
import { $stage } from "../../Stage";
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
    $stage.$remoceCacheKeys.push(+shape.uniqueKey);
    $cacheStore.removeById(shape.uniqueKey);

    // apply changes
    displayObjectApplyChangesService(shape);
};