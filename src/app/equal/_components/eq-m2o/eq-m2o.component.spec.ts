import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqM2oComponent } from './eq-m2o.component';

describe('EqM2oComponent', () => {
  let component: EqM2oComponent;
  let fixture: ComponentFixture<EqM2oComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EqM2oComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EqM2oComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
