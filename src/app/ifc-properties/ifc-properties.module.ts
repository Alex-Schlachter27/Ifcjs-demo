import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IfcPropertiesComponent } from './ifc-properties.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    IfcPropertiesComponent
  ],
  imports: [ 
    CommonModule,
    RouterModule.forChild([
        {
        path: '',
        component: IfcPropertiesComponent,
        }
    ]),
    MatButtonModule,
    MatIconModule,
 ],
exports: [],
providers: [],
})
export class IfcPropertiesModule { }
