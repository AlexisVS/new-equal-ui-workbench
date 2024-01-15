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
//Todo: add style for fixing content dimensions
// and add a button for validating the input
export class EqStringComponent implements OnInit, OnDestroy {

  @Input() defaultValue: string;

  public value: string = '';
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() placeholder: string = '';
  @Input() mode: 'view' | 'edit' = 'view';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;

  @Input() title?: string;

  @Input() hint?: string;
  @Input() size?: 'sm' | 'md' | 'lg' = 'md';

  @Input() error?: string;

  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  @ViewChild('formField') formField: ElementRef<HTMLDivElement>;


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
    // ! event.currentTarget can be another thing that an Element so we need to check with instanceof if it's an Element
    if (event.currentTarget instanceof Element && !event.currentTarget.contains(event.relatedTarget as Node)) {
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

  public isEditable(): boolean {
    return this.mode === 'edit';
  }


}
