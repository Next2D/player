/**
 * @description 使用済みになったMapオブジェクトをプール
 *              Pool Map objects that are no longer in use.
 *
 * @type {Map[]}
 * @const
 * @static
 */
export const $maps: Map<string, any>[] = [];

/**
 * @description Mapオブジェクトをプール
 *              Pool Map object.
 *
 * @param  {Map} map
 * @return void
 * @method
 * @static
 */
export const $poolMap = (map: Map<string, any>): void =>
{
    if (map.size) {
        map.clear();
    }
    $maps.push(map);
};

/**
 * @description プールしたMapオブジェクト、もしくは新規のMapを返却
 *              Returns a pooled Map object or a new Map.
 *
 * @return {Map}
 * @method
 * @static
 */
export const $getMap = (): Map<string, any> =>
{
    return $maps.pop() || new Map();
};