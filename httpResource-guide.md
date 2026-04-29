# httpResource 完整指南

#angular #signals #http #angular21

---

## 什麼是 httpResource？

`httpResource` 是 Angular 19+ 引入、Angular 21 穩定的新 HTTP 資料請求 API，建立在 **Signal** 體系之上。

它解決了傳統 `HttpClient` + `subscribe` 模式的幾個痛點：
- 需要手動管理訂閱（takeUntilDestroyed、unsubscribe）
- Loading / Error 狀態要自己維護
- 回應資料無法直接整合進 Signal 響應式流

> [!info] 定位
> `httpResource` 是 **資料獲取（data fetching）** 的解決方案，適合 GET 請求。
> POST / PUT / DELETE 等 mutation 操作仍使用 `HttpClient` + `Observable`。

---

## 基本語法

```typescript
import { httpResource } from '@angular/common/http';

// 靜態 URL（需包在函式內）
const resource = httpResource<ResponseType>(() => '/api/data');

// 動態 URL（依賴 Signal，自動重新請求）
const id = signal(1);
const resource = httpResource<ResponseType>(() => `/api/items/${id()}`);
```

> [!warning] 注意
> `httpResource` 必須在 **injection context** 內呼叫（component field initializer、constructor、或 `runInInjectionContext`）。

---

## HttpResourceRef 介面

`httpResource` 回傳一個 `HttpResourceRef<T>`，包含以下 Signal：

| 屬性 | 型別 | 說明 |
|------|------|------|
| `value()` | `T \| undefined` | 回應資料，未取得時為 `undefined` |
| `isLoading()` | `boolean` | 請求進行中 |
| `hasValue()` | `boolean` | 已成功取得至少一次資料 |
| `error()` | `unknown` | 錯誤物件，無錯誤時為 `undefined` |
| `status()` | `ResourceStatus` | 目前狀態（枚舉值） |
| `reload()` | `() => void` | 手動重新觸發請求 |

### ResourceStatus 枚舉

```typescript
enum ResourceStatus {
  Idle      = 0,  // 尚未發送請求
  Error     = 1,  // 請求失敗
  Loading   = 2,  // 請求進行中
  Reloading = 3,  // 重新載入中（已有舊資料）
  Resolved  = 4,  // 成功取得資料
  Local     = 5,  // 資料來自本地（set() 設定）
}
```

---

## 與傳統 HttpClient 的對比

### 舊寫法（HttpClient + subscribe）

```typescript
@Component({ ... })
export class MyComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly http = inject(HttpClient);

  // 要自己建 Signal 或 Subject
  data = signal<Post | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.isLoading.set(true);
    this.http.get<Post>('/api/posts/1')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.data.set(res);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(err.message);
          this.isLoading.set(false);
        }
      });
  }
}
```

### 新寫法（httpResource）

```typescript
@Component({ ... })
export class MyComponent {
  private readonly postResource = httpResource<Post>(() => '/api/posts/1');

  // 直接用，不需要手動管理
  data     = computed(() => this.postResource.value());
  isLoading = computed(() => this.postResource.isLoading());
  error     = computed(() => this.postResource.error());
}
```

> [!success] 差異
> - 不需要 `implements OnInit`
> - 不需要 `takeUntilDestroyed`
> - Loading / Error 狀態自動管理
> - 生命週期由 Angular 自動綁定

---

## 動態 URL（Signal 驅動自動重請求）

當 URL 函式內部讀取了 Signal，該 Signal 變更時會**自動重新發送請求**。

```typescript
export class PostDetailComponent {
  // 從路由取得 id（Signal 形式）
  readonly postId = input.required<number>();

  // postId 改變時自動重新 fetch
  private readonly postResource = httpResource<Post>(
    () => `/api/posts/${this.postId()}`
  );

  post      = computed(() => this.postResource.value());
  isLoading = computed(() => this.postResource.isLoading());
}
```

---

## 回傳 undefined 以暫停請求

URL 函式回傳 `undefined` 時，不會發送請求（等待條件滿足）。

```typescript
readonly selectedId = signal<number | undefined>(undefined);

private readonly resource = httpResource<Post>(
  () => {
    const id = this.selectedId();
    if (id === undefined) return undefined; // 不發請求
    return `/api/posts/${id}`;
  }
);
```

---

## 傳入 Query Parameters

