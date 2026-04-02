import { Component, signal } from '@angular/core';
import { Tags, TagsList } from './services/tags';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-tags-page',
  imports: [RouterLink],
  templateUrl: './tags-page.html',
  styleUrl: './tags-page.css',
  providers: [Tags],
})
export class TagsPage {
  tagsList = signal<TagsList[]>([]);

  constructor(private service: Tags) {}

  ngOnInit(): void {
    this.loadTagList();
  }

  private loadTagList(): void {
    this.service.getTagsList().subscribe({
      next: (data) => {
        this.tagsList.set(data);
      },
      error: (error) => {
        console.error('載入標籤列表失敗:', error);
        // 若加載失敗，設置預設內容
        this.tagsList.set([]);
      },
    });
  }
}


