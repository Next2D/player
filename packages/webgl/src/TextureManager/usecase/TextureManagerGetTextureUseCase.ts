import type { ITextureObject } from "../../interface/ITextureObject";
import { execute as textureManagerAcquireObjectUseCase } from "./TextureManagerAcquireObjectUseCase";

export const execute = (width: number, height: number): ITextureObject =>
{
    const textureObject = textureManagerAcquireObjectUseCase(width, height);
    
    return textureObject;
};