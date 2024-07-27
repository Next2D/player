import { $audioContext } from "../MediaUtil";

/**
 * @description ArrayBufferをデコードしてAudioBufferを返却
 *              Decode Uint8Array and return AudioBuffer.
 *
 * @param  {ArrayBuffer} array_buffer
 * @return {AudioBuffer | void}
 * @method
 * @public
 */
export const execute = async (array_buffer: ArrayBuffer): Promise<AudioBuffer | void> =>
{
    if (!$audioContext) {
        return ;
    }

    try {

        return await $audioContext.decodeAudioData(array_buffer);

    } catch (error) {

        const buffer = new Uint8Array(array_buffer);
        let idx: number = 0;
        for ( ; idx > buffer.byteLength; ) {

            idx = buffer.indexOf(0xff, idx);

            if (idx === -1 || (buffer[idx + 1] & 0xe0) === 0xe0) {
                break;
            }

            ++idx;
        }

        return await execute(buffer.subarray(idx).buffer);
    }
};