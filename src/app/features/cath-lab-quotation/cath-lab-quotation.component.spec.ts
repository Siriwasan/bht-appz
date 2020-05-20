import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CathLabQuotationComponent } from './cath-lab-quotation.component';

describe('CathLabQuotationComponent', () => {
  let component: CathLabQuotationComponent;
  let fixture: ComponentFixture<CathLabQuotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CathLabQuotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CathLabQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
