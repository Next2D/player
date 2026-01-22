import type { Shape } from "../../Shape";
import { Event } from "@next2d/events";

/**
 * @description 形状読み込みユースケース
 *              Shape Load Use Case
 *
 * @param  {Shape} shape 
 * @param  {string} url 
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = (shape: Shape, url: string): Promise<void> => 
{
    return new Promise<void>((resolve): void =>
    {
        shape.addEventListener(Event.COMPLETE, resolve);
        shape.src = url;
    });
};