import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagContent } from './tag-content';

describe('TagContent', () => {
  let component: TagContent;
  let fixture: ComponentFixture<TagContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagContent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
