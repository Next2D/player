import { WebGLFillMeshGenerator } from "../../src/webgl/WebGLFillMeshGenerator";

describe("WebGLFillMeshGenerator.js test", () =>
{
    // ベジェなし
    it("generate case 1-1", () =>
    {
        const mesh = WebGLFillMeshGenerator.generate([
            [
                100, 100, false,
                200, 100, false,
                200, 200, false,
                100, 200, false
            ]
        ]);

        const actualVertexBufferData = new Float32Array([
            100, 100, 0.5, 0.5,
            200, 100, 0.5, 0.5,
            200, 200, 0.5, 0.5,

            100, 100, 0.5, 0.5,
            200, 200, 0.5, 0.5,
            100, 200, 0.5, 0.5
        ]);

        const actualIndexRanges = [
            { "first": 0, "count": 6 }
        ];

        expect(mesh.vertexBufferData).toEqual(actualVertexBufferData);
        expect(mesh.indexRanges).toEqual(actualIndexRanges);
    });

    it("generate case 1-2", () =>
    {
        const mesh = WebGLFillMeshGenerator.generate([
            [
                100, 100, false,
                200, 100, false,
                200, 200, false,
                100, 200, false
            ],
            [
                250, 200, false,
                200, 250, false,
                250, 300, false,
                300, 250, false
            ],
        ]);

        const actualVertexBufferData = new Float32Array([
            100, 100, 0.5, 0.5,
            200, 100, 0.5, 0.5,
            200, 200, 0.5, 0.5,

            100, 100, 0.5, 0.5,
            200, 200, 0.5, 0.5,
            100, 200, 0.5, 0.5,

            250, 200, 0.5, 0.5,
            200, 250, 0.5, 0.5,
            250, 300, 0.5, 0.5,

            250, 200, 0.5, 0.5,
            250, 300, 0.5, 0.5,
            300, 250, 0.5, 0.5
        ]);

        const actualIndexRanges = [
            { "first": 0, "count": 6 },
            { "first": 6, "count": 6 }
        ];

        expect(mesh.vertexBufferData).toEqual(actualVertexBufferData);
        expect(mesh.indexRanges).toEqual(actualIndexRanges);
    });

    // ベジェあり
    it("generate case 2-1", () =>
    {
        const mesh = WebGLFillMeshGenerator.generate([
            [
                100, 100, false,
                150,   0, true,
                200, 100, false,
                200, 200, false,
                150, 250, true,
                100, 200, false
            ]
        ]);

        const actualVertexBufferData = new Float32Array([
            100, 100, 0, 0,
            150, 0, 0.5, 0,
            200, 100, 1, 1,

            100, 100, 0.5, 0.5,
            200, 100, 0.5, 0.5,
            200, 200, 0.5, 0.5,

            100, 100, 0.5, 0.5,
            200, 200, 0.5, 0.5,
            100, 200, 0.5, 0.5,

            200, 200, 0, 0,
            150, 250, 0.5, 0,
            100, 200, 1, 1
        ]);

        const actualIndexRanges = [
            { "first": 0, "count": 12 }
        ];

        expect(mesh.vertexBufferData).toEqual(actualVertexBufferData);
        expect(mesh.indexRanges).toEqual(actualIndexRanges);
    });

    it("generate case 2-2", () =>
    {
        const mesh = WebGLFillMeshGenerator.generate([
            [
                100, 100, false,
                150,   0, true,
                200, 100, false,
                200, 200, false,
                150, 250, true,
                100, 200, false
            ],
            [
                250, 200, false,
                200, 250, false,
                250, 300, false,
                300, 300, true,
                300, 250, false,
                300, 200, true,
                250, 200, false
            ],
        ]);

        const actualVertexBufferData = new Float32Array([
            100, 100, 0, 0,
            150, 0, 0.5, 0,
            200, 100, 1, 1,

            100, 100, 0.5, 0.5,
            200, 100, 0.5, 0.5,
            200, 200, 0.5, 0.5,

            100, 100, 0.5, 0.5,
            200, 200, 0.5, 0.5,
            100, 200, 0.5, 0.5,

            200, 200, 0, 0,
            150, 250, 0.5, 0,
            100, 200, 1, 1,

            250, 200, 0.5, 0.5,
            200, 250, 0.5, 0.5,
            250, 300, 0.5, 0.5,

            250, 200, 0.5, 0.5,
            250, 300, 0.5, 0.5,
            300, 250, 0.5, 0.5,

            250, 300, 0, 0,
            300, 300, 0.5, 0,
            300, 250, 1, 1,

            250, 200, 0.5, 0.5,
            300, 250, 0.5, 0.5,
            250, 200, 0.5, 0.5,

            300, 250, 0, 0,
            300, 200, 0.5, 0,
            250, 200, 1, 1
        ]);

        const actualIndexRanges = [
            { "first": 0, "count": 12 },
            { "first": 12, "count": 15 },
        ];

        expect(mesh.vertexBufferData).toEqual(actualVertexBufferData);
        expect(mesh.indexRanges).toEqual(actualIndexRanges);
    });

    // 複合
    it("generate case 3", () =>
    {
        const mesh = WebGLFillMeshGenerator.generate([
            [
                100, 100, false,
                200, 100, false,
                200, 200, false,
                100, 200, false
            ],
            [
                250, 200, false,
                200, 250, false,
                250, 300, false,
                300, 300, true,
                300, 250, false,
                300, 200, true,
                250, 200, false
            ],
            [
                300, 300, false,
                400, 300, false,
                400, 400, false
            ]
        ]);

        const actualVertexBufferData = new Float32Array([
            100, 100, 0.5, 0.5,
            200, 100, 0.5, 0.5,
            200, 200, 0.5, 0.5,

            100, 100, 0.5, 0.5,
            200, 200, 0.5, 0.5,
            100, 200, 0.5, 0.5,

            250, 200, 0.5, 0.5,
            200, 250, 0.5, 0.5,
            250, 300, 0.5, 0.5,

            250, 200, 0.5, 0.5,
            250, 300, 0.5, 0.5,
            300, 250, 0.5, 0.5,

            250, 300, 0, 0,
            300, 300, 0.5, 0,
            300, 250, 1, 1,

            250, 200, 0.5, 0.5,
            300, 250, 0.5, 0.5,
            250, 200, 0.5, 0.5,

            300, 250, 0, 0,
            300, 200, 0.5, 0,
            250, 200, 1, 1,

            300, 300, 0.5, 0.5,
            400, 300, 0.5, 0.5,
            400, 400, 0.5, 0.5
        ]);

        const actualIndexRanges = [
            { "first": 0, "count": 6 },
            { "first": 6, "count": 15 },
            { "first": 21, "count": 3 }
        ];

        expect(mesh.vertexBufferData).toEqual(actualVertexBufferData);
        expect(mesh.indexRanges).toEqual(actualIndexRanges);
    });
});
