import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Acsd290Component } from './acsd290.component';

describe('Acsd290Component', () => {
  let component: Acsd290Component;
  let fixture: ComponentFixture<Acsd290Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Acsd290Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Acsd290Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
