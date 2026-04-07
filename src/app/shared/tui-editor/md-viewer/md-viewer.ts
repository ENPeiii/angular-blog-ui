import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, effect, input, OnDestroy, ViewChild, Injector, inject, runInInjectionContext } from '@angular/core';
import { loadTuiViewer } from '../tui-editor.loader';

@Component({
  selector: 'md-viewer',
  imports: [],
  template: `<div #viewerElement></div>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdViewer implements OnDestroy {
  @ViewChild('viewerElement') viewerElement!: ElementRef;
  content = input<string>('');
  private injector = inject(Injector);
  private viewerInstance: { destroy(): void } | null = null;

  constructor() {
    afterNextRender(async () => {
      const { Viewer, codeSyntaxHighlight, tableMergedCell, Prism } = await loadTuiViewer();

      runInInjectionContext(this.injector, () => {
        effect(() => {
          const contentValue = this.content();
          const container = this.viewerElement.nativeElement;

          // 銷毀舊實例，防止記憶體洩漏
          if (this.viewerInstance) {
            this.viewerInstance.destroy();
            this.viewerInstance = null;
          }

          container.innerHTML = '';

          this.viewerInstance = new Viewer({
            el: container,
            initialValue: contentValue,
            plugins: [[codeSyntaxHighlight, { highlighter: Prism }], [tableMergedCell]],
            theme: 'dark',
          });

          setTimeout(() => {
            Prism.highlightAll();
          }, 100);
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.viewerInstance?.destroy();
    this.viewerInstance = null;
  }
}