```typescript
readonly page = signal(0);
readonly size = signal(20);

private readonly listResource = httpResource<Post[]>(() => {
  const params = new URLSearchParams({
    page: String(this.page()),
    size: String(this.size()),
  });
  return `/api/posts?${params}`;
});
```

---

## 傳入 HttpResourceRequest（進階）

需要設定 headers 或其他選項時，可傳入物件：

```typescript
private readonly resource = httpResource<Data>(() => ({
  url: '/api/secure-data',
  headers: {
    Authorization: `Bearer ${this.token()}`,
  },
  params: { page: this.page() },
}));
```

---

## 手動重新載入

```typescript
export class ListComponent {
  private readonly listResource = httpResource<Item[]>(() => '/api/items');

  items = computed(() => this.listResource.value() ?? []);

  async createItem(data: CreateItemDto) {
    await firstValueFrom(this.itemApi.createItem(data));
    this.listResource.reload(); // 重新 fetch 清單
  }
}
```

---

## 在 Template 中使用

```html
@if (postResource.isLoading()) {
  <div class="spinner">載入中...</div>
}

@if (postResource.error()) {
  <div class="error">載入失敗：{{ postResource.error() }}</div>
}

@if (postResource.hasValue()) {
  <article>
    <h1>{{ postResource.value()?.title }}</h1>
    <p>{{ postResource.value()?.content }}</p>
  </article>
}
```

---

## 與 Service 結合（本專案的做法）

### Service 層（建立 resource）

```typescript
// services/index.ts
@Injectable({ providedIn: 'root' })
export class Index {
  private readonly apiConfig = inject(ApiConfiguration);

  getBannerContent$() {
    return httpResource<ApiResponseBannerOrUndefined>(
      () => `${this.apiConfig.rootUrl}${getPublicBanner.PATH}`,
    );
  }
}
```

### Component 層（使用 resource）

```typescript
// index-page.ts
export class IndexPage {
  private readonly service = inject(Index);

  // field initializer 內呼叫（injection context 有效）
  private readonly bannerResource = this.service.getBannerContent$();

  banner        = computed(() => this.bannerResource.value()?.data ?? null);
  bannerContent = computed(() => this.banner()?.content || '');
}
```

> [!warning] 注意
> `getBannerContent$()` 在 service 內定義，但**每次呼叫都會建立新的 resource 實例**。
> 若需要共享同一個 resource，應將其定義為 service 的 field（而非 method）。

---

## 常見陷阱

### ❌ 在 ngOnInit 內呼叫 httpResource

```typescript
// 錯誤：ngOnInit 不是 injection context
ngOnInit() {
  this.resource = httpResource(() => '/api/data'); // 會報錯
}
```

### ✅ 正確：在 field initializer 呼叫

```typescript
// 正確：field initializer 在 injection context 內執行
private readonly resource = httpResource<Data>(() => '/api/data');
```

---

### ❌ 傳入靜態字串（非函式）

```typescript
// 錯誤：Angular 21 的 httpResource 不接受靜態字串
const resource = httpResource<Data>('/api/data');
```

### ✅ 正確：包在箭頭函式內

```typescript
const resource = httpResource<Data>(() => '/api/data');
```

---

## 資料流示意

```
Signal 變更
    │
    ▼
URL 函式重新執行
    │
    ▼
isLoading() = true
    │
    ▼
HttpClient 發送 GET 請求
    │
    ├─ 成功 ─▶ value() 更新 ─▶ hasValue() = true ─▶ isLoading() = false
    │
    └─ 失敗 ─▶ error() 更新 ─▶ isLoading() = false
```

---

## 適用時機總結

| 情境 | 建議 |
|------|------|
| GET 資料、需要 loading/error 狀態 | `httpResource` ✅ |
| GET 資料依賴動態參數（Signal） | `httpResource` ✅ |
| POST / PUT / DELETE | `HttpClient` + `Observable` ✅ |
| 複雜的 pipe 轉換邏輯 | `HttpClient` + `Observable` ✅ |
| SSE / WebSocket | `HttpClient` + `Observable` ✅ |

---

## 參考資料

- [Angular 官方文件 - httpResource](https://angular.dev/guide/signals/resource)
- [Angular Blog - Signal-based HTTP](https://blog.angular.dev)
- [openapi-generator-angular21](https://github.com/ls1intum/openapi-generator-angular21)
