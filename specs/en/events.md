# Event System

Next2D Player uses a three-phase event flow mechanism similar to the W3C DOM event model.

## EventDispatcher

The base class for all event-capable objects.

### addEventListener(type, listener, useCapture, priority)

Registers an event listener.

```typescript
const { PointerEvent } = next2d.events;

displayObject.addEventListener(PointerEvent.POINTER_DOWN, (event) => {
    console.log("Pointer pressed");
});

// Receive in capture phase
displayObject.addEventListener(PointerEvent.POINTER_DOWN, handler, true);

// Specify priority
displayObject.addEventListener(PointerEvent.POINTER_DOWN, handler, false, 10);
```

### removeEventListener(type, listener, useCapture)

Removes an event listener.

```typescript
displayObject.removeEventListener(PointerEvent.POINTER_DOWN, handler);
```

### removeAllEventListener(type, useCapture)

Removes all event listeners of a specific type.

```typescript
displayObject.removeAllEventListener(PointerEvent.POINTER_DOWN);
```

### hasEventListener(type)

Checks if a listener of the specified type is registered.

```typescript
if (displayObject.hasEventListener(PointerEvent.POINTER_DOWN)) {
    console.log("Pointer down listener is registered");
}
```

### willTrigger(type)

Checks if this object or any ancestor has a listener for the event type.

```typescript
if (displayObject.willTrigger(PointerEvent.POINTER_DOWN)) {
    console.log("This object or an ancestor has a listener");
}
```

### dispatchEvent(event)

Dispatches an event.

