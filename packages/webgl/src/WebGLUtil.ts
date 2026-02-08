import type { Context } from "./Context";

export let $RENDER_MAX_SIZE: number = 2048;

export const $setRenderMaxSize = (size: number): void =>
{
    $RENDER_MAX_SIZE = Math.max(2048, size / 2);
};

export let $samples: number = 4;

export const $setSamples = (samples: number): void =>
{
    $samples = samples;
};

export let $gl: WebGL2RenderingContext;

export const $setWebGL2RenderingContext = (gl: WebGL2RenderingContext): void =>
{
    $gl = gl;
};

export let $context: Context;

export const $setContext = (context: Context): void =>
{
    $context = context;
};

export const $clamp = (
    value: number,
    min: number, max: number,
    default_value: number | null = null
): number => {

    const number: number = +value;

    return isNaN(number) && default_value !== null
        ? default_value
        : Math.min(Math.max(min, isNaN(number) ? 0 : number), max);
};

const $arrays: any[] = [];

export const $getArray = (...args: any[]): any[] =>
{
    const array: any[] = $arrays.pop() || [];
    if (args.length) {
        array.push(...args);
    }
    return array;
};

export const $poolArray = (array: any[] | null = null): void =>
{
    if (!array) {
        return ;
    }

    if (array.length) {
        array.length = 0;
    }

    $arrays.push(array);
};

export const $upperPowerOfTwo = (v: number): number =>
{
    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    v++;
    return v;
};

const $float32Array4: Float32Array[] = [];

export const $getFloat32Array4 = (
    f0: number = 0, f1: number = 0,
    f2: number = 0, f3: number = 0
): Float32Array => {

    const array: Float32Array = $float32Array4.pop() || new Float32Array(4);

    array[0] = f0;
    array[1] = f1;
    array[2] = f2;
    array[3] = f3;

    return array;
};

export const $poolFloat32Array4 = (array: Float32Array): void =>
{
    $float32Array4.push(array);
};

const $float32Array9: Float32Array[] = [];

export const $getFloat32Array9 = (
    f0: number = 0, f1: number = 0, f2: number = 0,
    f3: number = 0, f4: number = 0, f5: number = 0,
    f6: number = 0, f7: number = 0, f8: number = 0
): Float32Array => {

    const array: Float32Array = $float32Array9.pop() || new Float32Array(9);

    array[0] = f0;
    array[1] = f1;
    array[2] = f2;
    array[3] = f3;
    array[4] = f4;
    array[5] = f5;
    array[6] = f6;
    array[7] = f7;
    array[8] = f8;

    return array;
};

export const $poolFloat32Array9 = (array: Float32Array): void =>
{
    $float32Array9.push(array);
};

const $float32Array6: Float32Array[] = [];

export const $getFloat32Array6 = (
    f0: number = 0, f1: number = 0,
    f2: number = 0, f3: number = 0,
    f4: number = 0, f5: number = 0
): Float32Array => {

    const array: Float32Array = $float32Array6.pop() || new Float32Array(6);

    array[0] = f0;
    array[1] = f1;
    array[2] = f2;
    array[3] = f3;
    array[4] = f4;
    array[5] = f5;

    return array;
};

export const $poolFloat32Array6 = (array: Float32Array): void =>
{
    $float32Array6.push(array);
};

export const $inverseMatrix = (m: Float32Array): Float32Array =>
{
    const rdet: number = 1 / (m[0] * m[4] - m[3] * m[1]);
    const tx: number  = m[3] * m[7] - m[4] * m[6];
    const ty: number  = m[1] * m[6] - m[0] * m[7];

    return $getFloat32Array9(
        m[4] * rdet,  0 - m[1] * rdet, 0,
        0 - m[3] * rdet,  m[0] * rdet, 0,
        tx * rdet, ty * rdet, 1
    );
};

export let $viewportWidth: number = 0;

export let $viewportHeight: number = 0;

export const $setViewportSize = (viewport_width: number, viewport_height: number): void =>
{
    $viewportWidth  = viewport_width;
    $viewportHeight = viewport_height;
};

export const $linearGradientXY = (matrix: Float32Array): Float32Array =>
{
    const x0: number = -819.2 * matrix[0] - 819.2 * matrix[2] + matrix[4];
    const x1: number =  819.2 * matrix[0] - 819.2 * matrix[2] + matrix[4];
    const x2: number = -819.2 * matrix[0] + 819.2 * matrix[2] + matrix[4];
    const y0: number = -819.2 * matrix[1] - 819.2 * matrix[3] + matrix[5];
    const y1: number =  819.2 * matrix[1] - 819.2 * matrix[3] + matrix[5];
    const y2: number = -819.2 * matrix[1] + 819.2 * matrix[3] + matrix[5];

    let vx2: number = x2 - x0;
    let vy2: number = y2 - y0;

    const r1: number = Math.sqrt(vx2 * vx2 + vy2 * vy2);
    if (r1) {
        vx2 = vx2 / r1;
        vy2 = vy2 / r1;
    } else {
        vx2 = 0;
        vy2 = 0;
    }

    const r2: number = (x1 - x0) * vx2 + (y1 - y0) * vy2;

    return $getFloat32Array4(x0 + r2 * vx2, y0 + r2 * vy2, x1, y1);
};

export let $devicePixelRatio: number = 1;

export const $setDevicePixelRatio = (device_pixel_ratio: number): void =>
{
    $devicePixelRatio = device_pixel_ratio;
};

export const $multiplyMatrices = (a: Float32Array, b: Float32Array): Float32Array =>
{
    const a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
    const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];

    return $getFloat32Array6(
        a0 * b0 + a2 * b1,
        a1 * b0 + a3 * b1,
        a0 * b2 + a2 * b3,
        a1 * b2 + a3 * b3,
        a0 * b4 + a2 * b5 + a4,
        a1 * b4 + a3 * b5 + a5
    );
};

export const $getUUID = (): string =>
{
    return typeof crypto?.randomUUID === "function"
        ? crypto.randomUUID()
        : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) =>
        {
            const r = Math.random() * 16 | 0;
            const v = c === "x" ? r : r & 0x3 | 0x8;
            return v.toString(16);
        });
};
