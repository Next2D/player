import { BitmapData } from "../next2d/display/BitmapData";
import { BlendMode } from "../next2d/display/BlendMode";
import { FrameLabel } from "../next2d/display/FrameLabel";
import { Graphics } from "../next2d/display/Graphics";
import { Loader } from "../next2d/display/Loader";
import { LoaderInfo } from "../next2d/display/LoaderInfo";
import { MovieClip } from "../next2d/display/MovieClip";
import { Shape } from "../next2d/display/Shape";
import { Sprite } from "../next2d/display/Sprite";
import { Stage } from "../next2d/display/Stage";
import { DisplayImpl } from "../../interface/DisplayImpl";

const display: DisplayImpl = {
    BitmapData,
    BlendMode,
    FrameLabel,
    Graphics,
    Loader,
    LoaderInfo,
    MovieClip,
    Shape,
    Sprite,
    Stage
};

Object.entries(display).forEach(([key, DisplayClass]) =>
{
    Object.defineProperty(display, key, {
        get()
        {
            return DisplayClass;
        }
    });
});

export { display };