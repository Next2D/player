# 事件系统

Next2D Player 使用与 W3C DOM 事件模型类似的三阶段事件流机制。

## EventDispatcher

所有具有事件功能的对象的基类。

### addEventListener(type, listener, useCapture, priority)

注册事件侦听器。

```typescript
const { PointerEvent } = next2d.events;

displayObject.addEventListener(PointerEvent.POINTER_DOWN, (event) => {
    console.log("指针被按下");
});

// 在捕获阶段接收
displayObject.addEventListener(PointerEvent.POINTER_DOWN, handler, true);

// 指定优先级
displayObject.addEventListener(PointerEvent.POINTER_DOWN, handler, false, 10);
```

### removeEventListener(type, listener, useCapture)

移除事件侦听器。

```typescript
displayObject.removeEventListener(PointerEvent.POINTER_DOWN, handler);
```

### removeAllEventListener(type, useCapture)

移除特定类型的所有事件侦听器。

```typescript
displayObject.removeAllEventListener(PointerEvent.POINTER_DOWN);
```

### hasEventListener(type)

检查是否注册了指定类型的侦听器。

```typescript
if (displayObject.hasEventListener(PointerEvent.POINTER_DOWN)) {
    console.log("已注册指针按下侦听器");
}
```

### willTrigger(type)

检查此对象或祖先是否具有该事件类型的侦听器。

```typescript
if (displayObject.willTrigger(PointerEvent.POINTER_DOWN)) {
    console.log("此对象或祖先有侦听器");
}
```

### dispatchEvent(event)

派发事件。

```typescript
const { Event } = next2d.events;

const event = new Event("customEvent");
displayObject.dispatchEvent(event);
```

## Event 类

### 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `type` | String | 事件类型 |
| `target` | Object | 事件源 |
| `currentTarget` | Object | 当前侦听器目标 |
| `eventPhase` | Number | 事件阶段 |
| `bubbles` | Boolean | 是否冒泡 |

### 方法

| 方法 | 说明 |
|------|------|
| `stopPropagation()` | 停止传播 |
| `stopImmediatePropagation()` | 立即停止传播 |

## 标准事件类型

### 显示列表相关

| 事件 | 说明 |
|------|------|
| `added` | 添加到 DisplayObjectContainer |
| `addedToStage` | 添加到舞台 |
| `removed` | 从 DisplayObjectContainer 移除 |
| `removedFromStage` | 从舞台移除 |

```typescript
sprite.addEventListener("addedToStage", (event) => {
    console.log("添加到舞台");
});
```

### 时间轴相关

| 事件 | 说明 |
|------|------|
| `enterFrame` | 每帧发生 |
| `frameConstructed` | 帧构建完成 |
| `exitFrame` | 离开帧时 |

```typescript
movieClip.addEventListener("enterFrame", (event) => {
    // 每帧执行的处理
    updatePosition();
});
```

### 加载相关

| 事件 | 说明 |
|------|------|
| `complete` | 加载完成 |
| `progress` | 加载进度 |
| `ioError` | IO 错误 |
| `httpStatus` | HTTP 状态接收 |

```typescript
const { Loader } = next2d.display;
const { URLRequest } = next2d.net;

const loader = new Loader();

// 使用 async/await 加载
await loader.load(new URLRequest("animation.json"));
const content = loader.content;
stage.addChild(content);

// 使用进度事件
loader.contentLoaderInfo.addEventListener("progress", (event) => {
    const percent = (event.bytesLoaded / event.bytesTotal) * 100;
    console.log(`${percent}% 已加载`);
});
```

## 指针事件

PointerEvent 统一处理指针设备的操作（鼠标、笔、触摸）。

