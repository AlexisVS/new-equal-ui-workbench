import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  OnDestroy
} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-eq-string',
  templateUrl: './eq-string.component.html',
  styleUrls: ['./eq-string.component.scss']
})
export class EqStringComponent implements OnInit, OnDestroy {

  // ? why not use value and valueChange ?
  @Input() defaultValue: string;

  public value: FormControl;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() placeholder: string = '';

  // ? For what purpose
  @Input() disabled: boolean = false;

  // ? How do you want validation ?
  @Input() required: boolean = false;

  @Input() title?: string;

  @Input() hint?: string;

  // ? how use this
  @Input() size?: 'sm' | 'md' | 'lg' = 'md';

  @Input() error?: string;

  @ViewChild('eqString') eqString: ElementRef<HTMLDivElement>;
  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('clearButton') clearButton: ElementRef<HTMLButtonElement>;
  public mode: 'view' | 'edit' = 'view';


  ngOnInit(): void {
    this.required
      ? this.value = new FormControl(this.defaultValue, [
        Validators.required,
        Validators.minLength(1)
      ])
      : this.value = new FormControl(this.defaultValue);

    this.value.disable();
  }

  ngOnDestroy(): void {
  }

  public updateValue(value: string): void {
    this.value.setValue(value);
  }

  public getErrorMessage(): string {
    if (this.error && this.value.invalid) {
      return this.error;
    }
    return '';
  }

  public onEdit(onEditEvent: MouseEvent): void {
    onEditEvent.preventDefault();
    onEditEvent.stopPropagation();
    if (this.mode === 'view') {
      this.mode = 'edit';
      this.value.enable();
      this.input.nativeElement.focus();
    }
  }

  public onFocusOut(event: FocusEvent): void {
    if (event.target instanceof Element && event.target.classList.contains('eq-string__clear')) {
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
      this.eqString.nativeElement instanceof Element &&
      // * event.relatedTarget is not a Node, but it works like this
      !this.eqString.nativeElement.contains(event.relatedTarget as Node);
  }

  public onClear(event: MouseEvent): void {
    event.stopImmediatePropagation();
    event.preventDefault();
    this.updateValue('');
    this.value.markAsUntouched({onlySelf: true});
    this.input.nativeElement.focus();
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

  public isEditable(): boolean {
    return this.mode === 'edit';
  }
}
