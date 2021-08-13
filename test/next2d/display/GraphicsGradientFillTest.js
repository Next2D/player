
describe("GraphicsGradientFill.js property test", function()
{

    // type
    it("type success test case1", function()
    {
        let ggf = new GraphicsGradientFill();
        expect(ggf._$type).toBe(GradientType.LINEAR);
    });

    it("type success test case2", function()
    {
        let ggf = new GraphicsGradientFill(GradientType.LINEAR);
        expect(ggf._$type).toBe(GradientType.LINEAR);
    });

    it("type success test case3", function()
    {
        let ggf = new GraphicsGradientFill(GradientType.RADIAL);
        expect(ggf._$type).toBe(GradientType.RADIAL);
    });

    it("type success test case4", function()
    {
        let ggf = new GraphicsGradientFill(GradientType.RADIAL);
        ggf.type = GradientType.RADIAL;
        expect(ggf._$type).toBe(GradientType.RADIAL);
    });

    it("type valid test case1", function()
    {
        let ggf = new GraphicsGradientFill("test");
        expect(ggf._$type).toBe(GradientType.LINEAR);
    });

    // colors
    it("colors success test case1", function()
    {
        let ggf = new GraphicsGradientFill(GradientType.LINEAR);
        expect(ggf._$colors).toBe(null);
    });

    it("colors success test case2", function()
    {
        let ggf = new GraphicsGradientFill(GradientType.LINEAR, [0xff0000, 0x00ff00, 0x0000ff]);
        expect(ggf._$colors.length).toBe(3);
    });

    it("colors valid test case1", function()
    {
        let ggf = new GraphicsGradientFill(GradientType.LINEAR, "test");
        expect(ggf._$colors).toBe(null);
    });

    it("colors valid test case3", function()
    {
        let ggf = new GraphicsGradientFill(GradientType.LINEAR, ["red", "lime", "blue"]);
        expect(ggf._$colors[0]).toBe(0xff0000);
        expect(ggf._$colors[1]).toBe(0x00ff00);
        expect(ggf._$colors[2]).toBe(0x0000ff);
    });

    it("colors valid test case3", function()
    {
        let ggf = new GraphicsGradientFill(GradientType.LINEAR, [-1, 16777216]);
        expect(ggf._$colors[0]).toBe(0);
        expect(ggf._$colors[1]).toBe(0xffffff);
    });

    // alphas
    it("alphas success test case1", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff]
        );
        expect(ggf._$alphas).toBe(null);
    });

    it("alphas success test case2", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [0.25, 0.5, 0.75, 1]
        );
        expect(ggf._$alphas.length).toBe(4);
    });

    it("alphas valid test case1", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [-1, 2]
        );
        expect(ggf._$alphas[0]).toBe(0);
        expect(ggf._$alphas[1]).toBe(2);
    });

    // ratios
    it("ratios success test case1", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [0.25, 0.5, 0.75, 1]
        );
        expect(ggf._$ratios).toBe(null);
    });

    it("ratios success test case2", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [0.25, 0.5, 0.75, 1],
            [0, 63, 127, 190, 255]
        );
        expect(ggf._$ratios.length).toBe(5);
    });

    it("ratios valid test case2", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [0.25, 0.5, 0.75, 1],
            [-1, 256]
        );
        expect(ggf._$ratios[0]).toBe(0);
        expect(ggf._$ratios[1]).toBe(255);
    });

    // matrix
    it("matrix success test case1", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [0.25, 0.5, 0.75, 1],
            [-1, 256]
        );
        expect(ggf._$matrix).toBe(null);
    });

    it("matrix success test case2", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [0.25, 0.5, 0.75, 1],
            [-1, 256],
            new Matrix()
        );
        expect(ggf._$matrix instanceof Matrix).toBe(true);
    });

    // spreadMethod
    it("spreadMethod success test case1", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [0.25, 0.5, 0.75, 1],
            [0, 63, 127, 190, 255],
            new Matrix()
        );
        expect(ggf._$spreadMethod).toBe(SpreadMethod.PAD);
    });

    it("spreadMethod success test case2", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [0.25, 0.5, 0.75, 1],
            [0, 63, 127, 190, 255],
            new Matrix(),
            SpreadMethod.PAD
        );
        expect(ggf._$spreadMethod).toBe(SpreadMethod.PAD);
    });

    it("spreadMethod success test case3", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [0.25, 0.5, 0.75, 1],
            [0, 63, 127, 190, 255],
            new Matrix(),
            SpreadMethod.REFLECT
        );
        expect(ggf._$spreadMethod).toBe(SpreadMethod.REFLECT);
    });

    it("spreadMethod success test case4", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [0.25, 0.5, 0.75, 1],
            [0, 63, 127, 190, 255],
            new Matrix(),
            SpreadMethod.REPEAT
        );
        expect(ggf._$spreadMethod).toBe(SpreadMethod.REPEAT);
    });

    it("spreadMethod valid test case1", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [0.25, 0.5, 0.75, 1],
            [0, 63, 127, 190, 255],
            new Matrix(),
            "test"
        );
        expect(ggf._$spreadMethod).toBe(SpreadMethod.PAD);
    });

    // interpolationMethod
    it("interpolationMethod success test case1", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [0.25, 0.5, 0.75, 1],
            [0, 63, 127, 190, 255],
            new Matrix(),
            SpreadMethod.REPEAT
        );
        expect(ggf._$interpolationMethod).toBe(InterpolationMethod.RGB);
    });

    it("interpolationMethod success test case2", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [0.25, 0.5, 0.75, 1],
            [0, 63, 127, 190, 255],
            new Matrix(),
            SpreadMethod.REPEAT,
            InterpolationMethod.RGB
        );
        expect(ggf._$interpolationMethod).toBe(InterpolationMethod.RGB);
    });

    it("interpolationMethod success test case3", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [0.25, 0.5, 0.75, 1],
            [0, 63, 127, 190, 255],
            new Matrix(),
            SpreadMethod.REPEAT,
            InterpolationMethod.LINEAR_RGB
        );
        expect(ggf._$interpolationMethod).toBe(InterpolationMethod.LINEAR_RGB);
    });

    it("interpolationMethod valid test case1", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [0.25, 0.5, 0.75, 1],
            [0, 63, 127, 190, 255],
            new Matrix(),
            SpreadMethod.REPEAT,
            "text"
        );
        expect(ggf._$interpolationMethod).toBe(InterpolationMethod.RGB);
    });

    // focalPointRatio
    it("focalPointRatio success test case1", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [0.25, 0.5, 0.75, 1],
            [0, 63, 127, 190, 255],
            new Matrix(),
            SpreadMethod.PAD,
            InterpolationMethod.RGB
        );
        expect(ggf._$focalPointRatio).toBe(0);
    });

    it("focalPointRatio success test case2", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [0.25, 0.5, 0.75, 1],
            [0, 63, 127, 190, 255],
            new Matrix(),
            SpreadMethod.PAD,
            InterpolationMethod.RGB,
            1
        );
        expect(ggf._$focalPointRatio).toBe(1);
    });

    it("focalPointRatio success test case3", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [0.25, 0.5, 0.75, 1],
            [0, 63, 127, 190, 255],
            new Matrix(),
            SpreadMethod.PAD,
            InterpolationMethod.RGB,
            -1
        );
        expect(ggf._$focalPointRatio).toBe(-1);
    });

    it("focalPointRatio valid test case1", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [0.25, 0.5, 0.75, 1],
            [0, 63, 127, 190, 255],
            new Matrix(),
            SpreadMethod.PAD,
            InterpolationMethod.RGB,
            2
        );
        expect(ggf._$focalPointRatio).toBe(2);
    });

    it("focalPointRatio valid test case2", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [0.25, 0.5, 0.75, 1],
            [0, 63, 127, 190, 255],
            new Matrix(),
            SpreadMethod.PAD,
            InterpolationMethod.RGB,
            +"a"
        );
        expect(ggf._$focalPointRatio).toBe(0);
    });

});

