import {
  Component, ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output, ViewChild,
  ChangeDetectorRef, OnDestroy
} from '@angular/core';

@Component({
  selector: 'app-eq-string',
  templateUrl: './eq-string.component.html',
  styleUrls: ['./eq-string.component.scss']
})
export class EqStringComponent implements OnInit, OnDestroy {

  // ? why not use value and valueChange ?
  @Input() defaultValue: string;

  public value: string = '';
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() placeholder: string = '';
  @Input() mode: 'view' | 'edit' = 'view';

  // ? For what purpose
  @Input() disabled: boolean = false;

  // ? How do you want validation ?
  @Input() required: boolean = false;


  @Input() title?: string;

  @Input() hint?: string;

  // ? how use this
  @Input() size?: 'sm' | 'md' | 'lg' = 'md';

  @Input() error?: string;

  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  @ViewChild('eqString') eqString: ElementRef<HTMLDivElement>;


  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.value = this.defaultValue;
  }

  ngOnDestroy(): void {
  }


  public onEdit(onEditEvent: MouseEvent): void {
    onEditEvent.preventDefault();
    if (this.mode === 'view') {
      this.mode = 'edit';
      this.changeDetectorRef.detectChanges();
      this.input.nativeElement.focus();
    }
  }

  public onFocusOut(event: FocusEvent): void {
    if (
      this.eqString.nativeElement instanceof Element
      // * event.relatedTarget is not a Node if try instanceof but works like this
      && !this.eqString.nativeElement.contains(event.relatedTarget as Node)
    ) {
      this.mode = 'view';
      this.value = this.defaultValue;
      this.input.nativeElement.value = this.defaultValue;
    }
  }

  public onClear(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.value = this.defaultValue;
    this.input.nativeElement.value = this.defaultValue;
  }

  public onSave(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.value = this.input.nativeElement.value;
    this.valueChange.emit(this.value);
    this.mode = 'view';
  }

  public isEditable(): boolean {
    return this.mode === 'edit';
  }
}
