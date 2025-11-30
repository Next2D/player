# WebGPU Implementation Progress

## 問題の診断と修正

### エラー内容
```
Destroyed texture [Texture "IOSurface(RasterRead|DisplayRead|Scanout|WebgpuRead|WebgpuSwapChainTexture|WebgpuWrite)"] used in a submit.
 - While calling [Queue].Submit([[CommandBuffer]])
```

### 根本原因
WebGPUの`getCurrentTexture()`で取得したキャンバステクスチャのライフサイクル管理が不適切でした:
- フレーム終了時にテクスチャ参照を`null`にクリアしていた
- その後`submit()`を呼び出していたため、コマンドバッファ内の破棄済みテクスチャが使用されていた

### 修正内容
`packages/webgpu/src/Context.ts`の`endFrame()`メソッドを修正:

```typescript
// 修正前: submit前にテクスチャをクリア（❌ 間違い）
private endFrame(): void {
    this.mainTexture = null;  // ← 先にクリア
    if (this.commandEncoder) {
        this.device.queue.submit([...]);  // ← 破棄済みテクスチャを使用
    }
}

// 修正後: submit後にテクスチャをクリア（✅ 正しい）
public endFrame(): void {
    if (this.commandEncoder) {
        const commandBuffer = this.commandEncoder.finish();
        this.device.queue.submit([commandBuffer]);  // ← テクスチャは有効
    }
    // submitの後でクリア
    this.commandEncoder = null;
    this.mainTexture = null;
    this.mainTextureView = null;
}
```

## レンダリングフロー（README.mdのフローチャートより）

### 1. キャッシュなしの場合（初回描画）
```
DisplayObject (Shape/TextField/Video)
  ↓
マスク判定? → いいえ
  ↓
キャッシュ存在? → いいえ
  ↓
Texture-Packerに描画範囲を渡す
  ↓
テクスチャーアトラスの座標を取得 (x, y, w, h)
  ↓
Nodeの座標にアトラステクスチャへ描画
  ↓
キャッシュに保存
```

### 2. キャッシュありの場合（2回目以降）
```
DisplayObject
  ↓
マスク判定? → いいえ
  ↓
キャッシュ存在? → はい
  ↓
座標情報DBから取得
  ↓
フィルター/ブレンド? → いいえ
  ↓
Instanced Arrayに追加
  (matrix, colorTransform, coordinates)
  ↓
drawArraysInstanced() でバッチ描画
  ↓
メインフレームバッファに出力
```

### 3. フィルター/ブレンドありの場合
```
フィルター/ブレンド? → はい
  ↓
キャッシュ存在? → いいえ → キャッシュに描画
  ↓
テクスチャキャッシュ
  ↓
drawArrays() で個別描画
  ↓
フィルター/ブレンド適用
  ↓
メインフレームバッファ
```

### 4. マスクの場合
```
マスク判定? → はい
  ↓
メインフレームバッファに直接描画
  ↓
drawArrays() (ステンシルバッファ使用)
```

## 実装状況

### ✅ 完了
1. **テクスチャライフサイクル管理** - 修正完了
2. **基本的なContext構造** - 実装済み
3. **BufferManager** - 基本実装済み
4. **TextureManager** - 基本実装済み
5. **FrameBufferManager** - 基本構造実装済み
6. **PathCommand** - 基本実装済み

### 🚧 未実装（WebGLから移植が必要）

#### 高優先度
1. **Instanced Array Rendering**
   - `drawArraysInstanced()` の実装
   - インスタンスバッファの管理
   - バッチレンダリングの最適化
   - WebGL: `packages/webgl/src/Blend/usecase/BlnedDrawArraysInstancedUseCase.ts`

2. **Atlas Texture Management**
   - アトラステクスチャの作成と管理
   - Texture-Packerとの統合
   - `beginNodeRendering()` / `endNodeRendering()` の完全実装
   - WebGL: `packages/webgl/src/AtlasManager.ts`

3. **Shader System (WGSL)**
   - 基本的な塗りつぶし/線描画シェーダー
   - グラデーションシェーダー
   - ビットマップテクスチャシェーダー
   - WebGL: `packages/webgl/src/Shader/`

#### 中優先度
4. **Filter System**
   - BlurFilter
   - GlowFilter
   - DropShadowFilter
   - ColorMatrixFilter
   - その他フィルター
   - WebGL: `packages/webgl/src/Filter/`

5. **Blend Mode System**
   - normal, multiply, add, screen等
   - WebGL: `packages/webgl/src/Blend/`

6. **Mask Rendering**
   - ステンシルバッファを使用したマスク処理
   - ネストされたマスクのサポート
   - WebGL: `packages/webgl/src/Mask/`

#### 低優先度
7. **Path Rendering詳細**
   - ベジェ曲線のテッセレーション最適化
   - メッシュ生成の改善

## 次のステップ

### 即座に確認すべきこと
1. テクスチャライフサイクル修正でエラーが解消されたか確認
2. 基本的な描画が動作するか確認

### 短期的な実装タスク
1. 基本的なインスタンス配列レンダリングを実装
2. シンプルなWGSLシェーダーを作成（塗りつぶし用）
3. アトラステクスチャの基本管理を実装

### 中期的な実装タスク
1. WebGLからシェーダーシステムを完全移植
2. フィルターとブレンドシステムを実装
3. パフォーマンス最適化

### 長期的な実装タスク
1. すべてのWebGL機能をWebGPUに移植
2. WebGPU固有の最適化を追加
3. 包括的なテストスイートの作成

## 参考ファイル

### WebGL実装（移植元）
- `packages/webgl/src/Context.ts` - メインコンテキスト
- `packages/webgl/src/Blend/` - ブレンドモード実装
- `packages/webgl/src/Shader/` - シェーダー管理
- `packages/webgl/src/AtlasManager.ts` - アトラス管理
- `packages/webgl/src/FrameBufferManager.ts` - フレームバッファ

### レンダラー（呼び出し側）
- `packages/renderer/src/Command/usecase/CommandRenderUseCase.ts` - レンダリングエントリーポイント
- `packages/renderer/src/Shape/usecase/ShapeRenderUseCase.ts` - Shape描画
- `packages/renderer/src/TextField/usecase/TextFieldRenderUseCase.ts` - テキスト描画
- `packages/renderer/src/Video/usecase/VideoRenderUseCase.ts` - ビデオ描画

## 開発ガイドライン

### WebGLからWebGPUへの移植時の注意点

1. **座標系**: WebGLとWebGPUで座標系が異なる場合がある
2. **シェーダー言語**: GLSL → WGSL への変換が必要
3. **バッファ管理**: WebGPUはより明示的なバッファ管理が必要
4. **同期**: WebGPUは非同期APIが多いため、適切な同期処理が必要
5. **エラーハンドリング**: WebGPUの検証エラーに対応

### コーディング規約
- ESLintの警告を修正（quote-props, no-trailing-spaces等）
- TypeScriptの型安全性を維持
- 既存のWebGL実装のアーキテクチャを踏襲
