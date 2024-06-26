import {
    Component,
    OnInit,
    AfterViewInit,
    OnChanges,
    Output,
    Input,
    ElementRef,
    EventEmitter,
    SimpleChanges,
    SimpleChange,
    ViewChild, ChangeDetectorRef, AfterViewChecked,
} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatAutocomplete} from '@angular/material/autocomplete';

import {Observable, ReplaySubject} from 'rxjs';
import {map, mergeMap, debounceTime} from 'rxjs/operators';

import {ApiService} from '../../services/api.service';
import {Condition, Domain} from './domain.class';


@Component({
    selector: 'eq-m2o',
    templateUrl: './eq-m2o.component.html',
    styleUrls: ['./eq-m2o.component.scss']
})
export class EqM2oComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {
    /* mark the field as readonly */
    @Input() disabled?: boolean = false;

    /* mark the field as mandatory */
    @Input() required?: boolean = false;

    @Input() nullable: boolean = false;

    /* specific placeholder of the widget */
    @Input() placeholder?: string = '';

    /* specific title for the widget */
    @Input() title?: string;

    /* specific hint/helper for the widget */
    @Input() hint?: string = '';

    /**  Set the mode */
    @Input() mode: 'view' | 'edit' = 'view';

    /* full name of the entity to load */
    @Input() entity: string = '';

    /* id of the object to load as preset value */
    @Input() id: number = 0;

    /* extra fields to load (in addition to 'id', 'name') */
    @Input() fields?: string[] = [];

    /* additional domain for filtering result set */
    @Input() domain?: any[] = [];

    /* specific controller to use for fetching data */
    @Input() controller?: string = '';

    /* extra parameter specific to the chosen controller */
    @Input() params?: any = {};

    /* specific hint/helper for the widget */
    @Input() autofocus?: boolean = false;

    /* message to display in case no match was found */
    @Input() noResult?: string = '';

    /* custom method for rendering the items */
    @Input() displayWith?: (a: any) => string;

    @Input() hint_always: boolean = false;

    @Input() size?: 'small' | 'normal' | 'large' | 'extra' = 'normal';

    /* css value for panel width (dropdown) */
    @Input() panelWidth: string = 'auto';

    @Output() itemSelected: EventEmitter<number> = new EventEmitter<number>();

    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() blur: EventEmitter<any> = new EventEmitter();

    @ViewChild('eqM2o') eqM2o: ElementRef<HTMLDivElement>;
    @ViewChild('inputControl') inputControl: ElementRef;
    @ViewChild('inputAutocomplete') inputAutocomplete: MatAutocomplete;

    // currently selected item
    @Input() initialSelectedItem: any = null;

    public formControl: FormControl;
    public resultList: Observable<any>;

    // flag for marking the input as being edited
    public is_active: boolean = false;

    public is_null: boolean = false;

    private inputQuery: ReplaySubject<any>;

    constructor(
        private api: ApiService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.formControl = new FormControl();
        this.inputQuery = new ReplaySubject(1);
    }

    ngAfterViewInit(): void {
        if (!this.disabled && this.autofocus) {
            setTimeout(() => this.inputControl.nativeElement.focus());
        }

        if (this.initialSelectedItem !== null) {
            this.formControl.setValue(this.initialSelectedItem);
        }
    }

    ngAfterViewChecked(): void {
        if (this.inputAutocomplete && this.inputAutocomplete.panel && this.inputAutocomplete.panel.nativeElement instanceof HTMLElement) {
            this.inputAutocomplete.panel.nativeElement.style.transform = 'translateY(21px)';
            this.inputAutocomplete.panel.nativeElement.style.width = this.eqM2o.nativeElement.clientWidth + 'px';
        }
    }

    ngOnInit(): void {

        // watch changes made on input
        this.formControl.valueChanges.subscribe((value: string) => {
            if (!this.initialSelectedItem || this.initialSelectedItem !== value) {
                this.inputQuery.next(value);
            }
        });

        // update autocomplete result list
        this.resultList = this.inputQuery.pipe(
            debounceTime(300),
            map((value: any) => (typeof value === 'string' ? value : ((value == null) ? '' : value.name))),
            mergeMap(async (name: string): Promise<any> => await this.filterResults(name))
        );

    }

    /**
     * Update component based on changes received from parent.
     */
    ngOnChanges(changes: SimpleChanges): void {
        let has_changed: boolean = false;

        const currentId: SimpleChange = changes.id;
        const currentEntity: SimpleChange = changes.entity;

        if (changes.required) {
            if (this.required) {
                this.formControl.setValidators([Validators.required]);
                this.formControl.markAsTouched();
            }
            this.formControl.updateValueAndValidity();
        }

        if (currentId && currentId.currentValue && currentId.currentValue !== currentId.previousValue) {
            has_changed = true;
        }

        if (currentEntity && currentEntity.currentValue && currentEntity.currentValue !== currentEntity.previousValue) {
            has_changed = true;
        }

        if (has_changed) {
            this.load();
        }
    }

