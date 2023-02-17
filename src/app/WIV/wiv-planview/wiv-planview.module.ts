import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WivPlanviewerComponent } from './wiv-planview.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    WivPlanviewerComponent
  ],
  imports: [ 
    CommonModule,
    FormsModule,
    RouterModule.forChild([
        {
        path: '',
        component: WivPlanviewerComponent,
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
export class WivPlanviewerModule { }