describe("GraphicsGradientFill.js colorStops test", function()
{

    it("colorStops success test case1", function()
    {
        let ggf = new GraphicsGradientFill(
            GradientType.LINEAR,
            [0xff0000, 0x00ff00, 0x0000ff],
            [0.25, 0.5, 0.75, 1],
            [0, 63, 127, 190, 255],
            new Matrix(),
            SpreadMethod.PAD,
            InterpolationMethod.RGB,
            -2
        );

        let colorStops = ggf.colorStops;
        expect(colorStops.length).toBe(3);

        expect(colorStops[0].ratio).toBe(0);
        expect(colorStops[0].R).toBe(255);
        expect(colorStops[0].G).toBe(0);
        expect(colorStops[0].B).toBe(0);
        expect(colorStops[0].A).toBe(63.75);

        expect(colorStops[1].ratio).toBe(63 / 255);
        expect(colorStops[1].R).toBe(0);
        expect(colorStops[1].G).toBe(255);
        expect(colorStops[1].B).toBe(0);
        expect(colorStops[1].A).toBe(127.5);

        expect(colorStops[2].ratio).toBe(127 / 255);
        expect(colorStops[2].R).toBe(0);
        expect(colorStops[2].G).toBe(0);
        expect(colorStops[2].B).toBe(255);
        expect(colorStops[2].A).toBe(191.25);
    });

});