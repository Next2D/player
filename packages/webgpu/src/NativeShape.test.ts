import { beforeEach, describe, expect, it, vi } from "vitest";

// 実行環境が __next2dShape.webgpu を置いている状態を作る (モジュールの読み込みより前に置く必要がある)
const fake = vi.hoisted(() =>
{
    const fake = {
        "calls": [] as string[],
        "size": -1,
        "exported": new Float64Array(0),
        "path": (commands: Float32Array, index: number, pixel_scale: number): number =>
        {
            fake.calls.push(`path:${index}:${pixel_scale}`);
            return commands.length;
        },
        "fillSize": (): number =>
        {
            fake.calls.push("fillSize");
            return fake.size;
        },
        "fill": (target: Float32Array): number =>
        {
            fake.calls.push(`fill:${target.length >= fake.size}`);
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
        }
    };
    (globalThis as unknown as { __next2dShape: unknown }).__next2dShape = { "webgpu": fake };
    return fake;
});

import { $nativeShape, $NATIVE_FILL_PATH } from "./NativeShape";
import { PathCommand } from "./PathCommand";
import { execute as meshFillGenerateUseCase } from "./Mesh/usecase/MeshFillGenerateUseCase";

describe("NativeShape.js test (the runtime provides __next2dShape.webgpu)", () =>
{
    const commands = new Float32Array([0, 1, 2, 2, 3, 4, 2, 5, 6]);

    beforeEach(() =>
    {
        fake.calls.length = 0;
        fake.size = -1;
        fake.exported = new Float64Array(0);
    });

    it("test case - picks up the implementation from the global", () =>
    {
        expect($nativeShape).toBe(fake);
    });

    it("test case - path commands go to the runtime and the fill mesh comes from it", () =>
    {
        const path = new PathCommand();
        path.beginPath();
        expect(path.pathCommands(commands, 0, 2.5)).toBe(9);
        expect(fake.calls).toEqual(["path:0:2.5"]);

        fake.size = 12;
        const vertices = path.$getVertices;
        expect(vertices).toBe($NATIVE_FILL_PATH);
        expect(vertices.length).not.toBe(0);

        const mesh = meshFillGenerateUseCase(vertices);
        expect(mesh.indexCount).toBe(3);
        expect(Array.from(mesh.buffer)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        expect(fake.calls).toEqual(["path:0:2.5", "fillSize", "fill:true"]);

        // 経路は残っているので、もう一度取り出せる
        expect(path.$getVertices).toBe($NATIVE_FILL_PATH);
    });

    it("test case - the mesh buffer grows to the size the runtime reports", () =>
    {
        const path = new PathCommand();
        path.pathCommands(commands, 0, 1);

        fake.size = 12 * 5000;
        const mesh = meshFillGenerateUseCase(path.$getVertices);
        expect(mesh.indexCount).toBe(15000);
        expect(mesh.buffer.length).toBe(fake.size);
        expect(mesh.buffer[fake.size - 1]).toBe(fake.size);
        expect(fake.calls[fake.calls.length - 1]).toBe("fill:true");
    });

    it("test case - no path at all is an empty array, paths without triangles are not", () =>
    {
        const path = new PathCommand();
        path.pathCommands(commands, 0, 1);

        fake.size = -1;
        expect(path.$getVertices.length).toBe(0);

        fake.size = 0;
        const vertices = path.$getVertices;
        expect(vertices.length).not.toBe(0);
        expect(meshFillGenerateUseCase(vertices).indexCount).toBe(0);
    });

    it("test case - refuses when the path was started in JavaScript", () =>
    {
        const path = new PathCommand();
        path.beginPath();
        path.moveTo(1, 2);
        expect(path.pathCommands(commands, 3, 1)).toBe(-1);
        expect(fake.calls).toEqual([]);

        // こちらで作った経路は、これまでどおり JavaScript でメッシュにする
        path.lineTo(3, 4);
        path.lineTo(5, 6);
        const mesh = meshFillGenerateUseCase(path.$getVertices);
        expect(mesh.indexCount).toBe(3);
        expect(fake.calls).toEqual([]);
    });

    it("test case - the stroke takes the path back from the runtime", () =>
    {
        const path = new PathCommand();
        path.pathCommands(commands, 0, 1);

        fake.exported = new Float64Array([
            2,
            9, 1, 2, 0, 3, 4, 1, 5, 6, 0,
            6, 7, 8, 0, 9, 10, 0
        ]);
        expect(path.getVerticesForStroke()).toEqual([
            [1, 2, false, 3, 4, true, 5, 6, false],
            [7, 8, false, 9, 10, false]
        ]);
        expect(fake.calls).toEqual(["path:0:1", "exportPath:true"]);
    });

    it("test case - beginPath and reset clear the path on the runtime side", () =>
    {
        const path = new PathCommand();
        path.pathCommands(commands, 0, 1);
        path.beginPath();
        expect(fake.calls).toEqual(["path:0:1", "reset"]);

        // 実行環境の側に経路が無いときは呼ばない
        path.beginPath();
        path.reset();
        expect(fake.calls).toEqual(["path:0:1", "reset"]);

        path.pathCommands(commands, 0, 1);
        path.reset();
        expect(fake.calls).toEqual(["path:0:1", "reset", "path:0:1", "reset"]);

        // 空にした後は、JavaScript の経路として使える
        path.moveTo(0, 0);
        path.lineTo(1, 0);
        path.lineTo(1, 1);
        expect(path.$getVertices).toEqual([[0, 0, false, 1, 0, false, 1, 1, false]]);
    });
});
