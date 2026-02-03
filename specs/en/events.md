# Event System

Next2D Player uses an event model similar to Flash Player.

## EventDispatcher

The base class for all event-capable objects.

### addEventListener(type, listener, useCapture, priority)

Registers an event listener.

```typescript
import type { Event } from "@next2d/player";

displayObject.addEventListener("click", (event: Event): void => {
  console.log("Clicked");
});

// Receive in capture phase
displayObject.addEventListener("click", handler, true);

// Specify priority
displayObject.addEventListener("click", handler, false, 10);
```

### removeEventListener(type, listener, useCapture)

Removes an event listener.

```typescript
displayObject.removeEventListener("click", handler);
```

### hasEventListener(type)

Checks if a listener of the specified type is registered.

```typescript
if (displayObject.hasEventListener("click")) {
  console.log("Click listener is registered");
}
```

### dispatchEvent(event)

Dispatches an event.

```typescript
import type { Event } from "@next2d/player";

const event: Event = new next2d.events.Event("customEvent");
displayObject.dispatchEvent(event);
```

## Event Class

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `type` | String | Event type |
| `target` | Object | Event source |
| `currentTarget` | Object | Current listener target |
| `eventPhase` | Number | Event phase |
| `bubbles` | Boolean | Whether bubbles |
| `cancelable` | Boolean | Whether cancelable |

### Methods

| Method | Description |
|--------|-------------|
| `stopPropagation()` | Stop propagation |
| `stopImmediatePropagation()` | Stop propagation immediately |
| `preventDefault()` | Cancel default behavior |

## Standard Event Types

### Display List Related

| Event | Description |
|-------|-------------|
| `added` | Added to DisplayObjectContainer |
| `addedToStage` | Added to Stage |
| `removed` | Removed from DisplayObjectContainer |
| `removedFromStage` | Removed from Stage |

```typescript
import type { Event } from "@next2d/player";

sprite.addEventListener("addedToStage", (event: Event): void => {
  console.log("Added to stage");
});
```

### Timeline Related

| Event | Description |
|-------|-------------|
| `enterFrame` | Occurs each frame |
| `frameConstructed` | Frame construction complete |
| `exitFrame` | When leaving frame |

```typescript
import type { Event } from "@next2d/player";

movieClip.addEventListener("enterFrame", (event: Event): void => {
  // Processing executed every frame
  updatePosition();
});
```

### Load Related

| Event | Description |
|-------|-------------|
| `complete` | Load complete |
| `progress` | Load progress |
| `ioError` | IO error |

```typescript
import type { Event, LoaderInfo, ProgressEvent, DisplayObject } from "@next2d/player";

loader.contentLoaderInfo.addEventListener("complete", (event: Event): void => {
  const loaderInfo: LoaderInfo = event.currentTarget as LoaderInfo;
  const content: DisplayObject = loaderInfo.content;
  stage.addChild(content);
});

loader.contentLoaderInfo.addEventListener("progress", (event: ProgressEvent): void => {
  const percent: number = (event.bytesLoaded / event.bytesTotal) * 100;
  console.log(`${percent}% loaded`);
});
```

## Mouse and Touch Events

### Mouse Events

| Event | Description |
|-------|-------------|
| `click` | Click |
| `doubleClick` | Double click |
| `mouseDown` | Mouse button pressed |
| `mouseUp` | Mouse button released |
| `mouseMove` | Mouse move |
| `mouseOver` | Mouse over |
| `mouseOut` | Mouse out |
| `rollOver` | Roll over |
| `rollOut` | Roll out |

```typescript
import type { MouseEvent } from "@next2d/player";

sprite.addEventListener("click", (event: MouseEvent): void => {
  console.log("Click position:", event.localX, event.localY);
});

sprite.addEventListener("mouseMove", (event: MouseEvent): void => {
  console.log("Mouse position:", event.stageX, event.stageY);
});
```

### Touch Events

| Event | Description |
|-------|-------------|
| `touchBegin` | Touch start |
| `touchEnd` | Touch end |
| `touchMove` | Touch move |
| `touchTap` | Tap |

```typescript
import type { TouchEvent } from "@next2d/player";

sprite.addEventListener("touchTap", (event: TouchEvent): void => {
  console.log("Touch ID:", event.touchPointID);
  console.log("Touch position:", event.localX, event.localY);
});
```

## Keyboard Events

| Event | Description |
|-------|-------------|
| `keyDown` | Key pressed |
| `keyUp` | Key released |

```typescript
import type { KeyboardEvent } from "@next2d/player";

stage.addEventListener("keyDown", (event: KeyboardEvent): void => {
  console.log("Key code:", event.keyCode);

  switch (event.keyCode) {
    case 37: // Left arrow
      player.x -= 10;
      break;
    case 39: // Right arrow
      player.x += 10;
      break;
  }
});
```

## Custom Events

```typescript
import type { Event } from "@next2d/player";

// Define custom event
const customEvent: Event = new next2d.events.Event("gameOver", true, true);

// Dispatch event
gameManager.dispatchEvent(customEvent);

// Listen to event
gameManager.addEventListener("gameOver", (event: Event): void => {
  showGameOverScreen();
});
```

## Event Propagation

Events propagate in three phases:

1. **Capture phase**: From root to target
2. **Target phase**: Processed at target
3. **Bubbling phase**: From target to root

```typescript
// Process in capture phase
parent.addEventListener("click", handler, true);

// Process in bubbling phase (default)
child.addEventListener("click", handler, false);
```

## Related

- [DisplayObject](./display-object.md)
- [MovieClip](./movie-clip.md)
