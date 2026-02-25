import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdViewer } from './md-viewer';

describe('MdViewer', () => {
  let component: MdViewer;
  let fixture: ComponentFixture<MdViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MdViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MdViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
