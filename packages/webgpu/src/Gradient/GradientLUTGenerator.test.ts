import { describe, it, expect } from "vitest";
import {
    getAdaptiveResolution,
    generateGradientLUT,
    generateFilterGradientLUT
} from "./GradientLUTGenerator";

describe("GradientLUTGenerator", () =>
{
    describe("getAdaptiveResolution", () =>
    {
        it("should return 256 for 1-4 stops", () =>
        {
            expect(getAdaptiveResolution(1)).toBe(256);
            expect(getAdaptiveResolution(2)).toBe(256);
            expect(getAdaptiveResolution(3)).toBe(256);
            expect(getAdaptiveResolution(4)).toBe(256);
        });

        it("should return 512 for 5-8 stops", () =>
        {
            expect(getAdaptiveResolution(5)).toBe(512);
            expect(getAdaptiveResolution(6)).toBe(512);
            expect(getAdaptiveResolution(7)).toBe(512);
            expect(getAdaptiveResolution(8)).toBe(512);
        });

        it("should return 1024 for 9+ stops", () =>
        {
            expect(getAdaptiveResolution(9)).toBe(1024);
            expect(getAdaptiveResolution(10)).toBe(1024);
            expect(getAdaptiveResolution(20)).toBe(1024);
        });
    });

    describe("generateGradientLUT", () =>
    {
        it("should generate correct size LUT", () =>
        {
            // 2 stops = 10 values (offset, R, G, B, A for each)
            const stops = [0, 255, 0, 0, 255, 1, 0, 0, 255, 255]; // red to blue
            const result = generateGradientLUT(stops, 0, 1);

            // 2 stops -> resolution 256, RGBA = 256 * 4
            expect(result.length).toBe(256 * 4);
        });

        it("should have correct start color", () =>
        {
            // Red at start, blue at end
            const stops = [0, 255, 0, 0, 255, 1, 0, 0, 255, 255];
            const result = generateGradientLUT(stops, 0, 1);

            // First pixel should be red
            expect(result[0]).toBe(255); // R
            expect(result[1]).toBe(0);   // G
            expect(result[2]).toBe(0);   // B
            expect(result[3]).toBe(255); // A
        });

        it("should have correct end color", () =>
        {
            // Red at start, blue at end
            const stops = [0, 255, 0, 0, 255, 1, 0, 0, 255, 255];
            const result = generateGradientLUT(stops, 0, 1);

            // Last pixel should be blue
            const lastOffset = (256 - 1) * 4;
            expect(result[lastOffset + 0]).toBe(0);   // R
            expect(result[lastOffset + 1]).toBe(0);   // G
            expect(result[lastOffset + 2]).toBe(255); // B
            expect(result[lastOffset + 3]).toBe(255); // A
        });

        it("should interpolate colors in RGB mode", () =>
        {
            // Black at start, white at end
            const stops = [0, 0, 0, 0, 255, 1, 255, 255, 255, 255];
            const result = generateGradientLUT(stops, 0, 1); // RGB mode

            // Middle pixel should be around 127-128
            const midOffset = 128 * 4;
            expect(result[midOffset]).toBeGreaterThan(120);
            expect(result[midOffset]).toBeLessThan(135);
        });

        it("should handle single stop", () =>
        {
            // Single red stop
            const stops = [0.5, 255, 0, 0, 255];
            const result = generateGradientLUT(stops, 0, 1);

            expect(result.length).toBe(256 * 4);
            // Should be all red
            expect(result[0]).toBe(255);
            expect(result[1]).toBe(0);
            expect(result[2]).toBe(0);
        });

        it("should handle three stops", () =>
        {
            // Red -> Green -> Blue
            const stops = [
                0, 255, 0, 0, 255,     // Red at 0
                0.5, 0, 255, 0, 255,   // Green at 0.5
                1, 0, 0, 255, 255      // Blue at 1
            ];
            const result = generateGradientLUT(stops, 0, 1);

            // Start should be red
            expect(result[0]).toBe(255);
            expect(result[1]).toBe(0);
            expect(result[2]).toBe(0);

            // End should be blue
            const lastOffset = (256 - 1) * 4;
            expect(result[lastOffset]).toBe(0);
            expect(result[lastOffset + 1]).toBe(0);
            expect(result[lastOffset + 2]).toBe(255);
        });
    });

    describe("generateFilterGradientLUT", () =>
    {
        it("should generate 256x4 bytes LUT", () =>
        {
            const ratios = new Float32Array([0, 255]);
            const colors = new Float32Array([0xFF0000, 0x0000FF]); // Red, Blue
            const alphas = new Float32Array([1, 1]);

            const result = generateFilterGradientLUT(ratios, colors, alphas);

            expect(result.length).toBe(256 * 4);
        });

        it("should have correct start color with alpha", () =>
        {
            const ratios = new Float32Array([0, 255]);
            const colors = new Float32Array([0xFF0000, 0x0000FF]); // Red, Blue
            const alphas = new Float32Array([1, 1]);

            const result = generateFilterGradientLUT(ratios, colors, alphas);

            // First pixel: red with full alpha (premultiplied)
            expect(result[0]).toBe(255); // R * A
            expect(result[1]).toBe(0);   // G * A
            expect(result[2]).toBe(0);   // B * A
            expect(result[3]).toBe(255); // A
        });

        it("should apply premultiplied alpha", () =>
        {
            const ratios = new Float32Array([0, 255]);
            const colors = new Float32Array([0xFF0000, 0xFF0000]); // Red
            const alphas = new Float32Array([0.5, 0.5]);

            const result = generateFilterGradientLUT(ratios, colors, alphas);

            // Red with 0.5 alpha (premultiplied)
            expect(result[0]).toBe(128); // R * 0.5 = 127.5 -> 128
            expect(result[1]).toBe(0);
            expect(result[2]).toBe(0);
            expect(result[3]).toBe(128); // A * 255 = 127.5 -> 128
        });

        it("should interpolate between stops", () =>
        {
            const ratios = new Float32Array([0, 128, 255]);
            const colors = new Float32Array([0xFF0000, 0x00FF00, 0x0000FF]);
            const alphas = new Float32Array([1, 1, 1]);

            const result = generateFilterGradientLUT(ratios, colors, alphas);

            // Should have different colors at different positions
            expect(result[0]).toBe(255); // Red at start
            expect(result[255 * 4 + 2]).toBe(255); // Blue at end
        });
    });

    // 画素ごとにストップを先頭から検索する、元の方法。結果が変わっていないことを確かめる基準にする。
    // The original per-texel search, kept as the reference the generator must still match.
    describe("equivalence with the per-texel search", () =>
    {
        const referenceColor = (stops: number[], t: number, interpolation: number): number[] =>
        {
            const stopsLength = stops.length / 5;

            let startIdx = 0;
            let endIdx = -1;
            for (let i = 0; i < stopsLength; i++) {
                const offset = stops[i * 5];
                if (offset <= t) {
                    startIdx = i;
                }
                if (offset >= t && endIdx === -1) {
                    endIdx = i;
                    break;
                }
            }
            if (endIdx === -1) {
                endIdx = stopsLength - 1;
            }

            const s = startIdx * 5;
            const e = endIdx * 5;
            if (startIdx === endIdx) {
                return [stops[s + 1], stops[s + 2], stops[s + 3], stops[s + 4]];
            }

            const localT = (t - stops[s]) / (stops[e] - stops[s]);
            const lerp = (a: number, b: number): number => a + (b - a) * localT;
            if (interpolation === 0) {
                const toLinear = (value: number): number => Math.pow(value / 255, 2.23333333);
                const toSRGB   = (value: number): number => Math.pow(value, 0.45454545) * 255;
                return [
                    toSRGB(lerp(toLinear(stops[s + 1]), toLinear(stops[e + 1]))),
                    toSRGB(lerp(toLinear(stops[s + 2]), toLinear(stops[e + 2]))),
                    toSRGB(lerp(toLinear(stops[s + 3]), toLinear(stops[e + 3]))),
                    lerp(stops[s + 4], stops[e + 4])
                ];
            }
            return [
                lerp(stops[s + 1], stops[e + 1]),
                lerp(stops[s + 2], stops[e + 2]),
                lerp(stops[s + 3], stops[e + 3]),
                lerp(stops[s + 4], stops[e + 4])
            ];
        };

        const reference = (stops: number[], interpolation: number): Uint8Array =>
        {
            const resolution = getAdaptiveResolution(stops.length / 5);
            const data = new Uint8Array(resolution * 4);
            for (let i = 0; i < resolution; i++) {
                const color = referenceColor(stops, i / (resolution - 1), interpolation);
                for (let c = 0; c < 4; c++) {
                    data[i * 4 + c] = Math.round(Math.max(0, Math.min(255, color[c])));
                }
            }
            return data;
        };

        const referenceFilter = (ratios: Float32Array, colors: Float32Array, alphas: Float32Array): Uint8Array =>
        {
            const data = new Uint8Array(256 * 4);
            const length = ratios.length;
            for (let i = 0; i < 256; i++) {
                const t = i / 255;
                let startIdx = 0;
                let endIdx = length - 1;
                for (let j = 0; j < length - 1; j++) {
                    if (ratios[j] / 255 <= t && ratios[j + 1] / 255 >= t) {
                        startIdx = j;
                        endIdx = j + 1;
                        break;
                    }
                }
                const so = ratios[startIdx] / 255;
                const eo = ratios[endIdx] / 255;
                const localT = eo !== so ? (t - so) / (eo - so) : 0;
                const channel = (shift: number): number =>
                {
                    const a = (colors[startIdx] >> shift & 0xFF) / 255;
                    const b = (colors[endIdx] >> shift & 0xFF) / 255;
                    return a + (b - a) * localT;
                };
                const alpha = alphas[startIdx] + (alphas[endIdx] - alphas[startIdx]) * localT;
                data[i * 4]     = Math.round(channel(16) * alpha * 255);
                data[i * 4 + 1] = Math.round(channel(8) * alpha * 255);
                data[i * 4 + 2] = Math.round(channel(0) * alpha * 255);
                data[i * 4 + 3] = Math.round(alpha * 255);
            }
            return data;
        };

        // 再現できる乱数 / A reproducible random sequence
        let seed = 12345;
        const random = (): number =>
        {
            seed = seed * 1103515245 + 12345 & 0x7fffffff;
            return seed / 0x7fffffff;
        };

        // kind 0: 位置が昇順 / 1: 位置がばらばら / 2: 同じ位置を含む、画素の位置と一致する / 3: 範囲外の色
        const randomStops = (count: number, kind: number): number[] =>
        {
            const offsets: number[] = [];
            for (let i = 0; i < count; i++) {
                offsets.push(kind === 2 ? Math.floor(random() * 6) / 5 : random());
            }
            if (kind !== 1) {
                offsets.sort((a, b) => a - b);
            }
            const stops: number[] = [];
            for (let i = 0; i < count; i++) {
                const range = kind === 3 ? 400 : 256;
                const shift = kind === 3 ? -70 : 0;
                stops.push(
                    offsets[i],
                    Math.floor(random() * range) + shift,
                    Math.floor(random() * range) + shift,
                    Math.floor(random() * range) + shift,
                    Math.floor(random() * range) + shift
                );
            }
            return stops;
        };

        it("should match for random gradients in both interpolation modes", () =>
        {
            for (let n = 0; n < 400; n++) {
                const count = 1 + Math.floor(random() * 16);
                const stops = randomStops(count, n % 4);
                for (let interpolation = 0; interpolation < 2; interpolation++) {
                    expect(
                        Array.from(generateGradientLUT(stops, 0, interpolation)),
                        `stops ${JSON.stringify(stops)} interpolation ${interpolation}`
                    ).toEqual(Array.from(reference(stops, interpolation)));
                }
            }
        });

        it("should match when the first stop starts after 0 and the last ends before 1", () =>
        {
            const stops = [0.25, 255, 0, 0, 255, 0.5, 0, 255, 0, 128, 0.75, 0, 0, 255, 0];
            for (let interpolation = 0; interpolation < 2; interpolation++) {
                const result = generateGradientLUT(stops, 0, interpolation);
                expect(Array.from(result)).toEqual(Array.from(reference(stops, interpolation)));
                expect(Array.from(result.subarray(0, 4))).toEqual([255, 0, 0, 255]);
                expect(Array.from(result.subarray(255 * 4))).toEqual([0, 0, 255, 0]);
            }
        });

        it("should return transparent black for no stops", () =>
        {
            const result = generateGradientLUT([], 0, 1);
            expect(result.length).toBe(256 * 4);
            expect(result.every((value) => value === 0)).toBe(true);
        });

        it("should match for random filter gradients", () =>
        {
            for (let n = 0; n < 300; n++) {
                const count = 1 + Math.floor(random() * 16);
                const ratios = new Float32Array(count);
                const colors = new Float32Array(count);
                const alphas = new Float32Array(count);
                for (let i = 0; i < count; i++) {
                    ratios[i] = n % 3 === 2 ? Math.floor(random() * 6) * 51 : Math.floor(random() * 256);
                    colors[i] = Math.floor(random() * 0x1000000);
                    alphas[i] = n % 2 ? random() : 1;
                }
                if (n % 3 !== 1) {
                    ratios.sort();
                }
                expect(
                    Array.from(generateFilterGradientLUT(ratios, colors, alphas)),
                    `ratios ${Array.from(ratios)} colors ${Array.from(colors)}`
                ).toEqual(Array.from(referenceFilter(ratios, colors, alphas)));
            }
        });
    });
});
