/**
 * @description Compute Pipeline Manager
 *              Compute Shaderパイプラインの管理
 *
 * Compute Shaderは並列処理に最適で、フィルター処理を高速化。
 * 特に大きなブラー半径（64+）の場合、20-35%の高速化が期待できる。
 *
 * @class
 */
export class ComputePipelineManager
{
    private device: GPUDevice;
    private pipelines: Map<string, GPUComputePipeline>;
    private bindGroupLayouts: Map<string, GPUBindGroupLayout>;

    /**
     * @constructor
     * @param {GPUDevice} device - WebGPU device
     */
    constructor (device: GPUDevice)
    {
        this.device = device;
        this.pipelines = new Map();
        this.bindGroupLayouts = new Map();

        this.initializeBlurPipelines();
    }

    /**
     * @description ブラー用Compute Pipelineを初期化
     * @private
     */
    private initializeBlurPipelines (): void
    {
        // ブラーCompute Shader用のBindGroupLayoutを作成
        const blurBindGroupLayout = this.device.createBindGroupLayout({
            "label": "blur_compute_bind_group_layout",
            "entries": [
                {
                    // 入力テクスチャ
                    "binding": 0,
                    "visibility": GPUShaderStage.COMPUTE,
                    "texture": {
                        "sampleType": "float"
                    }
                },
                {
                    // 出力テクスチャ（Storage Texture）
                    "binding": 1,
                    "visibility": GPUShaderStage.COMPUTE,
                    "storageTexture": {
                        "access": "write-only",
                        "format": "rgba8unorm"
                    }
                },
                {
                    // パラメータ（方向、ブラー半径など）
                    "binding": 2,
                    "visibility": GPUShaderStage.COMPUTE,
                    "buffer": {
                        "type": "uniform"
                    }
                }
            ]
        });

        this.bindGroupLayouts.set("blur_compute", blurBindGroupLayout);

        // 水平/垂直ブラーパイプラインを作成
        // 同じシェーダーを使用し、方向はuniformで制御
        this.createBlurComputePipeline("blur_compute_horizontal");
        this.createBlurComputePipeline("blur_compute_vertical");
    }

    /**
     * @description ブラーCompute Pipelineを作成
     * @param {string} name - パイプライン名
     * @private
     */
    private createBlurComputePipeline (name: string): void
    {
        const shaderModule = this.device.createShaderModule({
            "label": `${name}_shader`,
            "code": this.getBlurComputeShaderCode()
        });

        const pipelineLayout = this.device.createPipelineLayout({
            "label": `${name}_layout`,
            "bindGroupLayouts": [this.bindGroupLayouts.get("blur_compute")!]
        });

        const pipeline = this.device.createComputePipeline({
            "label": name,
            "layout": pipelineLayout,
            "compute": {
                "module": shaderModule,
                "entryPoint": "main"
            }
        });

        this.pipelines.set(name, pipeline);
    }

    /**
     * @description ブラーCompute Shaderコードを生成
     *              ボックスブラー（均一加重平均）を使用。Fragment Shaderと同一出力。
     * @return {string} WGSLシェーダーコード
     * @private
     */
    private getBlurComputeShaderCode (): string
    {
        return `
struct BlurParams {
    direction: vec2<f32>,  // (1,0) or (0,1)
    radius: f32,           // ブラー半径
    fraction: f32,         // 端ピクセルのブレンド割合
    texSize: vec2<f32>,    // テクスチャサイズ
    samples: f32,          // サンプル数
    padding: f32,          // パディング（16バイトアライメント）
}

@group(0) @binding(0) var inputTexture: texture_2d<f32>;
@group(0) @binding(1) var outputTexture: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(2) var<uniform> params: BlurParams;

const WORKGROUP_SIZE: u32 = 16u;

@compute @workgroup_size(16, 16, 1)
fn main(
    @builtin(global_invocation_id) globalId: vec3<u32>
) {
    let texSize = vec2<u32>(u32(params.texSize.x), u32(params.texSize.y));
    let radius = i32(params.radius);

    let outCoord = globalId.xy;

    if (outCoord.x >= texSize.x || outCoord.y >= texSize.y) {
        return;
    }

    let direction = vec2<i32>(i32(params.direction.x), i32(params.direction.y));
    let samples = params.samples;
    let fraction = params.fraction;

    var color = vec4<f32>(0.0);

    for (var i = -radius; i <= radius; i = i + 1) {
        var sampleCoord = vec2<i32>(outCoord) + direction * i;

        sampleCoord.x = clamp(sampleCoord.x, 0, i32(texSize.x) - 1);
        sampleCoord.y = clamp(sampleCoord.y, 0, i32(texSize.y) - 1);

        let sample = textureLoad(inputTexture, vec2<u32>(sampleCoord), 0);

        // 端ピクセルにfraction重みを適用（Fragment Shaderと同じロジック）
        if (i == -radius || i == radius) {
            color = color + sample * fraction;
        } else {
            color = color + sample;
        }
    }

    color = color / samples;

    textureStore(outputTexture, outCoord, color);
}
`;
    }

    /**
     * @description パイプラインを取得
     * @param {string} name - パイプライン名
     * @return {GPUComputePipeline | undefined}
     */
    getPipeline (name: string): GPUComputePipeline | undefined
    {
        return this.pipelines.get(name);
    }

    /**
     * @description BindGroupLayoutを取得
     * @param {string} name - レイアウト名
     * @return {GPUBindGroupLayout | undefined}
     */
    getBindGroupLayout (name: string): GPUBindGroupLayout | undefined
    {
        return this.bindGroupLayouts.get(name);
    }

    /**
     * @description リソースを破棄
     */
    destroy (): void
    {
        this.pipelines.clear();
        this.bindGroupLayouts.clear();
    }
}
