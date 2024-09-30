import {
    $getIndexBufferData,
    $setIndexBufferData,
    $getIndexBufferPosition
} from "../../Mesh";

/**
 * @description インデックスバッファのサイズを拡張する
 *              Expand the size of the index buffer
 *
 * @param {number} delta_length
 * @method
 * @protected
 */
export const execute = (delta_length: number): void =>
{
    const indexBufferData = $getIndexBufferData();
    if ($getIndexBufferPosition() + delta_length > indexBufferData.length) {
        const biggerBuffer = new Int16Array(indexBufferData.length * 2);
        biggerBuffer.set(indexBufferData);
        $setIndexBufferData(biggerBuffer);
    }
};