import type { IUniformData } from "/packages/webgl/src/interface/IUniformData";

interface IUniformUpload {
    method: NonNullable<IUniformData["method"]>;
    array: Int32Array | Float32Array;
    bits: Uint32Array;
    uploaded: Uint32Array;
}

// Each uniform belongs to one linked program. Compare bits to preserve -0 and NaN payloads.
const $uploads = new WeakMap<IUniformData, IUniformUpload>();

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

            const array = data.array;
            if (array) {
                let upload = $uploads.get(data);
                if (!upload || upload.method !== data.method || upload.array !== array
                    || upload.bits.length !== array.length) {
                    const bits = new Uint32Array(array.buffer, array.byteOffset, array.length);
                    data.method(array);
                    upload = { "method": data.method, array, bits, "uploaded": bits.slice() };
                    $uploads.set(data, upload);
                    continue;
                }
                const { bits, uploaded } = upload;
                let index = 0;
                while (index < bits.length && bits[index] === uploaded[index]) index++;
                if (index === bits.length) continue;
                data.method(array);
                uploaded.set(bits);
                continue;
            }
            $uploads.delete(data);
            data.method(data.array);

        } else if (data.assign > 0) {

            $uploads.delete(data);
            data.assign--;
            data.method(data.array);

        }
    }
};
