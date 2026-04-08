import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiscusComment } from './giscus-comment';

describe('GiscusComment', () => {
  let component: GiscusComment;
  let fixture: ComponentFixture<GiscusComment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiscusComment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiscusComment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
