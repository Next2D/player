import {
    $currentPath,
    $vertices
} from "../../PathCommand";

/**
 * @description 現在操作中のパス配列を全てverticesに統合します
 *              Integrate all path arrays currently being operated into vertices
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    if ($currentPath.length < 11) {
        $currentPath.length = 0;
        return ;
    }

    $vertices.push($currentPath.slice(0));
    $currentPath.length = 0;
};