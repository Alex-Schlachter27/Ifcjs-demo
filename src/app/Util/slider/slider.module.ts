import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { RangeSliderModule } from '../range-slider/range-slider.module';
import { SliderComponent } from './slider.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatInputModule,
        MatSliderModule,
        RangeSliderModule
    ],
    exports: [SliderComponent],
    declarations: [
      SliderComponent,
    ],
    providers: [],
})
export class SliderModule { }
