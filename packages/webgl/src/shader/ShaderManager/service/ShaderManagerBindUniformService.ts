import type { IUniformData } from "../../../interface/IUniformData";

/**
 * @description uniform変数をバインドします。
 *              Bind uniform variables.
 * 
 * @param  {Map} uniform_map
 * @return {void}
 * @method
 * @protected
 */
export const execute = (uniform_map: Map<string, IUniformData>): void =>
{
    for (const data of uniform_map.values()) {

        if (data.method === undefined || data.assign === undefined) {
            continue;
        }

        if (data.assign < 0) {

            data.method(data.array);

        } else if (data.assign > 0) {

            data.assign--;
            data.method(data.array);

        }
    }
};