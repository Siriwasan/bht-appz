import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcsdComponent } from './acsd.component';

describe('AcsdComponent', () => {
  let component: AcsdComponent;
  let fixture: ComponentFixture<AcsdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcsdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcsdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
