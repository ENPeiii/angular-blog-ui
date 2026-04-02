import { Component, signal } from '@angular/core';
import { Topics, TopicsList } from './services/topics';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-topics-page',
  imports: [RouterLink],
  templateUrl: './topics-page.html',
  styleUrl: './topics-page.scss',
  providers: [Topics],
})
export class TopicsPage {
  constructor(private service: Topics) {}
  topicsList = signal<TopicsList[]>([]);

  ngOnInit(): void {
    this.loadTopicList();
  }

  private loadTopicList(): void {
    this.service.getTopicsList().subscribe({
      next: (data) => {
        this.topicsList.set(data);
      },
      error: (error) => {
        console.error('載入主題列表失敗:', error);
        // 若加載失敗，設置預設內容
        this.topicsList.set([]);
      },
    });
  }
}
