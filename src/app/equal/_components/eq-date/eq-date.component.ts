import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatCalendar, MatDatepicker} from '@angular/material/datepicker';

@Component({
  selector: 'eq-date',
  templateUrl: './eq-date.component.html',
  styleUrls: ['./eq-date.component.scss']
})
export class EqDateComponent implements OnInit {

  // ? why not use value and valueChange ?
  @Input() defaultValue: string;

  public value: FormControl;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() placeholder: string = '';

  // ? How do you want validation ?
  @Input() required: boolean = false;

  @Input() title?: string;

  @Input() hint?: string = '';

  @Input() size?: 'small' | 'normal' | 'large' = 'normal';

  @Input() error?: string;

  public mode: 'view' | 'edit' = 'view';

  @ViewChild('eqDate') eqDate: ElementRef<HTMLDivElement>;
  @ViewChild(MatDatepicker) datePicker: MatDatepicker<Date>;
  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('scheduleButton') scheduleButton: ElementRef<HTMLElement>;
  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;

  constructor(
    public changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.initFormControl();

    this.value.disable();
  }

  public initFormControl(): void {
    this.value = new FormControl(this.parseDate(this.defaultValue));

    if (this.required) {
      this.value.addValidators(Validators.required);
    }
  }

  private parseDate(date: string | Date): string {
    return new Date(date).toISOString();
  }

  public getErrorMessage(): string {
    if (this.error && this.value.invalid) {
      return this.error;
    }
    return '';
  }

  public updateValue(value: string): void {
    this.value.setValue(value);
  }

  public isEditable(): boolean {
    return this.mode === 'edit';
  }

  public onEdit(): void {
    if (this.mode === 'view') {
      this.edit();
    }
  }

  public edit(): void {
    this.mode = 'edit';
    this.value.enable();
    this.changeDetectorRef.detectChanges();
    this.input.nativeElement.focus();
  }

  public onFocusOut(event: FocusEvent): void {
    if (
      (event.target instanceof Element && event.target.classList.contains('eq-date__schedule')) ||
      event.relatedTarget as Element === this.scheduleButton.nativeElement
    ) {
      return;
    }

    if (this.checkIfClickedOutside(event) || this.value.invalid) {
      this.mode = 'view';
      this.updateValue(this.parseDate(this.defaultValue));
      this.value.disable();
    }
  }

  private checkIfClickedOutside(event: FocusEvent): boolean {
    return this.isEditable() &&
      this.eqDate.nativeElement instanceof Element &&
      // * event.relatedTarget is not a Node, but it works like this
      !this.eqDate.nativeElement.contains(event.relatedTarget as Node);
  }

  public onSave(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.value.valid) {
      this.mode = 'view';
      this.valueChange.emit(this.sanitizeDate(this.value.value));
      this.value.disable();
    }
  }

  private sanitizeDate(date: string): string {
    const newDate: Date = new Date(date);
    const timestamp: number = newDate.getTime();
    const offsetTz: number = newDate.getTimezoneOffset() * 60 * 1000;
    return new Date(timestamp + offsetTz).toISOString().substring(0, 10) + 'T00:00:00Z';
  }

}
