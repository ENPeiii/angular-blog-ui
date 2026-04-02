import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicContent } from './topic-content';

describe('TopicContent', () => {
  let component: TopicContent;
  let fixture: ComponentFixture<TopicContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicContent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicContent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
