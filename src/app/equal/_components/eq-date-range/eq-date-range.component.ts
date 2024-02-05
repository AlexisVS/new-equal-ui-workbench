import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input, LOCALE_ID, OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {DateRange, MatDateRangeInput} from '@angular/material/datepicker';

type dateUsage = 'date.short.day' | 'date.short' | 'date.medium' | 'date.long' | 'date.full';

type dateFormat = Record<dateUsage, Intl.DateTimeFormatOptions>;

const dateFormat: dateFormat = {
    'date.short.day': {weekday: 'short', day: 'numeric', month: 'numeric', year: '2-digit'},
    'date.short': {day: 'numeric', month: '2-digit', year: '2-digit'},
    'date.medium': {day: 'numeric', month: 'short', year: 'numeric'},
    'date.long': {weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'},
    'date.full': {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'},
};

// type dateRange = 'start' | 'end';

@Component({
    selector: 'eq-date-range',
    templateUrl: './eq-date-range.component.html',
    styleUrls: ['./eq-date-range.component.scss']
})
export class EqDateRangeComponent implements OnInit, OnChanges {

    @Output() valueChange: EventEmitter<string | null> = new EventEmitter<string | null>();

    @Input() value: string | null;

    public formGroup: FormGroup;

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

    @Input() usage: string | dateUsage;

    // used for marking the input as being edited
    public is_active: boolean = false;

    public is_null: boolean = false;

    @ViewChild('eqDateRange') eqDateRange: ElementRef<HTMLDivElement>;
    @ViewChild('inputRange') inputRange: MatDateRangeInput<string>;
    @ViewChild('inputStart') inputStart: ElementRef<HTMLInputElement>;
    @ViewChild('inputEnd') inputEnd: ElementRef<HTMLInputElement>;

    get inputStartValue(): string | null {
        if (this.inputRange && this.inputRange.value instanceof DateRange) {
            const inputsValue: string | null = this.inputRange.value.start;
            if (inputsValue) {
                const date = new Date(inputsValue).toLocaleDateString();
                if (date) {
                    return date;
                }
            }
        }

        return null;
    }

    get inputEndValue(): string | null {
        if (this.inputRange && this.inputRange.value instanceof DateRange) {
            const inputsValue: string | null = this.inputRange.value.end;
            if (inputsValue) {
                const date = new Date(inputsValue).toLocaleDateString();
                if (date) {
                    return date;
                }
            }
        }

        return null;
    }

    public inputsComputedValue = (): string | null => {
        if (this.inputStartValue && this.inputEndValue) {
            return `${this.inputStartValue} - ${this.inputEndValue}`;
        }

        return null;
    }

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {

        if (changes.hasOwnProperty('value') && !changes.value.firstChange && this.value !== null) {
            const [dateStart, dateEnd] = this.splitDateRange(changes.value.currentValue);
            this.updateValue(dateStart, dateEnd);
        }

        if (changes.hasOwnProperty('mode') && !changes.mode.firstChange && this.value === null) {
            this.updateValue(null, null);
        }
    }

    ngOnInit(): void {
        this.initFormGroup();
    }

    private splitDateRange = (dateRange: string): string[] => dateRange.split(' - ');

    public initFormGroup(): void {
        if (this.value !== null) {
            const [dateStart, dateEnd] = this.splitDateRange(this.value);

            this.formGroup = new FormGroup({
                start: new FormControl(''),
                end: new FormControl('')
            });

            if (this.checkDateValidity(dateStart) && this.checkDateValidity(dateEnd)) {
                this.formGroup.setValue({
                    start: new Date(dateStart),
                    end: new Date(dateEnd)
                });
            }
        }

        else if (this.nullable && [null, '[null]'].includes(this.value)) {
            this.updateValue(null, null);
        }

        else {
            this.formGroup.setValue({
                start: '',
                end: ''
            });
        }

        this.changeDetectorRef.detectChanges();

        const validators: ValidatorFn[] = [];

        if (this.required) {
            validators.push(Validators.required);
        }

        if (!this.nullable) {
            validators.push(
                Validators.minLength(10),
                Validators.maxLength(10)
            );
        }

        this.formGroup.setValidators(validators);
    }

    public activate(): void {
        if (this.mode === 'edit' && !this.disabled) {
            this.toggleActive(true);
        }
    }

    private toggleActive(editable: boolean): void {
        this.is_active = editable;
        this.changeDetectorRef.detectChanges();
        if (editable && this.inputRange) {
            this.inputRange._startInput.focus();
        }
    }

    public toggleIsNull(is_null: boolean): void {
        this.is_null = is_null;
        if (this.is_null) {
            this.updateValue(null, null);
        }
        else {
            this.updateValue('', '');
            this.formGroup.enable();
        }
        this.changeDetectorRef.detectChanges();
    }

    private updateValue(valueStart: string | null, valueEnd: string | null): void {
        if (
            valueStart === null &&
            valueEnd === null &&
            this.inputStart.nativeElement instanceof HTMLInputElement &&
            this.inputEnd.nativeElement instanceof HTMLInputElement
        ) {
            this.is_null = true;
            this.formGroup.setValue({
                start: '[null]',
                end: '[null]',
            });
            this.inputStart.nativeElement.value = '[null]';
            this.inputEnd.nativeElement.value = '[null]';
            this.formGroup.markAsUntouched({onlySelf: true});
        }
        else {
            this.is_null = false;
            if (
                (valueStart && new Date(valueStart).toString() !== 'Invalid Date') &&
                (valueEnd && new Date(valueEnd).toString() !== 'Invalid Date')
            ) {
                this.formGroup.setValue({
                    start: new Date(valueStart),
                    end: new Date(valueEnd)
                });
            }
            else {
                this.formGroup.setValue({
                    start: '',
                    end: '',
                });
            }
        }
    }

    public getErrorMessage(): string {
        if (this.error) {
            return this.error;
        }
        return '';
    }

    public onBlur(event: FocusEvent): void {
        event.preventDefault();
        // we need to discard current instance because onblur event occurs before onSave
        if (
            this.eqDateRange.nativeElement instanceof Element &&
            !this.eqDateRange.nativeElement.contains(event.relatedTarget as Node)
        ) {
            this.toggleIsNull(false);
            if (![null, '[null]', ''].includes(this.value)) {
                const [dateStart, dateEnd] = this.splitDateRange(this.value as string);
                this.updateValue(dateStart, dateEnd);
            }
            this.toggleActive(false);
        }
    }

    public onCancel(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.toggleIsNull(false);
        if (this.value !== null) {
            const [dateStart, dateEnd] = this.splitDateRange(this.value);
            this.updateValue(dateStart, dateEnd);
        }
        this.toggleActive(false);
    }

    public onClear(event: MouseEvent): void {
        event.stopImmediatePropagation();
        event.preventDefault();
        this.updateValue('', '');
        this.formGroup.markAsPending({onlySelf: true});
        this.inputRange._startInput.focus();
    }

    public onSave(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        if (this.is_null) {
            this.valueChange.emit(null);
            this.formGroup.markAsUntouched({onlySelf: true});
            this.toggleActive(false);
        }
        else if (this.formGroup.valid || this.inputsComputedValue !== null) {
            const date: string = `${this.sanitizeDate(this.formGroup.value.start)} - ${this.sanitizeDate(this.formGroup.value.end)}`;
            this.valueChange.emit(date);
            this.toggleActive(false);
        }
    }

    public formatDate(): string {
        if (this.formGroup.value.start !== '[null]' && this.formGroup.value.end !== '[null]') {
            const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat('fr', dateFormat[this.usage as dateUsage]);
            return formatter.format(new Date(this.formGroup.value.start)) + ' – ' + formatter.format(new Date(this.formGroup.value.end));
        }

        return '[null] – [null]';
    }

    public checkDateValidity(date: string): boolean {
        return !isNaN(Date.parse(date));
    }

    private sanitizeDate(date: string): string {
        const newDate: Date = new Date(date);
        const timestamp: number = newDate.getTime();
        const offsetTz: number = newDate.getTimezoneOffset() * 60 * 1000;
        return new Date(timestamp + offsetTz).toISOString().substring(0, 10) + 'T00:00:00Z';
    }
}
