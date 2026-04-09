import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  input,
  OnDestroy,
  runInInjectionContext,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { loadTuiViewer } from '../tui-editor.loader';

@Component({
  selector: 'md-viewer',
  imports: [],
  template: `<div #viewerElement></div>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdViewer implements OnDestroy {
  private readonly viewerElement = viewChild<ElementRef>('viewerElement');
  content = input<string>('');
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private viewerInstance: { destroy(): void } | null = null;

  constructor() {
    afterNextRender(async () => {
      const { Viewer, codeSyntaxHighlight, tableMergedCell, Prism } = await loadTuiViewer();

      // 將 signal 轉為 Observable，加入 debounce 避免內容快速切換時重複重建
      const content$ = runInInjectionContext(this.injector, () =>
        toObservable(this.content).pipe(debounceTime(50)),
      );

      content$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((contentValue) => {
        const container = this.viewerElement()?.nativeElement;
        if (!container) return;

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

        // 縮小 highlight 範圍至 container，避免掃描整份 document
        queueMicrotask(() => {
          Prism.highlightAllUnder(container);
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.viewerInstance?.destroy();
    this.viewerInstance = null;
  }
}
