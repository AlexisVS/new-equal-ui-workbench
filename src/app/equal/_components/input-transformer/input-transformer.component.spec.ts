import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTransformerComponent } from './input-transformer.component';

describe('InputTransformerComponent', () => {
  let component: InputTransformerComponent;
  let fixture: ComponentFixture<InputTransformerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputTransformerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTransformerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
