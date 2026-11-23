import { beforeEach, describe, expect, it, vi } from "vitest";

// 実行環境が __next2dShape を置いている状態を作る (モジュールの読み込みより前に置く必要がある)
const fake = vi.hoisted(() =>
{
    const fake = {
        "calls": [] as string[],
        "size": 0,
        "fillArguments": [] as number[],
        "exported": new Float64Array(0),
        "path": (commands: Float32Array, index: number, scale_squared: number): number =>
        {
            fake.calls.push(`path:${index}:${scale_squared}`);
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
        }
    };
    (globalThis as unknown as { __next2dShape: unknown }).__next2dShape = fake;
    return fake;
});

import {
    $nativeShape,
    $nativePathActive,
    $setNativePathActive
} from "./NativeShape";
import {
    $addFillBuffer,
    $clearFillBufferSetting,
    $getFillBuffer,
    $getFillBufferOffset
} from "./Mesh";
import {
    $currentPath,
    $getVertices,
    $vertices
} from "./PathCommand";
import { $setContext, $setViewportSize } from "./WebGLUtil";
import { execute as meshFillCurrentPathUseCase } from "./Mesh/usecase/MeshFillCurrentPathUseCase";
import { execute as pathCommandBeginPathService } from "./PathCommand/service/PathCommandBeginPathService";

describe("NativeShape.js test (the runtime provides __next2dShape)", () =>
{
    beforeEach(() =>
    {
        fake.calls.length = 0;
        fake.size = 0;
        fake.fillArguments = [];
        fake.exported = new Float64Array(0);
        $setNativePathActive(false);
        $currentPath.length = 0;
        $vertices.length = 0;
        $clearFillBufferSetting();
        $setContext({
            "$matrix": new Float32Array([2, 4, 0, 6, 8, 0, 10, 12, 1]),
            "$fillStyle": new Float32Array([0.25, 0.5, 0.75, 1])
        } as never);
        $setViewportSize(2, 4);
    });

    it("test case - picks up the implementation from the global", () =>
    {
        expect($nativeShape).toBe(fake);
        expect($nativePathActive).toBe(false);
    });

    it("test case - fill writes the mesh straight into the fill buffer", () =>
    {
        // 先に入っている内容は保たれる
        $addFillBuffer(new Float32Array([1, 2, 3]));

        fake.size = 51;
        $setNativePathActive(true);
        expect(meshFillCurrentPathUseCase()).toBe(3);

        expect(fake.calls).toEqual(["fillSize", "fill"]);
        expect($nativePathActive).toBe(false);

        // 書き込み位置、行列 (ビューポートの大きさで割った値)、色
        expect(fake.fillArguments).toEqual([3, 1, 1, 3, 2, 5, 3, 0.25, 0.5, 0.75, 1]);

        expect($getFillBufferOffset()).toBe(54);
        const buffer = $getFillBuffer();
        expect(Array.from(buffer.subarray(0, 4))).toEqual([1, 2, 3, 7]);
        expect(buffer[53]).toBe(7);
    });

    it("test case - fill grows the fill buffer and keeps its content", () =>
    {
        $addFillBuffer(new Float32Array([9, 8]));

        fake.size = 17 * 3 * 4000;
        $setNativePathActive(true);
        expect(meshFillCurrentPathUseCase()).toBe(12000);

        const buffer = $getFillBuffer();
        expect(buffer.length).toBeGreaterThanOrEqual(2 + fake.size);
        expect(buffer[0]).toBe(9);
        expect(buffer[1]).toBe(8);
        expect(buffer[2 + fake.size - 1]).toBe(7);
        expect($getFillBufferOffset()).toBe(2 + fake.size);
    });

    it("test case - nothing to fill returns -1 and clears the path", () =>
    {
        $setNativePathActive(true);
        expect(meshFillCurrentPathUseCase()).toBe(-1);
        expect(fake.calls).toEqual(["fillSize", "reset"]);
        expect($nativePathActive).toBe(false);
        expect($getFillBufferOffset()).toBe(0);
    });

    it("test case - falls back to JavaScript while the path is not on the runtime side", () =>
    {
        $currentPath.push(0, 0, false, 10, 0, false, 10, 10, false);
        expect(meshFillCurrentPathUseCase()).toBe(3);
        expect(fake.calls).toEqual([]);
        expect($getFillBufferOffset()).toBe(51);
    });

    it("test case - $getVertices takes the path back from the runtime", () =>
    {
        // 2 本の経路: 3 点 (うち 1 つは制御点) と 2 点
        fake.exported = new Float64Array([
            2,
            9, 1, 2, 0, 3, 4, 1, 5, 6, 0,
            6, 7, 8, 0, 9, 10, 0
        ]);
        $setNativePathActive(true);

        const vertices = $getVertices(true);
        expect(fake.calls).toEqual(["exportPath:true"]);
        expect($nativePathActive).toBe(false);
        expect(vertices).toEqual([
            [1, 2, false, 3, 4, true, 5, 6, false],
            [7, 8, false, 9, 10, false]
        ]);
    });

    it("test case - beginPath clears the path on the runtime side", () =>
    {
        $setNativePathActive(true);
        pathCommandBeginPathService();
        expect(fake.calls).toEqual(["reset"]);
        expect($nativePathActive).toBe(false);

        // 実行環境の側に経路が無いときは呼ばない
        pathCommandBeginPathService();
        expect(fake.calls).toEqual(["reset"]);
    });
});
