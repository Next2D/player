describe("ConvexHull.js test", function()
{
    // 頂点数が3以下
    it ("compute case 1", function ()
    {
        const expected = ConvexHull.compute([
            0, 0, false,
            0, 100, false,
            100, 100, false
        ]);

        const actual = [
            0, 0, false,
            0, 100, false,
            100, 100, false
        ];
        expect(expected).toEqual(actual);
    });

    // 頂点数が4
    it ("compute case 2", function ()
    {
        const expected = ConvexHull.compute([
            0, 0, false,
            0, 100, false,
            100, 100, false,
            50, 50, false
        ]);

        const actual = [
            0, 0, false,
            0, 100, false,
            100, 100, false
        ];
        expect(expected).toEqual(actual);
    });

    // 頂点数が17（部分凸包が2つ、片方の頂点数が1）
    it ("compute case 3", function ()
    {
        const expected = ConvexHull.compute([
            100, 100, false,
            90, 120, false,
            70, 130, false,
            60, 140, false,
            50, 170, false,
            80, 180, false,
            100, 190, false,
            130, 210, false,
            150, 250, false,
            160, 220, false,
            170, 210, false,
            200, 200, false,
            190, 160, false,
            150, 150, false,
            140, 130, false,
            110, 110, false
        ]);

        const actual = [
            50, 170, false,
            150, 250, false,
            200, 200, false,
            190, 160, false,
            100, 100, false,
            60, 140, false
        ];
        expect(expected).toEqual(actual);
    });

    // 頂点数が18（部分凸包が2つ）
    it ("compute case 4", function ()
    {
        const expected = ConvexHull.compute([
            80, 80, false,
            100, 100, false,
            90, 120, false,
            70, 130, false,
            60, 140, false,
            50, 170, false,
            80, 180, false,
            100, 190, false,
            130, 210, false,
            150, 250, false,
            160, 220, false,
            170, 210, false,
            200, 200, false,
            190, 160, false,
            150, 150, false,
            140, 130, false,
            110, 110, false
        ]);

        const actual = [
            50, 170, false,
            150, 250, false,
            200, 200, false,
            190, 160, false,
            80, 80, false
        ];
        expect(expected).toEqual(actual);
    });

    // 重複した頂点がある
    it ("compute case 5", function ()
    {
        const expected = ConvexHull.compute([
            100, 100, false,
            90, 120, false,
            70, 130, false,
            60, 140, false,
            50, 170, false,
            80, 180, false,
            100, 190, false,
            130, 210, false,
            150, 250, false,
            160, 220, false,
            170, 210, false,
            200, 200, false,
            190, 160, false,
            150, 150, false,
            140, 130, false,
            100, 100, false
        ]);

        const actual = [
            50, 170, false,
            150, 250, false,
            200, 200, false,
            190, 160, false,
            100, 100, false,
            60, 140, false
        ];
        expect(expected).toEqual(actual);
    });

    // 直線上に並んだ頂点がある
    it ("compute case 6", function ()
    {
        const expected = ConvexHull.compute([
            100, 100, false,
            90, 120, false,
            70, 130, false,
            60, 140, false,
            50, 170, false,
            80, 180, false,
            100, 190, false,
            130, 210, false,
            150, 250, false,
            160, 220, false,
            170, 210, false,
            200, 200, false,
            190, 160, false,
            150, 150, false,
            130, 130, false,
            110, 110, false
        ]);

        const actual = [
            50, 170, false,
            150, 250, false,
            200, 200, false,
            190, 160, false,
            100, 100, false,
            60, 140, false
        ];
        expect(expected).toEqual(actual);
    });
});
