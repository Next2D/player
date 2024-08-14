import type { ITextureObject } from "../../interface/ITextureObject";
import { execute as textureManagerAcquireObjectUseCase } from "./TextureManagerAcquireObjectUseCase";

export const execute = (
    width: number,
    height: number,
    smoothing: boolean = false
): ITextureObject => {

    const textureObject = textureManagerAcquireObjectUseCase(width, height, smoothing);
    
    return textureObject;
};