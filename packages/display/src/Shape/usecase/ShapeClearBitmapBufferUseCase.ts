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
    // Main 側のみ wipe する。Worker 側は次回 MISS 描画時に
    // 旧 Node を解放してから新 Node を確保するため、ここで $removeIds.push しない。
    // push してしまうと、Worker が同フレームで作成した新キャッシュを次フレーム冒頭で
    // wipe → その次のフレームで Main HIT → Worker null → 永続無描画 になる。
    if (shape.uniqueKey !== "" && $cacheStore.has(shape.uniqueKey)) {
        $cacheStore.removeById(shape.uniqueKey);
    }

    // apply changes
    displayObjectApplyChangesService(shape);
};