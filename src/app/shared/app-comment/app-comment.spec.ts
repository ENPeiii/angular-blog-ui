import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComment } from './app-comment';

describe('AppComment', () => {
  let component: AppComment;
  let fixture: ComponentFixture<AppComment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppComment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
