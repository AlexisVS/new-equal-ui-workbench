import {NgModule} from '@angular/core';
import {EqualComponent} from './equal.component';
import {EqStringComponent} from './_components/eq-string/eq-string.component';
import {MatTabsModule} from '@angular/material/tabs';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EqTextComponent} from './_components/eq-text/eq-text.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {EqDateRangeComponent} from './_components/eq-date-range/eq-date-range.component';
import {EqDateTimeComponent} from './_components/eq-date-time/eq-date-time.component';
import {MatSelectModule} from '@angular/material/select';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {EqDateComponent} from './_components/eq-date/eq-date.component';
import {EqM2oComponent} from './_components/eq-m2o/eq-m2o.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
// @ts-ignore
import {SharedLibModule} from 'sb-shared-lib';

@NgModule({
    imports: [
        MatTabsModule,
        CommonModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        FormsModule,
        MatSelectModule,
        NgxMaterialTimepickerModule,
        MatAutocompleteModule,
        SharedLibModule
    ],
    declarations: [
        EqualComponent,
        EqStringComponent,
        EqTextComponent,
        EqDateComponent,
        EqDateTimeComponent,
        EqDateRangeComponent,
        EqM2oComponent,
    ],
    exports: [
        EqualComponent
    ]
})
export class EqualModule {
}
