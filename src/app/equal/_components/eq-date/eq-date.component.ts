import {
    ChangeDetectorRef,
    Component, DoCheck,
    ElementRef,
    EventEmitter,
    Inject,
    Input, LOCALE_ID,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {FormControl, ValidatorFn, Validators} from '@angular/forms';

// const DateFormats: Record<dateUsage, string> = {
//   "date.short.day": "ddd DD/MM/YY",
//   "date.short": "DD/MM/YY",
//   "date.medium": "DD/MMM/YYYY",
//   "date.long": "ddd DD MMM YYYY",
//   "date.full": "dddd DD MMMM YYYY",
// }
type dateUsage = 'date.short.day' | 'date.short' | 'date.medium' | 'date.long' | 'date.full';

type dateFormat = Record<dateUsage, Intl.DateTimeFormatOptions>;

const dateFormat: dateFormat = {
    'date.short.day': {weekday: 'short', day: 'numeric', month: 'numeric', year: '2-digit'},
    'date.short': {day: 'numeric', month: '2-digit', year: '2-digit'},
    'date.medium': {day: 'numeric', month: 'short', year: 'numeric'},
    'date.long': {weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'},
    'date.full': {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'},
};

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

    @Input() usage: string | dateUsage;

    // used for marking the input as being edited
    public is_active: boolean = false;

    public is_null: boolean = false;

    @ViewChild('eqDate') eqDate: ElementRef<HTMLDivElement>;
    @ViewChild('input') input: ElementRef<HTMLInputElement>;

    get inputValue(): string | undefined {
        return this.input?.nativeElement.value;
    }

    @ViewChild('nullableInput') nullableInput: ElementRef<HTMLInputElement>;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        @Inject(LOCALE_ID) public locale: string
    ) {
    }

    ngOnInit(): void {
        this.initFormControl();
        this.initNullableValue();

        if (!this.checkDateValidity(this.formControl.value)) {
            this.formControl.setErrors({invalid: true});
            this.formControl.markAsTouched({onlySelf: true});
        }
    }

    ngDoCheck(): void {
        // if (this.is_null) {
        //     this.formControl.disable();
        // }
    }

    public initFormControl(): void {
        if (this.value && !['[null]', ''].includes(this.value)) {
            this.formControl = new FormControl(new Date(this.value));
        }
        else {
            this.formControl = new FormControl('');
        }

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
        }
        else {
            this.is_null = false;
            if (new Date(value).toString() !== 'Invalid Date') {
                this.formControl.setValue(new Date(value));
            }
            else {
                this.formControl.setValue('');
            }
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
        }
        else if (this.formControl.valid) {
            const date: string = this.sanitizeDate(this.formControl.value);
            this.valueChange.emit(date);
        }
        this.toggleActive(false);
    }

    public formatDate(date: string): string {
        if (date !== '[null]') {
            const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat(this.locale, dateFormat[this.usage as dateUsage]);
            return formatter.format(new Date(date));
        }

        return '[null]'
    }

    public checkDateValidity(date: string): boolean {
        return !isNaN(Date.parse(date));
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
        }
        else {
            this.updateValue('');
            this.formControl.enable();
            this.changeDetectorRef.detectChanges();
        }
    }

    private sanitizeDate(date: string): string {
        const newDate: Date = new Date(date);
        const timestamp: number = newDate.getTime();
        const offsetTz: number = newDate.getTimezoneOffset() * 60 * 1000;
        return new Date(timestamp + offsetTz).toISOString().substring(0, 10) + 'T00:00:00Z';
    }
}
