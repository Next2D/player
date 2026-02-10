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

```javascript
class Tween {
    constructor(target, options) {
        this._target = target;
        this._properties = {};
        this._duration = options.duration;
        this._easing = options.easing || Easing.linear;
        this._startTime = 0;
        this._isPlaying = false;
        this._onUpdate = options.onUpdate;
        this._onComplete = options.onComplete;
    }

    to(properties) {
        for (const key in properties) {
            this._properties[key] = {
                start: this._target[key],
                end: properties[key]
            };
        }
        return this;
    }

    play() {
        this._startTime = Date.now();
        this._isPlaying = true;
        this._update();
        return this;
    }

    _update() {
        const self = this;
        if (!this._isPlaying) return;

        const elapsed = Date.now() - this._startTime;
        let progress = Math.min(1, elapsed / this._duration);
        progress = this._easing(progress);

        // Update properties
        for (const key in this._properties) {
            const prop = this._properties[key];
            this._target[key] = prop.start + (prop.end - prop.start) * progress;
        }

        if (this._onUpdate) {
            this._onUpdate();
        }

        if (elapsed < this._duration) {
            requestAnimationFrame(function() { self._update(); });
        } else {
            this._isPlaying = false;
            if (this._onComplete) {
                this._onComplete();
            }
        }
    }

    stop() {
        this._isPlaying = false;
    }
}
```

## Easing Functions

```javascript
const Easing = {
    // Linear
    linear: function(t) { return t; },

    // Acceleration
    easeInQuad: function(t) { return t * t; },
    easeInCubic: function(t) { return t * t * t; },
    easeInQuart: function(t) { return t * t * t * t; },

    // Deceleration
    easeOutQuad: function(t) { return t * (2 - t); },
    easeOutCubic: function(t) { return (--t) * t * t + 1; },
    easeOutQuart: function(t) { return 1 - (--t) * t * t * t; },

    // Acceleration → Deceleration
    easeInOutQuad: function(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInOutCubic: function(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },

    // Bounce
    easeOutBounce: function(t) {
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
    easeOutBack: function(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },

    // Elastic (rubber-like motion)
    easeOutElastic: function(t) {
        if (t === 0 || t === 1) return t;
        return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
    }
};
```

## Usage Examples

### Basic Movement Animation

```javascript
const { Sprite } = next2d.display;

const sprite = new Sprite();
sprite.x = 0;
sprite.y = 100;
stage.addChild(sprite);

// Move right
new Tween(sprite, { duration: 1000, easing: Easing.easeOutQuad })
    .to({ x: 400 })
    .play();
```

### Simultaneous Multi-Property Animation

```javascript
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

```javascript
// Consecutive animations
function sequentialAnimation(sprite) {
    new Tween(sprite, {
        duration: 500,
        onComplete: function() {
            new Tween(sprite, {
                duration: 300,
                onComplete: function() {
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

```javascript
function jump(character) {
    const startY = character.y;
    const jumpHeight = 100;

    // Ascend
    new Tween(character, {
        duration: 300,
        easing: Easing.easeOutQuad,
        onComplete: function() {
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

```javascript
function damageEffect(target) {
    const originalX = target.x;
    let shakeCount = 0;

    // Flash + Shake
    function shake() {
        if (shakeCount >= 6) {
            target.x = originalX;
            target.alpha = 1;
            return;
        }

        const offset = shakeCount % 2 === 0 ? 5 : -5;
        target.x = originalX + offset;
        target.alpha = shakeCount % 2 === 0 ? 0.5 : 1;
        shakeCount++;

        setTimeout(shake, 50);
    }

    shake();
}
```

#### Coin Collect Effect

```javascript
function coinCollectEffect(coin, targetY) {
    // Float up and fade out
    new Tween(coin, {
        duration: 500,
        easing: Easing.easeOutQuad,
        onUpdate: function() {
            // Rotate
            coin.rotation += 15;
        },
        onComplete: function() {
            if (coin.parent) {
                coin.parent.removeChild(coin);
            }
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

```javascript
function showPopup(popup) {
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

function hidePopup(popup, onComplete) {
    new Tween(popup, {
        duration: 200,
        easing: Easing.easeInQuad,
        onComplete: onComplete
    })
        .to({ scaleX: 0, scaleY: 0, alpha: 0 })
        .play();
}
```

## Lightweight enterFrame-based Tween

```javascript
// Simple enterFrame-based tween
function tweenTo(target, property, endValue, speed) {
    speed = speed || 0.1;

    function handler(event) {
        const current = target[property];
        const diff = endValue - current;

        if (Math.abs(diff) < 0.1) {
            target[property] = endValue;
            stage.removeEventListener("enterFrame", handler);
        } else {
            target[property] = current + diff * speed;
        }
    }

    stage.addEventListener("enterFrame", handler);
}

// Usage
tweenTo(sprite, "x", 300, 0.15);  // Move x toward 300
tweenTo(sprite, "alpha", 0, 0.05);  // Fade out
```

## Custom Easing

```javascript
// Bezier curve based easing
function bezierEasing(x1, y1, x2, y2) {
    return function(t) {
        // Simple cubic bezier interpolation
        const cx = 3 * x1;
        const bx = 3 * (x2 - x1) - cx;
        const ax = 1 - cx - bx;

        const cy = 3 * y1;
        const by = 3 * (y2 - y1) - cy;
        const ay = 1 - cy - by;

        function sampleCurveY(t) {
            return ((ay * t + by) * t + cy) * t;
        }

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

- [DisplayObject](/en/reference/player/display-object)
- [Event System](/en/reference/player/events)
