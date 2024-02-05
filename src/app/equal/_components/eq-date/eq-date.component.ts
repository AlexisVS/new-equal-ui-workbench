import {
    ChangeDetectorRef,
    Component,
    DoCheck,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {FormControl, ValidatorFn, Validators} from '@angular/forms';

type dateUsage = 'date.short.day' | 'date.short' | 'date.medium' | 'date.long' | 'date.full';

// type dateFormat = Record<dateUsage, Intl.DateTimeFormatOptions>;

// const dateFormat: dateFormat = {
//     'date.short.day': {weekday: 'short', day: 'numeric', month: 'numeric', year: '2-digit'},
//     'date.short': {day: 'numeric', month: '2-digit', year: '2-digit'},
//     'date.medium': {day: 'numeric', month: 'short', year: 'numeric'},
//     'date.long': {weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'},
//     'date.full': {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'},
// };

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

    public formatDate(): string {
        if (this.formControl.value !== '[null]') {
            const dateNameDictionary: Record<string, string> = {
                'day.monday': 'lundi',
                'day.tuesday': 'mardi',
                'day.wednesday': 'mercredi',
                'day.thursday': 'jeudi',
                'day.friday': 'vendredi',
                'day.saturday': 'samedi',
                'day.sunday': 'dimanche',
                'day.monday.short': 'lun',
                'day.tuesday.short': 'mar',
                'day.wednesday.short': 'mer',
                'day.thursday.short': 'jeu',
                'day.friday.short': 'ven',
                'day.saturday.short': 'sam',
                'day.sunday.short': 'dim',
                'month.january': 'janvier',
                'month.february': 'février',
                'month.march': 'mars',
                'month.april': 'avril',
                'month.may': 'mai',
                'month.june': 'juin',
                'month.july': 'juillet',
                'month.august': 'aout',
                'month.september': 'septembre',
                'month.october': 'octobre',
                'month.november': 'novembre',
                'month.december': 'décembre',
                'month.january.short': 'jan',
                'month.february.short': 'fév',
                'month.march.short': 'mar',
                'month.april.short': 'avr',
                'month.may.short': 'mai',
                'month.june.short': 'juin',
                'month.july.short': 'juil',
                'month.august.short': 'aou',
                'month.september.short': 'sep',
                'month.october.short': 'oct',
                'month.november.short': 'nov',
                'month.december.short': 'déc'
            };

            const DateFormats: Record<dateUsage, string> = {
                'date.short.day': 'ddd DD/MM/YY',
                'date.short': 'DD/MM/YY',
                'date.medium': 'DD/MM/YYYY',
                'date.long': 'ddd DD MMM YYYY',
                'date.full': 'dddd DD MMMM YYYY',
            };

            const date: Date = new Date(this.formControl.value);

            if (DateFormats.hasOwnProperty(this.usage as dateUsage)) {

                const format: string = DateFormats[this.usage as dateUsage];

                const name_month: string = date.toLocaleDateString('en-US', {month: 'long'});
                const name_day: string = date.toLocaleDateString('en-US', {weekday: 'long'});
                const index_day: number = date.getDate();
                const index_month: number = date.getMonth() + 1;
                const index_year: number = date.getFullYear();

                return format
                    .replace('dddd', dateNameDictionary['day.' + name_day.toLowerCase()])
                    .replace('ddd', dateNameDictionary['day.' + name_day.toLowerCase() + '.short'])
                    .replace('DD', index_day.toString().padStart(2, '0'))
                    .replace('MMMM', dateNameDictionary['month.' + name_month.toLowerCase()])
                    .replace('MMM', dateNameDictionary['month.' + name_month.toLowerCase() + '.short'])
                    .replace('MM', index_month.toString().padStart(2, '0'))
                    .replace('YYYY', index_year.toString().padStart(4, '0'))
                    .replace('YY', (index_year % 100).toString().padStart(2, '0'));
            }
        }

        return '[null]';
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
