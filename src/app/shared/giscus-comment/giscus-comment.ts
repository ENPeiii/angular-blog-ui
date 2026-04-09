import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, inject, Renderer2, viewChild } from '@angular/core';

@Component({
  selector: 'giscus-comment',
  imports: [],
  template: `<div #giscusContainer></div>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GiscusComment {
  private readonly giscusContainer = viewChild<ElementRef>('giscusContainer');
  private readonly renderer = inject(Renderer2);

  constructor() {
    afterNextRender(() => {
      const container = this.giscusContainer()?.nativeElement;
      if (!container) return;

      // 防止元件重建時重複注入 script
      if (container.querySelector('script[src*="giscus.app"]')) return;

      const scriptEl = this.renderer.createElement('script');
      const attributes: Record<string, string> = {
        src: 'https://giscus.app/client.js',
        'data-repo': 'ENPeiii/angular-blog-ui',
        'data-repo-id': 'R_kgDOPIObZA',
        'data-category': 'General',
        'data-category-id': 'DIC_kwDOPIObZM4C6WZn',
        'data-mapping': 'title',
        'data-strict': '0',
        'data-reactions-enabled': '1',
        'data-emit-metadata': '0',
        'data-input-position': 'bottom',
        'data-theme': 'noborder_gray',
        'data-lang': 'zh-TW',
        crossorigin: 'anonymous',
        async: '',
      };

      Object.entries(attributes).forEach(([key, value]) => {
        this.renderer.setAttribute(scriptEl, key, value);
      });

      this.renderer.appendChild(container, scriptEl);
    });
  }
}
