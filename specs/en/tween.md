# Tween Animation

Next2D Player allows you to implement programmatic animations (Tweens). You can smoothly animate properties like position, size, and transparency.

## Basic Tween Concepts

```mermaid
flowchart LR
    Start["Start Value"] -->|Easing Function| Progress["Progress 0→1"]
    Progress --> End["End Value"]

    subgraph Easing["Easing"]
        Linear["Linear"]
        EaseIn["EaseIn"]
        EaseOut["EaseOut"]
        EaseInOut["EaseInOut"]
    end
```

## Basic Tween Class

```typescript
import type { DisplayObject } from "@next2d/player";

type EasingFunction = (t: number) => number;

interface TweenOptions {
  duration: number;        // milliseconds
  easing?: EasingFunction;
  onUpdate?: () => void;
  onComplete?: () => void;
}

class Tween {
  private _target: DisplayObject;
  private _properties: Record<string, { start: number; end: number }> = {};
  private _duration: number;
  private _easing: EasingFunction;
  private _startTime: number = 0;
  private _isPlaying: boolean = false;
  private _onUpdate?: () => void;
  private _onComplete?: () => void;

  constructor(target: DisplayObject, options: TweenOptions) {
    this._target = target;
    this._duration = options.duration;
    this._easing = options.easing || Easing.linear;
    this._onUpdate = options.onUpdate;
    this._onComplete = options.onComplete;
  }

  to(properties: Record<string, number>): Tween {
    for (const key in properties) {
      this._properties[key] = {
        start: (this._target as any)[key],
        end: properties[key]
      };
    }
    return this;
  }

  play(): Tween {
    this._startTime = Date.now();
    this._isPlaying = true;
    this._update();
    return this;
  }

  private _update = (): void => {
    if (!this._isPlaying) return;

    const elapsed: number = Date.now() - this._startTime;
    let progress: number = Math.min(1, elapsed / this._duration);
    progress = this._easing(progress);

    // Update properties
    for (const key in this._properties) {
      const prop = this._properties[key];
      (this._target as any)[key] = prop.start + (prop.end - prop.start) * progress;
    }

    if (this._onUpdate) {
      this._onUpdate();
    }

    if (elapsed < this._duration) {
      requestAnimationFrame(this._update);
    } else {
      this._isPlaying = false;
      if (this._onComplete) {
        this._onComplete();
      }
    }
  };

  stop(): void {
    this._isPlaying = false;
  }
}
```

## Easing Functions

```typescript
const Easing = {
  // Linear
  linear: (t: number): number => t,

  // Acceleration
  easeInQuad: (t: number): number => t * t,
  easeInCubic: (t: number): number => t * t * t,
  easeInQuart: (t: number): number => t * t * t * t,

  // Deceleration
  easeOutQuad: (t: number): number => t * (2 - t),
  easeOutCubic: (t: number): number => (--t) * t * t + 1,
  easeOutQuart: (t: number): number => 1 - (--t) * t * t * t,

  // Acceleration → Deceleration
  easeInOutQuad: (t: number): number =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInOutCubic: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  // Bounce
  easeOutBounce: (t: number): number => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  },

  // Back (overshoots then returns)
  easeOutBack: (t: number): number => {
    const c1: number = 1.70158;
    const c3: number = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },

  // Elastic (rubber-like motion)
  easeOutElastic: (t: number): number => {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
  }
};
```

## Usage Examples

### Basic Movement Animation

```typescript
import { Sprite } from "@next2d/player";

const sprite: Sprite = new Sprite();
sprite.x = 0;
sprite.y = 100;
stage.addChild(sprite);

// Move right
new Tween(sprite, { duration: 1000, easing: Easing.easeOutQuad })
  .to({ x: 400 })
  .play();
```

### Simultaneous Multi-Property Animation

```typescript
// Move + Scale + Fade in
new Tween(sprite, {
  duration: 500,
  easing: Easing.easeOutCubic
})
  .to({
    x: 200,
    y: 150,
    scaleX: 2,
    scaleY: 2,
    alpha: 1
  })
  .play();
```

### Sequential Animation

```typescript
// Consecutive animations
function sequentialAnimation(sprite: DisplayObject): void {
  new Tween(sprite, {
    duration: 500,
    onComplete: () => {
      new Tween(sprite, {
        duration: 300,
        onComplete: () => {
          new Tween(sprite, { duration: 500 })
            .to({ alpha: 0 })
            .play();
        }
      })
        .to({ scaleX: 1.5, scaleY: 1.5 })
        .play();
    }
  })
    .to({ y: 100 })
    .play();
}
```

