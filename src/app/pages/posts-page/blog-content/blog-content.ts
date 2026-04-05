import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-blog-content',
  imports: [],
  templateUrl: './blog-content.html',
  styleUrl: './blog-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogContent {

}
