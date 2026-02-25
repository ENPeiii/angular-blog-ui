import { afterNextRender, Component, ElementRef, input, ViewChild } from '@angular/core';
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
  constructor() {
    afterNextRender(async () => {
      // 動態載入 Viewer
      const { Viewer, codeSyntaxHighlight, tableMergedCell, Prism } = await loadTuiViewer();

      new Viewer({
        el: this.viewerElement.nativeElement,
        initialValue: this.content(),
        plugins: [[codeSyntaxHighlight, { highlighter: Prism }], tableMergedCell],
        theme: 'dark', // 啟用深色主題
      });

      // 重新執行 Prism 高亮，讓 toolbar 和 copy-to-clipboard 插件生效
      setTimeout(() => {
        Prism.highlightAll();
      }, 100);
    });
  }
}
