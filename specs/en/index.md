# Next2D Player

Next2D Player is a high-performance 2D rendering engine using WebGL/WebGPU. It provides Flash Player-like functionality on the web, supporting vector graphics, Tween animations, text, audio, video, and more.

## Key Features

- **High-Speed Rendering**: Fast 2D rendering using WebGL/WebGPU
- **Multi-Platform**: Supports desktop to mobile devices
- **Flash-Compatible API**: Familiar API design derived from swf2js
- **Rich Filters**: Supports Blur, DropShadow, Glow, Bevel, and more

## DisplayList Architecture

Next2D Player uses a DisplayList architecture similar to Flash Player.

### Main Class Hierarchy

```
DisplayObject (Base class)
├── InteractiveObject
│   ├── DisplayObjectContainer
│   │   ├── Sprite
│   │   ├── MovieClip
│   │   └── Stage
│   └── TextField
├── Shape
├── Video
└── Bitmap
```

### DisplayObjectContainer

Container class that can hold child objects:

- `addChild(child)`: Add child to the front
- `addChildAt(child, index)`: Add child at specified index
- `removeChild(child)`: Remove child
- `getChildAt(index)`: Get child by index
- `getChildByName(name)`: Get child by name

### MovieClip

DisplayObject with timeline animation:

- `play()`: Start timeline playback
- `stop()`: Stop timeline
- `gotoAndPlay(frame)`: Go to frame and play
- `gotoAndStop(frame)`: Go to frame and stop
- `currentFrame`: Current frame number
- `totalFrames`: Total number of frames

## Basic Usage

```javascript
import { next2d } from "@next2d/player";

// Initialize stage
const stage = next2d.createRootMovieClip();

// Create MovieClip
const mc = new next2d.display.MovieClip();
stage.addChild(mc);

// Set position and size
mc.x = 100;
mc.y = 100;
mc.scaleX = 2;
mc.scaleY = 2;
mc.rotation = 45;

// Apply filters
mc.filters = [
  new next2d.filters.DropShadowFilter(4, 45, 0x000000, 0.5)
];
```

## Loading JSON Data

Load and render JSON files created with Animation Tool:

```javascript
const loader = new next2d.display.Loader();
loader.contentLoaderInfo.addEventListener("complete", (event) => {
  const mc = event.currentTarget.content;
  stage.addChild(mc);
});
loader.load(new next2d.net.URLRequest("animation.json"));
```

## Related Documentation

- [DisplayObject](./display-object.md)
- [MovieClip](./movie-clip.md)
- [Event System](./events.md)
- [Filters](./filters/index.md)