```typescript
const { Event } = next2d.events;

const event = new Event("customEvent");
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

### Methods

| Method | Description |
|--------|-------------|
| `stopPropagation()` | Stop propagation |
| `stopImmediatePropagation()` | Stop propagation immediately |

## Standard Event Types

### Display List Related

| Event | Description |
|-------|-------------|
| `added` | Added to DisplayObjectContainer |
| `addedToStage` | Added to Stage |
| `removed` | Removed from DisplayObjectContainer |
| `removedFromStage` | Removed from Stage |

```typescript
sprite.addEventListener("addedToStage", (event) => {
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
movieClip.addEventListener("enterFrame", (event) => {
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
| `httpStatus` | HTTP status received |

```typescript
const { Loader } = next2d.display;
const { URLRequest } = next2d.net;

const loader = new Loader();

// Loading with async/await
await loader.load(new URLRequest("animation.json"));
const content = loader.content;
stage.addChild(content);

// Using progress events
loader.contentLoaderInfo.addEventListener("progress", (event) => {
    const percent = (event.bytesLoaded / event.bytesTotal) * 100;
    console.log(`${percent}% loaded`);
});
```

## Pointer Events

PointerEvent handles pointer device interactions (mouse, pen, touch) in a unified way.

| Event | Constant | Description |
|-------|----------|-------------|
| `pointerDown` | `PointerEvent.POINTER_DOWN` | Button press started |
| `pointerUp` | `PointerEvent.POINTER_UP` | Button released |
| `pointerMove` | `PointerEvent.POINTER_MOVE` | Pointer coordinates changed |
| `pointerOver` | `PointerEvent.POINTER_OVER` | Pointer entered hit test boundary |
| `pointerOut` | `PointerEvent.POINTER_OUT` | Pointer left hit test boundary |
| `pointerLeave` | `PointerEvent.POINTER_LEAVE` | Pointer left element area |
| `pointerCancel` | `PointerEvent.POINTER_CANCEL` | Pointer interaction canceled |
| `doubleClick` | `PointerEvent.DOUBLE_CLICK` | Double-click/tap occurred |

```typescript
const { PointerEvent } = next2d.events;

sprite.addEventListener(PointerEvent.POINTER_DOWN, (event) => {
    console.log("Pointer down:", event.localX, event.localY);
});

sprite.addEventListener(PointerEvent.POINTER_MOVE, (event) => {
    console.log("Pointer move:", event.stageX, event.stageY);
});

sprite.addEventListener(PointerEvent.DOUBLE_CLICK, (event) => {
    console.log("Double click");
});
```

## Keyboard Events

| Event | Constant | Description |
|-------|----------|-------------|
| `keyDown` | `KeyboardEvent.KEY_DOWN` | Key pressed |
| `keyUp` | `KeyboardEvent.KEY_UP` | Key released |

```typescript
const { KeyboardEvent } = next2d.events;

stage.addEventListener(KeyboardEvent.KEY_DOWN, (event) => {
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

## Gamepad Events

Handles game controller input through the Web Gamepad API. All gamepad events are dispatched to `stage`.

> **Browser requirement**: A gamepad is recognized when the user presses a button on the controller while the page has focus (browser security requirement).

| Event | Constant | Description |
|-------|----------|-------------|
| `gamepadconnected` | `GamepadEvent.GAMEPAD_CONNECTED` | Gamepad connected and recognized |
| `gamepaddisconnected` | `GamepadEvent.GAMEPAD_DISCONNECTED` | Gamepad disconnected |
| `gamepadbuttondown` | `GamepadEvent.BUTTON_DOWN` | Button pressed |
| `gamepadbuttonup` | `GamepadEvent.BUTTON_UP` | Button released |
| `gamepadaxesmotion` | `GamepadEvent.AXES_MOTION` | Stick (axis) changed (threshold 0.1) |

### GamepadEvent Properties

| Property | Type | Description |
|----------|------|-------------|
| `gamepadIndex` | number | Gamepad index number |
| `buttonIndex` | number \| undefined | Button number (on BUTTON_DOWN/UP) |
| `buttonValue` | number \| undefined | Degree of button press 0.0–1.0 (on BUTTON_DOWN/UP) |
| `axisIndex` | number \| undefined | Axis number (on AXES_MOTION) |
| `axisValue` | number \| undefined | Axis value -1.0–1.0 (on AXES_MOTION) |

```typescript
const { GamepadEvent } = next2d.events;

// Connect / disconnect
stage.addEventListener(GamepadEvent.GAMEPAD_CONNECTED, (event) => {
    console.log(`Gamepad ${event.gamepadIndex} connected`);
});

stage.addEventListener(GamepadEvent.GAMEPAD_DISCONNECTED, (event) => {
    console.log(`Gamepad ${event.gamepadIndex} disconnected`);
});

// Button input
stage.addEventListener(GamepadEvent.BUTTON_DOWN, (event) => {
    console.log(`Button ${event.buttonIndex} pressed (value: ${event.buttonValue})`);
});

stage.addEventListener(GamepadEvent.BUTTON_UP, (event) => {
    console.log(`Button ${event.buttonIndex} released`);
});

// Stick input
stage.addEventListener(GamepadEvent.AXES_MOTION, (event) => {
    console.log(`Axis ${event.axisIndex}: ${event.axisValue}`);
});
```

## Focus Events

| Event | Constant | Description |
|-------|----------|-------------|
| `focusIn` | `FocusEvent.FOCUS_IN` | Element received focus |
| `focusOut` | `FocusEvent.FOCUS_OUT` | Element lost focus |

```typescript
const { FocusEvent } = next2d.events;

textField.addEventListener(FocusEvent.FOCUS_IN, (event) => {
    console.log("Received focus");
});
```

## Wheel Events

| Event | Constant | Description |
|-------|----------|-------------|
| `wheel` | `WheelEvent.WHEEL` | Mouse wheel rotated |

```typescript
const { WheelEvent } = next2d.events;

stage.addEventListener(WheelEvent.WHEEL, (event) => {
    console.log("Wheel rotated");
});
```

## Video Events

| Event | Constant | Description |
|-------|----------|-------------|
| `play` | `VideoEvent.PLAY` | Play requested |
| `playing` | `VideoEvent.PLAYING` | Playback started |
| `pause` | `VideoEvent.PAUSE` | Paused |
| `seek` | `VideoEvent.SEEK` | Seek operation |

## Job Events

Events for Tween animations.

| Event | Constant | Description |
|-------|----------|-------------|
| `update` | `JobEvent.UPDATE` | Property updated |
| `stop` | `JobEvent.STOP` | Job stopped |

## Custom Events

```typescript
const { Event } = next2d.events;

// Define custom event
const customEvent = new Event("gameOver", true, true);

// Dispatch event
gameManager.dispatchEvent(customEvent);

// Listen to event
gameManager.addEventListener("gameOver", (event) => {
    showGameOverScreen();
});
```

## Event Propagation

Events propagate in three phases:

1. **Capture phase**: From root to target (eventPhase = 1)
2. **Target phase**: Processed at target (eventPhase = 2)
3. **Bubbling phase**: From target to root (eventPhase = 3)

```typescript
const { PointerEvent } = next2d.events;

// Process in capture phase
parent.addEventListener(PointerEvent.POINTER_DOWN, handler, true);

// Process in bubbling phase (default)
child.addEventListener(PointerEvent.POINTER_DOWN, handler, false);
```

## Related

- [DisplayObject](/en/reference/player/display-object)
- [MovieClip](/en/reference/player/movie-clip)
