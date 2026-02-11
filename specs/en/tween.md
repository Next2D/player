# Tween Animation

Next2D Player allows you to implement programmatic animations using the Tween system from the `@next2d/ui` package. You can smoothly animate properties like position, size, and transparency.

## Basic Tween Concepts

```mermaid
flowchart LR
    Start["Start Value"] -->|Easing Function| Progress["Progress 0→1"]
    Progress --> End["End Value"]

    subgraph Easing["Easing"]
        Linear["linear"]
        InQuad["inQuad"]
        OutQuad["outQuad"]
        InOutQuad["inOutQuad"]
    end
```

## Tween.add()

Use the `Tween.add()` method to create a `Job` instance for animation.

```typescript
const { Tween, Easing } = next2d.ui;

const job = Tween.add(
    target,    // Target object to animate
    from,      // Starting property values
    to,        // Ending property values
    delay,     // Delay in seconds (default: 0)
    duration,  // Animation duration in seconds (default: 1)
    ease       // Easing function (default: linear)
);

// Start the animation
job.start();
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `target` | any | - | Target object to animate |
| `from` | object | - | Starting property values |
| `to` | object | - | Ending property values |
| `delay` | number | 0 | Delay before animation starts (seconds) |
| `duration` | number | 1 | Animation duration (seconds) |
| `ease` | Function \| null | null | Easing function (defaults to linear) |

### Return Value

`Job` - Animation job instance

## Job Class

The Job class manages individual animation jobs. It extends EventDispatcher.

### Methods

| Method | Return | Description |
|--------|--------|-------------|
| `start()` | void | Starts the animation |
| `stop()` | void | Stops the animation |
| `chain(nextJob: Job \| null)` | Job \| null | Chains another job to start after this one completes |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `target` | any | Target object |
| `from` | object | Start values |
| `to` | object | End values |
| `delay` | number | Delay time |
| `duration` | number | Duration time |
| `ease` | Function | Easing function |
| `currentTime` | number | Current animation time |
| `nextJob` | Job \| null | Next chained job |

### Events

| Event | Description |
|-------|-------------|
| `enterFrame` | Dispatched on each animation frame |
| `complete` | Dispatched when animation completes |

## Easing Functions

The `Easing` class provides 32 easing functions across 11 easing types with In, Out, and InOut variants.

### Linear
- `Easing.linear` - Constant speed

### Quadratic (Quad)
- `Easing.inQuad` - Accelerating from zero velocity
- `Easing.outQuad` - Decelerating to zero velocity
- `Easing.inOutQuad` - Acceleration until halfway, then deceleration

### Cubic
- `Easing.inCubic` / `Easing.outCubic` / `Easing.inOutCubic`

### Quartic (Quart)
- `Easing.inQuart` / `Easing.outQuart` / `Easing.inOutQuart`

### Quintic (Quint)
- `Easing.inQuint` / `Easing.outQuint` / `Easing.inOutQuint`

### Sinusoidal (Sine)
- `Easing.inSine` / `Easing.outSine` / `Easing.inOutSine`

### Exponential (Expo)
- `Easing.inExpo` / `Easing.outExpo` / `Easing.inOutExpo`

### Circular (Circ)
- `Easing.inCirc` / `Easing.outCirc` / `Easing.inOutCirc`

### Elastic
- `Easing.inElastic` / `Easing.outElastic` / `Easing.inOutElastic`

### Back
- `Easing.inBack` / `Easing.outBack` / `Easing.inOutBack`

### Bounce
- `Easing.inBounce` / `Easing.outBounce` / `Easing.inOutBounce`

### Easing Function Parameters

All easing functions accept four parameters:

```typescript
ease(t: number, b: number, c: number, d: number): number
```

- `t` - Current time (0 to d)
- `b` - Beginning value
- `c` - Change in value (end value - beginning value)
- `d` - Duration

## Usage Examples

### Basic Movement Animation

```typescript
const { Tween, Easing } = next2d.ui;

const sprite = new Sprite();
stage.addChild(sprite);

// Move x from 0 to 400 over 1 second
const job = Tween.add(
    sprite,
    { x: 0, y: 100 },
    { x: 400, y: 100 },
    0,
    1,
    Easing.outQuad
);

