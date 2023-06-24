import { ColorMatrixFilter } from "../../../src/next2d/filters/ColorMatrixFilter";

describe("ColorMatrixFilter.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const object = new ColorMatrixFilter();
        expect(object.namespace).toBe("next2d.filters.ColorMatrixFilter");
    });

    it("namespace test static", () =>
    {
        expect(ColorMatrixFilter.namespace).toBe("next2d.filters.ColorMatrixFilter");
    });

});

describe("ColorMatrixFilter.js toString test", () =>
{
    it("toString test success", () =>
    {
        let filter = new ColorMatrixFilter();
        expect(filter.toString()).toBe("[object ColorMatrixFilter]");
    });

});

describe("ColorMatrixFilter.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(ColorMatrixFilter.toString()).toBe("[class ColorMatrixFilter]");
    });

});

describe("ColorMatrixFilter.js property test", () =>
{

    // default
    it("default test success", () =>
    {
        let matrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];

        let filter = new ColorMatrixFilter();
        for (let i = 0; i < matrix.length; i++) {
            expect(filter.matrix[i]).toBe(matrix[i]);
        }
    });

    // matrix
    it("matrix test success case1", () =>
    {
        let filter = new ColorMatrixFilter([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]);
        expect(filter.matrix.length).toBe(20);
    });

    it("matrix test success case2", () =>
    {
        let filter = new ColorMatrixFilter();
        filter.matrix = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
        expect(filter.matrix.length).toBe(20);
    });

    it("matrix test valid case1", () =>
    {
        let matrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];

        let filter = new ColorMatrixFilter([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]);
        for (let i = 0; i < matrix.length; i++) {
            expect(filter.matrix[i]).toBe(matrix[i]);
        }
    });

    it("matrix test valid case2", () =>
    {
        let matrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];

        let filter = new ColorMatrixFilter();
        filter.matrix = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
        for (let i = 0; i < matrix.length; i++) {
            expect(filter.matrix[i]).toBe(matrix[i]);
        }
    });

});

describe("ColorMatrixFilter.js clone test", () =>
{

    it("clone test", () =>
    {
        let filter = new ColorMatrixFilter([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]);
        let clone  = filter.clone();

        // clone check
        expect(clone.matrix[0]).toBe(1);
        expect(clone.matrix[1]).toBe(2);
        expect(clone.matrix[2]).toBe(3);
        expect(clone.matrix[3]).toBe(4);
        expect(clone.matrix[4]).toBe(5);
        expect(clone.matrix[5]).toBe(6);
        expect(clone.matrix[6]).toBe(7);
        expect(clone.matrix[7]).toBe(8);
        expect(clone.matrix[8]).toBe(9);
        expect(clone.matrix[9]).toBe(10);
        expect(clone.matrix[10]).toBe(11);
        expect(clone.matrix[11]).toBe(12);
        expect(clone.matrix[12]).toBe(13);
        expect(clone.matrix[13]).toBe(14);
        expect(clone.matrix[14]).toBe(15);
        expect(clone.matrix[15]).toBe(16);
        expect(clone.matrix[16]).toBe(17);
        expect(clone.matrix[17]).toBe(18);
        expect(clone.matrix[18]).toBe(19);
        expect(clone.matrix[19]).toBe(20);

        // edit param
        clone.matrix = [20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1];

        // origin
        expect(filter.matrix[0]).toBe(1);
        expect(filter.matrix[1]).toBe(2);
        expect(filter.matrix[2]).toBe(3);
        expect(filter.matrix[3]).toBe(4);
        expect(filter.matrix[4]).toBe(5);
        expect(filter.matrix[5]).toBe(6);
        expect(filter.matrix[6]).toBe(7);
        expect(filter.matrix[7]).toBe(8);
        expect(filter.matrix[8]).toBe(9);
        expect(filter.matrix[9]).toBe(10);
        expect(filter.matrix[10]).toBe(11);
        expect(filter.matrix[11]).toBe(12);
        expect(filter.matrix[12]).toBe(13);
        expect(filter.matrix[13]).toBe(14);
        expect(filter.matrix[14]).toBe(15);
        expect(filter.matrix[15]).toBe(16);
        expect(filter.matrix[16]).toBe(17);
        expect(filter.matrix[17]).toBe(18);
        expect(filter.matrix[18]).toBe(19);
        expect(filter.matrix[19]).toBe(20);

        // clone
        expect(clone.matrix[0]).toBe(20);
        expect(clone.matrix[1]).toBe(19);
        expect(clone.matrix[2]).toBe(18);
        expect(clone.matrix[3]).toBe(17);
        expect(clone.matrix[4]).toBe(16);
        expect(clone.matrix[5]).toBe(15);
        expect(clone.matrix[6]).toBe(14);
        expect(clone.matrix[7]).toBe(13);
        expect(clone.matrix[8]).toBe(12);
        expect(clone.matrix[9]).toBe(11);
        expect(clone.matrix[10]).toBe(10);
        expect(clone.matrix[11]).toBe(9);
        expect(clone.matrix[12]).toBe(8);
        expect(clone.matrix[13]).toBe(7);
        expect(clone.matrix[14]).toBe(6);
        expect(clone.matrix[15]).toBe(5);
        expect(clone.matrix[16]).toBe(4);
        expect(clone.matrix[17]).toBe(3);
        expect(clone.matrix[18]).toBe(2);
        expect(clone.matrix[19]).toBe(1);

    });

});