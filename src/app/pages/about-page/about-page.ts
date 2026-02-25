import { Component, OnInit, signal } from '@angular/core';
import { MdViewer } from '../../shared/tui-editor/md-viewer/md-viewer';
import { About } from './services/about';

@Component({
  selector: 'app-about-page',
  imports: [MdViewer],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
})
export class AboutPage implements OnInit {
  mdViewerContent = signal<string>('');

  constructor(private aboutService: About) {}

  ngOnInit(): void {
    this.loadAboutContent();
  }

  private loadAboutContent(): void {
    this.aboutService.getAboutContent().subscribe({
      next: (data) => {
        this.mdViewerContent.set(data.content);
      },
      error: (error) => {
        console.error('載入關於我內容失敗:', error);
        // 若加載失敗，設置預設內容
        this.mdViewerContent.set('# 關於我\n加載內容失敗，請稍後重試。');
      },
    });
  }
}
