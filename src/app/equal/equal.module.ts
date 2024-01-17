import {NgModule} from '@angular/core';
import {InputTransformerModule} from './_components/input-transformer/input-transformer.module';
import {EqualComponent} from './equal.component';
import {EqStringComponent} from './_components/eq-string/eq-string.component';
import {MatTabsModule} from '@angular/material/tabs';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import { EqTextComponent } from './_components/eq-text/eq-text.component';

@NgModule({
  imports: [
    InputTransformerModule,
    MatTabsModule,
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  declarations: [
    EqualComponent,
    EqStringComponent,
    EqTextComponent
  ],
  exports: [
    InputTransformerModule,
    EqualComponent
  ]
})
export class EqualModule {
}
