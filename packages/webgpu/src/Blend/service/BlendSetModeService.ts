import type { IBlendMode } from "../../interface/IBlendMode";
import { $setCurrentBlendMode } from "../../Blend";

export const execute = (mode: IBlendMode): void =>
{
    $setCurrentBlendMode(mode);
};
