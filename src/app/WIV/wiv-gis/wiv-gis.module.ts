import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WivGISComponent } from './wiv-gis.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    WivGISComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
        {
        path: '',
        component: WivGISComponent,
        }
    ]),
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    FlexLayoutModule
 ],
exports: [],
providers: [],
})
export class WivGISModule { }
