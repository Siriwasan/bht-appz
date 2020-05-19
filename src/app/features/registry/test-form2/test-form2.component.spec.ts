import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestForm2Component } from './test-form2.component';

describe('TestForm2Component', () => {
  let component: TestForm2Component;
  let fixture: ComponentFixture<TestForm2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestForm2Component],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestForm2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
