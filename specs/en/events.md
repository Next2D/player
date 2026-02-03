# Event System

Next2D Player uses an event model similar to Flash Player.

## EventDispatcher

The base class for all event-capable objects.

### addEventListener(type, listener, useCapture, priority)

Registers an event listener.

```javascript
displayObject.addEventListener("click", function(event) {
    console.log("Clicked");
});

// Receive in capture phase
displayObject.addEventListener("click", handler, true);

// Specify priority
displayObject.addEventListener("click", handler, false, 10);
```

### removeEventListener(type, listener, useCapture)

Removes an event listener.

```javascript
displayObject.removeEventListener("click", handler);
```

### hasEventListener(type)

Checks if a listener of the specified type is registered.

```javascript
if (displayObject.hasEventListener("click")) {
    console.log("Click listener is registered");
}
```

### dispatchEvent(event)

Dispatches an event.

```javascript
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

```javascript
sprite.addEventListener("addedToStage", function(event) {
    console.log("Added to stage");
});
```

### Timeline Related

| Event | Description |
|-------|-------------|
| `enterFrame` | Occurs each frame |
| `frameConstructed` | Frame construction complete |
| `exitFrame` | When leaving frame |

```javascript
movieClip.addEventListener("enterFrame", function(event) {
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

```javascript
const { Loader } = next2d.display;
const { URLRequest } = next2d.net;

const loader = new Loader();

loader.contentLoaderInfo.addEventListener("complete", function(event) {
    const content = event.currentTarget.content;
    stage.addChild(content);
});

loader.contentLoaderInfo.addEventListener("progress", function(event) {
    const percent = (event.bytesLoaded / event.bytesTotal) * 100;
    console.log(percent + "% loaded");
});

loader.load(new URLRequest("animation.json"));
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

```javascript
sprite.addEventListener("click", function(event) {
    console.log("Click position:", event.localX, event.localY);
});

sprite.addEventListener("mouseMove", function(event) {
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

```javascript
sprite.addEventListener("touchTap", function(event) {
    console.log("Touch ID:", event.touchPointID);
    console.log("Touch position:", event.localX, event.localY);
});
```

## Keyboard Events

| Event | Description |
|-------|-------------|
| `keyDown` | Key pressed |
| `keyUp` | Key released |

```javascript
stage.addEventListener("keyDown", function(event) {
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

```javascript
const { Event } = next2d.events;

// Define custom event
const customEvent = new Event("gameOver", true, true);

// Dispatch event
gameManager.dispatchEvent(customEvent);

// Listen to event
gameManager.addEventListener("gameOver", function(event) {
    showGameOverScreen();
});
```

## Event Propagation

Events propagate in three phases:

1. **Capture phase**: From root to target
2. **Target phase**: Processed at target
3. **Bubbling phase**: From target to root

```javascript
// Process in capture phase
parent.addEventListener("click", handler, true);

// Process in bubbling phase (default)
child.addEventListener("click", handler, false);
```

## Related

- [DisplayObject](./display-object.md)
- [MovieClip](./movie-clip.md)
