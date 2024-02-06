import {
    AfterViewChecked,
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

type size = 'small' | 'normal' | 'large' | 'extra';

@Component({
    selector: 'eq-text',
    templateUrl: './eq-text.component.html',
    styleUrls: ['./eq-text.component.scss']
})
export class EqTextComponent implements OnInit, DoCheck, AfterViewChecked {
    @Output() valueChange: EventEmitter<string | null> = new EventEmitter<string | null>();

    @Input() value: string | null;

    @Input() placeholder: string = '';

    // used for forcing the component as disabled
    @Input() disabled: boolean = false;

    @Input() required: boolean = false;

    @Input() nullable: boolean = false;

    @Input() mode: 'view' | 'edit' = 'view';

    @Input() title?: string;

    @Input() hint: string = '';


    @Input() size: size = 'normal';

    @Input() error?: string;
    @Input() hasError: boolean = false;

    @Input() minHeight: number;

    @Input() maxHeight?: number;

    @Input() autoGrow: boolean = false;

    @ViewChild('eqText') eqText: ElementRef<HTMLDivElement>;
    @ViewChild('textarea') textarea: ElementRef<HTMLTextAreaElement>;
    @ViewChild('text') text: ElementRef<HTMLSpanElement>;

    // used for marking the textarea as being edited
    public is_active: boolean = false;

    public formControl: FormControl;

    public is_null: boolean = false;

    // // * For two lines of text if minHeight is not set
    // public textMinHeightSizing: Record<size, number> = {
    //   small: 35,
    //   normal: 40,
    //   large: 49,
    //   extra: 58
    // };

    // ! Do i need to add padding bottom to the view mode for equal the height of the mode edit ?
    public paddingBottomModeView: number = 66.83;

    constructor(
        private changeDetector: ChangeDetectorRef,
        private elementRef: ElementRef,
    ) {
    }

    ngAfterViewChecked(): void {
        this.setTextHeight();
    }

    ngOnInit(): void {
        this.initFormControl();
    }

    ngDoCheck(): void {
        this.setFormControlState();

        if (this.elementRef.nativeElement.style instanceof CSSStyleDeclaration) {
            this.setTextMinHeight();
        }
    }

    private setFormControlState(): void {
        if (this.mode === 'view' || this.disabled) {
            this.formControl.disable();
        }

        if (this.mode === 'edit' && !this.disabled) {
            this.formControl.enable();
        }

    }

    /**
     * @broken Handle the height of the textarea width overflow-y css property isn't a good solution
     * After one week of research, I didn't find a solution for this problem
     * The cdk textarea autosize use an approach for handle the height of the textarea, they
     * use node cloned for calculate the height of the textarea. I think it's the best solution for this problem because
     * for them, it works.
     */
    public setTextHeight(): void {
        // auto grow and max height
        if (this.autoGrow && typeof this.maxHeight === 'number') {
            this.elementRef.nativeElement.style.setProperty('--eq-text-max-height', this.maxHeight + 'px');
            //
            // this.changeDetector.detectChanges();
            // if (this.mode === 'edit') {
            //     if (this.textarea.nativeElement.scrollHeight > this.maxHeight) {
            //         this.elementRef.nativeElement.style.setProperty('--eq-text-height', this.maxHeight + 'px');
            //     }
            //     else {
            //         this.elementRef.nativeElement.style.setProperty('--eq-text-height', this.textarea.nativeElement.scrollHeight + 'px');
            //     }
            // }

            if (this.mode === 'view') {
                if (this.text.nativeElement.scrollHeight > this.maxHeight) {
                    this.elementRef.nativeElement.style.setProperty('--eq-text-height', this.maxHeight + 'px');
                }
                else {
                    this.elementRef.nativeElement.style.setProperty('--eq-text-height', this.text.nativeElement.scrollHeight + 'px');
                }
            }
        }
        // auto grow and no max height
        else if (this.autoGrow && typeof this.maxHeight !== 'number') {
            console.log('auto grow and no max height');
            this.elementRef.nativeElement.style.setProperty('--eq-text-max-height', 'none');
            this.elementRef.nativeElement.style.setProperty('--eq-text-height', 'auto');

            // if (this.mode === 'edit') {
            //     this.elementRef.nativeElement.style.setProperty('--eq-text-overflow-y', 'auto');
            //     this.elementRef.nativeElement.style.setProperty('--eq-text-height', 'auto');
            //     console.log(this.textarea.nativeElement.scrollHeight, this.textarea.nativeElement.clientHeight);
            //
            //     if (this.is_active) {
            //         this.elementRef.nativeElement.style.setProperty('--eq-text-height', this.textarea.nativeElement.scrollHeight + 'px');
            //     }
            //     else if (this.textarea.nativeElement.scrollHeight > this.textarea.nativeElement.clientHeight) {
            //         this.elementRef.nativeElement.style.setProperty('--eq-text-height', this.textarea.nativeElement.clientHeight + 'px');
            //     }
            //     else {
            //         this.elementRef.nativeElement.style.setProperty('--eq-text-height', this.textarea.nativeElement.clientHeight + 'px');
            //     }
            //
            //     this.elementRef.nativeElement.style.setProperty('--eq-text-overflow-y', 'hidden');
            // }

            if (this.mode === 'view') {
                console.log('view');
                this.elementRef.nativeElement.style.setProperty('--eq-text-overflow-y', 'auto');
                this.elementRef.nativeElement.style.setProperty('--eq-text-height', 'auto');
                console.log('view ==> ', this.text.nativeElement.scrollHeight > this.text.nativeElement.clientHeight);
                if (this.text.nativeElement.scrollHeight > this.text.nativeElement.clientHeight) {
                    console.log('VIEW => scrollHeight > clientHeight');
                    this.elementRef.nativeElement.style.setProperty('--eq-text-height', this.text.nativeElement.scrollHeight + 'px');
                }
                else {
                    this.elementRef.nativeElement.style.setProperty('--eq-text-height', this.text.nativeElement.clientHeight + 'px');
                }
                this.elementRef.nativeElement.style.setProperty('--eq-text-overflow-y', 'hidden');
            }
            this.changeDetector.detectChanges();
        }
            // no auto grow and max height
        // * OK
        else if (!this.autoGrow && typeof this.maxHeight === 'number') {
            console.log('no auto grow and max height');

            this.elementRef.nativeElement.style.setProperty('--eq-text-overflow-y', 'auto');
            this.elementRef.nativeElement.style.setProperty('--eq-text-height', 'auto');
            this.elementRef.nativeElement.style.setProperty('--eq-text-max-height', this.maxHeight + 'px');
            if (this.mode === 'edit') {
                if (this.textarea.nativeElement.scrollHeight > this.maxHeight || this.textarea.nativeElement.clientHeight > this.maxHeight) {
                    this.elementRef.nativeElement.style.setProperty('--eq-text-height', this.maxHeight + 'px');
                }
                else {
                    // if (this.textarea.nativeElement.scrollHeight > this.textarea.nativeElement.clientHeight) {
                    //   this.elementRef.nativeElement.style.setProperty('--eq-text-height', this.textarea.nativeElement.scrollHeight + 'px');
                    // } else {
                    this.elementRef.nativeElement.style.setProperty('--eq-text-height', this.textarea.nativeElement.clientHeight + 'px');
                    // }
                }
            }

            if (this.mode === 'view') {
                console.log('this.text.nativeElement.scrollHeight > this.maxHeight', this.text.nativeElement.scrollHeight > this.maxHeight);
                if (this.text.nativeElement.scrollHeight > this.maxHeight || this.text.nativeElement.clientHeight > this.maxHeight) {
                    this.elementRef.nativeElement.style.setProperty('--eq-text-height', this.maxHeight + 'px');
                }
                else {
                    if (this.text.nativeElement.scrollHeight > this.text.nativeElement.clientHeight) {
                        this.elementRef.nativeElement.style.setProperty('--eq-text-height', this.text.nativeElement.scrollHeight + 'px');
                    }
                    else {
                        this.elementRef.nativeElement.style.setProperty('--eq-text-height', this.text.nativeElement.clientHeight + 'px');
                    }
                }
            }

        }
        // no auto grow and no max height
        else if (!this.autoGrow && typeof this.maxHeight !== 'number') {
            console.log('no auto grow and no max height');

            this.elementRef.nativeElement.style.setProperty('--eq-text-overflow-y', 'auto');
            this.elementRef.nativeElement.style.setProperty('--eq-text-max-height', 'none');
            this.elementRef.nativeElement.style.setProperty('--eq-text-height', 'auto');
        }
    }

    private setTextMinHeight(): void {
        if (this.elementRef.nativeElement.style instanceof CSSStyleDeclaration) {
            this.elementRef.nativeElement.style.setProperty('--eq-text-min-height', this.minHeight + 'px');
            // if (this.minHeight) {
            // }
            // else {
            //   this.elementRef.nativeElement.style.setProperty('--eq-text-min-height', this.textMinHeightSizing[this.size] + 'px');
            // }
        }
    }

    private setFormControlToError(): void {
        if (this.hasError && !this.formControl.dirty) {
            this.formControl.setErrors({invalid: true});
            this.formControl.markAsTouched({onlySelf: true});
            this.formControl.markAsDirty({onlySelf: true});
        }
    }

    public initFormControl(): void {
        this.formControl = new FormControl(this.value);
        const validators: ValidatorFn[] = [];

        if (this.required) {
            validators.push(Validators.required);
        }

        if (!this.nullable) {
            validators.push(Validators.minLength(1));
        }

        this.formControl.setValidators(validators);
    }

    public getErrorMessage(): string {
        if (this.error && this.formControl.invalid) {
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
            this.formControl.setValue(value);
        }
    }

    public onClear(event: MouseEvent): void {
        event.stopImmediatePropagation();
        event.preventDefault();
        this.updateValue('');
        this.formControl.markAsPending({onlySelf: true});
        this.textarea.nativeElement.focus();
    }

    public activate(): void {
        if (this.mode === 'edit' && !this.disabled) {
            this.toggleActive(true);
            this.textarea.nativeElement.focus();
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
            this.valueChange.emit(this.formControl.value);
        }
        this.toggleActive(false);
    }

    public onBlur(event: FocusEvent): void {
        event.preventDefault();
        // we need to discard current instance because onblur event occurs before onSave
        if (
            this.eqText.nativeElement instanceof Element &&
            !this.eqText.nativeElement.contains(event.relatedTarget as Node)
        ) {
            this.toggleIsNull(false);
            this.updateValue(this.value);
            this.toggleActive(false);
        }
    }

    private toggleActive(editable: boolean): void {
        this.is_active = editable;
        if (editable) {
            this.textarea.nativeElement.focus();
        }
    }

    public toggleIsNull(is_null: boolean): void {
        this.is_null = is_null;
        if (this.is_null) {
            this.updateValue(null);
        }
        else {
            this.updateValue('');
        }
    }
}
