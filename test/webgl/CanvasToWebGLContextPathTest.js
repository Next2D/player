describe("CanvasToWebGLContextPath.js test", function()
{
    it("case 1", function ()
    {
        const path = new CanvasToWebGLContextPath();

        const actual = [];
        expect(path.vertices).toEqual(actual);
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

        const actual = [];
        expect(path.vertices).toEqual(actual);
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
                18.75, 14.55266952966369, true,
                31.991990209613935, 26.580650217297524, false,
                45.23398041922786, 38.60863090493136, true,
                53.88325214724777, 48.3685064417433, false,
                62.53252387526767, 58.12838197855524, true,
                67.04672277608957, 65.74844421014927, false,
                71.56092167691145, 73.3685064417433, true,
                72.85533905932738, 79.10533905932738, false,
                74.1497564417433, 84.84217167691145, true,
                72.68203796014929, 88.82406652608955, false,
                71.21431947855525, 92.80596137526766, true,
                67.8997564417433, 95.28950214724776, false,
                64.58519340493137, 97.77304291922786, true,
                59.88143146729753, 98.88652145961393, false,
                55.17766952966369, 100, true,
                50, 100, false,
                44.82233047033631, 100, true,
                39.92325603270247, 98.98417770961393, false,
                35.02418159506864, 97.96835541922786, true,
                30.537743558256697, 96.07075214724776, false,
                26.051305521444753, 94.17314887526766, true,
                22.044524539850727, 91.46078527608955, false,
                18.037743558256697, 88.74842167691145, true,
                14.64466094067262, 85.35533905932738, false,
                11.251578323088543, 81.9622564417433, true,
                8.539214723910437, 77.95547546014929, false,
                5.826851124732331, 73.94869447855525, true,
                3.9292478527522334, 69.4622564417433, false,
                2.031644580772136, 64.97581840493137, true,
                1.015822290386068, 60.07674396729753, false,
                0, 55.17766952966369, true,
                0, 50, false,
                0, 44.82233047033631, true,
                1.015822290386068, 39.92325603270247, false,
                2.031644580772136, 35.02418159506864, true,
                3.9292478527522334, 30.537743558256697, false,
                5.826851124732331, 26.051305521444753, true,
                8.539214723910437, 22.044524539850727, false,
                11.251578323088543, 18.037743558256697, true,
                14.64466094067262, 14.64466094067262, false,
                18.037743558256697, 11.251578323088543, true,
                22.044524539850727, 8.539214723910437, false,
                26.051305521444753, 5.826851124732331, true,
                30.537743558256697, 3.9292478527522334, false,
                35.02418159506864, 2.031644580772136, true,
                39.923256032702476, 1.015822290386068, false,
                44.82233047033631, 0, true,
                50, 0, false,
                55.17766952966369, 0, true,
                60.07674396729753, 1.015822290386068, false,
                64.97581840493137, 2.031644580772136, true,
                69.4622564417433, 3.9292478527522334, false,
                73.94869447855525, 5.826851124732331, true,
                77.95547546014927, 8.539214723910437, false,
                81.9622564417433, 11.251578323088543, true,
                85.35533905932738, 14.64466094067262, false,
                88.74842167691145, 18.037743558256697, true,
                91.46078527608955, 22.044524539850727, false,
                94.17314887526766, 26.051305521444753, true,
                96.07075214724776, 30.537743558256697, false,
                97.96835541922786, 35.02418159506864, true,
                98.98417770961393, 39.923256032702476, false,
                100, 44.82233047033631, true,
                100, 50, false,
                0, 0, false
            ]
        ];
        expect(path.vertices).toEqual(actual);
    });
});
