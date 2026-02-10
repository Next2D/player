@next2d/net
=============

## Overview / 概要

The `@next2d/net` package provides network request handling functionality for loading external resources in Next2D applications. It offers a flexible and type-safe way to make HTTP requests with various configurations.

`@next2d/net` パッケージは、Next2Dアプリケーションで外部リソースを読み込むためのネットワークリクエスト処理機能を提供します。様々な設定で柔軟かつ型安全にHTTPリクエストを行うことができます。

## Installation / インストール

```bash
npm install @next2d/net
```

## Directory Structure / ディレクトリ構成

```
src/
├── URLRequest.ts                           # Main request class / メインリクエストクラス
└── interface/
    ├── IURLLoaderDataFormat.ts             # Response data format types / レスポンスデータフォーマット型
    ├── IURLRequestHeader.ts                # Request header interface / リクエストヘッダーインターフェース
    └── IURLRequestMethod.ts                # HTTP method types / HTTPメソッド型
```

## URLRequest Class / URLRequestクラス

The `URLRequest` class manages HTTP requests to external resources. It provides properties to configure URLs, HTTP methods, headers, request data, and response formats.

`URLRequest` クラスは、外部リソースへのHTTPリクエストを管理します。URL、HTTPメソッド、ヘッダー、リクエストデータ、レスポンスフォーマットを設定するプロパティを提供します。

### Usage / 使用方法

```typescript
import { URLRequest } from "@next2d/net";

// Basic GET request / 基本的なGETリクエスト
const request = new URLRequest("https://api.example.com/data");

// POST request with data / データを含むPOSTリクエスト
const postRequest = new URLRequest("https://api.example.com/users");
postRequest.method = "POST";
postRequest.contentType = "application/json";
postRequest.data = { name: "John Doe", email: "john@example.com" };

// Custom headers / カスタムヘッダー
postRequest.requestHeaders = [
    { name: "Authorization", value: "Bearer token123" },
    { name: "X-Custom-Header", value: "custom-value" }
];

// Response format / レスポンスフォーマット
request.responseDataFormat = "json"; // "json" | "arraybuffer" | "text"
```

### Properties / プロパティ

| Property | Type | Default | Description (EN) | 説明 (JA) |
|----------|------|---------|------------------|-----------|
| `url` | `string` | `""` | The URL to be requested | リクエストするURL |
| `method` | `IURLRequestMethod` | `"GET"` | HTTP method (GET, POST, PUT, DELETE, HEAD, OPTIONS) | HTTPメソッド |
| `contentType` | `string` | `"application/json"` | MIME content type | MIMEコンテンツタイプ |
| `data` | `any` | `null` | Data to be transmitted with the request | リクエストと共に送信されるデータ |
| `requestHeaders` | `IURLRequestHeader[]` | `[]` | Array of custom HTTP request headers | カスタムHTTPリクエストヘッダーの配列 |
| `responseDataFormat` | `IURLLoaderDataFormat` | `"json"` | Expected response data format | 期待されるレスポンスデータフォーマット |
| `withCredentials` | `boolean` | `false` | Include credentials in cross-origin requests | クロスオリジンリクエストに資格情報を含める |

### Interfaces and Types / インターフェースと型

#### IURLRequestMethod
```typescript
type IURLRequestMethod = "DELETE" | "GET" | "HEAD" | "OPTIONS" | "POST" | "PUT";
```

#### IURLRequestHeader
```typescript
interface IURLRequestHeader {
    name: string;
    value: string;
}
```

#### IURLLoaderDataFormat
```typescript
type IURLLoaderDataFormat = "json" | "arraybuffer" | "text";
```

## License / ライセンス

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](LICENSE) file for details.

このプロジェクトは[MITライセンス](https://opensource.org/licenses/MIT)の下でライセンスされています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。
