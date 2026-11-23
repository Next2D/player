import { $poolArray } from "../../WebGLUtil";
import {
    $nativeShape,
    $nativePathActive,
    $setNativePathActive
} from "../../NativeShape";
import {
    $currentPath,
    $vertices
} from "../../PathCommand";

/**
 * @description 現在操作中のパス配列を全てクリアします。
 *              Clear all path arrays currently being operated.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    // 経路を実行環境の側で組み立てていた場合は、そちらを空にする
    if ($nativePathActive && $nativeShape) {
        $setNativePathActive(false);
        $nativeShape.reset();
    }

    $currentPath.length = 0;

    while ($vertices.length) {
        $poolArray($vertices.pop());
    }
};