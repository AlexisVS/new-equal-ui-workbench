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
    ViewChild,
} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatAutocomplete} from '@angular/material/autocomplete';

import {Observable, ReplaySubject} from 'rxjs';
import {map, mergeMap, debounceTime} from 'rxjs/operators';

// @ts-ignore
import {ApiService} from 'sb-shared-lib';
import {Condition, Domain} from './domain.class';


@Component({
    selector: 'eq-m2o',
    templateUrl: './eq-m2o.component.html',
    styleUrls: ['./eq-m2o.component.scss']
})
export class EqM2oComponent implements OnInit, OnChanges, AfterViewInit {
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

    /* mark the field as mandatory */
    @Input() required?: boolean = false;

    /* specific placeholder of the widget */
    @Input() placeholder?: string = '';

    /* specific hint/helper for the widget */
    @Input() hint?: string = '';

    /* specific hint/helper for the widget */
    @Input() autofocus?: boolean = false;

    /* message to display in case no match was found */
    @Input() noResult?: string = '';

    /* mark the field as readonly */
    @Input() disabled?: boolean = false;

    /* custom method for rendering the items */
    @Input() displayWith?: (a: any) => string;

    /* css value for panel width (dropdown) */
    @Input() panelWidth: string = 'auto';

    @Output() itemSelected: EventEmitter<number> = new EventEmitter<number>();

    // tslint:disable-next-line:no-output-native
    @Output() blur: EventEmitter<any> = new EventEmitter();

    @ViewChild('inputControl') inputControl: ElementRef;
    @ViewChild('inputAutocomplete') inputAutocomplete: MatAutocomplete;

    // currently selected item
    public item: any = null;

    public inputFormControl: FormControl;
    public resultList: Observable<any>;

    private inputQuery: ReplaySubject<any>;

    constructor(private api: ApiService) {
        this.inputFormControl = new FormControl();
        this.inputQuery = new ReplaySubject(1);
    }

    ngAfterViewInit(): void {
        if (!this.disabled && this.autofocus) {
            setTimeout(() => this.inputControl.nativeElement.focus());
        }
    }

    ngOnInit(): void {

        // watch changes made on input
        this.inputFormControl.valueChanges.subscribe((value: string) => {
            if (!this.item || this.item !== value) {
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
                this.inputFormControl.setValidators([Validators.required]);
                this.inputFormControl.markAsTouched();
            }
            this.inputFormControl.updateValueAndValidity();
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
                if (result && result.length) {
                    this.item = result[0];
                    this.inputFormControl.setValue(this.item);
                }
            } catch (error: any) {
                console.warn('an unexpected error occured');
            }
        }
    }

    private async filterResults(name: string): Promise<any[]> {
        let filtered: any[] = [];
        if (this.entity.length && (!this.item || this.item.name !== name)) {
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

    public itemDisplay = (item: any): string => {
        if (!item) {
            return '';
        }
        if (this.displayWith) {
            return this.displayWith(item);
        }
        return item.name;
    }

    public onChange(event: any): void {
        if (event && event.option && event.option.value) {
            this.item = event.option.value;
            this.inputFormControl.setValue(this.item);
            this.itemSelected.emit(this.item);
        }
    }

    public onFocus(): void {
        // force triggering a list refresh
        this.inputFormControl.setValue('');
    }

    public onReset(): void {
        this.inputFormControl.setValue(null);
    }

    public onBlur(): void {
        if (!this.inputAutocomplete.isOpen) {
            this.blur.emit();
            this.onRestore();
        }
        else {
            // tslint:disable-next-line:no-console
            console.debug('eq-m2o: autocomplete open ignoring blur');
        }
    }

    public onRestore(): void {
        if (this.item) {
            this.inputFormControl.setValue(this.item);
        }
        else {
            this.inputFormControl.setValue(null);
        }
    }

    public oncloseAutocomplete(): void {
        // #memo - input.onBlur is called before mat-autocomplete.onChange
        if (!this.inputFormControl.value || !this.item) {
            this.blur.emit();
        }
    }

}
