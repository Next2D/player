import { CanvasToWebGLContextPath } from "../../src/webgl/CanvasToWebGLContextPath";

describe("CanvasToWebGLContextPath.js test", () =>
{
    it("case 1", function ()
    {
        const path = new CanvasToWebGLContextPath();

        expect(path.vertices).toEqual([]);
    });

    it("case 2-1", function ()
    {
        const path = new CanvasToWebGLContextPath();
        path.begin();
        path.moveTo(100, 100);
        path.lineTo(100, 200);
        path.close();

        const actual = [
            [
                100, 100, false,
                100, 200, false
            ]
        ];
        expect(path.vertices).toEqual(actual);
    });

    it("case 2-2", function ()
    {
        const path = new CanvasToWebGLContextPath();
        path.moveTo(100, 100);
        path.lineTo(100, 200);
        path.close();

        const actual = [
            [
                100, 100, false,
                100, 200, false
            ]
        ];
        expect(path.vertices).toEqual(actual);
    });

    it("case 2-3", function ()
    {
        const path = new CanvasToWebGLContextPath();
        path.begin();
        path.moveTo(100, 100);
        path.lineTo(100, 200);

        const actual = [
            [
                100, 100, false,
                100, 200, false
            ]
        ];
        expect(path.vertices).toEqual(actual);
    });

    it("case 2-4", function ()
    {
        const path = new CanvasToWebGLContextPath();
        path.moveTo(100, 100);

        expect(path.vertices).toEqual([]);
    });

    it("case 2-5", function ()
    {
        const path = new CanvasToWebGLContextPath();
        path.lineTo(100, 200);

        const actual = [
            [
                0, 0, false,
                100, 200, false
            ]
        ];
        expect(path.vertices).toEqual(actual);
    });

    it("case 2-6", function ()
    {
        const path = new CanvasToWebGLContextPath();
        path.begin();
        path.moveTo(100, 100);
        path.lineTo(100, 200);
        path.moveTo(100, 100);
        path.lineTo(200, 100);
        path.close();

        const actual = [
            [
                100, 100, false,
                100, 200, false
            ],
            [
                100, 100, false,
                200, 100, false
            ]
        ];
        expect(path.vertices).toEqual(actual);
    });

    it("case 3-1", function ()
    {
        const path = new CanvasToWebGLContextPath();
        path.begin();
        path.moveTo(100, 100);
        path.lineTo(100, 200);
        path.lineTo(200, 200);
        path.close();

        const actual = [
            [
                100, 100, false,
                100, 200, false,
                200, 200, false,
                100, 100, false
            ]
        ];
        expect(path.vertices).toEqual(actual);
    });

    it("case 4", function ()
    {
        const path = new CanvasToWebGLContextPath();
        path.begin();
        path.quadTo(100, 0, 100, 100);
        path.close();

        const actual = [
            [
                0, 0, false,
                100, 0, true,
                100, 100, false,
                0, 0, false
            ]
        ];
        expect(path.vertices).toEqual(actual);
    });

    it("case 5", function ()
    {
        const path = new CanvasToWebGLContextPath();
        path.begin();
        path.cubicTo(50, 0, 100, 50, 100, 100);
        path.close();

        const actual = [
            [
                0, 0, false,
                9.375, 0, true,
                18.65234375, 2.24609375, false,
                27.9296875, 4.4921875, true,
                36.71875, 8.59375, false,
                45.5078125, 12.6953125, true,
                53.61328125, 18.45703125, false,
                61.71875, 24.21875, true,
                68.75, 31.25, false,
                75.78125, 38.28125, true,
                81.54296875, 46.38671875, false,
                87.3046875, 54.4921875, true,
                91.40625, 63.28125, false,
                95.5078125, 72.0703125, true,
                97.75390625, 81.34765625, false,
                100, 90.625, true,
                100, 100, false,
                0, 0, false
            ]
        ];
        expect(path.vertices).toEqual(actual);
    });

    it("case 6", function ()
    {
        const path = new CanvasToWebGLContextPath();
        path.begin();
        path.drawCircle(50, 50, 50);
        path.close();

        const actual = [
            [
                0, 0, false,
                18.75, 14.552669525146484, true,
                31.99199104309082, 26.580650329589844, false,
                45.23398208618164, 38.6086311340332, true,
                53.88325119018555, 48.368507385253906, false,
                62.53252029418945, 58.128379821777344, true,
                67.04672241210938, 65.74844360351562, false,
                71.56092071533203, 73.3685073852539, true,
                72.85533905029297, 79.10533905029297, false,
                74.1497573852539, 84.84217071533203, true,
                72.68203735351562, 88.82406616210938, false,
                71.21432495117188, 92.80596160888672, true,
                67.8997573852539, 95.28950500488281, false,
                64.58518981933594, 97.77304077148438, true,
                59.881431579589844, 98.88652038574219, false,
                55.17766571044922, 100, true,
                50, 100, false,
                44.82233428955078, 100, true,
                39.923255920410156, 98.98417663574219, false,
                35.0241813659668, 97.96835327148438, true,
                30.537744522094727, 96.07075500488281, false,
                26.051305770874023, 94.17314910888672, true,
                22.044525146484375, 91.46078491210938, false,
                18.037742614746094, 88.74842071533203, true,
                14.644660949707031, 85.35533905029297, false,
                11.251578330993652, 81.9622573852539, true,
                8.539215087890625, 77.95547485351562, false,
                5.8268513679504395, 73.94869995117188, true,
                3.9292478561401367, 69.4622573852539, false,
                2.031644582748413, 64.97581481933594, true,
                1.0158222913742065, 60.076744079589844, false,
                0, 55.17766571044922, true,
                0, 50, false,
                0, 44.82233428955078, true,
                1.0158222913742065, 39.923255920410156, false,
                2.031644582748413, 35.0241813659668, true,
                3.9292478561401367, 30.537744522094727, false,
                5.8268513679504395, 26.051305770874023, true,
                8.539215087890625, 22.044525146484375, false,
                11.251578330993652, 18.037742614746094, true,
                14.644660949707031, 14.644660949707031, false,
                18.037742614746094, 11.251578330993652, true,
                22.044525146484375, 8.539215087890625, false,
                26.051305770874023, 5.8268513679504395, true,
                30.537744522094727, 3.9292478561401367, false,
                35.0241813659668, 2.031644582748413, true,
                39.923255920410156, 1.0158222913742065, false,
                44.82233428955078, 0, true,
                50, 0, false,
                55.17766571044922, 0, true,
                60.076744079589844, 1.0158222913742065, false,
                64.97581481933594, 2.031644582748413, true,
                69.4622573852539, 3.9292478561401367, false,
                73.94869995117188, 5.8268513679504395, true,
                77.95547485351562, 8.539215087890625, false,
                81.9622573852539, 11.251578330993652, true,
                85.35533905029297, 14.644660949707031, false,
                88.74842071533203, 18.037742614746094, true,
                91.46078491210938, 22.044525146484375, false,
                94.17314910888672, 26.051305770874023, true,
                96.07075500488281, 30.537744522094727, false,
                97.96835327148438, 35.0241813659668, true,
                98.98417663574219, 39.923255920410156, false,
                100, 44.82233428955078, true,
                100, 50, false,
                0, 0, false
            ]
        ];
        expect(path.vertices).toEqual(actual);
    });
});
