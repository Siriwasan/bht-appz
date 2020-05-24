import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BundlesDialogComponent } from './bundles-dialog.component';

describe('BundlesDialogComponent', () => {
  let component: BundlesDialogComponent;
  let fixture: ComponentFixture<BundlesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BundlesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundlesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
