import { Component, signal } from '@angular/core';
import { MdViewer } from '../../shared/tui-editor/md-viewer/md-viewer';

@Component({
  selector: 'app-about-page',
  imports: [MdViewer],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
})
export class AboutPage {
  mdViewerContent = signal<string>('# Hello Angular 21! \n ## 標題一 \n - item1 \n - item2 \n **粗體** *斜體* \n ```js \n console.log("Hello World!"); \n ```');
}