    /**
     * Load initial values, based on inputs assigned by parent component.
     *
     */
    private async load(): Promise<void> {
        if (this.id && this.id > 0 && this.entity && this.entity.length && this.fields) {
            try {
                const result: Array<any> = await this.api.read(this.entity, [this.id], ['id', 'name', ...this.fields]) as Array<any>;
                if (result && result.length && this.initialSelectedItem === null) {
                    this.formControl.setValue(result[0]);
                    this.initialSelectedItem = result[0];
                }
            } catch (error: any) {
                console.warn('an unexpected error occurred');
            }
        }
    }

    /**
     * Fetch objects from the server, based on the given name.
     */
    private async filterResults(name: string): Promise<any[]> {
        let filtered: any[] = [];
        if (this.entity.length && (!this.initialSelectedItem || this.initialSelectedItem.name !== name)) {
            try {
                const tmpDomain: Domain = new Domain([]);
                if (name.length) {
                    const parts: string[] = name.split(' ', 4);
                    for (const part of parts) {
                        tmpDomain.addCondition(new Condition('name', 'ilike', '%' + part + '%'));
                    }
                }
                // @ts-ignore
                const domain: any[] = (new Domain(this.domain)).merge(tmpDomain).toArray();
                let data: any[];

                if (this.controller && this.controller.length) {
                    const body: any = {
                        get: this.controller,
                        entity: this.entity,
                        // @ts-ignore
                        fields: ['id', 'name', ...this.fields],
                        // @ts-ignore
                        domain: JSON.stringify(domain),
                        ...this.params
                    };

                    // fetch objects using controller given by View (default is core_model_collect)
                    data = await this.api.fetch('/', body);
                }
                else {
                    // @ts-ignore
                    data = await this.api.collect(this.entity, domain, ['id', 'name', ...this.fields], 'name', 'asc', 0, 25);
                }

                filtered = data;
            } catch (error: any) {
                console.warn(error);
            }
        }
        return filtered;
    }

    /**
     * Display the given item.
     *
     * @param item
     */
    public itemDisplay = (item: any): string => {
        if (!item) {
            return '';
        }
        if (this.displayWith) {
            return this.displayWith(item);
        }
        return item.name;
    }

    public onFocus(): void {
        // force triggering a list refresh
        this.formControl.setValue('');
    }

    /**
     * Clear the current value.
     */
    public onClear(): void {
        this.formControl.setValue(null);
        if (this.inputControl && this.inputControl.nativeElement instanceof HTMLInputElement) {
            this.inputControl.nativeElement.focus();
        }
    }

    /**
     * Close the autocomplete panel.
     *
     * @param event
     */
    public onBlur(event: FocusEvent): void {
        if (
            !this.inputAutocomplete.isOpen &&
            this.eqM2o.nativeElement instanceof Element &&
            !this.eqM2o.nativeElement.contains(event.relatedTarget as Node)
        ) {
            this.blur.emit();
            this.onRestore();
        }
        else {
            // eslint-disable-next-line no-console
            console.debug('eq-m2o: autocomplete open ignoring blur');
        }
    }

    /**
     * Restore to the initial value.
     *
     * @param event
     */
    public onSelect(event: any): void {
        if (event && event.option && event.option.value) {
            this.formControl.setValue(event.option.value);
        }
    }

    /**
     * Restore to the initial value.
     */
    public onRestore(): void {
        if (this.initialSelectedItem) {
            this.formControl.setValue(this.initialSelectedItem);
        }
        else {
            this.formControl.setValue(null);
        }
    }

    /**
     * Close the autocomplete panel.
     */
    public oncloseAutocomplete(): void {
        if (!this.formControl.value || !this.initialSelectedItem) {
            this.blur.emit();
        }
    }


    /**
     * Restore to the initial value.
     *
     * @param event
     */
    public onCancel(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.onRestore();
        this.toggleActive(false);
    }

    /**
     * Save the current value.
     *
     * @param event
     */
    public onSave(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.itemSelected.emit(this.formControl.value);
        this.initialSelectedItem = this.formControl.value;
    }

    public activate(): void {
        if (this.mode === 'edit' && !this.disabled) {
            this.toggleActive(true);
        }
    }

    private toggleActive(editable: boolean): void {
        this.is_active = editable;
        if (this.mode === 'edit' && editable) {
            this.inputControl.nativeElement.focus();
        }
    }

}
