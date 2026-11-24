import { beforeEach, describe, expect, it, vi } from "vitest";

// 実行環境が、線の外周の計算 (strokeSize) も持つ __next2dShape.webgpu を置いている状態を作る
// (モジュールの読み込みより前に置く必要がある)
const fake = vi.hoisted(() =>
{
    const fake = {
        "calls": [] as string[],
        "size": 0,
        "strokeArguments": [] as number[],
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
        "fill": (target: Float32Array, flat?: boolean): number =>
        {
            fake.calls.push(`fill:${flat === true}`);
            for (let idx = 0; idx < fake.size; ++idx) {
                target[idx] = idx + 1;
            }
            return fake.size / 4;
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
    (globalThis as unknown as { __next2dShape: unknown }).__next2dShape = { "webgpu": fake };
    return fake;
});

import { $nativeStroke, $NATIVE_FILL_PATH } from "./NativeShape";
import { PathCommand } from "./PathCommand";
import { execute as meshFillGenerateUseCase } from "./Mesh/usecase/MeshFillGenerateUseCase";
import { execute as meshGradientStrokeGenerateUseCase } from "./Mesh/usecase/MeshGradientStrokeGenerateUseCase";
import { execute as meshBitmapStrokeGenerateUseCase } from "./Mesh/usecase/MeshBitmapStrokeGenerateUseCase";

describe("NativeStroke.js test (the runtime provides __next2dShape.webgpu.strokeSize)", () =>
{
    const commands = new Float32Array([0, 1, 2, 2, 3, 4, 2, 5, 6]);

    beforeEach(() =>
    {
        fake.calls.length = 0;
        fake.size = 0;
        fake.strokeArguments = [];
        fake.exported = new Float64Array(0);
    });

    it("test case - detects the stroke implementation", () =>
    {
        expect($nativeStroke).toBe(true);
    });

    it("test case - the outline and the mesh are built on the runtime side", () =>
    {
        const path = new PathCommand();
        path.pathCommands(commands, 0, 1);
        fake.calls.length = 0;

        fake.size = 12;
        const source = path.getStrokeSource(3, 1, 2, 2.5);
        expect(source).toBe($NATIVE_FILL_PATH);

        // 経路は取り出さない (JavaScript の側で線を作らない)
        expect(fake.calls).toEqual(["strokeSize"]);
        expect(fake.strokeArguments).toEqual([3, 1, 2, 2.5]);

        // 単色の線は、塗りと同じ形式のメッシュ
        const mesh = meshFillGenerateUseCase(source);
        expect(mesh.indexCount).toBe(3);
        expect(Array.from(mesh.buffer)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        expect(fake.calls).toEqual(["strokeSize", "fill:false"]);
    });

    it("test case - gradient and bitmap strokes take the flat mesh", () =>
    {
        const path = new PathCommand();
        path.pathCommands(commands, 0, 1);
        fake.calls.length = 0;

        fake.size = 24;
        const source = path.getStrokeSource(1, 0, 0, 1);

        const gradient = meshGradientStrokeGenerateUseCase(source, 2);
        expect(gradient.indexCount).toBe(6);
        expect(gradient.buffer.length).toBe(24);
        expect(gradient.buffer[23]).toBe(24);

        const bitmap = meshBitmapStrokeGenerateUseCase(source, 2);
        expect(bitmap.indexCount).toBe(6);
        expect(bitmap.buffer.length).toBe(24);

        expect(fake.calls).toEqual(["strokeSize", "fill:true", "fill:true"]);
    });

    it("test case - the mesh buffer grows to the size the runtime reports", () =>
    {
        const path = new PathCommand();
        path.pathCommands(commands, 0, 1);

        fake.size = 12 * 5000;
        const mesh = meshGradientStrokeGenerateUseCase(path.getStrokeSource(1, 0, 0, 1), 2);
        expect(mesh.indexCount).toBe(15000);
        expect(mesh.buffer.length).toBe(fake.size);
        expect(mesh.buffer[fake.size - 1]).toBe(fake.size);
    });

    it("test case - nothing to stroke is an empty array", () =>
    {
        const path = new PathCommand();
        path.pathCommands(commands, 0, 1);
        fake.calls.length = 0;

        expect(path.getStrokeSource(1, 0, 0, 1).length).toBe(0);
        expect(fake.calls).toEqual(["strokeSize"]);
    });

    it("test case - a path built in JavaScript is returned as it is", () =>
    {
        const path = new PathCommand();
        path.moveTo(0, 0);
        path.lineTo(10, 0);
        expect(path.getStrokeSource(1, 0, 0, 1)).toEqual([[0, 0, false, 10, 0, false]]);
        expect(fake.calls).toEqual([]);
    });
});
