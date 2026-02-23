import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseDialog } from './base-dialog';

describe('BaseDialog', () => {
  let component: BaseDialog;
  let fixture: ComponentFixture<BaseDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
