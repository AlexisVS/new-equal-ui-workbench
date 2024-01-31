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
import {FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';

type dateUsage = 'date.short.day' | 'date.short' | 'date.medium' | 'date.long' | 'date.full';

type dateFormat = Record<dateUsage, Intl.DateTimeFormatOptions>;

const dateFormat: dateFormat = {
    'date.short.day': {weekday: 'short', day: 'numeric', month: 'numeric', year: '2-digit'},
    'date.short': {day: 'numeric', month: 'numeric', year: '2-digit'},
    'date.medium': {day: 'numeric', month: 'short', year: 'numeric'},
    'date.long': {weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'},
    'date.full': {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'},
};

type dateRange = 'start' | 'end';

@Component({
    selector: 'eq-date-range',
    templateUrl: './eq-date-range.component.html',
    styleUrls: ['./eq-date-range.component.scss']
})
export class EqDateRangeComponent implements OnInit, DoCheck {

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
        this.initFormGroup();
    }

    ngDoCheck(): void {
        if (this.is_null) {
            this.formGroup.disable();
        }
    }

    public initFormGroup(): void {
        if (this.value) {
            const dates: string[] = this.value.split(' - ');
            const [dateStart, dateEnd] = dates;

            this.formGroup = new FormGroup({
                start: new FormControl(''),
                end: new FormControl('')
            });

            if (this.nullable && [null, '[null]'].includes(this.value)) {
                this.formGroup.setValue({
                    start: '[null]',
                    end: '[null]',
                });
                this.is_null = true;
                this.formGroup.disable();
            }

            else if (this.checkDateValidity(dateStart) && this.checkDateValidity(dateEnd)) {
                this.formGroup.setValue({
                    start: new Date(dateStart),
                    end: new Date(dateStart)
                });
            }
        }
        else {
            this.formGroup.setValue({
                start: '',
                end: ''
            });
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

        this.formGroup.setValidators(validators);
    }

    public activate(): void {
        if (this.mode === 'edit' && !this.disabled) {
            this.toggleActive(true);
            this.input?.nativeElement?.focus();
        }
    }

    private toggleActive(editable: boolean): void {
        this.is_active = editable;
        if (editable) {
            this.input?.nativeElement?.focus();
        }
    }

    // public toggleIsNull(is_null: boolean): void {
    //     this.is_null = is_null;
    //     if (this.is_null) {
    //         this.updateValue(null);
    //     }
    //     else {
    //         this.updateValue('');
    //         this.formGroup.enable();
    //         this.changeDetectorRef.detectChanges();
    //     }
    // }
    //

    // private updateValue(value: string | null, dateRange: dateRange): void {
    //     if (value === null) {
    //         this.is_null = true;
    //         this.formGroup.value[dateRange].setValue('[null]');
    //     }
    //     else {
    //         this.is_null = false;
    //         if (new Date(value).toString() !== 'Invalid Date') {
    //             this.formGroup.value[dateRange].setValue(new Date(value));
    //         }
    //         else {
    //             this.formGroup.value[dateRange].setValue('');
    //         }
    //     }
    // }


    public formatDate(date: string): string {
        const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat(this.locale, dateFormat[this.usage as dateUsage]);
        return formatter.format(new Date(date));
    }

    public checkDateValidity(date: string): boolean {
        return !isNaN(Date.parse(date));
    }


}
