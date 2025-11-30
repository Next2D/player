/**
 * @description グラデーションLUT（Look Up Table）ジェネレーター
 *              Gradient LUT Generator
 */
export class GradientLUTGenerator
{
    private device: GPUDevice;

    /**
     * @param {GPUDevice} device
     * @constructor
     */
    constructor(device: GPUDevice)
    {
        this.device = device;
    }

    /**
     * @description グラデーションLUTテクスチャを生成
     * @param {number[]} stops - [ratio, r, g, b, a, ratio, r, g, b, a, ...]
     * @param {number} interpolation - 0: RGB, 1: Linear RGB
     * @return {GPUTexture}
     */
    generateLUT(stops: number[], interpolation: number): GPUTexture
    {
        const width = 256;
        const height = 1;
        const pixels = new Uint8Array(width * height * 4);

        // ストップポイントを解析
        const gradientStops: Array<{ratio: number, r: number, g: number, b: number, a: number}> = [];
        for (let i = 0; i < stops.length; i += 5) {
            gradientStops.push({
                ratio: stops[i],
                r: stops[i + 1],
                g: stops[i + 2],
                b: stops[i + 3],
                a: stops[i + 4]
            });
        }

        // ストップポイントをratio順にソート
        gradientStops.sort((a, b) => a.ratio - b.ratio);

        // LUTを生成
        for (let x = 0; x < width; x++) {
            const ratio = x / (width - 1);
            
            // 該当する区間を探す
            let startStop = gradientStops[0];
            let endStop = gradientStops[gradientStops.length - 1];
            
            for (let i = 0; i < gradientStops.length - 1; i++) {
                if (ratio >= gradientStops[i].ratio && ratio <= gradientStops[i + 1].ratio) {
                    startStop = gradientStops[i];
                    endStop = gradientStops[i + 1];
                    break;
                }
            }

            // 補間係数を計算
            let t = 0;
            if (endStop.ratio !== startStop.ratio) {
                t = (ratio - startStop.ratio) / (endStop.ratio - startStop.ratio);
            }

            // 色を補間
            let r, g, b, a;
            
            if (interpolation === 1) {
                // Linear RGB補間（ガンマ補正あり）
                const sr = Math.pow(startStop.r, 2.2);
                const sg = Math.pow(startStop.g, 2.2);
                const sb = Math.pow(startStop.b, 2.2);
                const er = Math.pow(endStop.r, 2.2);
                const eg = Math.pow(endStop.g, 2.2);
                const eb = Math.pow(endStop.b, 2.2);
                
                r = Math.pow(sr + (er - sr) * t, 1 / 2.2);
                g = Math.pow(sg + (eg - sg) * t, 1 / 2.2);
                b = Math.pow(sb + (eb - sb) * t, 1 / 2.2);
            } else {
                // 通常のRGB補間
                r = startStop.r + (endStop.r - startStop.r) * t;
                g = startStop.g + (endStop.g - startStop.g) * t;
                b = startStop.b + (endStop.b - startStop.b) * t;
            }
            
            a = startStop.a + (endStop.a - startStop.a) * t;

            // ピクセルデータに設定
            const index = x * 4;
            pixels[index + 0] = Math.round(r * 255);
            pixels[index + 1] = Math.round(g * 255);
            pixels[index + 2] = Math.round(b * 255);
            pixels[index + 3] = Math.round(a * 255);
        }

        // テクスチャを作成
        const texture = this.device.createTexture({
            size: { width, height },
            format: "rgba8unorm",
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
        });

        this.device.queue.writeTexture(
            { texture },
            pixels.buffer,
            { bytesPerRow: width * 4, offset: pixels.byteOffset },
            { width, height }
        );

        return texture;
    }
}
