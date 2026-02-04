# 事件系统

Next2D Player 使用与 Flash Player 类似的事件模型。

## EventDispatcher

所有具有事件功能的对象的基类。

### addEventListener(type, listener, useCapture, priority)

注册事件侦听器。

```javascript
displayObject.addEventListener("click", function(event) {
    console.log("被点击");
});

// 在捕获阶段接收
displayObject.addEventListener("click", handler, true);

// 指定优先级
displayObject.addEventListener("click", handler, false, 10);
```

### removeEventListener(type, listener, useCapture)

移除事件侦听器。

```javascript
displayObject.removeEventListener("click", handler);
```

### hasEventListener(type)

检查是否注册了指定类型的侦听器。

```javascript
if (displayObject.hasEventListener("click")) {
    console.log("已注册点击侦听器");
}
```

### dispatchEvent(event)

派发事件。

```javascript
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
| `cancelable` | Boolean | 是否可取消 |

### 方法

| 方法 | 说明 |
|------|------|
| `stopPropagation()` | 停止传播 |
| `stopImmediatePropagation()` | 立即停止传播 |
| `preventDefault()` | 取消默认行为 |

## 标准事件类型

### 显示列表相关

| 事件 | 说明 |
|------|------|
| `added` | 添加到 DisplayObjectContainer |
| `addedToStage` | 添加到舞台 |
| `removed` | 从 DisplayObjectContainer 移除 |
| `removedFromStage` | 从舞台移除 |

```javascript
sprite.addEventListener("addedToStage", function(event) {
    console.log("添加到舞台");
});
```

### 时间轴相关

| 事件 | 说明 |
|------|------|
| `enterFrame` | 每帧发生 |
| `frameConstructed` | 帧构建完成 |
| `exitFrame` | 离开帧时 |

```javascript
movieClip.addEventListener("enterFrame", function(event) {
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
    console.log(percent + "% 已加载");
});

loader.load(new URLRequest("animation.json"));
```

## 鼠标事件

| 事件 | 说明 |
|------|------|
| `click` | 点击 |
| `doubleClick` | 双击 |
| `mouseDown` | 鼠标按下 |
| `mouseUp` | 鼠标释放 |
| `mouseMove` | 鼠标移动 |
| `mouseOver` | 鼠标移入 |
| `mouseOut` | 鼠标移出 |
| `rollOver` | 滚动移入 |
| `rollOut` | 滚动移出 |

```javascript
sprite.addEventListener("click", function(event) {
    console.log("点击位置:", event.localX, event.localY);
});

sprite.addEventListener("mouseMove", function(event) {
    console.log("鼠标位置:", event.stageX, event.stageY);
});
```

## 键盘事件

| 事件 | 说明 |
|------|------|
| `keyDown` | 按键按下 |
| `keyUp` | 按键释放 |

```javascript
stage.addEventListener("keyDown", function(event) {
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

## 自定义事件

```javascript
const { Event } = next2d.events;

// 定义自定义事件
const customEvent = new Event("gameOver", true, true);

// 派发事件
gameManager.dispatchEvent(customEvent);

// 监听事件
gameManager.addEventListener("gameOver", function(event) {
    showGameOverScreen();
});
```

## 事件传播

事件分三个阶段传播：

1. **捕获阶段**：从根到目标
2. **目标阶段**：在目标处处理
3. **冒泡阶段**：从目标到根

```javascript
// 在捕获阶段处理
parent.addEventListener("click", handler, true);

// 在冒泡阶段处理（默认）
child.addEventListener("click", handler, false);
```

## 相关

- [DisplayObject](/cn/reference/player/display-object)
- [MovieClip](/cn/reference/player/movie-clip)
