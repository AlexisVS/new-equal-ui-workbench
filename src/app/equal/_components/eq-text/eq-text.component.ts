import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-eq-text',
  templateUrl: './eq-text.component.html',
  styleUrls: ['./eq-text.component.scss']
})
export class EqTextComponent implements OnInit {
  // ? why not use value and valueChange ?
  @Input() defaultValue: string;

  public value: FormControl;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() placeholder: string = '';

  // // ? For what purpose
  // @Input() disabled: boolean = false;

  // ? How do you want validation ?
  @Input() required: boolean = false;

  @Input() title?: string;

  @Input() hint?: string = '';

  @Input() size?: 'small' | 'normal' | 'large' = 'normal';

  @Input() error?: string;

  @Input() rows?: number = 2;

  public mode: 'view' | 'edit' = 'view';

  @ViewChild('eqText') eqText: ElementRef<HTMLDivElement>;
  @ViewChild('textarea') textarea: ElementRef<HTMLTextAreaElement>;
  @ViewChild('clearButton') clearButton: ElementRef<HTMLButtonElement>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.initFormControl();

    this.value.disable();
  }

  public initFormControl(): void {
    this.required
      ? this.value = new FormControl(this.defaultValue, [
        Validators.required,
        Validators.minLength(1)
      ])
      : this.value = new FormControl(this.defaultValue);
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
    return this.mode === 'edit';
  }

  public setSize(): string {
    return `eq-text--${this.size}`;
  }

  public onEdit(onEditEvent: MouseEvent): void {
    if (this.mode === 'view') {
      this.mode = 'edit';
      this.value.enable();
      this.changeDetectorRef.detectChanges();
      this.textarea.nativeElement.focus();
    }
  }

  public onFocusOut(event: FocusEvent): void {
    if (event.target instanceof Element && event.target.classList.contains('eq-text__clear')) {
      return;
    }

    if (this.checkIfClickedOutside(event) || this.value.invalid) {
      this.mode = 'view';
      this.updateValue(this.defaultValue);
      this.value.disable();
    }
  }

  private checkIfClickedOutside(event: FocusEvent): boolean {
    return this.isEditable() &&
      this.eqText.nativeElement instanceof Element &&
      // * event.relatedTarget is not a Node, but it works like this
      !this.eqText.nativeElement.contains(event.relatedTarget as Node);
  }

  public onClear(event: MouseEvent): void {
    event.stopImmediatePropagation();
    event.preventDefault();
    this.updateValue('');
    this.value.markAsUntouched({onlySelf: true});
    this.textarea.nativeElement.focus();
  }

  public onSave(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.value.valid) {
      this.mode = 'view';
      this.valueChange.emit(this.value.value);
      this.value.disable();
    }
  }

  public isFocus(): boolean {
    if (document.activeElement) {
      return (this.isEditable() && this.eqText.nativeElement.contains(document.activeElement as Node));
    }

    return false;
  }
}
