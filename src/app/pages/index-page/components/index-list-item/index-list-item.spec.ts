import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexListItem } from './index-list-item';

describe('IndexListItem', () => {
  let component: IndexListItem;
  let fixture: ComponentFixture<IndexListItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexListItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexListItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
