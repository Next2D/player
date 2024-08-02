import type {
    BitmapData,
    BlendMode,
    DisplayObject,
    DisplayObjectContainer,
    FrameLabel,
    Graphics,
    InteractiveObject,
    Loader,
    MovieClip,
    Shape,
    Sprite,
    Stage
} from "@next2d/display";
export interface DisplayImpl {
    BitmapData: typeof BitmapData;
    BlendMode: typeof BlendMode;
    DisplayObject: typeof DisplayObject;
    DisplayObjectContainer: typeof DisplayObjectContainer;
    FrameLabel: typeof FrameLabel;
    Graphics: typeof Graphics;
    InteractiveObject: typeof InteractiveObject;
    Loader: typeof Loader;
    MovieClip: typeof MovieClip;
    Shape: typeof Shape;
    Sprite: typeof Sprite;
    Stage: typeof Stage;
}
