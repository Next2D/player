# WebGPU Best Practices and Troubleshooting

## Common Errors and Solutions

### Error: "Destroyed texture used in a submit"

**Cause**: メインキャンバステクスチャのライフサイクル管理が適切でない。

**Solution**: `clearTransferBounds()`がフレーム開始、`transferMainCanvas()`がフレーム終了を管理します。

```typescript
// ✅ 正しいパターン（Next2D内部で自動的に呼ばれる）
$context.clearTransferBounds();  // フレーム開始（内部でbeginFrame()）
$context.reset();
$context.fillBackgroundColor();
// ... 描画処理 ...
$context.drawArraysInstanced();
$context.transferMainCanvas();   // フレーム終了（内部でendFrame()）
```

## Frame Lifecycle Management

### Automatic Frame Management (Next2D Renderer)

Next2Dレンダラーは自動的にフレームライフサイクルを管理します：

```typescript
// CommandRenderUseCase内部
export const execute = (render_queue, image_bitmaps) => {
    // 1. フレーム開始
    $context.clearTransferBounds();  // ← beginFrame()を呼ぶ
    
    // 2. 描画準備
    $context.reset();
    $context.setTransform(1, 0, 0, 1, 0, 0);
    $context.fillBackgroundColor();
    
    // 3. オブジェクト描画
    while (render_queue.length > index) {
        // Shape, TextField, Video等を描画
    }
    
    // 4. インスタンス描画
    $context.drawArraysInstanced();
    
    // 5. フレーム終了
    $context.transferMainCanvas();  // ← endFrame()を呼ぶ
};
```

### Manual Frame Management (Standalone Use)

スタンドアロンで使用する場合：

```typescript
// レンダリングループ
function renderLoop() {
    // 1. フレーム開始
    ctx.beginFrame();
    
    // 2. 描画
    ctx.fillBackgroundColor();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(100, 100);
    ctx.fill();
    
    // 3. フレーム終了
    ctx.endFrame();
    
    requestAnimationFrame(renderLoop);
}
```

### Texture Lifecycle

```
clearTransferBounds()  [Next2D Renderer]
    ↓
beginFrame()
    ↓
mainTexture = null (リセット)
mainTextureView = null
currentRenderTarget = null
    ↓
fillBackgroundColor()
    → getMainTextureView()
        → canvasContext.getCurrentTexture()  ← 1回だけ
        → texture.createView()
        → キャッシュに保存
    ↓
beginNodeRendering(node)  [アトラス描画開始]
    → currentRenderTarget = atlasTextureView
    ↓
    描画処理（アトラステクスチャへ）
    ↓
endNodeRendering()
    → currentRenderTarget = null  [メインに戻る]
    ↓
drawArraysInstanced()
    → getMainTextureView()
        → キャッシュから取得
    ↓
transferMainCanvas()
    ↓
endFrame()
    → submit()
        → device.queue.submit([encoder.finish()])
    → mainTexture = null
    → mainTextureView = null
```

## Rendering Targets

### Main Canvas vs Atlas Texture

WebGPUでは2種類のレンダリングターゲットがあります：

1. **Main Canvas Texture** - 最終表示用
   - `getCurrentTexture()`で取得
   - フレームごとに一度だけ取得
   - `beginFrame()`でリセット、`endFrame()`でsubmit

2. **Atlas Texture** - キャッシュ用
   - フレームバッファとして作成
   - 複数のオブジェクトを格納
   - `beginNodeRendering()`で切り替え

```typescript
// メインキャンバスへの描画
ctx.fillBackgroundColor();  // メインキャンバス

// アトラステクスチャへの描画
ctx.beginNodeRendering(node);  // アトラスに切り替え
ctx.fill();                    // アトラステクスチャに描画
ctx.endNodeRendering();        // メインに戻る

// 再びメインキャンバスへ
ctx.drawArraysInstanced();  // メインキャンバス
```

## Command Encoder Management

### Best Practices

```typescript
// ❌ 悪い例：コマンドエンコーダーを手動管理
const encoder = device.createCommandEncoder();
const pass = encoder.beginRenderPass(...);
pass.end();
device.queue.submit([encoder.finish()]);
// 再度使用しようとするとエラー

// ✅ 良い例：Contextが自動管理
ctx.beginFrame();
ctx.fill();  // 内部でコマンドエンコーダーを作成・使用
ctx.endFrame();  // 自動的にsubmitとクリーンアップ
```

