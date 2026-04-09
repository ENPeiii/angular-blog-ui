import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutConfig {
  /** 頁面容器最大寬度，預設 1024px。個別頁面可在 ngOnInit 覆寫，ngOnDestroy 重設。 */
  maxW = signal('1024px');
  /** Header 高度（px），由 Layout 元件在 ngAfterViewInit 寫入。 */
  headerHeight = signal(0);
}
