import {NgModule} from '@angular/core';
import {EqualComponent} from './equal.component';
import {EqStringComponent} from './_components/eq-string/eq-string.component';
import {MatTabsModule} from '@angular/material/tabs';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { EqTextComponent } from './_components/eq-text/eq-text.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {EqDateModule} from './_components/eq-date/eq-date.module';
import { EqDateRangeComponent } from './_components/eq-date-range/eq-date-range.component';
import { EqDateTimeComponent } from './_components/eq-date-time/eq-date-time.component';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  imports: [
    MatTabsModule,
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    EqDateModule,
    FormsModule,
    MatSelectModule
  ],
    declarations: [
        EqualComponent,
        EqStringComponent,
        EqTextComponent,
        EqDateRangeComponent,
        EqDateTimeComponent,
        EqTextComponent,
    ],
  exports: [
    EqualComponent
  ]
})
export class EqualModule {
}
