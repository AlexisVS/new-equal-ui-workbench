import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqualComponent } from './equal.component';

describe('EqualComponent', () => {
  let component: EqualComponent;
  let fixture: ComponentFixture<EqualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EqualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EqualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
