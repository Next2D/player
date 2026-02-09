export let $currentStencilMode: number = 0;
export const STENCIL_MODE_MASK: number = 1;
export const STENCIL_MODE_FILL: number = 2;

export const $setStencilMode = (mode: number): void =>
{
    $currentStencilMode = mode;
};

export const $resetStencilMode = (): void =>
{
    $currentStencilMode = 0;
};

export let $colorMaskEnabled: boolean = true;

export const $setColorMaskEnabled = (enabled: boolean): void =>
{
    $colorMaskEnabled = enabled;
};

export let $sampleAlphaToCoverageEnabled: boolean = false;

export const $setSampleAlphaToCoverageEnabled = (enabled: boolean): void =>
{
    $sampleAlphaToCoverageEnabled = enabled;
};
