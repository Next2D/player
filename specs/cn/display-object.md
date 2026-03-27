# DisplayObject

DisplayObject 是 Next2D Player 中所有显示对象的基类。

## 属性

### 只读属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `instanceId` | number | DisplayObject 的唯一实例 ID |
| `isSprite` | boolean | 返回是否具有 Sprite 功能 |
| `isInteractive` | boolean | 返回是否具有 InteractiveObject 功能 |
| `isContainerEnabled` | boolean | 返回显示对象是否具有容器功能 |
| `isTimelineEnabled` | boolean | 返回显示对象是否具有 MovieClip 功能 |
| `isShape` | boolean | 返回显示对象是否具有 Shape 功能 |
| `isVideo` | boolean | 返回显示对象是否具有 Video 功能 |
| `isText` | boolean | 返回显示对象是否具有 Text 功能 |
| `concatenatedMatrix` | Matrix | 到根级别的组合变换矩阵 |
| `dropTarget` | DisplayObject \| null | 精灵被拖动或放置到的显示对象 |
| `loaderInfo` | LoaderInfo \| null | 此显示对象所属文件的加载信息 |
| `mouseX` | number | 鼠标相对于 DisplayObject 参考点的 X 坐标（像素） |
| `mouseY` | number | 鼠标相对于 DisplayObject 参考点的 Y 坐标（像素） |
| `root` | MovieClip \| Sprite \| null | DisplayObject 的根 DisplayObjectContainer |

### 可读写属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `name` | string | 名称。用于 getChildByName()（默认：""） |
| `startFrame` | number | 起始帧（默认：1） |
| `endFrame` | number | 结束帧（默认：0） |
| `isMask` | boolean | 表示 DisplayObject 是否被设置为遮罩（默认：false） |
| `parent` | Sprite \| MovieClip \| null | 此 DisplayObject 的父 DisplayObjectContainer |
| `alpha` | number | Alpha 透明度值（0.0-1.0，默认：1.0） |
| `blendMode` | string | 要使用的混合模式（默认：BlendMode.NORMAL） |
| `filters` | Array \| null | 与显示对象关联的滤镜对象数组 |
| `height` | number | 显示对象的高度（像素） |
| `width` | number | 显示对象的宽度（像素） |
| `colorTransform` | ColorTransform | 显示对象的 ColorTransform |
| `matrix` | Matrix | 显示对象的 Matrix |
| `rotation` | number | DisplayObject 实例的旋转角度（度） |
| `scale9Grid` | Rectangle \| null | 当前活动的缩放网格 |
| `scaleX` | number | 从参考点应用的对象水平缩放值 |
| `scaleY` | number | 从参考点应用的对象垂直缩放值 |
| `visible` | boolean | 显示对象是否可见（默认：true） |
| `cacheAsBitmap` | Matrix \| null | 位图缓存用的 Matrix。以指定 Matrix × 舞台缩放比例缓存 Shape/TextField，在舞台调整大小之前重复使用。不受祖先 Matrix 的影响（默认：null） |
| `x` | number | 相对于父 DisplayObjectContainer 本地坐标的 X 坐标 |
| `y` | number | 相对于父 DisplayObjectContainer 本地坐标的 Y 坐标 |

## 方法

| 方法 | 返回类型 | 说明 |
|------|----------|------|
| `getBounds(targetDisplayObject)` | Rectangle | 返回定义显示对象相对于指定 DisplayObject 坐标系统区域的矩形 |
| `globalToLocal(point)` | Point | 将点对象从舞台（全局）坐标转换为显示对象（本地）坐标 |
| `localToGlobal(point)` | Point | 将点对象从显示对象（本地）坐标转换为舞台（全局）坐标 |
| `hitTestObject(targetDisplayObject)` | boolean | 评估 DisplayObject 的绘制范围是否重叠或相交 |
| `hitTestPoint(x, y, shapeFlag)` | boolean | 评估显示对象是否与 x 和 y 参数指定的点重叠或相交 |
| `getLocalVariable(key)` | any | 从类的本地变量空间获取值 |
| `setLocalVariable(key, value)` | void | 在类的本地变量空间中存储值 |
| `hasLocalVariable(key)` | boolean | 确定类的本地变量空间中是否有值 |
| `deleteLocalVariable(key)` | void | 从类的本地变量空间中删除值 |
| `getGlobalVariable(key)` | any | 从全局变量空间获取值 |
| `setGlobalVariable(key, value)` | void | 将值保存到全局变量空间 |
| `hasGlobalVariable(key)` | boolean | 确定全局变量空间中是否有值 |
| `deleteGlobalVariable(key)` | void | 从全局变量空间中删除值 |
| `clearGlobalVariable()` | void | 清除全局变量空间中的所有值 |
| `remove()` | void | 移除父子关系 |

