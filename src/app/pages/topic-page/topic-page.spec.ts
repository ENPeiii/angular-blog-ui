import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicPage } from './topic-page';

describe('TopicPage', () => {
  let component: TopicPage;
  let fixture: ComponentFixture<TopicPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