### Game Examples

#### Character Jump

```typescript
function jump(character: DisplayObject): void {
  const startY: number = character.y;
  const jumpHeight: number = 100;

  // Ascend
  new Tween(character, {
    duration: 300,
    easing: Easing.easeOutQuad,
    onComplete: () => {
      // Descend
      new Tween(character, {
        duration: 300,
        easing: Easing.easeInQuad
      })
        .to({ y: startY })
        .play();
    }
  })
    .to({ y: startY - jumpHeight })
    .play();
}
```

#### Damage Effect

```typescript
function damageEffect(target: DisplayObject): void {
  const originalX: number = target.x;
  let shakeCount: number = 0;

  // Flash + Shake
  const shake = (): void => {
    if (shakeCount >= 6) {
      target.x = originalX;
      target.alpha = 1;
      return;
    }

    const offset: number = shakeCount % 2 === 0 ? 5 : -5;
    target.x = originalX + offset;
    target.alpha = shakeCount % 2 === 0 ? 0.5 : 1;
    shakeCount++;

    setTimeout(shake, 50);
  };

  shake();
}
```

#### Coin Collect Effect

```typescript
function coinCollectEffect(coin: DisplayObject, targetY: number): void {
  // Float up and fade out
  new Tween(coin, {
    duration: 500,
    easing: Easing.easeOutQuad,
    onUpdate: () => {
      // Rotate
      coin.rotation += 15;
    },
    onComplete: () => {
      coin.parent?.removeChild(coin);
    }
  })
    .to({
      y: targetY,
      alpha: 0,
      scaleX: 0.5,
      scaleY: 0.5
    })
    .play();
}
```

#### UI Animation

```typescript
function showPopup(popup: DisplayObject): void {
  popup.scaleX = 0;
  popup.scaleY = 0;
  popup.alpha = 0;

  new Tween(popup, {
    duration: 400,
    easing: Easing.easeOutBack
  })
    .to({ scaleX: 1, scaleY: 1, alpha: 1 })
    .play();
}

function hidePopup(popup: DisplayObject, onComplete: () => void): void {
  new Tween(popup, {
    duration: 200,
    easing: Easing.easeInQuad,
    onComplete
  })
    .to({ scaleX: 0, scaleY: 0, alpha: 0 })
    .play();
}
```

## Lightweight enterFrame-based Tween

```typescript
import type { DisplayObject, Event } from "@next2d/player";

// Simple enterFrame-based tween
function tweenTo(
  target: DisplayObject,
  property: string,
  endValue: number,
  speed: number = 0.1
): void {
  const handler = (event: Event): void => {
    const current: number = (target as any)[property];
    const diff: number = endValue - current;

    if (Math.abs(diff) < 0.1) {
      (target as any)[property] = endValue;
      stage.removeEventListener("enterFrame", handler);
    } else {
      (target as any)[property] = current + diff * speed;
    }
  };

  stage.addEventListener("enterFrame", handler);
}

// Usage
tweenTo(sprite, "x", 300, 0.15);  // Move x toward 300
tweenTo(sprite, "alpha", 0, 0.05);  // Fade out
```

## Custom Easing

```typescript
// Bezier curve based easing
function bezierEasing(
  x1: number, y1: number,
  x2: number, y2: number
): EasingFunction {
  return (t: number): number => {
    // Simple cubic bezier interpolation
    const cx: number = 3 * x1;
    const bx: number = 3 * (x2 - x1) - cx;
    const ax: number = 1 - cx - bx;

    const cy: number = 3 * y1;
    const by: number = 3 * (y2 - y1) - cy;
    const ay: number = 1 - cy - by;

    const sampleCurveY = (t: number): number =>
      ((ay * t + by) * t + cy) * t;

    return sampleCurveY(t);
  };
}

// CSS cubic-bezier equivalent
const customEase = bezierEasing(0.25, 0.1, 0.25, 1.0);
```

## Performance Tips

1. **Use requestAnimationFrame**: Smoother than setTimeout
2. **Minimize Property Changes**: Only update necessary properties
3. **Object Pooling**: Pool and reuse tweens for many animations
4. **Cleanup After Completion**: Remove unnecessary listeners

## Related

- [DisplayObject](./display-object.md)
- [Game Loop](./game-loop.md)
- [Event System](./events.md)