| 事件 | 常量 | 说明 |
|------|------|------|
| `pointerDown` | `PointerEvent.POINTER_DOWN` | 按钮按下开始 |
| `pointerUp` | `PointerEvent.POINTER_UP` | 按钮释放 |
| `pointerMove` | `PointerEvent.POINTER_MOVE` | 指针坐标变化 |
| `pointerOver` | `PointerEvent.POINTER_OVER` | 指针进入命中测试边界 |
| `pointerOut` | `PointerEvent.POINTER_OUT` | 指针离开命中测试边界 |
| `pointerLeave` | `PointerEvent.POINTER_LEAVE` | 指针离开元素区域 |
| `pointerCancel` | `PointerEvent.POINTER_CANCEL` | 指针交互被取消 |
| `doubleClick` | `PointerEvent.DOUBLE_CLICK` | 双击/双触发生 |

```typescript
const { PointerEvent } = next2d.events;

sprite.addEventListener(PointerEvent.POINTER_DOWN, (event) => {
    console.log("指针按下:", event.localX, event.localY);
});

sprite.addEventListener(PointerEvent.POINTER_MOVE, (event) => {
    console.log("指针移动:", event.stageX, event.stageY);
});

sprite.addEventListener(PointerEvent.DOUBLE_CLICK, (event) => {
    console.log("双击");
});
```

## 键盘事件

| 事件 | 常量 | 说明 |
|------|------|------|
| `keyDown` | `KeyboardEvent.KEY_DOWN` | 按键按下 |
| `keyUp` | `KeyboardEvent.KEY_UP` | 按键释放 |

```typescript
const { KeyboardEvent } = next2d.events;

stage.addEventListener(KeyboardEvent.KEY_DOWN, (event) => {
    console.log("键码:", event.keyCode);

    switch (event.keyCode) {
        case 37: // 左箭头
            player.x -= 10;
            break;
        case 39: // 右箭头
            player.x += 10;
            break;
    }
});
```

## 焦点事件

| 事件 | 常量 | 说明 |
|------|------|------|
| `focusIn` | `FocusEvent.FOCUS_IN` | 元素获得焦点 |
| `focusOut` | `FocusEvent.FOCUS_OUT` | 元素失去焦点 |

```typescript
const { FocusEvent } = next2d.events;

textField.addEventListener(FocusEvent.FOCUS_IN, (event) => {
    console.log("获得焦点");
});
```

## 滚轮事件

| 事件 | 常量 | 说明 |
|------|------|------|
| `wheel` | `WheelEvent.WHEEL` | 鼠标滚轮旋转 |

```typescript
const { WheelEvent } = next2d.events;

stage.addEventListener(WheelEvent.WHEEL, (event) => {
    console.log("滚轮旋转");
});
```

## 视频事件

| 事件 | 常量 | 说明 |
|------|------|------|
| `play` | `VideoEvent.PLAY` | 播放被请求 |
| `playing` | `VideoEvent.PLAYING` | 播放已开始 |
| `pause` | `VideoEvent.PAUSE` | 已暂停 |
| `seek` | `VideoEvent.SEEK` | 跳转操作 |

## 作业事件

补间动画用的事件。

| 事件 | 常量 | 说明 |
|------|------|------|
| `update` | `JobEvent.UPDATE` | 属性已更新 |
| `stop` | `JobEvent.STOP` | 作业已停止 |

## 自定义事件

```typescript
const { Event } = next2d.events;

// 定义自定义事件
const customEvent = new Event("gameOver", true, true);

// 派发事件
gameManager.dispatchEvent(customEvent);

// 监听事件
gameManager.addEventListener("gameOver", (event) => {
    showGameOverScreen();
});
```

## 事件传播

事件分三个阶段传播：

1. **捕获阶段**：从根到目标（eventPhase = 1）
2. **目标阶段**：在目标处处理（eventPhase = 2）
3. **冒泡阶段**：从目标到根（eventPhase = 3）

```typescript
const { PointerEvent } = next2d.events;

// 在捕获阶段处理
parent.addEventListener(PointerEvent.POINTER_DOWN, handler, true);

// 在冒泡阶段处理（默认）
child.addEventListener(PointerEvent.POINTER_DOWN, handler, false);
```

## 相关

- [DisplayObject](/cn/reference/player/display-object)
- [MovieClip](/cn/reference/player/movie-clip)
