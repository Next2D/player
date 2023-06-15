import { BezierConverter } from "../../src/webgl/BezierConverter";

describe("BezierConverter.js test", function()
{
    // 通常ケース
    it("cubicToQuad case 1-1", function()
    {
        const bezierConverter = new BezierConverter();

        bezierConverter.cubicToQuad(
            0, 0,
            4000, 2000,
            6000, 8000,
            0, 10000
        );

        const actual = [
            750, 375, 1394.53125, 921.875,
            2039.0625, 1468.75, 2531.25, 2125,
            3023.4375, 2781.25, 3339.84375, 3515.625,
            3656.25, 4250, 3750, 5000,
            3843.75, 5750, 3691.40625, 6484.375,
            3539.0625, 7218.75, 3093.75, 7875,
            2648.4375, 8531.25, 1886.71875, 9078.125,
            1125, 9625, 0, 10000
        ];
        expect(Array.from(bezierConverter._$bezierConverterBuffer)).toEqual(actual);
    });

    it("cubicToQuad case 1-2", function()
    {
        const bezierConverter = new BezierConverter();

        bezierConverter.cubicToQuad(
            0, 0,
            10000, 0,
            10000, 10000,
            0, 10000
        );

        const actual = [
            1875, 0, 3281.25, 429.6875,
            4687.5, 859.375, 5625, 1562.5,
            6562.5, 2265.625, 7031.25, 3164.0625,
            7500, 4062.5, 7500, 5000,
            7500, 5937.5, 7031.25, 6835.9375,
            6562.5, 7734.375, 5625, 8437.5,
            4687.5, 9140.625, 3281.25, 9570.3125,
            1875, 10000, 0, 10000
        ];
        expect(Array.from(bezierConverter._$bezierConverterBuffer)).toEqual(actual);
    });

    it("cubicToQuad case 1-3", function()
    {
        const bezierConverter = new BezierConverter();

        bezierConverter.cubicToQuad(
            0, 0,
            5000, 15000,
            5000, -5000,
            0, 10000
        );

        const actual = [
            937.5, 2812.5, 1640.625, 4121.09375,
            2343.75, 5429.6875, 2812.5, 5781.25,
            3281.25, 6132.8125, 3515.625, 5800.78125,
            3750, 5468.75, 3750, 5000,
            3750, 4531.25, 3515.625, 4199.21875,
            3281.25, 3867.1875, 2812.5, 4218.75,
            2343.75, 4570.3125, 1640.625, 5878.90625,
            937.5, 7187.5, 0, 10000
        ];
        expect(Array.from(bezierConverter._$bezierConverterBuffer)).toEqual(actual);
    });

    // 全て0
    it("cubicToQuad case 2", function()
    {
        const bezierConverter = new BezierConverter();

        bezierConverter.cubicToQuad(
            0, 0,
            0, 0,
            0, 0,
            0, 0
        );

        const actual = [
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ];
        expect(Array.from(bezierConverter._$bezierConverterBuffer)).toEqual(actual);
    });

    // 直線
    it("cubicToQuad case 3", function()
    {
        const bezierConverter = new BezierConverter();

        bezierConverter.cubicToQuad(
            0, 0,
            2000, 2000,
            4000, 4000,
            6000, 6000
        );

        const actual = [
            375, 375, 750, 750,
            1125, 1125, 1500, 1500,
            1875, 1875, 2250, 2250,
            2625, 2625, 3000, 3000,
            3375, 3375, 3750, 3750,
            4125, 4125, 4500, 4500,
            4875, 4875, 5250, 5250,
            5625, 5625, 6000, 6000
        ];
        expect(Array.from(bezierConverter._$bezierConverterBuffer)).toEqual(actual);
    });

    // 始点と制御点1が同じ、かつ、終点と制御点2が同じ
    it("cubicToQuad case 4", function()
    {
        const bezierConverter = new BezierConverter();

        bezierConverter.cubicToQuad(
            0, 0,
            0, 0,
            10000, 10000,
            10000, 10000
        );

        const actual = [
            0, 0, 429.6875, 429.6875,
            859.375, 859.375, 1562.5, 1562.5,
            2265.625, 2265.625, 3164.0625, 3164.0625,
            4062.5, 4062.5, 5000, 5000,
            5937.5, 5937.5, 6835.9375, 6835.9375,
            7734.375, 7734.375, 8437.5, 8437.5,
            9140.625, 9140.625, 9570.3125, 9570.3125,
            10000, 10000, 10000, 10000
        ];
        expect(Array.from(bezierConverter._$bezierConverterBuffer)).toEqual(actual);
    });

    // 制御点1と制御点2が同じ
    it("cubicToQuad case 5", function()
    {
        const bezierConverter = new BezierConverter();

        bezierConverter.cubicToQuad(
            0, 0,
            5000, 5000,
            5000, 5000,
            10000, 0
        );

        const actual = [
            937.5, 937.5, 1660.15625, 1640.625,
            2382.8125, 2343.75, 2968.75, 2812.5,
            3554.6875, 3281.25, 4042.96875, 3515.625,
            4531.25, 3750, 5000, 3750,
            5468.75, 3750, 5957.03125, 3515.625,
            6445.3125, 3281.25, 7031.25, 2812.5,
            7617.1875, 2343.75, 8339.84375, 1640.625,
            9062.5, 937.5, 10000, 0
        ];
        expect(Array.from(bezierConverter._$bezierConverterBuffer)).toEqual(actual);
    });
});