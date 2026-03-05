import { afterNextRender, Component, ElementRef, effect, input, ViewChild, Injector, inject, runInInjectionContext } from '@angular/core';
import { loadTuiViewer } from '../tui-editor.loader';

@Component({
  selector: 'md-viewer',
  imports: [],
  template: `<div #viewerElement></div>`,
  styles: [],
})
export class MdViewer {
  @ViewChild('viewerElement') viewerElement!: ElementRef;
  content = input<string>('');
  private injector = inject(Injector);

  constructor() {
    afterNextRender(async () => {
      // 動態載入 Viewer
      const { Viewer, codeSyntaxHighlight, tableMergedCell, Prism } = await loadTuiViewer();

      // 在注入上下文中使用 effect 監聽內容變化
      runInInjectionContext(this.injector, () => {
        effect(() => {
          const contentValue = this.content();

          // 清空容器，重新初始化 Viewer
          const container = this.viewerElement.nativeElement;
          container.innerHTML = '';

          new Viewer({
            el: container,
            initialValue: contentValue,
            plugins: [[codeSyntaxHighlight, { highlighter: Prism }], [tableMergedCell]],
            theme: 'dark', // 啟用深色主題
          });

          // 重新執行 Prism 高亮，讓 toolbar 和 copy-to-clipboard 插件生效
          setTimeout(() => {
            Prism.highlightAll();
          }, 100);
        });
      });
    });
  }
}
