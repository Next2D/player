let $maskDrawingState: boolean = false;

export const $setMaskDrawing = (state: boolean): void =>
{
    $maskDrawingState = state;
};

export const $isMaskDrawing = (): boolean =>
{
    return $maskDrawingState;
};

let $maskTestEnabled: boolean = false;

let $maskStencilReference: number = 0;

export const $setMaskTestEnabled = (enabled: boolean): void =>
{
    $maskTestEnabled = enabled;
};

export const $isMaskTestEnabled = (): boolean =>
{
    return $maskTestEnabled;
};

export const $setMaskStencilReference = (value: number): void =>
{
    $maskStencilReference = value;
};

export const $getMaskStencilReference = (): number =>
{
    return $maskStencilReference;
};

const $maskAttachmentStack: any[] = [];

export const $pushMaskAttachment = (attachment: any): void =>
{
    $maskAttachmentStack.push(attachment);
};

export const $popMaskAttachment = (): any =>
{
    return $maskAttachmentStack.pop();
};

export const $hasMaskAttachment = (): boolean =>
{
    return $maskAttachmentStack.length > 0;
};

export const $clipBounds: Map<number, Float32Array> = new Map();

export const $clipLevels: Map<number, number> = new Map();

export const $resetMaskState = (): void =>
{
    $maskDrawingState = false;
    $maskTestEnabled = false;
    $maskStencilReference = 0;
    $maskAttachmentStack.length = 0;
    $clipBounds.clear();
    $clipLevels.clear();
};
