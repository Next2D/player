import type {
    BitmapData,
    BlendMode,
    DisplayObject,
    FrameLabel,
    Graphics,
    InteractiveObject,
    Loader,
    MovieClip,
    Shape,
    Sprite,
    Stage,
    TextField
} from "@next2d/display";
export interface DisplayImpl {
    BitmapData: typeof BitmapData;
    BlendMode: typeof BlendMode;
    DisplayObject: typeof DisplayObject;
    FrameLabel: typeof FrameLabel;
    Graphics: typeof Graphics;
    InteractiveObject: typeof InteractiveObject;
    Loader: typeof Loader;
    MovieClip: typeof MovieClip;
    Shape: typeof Shape;
    Sprite: typeof Sprite;
    Stage: typeof Stage;
    TextField: typeof TextField;
}
