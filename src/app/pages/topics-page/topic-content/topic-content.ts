import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-topic-content',
  imports: [],
  templateUrl: './topic-content.html',
  styleUrl: './topic-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicContent {}
