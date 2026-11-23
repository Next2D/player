import { beforeEach, describe, expect, it, vi } from "vitest";

// 実行環境が、線の外周の計算 (strokeSize) も持つ __next2dShape を置いている状態を作る
// (モジュールの読み込みより前に置く必要がある)
const fake = vi.hoisted(() =>
{
    const fake = {
        "calls": [] as string[],
        "size": 0,
        "strokeArguments": [] as number[],
        "fillArguments": [] as number[],
        "exported": new Float64Array(0),
        "path": (commands: Float32Array): number =>
        {
            fake.calls.push("path");
            return commands.length;
        },
        "fillSize": (): number =>
        {
            fake.calls.push("fillSize");
            return fake.size;
        },
        "fill": (target: Float32Array, offset: number, ...rest: number[]): number =>
        {
            fake.calls.push("fill");
            fake.fillArguments = [offset, ...rest];
            for (let idx = 0; idx < fake.size; ++idx) {
                target[offset + idx] = 7;
            }
            return fake.size / 17;
        },
        "exportPath": (stroke: boolean): Float64Array =>
        {
            fake.calls.push(`exportPath:${stroke}`);
            return fake.exported;
        },
        "reset": (): void =>
        {
            fake.calls.push("reset");
        },
        "strokeSize": (...rest: number[]): number =>
        {
            fake.calls.push("strokeSize");
            fake.strokeArguments = rest;
            return fake.size;
        }
    };
    (globalThis as unknown as { __next2dShape: unknown }).__next2dShape = fake;
    return fake;
});

import {
    $nativeStroke,
    $nativePathActive,
    $setNativePathActive
} from "./NativeShape";
import {
    $addFillBuffer,
    $clearFillBufferSetting,
    $fillBufferIndexes,
    $fillTypes,
    $getFillBuffer,
    $getFillBufferOffset
} from "./Mesh";
import { $currentPath, $vertices } from "./PathCommand";
import { $gradientData } from "./Gradient";
import { $bitmapData } from "./Bitmap";
import { $setContext, $setViewportSize } from "./WebGLUtil";
import { execute as meshStrokeCurrentPathUseCase } from "./Mesh/usecase/MeshStrokeCurrentPathUseCase";
import { execute as contextStrokeUseCase } from "./Context/usecase/ContextStrokeUseCase";
import { execute as contextGradientStrokeUseCase } from "./Context/usecase/ContextGradientStrokeUseCase";
import { execute as contextBitmapStrokeUseCase } from "./Context/usecase/ContextBitmapStrokeUseCase";

describe("NativeStroke.js test (the runtime provides __next2dShape.strokeSize)", () =>
{
    beforeEach(() =>
    {
        fake.calls.length = 0;
        fake.size = 0;
        fake.strokeArguments = [];
        fake.fillArguments = [];
        fake.exported = new Float64Array(0);
        $setNativePathActive(false);
        $currentPath.length = 0;
        $vertices.length = 0;
        $clearFillBufferSetting();
        $fillTypes.length = 0;
        $fillBufferIndexes.length = 0;
        $gradientData.length = 0;
        $bitmapData.length = 0;
        $setContext({
            "$matrix": new Float32Array([3, 4, 0, 6, 8, 0, 10, 12, 1]),
            "$fillStyle": new Float32Array([1, 1, 1, 1]),
            "$strokeStyle": new Float32Array([0.25, 0.5, 0.75, 1]),
            "thickness": 6,
            "joints": 1,
            "caps": 2
        } as never);
        $setViewportSize(2, 4);
    });

    it("test case - detects the stroke implementation", () =>
    {
        expect($nativeStroke).toBe(true);
    });

    it("test case - stroke builds the outline and the mesh on the runtime side", () =>
    {
        // 先に入っている内容は保たれる
        $addFillBuffer(new Float32Array([1, 2, 3]));

        fake.size = 51 * 3;
        $setNativePathActive(true);
        expect(meshStrokeCurrentPathUseCase()).toBe(9);

        // 経路は取り出さない (JavaScript の側で線を作らない)
        expect(fake.calls).toEqual(["strokeSize", "fill"]);
        expect($nativePathActive).toBe(false);

        // 太さの半分、つなぎ目、端、拡大率 (x 軸 5 と y 軸 10 の大きい方)
        expect(fake.strokeArguments).toEqual([3, 1, 2, 10]);

        // 書き込み位置、行列 (ビューポートの大きさで割った値)、線の色
        expect(fake.fillArguments).toEqual([3, 1.5, 1, 3, 2, 5, 3, 0.25, 0.5, 0.75, 1]);

        expect($getFillBufferOffset()).toBe(3 + fake.size);
        const buffer = $getFillBuffer();
        expect(Array.from(buffer.subarray(0, 4))).toEqual([1, 2, 3, 7]);
        expect(buffer[3 + fake.size - 1]).toBe(7);
    });

    it("test case - nothing to stroke returns -1 and clears the path", () =>
    {
        $setNativePathActive(true);
        expect(meshStrokeCurrentPathUseCase()).toBe(-1);
        expect(fake.calls).toEqual(["strokeSize", "reset"]);
        expect($nativePathActive).toBe(false);
        expect($getFillBufferOffset()).toBe(0);
    });

    it("test case - falls back to JavaScript while the path is not on the runtime side", () =>
    {
        $setContext({
            "$matrix": new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
            "$strokeStyle": new Float32Array([1, 1, 1, 1]),
            "thickness": 2,
            "joints": 2,
            "caps": 0
        } as never);
        $currentPath.push(0, 0, false, 10, 0, false);

        // 直線 1 本: 四角形 (5 点) から三角形が 3 つ
        expect(meshStrokeCurrentPathUseCase()).toBe(9);
        expect(fake.calls).toEqual([]);
        expect($getFillBufferOffset()).toBe(51 * 3);

        // 経路が無ければ -1
        expect(meshStrokeCurrentPathUseCase()).toBe(-1);
    });

    it("test case - the stroke use cases register the mesh as a fill", () =>
    {
        fake.size = 51;

        $setNativePathActive(true);
        contextStrokeUseCase();
        expect($fillTypes).toEqual(["fill"]);
        expect($fillBufferIndexes).toEqual([3]);

        $setNativePathActive(true);
        const matrix = new Float32Array(6);
        contextGradientStrokeUseCase(1, [0, 0, 0, 0, 255], matrix, 0, 1, 0.5);
        expect($fillTypes).toEqual(["fill", "radial"]);
        expect($fillBufferIndexes).toEqual([3, 3]);
        expect($gradientData).toEqual([[0, 0, 0, 0, 255], matrix, 0, 1, 0.5]);

        $setNativePathActive(true);
        const pixels = new Uint8Array(4);
        contextBitmapStrokeUseCase(pixels, matrix, 1, 1, true, false);
        expect($fillTypes).toEqual(["fill", "radial", "bitmap"]);
        expect($fillBufferIndexes).toEqual([3, 3, 3]);
        expect($bitmapData).toEqual([pixels, matrix, 1, 1, true, false]);

        expect($getFillBufferOffset()).toBe(51 * 3);

        // 描く線が無ければ、何も登録しない
        fake.size = 0;
        $setNativePathActive(true);
        contextStrokeUseCase();
        expect($fillTypes.length).toBe(3);
        expect($fillBufferIndexes.length).toBe(3);
    });
});
