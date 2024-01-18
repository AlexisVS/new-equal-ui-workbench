import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'eq-date-range',
  templateUrl: './eq-date-range.component.html',
  styleUrls: ['./eq-date-range.component.scss']
})
export class EqDateRangeComponent implements OnInit {

  // ? why not use value and valueChange ?
  @Input() defaultValue: string;

  public value: FormGroup;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  // ? Do we need placeholder for date range ?
  // ? If yes need to add 2 placeholders one for start and one for end
  // @Input() placeholder: string = '';

  // ? How do you want validation ?
  @Input() required: boolean = false;

  @Input() title?: string;

  @Input() hint?: string = '';

  @Input() size?: 'small' | 'normal' | 'large' = 'normal';

  // ? Same as placeholder
  @Input() error?: string;

  public mode: 'view' | 'edit' = 'view';

  @ViewChild('eqDateRange') eqDateRange: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    this.initFormControl();

    this.value.disable();
  }

  public initFormControl(): void {
    this.value = new FormGroup({
      start: new FormControl(this.parseDate(this.defaultValue)),
      end: new FormControl(this.parseDate(this.defaultValue))
    });

    if (this.required) {
      this.value.value.start.setValidators(Validators.required);
      this.value.value.end.setValidators(Validators.required);
    }
  }

  private parseDate(date: string | Date): string {
    return new Date(date).toISOString();
  }

}
