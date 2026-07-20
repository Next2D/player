import type { Graphics } from "../../Graphics";
import { $cacheStore } from "@next2d/cache";
import { $graphicMap } from "../../DisplayObjectUtil";
import { execute as displayObjectApplyChangesService } from "../../DisplayObject/service/DisplayObjectApplyChangesService";

/**
 * @description Graphicsを所有するDisplayObjectの描画キャッシュを無効化
 *              Invalidate the drawing cache of the DisplayObject that owns the Graphics
 *
 * @param  {Graphics} graphics
 * @return {void}
 * @method
 * @protected
 */
export const execute = (graphics: Graphics): void =>
{
    const displayObject = $graphicMap.get(graphics);
    if (!displayObject) {
        return ;
    }

    // cache clear
    // Main 側のみ wipe する。Worker 側は次回 MISS 描画時に
    // 旧 Node を解放してから新 Node を確保するため、ここで $removeIds.push しない。
    if (displayObject.uniqueKey !== "" && $cacheStore.has(displayObject.uniqueKey)) {
        $cacheStore.removeById(displayObject.uniqueKey);
    }

    // characterId 由来の uniqueKey は再生成後も同一値になるため、
    // 旧テクスチャを参照したままの $cache も切り離す
    displayObject.uniqueKey = "";
    displayObject.$cache    = null;

    // apply changes
    displayObjectApplyChangesService(displayObject);
};
