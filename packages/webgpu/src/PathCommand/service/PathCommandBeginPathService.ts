import {
    $currentPath,
    $vertices,
    $poolArray
} from "../PathCommandState";

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
    $currentPath.length = 0;

    while ($vertices.length) {
        $poolArray($vertices.pop());
    }
};
