//
// describe("Matrix.js toString test", function()
// {
//     it("toString test1 success", function()
//     {
//         const object = new Matrix();
//         expect(object.toString()).toBe("(a=1, b=0, c=0, d=1, tx=0, ty=0)");
//     });
//
//     it("toString test2 success", function()
//     {
//         const object = new Matrix(2, 3, 4, 5, 6, 7);
//         expect(object.toString()).toBe("(a=2, b=3, c=4, d=5, tx=6, ty=7)");
//     });
// });
//
//
// describe("Matrix.js static toString test", function()
// {
//
//     it("static toString test", function()
//     {
//         expect(Matrix.toString()).toBe("[class Matrix]");
//     });
//
// });
//
//
// describe("Matrix.js namespace test", function()
// {
//
//     it("namespace test public", function()
//     {
//         const object = new Matrix();
//         expect(object.namespace).toBe("next2d.geom.Matrix");
//     });
//
//     it("namespace test static", function()
//     {
//         expect(Matrix.namespace).toBe("next2d.geom.Matrix");
//     });
//
// });
//
//
// describe("Matrix.js property valid test and clone test", function()
// {
//
//     it("property success case1", function()
//     {
//         var m = new Matrix();
//         m.a   = 1.2;
//         m.b   = 0.765;
//         m.c   = -0.872;
//         m.d   = -1.5;
//         m.tx  = 10;
//         m.ty  = -10;
//
//         expect(m.a).toBe(1.2000000476837158);
//         expect(m.b).toBe(0.7649999856948853);
//         expect(m.c).toBe(-0.871999979019165);
//         expect(m.d).toBe(-1.5);
//         expect(m.tx).toBe(10);
//         expect(m.ty).toBe(-10);
//     });
//
//     it("property success case2", function()
//     {
//         var m = new Matrix();
//         m.a   = "1.2";
//         m.b   = "0.765";
//         m.c   = "-0.872";
//         m.d   = "-1.5";
//         m.tx  = "10";
//         m.ty  = "-10";
//
//         expect(m.a).toBe(1.2000000476837158);
//         expect(m.b).toBe(0.7649999856948853);
//         expect(m.c).toBe(-0.871999979019165);
//         expect(m.d).toBe(-1.5);
//         expect(m.tx).toBe(10);
//         expect(m.ty).toBe(-10);
//     });
//
//     it("valid and clone test", function()
//     {
//         // valid
//         var m1 = new Matrix("a", "b", "c", "d", "tx", "ty");
//         m1.a   = "a";
//         m1.b   = "b";
//         m1.c   = "c";
//         m1.d   = "d";
//         m1.tx  = "tx";
//         m1.ty  = "ty";
//
//         // clone matrix
//         var m2 = m1._$clone();
//         m2.a   = 1.2;
//         m2.b   = 0.765;
//         m2.c   = -0.872;
//         m2.d   = -1.5;
//         m2.tx  = 10;
//         m2.ty  = -10;
//
//         // origin
//         expect(isNaN(m1.a)).toBe(true);
//         expect(isNaN(m1.b)).toBe(true);
//         expect(isNaN(m1.c)).toBe(true);
//         expect(isNaN(m1.d)).toBe(true);
//         expect(isNaN(m1.tx)).toBe(true);
//         expect(isNaN(m1.ty)).toBe(true);
//
//         // clone
//         expect(m2.a).toBe(1.2000000476837158);
//         expect(m2.b).toBe(0.7649999856948853);
//         expect(m2.c).toBe(-0.871999979019165);
//         expect(m2.d).toBe(-1.5);
//         expect(m2.tx).toBe(10);
//         expect(m2.ty).toBe(-10);
//     });
// });
//
//
// describe("Matrix.js concat test", function()
// {
//     it("concat test1", function()
//     {
//         var m1 = new Matrix(2, 1, -1, 1, 0, 5);
//         var m2 = new Matrix(1.3, 0.75, 0, -1.5, 10, -10);
//         m1.concat(m2);
//         expect(m1.toString()).toBe(
//             "(a=2.5999999046325684, b=0, c=-1.2999999523162842, d=-2.25, tx=10, ty=-17.5)"
//         );
//     });
//
//     it("concat test2", function()
//     {
//         var m1 = new Matrix(2, 1, -1, 1, 0, 5);
//         var m2 = new Matrix(0, 0.75, 0, -1.5, 10, -10);
//         m1.concat(m2);
//         expect(m1.toString()).toBe(
//             "(a=0, b=0, c=0, d=-2.25, tx=10, ty=-17.5)"
//         );
//     });
//
//     it("concat test3", function()
//     {
//         var m1 = new Matrix(2, 1, -1, 1, 0, 5);
//         var m2 = new Matrix(1.3, 0, 0, -1.5, 10, -10);
//         m1.concat(m2);
//         expect(m1.toString()).toBe(
//             "(a=2.5999999046325684, b=-1.5, c=-1.2999999523162842, d=-1.5, tx=10, ty=-17.5)"
//         );
//     });
//
//     it("concat test4", function()
//     {
//         var m1 = new Matrix(2, 1, -1, 1, 0, 5);
//         var m2 = new Matrix(1.3, 0.75, 0, 0, 10, -10);
//         m1.concat(m2);
//         expect(m1.toString()).toBe(
//             "(a=2.5999999046325684, b=1.5, c=-1.2999999523162842, d=-0.75, tx=10, ty=-10)"
//         );
//     });
//
//     it("concat test5", function()
//     {
//         var m1 = new Matrix(2, 1, -1, 1, 0, 5);
//         var m2 = new Matrix(1.3, 0.75, 0, -1.5, 0, -10);
//         m1.concat(m2);
//         expect(m1.toString()).toBe(
//             "(a=2.5999999046325684, b=0, c=-1.2999999523162842, d=-2.25, tx=0, ty=-17.5)"
//         );
//     });
//
//     it("concat test6", function()
//     {
//         var m1 = new Matrix(2, 1, -1, 1, 0, 5);
//         var m2 = new Matrix(1.3, 0.75, 0, -1.5, 10, 0);
//         m1.concat(m2);
//         expect(m1.toString()).toBe(
//             "(a=2.5999999046325684, b=0, c=-1.2999999523162842, d=-2.25, tx=10, ty=-7.5)"
//         );
//     });
//
//     it("concat test7", function()
//     {
//         var m1 = new Matrix(1,0,0,1,0,0);
//         var m2 = new Matrix(1.3, 0.75, 0, -1.5, 10, -10);
//         m1.concat(m2);
//         expect(m1.toString()).toBe(
//             "(a=1.2999999523162842, b=0.75, c=0, d=-1.5, tx=10, ty=-10)"
//         );
//     });
//
//     it("concat test8", function()
//     {
//         var m1 = new Matrix(1,0,0,1,10,10);
//         var m2 = new Matrix(1.3, 0.75, 0, -1.5, 10, -10);
//         m1.concat(m2);
//         expect(m1.toString()).toBe(
//             "(a=1.2999999523162842, b=0.75, c=0, d=-1.5, tx=23, ty=-17.5)"
//         );
//     });
// });
//
//
// describe("Matrix.js rotate test", function()
// {
//     it("rotate test1", function()
//     {
//         var m = new Matrix(1, 0, 0, 1, 100, 110);
//         m.rotate(45 / 180 * Math.PI);
//         expect(m.toString()).toBe(
//             "(a=0.7071067690849304, b=0.7071067690849304, c=-0.7071067690849304, d=0.7071067690849304, tx=-7.071067810058594, ty=148.49241943359374)"
//         );
//     });
//
//     it("rotate test2", function()
//     {
//         var m = new Matrix(1, 0, 0, -1, 100, 110);
//         m.rotate(45 / 180 * Math.PI);
//         expect(m.toString()).toBe(
//             "(a=0.7071067690849304, b=0.7071067690849304, c=0.7071067690849304, d=-0.7071067690849304, tx=-7.071067810058594, ty=148.49241943359374)"
//         );
//     });
//
//     it("rotate test3", function()
//     {
//         var m = new Matrix(-1, 0, 0, 1, 100, 110);
//         m.rotate(45 / 180 * Math.PI);
//         expect(m.toString()).toBe(
//             "(a=-0.7071067690849304, b=-0.7071067690849304, c=-0.7071067690849304, d=0.7071067690849304, tx=-7.071067810058594, ty=148.49241943359374)"
//         );
//     });
//
//     it("rotate test4", function()
//     {
//         var m = new Matrix(-1, 0, 0, -1, 100, 110);
//         m.rotate(45 / 180 * Math.PI);
//         expect(m.toString()).toBe(
//             "(a=-0.7071067690849304, b=-0.7071067690849304, c=0.7071067690849304, d=-0.7071067690849304, tx=-7.071067810058594, ty=148.49241943359374)"
//         );
//     });
//
//     it("rotate test5", function()
//     {
//         var m = new Matrix(1, 10, 10, 1, 100, 110);
//         m.rotate(45 / 180 * Math.PI);
//         expect(m.toString()).toBe(
//             "(a=-6.363961219787598, b=7.77817440032959, c=6.363961219787598, d=7.77817440032959, tx=-7.071067810058594, ty=148.49241943359374)"
//         );
//     });
//
//     it("rotate test6", function()
//     {
//         var m = new Matrix(1, -10, 10, 1, 100, 110);
//         m.rotate(45 / 180 * Math.PI);
//         expect(m.toString()).toBe(
//             "(a=7.77817440032959, b=-6.363961219787598, c=6.363961219787598, d=7.77817440032959, tx=-7.071067810058594, ty=148.49241943359374)"
//         );
//     });
//
//     it("rotate test7", function()
//     {
//         var m = new Matrix(1, 10, -10, 1, 100, 110);
//         m.rotate(45 / 180 * Math.PI);
//         expect(m.toString()).toBe(
//             "(a=-6.363961219787598, b=7.77817440032959, c=-7.77817440032959, d=-6.363961219787598, tx=-7.071067810058594, ty=148.49241943359374)"
//         );
//     });
//
//     it("rotate test8", function()
//     {
//         var m = new Matrix(1, 10, 10, 1, -100, 110);
//         m.rotate(45 / 180 * Math.PI);
//         expect(m.toString()).toBe(
//             "(a=-6.363961219787598, b=7.77817440032959, c=6.363961219787598, d=7.77817440032959, tx=-148.49241943359374, ty=7.071067810058594)"
//         );
//     });
//
//     it("rotate test9", function()
//     {
//         var m = new Matrix(1, 10, 10, 1, 100, -110);
//         m.rotate(45 / 180 * Math.PI);
//         expect(m.toString()).toBe(
//             "(a=-6.363961219787598, b=7.77817440032959, c=6.363961219787598, d=7.77817440032959, tx=148.49241943359374, ty=-7.071067810058594)"
//         );
//     });
//
//     it("rotate test10", function()
//     {
//         var m = new Matrix(-1, -10, -10, -1, -100, -110);
//         m.rotate(45 / 180 * Math.PI);
//         expect(m.toString()).toBe(
//             "(a=6.363961219787598, b=-7.77817440032959, c=-6.363961219787598, d=-7.77817440032959, tx=7.071067810058594, ty=-148.49241943359374)"
//         );
//     });
//
//     it("rotate test11", function()
//     {
//         var m = new Matrix(-1, -10, -10, -1, -100, -110);
//         m.rotate(0.5);
//         expect(m.toString()).toBe(
//             "(a=3.916672706604004, b=-9.255250930786133, c=-8.29640007019043, d=-5.67183780670166, tx=-35.02144775390625, ty=-144.4766357421875)"
//         );
//     });
//
//     it("rotate test12", function()
//     {
//         var m = new Matrix(-1, -10, -10, -1, -100, -110);
//         m.rotate(-0.5);
//         expect(m.toString()).toBe(
//             "(a=-5.67183780670166, b=-8.29640007019043, c=-9.255250930786133, d=3.916672706604004, tx=-140.495068359375, ty=-48.5915283203125)"
//         );
//     });
//
//     it("rotate test13", function()
//     {
//         var m = new Matrix(-1, -10, -10, -1, -100, -110);
//         m.rotate(90 / 180 * Math.PI);
//         expect(m.toString()).toBe(
//             "(a=10, b=-1, c=1, d=-10, tx=110, ty=-100)"
//         );
//     });
//
//     it("rotate test14", function()
//     {
//         var m = new Matrix(-1, -10, -10, -1, -100, -110);
//         m.rotate(135 / 180 * Math.PI);
//         expect(m.toString()).toBe(
//             "(a=7.77817440032959, b=6.363961219787598, c=7.77817440032959, d=-6.363961219787598, tx=148.49241943359374, ty=7.071067810058594)"
//         );
//     });
//
//     it("rotate test15", function()
//     {
//         var m = new Matrix(-1, -10, -10, -1, -100, -110);
//         m.rotate(Math.PI);
//         expect(m.toString()).toBe(
//             "(a=1, b=10, c=10, d=1, tx=100, ty=110)"
//         );
//     });
//
//     it("rotate test16", function()
//     {
//         var m = new Matrix(-1, -10, -10, -1, -100, -110);
//         m.rotate(-45 / 180 * Math.PI);
//         expect(m.toString()).toBe(
//             "(a=-7.77817440032959, b=-6.363961219787598, c=-7.77817440032959, d=6.363961219787598, tx=-148.49241943359374, ty=-7.071067810058594)"
//         );
//     });
//
//     it("rotate test17", function()
//     {
//         var m = new Matrix(-1, -10, -10, -1, -100, -110);
//         m.rotate(-90 / 180 * Math.PI);
//         expect(m.toString()).toBe(
//             "(a=-10, b=1, c=-1, d=10, tx=-110, ty=100)"
//         );
//     });
//
//     it("rotate test18", function()
//     {
//         var m = new Matrix(-1, -10, -10, -1, -100, -110);
//         m.rotate(-135 / 180 * Math.PI);
//         expect(m.toString()).toBe(
//             "(a=-6.363961219787598, b=7.77817440032959, c=6.363961219787598, d=7.77817440032959, tx=-7.071067810058594, ty=148.49241943359374)"
//         );
//     });
//
//     it("rotate test19", function()
//     {
//         var m = new Matrix(-1, -10, -10, -1, -100, -110);
//         m.rotate(-1 * Math.PI);
//         expect(m.toString()).toBe(
//             "(a=1, b=10, c=10, d=1, tx=100, ty=110)"
//         );
//     });
//
//     it("rotate test20", function()
//     {
//         var m = new Matrix(-1, -10, -10, -1, -100, -110);
//         m.rotate("a");
//         expect(m.toString()).toBe(
//             "(a=NaN, b=NaN, c=NaN, d=NaN, tx=NaN, ty=NaN)"
//         );
//     });
//
//     it("rotate test21", function()
//     {
//         var m = new Matrix(-1, -10, -10, -1, -100, -110);
//         m.a = "a";
//         m.rotate(45 / 180 * Math.PI);
//         expect(m.toString()).toBe(
//             "(a=NaN, b=NaN, c=-6.363961219787598, d=-7.77817440032959, tx=7.071067810058594, ty=-148.49241943359374)"
//         );
//     });
//
//     it("rotate test22", function()
//     {
//         var m = new Matrix(-1, -10, -10, -1, -100, -110);
//         m.c = "a";
//         m.rotate(45 / 180 * Math.PI);
//         expect(m.toString()).toBe(
//             "(a=6.363961219787598, b=-7.77817440032959, c=NaN, d=NaN, tx=7.071067810058594, ty=-148.49241943359374)"
//         );
//     });
//
//     it("rotate test23", function()
//     {
//         var m = new Matrix(-1, -10, -10, -1, -100, -110);
//         m.tx = "a";
//         m.rotate(45 / 180 * Math.PI);
//         expect(m.toString()).toBe(
//             "(a=6.363961219787598, b=-7.77817440032959, c=-6.363961219787598, d=-7.77817440032959, tx=NaN, ty=NaN)"
//         );
//     });
// });
//
//
// describe("Matrix.js createGradientBox test", function()
// {
//     it("createGradientBox test1", function()
//     {
//         var m = new Matrix();
//         m.createGradientBox(1, 0, 9, 0, 0);
//         expect(m.toString()).toBe(
//             "(a=-0.0005561097641475499, b=0, c=-0.0002515371597837657, d=0, tx=0.5, ty=0)"
//         );
//     });
//
//     it("createGradientBox test2", function()
//     {
//         var m = new Matrix();
//         m.createGradientBox(1, 1, 9, 0, 0);
//         expect(m.toString()).toBe(
//             "(a=-0.0005561097641475499, b=0.0002515371597837657, c=-0.0002515371597837657, d=-0.0005561097641475499, tx=0.5, ty=0.5)"
//         );
//     });
//
//     it("createGradientBox test3", function()
//     {
//         var m = new Matrix();
//         m.createGradientBox(1, 0, 9, 1, 0);
//         expect(m.toString()).toBe(
//             "(a=-0.0005561097641475499, b=0, c=-0.0002515371597837657, d=0, tx=1.5, ty=0)"
//         );
//     });
//
//     it("createGradientBox test4", function()
//     {
//         var m = new Matrix();
//         m.createGradientBox(1, 0, 9, 0, 1);
//         expect(m.toString()).toBe(
//             "(a=-0.0005561097641475499, b=0, c=-0.0002515371597837657, d=0, tx=0.5, ty=1)"
//         );
//     });
//
//     it("createGradientBox test5", function()
//     {
//         var m = new Matrix();
//         m.createGradientBox(1, 1, 9, 1, 1);
//         expect(m.toString()).toBe(
//             "(a=-0.0005561097641475499, b=0.0002515371597837657, c=-0.0002515371597837657, d=-0.0005561097641475499, tx=1.5, ty=1.5)"
//         );
//     });
//
//     it("createGradientBox test6", function()
//     {
//         var m = new Matrix();
//         m.createGradientBox(-1, -1, -9, -1, -1);
//         expect(m.toString()).toBe(
//             "(a=0.0005561097641475499, b=0.0002515371597837657, c=-0.0002515371597837657, d=0.0005561097641475499, tx=-1.5, ty=-1.5)"
//         );
//     });
//
//     it("createGradientBox test7", function()
//     {
//         var m = new Matrix();
//         m.createGradientBox("a", -1, -9, -1, -1);
//         expect(m.toString()).toBe(
//             "(a=NaN, b=0.0002515371597837657, c=NaN, d=0.0005561097641475499, tx=NaN, ty=-1.5)"
//         );
//     });
//
//     it("createGradientBox test8", function()
//     {
//         var m = new Matrix();
//         m.createGradientBox(-1, "a", -9, -1, -1);
//         expect(m.toString()).toBe(
//             "(a=0.0005561097641475499, b=NaN, c=-0.0002515371597837657, d=NaN, tx=-1.5, ty=NaN)"
//         );
//     });
//
//     it("createGradientBox test9", function()
//     {
//         var m = new Matrix();
//         m.createGradientBox(-1, -1, "a", -1, -1);
//         expect(m.toString()).toBe(
//             "(a=NaN, b=NaN, c=NaN, d=NaN, tx=NaN, ty=NaN)"
//         );
//     });
//
//     it("createGradientBox test10", function()
//     {
//         var m = new Matrix();
//         m.createGradientBox(-1, -1, -9, "a", -1);
//         expect(m.toString()).toBe(
//             "(a=0.0005561097641475499, b=0.0002515371597837657, c=-0.0002515371597837657, d=0.0005561097641475499, tx=NaN, ty=-1.5)"
//         );
//     });
//
//     it("createGradientBox test11", function()
//     {
//         var m = new Matrix();
//         m.createGradientBox(-1, -1, -9, -1, "a");
//         expect(m.toString()).toBe(
//             "(a=0.0005561097641475499, b=0.0002515371597837657, c=-0.0002515371597837657, d=0.0005561097641475499, tx=-1.5, ty=NaN)"
//         );
//     });
//
//     it("createGradientBox test12", function()
//     {
//         var m = new Matrix();
//         m.createGradientBox(1, 1, 45 / 180 * Math.PI, 1, 1);
//         expect(m.toString()).toBe(
//             "(a=0.0004315837286412716, b=0.0004315837286412716, c=-0.0004315837286412716, d=0.0004315837286412716, tx=1.5, ty=1.5)"
//         );
//     });
//
//     it("createGradientBox test13", function()
//     {
//         var m = new Matrix();
//         m.createGradientBox(1, 1, 90 / 180 * Math.PI, 1, 1);
//         expect(m.toString()).toBe(
//             "(a=3.7373254383716084e-20, b=0.0006103515625, c=-0.0006103515625, d=3.7373254383716084e-20, tx=1.5, ty=1.5)"
//         );
//     });
//
//     it("createGradientBox test14", function()
//     {
//         var m = new Matrix();
//         m.createGradientBox(1, 1, 135 / 180 * Math.PI, 1, 1);
//         expect(m.toString()).toBe(
//             "(a=-0.0004315837286412716, b=0.0004315837286412716, c=-0.0004315837286412716, d=-0.0004315837286412716, tx=1.5, ty=1.5)"
//         );
//     });
//
//     it("createGradientBox test15", function()
//     {
//         var m = new Matrix();
//         m.createGradientBox(1, 1, 180 / 180 * Math.PI, 1, 1);
//         expect(m.toString()).toBe(
//             "(a=-0.0006103515625, b=7.474650876743217e-20, c=-7.474650876743217e-20, d=-0.0006103515625, tx=1.5, ty=1.5)"
//         );
//     });
//
//     it("createGradientBox test16", function()
//     {
//         var m = new Matrix();
//         m.createGradientBox(1, 1, -45 / 180 * Math.PI, 1, 1);
//         expect(m.toString()).toBe(
//             "(a=0.0004315837286412716, b=-0.0004315837286412716, c=0.0004315837286412716, d=0.0004315837286412716, tx=1.5, ty=1.5)"
//         );
//     });
//
//     it("createGradientBox test17", function()
//     {
//         var m = new Matrix();
//         m.createGradientBox(1, 1, -90 / 180 * Math.PI, 1, 1);
//         expect(m.toString()).toBe(
//             "(a=3.7373254383716084e-20, b=-0.0006103515625, c=0.0006103515625, d=3.7373254383716084e-20, tx=1.5, ty=1.5)"
//         );
//     });
//
//     it("createGradientBox test18", function()
//     {
//         var m = new Matrix();
//         m.createGradientBox(1, 1, -135 / 180 * Math.PI, 1, 1);
//         expect(m.toString()).toBe(
//             "(a=-0.0004315837286412716, b=-0.0004315837286412716, c=0.0004315837286412716, d=-0.0004315837286412716, tx=1.5, ty=1.5)"
//         );
//     });
//
//     it("createGradientBox test19", function()
//     {
//         var m = new Matrix();
//         m.createGradientBox(1, 1, -180 / 180 * Math.PI, 1, 1);
//         expect(m.toString()).toBe(
//             "(a=-0.0006103515625, b=-7.474650876743217e-20, c=7.474650876743217e-20, d=-0.0006103515625, tx=1.5, ty=1.5)"
//         );
//     });
// });
//
//
// describe("Matrix.js createBox test", function()
// {
//     it("createBox test1", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = 2.0;
//         var sy = 3.0;
//         var r  = 2 * Math.PI * (45 / 360);
//         var tx = 10;
//         var ty = 20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=1.4142135381698608, b=2.1213202476501465, c=-1.4142135381698608, d=2.1213202476501465, tx=10, ty=20)"
//         );
//     });
//
//     it("createBox test2", function()
//     {
//         var m = new Matrix(-1, 0.5, -0.2);
//         var sx = 2.0;
//         var sy = 3.0;
//         var r  = 2 * Math.PI * (45 / 360);
//         var tx = 10;
//         var ty = 20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=1.4142135381698608, b=2.1213202476501465, c=-1.4142135381698608, d=2.1213202476501465, tx=10, ty=20)"
//         );
//     });
//
//     it("createBox test3", function()
//     {
//         var m = new Matrix(-1, -0.5, -0.2);
//         var sx = 2.0;
//         var sy = 3.0;
//         var r  = 2 * Math.PI * (45 / 360);
//         var tx = 10;
//         var ty = 20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=1.4142135381698608, b=2.1213202476501465, c=-1.4142135381698608, d=2.1213202476501465, tx=10, ty=20)"
//         );
//     });
//
//     it("createBox test4", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = 2.0;
//         var sy = 3.0;
//         var r  = -2 * Math.PI * (45 / 360);
//         var tx = 10;
//         var ty = 20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=2.1213202476501465, tx=10, ty=20)"
//         );
//     });
//
//     it("createBox test5", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = 2 * Math.PI * (45 / 360);
//         var tx = 10;
//         var ty = 20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=-1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=-2.1213202476501465, tx=10, ty=20)"
//         );
//     });
//
//     it("createBox test6", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = 2.0;
//         var sy = 3.0;
//         var r  = 2 * Math.PI * (45 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=1.4142135381698608, b=2.1213202476501465, c=-1.4142135381698608, d=2.1213202476501465, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test7", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = -2 * Math.PI * (45 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=-1.4142135381698608, b=2.1213202476501465, c=-1.4142135381698608, d=-2.1213202476501465, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test8", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = -2 * Math.PI * (90 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=-1.2246468525851679e-16, b=3, c=-2, d=-1.8369702788777518e-16, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test9", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = -2 * Math.PI * (135 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=1.4142135381698608, b=2.1213202476501465, c=-1.4142135381698608, d=2.1213202476501465, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test10", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = -2 * Math.PI * (180 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=2, b=3.6739405577555036e-16, c=-2.4492937051703357e-16, d=3, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test11", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = -2 * Math.PI * (225 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=2.1213202476501465, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test12", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = -2 * Math.PI * (270 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=3.6739402930577075e-16, b=-3, c=2, d=5.510910704284357e-16, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test13", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = -2 * Math.PI * (315 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//
//         expect(m.a).toBe(-1.4142135381698608);
//         expect(m.b).toBe(-2.1213202476501465);
//         expect(m.c).toBe(1.4142135381698608);
//         expect(m.d).toBe(-2.1213202476501465);
//         expect(m.tx).toBe(-10);
//         expect(m.ty).toBe(-20);
//     });
//
//     it("createBox test14", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = -2 * Math.PI * (360 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=-2, b=-7.347881115511007e-16, c=4.898587410340671e-16, d=-3, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test15", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = "a";
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=NaN, b=NaN, c=NaN, d=NaN, tx=NaN, ty=NaN)"
//         );
//     });
//
//     it("createBox test16", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = "a";
//         var sy = -3.0;
//         var r  = 2 * Math.PI * (45 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=NaN, b=-2.1213202476501465, c=NaN, d=-2.1213202476501465, tx=NaN, ty=-20)"
//         );
//     });
//
//     it("createBox test17", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = 2 * Math.PI * (45 / 360);
//         var tx = "a";
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=-1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=-2.1213202476501465, tx=NaN, ty=-20)"
//         );
//     });
//
//     it("createBox test18", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         m.a = "a";
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = 2 * Math.PI * (45 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=-1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=-2.1213202476501465, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test19", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         m.c = "a";
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = 2 * Math.PI * (45 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=-1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=-2.1213202476501465, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test20", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         m.tx = "a";
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = 2 * Math.PI * (45 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=-1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=-2.1213202476501465, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test21", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = 0;
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=-2, b=0, c=0, d=-3, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test22", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = 2 * Math.PI * (45 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=-1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=-2.1213202476501465, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test23", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = 2 * Math.PI * (90 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=-1.2246468525851679e-16, b=-3, c=2, d=-1.8369702788777518e-16, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test24", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = 2 * Math.PI * (135 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=2.1213202476501465, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test25", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = 2 * Math.PI * (180 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=2, b=-3.6739405577555036e-16, c=2.4492937051703357e-16, d=3, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test26", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = 2 * Math.PI * (225 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=1.4142135381698608, b=2.1213202476501465, c=-1.4142135381698608, d=2.1213202476501465, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test27", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = 2 * Math.PI * (270 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=3.6739402930577075e-16, b=3, c=-2, d=5.510910704284357e-16, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test28", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = 2 * Math.PI * (315 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//
//         expect(m.a).toBe(-1.4142135381698608);
//         expect(m.b).toBe(2.1213202476501465);
//         expect(m.c).toBe(-1.4142135381698608);
//         expect(m.d).toBe(-2.1213202476501465);
//         expect(m.tx).toBe(-10);
//         expect(m.ty).toBe(-20);
//     });
//
//     it("createBox test29", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = 2 * Math.PI * (360 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=-2, b=7.347881115511007e-16, c=-4.898587410340671e-16, d=-3, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test30", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = Math.PI * (45 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=-1.8477590084075928, b=-1.148050308227539, c=0.7653668522834778, d=-2.7716383934020996, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test31", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = Math.PI * (90 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=-1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=-2.1213202476501465, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test32", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = Math.PI * (135 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=-0.7653668522834778, b=-2.7716383934020996, c=1.8477590084075928, d=-1.148050308227539, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test33", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = Math.PI * (180 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=-1.2246468525851679e-16, b=-3, c=2, d=-1.8369702788777518e-16, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test34", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = Math.PI * (225 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=0.7653668522834778, b=-2.7716383934020996, c=1.8477590084075928, d=1.148050308227539, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test35", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = Math.PI * (270 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=2.1213202476501465, tx=-10, ty=-20)"
//         );
//     });
//
//     it("createBox test36", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = Math.PI * (315 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//
//         expect(m.a).toBe(1.8477590084075928);
//         expect(m.b).toBe(-1.148050308227539);
//         expect(m.c).toBe(0.7653668522834778);
//         expect(m.d).toBe(2.7716383934020996);
//         expect(m.tx).toBe(-10);
//         expect(m.ty).toBe(-20);
//     });
//
//     it("createBox test37", function()
//     {
//         var m = new Matrix(1, 0.5, -0.2);
//         var sx = -2.0;
//         var sy = -3.0;
//         var r  = Math.PI * (360 / 360);
//         var tx = -10;
//         var ty = -20;
//         m.createBox(sx, sy, r, tx, ty);
//         expect(m.toString()).toBe(
//             "(a=2, b=-3.6739405577555036e-16, c=2.4492937051703357e-16, d=3, tx=-10, ty=-20)"
//         );
//     });
// });
//
//
// describe("Matrix.js invert test", function()
// {
//     it("invert test1", function()
//     {
//         var m = new Matrix(2, 1, 1, 2, -200, -200);
//         m.invert();
//         expect(m.toString()).toBe(
//             "(a=0.6666666865348816, b=-0.3333333432674408, c=-0.3333333432674408, d=0.6666666865348816, tx=66.66666870117187, ty=66.66666870117187)"
//         );
//     });
//
//     it("invert test2", function()
//     {
//         var m = new Matrix(2, 1, 1, 2, -200, -200);
//         m.invert();
//         m.invert();
//         expect(m.toString()).toBe(
//             "(a=2, b=1, c=1, d=2, tx=-200, ty=-200)"
//         );
//     });
//
//     it("invert test3", function()
//     {
//         var m = new Matrix(-2, 1, 1, 2, -200, -200);
//         m.invert();
//         expect(m.toString()).toBe(
//             "(a=-0.4000000059604645, b=0.20000000298023224, c=0.20000000298023224, d=0.4000000059604645, tx=-40, ty=120)"
//         );
//     });
//
//     it("invert test4", function()
//     {
//         var m = new Matrix(2, -1, 1, 2, -200, -200);
//         m.invert();
//         expect(m.toString()).toBe(
//             "(a=0.4000000059604645, b=0.20000000298023224, c=-0.20000000298023224, d=0.4000000059604645, tx=40, ty=120)"
//         );
//     });
//
//     it("invert test5", function()
//     {
//         var m = new Matrix(2, 1, -1, 2, -200, -200);
//         m.invert();
//         expect(m.toString()).toBe(
//             "(a=0.4000000059604645, b=-0.20000000298023224, c=0.20000000298023224, d=0.4000000059604645, tx=120, ty=40)"
//         );
//     });
//
//     it("invert test6", function()
//     {
//         var m = new Matrix(2, 1, 1, -2, -200, -200);
//         m.invert();
//         expect(m.toString()).toBe(
//             "(a=0.4000000059604645, b=0.20000000298023224, c=0.20000000298023224, d=-0.4000000059604645, tx=120, ty=-40)"
//         );
//     });
//
//     it("invert test7", function()
//     {
//         var m = new Matrix(-2, -1, -1, -2, -200, -200);
//         m.invert();
//         expect(m.toString()).toBe(
//             "(a=-0.6666666865348816, b=0.3333333432674408, c=0.3333333432674408, d=-0.6666666865348816, tx=-66.66666870117187, ty=-66.66666870117187)"
//         );
//     });
//
//     it("invert test8", function()
//     {
//         var m = new Matrix("a", -1, -1, -2, -200, -200);
//         m.invert();
//         expect(m.toString()).toBe(
//             "(a=NaN, b=NaN, c=NaN, d=NaN, tx=NaN, ty=NaN)"
//         );
//     });
// });
//
//
// describe("Matrix.js transformPoint test", function()
// {
//     it("transformPoint test1", function()
//     {
//         var m = new Matrix(1, 0, 0, 1, 100, 110);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.transformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=-19.79898965358734, y=164.0487683534622)"
//         );
//     });
//
//     it("transformPoint test2", function()
//     {
//         var m = new Matrix(1, 1, 0, 1, 100, 110);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.transformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=-21.213203191757202, y=165.46298189163207)"
//         );
//     });
//
//     it("transformPoint test3", function()
//     {
//         var m = new Matrix(1, 0, 1, 1, 100, 110);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.transformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=-5.656854271888731, y=178.19090373516082)"
//         );
//     });
//
//     it("transformPoint test4", function()
//     {
//         var m = new Matrix(1, 1, 1, 1, 100, 110);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.transformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=-7.071067810058591, y=179.60511727333068)"
//         );
//     });
//
//     it("transformPoint test5", function()
//     {
//         var m = new Matrix(-1, -1, -1, -1, 100, 110);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.transformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=-7.071067810058596, y=117.37972159385681)"
//         );
//     });
//
//     it("transformPoint test6", function()
//     {
//         var m = new Matrix(-1, -1, -1, -1, 100, 110);
//         m.rotate("a");
//
//         var p1 = new Point(2, 20);
//         var p2 = m.transformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=NaN, y=NaN)"
//         );
//     });
//
//     it("transformPoint test7", function()
//     {
//         var m = new Matrix(-1, -1, -1, -1, 100, 110);
//         m.a = "a";
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.transformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=NaN, y=NaN)"
//         );
//     });
//
//     it("transformPoint test8", function()
//     {
//         var m = new Matrix(-1, -1, -1, -1, 100, 110);
//         m.c = "a";
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.transformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=NaN, y=NaN)"
//         );
//     });
//
//     it("transformPoint test9", function()
//     {
//         var m = new Matrix(-1, -1, -1, -1, 100, 110);
//         m.tx = "a";
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.transformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=NaN, y=NaN)"
//         );
//     });
//
//     it("transformPoint test10", function()
//     {
//         var m = new Matrix(-1, -1, -1, -1, 100, 110);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         p1.x = "a";
//         var p2 = m.transformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=NaN, y=NaN)"
//         );
//     });
//
//     it("transformPoint test11", function()
//     {
//         var m = new Matrix(-1, -1, -1, -1, 100, 110);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.transformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=-7.071067810058596, y=117.37972159385681)"
//         );
//     });
//
//     it("transformPoint test12", function()
//     {
//         var m = new Matrix(-1, -1, -1, -1, 100, 110);
//         m.rotate(90 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.transformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=-88, y=78)"
//         );
//     });
//
//     it("transformPoint test13", function()
//     {
//         var m = new Matrix(-1, -1, -1, -1, 100, 110);
//         m.rotate(135 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.transformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=-117.37972159385681, y=-7.071067810058596)"
//         );
//     });
//
//     it("transformPoint test14", function()
//     {
//         var m = new Matrix(-1, -1, -1, -1, 100, 110);
//         m.rotate(180 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.transformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=-78, y=-88)"
//         );
//     });
//
//     it("transformPoint test15", function()
//     {
//         var m = new Matrix(-1, -1, -1, -1, 100, 110);
//         m.rotate(-45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.transformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=117.37972159385681, y=7.071067810058591)"
//         );
//     });
//
//     it("transformPoint test16", function()
//     {
//         var m = new Matrix(-1, -1, -1, -1, 100, 110);
//         m.rotate(-90 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.transformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=88, y=-78)"
//         );
//     });
//
//     it("transformPoint test17", function()
//     {
//         var m = new Matrix(-1, -1, -1, -1, 100, 110);
//         m.rotate(-135 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.transformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=7.071067810058591, y=-117.37972159385681)"
//         );
//     });
//
//     it("transformPoint test18", function()
//     {
//         var m = new Matrix(-1, -1, -1, -1, 100, 110);
//         m.rotate(-180 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.transformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=-78, y=-88)"
//         );
//     });
// });
//
//
// describe("Matrix.js deltaTransformPoint test", function()
// {
//     it("deltaTransformPoint test1", function()
//     {
//         var m = new Matrix(1, 0, 0, 1, 100, 110);
//         m.translate(10, 0);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=-12.727921843528748, y=15.55634891986847)"
//         );
//     });
//
//     it("deltaTransformPoint test2", function()
//     {
//         var m = new Matrix(10, 0, 0, 1, 100, 110);
//         m.translate(10, 0);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=2.384185791015625e-7, y=28.284271001815796)"
//         );
//     });
//
//     it("deltaTransformPoint test3", function()
//     {
//         var m = new Matrix(1, 10, 0, 1, 100, 110);
//         m.translate(10, 0);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=-26.870057821273804, y=29.698484182357788)"
//         );
//     });
//
//     it("deltaTransformPoint test4", function()
//     {
//         var m = new Matrix(1, 0, 10, 1, 100, 110);
//         m.translate(10, 0);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=128.6934379339218, y=156.97770154476166)"
//         );
//     });
//
//     it("deltaTransformPoint test5", function()
//     {
//         var m = new Matrix(1, 0, 0, 10, 100, 110);
//         m.translate(10, 0);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=-140.007142663002, y=142.83556973934174)"
//         );
//     });
//
//     it("deltaTransformPoint test6", function()
//     {
//         var m = new Matrix(-1, 0, 0, 1, 100, 110);
//         m.translate(10, 0);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=-15.55634891986847, y=12.727921843528748)"
//         );
//     });
//
//     it("deltaTransformPoint test7", function()
//     {
//         var m = new Matrix(1, 0, 0, -1, 100, 110);
//         m.translate(10, 0);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=15.55634891986847, y=-12.727921843528748)"
//         );
//     });
//
//     it("deltaTransformPoint test8", function()
//     {
//         var m = new Matrix(-1, 0, 0, -1, 100, 110);
//         m.translate(10, 0);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=12.727921843528748, y=-15.55634891986847)"
//         );
//     });
//
//     it("deltaTransformPoint test9", function()
//     {
//         var m = new Matrix(-1, -1, 0, -1, 100, 110);
//         m.translate(10, 0);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=14.142135381698608, y=-16.97056245803833)"
//         );
//     });
//
//     it("deltaTransformPoint test10", function()
//     {
//         var m = new Matrix(-1, 0, -1, -1, 100, 110);
//         m.translate(10, 0);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=-1.414213538169863, y=-29.698484301567078)"
//         );
//     });
//
//     it("deltaTransformPoint test11", function()
//     {
//         var m = new Matrix(-1, -1, -1, -1, 100, 110);
//         m.translate(10, 0);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=-2.4424906541753444e-15, y=-31.11269783973694)"
//         );
//     });
//
//     it("deltaTransformPoint test12", function()
//     {
//         var m = new Matrix("a", 1, 1, 1, 100, 110);
//         m.translate(10, 0);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=NaN, y=NaN)"
//         );
//     });
//
//     it("deltaTransformPoint test13", function()
//     {
//         var m = new Matrix(1, 1, 1, 1, 100, 110);
//         m.translate("a", 0);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=2.4424906541753444e-15, y=31.11269783973694)"
//         );
//     });
//
//     it("deltaTransformPoint test14", function()
//     {
//         var m = new Matrix(1, 1, 1, 1, 100, 110);
//         m.translate(10, "a");
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=2.4424906541753444e-15, y=31.11269783973694)"
//         );
//     });
//
//     it("deltaTransformPoint test15", function()
//     {
//         var m = new Matrix(1, 1, 1, 1, 100, 110);
//         m.translate(10, 0);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point("a", 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=NaN, y=NaN)"
//         );
//     });
//
//     it("deltaTransformPoint test16", function()
//     {
//         var m = new Matrix(1, 1, 1, 1, 100, 110);
//         m.translate(10, 0);
//         m.rotate(45 / 180 * Math.PI);
//
//         var p1 = new Point(2, "a");
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=NaN, y=NaN)"
//         );
//     });
//
//     it("deltaTransformPoint test17", function()
//     {
//         var m = new Matrix(1, 1, 1, 1, 100, 110);
//         m.translate(10, 0);
//         m.rotate("a");
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=NaN, y=NaN)"
//         );
//     });
//
//     it("deltaTransformPoint test18", function()
//     {
//         var m = new Matrix(1, 1, 1, 1, 100, 110);
//         m.translate(10, 0);
//         m.rotate(90 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=-22, y=22)"
//         );
//     });
//
//     it("deltaTransformPoint test19", function()
//     {
//         var m = new Matrix(1, 1, 1, 1, 100, 110);
//         m.translate(10, 0);
//         m.rotate(135 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=-31.11269783973694, y=2.4424906541753444e-15)"
//         );
//     });
//
//     it("deltaTransformPoint test20", function()
//     {
//         var m = new Matrix(1, 1, 1, 1, 100, 110);
//         m.translate(10, 0);
//         m.rotate(180 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=-22, y=-22)"
//         );
//     });
//
//     it("deltaTransformPoint test21", function()
//     {
//         var m = new Matrix(1, 1, 1, 1, 100, 110);
//         m.translate(10, 0);
//         m.rotate(-45 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=31.11269783973694, y=2.4424906541753444e-15)"
//         );
//     });
//
//     it("deltaTransformPoint test22", function()
//     {
//         var m = new Matrix(1, 1, 1, 1, 100, 110);
//         m.translate(10, 0);
//         m.rotate(-90 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=22, y=-22)"
//         );
//     });
//
//     it("deltaTransformPoint test23", function()
//     {
//         var m = new Matrix(1, 1, 1, 1, 100, 110);
//         m.translate(10, 0);
//         m.rotate(-135 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=2.4424906541753444e-15, y=-31.11269783973694)"
//         );
//     });
//
//     it("deltaTransformPoint test24", function()
//     {
//         var m = new Matrix(1, 1, 1, 1, 100, 110);
//         m.translate(10, 0);
//         m.rotate(-180 / 180 * Math.PI);
//
//         var p1 = new Point(2, 20);
//         var p2 = m.deltaTransformPoint(p1);
//
//         expect(p2.toString()).toBe(
//             "(x=-22, y=-22)"
//         );
//     });
// });
//
//
// describe("Matrix.js pattern test", function()
// {
//
//     it("pattern test case1", function()
//     {
//         var matrix = new Matrix();
//
//         // 単位行列化
//         matrix.identity();
//         // 拡大縮小成分を乗算
//         matrix.scale( 256/1638.4 , 256/1638.4 );
//         // 角度成分を乗算
//         matrix.rotate( 0.0 * (Math.PI / 180) );
//         // 移動成分を乗算
//         matrix.translate( 128.0 , 128.0 );
//
//         expect(matrix.toString()).toBe("(a=0.15625, b=0, c=0, d=0.15625, tx=128, ty=128)");
//     });
//
// });
//
//
// describe("Matrix.js scale test", function()
// {
//
//     it("scale test case1", function()
//     {
//         var matrix = new Matrix(1, 0.5, -0.5, 1, 0, 0);
//         matrix.scale(2, 2);
//         expect(matrix.toString()).toBe("(a=2, b=1, c=-1, d=2, tx=0, ty=0)");
//     });
//
//     it("scale test case2", function()
//     {
//         var matrix = new Matrix(1, 0.5, -0.5, 1, 0, 0);
//         matrix.scale(2, 3);
//         expect(matrix.toString()).toBe("(a=2, b=1.5, c=-1, d=3, tx=0, ty=0)");
//     });
//
//     it("scale test case3", function()
//     {
//         var matrix = new Matrix(1, 0.5, -0.5, 1, 0, 0);
//         matrix.scale(3, 2);
//         expect(matrix.toString()).toBe("(a=3, b=1, c=-1.5, d=2, tx=0, ty=0)");
//     });
//
//     it("scale test case4", function()
//     {
//         var matrix = new Matrix(1, 0.5, -0.5, 1, 10, 0);
//         matrix.scale(-1, 2);
//         expect(matrix.toString()).toBe("(a=-1, b=1, c=0.5, d=2, tx=-10, ty=0)");
//     });
//
//     it("scale test case5", function()
//     {
//         var matrix = new Matrix(1, 0.5, -0.5, 1, 0, 10);
//         matrix.scale(3, -2);
//         expect(matrix.toString()).toBe("(a=3, b=-1, c=-1.5, d=-2, tx=0, ty=-20)");
//     });
//
//     it("scale test case6", function()
//     {
//         var matrix = new Matrix(1, 0.5, -0.5, 1, 0, 10);
//         matrix.scale("a", 2);
//         expect(matrix.toString()).toBe("(a=NaN, b=1, c=NaN, d=2, tx=NaN, ty=20)");
//     });
//
// });
//
//
// describe("Matrix.js a test", function()
// {
//
//     it("default test case1", function()
//     {
//         var m = new Matrix();
//         expect(m.a).toBe(1);
//     });
//
//     it("default test case2", function()
//     {
//         var m = new Matrix();
//         m.a = null;
//         expect(m.a).toBe(0);
//     });
//
//     it("default test case3", function()
//     {
//         var m = new Matrix();
//         m.a = undefined;
//         expect(isNaN(m.a)).toBe(true);
//     });
//
//     it("default test case4", function()
//     {
//         var m = new Matrix();
//         m.a = true;
//         expect(m.a).toBe(1);
//     });
//
//     it("default test case5", function()
//     {
//         var m = new Matrix();
//         m.a = "";
//         expect(m.a).toBe(0);
//     });
//
//     it("default test case6", function()
//     {
//         var m = new Matrix();
//         m.a = "abc";
//         expect(isNaN(m.a)).toBe(true);
//     });
//
//     it("default test case7", function()
//     {
//         var m = new Matrix();
//         m.a = 0;
//         expect(m.a).toBe(0);
//     });
//
//     it("default test case8", function()
//     {
//         var m = new Matrix();
//         m.a = 1;
//         expect(m.a).toBe(1);
//     });
//
//     it("default test case9", function()
//     {
//         var m = new Matrix();
//         m.a = 500;
//         expect(m.a).toBe(500);
//     });
//
//     it("default test case10", function()
//     {
//         var m = new Matrix();
//         m.a = 50000000000000000;
//         expect(m.a).toBe(49999999215337470);
//     });
//
//     it("default test case11", function()
//     {
//         var m = new Matrix();
//         m.a = -1;
//         expect(m.a).toBe(-1);
//     });
//
//     it("default test case12", function()
//     {
//         var m = new Matrix();
//         m.a = -500;
//         expect(m.a).toBe(-500);
//     });
//
//     it("default test case13", function()
//     {
//         var m = new Matrix();
//         m.a = -50000000000000000;
//         expect(m.a).toBe(-49999999215337470);
//     });
//
//     it("default test case14", function()
//     {
//         var m = new Matrix();
//         m.a = {a:0};
//         expect(isNaN(m.a)).toBe(true);
//     });
//
//     it("default test case15", function()
//     {
//         var m = new Matrix();
//         m.a = function a(){};
//         expect(isNaN(m.a)).toBe(true);
//     });
//
//     it("default test case16", function()
//     {
//         var m = new Matrix();
//         m.a = [1];
//         expect(m.a).toBe(1);
//     });
//
//     it("default test case17", function()
//     {
//         var m = new Matrix();
//         m.a = [1,2];
//         expect(isNaN(m.a)).toBe(true);
//     });
//
//     it("default test case18", function()
//     {
//         var m = new Matrix();
//         m.a = {};
//         expect(isNaN(m.a)).toBe(true);
//     });
//
//     it("default test case19", function()
//     {
//         var m = new Matrix();
//         m.a = {toString:function () { return 1; } };
//         expect(m.a).toBe(1);
//     });
//
//     it("default test case20", function()
//     {
//         var m = new Matrix();
//         m.a = {toString:function () { return "1"; } };
//         expect(m.a).toBe(1);
//     });
//
//     it("default test case21", function()
//     {
//         var m = new Matrix();
//         m.a = {toString:function () { return "1a"; } };
//         expect(isNaN(m.a)).toBe(true);
//     });
//
// });
//
//
// describe("Matrix.js b test", function()
// {
//
//     it("default test case1", function()
//     {
//         var m = new Matrix();
//         expect(m.b).toBe(0);
//     });
//
//     it("default test case2", function()
//     {
//         var m = new Matrix();
//         m.b = null;
//         expect(m.b).toBe(0);
//     });
//
//     it("default test case3", function()
//     {
//         var m = new Matrix();
//         m.b = undefined;
//         expect(isNaN(m.b)).toBe(true);
//     });
//
//     it("default test case4", function()
//     {
//         var m = new Matrix();
//         m.b = true;
//         expect(m.b).toBe(1);
//     });
//
//     it("default test case5", function()
//     {
//         var m = new Matrix();
//         m.b = "";
//         expect(m.b).toBe(0);
//     });
//
//     it("default test case6", function()
//     {
//         var m = new Matrix();
//         m.b = "abc";
//         expect(isNaN(m.b)).toBe(true);
//     });
//
//     it("default test case7", function()
//     {
//         var m = new Matrix();
//         m.b = 0;
//         expect(m.b).toBe(0);
//     });
//
//     it("default test case8", function()
//     {
//         var m = new Matrix();
//         m.b = 1;
//         expect(m.b).toBe(1);
//     });
//
//     it("default test case9", function()
//     {
//         var m = new Matrix();
//         m.b = 500;
//         expect(m.b).toBe(500);
//     });
//
//     it("default test case10", function()
//     {
//         var m = new Matrix();
//         m.b = 50000000000000000;
//         expect(m.b).toBe(49999999215337470);
//     });
//
//     it("default test case11", function()
//     {
//         var m = new Matrix();
//         m.b = -1;
//         expect(m.b).toBe(-1);
//     });
//
//     it("default test case12", function()
//     {
//         var m = new Matrix();
//         m.b = -500;
//         expect(m.b).toBe(-500);
//     });
//
//     it("default test case13", function()
//     {
//         var m = new Matrix();
//         m.b = -50000000000000000;
//         expect(m.b).toBe(-49999999215337470);
//     });
//
//     it("default test case14", function()
//     {
//         var m = new Matrix();
//         m.b = {a:0};
//         expect(isNaN(m.b)).toBe(true);
//     });
//
//     it("default test case15", function()
//     {
//         var m = new Matrix();
//         m.b = function a(){};
//         expect(isNaN(m.b)).toBe(true);
//     });
//
//     it("default test case16", function()
//     {
//         var m = new Matrix();
//         m.b = [1];
//         expect(m.b).toBe(1);
//     });
//
//     it("default test case17", function()
//     {
//         var m = new Matrix();
//         m.b = [1,2];
//         expect(isNaN(m.b)).toBe(true);
//     });
//
//     it("default test case18", function()
//     {
//         var m = new Matrix();
//         m.b = {};
//         expect(isNaN(m.b)).toBe(true);
//     });
//
//     it("default test case19", function()
//     {
//         var m = new Matrix();
//         m.b = {toString:function () { return 1; } };
//         expect(m.b).toBe(1);
//     });
//
//     it("default test case20", function()
//     {
//         var m = new Matrix();
//         m.b = {toString:function () { return "1"; } };
//         expect(m.b).toBe(1);
//     });
//
//     it("default test case21", function()
//     {
//         var m = new Matrix();
//         m.b = {toString:function () { return "1a"; } };
//         expect(isNaN(m.b)).toBe(true);
//     });
//
// });
//
//
// describe("Matrix.js c test", function()
// {
//
//     it("default test case1", function()
//     {
//         var m = new Matrix();
//         expect(m.c).toBe(0);
//     });
//
//     it("default test case2", function()
//     {
//         var m = new Matrix();
//         m.c = null;
//         expect(m.c).toBe(0);
//     });
//
//     it("default test case3", function()
//     {
//         var m = new Matrix();
//         m.c = undefined;
//         expect(isNaN(m.c)).toBe(true);
//     });
//
//     it("default test case4", function()
//     {
//         var m = new Matrix();
//         m.c = true;
//         expect(m.c).toBe(1);
//     });
//
//     it("default test case5", function()
//     {
//         var m = new Matrix();
//         m.c = "";
//         expect(m.c).toBe(0);
//     });
//
//     it("default test case6", function()
//     {
//         var m = new Matrix();
//         m.c = "abc";
//         expect(isNaN(m.c)).toBe(true);
//     });
//
//     it("default test case7", function()
//     {
//         var m = new Matrix();
//         m.c = 0;
//         expect(m.c).toBe(0);
//     });
//
//     it("default test case8", function()
//     {
//         var m = new Matrix();
//         m.c = 1;
//         expect(m.c).toBe(1);
//     });
//
//     it("default test case9", function()
//     {
//         var m = new Matrix();
//         m.c = 500;
//         expect(m.c).toBe(500);
//     });
//
//     it("default test case10", function()
//     {
//         var m = new Matrix();
//         m.c = 50000000000000000;
//         expect(m.c).toBe(49999999215337470);
//     });
//
//     it("default test case11", function()
//     {
//         var m = new Matrix();
//         m.c = -1;
//         expect(m.c).toBe(-1);
//     });
//
//     it("default test case12", function()
//     {
//         var m = new Matrix();
//         m.c = -500;
//         expect(m.c).toBe(-500);
//     });
//
//     it("default test case13", function()
//     {
//         var m = new Matrix();
//         m.c = -50000000000000000;
//         expect(m.c).toBe(-49999999215337470);
//     });
//
//     it("default test case14", function()
//     {
//         var m = new Matrix();
//         m.c = {a:0};
//         expect(isNaN(m.c)).toBe(true);
//     });
//
//     it("default test case15", function()
//     {
//         var m = new Matrix();
//         m.c = function a(){};
//         expect(isNaN(m.c)).toBe(true);
//     });
//
//     it("default test case16", function()
//     {
//         var m = new Matrix();
//         m.c = [1];
//         expect(m.c).toBe(1);
//     });
//
//     it("default test case17", function()
//     {
//         var m = new Matrix();
//         m.c = [1,2];
//         expect(isNaN(m.c)).toBe(true);
//     });
//
//     it("default test case18", function()
//     {
//         var m = new Matrix();
//         m.c = {};
//         expect(isNaN(m.c)).toBe(true);
//     });
//
//     it("default test case19", function()
//     {
//         var m = new Matrix();
//         m.c = {toString:function () { return 1; } };
//         expect(m.c).toBe(1);
//     });
//
//     it("default test case20", function()
//     {
//         var m = new Matrix();
//         m.c = {toString:function () { return "1"; } };
//         expect(m.c).toBe(1);
//     });
//
//     it("default test case21", function()
//     {
//         var m = new Matrix();
//         m.c = {toString:function () { return "1a"; } };
//         expect(isNaN(m.c)).toBe(true);
//     });
//
// });
//
//
// describe("Matrix.js d test", function()
// {
//
//     it("default test case1", function()
//     {
//         var m = new Matrix();
//         expect(m.d).toBe(1);
//     });
//
//     it("default test case2", function()
//     {
//         var m = new Matrix();
//         m.d = null;
//         expect(m.d).toBe(0);
//     });
//
//     it("default test case3", function()
//     {
//         var m = new Matrix();
//         m.d = undefined;
//         expect(isNaN(m.d)).toBe(true);
//     });
//
//     it("default test case4", function()
//     {
//         var m = new Matrix();
//         m.d = true;
//         expect(m.d).toBe(1);
//     });
//
//     it("default test case5", function()
//     {
//         var m = new Matrix();
//         m.d = "";
//         expect(m.d).toBe(0);
//     });
//
//     it("default test case6", function()
//     {
//         var m = new Matrix();
//         m.d = "abc";
//         expect(isNaN(m.d)).toBe(true);
//     });
//
//     it("default test case7", function()
//     {
//         var m = new Matrix();
//         m.d = 0;
//         expect(m.d).toBe(0);
//     });
//
//     it("default test case8", function()
//     {
//         var m = new Matrix();
//         m.d = 1;
//         expect(m.d).toBe(1);
//     });
//
//     it("default test case9", function()
//     {
//         var m = new Matrix();
//         m.d = 500;
//         expect(m.d).toBe(500);
//     });
//
//     it("default test case10", function()
//     {
//         var m = new Matrix();
//         m.d = 50000000000000000;
//         expect(m.d).toBe(49999999215337470);
//     });
//
//     it("default test case11", function()
//     {
//         var m = new Matrix();
//         m.d = -1;
//         expect(m.d).toBe(-1);
//     });
//
//     it("default test case12", function()
//     {
//         var m = new Matrix();
//         m.d = -500;
//         expect(m.d).toBe(-500);
//     });
//
//     it("default test case13", function()
//     {
//         var m = new Matrix();
//         m.d = -50000000000000000;
//         expect(m.d).toBe(-49999999215337470);
//     });
//
//     it("default test case14", function()
//     {
//         var m = new Matrix();
//         m.d = {a:0};
//         expect(isNaN(m.d)).toBe(true);
//     });
//
//     it("default test case15", function()
//     {
//         var m = new Matrix();
//         m.d = function a(){};
//         expect(isNaN(m.d)).toBe(true);
//     });
//
//     it("default test case16", function()
//     {
//         var m = new Matrix();
//         m.d = [1];
//         expect(m.d).toBe(1);
//     });
//
//     it("default test case17", function()
//     {
//         var m = new Matrix();
//         m.d = [1,2];
//         expect(isNaN(m.d)).toBe(true);
//     });
//
//     it("default test case18", function()
//     {
//         var m = new Matrix();
//         m.d = {};
//         expect(isNaN(m.d)).toBe(true);
//     });
//
//     it("default test case19", function()
//     {
//         var m = new Matrix();
//         m.d = {toString:function () { return 1; } };
//         expect(m.d).toBe(1);
//     });
//
//     it("default test case20", function()
//     {
//         var m = new Matrix();
//         m.d = {toString:function () { return "1"; } };
//         expect(m.d).toBe(1);
//     });
//
//     it("default test case21", function()
//     {
//         var m = new Matrix();
//         m.d = {toString:function () { return "1a"; } };
//         expect(isNaN(m.d)).toBe(true);
//     });
//
// });
//
//
// describe("Matrix.js tx test", function()
// {
//
//     it("default test case1", function()
//     {
//         var m = new Matrix();
//         expect(m.tx).toBe(0);
//     });
//
//     it("default test case2", function()
//     {
//         var m = new Matrix();
//         m.tx = null;
//         expect(m.tx).toBe(0);
//     });
//
//     it("default test case3", function()
//     {
//         var m = new Matrix();
//         m.tx = undefined;
//         expect(isNaN(m.tx)).toBe(true);
//     });
//
//     it("default test case4", function()
//     {
//         var m = new Matrix();
//         m.tx = true;
//         expect(m.tx).toBe(1);
//     });
//
//     it("default test case5", function()
//     {
//         var m = new Matrix();
//         m.tx = "";
//         expect(m.tx).toBe(0);
//     });
//
//     it("default test case6", function()
//     {
//         var m = new Matrix();
//         m.tx = "abc";
//         expect(isNaN(m.tx)).toBe(true);
//     });
//
//     it("default test case7", function()
//     {
//         var m = new Matrix();
//         m.tx = 0;
//         expect(m.tx).toBe(0);
//     });
//
//     it("default test case8", function()
//     {
//         var m = new Matrix();
//         m.tx = 1;
//         expect(m.tx).toBe(1);
//     });
//
//     it("default test case9", function()
//     {
//         var m = new Matrix();
//         m.tx = 500;
//         expect(m.tx).toBe(500);
//     });
//
//     it("default test case10", function()
//     {
//         var m = new Matrix();
//         m.tx = 50000000000000000;
//         expect(m.tx).toBe(49999999215337470);
//     });
//
//     it("default test case11", function()
//     {
//         var m = new Matrix();
//         m.tx = -1;
//         expect(m.tx).toBe(-1);
//     });
//
//     it("default test case12", function()
//     {
//         var m = new Matrix();
//         m.tx = -500;
//         expect(m.tx).toBe(-500);
//     });
//
//     it("default test case13", function()
//     {
//         var m = new Matrix();
//         m.tx = -50000000000000000;
//         expect(m.tx).toBe(-49999999215337470);
//     });
//
//     it("default test case14", function()
//     {
//         var m = new Matrix();
//         m.tx = {a:0};
//         expect(isNaN(m.tx)).toBe(true);
//     });
//
//     it("default test case15", function()
//     {
//         var m = new Matrix();
//         m.tx = function a(){};
//         expect(isNaN(m.tx)).toBe(true);
//     });
//
//     it("default test case16", function()
//     {
//         var m = new Matrix();
//         m.tx = [1];
//         expect(m.tx).toBe(1);
//     });
//
//     it("default test case17", function()
//     {
//         var m = new Matrix();
//         m.tx = [1,2];
//         expect(isNaN(m.tx)).toBe(true);
//     });
//
//     it("default test case18", function()
//     {
//         var m = new Matrix();
//         m.tx = {};
//         expect(isNaN(m.tx)).toBe(true);
//     });
//
//     it("default test case19", function()
//     {
//         var m = new Matrix();
//         m.tx = {toString:function () { return 1; } };
//         expect(m.tx).toBe(1);
//     });
//
//     it("default test case20", function()
//     {
//         var m = new Matrix();
//         m.tx = {toString:function () { return "1"; } };
//         expect(m.tx).toBe(1);
//     });
//
//     it("default test case21", function()
//     {
//         var m = new Matrix();
//         m.tx = {toString:function () { return "1a"; } };
//         expect(isNaN(m.tx)).toBe(true);
//     });
//
// });
//
//
// describe("Matrix.js ty test", function()
// {
//
//     it("default test case1", function()
//     {
//         var m = new Matrix();
//         expect(m.ty).toBe(0);
//     });
//
//     it("default test case2", function()
//     {
//         var m = new Matrix();
//         m.ty = null;
//         expect(m.ty).toBe(0);
//     });
//
//     it("default test case3", function()
//     {
//         var m = new Matrix();
//         m.ty = undefined;
//         expect(isNaN(m.ty)).toBe(true);
//     });
//
//     it("default test case4", function()
//     {
//         var m = new Matrix();
//         m.ty = true;
//         expect(m.ty).toBe(1);
//     });
//
//     it("default test case5", function()
//     {
//         var m = new Matrix();
//         m.ty = "";
//         expect(m.ty).toBe(0);
//     });
//
//     it("default test case6", function()
//     {
//         var m = new Matrix();
//         m.ty = "abc";
//         expect(isNaN(m.ty)).toBe(true);
//     });
//
//     it("default test case7", function()
//     {
//         var m = new Matrix();
//         m.ty = 0;
//         expect(m.ty).toBe(0);
//     });
//
//     it("default test case8", function()
//     {
//         var m = new Matrix();
//         m.ty = 1;
//         expect(m.ty).toBe(1);
//     });
//
//     it("default test case9", function()
//     {
//         var m = new Matrix();
//         m.ty = 500;
//         expect(m.ty).toBe(500);
//     });
//
//     it("default test case10", function()
//     {
//         var m = new Matrix();
//         m.ty = 50000000000000000;
//         expect(m.ty).toBe(49999999215337470);
//     });
//
//     it("default test case11", function()
//     {
//         var m = new Matrix();
//         m.ty = -1;
//         expect(m.ty).toBe(-1);
//     });
//
//     it("default test case12", function()
//     {
//         var m = new Matrix();
//         m.ty = -500;
//         expect(m.ty).toBe(-500);
//     });
//
//     it("default test case13", function()
//     {
//         var m = new Matrix();
//         m.ty = -50000000000000000;
//         expect(m.ty).toBe(-49999999215337470);
//     });
//
//     it("default test case14", function()
//     {
//         var m = new Matrix();
//         m.ty = {a:0};
//         expect(isNaN(m.ty)).toBe(true);
//     });
//
//     it("default test case15", function()
//     {
//         var m = new Matrix();
//         m.ty = function a(){};
//         expect(isNaN(m.ty)).toBe(true);
//     });
//
//     it("default test case16", function()
//     {
//         var m = new Matrix();
//         m.ty = [1];
//         expect(m.ty).toBe(1);
//     });
//
//     it("default test case17", function()
//     {
//         var m = new Matrix();
//         m.ty = [1,2];
//         expect(isNaN(m.ty)).toBe(true);
//     });
//
//     it("default test case18", function()
//     {
//         var m = new Matrix();
//         m.ty = {};
//         expect(isNaN(m.ty)).toBe(true);
//     });
//
//     it("default test case19", function()
//     {
//         var m = new Matrix();
//         m.ty = {toString:function () { return 1; } };
//         expect(m.ty).toBe(1);
//     });
//
//     it("default test case20", function()
//     {
//         var m = new Matrix();
//         m.ty = {toString:function () { return "1"; } };
//         expect(m.ty).toBe(1);
//     });
//
//     it("default test case21", function()
//     {
//         var m = new Matrix();
//         m.ty = {toString:function () { return "1a"; } };
//         expect(isNaN(m.ty)).toBe(true);
//     });
//
// });
//
//
// describe("Matrix.js BugFix", function()
// {
//     it("default test case10", function()
//     {
//         var mat = new Matrix();
//         expect(mat.toString()).toBe("(a=1, b=0, c=0, d=1, tx=0, ty=0)");
//         mat.translate(-100, -100);
//         expect(mat.toString()).toBe("(a=1, b=0, c=0, d=1, tx=-100, ty=-100)");
//         mat.scale(0.0, 1.0);
//         expect(mat.toString()).toBe("(a=0, b=0, c=0, d=1, tx=0, ty=-100)");
//         mat.translate(100, 100);
//         expect(mat.toString()).toBe("(a=0, b=0, c=0, d=1, tx=100, ty=0)");
//
//     });
// });