import type { IBlendMode } from "./interface/IBlendMode";

export let $currentBlendMode: IBlendMode = "normal";

export const $setCurrentBlendMode = (blend_mode: IBlendMode): void =>
{
    $currentBlendMode = blend_mode;
};

export let $funcCode: number = 600;

export const $setFuncCode = (func_code: number): void =>
{
    $funcCode = func_code;
};
