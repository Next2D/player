import type { IProgramObject } from "../interface/IProgramObject";

/**
 * @description プログラムIDカウンター
 *              Program ID counter
 *
 * @type {number}
 * @private
 */
let $programId: number = 0;

/**
 * @description WebGPUレンダーパイプラインを作成
 *              Create WebGPU render pipeline
 *
 * @param  {GPUDevice} device
 * @param  {string} vertexShaderSource
 * @param  {string} fragmentShaderSource
 * @param  {GPUVertexBufferLayout[]} [vertexBufferLayouts=[]]
 * @param  {GPUTextureFormat} [colorFormat="rgba8unorm"]
 * @return {IProgramObject}
 * @method
 * @protected
 */
export const $createRenderPipeline = (
    device: GPUDevice,
    vertexShaderSource: string,
    fragmentShaderSource: string,
    vertexBufferLayouts: GPUVertexBufferLayout[] = [],
    colorFormat: GPUTextureFormat = "rgba8unorm"
): IProgramObject =>
{
    // シェーダーモジュールを作成
    // Create shader modules
    const vertexShaderModule = device.createShaderModule({
        "code": vertexShaderSource
    });

    const fragmentShaderModule = device.createShaderModule({
        "code": fragmentShaderSource
    });

    // レンダーパイプラインを作成
    // Create render pipeline
    const renderPipeline = device.createRenderPipeline({
        "layout": "auto",
        "vertex": {
            "module": vertexShaderModule,
            "entryPoint": "main",
            "buffers": vertexBufferLayouts
        },
        "fragment": {
            "module": fragmentShaderModule,
            "entryPoint": "main",
            "targets": [
                {
                    "format": colorFormat,
                    "blend": {
                        "color": {
                            "srcFactor": "src-alpha",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "src-alpha",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }
            ]
        },
        "primitive": {
            "topology": "triangle-list",
            "cullMode": "none"
        }
    });

    return {
        "id": $programId++,
        "resource": renderPipeline
    };
};

/**
 * @description プログラムオブジェクトプール
 *              Program object pool
 *
 * @type {Map<string, IProgramObject>}
 * @protected
 */
export const $programCache: Map<string, IProgramObject> = new Map();

/**
 * @description キャッシュされたプログラムを取得
 *              Get cached program
 *
 * @param  {string} key
 * @return {IProgramObject | null}
 * @method
 * @protected
 */
export const $getCachedProgram = (key: string): IProgramObject | null =>
{
    return $programCache.get(key) || null;
};

/**
 * @description プログラムをキャッシュに保存
 *              Store program in cache
 *
 * @param  {string} key
 * @param  {IProgramObject} program
 * @return {void}
 * @method
 * @protected
 */
export const $setCachedProgram = (key: string, program: IProgramObject): void =>
{
    $programCache.set(key, program);
};

/**
 * @description プログラムキャッシュをクリア
 *              Clear program cache
 *
 * @return {void}
 * @method
 * @protected
 */
export const $clearProgramCache = (): void =>
{
    $programCache.clear();
};

/**
 * @description 基本的な2Dレンダリング用のバーテックスバッファレイアウトを取得
 *              Get basic vertex buffer layout for 2D rendering
 *
 * @return {GPUVertexBufferLayout[]}
 * @method
 * @protected
 */
export const $getBasicVertexBufferLayout = (): GPUVertexBufferLayout[] =>
{
    return [
        {
            "arrayStride": 2 * 4, // 2 floats × 4 bytes
            "attributes": [
                {
                    "format": "float32x2",
                    "offset": 0,
                    "shaderLocation": 0
                }
            ]
        }
    ];
};

/**
 * @description インスタンス描画用のバーテックスバッファレイアウトを取得
 *              Get vertex buffer layout for instanced rendering
 *
 * @return {GPUVertexBufferLayout[]}
 * @method
 * @protected
 */
export const $getInstancedVertexBufferLayout = (): GPUVertexBufferLayout[] =>
{
    return [
        // Vertex buffer
        {
            "arrayStride": 2 * 4, // 2 floats × 4 bytes
            "attributes": [
                {
                    "format": "float32x2",
                    "offset": 0,
                    "shaderLocation": 0
                }
            ]
        },
        // Instance buffer
        {
            "arrayStride": 24 * 4, // 24 floats × 4 bytes
            "stepMode": "instance",
            "attributes": [
                // rect (vec4)
                {
                    "format": "float32x4",
                    "offset": 0,
                    "shaderLocation": 1
                },
                // size (vec4)
                {
                    "format": "float32x4",
                    "offset": 4 * 4,
                    "shaderLocation": 2
                },
                // offset (vec2)
                {
                    "format": "float32x2",
                    "offset": 8 * 4,
                    "shaderLocation": 3
                },
                // matrix (vec4)
                {
                    "format": "float32x4",
                    "offset": 10 * 4,
                    "shaderLocation": 4
                },
                // mul (vec4)
                {
                    "format": "float32x4",
                    "offset": 14 * 4,
                    "shaderLocation": 5
                },
                // add (vec4)
                {
                    "format": "float32x4",
                    "offset": 18 * 4,
                    "shaderLocation": 6
                }
            ]
        }
    ];
};