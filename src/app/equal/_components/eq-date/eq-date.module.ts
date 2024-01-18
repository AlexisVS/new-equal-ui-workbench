import {NgModule} from '@angular/core';
import {EqDateComponent} from './eq-date.component';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    EqDateComponent
  ],
  exports: [
    EqDateComponent
  ],
  providers: [

  ]
})
export class EqDateModule {
}