## 混合模式

| 常量 | 说明 |
|------|------|
| `BlendMode.NORMAL` | 正常显示 |
| `BlendMode.ADD` | 叠加 |
| `BlendMode.MULTIPLY` | 正片叠底 |
| `BlendMode.SCREEN` | 滤色 |
| `BlendMode.DARKEN` | 变暗 |
| `BlendMode.LIGHTEN` | 变亮 |
| `BlendMode.DIFFERENCE` | 差值 |
| `BlendMode.OVERLAY` | 叠加 |
| `BlendMode.HARDLIGHT` | 强光 |
| `BlendMode.INVERT` | 反转 |
| `BlendMode.ALPHA` | Alpha |
| `BlendMode.ERASE` | 擦除 |

## 使用示例

```typescript
const { Sprite } = next2d.display;
const { BlurFilter } = next2d.filters;

const sprite = new Sprite();

// 位置和大小
sprite.x = 100;
sprite.y = 200;
sprite.scaleX = 1.5;
sprite.scaleY = 1.5;
sprite.rotation = 30;

// 显示控制
sprite.alpha = 0.8;
sprite.visible = true;
sprite.blendMode = "add";

// 滤镜
sprite.filters = [
    new BlurFilter(4, 4)
];

// 添加到舞台
stage.addChild(sprite);
```

### 坐标变换示例

```typescript
const { Point } = next2d.geom;

// 将全局坐标转换为本地坐标
const globalPoint = new Point(100, 100);
const localPoint = displayObject.globalToLocal(globalPoint);

// 将本地坐标转换为全局坐标
const localPos = new Point(0, 0);
const globalPos = displayObject.localToGlobal(localPos);
```

### 碰撞检测示例

```typescript
// 使用边界框检测
const hit1 = displayObject.hitTestPoint(100, 100, false);

// 使用实际形状检测
const hit2 = displayObject.hitTestPoint(100, 100, true);

// 与另一个 DisplayObject 进行碰撞检测
if (obj1.hitTestObject(obj2)) {
    console.log("检测到碰撞");
}
```

### 变量操作示例

```typescript
// 本地变量操作
displayObject.setLocalVariable("score", 100);
const score = displayObject.getLocalVariable("score");
if (displayObject.hasLocalVariable("score")) {
    displayObject.deleteLocalVariable("score");
}

// 全局变量操作
displayObject.setGlobalVariable("gameState", "playing");
const state = displayObject.getGlobalVariable("gameState");
displayObject.clearGlobalVariable(); // 清除全部
```

### cacheAsBitmap 示例

```typescript
const { Shape, Sprite } = next2d.display;
const { Matrix } = next2d.geom;

// 以 1 倍比例缓存
const shape = new Shape();
shape.graphics.beginFill(0xFF0000).drawCircle(50, 50, 40).endFill();
shape.cacheAsBitmap = new Matrix(1, 0, 0, 1, 0, 0);

// 以 2 倍分辨率缓存（高质量）
const hqShape = new Shape();
hqShape.graphics.beginFill(0x00FF00).drawRect(0, 0, 100, 80).endFill();
hqShape.cacheAsBitmap = new Matrix(2, 0, 0, 2, 0, 0);

// 不受父级缩放影响（缓存质量由指定的 Matrix 固定）
const container = new Sprite();
container.scaleX = 3;
container.scaleY = 3;
container.addChild(shape);

// 禁用缓存
shape.cacheAsBitmap = null;
```

## 相关

- [MovieClip](/cn/reference/player/movie-clip)
- [Sprite](/cn/reference/player/sprite)
