import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Gtsd241Component } from './gtsd241.component';

describe('Gtsd241Component', () => {
  let component: Gtsd241Component;
  let fixture: ComponentFixture<Gtsd241Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Gtsd241Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Gtsd241Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
