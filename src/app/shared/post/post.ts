import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.html',
  styleUrl: './post.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Post {

}
