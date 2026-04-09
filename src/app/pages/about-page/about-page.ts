import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MdViewer } from '../../shared/tui-editor/md-viewer/md-viewer';
import { About } from './services/about';

@Component({
  selector: 'app-about-page',
  imports: [MdViewer],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPage implements OnInit {
  mdViewerContent = signal<string>('');

  private destroyRef = inject(DestroyRef);

  constructor(private aboutService: About) {}

  ngOnInit(): void {
    this.loadAboutContent();
  }

  /**
   * 從 About 服務載入關於我內容，並更新 mdViewerContent 信號。
   *
   * @private
   * @memberof AboutPage
   */
  private loadAboutContent(): void {
    this.aboutService.getAboutContent().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.mdViewerContent.set(data.content);
      },
      error: (error) => {
        console.error('載入關於我內容失敗:', error);
        this.mdViewerContent.set('# 關於我\n加載內容失敗，請稍後重試。');
      },
    });
  }
}