job.start();
```

### Simultaneous Multi-Property Animation

```typescript
const { Tween, Easing } = next2d.ui;

// Move + Scale + Fade in
const job = Tween.add(
    sprite,
    { x: 0, y: 0, scaleX: 1, scaleY: 1, alpha: 0 },
    { x: 200, y: 150, scaleX: 2, scaleY: 2, alpha: 1 },
    0,
    0.5,
    Easing.outCubic
);

job.start();
```

### Chaining Animations

```typescript
const { Tween, Easing } = next2d.ui;

// First animation
const job1 = Tween.add(
    sprite,
    { x: 0 },
    { x: 100 },
    0, 1,
    Easing.outQuad
);

// Second animation
const job2 = Tween.add(
    sprite,
    { x: 100 },
    { x: 200 },
    0, 1,
    Easing.inQuad
);

// Chain and start
job1.chain(job2);
job1.start();
```

### Delayed Animation

```typescript
const { Tween, Easing } = next2d.ui;

// Fade out over 1 second after 0.5 second delay
const job = Tween.add(
    sprite,
    { alpha: 1 },
    { alpha: 0 },
    0.5,
    1,
    Easing.inQuad
);

job.start();
```

### Using Events

```typescript
const { Tween, Easing } = next2d.ui;

const job = Tween.add(
    sprite,
    { x: 0 },
    { x: 300 },
    0, 2,
    Easing.inOutQuad
);

// Per-frame processing
job.addEventListener("enterFrame", (event) => {
    console.log("Progress:", job.currentTime);
});

// On completion
job.addEventListener("complete", (event) => {
    console.log("Animation complete!");
});

job.start();
```

### Game Examples

#### Character Jump

```typescript
const { Tween, Easing } = next2d.ui;

function jump(character) {
    const startY = character.y;
    const jumpHeight = 100;

    // Ascend
    const upJob = Tween.add(
        character,
        { y: startY },
        { y: startY - jumpHeight },
        0, 0.3,
        Easing.outQuad
    );

    // Descend
    const downJob = Tween.add(
        character,
        { y: startY - jumpHeight },
        { y: startY },
        0, 0.3,
        Easing.inQuad
    );

    // Chain ascend -> descend
    upJob.chain(downJob);
    upJob.start();
}
```

#### UI Animation

```typescript
const { Tween, Easing } = next2d.ui;

function showPopup(popup) {
    popup.scaleX = 0;
    popup.scaleY = 0;
    popup.alpha = 0;

    const job = Tween.add(
        popup,
        { scaleX: 0, scaleY: 0, alpha: 0 },
        { scaleX: 1, scaleY: 1, alpha: 1 },
        0, 0.4,
        Easing.outBack
    );

    job.start();
}

function hidePopup(popup) {
    const job = Tween.add(
        popup,
        { scaleX: 1, scaleY: 1, alpha: 1 },
        { scaleX: 0, scaleY: 0, alpha: 0 },
        0, 0.2,
        Easing.inQuad
    );

    job.addEventListener("complete", () => {
        popup.visible = false;
    });

    job.start();
}
```

#### Coin Collect Effect

```typescript
const { Tween, Easing } = next2d.ui;

function coinCollectEffect(coin) {
    const job = Tween.add(
        coin,
        { y: coin.y, alpha: 1, scaleX: 1, scaleY: 1 },
        { y: coin.y - 50, alpha: 0, scaleX: 0.5, scaleY: 0.5 },
        0, 0.5,
        Easing.outQuad
    );

    job.addEventListener("enterFrame", () => {
        coin.rotation += 15;
    });

    job.addEventListener("complete", () => {
        coin.parent?.removeChild(coin);
    });

    job.start();
}
```

### Stopping and Control

```typescript
const { Tween, Easing } = next2d.ui;

const job = Tween.add(
    sprite,
    { x: 0 },
    { x: 400 },
    0, 2,
    Easing.linear
);

job.start();

// Stop midway
stopButton.addEventListener(PointerEvent.POINTER_DOWN, () => {
    job.stop();
});
```

## Related

- [DisplayObject](/en/reference/player/display-object)
- [Event System](/en/reference/player/events)
