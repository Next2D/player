# 衝突判定

ゲーム開発において衝突判定（当たり判定）は必須の機能です。Next2D Playerは組み込みの衝突判定メソッドを提供しています。

## 衝突判定の種類

```mermaid
flowchart LR
    subgraph Methods["判定方法"]
        AABB["AABB<br/>hitTestObject"]
        Point["ポイント<br/>hitTestPoint"]
        Shape["シェイプ<br/>hitTestPoint(shapeFlag)"]
    end

    subgraph Usage["用途"]
        Simple["シンプルな判定<br/>速い"]
        Click["クリック判定"]
        Pixel["ピクセル精度<br/>正確"]
    end

    AABB --> Simple
    Point --> Click
    Shape --> Pixel
```

## hitTestObject

2つのDisplayObjectの矩形（バウンディングボックス）で衝突判定を行います。

```typescript
import type { DisplayObject, Sprite } from "@next2d/player";

// 基本的な使用法
const isColliding: boolean = object1.hitTestObject(object2);

if (player.hitTestObject(enemy)) {
  // 衝突時の処理
  handleCollision();
}
```

### プレイヤーと敵の衝突

```typescript
interface Entity {
  sprite: Sprite;
  isActive: boolean;
}

function checkPlayerEnemyCollision(
  player: Entity,
  enemies: Entity[]
): Entity | null {
  for (const enemy of enemies) {
    if (!enemy.isActive) continue;

    if (player.sprite.hitTestObject(enemy.sprite)) {
      return enemy;  // 衝突した敵を返す
    }
  }
  return null;
}

// ゲームループでの使用
function gameLoop(): void {
  const hitEnemy = checkPlayerEnemyCollision(player, enemies);
  if (hitEnemy) {
    player.takeDamage();
    hitEnemy.isActive = false;
  }
}
```

### 弾と敵の衝突

```typescript
function checkBulletEnemyCollisions(
  bullets: Entity[],
  enemies: Entity[]
): void {
  for (const bullet of bullets) {
    if (!bullet.isActive) continue;

    for (const enemy of enemies) {
      if (!enemy.isActive) continue;

      if (bullet.sprite.hitTestObject(enemy.sprite)) {
        // 衝突処理
        bullet.isActive = false;
        bullet.sprite.visible = false;

        enemy.takeDamage();
        if (enemy.hp <= 0) {
          enemy.isActive = false;
          enemy.sprite.visible = false;
          addScore(100);
        }
        break;  // この弾の判定は終了
      }
    }
  }
}
```

## hitTestPoint

指定した座標との衝突判定を行います。

```typescript
// バウンディングボックスで判定（高速）
const hit: boolean = sprite.hitTestPoint(x, y, false);

// 実際の形状で判定（正確）
const hitShape: boolean = sprite.hitTestPoint(x, y, true);
```

### クリック判定

```typescript
import type { MouseEvent, Sprite } from "@next2d/player";

function onStageClick(event: MouseEvent): void {
  const x: number = event.stageX;
  const y: number = event.stageY;

  // クリックされたオブジェクトを探す
  for (const item of clickableItems) {
    if (item.hitTestPoint(x, y, true)) {
      handleItemClick(item);
      break;
    }
  }
}

stage.addEventListener("click", onStageClick);
```

### シェイプ判定を使った精密な当たり判定

```typescript
// 複雑な形状のキャラクター
function isHitByBullet(character: Sprite, bulletX: number, bulletY: number): boolean {
  // trueを渡すと実際のピクセル形状で判定
  return character.hitTestPoint(bulletX, bulletY, true);
}
```

## カスタム衝突判定

### 円同士の衝突

```typescript
interface Circle {
  x: number;
  y: number;
  radius: number;
}

function circleCollision(c1: Circle, c2: Circle): boolean {
  const dx: number = c1.x - c2.x;
  const dy: number = c1.y - c2.y;
  const distance: number = Math.sqrt(dx * dx + dy * dy);
  return distance < c1.radius + c2.radius;
}

// 使用例
const player: Circle = { x: 100, y: 100, radius: 20 };
const enemy: Circle = { x: 150, y: 120, radius: 15 };

if (circleCollision(player, enemy)) {
  // 衝突
}
```

### 矩形同士の衝突（AABB）

```typescript
interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

function rectCollision(r1: Rectangle, r2: Rectangle): boolean {
  return r1.x < r2.x + r2.width &&
         r1.x + r1.width > r2.x &&
         r1.y < r2.y + r2.height &&
         r1.y + r1.height > r2.y;
}
```

### 円と矩形の衝突

```typescript
function circleRectCollision(circle: Circle, rect: Rectangle): boolean {
  // 矩形の最も近い点を見つける
  const closestX: number = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  const closestY: number = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

  // 円の中心との距離を計算
  const dx: number = circle.x - closestX;
  const dy: number = circle.y - closestY;
  const distance: number = Math.sqrt(dx * dx + dy * dy);

  return distance < circle.radius;
}
```

## 空間分割による最適化

### グリッドベースの衝突判定

