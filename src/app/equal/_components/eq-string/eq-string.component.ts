import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  DoCheck, AfterViewInit, Renderer2
} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatFormField, MatHint} from "@angular/material/form-field";

@Component({
  selector: 'eq-string',
  templateUrl: './eq-string.component.html',
  styleUrls: ['./eq-string.component.scss']
})
export class EqStringComponent implements OnInit, DoCheck, AfterViewInit {

  @Input() defaultValue: string;

  public value: FormControl;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() placeholder: string = '';

  // * Disabled is used on edit mode for force the component to be disabled
  @Input() disabled: boolean = false;

  // * ContentEditable is used on edit mode for toggle the contentEditable property of the component
  public is_active: boolean = false;

  @Input() required: boolean = false;

  @Input() mode: 'view' | 'edit' = 'view';

  @Input() title?: string;

  @Input() hint?: string;

  @Input() size?: 'small' | 'normal' | 'large' = 'normal';

  @Input() error?: string;

  @ViewChild('eqString') eqString: ElementRef<HTMLDivElement>;
  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('matFormField') matFormField: ElementRef<Element>;
  @ViewChild('matHint') matHint: ElementRef<Element>;

  // constructor(
  //   // private changeDetectorRef: ChangeDetectorRef
  // ) {
  // }

  ngOnInit(): void {
    this.initFormControl();
  }

  ngDoCheck(): void {
    if (this.mode === 'view' || this.disabled) {
      this.value.disable();
    }

    if (this.mode === 'edit' && !this.disabled) {
      this.value.enable();
    }
  }

  public initFormControl(): void {
    this.value = new FormControl(this.defaultValue);

    if (this.required) {
      this.value.setValidators([
        Validators.required,
        Validators.minLength(1)
      ]);
    }
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
    return this.is_active && !this.disabled && this.mode === 'edit';
  }

  public onClear(event: MouseEvent): void {
    event.stopImmediatePropagation();
    event.preventDefault();
    this.updateValue('');
    this.value.markAsPending({onlySelf: true});
    this.input.nativeElement.focus();
  }

  public onEdit(): void {
    if (this.mode === 'edit' && !this.disabled
    ) {
      this.toggleActive(true);
      // this.changeDetectorRef.detectChanges();
      this.input.nativeElement.focus();
    }
  }

  public onCancel(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.updateValue(this.defaultValue);
    this.toggleActive(false);
  }

  public onSave(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.value.valid) {
      this.valueChange.emit(this.value.value);
      this.toggleActive(false);
    }
  }

  public onBlur(event: FocusEvent): void {
    event.preventDefault();
    console.log('blur');
    if (
      this.eqString.nativeElement instanceof Element &&
      !this.eqString.nativeElement.contains(event.relatedTarget as Node)
    ) {
      this.updateValue(this.defaultValue);
      this.toggleActive(false);
    }
  }

  private toggleActive(editable: boolean): void {
    this.is_active = editable;
    if (editable) {
      this.input.nativeElement.focus();
    }
  }

  constructor(private renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    this.setHintOverlay();
    console.log('ngAfterViewInit');
  }

  private setHintOverlay(): void {
    console.log(this.matHint);
    // if (
    //   this.matFormField._elementRef.nativeElement instanceof Element &&
    //   this.matHint._elementRef.nativeElement instanceof Element
    // ) {
    //   const matFormFieldWidth: number = this.matFormField.nativeElement.offsetWidth;
    //   const matHintWidth: number = this.matHint.nativeElement.scrollWidth;
    //
    //
    //   if (matHintWidth > matFormFieldWidth) {
    //     this.renderer.setProperty(this.matFormField.nativeElement, 'title', this.matHint.nativeElement.innerText);
    //   } else {
    //     this.renderer.removeAttribute(this.matFormField.nativeElement, 'title');
    //   }
    // }
  }

}
