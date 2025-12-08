import { execute as pathCommandEqualsToLastPointService } from "../service/PathCommandEqualsToLastPointService";
import { execute as pathCommandPushPointToCurrentPathService } from "../service/PathCommandPushPointToCurrentPathService";
import { $currentPath } from "../PathCommandState";

/**
 * @description パスを閉じる
 *              Close the path
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    if ($currentPath.length < 7) {
        return ;
    }

    const x: number = +$currentPath[0];
    const y: number = +$currentPath[1];

    if (pathCommandEqualsToLastPointService(x, y)) {
        return;
    }

    pathCommandPushPointToCurrentPathService(x, y, false);
};
