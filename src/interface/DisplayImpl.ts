import { BitmapData } from "../player/next2d/display/BitmapData";
import { BlendMode } from "../player/next2d/display/BlendMode";
import { FrameLabel } from "../player/next2d/display/FrameLabel";
import { Graphics } from "../player/next2d/display/Graphics";
import { Loader } from "../player/next2d/display/Loader";
import { LoaderInfo } from "../player/next2d/display/LoaderInfo";
import { MovieClip } from "../player/next2d/display/MovieClip";
import { Shape } from "../player/next2d/display/Shape";
import { Sprite } from "../player/next2d/display/Sprite";
import { Stage } from "../player/next2d/display/Stage";

export interface DisplayImpl {
    BitmapData: typeof BitmapData;
    BlendMode: typeof BlendMode;
    FrameLabel: typeof FrameLabel;
    Graphics: typeof Graphics;
    Loader: typeof Loader;
    LoaderInfo: typeof LoaderInfo;
    MovieClip: typeof MovieClip;
    Shape: typeof Shape;
    Sprite: typeof Sprite;
    Stage: typeof Stage;
}
