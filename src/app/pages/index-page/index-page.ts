import { Component, OnInit, signal } from '@angular/core';
import { MdViewer } from '../../shared/tui-editor/md-viewer/md-viewer';
import { Index } from './services';

@Component({
  selector: 'app-index-page',
  imports: [MdViewer],
  templateUrl: './index-page.html',
  styleUrl: './index-page.scss',
})
export class IndexPage implements OnInit {
  mdViewerContent = signal<string>('');

  constructor(private indexService: Index) {}

  ngOnInit(): void {
    this.loadBannerContent();
  }

  private loadBannerContent(): void {
    this.indexService.getBannerContent().subscribe({
      next: (data) => {
        this.mdViewerContent.set(data.content);
      },
      error: (error) => {
        console.error('載入橫幅內容失敗:', error);
        // 若加載失敗，設置預設內容
        this.mdViewerContent.set('# 橫幅\n加載內容失敗，請稍後重試。');
      },
    });
  }
}