## Performance Tips

### 1. Minimize Render Passes

```typescript
// ❌ 非効率：複数のレンダーパス
ctx.beginFrame();
ctx.fillBackgroundColor();  // Render pass 1
ctx.fill();                 // Render pass 2
ctx.fill();                 // Render pass 3
ctx.endFrame();

// ✅ 効率的：描画をまとめる
ctx.beginFrame();
ctx.fillBackgroundColor();
// 複数の描画を1つのパスにまとめる（将来の最適化）
ctx.endFrame();
```

### 2. Reuse Resources

```typescript
// バッファやテクスチャは可能な限り再利用
const node = ctx.createNode(256, 256);  // 一度作成
// ... 何度も使用
ctx.removeNode(node);  // 不要になったら削除
```

### 3. Batch Draw Calls

```typescript
// 同じシェーダー・同じ設定の描画をまとめる
ctx.beginFrame();

// グループ1：赤い図形
ctx.fillStyle(1, 0, 0, 1);
ctx.fill();
ctx.fill();
ctx.fill();

// グループ2：青い図形
ctx.fillStyle(0, 0, 1, 1);
ctx.fill();
ctx.fill();

ctx.endFrame();
```

## Debugging

### Enable WebGPU Validation

Chromeの起動オプション：
```bash
--enable-dawn-features=use_dxc
--enable-unsafe-webgpu
```

### Check Device Lost

```typescript
device.lost.then((info) => {
    console.error('GPU device lost:', info.message);
    console.error('Reason:', info.reason);
});
```

### Monitor GPU Usage

Chrome DevToolsで確認：
1. DevToolsを開く
2. More tools → Performance monitor
3. GPU メモリとプロセスを監視

### Console Logging

```typescript
// デバッグモードを有効化
const ctx = new Context(device, context, format);

// フレーム情報をログ
let frameCount = 0;
function render() {
    ctx.beginFrame();
    console.log(`Frame ${++frameCount}`);
    
    // 描画
    
    ctx.endFrame();
    requestAnimationFrame(render);
}
```

## Common Pitfalls

### 1. ❌ Submit後にエンコーダーを使用

```typescript
const encoder = device.createCommandEncoder();
device.queue.submit([encoder.finish()]);
encoder.beginRenderPass(...);  // エラー！既にfinish済み
```

### 2. ❌ テクスチャビューの再作成

```typescript
const texture = context.getCurrentTexture();
const view1 = texture.createView();
const view2 = texture.createView();  // 不要！view1を再利用すべき
```

### 3. ❌ フレーム間でのリソース保持

```typescript
let oldTexture;
function render() {
    const texture = context.getCurrentTexture();
    if (oldTexture) {
        // oldTextureは既に破棄されている可能性がある
        useTexture(oldTexture);  // エラー！
    }
    oldTexture = texture;
}
```

## Migration from WebGL

### Key Differences

| WebGL | WebGPU |
|-------|--------|
| Immediate mode | Command buffer mode |
| 自動submit | 明示的submit必要 |
| グローバルステート | Explicit state |
| テクスチャ自動管理 | 手動管理必要 |

### Migration Tips

```typescript
// WebGL style
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

// WebGPU style (Next2D Context)
ctx.beginFrame();
ctx.updateBackgroundColor(0, 0, 0, 1);
ctx.fillBackgroundColor();
ctx.endFrame();
```

## Error Messages Reference

| Error | Cause | Solution |
|-------|-------|----------|
| "Destroyed texture used" | テクスチャ再利用 | `beginFrame()`/`endFrame()`使用 |
| "Command encoder already finished" | エンコーダー再利用 | 新しいエンコーダー作成 |
| "Invalid texture view" | ビュー作成失敗 | テクスチャが有効か確認 |
| "Queue submit failed" | 無効なコマンド | コマンドバッファの内容を確認 |

## Resources

- [WebGPU Specification](https://www.w3.org/TR/webgpu/)
- [WebGPU Fundamentals](https://webgpufundamentals.org/)
- [Chrome WebGPU Samples](https://github.com/austinEng/webgpu-samples)
