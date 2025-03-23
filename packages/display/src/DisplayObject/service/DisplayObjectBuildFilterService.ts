import type { IFilterArray } from "../../interface/IFilterArray";
import type { ISurfaceFilter } from "../../interface/ISurfaceFilter";
import {
    BevelFilter,
    BlurFilter,
    ColorMatrixFilter,
    ConvolutionFilter,
    DisplacementMapFilter,
    DropShadowFilter,
    GlowFilter,
    GradientBevelFilter,
    GradientGlowFilter
} from "@next2d/filters";
import { $getArray } from "../../DisplayObjectUtil";

/**
 * @description PlaceObjectのSurfaceFilterListを元にフィルターを構築
 *              Build filters based on the SurfaceFilterList of PlaceObject
 *
 * @param  {array} surface_filter_list
 * @return {array}
 * @method
 * @protected
 */
export const execute = (surface_filter_list: ISurfaceFilter[]): IFilterArray =>
{
    const filters: IFilterArray = $getArray();
    for (let idx: number = 0; idx < surface_filter_list.length; ++idx) {

        const surfaceFilter = surface_filter_list[idx];
        if (!surfaceFilter) {
            continue;
        }

        if (surfaceFilter.params[0] === null) {
            surfaceFilter.params.shift();
        }

        switch (surfaceFilter.class) {

            case "BevelFilter":
                filters.push(
                    new BevelFilter(...surfaceFilter.params)
                );
                break;

            case "BlurFilter":
                filters.push(
                    new BlurFilter(...surfaceFilter.params)
                );
                break;

            case "ColorMatrixFilter":
                filters.push(
                    new ColorMatrixFilter(...surfaceFilter.params)
                );
                break;

            case "ConvolutionFilter":
                filters.push(
                    new ConvolutionFilter(...surfaceFilter.params)
                );
                break;

            case "DisplacementMapFilter":
                filters.push(
                    new DisplacementMapFilter(...surfaceFilter.params)
                );
                break;

            case "DropShadowFilter":
                filters.push(
                    new DropShadowFilter(...surfaceFilter.params)
                );
                break;

            case "GlowFilter":
                filters.push(
                    new GlowFilter(...surfaceFilter.params)
                );
                break;

            case "GradientBevelFilter":
                filters.push(
                    new GradientBevelFilter(...surfaceFilter.params)
                );
                break;

            case "GradientGlowFilter":
                filters.push(
                    new GradientGlowFilter(...surfaceFilter.params)
                );
                break;

        }
    }

    return filters;
};