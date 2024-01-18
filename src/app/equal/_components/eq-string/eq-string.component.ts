import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectorRef, OnChanges, SimpleChanges,
} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'eq-string',
  templateUrl: './eq-string.component.html',
  styleUrls: ['./eq-string.component.scss']
})
export class EqStringComponent implements OnInit, OnChanges {

  @Input() defaultValue: string;

  public value: FormControl;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() placeholder: string = '';

  // * Disabled is used on edit mode for force the component to be disabled
  @Input() disabled: boolean = true;

  // * ContentEditable is used on edit mode for toggle the contentEditable property of the component
  public contentEditable: boolean = false;

  @Input() required: boolean = false;

  @Input() mode: 'view' | 'edit' = 'view';

  @Input() title?: string;

  @Input() hint?: string;

  @Input() size?: 'small' | 'normal' | 'large' = 'normal';

  @Input() error?: string;

  @ViewChild('eqString') eqString: ElementRef<HTMLDivElement>;
  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('clearButton') clearButton: ElementRef<HTMLButtonElement>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.initFormControl();

    this.value.disable();
  }

  /**
   * Needed for the case where the component is disabled while in edit mode and content is edited,
   * because there is a style error on the input text color (it's stay black)
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.mode === 'edit' && changes?.disabled?.previousValue === false && changes?.disabled?.currentValue === true) {
      console.log(changes);
      this.toggleEditionMode(false);
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
    return this.contentEditable && !this.disabled && this.mode === 'edit';
  }

  public onClear(event: MouseEvent): void {
    event.stopImmediatePropagation();
    event.preventDefault();
    this.updateValue('');
    this.value.markAsPending({onlySelf: true});
    this.input.nativeElement.focus();
  }

  public onEdit(): void {
    if (this.mode === 'edit' && !this.disabled) {
      this.toggleEditionMode(true);
      this.changeDetectorRef.detectChanges();
      this.input.nativeElement.focus();
    }
  }

  public onCancel(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.updateValue(this.defaultValue);
    this.toggleEditionMode(false);
  }

  public onSave(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.value.valid) {
      this.valueChange.emit(this.value.value);
      this.toggleEditionMode(false);
    }
  }

  public onBlur(event: Event): void {
    this.toggleEditionMode(false);
    this.updateValue(this.defaultValue);
  }

  private toggleEditionMode(editable: boolean): void {
    this.contentEditable = editable;
    if (editable) {
      this.value.enable();
      this.input.nativeElement.focus();
    } else {
      this.value.disable();
    }
  }

  // public onFocusOut(event: FocusEvent): void {
  //   if (event.target instanceof Element && event.target.classList.contains('eq-string__action__clear')) {
  //     return;
  //   }
  //
  //   if (this.checkIfClickedOutside(event) || this.value.invalid) {
  //     this.disabled = true;
  //     this.updateValue(this.defaultValue);
  //     this.value.disable();
  //   }
  // }
  //
  // private checkIfClickedOutside(event: FocusEvent): boolean {
  //   return this.isEditable() &&
  //     this.eqString.nativeElement instanceof Element &&
  //     // * event.relatedTarget is not a Node, but it works like this
  //     !this.eqString.nativeElement.contains(event.relatedTarget as Node);
  // }
}
