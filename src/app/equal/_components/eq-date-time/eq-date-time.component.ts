import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

type dateUsage = 'date.short.day' | 'date.short' | 'date.medium' | 'date.long' | 'date.full';

type dateFormat = Record<dateUsage, Intl.DateTimeFormatOptions>;

const dateFormat: dateFormat = {
    'date.short.day': {weekday: 'short', day: 'numeric', month: 'numeric', year: '2-digit'},
    'date.short': {day: 'numeric', month: '2-digit', year: '2-digit'},
    'date.medium': {day: 'numeric', month: 'short', year: 'numeric'},
    'date.long': {weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'},
    'date.full': {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'},
};

// type dateRange = 'date' | 'end';

@Component({
    selector: 'eq-date-time',
    templateUrl: './eq-date-time.component.html',
    styleUrls: ['./eq-date-time.component.scss']
})
export class EqDateTimeComponent implements OnInit, OnChanges {

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

    @ViewChild('eqDateTime') eqDateRange: ElementRef<HTMLDivElement>;
    @ViewChild('inputDate') inputDate: ElementRef<HTMLInputElement>;
    @ViewChild('inputTime') inputTime: ElementRef<HTMLInputElement>;

    get inputDateValue(): string | null {
        if (this.inputDate.nativeElement instanceof HTMLInputElement) {
            return this.inputDate.nativeElement.value;
        }

        return null;
    }

    get inputTimeValue(): string | null {
        if (this.inputTime.nativeElement instanceof HTMLInputElement) {
            return this.inputTime.nativeElement.value;
        }

        return null;
    }

    public inputsComputedValue = (): string | null => {
        if (this.inputDateValue && this.inputTimeValue) {
            return `${this.inputDateValue} - ${this.inputTimeValue}`;
        }

        return null;
    }

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('value') && !changes.value.firstChange && this.value !== null) {
            const [date, time] = this.splitDateTimeValue(changes.value.currentValue);
            this.updateValue(date, time);
        }

        if (changes.hasOwnProperty('mode') && !changes.mode.firstChange && this.value === null) {
            this.updateValue(null, null);
        }
    }

    ngOnInit(): void {
        this.initFormGroup();
    }

    private splitDateTimeValue = (dateTime: string): string[] => {
        const [date, timeWithUtc] = dateTime.split('T');
        const time = timeWithUtc.split('+')[0];

        return [date, time];
    }

    public initFormGroup(): void {
        if (this.value !== null) {
            const [date, time] = this.splitDateTimeValue(this.value);

            this.formGroup = new FormGroup({
                date: new FormControl(''),
                time: new FormControl('')
            });

            if (this.checkDateValidity(date) && this.isValidTimeFormat(time)) {
                this.formGroup.setValue({
                    date: new Date(date),
                    time
                });
            }
        }

        else if (this.nullable && [null, '[null]'].includes(this.value)) {
            this.updateValue(null, null);
        }

        else {
            this.formGroup.setValue({
                date: '',
                time: ''
            });
        }

        this.changeDetectorRef.detectChanges();


        if (this.required) {
            this.formGroup.addValidators(Validators.required);
        }

        if (!this.nullable) {
            this.formGroup.value.date.setValidators([
                Validators.minLength(10),
                Validators.maxLength(10)
            ]);

            this.formGroup.value.time.setValidators([
                Validators.minLength(8),
                Validators.maxLength(8)
            ]);
        }

    }

    public activate(): void {
        if (this.mode === 'edit' && !this.disabled) {
            this.is_active = true;
            this.changeDetectorRef.detectChanges();
        }
    }

    public focusInput(input: HTMLInputElement): void {
        if (input instanceof HTMLInputElement) {
            this.formGroup.markAsTouched({onlySelf: true});
            this.changeDetectorRef.detectChanges();
            input.focus();
            this.changeDetectorRef.detectChanges();
        }
    }

    private toggleActive(editable: boolean): void {
        this.is_active = editable;
        this.changeDetectorRef.detectChanges();
        if (editable && this.inputDate.nativeElement instanceof HTMLInputElement) {
            this.inputDate.nativeElement.focus();
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

    private updateValue(dateValue: string | null, timeValue: string | null): void {
        if (
            dateValue === null &&
            timeValue === null &&
            this.inputDate.nativeElement instanceof HTMLInputElement &&
            this.inputTime.nativeElement instanceof HTMLInputElement
        ) {
            this.is_null = true;
            this.formGroup.setValue({
                date: '[null]',
                time: '[null]',
            });
            this.inputDate.nativeElement.value = '[null]';
            this.inputTime.nativeElement.value = '[null]';
            this.formGroup.markAsUntouched({onlySelf: true});
        }
        else {
            this.is_null = false;
            if (
                (dateValue && new Date(dateValue).toString() !== 'Invalid Date') &&
                (timeValue && this.isValidTimeFormat(timeValue))
            ) {
                this.formGroup.setValue({
                    date: new Date(dateValue),
                    time: timeValue
                });
            }
            else {
                this.formGroup.setValue({
                    date: '',
                    time: '',
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
                const [date, time] = this.splitDateTimeValue(this.value as string);
                this.updateValue(date, time);
            }
            this.toggleActive(false);
        }
    }

    public onCancel(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.toggleIsNull(false);
        if (this.value !== null) {
            const [date, time] = this.splitDateTimeValue(this.value);
            this.updateValue(date, time);
        }
        this.toggleActive(false);
    }

    public onClear(event: MouseEvent): void {
        event.stopImmediatePropagation();
        event.preventDefault();
        this.updateValue('', '');
        this.formGroup.markAsPending({onlySelf: true});
        if (this.inputDate.nativeElement instanceof HTMLInputElement) {
            this.inputDate.nativeElement.focus();
        }
    }

    public onSave(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        if (this.is_null) {
            this.valueChange.emit(null);
            this.formGroup.markAsUntouched({onlySelf: true});
            this.toggleActive(false);
        }
        else if (
            this.formGroup.valid ||
            this.inputsComputedValue !== null &&
            this.inputTimeValue &&
            this.isValidTimeFormat(this.inputTimeValue)
        ) {
            const date: string = this.sanitizeDate(this.formGroup.value.date, this.formGroup.value.time);
            this.valueChange.emit(date);
            this.toggleActive(false);
        }
    }

    public formatDate(): string {
        if (this.formGroup.value.date !== '[null]' && this.formGroup.value.time !== '[null]') {
            const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat('fr', dateFormat[this.usage as dateUsage]);
            return formatter.format(new Date(this.formGroup.value.date)) + ' ' + this.formGroup.value.time;
        }

        return '[null] – [null]';
    }

    public checkDateValidity(date: string): boolean {
        return !isNaN(Date.parse(date));
    }

    public isValidTimeFormat(time: string): boolean {
        // Regular expression for the format hh:mm:ss
        const timeRegex: RegExp = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

        if (!timeRegex.test(time)) {
            return false;
        }

        const [hours, minutes, seconds] = time.split(':').map(Number);

        return !(hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59);
    }

    // ? Not sure
    private sanitizeDate(date: string, time: string): string {
        const newDate: Date = new Date(date);
        const timestamp: number = newDate.getTime();
        const offsetTz: number = newDate.getTimezoneOffset() * 60 * 1000;
        return new Date(timestamp + offsetTz).toISOString().substring(0, 10) + 'T' + time + 'Z';
    }
}
