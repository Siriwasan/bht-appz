import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GtsdComponent } from './gtsd.component';

describe('GtsdComponent', () => {
  let component: GtsdComponent;
  let fixture: ComponentFixture<GtsdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GtsdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GtsdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
