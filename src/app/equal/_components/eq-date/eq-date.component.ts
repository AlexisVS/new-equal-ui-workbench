import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatCalendar, MatDatepicker, MatDatepickerInputEvent} from '@angular/material/datepicker';
import {DateAdapter} from "@angular/material/core";

@Component({
  selector: 'app-eq-date',
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
  @ViewChild(MatDatepicker) datePicker: MatDatepicker<any>;
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
    this.required
      ? this.value = new FormControl(this.parseDate(this.defaultValue), Validators.required)
      : this.value = new FormControl(this.parseDate(this.defaultValue));
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

  public onEdit(onEditEvent: MouseEvent): void {
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
      this.valueChange.emit(this.addOneHour(new Date(this.value.value)));
      this.value.disable();
    }
  }

  /**
   * Add one hour to the date, thanks ChatGPT
   */
  private addOneHour(date: Date): string {
    // Clone the date to avoid modifying the original
    const newDate: Date = new Date(date);

    // Add one hour to the date
    newDate.setHours(newDate.getHours() + 1);

    // Check if the hour increment goes into the next day
    if (newDate.getDate() !== date.getDate()) {
      // Incremented to the next day, update day
      newDate.setDate(newDate.getDate() + 1);

      // Check if the day increment goes into the next month
      if (newDate.getMonth() !== date.getMonth()) {
        // Incremented to the next month, update month
        newDate.setMonth(newDate.getMonth() + 1);

        // Check if the month increment goes into the next year
        if (newDate.getFullYear() !== date.getFullYear()) {
          // Incremented to the next year, update year
          newDate.setFullYear(newDate.getFullYear() + 1);
        }
      }
    }

    return newDate.toISOString();
  }

}