```typescript
interface GridCell {
  entities: Entity[];
}

class SpatialGrid {
  private _cellSize: number;
  private _cells: Map<string, GridCell> = new Map();

  constructor(cellSize: number) {
    this._cellSize = cellSize;
  }

  private _getCellKey(x: number, y: number): string {
    const cellX: number = Math.floor(x / this._cellSize);
    const cellY: number = Math.floor(y / this._cellSize);
    return `${cellX},${cellY}`;
  }

  clear(): void {
    this._cells.clear();
  }

  insert(entity: Entity): void {
    const key: string = this._getCellKey(entity.x, entity.y);
    let cell: GridCell | undefined = this._cells.get(key);

    if (!cell) {
      cell = { entities: [] };
      this._cells.set(key, cell);
    }

    cell.entities.push(entity);
  }

  getNearby(x: number, y: number): Entity[] {
    const result: Entity[] = [];

    // 周囲9セルをチェック
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const cellX: number = Math.floor(x / this._cellSize) + dx;
        const cellY: number = Math.floor(y / this._cellSize) + dy;
        const key: string = `${cellX},${cellY}`;
        const cell: GridCell | undefined = this._cells.get(key);

        if (cell) {
          result.push(...cell.entities);
        }
      }
    }

    return result;
  }
}

// 使用例
const grid: SpatialGrid = new SpatialGrid(100);

function checkCollisions(): void {
  // グリッドをクリアして再構築
  grid.clear();
  for (const enemy of enemies) {
    if (enemy.isActive) {
      grid.insert(enemy);
    }
  }

  // プレイヤー周辺のみチェック
  const nearbyEnemies: Entity[] = grid.getNearby(player.x, player.y);
  for (const enemy of nearbyEnemies) {
    if (player.sprite.hitTestObject(enemy.sprite)) {
      handleCollision(player, enemy);
    }
  }
}
```

## 衝突応答

### 押し戻し（反発）

```typescript
function resolveCollision(
  moving: { x: number; y: number; vx: number; vy: number },
  static_: { x: number; y: number; width: number; height: number }
): void {
  // オーバーラップ量を計算
  const overlapLeft: number = (moving.x + 20) - static_.x;
  const overlapRight: number = (static_.x + static_.width) - (moving.x - 20);
  const overlapTop: number = (moving.y + 20) - static_.y;
  const overlapBottom: number = (static_.y + static_.height) - (moving.y - 20);

  // 最小のオーバーラップ方向に押し戻す
  const minOverlapX: number = overlapLeft < overlapRight ? -overlapLeft : overlapRight;
  const minOverlapY: number = overlapTop < overlapBottom ? -overlapTop : overlapBottom;

  if (Math.abs(minOverlapX) < Math.abs(minOverlapY)) {
    moving.x += minOverlapX;
    moving.vx = 0;
  } else {
    moving.y += minOverlapY;
    moving.vy = 0;
  }
}
```

### 反射（跳ね返り）

```typescript
function reflectVelocity(
  entity: { vx: number; vy: number },
  normalX: number,
  normalY: number,
  bounciness: number = 0.8
): void {
  // 反射ベクトルを計算
  const dot: number = entity.vx * normalX + entity.vy * normalY;
  entity.vx = (entity.vx - 2 * dot * normalX) * bounciness;
  entity.vy = (entity.vy - 2 * dot * normalY) * bounciness;
}

// 壁で跳ね返り
function bounceOffWalls(ball: Entity): void {
  if (ball.x - ball.radius < 0) {
    ball.x = ball.radius;
    reflectVelocity(ball, 1, 0);  // 左壁
  }
  if (ball.x + ball.radius > stage.stageWidth) {
    ball.x = stage.stageWidth - ball.radius;
    reflectVelocity(ball, -1, 0);  // 右壁
  }
  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
    reflectVelocity(ball, 0, 1);  // 上壁
  }
  if (ball.y + ball.radius > stage.stageHeight) {
    ball.y = stage.stageHeight - ball.radius;
    reflectVelocity(ball, 0, -1);  // 下壁
  }
}
```

## プラットフォーマーの衝突判定

```typescript
interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

function checkPlatformCollision(
  player: { x: number; y: number; vy: number; width: number; height: number },
  platforms: Platform[]
): boolean {
  let onGround: boolean = false;

  for (const platform of platforms) {
    // プレイヤーの足元がプラットフォームの上面にあるか
    const playerBottom: number = player.y + player.height / 2;
    const playerLeft: number = player.x - player.width / 2;
    const playerRight: number = player.x + player.width / 2;

    if (playerBottom >= platform.y &&
        playerBottom <= platform.y + 10 &&  // 許容範囲
        playerRight > platform.x &&
        playerLeft < platform.x + platform.width &&
        player.vy >= 0) {  // 落下中のみ
      player.y = platform.y - player.height / 2;
      player.vy = 0;
      onGround = true;
    }
  }

  return onGround;
}
```

## パフォーマンスのヒント

1. **早期リターン**: 明らかに衝突しない場合は早めに判定を終了
2. **空間分割**: 大量のオブジェクトはグリッドや四分木で管理
3. **判定の簡略化**: 複雑な形状はシンプルな判定（円、矩形）で近似
4. **判定頻度の調整**: 高速移動するオブジェクトのみ毎フレーム判定

```typescript
// 距離による早期リターン
function quickDistanceCheck(e1: Entity, e2: Entity, maxDistance: number): boolean {
  const dx: number = e1.x - e2.x;
  const dy: number = e1.y - e2.y;
  // Math.sqrtを避けて高速化
  return dx * dx + dy * dy < maxDistance * maxDistance;
}

function checkCollisions(): void {
  for (const enemy of enemies) {
    // 距離が遠ければスキップ
    if (!quickDistanceCheck(player, enemy, 100)) continue;

    // 詳細な判定
    if (player.sprite.hitTestObject(enemy.sprite)) {
      handleCollision();
    }
  }
}
```

## 関連項目

- [DisplayObject](./display-object.md)
- [ゲームループ](./game-loop.md)
- [パフォーマンス最適化](./performance.md)
