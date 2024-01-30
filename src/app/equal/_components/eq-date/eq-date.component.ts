import {
  ChangeDetectorRef,
  Component, DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormControl, ValidatorFn, Validators} from '@angular/forms';

@Component({
  selector: 'eq-date',
  templateUrl: './eq-date.component.html',
  styleUrls: ['./eq-date.component.scss']
})
export class EqDateComponent implements OnInit, DoCheck {
  @Output() valueChange: EventEmitter<string | null> = new EventEmitter<string | null>();

  @Input() value: string | null;

  public formControl: FormControl;

  @Input() placeholder: string = '';

  // used for forcing the component as disabled
  @Input() disabled: boolean = false;

  @Input() required: boolean = false;

  @Input() nullable: boolean = false;

  @Input() mode: 'view' | 'edit' = 'view';

  @Input() title?: string;

  @Input() hint: string = '';

  @Input() size?: 'small' | 'normal' | 'large' | 'extra' = 'normal';

  @Input() error?: string;

  // used for marking the input as being edited
  public is_active: boolean = false;

  public is_null: boolean = false;

  @ViewChild('eqDate') eqDate: ElementRef<HTMLDivElement>;
  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('nullableInput') nullableInput: ElementRef<HTMLInputElement>;

  get inputValue(): string | undefined {
    return this.input?.nativeElement.value;
  }


  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.initFormControl();
    this.initNullableValue();
  }

  ngDoCheck(): void {
    if (this.is_null) {
      console.log('ngDoCheck: ', this.is_null);
      this.formControl.disable();
    }
  }

  public initFormControl(): void {
    if (this.value) {
      this.formControl = new FormControl(new Date(this.value));
    } else {
      this.formControl = new FormControl('');
    }

    const validators: ValidatorFn[] = [];

    // if (this.required) {
    //   validators.push(Validators.required);
    // }
    //
    // if (!this.nullable) {
    //   validators.push(
    //     Validators.minLength(10),
    //     Validators.maxLength(10)
    //   );
    // }

    this.formControl.setValidators(validators);
  }

  public initNullableValue(): void {
    if (this.nullable && [null, '[null]'].includes(this.value)) {
      this.toggleIsNull(true);
    }
  }

  public getErrorMessage(): string {
    if (this.error) {
      return this.error;
    }
    return '';
  }

  private updateValue(value: string | null): void {
    if (value === null) {
      this.is_null = true;
      this.formControl.setValue('[null]');
    } else {
      console.log('updateValue: ', value);
      this.is_null = false;
      this.formControl.setValue(this.setInputDate(value));
    }
  }

  public onClear(event: MouseEvent): void {
    event.stopImmediatePropagation();
    event.preventDefault();
    this.updateValue('');
    this.formControl.markAsPending({onlySelf: true});
    this.input?.nativeElement?.focus();
  }

  public activate(): void {
    if (this.mode === 'edit' && !this.disabled) {
      this.toggleActive(true);
      this.input?.nativeElement?.focus();
    }
  }

  public onCancel(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleIsNull(false);
    this.updateValue(this.value);
    this.toggleActive(false);
  }

  public onSave(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.is_null) {
      this.valueChange.emit(null);
    } else if (this.formControl.valid) {
      this.valueChange.emit(this.formControl.value);
    }
    this.toggleActive(false);
  }

  public onBlur(event: FocusEvent): void {
    event.preventDefault();
    // we need to discard current instance because onblur event occurs before onSave
    if (
      this.eqDate.nativeElement instanceof Element &&
      !this.eqDate.nativeElement.contains(event.relatedTarget as Node)
    ) {
      this.toggleIsNull(false);
      this.updateValue(this.value);
      this.toggleActive(false);
    }
  }

  private toggleActive(editable: boolean): void {
    this.is_active = editable;
    if (editable) {
      this.input?.nativeElement?.focus();
    }
  }

  public toggleIsNull(is_null: boolean): void {
    this.is_null = is_null;
    if (this.is_null) {
      this.updateValue(null);
    } else {
      console.log('toogleIsNull: ', this.value);
      if (this.value === null) {
        this.updateValue('');
      } else {
        this.updateValue(this.setInputDate(this.value));
      }
      this.formControl.enable();
      this.changeDetectorRef.detectChanges();
    }
  }

  // private sanitizeDate(date: string): string {
  //   const newDate: Date = new Date(date);
  //   const timestamp: number = newDate.getTime();
  //   const offsetTz: number = newDate.getTimezoneOffset() * 60 * 1000;
  //   return new Date(timestamp + offsetTz).toISOString().substring(0, 10) + 'T00:00:00Z';
  // }

  private setInputDate(date: string): string {
    console.log('setInputDate: ', date, new Date(date).toString());
    return new Date(date).toString();
  }
}
