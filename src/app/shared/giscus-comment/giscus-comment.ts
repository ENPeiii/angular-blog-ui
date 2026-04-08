import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'giscus-comment',
  imports: [],
  template: `
    <div #giscusContainer></div>
  `,
  styles: [],
})
export class GiscusComment implements OnInit {
 // 取得 Template 中的容器引用
  @ViewChild('giscusContainer', { static: true }) giscusContainer!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void{
    // 1. 建立 script 標籤
    const scriptEl = this.renderer.createElement('script');

    // 2. 將你提供的 script 參數轉換為屬性
    const attributes = {
      src: 'https://giscus.app/client.js',
      'data-repo': 'ENPeiii/angular-blog-ui',
      'data-repo-id': 'R_kgDOPIObZA',
      'data-category': 'Announcements',
      'data-category-id': 'DIC_kwDOPIObZM4C6WZm',
      'data-mapping': 'title',
      'data-strict': '0',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'bottom',
      'data-theme': 'noborder_gray',
      'data-lang': 'zh-TW',
      'crossorigin': 'anonymous',
      'async': ''
    };

    // 3. 迴圈設定屬性
    Object.entries(attributes).forEach(([key, value]) => {
      this.renderer.setAttribute(scriptEl, key, value);
    });

    // 4. 將 script 插入到指定的容器中
    this.renderer.appendChild(this.giscusContainer.nativeElement, scriptEl);
  }
}
